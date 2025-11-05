import { NextResponse } from 'next/server';

/**
 * API Route to get sync history
 * This would integrate with a database in production
 * For now, returns mock data
 */

interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  totalRecords: number;
  tables: {
    name: string;
    records: number;
    status: 'success' | 'failed';
  }[];
}

// Mock sync history data
const mockHistory: SyncHistoryEntry[] = [
  {
    id: 'sync-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    duration: 45,
    status: 'success',
    totalRecords: 1250,
    tables: [
      { name: 'devices', records: 450, status: 'success' },
      { name: 'donations', records: 380, status: 'success' },
      { name: 'partners', records: 420, status: 'success' },
    ],
  },
  {
    id: 'sync-002',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    duration: 52,
    status: 'success',
    totalRecords: 1200,
    tables: [
      { name: 'devices', records: 420, status: 'success' },
      { name: 'donations', records: 370, status: 'success' },
      { name: 'partners', records: 410, status: 'success' },
    ],
  },
  {
    id: 'sync-003',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    duration: 38,
    status: 'success',
    totalRecords: 1180,
    tables: [
      { name: 'devices', records: 410, status: 'success' },
      { name: 'donations', records: 360, status: 'success' },
      { name: 'partners', records: 410, status: 'success' },
    ],
  },
  {
    id: 'sync-004',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    duration: 41,
    status: 'partial',
    totalRecords: 980,
    tables: [
      { name: 'devices', records: 400, status: 'success' },
      { name: 'donations', records: 280, status: 'failed' },
      { name: 'partners', records: 300, status: 'success' },
    ],
  },
  {
    id: 'sync-005',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    duration: 48,
    status: 'success',
    totalRecords: 1150,
    tables: [
      { name: 'devices', records: 405, status: 'success' },
      { name: 'donations', records: 355, status: 'success' },
      { name: 'partners', records: 390, status: 'success' },
    ],
  },
];

export async function GET() {
  try {
    // In production, fetch from database
    const history = mockHistory.slice(0, 10); // Last 10 syncs

    return NextResponse.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error: any) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sync history',
        message: error.message
      },
      { status: 500 }
    );
  }
}
