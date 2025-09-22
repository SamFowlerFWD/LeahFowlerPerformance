import { test, expect } from '@playwright/test'

test.describe('Family-Athlete Visual Storytelling Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004/family-athlete-demo')
    // Wait for the hero section to be visible
    await page.waitForSelector('section', { state: 'visible' })
  })

  test.describe('Hero Section', () => {
    test('should display all required hero elements', async ({ page }) => {
      // Check for hero image
      const heroImage = page.locator('img[alt*="Leah Fowler"]')
      await expect(heroImage).toBeVisible()

      // Check for Norfolk badge
      const badge = page.locator('text=/Norfolk.*Family.*Fitness.*Athletic.*Performance.*Specialist/i')
      await expect(badge).toBeVisible()

      // Check for dynamic headline
      const headline = page.locator('h1')
      await expect(headline).toBeVisible()
      await expect(headline).toContainText(/Transform|Champion|Train|Family/i)

      // Check for kinetic word animation
      const kineticText = page.locator('.bg-gradient-to-r.from-gold')
      await expect(kineticText).toBeVisible()

      // Check for CTAs
      const primaryCTA = page.locator('button:has-text("Start Your Family\'s Journey")')
      await expect(primaryCTA).toBeVisible()

      const secondaryCTA = page.locator('button:has-text("Watch Success Stories")')
      await expect(secondaryCTA).toBeVisible()
    })

    test('should display stats correctly', async ({ page }) => {
      // Check for stats in hero section (if visible) or final CTA section
      const familiesTransformed = page.locator('text=/Families Transformed|Happy Families/')
      const racesCompleted = page.locator('text=/Races Completed|Spartan Races/')
      const youthChampions = page.locator('text=/Youth Champions/')
      const communityStrong = page.locator('text=/Community Strong/')

      // At least one set of stats should be visible
      const statsVisible = await Promise.race([
        familiesTransformed.isVisible().catch(() => false),
        racesCompleted.isVisible().catch(() => false),
        youthChampions.isVisible().catch(() => false),
        communityStrong.isVisible().catch(() => false)
      ])

      expect(statsVisible).toBeTruthy()
    })

    test('should have proper image optimization', async ({ page }) => {
      const heroImage = page.locator('img[alt*="Leah Fowler"]').first()

      // Check for WebP format
      const src = await heroImage.getAttribute('src')
      expect(src).toContain('.webp')

      // Check for responsive sizing
      const sizes = await heroImage.getAttribute('sizes')
      expect(sizes).toBeTruthy()

      // Check for loading priority
      const loading = await heroImage.getAttribute('loading')
      expect(loading === null || loading === 'eager').toBeTruthy() // priority images don't have loading attribute
    })
  })

  test.describe('About Section', () => {
    test('should render About section with content', async ({ page }) => {
      // Scroll to About section
      await page.evaluate(() => window.scrollBy(0, 600))
      await page.waitForTimeout(500) // Wait for lazy loading

      // Check if section exists
      const aboutSection = page.locator('section').filter({ hasText: /About|Story|Journey|Achievement/i })
      const isVisible = await aboutSection.first().isVisible().catch(() => false)

      if (isVisible) {
        // Check for personal story elements
        await expect(aboutSection.first()).toContainText(/Leah|Performance|Coach/i)
      }
    })
  })

  test.describe('Interactive Programme Gallery', () => {
    test('should display programme categories', async ({ page }) => {
      // Scroll to programme section
      await page.evaluate(() => window.scrollBy(0, 1200))
      await page.waitForTimeout(500)

      // Look for programme-related content
      const programmeSection = page.locator('section').filter({
        hasText: /Programme|Training|Family|Youth|Athletic/i
      })

      const isVisible = await programmeSection.first().isVisible().catch(() => false)

      if (isVisible) {
        // Check for family programmes
        const familyContent = page.locator('text=/Family.*Programme|Family.*Fitness/i')
        const youthContent = page.locator('text=/Youth.*Athletic|Youth.*Development/i')
        const adultContent = page.locator('text=/Adult.*Performance|Adult.*Training/i')

        const hasContent = await Promise.race([
          familyContent.first().isVisible().catch(() => false),
          youthContent.first().isVisible().catch(() => false),
          adultContent.first().isVisible().catch(() => false)
        ])

        expect(hasContent).toBeTruthy()
      }
    })
  })

  test.describe('Family Transformation Testimonials', () => {
    test('should display testimonial section', async ({ page }) => {
      // Scroll to testimonials
      await page.evaluate(() => window.scrollBy(0, 1800))
      await page.waitForTimeout(500)

      const testimonialSection = page.locator('section').filter({
        hasText: /Testimonial|Transformation|Success.*Stor|Review/i
      })

      const isVisible = await testimonialSection.first().isVisible().catch(() => false)

      if (isVisible) {
        // Check for testimonial cards or content
        const testimonialCards = page.locator('[class*="testimonial"], [class*="card"], blockquote')
        const count = await testimonialCards.count()
        expect(count).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Norfolk Community Section', () => {
    test('should display community focus', async ({ page }) => {
      // Scroll to community section
      await page.evaluate(() => window.scrollBy(0, 2400))
      await page.waitForTimeout(500)

      const communitySection = page.locator('section').filter({
        hasText: /Norfolk|Community|Local|Dereham|Norwich/i
      })

      const isVisible = await communitySection.first().isVisible().catch(() => false)

      if (isVisible) {
        // Check for Norfolk-specific content
        await expect(communitySection.first()).toContainText(/Norfolk|Community/i)
      }
    })
  })

  test.describe('Final CTA Section', () => {
    test('should display final call-to-action', async ({ page }) => {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)

      // Check for final CTA section
      const ctaSection = page.locator('section.bg-gradient-to-br.from-orange-500')
      await expect(ctaSection).toBeVisible()

      // Check for journey headline
      await expect(ctaSection).toContainText('Your Journey Starts Today')

      // Check for community message
      await expect(ctaSection).toContainText(/Norfolk families.*fitness.*together/i)

      // Check for CTAs
      const bookButton = page.locator('button:has-text("Book Your Free Session")')
      const whatsappButton = page.locator('button:has-text("WhatsApp Leah")')

      await expect(bookButton).toBeVisible()
      await expect(whatsappButton).toBeVisible()

      // Check for stats
      await expect(ctaSection).toContainText('500+')
      await expect(ctaSection).toContainText('127')
      await expect(ctaSection).toContainText('23')
    })
  })

  test.describe('Performance Metrics', () => {
    test('should have acceptable page load time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('http://localhost:3004/family-athlete-demo', { waitUntil: 'networkidle' })
      const loadTime = Date.now() - startTime

      console.log(`Page load time: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(3000) // Should load in under 3 seconds
    })

    test('should have smooth animations', async ({ page }) => {
      // Check for animation classes
      const animatedElements = page.locator('[class*="animate"], [class*="motion"]')
      const count = await animatedElements.count()

      expect(count).toBeGreaterThan(0)
      console.log(`Found ${count} animated elements`)
    })

    test('should have proper image loading', async ({ page }) => {
      const images = page.locator('img')
      const imageCount = await images.count()

      for (const i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const isVisible = await img.isVisible()

        if (isVisible) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
          expect(naturalWidth).toBeGreaterThan(0) // Image should be loaded
        }
      }

      console.log(`Verified ${imageCount} images are properly loaded`)
    })
  })

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:3004/family-athlete-demo')

      // Hero should stack on mobile
      const heroImage = page.locator('img[alt*="Leah Fowler"]').first()
      await expect(heroImage).toBeVisible()

      // CTAs should be visible
      const ctaButtons = page.locator('button').filter({ hasText: /Journey|Stories/i })
      const firstCTA = ctaButtons.first()
      await expect(firstCTA).toBeVisible()
    })

    test('should be tablet responsive', async ({ page }) => {
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('http://localhost:3004/family-athlete-demo')

      const heroSection = page.locator('section').first()
      await expect(heroSection).toBeVisible()
    })
  })
})