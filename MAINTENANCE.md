# Maintenance Guide - Daily Operations

**Everything you need to keep HubDash running smoothly.**

This guide is for HTI team members responsible for day-to-day operations, data updates, and troubleshooting.

---

## Table of Contents

1. [Daily Tasks](#daily-tasks)
2. [Updating Metrics Manually](#updating-metrics-manually)
3. [Triggering Data Syncs](#triggering-data-syncs)
4. [Troubleshooting Guide](#troubleshooting-guide)
5. [Adding New Features](#adding-new-features)
6. [Monitoring & Health Checks](#monitoring--health-checks)

---

## Daily Tasks

### Morning Checklist (5 minutes)

```
☐ Check Vercel dashboard for deployment status
☐ Verify board dashboard loads: hubdash.hubzonetech.org/board
☐ Verify ops hub loads: hubdash.hubzonetech.org/ops
☐ Check if any error notifications from Vercel
```

### When Adding Data in Knack

**You do this**: When staff adds a new device or donation request in Knack.

**Automatic**: Data syncs to HubDash within the hour (if scheduled sync enabled).

**Manual sync** (if you need it immediately):
1. Go to `hubdash.hubzonetech.org/admin`
2. Click the **"🔄 Trigger Full Sync"** button
3. Wait 30 seconds - 2 minutes
4. Check the results displayed
5. Go back to `/board` or `/ops` - data should update!

---

## Updating Metrics Manually

### Scenario: You Want to Update Device Counts or Other Metrics

There are two ways to update data:

#### Method 1: Update in Knack (Best)

This is the recommended approach - update your "source of truth" (Knack), then sync to HubDash.

**Steps**:
1. Log into Knack: https://hti.knack.com/hearts
2. Add/edit your devices, donations, partners, etc.
3. Go to HubDash `/admin`
4. Click **"🔄 Trigger Full Sync"**
5. Watch the sync complete
6. Dashboards now show updated data!

**Advantage**: Data stays in sync with Knack. Single source of truth.

---

#### Method 2: Update Directly in Supabase (Quick but temporary)

For quick testing or emergency updates.

**Steps**:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your HubDash project
3. Click **"SQL Editor"** or **"Table Editor"**

**To add a device**:
```sql
INSERT INTO devices (
  serial_number, model, manufacturer, status, location, assigned_to
) VALUES (
  'SN-123456', 'Dell Latitude 5000', 'Dell', 'ready', 'HTI Warehouse', 'John'
);
```

**To update a device**:
```sql
UPDATE devices
SET status = 'distributed'
WHERE serial_number = 'SN-123456';
```

**To view devices**:
```sql
SELECT * FROM devices ORDER BY created_at DESC;
```

**To add a donation request**:
```sql
INSERT INTO donations (
  company, contact_name, device_count, priority, status
) VALUES (
  'TechCorp Inc', 'Jane Smith', 50, 'high', 'pending'
);
```

**⚠️ Important**: Changes made directly in Supabase don't sync back to Knack. Only update here for testing!

---

## Triggering Data Syncs

### Automatic Syncing (Recommended Setup)

HubDash can sync automatically on a schedule:

**To enable automatic hourly sync**:
1. Go to `hubdash.hubzonetech.org/admin`
2. Look for **"Schedule Sync"** section
3. Toggle **"Enable Hourly Sync"** - ON
4. This will auto-sync from Knack every hour

**Benefits**:
- Always up-to-date
- No manual intervention needed
- Dashboards stay fresh

---

### Manual Syncing

If automatic sync is disabled or you need an immediate update:

1. Go to `hubdash.hubzonetech.org/admin`
2. Click **"🔄 Trigger Full Sync"** button
3. Watch the status message:
   - ⏳ "Syncing..." - In progress
   - ✅ "Synced 42 devices, 5 donations, 3 partners!" - Success
   - ❌ "Sync failed: [error message]" - See troubleshooting below

4. Wait 5-10 seconds for dashboards to refresh
5. Go to `/board` or `/ops` - data should be updated!

**What happens during sync**:
```
Knack Database
    ↓ API pulls all records
Sync Process
    ↓ Maps Knack fields to HubDash fields
Supabase Database
    ↓ Stores/updates records
HubDash Dashboards
    ↓ API fetches latest data
    ↓
Browser displays updated metrics!
```

---

## Troubleshooting Guide

### Issue: Metrics Show "Loading..." Forever

**Symptoms**:
- Dashboard never finishes loading
- Spinner keeps spinning indefinitely

**Causes & Fixes**:

**1. Supabase is down**
- Check: [status.supabase.com](https://status.supabase.com)
- Wait for Supabase to come back online (usually < 30 min)

**2. No internet connection**
- Check your WiFi/network
- Try on a different device

**3. Browser cache issue**
- Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh
- This clears the browser cache

**4. API credentials not set**
- Go to Vercel dashboard → hubdash project → Settings → Environment Variables
- Verify these are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- If missing, add them from your Supabase project
- Redeploy: Deployments → click latest → Redeploy

---

### Issue: "Failed to fetch metrics" Error

**Symptoms**:
- Board dashboard shows error message
- Some cards load, others fail

**Causes & Fixes**:

**1. Supabase API key wrong**
- Go to Supabase → Settings → API
- Copy the `anon/public key` (not the service role key!)
- Update Vercel: Settings → Environment Variables → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy

**2. Database tables don't exist**
- Go to Supabase → SQL Editor → run:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
```
- Should see: `devices`, `donations`, `partners`, `training_sessions`, `activity_log`
- If missing, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create tables

**3. No data in tables**
- Go to Supabase → Table Editor → click each table
- Should see rows of data
- If empty, need to add data or sync from Knack (see [Updating Metrics Manually](#updating-metrics-manually))

---

### Issue: Sync Button Does Nothing / No Response

**Symptoms**:
- Click "Trigger Full Sync" but nothing happens
- Page doesn't show sync results

**Causes & Fixes**:

**1. Knack credentials not configured**
- Check `.env` file has `KNACK_APP_ID` and `KNACK_API_KEY`
- If running locally: `.env.local` should have these values
- If on Vercel: Settings → Environment Variables should have them
- Redeploy after adding

**2. Knack is down**
- Try logging into https://hti.knack.com/hearts
- If you can't access Knack, their service may be down

**3. API rate limits hit**
- Knack limits how many API calls per minute
- Wait 5 minutes and try again

**4. Check browser console for errors**
- Press F12 (DevTools)
- Click "Console" tab
- Look for red error messages
- Share the error message with the development team

---

### Issue: Board Dashboard Shows Different Numbers Than Operations Hub

**Symptoms**:
- Board says "3,500 laptops received"
- Ops shows "3,200 devices in system"
- Numbers don't match

**Causes**:
1. Sync hasn't completed yet
2. Board includes deleted/archived devices, Ops only shows active
3. Different counting methods (total vs. active only)

**Fix**:
1. Wait 1 minute (might still be syncing)
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
3. Go to `/admin` and click sync again
4. Contact development if problem persists

---

### Issue: Activity Feed Not Updating

**Symptoms**:
- Activity feed shows same entries even after new actions
- Timestamps are old

**Causes & Fixes**:

**1. Sync hasn't run recently**
- Manual fix: Go to `/admin` and click "Trigger Full Sync"
- Enable automatic sync (see [Automatic Syncing](#automatic-syncing))

**2. Activity not being logged**
- Currently, only Knack sync logs activity
- Manual Supabase updates don't log activity
- Workaround: Use the Knack system as the main data entry

**3. Browser cache**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)

---

### Issue: Can't Access Admin Page (`/admin`)

**Symptoms**:
- Go to `hubdash.hubzonetech.org/admin`
- Page shows "Not Found" or redirects

**Causes & Fixes**:

**1. Authentication not set up yet**
- Admin page currently has no login (it's public)
- If seeing "Not Found", the page may not be deployed
- Check `/admin/page.tsx` exists in source code

**2. Domain issue**
- Try the Vercel preview URL instead:
  - Go to `https://hubdash.vercel.app/admin`
  - If this works, DNS issue with custom domain

**3. Need deployment**
- Make sure latest code is deployed to Vercel
- Check Deployments tab shows "Ready"

---

## Adding New Features

### Common Feature Requests

#### Request: "Add a new column to the device table"

**Steps**:
1. **Update database schema** (one time):
   - Go to Supabase → SQL Editor
   - Run: `ALTER TABLE devices ADD COLUMN new_column_name TEXT;`

2. **Update the component**:
   - Edit `src/components/ops/InventoryOverview.tsx`
   - Add new column to the table HTML
   - Example:
   ```tsx
   <td className="px-4 py-2">{device.new_column_name}</td>
   ```

3. **Update the API**:
   - Edit `src/app/api/devices/route.ts`
   - Make sure new column is fetched from Supabase
   - Usually no changes needed if table already exists

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Add new column to device table"
   git push origin main
   ```

5. **Test**:
   - Go to `/ops`
   - Scroll right in the device table
   - Should see new column with data!

---

#### Request: "Add a metric card to the board"

**Steps**:
1. **Create new component**:
   - Create `src/components/board/NewMetric.tsx`
   - Copy format from `ImpactMetrics.tsx`
   - Example:
   ```tsx
   "use client";
   import { useEffect, useState } from "react";

   export default function NewMetric() {
     const [value, setValue] = useState(0);

     useEffect(() => {
       fetch('/api/metrics')
         .then(r => r.json())
         .then(data => setValue(data.newMetricValue));
     }, []);

     return (
       <div className="bg-white rounded-lg p-6 text-center">
         <div className="text-3xl font-bold text-hti-teal">{value}</div>
         <p className="text-gray-600 mt-2">New Metric</p>
       </div>
     );
   }
   ```

2. **Update API endpoint**:
   - Edit `src/app/api/metrics/route.ts`
   - Add calculation for new metric
   - Example:
   ```typescript
   newMetricValue: devices.filter(d => d.status === 'ready').length
   ```

3. **Add to board page**:
   - Edit `src/app/board/page.tsx`
   - Import and add component:
   ```tsx
   import NewMetric from '@/components/board/NewMetric';

   // In the JSX:
   <NewMetric />
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Add new metric card to board"
   git push origin main
   ```

---

#### Request: "Add a filter to the inventory table"

**Steps**:
1. **Add filter state**:
   - Edit `src/components/ops/InventoryOverview.tsx`
   - Add state:
   ```typescript
   const [filterStatus, setFilterStatus] = useState('all');
   ```

2. **Add filter UI**:
   - Add dropdown or buttons above the table
   - Example:
   ```tsx
   <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
     <option value="all">All Statuses</option>
     <option value="ready">Ready to Ship</option>
     <option value="refurbishing">Refurbishing</option>
   </select>
   ```

3. **Filter the data**:
   - Update the filter logic:
   ```typescript
   const filtered = filterStatus === 'all'
     ? devices
     : devices.filter(d => d.status === filterStatus);
   ```

4. **Update the table to show filtered results**:
   ```tsx
   {filtered.map(device => (
     // ... render device row
   ))}
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Add status filter to inventory table"
   git push origin main
   ```

---

### Getting Help with Features

If you need a more complex feature:

1. **Document the request**:
   - What problem does it solve?
   - Who needs it?
   - When do you need it?

2. **Create a GitHub issue**:
   - Go to GitHub repo
   - Click "Issues"
   - Click "New Issue"
   - Describe the feature

3. **Contact the development team**:
   - Email: will@hubzonetech.org
   - Include your GitHub issue link

---

## Monitoring & Health Checks

### Weekly Health Check (10 minutes)

Run this every Friday to keep everything healthy:

```
WEEKLY HEALTH CHECK
===================

Dashboard Access:
☐ Board dashboard loads: https://hubdash.hubzonetech.org/board
☐ Ops hub loads: https://hubdash.hubzonetech.org/ops
☐ Admin page accessible: https://hubdash.hubzonetech.org/admin

Data Freshness:
☐ Activity feed shows recent entries (< 1 hour old)
☐ Device count matches Knack approximately
☐ Donation requests show current status

Performance:
☐ Pages load in < 3 seconds
☐ No red errors in browser console (F12)
☐ Search/filters responsive

Vercel Status:
☐ Check Vercel dashboard for any warnings
☐ Latest deployment shows "✓ Ready"
☐ No failed deployments in last week

Supabase Status:
☐ Go to supabase.com/dashboard
☐ Check project shows green status
☐ No storage warnings
```

### Monthly Health Check (30 minutes)

Run this at the start of each month:

```
MONTHLY HEALTH CHECK
====================

Data Integrity:
☐ Count devices: SELECT COUNT(*) FROM devices;
☐ Count donations: SELECT COUNT(*) FROM donations;
☐ Check for duplicates (if any)
☐ Verify last sync timestamp

Performance Analysis:
☐ Check Vercel analytics:
  - Page load times trending down? ✓
  - Error rate < 1%? ✓
  - Uptime 99.5%+? ✓

Security Review:
☐ All env vars still correct in Vercel
☐ No API keys committed to GitHub
☐ HTTPS working on custom domain
☐ No suspicious activity in logs

Backups:
☐ Supabase auto-backups enabled
☐ Manual backup taken this month
☐ Backup tested (restore from backup works)

Feature Review:
☐ Any requested features still pending?
☐ Any bugs reported?
☐ Any performance issues noticed?
```

### Checking Vercel Analytics

To see how many people are using HubDash:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **hubdash** project
3. Click **"Analytics"** tab

You'll see:
- **Pageviews** - Total page views this month
- **Unique Visitors** - Different people using it
- **Countries** - Where visitors are from
- **Response Times** - How fast pages load (should be < 1 sec)
- **Status** - Any errors? (should be 0)

**Good signs**:
- ✅ Pageviews increasing
- ✅ Multiple unique visitors
- ✅ Response time < 1 second
- ✅ No errors

**Warning signs**:
- 🚨 Response time > 5 seconds - database too slow
- 🚨 Error rate > 1% - something's broken
- 🚨 No visitors - link might be broken or unknown

---

### Checking Supabase Health

To verify your database is healthy:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click your HubDash project
3. Click **"Database"** → **"Replication"**

Check:
- ✅ Replication status - Should show "Healthy" in green
- ✅ Write activity - Should show recent writes from syncs
- ✅ No error messages

If you see warnings:
- Usually auto-resolves within minutes
- If persists > 1 hour, contact Supabase support

---

## Quick Reference: Common Commands

### Check if Supabase has data

```bash
# Go to Supabase → SQL Editor, paste this:
SELECT COUNT(*) as device_count FROM devices;
SELECT COUNT(*) as donation_count FROM donations;
SELECT COUNT(*) as partner_count FROM partners;
```

### Manually add a test device

```sql
INSERT INTO devices (
  serial_number, model, manufacturer, status, location
) VALUES (
  'TEST-' || now()::text, 'Test Device', 'Test Corp', 'ready', 'Test Location'
);
```

### Check sync status

- Go to `hubdash.hubzonetech.org/admin`
- Check the "Last Sync" timestamp
- Should be recent (within last hour if auto-sync enabled)

### Restart the application

**On Vercel**:
1. Go to Deployments
2. Click the latest deployment
3. Click "Redeploy"
4. Wait 2-5 minutes

**The app doesn't need to be "restarted" - Vercel handles it automatically**

---

## Getting Help

**Issue templates**:

Email support with this format:

```
TO: will@hubzonetech.org
SUBJECT: HubDash Issue - [Brief description]

DETAILS:
========
What happened: [Describe the problem]
When it happened: [Date/time]
What you expected: [What should have happened]
Steps to reproduce: [How to recreate the issue]

SCREENSHOT:
[Include screenshot if possible - press F12 for errors]

CONTEXT:
[Were you using the board? Ops? Admin?]
[Were you adding data? Viewing? Filtering?]
```

---

## Resources

- **Dashboard**: https://hubdash.hubzonetech.org
- **Board**: https://hubdash.hubzonetech.org/board
- **Ops Hub**: https://hubdash.hubzonetech.org/ops
- **Admin**: https://hubdash.hubzonetech.org/admin
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Knack App**: https://hti.knack.com/hearts

---

**Last Updated**: November 4, 2025
**HubDash Version**: 1.0 (Full Backend Integration)
**Maintenance Status**: Ready for HTI Operations Team
