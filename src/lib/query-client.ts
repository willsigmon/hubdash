/**
 * React Query (TanStack Query) Configuration
 * Provides client-side caching for API requests with automatic refetching and deduplication
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a shared QueryClient instance with optimized defaults for HUBDash
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
      // AGGRESSIVE CACHING to avoid Knack 429 rate limits
      staleTime: 30 * 60 * 1000, // 30 minutes (was 5min)

      // Keep unused data in cache for 2 hours
      gcTime: 120 * 60 * 1000, // 2 hours (was 10min)

      // NEVER refetch on window focus (reduces API calls)
      refetchOnWindowFocus: false,

      // NEVER refetch on reconnect
      refetchOnReconnect: false,

      // Don't retry on 429 errors (makes it worse)
      retry: (failureCount, error: any) => {
        // Don't retry rate limit errors
        if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
          return false
        }
        // Retry other errors once
        return failureCount < 1
      },

      // Wait 5 seconds before retrying (give Knack time to recover)
      retryDelay: 5000,
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
  // Metrics - cache aggressively (1 hour)
  metrics: {
    staleTime: 60 * 60 * 1000, // 1 hour (was 2min)
    gcTime: 120 * 60 * 1000, // 2 hours (was 5min)
  },

  // Organizations are static (2 hours)
  organizations: {
    staleTime: 120 * 60 * 1000, // 2 hours (was 10min)
    gcTime: 240 * 60 * 1000, // 4 hours (was 15min)
  },

  // Activity - still relatively fresh but no auto-refetch
  activity: {
    staleTime: 5 * 60 * 1000, // 5 minutes (was 30sec)
    gcTime: 30 * 60 * 1000, // 30 minutes (was 2min)
    refetchInterval: false, // DISABLED auto-refetch to save API calls
  },
};
