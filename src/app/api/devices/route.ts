import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DEVICES_OBJECT || 'object_7'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const devices = knackRecords.map((r: any) => ({
      id: r.id,
      serial_number: r.field_201_raw || `HTI-${r.field_142_raw}`,
      model: r.field_58_raw || 'Unknown',
      manufacturer: r.field_57_raw || 'Unknown',
      status: r.field_56_raw || 'Unknown',
      location: r.field_66_raw || 'Unknown',
      assigned_to: r.field_147_raw || null,
      received_date: r.field_60_raw || new Date().toISOString(),
      distributed_date: r.field_75_raw || null,
      notes: r.field_40_raw || null,
    }))

    return NextResponse.json(devices)
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
