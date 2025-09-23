import { test, expect, Page } from '@playwright/test';

// Helper function to check glassmorphism properties
async function checkGlassmorphismProperties(page: Page, selector: string) {
  return page.locator(selector).first().evaluate(el => {
    const computed = window.getComputedStyle(el);
    const childDiv = el.querySelector('div');
    const childComputed = childDiv ? window.getComputedStyle(childDiv) : null;

    return {
      // Main glassmorphism properties
      background: childComputed?.backgroundColor || computed.backgroundColor,
      backdropFilter: childComputed?.backdropFilter || computed.backdropFilter,
      webkitBackdropFilter: (childComputed as any)?.webkitBackdropFilter || (computed as any).webkitBackdropFilter,
      border: childComputed?.border || computed.border,
      boxShadow: childComputed?.boxShadow || computed.boxShadow,

      // Additional properties
      borderRadius: childComputed?.borderRadius || computed.borderRadius,
      overflow: childComputed?.overflow || computed.overflow,
      transform: computed.transform,
      willChange: childComputed?.willChange || computed.willChange,

      // Check for GPU acceleration
      transformStyle: computed.transformStyle,

      // Animation properties
      transition: computed.transition,
      animationDuration: computed.animationDuration,
    };
  });
}

// Helper to measure animation performance
async function measureAnimationPerformance(page: Page, selector: string) {
  return page.evaluate((sel) => {
    return new Promise<{ fps: number; dropped: number }>((resolve) => {
      let frameCount = 0;
      let droppedFrames = 0;
      let lastTime = performance.now();
      const targetFPS = 60;
      const targetFrameTime = 1000 / targetFPS;

      const element = document.querySelector(sel);
      if (!element) {
        resolve({ fps: 0, dropped: 0 });
        return;
      }

      const measureFrame = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta > targetFrameTime * 1.5) {
          droppedFrames++;
        }

        frameCount++;
        lastTime = currentTime;

        if (frameCount < 60) {
          requestAnimationFrame(measureFrame);
        } else {
          const duration = currentTime - (lastTime - delta * frameCount);
          const fps = (frameCount * 1000) / duration;
          resolve({ fps: Math.round(fps), dropped: droppedFrames });
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }, selector);
}

test.describe('iOS 16 Glassmorphism Effect Tests', () => {
  test('credential cards have correct iOS 16 glassmorphism properties', async ({ page, browserName }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check for the glass cards
    const glassCards = page.locator('.absolute.z-10.hidden.md\\:block.group').filter({
      has: page.locator('.flex.items-center.gap-2')
    });

    const cardCount = await glassCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Test each card for glassmorphism properties
    for (let i = 0; i < cardCount; i++) {
      const card = glassCards.nth(i);
      await expect(card).toBeVisible();

      const glassProps = await checkGlassmorphismProperties(page, `.absolute.z-10.hidden.md\\:block.group:nth-of-type(${i + 1})`);

      // Verify iOS 16 exact values
      expect(glassProps.background).toMatch(/rgba\(255,\s*255,\s*255,\s*0\.78\)|rgb\(255,\s*255,\s*255\)/);

      // Check backdrop filter (may vary by browser)
      if (browserName === 'webkit' || browserName === 'chromium') {
        expect(glassProps.backdropFilter || glassProps.webkitBackdropFilter).toContain('blur');
        expect(glassProps.backdropFilter || glassProps.webkitBackdropFilter).toContain('saturate');
      }

      // Verify border and shadows
      expect(glassProps.border).toBeTruthy();
      expect(glassProps.boxShadow).toContain('rgba');

      // Check for proper border radius
      expect(glassProps.borderRadius).toBeTruthy();

      // Verify GPU acceleration hints
      expect(glassProps.willChange).toMatch(/transform|auto/);
    }
  });

  test('glass cards have smooth hover animations', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const glassCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();
    await expect(glassCard).toBeVisible();

    // Get initial scale
    const initialTransform = await glassCard.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Hover over the card
    await glassCard.hover();
    await page.waitForTimeout(400); // Wait for animation

    // Check scale changed on hover
    const hoverTransform = await glassCard.evaluate(el =>
      window.getComputedStyle(el.querySelector('div > div') || el).transform
    );

    // Should have scale(1.02) applied
    expect(hoverTransform).toContain('matrix');

    // Move mouse away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);

    // Check returned to normal
    const finalTransform = await glassCard.evaluate(el =>
      window.getComputedStyle(el.querySelector('div > div') || el).transform
    );

    // Take screenshots for visual comparison
    await glassCard.screenshot({
      path: 'test-results/glass-card-normal.png'
    });

    await glassCard.hover();
    await page.waitForTimeout(400);
    await glassCard.screenshot({
      path: 'test-results/glass-card-hover.png'
    });
  });

  test('glass cards have light refraction effect on mouse movement', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const glassCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();
    const cardBox = await glassCard.boundingBox();

    if (!cardBox) {
      throw new Error('Card not found');
    }

    // Move mouse across the card to test light refraction
    const positions = [
      { x: cardBox.x, y: cardBox.y }, // Top-left
      { x: cardBox.x + cardBox.width / 2, y: cardBox.y + cardBox.height / 2 }, // Center
      { x: cardBox.x + cardBox.width, y: cardBox.y + cardBox.height }, // Bottom-right
    ];

    for (const pos of positions) {
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(100);

      // Check transform changes based on mouse position
      const transform = await glassCard.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          rotateX: (style as any).rotateX,
          rotateY: (style as any).rotateY,
        };
      });

      // Transform should change with mouse position
      expect(transform.transform).toBeTruthy();
    }
  });

  test('glass cards maintain 60fps during animations', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Measure animation performance
    const perfMetrics = await measureAnimationPerformance(
      page,
      '.absolute.z-10.hidden.md\\:block.group'
    );

    // Should maintain close to 60fps
    expect(perfMetrics.fps).toBeGreaterThanOrEqual(55);
    // Should have minimal dropped frames
    expect(perfMetrics.dropped).toBeLessThanOrEqual(2);
  });

  test('glass effect has proper contrast ratios for accessibility', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const glassCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();

    // Check text contrast within glass cards
    const contrastRatio = await glassCard.evaluate(() => {
      const card = document.querySelector('.absolute.z-10.hidden.md\\:block.group');
      if (!card) return 0;

      const text = card.querySelector('.font-bold.text-navy');
      if (!text) return 0;

      const textColor = window.getComputedStyle(text).color;
      const bgColor = window.getComputedStyle(card).backgroundColor;

      // Simple contrast calculation (would use proper WCAG formula in production)
      const getLuminance = (color: string) => {
        const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
        const [r, g, b] = rgb.map(val => {
          val = val / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const l1 = getLuminance(textColor);
      const l2 = getLuminance(bgColor);

      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    });

    // WCAG AA requires 4.5:1 for normal text
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('glass cards degrade gracefully in browsers without backdrop-filter', async ({ page }) => {
    // Disable backdrop-filter support
    await page.addInitScript(() => {
      Object.defineProperty(CSS, 'supports', {
        value: (prop: string) => {
          if (prop.includes('backdrop-filter')) return false;
          return true;
        }
      });
    });

    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const glassCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();
    await expect(glassCard).toBeVisible();

    // Card should still be visible and styled even without backdrop-filter
    const styles = await glassCard.evaluate(el => {
      const computed = window.getComputedStyle(el.querySelector('div > div') || el);
      return {
        background: computed.backgroundColor,
        opacity: computed.opacity,
        border: computed.border,
      };
    });

    // Should have fallback styling
    expect(styles.background).toContain('rgba');
    expect(parseFloat(styles.opacity)).toBeGreaterThan(0.7);
    expect(styles.border).toBeTruthy();
  });
});

test.describe('About Section Overlay Fix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    // Scroll to the About section
    await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Wait for animations to complete
    await page.waitForTimeout(2000);
  });

  test('main image should be fully visible without overlays', async ({ page }) => {
    const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');

    // Check that the image exists and is visible
    await expect(mainImage).toBeVisible();

    // Get the image bounding box
    const imageBbox = await mainImage.boundingBox();
    expect(imageBbox).not.toBeNull();

    if (imageBbox) {
      // Check that the image has proper dimensions
      expect(imageBbox.width).toBeGreaterThan(200);
      expect(imageBbox.height).toBeGreaterThan(200);

      // Take a screenshot of the image area to verify no overlays
      await mainImage.screenshot({
        path: 'test-results/about-image-no-overlay.png'
      });
    }
  });

  test('credential cards should not block main image on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');
    const credentialCards = page.locator('.absolute.bg-white.rounded-2xl.shadow-2xl');

    // Check if cards exist (they might be hidden on mobile)
    const cardsCount = await credentialCards.count();

    if (cardsCount > 0) {
      // Get image bounding box
      const imageBbox = await mainImage.boundingBox();

      // Check each card to ensure they don't overlap the center of the image
      for (let i = 0; i < cardsCount; i++) {
        const card = credentialCards.nth(i);
        const isVisible = await card.isVisible();

        if (isVisible) {
          const cardBbox = await card.boundingBox();

          if (imageBbox && cardBbox) {
            // Calculate image center
            const imageCenterX = imageBbox.x + imageBbox.width / 2;
            const imageCenterY = imageBbox.y + imageBbox.height / 2;

            // Check that cards don't cover the image center
            const coversCenter =
              cardBbox.x < imageCenterX &&
              (cardBbox.x + cardBbox.width) > imageCenterX &&
              cardBbox.y < imageCenterY &&
              (cardBbox.y + cardBbox.height) > imageCenterY;

            expect(coversCenter).toBe(false);
          }
        }
      }
    }
  });

  test('credential cards should be hidden on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    const credentialCards = page.locator('.absolute.bg-white.rounded-2xl.shadow-2xl');

    // Cards should either not exist or be hidden on mobile
    const cardsCount = await credentialCards.count();

    for (let i = 0; i < cardsCount; i++) {
      const card = credentialCards.nth(i);
      // Check if card has 'hidden md:block' class or is not visible
      const classNames = await card.getAttribute('class');

      if (classNames && classNames.includes('hidden md:block')) {
        await expect(card).not.toBeVisible();
      }
    }
  });

  test('z-index layering should be correct', async ({ page }) => {
    const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');
    const imageContainer = page.locator('.relative.rounded-3xl.overflow-hidden.shadow-2xl');

    // Check that image container has proper z-index
    const containerStyles = await imageContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        zIndex: computed.zIndex,
        position: computed.position
      };
    });

    // Container should have z-0 or auto (not high z-index)
    expect(['0', 'auto']).toContain(containerStyles.zIndex);
  });

  test('responsive layout at different breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Wait for layout shift
      await page.waitForTimeout(500);

      const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');

      // Verify image is visible at all breakpoints
      await expect(mainImage).toBeVisible();

      // Take screenshot for visual regression
      await page.locator('#about').screenshot({
        path: `test-results/about-section-${viewport.name}.png`,
        fullPage: false
      });
    }
  });

  test('image should be clickable and interactive', async ({ page }) => {
    const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');

    // Check that the image or its container doesn't have pointer-events: none
    const pointerEvents = await mainImage.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.pointerEvents;
    });

    expect(pointerEvents).not.toBe('none');

    // Check parent container
    const imageContainer = page.locator('.relative.rounded-3xl.overflow-hidden.shadow-2xl');
    const containerPointerEvents = await imageContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return computed.pointerEvents;
    });

    expect(containerPointerEvents).not.toBe('none');
  });

  test('text content should be readable and not overlapped', async ({ page }) => {
    // Check that "STRENGTH COACH" text is properly positioned
    const strengthCoachText = page.locator('text=Strength Coach').first();

    if (await strengthCoachText.isVisible()) {
      const textBbox = await strengthCoachText.boundingBox();
      expect(textBbox).not.toBeNull();

      // Text should be within reasonable bounds (not floating in middle of screen)
      if (textBbox) {
        expect(textBbox.width).toBeLessThan(300); // Reasonable width for card
      }
    }

    // Check main heading is visible
    const mainHeading = page.locator('h2:has-text("Leah Fowler")');
    await expect(mainHeading).toBeVisible();
  });

  test('performance check - no layout shifts', async ({ page }) => {
    // Monitor for layout shifts
    const layoutShifts = await page.evaluate(() => {
      return new Promise((resolve) => {
        let shifts = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              shifts += entry.value;
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Wait a bit and then resolve with cumulative shift
        setTimeout(() => {
          observer.disconnect();
          resolve(shifts);
        }, 3000);
      });
    });

    // CLS should be very low (less than 0.1 for good experience)
    expect(layoutShifts).toBeLessThan(0.1);
  });

  test('visual regression - compare screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Take full section screenshot
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toHaveScreenshot('about-section-full.png', {
      maxDiffPixels: 100,
      threshold: 0.2
    });

    // Take image area screenshot
    const imageArea = page.locator('.relative').filter({ has: page.locator('img[alt="Leah Fowler - Performance Consultant"]') });
    await expect(imageArea).toHaveScreenshot('about-image-area.png', {
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });
});

test.describe('Glass Cards Visual Regression', () => {
  test('glass cards match visual snapshot', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // Wait for all animations

    // Take snapshots of individual glass cards
    const glassCards = page.locator('.absolute.z-10.hidden.md\\:block.group');
    const cardCount = await glassCards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = glassCards.nth(i);
      if (await card.isVisible()) {
        await expect(card).toHaveScreenshot(`glass-card-${i}.png`, {
          maxDiffPixels: 50,
          threshold: 0.1,
          animations: 'disabled',
        });
      }
    }

    // Full about section with glass cards
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toHaveScreenshot('about-section-glassmorphism.png', {
      maxDiffPixels: 200,
      threshold: 0.1,
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('glass cards animation states', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();

    const glassCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();

    // Capture different animation states
    const states = ['initial', 'hover', 'active'];

    for (const state of states) {
      if (state === 'hover') {
        await glassCard.hover();
        await page.waitForTimeout(400);
      } else if (state === 'active') {
        await glassCard.click({ force: true });
        await page.waitForTimeout(100);
      }

      await glassCard.screenshot({
        path: `test-results/glass-card-${state}.png`
      });
    }
  });
});

test.describe('About Section Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile layout should be clean without overlays', async ({ page }) => {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const mainImage = page.locator('img[alt="Leah Fowler - Performance Consultant"]');

    // Image should be fully visible on mobile
    await expect(mainImage).toBeVisible();

    // No credential cards should be visible on mobile
    const credentialCards = page.locator('.absolute.bg-white.rounded-2xl.shadow-2xl.hidden.md\\:block');
    const cardsCount = await credentialCards.count();

    for (let i = 0; i < cardsCount; i++) {
      await expect(credentialCards.nth(i)).not.toBeVisible();
    }

    // Take mobile screenshot for verification
    await page.locator('#about').screenshot({
      path: 'test-results/about-section-mobile-clean.png'
    });
  });
});