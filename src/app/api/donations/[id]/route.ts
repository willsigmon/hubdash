import { NextResponse, NextRequest } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'
import { mapDonationPayload } from '@/lib/knack/write-utils'

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

    // Extract email - Knack returns objects
    let email = '';
    if (typeof knackRecord.field_537_raw === 'string') {
      email = knackRecord.field_537_raw;
    } else if (knackRecord.field_537_raw?.email) {
      email = knackRecord.field_537_raw.email;
    }

    // Extract address - Knack returns objects
    let location = 'Location Not Provided';
    if (typeof knackRecord.field_566_raw === 'string') {
      location = knackRecord.field_566_raw;
    } else if (knackRecord.field_566_raw?.full) {
      location = knackRecord.field_566_raw.full;
    } else if (knackRecord.field_566_raw?.city && knackRecord.field_566_raw?.state) {
      location = `${knackRecord.field_566_raw.city}, ${knackRecord.field_566_raw.state}`;
    }

    // Extract date - validate to prevent Invalid Date
    let requestedDate = new Date().toISOString();
    if (knackRecord.field_536_raw) {
      const date = new Date(typeof knackRecord.field_536_raw === 'string' ? knackRecord.field_536_raw : knackRecord.field_536_raw.iso_timestamp);
      if (!isNaN(date.getTime())) {
        requestedDate = date.toISOString();
      }
    }

    // Extract company name - try multiple fields
    let company = '';
    if (knackRecord.field_565_raw) {
      company = typeof knackRecord.field_565_raw === 'string' ? knackRecord.field_565_raw : knackRecord.field_565_raw.name || knackRecord.field_565_raw.full || '';
    }
    if (!company && knackRecord.field_company) {
      company = typeof knackRecord.field_company === 'string' ? knackRecord.field_company : knackRecord.field_company.name || '';
    }
    if (!company && knackRecord.field_donor_name) {
      company = typeof knackRecord.field_donor_name === 'string' ? knackRecord.field_donor_name : knackRecord.field_donor_name.name || '';
    }

    // Extract contact name - try multiple fields
    let contactName = '';
    if (knackRecord.field_538_raw) {
      contactName = typeof knackRecord.field_538_raw === 'string' ? knackRecord.field_538_raw : knackRecord.field_538_raw.name || knackRecord.field_538_raw.full || '';
    }
    if (!contactName && knackRecord.field_contact_name) {
      contactName = typeof knackRecord.field_contact_name === 'string' ? knackRecord.field_contact_name : knackRecord.field_contact_name.name || '';
    }
    if (!contactName && knackRecord.field_contact) {
      contactName = typeof knackRecord.field_contact === 'string' ? knackRecord.field_contact : knackRecord.field_contact.name || '';
    }

    // Extract device count - ensure it's a valid number
    const deviceCount = parseInt(String(knackRecord.field_542_raw || knackRecord.field_device_count || knackRecord.field_count || '0'), 10) || 0;

    // Extract status - check multiple fields
    let status = 'pending';
    if (knackRecord.field_status) {
      const statusValue = typeof knackRecord.field_status === 'string' ? knackRecord.field_status.toLowerCase() : String(knackRecord.field_status).toLowerCase();
      if (statusValue.includes('scheduled')) status = 'scheduled';
      else if (statusValue.includes('in_progress') || statusValue.includes('in progress')) status = 'in_progress';
      else if (statusValue.includes('completed') || statusValue.includes('done')) status = 'completed';
    }

    // Extract priority
    let priority: 'urgent' | 'high' | 'normal' = 'normal';
    if (knackRecord.field_priority) {
      const priorityValue = typeof knackRecord.field_priority === 'string' ? knackRecord.field_priority.toLowerCase() : String(knackRecord.field_priority).toLowerCase();
      if (priorityValue.includes('urgent')) priority = 'urgent';
      else if (priorityValue.includes('high')) priority = 'high';
    }

    const donation = {
      id: knackRecord.id,
      company: company || 'Unnamed Donor',
      contact_name: contactName || 'Contact Not Provided',
      contact_email: email || '',
      device_count: deviceCount,
      location: location || 'Location Not Provided',
      priority,
      status: status as 'pending' | 'scheduled' | 'in_progress' | 'completed',
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

    // Map our fields to Knack fields using write-utils
    const knackData = mapDonationPayload({
      donorName: body.company,
      contactName: body.contact_name,
      donorEmail: body.contact_email,
      pickupAddress: body.location,
      status: body.status,
      priority: body.priority,
      deviceCount: body.device_count,
      scheduledDate: body.scheduledDate,
    });

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
