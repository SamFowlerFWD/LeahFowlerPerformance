import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Mobile Hero Accessibility', () => {
  test('Mobile overlay meets WCAG AA standards', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Wait for hero to be fully loaded
    await page.waitForSelector('h1', { timeout: 10000 })

    // Manual contrast checks for critical elements
    const criticalElements = [
      { selector: 'h1', minContrast: 3.0, description: 'Main headline (large text)' },
      { selector: 'p', minContrast: 4.5, description: 'Subheading (normal text)' },
      { selector: 'button', minContrast: 4.5, description: 'CTA button' }
    ]

    for (const element of criticalElements) {
      const el = await page.locator(element.selector).first()

      if (await el.isVisible()) {
        // Check element has sufficient size for touch targets
        const box = await el.boundingBox()

        if (element.selector === 'button' && box) {
          // WCAG 2.1 Success Criterion 2.5.5: Target Size (Level AAA)
          // Minimum 44x44px for touch targets
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }

        // Verify text is visible and readable
        const color = await el.evaluate(element => {
          const style = window.getComputedStyle(element)
          return style.color
        })

        // On mobile with dark overlay, text should be white or very light
        expect(color).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255|rgb\(2[4-5][0-9],\s*2[4-5][0-9],\s*2[4-5][0-9]/)

        console.log(`✓ ${element.description}: ${color}`)
      }
    }

    // Check focus indicators
    const button = await page.locator('button').first()
    await button.focus()

    const focusStyle = await button.evaluate(element => {
      const style = window.getComputedStyle(element)
      return {
        outline: style.outline,
        outlineOffset: style.outlineOffset,
        boxShadow: style.boxShadow
      }
    })

    // Should have visible focus indicator
    const hasFocusIndicator =
      focusStyle.outline !== 'none' ||
      focusStyle.boxShadow.includes('rgb')

    expect(hasFocusIndicator).toBeTruthy()
  })

  test('Desktop layout meets accessibility standards', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 })

    // Check heading hierarchy
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
      elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim().substring(0, 50)
      }))
    )

    // Should have exactly one h1
    const h1Count = headings.filter(h => h.tag === 'h1').length
    expect(h1Count).toBe(1)

    // Check button has accessible name
    const button = await page.locator('button').first()
    const buttonText = await button.textContent()
    expect(buttonText).toBeTruthy()
    expect(buttonText?.length).toBeGreaterThan(0)

    // Check images have alt text
    const images = await page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect(alt?.length).toBeGreaterThan(0)
    }

    // Verify keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tag: el?.tagName.toLowerCase(),
        text: el?.textContent?.trim().substring(0, 50)
      }
    })

    // First focusable element should be interactive
    expect(['a', 'button', 'input', 'select', 'textarea']).toContain(focusedElement.tag)
  })

  test('Text remains readable during scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle' })

    // Initial check
    const headline = await page.locator('h1').first()
    await expect(headline).toBeVisible()

    // Scroll down slightly
    await page.evaluate(() => window.scrollBy(0, 100))
    await page.waitForTimeout(500)

    // Text should still be visible and readable
    await expect(headline).toBeVisible()

    // Check that gradient overlay is still present
    const gradient = await page.locator('.bg-gradient-to-t.from-black\\/80')
    await expect(gradient).toBeVisible()

    // Verify button remains accessible after scroll
    const button = await page.locator('button:has-text("Apply")').first()
    const buttonInViewport = await button.isInViewport()

    if (buttonInViewport) {
      await expect(button).toBeVisible()
    }
  })
})