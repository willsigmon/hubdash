/**
 * Custom React Query hooks for HUBDash API
 * Provides type-safe, cached data fetching with automatic deduplication
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryKeys, queryConfig } from '../query-client';

// Type definitions
export interface MetricsData {
  grantLaptopsPresented: number;
  grantLaptopGoal: number;
  grantLaptopProgress: number;
  grantTrainingHoursGoal: number;
  totalLaptopsCollected: number;
  totalChromebooksDistributed: number;
  countiesServed: number;
  peopleTrained: number;
  eWasteTons: number;
  partnerOrganizations: number;
  pipeline: {
    donated: number;
    received: number;
    dataWipe: number;
    refurbishing: number;
    qaTesting: number;
    ready: number;
    distributed: number;
  };
  inPipeline: number;
  readyToShip: number;
}

export interface Device {
  id: string;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  location: string;
  assigned_to: string | null;
  received_date: string;
  distributed_date: string | null;
  notes: string | null;
}

export interface DevicesResponse {
  data: Device[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number | null;
  };
}

export interface Partnership {
  id: string;
  timestamp: string;
  organizationName: string;
  status: string;
  email: string;
  address: string;
  county: string;
  contactPerson: string;
  phone: string;
  is501c3: boolean;
  website: string;
  workssWith: string[];
  chromebooksNeeded: number;
  clientStruggles: string[];
  howWillUse: string;
  positiveImpact: string;
  howHeard: string;
  oneWord: string;
  quote: string;
}

/**
 * Fetch metrics data with caching
 * Stale time: 2 minutes (semi-real-time updates)
 */
export function useMetrics(): UseQueryResult<MetricsData, Error> {
  return useQuery({
    queryKey: queryKeys.metrics,
    queryFn: async () => {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return response.json();
    },
    ...queryConfig.metrics,
  });
}

/**
 * Fetch paginated devices with caching
 * Stale time: 5 minutes (device data changes infrequently)
 *
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 50)
 * @param status - Filter by status (optional)
 */
export function useDevices(
  page: number = 1,
  limit: number = 50,
  status?: string
): UseQueryResult<DevicesResponse, Error> {
  return useQuery({
    queryKey: queryKeys.devicesPaginated(page, limit, status),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/devices?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch partnerships with caching
 * Stale time: 5 minutes
 *
 * @param filter - Filter type: 'all', 'pending', 'recent'
 */
export function usePartnerships(
  filter: string = 'all'
): UseQueryResult<Partnership[], Error> {
  return useQuery({
    queryKey: queryKeys.partnershipsFiltered(filter),
    queryFn: async () => {
      const response = await fetch(`/api/partnerships?filter=${filter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch partnerships');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch partners with caching
 * Stale time: 10 minutes (mostly static data)
 */
export function usePartners(): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: queryKeys.partners,
    queryFn: async () => {
      const response = await fetch('/api/partners');
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      return response.json();
    },
    ...queryConfig.organizations,
  });
}

/**
 * Fetch activity feed with caching
 * Stale time: 30 seconds (real-time updates)
 * Auto-refetches every minute
 */
export function useActivity(): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: async () => {
      const response = await fetch('/api/activity');
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      return response.json();
    },
    ...queryConfig.activity,
  });
}
