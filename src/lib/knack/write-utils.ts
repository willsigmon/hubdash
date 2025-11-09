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

  // field_56: Status (from devices/route.ts - confirmed)
  if (dto.status) {
    payload.field_56 = dto.status;
  }

  // field_201_raw: Serial Number (from devices/route.ts - confirmed)
  if (dto.serial) {
    payload.field_201 = dto.serial;
  }

  // field_75_raw: Date Presented (from devices/route.ts - confirmed)
  if (dto.datePresented) {
    payload.field_75 = dto.datePresented;
  }

  // field_60_raw: Date Received (from devices/route.ts - confirmed)
  if (dto.dateReceived) {
    payload.field_60 = dto.dateReceived;
  }

  // field_147_raw: Assigned To (technician connection - from devices/route.ts)
  // Note: This is handled separately in batch operations
  // For org connection, use field_22 or appropriate connection field

  // field_40_raw: Notes (from devices/route.ts - confirmed)
  if (dto.notes) {
    payload.field_40 = dto.notes;
  }

  // Connection to organization - verify field ID (may be field_22 or different)
  if (dto.orgId) {
    // Connection fields are arrays in Knack
    payload.field_22 = [dto.orgId];
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

  // Field mappings based on donations/route.ts structure (object_63)
  // field_565_raw: Company/Donor Name (confirmed from donations/route.ts)
  if (dto.donorName) payload.field_565 = dto.donorName;
  
  // field_537_raw: Email (confirmed from donations/route.ts)
  if (dto.donorEmail) payload.field_537 = dto.donorEmail;
  
  // field_538_raw: Contact Name (confirmed from donations/route.ts)
  // Note: Using donorName for company, contactName would be separate field
  if (dto.donorPhone) payload.field_phone = dto.donorPhone;
  
  // field_566_raw: Address/Location (confirmed from donations/route.ts)
  if (dto.pickupAddress) payload.field_566 = dto.pickupAddress;
  
  // City, Zip - verify actual field IDs (may be part of address field)
  if (dto.pickupCity) payload.field_city = dto.pickupCity;
  if (dto.pickupZip) payload.field_zip = dto.pickupZip;
  
  // Status - verify actual field ID (not seen in GET, may need to check)
  if (dto.status) payload.field_status = dto.status;
  
  // field_542_raw: Device Count (confirmed from donations/route.ts)
  if (dto.deviceCount !== undefined) payload.field_542 = dto.deviceCount;
  
  // field_536_raw: Requested Date (confirmed from donations/route.ts)
  // Scheduled date may be different field
  if (dto.scheduledDate) payload.field_scheduled_date = dto.scheduledDate;
  
  // Notes - verify actual field ID
  if (dto.notes) payload.field_notes = dto.notes;

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

  // Field mappings based on partners/route.ts structure (object_22)
  // field_143_raw: Organization Name (confirmed from partners/route.ts)
  if (dto.name) payload.field_143 = dto.name;
  
  // field_146_raw: Email (confirmed from partners/route.ts)
  if (dto.email) payload.field_146 = dto.email;
  
  // Phone field - verify actual field ID
  if (dto.phone) payload.field_phone = dto.phone;
  
  // field_612_raw: Address (confirmed from partners/route.ts)
  if (dto.address) payload.field_612 = dto.address;
  
  // City, State, Zip - verify actual field IDs
  if (dto.city) payload.field_city = dto.city;
  if (dto.state) payload.field_state = dto.state;
  if (dto.zip) payload.field_zip = dto.zip;
  
  // field_613_raw: County connection (confirmed from partners/route.ts)
  // County connections are arrays in Knack
  if (dto.county) {
    // If county is an ID, wrap in array; if it's a name, may need lookup
    payload.field_613 = Array.isArray(dto.county) ? dto.county : [dto.county];
  }
  
  // Contact name - verify actual field ID
  if (dto.contactName) payload.field_contact_name = dto.contactName;
  
  // Partnership type - verify actual field ID
  if (dto.partnershipType) payload.field_partnership_type = dto.partnershipType;
  
  // Status - verify actual field ID
  if (dto.status) payload.field_status = dto.status;
  
  // Notes - verify actual field ID
  if (dto.notes) payload.field_notes = dto.notes;

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
