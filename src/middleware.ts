/**
 * API Route Protection Middleware
 * Enforces authentication and rate limiting on sensitive endpoints
 *
 * SECURITY FEATURES:
 * - API key validation for protected routes
 * - Rate limiting by IP address
 * - Security headers on all responses
 * - No information leakage in error messages
 * - Constant-time string comparison to prevent timing attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, extractApiKey, logSecurityEvent } from '@/lib/auth/api-key-validator';
import { checkRateLimit, getClientIp, getRateLimitStatus as getRateLimitStatusFromLib } from '@/lib/auth/rate-limiter';
import {
  ROUTE_PROTECTION,
  SECURITY_HEADERS,
  getRequiredKeyTypeForRoute,
  getApiKeyByType,
  getRateLimitConfigForRoute,
  isProtectedRoute,
} from '@/lib/auth/security-config';

// Paths that should bypass middleware
const BYPASS_PATHS = [
  /^\/_next\//,
  /^\/static\//,
  /\.jpg$/i,
  /\.png$/i,
  /\.gif$/i,
  /\.svg$/i,
  /\.css$/i,
  /\.js$/i,
];

/**
 * Middleware to protect API routes and enforce security policies
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and non-API routes
  if (shouldBypassMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (isProtectedRoute(pathname)) {
    return await protectRoute(request);
  }

  // For other routes, just add security headers
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

/**
 * Protect a single API route with auth and rate limiting
 */
async function protectRoute(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);
  const providedKey = extractApiKey(request);

  // Step 1: Check rate limit first (before auth to prevent info leakage)
  const rateLimitConfig = getRateLimitConfigForRoute(pathname);
  if (rateLimitConfig) {
    if (!checkRateLimit(clientIp, rateLimitConfig)) {
      const status = getRateLimitStatus(clientIp, rateLimitConfig);
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        path: pathname,
        ip: clientIp,
        retryAfter: status.retryAfter,
      });
      return createMiddlewareRateLimitResponse(status.retryAfter);
    }
  }

  // Step 2: Validate authentication
  const requiredKeyType = getRequiredKeyTypeForRoute(pathname);
  if (requiredKeyType) {
    const expectedKey = getApiKeyByType(requiredKeyType);

    if (!(await validateApiKey(providedKey, expectedKey))) {
      // Log failed auth attempt (without exposing the actual key)
      logSecurityEvent('AUTH_FAILURE', {
        path: pathname,
        ip: clientIp,
        method: request.method,
      }, providedKey || undefined);

      return createUnauthorizedResponse('Invalid or missing API key');
    }

    // Log successful auth
    console.log(`[AUTH_SUCCESS] ${request.method} ${pathname} from ${clientIp}`);
  }

  // Step 3: Request is authorized - proceed
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * Check if path should bypass middleware
 */
function shouldBypassMiddleware(pathname: string): boolean {
  return BYPASS_PATHS.some((pattern) => pattern.test(pathname));
}

/**
 * Create unauthorized response - doesn't leak information
 */
function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS,
      },
    }
  );
}

/**
 * Get rate limit status (helper)
 */
function getRateLimitStatus(clientId: string, config: any) {
  return getRateLimitStatusFromLib(clientId, config);
}

/**
 * Create rate limit response that returns NextResponse
 * Wraps the Response from rate-limiter into NextResponse
 */
function createMiddlewareRateLimitResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      retryAfter,
      timestamp: new Date().toISOString(),
    },
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        ...SECURITY_HEADERS,
      },
    }
  );
}

/**
 * Configure which routes the middleware applies to
 * This pattern controls where middleware runs
 */
export const config = {
  matcher: [
    // Protect all API routes
    '/api/:path*',
    // Protect admin routes
    '/admin/:path*',
    // Protect cron routes
    '/api/cron/:path*',
  ],
};
