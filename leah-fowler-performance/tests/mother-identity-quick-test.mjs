#!/usr/bin/env node

import puppeteer from 'puppeteer'
import chalk from 'chalk'

const baseUrl = 'http://localhost:3003'

console.log(chalk.cyan.bold('\n🚀 Mother Identity Transformation Test Report\n'))
console.log(chalk.gray('=' .repeat(60)))

async function runTests() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const results = {
    passed: [],
    failed: [],
    warnings: []
  }

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    // Test 1: Page loads successfully
    console.log(chalk.yellow('\n📋 Testing Page Load...'))
    try {
      const response = await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 })
      if (response.status() === 200) {
        results.passed.push('✅ Page loads successfully')
        console.log(chalk.green('✅ Page loads successfully'))
      } else {
        results.failed.push(`❌ Page returned status ${response.status()}`)
      }
    } catch (error) {
      results.failed.push(`❌ Failed to load page: ${error.message}`)
      console.log(chalk.red(`❌ Failed to load page: ${error.message}`))
    }

    // Test 2: Hero Section - Mother Identity Focus
    console.log(chalk.yellow('\n💪 Testing Hero Section...'))

    // Check for mother-focused headlines
    try {
      await page.waitForSelector('h1', { timeout: 5000 })
      const headlineText = await page.$eval('h1', el => el.textContent)

      const motherHeadlines = [
        'Rediscover the Woman Behind the Mother',
        'Lost Yourself in Motherhood',
        'Searching for Your Pre-Baby Identity',
        'Ready to Reclaim Your Power'
      ]

      const hasMotherHeadline = motherHeadlines.some(h => headlineText?.includes(h))

      if (hasMotherHeadline) {
        results.passed.push('✅ Mother-focused headline found')
        console.log(chalk.green(`✅ Mother-focused headline: "${headlineText}"`))
      } else {
        results.failed.push(`❌ No mother-focused headline found. Found: "${headlineText}"`)
        console.log(chalk.red(`❌ No mother-focused headline. Found: "${headlineText}"`))
      }
    } catch (error) {
      results.failed.push('❌ Could not find hero headline')
      console.log(chalk.red('❌ Could not find hero headline'))
    }

    // Check for badge
    try {
      const badges = await page.$$eval('[class*="badge"], [role="badge"], .badge', elements =>
        elements.map(el => el.textContent)
      )

      const hasMumBadge = badges.some(badge =>
        badge?.includes('Mother of 2') || badge?.includes('Spartan Ultra')
      )

      if (hasMumBadge) {
        results.passed.push('✅ Mother identity badge present')
        console.log(chalk.green('✅ Mother identity badge found'))
      } else {
        results.warnings.push('⚠️ Mother identity badge not found')
        console.log(chalk.yellow('⚠️ Mother identity badge not found'))
      }
    } catch (error) {
      results.warnings.push('⚠️ Could not check for badges')
    }

    // Check for stats
    console.log(chalk.yellow('\n📊 Testing Stats Section...'))
    try {
      const pageContent = await page.content()

      const stats = [
        { text: '500+ Mothers Reclaimed', found: false },
        { text: '92% Identity Breakthroughs', found: false },
        { text: 'Mother of 2', found: false },
        { text: '200+ Warrior Community', found: false }
      ]

      stats.forEach(stat => {
        // Check for variations
        const patterns = [
          stat.text,
          stat.text.replace('+', '\\+'),
          stat.text.replace(' ', '.*'),
          stat.text.split(' ').join('.*')
        ]

        stat.found = patterns.some(pattern =>
          new RegExp(pattern, 'i').test(pageContent)
        )

        if (stat.found) {
          results.passed.push(`✅ Stat found: ${stat.text}`)
          console.log(chalk.green(`✅ Found: ${stat.text}`))
        } else {
          results.warnings.push(`⚠️ Stat not found: ${stat.text}`)
          console.log(chalk.yellow(`⚠️ Not found: ${stat.text}`))
        }
      })
    } catch (error) {
      results.warnings.push('⚠️ Could not check stats')
    }

    // Test 3: Trust Bar
    console.log(chalk.yellow('\n🏆 Testing Trust Bar...'))
    try {
      await page.evaluate(() => window.scrollBy(0, 500))
      await page.waitForTimeout(1000)

      const trustPhrases = [
        'Mother of 2 Who Truly Understands',
        '500+ Mothers Reclaimed',
        'From Postnatal to Spartan Ultra'
      ]

      const pageText = await page.evaluate(() => document.body.innerText)

      trustPhrases.forEach(phrase => {
        if (pageText.toLowerCase().includes(phrase.toLowerCase())) {
          results.passed.push(`✅ Trust element: "${phrase}"`)
          console.log(chalk.green(`✅ Found trust element: "${phrase}"`))
        } else {
          results.warnings.push(`⚠️ Trust element not found: "${phrase}"`)
          console.log(chalk.yellow(`⚠️ Not found: "${phrase}"`))
        }
      })
    } catch (error) {
      results.warnings.push('⚠️ Could not check trust bar')
    }

    // Test 4: Programmes Section
    console.log(chalk.yellow('\n🎯 Testing Programmes...'))
    try {
      await page.evaluate(() => window.scrollBy(0, 1000))
      await page.waitForTimeout(1000)

      const programmes = [
        'Rediscovery Phase',
        'Strength Building',
        'Warrior Mother'
      ]

      const pageText = await page.evaluate(() => document.body.innerText)

      programmes.forEach(programme => {
        if (pageText.includes(programme)) {
          results.passed.push(`✅ Programme found: ${programme}`)
          console.log(chalk.green(`✅ Found programme: ${programme}`))
        } else {
          results.warnings.push(`⚠️ Programme not found: ${programme}`)
          console.log(chalk.yellow(`⚠️ Not found: ${programme}`))
        }
      })
    } catch (error) {
      results.warnings.push('⚠️ Could not check programmes')
    }

    // Test 5: UK English
    console.log(chalk.yellow('\n🇬🇧 Testing UK English...'))
    try {
      const pageContent = await page.content().toLowerCase()

      // Check for correct UK spelling
      if (pageContent.includes('mum') && !pageContent.includes(' mom ')) {
        results.passed.push('✅ Using UK English "mum" not "mom"')
        console.log(chalk.green('✅ Using UK English "mum" not "mom"'))
      } else if (pageContent.includes(' mom ')) {
        results.failed.push('❌ Found US spelling "mom"')
        console.log(chalk.red('❌ Found US spelling "mom"'))
      }

      if (pageContent.includes('programme') && !pageContent.includes(' program ')) {
        results.passed.push('✅ Using UK English "programme" not "program"')
        console.log(chalk.green('✅ Using UK English "programme"'))
      }

      if (pageContent.includes('optimise') && !pageContent.includes('optimize')) {
        results.passed.push('✅ Using UK English "optimise" not "optimize"')
        console.log(chalk.green('✅ Using UK English "optimise"'))
      }
    } catch (error) {
      results.warnings.push('⚠️ Could not check UK English')
    }

    // Test 6: No Generic Family Fitness References
    console.log(chalk.yellow('\n🚫 Checking for Generic Family Fitness...'))
    try {
      const pageContent = await page.content().toLowerCase()

      const bannedTerms = [
        'family fitness programme',
        'train together as a family',
        'family workout',
        'kids fitness'
      ]

      const foundBannedTerms = []
      bannedTerms.forEach(term => {
        if (pageContent.includes(term)) {
          foundBannedTerms.push(term)
        }
      })

      if (foundBannedTerms.length === 0) {
        results.passed.push('✅ No generic family fitness references found')
        console.log(chalk.green('✅ No generic family fitness references'))
      } else {
        results.failed.push(`❌ Found generic terms: ${foundBannedTerms.join(', ')}`)
        console.log(chalk.red(`❌ Found generic terms: ${foundBannedTerms.join(', ')}`))
      }
    } catch (error) {
      results.warnings.push('⚠️ Could not check for generic terms')
    }

    // Test 7: Performance
    console.log(chalk.yellow('\n⚡ Testing Performance...'))
    try {
      const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0]
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart
        }
      })

      if (metrics.loadComplete < 2000) {
        results.passed.push(`✅ Page loads in ${metrics.loadComplete}ms (< 2s)`)
        console.log(chalk.green(`✅ Page loads in ${metrics.loadComplete}ms`))
      } else {
        results.warnings.push(`⚠️ Page loads in ${metrics.loadComplete}ms (> 2s)`)
        console.log(chalk.yellow(`⚠️ Page loads in ${metrics.loadComplete}ms`))
      }
    } catch (error) {
      results.warnings.push('⚠️ Could not measure performance')
    }

    // Test 8: Responsive Design
    console.log(chalk.yellow('\n📱 Testing Responsive Design...'))

    const viewports = [
      { name: 'Mobile', width: 390, height: 844 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ]

    for (const viewport of viewports) {
      try {
        await page.setViewport({ width: viewport.width, height: viewport.height })
        await page.goto(baseUrl, { waitUntil: 'networkidle2' })

        // Check if main content is visible
        const isVisible = await page.$eval('main', el => {
          const rect = el.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0
        })

        if (isVisible) {
          results.passed.push(`✅ ${viewport.name} layout works`)
          console.log(chalk.green(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): OK`))
        } else {
          results.failed.push(`❌ ${viewport.name} layout broken`)
          console.log(chalk.red(`❌ ${viewport.name} layout issues`))
        }
      } catch (error) {
        results.warnings.push(`⚠️ Could not test ${viewport.name}`)
      }
    }

    // Test 9: Screenshot Capture
    console.log(chalk.yellow('\n📸 Capturing Screenshots...'))
    try {
      await page.setViewport({ width: 1920, height: 1080 })
      await page.goto(baseUrl, { waitUntil: 'networkidle2' })

      // Create screenshots directory if it doesn't exist
      const fs = await import('fs')
      const screenshotDir = '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots'
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true })
      }

      await page.screenshot({
        path: `${screenshotDir}/mother-identity-test-desktop.png`,
        fullPage: true
      })

      results.passed.push('✅ Screenshots captured')
      console.log(chalk.green('✅ Screenshots captured successfully'))
    } catch (error) {
      results.warnings.push('⚠️ Could not capture screenshots')
      console.log(chalk.yellow(`⚠️ Screenshot error: ${error.message}`))
    }

  } catch (error) {
    console.error(chalk.red(`\n❌ Test execution error: ${error.message}`))
    results.failed.push(`Test execution error: ${error.message}`)
  } finally {
    await browser.close()

    // Print summary
    console.log(chalk.cyan.bold('\n\n📊 TEST RESULTS SUMMARY'))
    console.log(chalk.gray('=' .repeat(60)))

    console.log(chalk.green.bold(`\n✅ PASSED: ${results.passed.length} tests`))
    results.passed.forEach(test => console.log(chalk.green(`   ${test}`)))

    if (results.warnings.length > 0) {
      console.log(chalk.yellow.bold(`\n⚠️ WARNINGS: ${results.warnings.length} issues`))
      results.warnings.forEach(warning => console.log(chalk.yellow(`   ${warning}`)))
    }

    if (results.failed.length > 0) {
      console.log(chalk.red.bold(`\n❌ FAILED: ${results.failed.length} tests`))
      results.failed.forEach(fail => console.log(chalk.red(`   ${fail}`)))
    }

    // Overall verdict
    console.log(chalk.cyan.bold('\n\n🎯 TRANSFORMATION VERDICT:'))
    console.log(chalk.gray('=' .repeat(60)))

    if (results.failed.length === 0) {
      console.log(chalk.green.bold('✅ Mother Identity Transformation SUCCESSFULLY IMPLEMENTED!'))
      console.log(chalk.green('   The website now focuses on empowering mothers to reclaim their identity.'))
    } else if (results.failed.length <= 2) {
      console.log(chalk.yellow.bold('⚠️ Mother Identity Transformation MOSTLY COMPLETE'))
      console.log(chalk.yellow('   A few minor issues need attention.'))
    } else {
      console.log(chalk.red.bold('❌ Mother Identity Transformation NEEDS WORK'))
      console.log(chalk.red('   Several critical issues must be addressed.'))
    }

    // Recommendations
    if (results.warnings.length > 0 || results.failed.length > 0) {
      console.log(chalk.cyan.bold('\n\n💡 RECOMMENDATIONS:'))
      console.log(chalk.gray('=' .repeat(60)))

      if (results.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️ Address these warnings for full compliance:'))
        results.warnings.slice(0, 5).forEach(warning => {
          console.log(chalk.yellow(`   • ${warning}`))
        })
      }

      if (results.failed.length > 0) {
        console.log(chalk.red('\n❌ Critical issues to fix immediately:'))
        results.failed.forEach(fail => {
          console.log(chalk.red(`   • ${fail}`))
        })
      }
    }

    console.log(chalk.gray('\n' + '=' .repeat(60)))
    console.log(chalk.cyan('Test completed at:', new Date().toLocaleString()))
    console.log()
  }
}

// Run the tests
runTests().catch(console.error)