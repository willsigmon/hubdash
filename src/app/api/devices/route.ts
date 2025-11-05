import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()
    const objectKey = process.env.KNACK_DEVICES_OBJECT || 'object_7'
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const devices = knackRecords.map((r: any) => {
      // Extract assigned_to - Knack returns arrays for connection fields
      let assignedTo = null;
      if (r.field_147_raw && Array.isArray(r.field_147_raw) && r.field_147_raw.length > 0) {
        assignedTo = r.field_147_raw[0].identifier || r.field_147_raw[0].id;
      }

      // Extract received_date - Knack returns objects for date fields
      let receivedDate = new Date().toISOString();
      if (r.field_60_raw) {
        if (typeof r.field_60_raw === 'string') {
          receivedDate = r.field_60_raw;
        } else if (r.field_60_raw.iso_timestamp) {
          receivedDate = r.field_60_raw.iso_timestamp;
        }
      }

      // Extract distributed_date
      let distributedDate = null;
      if (r.field_75_raw) {
        if (typeof r.field_75_raw === 'string') {
          distributedDate = r.field_75_raw;
        } else if (r.field_75_raw.iso_timestamp) {
          distributedDate = r.field_75_raw.iso_timestamp;
        }
      }

      return {
        id: r.id,
        serial_number: r.field_201_raw || `HTI-${r.field_142_raw || r.id}`,
        model: r.field_58_raw || 'Unknown',
        manufacturer: r.field_57_raw || 'Unknown',
        status: r.field_56_raw || 'Unknown',
        location: r.field_66_raw || 'Unknown',
        assigned_to: assignedTo,
        received_date: receivedDate,
        distributed_date: distributedDate,
        notes: r.field_40_raw || null,
      };
    })

    return NextResponse.json(devices)
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
