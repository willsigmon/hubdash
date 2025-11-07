/**
 * Error Recovery and Resilience Utilities
 * Provides comprehensive error handling, retry logic, and graceful degradation
 */

import { useQueryClient } from '@tanstack/react-query';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: Error) => boolean;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export interface FallbackData<T> {
  data: T;
  isStale: boolean;
  lastUpdated: Date;
  source: 'cache' | 'fallback' | 'generated';
}

/**
 * Enhanced retry utility with exponential backoff and jitter
 */
export class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 30000,
      backoffFactor = 2,
      retryCondition = () => true,
    } = config;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry if condition fails or we've exhausted retries
        if (attempt === maxRetries || !retryCondition(lastError)) {
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
        const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
        const delay = exponentialDelay + jitter;

        console.warn(`Retry attempt ${attempt + 1}/${maxRetries} failed:`, lastError.message);
        console.log(`Waiting ${Math.round(delay)}ms before retry...`);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  static isRetryableError(error: Error): boolean {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return true;
    }

    // HTTP errors that might be temporary
    if (error.message.includes('500') || error.message.includes('502') ||
        error.message.includes('503') || error.message.includes('504')) {
      return true;
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('TimeoutError')) {
      return true;
    }

    return false;
  }
}

/**
 * Circuit breaker for preventing cascading failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
      console.warn('Circuit breaker OPENED due to repeated failures');
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

/**
 * Graceful degradation manager
 */
export class GracefulDegradationManager {
  private static instance: GracefulDegradationManager;
  private degradedFeatures = new Set<string>();
  private fallbackData = new Map<string, any>();

  private constructor() {}

  static getInstance(): GracefulDegradationManager {
    if (!GracefulDegradationManager.instance) {
      GracefulDegradationManager.instance = new GracefulDegradationManager();
    }
    return GracefulDegradationManager.instance;
  }

  /**
   * Register a fallback for a feature
   */
  registerFallback<T>(feature: string, fallbackData: T): void {
    this.fallbackData.set(feature, {
      data: fallbackData,
      isStale: false,
      lastUpdated: new Date(),
      source: 'fallback',
    });
  }

  /**
   * Mark a feature as degraded
   */
  markDegraded(feature: string): void {
    this.degradedFeatures.add(feature);
    console.warn(`Feature "${feature}" marked as degraded - using fallback functionality`);
  }

  /**
   * Mark a feature as recovered
   */
  markRecovered(feature: string): void {
    this.degradedFeatures.delete(feature);
    console.log(`Feature "${feature}" recovered - restoring full functionality`);
  }

  /**
   * Check if a feature is degraded
   */
  isDegraded(feature: string): boolean {
    return this.degradedFeatures.has(feature);
  }

  /**
   * Get fallback data for a feature
   */
  getFallback<T>(feature: string): FallbackData<T> | null {
    return this.fallbackData.get(feature) || null;
  }

  /**
   * Execute operation with fallback
   */
  async withFallback<T>(
    feature: string,
    operation: () => Promise<T>,
    fallbackOperation?: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await operation();

      // Mark as recovered if it was degraded
      if (this.isDegraded(feature)) {
        this.markRecovered(feature);
      }

      return result;
    } catch (error) {
      console.error(`Feature "${feature}" failed:`, error);

      // Mark as degraded
      this.markDegraded(feature);

      // Try fallback operation
      if (fallbackOperation) {
        try {
          return await fallbackOperation();
        } catch (fallbackError) {
          console.error(`Fallback for "${feature}" also failed:`, fallbackError);
        }
      }

      // Return fallback data if available
      const fallback = this.getFallback<T>(feature);
      if (fallback) {
        console.log(`Using fallback data for "${feature}"`);
        return fallback.data;
      }

      throw error;
    }
  }
}

/**
 * Data validation and sanitization utilities
 */
export class DataValidator {
  static sanitizeString(input: string, options: {
    maxLength?: number;
    allowedChars?: RegExp;
    trim?: boolean;
  } = {}): string {
    let result = options.trim !== false ? input.trim() : input;

    if (options.maxLength) {
      result = result.substring(0, options.maxLength);
    }

    if (options.allowedChars) {
      result = result.replace(options.allowedChars, '');
    }

    return result;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  static validateDeviceData(device: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!device.serial_number || typeof device.serial_number !== 'string') {
      errors.push('Serial number is required and must be a string');
    }

    if (!device.model || typeof device.model !== 'string') {
      errors.push('Model is required and must be a string');
    }

    if (!['donated', 'received', 'data_wipe', 'refurbishing', 'qa_testing', 'ready', 'distributed'].includes(device.status)) {
      errors.push('Invalid device status');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeDeviceData(device: any): any {
    return {
      ...device,
      serial_number: this.sanitizeString(device.serial_number || '', { maxLength: 100 }),
      model: this.sanitizeString(device.model || '', { maxLength: 100 }),
      manufacturer: this.sanitizeString(device.manufacturer || '', { maxLength: 100 }),
      location: this.sanitizeString(device.location || '', { maxLength: 100 }),
      notes: this.sanitizeString(device.notes || '', { maxLength: 500 }),
    };
  }
}

/**
 * Audit trail and session management
 */
export class AuditManager {
  private static instance: AuditManager;
  private auditLog: AuditEntry[] = [];
  private maxLogSize = 1000;

  private constructor() {}

  static getInstance(): AuditManager {
    if (!AuditManager.instance) {
      AuditManager.instance = new AuditManager();
    }
    return AuditManager.instance;
  }

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.auditLog.push(auditEntry);

    // Maintain log size limit
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxLogSize);
    }

    // In production, you would send this to a logging service
    console.log('AUDIT:', auditEntry);
  }

  getRecentEntries(limit = 100): AuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  getEntriesByUser(userId: string, limit = 50): AuditEntry[] {
    return this.auditLog
      .filter(entry => entry.userId === userId)
      .slice(-limit);
  }

  exportAuditLog(): string {
    return JSON.stringify(this.auditLog, null, 2);
  }
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * React hooks for error recovery
 */
export function useErrorRecovery() {
  const queryClient = useQueryClient();

  const invalidateQueries = (queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  const retryFailedQueries = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.state.status === 'error',
    });
  };

  return {
    invalidateQueries,
    retryFailedQueries,
  };
}
