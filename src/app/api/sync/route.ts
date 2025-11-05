import { NextRequest, NextResponse } from 'next/server';
import { syncAll } from '@/lib/knack/sync';

/**
 * CRON Sync Endpoint - Vercel Cron & GitHub Actions
 *
 * GET /api/sync - Trigger a full sync (runs every hour via Vercel cron)
 * POST /api/sync - Manual sync trigger (requires CRON_SECRET)
 *
 * Security:
 * - Vercel crons include authorization headers automatically
 * - Manual requests require CRON_SECRET for production
 *
 * Monitoring:
 * - All syncs logged with timestamp and results
 * - Errors tracked for alerting
 * - Response includes detailed sync summary
 */

const CRON_SECRET = process.env.CRON_SECRET || 'development-only';
const PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Verify authorization for cron endpoint
 */
function verifyCronAuth(request: NextRequest): boolean {
  // In production, require CRON_SECRET for manual triggers
  if (PRODUCTION) {
    // Vercel automatically adds authorization header for scheduled crons
    const authHeader = request.headers.get('authorization');
    if (!authHeader && !request.headers.has('x-vercel-cron-signature')) {
      return false;
    }
  }
  return true;
}

/**
 * Log sync result for monitoring
 */
function logSyncResult(summary: any, durationMs: number) {
  const level = summary.totalErrors > 0 ? 'WARN' : 'INFO';
  const message = `[SYNC] ${summary.totalRecordsSynced} records synced, ${summary.totalErrors} errors in ${durationMs}ms`;

  if (typeof window === 'undefined') {
    // Server-side logging
    if (level === 'WARN') {
      console.warn(message);
    } else {
      console.log(message);
    }
  }

  return { level, message, duration: durationMs };
}

/**
 * GET /api/sync - Vercel cron endpoint (runs hourly)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify authorization (Vercel provides headers for scheduled crons)
    if (!verifyCronAuth(request)) {
      console.error('Cron: Unauthorized request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[SYNC] Starting Knack → Supabase sync...`);

    const results = await syncAll();

    const totalSynced = results.reduce((sum, r) => sum + r.recordsSynced, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    const summary = {
      timestamp: new Date().toISOString(),
      totalRecordsSynced: totalSynced,
      totalErrors: totalErrors,
      syncDuration: `${Date.now() - startTime}ms`,
      results: results.map(r => ({
        table: r.table,
        success: r.success,
        recordsSynced: r.recordsSynced,
        errors: r.errors.length > 0 ? r.errors : [],
      })),
    };

    const durationMs = Date.now() - startTime;
    logSyncResult(summary, durationMs);

    // Return 200 even if there are errors (cron should not retry based on response)
    // Errors are tracked in the response body for monitoring
    return NextResponse.json(summary, {
      status: totalErrors === 0 ? 200 : 206,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Sync-Status': totalErrors === 0 ? 'success' : 'partial',
      },
    });

  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[SYNC] Critical error after ${durationMs}ms:`, {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Sync failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        syncDuration: `${durationMs}ms`,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Sync-Status': 'error',
        },
      }
    );
  }
}

/**
 * POST /api/sync - Manual sync trigger
 *
 * Requires CRON_SECRET in production
 *
 * Request body:
 * {
 *   "table": "devices" | "donations" | "all" (optional, defaults to "all")
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify authorization for manual triggers
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (PRODUCTION && providedSecret !== CRON_SECRET) {
      console.warn(`[SYNC] Unauthorized POST request from ${request.headers.get('x-forwarded-for')}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { table = 'all' } = body;

    console.log(`[SYNC] Manual sync triggered for table: ${table}`);

    let results;

    if (table === 'all') {
      results = await syncAll();
    } else {
      const { syncDevices, syncDonations } = await import('@/lib/knack/sync');

      switch (table) {
        case 'devices':
          results = [await syncDevices()];
          break;
        case 'donations':
          results = [await syncDonations()];
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid table. Use: "all", "devices", or "donations"' },
            { status: 400 }
          );
      }
    }

    const totalSynced = results.reduce((sum: number, r: any) => sum + r.recordsSynced, 0);
    const totalErrors = results.reduce((sum: number, r: any) => sum + r.errors.length, 0);

    const summary = {
      timestamp: new Date().toISOString(),
      totalRecordsSynced: totalSynced,
      totalErrors: totalErrors,
      syncDuration: `${Date.now() - startTime}ms`,
      results: results.map((r: any) => ({
        table: r.table,
        success: r.success,
        recordsSynced: r.recordsSynced,
        errors: r.errors.length > 0 ? r.errors : [],
      })),
    };

    const durationMs = Date.now() - startTime;
    logSyncResult(summary, durationMs);

    return NextResponse.json(summary, {
      status: totalErrors === 0 ? 200 : 206,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Sync-Status': totalErrors === 0 ? 'success' : 'partial',
      },
    });

  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[SYNC] POST error after ${durationMs}ms:`, {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Sync failed',
        message: error.message,
        timestamp: new Date().toISOString(),
        syncDuration: `${durationMs}ms`,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Sync-Status': 'error',
        },
      }
    );
  }
}
