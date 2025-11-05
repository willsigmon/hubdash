import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

/**
 * GET /api/recipients - Fetch individual laptop recipients with quotes
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'recent' // recent, all

    const knack = getKnackClient()
    const objectKey = process.env.KNACK_LAPTOP_APPLICATIONS_OBJECT || 'object_62'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const recipients = knackRecords.map((r: any) => {
      const email = typeof r.field_522_raw === 'string' ? r.field_522_raw : (r.field_522_raw?.email || '');
      const phone = typeof r.field_523_raw === 'string' ? r.field_523_raw : (r.field_523_raw?.full || '');
      const address = typeof r.field_578_raw === 'string' ? r.field_578_raw : (r.field_578_raw?.full || '');
      const county = r.field_581_raw && Array.isArray(r.field_581_raw) && r.field_581_raw.length > 0
        ? (r.field_581_raw[0].identifier || r.field_581_raw[0].id)
        : 'Unknown';

      return {
        id: r.id,
        name: r.field_520_raw || 'Unknown',
        email,
        phone,
        address,
        county,
        occupation: r.field_524_raw || r.field_525_raw || 'Unknown',
        status: r.field_556_raw || 'Pending',
        datePresented: r.field_557_raw?.iso_timestamp || r.field_557_raw || null,
        timestamp: r.field_521_raw?.iso_timestamp || r.field_521_raw || new Date().toISOString(),
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
    let filteredRecipients = recipients;
    if (filter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      filteredRecipients = recipients.filter(r =>
        r.datePresented ? new Date(r.datePresented) >= thirtyDaysAgo : false
      );
    }

    // Sort by most recent first
    filteredRecipients.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(filteredRecipients, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
