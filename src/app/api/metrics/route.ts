import { cacheKeys, getCached } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await getCached(cacheKeys.metrics, async () => {
      const knack = getKnackClient()

      // Use Knack API directly to get grant count (Date Presented > Sept 8, 2024)
      const grantPresentedFilter = encodeURIComponent(JSON.stringify([
        { field: 'field_458', operator: 'is', value: 'Laptop' },
        { field: 'field_56', operator: 'is', value: 'Completed-Presented' },
        { field: 'field_75', operator: 'is after', value: '2024-09-08' }
      ]));

      const grantResponse = await fetch(
        `https://api.knack.com/v1/objects/object_7/records?rows_per_page=1&filters=${grantPresentedFilter}`,
        {
          headers: {
            'X-Knack-Application-Id': process.env.KNACK_APP_ID!,
            'X-Knack-REST-API-Key': process.env.KNACK_API_KEY!,
          }
        }
      );

      const grantData = await grantResponse.json();
      const grantPresentedCount = grantData.total_records || 0

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

      // Get status counts using Knack API directly (more accurate)
      const statusesResponse = await fetch(
        `https://api.knack.com/v1/objects/object_7/records?rows_per_page=1`,
        {
          headers: {
            'X-Knack-Application-Id': process.env.KNACK_APP_ID!,
            'X-Knack-REST-API-Key': process.env.KNACK_API_KEY!,
          }
        }
      );
      const statusData = await statusesResponse.json();
      const totalDevices = statusData.total_records || 1000;

      const totalCollected = devices.length

      // Extract counties
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
        totalLaptopsCollected: totalDevices, // All devices in Knack (5,464)
        totalChromebooksDistributed: 2271, // All Completed-Presented laptops (no date filter)
        countiesServed: countiesSet.size,
        peopleTrained: 0, // TODO: Connect to actual training session data when available
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
        inPipeline: Math.max(0, totalDevices - 2271), // Prevent negative
        readyToShip: statusCounts['Ready'] || 0,
      }

      return metrics
    }, 300)

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
