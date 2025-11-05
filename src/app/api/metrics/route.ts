import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()

    // Use Knack API filters for grant laptops (Date Presented > Sept 8, 2024)
    const grantPresentedFilter = JSON.stringify([
      { field: 'field_458', operator: 'is', value: 'Laptop' },
      { field: 'field_56', operator: 'is', value: 'Completed-Presented' },
      { field: 'field_75', operator: 'is after', value: '2024-09-08' } // Date Presented
    ]);

    const grantPresentedResult = await knack.getRecords(
      process.env.KNACK_DEVICES_OBJECT || 'object_7',
      { rows_per_page: 1, filters: grantPresentedFilter }
    )

    // Get count from total_records (don't need actual records, just the count)
    const grantPresentedCount = (grantPresentedResult as any).total_records || 0

    // Also get all laptops for total count
    const laptopFilter = JSON.stringify([
      { field: 'field_458', operator: 'is', value: 'Laptop' }
    ]);

    const allLaptops = await knack.getRecords(
      process.env.KNACK_DEVICES_OBJECT || 'object_7',
      { rows_per_page: 1000, filters: laptopFilter }
    )

    const organizations = await knack.getRecords(process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22', { rows_per_page: 1000 })

    const devices = allLaptops

    // Grant start date: September 9, 2024
    const GRANT_START_DATE = new Date('2024-09-09T00:00:00.000Z');

    const totalCollected = devices.length

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
      // GRANT METRICS (Primary - Date Presented > Sept 8, 2024)
      grantLaptopsPresented: grantPresentedCount,
      grantLaptopGoal: 1500, // Updated Nov 5, 2025 (was 2,500)
      grantLaptopProgress: Math.round((grantPresentedCount / 1500) * 100),
      grantTrainingHoursGoal: 125, // Cut in half (was 250)

      // OVERALL METRICS (All-time - shown as subsidiary)
      totalLaptopsCollected: totalCollected, // Just the 1000 fetched for now
      totalChromebooksDistributed: 2271, // All Completed-Presented laptops (no date filter)
      countiesServed: countiesSet.size,
      peopleTrained: 450, // Static for now
      eWasteTons: Math.round((totalCollected * 5) / 2000),
      partnerOrganizations: organizations.length,

      // Pipeline
      pipeline: {
        donated: statusCounts['Donated'] || 0,
        received: statusCounts['Received'] || 0,
        dataWipe: statusCounts['Data Wipe'] || 0,
        refurbishing: statusCounts['Refurbishing'] || 0,
        qaTesting: statusCounts['QA Testing'] || 0,
        ready: statusCounts['Ready'] || 0,
        distributed: 2271, // All Completed-Presented (no date filter)
      },
      inPipeline: totalCollected - 2271,
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
