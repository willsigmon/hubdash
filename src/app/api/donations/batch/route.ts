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

const batchUpdateSchema = z.object({
  donationIds: z.array(z.string().min(1)).min(1).max(100), // Limit to 100 donations per batch
  updates: z.object({
    status: z.string().optional(),
    scheduledDate: z.string().optional(),
    notes: z.string().optional(),
  }),
});

/**
 * POST /api/donations/batch
 * Batch update multiple donations
 * Requires: Authorization header with WRITE_API_TOKEN
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = batchUpdateSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63';
    
    // Map updates to donation DTO format
    const donationDTO: DonationDTO = {
      status: validated.updates.status,
      scheduledDate: validated.updates.scheduledDate,
      notes: validated.updates.notes,
    };

    const payload = mapDonationPayload(donationDTO);

    // Update all donations in parallel
    const updatePromises = validated.donationIds.map((id) =>
      safeKnack(
        () => knack.updateRecord(objectKey, id, payload),
        `Update donation ${id}`
      )
    );

    const results = await Promise.allSettled(updatePromises);

    // Count successes and failures
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    // Invalidate caches
    invalidateCache(cacheKeys.donations);

    return NextResponse.json({
      ok: true,
      data: {
        total: validated.donationIds.length,
        successful,
        failed,
        results: results.map((r, i) => ({
          donationId: validated.donationIds[i],
          success: r.status === 'fulfilled',
          error: r.status === 'rejected' ? (r.reason as Error).message : null,
        })),
      },
    });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/donations/batch error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to batch update donations'), { status: 500 });
  }
}

