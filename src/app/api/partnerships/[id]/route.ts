import { NextResponse } from 'next/server';
import { getKnackClient } from '@/lib/knack/client';
import { getPartnershipFieldMap, warnMissingPartnershipField } from '@/lib/knack/field-map';

/**
 * Update a partnership application status
 * PUT /api/partnerships/[id]
 *
 * Updates partnership application status and notes in Knack.
 * Field mappings:
 * - field_679: Status (Pending, In Review, Approved, Rejected)
 * - field_XXX_notes: Notes field (TODO: Update with actual field ID)
 * - field_XXX_internal_comments: Internal comments (TODO: Update with actual field ID)
 */
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status, notes, internalComments } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Partnership ID is required' },
                { status: 400 }
            );
        }

        const knack = getKnackClient();
        const objectKey = process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55';

        // Build update payload
        const updateData: Record<string, any> = {};
        const partnershipFields = getPartnershipFieldMap();

        // Map status to Knack field (field_679 is confirmed from GET endpoint)
        if (status) {
            // Validate status value
            const validStatuses = ['Pending', 'In Review', 'Approved', 'Rejected'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                    { status: 400 }
                );
            }
            updateData[partnershipFields.status] = status;
            if (!process.env.KNACK_PARTNERSHIP_STATUS_FIELD) {
                warnMissingPartnershipField('status');
            }
        }

        // Map notes/comments to Knack fields
        if (notes !== undefined && notes !== null && notes !== '') {
            if (partnershipFields.notes) {
                updateData[partnershipFields.notes] = notes;
            } else {
                warnMissingPartnershipField('notes');
            }
        }

        if (internalComments !== undefined && internalComments !== null && internalComments !== '') {
            if (partnershipFields.internalComments) {
                updateData[partnershipFields.internalComments] = internalComments;
            } else {
                warnMissingPartnershipField('internalComments');
            }
        }

        // Only proceed if we have something to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        await knack.updateRecord(objectKey, id, updateData);

        return NextResponse.json({
            success: true,
            message: 'Partnership application updated successfully',
            updatedFields: Object.keys(updateData),
        });
    } catch (error: any) {
        console.error('Error updating partnership:', error);
        const errorMessage = error?.message || 'Failed to update partnership application';

        // Provide more helpful error messages
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
            return NextResponse.json(
                { error: 'Partnership application not found' },
                { status: 404 }
            );
        }

        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
            return NextResponse.json(
                { error: 'Unauthorized - check Knack API credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
