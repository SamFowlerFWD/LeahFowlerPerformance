import { test, expect } from '@playwright/test'

test.describe('Mobile Hero Overlay - Essential Tests', () => {
  test('Mobile hero uses full-screen overlay design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Wait for hero section
    await page.waitForSelector('section', { timeout: 10000 })

    // 1. Check hero fills viewport
    const heroSection = await page.locator('section').first()
    await expect(heroSection).toHaveClass(/min-h-\[100vh\]/)

    // 2. Verify image is absolute positioned (full screen on mobile)
    const imageContainer = await page.locator('div.absolute.inset-0.lg\\:relative').first()
    await expect(imageContainer).toBeVisible()

    // 3. Check gradient overlay exists for text contrast
    const gradientOverlay = await page.locator('.bg-gradient-to-t.from-black\\/80')
    await expect(gradientOverlay).toBeVisible()

    // 4. Verify content is positioned at bottom with flex
    const contentContainer = await page.locator('.absolute.inset-0.flex.items-end')
    await expect(contentContainer).toBeVisible()

    // 5. Check text is white for contrast
    const headline = await page.locator('h1 span.text-white').first()
    await expect(headline).toBeVisible()

    // 6. Verify button is accessible (use first if multiple exist)
    const button = await page.locator('button:has-text("Apply for Coaching")').first()
    await expect(button).toBeVisible()

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'tests/screenshots/mobile-overlay-390x844.png',
      fullPage: false
    })
  })

  test('Desktop maintains split layout', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Wait for hero section
    await page.waitForSelector('section', { timeout: 10000 })

    // 1. Check image container is relative on desktop (not absolute)
    const imageContainer = await page.locator('.lg\\:relative.lg\\:w-2\\/5')
    await expect(imageContainer).toBeVisible()

    // 2. Content should be in separate column
    const contentContainer = await page.locator('.lg\\:w-3\\/5')
    await expect(contentContainer).toBeVisible()

    // 3. Mobile gradient should be hidden on desktop
    const mobileGradient = await page.locator('.bg-gradient-to-t.from-black\\/80.lg\\:hidden')
    await expect(mobileGradient).toBeHidden()

    // 4. Text should not have forced white color on desktop
    const headline = await page.locator('h1 span').first()
    const classList = await headline.getAttribute('class')
    expect(classList).toContain('lg:text-[color:var(--hero-foreground)]')

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/desktop-split-1440x900.png',
      fullPage: false
    })
  })

  test('Text remains readable with strong gradient on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Check gradient overlay properties
    const gradient = await page.locator('.bg-gradient-to-t.from-black\\/80.via-black\\/50')
    await expect(gradient).toBeVisible()

    // Verify text styling for contrast
    const headline = await page.locator('h1').first()
    await expect(headline).toBeVisible()
    await expect(headline).toHaveClass(/text-white/)

    const subheading = await page.locator('p').first()
    await expect(subheading).toBeVisible()
    await expect(subheading).toHaveClass(/text-white/)
  })

  test('Content positioned correctly at viewport bottom on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Check content container positioning
    const content = await page.locator('.absolute.inset-0.flex.items-end.pb-20')
    await expect(content).toBeVisible()

    // Verify padding from bottom
    await expect(content).toHaveClass(/pb-20/)

    // Check button is reachable (use first if multiple exist)
    const button = await page.locator('button:has-text("Apply for Coaching")').first()
    const buttonBox = await button.boundingBox()

    if (buttonBox) {
      // Button should be visible in viewport
      expect(buttonBox.y).toBeLessThan(667)
      expect(buttonBox.y + buttonBox.height).toBeLessThan(667)

      // But not too close to bottom edge
      expect(buttonBox.y + buttonBox.height).toBeLessThan(600)
    }
  })

  test('Responsive breakpoint transition works correctly', async ({ page }) => {
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Test at tablet/desktop boundary (768px)
    await page.setViewportSize({ width: 767, height: 1024 })

    // Should still show mobile overlay at 767px
    const mobileOverlay = await page.locator('.absolute.inset-0.flex.items-end')
    await expect(mobileOverlay).toBeVisible()

    // Transition to desktop at 1024px
    await page.setViewportSize({ width: 1024, height: 768 })

    // Should show desktop split layout
    const desktopLayout = await page.locator('.lg\\:relative.lg\\:w-2\\/5')
    await expect(desktopLayout).toBeVisible()
  })
})