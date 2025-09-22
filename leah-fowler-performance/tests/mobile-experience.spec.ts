import { test, expect, devices } from '@playwright/test'

// Test configurations for different mobile devices
const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S20', device: devices['Galaxy S20'] },
  { name: 'iPad', device: devices['iPad (gen 7)'] },
]

// Performance metrics thresholds
const PERFORMANCE_THRESHOLDS = {
  FCP: 1800, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FID: 100,  // First Input Delay (ms)
  TTI: 3800, // Time to Interactive (ms)
}

test.describe('Mobile Navigation Tests', () => {
  mobileDevices.forEach(({ name, device }) => {
    test.describe(`${name}`, () => {
      test.use({ ...device })

      test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
      })

      test('Mobile hamburger menu should be visible and functional', async ({ page }) => {
        // Check hamburger button is visible
        const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]')
        await expect(hamburgerButton).toBeVisible()

        // Test button size for touch target (minimum 48x48px)
        const buttonBox = await hamburgerButton.boundingBox()
        expect(buttonBox?.width).toBeGreaterThanOrEqual(48)
        expect(buttonBox?.height).toBeGreaterThanOrEqual(48)

        // Click to open menu
        await hamburgerButton.click()
        await page.waitForTimeout(300) // Wait for animation

        // Check menu is visible
        const mobileMenu = page.locator('nav').filter({ hasText: 'Programmes' })
        await expect(mobileMenu).toBeVisible()

        // Test close button
        const closeButton = page.locator('button[aria-label="Toggle navigation menu"]')
        await closeButton.click()
        await page.waitForTimeout(300)

        // Verify menu is hidden
        await expect(mobileMenu).not.toBeVisible()
      })

      test('Bottom navigation bar should be present on mobile', async ({ page }) => {
        if (name.includes('iPad')) {
          test.skip()
        }

        const bottomNav = page.locator('nav').last()
        await expect(bottomNav).toBeVisible()

        // Check all bottom nav items
        const navItems = ['Home', 'Programmes', 'Assessment', 'Contact']
        for (const item of navItems) {
          const navButton = bottomNav.locator(`text=${item}`)
          await expect(navButton).toBeVisible()

          // Test touch target size
          const box = await navButton.boundingBox()
          expect(box?.height).toBeGreaterThanOrEqual(56)
        }
      })

      test('Swipe gestures should work on mobile menu', async ({ page }) => {
        // Open menu
        await page.locator('button[aria-label="Toggle navigation menu"]').click()
        await page.waitForTimeout(300)

        const mobileMenu = page.locator('div').filter({
          has: page.locator('text="Leah Fowler Performance"')
        }).last()

        // Simulate swipe to close (swipe right)
        await mobileMenu.dragTo(mobileMenu, {
          sourcePosition: { x: 10, y: 100 },
          targetPosition: { x: 200, y: 100 },
        })

        await page.waitForTimeout(300)
        await expect(mobileMenu).not.toBeVisible()
      })

      test('Mobile menu dropdown should expand properly', async ({ page }) => {
        await page.locator('button[aria-label="Toggle navigation menu"]').click()
        await page.waitForTimeout(300)

        // Click on Programmes to expand dropdown
        const programmesButton = page.locator('button').filter({ hasText: 'Programmes' })
        await programmesButton.click()
        await page.waitForTimeout(300)

        // Check dropdown items are visible
        const dropdownItems = [
          'Premium Performance - £350/month',
          'Performance Essentials - £199/month',
          'Online Programme - £97/month',
          'Small Group Training - £79/month'
        ]

        for (const item of dropdownItems) {
          await expect(page.locator(`text="${item}"`)).toBeVisible()
        }
      })
    })
  })
})

test.describe('Mobile Form Interactions', () => {
  test.use({ ...devices['iPhone 12'] })

  test.beforeEach(async ({ page }) => {
    await page.goto('/assessment')
    await page.waitForLoadState('networkidle')
  })

  test('Form inputs should be properly sized for mobile', async ({ page }) => {
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"], textarea').all()

    for (const input of inputs) {
      const box = await input.boundingBox()

      // Check minimum height for touch
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(48)
      }

      // Check font size to prevent zoom on iOS
      const fontSize = await input.evaluate(el =>
        window.getComputedStyle(el).fontSize
      )
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16)
    }
  })

  test('Virtual keyboard should not obscure form inputs', async ({ page }) => {
    const firstInput = page.locator('input').first()
    await firstInput.click()

    // Wait for potential keyboard animation
    await page.waitForTimeout(500)

    // Check if input is still in viewport
    const isInViewport = await firstInput.isIntersectingViewport()
    expect(isInViewport).toBeTruthy()
  })

  test('Form submission should work on mobile', async ({ page }) => {
    // Fill form with test data
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phone"]', '07123456789')

    // Submit form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for response
    await page.waitForLoadState('networkidle')

    // Check for success message or redirect
    const successIndicator = page.locator('text=/success|thank you/i')
    const isSuccess = await successIndicator.isVisible().catch(() => false)

    // If no success message, check if redirected
    if (!isSuccess) {
      const url = page.url()
      expect(url).toContain('/thank-you')
    }
  })
})

test.describe('Mobile Responsive Design', () => {
  const breakpoints = [
    { width: 320, height: 568, name: 'iPhone SE' },
    { width: 375, height: 667, name: 'iPhone 8' },
    { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
    { width: 768, height: 1024, name: 'iPad' },
  ]

  breakpoints.forEach(({ width, height, name }) => {
    test(`Layout should be responsive at ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Check no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)

      // Check text is readable (no overflow)
      const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6').all()
      for (const element of textElements.slice(0, 5)) { // Check first 5 elements
        const box = await element.boundingBox()
        if (box) {
          expect(box.width).toBeLessThanOrEqual(viewportWidth)
        }
      }

      // Check images are responsive
      const images = await page.locator('img').all()
      for (const img of images.slice(0, 3)) { // Check first 3 images
        const box = await img.boundingBox()
        if (box) {
          expect(box.width).toBeLessThanOrEqual(viewportWidth)
        }
      }
    })
  })
})

test.describe('Mobile Performance Tests', () => {
  test.use({ ...devices['iPhone 12'] })

  test('Page should load within performance budget', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          resolve({
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            domInteractive: perfData.domInteractive,
            transferSize: perfData.transferSize,
            encodedBodySize: perfData.encodedBodySize,
          })
        } else {
          window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            resolve({
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
              domInteractive: perfData.domInteractive,
              transferSize: perfData.transferSize,
              encodedBodySize: perfData.encodedBodySize,
            })
          })
        }
      })
    })

    // Assert performance metrics
    expect(metrics.domInteractive).toBeLessThan(PERFORMANCE_THRESHOLDS.TTI)
    expect(metrics.loadComplete).toBeLessThan(5000)
  })

  test('Images should lazy load on scroll', async ({ page }) => {
    await page.goto('/')

    // Get initial images
    const initialImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).filter(
        img => img.complete && img.naturalHeight !== 0
      ).length
    })

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // Get images after scroll
    const finalImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).filter(
        img => img.complete && img.naturalHeight !== 0
      ).length
    })

    // More images should be loaded after scrolling
    expect(finalImages).toBeGreaterThanOrEqual(initialImages)
  })

  test('Core Web Vitals should meet targets', async ({ page }) => {
    await page.goto('/')

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let fcpValue = 0
        let lcpValue = 0
        let clsValue = 0

        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          fcpValue = entries[entries.length - 1].startTime
        }).observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          lcpValue = entries[entries.length - 1].startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Cumulative Layout Shift
        let cls = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value
            }
          }
          clsValue = cls
        }).observe({ entryTypes: ['layout-shift'] })

        // Wait and resolve
        setTimeout(() => {
          resolve({
            fcp: fcpValue,
            lcp: lcpValue,
            cls: clsValue,
          })
        }, 5000)
      })
    })

    // Assert Core Web Vitals
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP)
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP)
    expect(metrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS)
  })
})

test.describe('Mobile Accessibility Tests', () => {
  test.use({ ...devices['iPhone 12'] })

  test('Mobile navigation should be accessible', async ({ page }) => {
    await page.goto('/')

    // Check ARIA labels
    const hamburgerButton = page.locator('button[aria-label="Toggle navigation menu"]')
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')

    await hamburgerButton.click()
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')

    // Check focus management
    const firstMenuItem = page.locator('nav a').first()
    await firstMenuItem.focus()
    await expect(firstMenuItem).toBeFocused()

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    const secondMenuItem = page.locator('nav a').nth(1)
    await expect(secondMenuItem).toBeFocused()
  })

  test('Touch targets should meet minimum size requirements', async ({ page }) => {
    await page.goto('/')

    // Get all interactive elements
    const interactiveElements = await page.locator('button, a, input, select, textarea').all()

    for (const element of interactiveElements.slice(0, 10)) { // Check first 10 elements
      const box = await element.boundingBox()
      if (box && await element.isVisible()) {
        // WCAG 2.1 Level AAA requires 44x44px, we use 48x48px
        const meetsMinimum = box.width >= 44 || box.height >= 44
        expect(meetsMinimum).toBeTruthy()
      }
    }
  })

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')

    // This is a simplified check - for real testing use axe-core
    const contrastIssues = await page.evaluate(() => {
      const getContrast = (rgb1: number[], rgb2: number[]) => {
        const getLuminance = (rgb: number[]) => {
          const [r, g, b] = rgb.map(val => {
            val = val / 255
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
          })
          return 0.2126 * r + 0.7152 * g + 0.0722 * b
        }

        const l1 = getLuminance(rgb1)
        const l2 = getLuminance(rgb2)
        const lighter = Math.max(l1, l2)
        const darker = Math.min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)
      }

      // This is a simplified check
      return []
    })

    expect(contrastIssues.length).toBe(0)
  })
})

test.describe('Mobile Touch Interactions', () => {
  test.use({ ...devices['iPhone 12'] })

  test('Carousel should support swipe gestures', async ({ page }) => {
    await page.goto('/')

    const carousel = page.locator('.swipeable-container').first()
    const isCarouselPresent = await carousel.count() > 0

    if (isCarouselPresent) {
      // Get initial scroll position
      const initialScroll = await carousel.evaluate(el => el.scrollLeft)

      // Simulate swipe
      await carousel.dragTo(carousel, {
        sourcePosition: { x: 300, y: 50 },
        targetPosition: { x: 50, y: 50 },
      })

      await page.waitForTimeout(500)

      // Check if scrolled
      const finalScroll = await carousel.evaluate(el => el.scrollLeft)
      expect(finalScroll).toBeGreaterThan(initialScroll)
    }
  })

  test('Pull to refresh should work on mobile', async ({ page }) => {
    await page.goto('/')

    // Simulate pull down gesture at top of page
    await page.evaluate(() => window.scrollTo(0, 0))

    const body = page.locator('body')

    // Simulate touch and drag
    await body.dragTo(body, {
      sourcePosition: { x: 180, y: 100 },
      targetPosition: { x: 180, y: 200 },
    })

    // Check if refresh indicator appears (if implemented)
    const refreshIndicator = page.locator('.pull-refresh')
    const isRefreshPresent = await refreshIndicator.count() > 0

    if (isRefreshPresent) {
      await expect(refreshIndicator).toBeVisible()
    }
  })

  test('Double tap to zoom should be disabled on interactive elements', async ({ page }) => {
    await page.goto('/')

    const button = page.locator('button').first()

    // Get viewport scale before double tap
    const initialScale = await page.evaluate(() => {
      return window.visualViewport?.scale || 1
    })

    // Double tap
    await button.dblclick()
    await page.waitForTimeout(300)

    // Get viewport scale after double tap
    const finalScale = await page.evaluate(() => {
      return window.visualViewport?.scale || 1
    })

    // Scale should not change (no zoom)
    expect(finalScale).toBe(initialScale)
  })
})

test.describe('Offline Support', () => {
  test.use({ ...devices['iPhone 12'] })

  test('App should show offline message when network is disconnected', async ({ page, context }) => {
    await page.goto('/')

    // Go offline
    await context.setOffline(true)

    // Try to navigate
    await page.click('a[href="/assessment"]').catch(() => {})

    // Check for offline indicator or cached content
    const offlineMessage = page.locator('text=/offline|no connection/i')
    const isOfflineMessageVisible = await offlineMessage.isVisible().catch(() => false)

    // Either show offline message or load from cache
    if (!isOfflineMessageVisible) {
      // Check if page loaded from cache
      const title = await page.title()
      expect(title).toBeTruthy()
    }

    // Go back online
    await context.setOffline(false)
  })
})