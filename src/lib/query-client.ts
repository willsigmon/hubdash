/**
 * React Query (TanStack Query) Configuration
 * Provides client-side caching for API requests with automatic refetching and deduplication
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a shared QueryClient instance with optimized defaults for HubDash
 *
 * Cache Strategy:
 * - Device data: 5 min stale time (rarely changes)
 * - Metrics: 2 min stale time (semi-real-time updates)
 * - Partnership applications: 5 min stale time
 * - Organizations: 10 min stale time (static data)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes by default
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)

      // Don't refetch on window focus (reduces unnecessary API calls)
      refetchOnWindowFocus: false,

      // Don't refetch on reconnect (we have staleTime handling this)
      refetchOnReconnect: false,

      // Retry failed requests 1 time (Knack API can be flaky)
      retry: 1,

      // Wait 1 second before retrying
      retryDelay: 1000,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Query key factory for consistent cache keys across the app
 * This prevents typos and makes it easier to invalidate related queries
 */
export const queryKeys = {
  // Metrics
  metrics: ['metrics'] as const,

  // Devices
  devices: ['devices'] as const,
  devicesPaginated: (page: number, limit: number, status?: string) =>
    ['devices', 'paginated', page, limit, status] as const,
  deviceById: (id: string) => ['devices', id] as const,

  // Partnerships
  partnerships: ['partnerships'] as const,
  partnershipsFiltered: (filter: string) => ['partnerships', filter] as const,
  partnershipById: (id: string) => ['partnerships', id] as const,

  // Recipients
  recipients: ['recipients'] as const,
  recipientsFiltered: (filter: string) => ['recipients', filter] as const,

  // Partners
  partners: ['partners'] as const,

  // Donations
  donations: ['donations'] as const,

  // Activity
  activity: ['activity'] as const,
};

/**
 * Custom query configurations for specific data types
 * Override defaults for specific use cases
 */
export const queryConfig = {
  // Metrics need more frequent updates (2 min)
  metrics: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // Organizations are mostly static (10 min)
  organizations: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },

  // Real-time activity (30 seconds)
  activity: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  },
};
