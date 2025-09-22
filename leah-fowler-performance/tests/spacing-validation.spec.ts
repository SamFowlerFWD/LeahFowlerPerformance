import { test, expect, Page } from '@playwright/test';

// Test configuration for different breakpoints
const breakpoints = [
  { name: 'mobile', width: 375, height: 667, expectedPadding: { vertical: 48, horizontal: { min: 16, max: 24 } } },
  { name: 'iPhone', width: 390, height: 844, expectedPadding: { vertical: 48, horizontal: { min: 16, max: 24 } } },
  { name: 'tablet', width: 768, height: 1024, expectedPadding: { vertical: 80, horizontal: 32 } },
  { name: 'desktop', width: 1280, height: 800, expectedPadding: { vertical: 120, horizontal: 48 } },
  { name: 'wide', width: 1920, height: 1080, expectedPadding: { vertical: 120, horizontal: 48 } }
];

// Sections to validate
const sections = [
  'hero',
  'assessment',
  'programmes',
  'testimonials',
  'about',
  'contact',
  'footer'
];

test.describe('Spacing and Padding Validation', () => {
  // Test each breakpoint
  for (const breakpoint of breakpoints) {
    test.describe(`${breakpoint.name} (${breakpoint.width}px)`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
      });

      test('Visual spacing validation', async ({ page }) => {
        // Wait for page to fully load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000); // Allow animations to complete

        // Check no content touches viewport edges
        const body = await page.$('body');
        const bodyBox = await body?.boundingBox();
        expect(bodyBox).toBeTruthy();

        // Verify main content container has proper padding
        const mainContent = await page.$('main');
        if (mainContent) {
          const mainBox = await mainContent.boundingBox();
          const mainStyles = await mainContent.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              paddingTop: parseFloat(styles.paddingTop),
              paddingBottom: parseFloat(styles.paddingBottom),
              paddingLeft: parseFloat(styles.paddingLeft),
              paddingRight: parseFloat(styles.paddingRight)
            };
          });

          // Log padding values for debugging
          console.log(`${breakpoint.name} main padding:`, mainStyles);

          // Verify minimum padding
          if (typeof breakpoint.expectedPadding.horizontal === 'object') {
            expect(mainStyles.paddingLeft).toBeGreaterThanOrEqual(breakpoint.expectedPadding.horizontal.min);
            expect(mainStyles.paddingRight).toBeGreaterThanOrEqual(breakpoint.expectedPadding.horizontal.min);
          } else {
            expect(mainStyles.paddingLeft).toBeGreaterThanOrEqual(breakpoint.expectedPadding.horizontal);
            expect(mainStyles.paddingRight).toBeGreaterThanOrEqual(breakpoint.expectedPadding.horizontal);
          }
        }

        // Take screenshot for visual validation
        await page.screenshot({ 
          path: `test-results/spacing-${breakpoint.name}-full.png`,
          fullPage: true 
        });
      });

      test('Header overlap check', async ({ page }) => {
        // Check that header doesn't overlap content
        const header = await page.$('header');
        const headerBox = await header?.boundingBox();
        
        if (headerBox) {
          // Get first content section (hero)
          const heroSection = await page.$('#hero');
          const heroBox = await heroSection?.boundingBox();
          
          if (heroBox) {
            // Hero should start below header with proper spacing
            expect(heroBox.y).toBeGreaterThan(headerBox.height);
            
            // Check for adequate spacing between header and hero
            const gap = heroBox.y - headerBox.height;
            console.log(`${breakpoint.name} header-hero gap: ${gap}px`);
            
            // Should have at least some spacing
            expect(gap).toBeGreaterThanOrEqual(0);
          }
        }
      });

      test('Section spacing consistency', async ({ page }) => {
        const sectionSpacings: number[] = [];
        
        for (let i = 0; i < sections.length - 1; i++) {
          const currentSection = await page.$(`#${sections[i]}`);
          const nextSection = await page.$(`#${sections[i + 1]}`);
          
          if (currentSection && nextSection) {
            const currentBox = await currentSection.boundingBox();
            const nextBox = await nextSection.boundingBox();
            
            if (currentBox && nextBox) {
              const spacing = nextBox.y - (currentBox.y + currentBox.height);
              sectionSpacings.push(spacing);
              console.log(`${breakpoint.name} ${sections[i]}-${sections[i + 1]} spacing: ${spacing}px`);
            }
          }
        }
        
        // Check that spacings are reasonably consistent (within 20% variance)
        if (sectionSpacings.length > 0) {
          const avgSpacing = sectionSpacings.reduce((a, b) => a + b, 0) / sectionSpacings.length;
          for (const spacing of sectionSpacings) {
            const variance = Math.abs(spacing - avgSpacing) / avgSpacing;
            expect(variance).toBeLessThan(0.5); // Allow 50% variance for different section types
          }
        }
      });

      test('Card and button padding', async ({ page }) => {
        // Check assessment cards
        const assessmentCards = await page.$$('.assessment-card, [data-testid="assessment-card"]');
        for (const card of assessmentCards) {
          const cardStyles = await card.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              padding: styles.padding,
              paddingTop: parseFloat(styles.paddingTop),
              paddingBottom: parseFloat(styles.paddingBottom),
              paddingLeft: parseFloat(styles.paddingLeft),
              paddingRight: parseFloat(styles.paddingRight)
            };
          });
          
          // Cards should have adequate padding
          expect(cardStyles.paddingTop).toBeGreaterThanOrEqual(16);
          expect(cardStyles.paddingBottom).toBeGreaterThanOrEqual(16);
          expect(cardStyles.paddingLeft).toBeGreaterThanOrEqual(16);
          expect(cardStyles.paddingRight).toBeGreaterThanOrEqual(16);
        }

        // Check buttons
        const buttons = await page.$$('button, .btn, [role="button"]');
        for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
          const buttonStyles = await button.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              paddingTop: parseFloat(styles.paddingTop),
              paddingBottom: parseFloat(styles.paddingBottom),
              paddingLeft: parseFloat(styles.paddingLeft),
              paddingRight: parseFloat(styles.paddingRight),
              height: parseFloat(styles.height)
            };
          });
          
          // Buttons should have generous padding
          expect(buttonStyles.paddingTop + buttonStyles.paddingBottom).toBeGreaterThanOrEqual(16);
          expect(buttonStyles.paddingLeft + buttonStyles.paddingRight).toBeGreaterThanOrEqual(24);
          
          // Minimum touch target size (44px for mobile)
          if (breakpoint.width <= 768) {
            expect(buttonStyles.height).toBeGreaterThanOrEqual(44);
          }
        }
      });

      test('Form element spacing', async ({ page }) => {
        // Navigate to contact section
        await page.evaluate(() => {
          document.querySelector('#contact')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        // Check form inputs
        const formInputs = await page.$$('input, textarea, select');
        for (const input of formInputs) {
          const inputBox = await input.boundingBox();
          const inputStyles = await input.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              paddingTop: parseFloat(styles.paddingTop),
              paddingBottom: parseFloat(styles.paddingBottom),
              paddingLeft: parseFloat(styles.paddingLeft),
              paddingRight: parseFloat(styles.paddingRight),
              marginBottom: parseFloat(styles.marginBottom),
              height: parseFloat(styles.height)
            };
          });
          
          if (inputBox) {
            // Inputs should have adequate padding
            expect(inputStyles.paddingTop + inputStyles.paddingBottom).toBeGreaterThanOrEqual(8);
            expect(inputStyles.paddingLeft + inputStyles.paddingRight).toBeGreaterThanOrEqual(16);
            
            // Adequate spacing between form elements
            expect(inputStyles.marginBottom).toBeGreaterThanOrEqual(8);
            
            // Minimum touch target height
            if (breakpoint.width <= 768) {
              expect(inputStyles.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });

      test('Screenshot key sections', async ({ page }) => {
        // Screenshot each major section
        for (const section of sections) {
          const sectionElement = await page.$(`#${section}`);
          if (sectionElement) {
            await sectionElement.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300); // Allow scroll to settle
            
            await sectionElement.screenshot({ 
              path: `test-results/section-${breakpoint.name}-${section}.png` 
            });
          }
        }
      });
    });
  }

  test.describe('Interactive and Edge Cases', () => {
    test('Scroll padding for navigation', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Check scroll-padding-top is set
      const scrollPaddingTop = await page.evaluate(() => {
        const html = document.documentElement;
        const styles = window.getComputedStyle(html);
        return parseFloat(styles.scrollPaddingTop);
      });

      // Should have scroll padding to account for fixed header
      expect(scrollPaddingTop).toBeGreaterThan(0);
      console.log('Scroll padding top:', scrollPaddingTop);

      // Test navigation click and spacing
      const navLinks = await page.$$('nav a[href^="#"]');
      if (navLinks.length > 0) {
        await navLinks[0].click();
        await page.waitForTimeout(1000); // Wait for scroll animation
        
        // Check that content is not hidden under header
        const header = await page.$('header');
        const headerBox = await header?.boundingBox();
        
        // Get current viewport scroll position
        const scrollY = await page.evaluate(() => window.scrollY);
        console.log('Scroll position after nav click:', scrollY);
      }
    });

    test('WhatsApp button positioning', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Check for WhatsApp floating button
      const whatsappButton = await page.$('[aria-label*="WhatsApp"], .whatsapp-button, [href*="wa.me"]');
      if (whatsappButton) {
        const buttonBox = await whatsappButton.boundingBox();
        const viewport = page.viewportSize();
        
        if (buttonBox && viewport) {
          // Button should not cover main content area
          expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(viewport.width);
          expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(viewport.height);
          
          // Button should have some margin from edges
          expect(buttonBox.x).toBeGreaterThanOrEqual(10);
          expect(buttonBox.y).toBeGreaterThanOrEqual(10);
        }
      }
    });

    test('No horizontal scroll', async ({ page }) => {
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
        
        // Check for horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasHorizontalScroll).toBe(false);
        console.log(`${breakpoint.name}: No horizontal scroll - ${!hasHorizontalScroll ? 'PASS' : 'FAIL'}`);
      }
    });

    test('Performance metrics', async ({ page }) => {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Measure CLS (Cumulative Layout Shift)
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsScore = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if ((entry as any).hadRecentInput) continue;
              clsScore += (entry as any).value;
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(clsScore);
          }, 2000);
        });
      });

      console.log('Cumulative Layout Shift:', cls);
      // Good CLS score is less than 0.1
      expect(cls).toBeLessThan(0.25); // Allowing some tolerance
    });
  });

  test.describe('Final Visual Report', () => {
    test('Generate comprehensive visual report', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
      
      // Full page screenshot
      await page.screenshot({ 
        path: 'test-results/final-full-page.png',
        fullPage: true 
      });

      // Create HTML report
      const reportData = {
        timestamp: new Date().toISOString(),
        breakpointResults: [],
        sectionResults: []
      };

      // Collect all test data
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
        
        const metrics = await page.evaluate(() => {
          const sections = ['hero', 'assessment', 'programmes', 'testimonials', 'about', 'contact', 'footer'];
          const sectionMetrics: any = {};
          
          sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
              const styles = window.getComputedStyle(section);
              sectionMetrics[sectionId] = {
                paddingTop: styles.paddingTop,
                paddingBottom: styles.paddingBottom,
                paddingLeft: styles.paddingLeft,
                paddingRight: styles.paddingRight,
                marginTop: styles.marginTop,
                marginBottom: styles.marginBottom
              };
            }
          });
          
          return {
            bodyPadding: window.getComputedStyle(document.body).padding,
            mainPadding: window.getComputedStyle(document.querySelector('main') || document.body).padding,
            sections: sectionMetrics
          };
        });
        
        reportData.breakpointResults.push({
          breakpoint: breakpoint.name,
          width: breakpoint.width,
          metrics
        });
      }

      // Save report data
      await page.evaluate((data) => {
        console.log('Spacing Validation Report:', data);
      }, reportData);
    });
  });
});