import { NextResponse } from 'next/server'

export async function GET() {
  const activities = [
    {
      id: '1',
      user_name: 'HTI System',
      action: 'loaded data from',
      target: 'Knack database',
      type: 'info' as const,
      icon: '🔄',
      created_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json(activities, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
