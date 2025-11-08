/**
 * LoadingSkeleton Components
 * 
 * Skeleton loaders that match actual component shapes for better UX.
 * Provides visual consistency during data loading.
 * 
 * @example
 * ```tsx
 * {loading ? <MetricCardSkeleton /> : <StatCard {...props} />}
 * {loading ? <TableSkeleton rows={5} /> : <Table data={data} />}
 * ```
 */

import React from 'react';

/**
 * Skeleton for standard metric/stat cards
 */
export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl bg-white shadow-lg border border-hti-fig/10 animate-pulse">
      {/* Top accent */}
      <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300" />
      
      <div className="p-6 space-y-4">
        {/* Icon and badge */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-gray-200 rounded" />
          <div className="w-12 h-6 bg-gray-200 rounded-full" />
        </div>
        
        {/* Value */}
        <div>
          <div className="w-24 h-10 bg-gray-300 rounded mb-2" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Description */}
        <div className="w-full h-3 bg-gray-200 rounded" />
      </div>
      
      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300" />
    </div>
  );
}

/**
 * Skeleton for featured metric card with progress bar
 */
export function FeaturedMetricCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white shadow-2xl border border-hti-ember/25 animate-pulse">
      {/* Top accent */}
      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300" />
      
      <div className="p-8 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div>
              <div className="w-48 h-8 bg-gray-300 rounded mb-2" />
              <div className="w-32 h-4 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-28 h-10 bg-gray-200 rounded-full" />
        </div>
        
        {/* Main value */}
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="w-40 h-14 bg-gray-300 rounded mb-2" />
          <div className="w-48 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full" />
          <div className="flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-3 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300" />
    </div>
  );
}

/**
 * Skeleton for activity feed items
 */
export function ActivityFeedSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="border-l-4 border-gray-300 bg-white rounded-lg p-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-5 bg-gray-300 rounded" />
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-gray-300">
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-gray-300 rounded" />
        ))}
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b border-gray-200">
          {[...Array(columns)].map((_, colIndex) => (
            <div key={colIndex} className="flex-1 h-4 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for card grid
 */
export function CardGridSkeleton({ cards = 6, columns = 3 }: { cards?: number; columns?: number }) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
      {[...Array(cards)].map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for dark theme cards (ops dashboard)
 */
export function DarkCardSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-gray-600 shadow-xl animate-pulse">
      <div className="p-5 md:p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-gray-600 rounded" />
          <div className="w-16 h-6 bg-gray-600 rounded-full" />
        </div>
        
        <div>
          <div className="w-20 h-10 bg-gray-500 rounded mb-2" />
          <div className="w-24 h-4 bg-gray-600 rounded" />
        </div>
        
        <div className="w-28 h-6 bg-gray-600 rounded" />
      </div>
      
      <div className="h-2 bg-gray-600" />
    </div>
  );
}
