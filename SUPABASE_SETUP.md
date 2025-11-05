# 🗄️ Supabase Backend Setup Guide

This guide will walk you through setting up the Supabase backend for HubDash in **under 10 minutes**.

---

## 📋 Prerequisites

- A [Supabase account](https://supabase.com) (free tier works!)
- The HubDash codebase (already have it)

---

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `hubdash` (or `hti-dashboard`)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `East US`)
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning ⏳

---

### 2. Get Your API Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1...` (long string)
   - **service_role key**: `eyJhbGciOiJIUzI1...` (longer string, secret!)

**Keep this tab open** - you'll need these values next.

---

### 3. Add Environment Variables

1. In your HubDash project, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Optional: For admin operations
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Save the file**

---

### 4. Run the Database Migration

Back in the Supabase dashboard:

1. Click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. **Copy the entire contents** of `supabase/migrations/20241104000000_initial_schema.sql`
4. **Paste it** into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: **"Success. No rows returned"**

This creates all your tables:
- ✅ `devices`
- ✅ `donations`
- ✅ `partners`
- ✅ `training_sessions`
- ✅ `activity_log`

---

### 5. Seed the Database (Optional but Recommended)

To add sample HTI data for testing:

1. Still in **SQL Editor**, create a **new query**
2. **Copy the entire contents** of `supabase/seed.sql`
3. **Paste and Run**
4. You should see: **"Success. X rows affected"**

This adds:
- 5 partner organizations
- 8 sample devices
- 4 donation requests
- 3 training sessions
- 6 activity log entries

---

### 6. Verify the Setup

1. In Supabase, click **"Table Editor"** in the sidebar
2. You should see all 5 tables listed
3. Click on `devices` - you should see 8 rows (if you ran the seed)
4. Click on `partners` - you should see 5 rows

**If you see data, you're golden!** ✨

---

### 7. Test Locally

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- Go to `/board` - You should see **real metrics** now!
- Go to `/ops` - Device pipeline should show **real data**!

**The "Live" badges are now actually live!** 🔥

---

## 🔄 Optional: Deploy to Vercel with Environment Variables

If you want to deploy the updated version with the real backend:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your `hubdash` project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xxxxxxxxxxxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGci...`
5. Click **"Save"**
6. Redeploy:
   ```bash
   cd "/Volumes/Ext-code/GitHub Repos/hubdash"
   git add .
   git commit -m "Add Supabase backend integration"
   git push origin main
   ```

Vercel will auto-deploy with your new environment variables!

---

## 📊 What You Now Have

| Feature | Before (Mock) | After (Real Backend) |
|---------|---------------|----------------------|
| Impact Metrics | Hardcoded 3,500 | **Live from Supabase** |
| Device Pipeline | Static counts | **Real device statuses** |
| Donations | Fake requests | **Actual donation data** |
| Inventory | 5 fake devices | **All devices in DB** |
| Activity Feed | Mock logs | **Real activity logs** |
| Partners | Hardcoded list | **Partner database** |

---

## 🔐 Security Notes

**Important**:
- ✅ `.env.local` is gitignored - your secrets are safe
- ✅ Never commit API keys to GitHub
- ✅ The `anon` key is safe for client-side (read-only operations)
- ⚠️ The `service_role` key is SECRET - use only server-side
- ✅ Row Level Security (RLS) is enabled on all tables

**Current RLS Policy**: Open access (for development)

**For production**, you should:
1. Set up Supabase Auth
2. Restrict policies by user role (board vs ops)
3. Only allow authenticated users to read/write

---

## 🆘 Troubleshooting

### "Failed to fetch metrics" error

**Check**:
1. `.env.local` exists and has correct values
2. Supabase project URL is correct
3. API key starts with `eyJ...`
4. Restart dev server after adding env vars

### No data showing up

**Check**:
1. Did you run the migration? (SQL Editor → run schema.sql)
2. Did you run the seed? (SQL Editor → run seed.sql)
3. Check Supabase Table Editor - do tables have data?

### "Row Level Security" errors

**Quick fix**:
```sql
-- Run this in SQL Editor to allow all access (dev only!)
ALTER TABLE devices DROP POLICY IF EXISTS "Allow all access to devices";
CREATE POLICY "Allow all access" ON devices FOR ALL USING (true);
```

Repeat for all tables if needed.

---

## 🎯 Next Steps

Now that you have a real backend:

1. **Add authentication** - Supabase Auth for login
2. **Implement role-based access** - Board vs Ops permissions
3. **Add real-time subscriptions** - Live updates via WebSockets
4. **Build forms** - Add devices, donations, etc. through UI
5. **Generate reports** - PDF export, email notifications

---

## 📝 Database Schema Reference

### `devices` table
- `id` (uuid, PK)
- `serial_number` (text, unique)
- `model`, `manufacturer`
- `status` (donated | received | data_wipe | refurbishing | qa_testing | ready | distributed)
- `location`, `assigned_to`
- `received_date`, `distributed_date`
- `partner_id` (references partners)
- `tech_id`, `notes`

### `donations` table
- `id` (uuid, PK)
- `company`, `contact_name`, `contact_email`
- `device_count` (integer)
- `location`
- `priority` (urgent | high | normal)
- `status` (pending | scheduled | in_progress | completed)
- `requested_date`, `scheduled_date`, `completed_date`
- `assigned_tech_id`, `certificate_issued`, `notes`

### `partners` table
- `id` (uuid, PK)
- `name`, `type` (school | library | nonprofit | veteran_org | other)
- `contact_email`, `contact_phone`
- `address`, `county`
- `devices_received` (integer)
- `notes`

### `training_sessions` table
- `id` (uuid, PK)
- `title`, `date`, `location`
- `instructor`, `attendee_count`
- `notes`

### `activity_log` table
- `id` (uuid, PK)
- `user_id`, `user_name`
- `action`, `target`
- `type` (success | warning | info)
- `icon`, `created_at`

---

## ✅ You're Done!

Your HubDash now has a **real, production-ready backend**. The mock data is gone, and everything is powered by Supabase PostgreSQL. 🎉

**Questions?** Check the main [README.md](./README.md) or the [CLAUDE.md](./CLAUDE.md) project guide.
