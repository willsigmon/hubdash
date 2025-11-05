import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

export async function GET() {
  try {
    const knack = getKnackClient()

    const devices = await knack.getRecords(process.env.KNACK_DEVICES_OBJECT || 'object_7', { rows_per_page: 10000 })
    const organizations = await knack.getRecords(process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22', { rows_per_page: 1000 })

    // Grant start date: September 9, 2024
    const GRANT_START_DATE = new Date('2024-09-09T00:00:00.000Z');

    const totalCollected = devices.length
    const totalPresented = devices.filter((d: any) => d.field_73_raw === true).length

    // Grant-specific: Only count devices presented since Sept 9, 2024
    const grantPresented = devices.filter((d: any) => {
      // Check if presented - field_73 can be boolean OR string
      const isPresented = d.field_73_raw === true ||
                         d.field_73_raw === 'Yes' ||
                         d.field_73 === true ||
                         d.field_73 === 'Yes' ||
                         d.field_56_raw?.includes('Presented') || // Status includes "Presented"
                         d.field_56_raw?.includes('Completed-Presented');

      if (!isPresented) return false;

      // Check date presented (field_75)
      const datePresentedRaw = d.field_75_raw || d.field_75;
      if (!datePresentedRaw) {
        // If no date but marked as presented, assume it's recent (within grant period)
        return true;
      }

      let presentedDate;
      if (typeof datePresentedRaw === 'string') {
        presentedDate = new Date(datePresentedRaw);
      } else if (datePresentedRaw.iso_timestamp) {
        presentedDate = new Date(datePresentedRaw.iso_timestamp);
      } else if (datePresentedRaw.date) {
        presentedDate = new Date(datePresentedRaw.date);
      } else {
        return true; // Can't parse date, but is presented, so include it
      }

      return presentedDate >= GRANT_START_DATE;
    }).length

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
      // GRANT METRICS (Primary - Sept 9, 2024 onwards)
      grantLaptopsPresented: grantPresented,
      grantLaptopGoal: 1500, // Updated Nov 5, 2025 (was 2,500)
      grantLaptopProgress: Math.round((grantPresented / 1500) * 100),
      grantTrainingHoursGoal: 125, // Cut in half (was 250)

      // OVERALL METRICS (All-time - shown as subsidiary)
      totalLaptopsCollected: totalCollected,
      totalChromebooksDistributed: totalPresented,
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
        distributed: totalPresented,
      },
      inPipeline: totalCollected - totalPresented,
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
