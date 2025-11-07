import { NextResponse } from 'next/server';
import { getKnackClient } from '@/lib/knack/client';
import { getDonationFieldMap, warnMissingDonationField } from '@/lib/knack/field-map';

/**
 * Update a donation request status
 * PUT /api/donations/[id]
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, priority, notes } = body;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63';

    // Build update payload
    // NOTE: Update these field IDs to match your Knack object field IDs
    const updateData: Record<string, any> = {};
    const donationFields = getDonationFieldMap();

    // Map status to Knack field
    if (status) {
      if (donationFields.status) {
        updateData[donationFields.status] = status;
      } else {
        warnMissingDonationField('status');
      }
    }

    // Map priority to Knack field
    if (priority) {
      if (donationFields.priority) {
        updateData[donationFields.priority] = priority;
      } else {
        warnMissingDonationField('priority');
      }
    }

    // Map notes to Knack field
    if (notes !== undefined) {
      if (donationFields.notes) {
        updateData[donationFields.notes] = notes;
      } else {
        warnMissingDonationField('notes');
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No configured Knack fields to update for donation request' },
        { status: 400 }
      );
    }

    await knack.updateRecord(objectKey, id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Donation request updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating donation request:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update donation request' },
      { status: 500 }
    );
  }
}
