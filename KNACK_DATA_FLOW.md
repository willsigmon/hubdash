# Knack Data Flow Documentation

Complete guide to how data flows from Knack through HubDash to the user interface.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         KNACK DATABASE                           │
│                    (Source of Truth)                             │
│                                                                   │
│  • Devices (object_7)                                            │
│  • Organizations (object_22)                                     │
│  • Donations (object_63)                                         │
│  • Partnerships (object_55)                                      │
│  • Recipients (object_62)                                        │
│  • Activity (object_5)                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ REST API (getRecords, updateRecord)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      KNACK CLIENT LAYER                          │
│                   (src/lib/knack/client.ts)                      │
│                                                                   │
│  • Handles authentication (API keys)                             │
│  • Encodes filters internally                                    │
│  • Type-safe query options                                       │
│  • Error handling & retries                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Structured queries
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    FIELD MAPPING LAYER                           │
│                  (src/lib/knack/field-map.ts)                    │
│                                                                   │
│  • Centralized field ID configuration                            │
│  • Environment-based overrides                                   │
│  • Normalizes Knack choice fields                                │
│  • Handles date parsing                                          │
│  • Warns when fields are missing                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Normalized data
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      API ROUTE LAYER                             │
│                   (src/app/api/*/route.ts)                       │
│                                                                   │
│  • /api/devices - Paginated device inventory                     │
│  • /api/metrics - Aggregated dashboard metrics                   │
│  • /api/donations - Donation requests (GET/PUT)                  │
│  • /api/partnerships - Partnership applications (GET/PUT)        │
│  • /api/activity - Activity feed                                 │
│  • /api/partners - Organization list                             │
│  • /api/recipients - Individual recipients                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ JSON responses
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      CACHE LAYER                                 │
│                (src/lib/knack/cache-manager.ts)                  │
│                                                                   │
│  • Server-side in-memory cache                                   │
│  • Configurable TTL (30s - 10min)                                │
│  • Rate limiting (10 req/sec)                                    │
│  • Cache key factory                                             │
│  • Invalidation on mutations                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Cached JSON
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    REACT QUERY LAYER                             │
│                   (src/lib/query-client.ts)                      │
│                                                                   │
│  • Client-side caching (2-10min stale time)                      │
│  • Automatic refetching                                          │
│  • Request deduplication                                         │
│  • Optimistic updates                                            │
│  • Background revalidation                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ React hooks
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      REACT COMPONENTS                            │
│                    (src/components/*)                            │
│                                                                   │
│  • useMetrics() - Dashboard KPIs                                 │
│  • useDevices() - Inventory table                                │
│  • usePartnerships() - Marketing hub                             │
│  • useActivity() - Activity feeds                                │
│  • Mutations for updates (donations, partnerships)               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Loading Device Inventory

1. **User opens `/ops` page**
   - `InventoryOverview` component mounts
   - Calls `useDevices(page=1, limit=25, status=undefined)`

2. **React Query checks cache**
   - Cache key: `['devices', 'paginated', 1, 25, undefined]`
   - If fresh (< 5min), return cached data immediately
   - If stale, return cached data + refetch in background

3. **API request to `/api/devices`**
   - Query params: `?page=1&limit=25`
   - Server-side cache check (TTL: 5min)
   - If cache miss, fetch from Knack

4. **Knack Client query**
   - Builds request: `GET /v1/objects/object_7/records?rows_per_page=25&page=1`
   - Includes auth headers (`X-Knack-Application-Id`, `X-Knack-REST-API-Key`)
   - Handles rate limiting (10 req/sec)

5. **Field mapping & transformation**
   - Extract `field_201_raw` → `serial_number`
   - Extract `field_58_raw` → `model`
   - Extract `field_56_raw` → `status`
   - Validate dates to prevent Invalid Date errors

6. **Response cached & returned**
   - Server cache: 5min TTL
   - React Query cache: 5min stale time
   - Component receives `{ data: Device[], pagination: {...} }`

7. **Component renders**
   - Maps devices to table rows
   - Applies client-side search filtering
   - Handles pagination with `setCurrentPage()`

### Example 2: Updating Donation Status

1. **User clicks "Schedule Pickup" button**
   - `DonationRequests` component calls mutation
   - `updateMutation.mutate({ id, status: 'scheduled' })`

2. **Mutation function executes**
   - `PUT /api/donations/[id]`
   - Body: `{ status: 'scheduled' }`

3. **API route processes request**
   - Loads donation field map from env
   - Maps `status` → `field_700` (or configured field)
   - Validates status value

4. **Knack Client update**
   - `PUT /v1/objects/object_63/records/[id]`
   - Body: `{ field_700: 'scheduled' }`
   - Returns updated record

5. **Cache invalidation**
   - Server cache cleared for `api:donations:all`
   - React Query invalidates `['donations']`

6. **UI updates**
   - React Query refetches donation list
   - Component re-renders with new status
   - User sees "Scheduled" badge

## Field Mapping System

### Configuration

Field mappings are centralized in `src/lib/knack/field-map.ts` and configured via environment variables:

```bash
# Donation fields
KNACK_DONATION_STATUS_FIELD=field_700
KNACK_DONATION_PRIORITY_FIELD=field_701
KNACK_DONATION_NOTES_FIELD=field_702

# Partnership fields
KNACK_PARTNERSHIP_STATUS_FIELD=field_679
KNACK_PARTNERSHIP_NOTES_FIELD=field_680

# Activity fields
KNACK_ACTIVITY_USER_FIELD=field_100
KNACK_ACTIVITY_ACTION_FIELD=field_101
KNACK_ACTIVITY_TARGET_FIELD=field_102
```

### Usage

```typescript
import { getDonationFieldMap, readKnackField, normalizeKnackChoice } from '@/lib/knack/field-map'

const fields = getDonationFieldMap()

// Read a field value (tries field_XXX_raw, then field_XXX)
const statusValue = readKnackField(record, fields.status)

// Normalize Knack choice fields (handles arrays, objects, strings)
const normalized = normalizeKnackChoice(statusValue)
// Returns: "pending" | "scheduled" | "completed" | undefined
```

### Field Discovery

Use the discovery script to find your Knack field IDs:

```bash
npm run discover-fields
```

This script:
1. Connects to your Knack database
2. Fetches sample records from each object
3. Lists all field IDs with preview values
4. Suggests mappings based on field content

## Cache Strategy

### Server-Side Cache (In-Memory)

| Endpoint | TTL | Reason |
|----------|-----|--------|
| `/api/metrics` | 5min | Aggregations are expensive |
| `/api/devices` | 5min | Device data changes infrequently |
| `/api/donations` | 5min | Donation requests are semi-static |
| `/api/partnerships` | 5min | Applications reviewed periodically |
| `/api/activity` | 90s | Activity feed should be relatively fresh |
| `/api/partners` | 10min | Organization list is mostly static |

### Client-Side Cache (React Query)

| Hook | Stale Time | GC Time | Refetch Interval |
|------|------------|---------|------------------|
| `useMetrics()` | 2min | 5min | - |
| `useDevices()` | 5min | 10min | - |
| `usePartnerships()` | 5min | 10min | - |
| `useActivity()` | 30s | 2min | 60s (auto) |
| `usePartners()` | 10min | 15min | - |

### Cache Invalidation

Mutations automatically invalidate related caches:

```typescript
// After updating a donation
queryClient.invalidateQueries({ queryKey: ['donations'] })

// After updating a partnership
queryClient.invalidateQueries({ queryKey: ['partnerships'] })
```

## Error Handling

### Knack API Errors

1. **401 Unauthorized**
   - Check `KNACK_APP_ID` and `KNACK_API_KEY`
   - Verify API key has proper permissions

2. **404 Not Found**
   - Check object key (e.g., `KNACK_DEVICES_OBJECT=object_7`)
   - Verify record ID exists

3. **429 Rate Limit**
   - Cache manager enforces 10 req/sec
   - Exponential backoff with retries

4. **500 Server Error**
   - Log error details
   - Return fallback data when available
   - Show user-friendly error message

### Field Mapping Warnings

When a field is not configured, the system:
1. Logs a warning to console
2. Falls back to common field names (`status_raw`, `field_status_raw`)
3. Uses safe defaults (e.g., `status: 'pending'`)

Example warning:
```
⚠️  Knack donation field "status" is not configured.
    Set KNACK_DONATION_STATUS_FIELD in .env.local to enable accurate data.
```

## Performance Optimization

### Pagination

- Default page size: 25 records
- Max page size: 500 records (for exports)
- Status filtering happens server-side
- Search filtering happens client-side

### Request Deduplication

React Query automatically deduplicates identical requests:
- Multiple components calling `useMetrics()` → single API call
- Cached result shared across all consumers

### Background Revalidation

Stale data is served immediately while fresh data loads in background:
1. User sees cached data instantly (< 1ms)
2. Fresh data fetched in background
3. UI updates when new data arrives

## Troubleshooting

### Data not updating

1. Check server cache TTL - may need to wait for expiration
2. Check React Query stale time - data may be considered fresh
3. Verify mutation invalidates correct cache keys
4. Check browser DevTools → Network tab for API calls

### Wrong field values

1. Run `npm run discover-fields` to verify field IDs
2. Check `.env.local` has correct `KNACK_*_FIELD` variables
3. Look for field mapping warnings in console
4. Verify Knack object has expected fields

### Performance issues

1. Check cache hit rate in server logs
2. Verify pagination is working (not fetching all records)
3. Check Knack API response times
4. Consider increasing cache TTL for static data

## Future Enhancements

### Planned Improvements

1. **Webhook Integration**
   - Real-time updates from Knack
   - Instant cache invalidation
   - WebSocket push to clients

2. **Persistent Cache**
   - Redis or Supabase for server cache
   - Survives server restarts
   - Shared across Vercel instances

3. **Field Auto-Discovery**
   - Automatic field mapping on first run
   - AI-powered field matching
   - Interactive configuration wizard

4. **Offline Support**
   - IndexedDB for client cache
   - Queue mutations when offline
   - Sync when connection restored

5. **Advanced Filtering**
   - Complex filter builder UI
   - Saved filter presets
   - Filter sharing via URL params

## Related Documentation

- [KNACK_SETUP.md](./KNACK_SETUP.md) - Initial Knack configuration
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Environment variable reference
- [CLAUDE.md](./CLAUDE.md) - Project overview for AI assistants
- [README.md](./README.md) - General project documentation

## Support

For issues with Knack integration:
1. Check console warnings for missing field mappings
2. Run `npm run discover-fields` to verify configuration
3. Review this document for data flow understanding
4. Check Knack Builder for object/field structure changes
