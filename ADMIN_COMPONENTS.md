# Admin Dashboard Components Architecture

## Component Hierarchy

```
AdminPage (src/app/admin/page.tsx)
├── Header
│   ├── Title
│   ├── Subtitle
│   └── Back to Hub Link
│
├── Section: System Health
│   └── SystemHealthIndicator
│       ├── Knack Connection Status
│       │   ├── Connected/Disconnected indicator
│       │   ├── App ID preview
│       │   └── Link icon
│       │
│       └── Last Sync Status
│           ├── Timestamp (relative time)
│           ├── Status badge (Success/Failed/Partial)
│           └── Status icon
│
├── Section: Full System Sync
│   ├── Title & Description
│   ├── Trigger Full Sync Button
│   ├── Error Alert (if failed)
│   └── Results Grid (3 columns)
│       └── Result Cards (one per table)
│
├── Section: Individual Table Sync
│   └── TableSyncControls
│       ├── Devices Card
│       │   ├── Icon & Description
│       │   ├── Status from last sync
│       │   ├── Record count
│       │   ├── Error list (truncated)
│       │   └── Sync Button
│       ├── Donations Card
│       └── Partners Card
│
├── Section: Knack Object Discovery
│   └── ObjectDiscovery
│       ├── Discover Button
│       ├── Objects List (if discovered)
│       │   └── Expandable Object Card
│       │       ├── Object name & key
│       │       ├── Field count badge
│       │       └── Expanded Fields (on click)
│       │           └── Field Row (per field)
│       │               ├── Type badge
│       │               ├── Field name
│       │               └── Field key
│       └── Next Steps Guide
│
├── Section: Sync History
│   └── SyncHistoryTable
│       └── History Table (responsive)
│           ├── Headers
│           │   ├── Timestamp
│           │   ├── Status
│           │   ├── Total Records
│           │   ├── Duration
│           │   └── Tables
│           │
│           └── Table Rows (max 10)
│               ├── Formatted timestamp
│               ├── Status badge
│               ├── Record count
│               ├── Duration in seconds
│               └── Per-table breakdown
│
├── Section: Export & Backup
│   └── ExportControls
│       ├── Description
│       ├── JSON Export Card
│       │   ├── Format icon
│       │   ├── Label
│       │   ├── Description
│       │   └── Export Button (or spinner)
│       ├── CSV Export Card
│       │   └── (same structure as JSON)
│       ├── Status Message (success/error)
│       └── Helpful tip
│
├── Section: System Configuration
│   ├── Config Status List
│   │   ├── Knack App ID status
│   │   ├── Knack API Key status
│   │   ├── Supabase URL status
│   │   └── Supabase API Key status
│   │
│   └── Setup Instructions Box
│
└── Footer: Help & Resources
    ├── Help text
    └── HTI Website Link
```

## Component Props & States

### SystemHealthIndicator
```typescript
// State
{
  knackConnected: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'success' | 'failed' | 'partial' | null;
  appId: string;
}

// Methods
- checkHealth(): Promise<void>
- formatTime(isoString): string
- getStatusColor(status): string
- getStatusIcon(status): string
```

### SyncHistoryTable
```typescript
// State
{
  history: SyncHistoryEntry[];
  loading: boolean;
  error: string | null;
}

// Type Definitions
interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  totalRecords: number;
  tables: {
    name: string;
    records: number;
    status: 'success' | 'failed';
  }[];
}

// Methods
- fetchHistory(): Promise<void>
- formatTime(isoString): string
- getStatusBadge(status): ReactNode
```

### ObjectDiscovery
```typescript
// State
{
  discovering: boolean;
  objects: DiscoveredObject[];
  error: string | null;
  expandedObject: string | null;
}

// Type Definitions
interface KnackField {
  key: string;
  name: string;
  type: string;
}

interface DiscoveredObject {
  key: string;
  name: string;
  fieldCount: number;
  fields: KnackField[];
}

// Methods
- handleDiscover(): Promise<void>
- setExpandedObject(objectKey): void
```

### TableSyncControls
```typescript
// State
{
  syncing: { [key: string]: boolean };
  results: Map<string, SyncResult>;
  error: string | null;
}

// Type Definitions
interface SyncResult {
  table: string;
  success: boolean;
  recordsSynced: number;
  errors: string[];
}

// Constants
const TABLES = [
  { name: 'devices', label: 'Devices', icon: '💻', description: string },
  { name: 'donations', label: 'Donations', icon: '📦', description: string },
  { name: 'partners', label: 'Partners', icon: '🤝', description: string },
];

// Methods
- syncTable(tableName): Promise<void>
- getResultIcon(result): string | null
- getResultColor(result): string
```

### ExportControls
```typescript
// State
{
  exporting: { [key: string]: boolean };
  message: { type: 'success' | 'error'; text: string } | null;
}

// Type Definitions
interface ExportFormat {
  format: 'json' | 'csv';
  label: string;
  icon: string;
  description: string;
}

// Constants
const EXPORT_FORMATS: ExportFormat[] = [...]

// Methods
- handleExport(format): Promise<void>
```

## Data Flow Diagram

```
User Interaction
     ↓
Component Method
     ↓
API Fetch (GET/POST)
     ↓
API Route Handler
     ↓
Business Logic
│   ├── Knack Integration (/lib/knack/*)
│   └── Sync Operations (/lib/knack/sync.ts)
│
↓
Response JSON
     ↓
Component State Update (setState)
     ↓
UI Re-render
     ↓
localStorage Update (optional)
     ↓
Display to User
```

## Component Styling Patterns

### Card Container
```tsx
<div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-l-4 border-hti-teal">
  {/* Content */}
</div>
```

### Section Header
```tsx
<h2 className="text-2xl font-bold text-hti-navy mb-4 flex items-center gap-2">
  📋 Section Title
</h2>
```

### Status Badge
```tsx
<span className="px-3 py-1 text-xs font-medium rounded border
  bg-green-100 text-green-800 border-green-300">
  ✅ Success
</span>
```

### Primary Button
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-hti-teal to-hti-teal-light
  hover:shadow-lg disabled:bg-gray-400 text-white rounded-lg font-bold
  transition-all transform hover:scale-105 disabled:scale-100
  flex items-center gap-2">
  {/* Button content */}
</button>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Three-column grid on desktop, single column on mobile */}
</div>
```

### Responsive Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  {/* Centered content with responsive padding */}
</div>
```

## Local Storage Keys

Components use localStorage to persist state between reloads:

```typescript
// Set by admin page on sync
localStorage.setItem('lastSyncTime', new Date().toISOString());
localStorage.setItem('lastSyncStatus', 'success' | 'failed' | 'partial');

// Read by SystemHealthIndicator
const lastSync = localStorage.getItem('lastSyncTime');
const lastSyncStatus = localStorage.getItem('lastSyncStatus');

// Set by ObjectDiscovery
localStorage.setItem('lastDiscoveryTime', new Date().toISOString());
```

## API Response Shapes

### GET /api/sync
```json
{
  "timestamp": "2025-11-04T22:00:00Z",
  "totalRecordsSynced": 1250,
  "totalErrors": 0,
  "results": [
    {
      "table": "devices",
      "success": true,
      "recordsSynced": 450,
      "errors": []
    },
    {
      "table": "donations",
      "success": true,
      "recordsSynced": 380,
      "errors": []
    },
    {
      "table": "partners",
      "success": true,
      "recordsSynced": 420,
      "errors": []
    }
  ]
}
```

### POST /api/sync
```json
{
  "table": "devices",
  "success": true,
  "recordsSynced": 450,
  "errors": []
}
```

### GET /api/knack/discover
```json
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
        {
          "key": "field_1",
          "name": "Serial Number",
          "type": "text"
        }
      ]
    }
  ]
}
```

### GET /api/sync/history
```json
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
        {
          "name": "devices",
          "records": 450,
          "status": "success"
        }
      ]
    }
  ]
}
```

## Component Usage Examples

### Import all admin components
```typescript
import {
  SystemHealthIndicator,
  SyncHistoryTable,
  ObjectDiscovery,
  TableSyncControls,
  ExportControls,
} from "@/components/admin";
```

### Use in a page
```tsx
export default function AdminPage() {
  return (
    <main>
      <SystemHealthIndicator />
      <SyncHistoryTable />
      <ObjectDiscovery />
      <TableSyncControls />
      <ExportControls />
    </main>
  );
}
```

## Performance Considerations

1. **SystemHealthIndicator**: Auto-refresh every 30 seconds with setInterval cleanup
2. **SyncHistoryTable**: Fetches once on mount, consider caching if needed
3. **ObjectDiscovery**: Only fetches when user clicks "Discover" button
4. **TableSyncControls**: Individual table syncs don't block each other
5. **ExportControls**: Client-side export with Blob API (no server overhead)

## Accessibility Features

- Semantic HTML (main, section, header, button, table)
- Proper heading hierarchy (h1 → h2 → h3/h4)
- Color contrast meets WCAG AA standards
- Focus states on interactive elements
- Loading indicators for async operations
- Error messages with clear context
- Icons paired with text labels

---

**Admin Dashboard Component Architecture**
**Last Updated**: November 4, 2025
