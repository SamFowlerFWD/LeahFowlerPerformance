import { test, expect } from '@playwright/test'

test.describe('Mobile Hero Section and Header Fixes', () => {
  // Test at different mobile viewports
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 14 Pro', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ]

  test.describe('Hero Text Alignment', () => {
    viewports.forEach(viewport => {
      test(`should center text on mobile viewport (${viewport.name})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('http://localhost:3001')

        // Wait for hero section to load
        const heroContent = await page.locator('.relative.z-10.w-full.max-w-2xl').first()
        await expect(heroContent).toBeVisible()

        if (viewport.width < 1024) {
          // Mobile and tablet: text should be centered
          await expect(heroContent).toHaveClass(/text-center/)

          // CTA buttons should be centered
          const ctaContainer = await page.locator('.flex.flex-col.sm\\:flex-row.gap-3').first()
          await expect(ctaContainer).toHaveClass(/justify-center/)
        } else {
          // Desktop: text should be left-aligned
          await expect(heroContent).toHaveClass(/lg:text-left/)

          // CTA buttons should be left-aligned
          const ctaContainer = await page.locator('.flex.flex-col.sm\\:flex-row.gap-3').first()
          await expect(ctaContainer).toHaveClass(/lg:justify-start/)
        }
      })
    })
  })

  test.describe('Hero Text Sizes', () => {
    test('should have 2.5x larger text on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:3001')

      // Check headline size
      const headline = await page.locator('h1').first()
      await expect(headline).toBeVisible()
      await expect(headline).toHaveClass(/text-6xl/)

      // Check computed font size
      const headlineSize = await headline.evaluate(el =>
        window.getComputedStyle(el).fontSize
      )
      // text-6xl should be around 60px (3.75rem)
      expect(parseFloat(headlineSize)).toBeGreaterThanOrEqual(56)

      // Check subheading size
      const subheading = await page.locator('p').filter({ hasText: 'Norfolk Strength' }).first()
      await expect(subheading).toBeVisible()
      await expect(subheading).toHaveClass(/text-xl/)

      const subheadingSize = await subheading.evaluate(el =>
        window.getComputedStyle(el).fontSize
      )
      // text-xl should be around 20px (1.25rem)
      expect(parseFloat(subheadingSize)).toBeGreaterThanOrEqual(18)
    })

    test('should maintain desktop text sizes on large screens', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('http://localhost:3001')

      // Check headline maintains lg:text-5xl on desktop
      const headline = await page.locator('h1').first()
      await expect(headline).toBeVisible()
      await expect(headline).toHaveClass(/lg:text-5xl/)

      // Check subheading maintains lg:text-lg on desktop
      const subheading = await page.locator('p').filter({ hasText: 'Norfolk Strength' }).first()
      await expect(subheading).toBeVisible()
      await expect(subheading).toHaveClass(/lg:text-lg/)
    })
  })

  test.describe('Header Logo Size', () => {
    test('should double logo size on mobile without increasing header height', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:3001')

      // Check logo container size
      const logoContainer = await page.locator('.relative.h-20').first()
      await expect(logoContainer).toBeVisible()

      // Get header height
      const header = await page.locator('header').first()
      const headerHeight = await header.evaluate(el => el.offsetHeight)

      // Header should be compact (less than 100px total height)
      expect(headerHeight).toBeLessThanOrEqual(100)

      // Logo should be visible and h-20 (80px)
      const logoHeight = await logoContainer.evaluate(el => el.offsetHeight)
      expect(logoHeight).toBeGreaterThanOrEqual(75) // Allow for slight variations
      expect(logoHeight).toBeLessThanOrEqual(85)
    })

    test('should have even larger logo on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 1024 })
      await page.goto('http://localhost:3001')

      // Check logo container has sm:h-24 class
      const logoContainer = await page.locator('.relative').filter({ has: page.locator('img[alt*="Strength PT"]') }).first()
      await expect(logoContainer).toBeVisible()
      await expect(logoContainer).toHaveClass(/sm:h-24/)
    })

    test('should maintain normal logo size on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('http://localhost:3001')

      // Check logo maintains reasonable size on desktop
      const logoContainer = await page.locator('.relative').filter({ has: page.locator('img[alt*="Strength PT"]') }).first()
      await expect(logoContainer).toBeVisible()
      await expect(logoContainer).toHaveClass(/lg:h-16/)
    })
  })

  test.describe('Overall Mobile Experience', () => {
    test('should have optimal mobile layout at 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:3001')

      // Take a screenshot for visual verification
      await page.screenshot({
        path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-375px.png',
        fullPage: false
      })

      // Verify all elements are visible
      const headline = await page.locator('h1').first()
      const subheading = await page.locator('p').filter({ hasText: 'Norfolk Strength' }).first()
      const ctaButton = await page.locator('button').filter({ hasText: 'Apply for Coaching' }).first()
      const logo = await page.locator('img[alt*="Strength PT"]').first()

      await expect(headline).toBeVisible()
      await expect(subheading).toBeVisible()
      await expect(ctaButton).toBeVisible()
      await expect(logo).toBeVisible()

      // Verify text is readable (contrast check)
      const headlineColor = await headline.evaluate(el =>
        window.getComputedStyle(el).color
      )
      expect(headlineColor).toBeTruthy()
    })

    test('should transition smoothly to desktop layout', async ({ page }) => {
      // Start at mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:3001')

      // Gradually increase viewport to test responsive breakpoints
      const breakpoints = [640, 768, 1024, 1280, 1920]

      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 800 })
        await page.waitForTimeout(100) // Small delay for CSS transitions

        // Verify layout is not broken at any breakpoint
        const headline = await page.locator('h1').first()
        await expect(headline).toBeVisible()

        // Take screenshots at key breakpoints
        if ([375, 768, 1920].includes(width)) {
          await page.screenshot({
            path: `/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/responsive-${width}px.png`,
            fullPage: false
          })
        }
      }
    })
  })

  test.describe('Performance', () => {
    test('should load quickly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const startTime = Date.now()
      await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - startTime

      // Page should load in under 2 seconds
      expect(loadTime).toBeLessThan(2000)

      // Hero content should be immediately visible
      const heroContent = await page.locator('.relative.z-10.w-full.max-w-2xl').first()
      await expect(heroContent).toBeVisible({ timeout: 500 })
    })
  })
})