# HubDash Utility Functions - Quick Reference Guide

## Date & Time Formatters

### Location
`/src/lib/utils/date-formatters.ts`

### Import
```typescript
import { formatDate, formatTimeAgo, formatDateLocale, formatTimeAgoShort } from "@/lib/utils/date-formatters"
```

### Functions

#### `formatDate(dateString: string): string`
Converts date to relative format or short date.

**Usage**:
```typescript
// In DonationRequests component
const displayDate = formatDate(request.requested_date)
// Returns: "Today", "Yesterday", "3 days ago", or "11/5/2025"
```

#### `formatTimeAgo(dateString: string): string`
Converts to relative time with full units.

**Usage**:
```typescript
// In ActivityFeed component
const timeAgo = formatTimeAgo(activity.created_at)
// Returns: "5 min ago", "2h ago", "3d ago"
```

#### `formatDateLocale(dateString: string): string`
Formats date in user's locale.

**Usage**:
```typescript
const localeDate = formatDateLocale(device.received_date)
// Returns: "11/5/2025" (or locale-specific equivalent)
```

#### `formatTimeAgoShort(dateString: string): string`
Short version for space-constrained UIs.

**Usage**:
```typescript
// In mobile or compact views
const shortTime = formatTimeAgoShort(activity.created_at)
// Returns: "5m", "2h", "3d"
```

---

## Status Colors & Labels

### Location
`/src/lib/utils/status-colors.ts`

### Import
```typescript
import {
  getDeviceStatusColor,
  getDeviceStatusLabel,
  getPriorityColor,
  getRequestStatusColor,
  getActivityTypeColor,
  DEVICE_STATUS_COLORS,
  PRIORITY_COLORS
} from "@/lib/utils/status-colors"
```

### Device Status

#### `getDeviceStatusColor(status: string): string`
Returns Tailwind classes for device status badge.

**Usage**:
```typescript
// In InventoryOverview component
<span className={`px-3 py-1 rounded-full border ${getDeviceStatusColor(device.status)}`}>
  {getDeviceStatusLabel(device.status)}
</span>
```

**Returns**:
- `"bg-green-500/20 text-green-400 border-green-500/30"` for "ready"
- `"bg-yellow-500/20 text-yellow-400 border-yellow-500/30"` for "qa_testing"
- `"bg-hti-teal/20 text-hti-teal border-hti-teal/30"` for "distributed"

#### `getDeviceStatusLabel(status: string): string`
Returns human-readable label for device status.

**Usage**:
```typescript
const label = getDeviceStatusLabel(device.status)
// Returns: "Ready to Ship", "QA Testing", "Data Wipe", etc.
```

### Priority Colors

#### `getPriorityColor(priority: string): string`
Returns color class for priority indicator.

**Usage**:
```typescript
// In DonationRequests component
<div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`} />
```

**Returns**:
- `"bg-red-500"` for "urgent"
- `"bg-orange-500"` for "high"
- `"bg-blue-500"` for "normal"

### Request/Donation Status

#### `getRequestStatusColor(status: string): string`
Returns color class for request status text.

**Usage**:
```typescript
// In DonationRequests component
<div className={`text-xs font-medium ${getRequestStatusColor(request.status)}`}>
  {request.status.replace('_', ' ')}
</div>
```

**Returns**:
- `"text-yellow-400"` for "pending"
- `"text-green-400"` for "scheduled"
- `"text-blue-400"` for "in_progress"

### Activity Type Colors

#### `getActivityTypeColor(type: string): string`
Returns color classes for activity items.

**Usage**:
```typescript
// In ActivityFeed component
<div className={`p-4 border-l-4 ${getActivityTypeColor(activity.type)}`}>
  {/* activity content */}
</div>
```

**Returns**:
- `"border-green-500/30 bg-green-500/5"` for "success"
- `"border-orange-500/30 bg-orange-500/5"` for "warning"
- `"border-blue-500/30 bg-blue-500/5"` for "info"

---

## Field Extraction Utilities

### Location
`/src/lib/knack/field-extractors.ts`

### Import
```typescript
import {
  extractString,
  extractEmail,
  extractPhone,
  extractAddress,
  extractDate,
  extractArray,
  extractNumber,
  extractBoolean,
  PARTNERSHIP_FIELDS,
  RECIPIENT_FIELDS,
  DEVICE_FIELDS,
  extractField,
  extractMultipleFields
} from "@/lib/knack/field-extractors"
```

### String Extraction

#### `extractString(field: any): string`
Safely extracts string from Knack field object.

**Usage**:
```typescript
// Handles null, undefined, objects with .text, .value, .display_value
const name = extractString(knackRecord.field_426)
// Returns: "Organization Name" or ""
```

### Specialized Extraction

#### `extractEmail(field: any): string`
Extracts and validates email.

**Usage**:
```typescript
const email = extractEmail(knackRecord.field_425)
// Returns: "contact@org.com" or ""
```

#### `extractPhone(field: any): string`
Extracts phone number.

**Usage**:
```typescript
const phone = extractPhone(knackRecord.field_428)
// Returns: "555-1234" or ""
```

#### `extractAddress(field: any): string`
Handles address objects or strings.

**Usage**:
```typescript
const address = extractAddress(knackRecord.field_429)
// Returns: "123 Main St, Raleigh, NC 27601" or ""
```

#### `extractDate(field: any): string`
Extracts and formats date as YYYY-MM-DD.

**Usage**:
```typescript
const date = extractDate(knackRecord.field_606)
// Returns: "2025-11-05" or ""
```

#### `extractArray(field: any): string[]`
Handles comma-separated strings, arrays, multiple select fields.

**Usage**:
```typescript
const struggles = extractArray(knackRecord.field_435)
// Returns: ["struggle1", "struggle2"] or []
```

### Numeric & Boolean

#### `extractNumber(field: any): number`
**Usage**:
```typescript
const count = extractNumber(knackRecord.field_432)
// Returns: 50 or 0
```

#### `extractBoolean(field: any): boolean`
Handles various truthy/falsy representations.

**Usage**:
```typescript
const is501c3 = extractBoolean(knackRecord.field_436)
// Returns: true or false
```

---

## Field Mappings

### Partnership Fields
```typescript
import { PARTNERSHIP_FIELDS } from "@/lib/knack/field-extractors"

const email = extractField(knackRecord, PARTNERSHIP_FIELDS.email)
const org = extractField(knackRecord, PARTNERSHIP_FIELDS.organizationName)
const chromebooks = extractNumber(knackRecord[PARTNERSHIP_FIELDS.chromebooksNeeded])
```

### Recipient Fields
```typescript
import { RECIPIENT_FIELDS } from "@/lib/knack/field-extractors"

const name = extractField(knackRecord, RECIPIENT_FIELDS.name)
const quote = extractField(knackRecord, RECIPIENT_FIELDS.quote)
const status = extractField(knackRecord, RECIPIENT_FIELDS.status)
```

### Device Fields
```typescript
import { DEVICE_FIELDS } from "@/lib/knack/field-extractors"

const serial = extractField(knackRecord, DEVICE_FIELDS.serialNumber)
const status = extractField(knackRecord, DEVICE_FIELDS.status)
```

---

## Common Patterns

### Pattern 1: Extract Partnership Data
```typescript
import { PARTNERSHIP_FIELDS, extractMultipleFields } from "@/lib/knack/field-extractors"

const partnershipData = extractMultipleFields(knackRecord, PARTNERSHIP_FIELDS)
// Returns: { email: "...", organizationName: "...", contactPerson: "...", ... }
```

### Pattern 2: Status Badge
```typescript
import { getDeviceStatusColor, getDeviceStatusLabel } from "@/lib/utils/status-colors"

<span className={`px-3 py-1 rounded-full border ${getDeviceStatusColor(device.status)}`}>
  {getDeviceStatusLabel(device.status)}
</span>
```

### Pattern 3: Activity Item
```typescript
import { formatTimeAgo, getActivityTypeColor } from "@/lib/utils"

<div className={`p-4 border-l-4 ${getActivityTypeColor(activity.type)}`}>
  <p>{activity.user} {activity.action}</p>
  <p className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</p>
</div>
```

### Pattern 4: Donation Request Item
```typescript
import { formatDate, getPriorityColor, getRequestStatusColor } from "@/lib/utils"

<div className={`border-l-4 ${getPriorityColor(request.priority) && 'bg-gray-800'}`}>
  <div className="flex justify-between">
    <h4>{request.company}</h4>
    <span className={`text-xs font-medium ${getRequestStatusColor(request.status)}`}>
      {request.status.replace('_', ' ')}
    </span>
  </div>
  <p className="text-xs text-gray-500">{formatDate(request.requested_date)}</p>
</div>
```

---

## Adding New Utilities

### To Add a Date Formatter
1. Add function to `/src/lib/utils/date-formatters.ts`
2. Export from `/src/lib/utils/index.ts`

### To Add Status Colors
1. Add constant to `/src/lib/utils/status-colors.ts`
2. Add getter function if needed
3. Export from `/src/lib/utils/index.ts`

### To Add Field Mappings
1. Add to appropriate constant in `/src/lib/knack/field-extractors.ts`
2. Already exported via `/src/lib/knack/index.ts`

---

## Tips

1. **Always use getters** instead of direct object access for better type safety
2. **Import from index files** for cleaner imports:
   ```typescript
   // Good
   import { formatDate, getDeviceStatusColor } from "@/lib/utils"

   // Also works
   import { formatDate } from "@/lib/utils/date-formatters"
   ```
3. **Field mappings are updateable** - change IDs in one place as Knack schema changes
4. **All functions handle null/undefined** - no need for extra null checks
5. **Use extractMultipleFields** for bulk data extraction from API responses

---

## See Also
- [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) - Overview of changes
- [src/lib/utils/](./src/lib/utils/) - Utility implementations
- [src/lib/knack/](./src/lib/knack/) - Knack field utilities
