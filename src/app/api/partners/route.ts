import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const partners = knackRecords.map((r: any) => ({
      id: r.id,
      name: r.field_143_raw || 'Unknown',
      type: 'nonprofit',
      contact_email: r.field_146_raw || '',
      address: r.field_612_raw || '',
      county: r.field_613_raw || 'Unknown',
      devices_received: r.field_669_raw || 0,
    }))

    return NextResponse.json(partners, {
      headers: { 'Cache-Control': 'public, s-maxage=600' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
