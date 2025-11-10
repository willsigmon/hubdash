# HubDash Performance Optimizations - Code Examples
**Copy-paste ready code for all optimizations**

---

## 1. Add Missing Cache Header to /api/devices

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/devices/route.ts`
**Line**: 51

```typescript
// REPLACE THIS:
return NextResponse.json(devices)

// WITH THIS:
return NextResponse.json(devices, {
  headers: { 'Cache-Control': 'public, s-maxage=300' }
})
```

---

## 2. Reduce Animation Re-renders in ImpactMetrics

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/components/board/ImpactMetrics.tsx`

```typescript
// ADD THIS IMPORT at the top:
import { useEffect, useState, useRef } from "react";

// CHANGE LINE 95-96:
// FROM:
const duration = 2000; // 2 seconds
const steps = 60;

// TO:
const duration = 2000; // 2 seconds
const steps = 30; // Reduced from 60 to 30

// ADD THIS after line 20:
const hasAnimated = useRef(false);

// CHANGE LINE 92 (the entire useEffect):
// FROM:
useEffect(() => {
  if (metrics.length === 0) return;

  const duration = 2000;
  const steps = 60;
  const interval = duration / steps;

  metrics.forEach((metric, index) => {
    // ... animation code
  });
}, [metrics]);

// TO:
useEffect(() => {
  if (metrics.length === 0 || hasAnimated.current) return;
  hasAnimated.current = true; // Only animate once

  const duration = 2000;
  const steps = 30; // Reduced from 60
  const interval = duration / steps;

  metrics.forEach((metric, index) => {
    let currentStep = 0;
    const increment = metric.value / steps;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValues((prev) => {
        const newValues = [...prev];
        newValues[index] = Math.min(
          Math.floor(increment * currentStep),
          metric.value
        );
        return newValues;
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
  });

  // Animate grant progress bar
  const grantMetric = metrics[0];
  if (grantMetric.progress !== undefined) {
    let currentStep = 0;
    const increment = grantMetric.progress / steps;

    const progressTimer = setInterval(() => {
      currentStep++;
      setAnimatedProgress(
        Math.min(Math.floor(increment * currentStep), grantMetric.progress || 0)
      );

      if (currentStep >= steps) {
        clearInterval(progressTimer);
      }
    }, interval);
  }
}, [metrics]);
```

---

## 3. Install and Configure React Query

**Step 1**: Install the package

```bash
npm install @tanstack/react-query
```

**Step 2**: Create Query Client wrapper

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/lib/query-client.ts` (NEW FILE)

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

**Step 3**: Update Root Layout

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/layout.tsx`

```typescript
// ADD THIS IMPORT at the top:
"use client";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { useState } from 'react';

// REPLACE the entire export default function:
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Create client in useState to ensure it's only created once per request
  const [client] = useState(() => queryClient);

  return (
    <html lang="en">
      <head>
        <title>HubDash - HTI Dashboard System</title>
        <meta name="description" content="HTI's dual-dashboard system for board members and operations team" />
      </head>
      <body>
        <QueryClientProvider client={client}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**Step 4**: Update ImpactMetrics to use React Query

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/components/board/ImpactMetrics.tsx`

```typescript
// REPLACE LINE 1:
"use client";

// WITH:
"use client";
import { useQuery } from '@tanstack/react-query';

// REPLACE THE ENTIRE useEffect at LINE 22-90:
// FROM:
useEffect(() => {
  fetch('/api/metrics')
    .then(res => res.json())
    .then(data => {
      // ... metric building logic
      setMetrics(metricsData);
      setAnimatedValues(metricsData.map(() => 0));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    });
}, []);

// TO:
const { data: apiData, isLoading: isLoadingQuery, error } = useQuery({
  queryKey: ['metrics'],
  queryFn: async () => {
    const res = await fetch('/api/metrics');
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },
});

useEffect(() => {
  if (!apiData) return;

  const grantProgress = Math.round(((apiData.grantLaptopsPresented || 0) / (apiData.grantLaptopGoal || 1500)) * 100);

  const metricsData: Metric[] = [
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
    {
      label: "Total Laptops (All-Time)",
      value: apiData.totalLaptopsCollected || 0,
      suffix: "+",
      icon: "💻",
      color: "from-gray-600 to-gray-400",
      description: "Overall collection since inception",
    },
    {
      label: "Counties Served",
      value: apiData.countiesServed || 0,
      suffix: "",
      icon: "📍",
      color: "from-hti-red to-orange-400",
      description: "Through Digital Champion Grant",
    },
    {
      label: "People Trained",
      value: apiData.peopleTrained || 0,
      suffix: "+",
      icon: "👥",
      color: "from-hti-yellow to-yellow-300",
      description: "Digital literacy participants",
    },
    {
      label: "E-Waste Diverted",
      value: apiData.eWasteTons || 0,
      suffix: " tons",
      icon: "♻️",
      color: "from-green-600 to-green-400",
      description: "Kept out of landfills",
    },
    {
      label: "Partner Organizations",
      value: apiData.partnerOrganizations || 0,
      suffix: "",
      icon: "🤝",
      color: "from-purple-600 to-purple-400",
      description: "Community collaborations",
    },
  ];

  setMetrics(metricsData);
  setAnimatedValues(metricsData.map(() => 0));
  setLoading(false);
}, [apiData]);

// ALSO CHANGE LINE 139 (loading check):
// FROM:
if (loading) {

// TO:
if (isLoadingQuery || loading) {
```

---

## 4. Optimize /api/metrics - Combine Queries

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/metrics/route.ts`

**Replace the ENTIRE export async function GET():**

```typescript
import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const GRANT_START_DATE = new Date('2024-09-08T00:00:00.000Z');

    // Fetch devices and organizations in PARALLEL (not sequential)
    const [devices, organizations] = await Promise.all([
      knack.getRecords(
        process.env.KNACK_DEVICES_OBJECT || 'object_7',
        { rows_per_page: 1000 }
      ),
      knack.getRecords(
        process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22',
        { rows_per_page: 1000 }
      )
    ]);

    // Calculate grant count IN-MEMORY (no extra API call)
    const grantPresentedCount = devices.filter((d: any) => {
      if (d.field_458_raw !== 'Laptop') return false;
      if (d.field_56_raw !== 'Completed-Presented') return false;

      const presentedDate = d.field_75_raw?.iso_timestamp || d.field_75_raw;
      if (!presentedDate) return false;

      return new Date(presentedDate) > GRANT_START_DATE;
    }).length;

    const totalCollected = devices.length;

    // Extract counties
    const countiesSet = new Set();
    organizations.forEach((org: any) => {
      if (org.field_613_raw && Array.isArray(org.field_613_raw) && org.field_613_raw.length > 0) {
        countiesSet.add(org.field_613_raw[0].identifier || org.field_613_raw[0].id);
      } else if (typeof org.field_613_raw === 'string') {
        countiesSet.add(org.field_613_raw);
      }
    })

    // Count statuses
    const statusCounts: any = {}
    devices.forEach((device: any) => {
      const status = device.field_56_raw || 'Unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    const metrics = {
      // GRANT METRICS
      grantLaptopsPresented: grantPresentedCount,
      grantLaptopGoal: 1500,
      grantLaptopProgress: Math.round((grantPresentedCount / 1500) * 100),
      grantTrainingHoursGoal: 125,

      // OVERALL METRICS
      totalLaptopsCollected: totalCollected,
      totalChromebooksDistributed: 2271,
      countiesServed: countiesSet.size,
      peopleTrained: 0,
      eWasteTons: Math.round((totalCollected * 5) / 2000),
      partnerOrganizations: organizations.length,

      // Pipeline
      pipeline: {
        donated: statusCounts['Donated'] || 0,
        received: statusCounts['Received'] || 0,
        dataWipe: statusCounts['Data Wipe'] || 0,
        refurbishing: statusCounts['Refurbishing'] || 0,
        qaTesting: statusCounts['QA Testing'] || 0,
        ready: statusCounts['Ready'] || 0,
        distributed: 2271,
      },
      inPipeline: totalCollected - 2271,
      readyToShip: statusCounts['Ready'] || 0,
    }

    return NextResponse.json(metrics, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

**Benefits**:
- Reduced from 3 API calls to 2 API calls (33% reduction)
- Parallel fetching (faster response)
- Grant count calculated in-memory

---

## 5. Add Server-Side Caching Layer

**Step 1**: Create Cache Manager

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/lib/knack/cache-manager.ts` (NEW FILE)

```typescript
import { KnackCacheOptimizer } from './cache';

const cache = new KnackCacheOptimizer();

interface CachedResponse<T> {
  data: T;
  timestamp: number;
}

export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try cache first
  const cached = cache.getCached<T>(key);
  if (cached) {
    console.log(`✅ Cache HIT: ${key}`);
    return cached;
  }

  // Cache miss - fetch and store
  console.log(`❌ Cache MISS: ${key}`);
  try {
    const data = await fetchFn();
    cache.cacheResults(key, data, ttlSeconds);
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw error;
  }
}

export function invalidateCache(key: string) {
  console.log(`🗑️ Invalidating cache: ${key}`);
  cache.clearCache(key);
}

export function clearAllCache() {
  console.log(`🗑️ Clearing ALL cache`);
  cache.clearAllCache();
}

export function getCacheStats() {
  return cache.getCacheStats();
}
```

**Step 2**: Wrap API routes with caching

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/metrics/route.ts`

```typescript
// ADD THIS IMPORT:
import { getCached } from '@/lib/knack/cache-manager';

// WRAP THE ENTIRE GET FUNCTION:
export async function GET() {
  return NextResponse.json(
    await getCached(
      'metrics:v1',
      async () => {
        const knack = getKnackClient()
        const GRANT_START_DATE = new Date('2024-09-08T00:00:00.000Z');

        // ... all your existing fetch and calculation logic

        return metrics; // Return the metrics object
      },
      300 // 5 minutes TTL
    ),
    {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    }
  );
}
```

**Step 3**: Apply to other API routes

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/partnerships/route.ts`

```typescript
import { getCached } from '@/lib/knack/cache-manager';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'

  const cacheKey = `partnerships:${filter}`;

  return NextResponse.json(
    await getCached(
      cacheKey,
      async () => {
        // ... existing fetch logic
        return filteredPartnerships;
      },
      300
    ),
    {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    }
  );
}
```

---

## 6. Add Pagination to /api/devices

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/devices/route.ts`

**Replace the entire file:**

```typescript
import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // Optional filter

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DEVICES_OBJECT || 'object_7';

    // Build filters
    const filters = [];
    if (status) {
      filters.push({ field: 'field_56', operator: 'is', value: status });
    }

    const knackRecords = await knack.getRecords(objectKey, {
      rows_per_page: limit,
      page: page,
      filters: filters.length > 0 ? JSON.stringify(filters) : undefined
    });

    const devices = knackRecords.map((r: any) => {
      // Extract assigned_to
      let assignedTo = null;
      if (r.field_147_raw && Array.isArray(r.field_147_raw) && r.field_147_raw.length > 0) {
        assignedTo = r.field_147_raw[0].identifier || r.field_147_raw[0].id;
      }

      // Extract received_date
      let receivedDate = new Date().toISOString();
      if (r.field_60_raw) {
        if (typeof r.field_60_raw === 'string') {
          receivedDate = r.field_60_raw;
        } else if (r.field_60_raw.iso_timestamp) {
          receivedDate = r.field_60_raw.iso_timestamp;
        }
      }

      // Extract distributed_date
      let distributedDate = null;
      if (r.field_75_raw) {
        if (typeof r.field_75_raw === 'string') {
          distributedDate = r.field_75_raw;
        } else if (r.field_75_raw.iso_timestamp) {
          distributedDate = r.field_75_raw.iso_timestamp;
        }
      }

      return {
        id: r.id,
        serial_number: r.field_201_raw || `HTI-${r.field_142_raw || r.id}`,
        model: r.field_58_raw || 'Unknown',
        manufacturer: r.field_57_raw || 'Unknown',
        status: r.field_56_raw || 'Unknown',
        location: r.field_66_raw || 'Unknown',
        assigned_to: assignedTo,
        received_date: receivedDate,
        distributed_date: distributedDate,
        notes: r.field_40_raw || null,
      };
    });

    return NextResponse.json({
      data: devices,
      pagination: {
        page,
        limit,
        hasMore: devices.length === limit,
        total: devices.length
      }
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300' }
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Step 2**: Update InventoryOverview component

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/components/ops/InventoryOverview.tsx`

```typescript
// ADD THESE IMPORTS:
import { useState } from "react";

// REPLACE THE useEffect and state:
const [devices, setDevices] = useState<Device[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch(`/api/devices?page=1&limit=50`)
    .then(res => res.json())
    .then(data => {
      setDevices(data.data);
      setHasMore(data.pagination.hasMore);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error loading devices:', error);
      setLoading(false);
    });
}, []);

const loadMore = () => {
  if (!hasMore || loadingMore) return;

  setLoadingMore(true);
  const nextPage = page + 1;

  fetch(`/api/devices?page=${nextPage}&limit=50`)
    .then(res => res.json())
    .then(data => {
      setDevices(prev => [...prev, ...data.data]);
      setHasMore(data.pagination.hasMore);
      setPage(nextPage);
      setLoadingMore(false);
    })
    .catch(error => {
      console.error('Error loading more devices:', error);
      setLoadingMore(false);
    });
};

// ADD LOAD MORE BUTTON at the end of the component (before closing </div>):
{!loading && hasMore && (
  <div className="mt-6 text-center">
    <button
      onClick={loadMore}
      disabled={loadingMore}
      className="px-6 py-3 bg-hti-teal hover:bg-hti-teal-light text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingMore ? 'Loading...' : `Load More Devices (${devices.length} shown)`}
    </button>
  </div>
)}
```

---

## 7. Add Cache Stats Monitoring Endpoint

**File**: `/Volumes/Ext-code/GitHub Repos/hubdash/src/app/api/cache-stats/route.ts` (NEW FILE)

```typescript
import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/knack/cache-manager';

export async function GET() {
  const stats = getCacheStats();

  return NextResponse.json({
    cacheSize: stats.size,
    entries: stats.entries,
    timestamp: new Date().toISOString()
  });
}
```

**Access at**: `http://localhost:3000/api/cache-stats`

---

## Testing Commands

After implementing changes, test with:

```bash
# 1. Build to check for errors
npm run build

# 2. Start dev server
npm run dev

# 3. Test API endpoints
curl http://localhost:3000/api/metrics
curl http://localhost:3000/api/devices?page=1&limit=50
curl http://localhost:3000/api/cache-stats

# 4. Check cache headers
curl -I http://localhost:3000/api/metrics

# 5. Load test (install k6 first: brew install k6)
k6 run --vus 10 --duration 30s loadtest.js
```

---

## Load Test Script

**File**: `loadtest.js` (NEW FILE in project root)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 10 },  // Stay at 10 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
};

export default function () {
  // Test metrics endpoint
  const metricsRes = http.get('http://localhost:3000/api/metrics');
  check(metricsRes, {
    'metrics status is 200': (r) => r.status === 200,
    'metrics response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test devices endpoint
  const devicesRes = http.get('http://localhost:3000/api/devices?page=1&limit=50');
  check(devicesRes, {
    'devices status is 200': (r) => r.status === 200,
    'devices response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(2);
}
```

**Run with**:
```bash
k6 run loadtest.js
```

---

## Verification Checklist

After implementing all changes:

- [ ] npm run build passes with no errors
- [ ] All API routes return 200 status codes
- [ ] Cache-Control headers present on all API routes
- [ ] React Query shows cache hits in browser DevTools (Network tab)
- [ ] ImpactMetrics animates smoothly (no stuttering)
- [ ] Load more button works on devices page
- [ ] Cache stats endpoint returns valid data
- [ ] Load test shows <1s response times
- [ ] No Knack 429 rate limit errors under load
- [ ] Board dashboard loads in <1.5 seconds
- [ ] Marketing hub loads in <1 second

---

**Implementation Time Estimate**: 4-6 hours for all changes
**Expected Performance Gain**: 60-70% faster page loads
**Expected API Call Reduction**: 67% fewer Knack API calls
