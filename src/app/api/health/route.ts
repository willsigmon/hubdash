import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'

/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Returns the status of Knack integration and all critical endpoints
 * Useful for monitoring and debugging
 */
export async function GET() {
    const health = {
        timestamp: new Date().toISOString(),
        knack: {
            configured: false,
            credentials: {
                appId: Boolean(process.env.KNACK_APP_ID),
                apiKey: Boolean(process.env.KNACK_API_KEY),
            },
            objects: {} as Record<string, { configured: boolean; accessible?: boolean; recordCount?: number; error?: string }>,
        },
        fieldMappings: {
            donations: {
                status: Boolean(process.env.KNACK_DONATION_STATUS_FIELD),
                priority: Boolean(process.env.KNACK_DONATION_PRIORITY_FIELD),
                notes: Boolean(process.env.KNACK_DONATION_NOTES_FIELD),
            },
            partnerships: {
                status: Boolean(process.env.KNACK_PARTNERSHIP_STATUS_FIELD),
                notes: Boolean(process.env.KNACK_PARTNERSHIP_NOTES_FIELD),
                internalComments: Boolean(process.env.KNACK_PARTNERSHIP_INTERNAL_NOTES_FIELD),
            },
            activity: {
                user: Boolean(process.env.KNACK_ACTIVITY_USER_FIELD),
                action: Boolean(process.env.KNACK_ACTIVITY_ACTION_FIELD),
                target: Boolean(process.env.KNACK_ACTIVITY_TARGET_FIELD),
            },
        },
        endpoints: [] as { name: string; status: 'ok' | 'error'; message?: string }[],
    }

    const knack = getKnackClient()
    health.knack.configured = knack.isConfigured()

    if (!health.knack.configured) {
        return NextResponse.json({
            ...health,
            status: 'unconfigured',
            message: 'Knack credentials not configured. Run: npm run setup-knack',
        }, { status: 503 })
    }

    // Test each object
    const objects = [
        { key: process.env.KNACK_DEVICES_OBJECT || 'object_7', name: 'devices', env: 'KNACK_DEVICES_OBJECT' },
        { key: process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22', name: 'organizations', env: 'KNACK_ORGANIZATIONS_OBJECT' },
        { key: process.env.KNACK_DONATION_INFO_OBJECT || 'object_63', name: 'donations', env: 'KNACK_DONATION_INFO_OBJECT' },
        { key: process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55', name: 'partnerships', env: 'KNACK_PARTNERSHIP_APPLICATIONS_OBJECT' },
        { key: process.env.KNACK_LAPTOP_APPLICATIONS_OBJECT || 'object_62', name: 'recipients', env: 'KNACK_LAPTOP_APPLICATIONS_OBJECT' },
        { key: process.env.KNACK_ACTIVITY_OBJECT || 'object_5', name: 'activity', env: 'KNACK_ACTIVITY_OBJECT' },
    ]

    await Promise.all(
        objects.map(async (obj) => {
            try {
                const records = await knack.getRecords(obj.key, { rows_per_page: 1 })
                health.knack.objects[obj.name] = {
                    configured: true,
                    accessible: true,
                    recordCount: records.length,
                }
                health.endpoints.push({
                    name: obj.name,
                    status: 'ok',
                })
            } catch (error: any) {
                health.knack.objects[obj.name] = {
                    configured: true,
                    accessible: false,
                    error: error.message,
                }
                health.endpoints.push({
                    name: obj.name,
                    status: 'error',
                    message: error.message,
                })
            }
        })
    )

    const allHealthy = health.endpoints.every(e => e.status === 'ok')
    const status = allHealthy ? 'healthy' : 'degraded'

    return NextResponse.json({
        ...health,
        status,
        message: allHealthy
            ? 'All Knack endpoints are operational'
            : 'Some Knack endpoints are experiencing issues',
    }, {
        status: allHealthy ? 200 : 503,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    })
}
