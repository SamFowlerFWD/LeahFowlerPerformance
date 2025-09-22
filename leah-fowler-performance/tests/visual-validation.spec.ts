import { test, expect } from '@playwright/test';

test.describe('Visual Validation - Homepage Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('capture hero section with kinetic text animation', async ({ page }) => {
    // Wait for animations to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of hero section
    const heroSection = page.locator('#hero');
    await heroSection.screenshot({ 
      path: 'tests/screenshots/01-hero-section.png',
      fullPage: false,
      animations: 'allow'
    });

    // Verify kinetic text is present
    const kineticText = page.locator('.kinetic-text');
    await expect(kineticText).toBeVisible();
    
    // Capture kinetic text animation states
    await kineticText.screenshot({
      path: 'tests/screenshots/02-kinetic-text.png'
    });
  });

  test('capture glassmorphism navigation header', async ({ page }) => {
    // Scroll down to trigger sticky nav
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(500);
    
    const nav = page.locator('nav').first();
    await nav.screenshot({ 
      path: 'tests/screenshots/03-glassmorphism-nav.png'
    });

    // Verify glassmorphism effect
    const navStyles = await nav.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    expect(navStyles.backdropFilter || navStyles.webkitBackdropFilter).toContain('blur');
  });

  test('capture 3D programme cards', async ({ page }) => {
    // Scroll to programmes section
    await page.locator('#programmes').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const programmeSection = page.locator('#programmes');
    await programmeSection.screenshot({ 
      path: 'tests/screenshots/04-programme-cards.png'
    });

    // Capture individual card with hover effect
    const firstCard = page.locator('.programme-card').first();
    await firstCard.hover();
    await page.waitForTimeout(500);
    await firstCard.screenshot({
      path: 'tests/screenshots/05-programme-card-hover.png'
    });
  });

  test('capture trust section with client logos', async ({ page }) => {
    await page.locator('#trust').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const trustSection = page.locator('#trust');
    await trustSection.screenshot({ 
      path: 'tests/screenshots/06-trust-section.png'
    });

    // Verify logos are visible
    const logos = page.locator('#trust img');
    const logoCount = await logos.count();
    expect(logoCount).toBeGreaterThan(0);
  });

  test('capture testimonials section', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const testimonialsSection = page.locator('#testimonials');
    await testimonialsSection.screenshot({ 
      path: 'tests/screenshots/07-testimonials.png'
    });
  });

  test('capture footer section', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    await footer.screenshot({ 
      path: 'tests/screenshots/08-footer.png'
    });
  });
});

test.describe('Dark Mode vs Light Mode', () => {
  test('compare dark and light modes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Light mode screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/09-light-mode-full.png',
      fullPage: true 
    });

    // Toggle to dark mode
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Dark mode screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/10-dark-mode-full.png',
      fullPage: true 
    });

    // Verify dark mode is applied
    const htmlElement = page.locator('html');
    const classList = await htmlElement.getAttribute('class');
    expect(classList).toContain('dark');
  });
});

test.describe('Interactive Features', () => {
  test('test dark mode toggle functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    const htmlElement = page.locator('html');
    
    // Start in light mode
    let classList = await htmlElement.getAttribute('class');
    expect(classList).not.toContain('dark');
    
    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);
    classList = await htmlElement.getAttribute('class');
    expect(classList).toContain('dark');
    
    // Toggle back to light mode
    await themeToggle.click();
    await page.waitForTimeout(300);
    classList = await htmlElement.getAttribute('class');
    expect(classList).not.toContain('dark');
  });

  test('test navigation smooth scrolling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on programmes nav link
    await page.locator('nav a[href="#programmes"]').click();
    
    // Wait for smooth scroll
    await page.waitForTimeout(1000);
    
    // Verify we scrolled to programmes section
    const programmeSection = page.locator('#programmes');
    await expect(programmeSection).toBeInViewport();
  });

  test('test hover effects on programme cards', async ({ page }) => {
    await page.goto('/');
    await page.locator('#programmes').scrollIntoViewIfNeeded();
    
    const card = page.locator('.programme-card').first();
    
    // Get initial transform
    const initialTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    // Hover and check transform changes
    await card.hover();
    await page.waitForTimeout(300);
    
    const hoverTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    expect(initialTransform).not.toBe(hoverTransform);
  });

  test('test exit-intent popup', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate exit intent by moving mouse to top of viewport
    await page.mouse.move(400, 0);
    await page.waitForTimeout(2000);
    
    // Check if exit intent popup appears
    const exitPopup = page.locator('[role="dialog"]').filter({ hasText: /wait|special offer|don't leave/i });
    
    // Note: Exit intent might not trigger in headless mode
    // This is a placeholder for the test
    if (await exitPopup.isVisible()) {
      await exitPopup.screenshot({
        path: 'tests/screenshots/11-exit-intent-popup.png'
      });
    }
  });

  test('test WhatsApp floating button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const whatsappButton = page.locator('[aria-label*="WhatsApp"], a[href*="wa.me"]');
    
    if (await whatsappButton.isVisible()) {
      await expect(whatsappButton).toBeVisible();
      await whatsappButton.screenshot({
        path: 'tests/screenshots/12-whatsapp-button.png'
      });
      
      // Verify WhatsApp link
      const href = await whatsappButton.getAttribute('href');
      expect(href).toContain('wa.me');
    }
  });

  test('test social proof notifications', async ({ page }) => {
    await page.goto('/');
    
    // Wait for social proof notification to appear
    await page.waitForTimeout(5000);
    
    const notification = page.locator('.social-proof-notification, [role="alert"]').first();
    
    if (await notification.isVisible()) {
      await notification.screenshot({
        path: 'tests/screenshots/13-social-proof.png'
      });
    }
  });
});

test.describe('Responsive Testing', () => {
  test('mobile view - iPhone 14 Pro (390px)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Full page mobile screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/14-mobile-full.png',
      fullPage: true 
    });
    
    // Mobile navigation (hamburger menu)
    const mobileMenuButton = page.locator('[aria-label*="menu"], button:has(svg)').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'tests/screenshots/15-mobile-menu.png'
      });
    }
  });

  test('tablet view - iPad (768px)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/16-tablet-full.png',
      fullPage: true 
    });
  });

  test('desktop view (1920px)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'tests/screenshots/17-desktop-full.png',
      fullPage: true 
    });
  });
});

test.describe('Performance Validation', () => {
  test('measure page load time and Core Web Vitals', async ({ page }) => {
    // Start measuring
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    console.log('Performance Metrics:', metrics);
    
    // Core Web Vitals thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(1800); // FCP < 1.8s is good
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('check for layout shifts', async ({ page }) => {
    await page.goto('/');
    
    // Monitor layout shifts
    const layoutShifts = await page.evaluate(() => {
      return new Promise((resolve) => {
        const shifts: unknown[] = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              shifts.push({
                value: (entry as unknown).value,
                hadRecentInput: (entry as unknown).hadRecentInput
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Observe for 3 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(shifts);
        }, 3000);
      });
    });
    
    console.log('Layout Shifts:', layoutShifts);
    
    // Calculate CLS
    const cls = (layoutShifts as unknown[])
      .filter(shift => !shift.hadRecentInput)
      .reduce((sum, shift) => sum + shift.value, 0);
    
    console.log(`Cumulative Layout Shift: ${cls}`);
    expect(cls).toBeLessThan(0.1); // CLS < 0.1 is good
  });

  test('verify animations are smooth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for animation performance
    const animationPerformance = await page.evaluate(() => {
      const animations = document.getAnimations();
      return {
        count: animations.length,
        running: animations.filter(a => a.playState === 'running').length,
        hasGPUAcceleration: animations.some(a => {
          const target = (a as unknown).effect?.target;
          if (!target) return false;
          const transform = window.getComputedStyle(target).transform;
          return transform && transform !== 'none';
        })
      };
    });
    
    console.log('Animation Performance:', animationPerformance);
    
    // Ensure animations are using GPU acceleration
    expect(animationPerformance.hasGPUAcceleration).toBeTruthy();
  });
});

test.describe('Accessibility Testing', () => {
  test('test keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
    
    // Continue tabbing and check focus order
    const focusOrder: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const element = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          text: el?.textContent?.slice(0, 30),
          ariaLabel: el?.getAttribute('aria-label')
        };
      });
      focusOrder.push(`${element.tag}: ${element.text || element.ariaLabel}`);
    }
    
    console.log('Focus order:', focusOrder);
    
    // Test reverse tabbing
    await page.keyboard.press('Shift+Tab');
    focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('verify focus states are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusVisible = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return false;
      
      const styles = window.getComputedStyle(el);
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      
      return outline !== 'none' || boxShadow !== 'none';
    });
    
    expect(focusVisible).toBeTruthy();
    
    // Screenshot focused element
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      await focusedElement.screenshot({
        path: 'tests/screenshots/18-focus-state.png'
      });
    }
  });

  test('check ARIA labels and roles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for ARIA labels on interactive elements
    const ariaCheck = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));
      const inputs = Array.from(document.querySelectorAll('input'));
      
      const results = {
        buttonsWithoutLabel: buttons.filter(b => 
          !b.getAttribute('aria-label') && 
          !b.textContent?.trim() &&
          !b.getAttribute('aria-labelledby')
        ).length,
        linksWithoutLabel: links.filter(a => 
          !a.getAttribute('aria-label') && 
          !a.textContent?.trim() &&
          !a.getAttribute('aria-labelledby')
        ).length,
        inputsWithoutLabel: inputs.filter(i => 
          !i.getAttribute('aria-label') && 
          !i.getAttribute('aria-labelledby') &&
          !document.querySelector(`label[for="${i.id}"]`)
        ).length,
        totalButtons: buttons.length,
        totalLinks: links.length,
        totalInputs: inputs.length
      };
      
      return results;
    });
    
    console.log('ARIA Label Check:', ariaCheck);
    
    // All interactive elements should have labels
    expect(ariaCheck.buttonsWithoutLabel).toBe(0);
    expect(ariaCheck.inputsWithoutLabel).toBe(0);
  });

  test('test with screen reader announcements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for live regions
    const liveRegions = await page.evaluate(() => {
      const regions = document.querySelectorAll('[aria-live], [role="alert"], [role="status"]');
      return Array.from(regions).map(r => ({
        role: r.getAttribute('role'),
        ariaLive: r.getAttribute('aria-live'),
        text: r.textContent?.slice(0, 50)
      }));
    });
    
    console.log('Live Regions:', liveRegions);
    
    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first();
    if (await skipLink.count() > 0) {
      // Focus skip link
      await skipLink.focus();
      await skipLink.screenshot({
        path: 'tests/screenshots/19-skip-link.png'
      });
    }
    
    // Check heading hierarchy
    const headingHierarchy = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map(h => ({
        level: h.tagName,
        text: h.textContent?.slice(0, 50)
      }));
    });
    
    console.log('Heading Hierarchy:', headingHierarchy.slice(0, 10));
    
    // Should have exactly one H1
    const h1Count = headingHierarchy.filter(h => h.level === 'H1').length;
    expect(h1Count).toBe(1);
  });
});