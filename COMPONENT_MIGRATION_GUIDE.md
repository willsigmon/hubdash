# Component Migration Guide
**Converting Components to Use React Query Hooks**

---

## Quick Reference

### Available Hooks
```typescript
import {
  useMetrics,      // Board metrics (2 min cache)
  useDevices,      // Paginated devices (5 min cache)
  usePartnerships, // Partnership applications (5 min cache)
  usePartners,     // Partner organizations (10 min cache)
  useActivity,     // Activity feed (30 sec cache, auto-refetch)
} from '@/lib/hooks/useMetrics';
```

---

## Migration Examples

### 1. ImpactMetrics Component (Board Dashboard)

**Before**:
```typescript
"use client";
import { useEffect, useState } from "react";

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Skeleton />;
  // ... rest of component
}
```

**After**:
```typescript
"use client";
import { useMemo, useRef } from "react";
import { useMetrics } from '@/lib/hooks/useMetrics';

export default function ImpactMetrics() {
  const { data: apiData, isLoading, error } = useMetrics();
  const hasAnimated = useRef(false);

  // Memoize metrics transformation
  const metrics = useMemo(() => {
    if (!apiData) return [];

    const grantProgress = Math.round(
      ((apiData.grantLaptopsPresented || 0) / (apiData.grantLaptopGoal || 1500)) * 100
    );

    return [
      {
        label: "Grant Laptops Presented",
        value: apiData.grantLaptopsPresented || 0,
        suffix: ` / 1,500`,
        icon: "🎯",
        color: "from-hti-red to-orange-500",
        description: "Since Sept 9, 2024 (Grant Period)",
        isFeatured: true,
        progress: grantProgress,
      },
      // ... other metrics
    ];
  }, [apiData]);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  // ... rest of component with metrics
}
```

**Changes**:
- ✅ Removed `useState`, `useEffect`, manual fetch
- ✅ Added `useMetrics()` hook (1 line)
- ✅ Added `useMemo` for expensive calculations
- ✅ Automatic error handling
- ✅ Cached across component remounts

---

### 2. InventoryOverview Component (Operations Hub)

**Before**:
```typescript
"use client";
import { useEffect, useState } from "react";

export default function InventoryOverview() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => {
        setDevices(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  return <DeviceTable devices={devices} />;
}
```

**After (with pagination)**:
```typescript
"use client";
import { useState } from "react";
import { useDevices } from '@/lib/hooks/useMetrics';

export default function InventoryOverview() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const { data, isLoading, error } = useDevices(page, 50, statusFilter);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  const { data: devices, pagination } = data;

  return (
    <div>
      <DeviceTable devices={devices} />

      {/* Pagination controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {pagination.page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!pagination.hasMore}
        >
          Next
        </button>
      </div>

      {/* Status filter */}
      <select onChange={(e) => setStatusFilter(e.target.value || undefined)}>
        <option value="">All Status</option>
        <option value="Ready">Ready</option>
        <option value="Refurbishing">Refurbishing</option>
      </select>
    </div>
  );
}
```

**Changes**:
- ✅ Pagination support (50 records per page)
- ✅ Status filtering
- ✅ Cached responses (5 min TTL)
- ✅ Separate cache per page/filter combination

---

### 3. Marketing Hub (Partnership Applications)

**Before**:
```typescript
"use client";
import { useEffect, useState } from "react";

export default function MarketingHub() {
  const [partnerships, setPartnerships] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/partnerships?filter=${filter}`)
      .then(res => res.json())
      .then(data => {
        setPartnerships(data);
        setLoading(false);
      });
  }, [filter]); // Refetch on every filter change (expensive!)

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {loading ? <Spinner /> : <PartnershipList data={partnerships} />}
    </div>
  );
}
```

**After**:
```typescript
"use client";
import { useState } from "react";
import { usePartnerships } from '@/lib/hooks/useMetrics';

export default function MarketingHub() {
  const [filter, setFilter] = useState('all');

  const { data: partnerships, isLoading, error } = usePartnerships(filter);

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {isLoading ? <Spinner /> : <PartnershipList data={partnerships} />}
    </div>
  );
}
```

**Changes**:
- ✅ Filter changes now instant (cached)
- ✅ No refetch on every filter change
- ✅ React Query caches each filter separately
- ✅ **Before**: 3 API calls for 3 filters
- ✅ **After**: 3 API calls total (cached forever, or until 5 min expires)

---

### 4. Activity Feed (Real-Time Updates)

**Before**:
```typescript
"use client";
import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch once on mount
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  return <ActivityList activities={activities} />;
}
```

**After (with auto-refetch)**:
```typescript
"use client";
import { useActivity } from '@/lib/hooks/useMetrics';

export default function ActivityFeed() {
  const { data: activities, isLoading, error } = useActivity();
  // Auto-refetches every 60 seconds (configured in hook)

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return <ActivityList activities={activities} />;
}
```

**Changes**:
- ✅ Auto-refetch every 60 seconds
- ✅ 30 second stale time (semi-real-time)
- ✅ Background updates (no loading spinner on refetch)
- ✅ Can manually trigger refetch: `refetch()`

---

## Animation Optimization Pattern

### Reduce Animation Re-renders

**Before** (360 re-renders):
```typescript
const steps = 60; // Too many steps

useEffect(() => {
  metrics.forEach((metric, index) => {
    let currentStep = 0;
    const increment = metric.value / steps;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValues(prev => {
        const newValues = [...prev];
        newValues[index] = Math.min(
          Math.floor(increment * currentStep),
          metric.value
        );
        return newValues;
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);
  });
}, [metrics]); // Runs on every metrics change
```

**After** (0-180 re-renders):
```typescript
const steps = 30; // Reduced steps (still smooth)
const hasAnimated = useRef(false);

useEffect(() => {
  if (metrics.length === 0 || hasAnimated.current) return;

  hasAnimated.current = true; // Only animate once per session

  metrics.forEach((metric, index) => {
    let currentStep = 0;
    const increment = metric.value / steps;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValues(prev => {
        const newValues = [...prev];
        newValues[index] = Math.min(
          Math.floor(increment * currentStep),
          metric.value
        );
        return newValues;
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);
  });
}, [metrics]); // Still depends on metrics, but hasAnimated guards it
```

**Improvements**:
- ✅ 60 → 30 steps (50% fewer re-renders)
- ✅ Animation only on first visit
- ✅ Subsequent page visits show data instantly
- ✅ Still smooth animation experience

---

## Error Handling Patterns

### Basic Error Display
```typescript
const { data, isLoading, error } = useMetrics();

if (isLoading) return <Skeleton />;
if (error) return (
  <div className="text-red-600 p-4 rounded-lg bg-red-50">
    <h3 className="font-bold">Error loading data</h3>
    <p>{error.message}</p>
  </div>
);
```

### Advanced Error Handling with Retry
```typescript
const { data, isLoading, error, refetch } = useMetrics();

if (error) return (
  <div className="text-red-600 p-4 rounded-lg bg-red-50">
    <h3 className="font-bold">Error loading data</h3>
    <p>{error.message}</p>
    <button
      onClick={() => refetch()}
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
    >
      Retry
    </button>
  </div>
);
```

---

## Performance Tips

### 1. Use useMemo for Expensive Calculations
```typescript
const { data } = useMetrics();

// ✅ Good - memoized, only recalculates when data changes
const metrics = useMemo(() => {
  return transformApiData(data);
}, [data]);

// ❌ Bad - recalculates on every render
const metrics = transformApiData(data);
```

### 2. Use useCallback for Event Handlers
```typescript
const { data, refetch } = useMetrics();

// ✅ Good - stable function reference
const handleRefresh = useCallback(() => {
  refetch();
}, [refetch]);

// ❌ Bad - new function on every render
const handleRefresh = () => refetch();
```

### 3. Avoid Unnecessary Refetches
```typescript
// ✅ Good - refetch only when needed
const { data, refetch } = useMetrics();
<button onClick={() => refetch()}>Manual Refresh</button>

// ❌ Bad - refetch on every render
const { data } = useMetrics();
useEffect(() => {
  fetch('/api/metrics'); // Don't do this!
}, []);
```

---

## Testing Components

### Development Testing
```typescript
// 1. Check React Query DevTools (bottom-right in dev mode)
//    - See all queries and their cache status
//    - Verify data is cached between navigations

// 2. Network tab
//    - First load: Should see API calls
//    - Navigation away and back: No API calls (cached)
//    - After stale time: Background refetch

// 3. Console logs
//    - Look for "Cache HIT" vs "Cache MISS" logs
```

### Production Testing
```bash
# Build and test locally
npm run build
npm start

# Visit http://localhost:3000
# Check Network tab for cache headers:
#   Cache-Control: public, s-maxage=300, stale-while-revalidate=60
```

---

## Rollout Strategy

### Phase 1 (Complete) ✅
- [x] Install React Query
- [x] Create query client and provider
- [x] Optimize API routes with server-side caching
- [x] Create custom hooks

### Phase 2 (This Sprint)
- [ ] Update ImpactMetrics to use `useMetrics()`
- [ ] Update InventoryOverview to use `useDevices()` with pagination
- [ ] Update marketing hub to use `usePartnerships()`
- [ ] Update activity feeds to use `useActivity()`

### Phase 3 (Future)
- [ ] Add optimistic updates for mutations
- [ ] Implement infinite scroll for devices
- [ ] Add virtualization for large lists
- [ ] Create reusable error boundary components

---

## Common Issues & Solutions

### Issue: "Query client not found"
**Solution**: Ensure `<QueryProvider>` wraps your app in `layout.tsx`

### Issue: Data not updating
**Solution**: Check stale time - data may be cached. Use `refetch()` or wait for background refetch

### Issue: Multiple API calls on mount
**Solution**: Ensure you're using the hook, not manual `fetch()`. React Query deduplicates automatically.

### Issue: Build errors with React Query
**Solution**: Ensure component is marked as `"use client"` at the top

---

## Quick Win Checklist

For each component you migrate:
- [ ] Replace `fetch()` with appropriate hook
- [ ] Remove manual `useState` for data/loading
- [ ] Remove `useEffect` for fetching
- [ ] Add `useMemo` for expensive calculations
- [ ] Handle loading and error states
- [ ] Test caching (navigate away and back)
- [ ] Verify no duplicate API calls in Network tab

**Result**: ~70% less code, automatic caching, better UX!

---

**Need help?** Check:
- `/src/lib/hooks/useMetrics.ts` - Full TypeScript types
- `/src/lib/query-client.ts` - Cache configuration
- `PERFORMANCE_OPTIMIZATION_REPORT.md` - Full technical details
