#!/usr/bin/env tsx
/**
 * Knack Connection Test Script
 *
 * Verifies your Knack credentials and tests data retrieval
 * Run: npm run test-knack
 */

import { getKnackClient } from '../src/lib/knack/client'

async function testKnackConnection() {
    console.log('🔌 Testing Knack Connection\n')
    console.log('='.repeat(80))

    // Step 1: Check environment variables
    console.log('\n📋 Step 1: Checking environment variables...')

    const appId = process.env.KNACK_APP_ID
    const apiKey = process.env.KNACK_API_KEY

    if (!appId) {
        console.error('❌ KNACK_APP_ID not found in environment')
        console.error('   Add it to .env.local')
        process.exit(1)
    }

    if (!apiKey) {
        console.error('❌ KNACK_API_KEY not found in environment')
        console.error('   Add it to .env.local')
        process.exit(1)
    }

    console.log(`✅ KNACK_APP_ID: ${appId.substring(0, 8)}...`)
    console.log(`✅ KNACK_API_KEY: ${apiKey.substring(0, 8)}...`)

    // Step 2: Initialize client
    console.log('\n🔧 Step 2: Initializing Knack client...')
    const knack = getKnackClient()

    if (!knack.isConfigured()) {
        console.error('❌ Knack client failed to initialize')
        process.exit(1)
    }

    console.log('✅ Knack client initialized')

    // Step 3: Test each object
    const objects = [
        { key: process.env.KNACK_DEVICES_OBJECT || 'object_7', name: 'Devices', env: 'KNACK_DEVICES_OBJECT' },
        { key: process.env.KNACK_ORGANIZATIONS_OBJECT || 'object_22', name: 'Organizations', env: 'KNACK_ORGANIZATIONS_OBJECT' },
        { key: process.env.KNACK_DONATION_INFO_OBJECT || 'object_63', name: 'Donations', env: 'KNACK_DONATION_INFO_OBJECT' },
        { key: process.env.KNACK_PARTNERSHIP_APPLICATIONS_OBJECT || 'object_55', name: 'Partnerships', env: 'KNACK_PARTNERSHIP_APPLICATIONS_OBJECT' },
        { key: process.env.KNACK_LAPTOP_APPLICATIONS_OBJECT || 'object_62', name: 'Recipients', env: 'KNACK_LAPTOP_APPLICATIONS_OBJECT' },
        { key: process.env.KNACK_ACTIVITY_OBJECT || 'object_5', name: 'Activity', env: 'KNACK_ACTIVITY_OBJECT' },
    ]

    console.log('\n📦 Step 3: Testing object access...\n')

    let successCount = 0
    let failCount = 0

    for (const obj of objects) {
        try {
            console.log(`Testing ${obj.name} (${obj.key})...`)

            const records = await knack.getRecords(obj.key, { rows_per_page: 1 })

            if (!Array.isArray(records)) {
                console.error(`  ❌ Invalid response format (not an array)`)
                failCount++
                continue
            }

            console.log(`  ✅ Success! Found ${records.length > 0 ? 'records' : 'empty object'}`)

            if (records.length > 0) {
                const sampleRecord = records[0]
                const fieldCount = Object.keys(sampleRecord).filter(k => k.startsWith('field_')).length
                console.log(`     Sample record has ${fieldCount} fields`)
                console.log(`     Record ID: ${sampleRecord.id}`)
            } else {
                console.warn(`     ⚠️  Object is empty - no records found`)
                console.warn(`     This may be normal if you haven't added data yet`)
            }

            successCount++

        } catch (error: any) {
            console.error(`  ❌ Failed: ${error.message}`)

            if (error.message.includes('404')) {
                console.error(`     Object "${obj.key}" not found in your Knack app`)
                console.error(`     Update ${obj.env} in .env.local with the correct object key`)
            } else if (error.message.includes('401') || error.message.includes('403')) {
                console.error(`     Authentication failed - check your API credentials`)
            }

            failCount++
        }

        console.log('')
    }

    // Summary
    console.log('='.repeat(80))
    console.log('\n📊 Test Summary:')
    console.log(`   ✅ Successful: ${successCount}/${objects.length}`)
    console.log(`   ❌ Failed: ${failCount}/${objects.length}`)

    if (failCount === 0) {
        console.log('\n🎉 All tests passed! Your Knack integration is working.')
        console.log('\nNext steps:')
        console.log('1. Run: npm run discover-fields')
        console.log('2. Add field mappings to .env.local')
        console.log('3. Start dev server: npm run dev')
    } else {
        console.log('\n⚠️  Some tests failed. Review the errors above and:')
        console.log('1. Verify your Knack credentials are correct')
        console.log('2. Check that object keys match your Knack app')
        console.log('3. Ensure API key has read permissions')
        process.exit(1)
    }
}

// Run the test
testKnackConnection().catch(error => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
})
