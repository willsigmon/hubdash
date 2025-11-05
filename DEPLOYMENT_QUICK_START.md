# HubDash Deployment - Quick Start Guide

**Get HubDash running with Knack sync in 15 minutes**

---

## Prerequisites

- [ ] Knack App ID & API Key (from https://builder.knack.com)
- [ ] Supabase Project URL & Keys (from https://supabase.com/dashboard)
- [ ] Vercel Account (deploy at https://vercel.com)
- [ ] GitHub Account (for Actions backup)

---

## Step 1: Verify Configuration (2 min)

```bash
# Run validation script
./scripts/validate-deployment.sh
```

All checks should pass. If there are errors, read the output for fixes.

---

## Step 2: Set Local Environment (2 min)

```bash
# Create local env file
cp .env.local.example .env.local

# Edit with your credentials
# - KNACK_APP_ID
# - KNACK_API_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - CRON_SECRET (generate: openssl rand -base64 32)
```

---

## Step 3: Deploy to Vercel (3 min)

```bash
# Connect to Vercel
npm install -g vercel
vercel login

# Deploy
vercel

# When prompted, add environment variables:
vercel env add
# Add each variable from .env.local
```

Or use Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select HubDash project
3. Settings → Environment Variables
4. Add: `KNACK_APP_ID`, `KNACK_API_KEY`, etc.
5. Redeploy (or push to main)

---

## Step 4: Configure GitHub Actions (3 min)

Edit `.github/workflows/sync.yml`:
```bash
# Find this line and replace YOUR_GITHUB_ORG:
if: github.repository == 'YOUR_GITHUB_ORG/hubdash'

# Example:
if: github.repository == 'hubzonetech/hubdash'
```

Add GitHub Secrets:
1. Go to your GitHub repo
2. Settings → Secrets and Variables → Actions
3. Add:
   - `DEPLOYMENT_URL` = https://your-hubdash.vercel.app
   - `CRON_SECRET` = (same as Vercel env var)
   - `SLACK_WEBHOOK_URL` (optional)

---

## Step 5: Verify It Works (5 min)

**Wait for first cron run** (up to 1 hour):

Check Vercel logs:
```bash
# Via CLI
vercel logs api/cron/sync

# Or via Dashboard:
# https://vercel.com → Select project → Deployments → Functions → /api/sync
```

Check GitHub Actions:
```
https://github.com/YOUR_ORG/hubdash → Actions → Hourly Knack Sync → Latest run
```

Check Supabase:
```bash
# Via Supabase Dashboard:
# Table Editor → devices/donations → Should see data

# Or SQL:
SELECT COUNT(*) FROM devices;
SELECT COUNT(*) FROM donations;
```

---

## Manual Test (Right Now!)

Test the sync endpoint manually:

```bash
# Trigger full sync
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  https://your-hubdash.vercel.app/api/sync

# Sync only devices
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"table": "devices"}' \
  https://your-hubdash.vercel.app/api/sync
```

Expected response (200 success):
```json
{
  "timestamp": "2025-11-04T12:00:00Z",
  "totalRecordsSynced": 1250,
  "totalErrors": 0,
  "syncDuration": "2345ms"
}
```

---

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Sync not running | Check Vercel cron in `vercel.json` - should have `/api/sync` |
| 401 Unauthorized | Verify `CRON_SECRET` in env vars and request header |
| 0 records synced | Verify Knack has data, check `KNACK_APP_ID` and `KNACK_API_KEY` |
| Connection timeout | Check Supabase status, verify `NEXT_PUBLIC_SUPABASE_URL` |
| GitHub Actions fails | Check organization name in `.github/workflows/sync.yml` |

---

## What Gets Synced?

Every hour (or on demand):

- **Devices** (from Knack object_1):
  - Serial numbers, models, manufacturers
  - Status (received, refurbishing, ready, distributed)
  - Location, assigned tech, dates

- **Donations** (from Knack object_2):
  - Company name, contact info
  - Device count, priority, status
  - Scheduled and completion dates

Data flows: **Knack → Sync Endpoint → Supabase → Dashboards**

---

## Next Steps

1. Monitor first sync in logs
2. Verify data appears in dashboards
3. Set up monitoring alerts (optional)
4. Read `DEPLOYMENT_CONFIG.md` for advanced config

---

## Getting Help

- **Deployment issues?** See `DEPLOYMENT_CONFIG.md`
- **Knack setup?** See `KNACK_SETUP.md`
- **Supabase setup?** See `SUPABASE_SETUP.md`
- **Backend code?** See `BACKEND_COMPLETE.md`

---

**Deployment completed!** The sync is now running hourly.
