# Knack Quick Start Guide

**You're seeing "no data" because Knack credentials aren't configured yet.** Follow these steps to connect HubDash to your Knack database.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Knack Credentials

1. **Log into Knack Builder**: https://builder.knack.com/hearts
   - Email: `wsigmon@hubzonetech.org`
   - Password: `QTW5ndc.bhr_drp_bae`

2. **Get API Credentials**:
   - Click **Settings** (gear icon) → **API & Code**
   - Copy your **Application ID** (looks like: `5a1b2c3d4e5f6g7h8i9j0k`)
   - Copy your **API Key** (looks like: `00112233-4455-6677-8899-aabbccddeeff`)

### Step 2: Run Setup Script

```bash
cd /Volumes/Ext-code/GitHub\ Repos/hubdash
npm run setup-knack
```

This interactive script will:
- Create `.env.local` file
- Prompt you for API credentials
- Configure default object keys
- Save everything securely

### Step 3: Test Connection

```bash
npm run test-knack
```

This will verify:
- ✅ Credentials are valid
- ✅ Each Knack object is accessible
- ✅ Records can be fetched
- ⚠️  Identify any missing objects

### Step 4: Discover Field IDs

```bash
npm run discover-fields
```

This will:
- Show all fields in each Knack object
- Display sample values
- Suggest which fields to map
- Help you complete `.env.local`

### Step 5: Start Dev Server

```bash
npm run dev
```

Visit http://localhost:3000/board - you should now see **real Knack data**!

## 🔍 Troubleshooting

### "Knack integration not configured"

**Problem**: API routes return 503 errors

**Solution**:
```bash
# 1. Check if .env.local exists
ls -la .env.local

# 2. If missing, run setup
npm run setup-knack

# 3. Verify credentials are set
cat .env.local | grep KNACK_APP_ID
cat .env.local | grep KNACK_API_KEY

# 4. Restart dev server
npm run dev
```

### "Object not found" (404 errors)

**Problem**: Knack object keys don't match your app

**Solution**:
1. Log into Knack Builder
2. Go to **Data** → **Records**
3. Note the object keys (e.g., `object_7`, `object_22`)
4. Update `.env.local`:
   ```bash
   KNACK_DEVICES_OBJECT=object_7
   KNACK_ORGANIZATIONS_OBJECT=object_22
   # etc.
   ```
5. Restart dev server

### "Authentication failed" (401 errors)

**Problem**: API credentials are invalid

**Solution**:
1. Regenerate API key in Knack Builder
2. Update `.env.local` with new credentials
3. Run `npm run test-knack` to verify
4. Restart dev server

### "No records found" but Knack has data

**Problem**: Object keys are correct but no data returned

**Possible causes**:
1. **Filters are too restrictive** - Check field IDs in filters match your Knack schema
2. **API key lacks permissions** - Verify API key has read access in Knack settings
3. **Object is actually empty** - Verify records exist in Knack Builder

**Debug**:
```bash
# Check server logs for detailed error messages
npm run dev

# In another terminal, test the API directly
curl http://localhost:3000/api/devices

# Look for console output like:
# "📡 Fetching devices from Knack object object_7..."
# "✅ Received 0 records from Knack"
```

## 📊 Expected Data Flow

Once configured, you should see:

1. **Board Dashboard** (`/board`):
   - Real laptop counts
   - Actual counties served
   - Live grant progress
   - Partner organization count

2. **Operations Hub** (`/ops`):
   - Device inventory table with real devices
   - Pipeline stages with accurate counts
   - Donation requests from Knack
   - Activity feed (if configured)

3. **Marketing Hub** (`/marketing`):
   - Partnership applications
   - Filterable by status, county, etc.
   - Actionable workflows (approve/reject)

## 🎯 Field Mapping (Optional but Recommended)

After basic setup works, map specific fields for enhanced features:

```bash
# Run discovery
npm run discover-fields

# Add to .env.local based on output
KNACK_DONATION_STATUS_FIELD=field_700
KNACK_DONATION_PRIORITY_FIELD=field_701
KNACK_PARTNERSHIP_STATUS_FIELD=field_679
# etc.
```

This enables:
- ✅ Donation status updates (Schedule Pickup, Mark Complete)
- ✅ Partnership approval workflow
- ✅ Activity feed with real events
- ✅ Accurate status badges and filters

## 🆘 Still Not Working?

1. **Check Knack Builder**:
   - Can you see data in the Knack app itself?
   - Are the object keys correct?
   - Does your API key have permissions?

2. **Check Console Logs**:
   - Server terminal: Look for `❌` or `⚠️` messages
   - Browser console: Check for API errors

3. **Test Manually**:
   ```bash
   # Test API directly with curl
   curl -H "X-Knack-Application-Id: YOUR_APP_ID" \
        -H "X-Knack-REST-API-Key: YOUR_API_KEY" \
        "https://api.knack.com/v1/objects/object_7/records?rows_per_page=1"
   ```

4. **Contact Support**:
   - Share error messages from console
   - Share output from `npm run test-knack`
   - Verify Knack account is active

## 📚 Related Documentation

- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - All environment variables
- [KNACK_SETUP.md](./KNACK_SETUP.md) - Detailed setup guide
- [KNACK_DATA_FLOW.md](./KNACK_DATA_FLOW.md) - How data flows through the system

---

**Need help?** Run `npm run test-knack` and share the output!

