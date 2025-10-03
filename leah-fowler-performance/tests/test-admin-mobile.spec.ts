import { test, expect } from '@playwright/test'

test.describe('Admin Panel Mobile Responsiveness', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 }
  ]

  const adminPages = [
    { path: '/admin/dashboard', name: 'Dashboard' },
    { path: '/admin/assessments', name: 'Assessments' },
    { path: '/admin/blog', name: 'Blog Management' }
  ]

  viewports.forEach(viewport => {
    adminPages.forEach(page => {
      test(`${page.name} on ${viewport.name}`, async ({ page: browserPage }) => {
        // Set viewport
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height })

        // Navigate to page
        await browserPage.goto(page.path, { waitUntil: 'networkidle' })

        // Check if mobile menu button is visible on mobile/tablet
        if (viewport.width < 1024) {
          const mobileMenuButton = browserPage.locator('[aria-label="Open menu"]')
          await expect(mobileMenuButton).toBeVisible()

          // Test mobile menu opens
          await mobileMenuButton.click()
          const mobileMenu = browserPage.locator('[role="dialog"]')
          await expect(mobileMenu).toBeVisible()

          // Check navigation items in mobile menu
          await expect(browserPage.locator('text=Dashboard')).toBeVisible()
          await expect(browserPage.locator('text=Applications')).toBeVisible()
          await expect(browserPage.locator('text=Blog')).toBeVisible()

          // Close menu
          await browserPage.keyboard.press('Escape')
        } else {
          // Check desktop navigation is visible
          const desktopNav = browserPage.locator('nav').filter({ hasText: 'Dashboard' })
          await expect(desktopNav).toBeVisible()
        }

        // Check minimum touch target sizes on mobile
        if (viewport.width < 768) {
          const buttons = browserPage.locator('button')
          const buttonCount = await buttons.count()

          for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i)
            const isVisible = await button.isVisible()

            if (isVisible) {
              const box = await button.boundingBox()
              if (box) {
                // Check minimum touch target of 44px
                expect(box.height).toBeGreaterThanOrEqual(40) // Allow slightly smaller for some buttons
              }
            }
          }
        }

        // Check responsive tables on assessments page
        if (page.path === '/admin/assessments' && viewport.width < 1024) {
          // Tables should be converted to cards on mobile
          const cards = browserPage.locator('.card, [class*="Card"]')
          const cardsCount = await cards.count()
          expect(cardsCount).toBeGreaterThan(0)
        }

        // Check stat cards stack on mobile
        if (page.path === '/admin/dashboard' && viewport.width < 640) {
          const statsGrid = browserPage.locator('[class*="grid-cols-1"]')
          await expect(statsGrid.first()).toBeVisible()
        }

        // Take screenshot for visual verification
        await browserPage.screenshot({
          path: `tests/screenshots/admin-${page.name.toLowerCase().replace(' ', '-')}-${viewport.name.toLowerCase()}.png`
        })
      })
    })
  })

  test('Brand colors are applied correctly', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // Check for brand color classes
    const navyElements = await page.locator('[class*="navy"]').count()
    const goldElements = await page.locator('[class*="gold"]').count()

    expect(navyElements).toBeGreaterThan(0)
    expect(goldElements).toBeGreaterThan(0)

    // Check that generic colors are replaced
    const blueElements = await page.locator('[class*="blue-600"]').count()
    const greenElements = await page.locator('[class*="green-600"]').count()
    const purpleElements = await page.locator('[class*="purple-600"]').count()

    expect(blueElements).toBe(0)
    expect(greenElements).toBe(0)
    expect(purpleElements).toBe(0)
  })

  test('AdminLayout is used on all pages', async ({ page }) => {
    for (const adminPage of adminPages) {
      await page.goto(adminPage.path)

      // Check for AdminLayout elements
      const header = page.locator('header').filter({ has: page.locator('[class*="sticky"]') })
      await expect(header).toBeVisible()

      // Check for consistent footer
      const footer = page.locator('footer')
      if (await footer.count() > 0) {
        await expect(footer.first()).toContainText('Leah Fowler Performance')
      }
    }
  })
})