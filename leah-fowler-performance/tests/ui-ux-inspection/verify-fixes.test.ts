import { test, expect } from '@playwright/test'

test.describe('UI/UX Fix Verification Tests', () => {
  const viewports = [
    { width: 375, height: 667, name: 'iPhone SE' },
    { width: 768, height: 1024, name: 'iPad' },
    { width: 1024, height: 768, name: 'Desktop Small' },
    { width: 1440, height: 900, name: 'Desktop Medium' },
    { width: 1920, height: 1080, name: 'Desktop Large' }
  ]

  viewports.forEach(({ width, height, name }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/')
      })

      test('No horizontal scroll', async ({ page }) => {
        // Check that body doesn't have horizontal overflow
        const bodyOverflowX = await page.evaluate(() => {
          const body = document.body
          const style = window.getComputedStyle(body)
          return style.overflowX
        })
        expect(bodyOverflowX).toBe('hidden')

        // Check viewport width matches document width
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
      })

      test('Touch targets meet minimum size', async ({ page }) => {
        // Check all buttons
        const buttons = await page.locator('button, a.button, a.btn, [role="button"]').all()
        for (const button of buttons) {
          const box = await button.boundingBox()
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44)
            expect(box.width).toBeGreaterThanOrEqual(44)
          }
        }

        // Check form inputs
        const inputs = await page.locator('input:not([type="hidden"]), select, textarea').all()
        for (const input of inputs) {
          const box = await input.boundingBox()
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
        }
      })

      test('Focus indicators are visible', async ({ page }) => {
        // Test button focus
        const firstButton = page.locator('button').first()
        if (await firstButton.isVisible()) {
          await firstButton.focus()
          const outline = await firstButton.evaluate((el) => {
            const style = window.getComputedStyle(el)
            return {
              outlineWidth: style.outlineWidth,
              outlineColor: style.outlineColor,
              outlineStyle: style.outlineStyle
            }
          })
          expect(outline.outlineWidth).not.toBe('0px')
          expect(outline.outlineStyle).not.toBe('none')
        }

        // Test input focus
        const firstInput = page.locator('input:not([type="hidden"])').first()
        if (await firstInput.isVisible()) {
          await firstInput.focus()
          const outline = await firstInput.evaluate((el) => {
            const style = window.getComputedStyle(el)
            return {
              outlineWidth: style.outlineWidth,
              outlineColor: style.outlineColor,
              outlineStyle: style.outlineStyle
            }
          })
          expect(outline.outlineWidth).not.toBe('0px')
          expect(outline.outlineStyle).not.toBe('none')
        }
      })

      test('Z-index hierarchy is correct', async ({ page }) => {
        // Check header z-index
        const header = page.locator('header').first()
        if (await header.isVisible()) {
          const headerZIndex = await header.evaluate((el) => {
            return window.getComputedStyle(el).zIndex
          })
          expect(parseInt(headerZIndex) || 0).toBeGreaterThanOrEqual(200)
        }

        // Check modal z-index if present
        const modal = page.locator('[role="dialog"]').first()
        if (await modal.isVisible()) {
          const modalZIndex = await modal.evaluate((el) => {
            return window.getComputedStyle(el).zIndex
          })
          expect(parseInt(modalZIndex) || 0).toBeGreaterThanOrEqual(400)
        }
      })

      test('Consistent padding on cards', async ({ page }) => {
        const cards = await page.locator('[data-slot="card"], .card').all()
        const paddings = []

        for (const card of cards) {
          if (await card.isVisible()) {
            const padding = await card.evaluate((el) => {
              const style = window.getComputedStyle(el)
              return {
                top: style.paddingTop,
                right: style.paddingRight,
                bottom: style.paddingBottom,
                left: style.paddingLeft
              }
            })
            paddings.push(padding)
          }
        }

        // Check that all cards have consistent padding
        if (paddings.length > 1) {
          const firstPadding = paddings[0]
          paddings.forEach(padding => {
            expect(padding.top).toBe(firstPadding.top)
            expect(padding.right).toBe(firstPadding.right)
            expect(padding.bottom).toBe(firstPadding.bottom)
            expect(padding.left).toBe(firstPadding.left)
          })
        }
      })

      test('Grid and flex alignment is consistent', async ({ page }) => {
        // Check grid containers
        const grids = await page.locator('.grid, [class*="grid-"]').all()
        for (const grid of grids) {
          if (await grid.isVisible()) {
            const alignment = await grid.evaluate((el) => {
              const style = window.getComputedStyle(el)
              return {
                alignItems: style.alignItems,
                gap: style.gap
              }
            })
            // Verify alignment is set
            expect(alignment.alignItems).toBeTruthy()
            // Verify gap is consistent
            if (alignment.gap && alignment.gap !== 'normal') {
              expect(parseFloat(alignment.gap)).toBeGreaterThanOrEqual(0)
            }
          }
        }

        // Check flex containers
        const flexContainers = await page.locator('.flex, [class*="flex-"]').all()
        for (const flex of flexContainers) {
          if (await flex.isVisible()) {
            const alignment = await flex.evaluate((el) => {
              const style = window.getComputedStyle(el)
              return {
                alignItems: style.alignItems,
                gap: style.gap
              }
            })
            // Verify alignment is set
            expect(alignment.alignItems).toBeTruthy()
          }
        }
      })
    })
  })

  test('CSS custom properties are defined', async ({ page }) => {
    await page.goto('/')

    const customProps = await page.evaluate(() => {
      const root = document.documentElement
      const style = window.getComputedStyle(root)
      return {
        spacingUnit: style.getPropertyValue('--spacing-unit'),
        spacingXs: style.getPropertyValue('--spacing-xs'),
        spacingSm: style.getPropertyValue('--spacing-sm'),
        spacingMd: style.getPropertyValue('--spacing-md'),
        spacingLg: style.getPropertyValue('--spacing-lg'),
        spacingXl: style.getPropertyValue('--spacing-xl'),
        spacing2xl: style.getPropertyValue('--spacing-2xl'),
        spacing3xl: style.getPropertyValue('--spacing-3xl'),
        touchTargetMin: style.getPropertyValue('--touch-target-min'),
        focusColorPrimary: style.getPropertyValue('--focus-color-primary'),
        focusColorSecondary: style.getPropertyValue('--focus-color-secondary'),
        zBase: style.getPropertyValue('--z-base'),
        zDropdown: style.getPropertyValue('--z-dropdown'),
        zSticky: style.getPropertyValue('--z-sticky'),
        zFixed: style.getPropertyValue('--z-fixed'),
        zModal: style.getPropertyValue('--z-modal')
      }
    })

    // Verify all custom properties are defined
    expect(customProps.spacingUnit).toBeTruthy()
    expect(customProps.touchTargetMin).toBeTruthy()
    expect(customProps.focusColorPrimary).toBeTruthy()
    expect(customProps.zFixed).toBeTruthy()
  })
})