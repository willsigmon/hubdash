import { NextResponse, NextRequest } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

/**
 * GET /api/donations/[id]
 * Fetch a specific donation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'

    // Fetch specific record from Knack
    const knackRecord = await knack.getRecord(objectKey, id)

    if (!knackRecord) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Transform Knack record to our format
    let email = '';
    if (typeof knackRecord.field_537_raw === 'string') {
      email = knackRecord.field_537_raw;
    } else if (knackRecord.field_537_raw?.email) {
      email = knackRecord.field_537_raw.email;
    }

    let location = 'Unknown';
    if (typeof knackRecord.field_566_raw === 'string') {
      location = knackRecord.field_566_raw;
    } else if (knackRecord.field_566_raw?.full) {
      location = knackRecord.field_566_raw.full;
    } else if (knackRecord.field_566_raw?.city && knackRecord.field_566_raw?.state) {
      location = `${knackRecord.field_566_raw.city}, ${knackRecord.field_566_raw.state}`;
    }

    let requestedDate = new Date().toISOString();
    if (knackRecord.field_536_raw) {
      const date = new Date(typeof knackRecord.field_536_raw === 'string' ? knackRecord.field_536_raw : knackRecord.field_536_raw.iso_timestamp);
      if (!isNaN(date.getTime())) {
        requestedDate = date.toISOString();
      }
    }

    const donation = {
      id: knackRecord.id,
      company: knackRecord.field_565_raw || 'Unknown',
      contact_name: knackRecord.field_538_raw || 'Unknown',
      contact_email: email,
      device_count: parseInt(knackRecord.field_542_raw || '0', 10),
      location,
      priority: 'normal' as const,
      status: 'pending' as const,
      requested_date: requestedDate,
    }

    return NextResponse.json(donation)
  } catch (error: any) {
    console.error('Donation API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * PUT /api/donations/[id]
 * Update a donation by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'

    // Map our fields to Knack fields
    const knackData: Record<string, any> = {}

    if (body.company !== undefined) {
      knackData.field_565 = body.company
    }
    if (body.contact_name !== undefined) {
      knackData.field_538 = body.contact_name
    }
    if (body.contact_email !== undefined) {
      knackData.field_537 = body.contact_email
    }
    if (body.device_count !== undefined) {
      knackData.field_542 = body.device_count
    }
    if (body.location !== undefined) {
      knackData.field_566 = body.location
    }
    if (body.status !== undefined) {
      knackData.field_567 = body.status
    }
    if (body.priority !== undefined) {
      knackData.field_568 = body.priority
    }
    if (body.scheduledDate !== undefined) {
      knackData.field_scheduled_date = body.scheduledDate
    }

    // Update the record in Knack
    const updatedRecord = await knack.updateRecord(objectKey, id, knackData)

    return NextResponse.json({
      success: true,
      message: 'Donation updated successfully',
      data: updatedRecord
    })
  } catch (error: any) {
    console.error('Donation PUT Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/donations/[id]
 * Partial update a donation by ID (same as PUT for now)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

/**
 * DELETE /api/donations/[id]
 * Delete a donation by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'

    // Delete the record from Knack
    await knack.deleteRecord(objectKey, id)

    return NextResponse.json({
      success: true,
      message: 'Donation deleted successfully'
    })
  } catch (error: any) {
    console.error('Donation DELETE Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
