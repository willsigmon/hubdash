import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()

    const devices = await knack.getRecords(process.env.KNACK_DEVICES_OBJECT || 'object_7', { rows_per_page: 10000 })
    const organizations = await knack.getRecords(process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22', { rows_per_page: 1000 })

    const totalCollected = devices.length
    const presented = devices.filter((d: any) => d.field_73_raw === true).length

    // Extract counties - Knack returns connection objects
    const countiesSet = new Set();
    organizations.forEach((org: any) => {
      if (org.field_613_raw && Array.isArray(org.field_613_raw) && org.field_613_raw.length > 0) {
        countiesSet.add(org.field_613_raw[0].identifier || org.field_613_raw[0].id);
      } else if (typeof org.field_613_raw === 'string') {
        countiesSet.add(org.field_613_raw);
      }
    })

    const statusCounts: any = {}
    devices.forEach((device: any) => {
      const status = device.field_56_raw || 'Unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    const metrics = {
      laptopsCollected: totalCollected,
      chromebooksDistributed: presented,
      countiesServed: countiesSet.size,
      peopleTrained: 450, // Static for now
      eWasteTons: Math.round((totalCollected * 5) / 2000),
      partnerOrganizations: organizations.length,
      pipeline: {
        donated: statusCounts['Donated'] || 0,
        received: statusCounts['Received'] || 0,
        dataWipe: statusCounts['Data Wipe'] || 0,
        refurbishing: statusCounts['Refurbishing'] || 0,
        qaTesting: statusCounts['QA Testing'] || 0,
        ready: statusCounts['Ready'] || 0,
        distributed: presented,
      },
      inPipeline: totalCollected - presented,
      readyToShip: statusCounts['Ready'] || 0,
    }

    return NextResponse.json(metrics, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
