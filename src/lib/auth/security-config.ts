/**
 * Security Configuration
 * Centralized security settings for the application
 *
 * API Key Management:
 * - Generate unique API keys for each service/role
 * - Store keys securely in environment variables
 * - Rotate keys regularly
 * - Never commit keys to version control
 *
 * Environment Variables Required:
 * - API_KEY_SYNC: Key for /api/sync endpoint
 * - API_KEY_ADMIN: Key for /admin endpoint and sensitive operations
 */

/**
 * Route Protection Configuration
 * Defines which routes require authentication and their rate limits
 */
export const ROUTE_PROTECTION = {
  // Sync endpoints (moderate rate limit - 10 requests per hour)
  '/api/sync': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'sync',
    },
  },

  // Cron endpoints (strict rate limit - 5 requests per hour)
  '/api/cron/sync': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'cron',
    },
  },

  // Admin endpoints (strict rate limit - 5 requests per hour)
  '/admin': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'admin',
    },
  },

  // Device mutations (POST, PATCH, DELETE)
  'POST /api/devices': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'device-write',
    },
  },

  'PATCH /api/devices/[id]': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'device-write',
    },
  },

  'DELETE /api/devices/[id]': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'device-delete',
    },
  },

  // Donation mutations
  'POST /api/donations': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'donation-write',
    },
  },

  // Activity log mutations
  'POST /api/activity': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'activity',
    },
  },

  // Public endpoints (no auth required)
  'GET /api/metrics': {
    requiresAuth: false,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'public-metrics',
    },
  },

  'GET /api/devices': {
    requiresAuth: false,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'public-devices',
    },
  },

  'GET /api/donations': {
    requiresAuth: false,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'public-donations',
    },
  },

  'GET /api/partners': {
    requiresAuth: false,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'public-partners',
    },
  },

  'GET /api/activity': {
    requiresAuth: false,
    rateLimitConfig: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyPrefix: 'public-activity',
    },
  },
};

/**
 * API Key Types
 * Different keys for different purposes
 */
export enum ApiKeyType {
  SYNC = 'SYNC',
  ADMIN = 'ADMIN',
  CRON = 'CRON', // For scheduled jobs
}

/**
 * Get API key from environment based on type
 */
export function getApiKeyByType(type: ApiKeyType): string | undefined {
  switch (type) {
    case ApiKeyType.SYNC:
      return process.env.API_KEY_SYNC;
    case ApiKeyType.ADMIN:
      return process.env.API_KEY_ADMIN;
    case ApiKeyType.CRON:
      return process.env.API_KEY_CRON || process.env.API_KEY_SYNC; // Fall back to sync key
    default:
      return undefined;
  }
}

/**
 * Determine which API key type is required for a route
 */
export function getRequiredKeyTypeForRoute(route: string): ApiKeyType | null {
  if (route.includes('/admin')) {
    return ApiKeyType.ADMIN;
  }
  if (route.includes('/cron')) {
    return ApiKeyType.CRON;
  }
  if (route.includes('/sync')) {
    return ApiKeyType.SYNC;
  }
  return null;
}

/**
 * Security Headers Configuration
 * Headers to send with all responses
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Require HTTPS (only if in production)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Prevent sensitive data in logs
  'X-Content-Security-Policy': "default-src 'self'",
};

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(route: string): boolean {
  for (const [routePattern, config] of Object.entries(ROUTE_PROTECTION)) {
    if (matchRoute(route, routePattern)) {
      return config.requiresAuth;
    }
  }
  return false;
}

/**
 * Get rate limit config for a route
 */
export function getRateLimitConfigForRoute(route: string) {
  for (const [routePattern, config] of Object.entries(ROUTE_PROTECTION)) {
    if (matchRoute(route, routePattern)) {
      return config.rateLimitConfig;
    }
  }
  return null;
}

/**
 * Simple route matching
 * Supports exact matches and wildcard patterns
 */
function matchRoute(route: string, pattern: string): boolean {
  // Extract just the path part (remove query strings)
  const routePath = route.split('?')[0];

  // Exact match
  if (routePath === pattern) {
    return true;
  }

  // Wildcard match (e.g., /api/devices/[id] matches /api/devices/123)
  const patternRegex = pattern
    .replace(/\[.*?\]/g, '[^/]+') // Replace [id] with regex
    .replace(/\//g, '\\/'); // Escape forward slashes

  return new RegExp(`^${patternRegex}$`).test(routePath);
}

/**
 * Generate a strong API key
 * Use this to generate keys for storage in environment variables
 */
export function generateApiKey(prefix: string = 'sk'): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hexString = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}_${hexString}`;
}
