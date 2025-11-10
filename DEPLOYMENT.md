# Deployment Guide - HubDash to Vercel

**A complete guide to deploying HubDash to production on Vercel with Supabase backend.**

This guide is for HTI team members who want to deploy HubDash to the live domain: `hubdash.hubzonetech.org`

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Deployment](#step-by-step-deployment)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Domain Configuration](#domain-configuration)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

Before deploying, you'll need:

- **GitHub account** with access to the HubDash repository
- **Vercel account** (free tier works, but Pro recommended for HTI)
- **Supabase project** already set up with database
- **Knack API credentials** (if using Knack integration)
- **Domain access** to `hubdash.hubzonetech.org`

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

Ensure all changes are committed and pushed to the `main` branch:

```bash
cd /Volumes/Ext-code/GitHub\ Repos/hubdash

# Check status
git status

# Add all changes
git add .

# Commit with clear message
git commit -m "Ready for production deployment - [YYYY-MM-DD]"

# Push to GitHub
git push origin main
```

**Important**: Only the `main` branch automatically deploys to production. Feature branches deploy to preview URLs.

---

### Step 2: Connect Repository to Vercel

If not already connected:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for "hubdash"
5. Click **"Import"**
6. Vercel auto-detects it's a Next.js project
7. Click **"Deploy"** (we'll add env vars in the next step)

---

### Step 3: Add Environment Variables to Vercel

**Never store secrets in code or GitHub!** Vercel stores them securely.

1. In the Vercel dashboard, go to your **hubdash** project
2. Click **"Settings"** (gear icon at top)
3. Click **"Environment Variables"** in the sidebar
4. Add each variable below (one at a time)

#### Required Variables

**Supabase Configuration**:
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (longer)
```

**Optional: Knack Integration**:
```
KNACK_APP_ID = 5a1b2c3d4e5f6g7h8i9j0k
KNACK_API_KEY = 00112233-4455-6677-8899-aabbccddeeff
```

**How to find these values**:

**Supabase**:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click your project
3. Go to **Settings** → **API**
4. Copy the values

**Knack**:
1. Go to https://builder.knack.com/hearts
2. Click **Settings** (gear icon)
3. Go to **API & Code**
4. Copy the Application ID and API Key

#### Environment Variable Scope

For each variable, set the scope to:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

This ensures consistency across all environments.

---

### Step 4: Redeploy with Environment Variables

1. In Vercel, click the **"Deployments"** tab
2. Find your latest deployment
3. Click the **three dots** menu
4. Click **"Redeploy"**
5. Wait 2-5 minutes for build to complete
6. You should see "✓ Ready" when done

---

### Step 5: Test the Deployment

Once deployed, test all features:

**Board Dashboard**:
- Go to `https://hubdash.vercel.app/board`
- Check if metrics are loading (should show real numbers, not "Loading...")
- Try hovering over cards for animations

**Operations Hub**:
- Go to `https://hubdash.vercel.app/ops`
- Check if device pipeline shows real data
- Try searching the inventory table

If metrics show "Loading...", check the [Troubleshooting](#troubleshooting) section.

---

## Environment Variables Setup

### Where to Find Credentials

#### Supabase

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click your HubDash project
3. Click **"Settings"** in the left sidebar
4. Click **"API"**

You'll see:
- **Project URL**: Copy to `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public key**: Copy to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key**: Copy to `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**Example**:
```
NEXT_PUBLIC_SUPABASE_URL = https://abc123xyz789.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5ejc4OSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk3NzAwMDAwLCJleHAiOjE5OTcwMDAwMDB9.xAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5ejc4OSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2OTc3MDAwMDAsImV4cCI6MTk5NzAwMDAwMH0.xAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj
```

#### Knack

1. Open [https://builder.knack.com/hearts](https://builder.knack.com/hearts)
2. Log in with HTI credentials
3. Click **"Settings"** (gear icon, top right)
4. Click **"API & Code"**

You'll see:
- **Application ID**: Copy to `KNACK_APP_ID`
- **REST API Key**: Copy to `KNACK_API_KEY`

**Example**:
```
KNACK_APP_ID = 5a1b2c3d4e5f6g7h8i9j0k
KNACK_API_KEY = 00112233-4455-6677-8899-aabbccddeeff
```

---

## Domain Configuration

### Setting Up Custom Domain

To use `hubdash.hubzonetech.org`:

#### 1. Add Domain to Vercel

1. In Vercel dashboard, click your **hubdash** project
2. Go to **Settings** → **Domains**
3. Type `hubdash.hubzonetech.org` in the input field
4. Click **"Add"**
5. Vercel will show your DNS records to configure

#### 2. Configure DNS Records

You'll need to update your domain registrar (where you bought hubzonetech.org):

**Two options**:

**Option A: Using Vercel's Nameservers (Recommended)**
- Change your domain's nameservers to Vercel's
- This gives Vercel full control of DNS
- Simplest for non-technical users

**Option B: Using CNAME Record**
- Add a CNAME record pointing to Vercel
- Requires access to your DNS provider
- More technical but keeps other DNS records

**What to do**:
1. Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Find the DNS settings for `hubzonetech.org`
3. Follow Vercel's instructions (they provide the exact records needed)
4. Wait 24-48 hours for DNS propagation

**To verify it's working**:
```bash
# In terminal, run:
nslookup hubdash.hubzonetech.org

# Should return Vercel's IP address
```

#### 3. SSL Certificate

Vercel automatically provisions an SSL certificate from Let's Encrypt (free).

- ✅ HTTPS enabled automatically
- ✅ Certificate renews automatically
- ✅ No additional action needed

---

## Monitoring & Logging

### Vercel Dashboard

Monitor your deployment in real-time:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **hubdash** project
3. Click the **"Analytics"** tab

You'll see:
- **Page views** - How many people are using it
- **Unique visitors** - Different users
- **Response time** - How fast pages load
- **Status** - Any errors?

### Viewing Logs

To see what happened during deployment or when errors occur:

1. In Vercel dashboard, click **"Deployments"**
2. Click on the deployment you want to inspect
3. Click the **"Runtime Logs"** tab
4. See all console logs from the application

### Application Errors

If something goes wrong in the app:

1. Open DevTools in your browser (F12)
2. Click the **"Console"** tab
3. Look for red error messages
4. Screenshot the error
5. Share with the development team

### Database Issues

If data isn't showing:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click your project
3. Click **"Database"** → **"Tables"**
4. Check if tables have data:
   - `devices` - Should have devices
   - `donations` - Should have donation requests
   - `partners` - Should have partner organizations
5. If empty, may need to trigger a sync from Knack

---

## Troubleshooting

### Common Issues & Solutions

#### Dashboard shows "Loading..." forever

**Cause**: Environment variables not set correctly or Supabase is down.

**Fix**:
1. Check Vercel has the correct `NEXT_PUBLIC_SUPABASE_URL`
2. Verify the URL is correct (should be `https://xxxxx.supabase.co`)
3. Check Supabase is online: [https://status.supabase.com](https://status.supabase.com)
4. Redeploy: Vercel → Deployments → Right-click latest → Redeploy

---

#### "Failed to fetch metrics" error

**Cause**: API route can't access Supabase.

**Fix**:
1. Check both `NEXT_PUBLIC_SUPABASE_URL` AND `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Make sure both have the correct values
3. Go to Supabase → SQL Editor → run a test query to verify database is working
4. Restart the deployment (Vercel → Deployments → Redeploy)

---

#### Domain not working (`hubdash.hubzonetech.org` shows "Site Not Found")

**Cause**: DNS records not configured yet.

**Fix**:
1. Wait 24-48 hours for DNS to propagate
2. Test with: `nslookup hubdash.hubzonetech.org`
3. If still not working, check your DNS provider's settings match Vercel's requirements
4. Contact your domain registrar support if needed

---

#### Deployment fails with "Build error"

**Cause**: Code has TypeScript errors or missing dependencies.

**Fix**:
1. Check Vercel's error logs (Deployments → click failed deployment → Runtime Logs)
2. Run locally to verify: `npm run build`
3. Fix any errors shown
4. Commit and push to main: `git push origin main`
5. Vercel will auto-redeploy

---

#### Data not syncing from Knack

**Cause**: Sync hasn't been triggered, or credentials are wrong.

**Fix**:
1. Check Knack credentials are correct: `KNACK_APP_ID` and `KNACK_API_KEY`
2. Go to `/admin` page and click "Trigger Full Sync"
3. Check the results in the admin page
4. See [MAINTENANCE.md](./MAINTENANCE.md) for manual sync instructions

---

### Getting Help

If you're stuck:

1. **Check the logs**:
   - Browser DevTools Console (F12 → Console tab)
   - Vercel deployment logs (Deployments → Runtime Logs)
   - Supabase logs (Database activity)

2. **Check the docs**:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Backend issues
   - [KNACK_SETUP.md](./KNACK_SETUP.md) - Data sync issues
   - [MAINTENANCE.md](./MAINTENANCE.md) - Daily operations

3. **Contact support**:
   - Email: will@hubzonetech.org
   - Include error messages and screenshots

---

## Rollback Procedures

If something goes wrong in production:

### Quick Rollback (Under 2 minutes)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **hubdash** project
3. Click the **"Deployments"** tab
4. Find a previous working deployment
5. Click the three dots menu
6. Click **"Promote to Production"**
7. Dashboard will roll back to that version

### Complete Rollback (Via Git)

If you need to revert code changes:

```bash
# See recent commits
git log --oneline -10

# Revert to previous commit (replace HASH with actual commit hash)
git revert HASH

# Push to GitHub
git push origin main

# Vercel will auto-deploy the reverted code
```

---

## Deployment Checklist

Use this before deploying to production:

```
PRE-DEPLOYMENT CHECKLIST
========================

Code Quality:
☐ npm run build passes locally
☐ No TypeScript errors
☐ All new features tested locally
☐ Code reviewed by another team member

Environment Setup:
☐ All Supabase env vars added to Vercel
☐ All Knack env vars added (if using integration)
☐ Domain DNS records configured

Testing:
☐ Board dashboard loads and shows real metrics
☐ Operations hub shows real device data
☐ Search/filters work
☐ Admin sync page accessible
☐ Activity feed updates in real-time

Monitoring Setup:
☐ Vercel analytics dashboard accessible
☐ Team knows how to check logs
☐ Rollback procedures documented
☐ Contact info shared with team

Final Steps:
☐ Git commit with clear message
☐ Push to main branch
☐ Verify deployment in Vercel
☐ Test live URL
☐ Announce to HTI team that deployment is live
```

---

## Production Best Practices

Once live, follow these practices:

### Daily

- Check Vercel dashboard for errors
- Verify data is syncing from Knack (check activity feed)
- Monitor response times (Vercel Analytics)

### Weekly

- Review deployment logs for any warnings
- Test all major features
- Check database size in Supabase

### Monthly

- Review analytics (usage patterns, popular features)
- Plan any optimizations or new features
- Update team on system health

### Quarterly

- Review security (check for vulnerability alerts)
- Test disaster recovery (database backups)
- Plan next phase enhancements

---

## Need Help?

**Deployment Questions**: will@hubzonetech.org

**Vercel Support**: https://vercel.com/help

**Supabase Support**: https://supabase.com/support

---

**Last Updated**: November 4, 2025
**HubDash Version**: 1.0 (Full Backend Integration)
**Deployment Status**: Production-Ready
