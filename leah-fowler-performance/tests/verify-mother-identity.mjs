#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'

const execAsync = promisify(exec)

const baseUrl = 'http://localhost:3003'

console.log('\n🚀 Mother Identity Transformation Verification\n')
console.log('=' .repeat(60))

async function checkContent() {
  try {
    // Fetch the homepage HTML
    const { stdout } = await execAsync(`curl -s ${baseUrl}`)
    const content = stdout.toLowerCase()

    console.log('\n✅ Page loaded successfully')
    console.log(`   Content size: ${content.length} bytes\n`)

    // Results tracking
    const results = {
      passed: [],
      failed: [],
      warnings: []
    }

    // Test 1: Mother-focused headlines
    console.log('💪 Checking Hero Content...')
    const motherHeadlines = [
      'rediscover the woman behind the mother',
      'lost yourself in motherhood',
      'searching for your pre-baby identity',
      'ready to reclaim your power'
    ]

    let foundHeadline = false
    for (const headline of motherHeadlines) {
      if (content.includes(headline)) {
        console.log(`   ✅ Found: "${headline}"`)
        results.passed.push(`Mother headline: "${headline}"`)
        foundHeadline = true
        break
      }
    }

    if (!foundHeadline) {
      console.log('   ❌ No mother-focused headlines found')
      results.failed.push('No mother-focused headlines')
    }

    // Test 2: Key stats
    console.log('\n📊 Checking Stats...')
    const stats = [
      { text: '500', label: 'Mothers Reclaimed' },
      { text: '92%', label: 'Identity Breakthroughs' },
      { text: 'mother of 2', label: 'Badge' },
      { text: '200', label: 'Warrior Community' }
    ]

    for (const stat of stats) {
      if (content.includes(stat.text.toLowerCase())) {
        console.log(`   ✅ Found: ${stat.label} (${stat.text})`)
        results.passed.push(`Stat: ${stat.label}`)
      } else {
        console.log(`   ⚠️ Missing: ${stat.label}`)
        results.warnings.push(`Missing stat: ${stat.label}`)
      }
    }

    // Test 3: UK English
    console.log('\n🇬🇧 Checking UK English...')

    if (content.includes('mum') && !content.includes(' mom ')) {
      console.log('   ✅ Using "mum" (UK English)')
      results.passed.push('UK English: mum')
    } else if (content.includes(' mom ')) {
      console.log('   ❌ Found "mom" (US English)')
      results.failed.push('Found US spelling "mom"')
    }

    if (content.includes('programme')) {
      console.log('   ✅ Using "programme" (UK English)')
      results.passed.push('UK English: programme')
    }

    if (content.includes('optimise')) {
      console.log('   ✅ Using "optimise" (UK English)')
      results.passed.push('UK English: optimise')
    }

    // Test 4: Identity-focused programmes
    console.log('\n🎯 Checking Programmes...')
    const programmes = [
      'rediscovery phase',
      'strength building',
      'warrior mother'
    ]

    for (const programme of programmes) {
      if (content.includes(programme)) {
        console.log(`   ✅ Found: ${programme}`)
        results.passed.push(`Programme: ${programme}`)
      } else {
        console.log(`   ⚠️ Not found: ${programme}`)
        results.warnings.push(`Missing programme: ${programme}`)
      }
    }

    // Test 5: No generic family fitness
    console.log('\n🚫 Checking for Generic Family Fitness...')
    const bannedTerms = [
      'family fitness programme',
      'train together as a family',
      'family workout',
      'kids fitness'
    ]

    let foundBanned = false
    for (const term of bannedTerms) {
      if (content.includes(term)) {
        console.log(`   ❌ Found banned term: "${term}"`)
        results.failed.push(`Banned term: "${term}"`)
        foundBanned = true
      }
    }

    if (!foundBanned) {
      console.log('   ✅ No generic family fitness references')
      results.passed.push('No generic family fitness')
    }

    // Test 6: Mother identity keywords
    console.log('\n🔍 Checking Identity Keywords...')
    const keywords = ['identity', 'reclaim', 'warrior', 'transformation', 'breakthrough']

    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        console.log(`   ✅ Found: ${keyword}`)
        results.passed.push(`Keyword: ${keyword}`)
      } else {
        console.log(`   ⚠️ Missing: ${keyword}`)
        results.warnings.push(`Missing keyword: ${keyword}`)
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(60))
    console.log('\n📊 TEST RESULTS SUMMARY\n')

    console.log(`✅ PASSED: ${results.passed.length} checks`)
    console.log(`⚠️ WARNINGS: ${results.warnings.length} issues`)
    console.log(`❌ FAILED: ${results.failed.length} critical issues`)

    console.log('\n🎯 VERDICT:')
    if (results.failed.length === 0) {
      console.log('   ✅ Mother Identity Transformation SUCCESSFULLY IMPLEMENTED!')
      console.log('   The website focuses on empowering mothers to reclaim their identity.')
    } else if (results.failed.length <= 2) {
      console.log('   ⚠️ Mother Identity Transformation MOSTLY COMPLETE')
      console.log('   Minor issues need attention.')
    } else {
      console.log('   ❌ Mother Identity Transformation NEEDS WORK')
      console.log('   Critical issues must be addressed.')
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url: baseUrl,
      results,
      contentLength: content.length,
      verdict: results.failed.length === 0 ? 'PASSED' : results.failed.length <= 2 ? 'MOSTLY COMPLETE' : 'NEEDS WORK'
    }

    await fs.writeFile(
      '/Users/samfowler/Code/LeahFowlerPerformance-1/mother-identity-test-results.json',
      JSON.stringify(report, null, 2)
    )

    console.log('\n📁 Detailed report saved to: mother-identity-test-results.json')
    console.log('=' .repeat(60) + '\n')

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
    console.error('   Make sure the development server is running on port 3003')
  }
}

checkContent()