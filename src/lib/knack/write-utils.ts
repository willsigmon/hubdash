/**
 * Write Utilities for Knack API
 * Provides authentication, validation, field mapping, and safe wrappers for CRUD operations
 */

import { NextRequest } from 'next/server';
import { retryWithBackoff } from './cache-manager';

/**
 * Require valid authorization header
 * Throws 401 if missing or invalid
 */
export function requireAuth(request: NextRequest): void {
  const authHeader = request.headers.get('authorization');
  const token = process.env.WRITE_API_TOKEN;

  if (!token) {
    throw new Error('WRITE_API_TOKEN not configured on server');
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or malformed Authorization header');
  }

  const providedToken = authHeader.substring(7); // Remove 'Bearer '

  if (providedToken !== token) {
    throw new Error('Invalid authorization token');
  }
}

/**
 * Device field mappings (DTO → Knack)
 */
export interface DeviceDTO {
  type?: 'Laptop' | 'Desktop' | 'Tablet' | 'Other';
  status?: string;
  serial?: string;
  dateReceived?: string;
  datePresented?: string;
  orgId?: string;
  notes?: string;
}

export function mapDevicePayload(dto: DeviceDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // field_458: Device Type
  if (dto.type) {
    payload.field_458 = dto.type;
  }

  // field_56: Status
  if (dto.status) {
    payload.field_56 = dto.status;
  }

  // field_100: Serial Number (example - verify actual field ID)
  if (dto.serial) {
    payload.field_100 = dto.serial;
  }

  // field_75: Date Presented
  if (dto.datePresented) {
    payload.field_75 = dto.datePresented;
  }

  // field_XXX: Date Received (adjust field ID as needed)
  if (dto.dateReceived) {
    payload.field_59 = dto.dateReceived;
  }

  // Connection to organization (adjust field ID)
  if (dto.orgId) {
    payload.field_22 = [dto.orgId]; // Connection fields are arrays
  }

  // Notes field (adjust field ID)
  if (dto.notes) {
    payload.field_notes = dto.notes;
  }

  return payload;
}

/**
 * Donation field mappings (DTO → Knack)
 */
export interface DonationDTO {
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupZip?: string;
  status?: string;
  deviceCount?: number;
  scheduledDate?: string;
  notes?: string;
}

export function mapDonationPayload(dto: DonationDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // Adjust field IDs based on actual Knack schema
  if (dto.donorName) payload.field_donor_name = dto.donorName;
  if (dto.donorEmail) payload.field_donor_email = dto.donorEmail;
  if (dto.donorPhone) payload.field_donor_phone = dto.donorPhone;
  if (dto.pickupAddress) payload.field_pickup_address = dto.pickupAddress;
  if (dto.pickupCity) payload.field_pickup_city = dto.pickupCity;
  if (dto.pickupZip) payload.field_pickup_zip = dto.pickupZip;
  if (dto.status) payload.field_donation_status = dto.status;
  if (dto.deviceCount !== undefined) payload.field_device_count = dto.deviceCount;
  if (dto.scheduledDate) payload.field_scheduled_date = dto.scheduledDate;
  if (dto.notes) payload.field_donation_notes = dto.notes;

  return payload;
}

/**
 * Partner/Organization field mappings (DTO → Knack)
 */
export interface PartnerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  contactName?: string;
  partnershipType?: string;
  status?: string;
  notes?: string;
}

export function mapPartnerPayload(dto: PartnerDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // Adjust field IDs based on actual Knack schema for object_22 (organizations)
  if (dto.name) payload.field_org_name = dto.name;
  if (dto.email) payload.field_org_email = dto.email;
  if (dto.phone) payload.field_org_phone = dto.phone;
  if (dto.address) payload.field_org_address = dto.address;
  if (dto.city) payload.field_org_city = dto.city;
  if (dto.state) payload.field_org_state = dto.state;
  if (dto.zip) payload.field_org_zip = dto.zip;
  if (dto.county) payload.field_613 = dto.county; // County connection
  if (dto.contactName) payload.field_contact_name = dto.contactName;
  if (dto.partnershipType) payload.field_partnership_type = dto.partnershipType;
  if (dto.status) payload.field_partner_status = dto.status;
  if (dto.notes) payload.field_partner_notes = dto.notes;

  return payload;
}

/**
 * Safe wrapper for Knack operations with retry and error handling
 */
export async function safeKnack<T>(
  operation: () => Promise<T>,
  operationName: string = 'Knack operation'
): Promise<T> {
  try {
    return await retryWithBackoff(operation, 3, 1000);
  } catch (error: any) {
    console.error(`${operationName} failed:`, error);
    throw new Error(`${operationName} failed: ${error.message}`);
  }
}

/**
 * Standardized success response
 */
export function successResponse<T>(data: T, id?: string) {
  return {
    ok: true,
    ...(id && { id }),
    data,
  };
}

/**
 * Standardized error response
 */
export function errorResponse(message: string, status: number = 500) {
  return {
    ok: false,
    error: message,
    status,
  };
}
