import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get device counts by status
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('status')

    if (devicesError) throw devicesError

    // Get total devices collected
    const totalCollected = devices?.length || 0

    // Get distributed count
    const distributedCount = devices?.filter(d => d.status === 'distributed').length || 0

    // Get counties from partners
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('county, devices_received')

    if (partnersError) throw partnersError

    const countiesServed = new Set(partners?.map(p => p.county) || []).size

    // Get training count
    const { data: training, error: trainingError } = await supabase
      .from('training_sessions')
      .select('attendee_count')

    if (trainingError) throw trainingError

    const peopleTrained = training?.reduce((sum, t) => sum + (t.attendee_count || 0), 0) || 0

    // Calculate e-waste (estimate 5 lbs per device)
    const eWasteTons = Math.round((totalCollected * 5) / 2000)

    // Get partner count
    const partnerCount = partners?.length || 0

    // Pipeline counts
    const pipelineCounts = {
      donated: devices?.filter(d => d.status === 'donated').length || 0,
      received: devices?.filter(d => d.status === 'received').length || 0,
      dataWipe: devices?.filter(d => d.status === 'data_wipe').length || 0,
      refurbishing: devices?.filter(d => d.status === 'refurbishing').length || 0,
      qaTesting: devices?.filter(d => d.status === 'qa_testing').length || 0,
      ready: devices?.filter(d => d.status === 'ready').length || 0,
      distributed: distributedCount,
    }

    const metrics = {
      laptopsCollected: totalCollected,
      chromebooksDistributed: distributedCount,
      countiesServed,
      peopleTrained,
      eWasteTons,
      partnerOrganizations: partnerCount,
      pipeline: pipelineCounts,
      inPipeline: totalCollected - distributedCount,
      readyToShip: pipelineCounts.ready,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
