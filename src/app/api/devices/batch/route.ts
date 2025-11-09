import { cacheKeys, invalidateCache } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import {
    errorResponse,
    mapDevicePayload,
    requireAuth,
    safeKnack,
    successResponse,
    type DeviceDTO
} from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const batchUpdateSchema = z.object({
  deviceIds: z.array(z.string().min(1)).min(1).max(100), // Limit to 100 devices per batch
  updates: z.object({
    status: z.string().optional(),
    assignedTo: z.string().optional(),
    orgId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

/**
 * POST /api/devices/batch
 * Batch update multiple devices
 * Requires: Authorization header with WRITE_API_TOKEN
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = batchUpdateSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_DEVICES_OBJECT || 'object_7';

    // Map updates to device DTO format
    const deviceDTO: DeviceDTO = {
      status: validated.updates.status,
      orgId: validated.updates.orgId,
      notes: validated.updates.notes,
    };

    const payload = mapDevicePayload(deviceDTO);

    // If assignedTo is provided, add it to payload (adjust field ID)
    if (validated.updates.assignedTo) {
      payload.field_147 = [validated.updates.assignedTo]; // Connection field
    }

    // Update all devices in parallel
    const updatePromises = validated.deviceIds.map((id) =>
      safeKnack(
        () => knack.updateRecord(objectKey, id, payload),
        `Update device ${id}`
      )
    );

    const results = await Promise.allSettled(updatePromises);

    // Count successes and failures
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    // Invalidate caches
    invalidateCache(cacheKeys.devices);

    return NextResponse.json({
      ok: true,
      data: {
        total: validated.deviceIds.length,
        successful,
        failed,
        results: results.map((r, i) => ({
          deviceId: validated.deviceIds[i],
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
    console.error('POST /api/devices/batch error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to batch update devices'), { status: 500 });
  }
}
