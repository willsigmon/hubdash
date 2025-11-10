/**
 * Comprehensive Partnership Application Data Model
 * Maps to Knack object_55 (Partnership Applications)
 */

export interface Partnership {
  // Core identification
  id: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'In Review' | 'Rejected';

  // Organization details
  organizationName: string;
  organizationType?: string;
  is501c3: boolean;
  website?: string;
  address?: string;
  county: string;

  // Contact information
  contactPerson: string;
  email: string;
  phone?: string;
  preferredContactMethod?: string;

  // Application details
  chromebooksNeeded: number;
  firstTime: boolean;
  howHeard?: string;

  // Client population & needs
  workssWith: string[]; // Array of client types (adults, families, students, seniors, etc.)
  clientStruggles: string[]; // Array of struggles being addressed
  howWillUse: string;
  expectedImpact: string; // Same as positiveImpact
  positiveImpact: string;
  clientGoals?: string;

  // Usage details
  howClientsUseLaptops?: string;
  whatClientsAchieve?: string;
  howToContinueRelationship?: string;

  // Marketing fields
  quote: string;
  oneWord?: string;

  // Internal notes
  notes?: string;
  internalComments?: string;
}

export interface FilterOptions {
  counties: string[];
  statuses: ('Pending' | 'Approved' | 'In Review' | 'Rejected')[];
  chromebooksRange: {
    min: number;
    max: number;
  };
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  organizationTypes: string[];
  firstTimeOnly: boolean | null;
  searchQuery: string;
}

export interface GroupingOption {
  value: 'status' | 'county' | 'chromebooks' | 'date' | 'orgType' | 'firstTime';
  label: string;
}

export const GROUPING_OPTIONS: GroupingOption[] = [
  { value: 'status', label: 'Status' },
  { value: 'county', label: 'County' },
  { value: 'chromebooks', label: 'Chromebooks Needed' },
  { value: 'date', label: 'Date Submitted' },
  { value: 'orgType', label: 'Organization Type' },
  { value: 'firstTime', label: 'First-time vs Returning' },
];

export const CHROMEBOOK_RANGES = [
  { label: '1-10', min: 1, max: 10 },
  { label: '11-30', min: 11, max: 30 },
  { label: '31-50', min: 31, max: 50 },
  { label: '50+', min: 51, max: 999999 },
];

export const DATE_RANGES = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'All Time', value: 'all' },
];

export const ALL_STATUSES: Partnership['status'][] = ['Pending', 'Approved', 'In Review', 'Rejected'];
