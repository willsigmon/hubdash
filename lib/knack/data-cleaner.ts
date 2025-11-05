/**
 * Skill 9: knack_data_cleaner
 * Ensures accuracy for compliance and performance dashboards
 */

import { KnackRecord } from './types';

export class KnackDataCleaner {
  /**
   * Deduplicate records by ID
   */
  deduplicateRecords<T extends KnackRecord>(records: T[]): T[] {
    const seen = new Set<string>();
    return records.filter(record => {
      if (seen.has(record.id)) {
        return false;
      }
      seen.add(record.id);
      return true;
    });
  }

  /**
   * Normalize field values
   */
  normalizeFields<T extends Record<string, any>>(
    records: T[],
    fieldMappings: Record<string, (value: any) => any>
  ): T[] {
    return records.map(record => {
      const normalized = { ...record };

      for (const [field, normalizer] of Object.entries(fieldMappings)) {
        if (field in normalized) {
          normalized[field] = normalizer(normalized[field]);
        }
      }

      return normalized;
    });
  }

  /**
   * Validate data integrity
   */
  validateIntegrity<T extends Record<string, any>>(
    records: T[],
    requiredFields: string[]
  ): { valid: T[]; invalid: Array<{ record: T; missingFields: string[] }> } {
    const valid: T[] = [];
    const invalid: Array<{ record: T; missingFields: string[] }> = [];

    for (const record of records) {
      const missingFields = requiredFields.filter(
        field => !(field in record) || record[field] == null || record[field] === ''
      );

      if (missingFields.length === 0) {
        valid.push(record);
      } else {
        invalid.push({ record, missingFields });
      }
    }

    return { valid, invalid };
  }

  /**
   * Remove records with null or undefined critical fields
   */
  filterIncomplete<T extends Record<string, any>>(
    records: T[],
    criticalFields: string[]
  ): T[] {
    return records.filter(record =>
      criticalFields.every(field => {
        const value = record[field];
        return value != null && value !== '';
      })
    );
  }

  /**
   * Standardize county names for HTI's service area
   */
  normalizeCountyNames<T extends Record<string, any>>(
    records: T[],
    countyField: string = 'county'
  ): T[] {
    const countyMap: Record<string, string> = {
      'wake': 'Wake',
      'durham': 'Durham',
      'vance': 'Vance',
      'franklin': 'Franklin',
      'granville': 'Granville',
      'halifax': 'Halifax',
      'wilson': 'Wilson',
      'edgecombe': 'Edgecombe',
      'martin': 'Martin',
      'hertford': 'Hertford',
      'greene': 'Greene',
      'warren': 'Warren',
      'northampton': 'Northampton',
      'person': 'Person',
      'nash': 'Nash',
    };

    return this.normalizeFields(records, {
      [countyField]: (value: any) => {
        if (typeof value !== 'string') return value;
        const normalized = value.toLowerCase().trim();
        return countyMap[normalized] || value;
      },
    });
  }

  /**
   * Standardize date formats
   */
  normalizeDates<T extends Record<string, any>>(
    records: T[],
    dateFields: string[]
  ): T[] {
    const mappings: Record<string, (value: any) => any> = {};

    for (const field of dateFields) {
      mappings[field] = (value: any) => {
        if (!value) return value;
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toISOString();
      };
    }

    return this.normalizeFields(records, mappings);
  }

  /**
   * Clean and validate device status
   */
  validateDeviceStatus<T extends Record<string, any>>(
    records: T[],
    statusField: string = 'status'
  ): T[] {
    const validStatuses = new Set([
      'acquired',
      'converted',
      'ready',
      'presented',
      'discarded',
    ]);

    return records.filter(record => {
      const status = record[statusField];
      return validStatuses.has(status);
    });
  }

  /**
   * Generate data quality report
   */
  generateQualityReport<T extends Record<string, any>>(
    records: T[],
    requiredFields: string[]
  ): {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    completeness: number;
    issues: Array<{ field: string; missingCount: number }>;
  } {
    const validation = this.validateIntegrity(records, requiredFields);

    const fieldMissingCount: Record<string, number> = {};
    for (const field of requiredFields) {
      fieldMissingCount[field] = 0;
    }

    for (const { missingFields } of validation.invalid) {
      for (const field of missingFields) {
        fieldMissingCount[field]++;
      }
    }

    const issues = Object.entries(fieldMissingCount)
      .map(([field, missingCount]) => ({ field, missingCount }))
      .filter(issue => issue.missingCount > 0)
      .sort((a, b) => b.missingCount - a.missingCount);

    return {
      totalRecords: records.length,
      validRecords: validation.valid.length,
      invalidRecords: validation.invalid.length,
      completeness: records.length > 0
        ? (validation.valid.length / records.length) * 100
        : 0,
      issues,
    };
  }
}
