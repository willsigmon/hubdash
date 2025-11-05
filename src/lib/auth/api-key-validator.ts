/**
 * API Key Validation Utility
 * Provides secure API key validation for protected endpoints
 *
 * SECURITY NOTES:
 * - Never log full API keys
 * - Always validate against environment variables
 * - Use constant-time comparison to prevent timing attacks
 */

import { hash, verify } from 'crypto';

interface ApiKeyConfig {
  adminKey?: string;
  syncKey?: string;
}

/**
 * Validate API key against configured keys
 * Uses constant-time comparison to prevent timing attacks
 */
export async function validateApiKey(
  providedKey: string | null | undefined,
  expectedKey: string | undefined
): Promise<boolean> {
  // Both must be present
  if (!providedKey || !expectedKey) {
    return false;
  }

  // Prevent empty strings
  if (providedKey.trim() === '' || expectedKey.trim() === '') {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  // This prevents attackers from guessing keys character-by-character
  return constantTimeCompare(providedKey, expectedKey);
}

/**
 * Constant-time string comparison
 * Prevents timing attacks by always comparing full strings
 */
function constantTimeCompare(a: string, b: string): boolean {
  const aLength = a.length;
  const bLength = b.length;

  // Length mismatch immediately returns false (timing-safe)
  let result = aLength === bLength ? 0 : 1;

  // Compare all characters even if lengths differ
  const minLength = Math.min(aLength, bLength);
  for (let i = 0; i < minLength; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Extract API key from request headers
 * Supports: Authorization: Bearer <key> or X-API-Key header
 */
export function extractApiKey(request: Request): string | null {
  // Check Authorization header (Bearer token format)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // Check X-API-Key header (common API key format)
  const apiKeyHeader = request.headers.get('X-API-Key');
  if (apiKeyHeader) {
    return apiKeyHeader.trim();
  }

  return null;
}

/**
 * Validate API key from request
 * Returns true if key is valid, false otherwise
 */
export async function validateRequestApiKey(
  request: Request,
  expectedKey: string | undefined
): Promise<boolean> {
  const providedKey = extractApiKey(request);
  return validateApiKey(providedKey, expectedKey);
}

/**
 * Safe error response - doesn't leak sensitive information
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized') {
  return new Response(
    JSON.stringify({
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Safe forbidden response
 */
export function createForbiddenResponse(message: string = 'Forbidden') {
  return new Response(
    JSON.stringify({
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Log security event without exposing sensitive data
 * Use this instead of logging full API keys
 */
export function logSecurityEvent(
  eventType: string,
  details: Record<string, any>,
  providedKey?: string
) {
  // Mask the key for logging
  const maskedKey = providedKey ? `${providedKey.slice(0, 4)}...${providedKey.slice(-4)}` : 'none';

  console.warn(`[SECURITY] ${eventType}`, {
    ...details,
    keyPrefix: maskedKey,
    timestamp: new Date().toISOString(),
  });
}
