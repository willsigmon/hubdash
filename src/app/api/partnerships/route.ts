import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

/**
 * GET /api/partnerships - Fetch partnership applications
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all' // pending, recent, all

    const knack = getKnackClient()
    const objectKey = process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55'

    let filters = [];

    // Filter by status for pending
    if (filter === 'pending') {
      filters.push({
        field: 'field_679', // Status field
        operator: 'is',
        value: 'Pending'
      });
    }

    const knackRecords = await knack.getRecords(
      objectKey,
      {
        rows_per_page: 1000,
        filters: filters.length > 0 ? JSON.stringify(filters) : undefined
      }
    )

    const partnerships = knackRecords.map((r: any) => {
      // Extract all the rich application data
      const address = typeof r.field_636_raw === 'string' ? r.field_636_raw : (r.field_636_raw?.full || '');
      const email = typeof r.field_425_raw === 'string' ? r.field_425_raw : (r.field_425_raw?.email || '');
      const phone = typeof r.field_658_raw === 'string' ? r.field_658_raw : (r.field_658_raw?.full || '');
      const county = r.field_672_raw && Array.isArray(r.field_672_raw) && r.field_672_raw.length > 0
        ? (r.field_672_raw[0].identifier || r.field_672_raw[0].id)
        : 'Unknown';

      return {
        id: r.id,
        timestamp: r.field_424_raw?.iso_timestamp || r.field_424_raw || new Date().toISOString(),
        organizationName: r.field_426_raw || 'Unknown',
        status: r.field_679_raw || 'Pending',
        email,
        address,
        county,
        contactPerson: r.field_427_raw || '',
        phone,
        is501c3: r.field_430_raw === true || r.field_430_raw === 'Yes',
        website: r.field_667_raw || '',
        workssWith: r.field_451_raw || [],
        chromebooksNeeded: parseInt(r.field_432_raw || '0'),
        clientStruggles: r.field_436_raw || [],
        howWillUse: r.field_437_raw || '',
        positiveImpact: r.field_439_raw || '',
        howHeard: r.field_434_raw || '',
        oneWord: r.field_443_raw || '',
        // For quote generation
        quote: r.field_439_raw || r.field_437_raw || '', // Positive impact or how will use
      };
    });

    // Filter by date if needed
    let filteredPartnerships = partnerships;
    if (filter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      filteredPartnerships = partnerships.filter(p =>
        new Date(p.timestamp) >= thirtyDaysAgo
      );
    }

    return NextResponse.json(filteredPartnerships, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
