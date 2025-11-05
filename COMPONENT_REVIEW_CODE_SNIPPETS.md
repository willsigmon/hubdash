# HubDash Component Review - Ready-to-Use Code Snippets

This file contains complete, copy-paste ready code implementations for the recommendations in the COMPONENT_REVIEW.md file.

---

## 1. ERROR BOUNDARY COMPONENT

**File**: Create `/src/components/shared/ErrorBoundary.tsx`

```typescript
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      `ErrorBoundary caught error in ${this.props.componentName || "component"}:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">Something went wrong</h3>
            <p className="text-sm text-red-700 mt-2">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            {this.props.componentName && (
              <p className="text-xs text-red-600 mt-2 font-mono">
                Component: {this.props.componentName}
              </p>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 2. ERROR MESSAGE COMPONENT

**File**: Create `/src/components/shared/ErrorMessage.tsx`

```typescript
"use client";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  isDark?: boolean;
}

export function ErrorMessage({
  error,
  onRetry,
  title = "Something went wrong",
  isDark = false,
}: ErrorMessageProps) {
  return (
    <div className={`rounded-xl border p-6 ${
      isDark
        ? "border-red-500/30 bg-red-500/5"
        : "border-red-200 bg-red-50"
    }`}>
      <h3 className={`font-semibold ${
        isDark ? "text-red-400" : "text-red-900"
      }`}>
        {title}
      </h3>
      <p className={`text-sm mt-2 ${
        isDark ? "text-red-300" : "text-red-700"
      }`}>
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`mt-4 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            isDark
              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
```

---

## 3. STAT CARD COMPONENT

**File**: Create `/src/components/shared/StatCard.tsx`

```typescript
"use client";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  description?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color: string;
  variant?: "light" | "dark";
  minHeight?: string;
  onClick?: () => void;
}

export function StatCard({
  icon,
  value,
  label,
  description,
  change,
  trend,
  color,
  variant = "light",
  minHeight = "min-h-[240px]",
  onClick,
}: StatCardProps) {
  const containerClasses = {
    light: "bg-white shadow-lg hover:shadow-2xl",
    dark: "bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl",
  };

  const textClasses = {
    light: {
      primary: "text-gray-900",
      secondary: "text-gray-700",
      tertiary: "text-gray-500",
    },
    dark: {
      primary: "text-white",
      secondary: "text-gray-400",
      tertiary: "text-gray-500",
    },
  };

  const opacityClasses = {
    light: "opacity-5 group-hover:opacity-10",
    dark: "opacity-10 group-hover:opacity-15",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl ${containerClasses[variant]}
                   transition-all duration-300 hover:scale-105 ${minHeight} flex flex-col
                   ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} ${opacityClasses[variant]}`} />

      {/* Content */}
      <div className="relative p-6 flex flex-col flex-1">
        {/* Header: Icon + Trend */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{icon}</div>

          {trend && (
            <div className={`text-xs font-medium flex items-center gap-1 ${
              trend === "up"
                ? "text-green-400"
                : trend === "down"
                ? "text-red-400"
                : "text-gray-400"
            }`}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
            </div>
          )}
        </div>

        {/* Value Section */}
        <div className="mb-2">
          <div className={`text-4xl font-bold mb-1 ${textClasses[variant].primary}`}>
            {value}
          </div>
          <div className={`text-sm font-medium ${textClasses[variant].secondary}`}>
            {label}
          </div>
        </div>

        {/* Description or Change */}
        {description && (
          <div className={`text-xs ${textClasses[variant].tertiary}`}>
            {description}
          </div>
        )}

        {change && (
          <div className={`text-xs mt-auto pt-2 ${textClasses[variant].tertiary}`}>
            {change}
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${color}`} />
    </div>
  );
}
```

**Usage**:
```typescript
import { StatCard } from "@/components/shared/StatCard";

// Light variant (Board Dashboard)
<StatCard
  icon="📊"
  value={1500}
  label="Grant Laptops"
  description="Since Sept 9, 2024"
  color="from-hti-red to-orange-500"
  variant="light"
/>

// Dark variant (Ops Dashboard)
<StatCard
  icon="⚡"
  value={245}
  label="In Pipeline"
  change="+12 today"
  trend="up"
  color="from-blue-600 to-blue-400"
  variant="dark"
/>
```

---

## 4. ACTIVITY ITEM COMPONENT

**File**: Create `/src/components/shared/ActivityItem.tsx`

```typescript
"use client";

interface ActivityItemProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  color?: string;
  metadata?: { label: string; value: string }[];
  variant?: "light" | "dark";
}

export function ActivityItem({
  id,
  icon,
  title,
  description,
  timestamp,
  color = "bg-hti-teal",
  metadata,
  variant = "light",
}: ActivityItemProps) {
  const containerClasses = {
    light: "hover:bg-gray-50 border-b border-gray-100",
    dark: "hover:bg-gray-750 border-l-2 border-blue-500/30 bg-blue-500/5",
  };

  const textClasses = {
    light: {
      title: "text-gray-900",
      description: "text-gray-600",
      metadata: "text-gray-500",
    },
    dark: {
      title: "text-white",
      description: "text-gray-400",
      metadata: "text-gray-500",
    },
  };

  return (
    <div key={id} className={`p-6 transition-colors ${containerClasses[variant]}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`${color} text-white p-3 rounded-lg text-2xl flex-shrink-0`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Timestamp */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className={`text-lg font-semibold ${textClasses[variant].title}`}>
              {title}
            </h3>
            <div className={`text-xs whitespace-nowrap ${textClasses[variant].metadata}`}>
              {timestamp}
            </div>
          </div>

          {/* Description */}
          <p className={`text-sm mb-2 ${textClasses[variant].description}`}>
            {description}
          </p>

          {/* Metadata */}
          {metadata && metadata.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              {metadata.map((item) => (
                <div key={item.label}>
                  <span className="font-medium">{item.label}:</span>{" "}
                  <span className={textClasses[variant].metadata}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Usage**:
```typescript
import { ActivityItem } from "@/components/shared/ActivityItem";

// Light variant (Board Dashboard)
<ActivityItem
  id="1"
  icon="🎯"
  title="50 Chromebooks Distributed"
  description="Henderson County Schools received devices for students in need"
  timestamp="2 hours ago"
  color="bg-hti-teal"
  variant="light"
/>

// Dark variant (Ops Dashboard)
<ActivityItem
  id="activity-123"
  icon="✅"
  title="John Smith scheduled pickup"
  description="Large corporate donation"
  timestamp="5 min ago"
  color="bg-green-500"
  variant="dark"
  metadata={[
    { label: "Company", value: "Acme Corp" },
    { label: "Devices", value: "75 laptops" },
  ]}
/>
```

---

## 5. COUNTER ANIMATION HOOK

**File**: Create `/src/hooks/useCounterAnimation.ts`

```typescript
import { useEffect, useState } from "react";

interface UseCounterAnimationOptions {
  duration?: number;
  steps?: number;
  enabled?: boolean;
}

export function useCounterAnimation(
  targetValue: number,
  options?: UseCounterAnimationOptions
) {
  const { duration = 2000, steps = 60, enabled = true } = options || {};
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled || targetValue <= 0) {
      setValue(targetValue);
      return;
    }

    const increment = targetValue / steps;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.min(
        Math.floor(increment * currentStep),
        targetValue
      );

      setValue(newValue);

      if (currentStep >= steps) {
        clearInterval(timer);
        setValue(targetValue); // Ensure exact target value
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetValue, duration, steps, enabled]);

  return value;
}
```

**Usage**:
```typescript
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  // Animate each metric
  {metrics.map((metric, index) => {
    const animatedValue = useCounterAnimation(metric.value);
    return (
      <div key={metric.label}>
        <div className="text-4xl font-bold">
          {animatedValue.toLocaleString()}
          <span className="text-2xl">{metric.suffix}</span>
        </div>
      </div>
    );
  })}
}
```

---

## 6. FETCH HOOK

**File**: Create `/src/hooks/useFetch.ts`

```typescript
import { useEffect, useState, useCallback } from "react";

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export function useFetch<T = any>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = (await response.json()) as T;
      setData(json);
      options?.onSuccess?.(json);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }
  }, [url, options?.immediate, fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset,
  };
}
```

**Usage**:
```typescript
import { useFetch } from "@/hooks/useFetch";

export default function ImpactMetrics() {
  const { data: rawData, loading, error, refetch } = useFetch<RawMetricsData>(
    "/api/metrics",
    {
      onError: (error) => console.error("Failed to load metrics:", error),
    }
  );

  const metrics = rawData ? transformMetrics(rawData) : [];

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error.message} onRetry={refetch} />;

  return <MetricsList metrics={metrics} />;
}
```

---

## 7. LOADING SKELETON COMPONENT

**File**: Create `/src/components/shared/LoadingSkeletons.tsx`

```typescript
"use client";

interface CardSkeletonProps {
  count?: number;
  variant?: "metric" | "stat" | "table" | "list" | "activity";
  className?: string;
}

export function CardSkeleton({
  count = 1,
  variant = "metric",
  className = "",
}: CardSkeletonProps) {
  const gridConfigs: Record<string, string> = {
    metric: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    stat: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    table: "grid-cols-1",
    list: "grid-cols-1",
    activity: "grid-cols-1",
  };

  const heightConfigs: Record<string, string> = {
    metric: "h-40",
    stat: "h-32",
    table: "h-16",
    list: "h-12",
    activity: "h-20",
  };

  return (
    <div
      className={`grid gap-6 ${gridConfigs[variant]} ${className}`}
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse ${heightConfigs[variant]}`}
        />
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gray-900/50 border-b border-gray-700 animate-pulse">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="bg-gray-700 h-4 rounded" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-700">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-6">
            <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, j) => (
                <div key={j} className="bg-gray-700 h-4 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PulseTextProps {
  lines?: number;
  className?: string;
}

export function PulseText({ lines = 3, className = "" }: PulseTextProps) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 ? "w-3/4" : "w-full"
          } h-4`}
        />
      ))}
    </div>
  );
}
```

**Usage**:
```typescript
import { CardSkeleton, TableSkeleton } from "@/components/shared/LoadingSkeletons";

// In ImpactMetrics
if (loading) return <CardSkeleton count={6} variant="metric" />;

// In InventoryOverview
if (loading) return <TableSkeleton rows={5} columns={6} />;
```

---

## 8. UPDATE TAILWIND CONFIG

**File**: `/src/tailwind.config.ts`

Replace the entire colors section:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // HTI Brand Colors
        hti: {
          navy: '#1e3a5f',
          teal: '#4a9b9f',
          'teal-light': '#6db3b7',
          red: '#ff6b6b',
          yellow: '#ffeb3b',
          'yellow-light': '#fff9c4',
        },
        // Semantic Status Colors
        semantic: {
          success: '#10b981',    // Green for success states
          warning: '#f59e0b',    // Amber for warnings
          danger: '#ef4444',     // Red for errors/destructive
          info: '#3b82f6',       // Blue for information
        },
        // Device Pipeline Status
        status: {
          donated: '#6b7280',
          received: '#9ca3af',
          'data-wipe': '#8b5cf6',
          refurbishing: '#f97316',
          'qa-testing': '#eab308',
          ready: '#10b981',
          distributed: '#4a9b9f', // hti-teal
        },
      },
      animation: {
        'counter': 'counter 2s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        counter: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 9. ADD CSS UTILITY CLASSES

**File**: `/src/app/globals.css`

Append to file:

```css
@import "tailwindcss";

:root {
  --hti-navy: #1e3a5f;
  --hti-teal: #4a9b9f;
  --hti-teal-light: #6db3b7;
  --hti-red: #ff6b6b;
  --hti-yellow: #ffeb3b;
  --hti-yellow-light: #fff9c4;
}

body {
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Component Utilities */
@layer components {
  /* Card Components */
  .card {
    @apply rounded-xl bg-white shadow-lg;
  }

  .card-hover {
    @apply hover:shadow-2xl hover:scale-105 transition-all duration-300;
  }

  .card-dark {
    @apply rounded-xl bg-gray-800 border border-gray-700 shadow-xl;
  }

  /* Metric/Stat Cards */
  .metric-card {
    @apply group relative overflow-hidden rounded-xl bg-white shadow-lg
           hover:shadow-2xl transition-all duration-300 hover:scale-105;
  }

  .stat-card {
    @apply relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700
           shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105;
  }

  /* Buttons */
  .btn-primary {
    @apply px-4 py-2 bg-hti-teal hover:bg-hti-teal-light rounded-lg text-white
           text-sm font-medium transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white
           text-sm font-medium transition-colors;
  }

  .btn-danger {
    @apply px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white
           text-sm font-medium transition-colors;
  }

  /* Badge Components */
  .badge-light {
    @apply px-3 py-1 rounded-full text-xs font-medium;
  }

  .badge-success {
    @apply badge-light bg-green-500/20 text-green-600 border border-green-500/30;
  }

  .badge-warning {
    @apply badge-light bg-yellow-500/20 text-yellow-600 border border-yellow-500/30;
  }

  .badge-danger {
    @apply badge-light bg-red-500/20 text-red-600 border border-red-500/30;
  }

  .badge-info {
    @apply badge-light bg-blue-500/20 text-blue-600 border border-blue-500/30;
  }

  /* Status Badges */
  .status-achieved {
    @apply badge-success;
  }

  .status-on-track {
    @apply badge-success;
  }

  .status-at-risk {
    @apply badge-warning;
  }

  .status-behind {
    @apply badge-danger;
  }

  /* Section Headers */
  .section-title {
    @apply text-2xl font-bold text-hti-navy mb-4;
  }

  .section-title-light {
    @apply text-2xl font-bold text-white mb-4 flex items-center gap-2;
  }

  /* Input Styles */
  .input-base {
    @apply px-4 py-2 rounded-lg border transition-colors;
  }

  .input-light {
    @apply input-base bg-white border-gray-300 text-gray-900
           placeholder-gray-500 focus:outline-none focus:border-hti-teal;
  }

  .input-dark {
    @apply input-base bg-gray-900 border-gray-700 text-white
           placeholder-gray-500 focus:outline-none focus:border-hti-teal;
  }

  /* Scrollbar Styling */
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
    background-color: #374151;
    border-radius: 4px;
  }

  .scrollbar-track-gray-800::-webkit-scrollbar-track {
    background-color: #1f2937;
  }

  /* Progress Bar */
  .progress-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
  }

  .progress-fill {
    @apply h-full bg-gradient-to-r from-hti-navy to-hti-teal transition-all duration-300;
  }

  /* Text Utilities */
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

---

## 10. REFACTOR IMPACT METRICS

**File**: `/src/components/board/ImpactMetrics.tsx`

Complete refactored version:

```typescript
"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CardSkeleton } from "@/components/shared/LoadingSkeletons";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  description: string;
}

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data - only runs once
  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const metricsData: Metric[] = [
          {
            label: "Grant Laptops Presented",
            value: data.grantLaptopsPresented || 0,
            suffix: ` / ${data.grantLaptopGoal || 1500}`,
            icon: "🎯",
            color: "from-hti-red to-orange-500",
            description: "Since Sept 9, 2024 (Grant Period)",
          },
          {
            label: "Grant Progress",
            value: data.grantLaptopProgress || 0,
            suffix: "%",
            icon: "📊",
            color: "from-semantic-success to-green-400",
            description: `${data.grantLaptopsPresented || 0} of 1,500 goal`,
          },
          {
            label: "Total Laptops (All-Time)",
            value: data.totalLaptopsCollected || 0,
            suffix: "+",
            icon: "💻",
            color: "from-gray-600 to-gray-400",
            description: "Overall collection since inception",
          },
          {
            label: "Counties Served",
            value: data.countiesServed || 0,
            suffix: "",
            icon: "📍",
            color: "from-hti-red to-orange-400",
            description: "Through Digital Champion Grant",
          },
          {
            label: "People Trained",
            value: data.peopleTrained || 0,
            suffix: "+",
            icon: "👥",
            color: "from-hti-yellow to-yellow-300",
            description: "Digital literacy participants",
          },
          {
            label: "E-Waste Diverted",
            value: data.eWasteTons || 0,
            suffix: " tons",
            icon: "♻️",
            color: "from-semantic-success to-green-400",
            description: "Kept out of landfills",
          },
          {
            label: "Partner Organizations",
            value: data.partnerOrganizations || 0,
            suffix: "",
            icon: "🤝",
            color: "from-purple-600 to-purple-400",
            description: "Community collaborations",
          },
        ];

        setMetrics(metricsData);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
        setError(error.message || "Failed to load metrics");
        setLoading(false);
      });
  }, []);

  // Render error state
  if (error) {
    return (
      <ErrorMessage
        error={error}
        title="Failed to load impact metrics"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Render loading state
  if (loading) {
    return <CardSkeleton count={6} variant="metric" />;
  }

  // Render metrics
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricCardWithAnimation
          key={metric.label}
          metric={metric}
        />
      ))}
    </div>
  );
}

// Separate component for animation
interface MetricCardWithAnimationProps {
  metric: Metric;
}

function MetricCardWithAnimation({ metric }: MetricCardWithAnimationProps) {
  const animatedValue = useCounterAnimation(metric.value, { duration: 2000 });

  return (
    <StatCard
      icon={metric.icon}
      value={`${animatedValue.toLocaleString()}${metric.suffix}`}
      label={metric.label}
      description={metric.description}
      color={metric.color}
      variant="light"
    />
  );
}
```

---

## 11. QUICK FIXES FOR EXISTING COMPONENTS

### Add Error Handling to CountyMap

**File**: `/src/components/board/CountyMap.tsx`

At line 24, after `const [loading, setLoading] = useState(true);` add:
```typescript
const [error, setError] = useState<string | null>(null);
```

Around line 53, update catch block:
```typescript
.catch(error => {
  console.error('Error fetching county data:', error);
  setError(error.message || 'Failed to load county data');
  setLoading(false);
});
```

After loading check (around line 60), add:
```typescript
if (error) {
  return (
    <ErrorMessage
      error={error}
      title="Failed to load counties"
      onRetry={() => window.location.reload()}
    />
  );
}
```

---

### Fix DevicePipeline Grid Wrapping

**File**: `/src/components/ops/DevicePipeline.tsx`

Change line 77 from:
```typescript
<div className="grid grid-cols-7 gap-2 mb-6">
```

To:
```typescript
<div className="mb-6 overflow-x-auto pb-4">
  <div className="grid gap-2 min-w-full" style={{ gridTemplateColumns: "repeat(7, minmax(100px, 1fr))" }}>
```

And close the extra div at the end of the grid (after line 96):
```typescript
  </div>
</div>
```

---

## 12. CREATE BARREL EXPORTS

**File**: Create `/src/components/board/index.ts`

```typescript
export { default as ImpactMetrics } from "./ImpactMetrics";
export { default as TrendChart } from "./TrendChart";
export { default as CountyMap } from "./CountyMap";
export { default as RecentActivity } from "./RecentActivity";
```

**File**: Create `/src/components/ops/index.ts`

```typescript
export { default as QuickStats } from "./QuickStats";
export { default as DevicePipeline } from "./DevicePipeline";
export { default as DonationRequests } from "./DonationRequests";
export { default as InventoryOverview } from "./InventoryOverview";
export { default as ActivityFeed } from "./ActivityFeed";
```

**File**: Create `/src/components/shared/index.ts`

```typescript
export { ErrorBoundary } from "./ErrorBoundary";
export { ErrorMessage } from "./ErrorMessage";
export { StatCard } from "./StatCard";
export { ActivityItem } from "./ActivityItem";
export { CardSkeleton, TableSkeleton, PulseText } from "./LoadingSkeletons";
```

---

## Implementation Order

1. Create shared components (ErrorBoundary, ErrorMessage, StatCard, ActivityItem)
2. Create custom hooks (useCounterAnimation, useFetch)
3. Create loading skeletons
4. Update Tailwind config
5. Update globals.css with utility classes
6. Refactor existing components one at a time (start with ImpactMetrics)
7. Test each refactored component thoroughly

---

Generated: November 5, 2025
For complete context, see COMPONENT_REVIEW.md
