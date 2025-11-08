import { cacheKeys, invalidateCache } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import {
    errorResponse,
    mapDonationPayload,
    requireAuth,
    safeKnack,
    successResponse,
    type DonationDTO
} from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    // Validate API response
    if (!Array.isArray(knackRecords)) {
      console.error('Invalid Knack response - expected array:', knackRecords)
      return NextResponse.json({ error: 'Invalid data format from database' }, { status: 500 })
    }

    const donations = knackRecords.map((r: any) => {
      // Extract email - Knack returns objects
      let email = '';
      if (typeof r.field_537_raw === 'string') {
        email = r.field_537_raw;
      } else if (r.field_537_raw?.email) {
        email = r.field_537_raw.email;
      }

      // Extract address - Knack returns objects
      let location = 'Unknown';
      if (typeof r.field_566_raw === 'string') {
        location = r.field_566_raw;
      } else if (r.field_566_raw?.full) {
        location = r.field_566_raw.full;
      } else if (r.field_566_raw?.city && r.field_566_raw?.state) {
        location = `${r.field_566_raw.city}, ${r.field_566_raw.state}`;
      }

      // Extract date - validate to prevent Invalid Date
      let requestedDate = new Date().toISOString();
      if (r.field_536_raw) {
        const date = new Date(typeof r.field_536_raw === 'string' ? r.field_536_raw : r.field_536_raw.iso_timestamp);
        if (!isNaN(date.getTime())) {
          requestedDate = date.toISOString();
        }
      }

      return {
        id: r.id,
        company: r.field_565_raw || 'Unknown',
        contact_name: r.field_538_raw || 'Unknown',
        contact_email: email,
        device_count: parseInt(r.field_542_raw || '0', 10),
        location,
        priority: 'normal' as const,
        status: 'pending' as const,
        requested_date: requestedDate,
      };
    })

    return NextResponse.json(donations, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Donations API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/donations
 * Create a new donation record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const createDonationSchema = z.object({
  donorName: z.string().min(1),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  pickupAddress: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupZip: z.string().optional(),
  status: z.string().optional(),
  deviceCount: z.number().int().min(0).optional(),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = createDonationSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63';
    const payload = mapDonationPayload(validated as DonationDTO);

    const newRecord = await safeKnack(
      () => knack.createRecord(objectKey, payload),
      'Create donation'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.donations);
    invalidateCache(cacheKeys.activity);

    return NextResponse.json(successResponse(newRecord, newRecord.id), { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/donations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to create donation'), { status: 500 });
  }
}

/**
 * PUT /api/donations
 * Update an existing donation record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const updateDonationSchema = z.object({
  id: z.string().min(1),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  pickupAddress: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupZip: z.string().optional(),
  status: z.string().optional(),
  deviceCount: z.number().int().min(0).optional(),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = updateDonationSchema.parse(body);
    const { id, ...updates } = validated;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63';
    const payload = mapDonationPayload(updates as DonationDTO);

    const updatedRecord = await safeKnack(
      () => knack.updateRecord(objectKey, id, payload),
      'Update donation'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.donations);
    invalidateCache(cacheKeys.activity);

    return NextResponse.json(successResponse(updatedRecord, id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('PUT /api/donations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to update donation'), { status: 500 });
  }
}

/**
 * DELETE /api/donations
 * Delete a donation record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const deleteDonationSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = deleteDonationSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63';

    await safeKnack(
      () => knack.deleteRecord(objectKey, validated.id),
      'Delete donation'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.donations);
    invalidateCache(cacheKeys.activity);

    return NextResponse.json(successResponse({ deleted: true }, validated.id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('DELETE /api/donations error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to delete donation'), { status: 500 });
  }
}
