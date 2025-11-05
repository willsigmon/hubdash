import { NextResponse } from 'next/server';
import { discoverKnackObjects, suggestFieldMappings } from '@/lib/knack/discovery';

/**
 * API Route to discover Knack objects and suggest field mappings
 * GET /api/knack/discover - Get all Knack objects with suggested mappings
 * GET /api/knack/discover?object=devices - Get specific object with mappings
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetTable = searchParams.get('table') as 'devices' | 'donations' | 'partners' | 'training_sessions' | 'activity_log' | null;

    const objects = await discoverKnackObjects();

    if (targetTable && objects.length > 0) {
      // Return specific object with suggested mappings
      const objectToMap = objects[0]; // In real scenario, would match by name
      const mappings = suggestFieldMappings(objectToMap, targetTable);

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        object: objectToMap,
        suggestedMappings: mappings,
      });
    }

    // Return all objects
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      objectCount: objects.length,
      objects: objects.map(obj => ({
        key: obj.key,
        name: obj.name,
        fieldCount: obj.fields.length,
        fields: obj.fields,
      })),
    });
  } catch (error: any) {
    console.error('Object discovery error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Discovery failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
