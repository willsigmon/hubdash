import { cacheKeys, getCached, invalidateCache } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import {
    errorResponse,
    requireAuth,
    safeKnack,
    successResponse
} from '@/lib/knack/write-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * GET /api/training
 * Get all training sessions
 */
export async function GET() {
  try {
    const trainings = await getCached(
      'training',
      async () => {
        const knack = getKnackClient()
        const objectKey = process.env.KNACK_TRAINING_OBJECT || 'object_8'
        const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

        if (!Array.isArray(knackRecords)) {
          console.error('Invalid Knack response - expected array:', knackRecords)
          throw new Error('Invalid data format from database');
        }

        return knackRecords.map((r: any) => ({
          id: r.id,
          sessionDate: r.field_date_raw?.iso_timestamp || r.field_date || null,
          location: r.field_location || '',
          attendees: r.field_attendees || 0,
          instructor: r.field_instructor || '',
          topic: r.field_topic || '',
          notes: r.field_notes || '',
        }));
      },
      300 // 5 minute TTL
    );

    return NextResponse.json(trainings, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  } catch (error: any) {
    console.error('Training API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const createTrainingSchema = z.object({
  sessionDate: z.string().optional(),
  location: z.string().optional(),
  attendees: z.number().int().min(0).optional(),
  instructor: z.string().optional(),
  topic: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/training
 * Create a new training session
 */
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = createTrainingSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TRAINING_OBJECT || 'object_8';
    
    // Map to Knack fields (adjust field IDs based on actual schema)
    const payload: Record<string, any> = {};
    if (validated.sessionDate) payload.field_date = validated.sessionDate;
    if (validated.location) payload.field_location = validated.location;
    if (validated.attendees !== undefined) payload.field_attendees = validated.attendees;
    if (validated.instructor) payload.field_instructor = validated.instructor;
    if (validated.topic) payload.field_topic = validated.topic;
    if (validated.notes) payload.field_notes = validated.notes;

    const newRecord = await safeKnack(
      () => knack.createRecord(objectKey, payload),
      'Create training session'
    );

    invalidateCache('training');

    return NextResponse.json(successResponse(newRecord, newRecord.id), { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('POST /api/training error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to create training session'), { status: 500 });
  }
}

const updateTrainingSchema = z.object({
  id: z.string().min(1),
  sessionDate: z.string().optional(),
  location: z.string().optional(),
  attendees: z.number().int().min(0).optional(),
  instructor: z.string().optional(),
  topic: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * PUT /api/training
 * Update a training session
 */
export async function PUT(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = updateTrainingSchema.parse(body);
    const { id, ...updates } = validated;

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TRAINING_OBJECT || 'object_8';
    
    const payload: Record<string, any> = {};
    if (updates.sessionDate) payload.field_date = updates.sessionDate;
    if (updates.location) payload.field_location = updates.location;
    if (updates.attendees !== undefined) payload.field_attendees = updates.attendees;
    if (updates.instructor) payload.field_instructor = updates.instructor;
    if (updates.topic) payload.field_topic = updates.topic;
    if (updates.notes) payload.field_notes = updates.notes;

    const updatedRecord = await safeKnack(
      () => knack.updateRecord(objectKey, id, payload),
      'Update training session'
    );

    invalidateCache('training');

    return NextResponse.json(successResponse(updatedRecord, id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('PUT /api/training error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to update training session'), { status: 500 });
  }
}

const deleteTrainingSchema = z.object({
  id: z.string().min(1),
});

/**
 * DELETE /api/training
 * Delete a training session
 */
export async function DELETE(request: NextRequest) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validated = deleteTrainingSchema.parse(body);

    const knack = getKnackClient();
    const objectKey = process.env.KNACK_TRAINING_OBJECT || 'object_8';

    await safeKnack(
      () => knack.deleteRecord(objectKey, validated.id),
      'Delete training session'
    );

    invalidateCache('training');

    return NextResponse.json(successResponse({ deleted: true }, validated.id));
  } catch (error: any) {
    if (error.message?.includes('authorization') || error.message?.includes('Authorization')) {
      return NextResponse.json(errorResponse(error.message, 401), { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json(errorResponse('Invalid request data: ' + error.message, 400), { status: 400 });
    }
    console.error('DELETE /api/training error:', error);
    return NextResponse.json(errorResponse(error.message || 'Failed to delete training session'), { status: 500 });
  }
}

