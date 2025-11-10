# 🔗 Knack Integration Setup Guide

**HubDash uses a hybrid architecture: Knack (source of truth) + Supabase (fast cache)**

---

## 📋 What You Need

1. **Knack Application ID** (`X-Knack-Application-Id`)
2. **Knack REST API Key** (`X-Knack-REST-API-Key`)
3. Knack object names (we can auto-discover these)

---

## 🔑 Step 1: Get Your Knack API Credentials

### **Option A: From Knack Builder (Recommended)**

1. **Log into your Knack app**:
   - Go to https://hti.knack.com/hearts
   - Email: `wsigmon@hubzonetech.org`
   - Password: `QTW5ndc.bhr_drp_bae`

2. **Open the Knack Builder**:
   - Look for a "Builder" or "Edit" button in your app
   - Or go directly to: https://builder.knack.com/hearts

3. **Get API Credentials**:
   - Click **Settings** (gear icon) in the top right
   - Go to **API & Code** section
   - You'll see two keys:
     - **Application ID**: Looks like `5a1b2c3d4e5f6g7h8i9j0k`
     - **API Key**: Looks like `00112233-4455-6677-8899-aabbccddeeff`

4. **Copy both values** - you'll need them in Step 2

---

### **Option B: From Knack Account Settings**

1. Go to https://www.knack.com/
2. Log in with your HTI account
3. Click your account name (top right) → **Account Settings**
4. Go to **Applications** → Find "HEARTS" app
5. Click **API & Code**
6. Copy the **Application ID** and **API Key**

---

## 🚀 Step 2: Add Credentials to HubDash

1. **Create `.env.local` file** in the HubDash project:
   ```bash
   cd /Volumes/Ext-code/GitHub\ Repos/hubdash
   cp .env.local.example .env.local
   ```

2. **Open `.env.local` and add your Knack credentials**:
   ```env
   # Knack API Credentials
   KNACK_APP_ID=your-application-id-here
   KNACK_API_KEY=your-api-key-here
   ```

3. **Save the file**

---

## 🗺️ Step 3: Map Knack Objects (Optional)

Knack stores data in "objects" (like tables). HTI's objects might be named:
- `object_1` - Devices/Laptops
- `object_2` - Donations
- `object_3` - Partners
- Etc.

### **Option A: Let HubDash Auto-Discover**
- Skip this step
- HubDash will attempt to auto-discover objects when you first sync

### **Option B: Manually Map Objects**

If you know your object names:

1. In Knack Builder, go to **Data** → **Records**
2. Note the object keys (e.g., `object_1`, `object_2`)
3. Add to `.env.local`:
   ```env
   KNACK_DEVICES_OBJECT=object_1
   KNACK_DONATIONS_OBJECT=object_2
   KNACK_PARTNERS_OBJECT=object_3
   KNACK_TRAINING_OBJECT=object_4
   KNACK_ACTIVITY_OBJECT=object_5
   ```

---

## 🔄 Step 4: Initial Sync

Once credentials are added:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Go to the Admin page**:
   - Open http://localhost:3000/admin
   - You'll see the Knack sync controls

3. **Trigger your first sync**:
   - Click **"🔄 Trigger Full Sync"**
   - This pulls data from Knack → Supabase cache
   - Takes 5-30 seconds depending on data volume

4. **Check the dashboards**:
   - Go to `/board` - Should show HTI's real metrics!
   - Go to `/ops` - Should show HTI's real devices!

---

## 🎯 Step 5: Field Mapping (If Needed)

If your Knack field names don't match the defaults, you'll need to update the field mapping in:

**File**: `src/lib/knack/sync.ts`

**Example**: If Knack uses `Device_Serial` instead of `serial_number`:

```typescript
// Find this in sync.ts:
serial_number: record.field_serial || record.serial_number || `KNACK-${record.id}`,

// Change to:
serial_number: record.Device_Serial || record.field_serial || `KNACK-${record.id}`,
```

**Common Knack field prefixes**:
- `field_xxx` - Standard fields
- `field_xxx_raw` - Raw field values
- Custom names (depends on how HTI set up Knack)

---

## 🔁 How Syncing Works

### **Hybrid Architecture**:
```
Knack (Source of Truth)
    ↓ Sync (manual or scheduled)
Supabase (Fast Cache)
    ↓ API calls
HubDash Frontend
```

### **Sync Strategies**:

1. **Manual Sync**:
   - Go to `/admin`
   - Click "Trigger Full Sync"
   - Use when you want to refresh data on-demand

2. **Scheduled Sync** (Coming Soon):
   - Automatic sync every 1 hour
   - Runs in background
   - Keeps dashboards up-to-date

3. **Real-Time Sync** (Future):
   - Knack webhooks → instant Supabase updates
   - No delay between Knack changes and dashboard

---

## 📊 Data Flow

**When you add a device in Knack**:
1. Device saved to Knack database ✅
2. Wait for next sync (manual or scheduled)
3. Sync pulls device from Knack → Supabase
4. Dashboard automatically shows new device!

**Benefits of caching**:
- ⚡ **Faster dashboards** - Supabase is super fast
- 📉 **Lower Knack API costs** - Fewer direct API calls
- 💪 **Reliability** - Dashboard works even if Knack is slow
- 🔄 **Flexibility** - Can add custom queries/analytics

---

## 🛠️ Troubleshooting

### **"Sync failed" error**

**Check**:
1. `.env.local` exists with correct Knack credentials
2. Knack App ID and API Key are correct (no typos)
3. API Key has proper permissions (read/write access)
4. Restart dev server after adding env vars:
   ```bash
   # Stop server (Ctrl+C), then:
   npm run dev
   ```

---

### **"Knack not configured" warning**

**Fix**:
- Make sure `.env.local` has `KNACK_APP_ID` and `KNACK_API_KEY`
- Values should be strings (no quotes needed in .env files)
- Example:
  ```env
  KNACK_APP_ID=5a1b2c3d4e5f6g7h8i9j0k
  KNACK_API_KEY=00112233-4455-6677-8899-aabbccddeeff
  ```

---

### **"No records synced" or "0 devices"**

**Check**:
1. Knack actually has data (log into https://hti.knack.com/hearts)
2. Object names are correct (`KNACK_DEVICES_OBJECT=object_X`)
3. Field mapping matches your Knack setup (see Step 5 above)
4. Check sync results in `/admin` for specific errors

---

### **Field mapping issues**

**Symptoms**:
- Devices show as "Unknown" model
- Missing serial numbers
- Wrong statuses

**Fix**:
1. Log into Knack Builder
2. Go to Data → Records → [Your Object]
3. Check actual field names
4. Update `src/lib/knack/sync.ts` with correct field names

---

## 🚀 Deployment (Vercel)

Once Knack integration works locally:

1. **Add env vars to Vercel**:
   - Go to https://vercel.com/dashboard
   - Select `hubdash` project
   - Settings → Environment Variables
   - Add:
     - `KNACK_APP_ID`
     - `KNACK_API_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (if not already added)

2. **Redeploy**:
   ```bash
   git add .
   git commit -m "Add Knack integration"
   git push origin main
   ```

3. **Trigger initial sync**:
   - Go to https://your-hubdash.vercel.app/admin
   - Click "Trigger Full Sync"
   - Dashboards now show live Knack data!

---

## 📞 Need Help?

**Can't find API credentials?**
- Email Knack support or check with your team admin
- The account owner can regenerate API keys if needed

**Field mapping issues?**
- Share a screenshot of your Knack data structure
- I can help update the sync.ts file

**Other issues?**
- Check the browser console for error messages
- Look in `/admin` sync results for detailed error info

---

## 🎯 Next Steps

Once Knack integration is working:

- [ ] Set up automatic scheduled syncing (cron job)
- [ ] Add Knack webhooks for real-time updates
- [ ] Create forms in HubDash to write back to Knack
- [ ] Add user authentication (Knack users → HubDash login)

---

**Built with 🔥 by Claude Code**
**Last Updated**: November 4, 2025
