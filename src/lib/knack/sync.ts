/**
 * Knack → Supabase Sync Service
 * Syncs data from Knack (source of truth) to Supabase (cache) for fast queries
 */

import { getKnackClient } from './client';
import { createClient } from '@supabase/supabase-js';

interface SyncResult {
  success: boolean;
  table: string;
  recordsSynced: number;
  errors: string[];
  timestamp: Date;
}

/**
 * Sync devices from Knack to Supabase
 */
export async function syncDevices(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    table: 'devices',
    recordsSynced: 0,
    errors: [],
    timestamp: new Date(),
  };

  try {
    const knack = getKnackClient();

    if (!knack.isConfigured()) {
      result.errors.push('Knack not configured - skipping sync');
      return result;
    }

    const objectKey = process.env.KNACK_DEVICES_OBJECT || 'object_7'; // HTI Devices object
    const knackRecords = await knack.getRecords(objectKey);

    // Transform Knack records to Supabase schema
    // Using HTI's actual Knack field names from object_7 (Devices)
    const devices = knackRecords.map(record => ({
      id: record.id,
      serial_number: record.field_201 || record.field_201_raw || `HTI-${record.field_142}`, // Laptop S/N or Inventory #
      model: record.field_58 || record.field_58_raw || 'Unknown', // Model
      manufacturer: record.field_57 || record.field_57_raw || 'Unknown', // Brand
      status: mapKnackStatus(record.field_56 || record.field_56_raw), // Status
      location: record.field_66 || record.field_66_raw || 'Unknown', // Location
      assigned_to: record.field_147 || record.field_147_raw || null, // Recipient Organization (connection)
      received_date: record.field_60 || record.field_60_raw || new Date().toISOString(), // HTI Rcvd Date
      distributed_date: record.field_75 || record.field_75_raw || null, // Date Presented
      partner_id: null, // Will map from Recipient Organization connection
      tech_id: record.field_99 || record.field_99_raw || null, // Technician Name (connection)
      notes: record.field_40 || record.field_40_raw || null, // Device Notes
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Upsert to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('devices')
      .upsert(devices, { onConflict: 'id' });

    if (error) {
      result.errors.push(`Supabase error: ${error.message}`);
      return result;
    }

    result.success = true;
    result.recordsSynced = devices.length;
  } catch (error: any) {
    result.errors.push(`Sync error: ${error.message}`);
  }

  return result;
}

/**
 * Sync donations from Knack to Supabase
 */
export async function syncDonations(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    table: 'donations',
    recordsSynced: 0,
    errors: [],
    timestamp: new Date(),
  };

  try {
    const knack = getKnackClient();

    if (!knack.isConfigured()) {
      result.errors.push('Knack not configured - skipping sync');
      return result;
    }

    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'; // Device Donation Information
    const knackRecords = await knack.getRecords(objectKey);

    const donations = knackRecords.map(record => ({
      id: record.id,
      company: record.field_company || record.company || 'Unknown Company',
      contact_name: record.field_contact_name || record.contact_name || 'Unknown',
      contact_email: record.field_contact_email || record.contact_email || '',
      device_count: Number(record.field_device_count || record.device_count || 0),
      location: record.field_location || record.location || 'Unknown',
      priority: mapKnackPriority(record.field_priority || record.priority),
      status: mapKnackDonationStatus(record.field_status || record.status),
      requested_date: record.field_requested_date || record.requested_date || new Date().toISOString(),
      scheduled_date: record.field_scheduled_date || record.scheduled_date || null,
      completed_date: record.field_completed_date || record.completed_date || null,
      assigned_tech_id: record.field_assigned_tech_id || record.assigned_tech_id || null,
      certificate_issued: Boolean(record.field_certificate_issued || record.certificate_issued),
      notes: record.field_notes || record.notes || null,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('donations')
      .upsert(donations, { onConflict: 'id' });

    if (error) {
      result.errors.push(`Supabase error: ${error.message}`);
      return result;
    }

    result.success = true;
    result.recordsSynced = donations.length;
  } catch (error: any) {
    result.errors.push(`Sync error: ${error.message}`);
  }

  return result;
}

/**
 * Sync all data from Knack to Supabase
 */
export async function syncAll(): Promise<SyncResult[]> {
  console.log('🔄 Starting Knack → Supabase sync...');

  const results = await Promise.all([
    syncDevices(),
    syncDonations(),
    // Add more sync functions as needed
  ]);

  const totalSynced = results.reduce((sum, r) => sum + r.recordsSynced, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

  console.log(`✅ Sync complete: ${totalSynced} records synced, ${totalErrors} errors`);

  return results;
}

/**
 * Helper: Map Knack device status to Supabase enum
 */
function mapKnackStatus(knackStatus: string): string {
  const statusMap: Record<string, string> = {
    'Donated': 'donated',
    'Received': 'received',
    'Data Wipe': 'data_wipe',
    'Data Wiping': 'data_wipe',
    'Refurbishing': 'refurbishing',
    'QA Testing': 'qa_testing',
    'Ready': 'ready',
    'Ready to Ship': 'ready',
    'Distributed': 'distributed',
    'Shipped': 'distributed',
  };

  return statusMap[knackStatus] || 'received';
}

/**
 * Helper: Map Knack priority to Supabase enum
 */
function mapKnackPriority(knackPriority: string): string {
  const priorityMap: Record<string, string> = {
    'Urgent': 'urgent',
    'High': 'high',
    'Normal': 'normal',
    'Low': 'normal',
  };

  return priorityMap[knackPriority] || 'normal';
}

/**
 * Helper: Map Knack donation status to Supabase enum
 */
function mapKnackDonationStatus(knackStatus: string): string {
  const statusMap: Record<string, string> = {
    'Pending': 'pending',
    'Scheduled': 'scheduled',
    'In Progress': 'in_progress',
    'Processing': 'in_progress',
    'Complete': 'completed',
    'Completed': 'completed',
    'Done': 'completed',
  };

  return statusMap[knackStatus] || 'pending';
}
