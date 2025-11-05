import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const donations = knackRecords.map((r: any) => {
      // Extract email - Knack returns objects
      let email = '';
      if (typeof r.field_537_raw === 'string') {
        email = r.field_537_raw;
      } else if (r.field_537_raw?.email) {
        email = r.field_537_raw.email;
      }

      // Extract address - Knack returns objects
      let location = 'Unknown';
      if (typeof r.field_566_raw === 'string') {
        location = r.field_566_raw;
      } else if (r.field_566_raw?.full) {
        location = r.field_566_raw.full;
      } else if (r.field_566_raw?.city && r.field_566_raw?.state) {
        location = `${r.field_566_raw.city}, ${r.field_566_raw.state}`;
      }

      // Extract date
      let requestedDate = new Date().toISOString();
      if (r.field_536_raw) {
        if (typeof r.field_536_raw === 'string') {
          requestedDate = r.field_536_raw;
        } else if (r.field_536_raw.iso_timestamp) {
          requestedDate = r.field_536_raw.iso_timestamp;
        }
      }

      return {
        id: r.id,
        company: r.field_565_raw || 'Unknown',
        contact_name: r.field_538_raw || 'Unknown',
        contact_email: email,
        device_count: parseInt(r.field_542_raw || '0'),
        location,
        priority: 'normal' as const,
        status: 'pending' as const,
        requested_date: requestedDate,
      };
    })

    return NextResponse.json(donations, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
