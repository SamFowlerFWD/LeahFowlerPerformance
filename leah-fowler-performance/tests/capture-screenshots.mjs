#!/usr/bin/env node

import { chromium } from '@playwright/test'
import fs from 'fs/promises'

const baseUrl = 'http://localhost:3003'
const screenshotDir = '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots'

async function captureScreenshots() {
  console.log('\n📸 Capturing Mother Identity Screenshots\n')
  console.log('=' .repeat(60))

  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()

    // Desktop screenshots
    console.log('\n💻 Desktop View (1920x1080)')
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    // Hero section
    await page.screenshot({
      path: `${screenshotDir}/mother-identity-hero-desktop.png`,
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    })
    console.log('   ✅ Hero section captured')

    // Full page
    await page.screenshot({
      path: `${screenshotDir}/mother-identity-full-desktop.png`,
      fullPage: true
    })
    console.log('   ✅ Full page captured')

    // Mobile screenshots
    console.log('\n📱 Mobile View (390x844)')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    await page.screenshot({
      path: `${screenshotDir}/mother-identity-mobile.png`,
      fullPage: true
    })
    console.log('   ✅ Mobile view captured')

    // Tablet screenshots
    console.log('\n📱 Tablet View (768x1024)')
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    await page.screenshot({
      path: `${screenshotDir}/mother-identity-tablet.png`,
      fullPage: false
    })
    console.log('   ✅ Tablet view captured')

    console.log('\n' + '=' .repeat(60))
    console.log('✅ All screenshots captured successfully!')
    console.log(`📁 Screenshots saved to: ${screenshotDir}`)

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
  } finally {
    await browser.close()
  }
}

captureScreenshots()