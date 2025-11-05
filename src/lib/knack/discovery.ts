/**
 * Knack Object Discovery Tool
 * Helps auto-discover Knack objects and field mappings
 */

import { getKnackClient } from './client';

interface KnackObject {
  key: string;
  name: string;
  fields: KnackField[];
}

interface KnackField {
  key: string;
  name: string;
  type: string;
}

interface FieldMapping {
  knackField: string;
  supabaseField: string;
  type: string;
  suggested: boolean;
}

/**
 * Discover all objects in the Knack application
 */
export async function discoverKnackObjects(): Promise<KnackObject[]> {
  try {
    const knack = getKnackClient();
    const objects = await knack.discoverObjects();

    return objects.map((obj: any) => ({
      key: obj.key,
      name: obj.name,
      fields: obj.fields?.map((f: any) => ({
        key: f.key,
        name: f.name,
        type: f.type,
      })) || [],
    }));
  } catch (error) {
    console.error('Error discovering Knack objects:', error);
    return [];
  }
}

/**
 * Suggest field mappings based on Knack object structure
 */
export function suggestFieldMappings(
  knackObject: KnackObject,
  targetTable: 'devices' | 'donations' | 'partners' | 'training_sessions' | 'activity_log'
): FieldMapping[] {
  const supabaseSchemas = {
    devices: ['serial_number', 'model', 'manufacturer', 'status', 'location', 'assigned_to', 'received_date', 'notes'],
    donations: ['company', 'contact_name', 'contact_email', 'device_count', 'location', 'priority', 'status', 'requested_date'],
    partners: ['name', 'type', 'contact_email', 'address', 'county', 'devices_received'],
    training_sessions: ['title', 'date', 'location', 'instructor', 'attendee_count'],
    activity_log: ['user_name', 'action', 'target', 'type', 'icon'],
  };

  const targetFields = supabaseSchemas[targetTable] || [];
  const mappings: FieldMapping[] = [];

  // Try to match Knack fields to Supabase fields
  for (const supabaseField of targetFields) {
    const possibleMatches = knackObject.fields.filter(f =>
      f.name.toLowerCase().includes(supabaseField.replace('_', ' ')) ||
      f.key.toLowerCase().includes(supabaseField.toLowerCase())
    );

    if (possibleMatches.length > 0) {
      // Found a likely match
      mappings.push({
        knackField: possibleMatches[0].key,
        supabaseField,
        type: possibleMatches[0].type,
        suggested: true,
      });
    } else {
      // No match found - user needs to manually map
      mappings.push({
        knackField: '',
        supabaseField,
        type: 'unknown',
        suggested: false,
      });
    }
  }

  return mappings;
}

/**
 * Generate TypeScript code for field mapping
 */
export function generateMappingCode(mappings: FieldMapping[], tableName: string): string {
  const code = `
// Knack → Supabase field mapping for ${tableName}
const ${tableName} = knackRecords.map(record => ({
${mappings.map(m =>
    m.suggested
      ? `  ${m.supabaseField}: record.${m.knackField}, // Auto-mapped from Knack`
      : `  ${m.supabaseField}: record.field_xxx, // TODO: Update with correct Knack field`
  ).join('\n')}
  created_at: record.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));
`;

  return code;
}

/**
 * Test Knack connection and return basic info
 */
export async function testKnackConnection(): Promise<{
  connected: boolean;
  appId: string;
  objectCount: number;
  error?: string;
}> {
  try {
    const knack = getKnackClient();

    if (!knack.isConfigured()) {
      return {
        connected: false,
        appId: '',
        objectCount: 0,
        error: 'Knack credentials not configured',
      };
    }

    const objects = await knack.discoverObjects();

    return {
      connected: true,
      appId: process.env.KNACK_APP_ID || '',
      objectCount: objects.length,
    };
  } catch (error: any) {
    return {
      connected: false,
      appId: process.env.KNACK_APP_ID || '',
      objectCount: 0,
      error: error.message,
    };
  }
}
