import { cacheKeys, getCached, invalidateCache } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import {
    errorResponse,
    mapPartnerPayload,
    requireAuth,
    safeKnack,
    successResponse,
    type PartnerDTO
} from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * GET /api/organizations
 * Get all organizations (may overlap with partners, but provides separate endpoint)
 */
export async function GET() {
  try {
    const organizations = await getCached(
      cacheKeys.organizations,
      async () => {
        const knack = getKnackClient()
        const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22'
        const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

        if (!Array.isArray(knackRecords)) {
          console.error('Invalid Knack response - expected array:', knackRecords)
          throw new Error('Invalid data format from database');
        }

        return knackRecords.map((r: any) => {
          let county = 'Unknown';
          if (r.field_613_raw && Array.isArray(r.field_613_raw) && r.field_613_raw.length > 0) {
            county = r.field_613_raw[0].identifier || r.field_613_raw[0].id || 'Unknown';
          } else if (typeof r.field_613_raw === 'string') {
            county = r.field_613_raw;
          }

          let email = '';
          if (typeof r.field_146_raw === 'string') {
            email = r.field_146_raw;
          } else if (r.field_146_raw?.email) {
            email = r.field_146_raw.email;
          }

          let address = '';
          if (typeof r.field_612_raw === 'string') {
            address = r.field_612_raw;
          } else if (r.field_612_raw?.full) {
            address = r.field_612_raw.full;
          }

          return {
            id: r.id,
            name: r.field_143_raw || 'Unknown',
            type: r.field_type || 'nonprofit',
            contact_email: email,
            address,
            county,
            devices_received: r.field_669_raw || 0,
            status: r.field_status || 'active',
            notes: r.field_notes || '',
          };
        });
      },
      600 // 10 minute TTL
    );

    return NextResponse.json(organizations, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' },
    })
  } catch (error: any) {
    console.error('Organizations API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const createOrganizationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  county: z.string().optional(),
  contactName: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/organizations
 * Create a new organization
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = createOrganizationSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';
    const payload = mapPartnerPayload(validated as PartnerDTO);

    const newRecord = await safeKnack(
      () => knack.createRecord(objectKey, payload),
      'Create organization'
    );

    invalidateCache(cacheKeys.organizations);
    invalidateCache(cacheKeys.partners);

    return NextResponse.json(successResponse(newRecord, newRecord.id), { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/organizations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to create organization'), { status: 500 });
  }
}

const updateOrganizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  county: z.string().optional(),
  contactName: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * PUT /api/organizations
 * Update an organization
 */
export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = updateOrganizationSchema.parse(body);
    const { id, ...updates } = validated;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';
    const payload = mapPartnerPayload(updates as PartnerDTO);

    const updatedRecord = await safeKnack(
      () => knack.updateRecord(objectKey, id, payload),
      'Update organization'
    );

    invalidateCache(cacheKeys.organizations);
    invalidateCache(cacheKeys.partners);

    return NextResponse.json(successResponse(updatedRecord, id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('PUT /api/organizations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to update organization'), { status: 500 });
  }
}

const deleteOrganizationSchema = z.object({
  id: z.string().min(1),
});

/**
 * DELETE /api/organizations
 * Delete an organization
 */
export async function DELETE(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = deleteOrganizationSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';

    await safeKnack(
      () => knack.deleteRecord(objectKey, validated.id),
      'Delete organization'
    );

    invalidateCache(cacheKeys.organizations);
    invalidateCache(cacheKeys.partners);

    return NextResponse.json(successResponse({ deleted: true }, validated.id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('DELETE /api/organizations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to delete organization'), { status: 500 });
  }
}
