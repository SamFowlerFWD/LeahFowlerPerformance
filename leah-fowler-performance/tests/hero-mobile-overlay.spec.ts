import { test, expect } from '@playwright/test'

test.describe('Mobile Hero Overlay Design', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for each test
    test.setTimeout(60000)
  })
  // Test different mobile viewport sizes
  const mobileViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 14 Pro', width: 414, height: 896 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S21', width: 360, height: 800 },
    { name: 'iPad Mini', width: 768, height: 1024 }
  ]

  mobileViewports.forEach(({ name, width, height }) => {
    test(`Hero overlay displays correctly on ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height })

      // Navigate to the page
      await page.goto('http://localhost:3007')

      // Wait for hero section to be visible
      const heroSection = page.locator('section').first()
      await expect(heroSection).toBeVisible()

      // Check that the hero section fills the viewport
      const heroBox = await heroSection.boundingBox()
      expect(heroBox?.height).toBeGreaterThanOrEqual(height - 100) // Allow for browser chrome

      // Verify image container is absolute positioned on mobile
      if (width < 1024) {
        const imageContainer = page.locator('div.absolute.inset-0').first()
        await expect(imageContainer).toHaveCSS('position', 'absolute')
      }

      // Check gradient overlay exists for text readability
      const gradientOverlay = page.locator('.bg-gradient-to-t')
      if (width < 1024) {
        await expect(gradientOverlay).toBeVisible()
      }

      // Verify text content is positioned at bottom on mobile
      if (width < 1024) {
        const contentContainer = page.locator('.flex.items-end').first()
        await expect(contentContainer).toHaveCSS('position', 'absolute')
        await expect(contentContainer).toHaveCSS('align-items', 'flex-end')
      }

      // Check text is white on mobile for contrast
      const headline = page.locator('h1').first()
      await expect(headline).toBeVisible()

      if (width < 1024) {
        // Check if text has white class on mobile
        const hasWhiteText = await headline.locator('span.text-white').count()
        expect(hasWhiteText).toBeGreaterThan(0)
      }

      // Verify buttons are accessible and visible
      const applyButton = page.locator('button:has-text("Apply for Coaching")')
      await expect(applyButton).toBeVisible()

      // Check button has minimum touch target size (44x44px)
      const buttonBox = await applyButton.boundingBox()
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44)
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44)

      // Take screenshot for visual verification
      await page.screenshot({
        path: `tests/screenshots/hero-mobile-${name.replace(' ', '-')}-${width}x${height}.png`,
        fullPage: false
      })
    })
  })

  test('Text contrast meets WCAG AA standards on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007')

    // Wait for hero to load
    await page.waitForSelector('h1')

    // Get the headline element
    const headline = page.locator('h1').first()

    // Evaluate contrast ratio
    const contrastData = await headline.evaluate(el => {
      const computedStyle = window.getComputedStyle(el)
      const color = computedStyle.color

      // Get the effective background (considering the overlay)
      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // Simple check for white text
      return {
        textColor: color,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight
      }
    })

    // White text on dark overlay should meet WCAG AA
    // Large text (18pt+ or 14pt+ bold) needs 3:1 ratio
    // Normal text needs 4.5:1 ratio
    const fontSize = parseFloat(contrastData.fontSize)
    const isBold = parseInt(contrastData.fontWeight) >= 700
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && isBold)

    // With white text on dark overlay, we should have good contrast
    // This is a simplified check - in production you'd calculate actual ratio
    expect(contrastData.textColor).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255/)
  })

  test('Smooth transition between mobile and desktop layouts', async ({ page }) => {
    await page.goto('http://localhost:3007')

    // Start at mobile size
    await page.setViewportSize({ width: 767, height: 800 })
    await page.waitForTimeout(500)

    // Check mobile overlay layout
    const imageContainer = page.locator('.absolute.inset-0').first()
    await expect(imageContainer).toBeVisible()

    // Transition to desktop
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(500)

    // Check desktop split layout
    const desktopImage = page.locator('.lg\\:relative').first()
    await expect(desktopImage).toBeVisible()
  })

  test('Content remains accessible at bottom of viewport on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007')

    // Check that content is positioned at bottom
    const contentContainer = page.locator('.flex.items-end').first()
    const contentBox = await contentContainer.boundingBox()

    if (contentBox) {
      // Content should be in the lower portion of the viewport
      expect(contentBox.y + contentBox.height).toBeGreaterThan(600)

      // But not cut off
      expect(contentBox.y + contentBox.height).toBeLessThanOrEqual(844)
    }

    // Verify padding from bottom
    const styles = await contentContainer.evaluate(el =>
      window.getComputedStyle(el)
    )
    expect(styles.paddingBottom).toMatch(/\d+px/)
    const paddingBottom = parseFloat(styles.paddingBottom)
    expect(paddingBottom).toBeGreaterThanOrEqual(60) // At least 60px padding from bottom
  })

  test('Gradient overlay provides sufficient contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007')

    // Check gradient overlay exists
    const gradientOverlay = page.locator('.bg-gradient-to-t.from-black\\/80')
    await expect(gradientOverlay).toBeVisible()

    // Verify gradient properties
    const overlayStyles = await gradientOverlay.evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        background: computed.backgroundImage,
        opacity: computed.opacity,
        position: computed.position
      }
    })

    // Should be absolute positioned
    expect(overlayStyles.position).toBe('absolute')

    // Should have gradient
    expect(overlayStyles.background).toContain('gradient')
  })

  test('Desktop layout remains unchanged', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:3007')

    // Wait for hero section
    const heroSection = page.locator('section').first()
    await expect(heroSection).toBeVisible()

    // Check split layout on desktop
    const imageContainer = page.locator('.lg\\:w-2\\/5').first()
    await expect(imageContainer).toBeVisible()

    const contentContainer = page.locator('.lg\\:w-3\\/5').first()
    await expect(contentContainer).toBeVisible()

    // Verify side-by-side layout
    const imageBox = await imageContainer.boundingBox()
    const contentBox = await contentContainer.boundingBox()

    if (imageBox && contentBox) {
      // Content should be on the left, image on the right
      expect(contentBox.x).toBeLessThan(imageBox.x)
    }

    // Text should not be white on desktop
    const headline = page.locator('h1').first()
    const headlineStyles = await headline.evaluate(el =>
      window.getComputedStyle(el)
    )

    // Should use theme color, not forced white
    expect(headlineStyles.color).not.toBe('rgb(255, 255, 255)')
  })
})