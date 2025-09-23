import { test, expect } from '@playwright/test'

test.describe('Quick UI/UX Fixes Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Critical fixes are applied', async ({ page }) => {
    // 1. Check horizontal scroll prevention
    const bodyStyles = await page.evaluate(() => {
      const body = document.body
      const html = document.documentElement
      return {
        bodyOverflowX: window.getComputedStyle(body).overflowX,
        htmlOverflowX: window.getComputedStyle(html).overflowX,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }
    })

    expect(bodyStyles.bodyOverflowX).toBe('hidden')
    expect(bodyStyles.scrollWidth).toBeLessThanOrEqual(bodyStyles.clientWidth + 5) // Allow 5px tolerance

    // 2. Check CSS custom properties are defined
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement
      const style = window.getComputedStyle(root)
      return {
        spacingUnit: style.getPropertyValue('--spacing-unit'),
        touchTargetMin: style.getPropertyValue('--touch-target-min'),
        focusColorPrimary: style.getPropertyValue('--focus-color-primary'),
        zFixed: style.getPropertyValue('--z-fixed')
      }
    })

    expect(cssVars.spacingUnit).toBeTruthy()
    expect(cssVars.touchTargetMin).toBe('44px')
    expect(cssVars.focusColorPrimary).toBe('#d4a574')
    expect(cssVars.zFixed).toBeTruthy()

    // 3. Check focus indicators work
    const firstButton = page.locator('button').first()
    if (await firstButton.isVisible()) {
      await firstButton.focus()
      const focusStyles = await firstButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          hasOutline: style.outlineWidth !== '0px' && style.outlineStyle !== 'none',
          outlineColor: style.outlineColor
        }
      })
      expect(focusStyles.hasOutline).toBe(true)
    }

    // 4. Sample check for minimum touch targets
    const buttons = await page.locator('button:visible').all()
    let sampledButtons = buttons.slice(0, Math.min(5, buttons.length))

    for (const button of sampledButtons) {
      const box = await button.boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }

    // 5. Check z-index hierarchy
    const header = page.locator('header').first()
    if (await header.isVisible()) {
      const zIndex = await header.evaluate((el) => {
        const z = window.getComputedStyle(el).zIndex
        return z === 'auto' ? 0 : parseInt(z)
      })
      expect(zIndex).toBeGreaterThanOrEqual(200)
    }
  })

  test('Mobile viewport (375px) - No horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const scrollCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyOverflowX: window.getComputedStyle(document.body).overflowX
      }
    })

    expect(scrollCheck.bodyOverflowX).toBe('hidden')
    expect(scrollCheck.scrollWidth).toBeLessThanOrEqual(scrollCheck.clientWidth + 5)
  })

  test('Tablet viewport (768px) - Touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Sample visible inputs
    const inputs = await page.locator('input:visible:not([type="hidden"])').all()
    let sampledInputs = inputs.slice(0, Math.min(3, inputs.length))

    for (const input of sampledInputs) {
      const height = await input.evaluate((el) => {
        return el.getBoundingClientRect().height
      })
      expect(height).toBeGreaterThanOrEqual(43) // Allow 1px tolerance for rounding
    }
  })

  test('Desktop viewport (1440px) - Focus states', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Test link focus
    const firstLink = page.locator('a:not(.button):not(.btn)').first()
    if (await firstLink.isVisible()) {
      await firstLink.focus()
      const focusStyles = await firstLink.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          outlineWidth: style.outlineWidth,
          outlineColor: style.outlineColor,
          outlineStyle: style.outlineStyle
        }
      })

      expect(focusStyles.outlineStyle).not.toBe('none')
      expect(focusStyles.outlineWidth).not.toBe('0px')
    }
  })
})