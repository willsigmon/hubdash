/**
 * Skill 4: knack_filter_sort
 * Dynamic filtering, sorting, and query optimization
 */

import { KnackFilter, KnackFilterRule, KnackQueryParams } from './types';

export class KnackFilterSort {
  /**
   * Build a filter object from rules
   */
  static buildFilter(
    rules: KnackFilterRule[],
    match: 'and' | 'or' = 'and'
  ): KnackFilter {
    return {
      match,
      rules,
    };
  }

  /**
   * Apply sorting to query params
   */
  static applySort(
    params: KnackQueryParams,
    sortField: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): KnackQueryParams {
    return {
      ...params,
      sort_field: sortField,
      sort_order: sortOrder,
    };
  }

  /**
   * Create a date range filter
   */
  static createDateRangeFilter(
    field: string,
    startDate: string,
    endDate: string
  ): KnackFilter {
    return {
      match: 'and',
      rules: [
        { field, operator: '>=', value: startDate },
        { field, operator: '<=', value: endDate },
      ],
    };
  }

  /**
   * Create a county filter for HTI's 15-county service area
   */
  static createCountyFilter(counties: string[]): KnackFilter {
    return {
      match: 'or',
      rules: counties.map(county => ({
        field: 'county',
        operator: 'is' as const,
        value: county,
      })),
    };
  }

  /**
   * Create a status filter for device tracking
   */
  static createStatusFilter(
    statuses: Array<'acquired' | 'converted' | 'ready' | 'presented' | 'discarded'>
  ): KnackFilter {
    return {
      match: 'or',
      rules: statuses.map(status => ({
        field: 'status',
        operator: 'is' as const,
        value: status,
      })),
    };
  }

  /**
   * HTI's 15-county service area
   */
  static readonly HTI_COUNTIES = [
    'Wake',
    'Durham',
    'Vance',
    'Franklin',
    'Granville',
    'Halifax',
    'Wilson',
    'Edgecombe',
    'Martin',
    'Hertford',
    'Greene',
    'Warren',
    'Northampton',
    'Person',
    'Nash',
  ];
}
