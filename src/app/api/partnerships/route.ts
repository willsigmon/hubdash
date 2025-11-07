import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'
import { getPartnershipFieldMap, normalizeKnackChoice, readKnackField, warnMissingPartnershipField } from '@/lib/knack/field-map'

/**
 * GET /api/partnerships - Fetch partnership applications
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all' // pending, recent, all

    const knack = getKnackClient()

    if (!knack.isConfigured()) {
      console.error('❌ Knack not configured for partnerships endpoint')
      return NextResponse.json(
        {
          error: 'Knack integration not configured',
          setup_guide: 'Run: npm run setup-knack'
        },
        { status: 503 }
      )
    }

    const objectKey = process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55'
    console.log(`🤝 Fetching partnerships from Knack object ${objectKey} (filter: ${filter})`)
    const partnershipFields = getPartnershipFieldMap()

    const filters: any[] = [];

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
        filters: filters.length > 0 ? filters : undefined
      }
    )

    // Validate API response
    if (!Array.isArray(knackRecords)) {
      console.error('Invalid Knack response - expected array:', knackRecords)
      return NextResponse.json({ error: 'Invalid data format from database' }, { status: 500 })
    }

    if (!process.env.KNACK_PARTNERSHIP_STATUS_FIELD) {
      warnMissingPartnershipField('status')
    }

    const partnerships = knackRecords.map((r: any) => {
      const statusValue = normalizeKnackChoice(readKnackField(r, partnershipFields.status))
        ?? normalizeKnackChoice(r.field_679_raw)
        ?? (typeof r.field_679 === 'string' ? r.field_679.trim() : undefined)
        ?? 'Pending'

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
        status: statusValue,
        email,
        address,
        county,
        contactPerson: r.field_427_raw || '',
        phone,
        preferredContactMethod: r.field_428_raw || '',
        is501c3: r.field_430_raw === true || r.field_430_raw === 'Yes',
        website: r.field_667_raw || '',
        organizationType: r.field_451_raw && Array.isArray(r.field_451_raw) && r.field_451_raw.length > 0
          ? r.field_451_raw[0]
          : '',
        workssWith: r.field_451_raw || [],
        chromebooksNeeded: parseInt(r.field_432_raw || '0', 10),
        firstTime: r.field_433_raw === 'Yes' || r.field_433_raw === true,
        howHeard: r.field_434_raw || '',
        clientStruggles: r.field_436_raw || [],
        howWillUse: r.field_437_raw || '',
        positiveImpact: r.field_439_raw || '',
        expectedImpact: r.field_439_raw || '',
        clientGoals: r.field_445_raw || '',
        howToContinueRelationship: r.field_455_raw || '',
        howClientsUseLaptops: r.field_456_raw || '',
        whatClientsAchieve: r.field_457_raw || '',
        oneWord: r.field_443_raw || '',
        // For quote generation
        quote: r.field_439_raw || r.field_437_raw || '', // Positive impact or how will use
        notes: '',
        internalComments: '',
      };
    });

    // Filter by date if needed
    let filteredPartnerships = partnerships;
    if (filter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      filteredPartnerships = partnerships.filter(p => {
        const date = new Date(p.timestamp);
        return !isNaN(date.getTime()) && date >= thirtyDaysAgo;
      });
    }

    return NextResponse.json(filteredPartnerships, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }, // 30min cache
    })
  } catch (error: any) {
    console.error('Partnerships API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
