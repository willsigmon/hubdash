/**
 * HTI Knack API TypeScript Definitions
 * Supports all 12 core skills from the Intelligence Suite
 */

export interface KnackConfig {
  appId: string;
  apiKey: string;
  baseUrl?: string;
}

export interface KnackAuthResponse {
  session: {
    user: {
      id: string;
      token: string;
    };
  };
}

export interface KnackRecord {
  id: string;
  [key: string]: any;
}

export interface KnackResponse<T = KnackRecord> {
  records: T[];
  total_pages: number;
  current_page: number;
  total_records: number;
}

export interface KnackFilterRule {
  field: string;
  operator: 'is' | 'is not' | 'contains' | 'starts with' | 'ends with' | 'is blank' | 'is not blank' | '>' | '<' | '>=' | '<=';
  value: string | number;
}

export interface KnackFilter {
  match: 'and' | 'or';
  rules: KnackFilterRule[];
}

export interface KnackQueryParams {
  rows_per_page?: number;
  page?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
  filters?: KnackFilter;
}

export interface HTIGrantGoals {
  laptopsAcquired: number;
  laptopsConverted: number;
  trainingHours: number;
  uniqueDonors: number;
  recurringDonors: number;
  grantMatching: number;
  privateDonations: number;
  corporateSponsors: number;
}

export const HTI_2026_GOALS: HTIGrantGoals = {
  laptopsAcquired: 3500,
  laptopsConverted: 2500,
  trainingHours: 156,
  uniqueDonors: 10,
  recurringDonors: 6,
  grantMatching: 65000,
  privateDonations: 20,
  corporateSponsors: 2,
};

export interface DeviceRecord extends KnackRecord {
  status: 'acquired' | 'converted' | 'ready' | 'presented' | 'discarded';
  acquisition_date: string;
  county: string;
  donor_org?: string;
}

export interface TrainingRecord extends KnackRecord {
  date: string;
  hours: number;
  participants: number;
  county: string;
  topic: string;
}
