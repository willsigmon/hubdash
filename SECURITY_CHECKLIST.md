# Security Implementation Checklist

Complete checklist for implementing, testing, and deploying the security scaffolding.

---

## Phase 1: Setup & Configuration (Day 1)

### Prerequisites
- [ ] Have access to Vercel project settings
- [ ] Have access to GitHub for checking git history
- [ ] Have openssl or Node.js available for key generation
- [ ] Have terminal/CLI access

### Generate API Keys
- [ ] Run `./setup-api-keys.sh` OR
- [ ] Manually generate three keys using `openssl rand -hex 32`
  - [ ] Generated key 1 (API_KEY_SYNC): `sk_...`
  - [ ] Generated key 2 (API_KEY_ADMIN): `sk_...`
  - [ ] Generated key 3 (API_KEY_CRON): `sk_...`
- [ ] Store generated keys in secure location (password manager)

### Create .env.local
- [ ] Copy .env.local.example to .env.local
- [ ] Add three generated API keys to .env.local
- [ ] Add existing NEXT_PUBLIC_SUPABASE_URL
- [ ] Add existing NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Add existing SUPABASE_SERVICE_ROLE_KEY
- [ ] Add existing KNACK_API_KEY
- [ ] Add existing KNACK_APP_ID
- [ ] Verify .env.local is in .gitignore

### Security History Check
- [ ] Run: `git log -p --all | grep -i "KNACK_API_KEY"` (should be empty)
- [ ] Run: `git log -p --all | grep -i "SUPABASE_SERVICE_ROLE_KEY"` (should be empty)
- [ ] Run: `git log -p --all | grep -i "API_KEY"` (check for accidental commits)
- [ ] If found: Plan for key rotation/revocation

### Verify File Structure
- [ ] `/src/middleware.ts` exists
- [ ] `/src/lib/auth/api-key-validator.ts` exists
- [ ] `/src/lib/auth/rate-limiter.ts` exists
- [ ] `/src/lib/auth/security-config.ts` exists
- [ ] `/.env.security` template exists
- [ ] `/setup-api-keys.sh` exists and is executable

---

## Phase 2: Local Testing (Day 1-2)

### Start Development Server
- [ ] Run: `npm run dev`
- [ ] Server starts without errors
- [ ] No console errors about missing env variables
- [ ] Check logs for middleware initialization

### Test Public Endpoints (No Auth Required)
- [ ] Test GET /api/metrics
  ```bash
  curl http://localhost:3000/api/metrics
  ```
  Expected: 200 OK with metrics data

- [ ] Test GET /api/devices
  ```bash
  curl http://localhost:3000/api/devices
  ```
  Expected: 200 OK with devices array

- [ ] Test GET /api/donations
  ```bash
  curl http://localhost:3000/api/donations
  ```
  Expected: 200 OK with donations array

- [ ] Test GET /api/partners
  ```bash
  curl http://localhost:3000/api/partners
  ```
  Expected: 200 OK with partners array

- [ ] Test GET /api/activity
  ```bash
  curl http://localhost:3000/api/activity
  ```
  Expected: 200 OK with activity log

### Test Protected Endpoints (Without Auth)
- [ ] Test GET /api/sync without API key
  ```bash
  curl http://localhost:3000/api/sync
  ```
  Expected: 401 Unauthorized

- [ ] Test POST /api/devices without API key
  ```bash
  curl -X POST http://localhost:3000/api/devices \
    -H "Content-Type: application/json" \
    -d '{"serial":"test"}'
  ```
  Expected: 401 Unauthorized

- [ ] Test /admin page without API key (if applicable)
  Expected: Redirect or access denied

### Test Protected Endpoints (With Auth)
- [ ] Test GET /api/sync with valid API key
  ```bash
  curl -H "Authorization: Bearer $API_KEY_SYNC" \
    http://localhost:3000/api/sync
  ```
  Expected: 200 OK (sync results)

- [ ] Test POST /api/devices with valid API key
  ```bash
  curl -X POST http://localhost:3000/api/devices \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY_SYNC" \
    -d '{"serial":"test"}'
  ```
  Expected: 201 Created (or validation error, NOT 401)

- [ ] Test with wrong API key
  ```bash
  curl -H "Authorization: Bearer wrong_key_12345" \
    http://localhost:3000/api/sync
  ```
  Expected: 401 Unauthorized

### Test Rate Limiting
- [ ] Get current rate limits from security-config.ts
  - API_KEY_SYNC routes: 10/hour max
  - API_KEY_ADMIN routes: 5/hour max
  - Public endpoints: 100/hour max

- [ ] Test rate limit on sync endpoint (rapid requests)
  ```bash
  for i in {1..15}; do
    curl -H "Authorization: Bearer $API_KEY_SYNC" \
      http://localhost:3000/api/sync
    echo "Request $i"
  done
  ```
  Expected:
  - First ~10 requests: 200 OK
  - Requests 11+: 429 Too Many Requests

- [ ] Check Retry-After header on 429 response
  ```bash
  curl -I -H "Authorization: Bearer $API_KEY_SYNC" \
    http://localhost:3000/api/sync | grep Retry-After
  ```
  Expected: Shows seconds until rate limit resets

- [ ] Test rate limit on public endpoint
  ```bash
  for i in {1..150}; do
    curl http://localhost:3000/api/metrics
  done
  ```
  Expected: Some requests will eventually get 429

### Test Security Headers
- [ ] Get security headers
  ```bash
  curl -I http://localhost:3000/api/sync
  ```
  Expected headers present:
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Strict-Transport-Security: max-age=31536000`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`

### Test Bearer Token Formats
- [ ] Test "Authorization: Bearer" format
  ```bash
  curl -H "Authorization: Bearer $API_KEY_SYNC" \
    http://localhost:3000/api/sync
  ```
  Expected: Success

- [ ] Test "X-API-Key" header format
  ```bash
  curl -H "X-API-Key: $API_KEY_SYNC" \
    http://localhost:3000/api/sync
  ```
  Expected: Success

- [ ] Test malformed Bearer token
  ```bash
  curl -H "Authorization: Bearer" \
    http://localhost:3000/api/sync
  ```
  Expected: 401 Unauthorized

### Test Error Messages
- [ ] Verify error messages don't leak info
  ```bash
  curl http://localhost:3000/api/sync
  ```
  Expected: Generic message like "Invalid or missing API key"
  NOT exposing: System details, file paths, config values

- [ ] Check console logs (server logs)
  - [ ] Server logs show detailed error info (good)
  - [ ] Client receives generic messages (good)

---

## Phase 3: Code Review (Day 2)

### Review Security Files
- [ ] Review `/src/middleware.ts`
  - [ ] Checks ROUTE_PROTECTION config
  - [ ] Implements rate limiting check
  - [ ] Implements API key validation
  - [ ] Adds security headers
  - [ ] Properly bypasses static files

- [ ] Review `/src/lib/auth/api-key-validator.ts`
  - [ ] Uses constant-time comparison
  - [ ] Extracts API key safely
  - [ ] Masks keys in logs
  - [ ] Returns safe error messages

- [ ] Review `/src/lib/auth/rate-limiter.ts`
  - [ ] Tracks by IP address
  - [ ] Implements automatic cleanup
  - [ ] Returns proper 429 responses
  - [ ] Includes Retry-After header

- [ ] Review `/src/lib/auth/security-config.ts`
  - [ ] All protected routes listed
  - [ ] All public routes listed
  - [ ] Rate limits reasonable for each endpoint
  - [ ] Security headers comprehensive

### Check for Secrets in Code
- [ ] Grep for hardcoded keys
  ```bash
  grep -r "sk_" src/ --include="*.ts" --include="*.tsx"
  ```
  Expected: No results (no hardcoded keys)

- [ ] Grep for KNACK_API_KEY in client code
  ```bash
  grep -r "KNACK_API_KEY" src/app/
  ```
  Expected: No results (only in /src/lib/knack/)

- [ ] Grep for SUPABASE_SERVICE_ROLE_KEY in wrong places
  ```bash
  grep -r "SUPABASE_SERVICE_ROLE_KEY" src/app/
  ```
  Expected: No results (only in /src/lib/knack/sync.ts)

### Verify No Client-Side Secret Exposure
- [ ] Check admin page doesn't expose env vars
  ```bash
  grep -n "process.env.KNACK_API_KEY" src/app/admin/page.tsx
  ```
  Expected: Not found or only checks if configured (not exposing value)

- [ ] Check no NEXT_PUBLIC_ secrets
  ```bash
  grep "NEXT_PUBLIC_API_KEY\|NEXT_PUBLIC_KNACK\|NEXT_PUBLIC_SERVICE_ROLE" .env*
  ```
  Expected: No results

---

## Phase 4: Production Deployment (Day 3)

### Prepare for Deployment
- [ ] Commit all security files to git
  ```bash
  git add src/middleware.ts src/lib/auth/ SECURITY_*.md setup-api-keys.sh
  git commit -m "security: add API key authentication and rate limiting"
  ```

- [ ] Do NOT commit .env.local
  - [ ] Verify it's in .gitignore
  - [ ] Run: `git check-ignore .env.local` (should output file path)

- [ ] Do NOT commit .env.security
  - [ ] Verify it's in .gitignore
  - [ ] Run: `git check-ignore .env.security` (should output file path)

### Vercel Configuration
- [ ] Go to Vercel Project Settings
- [ ] Navigate to Environment Variables section
- [ ] Add API_KEY_SYNC
  - [ ] Value: `sk_[your_sync_key]`
  - [ ] Environments: Production, Preview, Development
- [ ] Add API_KEY_ADMIN
  - [ ] Value: `sk_[your_admin_key]`
  - [ ] Environments: Production, Preview, Development
- [ ] Add API_KEY_CRON
  - [ ] Value: `sk_[your_cron_key]`
  - [ ] Environments: Production, Preview, Development
- [ ] Verify existing variables still present:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] KNACK_API_KEY
  - [ ] KNACK_APP_ID

### Deploy to Production
- [ ] Push to main branch
  ```bash
  git push origin main
  ```
- [ ] Wait for Vercel deployment to complete
- [ ] Check deployment status in Vercel dashboard
- [ ] Verify no build errors

### Post-Deployment Testing
- [ ] Test public endpoint works
  ```bash
  curl https://hubdash.org/api/metrics
  ```
  Expected: 200 OK with data

- [ ] Test protected endpoint without auth fails
  ```bash
  curl https://hubdash.org/api/sync
  ```
  Expected: 401 Unauthorized

- [ ] Test protected endpoint with auth succeeds
  ```bash
  curl -H "Authorization: Bearer $API_KEY_SYNC" \
    https://hubdash.org/api/sync
  ```
  Expected: 200 OK with sync results

- [ ] Verify security headers present
  ```bash
  curl -I https://hubdash.org/api/sync | grep X-Frame-Options
  ```
  Expected: `X-Frame-Options: DENY`

- [ ] Test rate limiting works in production
  - (Make multiple rapid requests - expect 429 eventually)

---

## Phase 5: Ongoing Maintenance

### Weekly
- [ ] Monitor Vercel Function logs for auth errors
  - [ ] Check for repeated 401 errors (potential attack)
  - [ ] Check for repeated 429 errors (potential DoS)
  - [ ] Alert if pattern detected

### Monthly
- [ ] Review rate limit configuration
  - [ ] Are limits appropriate?
  - [ ] Need to adjust up/down?

- [ ] Review security logs
  - [ ] Any unusual patterns?
  - [ ] Any IP addresses of concern?

- [ ] Verify no new secrets committed
  ```bash
  git log --all --grep="API_KEY\|KNACK_API_KEY" --pretty=oneline
  ```

### Quarterly (Every 90 Days)
- [ ] **ROTATE API KEYS** (Critical!)
  - [ ] Generate new API keys
  - [ ] Add new keys to Vercel temporarily (alongside old ones)
  - [ ] Update all clients/systems using the keys
  - [ ] Remove old keys from Vercel
  - [ ] Update local .env.local with new keys

- [ ] Review security audit
  - [ ] Any new vulnerabilities discovered?
  - [ ] Any changes to threat model?

- [ ] Update security documentation
  - [ ] Update SECURITY_AUDIT.md with new findings
  - [ ] Update rate limit recommendations

---

## Phase 6: Incident Response

### If API Key Compromised
- [ ] **IMMEDIATELY**: Revoke compromised key in Vercel
  - [ ] Remove from Environment Variables
  - [ ] Check if key was used recently
- [ ] Generate new API key
- [ ] Update all systems using the key
- [ ] Monitor logs for unauthorized access attempts
- [ ] Review what data was accessed
- [ ] Notify relevant stakeholders

### If Rate Limited
- [ ] Check if legitimate traffic surge
  - [ ] Check application metrics
  - [ ] Check if new integrations added
- [ ] If legitimate: Increase rate limits in security-config.ts
- [ ] If attack: Review logs for source IP addresses
  - [ ] Block IPs at Vercel level if possible
  - [ ] Upgrade to DDoS protection

### If Authentication Failing for Legitimate Client
- [ ] Verify API key is correct and hasn't expired
- [ ] Verify Bearer token format is used
- [ ] Check if key matches environment variable (case-sensitive)
- [ ] Verify header format: `Authorization: Bearer <KEY>`
- [ ] Check rate limit (might be 429, not 401)
- [ ] Review logs for exact error message

---

## Documentation Checklist

### Files Created
- [ ] SECURITY_AUDIT.md - Complete vulnerability assessment
- [ ] SECURITY_IMPLEMENTATION_GUIDE.md - Setup and troubleshooting
- [ ] SECURITY_ARCHITECTURE.md - Visual diagrams and flows
- [ ] SECURITY_SUMMARY.md - Executive summary
- [ ] SECURITY_CHECKLIST.md - This file
- [ ] .env.security - Environment variable template
- [ ] setup-api-keys.sh - Automated key generation

### Team Communication
- [ ] Share SECURITY_SUMMARY.md with stakeholders
- [ ] Share SECURITY_IMPLEMENTATION_GUIDE.md with dev team
- [ ] Share API key generation instructions with DevOps
- [ ] Document key rotation schedule in team wiki

### Training
- [ ] Team understands authentication is required
- [ ] Team knows how to format Authorization header
- [ ] Team aware of rate limits
- [ ] Team knows how to troubleshoot common issues

---

## Verification Checklist (Final)

Run this before marking complete:

```bash
# 1. Verify all security files exist
ls -1 src/middleware.ts src/lib/auth/*.ts SECURITY_*.md .env.security

# 2. Verify no secrets in code
grep -r "sk_" src/ --include="*.ts" --include="*.tsx"  # Should be empty
grep -r "KNACK_API_KEY" src/app/ --include="*.tsx"      # Should be empty
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/app/ --include="*.tsx"  # Should be empty

# 3. Verify .gitignore includes env files
grep -E ".env.local|.env.security" .gitignore

# 4. Verify no committed secrets
git log -p --all | grep -i "KNACK_API_KEY\|SUPABASE_SERVICE_ROLE_KEY"  # Should be empty

# 5. Verify middleware is configured
grep "matcher:" src/middleware.ts

# 6. Verify route protection is configured
grep "ROUTE_PROTECTION\|requiresAuth" src/lib/auth/security-config.ts
```

Expected: All checks pass without exposing secrets

---

## Sign-Off

- [ ] All Phase 1 tasks complete
- [ ] All Phase 2 tests passing
- [ ] All Phase 3 code reviews done
- [ ] All Phase 4 deployment successful
- [ ] All Phase 5 ongoing tasks assigned
- [ ] All documentation complete and shared
- [ ] Team trained on new security requirements

---

## Quick Reference Links

- **Setup**: See SECURITY_IMPLEMENTATION_GUIDE.md - Quick Start section
- **Testing**: See SECURITY_IMPLEMENTATION_GUIDE.md - Testing Checklist section
- **Troubleshooting**: See SECURITY_IMPLEMENTATION_GUIDE.md - Troubleshooting section
- **Architecture**: See SECURITY_ARCHITECTURE.md for visual diagrams
- **Vulnerabilities**: See SECURITY_AUDIT.md for detailed findings
- **Summary**: See SECURITY_SUMMARY.md for executive overview

---

**Last Updated**: November 4, 2025
**Status**: Ready for Implementation
**Next Step**: Generate API keys and start Phase 1
