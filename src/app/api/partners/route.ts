import { getKnackClient } from '@/lib/knack/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    // Validate API response
    if (!Array.isArray(knackRecords)) {
      console.error('Invalid Knack response - expected array:', knackRecords)
      return NextResponse.json({ error: 'Invalid data format from database' }, { status: 500 })
    }

    const partners = knackRecords.map((r: any) => {
      // Extract county - Knack returns arrays with {id, identifier} objects for connection fields
      let county = 'Unknown';
      if (r.field_613_raw && Array.isArray(r.field_613_raw) && r.field_613_raw.length > 0) {
        county = r.field_613_raw[0].identifier || r.field_613_raw[0].id || 'Unknown';
      } else if (typeof r.field_613_raw === 'string') {
        county = r.field_613_raw;
      }

      // Extract email - Knack returns objects for email fields
      let email = '';
      if (typeof r.field_146_raw === 'string') {
        email = r.field_146_raw;
      } else if (r.field_146_raw?.email) {
        email = r.field_146_raw.email;
      }

      // Extract address - Knack returns objects for address fields
      let address = '';
      if (typeof r.field_612_raw === 'string') {
        address = r.field_612_raw;
      } else if (r.field_612_raw?.full) {
        address = r.field_612_raw.full;
      }

      return {
        id: r.id,
        name: r.field_143_raw || 'Unknown',
        type: 'nonprofit',
        contact_email: email,
        address,
        county,
        devices_received: r.field_669_raw || 0,
      };
    })

    return NextResponse.json(partners, {
      headers: { 'Cache-Control': 'public, s-maxage=600' },
    })
  } catch (error: any) {
    console.error('Partners API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/partners
 * Create a new partner/organization record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const createPartnerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  county: z.string().optional(),
  contactName: z.string().optional(),
  partnershipType: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = createPartnerSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';
    const payload = mapPartnerPayload(validated as PartnerDTO);

    const newRecord = await safeKnack(
      () => knack.createRecord(objectKey, payload),
      'Create partner'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.partners);
    invalidateCache(cacheKeys.organizations);

    return NextResponse.json(successResponse(newRecord, newRecord.id), { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/partners error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to create partner'), { status: 500 });
  }
}

/**
 * PUT /api/partners
 * Update an existing partner/organization record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const updatePartnerSchema = z.object({
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
  partnershipType: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = updatePartnerSchema.parse(body);
    const { id, ...updates } = validated;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';
    const payload = mapPartnerPayload(updates as PartnerDTO);

    const updatedRecord = await safeKnack(
      () => knack.updateRecord(objectKey, id, payload),
      'Update partner'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.partners);
    invalidateCache(cacheKeys.organizations);

    return NextResponse.json(successResponse(updatedRecord, id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('PUT /api/partners error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to update partner'), { status: 500 });
  }
}

/**
 * DELETE /api/partners
 * Delete a partner/organization record
 * Requires: Authorization header with WRITE_API_TOKEN
 */
const deletePartnerSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = deletePartnerSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22';

    await safeKnack(
      () => knack.deleteRecord(objectKey, validated.id),
      'Delete partner'
    );

    // Invalidate caches
    invalidateCache(cacheKeys.partners);
    invalidateCache(cacheKeys.organizations);

    return NextResponse.json(successResponse({ deleted: true }, validated.id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('DELETE /api/partners error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to delete partner'), { status: 500 });
  }
}
