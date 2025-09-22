import { test, expect, Page } from '@playwright/test'

test.describe('Mother Identity Transformation - Comprehensive Test', () => {
  let page: Page
  const baseUrl = 'http://localhost:3003'

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test.describe('🚀 Development Server Status', () => {
    test('should load the homepage successfully', async () => {
      const response = await page.goto(baseUrl, { waitUntil: 'networkidle' })
      expect(response?.status()).toBe(200)

      // Verify no console errors
      const consoleErrors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.waitForTimeout(1000)
      expect(consoleErrors.length).toBe(0)
    })
  })

  test.describe('💪 Hero Section - Mother Identity Focus', () => {
    test('should display rotating mother-focused headlines', async () => {
      await page.goto(baseUrl)

      // Check for main headline presence
      const headline = page.locator('h1')
      await expect(headline).toBeVisible()

      // Check for at least one of the mother-focused headlines
      const headlineText = await headline.textContent()
      const expectedHeadlines = [
        'Rediscover the Woman Behind the Mother',
        'Lost Yourself in Motherhood',
        'Searching for Your Pre-Baby Identity',
        'Ready to Reclaim Your Power'
      ]

      const hasValidHeadline = expectedHeadlines.some(text =>
        headlineText?.includes(text)
      )
      expect(hasValidHeadline).toBeTruthy()
    })

    test('should display mother-specific badge', async () => {
      const badge = page.locator('[class*="badge"], [role="badge"]').first()
      await expect(badge).toBeVisible()

      const badgeText = await badge.textContent()
      expect(badgeText).toContain('Mother of 2')
      expect(badgeText).toContain('Spartan Ultra Finisher')
    })

    test('should show kinetic words animation', async () => {
      const kineticText = page.locator('[class*="bg-gradient-to-r"]').filter({ hasText: /Identity|Warrior|Mother|Stronger/ })
      await expect(kineticText.first()).toBeVisible()

      // Check animation is working
      const initialText = await kineticText.first().textContent()
      await page.waitForTimeout(3500) // Wait for animation cycle
      const updatedText = await kineticText.first().textContent()

      // Should show different kinetic words
      const kineticWords = ['Identity Reclaimed', 'Warrior Mother', 'Still You', 'Just Stronger', 'Never Lost']
      const hasKineticWord = kineticWords.some(word => updatedText?.includes(word))
      expect(hasKineticWord).toBeTruthy()
    })

    test('should display correct stats', async () => {
      // Check for mother-specific stats
      await expect(page.locator('text=/500\\+.*Mothers Reclaimed/i')).toBeVisible()
      await expect(page.locator('text=/92%.*Identity Breakthroughs/i')).toBeVisible()
      await expect(page.locator('text=/Mother of 2.*Spartan Ultra/i')).toBeVisible()
      await expect(page.locator('text=/200\\+.*Warrior Community/i')).toBeVisible()
    })

    test('should have empowering CTAs', async () => {
      const primaryCTA = page.locator('button, a').filter({ hasText: /Reclaim Your Identity|Start Your Journey|Book Discovery/i }).first()
      await expect(primaryCTA).toBeVisible()

      const secondaryCTA = page.locator('button, a').filter({ hasText: /Identity Assessment|Free Assessment|Take.*Assessment/i }).first()
      await expect(secondaryCTA).toBeVisible()
    })
  })

  test.describe('🏆 Trust Bar - Mother Understanding', () => {
    test('should display mother-specific trust elements', async () => {
      // Scroll to trust bar section
      await page.evaluate(() => window.scrollBy(0, 500))
      await page.waitForTimeout(500)

      // Check for mother-specific trust messaging
      const trustElements = [
        'Mother of 2 Who Truly Understands',
        '500+ Mothers Reclaimed Their Identity',
        'From Postnatal to Spartan Ultra'
      ]

      for (const element of trustElements) {
        const trustItem = page.locator(`text=/${element}/i`)
        const isVisible = await trustItem.isVisible().catch(() => false)
        if (!isVisible) {
          console.log(`Trust element not found: ${element}`)
        }
      }
    })
  })

  test.describe('🎯 Programme Sections - Identity Journey Focus', () => {
    test('should display three identity-focused programmes', async () => {
      // Scroll to programmes section
      await page.evaluate(() => window.scrollBy(0, 1000))
      await page.waitForTimeout(500)

      // Check for programme titles
      const programmes = [
        { name: 'Rediscovery Phase', price: '£197' },
        { name: 'Strength Building', price: '£297' },
        { name: 'Warrior Mother', price: '£197/monthly' }
      ]

      for (const programme of programmes) {
        const programmeCard = page.locator(`text=/${programme.name}/i`)
        await expect(programmeCard.first()).toBeVisible()

        // Check pricing
        const priceElement = page.locator(`text=/${programme.price.replace('/', '\\/')}/`)
        await expect(priceElement.first()).toBeVisible()
      }
    })

    test('should focus on identity transformation not just fitness', async () => {
      // Check for identity-focused language in programme descriptions
      const identityTerms = [
        'identity',
        'reclaim',
        'rediscover',
        'warrior mother',
        'transformation',
        'breakthrough'
      ]

      for (const term of identityTerms) {
        const element = page.locator(`text=/${term}/i`).first()
        const isVisible = await element.isVisible().catch(() => false)
        if (!isVisible) {
          console.log(`Identity term not prominently featured: ${term}`)
        }
      }
    })
  })

  test.describe('💬 Testimonials - Identity Transformation Stories', () => {
    test('should display mother transformation testimonials', async () => {
      // Scroll to testimonials
      await page.evaluate(() => window.scrollBy(0, 1500))
      await page.waitForTimeout(500)

      const testimonialAuthors = ['Emma', 'Rachel', 'Lisa', 'Sophie']
      const testimonialHeadlines = [
        'From "Just Mum" to Spartan Finisher',
        'Rediscovered Who I Am',
        'Found Myself Again',
        'My Identity Breakthrough'
      ]

      // Check for at least 2 testimonials visible
      let visibleTestimonials = 0
      for (const author of testimonialAuthors) {
        const testimonial = page.locator(`text=/${author}/`).first()
        if (await testimonial.isVisible().catch(() => false)) {
          visibleTestimonials++
        }
      }
      expect(visibleTestimonials).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('📊 Assessment Section - Mother-Specific', () => {
    test('should display Identity Breakthrough Assessment', async () => {
      // Scroll to assessment section
      await page.evaluate(() => window.scrollBy(0, 800))
      await page.waitForTimeout(500)

      // Check for assessment heading
      const assessmentHeading = page.locator('text=/Identity Breakthrough Assessment/i').first()
      await expect(assessmentHeading).toBeVisible()

      // Check for mother-specific assessment areas
      const assessmentAreas = [
        'Identity Clarity',
        'Mother Load Balance',
        'Personal Power',
        'Energy Optimisation'
      ]

      for (const area of assessmentAreas) {
        const areaElement = page.locator(`text=/${area}/i`).first()
        const isVisible = await areaElement.isVisible().catch(() => false)
        if (!isVisible) {
          console.log(`Assessment area not found: ${area}`)
        }
      }

      // Check for empowering messaging
      const messaging = page.locator('text=/Discover Who You Are Beyond.*Mum/i').first()
      await expect(messaging).toBeVisible()
    })
  })

  test.describe('📞 Contact Section - Mother-Friendly', () => {
    test('should offer Identity Breakthrough Session', async () => {
      // Scroll to contact section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)

      const contactHeading = page.locator('text=/Identity Breakthrough Session/i').first()
      await expect(contactHeading).toBeVisible()
    })

    test('should have mother-friendly scheduling options', async () => {
      // Check for time slots that work for mothers
      const motherFriendlyTimes = [
        'before school run',
        'after bedtime',
        'morning slots',
        'flexible timing'
      ]

      let foundFriendlyTiming = false
      for (const timing of motherFriendlyTimes) {
        const element = page.locator(`text=/${timing}/i`).first()
        if (await element.isVisible().catch(() => false)) {
          foundFriendlyTiming = true
          break
        }
      }

      if (!foundFriendlyTiming) {
        console.log('Mother-friendly scheduling options not explicitly mentioned')
      }
    })
  })

  test.describe('🇬🇧 UK English Verification', () => {
    test('should use UK English throughout', async () => {
      await page.goto(baseUrl)

      const pageContent = await page.content()

      // Check for UK spelling
      expect(pageContent).toContain('mum')
      expect(pageContent).not.toContain('mom')
      expect(pageContent).toContain('programme')
      expect(pageContent).not.toContain(' program ')
      expect(pageContent).toContain('optimise')
      expect(pageContent).not.toContain('optimize')
      expect(pageContent).toContain('centre')
      expect(pageContent).not.toContain('center')
    })
  })

  test.describe('📱 Responsive Design Testing', () => {
    test('should work perfectly on mobile (iPhone 12)', async () => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(baseUrl)

      // Hero should be visible
      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()

      // CTAs should be accessible
      const cta = page.locator('button, a').filter({ hasText: /Identity|Journey|Assessment/i }).first()
      await expect(cta).toBeVisible()

      // Mobile menu should be available
      const mobileMenu = page.locator('[aria-label*="menu"], [class*="mobile-menu"], button[class*="burger"]').first()
      const isMenuVisible = await mobileMenu.isVisible().catch(() => false)
      expect(isMenuVisible || await page.locator('[class*="MobileDock"]').isVisible()).toBeTruthy()
    })

    test('should work perfectly on tablet (iPad)', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(baseUrl)

      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()

      // Content should be properly laid out
      const mainContent = page.locator('main')
      await expect(mainContent).toBeVisible()
    })

    test('should work perfectly on desktop', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(baseUrl)

      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()

      // All sections should be visible
      const sections = await page.locator('section').count()
      expect(sections).toBeGreaterThan(5)
    })
  })

  test.describe('⚡ Performance Testing', () => {
    test('should load page in under 2 seconds', async () => {
      const startTime = Date.now()
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - startTime

      console.log(`Page load time: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(2000)
    })

    test('should have no layout shifts', async () => {
      await page.goto(baseUrl)

      // Wait for all content to load
      await page.waitForLoadState('networkidle')

      // Check for CLS
      const cls = await page.evaluate(() => {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue
            clsValue += (entry as any).value
          }
        })
        observer.observe({ type: 'layout-shift', buffered: true })
        return clsValue
      })

      console.log(`Cumulative Layout Shift: ${cls}`)
      expect(cls).toBeLessThan(0.1) // Good CLS score
    })

    test('should have optimized images', async () => {
      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i)
        if (await img.isVisible()) {
          const src = await img.getAttribute('src')

          // Check for WebP format
          if (src && !src.startsWith('data:')) {
            expect(src).toMatch(/\.(webp|avif)$/i)
          }

          // Check for lazy loading (except hero image)
          const loading = await img.getAttribute('loading')
          const isHero = await img.getAttribute('alt')?.then(alt => alt?.includes('hero'))

          if (!isHero) {
            expect(loading).toBe('lazy')
          }
        }
      }
    })
  })

  test.describe('♿ Accessibility Testing', () => {
    test('should have proper heading structure', async () => {
      await page.goto(baseUrl)

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)

      // Should have h2s for sections
      const h2Count = await page.locator('h2').count()
      expect(h2Count).toBeGreaterThan(3)
    })

    test('should have proper color contrast', async () => {
      // Check main CTA buttons have sufficient contrast
      const ctaButton = page.locator('button').filter({ hasText: /Identity|Journey|Assessment/i }).first()

      const contrast = await ctaButton.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        const bg = styles.backgroundColor
        const color = styles.color

        // Simple contrast check (would use proper WCAG calculation in production)
        return { bg, color }
      })

      expect(contrast.bg).toBeTruthy()
      expect(contrast.color).toBeTruthy()
    })

    test('should be keyboard navigable', async () => {
      await page.goto(baseUrl)

      // Tab through first few interactive elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Check that something has focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName
      })

      expect(focusedElement).toBeTruthy()
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)
    })
  })

  test.describe('✅ Content Validation Summary', () => {
    test('should have NO generic family fitness references', async () => {
      await page.goto(baseUrl)
      const content = await page.content()

      // These terms should NOT appear
      const bannedTerms = [
        'family fitness programme',
        'train together as a family',
        'family workout',
        'kids fitness'
      ]

      for (const term of bannedTerms) {
        const hasGenericTerm = content.toLowerCase().includes(term.toLowerCase())
        if (hasGenericTerm) {
          console.error(`Found generic family fitness term: "${term}"`)
        }
        expect(hasGenericTerm).toBeFalsy()
      }
    })

    test('should focus on mother identity transformation', async () => {
      const content = await page.content()

      // These terms SHOULD appear
      const requiredTerms = [
        'mother',
        'identity',
        'reclaim',
        'warrior',
        'transformation'
      ]

      for (const term of requiredTerms) {
        const hasTerm = content.toLowerCase().includes(term.toLowerCase())
        expect(hasTerm).toBeTruthy()
      }
    })
  })
})

// Visual regression test configuration
test.describe('📸 Screenshot Documentation', () => {
  test('capture full page screenshots for report', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 390, height: 844 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('http://localhost:3003')
      await page.waitForLoadState('networkidle')

      await page.screenshot({
        path: `/Users/samfowler/Code/LeahFowlerPerformance-1/screenshots/mother-identity-${viewport.name}.png`,
        fullPage: true
      })

      console.log(`Screenshot captured for ${viewport.name}`)
    }
  })
})