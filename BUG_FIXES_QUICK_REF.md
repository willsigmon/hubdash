# Bug Fixes Quick Reference

## Critical Bugs - Fix Immediately

### 1. Division by Zero in Progress Calculations
**Files:** `ImpactMetrics.tsx`, `DevicePipeline.tsx`, `CountyMap.tsx`

```tsx
// ❌ BEFORE
const progress = (value / goal) * 100;

// ✅ AFTER
const progress = (value / Math.max(goal, 1)) * 100;
```

### 2. Missing API Response Validation
**Files:** All `/api/**/route.ts` files

```tsx
// ❌ BEFORE
const data = await knack.getRecords(objectKey)
const mapped = data.map(...)

// ✅ AFTER
const data = await knack.getRecords(objectKey)
if (!Array.isArray(data)) {
  return NextResponse.json({ error: 'Invalid data' }, { status: 500 })
}
const mapped = data.map(...)
```

### 3. Invalid Date Handling
**Files:** All API routes, multiple components

```tsx
// ❌ BEFORE
const date = new Date(dateString);

// ✅ AFTER
function safeParseDate(value: any): string {
  if (!value) return new Date().toISOString();
  const date = new Date(typeof value === 'string' ? value : value.iso_timestamp);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
```

### 4. parseInt Without Radix
**Files:** `donations/route.ts`, `partnerships/route.ts`

```tsx
// ❌ BEFORE
parseInt(value || '0')

// ✅ AFTER
parseInt(value || '0', 10)
```

### 5. Missing Null Guards in Filters
**Files:** `InventoryOverview.tsx`, `CountyMap.tsx`

```tsx
// ❌ BEFORE
devices.filter(d => d.name.toLowerCase().includes(query))

// ✅ AFTER
devices.filter(d => (d.name || '').toLowerCase().includes(query))
```

### 6. Environment Variable Validation
**File:** `lib/knack/client.ts`

```tsx
// ❌ BEFORE
if (!this.appId || !this.apiKey) {
  console.warn('Missing credentials');
}

// ✅ AFTER
if (!this.appId || !this.apiKey) {
  throw new Error('Knack credentials required');
}
```

---

## High Priority Bugs

### 7. Better Error Messages
All API routes:

```tsx
// ✅ AFTER
catch (error: any) {
  console.error('API Error:', error)
  const message = error?.message || error?.toString() || 'Unknown error'
  return NextResponse.json({ error: message }, { status: 500 })
}
```

### 8. ActivityFeed Memory Leak Fix

```tsx
// ✅ AFTER
let isMounted = true;
const interval = setInterval(() => {
  fetch('/api/activity')
    .then(res => res.json())
    .then(data => { if (isMounted) setActivities(data); })
}, 10000);
return () => {
  isMounted = false;
  clearInterval(interval);
};
```

### 9. Safe Array Operations

```tsx
// ✅ AFTER
const bottleneck = stagesData.length > 0
  ? Math.max(0, ...stagesData.slice(0, -1).map(s => s.count))
  : 0;
```

---

## Create Utility Functions

**File:** `/lib/knack/extractors.ts` (NEW FILE)

```tsx
export function extractString(field: any): string {
  if (!field) return '';
  return typeof field === 'string' ? field : field.toString();
}

export function extractEmail(field: any): string {
  if (!field) return '';
  return typeof field === 'string' ? field : (field.email || '');
}

export function extractDate(field: any): string {
  if (!field) return new Date().toISOString();
  const date = new Date(typeof field === 'string' ? field : field.iso_timestamp);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function extractConnection(field: any): string {
  if (!field) return 'Unknown';
  if (typeof field === 'string') return field;
  if (Array.isArray(field) && field.length > 0) {
    return field[0].identifier || field[0].id || 'Unknown';
  }
  return 'Unknown';
}

export function extractNumber(field: any, defaultValue: number = 0): number {
  if (!field) return defaultValue;
  const parsed = parseInt(field.toString(), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
```

---

## Files Needing Updates

### Critical (6 files)
1. `src/components/board/ImpactMetrics.tsx`
2. `src/components/ops/InventoryOverview.tsx`
3. `src/components/board/CountyMap.tsx`
4. `src/app/api/donations/route.ts`
5. `src/app/api/partnerships/route.ts`
6. `src/lib/knack/client.ts`

### High Priority (14 files)
- All 7 API route files
- `DevicePipeline.tsx`
- `DonationRequests.tsx`
- `ActivityFeed.tsx`
- `QuickStats.tsx`

### Medium (5 files)
- `CountyMap.tsx`
- `marketing/page.tsx`
- Metrics API (hardcoded values)

---

## Testing Checklist

After fixes:

- [ ] Test with empty data arrays
- [ ] Test with null/undefined values
- [ ] Test with invalid dates
- [ ] Test search with special characters
- [ ] Test division by zero scenarios
- [ ] Test API with malformed responses
- [ ] Test all filter combinations
- [ ] Test component unmounting during async operations

---

## Deployment Steps

1. Apply all CRITICAL fixes
2. Run `npm run build` - confirm passing
3. Test locally with real Knack data
4. Deploy to staging
5. Smoke test all routes
6. Deploy to production
7. Monitor error logs

---

**Total Bugs:** 21
**Must Fix:** 6 critical
**Should Fix:** 8 high priority
**Nice to Have:** 7 medium/low

**Build Status:** ✅ Passing (TypeScript clean)
**Runtime Safety:** ⚠️ Needs fixes before production load
