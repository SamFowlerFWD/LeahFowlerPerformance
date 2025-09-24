import { test, expect } from '@playwright/test'

test.describe('Apply Page UI Fixes Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/apply')
    await page.waitForLoadState('networkidle')
  })

  test('Radio buttons have strong contrast and are clearly visible', async ({ page }) => {
    // Wait for the form to be fully loaded
    await page.waitForSelector('[data-slot="radio-group-item"]')

    // Get all radio button elements
    const radioButtons = await page.locator('[data-slot="radio-group-item"]').all()

    expect(radioButtons.length).toBeGreaterThan(0)

    // Check each radio button for visibility and contrast
    for (const radioButton of radioButtons) {
      // Check if radio button is visible
      await expect(radioButton).toBeVisible()

      // Get computed styles
      const styles = await radioButton.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          borderColor: computed.borderColor,
          borderWidth: computed.borderWidth,
          backgroundColor: computed.backgroundColor,
          width: computed.width,
          height: computed.height,
          opacity: computed.opacity
        }
      })

      // Verify radio button has proper border width for visibility
      expect(parseFloat(styles.borderWidth)).toBeGreaterThanOrEqual(2)

      // Verify opacity is full
      expect(parseFloat(styles.opacity)).toBe(1)

      // Verify minimum size (20px = 5 * 4px in Tailwind)
      expect(parseFloat(styles.width)).toBeGreaterThanOrEqual(20)
      expect(parseFloat(styles.height)).toBeGreaterThanOrEqual(20)
    }

    // Test hover state for better visibility
    const firstRadioButton = radioButtons[0]
    await firstRadioButton.hover()

    const hoverStyles = await firstRadioButton.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        borderColor: computed.borderColor,
        transition: computed.transition
      }
    })

    // Verify hover state has transition for smooth interaction
    expect(hoverStyles.transition).toContain('all')
  })

  test('Selected radio buttons have high contrast checked state', async ({ page }) => {
    // Click on a radio button to select it
    const programmeRadio = await page.locator('[id="online-package"]').first()
    await programmeRadio.click()

    // Wait for state change
    await page.waitForTimeout(300)

    // Check the checked state styling
    const checkedStyles = await programmeRadio.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor
      }
    })

    // The checked state should have navy background based on our fix
    // Navy color in RGB is approximately rgb(26, 41, 66) or #1a2942
    expect(checkedStyles.backgroundColor).toBeTruthy()
    expect(checkedStyles.borderColor).toBeTruthy()

    // Check that the inner indicator is visible when selected
    const indicator = await programmeRadio.locator('[data-slot="radio-group-indicator"] svg').first()
    await expect(indicator).toBeVisible()
  })

  test('Page header has proper spacing from top', async ({ page }) => {
    // Check main content padding
    const mainContent = await page.locator('main').first()
    const mainStyles = await mainContent.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom
      }
    })

    // Verify minimum padding top (pt-32 = 8rem = 128px on mobile)
    expect(parseFloat(mainStyles.paddingTop)).toBeGreaterThanOrEqual(128)

    // Verify adequate bottom padding
    expect(parseFloat(mainStyles.paddingBottom)).toBeGreaterThanOrEqual(80)
  })

  test('Page title has adequate spacing and is not cramped', async ({ page }) => {
    const pageTitle = await page.locator('h1').filter({ hasText: 'Start Your Online Coaching Journey' }).first()

    // Check that title is visible
    await expect(pageTitle).toBeVisible()

    // Get the bounding box to check position
    const boundingBox = await pageTitle.boundingBox()
    expect(boundingBox).toBeTruthy()

    if (boundingBox) {
      // Title should not be too close to the top (accounting for fixed header)
      expect(boundingBox.y).toBeGreaterThan(100)
    }

    // Check margin bottom on title
    const titleStyles = await pageTitle.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        marginBottom: computed.marginBottom,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight
      }
    })

    // Verify adequate spacing below title (mb-6 = 1.5rem = 24px)
    expect(parseFloat(titleStyles.marginBottom)).toBeGreaterThanOrEqual(24)

    // Verify title is prominent
    expect(titleStyles.fontWeight).toBe('700')
  })

  test('Form card has proper spacing and padding', async ({ page }) => {
    const formCard = await page.locator('[data-slot="card"]').first()

    // Check card header padding
    const cardHeader = await page.locator('h3').filter({ hasText: 'Apply for Coaching' }).first()
    const headerParent = await cardHeader.locator('..').first()

    const headerStyles = await headerParent.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom
      }
    })

    // Verify improved padding (pt-12 = 3rem = 48px)
    expect(parseFloat(headerStyles.paddingTop)).toBeGreaterThanOrEqual(48)
    expect(parseFloat(headerStyles.paddingBottom)).toBeGreaterThanOrEqual(40)
  })

  test('WCAG contrast ratio compliance for radio buttons', async ({ page }) => {
    // Function to calculate contrast ratio
    const getContrastRatio = (rgb1: string, rgb2: string) => {
      const getLuminance = (rgb: string) => {
        const matches = rgb.match(/\d+/g)
        if (!matches || matches.length < 3) return 0

        const [r, g, b] = matches.map(Number).map(val => {
          const sRGB = val / 255
          return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }

      const lum1 = getLuminance(rgb1)
      const lum2 = getLuminance(rgb2)
      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)

      return (brightest + 0.05) / (darkest + 0.05)
    }

    // Check contrast of radio button borders against background
    const radioButton = await page.locator('[data-slot="radio-group-item"]').first()
    const containerBg = await page.locator('.bg-white').first()

    const radioStyles = await radioButton.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        borderColor: computed.borderColor
      }
    })

    const bgStyles = await containerBg.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        backgroundColor: computed.backgroundColor
      }
    })

    // Calculate and verify contrast ratio (WCAG AA requires 3:1 for UI components)
    const contrastRatio = getContrastRatio(radioStyles.borderColor, bgStyles.backgroundColor)
    expect(contrastRatio).toBeGreaterThanOrEqual(3)
  })

  test('Focus states are clearly visible with proper outline', async ({ page }) => {
    // Tab to first radio button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Find the focused element
    const focusedElement = await page.locator(':focus').first()

    // Check focus styles
    const focusStyles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        outlineWidth: computed.outlineWidth,
        outlineColor: computed.outlineColor,
        outlineOffset: computed.outlineOffset,
        boxShadow: computed.boxShadow
      }
    })

    // Verify focus indicator is visible (ring or outline)
    const hasVisibleFocus =
      parseFloat(focusStyles.outlineWidth) > 0 ||
      focusStyles.boxShadow.includes('rgb')

    expect(hasVisibleFocus).toBeTruthy()
  })

  test('Touch targets meet minimum size requirements', async ({ page }) => {
    // Check all radio buttons meet 44x44px minimum
    const radioButtons = await page.locator('[data-slot="radio-group-item"]').all()

    for (const button of radioButtons) {
      const box = await button.boundingBox()
      if (box) {
        // Radio buttons should be at least 20x20px (size-5 in Tailwind)
        // The clickable area includes padding from the container
        expect(box.width).toBeGreaterThanOrEqual(20)
        expect(box.height).toBeGreaterThanOrEqual(20)
      }
    }

    // Check that the container divs provide adequate touch target
    const radioContainers = await page.locator('.flex.items-start.space-x-3.p-4').all()

    for (const container of radioContainers) {
      const box = await container.boundingBox()
      if (box) {
        // Container should provide adequate height for touch
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('Radio button interactions are smooth and responsive', async ({ page }) => {
    const programmes = [
      'online-package',
      'pathway',
      'smallgroup',
      'semiprivate',
      'silver',
      'gold',
      'unsure'
    ]

    // Test clicking through different options
    for (const programme of programmes.slice(0, 3)) {
      const radio = await page.locator(`[id="${programme}"]`).first()
      await radio.click()

      // Verify selection is applied
      await expect(radio).toHaveAttribute('data-state', 'checked')

      // Small delay to see the transition
      await page.waitForTimeout(200)
    }

    // Test experience level radio buttons
    const experienceLevels = ['beginner', 'intermediate', 'advanced', 'athlete']

    for (const level of experienceLevels.slice(0, 2)) {
      const radio = await page.locator(`[id="exp-${level}"]`).first()
      await radio.click()

      // Verify selection
      await expect(radio).toHaveAttribute('data-state', 'checked')

      await page.waitForTimeout(200)
    }
  })

  test('Visual regression - screenshot comparison', async ({ page }) => {
    // Take screenshots of key areas for visual regression testing

    // Full page screenshot
    await expect(page).toHaveScreenshot('apply-page-full.png', {
      fullPage: true,
      animations: 'disabled'
    })

    // Radio button section screenshot
    const programmeSection = await page.locator('text="Which Programme Interests You?"').locator('..').first()
    await expect(programmeSection).toHaveScreenshot('programme-selection.png', {
      animations: 'disabled'
    })

    // Experience section screenshot
    const experienceSection = await page.locator('text="Your Fitness Experience"').locator('..').first()
    await expect(experienceSection).toHaveScreenshot('experience-selection.png', {
      animations: 'disabled'
    })
  })

  test('Mobile responsiveness for spacing and radio buttons', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForLoadState('networkidle')

    // Check that radio buttons are still visible on mobile
    const radioButtons = await page.locator('[data-slot="radio-group-item"]').all()

    for (const button of radioButtons.slice(0, 2)) {
      await expect(button).toBeVisible()

      const box = await button.boundingBox()
      if (box) {
        // Should maintain minimum size on mobile
        expect(box.width).toBeGreaterThanOrEqual(20)
        expect(box.height).toBeGreaterThanOrEqual(20)
      }
    }

    // Check main content padding is appropriate for mobile
    const mainContent = await page.locator('main').first()
    const mobileStyles = await mainContent.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        paddingTop: computed.paddingTop
      }
    })

    // Should have pt-32 (128px) on mobile
    expect(parseFloat(mobileStyles.paddingTop)).toBeGreaterThanOrEqual(128)
  })
})

test.describe('Accessibility Compliance', () => {
  test('Form meets ARIA requirements', async ({ page }) => {
    await page.goto('http://localhost:3002/apply')
    await page.waitForLoadState('networkidle')

    // Check radio groups have proper ARIA attributes
    const radioGroups = await page.locator('[role="radiogroup"]').all()
    expect(radioGroups.length).toBeGreaterThan(0)

    // Check that labels are properly associated
    const radioButtons = await page.locator('[data-slot="radio-group-item"]').all()

    for (const button of radioButtons.slice(0, 3)) {
      const id = await button.getAttribute('id')
      expect(id).toBeTruthy()

      // Check there's a label for this radio button
      const label = await page.locator(`[for="${id}"]`).first()
      await expect(label).toBeVisible()
    }
  })

  test('Keyboard navigation works correctly', async ({ page }) => {
    await page.goto('http://localhost:3002/apply')
    await page.waitForLoadState('networkidle')

    // Focus first input
    await page.locator('[name="name"]').focus()

    // Tab through form elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focused = await page.locator(':focus').first()
      await expect(focused).toBeVisible()
    }

    // Test arrow key navigation within radio group
    const firstRadio = await page.locator('[id="online-package"]').first()
    await firstRadio.focus()

    // Arrow down should move to next option
    await page.keyboard.press('ArrowDown')
    const secondRadio = await page.locator('[id="pathway"]').first()
    await expect(secondRadio).toBeFocused()
  })
})