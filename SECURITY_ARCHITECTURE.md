# Security Architecture - HubDash

Visual representation of security implementation and request flow.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│  Browser / CLI / External Service                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP Request
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    NEXT.JS MIDDLEWARE                          │
│              (src/middleware.ts)                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Check if route requires authentication                │ │
│  │    (ROUTE_PROTECTION config)                            │ │
│  └───────────────────┬───────────────────────────────────────┘ │
│                      │                                          │
│                      ├─ NO AUTH REQUIRED ────────┐             │
│                      │                           │             │
│                      └─ AUTH REQUIRED ─────┬──────┐            │
│                                            │      │            │
│  ┌─────────────────────────────────────────▼──┐   │           │
│  │ 2. Rate Limit Check                        │   │           │
│  │    (rate-limiter.ts)                       │   │           │
│  │    - Get client IP                         │   │           │
│  │    - Check if under limit                  │   │           │
│  │    - Increment counter                     │   │           │
│  └──────────────┬──────────────────────────────┘   │           │
│                 │                                  │           │
│         ┌───────┴────────┐                        │           │
│         │                │                        │           │
│    LIMIT OK         LIMIT EXCEEDED               │           │
│         │                │                        │           │
│         │          Return 429                    │           │
│         │                                         │           │
│  ┌──────▼────────────────────────────────────────┐│           │
│  │ 3. API Key Validation (if required)           ││           │
│  │    (api-key-validator.ts)                     ││           │
│  │    - Extract from Authorization header        ││           │
│  │    - Constant-time comparison                 ││           │
│  │    - Validate against env var                 ││           │
│  └──────┬─────────────────────────────────────────┘│           │
│         │                                          │           │
│     ┌───┴────┐                                    │           │
│     │        │                                    │           │
│   VALID    INVALID                               │           │
│     │        │                                    │           │
│     │     Return 401                             │           │
│     │                                            │           │
│  ┌──▼──────────────────────────────────────────────┐           │
│  │ 4. Add Security Headers                         │           │
│  │    - X-Frame-Options: DENY                      │           │
│  │    - X-Content-Type-Options: nosniff            │           │
│  │    - Strict-Transport-Security                  │           │
│  │    - Referrer-Policy                            │           │
│  └──────┬─────────────────────────────────────────┘           │
│         │                                         ◄─────────────┘
│         │ Next Response (pass-through)                         │
└─────────┼─────────────────────────────────────────┐            │
          │                                         │            │
          ▼                                         │            │
┌─────────────────────────────────────────────────┐ │            │
│         API ROUTE HANDLER                       │ │            │
│  (src/app/api/*/route.ts)                      │ │            │
│                                                 │ │            │
│  - Auth already verified by middleware         │ │            │
│  - Rate limit already checked                  │ │            │
│  - Safe to process request                     │ │            │
│                                                 │ │            │
│  1. Parse request body                         │ │            │
│  2. Query database / Call external API        │ │            │
│  3. Return response                            │ │            │
│                                                 │ │            │
│  Error? → Generic error message only          │ │            │
│  Success? → Return data with headers           │ │            │
└────────┬────────────────────────────────────────┘ │            │
         │                                          │            │
         │ Response (with security headers)        │            │
         │                                          │            │
└─────────┼──────────────────────────────────────────┼────────────┘
          │                                          │
          │                                          │
          ▼                                          ▼
      CLIENT                                   SERVER LOGS
      (Response)              [SECURITY] AUTH_FAILURE: path=/api/sync
                              [RATE_LIMITER] Cleaned up 5 entries
                              [AUTH_SUCCESS] GET /api/metrics from 192.168.1.1
```

---

## Request Classification

```
REQUEST FLOW DECISION TREE

Is this a request to /api/*, /admin/*, or /api/cron/* ?
│
├─ NO → Pass through (static files, other routes)
│
└─ YES → Check ROUTE_PROTECTION config
   │
   ├─ route.requiresAuth = true
   │  │
   │  ├─ 1. Rate limit check
   │  │  │
   │  │  ├─ OVER LIMIT → 429 Too Many Requests
   │  │  │
   │  │  └─ UNDER LIMIT → Continue to step 2
   │  │
   │  ├─ 2. API key validation
   │  │  │
   │  │  ├─ NO KEY PROVIDED → 401 Unauthorized
   │  │  │
   │  │  ├─ KEY INVALID → 401 Unauthorized
   │  │  │
   │  │  └─ KEY VALID → Continue to step 3
   │  │
   │  └─ 3. Add security headers & pass to route
   │
   └─ route.requiresAuth = false
      │
      ├─ 1. Rate limit check (still applies)
      │  │
      │  ├─ OVER LIMIT → 429 Too Many Requests
      │  │
      │  └─ UNDER LIMIT → Continue to step 2
      │
      └─ 2. Add security headers & pass to route
```

---

## Authentication Flow

```
CLIENT REQUEST
│
└─ GET /api/sync
   Headers: Authorization: Bearer sk_abc123...
   │
   ┌─────────────────────────────────────────┐
   │ MIDDLEWARE (src/middleware.ts)          │
   └─────────────────────────────────────────┘
   │
   ├─ Extract API key from Authorization header
   │  ├─ Try "Authorization: Bearer <key>" format
   │  ├─ Try "X-API-Key: <key>" format
   │  └─ If not found → PROVIDED_KEY = null
   │
   ├─ Get expected key from environment
   │  └─ expectedKey = process.env.API_KEY_SYNC
   │
   ├─ Constant-time comparison
   │  ├─ if providedKey === expectedKey (timing-safe)
   │  │  ├─ LENGTH MATCH → Check characters
   │  │  │  └─ ALL MATCH → VALID ✓
   │  │  └─ ALL MATCH → VALID ✓
   │  │
   │  └─ if NOT MATCH → INVALID ✗
   │
   ├─ Log security event (with masked key)
   │  └─ [SECURITY] AUTH_FAILURE: key_prefix=sk_abc..., path=/api/sync
   │
   └─ Return 401 Unauthorized (if invalid)
      └─ Response:
         {
           "error": "Invalid or missing API key",
           "timestamp": "2025-11-04T..."
         }
```

---

## Rate Limiting Flow

```
INCOMING REQUEST FROM 192.168.1.100
│
├─ Create rate limit key: "ratelimit:sync:192.168.1.100"
│
├─ Check if key exists in store
│  │
│  ├─ KEY EXISTS
│  │  ├─ Check: current_time >= reset_time?
│  │  │  │
│  │  │  ├─ YES → Create new window
│  │  │  │        { count: 1, resetTime: now + 1hr }
│  │  │  │        ALLOW REQUEST ✓
│  │  │  │
│  │  │  └─ NO → Continue in same window
│  │  │        Check: count < maxRequests?
│  │  │        │
│  │  │        ├─ YES → count++
│  │  │        │        ALLOW REQUEST ✓
│  │  │        │
│  │  │        └─ NO → DENY REQUEST ✗
│  │  │               Return 429 Too Many Requests
│  │
│  └─ KEY NOT EXISTS
│     └─ Create new window
│        { count: 1, resetTime: now + 1hr }
│        ALLOW REQUEST ✓
│
└─ Add cleanup task
   (Periodically remove expired entries)
```

---

## Route Protection Matrix

```
ENDPOINT                  AUTH REQUIRED   RATE LIMIT      KEY TYPE
─────────────────────────────────────────────────────────────────
GET  /api/metrics         NO              100/hr          (public)
GET  /api/devices         NO              100/hr          (public)
POST /api/devices         YES             30/hr           SYNC
GET  /api/donations       NO              100/hr          (public)
POST /api/donations       YES             30/hr           SYNC
PATCH /api/devices/:id    YES             30/hr           SYNC
DELETE /api/devices/:id   YES             20/hr           SYNC
POST /api/activity        YES             100/hr          SYNC
GET  /api/activity        NO              100/hr          (public)
GET  /api/partners        NO              100/hr          (public)
GET  /api/sync            YES             10/hr           SYNC
POST /api/sync            YES             10/hr           SYNC
GET  /api/cron/sync       YES             5/hr            CRON
POST /api/cron/sync       YES             5/hr            CRON
     /admin/*             YES             5/hr            ADMIN

NOTES:
- RATE LIMIT applies even if NO AUTH REQUIRED (defense in depth)
- Each IP address has separate counters
- SYNC key used for most endpoints
- ADMIN key for administrative operations
- CRON key optional (falls back to SYNC if not set)
```

---

## Security Headers

```
EVERY RESPONSE INCLUDES:

Header                              Value
─────────────────────────────────────────────────────────────
X-Frame-Options                     DENY
  ↳ Prevents clickjacking attacks
    No page can be framed (even by same origin)

X-Content-Type-Options              nosniff
  ↳ Prevents MIME type sniffing
    Browser won't guess content type

Referrer-Policy                     strict-origin-when-cross-origin
  ↳ Controls referrer information
    Only sends origin for cross-origin requests

Strict-Transport-Security           max-age=31536000
  ↳ Enforces HTTPS (when in production)
    Browser remembers for 1 year
    Protects against SSL/TLS downgrades

X-Content-Security-Policy           default-src 'self'
  ↳ Restricts content sources
    Only allow resources from same origin
```

---

## File Structure & Responsibilities

```
src/
├── middleware.ts
│   ├── Entry point for all /api/*, /admin/*, /api/cron/* requests
│   ├── Checks ROUTE_PROTECTION config
│   ├── Calls protectRoute() for auth/rate limit
│   ├── Applies security headers
│   └── Passes allowed requests to route handlers
│
├── lib/auth/
│   ├── api-key-validator.ts
│   │   ├── extractApiKey(request)
│   │   │   └─ Extracts from Authorization or X-API-Key header
│   │   ├── validateApiKey(provided, expected)
│   │   │   └─ Constant-time comparison
│   │   ├── validateRequestApiKey(request, expectedKey)
│   │   │   └─ Combined extraction + validation
│   │   ├── createUnauthorizedResponse()
│   │   │   └─ Safe error message
│   │   └── logSecurityEvent()
│   │       └─ Logs with masked key (first 4 and last 4 chars)
│   │
│   ├── rate-limiter.ts
│   │   ├── getClientIp(request)
│   │   │   └─ Extracts IP from X-Forwarded-For, X-Real-IP, etc
│   │   ├── checkRateLimit(clientId, config)
│   │   │   └─ Returns boolean (allowed/denied)
│   │   ├── getRateLimitStatus(clientId, config)
│   │   │   └─ Returns {allowed, remaining, resetTime, retryAfter}
│   │   ├── createRateLimitResponse(retryAfter)
│   │   │   └─ Returns 429 response with Retry-After header
│   │   └── cleanupExpiredEntries()
│   │       └─ Runs every 5 minutes, removes old entries
│   │
│   └── security-config.ts
│       ├── ROUTE_PROTECTION
│       │   └─ Maps routes to {requiresAuth, rateLimitConfig}
│       ├── SECURITY_HEADERS
│       │   └─ Headers sent with all responses
│       ├── ApiKeyType enum
│       │   └─ SYNC, ADMIN, CRON types
│       ├── getApiKeyByType(type)
│       │   └─ Returns key from env based on type
│       ├── isProtectedRoute(route)
│       │   └─ Boolean check
│       └── generateApiKey(prefix)
│           └─ Creates strong random key
│
└── app/api/*/route.ts
    └─ Route handlers (auth already verified by middleware)
```

---

## Environment Variable Flow

```
VERCEL/DEPLOYMENT ENVIRONMENT
│
├─ API_KEY_SYNC
│  ├─ Injected into runtime
│  ├─ Available as process.env.API_KEY_SYNC
│  ├─ Stored in getApiKeyByType(SYNC)
│  └─ Compared against client-provided key
│
├─ API_KEY_ADMIN
│  ├─ Similar flow for admin endpoints
│  └─ Higher security importance
│
├─ API_KEY_CRON
│  ├─ Used for scheduled jobs
│  └─ Falls back to API_KEY_SYNC if not set
│
├─ KNACK_API_KEY
│  ├─ NEVER used client-side
│  ├─ Only in /src/lib/knack/*.ts
│  ├─ Server-side only operations
│  └─ Protected from exposure
│
├─ SUPABASE_SERVICE_ROLE_KEY
│  ├─ NEVER used client-side
│  ├─ Only in /src/lib/knack/sync.ts
│  ├─ Server-side Supabase admin access
│  └─ Protected from exposure
│
└─ NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
   ├─ PUBLIC KEYS (safe to expose)
   ├─ Used client-side for read-only access
   ├─ Row-level security enforced by Supabase
   └─ Do NOT include secret keys with NEXT_PUBLIC_ prefix
```

---

## Security Layers (Defense in Depth)

```
LAYER 1: API KEY AUTHENTICATION
├─ What: Only authorized clients can call sensitive endpoints
├─ How: Bearer token in Authorization header
├─ Benefit: Prevents unauthorized access
└─ Bypass: Only with valid API key

LAYER 2: RATE LIMITING
├─ What: Limit requests per IP per time window
├─ How: In-memory counter, configurable per endpoint
├─ Benefit: Prevents abuse, brute force, DoS attacks
└─ Bypass: Wait for rate limit window to reset

LAYER 3: SECURITY HEADERS
├─ What: Browser-enforced security policies
├─ How: HTTP headers in all responses
├─ Benefit: Prevents clickjacking, MIME sniffing, etc.
└─ Bypass: None (browser enforces)

LAYER 4: CONSTANT-TIME COMPARISON
├─ What: API key comparison immune to timing attacks
├─ How: Compare all characters regardless of match
├─ Benefit: Prevents attackers from guessing key char-by-char
└─ Bypass: None (uses bitwise operations)

LAYER 5: INFORMATION HIDING
├─ What: Don't expose system details in error messages
├─ How: Generic error messages, detailed logging only
├─ Benefit: Prevents information disclosure
└─ Bypass: Can't - errors are identical regardless of reason

RESULT: Multiple layers mean attacker must bypass ALL to compromise system
```

---

## Deployment Checklist

```
LOCAL DEVELOPMENT
  □ Generate API keys (setup-api-keys.sh or openssl)
  □ Create .env.local with generated keys
  □ Update existing Supabase/Knack keys in .env.local
  □ npm run dev
  □ Test all endpoints locally
  □ Verify rate limiting works
  □ Check security headers present

PRODUCTION DEPLOYMENT
  □ Generate NEW API keys (different from dev)
  □ Add to Vercel Environment Variables
  □ Set for PRODUCTION environment
  □ Deploy main branch
  □ Test all endpoints in production
  □ Monitor auth failures and rate limits
  □ Set up alerting

KEY ROTATION (Every 90 Days)
  □ Generate new keys
  □ Add old and new keys temporarily
  □ Update all clients
  □ Remove old key
  □ Document rotation date
```

---

**For implementation details, see SECURITY_IMPLEMENTATION_GUIDE.md**
**For vulnerability details, see SECURITY_AUDIT.md**
**For quick reference, see SECURITY_SUMMARY.md**
