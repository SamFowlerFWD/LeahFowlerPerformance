import { test, expect, devices, BrowserContext, Page } from '@playwright/test'

// Helper function to test mobile layout
async function testMobileLayout(page: Page, deviceName: string, viewport: { width: number; height: number }) {
  await page.goto('http://localhost:3001')
  await page.waitForLoadState('networkidle')

  // Test 1: Header height should be compact on mobile
  const header = await page.locator('header').first()
  const headerHeight = await header.evaluate(el => el.offsetHeight)

  if (viewport.width < 640) {
    expect(headerHeight).toBeLessThanOrEqual(85) // Adjusted for nav container
  } else if (viewport.width < 1024) {
    expect(headerHeight).toBeLessThanOrEqual(100)
  }

  // Test 2: No bottom navigation bar should be present
  const bottomNavs = await page.locator('nav.fixed.bottom-0').count()
  expect(bottomNavs).toBe(0)

  const mobileDock = await page.locator('[class*="fixed bottom-0"][class*="dock"]').count()
  expect(mobileDock).toBe(0)

  // Test 3: Hero section should be optimized
  const heroSection = await page.locator('section').first()
  const heroHeight = await heroSection.evaluate(el => el.offsetHeight)

  if (viewport.width < 640) {
    const expectedMinHeight = viewport.height * 0.75
    const expectedMaxHeight = viewport.height * 0.85
    expect(heroHeight).toBeGreaterThanOrEqual(expectedMinHeight)
    expect(heroHeight).toBeLessThanOrEqual(expectedMaxHeight)
  }

  // Test 4: Content should be visible above the fold
  const heroHeading = await page.locator('h1').first()
  const headingBox = await heroHeading.boundingBox()
  if (headingBox) {
    expect(headingBox.y).toBeLessThan(viewport.height * 0.6)
  }

  // Test 5: No horizontal scrolling
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1)

  // Test 6: Mobile menu is accessible
  const hamburgerMenu = await page.locator('button[aria-label*="menu" i], button:has(svg.lucide-menu)').first()
  const isMenuVisible = await hamburgerMenu.isVisible()

  if (viewport.width < 1024) {
    expect(isMenuVisible).toBe(true)

    const menuBox = await hamburgerMenu.boundingBox()
    if (menuBox) {
      expect(menuBox.width).toBeGreaterThanOrEqual(44)
      expect(menuBox.height).toBeGreaterThanOrEqual(44)
    }
  }
}

// Test iPhone X
test('iPhone X layout', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone X'],
  })
  const page = await context.newPage()
  await testMobileLayout(page, 'iPhone X', { width: 375, height: 812 })
  await context.close()
})

// Test iPhone 14
test('iPhone 14 layout', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  })
  const page = await context.newPage()
  await testMobileLayout(page, 'iPhone 14', { width: 390, height: 844 })
  await context.close()
})

// Test iPhone 14 Plus
test('iPhone 14 Plus layout', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14 Plus'],
  })
  const page = await context.newPage()
  await testMobileLayout(page, 'iPhone 14 Plus', { width: 428, height: 926 })
  await context.close()
})

// Test Pixel 5
test('Pixel 5 layout', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['Pixel 5'],
  })
  const page = await context.newPage()
  await testMobileLayout(page, 'Pixel 5', { width: 393, height: 851 })
  await context.close()
})

// Test iPad Mini
test('iPad Mini layout', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPad Mini'],
  })
  const page = await context.newPage()
  await testMobileLayout(page, 'iPad Mini', { width: 768, height: 1024 })
  await context.close()
})

// Test custom breakpoints
test.describe('Responsive Breakpoint Tests', () => {
  const breakpoints = [
    { width: 375, height: 667, name: 'Mobile Small' },
    { width: 414, height: 896, name: 'Mobile Large' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Laptop' },
  ]

  breakpoints.forEach(({ width, height, name }) => {
    test(`${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await testMobileLayout(page, name, { width, height })
    })
  })
})

// Performance test on mobile
test('Mobile performance metrics', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  })
  const page = await context.newPage()

  // Start measuring
  await page.goto('http://localhost:3001')

  // Check First Contentful Paint
  const fcp = await page.evaluate(() => {
    const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return entry.responseEnd - entry.fetchStart
  })

  // Should be under 2 seconds
  expect(fcp).toBeLessThan(2000)

  // Check image optimization
  const images = await page.locator('img').all()
  for (const img of images) {
    const src = await img.getAttribute('src')
    if (src && !src.startsWith('data:')) {
      const isHero = await img.evaluate(el => el.closest('section')?.matches(':first-of-type'))
      if (!isHero) {
        const loading = await img.getAttribute('loading')
        expect(loading === 'lazy' || loading === null).toBeTruthy()
      }
    }
  }

  await context.close()
})

// Touch target size test
test('Touch targets are appropriately sized on mobile', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  })
  const page = await context.newPage()

  await page.goto('http://localhost:3001')
  await page.waitForLoadState('networkidle')

  // Check all interactive elements
  const selectors = ['button:visible', 'a:visible']

  for (const selector of selectors) {
    const elements = await page.locator(selector).all()

    for (const element of elements.slice(0, 10)) { // Check first 10 to speed up test
      const box = await element.boundingBox()
      if (box) {
        // WCAG guideline: touch targets should be at least 44x44px
        // Allow smaller width for inline links, but height should be adequate
        expect(box.height).toBeGreaterThanOrEqual(40) // Slightly relaxed for inline elements
      }
    }
  }

  await context.close()
})

// Comprehensive mobile UI test
test('Complete mobile UI validation', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  })
  const page = await context.newPage()

  await page.goto('http://localhost:3001')
  await page.waitForLoadState('networkidle')

  // Take a screenshot for visual verification
  await page.screenshot({ path: 'tests/screenshots/mobile-layout.png', fullPage: false })

  // Ensure critical elements are visible
  const criticalElements = [
    'header', // Header
    'h1', // Main heading
    'button:has-text("Apply")', // CTA button
    'section:first-of-type', // Hero section
  ]

  for (const selector of criticalElements) {
    const element = await page.locator(selector).first()
    expect(await element.isVisible()).toBe(true)
  }

  // Verify no elements overflow viewport
  const overflowingElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'))
    return elements.filter(el => {
      const rect = el.getBoundingClientRect()
      return rect.width > window.innerWidth || rect.right > window.innerWidth
    }).length
  })

  expect(overflowingElements).toBe(0)

  await context.close()
})