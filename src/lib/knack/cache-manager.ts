/**
 * Server-Side Cache Manager
 * Wraps KnackCacheOptimizer with helper functions for API routes
 */

import { KnackCacheOptimizer } from './cache';

// Singleton instance shared across all API routes
const cache = new KnackCacheOptimizer();

/**
 * Generic cache wrapper for async functions
 * Automatically handles cache hits/misses and TTL
 *
 * @param key - Unique cache key
 * @param fetchFn - Function that fetches fresh data
 * @param ttlSeconds - Time to live in seconds (default: 5 minutes)
 * @returns Cached or fresh data
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try cache first
  const cached = cache.getCached<T>(key);
  if (cached) {
    console.log(`✅ Cache HIT: ${key}`);
    return cached;
  }

  // Cache miss - fetch and store
  console.log(`❌ Cache MISS: ${key} - fetching from Knack API`);
  const data = await fetchFn();
  cache.cacheResults(key, data, ttlSeconds);
  return data;
}

/**
 * Invalidate specific cache entry
 * Use when data is mutated (POST/PUT/DELETE operations)
 */
export function invalidateCache(key: string): void {
  console.log(`🗑️ Cache INVALIDATE: ${key}`);
  cache.clearCache(key);
}

/**
 * Clear all cached data
 * Use sparingly - only for admin operations
 */
export function clearAllCache(): void {
  console.log('🗑️ Cache CLEAR ALL');
  cache.clearAllCache();
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
  return cache.getCacheStats();
}

/**
 * Handle rate limiting before making Knack API calls
 * Ensures we stay under 10 req/sec limit
 */
export async function handleRateLimit(): Promise<void> {
  return cache.handleRateLimit();
}

/**
 * Retry logic with exponential backoff
 * Use for critical API calls that must succeed
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  return cache.retryWithBackoff(fn, maxRetries, baseDelay);
}

/**
 * Cache key factory for consistent naming
 * Prevents typos and makes invalidation easier
 */
export const cacheKeys = {
  metrics: 'api:metrics:v1',
  devices: 'api:devices:all',
  devicesPaginated: (page: number, limit: number, status?: string) =>
    `api:devices:page:${page}:limit:${limit}:status:${status || 'all'}`,
  partnerships: (filter: string = 'all') => `api:partnerships:${filter}`,
  recipients: (filter: string = 'all') => `api:recipients:${filter}`,
  partners: 'api:partners:all',
  donations: 'api:donations:all',
  activity: 'api:activity:recent',
  organizations: 'api:organizations:all',
};

/**
 * Export the cache instance for advanced use cases
 */
export { cache };
