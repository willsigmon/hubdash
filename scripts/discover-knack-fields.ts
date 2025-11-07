#!/usr/bin/env tsx
/**
 * Knack Field Discovery Script
 *
 * Helps you find the correct field IDs for your Knack objects
 * Run: npm run discover-fields
 */

import { getKnackClient } from '../src/lib/knack/client'

interface KnackField {
  key: string
  name: string
  type: string
}

interface KnackObject {
  key: string
  name: string
  fields?: KnackField[]
}

const OBJECTS_TO_INSPECT = [
  { key: process.env.KNACK_DEVICES_OBJECT || 'object_7', name: 'Devices' },
  { key: process.env.KNACK_DONATION_INFO_OBJECT || 'object_63', name: 'Donations' },
  { key: process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55', name: 'Partnerships' },
  { key: process.env.KNACK_ACTIVITY_OBJECT || 'object_5', name: 'Activity' },
]

async function discoverFields() {
  console.log('🔍 Knack Field Discovery Tool\n')
  console.log('This script will help you identify the correct field IDs for HubDash.\n')

  const knack = getKnackClient()

  if (!knack.isConfigured()) {
    console.error('❌ Knack credentials not configured!')
    console.error('   Add KNACK_APP_ID and KNACK_API_KEY to your .env.local file\n')
    process.exit(1)
  }

  console.log('✅ Knack credentials found\n')
  console.log('Fetching sample records from each object...\n')

  for (const obj of OBJECTS_TO_INSPECT) {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📦 ${obj.name} (${obj.key})`)
    console.log('='.repeat(80))

    try {
      const records = await knack.getRecords(obj.key, { rows_per_page: 1 })

      if (!Array.isArray(records) || records.length === 0) {
        console.log('⚠️  No records found in this object')
        continue
      }

      const sampleRecord = records[0]
      const fields = Object.keys(sampleRecord)
        .filter(key => key.startsWith('field_'))
        .sort()

      console.log(`\nFound ${fields.length} fields:\n`)

      for (const fieldKey of fields) {
        const rawKey = `${fieldKey}_raw`
        const value = sampleRecord[rawKey] || sampleRecord[fieldKey]
        const preview = formatValue(value)

        console.log(`  ${fieldKey.padEnd(20)} → ${preview}`)
      }

      // Provide suggestions based on object type
      console.log('\n💡 Suggested mappings:')
      suggestMappings(obj.name, fields, sampleRecord)

    } catch (error: any) {
      console.error(`❌ Error fetching ${obj.name}:`, error.message)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Discovery complete!')
  console.log('\nNext steps:')
  console.log('1. Add the suggested field IDs to your .env.local file')
  console.log('2. Restart your dev server: npm run dev')
  console.log('3. Check the console for any remaining field warnings\n')
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '(empty)'
  }

  if (typeof value === 'string') {
    return value.length > 50 ? `"${value.substring(0, 47)}..."` : `"${value}"`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const first = value[0]
    if (typeof first === 'object' && first !== null) {
      const identifier = (first as any).identifier || (first as any).id || (first as any).name
      return identifier ? `[${identifier}, ...]` : `[${value.length} items]`
    }
    return `[${value.length} items]`
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (obj.iso_timestamp) return `Date: ${obj.iso_timestamp}`
    if (obj.identifier) return `Choice: ${obj.identifier}`
    if (obj.email) return `Email: ${obj.email}`
    if (obj.full) return `Address: ${obj.full}`
    return '{object}'
  }

  return String(value)
}

function suggestMappings(objectName: string, fields: string[], sampleRecord: any) {
  const suggestions: Record<string, string[]> = {
    'Donations': [
      'status → Look for field with values like "pending", "scheduled", "completed"',
      'priority → Look for field with values like "urgent", "high", "normal"',
      'notes → Look for text/paragraph field with internal comments',
    ],
    'Partnerships': [
      'status → Look for field with values like "Pending", "In Review", "Approved"',
      'notes → Look for text field for public-facing notes',
      'internalComments → Look for text field for staff-only comments',
    ],
    'Activity': [
      'user → Look for field with user names or "HTI System"',
      'action → Look for field describing what happened (e.g., "created", "updated")',
      'target → Look for field with the target entity (device serial, partner name)',
      'type → Look for field with values like "info", "warning", "success"',
      'icon → Look for field with emoji or icon identifiers',
      'createdAt → Look for date/time field',
    ],
    'Devices': [
      'Already configured with hard-coded field IDs',
      'Check src/app/api/devices/route.ts if you need to update them',
    ],
  }

  const hints = suggestions[objectName] || []

  if (hints.length > 0) {
    hints.forEach(hint => console.log(`   • ${hint}`))
  } else {
    console.log('   No specific suggestions for this object')
  }

  // Try to auto-detect some common patterns
  console.log('\n🎯 Auto-detected candidates:')

  const statusFields = fields.filter(f => {
    const val = String(sampleRecord[`${f}_raw`] || sampleRecord[f] || '').toLowerCase()
    return val.includes('status') || val.includes('pending') || val.includes('approved')
  })

  const dateFields = fields.filter(f => {
    const val = sampleRecord[`${f}_raw`] || sampleRecord[f]
    return val && typeof val === 'object' && ('iso_timestamp' in val || 'timestamp' in val)
  })

  if (statusFields.length > 0) {
    console.log(`   Status-like fields: ${statusFields.join(', ')}`)
  }

  if (dateFields.length > 0) {
    console.log(`   Date fields: ${dateFields.join(', ')}`)
  }

  if (statusFields.length === 0 && dateFields.length === 0) {
    console.log('   (None detected - review the field list above)')
  }
}

// Run the script
discoverFields().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
