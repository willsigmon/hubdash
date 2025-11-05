# Security Implementation Guide

Quick reference for implementing and testing the security scaffolding.

---

## Quick Start (5 minutes)

### 1. Generate API Keys

```bash
# Option A: Using openssl (macOS/Linux)
openssl rand -hex 32

# Option B: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate three keys:
# API_KEY_SYNC:  [32-char hex string]
# API_KEY_ADMIN: [32-char hex string]
# API_KEY_CRON:  [32-char hex string]
```

### 2. Create .env.local

```bash
# Copy and customize
cp .env.local.example .env.local

# Add to .env.local:
API_KEY_SYNC=sk_[your_generated_key]
API_KEY_ADMIN=sk_[your_generated_key]
API_KEY_CRON=sk_[your_generated_key]

# Your existing Supabase and Knack keys:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
KNACK_API_KEY=...
KNACK_APP_ID=...
```

### 3. Test It Works

```bash
# Start dev server
npm run dev

# In another terminal, test:
curl http://localhost:3000/api/metrics

# Should return metrics (public endpoint - no auth needed)

curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -d '{"serial":"test"}'

# Should return 401 Unauthorized (protected endpoint - requires auth)

curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY_SYNC" \
  -d '{"serial":"test"}'

# Should work (or fail with 400 if invalid data, but auth passes)
```

---

## Deployment (Production)

### Vercel Deployment

1. **Set Environment Variables**:
   - Go to Vercel Project Settings > Environment Variables
   - Add each variable with appropriate environment (Production, Preview, Development)
   - Variables needed:
     - `API_KEY_SYNC`
     - `API_KEY_ADMIN`
     - `API_KEY_CRON`
     - `KNACK_API_KEY`
     - `KNACK_APP_ID`
     - `SUPABASE_SERVICE_ROLE_KEY`

2. **Verify No Secrets in Code**:
   ```bash
   # Check git history
   git log -p --all | grep -i "api_key\|knack_api_key\|service_role"

   # Should return nothing
   ```

3. **Deploy**:
   ```bash
   git push origin main
   # Vercel auto-deploys with environment variables
   ```

### GitHub Actions (if used)

```yaml
# .github/workflows/deploy.yml
env:
  API_KEY_SYNC: ${{ secrets.API_KEY_SYNC }}
  API_KEY_ADMIN: ${{ secrets.API_KEY_ADMIN }}
  API_KEY_CRON: ${{ secrets.API_KEY_CRON }}
  KNACK_API_KEY: ${{ secrets.KNACK_API_KEY }}
  KNACK_APP_ID: ${{ secrets.KNACK_APP_ID }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## Architecture Overview

### Request Flow

```
Client Request
    ↓
Next.js Middleware (/src/middleware.ts)
    ├── Check if route needs auth (from security-config.ts)
    ├── If protected:
    │   ├── Extract API key from headers
    │   ├── Check rate limit (rate-limiter.ts)
    │   ├── Validate API key (api-key-validator.ts)
    │   └── Add security headers
    └── Pass to API route or return error
    ↓
API Route Handler
    └── Process request with authentication already verified
```

### Files and Responsibilities

```
src/
├── middleware.ts
│   └── Enforces auth and rate limits on all protected routes
│
├── lib/auth/
│   ├── api-key-validator.ts
│   │   ├── API key extraction from headers
│   │   ├── Constant-time comparison
│   │   └── Safe error responses
│   │
│   ├── rate-limiter.ts
│   │   ├── In-memory rate limit tracking
│   │   ├── IP address detection
│   │   ├── Automatic cleanup
│   │   └── Rate limit status checking
│   │
│   └── security-config.ts
│       ├── Route protection rules
│       ├── Security headers
│       ├── API key type management
│       └── Rate limit configuration
│
└── app/api/
    └── [existing routes - now protected by middleware]
```

---

## Configuration Reference

### How to Change Rate Limits

Edit `/src/lib/auth/security-config.ts`:

```typescript
export const ROUTE_PROTECTION = {
  '/api/sync': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 10,      // Change this number
      windowMs: 60 * 60 * 1000, // Time window in ms
      keyPrefix: 'sync',
    },
  },
  // ... more routes
};
```

Examples:
```typescript
// 5 requests per hour
maxRequests: 5,
windowMs: 60 * 60 * 1000,

// 10 requests per minute
maxRequests: 10,
windowMs: 60 * 1000,

// 100 requests per day
maxRequests: 100,
windowMs: 24 * 60 * 60 * 1000,
```

### How to Change Security Headers

Edit `/src/lib/auth/security-config.ts`:

```typescript
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
```

### How to Add a New Protected Route

1. Edit `/src/lib/auth/security-config.ts`:

```typescript
export const ROUTE_PROTECTION = {
  // ... existing routes ...

  // Add your new route:
  'POST /api/new-endpoint': {
    requiresAuth: true,
    rateLimitConfig: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000,
      keyPrefix: 'new-endpoint',
    },
  },
};
```

2. Middleware automatically protects it - no changes needed to route handler

### How to Add a Public (Unprotected) Route

1. Edit `/src/lib/auth/security-config.ts`:

```typescript
export const ROUTE_PROTECTION = {
  // ... existing routes ...

  // Add your new public route (with rate limiting but no auth):
  'GET /api/public-data': {
    requiresAuth: false,  // No authentication required
    rateLimitConfig: {
      maxRequests: 200,   // But still rate limited
      windowMs: 60 * 60 * 1000,
      keyPrefix: 'public-data',
    },
  },
};
```

---

## Troubleshooting

### Problem: "Invalid or missing API key"

**Diagnosis**:
1. Check that `API_KEY_SYNC` is set in .env.local:
   ```bash
   echo $API_KEY_SYNC
   ```

2. Verify you're using Bearer token format:
   ```bash
   # Correct:
   Authorization: Bearer sk_abc123...

   # Wrong:
   Authorization: sk_abc123...  # Missing "Bearer "
   Authorization: Bearer $API_KEY_SYNC  # Shell variable not expanded
   ```

3. Make sure key matches exactly:
   ```bash
   # Check key in env:
   grep API_KEY_SYNC .env.local

   # Use exact value in curl:
   curl -H "Authorization: Bearer EXACT_VALUE_HERE" ...
   ```

### Problem: "Rate limit exceeded" (429)

**Diagnosis**:
1. This is working as intended - you've made too many requests
2. Rate limits are per IP and per endpoint
3. Check your rate limit:
   ```bash
   # Will show remaining requests and retry time
   curl -I http://localhost:3000/api/sync \
     -H "Authorization: Bearer $API_KEY_SYNC"
   ```

4. Wait before retrying:
   ```bash
   # Check "Retry-After" header for seconds to wait
   ```

### Problem: "Unauthorized" on public endpoints

**Diagnosis**:
1. Public endpoints should NOT require auth
2. Check if route is in ROUTE_PROTECTION with `requiresAuth: false`
3. Example of correctly configured public route:
   ```typescript
   'GET /api/metrics': {
     requiresAuth: false,
     rateLimitConfig: { ... }
   }
   ```

### Problem: Middleware not protecting route

**Diagnosis**:
1. Check if route is listed in `src/middleware.ts` config:
   ```typescript
   export const config = {
     matcher: [
       '/api/:path*',    // Protects /api/* routes
       '/admin/:path*',  // Protects /admin/* routes
       '/api/cron/:path*', // Protects /api/cron/* routes
     ],
   };
   ```

2. Check if route is in ROUTE_PROTECTION:
   ```bash
   grep "'/api/your-route'" src/lib/auth/security-config.ts
   ```

3. For new routes, add to both locations

---

## Testing Checklist

- [ ] Generated API keys (3 keys with `openssl rand -hex 32`)
- [ ] Created .env.local with all keys
- [ ] Started dev server: `npm run dev`
- [ ] Tested public endpoint works without auth:
  ```bash
  curl http://localhost:3000/api/metrics
  ```
- [ ] Tested protected endpoint fails without auth:
  ```bash
  curl http://localhost:3000/api/sync
  # Should return 401
  ```
- [ ] Tested protected endpoint works with auth:
  ```bash
  curl -H "Authorization: Bearer $API_KEY_SYNC" http://localhost:3000/api/sync
  # Should succeed or return 200/206 (not 401)
  ```
- [ ] Tested rate limiting:
  ```bash
  # Run request multiple times, should eventually get 429
  for i in {1..20}; do
    curl -H "Authorization: Bearer $API_KEY_SYNC" http://localhost:3000/api/sync
  done
  ```
- [ ] Verified no console errors about missing env variables
- [ ] Checked that .env.security is in .gitignore
- [ ] Reviewed SECURITY_AUDIT.md for complete details

---

## Key Takeaways

1. **Always use Bearer token format**:
   ```bash
   Authorization: Bearer <key>
   ```

2. **Never commit API keys**:
   - Use .env.local for development
   - Use Vercel environment variables for production
   - Add .env.security to .gitignore

3. **Rate limits prevent abuse**:
   - Each IP has separate counters
   - Limits reset every hour (configurable)
   - Check "Retry-After" header when hitting limits

4. **Public endpoints are still rate-limited**:
   - This protects against DoS attacks
   - But no authentication is required
   - Provides defense-in-depth

5. **Security headers protect against common attacks**:
   - Applied to all responses (including errors)
   - Prevent clickjacking, MIME sniffing, etc.

---

## Next Steps

1. ✅ Implement authentication scaffolding (DONE)
2. Generate API keys and set environment variables
3. Test all endpoints locally
4. Deploy to Vercel with environment variables
5. Monitor for auth failures and rate limit hits
6. Plan for API key rotation (every 90 days)
7. Implement audit logging (see SECURITY_AUDIT.md for recommendations)
8. Set up alerts for suspicious patterns

---

**For complete security details, see SECURITY_AUDIT.md**
