import { cacheKeys, getCached, invalidateCache } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import {
    errorResponse,
    requireAuth,
    safeKnack,
    successResponse,
    type TechnicianDTO,
    mapTechnicianPayload
} from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * GET /api/technicians
 * Get all technicians
 */
export async function GET() {
  try {
    const technicians = await getCached(
      'technicians',
      async () => {
        const knack = getKnackClient()
        const objectKey = process.env.KNACK_TECHNICIANS_OBJECT || 'object_9'
        const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

        if (!Array.isArray(knackRecords)) {
          console.error('Invalid Knack response - expected array:', knackRecords)
          throw new Error('Invalid data format from database');
        }

        return knackRecords.map((r: any) => ({
          id: r.id,
          name: r.field_name || '',
          email: r.field_email_raw?.email || r.field_email || '',
          phone: r.field_phone || '',
          active: r.field_active !== false,
          devicesAssigned: r.field_devices_assigned || 0,
          notes: r.field_notes || '',
        }));
      },
      600 // 10 minute TTL
    );

    return NextResponse.json(technicians, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' },
    })
  } catch (error: any) {
    console.error('Technicians API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const createTechnicianSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/technicians
 * Create a new technician
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = createTechnicianSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TECHNICIANS_OBJECT || 'object_9';
    const payload = mapTechnicianPayload(validated as TechnicianDTO);

    const newRecord = await safeKnack(
      () => knack.createRecord(objectKey, payload),
      'Create technician'
    );

    invalidateCache('technicians');

    return NextResponse.json(successResponse(newRecord, newRecord.id), { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/technicians error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to create technician'), { status: 500 });
  }
}

const updateTechnicianSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
  notes: z.string().optional(),
});

/**
 * PUT /api/technicians
 * Update a technician
 */
export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = updateTechnicianSchema.parse(body);
    const { id, ...updates } = validated;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TECHNICIANS_OBJECT || 'object_9';
    const payload = mapTechnicianPayload(updates as TechnicianDTO);

    const updatedRecord = await safeKnack(
      () => knack.updateRecord(objectKey, id, payload),
      'Update technician'
    );

    invalidateCache('technicians');

    return NextResponse.json(successResponse(updatedRecord, id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('PUT /api/technicians error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to update technician'), { status: 500 });
  }
}

const deleteTechnicianSchema = z.object({
  id: z.string().min(1),
});

/**
 * DELETE /api/technicians
 * Delete a technician
 */
export async function DELETE(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = deleteTechnicianSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TECHNICIANS_OBJECT || 'object_9';

    await safeKnack(
      () => knack.deleteRecord(objectKey, validated.id),
      'Delete technician'
    );

    invalidateCache('technicians');

    return NextResponse.json(successResponse({ deleted: true }, validated.id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('DELETE /api/technicians error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to delete technician'), { status: 500 });
  }
}
