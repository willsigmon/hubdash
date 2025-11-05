# Admin Dashboard - Quick Reference Guide

## What Was Built

A comprehensive admin dashboard for HubDash with advanced controls, real-time monitoring, and data management features. All UI components use HTI branding (navy/teal colors) and are fully responsive.

## File Summary

### New Files Created (9 total)

```
src/
├── app/
│   ├── admin/page.tsx (UPDATED - 268 lines)
│   └── api/
│       ├── knack/
│       │   └── discover/route.ts (NEW - 53 lines)
│       └── sync/
│           └── history/route.ts (NEW - 73 lines)
│
└── components/
    └── admin/
        ├── SystemHealthIndicator.tsx (NEW - 144 lines)
        ├── SyncHistoryTable.tsx (NEW - 153 lines)
        ├── ObjectDiscovery.tsx (NEW - 172 lines)
        ├── TableSyncControls.tsx (NEW - 164 lines)
        ├── ExportControls.tsx (NEW - 160 lines)
        └── index.ts (NEW - 5 lines)

Documentation/
├── ADMIN_DASHBOARD_ENHANCEMENT.md (comprehensive guide)
├── ADMIN_COMPONENTS.md (architecture & structure)
└── ADMIN_DASHBOARD_QUICK_REFERENCE.md (this file)
```

## Core Features

### 1. System Health Monitoring
- Real-time Knack connection status
- Last sync time (with relative formatting: "5m ago", "2h ago")
- Last sync status (success/failed/partial)
- Auto-refreshes every 30 seconds
- **Component**: `SystemHealthIndicator`

### 2. Full System Sync
- Single button to sync all data sources
- Real-time progress feedback
- Per-table results with record counts and errors
- **Endpoint**: `GET /api/sync`
- **Trigger**: Click "🚀 Trigger Full Sync" button

### 3. Individual Table Sync
- Sync Devices, Donations, or Partners independently
- Show last sync result and record count
- Per-table error messages
- **Component**: `TableSyncControls`
- **Endpoint**: `POST /api/sync { table: "devices|donations|partners" }`

### 4. Knack Object Discovery
- Auto-discover Knack objects in your app
- View all fields with types
- See suggested field mappings to Supabase
- **Component**: `ObjectDiscovery`
- **Endpoint**: `GET /api/knack/discover`

### 5. Sync History
- Table showing last 10 syncs
- Timestamps, duration, record counts, status
- Per-table breakdown in each row
- **Component**: `SyncHistoryTable`
- **Endpoint**: `GET /api/sync/history`

### 6. Data Export
- Export sync data as JSON or CSV
- Automatic timestamped filenames
- Client-side download (no server storage)
- **Component**: `ExportControls`

### 7. System Configuration
- Visual status of all required environment variables
- Help text and documentation links
- Easy troubleshooting

## Color Scheme (HTI Branded)

```
Primary:     hti-navy (#1e3a5f)      - Headers, text, structure
Accent:      hti-teal (#4a9b9f)      - Buttons, interactive elements
Light:       hti-teal-light (#6db3b7) - Hover states, subtle accents

Status Colors:
Success:     Green backgrounds + text
Failed:      Red backgrounds + text
Partial:     Yellow backgrounds + text
```

## API Endpoints Reference

### GET /api/sync
Trigger a full sync of all tables.
```bash
curl https://yourdomain.com/api/sync

# Response
{
  "timestamp": "2025-11-04T22:00:00Z",
  "totalRecordsSynced": 1250,
  "totalErrors": 0,
  "results": [
    { "table": "devices", "success": true, "recordsSynced": 450, "errors": [] },
    { "table": "donations", "success": true, "recordsSynced": 380, "errors": [] },
    { "table": "partners", "success": true, "recordsSynced": 420, "errors": [] }
  ]
}
```

### POST /api/sync
Sync a specific table.
```bash
curl -X POST https://yourdomain.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{"table": "devices"}'

# Response
{
  "table": "devices",
  "success": true,
  "recordsSynced": 450,
  "errors": []
}
```

### GET /api/knack/discover
Discover Knack objects and fields.
```bash
curl https://yourdomain.com/api/knack/discover

# Response
{
  "success": true,
  "timestamp": "2025-11-04T22:00:00Z",
  "objectCount": 5,
  "objects": [
    {
      "key": "object_1",
      "name": "Devices",
      "fieldCount": 12,
      "fields": [
        { "key": "field_1", "name": "Serial Number", "type": "text" }
      ]
    }
  ]
}
```

### GET /api/sync/history
Get the last 10 sync operations.
```bash
curl https://yourdomain.com/api/sync/history

# Response
{
  "success": true,
  "count": 10,
  "history": [
    {
      "id": "sync-001",
      "timestamp": "2025-11-04T22:00:00Z",
      "duration": 45,
      "status": "success",
      "totalRecords": 1250,
      "tables": [
        { "name": "devices", "records": 450, "status": "success" }
      ]
    }
  ]
}
```

## Component Props Reference

All admin components are client-side (`"use client"`) and manage their own state.

### SystemHealthIndicator
```tsx
<SystemHealthIndicator />
// No props required
// Auto-fetches data and auto-refreshes every 30 seconds
```

### SyncHistoryTable
```tsx
<SyncHistoryTable />
// No props required
// Fetches from /api/sync/history on mount
```

### ObjectDiscovery
```tsx
<ObjectDiscovery />
// No props required
// User clicks button to trigger discovery
```

### TableSyncControls
```tsx
<TableSyncControls />
// No props required
// Has sync buttons for devices, donations, partners
```

### ExportControls
```tsx
<ExportControls />
// No props required
// Provides JSON and CSV export options
```

## How to Use

### View the Dashboard
1. Navigate to `/admin`
2. You'll see the enhanced admin dashboard with all new features

### Trigger a Full Sync
1. Scroll to "Full System Sync" section
2. Click "🚀 Trigger Full Sync" button
3. Wait for results to appear

### Sync Individual Tables
1. Scroll to "Individual Table Sync" section
2. Click the sync button on any table card (Devices, Donations, Partners)
3. See results in the same card

### Discover Knack Objects
1. Scroll to "Knack Object Discovery" section
2. Click "🔍 Discover Knack Objects" button
3. Click on object names to expand and see fields
4. Review suggested field mappings

### Check Sync History
1. Scroll to "Sync History" section
2. Review table of last 10 syncs
3. Click any timestamp for full details

### Export Data
1. Scroll to "Export & Backup" section
2. Choose JSON (for developers) or CSV (for analysis)
3. File downloads automatically with timestamp

### Check System Health
1. Look at top "System Health" section
2. See Knack connection status and last sync time
3. Status auto-updates every 30 seconds

## Responsive Design

All components work on:
- Mobile phones (320px+)
- Tablets (640px+)
- Laptops (768px+)
- Large displays (1024px+)

Layout adjusts automatically with proper spacing and text sizing.

## Local Storage Usage

The dashboard uses browser localStorage for:
- `lastSyncTime`: ISO timestamp of last sync
- `lastSyncStatus`: Current status (success/failed/partial)
- `lastDiscoveryTime`: When objects were last discovered

These persist between page reloads and help the SystemHealthIndicator display accurate data.

## Error Handling

Each component has:
- Loading states with spinner animations
- Error messages with context and next steps
- Empty state handling when no data available
- Graceful fallbacks for missing data

## Performance Optimizations

- Components use `useEffect` with proper cleanup
- Auto-refresh intervals are cleared on unmount
- Client-side exports use Blob API (no server overhead)
- History table fetches once (consider caching for real DB)
- Individual table syncs don't block each other

## Future Enhancements

Ready to add:
- Supabase database integration for sync history
- Real-time sync notifications
- Advanced analytics and trends
- Scheduled automated syncs
- Webhook monitoring
- User permissions and audit trails
- More export formats (PDF, Excel, etc.)

## Troubleshooting

### Knack Connection Shows Disconnected
- Check `KNACK_APP_ID` environment variable
- Verify `KNACK_API_KEY` is set
- See "System Configuration" section in dashboard

### Sync History Shows No Data
- This uses mock data for now
- Will use real Supabase data once database is integrated
- See `/api/sync/history/route.ts` for integration point

### Object Discovery Fails
- Ensure Knack credentials are configured
- Check `/lib/knack/client.ts` for API key setup
- Review Knack API documentation

### Export Not Working
- Try in Chrome or Firefox first
- Check browser's download settings
- Verify you have enough disk space

## Architecture Overview

```
Admin Page (React Component)
    ↓
5 Child Components (each with own state)
    ↓
4 API Routes (Next.js server)
    ↓
Business Logic (/lib/knack/*)
    ↓
Knack API + Supabase
    ↓
Response → Component State → UI Update
```

## Key Technologies Used

- **React 19+**: Hooks, client components
- **Next.js 15+**: App Router, API routes
- **TypeScript**: Full type safety
- **Tailwind CSS 4**: All styling
- **HTI Brand Colors**: Navy, teal, light teal
- **Responsive Design**: Mobile-first approach
- **LocalStorage**: Client-side persistence

## Files to Edit for Customization

- `/src/components/admin/TableSyncControls.tsx` - Add more tables
- `/src/components/admin/ExportControls.tsx` - Add more export formats
- `/src/app/admin/page.tsx` - Reorder sections or add new ones
- `/src/app/api/sync/history/route.ts` - Switch from mock to database data

## Documentation Files

- **ADMIN_DASHBOARD_ENHANCEMENT.md** - Complete implementation guide
- **ADMIN_COMPONENTS.md** - Architecture and component structure
- **ADMIN_DASHBOARD_QUICK_REFERENCE.md** - This file

---

**Admin Dashboard Quick Reference**
**Version**: 1.0
**Last Updated**: November 4, 2025
**HTI Project**: HubDash

For detailed information, see the comprehensive documentation files.
