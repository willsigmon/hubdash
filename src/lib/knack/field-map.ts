/**
 * Centralized Knack field ID configuration
 * Allows environment-based overrides without scattering hard-coded field names
 */

export interface DonationFieldMap {
  /** Knack field ID for donation status (e.g. field_700) */
  status?: string;
  /** Knack field ID for donation priority */
  priority?: string;
  /** Knack field ID for internal notes */
  notes?: string;
}

export interface PartnershipFieldMap {
  /** Knack field ID for partnership status */
  status: string;
  /** Knack field ID for partnership notes */
  notes?: string;
  /** Knack field ID for internal comments */
  internalComments?: string;
}

export interface ActivityFieldMap {
  /** Knack field ID for activity actor / user */
  user?: string;
  /** Knack field ID describing the action that occurred */
  action?: string;
  /** Knack field ID describing the action target */
  target?: string;
  /** Knack field ID for activity type/severity */
  type?: string;
  /** Knack field ID for optional icon/emojis */
  icon?: string;
  /** Knack field ID for created timestamp */
  createdAt?: string;
}

const donationFieldMap: DonationFieldMap = {
  status: process.env.KNACK_DONATION_STATUS_FIELD,
  priority: process.env.KNACK_DONATION_PRIORITY_FIELD,
  notes: process.env.KNACK_DONATION_NOTES_FIELD,
};

const partnershipFieldMap: PartnershipFieldMap = {
  status: process.env.KNACK_PARTNERSHIP_STATUS_FIELD || 'field_679',
  notes: process.env.KNACK_PARTNERSHIP_NOTES_FIELD,
  internalComments: process.env.KNACK_PARTNERSHIP_INTERNAL_NOTES_FIELD,
};

const activityFieldMap: ActivityFieldMap = {
  user: process.env.KNACK_ACTIVITY_USER_FIELD,
  action: process.env.KNACK_ACTIVITY_ACTION_FIELD,
  target: process.env.KNACK_ACTIVITY_TARGET_FIELD,
  type: process.env.KNACK_ACTIVITY_TYPE_FIELD,
  icon: process.env.KNACK_ACTIVITY_ICON_FIELD,
  createdAt: process.env.KNACK_ACTIVITY_CREATED_AT_FIELD,
};

export function getDonationFieldMap(): DonationFieldMap {
  return donationFieldMap;
}

export function getPartnershipFieldMap(): PartnershipFieldMap {
  return partnershipFieldMap;
}

export function getActivityFieldMap(): ActivityFieldMap {
  return activityFieldMap;
}

export function getRawFieldKey(fieldId?: string): string | undefined {
  if (!fieldId) return undefined;
  return `${fieldId}_raw`;
}

export function readKnackField<T = unknown>(record: Record<string, any>, fieldId?: string): T | undefined {
  if (!fieldId) return undefined;

  const rawKey = getRawFieldKey(fieldId);

  if (rawKey && record.hasOwnProperty(rawKey) && record[rawKey] !== undefined && record[rawKey] !== null) {
    return record[rawKey] as T;
  }

  if (record.hasOwnProperty(fieldId) && record[fieldId] !== undefined && record[fieldId] !== null) {
    return record[fieldId] as T;
  }

  return undefined;
}

export function normalizeKnackChoice(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0] as Record<string, unknown>;
    const identifier = first?.identifier ?? first?.id ?? first?.name;
    if (typeof identifier === 'string') {
      const trimmed = identifier.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const identifier = record.identifier ?? record.id ?? record.name ?? record.value;
    if (typeof identifier === 'string') {
      const trimmed = identifier.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return undefined;
}

export function warnMissingDonationField(fieldName: keyof DonationFieldMap): void {
  const envVar = fieldName === 'status'
    ? 'KNACK_DONATION_STATUS_FIELD'
    : fieldName === 'priority'
      ? 'KNACK_DONATION_PRIORITY_FIELD'
      : 'KNACK_DONATION_NOTES_FIELD';

  console.warn(
    `⚠️  Knack donation field "${fieldName}" is not configured. Set ${envVar} in .env.local to enable accurate data.`
  );
}

export function warnMissingPartnershipField(fieldName: keyof PartnershipFieldMap): void {
  const envVar = fieldName === 'status'
    ? 'KNACK_PARTNERSHIP_STATUS_FIELD'
    : fieldName === 'notes'
      ? 'KNACK_PARTNERSHIP_NOTES_FIELD'
      : 'KNACK_PARTNERSHIP_INTERNAL_NOTES_FIELD';

  console.warn(
    `⚠️  Knack partnership field "${fieldName}" is not fully configured. Set ${envVar} in .env.local to enable accurate data.`
  );
}

export function warnMissingActivityField(fieldName: keyof ActivityFieldMap): void {
  const envVar = {
    user: 'KNACK_ACTIVITY_USER_FIELD',
    action: 'KNACK_ACTIVITY_ACTION_FIELD',
    target: 'KNACK_ACTIVITY_TARGET_FIELD',
    type: 'KNACK_ACTIVITY_TYPE_FIELD',
    icon: 'KNACK_ACTIVITY_ICON_FIELD',
    createdAt: 'KNACK_ACTIVITY_CREATED_AT_FIELD',
  }[fieldName];

  if (!envVar) return;

  console.warn(
    `⚠️  Knack activity field "${fieldName}" is not configured. Set ${envVar} in .env.local for richer activity feeds.`
  );
}

function coerceDate(value: unknown): Date | null {
  if (!value && value !== 0) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'object' && value !== null) {
    const candidate = (value as Record<string, unknown>).iso_timestamp
      ?? (value as Record<string, unknown>).timestamp
      ?? (value as Record<string, unknown>).date
      ?? (value as Record<string, unknown>).value;

    if (candidate) {
      return coerceDate(candidate);
    }
  }

  return null;
}

export function normalizeKnackDate(value: unknown, fallbackIso?: string): string {
  const fallback = fallbackIso ? new Date(fallbackIso) : new Date();
  const date = coerceDate(value) ?? fallback;
  return date.toISOString();
}
