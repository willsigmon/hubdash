import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const donations = knackRecords.map((r: any) => ({
      id: r.id,
      company: r.field_565_raw || 'Unknown',
      contact_name: r.field_538_raw || 'Unknown',
      contact_email: r.field_537_raw || '',
      device_count: parseInt(r.field_542_raw || '0'),
      location: r.field_566_raw || 'Unknown',
      priority: 'normal',
      status: 'pending',
      requested_date: r.field_536_raw || new Date().toISOString(),
    }))

    return NextResponse.json(donations, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
