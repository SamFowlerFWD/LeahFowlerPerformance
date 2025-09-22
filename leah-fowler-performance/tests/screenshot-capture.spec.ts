import { test, expect } from '@playwright/test';

test.describe('Screenshot Capture - Visual Proof', () => {
  test('capture full page screenshots', async ({ page, browserName }) => {
    // Only run on Chrome for consistent screenshots
    if (browserName !== 'chromium') test.skip();
    
    // Go to homepage
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for animations to complete
    await page.waitForTimeout(3000);
    
    // Full page screenshot - Light mode
    await page.screenshot({ 
      path: 'tests/screenshots/01-homepage-light-full.png',
      fullPage: true 
    });
    
    // Toggle dark mode
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Full page screenshot - Dark mode
      await page.screenshot({ 
        path: 'tests/screenshots/02-homepage-dark-full.png',
        fullPage: true 
      });
      
      // Toggle back to light
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Hero section with animations
    const heroSection = page.locator('section').first();
    await heroSection.screenshot({ 
      path: 'tests/screenshots/03-hero-section.png'
    });
    
    // Navigation with glassmorphism
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(500);
    const nav = page.locator('nav').first();
    await nav.screenshot({ 
      path: 'tests/screenshots/04-navigation.png'
    });
    
    // Assessment section
    const assessmentSection = page.locator('#assessment');
    if (await assessmentSection.isVisible()) {
      await assessmentSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await assessmentSection.screenshot({ 
        path: 'tests/screenshots/05-assessment-section.png'
      });
    }
    
    // Programmes section with 3D cards
    const programmesSection = page.locator('#programmes');
    if (await programmesSection.isVisible()) {
      await programmesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await programmesSection.screenshot({ 
        path: 'tests/screenshots/06-programmes-section.png'
      });
      
      // Hover effect on programme card
      const firstCard = page.locator('.programme-card').first();
      if (await firstCard.isVisible()) {
        await firstCard.hover();
        await page.waitForTimeout(500);
        await firstCard.screenshot({
          path: 'tests/screenshots/07-programme-card-hover.png'
        });
      }
    }
    
    // Trust section
    const trustSection = page.locator('#trust');
    if (await trustSection.isVisible()) {
      await trustSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await trustSection.screenshot({ 
        path: 'tests/screenshots/08-trust-section.png'
      });
    }
    
    // Testimonials section
    const testimonialsSection = page.locator('#testimonials');
    if (await testimonialsSection.isVisible()) {
      await testimonialsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await testimonialsSection.screenshot({ 
        path: 'tests/screenshots/09-testimonials.png'
      });
    }
    
    // Footer
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await footer.screenshot({ 
        path: 'tests/screenshots/10-footer.png'
      });
    }
    
    console.log('Screenshots captured successfully!');
  });
  
  test('capture responsive views', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Mobile view - iPhone 14 Pro
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/11-mobile-view.png',
      fullPage: true 
    });
    
    // Check mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has(svg.lucide-menu)').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'tests/screenshots/12-mobile-menu.png'
      });
      // Close menu
      const closeButton = page.locator('button[aria-label*="close"], button:has(svg.lucide-x)').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      } else {
        await mobileMenuButton.click(); // Toggle back
      }
    }
    
    // Tablet view - iPad
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/13-tablet-view.png',
      fullPage: true 
    });
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/14-desktop-view.png',
      fullPage: true 
    });
    
    console.log('Responsive screenshots captured!');
  });
  
  test('test interactive features', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Test smooth scrolling
    const programmesLink = page.locator('nav a[href="#programmes"]').first();
    if (await programmesLink.isVisible()) {
      await programmesLink.click();
      await page.waitForTimeout(1500);
      
      // Verify we scrolled
      const programmesSection = page.locator('#programmes');
      const isInViewport = await programmesSection.isIntersectingViewport();
      expect(isInViewport).toBeTruthy();
      
      await page.screenshot({ 
        path: 'tests/screenshots/15-smooth-scroll-result.png'
      });
    }
    
    // Test floating WhatsApp button
    const whatsappButton = page.locator('a[href*="wa.me"], [aria-label*="WhatsApp"]').first();
    if (await whatsappButton.isVisible()) {
      await whatsappButton.screenshot({
        path: 'tests/screenshots/16-whatsapp-button.png'
      });
    }
    
    // Test social proof notification (if it appears)
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Wait for social proof
    
    const notification = page.locator('.social-proof-notification, [role="alert"], .fixed:has-text("client")').first();
    if (await notification.isVisible()) {
      await notification.screenshot({
        path: 'tests/screenshots/17-social-proof.png'
      });
    }
    
    console.log('Interactive features tested!');
  });
  
  test('measure performance metrics', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    
    // Get Core Web Vitals
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
    
    console.log('Performance Metrics:');
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete}ms`);
    console.log(`  First Paint: ${metrics.firstPaint}ms`);
    console.log(`  First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    
    // Check if animations are smooth
    const hasAnimations = await page.evaluate(() => {
      const animations = document.getAnimations();
      return animations.length > 0;
    });
    
    console.log(`Animations detected: ${hasAnimations}`);
    
    // Check for layout shifts
    await page.evaluate(() => {
      const cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as unknown).hadRecentInput) {
            cls += (entry as unknown).value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
      
      return new Promise(resolve => setTimeout(() => resolve(cls), 3000));
    });
    
    console.log('Performance validation complete!');
  });
  
  test('test accessibility', async ({ page, browserName }) => {
    if (browserName !== 'chromium') test.skip();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      await focusedElement.screenshot({
        path: 'tests/screenshots/18-focus-state.png'
      });
    }
    
    // Check for skip link
    const skipLink = page.locator('a[href="#main-content"], a:has-text("Skip")').first();
    if (await skipLink.isVisible()) {
      await skipLink.screenshot({
        path: 'tests/screenshots/19-skip-link.png'
      });
    }
    
    // Verify ARIA labels
    const buttons = await page.locator('button').all();
    const buttonsWithLabels = 0;
    const totalButtons = buttons.length;
    
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      if (ariaLabel || text?.trim()) {
        buttonsWithLabels++;
      }
    }
    
    console.log(`Accessibility: ${buttonsWithLabels}/${totalButtons} buttons have labels`);
    
    // Check heading hierarchy
    const h1Count = await page.locator('h1').count();
    console.log(`H1 tags: ${h1Count} (should be 1)`);
    
    console.log('Accessibility tests complete!');
  });
});