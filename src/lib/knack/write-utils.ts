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
 * Based on actual field IDs from devices/route.ts GET endpoint
 */
export interface DeviceDTO {
  type?: 'Laptop' | 'Desktop' | 'Tablet' | 'Other';
  status?: string;
  serial?: string;
  manufacturer?: string;
  model?: string;
  location?: string;
  dateReceived?: string;
  datePresented?: string;
  assignedTo?: string; // Technician ID
  orgId?: string; // Organization ID
  notes?: string;
}

export function mapDevicePayload(dto: DeviceDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // field_458: Device Type (confirmed)
  if (dto.type) {
    payload.field_458 = dto.type;
  }

  // field_56: Status (confirmed from devices/route.ts)
  if (dto.status) {
    payload.field_56 = dto.status;
  }

  // field_201: Serial Number (confirmed from devices/route.ts)
  if (dto.serial) {
    payload.field_201 = dto.serial;
  }

  // field_57: Manufacturer (confirmed from devices/route.ts GET)
  if (dto.manufacturer) {
    payload.field_57 = dto.manufacturer;
  }

  // field_58: Model (confirmed from devices/route.ts GET)
  if (dto.model) {
    payload.field_58 = dto.model;
  }

  // field_66: Location (confirmed from devices/route.ts GET)
  if (dto.location) {
    payload.field_66 = dto.location;
  }

  // field_75: Date Presented/Distributed (confirmed from devices/route.ts)
  if (dto.datePresented) {
    payload.field_75 = dto.datePresented;
  }

  // field_60: Date Received (confirmed from devices/route.ts)
  if (dto.dateReceived) {
    payload.field_60 = dto.dateReceived;
  }

  // field_147: Assigned To (technician connection - confirmed from devices/route.ts)
  // Connection fields are arrays in Knack
  if (dto.assignedTo) {
    payload.field_147 = [dto.assignedTo];
  }

  // field_40: Notes (confirmed from devices/route.ts)
  if (dto.notes) {
    payload.field_40 = dto.notes;
  }

  // field_22: Organization connection (confirmed)
  if (dto.orgId) {
    payload.field_22 = [dto.orgId];
  }

  return payload;
}

/**
 * Donation field mappings (DTO → Knack)
 * Based on actual field IDs from donations/route.ts GET endpoint
 */
export interface DonationDTO {
  donorName?: string; // Company name
  contactName?: string; // Contact person name
  donorEmail?: string;
  donorPhone?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupZip?: string;
  status?: string;
  priority?: string;
  deviceCount?: number;
  requestedDate?: string; // Date donation was requested
  scheduledDate?: string; // Date pickup is scheduled
  notes?: string;
}

export function mapDonationPayload(dto: DonationDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // field_565: Company/Donor Name (confirmed from donations/route.ts)
  if (dto.donorName) payload.field_565 = dto.donorName;

  // field_538: Contact Name (confirmed from donations/[id]/route.ts)
  if (dto.contactName) payload.field_538 = dto.contactName;

  // field_537: Email (confirmed from donations/route.ts)
  if (dto.donorEmail) payload.field_537 = dto.donorEmail;

  // Phone - verify actual field ID (not seen in GET, may need to check)
  if (dto.donorPhone) payload.field_phone = dto.donorPhone;

  // field_566: Address/Location (confirmed from donations/route.ts)
  if (dto.pickupAddress) payload.field_566 = dto.pickupAddress;

  // City, Zip - may be part of address field or separate fields
  // Not seen in GET response, keeping as placeholders
  if (dto.pickupCity) payload.field_city = dto.pickupCity;
  if (dto.pickupZip) payload.field_zip = dto.pickupZip;

  // field_567: Status (confirmed from donations/[id]/route.ts PUT)
  if (dto.status) payload.field_567 = dto.status;

  // field_568: Priority (confirmed from donations/[id]/route.ts PUT)
  if (dto.priority) payload.field_568 = dto.priority;

  // field_542: Device Count (confirmed from donations/route.ts)
  if (dto.deviceCount !== undefined) payload.field_542 = dto.deviceCount;

  // field_536: Requested Date (confirmed from donations/route.ts GET)
  if (dto.requestedDate) payload.field_536 = dto.requestedDate;

  // Scheduled date - verify actual field ID (may be field_536 or different)
  if (dto.scheduledDate) payload.field_scheduled_date = dto.scheduledDate;

  // Notes - verify actual field ID (not seen in GET)
  if (dto.notes) payload.field_notes = dto.notes;

  return payload;
}

/**
 * Partner/Organization field mappings (DTO → Knack)
 * Based on actual field IDs from partners/route.ts and organizations/route.ts GET endpoints
 */
export interface PartnerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string | string[]; // Can be ID or array of IDs for connection
  contactName?: string;
  partnershipType?: string;
  type?: string; // Organization type
  status?: string;
  devicesReceived?: number;
  notes?: string;
}

export function mapPartnerPayload(dto: PartnerDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // field_143: Organization Name (confirmed from partners/route.ts)
  if (dto.name) payload.field_143 = dto.name;

  // field_146: Email (confirmed from partners/route.ts)
  if (dto.email) payload.field_146 = dto.email;

  // Phone - verify actual field ID (not seen in GET, may need to check)
  if (dto.phone) payload.field_phone = dto.phone;

  // field_612: Address (confirmed from partners/route.ts)
  if (dto.address) payload.field_612 = dto.address;

  // City, State, Zip - may be part of address field or separate
  // Not seen in GET response, keeping as placeholders
  if (dto.city) payload.field_city = dto.city;
  if (dto.state) payload.field_state = dto.state;
  if (dto.zip) payload.field_zip = dto.zip;

  // field_613: County connection (confirmed from partners/route.ts)
  // County connections are arrays in Knack
  if (dto.county) {
    payload.field_613 = Array.isArray(dto.county) ? dto.county : [dto.county];
  }

  // Contact name - verify actual field ID (not seen in GET)
  if (dto.contactName) payload.field_contact_name = dto.contactName;

  // Partnership type - verify actual field ID (not seen in GET)
  if (dto.partnershipType) payload.field_partnership_type = dto.partnershipType;

  // field_type: Organization Type (seen in organizations/route.ts GET)
  if (dto.type) payload.field_type = dto.type;

  // field_status: Status (seen in organizations/route.ts GET)
  if (dto.status) payload.field_status = dto.status;

  // field_669: Devices Received (confirmed from partners/route.ts and organizations/route.ts)
  if (dto.devicesReceived !== undefined) payload.field_669 = dto.devicesReceived;

  // field_notes: Notes (seen in organizations/route.ts GET)
  if (dto.notes) payload.field_notes = dto.notes;

  return payload;
}

/**
 * Training Session field mappings (DTO → Knack)
 * Based on training/route.ts structure (object_8)
 */
export interface TrainingDTO {
  sessionDate?: string;
  location?: string;
  attendees?: number;
  instructor?: string;
  topic?: string;
  notes?: string;
}

export function mapTrainingPayload(dto: TrainingDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // Note: Actual field IDs need to be verified from Knack schema
  // Using generic field names based on training/route.ts structure
  if (dto.sessionDate) payload.field_date = dto.sessionDate;
  if (dto.location) payload.field_location = dto.location;
  if (dto.attendees !== undefined) payload.field_attendees = dto.attendees;
  if (dto.instructor) payload.field_instructor = dto.instructor;
  if (dto.topic) payload.field_topic = dto.topic;
  if (dto.notes) payload.field_notes = dto.notes;

  return payload;
}

/**
 * Technician field mappings (DTO → Knack)
 * Based on technicians/route.ts structure (object_9)
 */
export interface TechnicianDTO {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  notes?: string;
}

export function mapTechnicianPayload(dto: TechnicianDTO): Record<string, any> {
  const payload: Record<string, any> = {};

  // Note: Actual field IDs need to be verified from Knack schema
  // Using generic field names based on technicians/route.ts structure
  if (dto.name) payload.field_name = dto.name;
  if (dto.email) payload.field_email = dto.email;
  if (dto.phone) payload.field_phone = dto.phone;
  if (dto.active !== undefined) payload.field_active = dto.active;
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
