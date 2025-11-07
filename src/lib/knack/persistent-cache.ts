/**
 * Persistent File-Based Cache for Knack Data
 * Survives server restarts and dramatically reduces API calls
 *
 * Strategy: Cache everything aggressively, serve stale data when needed
 */

import { promises as fs } from 'fs'
import path from 'path'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

interface CacheMetadata {
  totalEntries: number
  oldestEntry: number
  newestEntry: number
  totalSize: number
}

const CACHE_DIR = path.join(process.cwd(), '.cache', 'knack')
const METADATA_FILE = path.join(CACHE_DIR, '_metadata.json')

export class PersistentKnackCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map()
  private initialized = false

  /**
   * Initialize cache directory and load existing cache into memory
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Ensure cache directory exists
      await fs.mkdir(CACHE_DIR, { recursive: true })

      // Load all cache files into memory
      const files = await fs.readdir(CACHE_DIR)

      for (const file of files) {
        if (file === '_metadata.json' || !file.endsWith('.json')) continue

        try {
          const filePath = path.join(CACHE_DIR, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const entry = JSON.parse(content) as CacheEntry<any>

          // Only load if not expired
          const age = Date.now() - entry.timestamp
          if (age < entry.ttl) {
            this.memoryCache.set(entry.key, entry)
          } else {
            // Delete expired cache file
            await fs.unlink(filePath).catch(() => {})
          }
        } catch (error) {
          console.warn(`Failed to load cache file ${file}:`, error)
        }
      }

      console.log(`✅ Loaded ${this.memoryCache.size} cached entries from disk`)
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize persistent cache:', error)
      this.initialized = true // Continue anyway with empty cache
    }
  }

  /**
   * Get cached data (memory-first, then disk)
   * Returns stale data if available, even if expired
   */
  async get<T>(key: string, allowStale = true): Promise<{ data: T; isStale: boolean } | null> {
    await this.initialize()

    // Check memory cache first
    const memEntry = this.memoryCache.get(key)
    if (memEntry) {
      const age = Date.now() - memEntry.timestamp
      const isStale = age > memEntry.ttl

      if (!isStale || allowStale) {
        return { data: memEntry.data as T, isStale }
      }
    }

    // Check disk cache if not in memory
    try {
      const filePath = this.getCacheFilePath(key)
      const content = await fs.readFile(filePath, 'utf-8')
      const entry = JSON.parse(content) as CacheEntry<T>

      const age = Date.now() - entry.timestamp
      const isStale = age > entry.ttl

      // Load into memory
      this.memoryCache.set(key, entry)

      if (!isStale || allowStale) {
        return { data: entry.data, isStale }
      }
    } catch (error) {
      // Cache miss
      return null
    }

    return null
  }

  /**
   * Set cached data (writes to both memory and disk)
   */
  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    await this.initialize()

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      key,
    }

    // Store in memory
    this.memoryCache.set(key, entry)

    // Write to disk asynchronously (don't block)
    this.writeToDisk(entry).catch(error => {
      console.error(`Failed to write cache to disk for key ${key}:`, error)
    })
  }

  /**
   * Write cache entry to disk
   */
  private async writeToDisk<T>(entry: CacheEntry<T>): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(entry.key)
      await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8')
    } catch (error) {
      throw error
    }
  }

  /**
   * Get file path for cache key
   */
  private getCacheFilePath(key: string): string {
    // Sanitize key for filesystem
    const sanitized = key.replace(/[^a-zA-Z0-9-_:]/g, '_')
    return path.join(CACHE_DIR, `${sanitized}.json`)
  }

  /**
   * Clear specific cache entry
   */
  async clear(key: string): Promise<void> {
    this.memoryCache.delete(key)

    try {
      const filePath = this.getCacheFilePath(key)
      await fs.unlink(filePath)
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear()

    try {
      const files = await fs.readdir(CACHE_DIR)
      await Promise.all(
        files
          .filter(f => f.endsWith('.json'))
          .map(f => fs.unlink(path.join(CACHE_DIR, f)).catch(() => {}))
      )
    } catch (error) {
      console.error('Failed to clear cache directory:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheMetadata> {
    await this.initialize()

    const entries = Array.from(this.memoryCache.values())

    return {
      totalEntries: entries.length,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0,
      totalSize: entries.reduce((sum, e) => sum + JSON.stringify(e.data).length, 0),
    }
  }

  /**
   * Prune expired entries
   */
  async pruneExpired(): Promise<number> {
    await this.initialize()

    const now = Date.now()
    let prunedCount = 0

    for (const [key, entry] of this.memoryCache.entries()) {
      const age = now - entry.timestamp
      if (age > entry.ttl) {
        await this.clear(key)
        prunedCount++
      }
    }

    return prunedCount
  }
}

// Singleton instance
let persistentCache: PersistentKnackCache | null = null

export function getPersistentCache(): PersistentKnackCache {
  if (!persistentCache) {
    persistentCache = new PersistentKnackCache()
  }
  return persistentCache
}

/**
 * Wrapper function for API routes to use persistent cache with stale-while-revalidate
 */
export async function getCachedOrStale<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 1800 // 30 minutes default
): Promise<T> {
  const cache = getPersistentCache()

  // Try to get cached data (including stale)
  const cached = await cache.get<T>(key, true)

  if (cached) {
    if (cached.isStale) {
      console.log(`⚠️  Cache STALE: ${key} - serving stale data and revalidating in background`)

      // Revalidate in background (don't await)
      fetchFn()
        .then(freshData => cache.set(key, freshData, ttlSeconds))
        .catch(error => {
          console.error(`Background revalidation failed for ${key}:`, error)
        })

      // Return stale data immediately
      return cached.data
    } else {
      console.log(`✅ Cache HIT: ${key} (fresh)`)
      return cached.data
    }
  }

  // Cache miss - fetch fresh data
  console.log(`❌ Cache MISS: ${key} - fetching from Knack API`)

  try {
    const freshData = await fetchFn()
    await cache.set(key, freshData, ttlSeconds)
    return freshData
  } catch (error) {
    console.error(`Failed to fetch ${key}:`, error)
    throw error
  }
}
