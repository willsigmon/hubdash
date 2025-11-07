"use client";

/**
 * React Query Provider Component
 * Wraps the app to provide React Query context to all components
 * Includes prefetching of critical dashboard data
 */

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, queryKeys } from '@/lib/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

function PrefetchCriticalData() {
  useEffect(() => {
    // Prefetch critical dashboard data for better perceived performance
    const prefetchData = async () => {
      try {
        console.log('🚀 Prefetching critical dashboard data...');

        // Prefetch metrics (used on board dashboard)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.metrics,
          queryFn: async () => {
            const response = await fetch('/api/metrics');
            if (!response.ok) throw new Error('Failed to fetch metrics');
            return response.json();
          },
          staleTime: 2 * 60 * 1000, // 2 minutes
        });

        // Prefetch activity feed (used across dashboards)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.activity,
          queryFn: async () => {
            const response = await fetch('/api/activity');
            if (!response.ok) throw new Error('Failed to fetch activity');
            return response.json();
          },
          staleTime: 30 * 1000, // 30 seconds
        });

        // Prefetch partners (used on ops dashboard)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.partners,
          queryFn: async () => {
            const response = await fetch('/api/partners');
            if (!response.ok) throw new Error('Failed to fetch partners');
            return response.json();
          },
          staleTime: 10 * 60 * 1000, // 10 minutes
        });

        // Prefetch first page of devices (for inventory overview)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.devicesPaginated(1, 50),
          queryFn: async () => {
            const response = await fetch('/api/devices?page=1&limit=50');
            if (!response.ok) throw new Error('Failed to fetch devices');
            return response.json();
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
        });

        // Prefetch partnerships (for marketing hub)
        await queryClient.prefetchQuery({
          queryKey: queryKeys.partnerships,
          queryFn: async () => {
            const response = await fetch('/api/partnerships?filter=all');
            if (!response.ok) throw new Error('Failed to fetch partnerships');
            return response.json();
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
        });

        console.log('✅ Critical data prefetched successfully');
      } catch (error) {
        console.warn('⚠️ Some prefetching failed (expected in offline mode):', error);
      }
    };

    prefetchData();
  }, []);

  return null;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrefetchCriticalData />
      {children}
      {/* DevTools only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
