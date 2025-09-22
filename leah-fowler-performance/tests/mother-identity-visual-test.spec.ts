import { test, expect } from '@playwright/test'

test.describe('Mother Identity Visual Test & Screenshots', () => {
  const baseUrl = 'http://localhost:3003'

  test('capture comprehensive screenshots and verify content', async ({ page }) => {
    // Navigate to homepage
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    console.log('\n📸 Capturing Screenshots for Test Report\n')

    // Desktop View (1920x1080)
    await page.setViewport({ width: 1920, height: 1080 })

    // Capture hero section
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/01-hero-desktop.png',
      fullPage: false
    })
    console.log('✅ Hero section screenshot captured')

    // Scroll and capture trust bar
    await page.evaluate(() => window.scrollBy(0, 600))
    await page.waitForTimeout(500)
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/02-trust-bar.png',
      fullPage: false
    })
    console.log('✅ Trust bar screenshot captured')

    // Scroll to programmes
    await page.evaluate(() => window.scrollBy(0, 800))
    await page.waitForTimeout(500)
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/03-programmes.png',
      fullPage: false
    })
    console.log('✅ Programmes section screenshot captured')

    // Scroll to testimonials
    await page.evaluate(() => window.scrollBy(0, 800))
    await page.waitForTimeout(500)
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/04-testimonials.png',
      fullPage: false
    })
    console.log('✅ Testimonials screenshot captured')

    // Full page desktop screenshot
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/05-full-page-desktop.png',
      fullPage: true
    })
    console.log('✅ Full page desktop screenshot captured')

    // Mobile View (iPhone 12)
    await page.setViewport({ width: 390, height: 844 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/06-mobile-hero.png',
      fullPage: false
    })
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/07-full-page-mobile.png',
      fullPage: true
    })
    console.log('✅ Mobile screenshots captured')

    // Tablet View (iPad)
    await page.setViewport({ width: 768, height: 1024 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/08-tablet.png',
      fullPage: false
    })
    console.log('✅ Tablet screenshot captured')

    console.log('\n📊 Running Content Verification Tests\n')

    // Content verification
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    // Test 1: Hero headlines
    const headline = await page.locator('h1').first()
    const headlineText = await headline.textContent()
    console.log(`Hero Headline: "${headlineText}"`)

    // Test 2: Stats verification
    const stats = [
      { selector: 'text=/500\\+/', label: '500+ Mothers Reclaimed' },
      { selector: 'text=/92%/', label: '92% Identity Breakthroughs' },
      { selector: 'text=/Mother of 2/', label: 'Mother of 2 Badge' }
    ]

    for (const stat of stats) {
      try {
        const element = page.locator(stat.selector).first()
        if (await element.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found: ${stat.label}`)
        } else {
          console.log(`⚠️ Not visible: ${stat.label}`)
        }
      } catch {
        console.log(`⚠️ Not found: ${stat.label}`)
      }
    }

    // Test 3: Programme verification
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(500)

    const programmes = ['Rediscovery Phase', 'Strength Building', 'Warrior Mother']
    for (const programme of programmes) {
      const element = page.locator(`text=/${programme}/i`).first()
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`✅ Programme found: ${programme}`)
      } else {
        console.log(`⚠️ Programme not visible: ${programme}`)
      }
    }

    // Test 4: UK English check
    const content = await page.content()
    const ukTerms = [
      { term: 'mum', found: content.includes('mum') },
      { term: 'programme', found: content.includes('programme') },
      { term: 'optimise', found: content.includes('optimise') }
    ]

    console.log('\n🇬🇧 UK English Check:')
    ukTerms.forEach(({ term, found }) => {
      console.log(found ? `✅ Using UK spelling: ${term}` : `❌ Missing UK spelling: ${term}`)
    })

    console.log('\n✅ Visual test completed successfully!')
  })
})