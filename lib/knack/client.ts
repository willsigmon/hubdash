/**
 * HTI Knack Client - Unified API
 * Brings together all 12 core skills
 */

import { KnackConfig } from './types';
import { KnackAuth } from './auth';
import { KnackReader } from './reader';
import { KnackPagination } from './pagination';
import { KnackFilterSort } from './filter';
import { KnackCacheOptimizer } from './cache';
import { KnackGoalTracker } from './goal-tracker';
import { KnackReportingSync } from './reporting';

export class HTIKnackClient {
  public auth: KnackAuth;
  public reader: KnackReader;
  public pagination: KnackPagination;
  public filter: typeof KnackFilterSort;
  public cache: KnackCacheOptimizer;
  public goalTracker: KnackGoalTracker;
  public reporting: KnackReportingSync;

  constructor(config: KnackConfig) {
    this.auth = new KnackAuth(config);
    this.reader = new KnackReader(config);
    this.pagination = new KnackPagination(this.reader);
    this.filter = KnackFilterSort;
    this.cache = new KnackCacheOptimizer();
    this.goalTracker = new KnackGoalTracker();
    this.reporting = new KnackReportingSync();
  }

  /**
   * Convenience method: Fetch all records with caching
   */
  async fetchAllWithCache<T>(
    objectKey: string,
    cacheKey: string,
    ttlSeconds: number = 300
  ): Promise<T[]> {
    // Check cache first
    const cached = this.cache.getCached<T[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch with rate limiting
    const data = await this.cache.retryWithBackoff(() =>
      this.pagination.fetchAllPages<T>(objectKey)
    );

    // Cache results
    this.cache.cacheResults(cacheKey, data, ttlSeconds);

    return data;
  }

  /**
   * Convenience method: Get goal progress
   */
  async getGoalProgress(liveData: {
    laptopsAcquired: number;
    laptopsConverted: number;
    trainingHours: number;
    uniqueDonors: number;
    recurringDonors: number;
    grantMatching: number;
    privateDonations: number;
    corporateSponsors: number;
  }) {
    return this.goalTracker.checkProgress(liveData);
  }

  /**
   * Convenience method: Generate quarterly report
   */
  async generateQuarterlyReport(
    quarter: string,
    startDate: string,
    endDate: string
  ) {
    // This would fetch actual data from Knack
    // For now, returns structure
    const devices = await this.fetchAllWithCache(
      'object_1', // Would be actual object key
      'devices',
      300
    );

    const training = await this.fetchAllWithCache(
      'object_2', // Would be actual object key
      'training',
      300
    );

    const goals = await this.getGoalProgress({
      laptopsAcquired: 1500,
      laptopsConverted: 1000,
      trainingHours: 75,
      uniqueDonors: 8,
      recurringDonors: 4,
      grantMatching: 30000,
      privateDonations: 12,
      corporateSponsors: 1,
    });

    return this.reporting.generateQuarterlyReport(
      quarter,
      startDate,
      endDate,
      devices as any,
      training as any,
      goals
    );
  }
}

/**
 * Create a singleton instance for the app
 */
let clientInstance: HTIKnackClient | null = null;

export function getKnackClient(): HTIKnackClient {
  if (!clientInstance) {
    const config: KnackConfig = {
      appId: process.env.KNACK_APP_ID || '',
      apiKey: process.env.KNACK_API_KEY || '',
      baseUrl: process.env.KNACK_API_BASE_URL || 'https://api.knack.com/v1',
    };

    clientInstance = new HTIKnackClient(config);
  }

  return clientInstance;
}
