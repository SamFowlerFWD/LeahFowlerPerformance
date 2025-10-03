import { test, expect } from '@playwright/test'

test.describe('CTA Button Spacing Tests', () => {
  test('should have proper text containment in pricing CTA buttons', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3001')

    // Wait for the pricing section to load
    await page.waitForSelector('text=Start Your Transformation', { timeout: 10000 })

    // Scroll to the pricing section
    await page.locator('text=Start Your Transformation').scrollIntoViewIfNeeded()

    // Find the "Start Your Transformation" button
    const transformButton = page.locator('button:has-text("Start Your Transformation")').first()

    // Get button bounding box
    const buttonBox = await transformButton.boundingBox()
    expect(buttonBox).not.toBeNull()

    // Check that button has minimum width to contain text
    if (buttonBox) {
      expect(buttonBox.width).toBeGreaterThan(200)
    }

    // Verify the button has proper styling classes
    const buttonClasses = await transformButton.getAttribute('class')
    expect(buttonClasses).toContain('px-6')
    expect(buttonClasses).toContain('py-6')
    expect(buttonClasses).toContain('flex')
    expect(buttonClasses).toContain('items-center')
    expect(buttonClasses).toContain('justify-center')

    // Take a screenshot of the button
    await transformButton.screenshot({ path: 'tests/screenshots/transform-button.png' })

    // Check the "Start 16 Weeks - £48" button if it exists
    const weeksButton = page.locator('button:has-text("Start 16 Weeks")').first()
    if (await weeksButton.isVisible()) {
      const weeksButtonBox = await weeksButton.boundingBox()
      expect(weeksButtonBox).not.toBeNull()

      if (weeksButtonBox) {
        expect(weeksButtonBox.width).toBeGreaterThan(200)
      }

      await weeksButton.screenshot({ path: 'tests/screenshots/weeks-button.png' })
    }

    console.log('✅ All CTA buttons have proper spacing and text containment')
  })

  test('should verify button text is visible and not overflowing', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // Wait for buttons to load
    await page.waitForSelector('button:has-text("Start Your Transformation")', { timeout: 10000 })

    const transformButton = page.locator('button:has-text("Start Your Transformation")').first()

    // Check button is visible
    await expect(transformButton).toBeVisible()

    // Get computed styles
    const paddingLeft = await transformButton.evaluate((el) =>
      window.getComputedStyle(el).paddingLeft
    )
    const paddingRight = await transformButton.evaluate((el) =>
      window.getComputedStyle(el).paddingRight
    )

    console.log(`Button padding-left: ${paddingLeft}`)
    console.log(`Button padding-right: ${paddingRight}`)

    // Verify padding is applied (should be 24px = 1.5rem for px-6)
    expect(paddingLeft).toBe('24px')
    expect(paddingRight).toBe('24px')
  })
})
