import { NextResponse } from 'next/server';
import { syncAll } from '@/lib/knack/sync';

/**
 * API Route to manually trigger Knack → Supabase sync
 * GET /api/sync - Trigger a full sync
 */
export async function GET() {
  try {
    const results = await syncAll();

    const summary = {
      timestamp: new Date().toISOString(),
      totalRecordsSynced: results.reduce((sum, r) => sum + r.recordsSynced, 0),
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      results: results.map(r => ({
        table: r.table,
        success: r.success,
        recordsSynced: r.recordsSynced,
        errors: r.errors,
      })),
    };

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sync - Trigger sync for specific table
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table } = body;

    // Import individual sync functions
    const { syncDevices, syncDonations } = await import('@/lib/knack/sync');

    let result;
    switch (table) {
      case 'devices':
        result = await syncDevices();
        break;
      case 'donations':
        result = await syncDonations();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid table specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error.message },
      { status: 500 }
    );
  }
}
