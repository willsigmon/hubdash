import { NextResponse } from 'next/server'
import { getKnackClient } from '@/lib/knack/client'
import { getDonationFieldMap, normalizeKnackChoice, readKnackField, warnMissingDonationField } from '@/lib/knack/field-map'

type DonationStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed'
type DonationPriority = 'urgent' | 'high' | 'normal'

function mapStatus(value: string | undefined): DonationStatus {
  if (!value) return 'pending'

  const normalised = value.toLowerCase()

  if (normalised.includes('complete')) return 'completed'
  if (normalised.includes('progress')) return 'in_progress'
  if (normalised.includes('schedule')) return 'scheduled'

  return 'pending'
}

function mapPriority(value: string | undefined): DonationPriority {
  if (!value) return 'normal'

  const normalised = value.toLowerCase()

  if (normalised.includes('urgent')) return 'urgent'
  if (normalised.includes('high')) return 'high'

  return 'normal'
}

export async function GET() {
  try {
    const knack = getKnackClient()

    if (!knack.isConfigured()) {
      console.error('❌ Knack not configured for donations endpoint')
      return NextResponse.json(
        {
          error: 'Knack integration not configured',
          setup_guide: 'Run: npm run setup-knack'
        },
        { status: 503 }
      )
    }

    const objectKey = process.env.KNACK_DONATION_INFO_OBJECT || 'object_63'
    console.log(`📦 Fetching donations from Knack object ${objectKey}`)
    const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

    const donationFields = getDonationFieldMap()
    if (!donationFields.status) warnMissingDonationField('status')
    if (!donationFields.priority) warnMissingDonationField('priority')
    if (!donationFields.notes) warnMissingDonationField('notes')

    // Validate API response
    if (!Array.isArray(knackRecords)) {
      console.error('Invalid Knack response - expected array:', knackRecords)
      return NextResponse.json({ error: 'Invalid data format from database' }, { status: 500 })
    }

    const donations = knackRecords.map((r: any) => {
      // Extract email - Knack returns objects
      let email = '';
      if (typeof r.field_537_raw === 'string') {
        email = r.field_537_raw;
      } else if (r.field_537_raw?.email) {
        email = r.field_537_raw.email;
      }

      // Extract address - Knack returns objects
      let location = '';
      if (typeof r.field_566_raw === 'string' && r.field_566_raw.trim()) {
        location = r.field_566_raw;
      } else if (r.field_566_raw?.full) {
        location = r.field_566_raw.full;
      } else if (r.field_566_raw?.city && r.field_566_raw?.state) {
        location = `${r.field_566_raw.city}, ${r.field_566_raw.state}`;
      }

      // Extract date - validate to prevent Invalid Date
      let requestedDate = new Date().toISOString();
      if (r.field_536_raw) {
        const date = new Date(typeof r.field_536_raw === 'string' ? r.field_536_raw : r.field_536_raw.iso_timestamp);
        if (!isNaN(date.getTime())) {
          requestedDate = date.toISOString();
        }
      }

      // Extract phone
      let phone = '';
      if (typeof r.field_539_raw === 'string') {
        phone = r.field_539_raw;
      } else if (r.field_539_raw?.phone) {
        phone = r.field_539_raw.phone;
      }

      // Extract status & priority via configured mappings (with safe fallbacks)
      const statusCandidate = normalizeKnackChoice(readKnackField(r, donationFields.status))
        ?? normalizeKnackChoice(r.status_raw)
        ?? normalizeKnackChoice(r.field_status_raw)

      const priorityCandidate = normalizeKnackChoice(readKnackField(r, donationFields.priority))
        ?? normalizeKnackChoice(r.priority_raw)
        ?? normalizeKnackChoice(r.field_priority_raw)

      const status = mapStatus(statusCandidate)
      const priority = mapPriority(priorityCandidate)

      const notesValue = normalizeKnackChoice(readKnackField(r, donationFields.notes))
        ?? (typeof r.notes_raw === 'string' ? r.notes_raw : undefined)
        ?? (typeof r.notes === 'string' ? r.notes : undefined)

      return {
        id: r.id,
        company: r.field_565_raw?.trim() || '',
        contact_name: r.field_538_raw?.trim() || '',
        contact_email: email,
        contact_phone: phone,
        device_count: parseInt(r.field_542_raw || '0', 10),
        location: location.trim(),
        priority,
        status,
        requested_date: requestedDate,
        notes: notesValue || '',
      };
    })

    return NextResponse.json(donations, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }, // 30min cache
    })
  } catch (error: any) {
    console.error('Donations API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
