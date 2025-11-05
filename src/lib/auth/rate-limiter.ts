/**
 * Simple In-Memory Rate Limiter
 * Tracks requests by IP address to prevent abuse
 *
 * SECURITY NOTES:
 * - This is an in-memory implementation suitable for single-server deployments
 * - For distributed systems (Vercel), use Redis-based rate limiting
 * - Automatically cleans up old entries to prevent memory leaks
 * - Uses IP address as identifier (falls back to "unknown" if unavailable)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiterConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
  keyPrefix?: string; // Optional prefix for rate limit keys
}

// Global rate limit store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (runs every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Start automatic cleanup
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    cleanupExpiredEntries();
  }, CLEANUP_INTERVAL);
}

/**
 * Get client IP address from request
 * Handles both direct connections and proxied requests
 */
export function getClientIp(request: Request): string {
  // Check for X-Forwarded-For (Vercel, proxies)
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) {
    // Take the first IP if multiple are present
    return forwardedFor.split(',')[0].trim();
  }

  // Check for X-Real-IP (nginx)
  const realIp = request.headers.get('X-Real-IP');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to "unknown"
  return 'unknown';
}

/**
 * Create rate limit key from client identifier
 */
function createRateLimitKey(clientId: string, keyPrefix?: string): string {
  const prefix = keyPrefix ? `${keyPrefix}:` : '';
  return `ratelimit:${prefix}${clientId}`;
}

/**
 * Check if request is within rate limit
 * Returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  clientId: string,
  config: RateLimiterConfig
): boolean {
  const key = createRateLimitKey(clientId, config.keyPrefix);
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetTime) {
    // Create new window
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return true;
  }

  // Check if within limit
  if (entry.count < config.maxRequests) {
    entry.count++;
    return true;
  }

  // Rate limit exceeded
  return false;
}

/**
 * Get rate limit status for a client
 */
export function getRateLimitStatus(
  clientId: string,
  config: RateLimiterConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number; // Seconds
} {
  const key = createRateLimitKey(clientId, config.keyPrefix);
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetTime) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      retryAfter: 0,
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

  return {
    allowed: remaining > 0,
    remaining,
    resetTime: entry.resetTime,
    retryAfter,
  };
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}

/**
 * Reset rate limit for a specific client
 * Useful for testing or manual admin resets
 */
export function resetRateLimit(clientId: string, keyPrefix?: string): void {
  const key = createRateLimitKey(clientId, keyPrefix);
  rateLimitStore.delete(key);
}

/**
 * Clean up expired rate limit entries
 * Prevents memory leaks in long-running processes
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[RATE_LIMITER] Cleaned up ${cleaned} expired entries`);
  }
}

/**
 * Get rate limiter statistics (for monitoring)
 */
export function getRateLimiterStats(): {
  activeEntries: number;
  memoryUsage: string;
} {
  return {
    activeEntries: rateLimitStore.size,
    memoryUsage: `~${(rateLimitStore.size * 100 / 1024).toFixed(2)} KB`, // Rough estimate
  };
}
