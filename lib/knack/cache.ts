/**
 * Skill 6: knack_cache_optimizer
 * Caches results and enforces rate limits
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class KnackCacheOptimizer {
  private cache: Map<string, CacheEntry<any>>;
  private requestQueue: number[];
  private readonly maxRequestsPerSecond = 10;

  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
  }

  /**
   * Cache results with TTL
   */
  cacheResults<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  /**
   * Get cached results if valid
   */
  getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Clear specific cache entry
   */
  clearCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Handle rate limits (10 requests per second)
   * Returns delay in milliseconds before request can be made
   */
  async handleRateLimit(): Promise<void> {
    const now = Date.now();

    // Remove requests older than 1 second
    this.requestQueue = this.requestQueue.filter(
      timestamp => now - timestamp < 1000
    );

    // If we've hit the limit, wait
    if (this.requestQueue.length >= this.maxRequestsPerSecond) {
      const oldestRequest = this.requestQueue[0];
      const waitTime = 1000 - (now - oldestRequest) + 50; // Add 50ms buffer
      await this.sleep(waitTime);

      // Clean queue again after waiting
      const newNow = Date.now();
      this.requestQueue = this.requestQueue.filter(
        timestamp => newNow - timestamp < 1000
      );
    }

    // Add current request to queue
    this.requestQueue.push(Date.now());
  }

  /**
   * Exponential backoff for retries
   */
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.handleRateLimit();
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Retry attempt ${attempt + 1} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
      })),
    };
  }
}
