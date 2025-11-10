import { NextResponse } from 'next/server'

// Minimal health endpoint used by Next.js type validator reference
export async function GET() {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, {
        headers: { 'Cache-Control': 'public, s-maxage=60' }
    })
}
