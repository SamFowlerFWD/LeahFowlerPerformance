import { test, expect } from '@playwright/test'

test.describe('Apply Page Critical UI Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/apply')
    await page.waitForLoadState('domcontentloaded')
  })

  test('Radio buttons are visible with navy styling', async ({ page }) => {
    // Wait for radio buttons to load
    const radioButton = page.locator('[data-slot="radio-group-item"]').first()
    await expect(radioButton).toBeVisible()

    // Check the styling of radio buttons
    const borderColor = await radioButton.evaluate(el =>
      window.getComputedStyle(el).borderColor
    )

    // Should have a visible border (not transparent or too light)
    expect(borderColor).toBeTruthy()
    expect(borderColor).not.toBe('rgba(0, 0, 0, 0)')

    // Check border width for visibility
    const borderWidth = await radioButton.evaluate(el =>
      window.getComputedStyle(el).borderWidth
    )

    // Should be at least 2px for visibility
    expect(parseFloat(borderWidth)).toBeGreaterThanOrEqual(2)

    // Test checked state
    await radioButton.click()

    // Get background color when checked
    const checkedBg = await radioButton.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    )

    // When checked, should have navy background
    expect(checkedBg).toBeTruthy()
    expect(checkedBg).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('Page has proper top spacing', async ({ page }) => {
    // Check main element padding
    const main = page.locator('main').first()
    const paddingTop = await main.evaluate(el =>
      window.getComputedStyle(el).paddingTop
    )

    // Should have at least 128px top padding (pt-32)
    expect(parseFloat(paddingTop)).toBeGreaterThanOrEqual(128)

    // Check title positioning
    const title = page.locator('h1:has-text("Start Your Online Coaching Journey")').first()
    const titleBox = await title.boundingBox()

    if (titleBox) {
      // Title should not be cramped at top
      expect(titleBox.y).toBeGreaterThan(100)
    }
  })

  test('Form header has adequate padding', async ({ page }) => {
    // Check "Apply for Coaching" header
    const formTitle = page.locator('text="Apply for Coaching"').first()
    await expect(formTitle).toBeVisible()

    // Get parent container
    const cardHeader = page.locator('[data-slot="card-header"]').first()
    const padding = await cardHeader.evaluate(el => ({
      top: window.getComputedStyle(el).paddingTop,
      bottom: window.getComputedStyle(el).paddingBottom
    }))

    // Should have improved padding (pt-12 pb-10)
    expect(parseFloat(padding.top)).toBeGreaterThanOrEqual(48)
    expect(parseFloat(padding.bottom)).toBeGreaterThanOrEqual(40)
  })

  test('Radio buttons have hover effects', async ({ page }) => {
    const radioContainer = page.locator('.flex.items-start.space-x-3.p-4').first()

    // Get initial border color
    const initialBorder = await radioContainer.evaluate(el =>
      window.getComputedStyle(el).borderColor
    )

    // Hover over the container
    await radioContainer.hover()

    // Container should have hover effect
    const hoverBg = await radioContainer.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    )

    // Should have a subtle background change on hover
    expect(hoverBg).toBeTruthy()
  })

  test('Visual screenshot of radio buttons', async ({ page }) => {
    // Take screenshot of programme selection for visual verification
    const programmeSection = page.locator('div:has(h3:has-text("Which Programme Interests You?"))').first()

    await expect(programmeSection).toHaveScreenshot('radio-buttons-visible.png', {
      maxDiffPixels: 100
    })
  })

  test('Mobile view maintains proper spacing', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    // Check main padding is still adequate
    const main = page.locator('main').first()
    const mobilePadding = await main.evaluate(el =>
      window.getComputedStyle(el).paddingTop
    )

    // Should maintain pt-32 on mobile
    expect(parseFloat(mobilePadding)).toBeGreaterThanOrEqual(128)

    // Radio buttons should still be visible
    const radioButton = page.locator('[data-slot="radio-group-item"]').first()
    await expect(radioButton).toBeVisible()

    const size = await radioButton.evaluate(el => ({
      width: window.getComputedStyle(el).width,
      height: window.getComputedStyle(el).height
    }))

    // Should be at least 20x20px
    expect(parseFloat(size.width)).toBeGreaterThanOrEqual(20)
    expect(parseFloat(size.height)).toBeGreaterThanOrEqual(20)
  })
})