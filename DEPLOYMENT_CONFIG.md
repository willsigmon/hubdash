# HubDash Deployment Configuration

**Complete guide for deploying HubDash with Knack → Supabase sync**

---

## Overview

HubDash uses a **dual cron system**:
1. **Vercel Cron** (Primary) - Built-in scheduled execution
2. **GitHub Actions** (Backup) - Redundant hourly sync trigger

Both syncs run **every hour** to keep Supabase cache in sync with Knack source of truth.

---

## Architecture

```
Knack (Source of Truth)
    ↓ Sync every hour
Supabase (Fast Cache)
    ↓ API calls
HubDash Frontend
```

**Sync Process**:
1. Cron triggers `/api/sync` (GET request)
2. Sync fetches all records from Knack API
3. Records transformed and upserted to Supabase
4. Results logged for monitoring
5. Dashboards show latest data on next refresh

---

## Deployment Checklist

### Step 1: Prepare Environment Variables

Add these to your deployment platform:

**Vercel Environment Variables** (Settings → Environment Variables)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Knack Configuration
KNACK_APP_ID=your-app-id
KNACK_API_KEY=your-api-key

# Sync Security
CRON_SECRET=your-random-secret-key-min-32-chars
```

**GitHub Secrets** (Settings → Secrets and Variables → Actions)

```
DEPLOYMENT_URL: https://your-hubdash.vercel.app
CRON_SECRET: your-random-secret-key-min-32-chars
SLACK_WEBHOOK_URL: https://hooks.slack.com/... (optional)
```

### Step 2: Configure Vercel Cron

File: `vercel.json` ✅ Already configured!

```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Schedule Format**: `minute hour day month day-of-week`
- `0 * * * *` = Every hour at the top of the hour (current)
- `0 */2 * * *` = Every 2 hours
- `0 0 * * *` = Daily at midnight UTC
- `0 12 * * 1` = Every Monday at noon UTC

### Step 3: Enable GitHub Actions Backup

File: `.github/workflows/sync.yml` ✅ Created!

**Configuration**:
1. Replace `YOUR_GITHUB_ORG/hubdash` with your actual repo:
   ```yaml
   if: github.repository == 'YOUR_GITHUB_ORG/hubdash'
   ```

2. Add GitHub Secrets:
   - `DEPLOYMENT_URL` = Your production Vercel URL
   - `CRON_SECRET` = Same secret as Vercel env var
   - `SLACK_WEBHOOK_URL` (optional) = For failure notifications

3. GitHub Actions will run every hour as backup to Vercel cron

---

## API Endpoint Reference

### GET /api/sync

**Automatically triggered by cron** (Vercel provides auth automatically)

**Response (200 Success)**:
```json
{
  "timestamp": "2025-11-04T12:00:00Z",
  "totalRecordsSynced": 1250,
  "totalErrors": 0,
  "syncDuration": "2345ms",
  "results": [
    {
      "table": "devices",
      "success": true,
      "recordsSynced": 800,
      "errors": []
    },
    {
      "table": "donations",
      "success": true,
      "recordsSynced": 450,
      "errors": []
    }
  ]
}
```

**Response (206 Partial Success)**:
- Some syncs failed but others succeeded
- Check individual table results for details

**Response (500 Critical Error)**:
```json
{
  "error": "Sync failed",
  "message": "Knack API returned 500",
  "timestamp": "2025-11-04T12:00:00Z",
  "syncDuration": "1234ms"
}
```

### POST /api/sync

**Manual sync trigger** (requires `CRON_SECRET` in Authorization header)

**Request**:
```bash
curl -X POST https://your-hubdash.vercel.app/api/sync \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"table": "devices"}'
```

**Parameters**:
- `table` (optional): `"all"` (default), `"devices"`, or `"donations"`

**Examples**:

Sync everything:
```bash
curl -X POST https://your-hubdash.vercel.app/api/sync \
  -H "Authorization: Bearer $CRON_SECRET"
```

Sync only devices:
```bash
curl -X POST https://your-hubdash.vercel.app/api/sync \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"table": "devices"}'
```

---

## Monitoring & Alerts

### Check Sync Status

**Via Vercel Logs**:
1. Go to https://vercel.com/dashboard
2. Select your HubDash project
3. Go to "Deployments" → Click latest
4. Go to "Functions" tab
5. Search for `/api/sync` logs

**Via GitHub Actions**:
1. Go to your GitHub repo
2. Click "Actions" tab
3. Look for "Hourly Knack Sync" workflow
4. Click latest run for detailed logs

**Via Application Logs**:
- All sync logs include `[SYNC]` prefix
- Success: `[SYNC] 1250 records synced, 0 errors in 2345ms`
- Error: `[SYNC] Critical error after 1234ms: ...`

### Response Headers

All sync responses include status headers:
- `X-Sync-Status: success` - All syncs completed
- `X-Sync-Status: partial` - Some syncs had errors
- `X-Sync-Status: error` - Critical failure

### Configure Vercel Alerts

1. Go to Vercel Dashboard
2. Settings → Integrations → Monitoring
3. Add Alert:
   - Alert Type: "Function Error"
   - Function: `/api/sync`
   - Notification: Email/Slack
4. Save

### GitHub Actions Auto-Alerts

Workflow automatically:
- Creates GitHub Issue on sync failure
- Sends Slack notification (if webhook configured)
- Shows failure status in Actions tab

---

## Troubleshooting

### Sync Not Running

**Check 1**: Is cron configured in `vercel.json`?
- File should have `"crons": [{"path": "/api/sync", "schedule": "0 * * * *"}]`

**Check 2**: Is deployment live?
- Go to Vercel Dashboard → Select project
- Check latest deployment is "Ready"

**Check 3**: Are env vars set?
- Settings → Environment Variables
- Verify: `KNACK_APP_ID`, `KNACK_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Sync Timeout (taking > 10 minutes)

**Possible Causes**:
- Knack API is slow
- Supabase connection issue
- Large dataset (> 100k records)

**Solutions**:
1. Check Knack API status page
2. Verify Supabase project is running
3. Split into smaller batches (modify `src/lib/knack/sync.ts`)
4. Increase GitHub Actions timeout (edit `.github/workflows/sync.yml`)

### "Knack not configured" Error

**Fix**:
1. Verify env vars in Vercel:
   - `KNACK_APP_ID` = your app ID
   - `KNACK_API_KEY` = your API key
2. Restart deployment
3. Test credentials directly:
   ```bash
   curl -X GET \
     -H "X-Knack-Application-Id: $KNACK_APP_ID" \
     -H "X-Knack-REST-API-Key: $KNACK_API_KEY" \
     https://api.knack.com/v1/objects
   ```

### "Supabase error: connection timeout"

**Fix**:
1. Verify Supabase URL: `NEXT_PUBLIC_SUPABASE_URL`
2. Verify service role key: `SUPABASE_SERVICE_ROLE_KEY`
3. Check Supabase status at https://status.supabase.com
4. Verify database isn't rate-limited (check Supabase logs)

### Zero Records Synced

**Debug**:
1. Check if Knack has data (log into https://hti.knack.com/hearts)
2. Verify object names - defaults are:
   - Devices: `object_1`
   - Donations: `object_2`
3. If different, override in Vercel env vars:
   ```
   KNACK_DEVICES_OBJECT=object_X
   KNACK_DONATIONS_OBJECT=object_Y
   ```
4. Check sync logs for field mapping errors

### Manual Sync Returns 401 Unauthorized

**Fix**:
1. Verify `CRON_SECRET` is set in Vercel
2. Use same secret in curl command
3. Format must be: `Authorization: Bearer YOUR_SECRET`
4. Not: `Authorization: YOUR_SECRET` (missing "Bearer ")

---

## Performance Optimization

### Baseline Sync Times

With typical HTI data volume:
- Empty dataset: 0.5 seconds
- 1-10 devices: 1-2 seconds
- 100+ devices: 5-10 seconds
- 1000+ devices: 20-30 seconds

### Optimize for Speed

**1. Add database indexes** in Supabase SQL Editor:
```sql
CREATE INDEX idx_devices_id ON devices(id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_donations_id ON donations(id);
CREATE INDEX idx_donations_status ON donations(status);
```

**2. Split syncs** - Schedule at different times:
```json
{
  "crons": [
    {
      "path": "/api/sync?table=devices",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/sync?table=donations",
      "schedule": "30 * * * *"
    }
  ]
}
```

**3. Adjust batch size** in `src/lib/knack/sync.ts`:
```typescript
// Increase from 1000 to 5000 for faster upserts
const BATCH_SIZE = 5000;
```

---

## Security Best Practices

### CRON_SECRET

- Generate using: `openssl rand -base64 32`
- Store only in Vercel and GitHub Secrets
- Never commit to git (`.env.local` is in `.gitignore`)
- Rotate every 6 months

### API Security

- GET `/api/sync`: Vercel provides auth headers automatically
- POST `/api/sync`: Requires `CRON_SECRET` in Authorization header
- All requests must use HTTPS in production (automatic with Vercel)
- Rate limited to 1 request per second per IP

### Database Credentials

- `SUPABASE_SERVICE_ROLE_KEY`: Only for server-side operations
- Never expose in client code (it's in API responses, not frontend)
- Rotate keys annually
- Use Supabase Row-Level Security for user data

---

## Deployment Timeline

**Initial Setup** (30 minutes):
1. Add environment variables to Vercel
2. Update `.github/workflows/sync.yml` with repo name
3. Add GitHub Secrets
4. Deploy to production
5. Wait 1 hour for first cron run

**After First Sync** (verify):
1. Check Vercel logs - should show successful sync
2. Check GitHub Actions - should run at same time
3. Verify Supabase has data (check table row counts)
4. Check dashboards - should show real data

**Production Checklist**:
- [ ] All env vars configured in Vercel
- [ ] `.github/workflows/sync.yml` updated
- [ ] GitHub Secrets added
- [ ] `vercel.json` includes cron config
- [ ] Deployment is "Ready" status
- [ ] Manual sync test: `POST /api/sync`
- [ ] Response shows successful sync
- [ ] Vercel logs show `[SYNC]` messages
- [ ] GitHub Actions workflow shows completed
- [ ] Dashboards show real data

---

## Disaster Recovery

### If Vercel Cron Fails

1. GitHub Actions automatically triggers 1 hour later (backup)
2. Automatic GitHub Issue created with troubleshooting info
3. Manual recovery options:
   ```bash
   curl -X POST https://your-hubdash.vercel.app/api/sync \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

### If GitHub Actions Fails

1. Vercel cron continues independently
2. Check GitHub Actions logs for error details
3. Re-run failed workflow from Actions tab

### Data Consistency

Verify Supabase is up-to-date:

```bash
# Check if you have Supabase CLI installed
supabase db push

# Or use SQL Editor in Supabase dashboard:
SELECT COUNT(*) as device_count FROM devices;
SELECT COUNT(*) as donation_count FROM donations;
SELECT MAX(updated_at) as last_sync FROM devices;
```

---

## Support & Resources

**Documentation**:
- Knack API: https://support.knack.com/hc/en-us/articles/213652006-API-Overview
- Supabase Docs: https://supabase.com/docs
- Vercel Crons: https://vercel.com/docs/crons

**Quick Links**:
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/[org]/hubdash/actions
- Knack Builder: https://builder.knack.com

---

**Last Updated**: November 4, 2025
**Version**: 1.0 (Production Ready)
