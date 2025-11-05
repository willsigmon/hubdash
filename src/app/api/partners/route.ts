import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const partners = knackRecords.map((r: any) => {
      // Extract county - Knack returns arrays with {id, identifier} objects for connection fields
      let county = 'Unknown';
      if (r.field_613_raw && Array.isArray(r.field_613_raw) && r.field_613_raw.length > 0) {
        county = r.field_613_raw[0].identifier || r.field_613_raw[0].id || 'Unknown';
      } else if (typeof r.field_613_raw === 'string') {
        county = r.field_613_raw;
      }

      // Extract email - Knack returns objects for email fields
      let email = '';
      if (typeof r.field_146_raw === 'string') {
        email = r.field_146_raw;
      } else if (r.field_146_raw?.email) {
        email = r.field_146_raw.email;
      }

      // Extract address - Knack returns objects for address fields
      let address = '';
      if (typeof r.field_612_raw === 'string') {
        address = r.field_612_raw;
      } else if (r.field_612_raw?.full) {
        address = r.field_612_raw.full;
      }

      return {
        id: r.id,
        name: r.field_143_raw || 'Unknown',
        type: 'nonprofit',
        contact_email: email,
        address,
        county,
        devices_received: r.field_669_raw || 0,
      };
    })

    return NextResponse.json(partners, {
      headers: { 'Cache-Control': 'public, s-maxage=600' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
