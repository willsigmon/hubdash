import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('requested_date', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('donations')
      .insert(body)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}
