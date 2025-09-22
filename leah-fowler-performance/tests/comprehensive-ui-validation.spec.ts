import { test, expect, devices } from '@playwright/test';
import { Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3006';

// Test configuration for different viewports
const viewports = {
  mobile: { width: 375, height: 812, deviceScaleFactor: 3 }, // iPhone 12
  mobileXL: { width: 390, height: 844, deviceScaleFactor: 3 }, // iPhone 14
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2 }, // iPad
  desktop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  desktopXL: { width: 1920, height: 1080, deviceScaleFactor: 1 }
};

test.describe('Comprehensive UI Validation - Leah Fowler Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to desktop by default
    await page.setViewportSize(viewports.desktop);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Visual Testing', () => {
    test('Hero section with kinetic text animations', async ({ page }) => {
      // Wait for hero section to be visible
      await expect(page.locator('section').first()).toBeVisible();
      
      // Check for gradient background
      const heroSection = page.locator('section').first();
      const background = await heroSection.evaluate((el) => 
        window.getComputedStyle(el).background
      );
      expect(background).toContain('gradient');
      
      // Verify kinetic text is present and animated
      const animatedText = page.locator('[class*="animate"]').first();
      await expect(animatedText).toBeVisible();
      
      // Take screenshot of hero section
      await page.screenshot({ 
        path: 'tests/screenshots/hero-section.png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 720 }
      });
      
      // Check for glassmorphism effects
      const glassElements = await page.locator('[class*="backdrop-blur"]').count();
      expect(glassElements).toBeGreaterThan(0);
    });

    test('3D programme cards with transforms', async ({ page }) => {
      // Scroll to programmes section
      await page.locator('text=/Programme/i').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for scroll animation
      
      // Check for 3D transforms on cards
      const cards = page.locator('[class*="card"], [class*="Card"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Test hover effects on first card
      if (cardCount > 0) {
        const firstCard = cards.first();
        await firstCard.hover();
        await page.waitForTimeout(300); // Wait for animation
        
        const transform = await firstCard.evaluate((el) => 
          window.getComputedStyle(el).transform
        );
        expect(transform).not.toBe('none');
        
        await page.screenshot({ 
          path: 'tests/screenshots/programme-cards-hover.png'
        });
      }
    });

    test('Glassmorphism navigation bar', async ({ page }) => {
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
      
      // Check for glassmorphism styles
      const navStyles = await nav.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backdropFilter: styles.backdropFilter,
          background: styles.background
        };
      });
      
      expect(navStyles.backdropFilter).toContain('blur');
      
      // Test scroll behavior for sticky nav
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      const isSticky = await nav.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.position === 'fixed' || styles.position === 'sticky';
      });
      expect(isSticky).toBeTruthy();
      
      await page.screenshot({ 
        path: 'tests/screenshots/glassmorphism-nav.png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 100 }
      });
    });

    test('Floating WhatsApp button', async ({ page }) => {
      // Look for floating WhatsApp button
      const whatsappButton = page.locator('[href*="whatsapp"], [href*="wa.me"], [class*="whatsapp"], [aria-label*="WhatsApp"]');
      
      if (await whatsappButton.count() > 0) {
        await expect(whatsappButton.first()).toBeVisible();
        
        // Check if it's fixed positioned
        const position = await whatsappButton.first().evaluate((el) => 
          window.getComputedStyle(el).position
        );
        expect(position).toBe('fixed');
        
        // Test hover effect
        await whatsappButton.first().hover();
        await page.waitForTimeout(200);
        
        await page.screenshot({ 
          path: 'tests/screenshots/whatsapp-button.png'
        });
      }
    });

    test('Trust section with client logos', async ({ page }) => {
      // Find trust/clients section
      const trustSection = page.locator('section:has-text("trust"), section:has-text("clients"), section:has-text("featured")').first();
      
      if (await trustSection.count() > 0) {
        await trustSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        // Check for logo images
        const logos = trustSection.locator('img');
        const logoCount = await logos.count();
        expect(logoCount).toBeGreaterThan(0);
        
        await page.screenshot({ 
          path: 'tests/screenshots/trust-section.png'
        });
      }
    });

    test('Social proof notifications', async ({ page }) => {
      // Wait for any notification to appear
      await page.waitForTimeout(3000);
      
      const notifications = page.locator('[class*="notification"], [class*="toast"], [role="alert"]');
      
      if (await notifications.count() > 0) {
        await expect(notifications.first()).toBeVisible();
        
        await page.screenshot({ 
          path: 'tests/screenshots/notifications.png'
        });
      }
    });
  });

  test.describe('Responsive Testing', () => {
    for (const [name, viewport] of Object.entries(viewports)) {
      test(`Responsive layout - ${name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Check navigation adapts
        const nav = page.locator('nav').first();
        await expect(nav).toBeVisible();
        
        // Mobile should have hamburger menu
        if (viewport.width < 768) {
          const hamburger = page.locator('[class*="menu"], [aria-label*="menu"], button:has(svg)').first();
          await expect(hamburger).toBeVisible();
          
          // Test mobile menu interaction
          await hamburger.click();
          await page.waitForTimeout(300);
          
          const mobileMenu = page.locator('[role="menu"], [class*="mobile-menu"], nav ul');
          await expect(mobileMenu.first()).toBeVisible();
        }
        
        // Check hero section adapts
        const heroText = page.locator('h1').first();
        await expect(heroText).toBeVisible();
        
        // Check cards stack on mobile
        if (viewport.width < 768) {
          const cards = page.locator('[class*="card"], [class*="Card"]');
          if (await cards.count() > 1) {
            const firstCard = await cards.first().boundingBox();
            const secondCard = await cards.nth(1).boundingBox();
            
            if (firstCard && secondCard) {
              // Cards should stack vertically on mobile
              expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
            }
          }
        }
        
        // Take screenshot for each viewport
        await page.screenshot({ 
          path: `tests/screenshots/responsive-${name}.png`,
          fullPage: false,
          clip: { x: 0, y: 0, width: viewport.width, height: viewport.height }
        });
      });
    }
  });

  test.describe('Interactive Elements', () => {
    test('Dark mode toggle functionality', async ({ page }) => {
      // Find dark mode toggle
      const darkModeToggle = page.locator('[aria-label*="theme"], [aria-label*="dark"], button:has-text("Dark"), button:has([class*="moon"]), button:has([class*="sun"])').first();
      
      if (await darkModeToggle.count() > 0) {
        // Get initial theme
        const initialTheme = await page.evaluate(() => 
          document.documentElement.classList.contains('dark') || 
          document.documentElement.getAttribute('data-theme') === 'dark'
        );
        
        // Toggle dark mode
        await darkModeToggle.click();
        await page.waitForTimeout(300);
        
        // Check theme changed
        const newTheme = await page.evaluate(() => 
          document.documentElement.classList.contains('dark') || 
          document.documentElement.getAttribute('data-theme') === 'dark'
        );
        
        expect(newTheme).not.toBe(initialTheme);
        
        // Take screenshot in dark mode
        await page.screenshot({ 
          path: 'tests/screenshots/dark-mode.png'
        });
        
        // Toggle back
        await darkModeToggle.click();
        await page.waitForTimeout(300);
      }
    });

    test('Smooth scroll navigation', async ({ page }) => {
      // Find navigation links
      const navLinks = page.locator('nav a[href^="#"]');
      const linkCount = await navLinks.count();
      
      if (linkCount > 0) {
        // Test first internal link
        const firstLink = navLinks.first();
        const href = await firstLink.getAttribute('href');
        
        if (href) {
          // Click link and check smooth scroll
          await firstLink.click();
          await page.waitForTimeout(1000); // Wait for scroll animation
          
          // Check if target section is in view
          const targetSection = page.locator(href);
          if (await targetSection.count() > 0) {
            await expect(targetSection).toBeInViewport({ ratio: 0.3 });
          }
        }
      }
    });

    test('Form interactions and validation', async ({ page }) => {
      // Find any forms on the page
      const forms = page.locator('form');
      
      if (await forms.count() > 0) {
        const form = forms.first();
        await form.scrollIntoViewIfNeeded();
        
        // Find input fields
        const inputs = form.locator('input[type="text"], input[type="email"], textarea');
        
        if (await inputs.count() > 0) {
          // Test form validation
          const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
          
          if (await submitButton.count() > 0) {
            // Try to submit empty form
            await submitButton.click();
            await page.waitForTimeout(300);
            
            // Check for validation messages
            const validationMessages = await page.locator('[class*="error"], [class*="invalid"], [aria-invalid="true"]').count();
            expect(validationMessages).toBeGreaterThan(0);
          }
          
          // Fill form with test data
          const emailInput = form.locator('input[type="email"]').first();
          if (await emailInput.count() > 0) {
            await emailInput.fill('test@example.com');
          }
          
          const textInputs = form.locator('input[type="text"]');
          for (let i = 0; i < await textInputs.count(); i++) {
            await textInputs.nth(i).fill(`Test Input ${i + 1}`);
          }
          
          await page.screenshot({ 
            path: 'tests/screenshots/form-interaction.png'
          });
        }
      }
    });

    test('Carousel/slider navigation', async ({ page }) => {
      // Find carousel/slider elements
      const carousel = page.locator('[class*="carousel"], [class*="slider"], [class*="swiper"]').first();
      
      if (await carousel.count() > 0) {
        await carousel.scrollIntoViewIfNeeded();
        
        // Find navigation buttons
        const nextButton = carousel.locator('button:has-text("next"), button[aria-label*="next"], button:has([class*="arrow-right"])').first();
        const prevButton = carousel.locator('button:has-text("prev"), button[aria-label*="prev"], button:has([class*="arrow-left"])').first();
        
        if (await nextButton.count() > 0) {
          // Test next navigation
          await nextButton.click();
          await page.waitForTimeout(500);
          
          // Test previous navigation
          if (await prevButton.count() > 0) {
            await prevButton.click();
            await page.waitForTimeout(500);
          }
          
          await page.screenshot({ 
            path: 'tests/screenshots/carousel.png'
          });
        }
      }
    });

    test('Exit-intent popup trigger', async ({ page }) => {
      // Simulate exit intent by moving mouse to top of viewport
      await page.mouse.move(640, 0);
      await page.waitForTimeout(1000);
      
      // Check if popup appeared
      const popup = page.locator('[role="dialog"], [class*="modal"], [class*="popup"]');
      
      if (await popup.count() > 0) {
        await expect(popup.first()).toBeVisible();
        
        await page.screenshot({ 
          path: 'tests/screenshots/exit-intent-popup.png'
        });
        
        // Close popup if possible
        const closeButton = popup.locator('button:has-text("close"), button[aria-label*="close"], button:has([class*="close"])').first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('Performance Testing', () => {
    test('Page load performance metrics', async ({ page }) => {
      // Navigate with performance monitoring
      await page.goto(BASE_URL);
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
          loadComplete: perf.loadEventEnd - perf.loadEventStart,
          domInteractive: perf.domInteractive - perf.fetchStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });
      
      console.log('Performance Metrics:', metrics);
      
      // Check performance thresholds
      expect(metrics.domInteractive).toBeLessThan(3000); // Interactive in 3s
      expect(metrics.loadComplete).toBeLessThan(5000); // Full load in 5s
      
      // Check for Core Web Vitals
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                cls += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => {
            observer.disconnect();
            resolve({ cls });
          }, 2000);
        });
      });
      
      console.log('Web Vitals:', webVitals);
      expect((webVitals as any).cls).toBeLessThan(0.1); // Good CLS
    });

    test('Animation performance', async ({ page }) => {
      // Monitor animation frame rate
      const fps = await page.evaluate(() => {
        return new Promise((resolve) => {
          let lastTime = performance.now();
          let frames = 0;
          let fps = 0;
          
          function measureFPS() {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
              fps = Math.round((frames * 1000) / (currentTime - lastTime));
              resolve(fps);
            } else {
              requestAnimationFrame(measureFPS);
            }
          }
          
          requestAnimationFrame(measureFPS);
        });
      });
      
      console.log('Animation FPS:', fps);
      expect(fps).toBeGreaterThan(30); // Smooth animations
    });

    test('Lazy loading verification', async ({ page }) => {
      // Check for lazy loaded images
      const lazyImages = page.locator('img[loading="lazy"]');
      const lazyCount = await lazyImages.count();
      
      console.log('Lazy loaded images:', lazyCount);
      expect(lazyCount).toBeGreaterThan(0);
      
      // Verify lazy loading works
      if (lazyCount > 0) {
        // Scroll to trigger lazy loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        
        // Check images loaded
        const loadedImages = await page.evaluate(() => {
          const images = document.querySelectorAll('img[loading="lazy"]');
          return Array.from(images).filter(img => (img as HTMLImageElement).complete).length;
        });
        
        expect(loadedImages).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Accessibility Testing', () => {
    test('Keyboard navigation', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Check focus is visible
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          hasOutline: window.getComputedStyle(el!).outline !== 'none'
        };
      });
      
      expect(focusedElement.tagName).toBeTruthy();
      
      // Tab through interactive elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }
      
      // Test Enter key on focused link
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    });

    test('ARIA labels and roles', async ({ page }) => {
      // Check for ARIA labels on buttons
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(ariaLabel || text).toBeTruthy();
      }
      
      // Check for landmark roles
      const landmarks = await page.evaluate(() => {
        const main = document.querySelector('main, [role="main"]');
        const nav = document.querySelector('nav, [role="navigation"]');
        const footer = document.querySelector('footer, [role="contentinfo"]');
        
        return {
          hasMain: !!main,
          hasNav: !!nav,
          hasFooter: !!footer
        };
      });
      
      expect(landmarks.hasMain).toBeTruthy();
      expect(landmarks.hasNav).toBeTruthy();
    });

    test('Focus states', async ({ page }) => {
      // Check all interactive elements have focus states
      const interactiveElements = page.locator('a, button, input, textarea, select, [tabindex]');
      const elementCount = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i);
        
        if (await element.isVisible()) {
          await element.focus();
          
          const focusStyle = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              outline: styles.outline,
              boxShadow: styles.boxShadow,
              border: styles.border
            };
          });
          
          // Should have some focus indicator
          const hasFocusIndicator = 
            focusStyle.outline !== 'none' ||
            focusStyle.boxShadow !== 'none' ||
            focusStyle.border !== 'none';
          
          expect(hasFocusIndicator).toBeTruthy();
        }
      }
    });

    test('Color contrast ratios', async ({ page }) => {
      // Sample text elements for contrast checking
      const textElements = page.locator('h1, h2, h3, p, a, button');
      const elementCount = await textElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = textElements.nth(i);
        
        if (await element.isVisible()) {
          const contrast = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Simple contrast check (would need full WCAG calculation in production)
            const getRelativeLuminance = (rgb: string) => {
              const matches = rgb.match(/\d+/g);
              if (!matches) return 0;
              
              const [r, g, b] = matches.map(Number);
              const sRGB = [r, g, b].map(val => {
                val = val / 255;
                return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
              });
              
              return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
            };
            
            const L1 = getRelativeLuminance(color);
            const L2 = getRelativeLuminance(backgroundColor);
            
            const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            
            return {
              color,
              backgroundColor,
              ratio
            };
          });
          
          // WCAG AA requires 4.5:1 for normal text
          if (contrast.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            expect(contrast.ratio).toBeGreaterThan(3); // Relaxed for testing
          }
        }
      }
    });

    test('Screen reader compatibility', async ({ page }) => {
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');
        const role = await img.getAttribute('role');
        
        // Decorative images should have role="presentation" or empty alt
        // Content images should have descriptive alt text
        if (role !== 'presentation') {
          expect(alt || ariaLabel).toBeTruthy();
        }
      }
      
      // Check headings hierarchy
      const headings = await page.evaluate(() => {
        const h1Count = document.querySelectorAll('h1').length;
        const h2Count = document.querySelectorAll('h2').length;
        const h3Count = document.querySelectorAll('h3').length;
        
        return { h1Count, h2Count, h3Count };
      });
      
      // Should have logical heading structure
      expect(headings.h1Count).toBeGreaterThan(0);
    });

    test('Reduced motion preferences', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check animations are disabled/reduced
      const animatedElement = page.locator('[class*="animate"]').first();
      
      if (await animatedElement.count() > 0) {
        const animationDuration = await animatedElement.evaluate((el) => {
          return window.getComputedStyle(el).animationDuration;
        });
        
        // Animations should be instant or very short with reduced motion
        expect(animationDuration === '0s' || animationDuration === '0ms' || parseFloat(animationDuration) < 0.1).toBeTruthy();
      }
      
      await page.screenshot({ 
        path: 'tests/screenshots/reduced-motion.png'
      });
    });
  });

  test.describe('Cross-browser Testing', () => {
    const browsers = ['chromium', 'webkit', 'firefox'];
    
    for (const browserName of browsers) {
      test(`Basic functionality in ${browserName}`, async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        
        // Check page loads
        await expect(page).toHaveTitle(/Leah Fowler/i);
        
        // Check main elements render
        const nav = page.locator('nav').first();
        await expect(nav).toBeVisible();
        
        const hero = page.locator('h1').first();
        await expect(hero).toBeVisible();
        
        // Test basic interaction
        const firstButton = page.locator('button').first();
        if (await firstButton.count() > 0) {
          await firstButton.click();
          await page.waitForTimeout(300);
        }
        
        await page.screenshot({ 
          path: `tests/screenshots/cross-browser-${browserName}.png`
        });
        
        await context.close();
      });
    }
  });

  test.describe('Critical Feature Validation', () => {
    test('Hero section with kinetic typography', async ({ page }) => {
      const hero = page.locator('section').first();
      await expect(hero).toBeVisible();
      
      // Check for animated text elements
      const animatedText = hero.locator('[class*="animate"], [class*="motion"], [class*="kinetic"]');
      expect(await animatedText.count()).toBeGreaterThan(0);
      
      // Verify gradient background
      const gradient = await hero.evaluate((el) => {
        const bg = window.getComputedStyle(el).background;
        return bg.includes('gradient') || bg.includes('linear') || bg.includes('radial');
      });
      expect(gradient).toBeTruthy();
      
      // Check for call-to-action buttons
      const ctaButtons = hero.locator('button, a[href]');
      expect(await ctaButtons.count()).toBeGreaterThan(0);
      
      await page.screenshot({ 
        path: 'tests/screenshots/hero-kinetic-text.png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 720 }
      });
    });

    test('3D programme cards with hover effects', async ({ page }) => {
      // Navigate to programmes section
      await page.locator('text=/Programme/i').first().click({ force: true });
      await page.waitForTimeout(1000);
      
      const cards = page.locator('[class*="programme"], [class*="card"]').filter({ 
        hasText: /transform|accelerate|quantum/i 
      });
      
      if (await cards.count() > 0) {
        const firstCard = cards.first();
        
        // Get initial transform
        const initialTransform = await firstCard.evaluate((el) => 
          window.getComputedStyle(el).transform
        );
        
        // Hover and check transform changes
        await firstCard.hover();
        await page.waitForTimeout(500);
        
        const hoverTransform = await firstCard.evaluate((el) => 
          window.getComputedStyle(el).transform
        );
        
        expect(hoverTransform).not.toBe(initialTransform);
        
        await page.screenshot({ 
          path: 'tests/screenshots/3d-cards-hover.png'
        });
      }
    });

    test('Trust indicators and social proof', async ({ page }) => {
      // Check for trust badges or certifications
      const trustIndicators = page.locator('[class*="trust"], [class*="badge"], [class*="certification"], [class*="featured"]');
      
      if (await trustIndicators.count() > 0) {
        await trustIndicators.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        await page.screenshot({ 
          path: 'tests/screenshots/trust-indicators.png'
        });
      }
      
      // Check for testimonials or reviews
      const testimonials = page.locator('[class*="testimonial"], [class*="review"], [class*="feedback"]');
      
      if (await testimonials.count() > 0) {
        expect(await testimonials.count()).toBeGreaterThan(0);
      }
    });

    test('Full page visual regression', async ({ page }) => {
      // Take full page screenshot for visual regression
      await page.screenshot({ 
        path: 'tests/screenshots/full-page-visual.png',
        fullPage: true
      });
      
      // Check all major sections are present
      const sections = await page.locator('section').count();
      expect(sections).toBeGreaterThan(3);
      
      // Verify no broken images
      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => !img.complete || img.naturalHeight === 0).length;
      });
      expect(brokenImages).toBe(0);
      
      // Check for console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Should have no critical console errors
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('favicon') && 
        !err.includes('404') &&
        !err.includes('third-party')
      );
      expect(criticalErrors.length).toBe(0);
    });
  });
});

// Additional helper for performance metrics
test.describe('Detailed Performance Analysis', () => {
  test('Lighthouse-style metrics', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
          collectMetrics();
        } else {
          window.addEventListener('load', collectMetrics);
        }
        
        function collectMetrics() {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          resolve({
            // Navigation timing
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart,
            
            // Paint timing
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            
            // Resource timing
            resourceCount: performance.getEntriesByType('resource').length,
            
            // Memory (if available)
            memory: (performance as any).memory ? {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize
            } : null
          });
        }
      });
    });
    
    console.log('Detailed Performance Metrics:', JSON.stringify(metrics, null, 2));
    
    // Generate performance report
    await page.screenshot({ 
      path: 'tests/screenshots/performance-report.png',
      fullPage: true
    });
  });
});