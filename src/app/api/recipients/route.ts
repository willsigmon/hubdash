import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'
import { cacheKeys, getCached } from '@/lib/knack/cache-manager'

/**
 * GET /api/recipients - Fetch individual laptop recipients with quotes
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'recent' // recent, all

    const cacheKey = cacheKeys.recipients(filter);

    const filteredRecipients = await getCached(
      cacheKey,
      async () => {
        const knack = getKnackClient()
        const objectKey = process.env.KNACK_LAPTOP_APPLICATIONS_OBJECT || 'object_62'
        const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

        // Validate API response
        if (!Array.isArray(knackRecords)) {
          console.error('Invalid Knack response - expected array:', knackRecords)
          throw new Error('Invalid data format from database');
        }

        const recipients = knackRecords.map((r: any) => {
          const email = typeof r.field_522_raw === 'string' ? r.field_522_raw : (r.field_522_raw?.email || '');
          const phone = typeof r.field_523_raw === 'string' ? r.field_523_raw : (r.field_523_raw?.full || '');
          const address = typeof r.field_578_raw === 'string' ? r.field_578_raw : (r.field_578_raw?.full || '');
          const county = r.field_581_raw && Array.isArray(r.field_581_raw) && r.field_581_raw.length > 0
            ? (r.field_581_raw[0].identifier || r.field_581_raw[0].id)
            : 'Unknown';

          // Validate dates to prevent Invalid Date
          const datePresented = r.field_557_raw
            ? (() => {
                const date = new Date(typeof r.field_557_raw === 'string' ? r.field_557_raw : r.field_557_raw.iso_timestamp);
                return !isNaN(date.getTime()) ? date.toISOString() : null;
              })()
            : null;

          const timestamp = r.field_521_raw
            ? (() => {
                const date = new Date(typeof r.field_521_raw === 'string' ? r.field_521_raw : r.field_521_raw.iso_timestamp);
                return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
              })()
            : new Date().toISOString();

          return {
            id: r.id,
            name: r.field_520_raw || 'Unknown',
            email,
            phone,
            address,
            county,
            occupation: r.field_524_raw || r.field_525_raw || 'Unknown',
            status: r.field_556_raw || 'Pending',
            datePresented,
            timestamp,
            interestedInTraining: r.field_668_raw === true,
            // Marketing data for quotes
            reasonForApplication: r.field_528_raw || '',
            howWillUse: r.field_584_raw || [],
            obstacles: r.field_644_raw || [],
            overcomingObstacles: r.field_645_raw || '',
            // Generate quote from their application
            quote: r.field_528_raw || r.field_645_raw || '',
          };
        });

        // Filter by date if needed
        let filtered = recipients;
        if (filter === 'recent') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          filtered = recipients.filter(r => {
            if (!r.datePresented) return false;
            const date = new Date(r.datePresented);
            return !isNaN(date.getTime()) && date >= thirtyDaysAgo;
          });
        }

        // Sort by most recent first
        filtered.sort((a, b) => {
          const dateA = new Date(b.timestamp);
          const dateB = new Date(a.timestamp);
          return dateA.getTime() - dateB.getTime();
        });

        return filtered;
      },
      300 // 5 minute TTL
    );

    return NextResponse.json(filteredRecipients, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  } catch (error: any) {
    console.error('Recipients API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
