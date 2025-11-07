import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'
import { cacheKeys, getCached } from '@/lib/knack/cache-manager'
import type { ActivityFieldMap } from '@/lib/knack/field-map'
import {
  getActivityFieldMap,
  normalizeKnackChoice,
  normalizeKnackDate,
  readKnackField,
  warnMissingActivityField,
} from '@/lib/knack/field-map'

type ActivityType = 'info' | 'warning' | 'success'

interface ActivityItem {
  id: string
  user_name: string
  action: string
  target: string
  type: ActivityType
  icon: string
  created_at: string
}

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'fallback-1',
    user_name: 'Operations Hub',
    action: 'synced device inventory with',
    target: 'Knack data cache',
    type: 'success',
    icon: '✅',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'fallback-2',
    user_name: 'Marketing Hub',
    action: 'reviewed partnership application for',
    target: 'East Wake Learning Lab',
    type: 'info',
    icon: '📝',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'fallback-3',
    user_name: 'Device Pipeline',
    action: 'moved 18 laptops into',
    target: 'QA Testing',
    type: 'success',
    icon: '🔧',
    created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'fallback-4',
    user_name: 'Support Bot',
    action: 'flagged missing fields on',
    target: 'donation intake form',
    type: 'warning',
    icon: '⚠️',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
]

const ACTIVITY_TYPES: ActivityType[] = ['success', 'warning', 'info']

function coerceActivityType(value?: string): ActivityType {
  if (!value) return 'info'

  const lower = value.toLowerCase()
  if (lower.includes('warn')) return 'warning'
  if (lower.includes('success') || lower.includes('complete') || lower.includes('synced')) return 'success'
  return ACTIVITY_TYPES.includes(lower as ActivityType) ? (lower as ActivityType) : 'info'
}

function toActivity(record: Record<string, any>, index: number, fields: ActivityFieldMap): ActivityItem {
  const fallback = FALLBACK_ACTIVITIES[index % FALLBACK_ACTIVITIES.length]

  const user = normalizeKnackChoice(readKnackField(record, fields.user))
    ?? normalizeKnackChoice(record.user)
    ?? normalizeKnackChoice(record.user_name)
    ?? fallback.user_name

  const action = normalizeKnackChoice(readKnackField(record, fields.action))
    ?? (typeof record.action === 'string' ? record.action : undefined)
    ?? fallback.action

  const target = normalizeKnackChoice(readKnackField(record, fields.target))
    ?? (typeof record.target === 'string' ? record.target : undefined)
    ?? fallback.target

  const type = coerceActivityType(
    normalizeKnackChoice(readKnackField(record, fields.type))
      ?? (typeof record.type === 'string' ? record.type : undefined)
  )

  const icon = normalizeKnackChoice(readKnackField(record, fields.icon))
    ?? (typeof record.icon === 'string' ? record.icon : undefined)
    ?? fallback.icon

  const createdAtCandidate = readKnackField(record, fields.createdAt)
    ?? record.created_at_raw
    ?? record.created_at
    ?? record._systemCreated
    ?? record._system_created_at

  const createdAt = normalizeKnackDate(createdAtCandidate, fallback.created_at)

  return {
    id: String(record.id ?? `knack-activity-${index}`),
    user_name: user,
    action,
    target,
    type,
    icon,
    created_at: createdAt,
  }
}

async function fetchKnackActivity(): Promise<ActivityItem[]> {
  const knack = getKnackClient()

  if (!knack.isConfigured()) {
    return FALLBACK_ACTIVITIES
  }

  const objectKey = process.env.KNACK_ACTIVITY_OBJECT || 'object_5'

  try {
    return await getCached(
      cacheKeys.activity,
      async () => {
        const records = await knack.getRecords(objectKey, {
          rows_per_page: 50,
        })

        if (!Array.isArray(records) || records.length === 0) {
          return FALLBACK_ACTIVITIES
        }

        const fields = getActivityFieldMap()

        ;(['user', 'action', 'target', 'type', 'icon', 'createdAt'] as const).forEach((key) => {
          if (!fields[key]) {
            warnMissingActivityField(key)
          }
        })

        const transformed = records
          .map((record, index) => {
            try {
              return toActivity(record, index, fields)
            } catch (error) {
              console.warn('Failed to transform Knack activity record', error)
              return null
            }
          })
          .filter((item): item is ActivityItem => Boolean(item))

        return transformed.length > 0 ? transformed : FALLBACK_ACTIVITIES
      },
      90
    )
  } catch (error) {
    console.error('Activity API Error:', error)
    return FALLBACK_ACTIVITIES
  }
}

export async function GET() {
  const activities = await fetchKnackActivity()

  return NextResponse.json(activities, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
