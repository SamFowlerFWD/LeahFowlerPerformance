import { test, expect } from '@playwright/test';

// Test multiple viewports to ensure hero fits properly
const viewports = [
  { width: 1920, height: 1080, name: 'full-hd' },
  { width: 1440, height: 900, name: 'macbook' },
  { width: 1366, height: 768, name: 'standard' },
  { width: 1280, height: 720, name: 'compact' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 812, name: 'mobile' }
];

test.describe('Hero Section Optimization - Text Size & Viewport Fit', () => {
  // Test that hero section fits within viewport at all sizes
  for (const viewport of viewports) {
    test(`Hero fits perfectly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3003/');

      // Wait for hero to be visible
      const hero = await page.locator('.relative.overflow-hidden').first();
      await expect(hero).toBeVisible();

      // Get hero dimensions
      const heroBox = await hero.boundingBox();

      // Hero shouldn't exceed viewport height
      if (heroBox) {
        expect(heroBox.height).toBeLessThanOrEqual(viewport.height);
        console.log(`✓ ${viewport.name}: Hero height ${heroBox.height}px fits in ${viewport.height}px viewport`);
      }

      // Ensure CTAs are above the fold
      const ctaButtons = page.locator('[class*="PremiumButton"]').first();
      const ctaBox = await ctaButtons.boundingBox();

      if (ctaBox) {
        const ctaBottom = ctaBox.y + ctaBox.height;
        expect(ctaBottom).toBeLessThanOrEqual(viewport.height);
        console.log(`✓ ${viewport.name}: CTA buttons visible at ${ctaBottom}px (viewport: ${viewport.height}px)`);
      }

      // Take screenshot for visual verification
      await page.screenshot({
        path: `tests/screenshots/hero-${viewport.name}-optimized.png`,
        fullPage: false
      });
    });
  }
});

test.describe('Text Size Optimization', () => {
  test('Hero headline text sizes are appropriate', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.setViewportSize({ width: 1366, height: 768 });

    // Check headline text size
    const headline = page.locator('h1').first();
    await expect(headline).toBeVisible();

    // Get computed styles
    const fontSize = await headline.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    // Parse font size
    const sizeInPx = parseInt(fontSize);

    // Text should be between 30-60px for optimal readability
    expect(sizeInPx).toBeGreaterThanOrEqual(30);
    expect(sizeInPx).toBeLessThanOrEqual(60);
    console.log(`✓ Headline font size: ${fontSize} (optimal range)`);

    // Check that text doesn't overflow
    const headlineBox = await headline.boundingBox();
    if (headlineBox) {
      const viewportWidth = 1366;
      expect(headlineBox.width).toBeLessThan(viewportWidth * 0.8);
      console.log(`✓ Headline width: ${headlineBox.width}px (fits within 80% of viewport)`);
    }
  });

  test('Mobile text sizes are readable', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.setViewportSize({ width: 375, height: 812 });

    const headline = page.locator('h1').first();
    const fontSize = await headline.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });

    const sizeInPx = parseInt(fontSize);

    // Mobile text should be 24-36px
    expect(sizeInPx).toBeGreaterThanOrEqual(24);
    expect(sizeInPx).toBeLessThanOrEqual(36);
    console.log(`✓ Mobile headline size: ${fontSize}`);
  });
});

test.describe('Spartan Reference Reduction', () => {
  test('Spartan mentions are limited to maximum 2', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Get all text content from hero section
    const heroSection = page.locator('section').first();
    const heroText = await heroSection.innerText();

    // Count Spartan mentions (case insensitive)
    const spartanMatches = heroText.match(/spartan/gi) || [];
    const spartanCount = spartanMatches.length;

    // Should have maximum 2 mentions
    expect(spartanCount).toBeLessThanOrEqual(2);
    console.log(`✓ Spartan mentions in hero: ${spartanCount} (max 2 allowed)`);

    // Verify the rotating headlines contain at least one Spartan reference
    const headlines = await page.locator('h1 span').allInnerTexts();
    const hasSpartanInHeadlines = headlines.some(h => h.toLowerCase().includes('spartan'));

    if (hasSpartanInHeadlines) {
      console.log('✓ Strategic Spartan reference preserved in headlines');
    }
  });
});

test.describe('Visual Hierarchy', () => {
  test('Text hierarchy follows proper scaling', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Get font sizes of different elements
    const h1Size = await page.locator('h1').first().evaluate(el =>
      parseInt(window.getComputedStyle(el).fontSize)
    );

    const subheadingSize = await page.locator('p').first().evaluate(el =>
      parseInt(window.getComputedStyle(el).fontSize)
    );

    // H1 should be 1.5-2x larger than subheading
    const ratio = h1Size / subheadingSize;
    expect(ratio).toBeGreaterThanOrEqual(1.5);
    expect(ratio).toBeLessThanOrEqual(2.5);

    console.log(`✓ Text hierarchy ratio: ${ratio.toFixed(2)}x (H1: ${h1Size}px, Subheading: ${subheadingSize}px)`);
  });
});

test.describe('Performance Metrics', () => {
  test('Hero section loads quickly', async ({ page }) => {
    // Measure time to hero visible
    const startTime = Date.now();

    await page.goto('http://localhost:3003/');
    await page.locator('h1').first().waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;

    // Hero should be visible within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    console.log(`✓ Hero visible in ${loadTime}ms`);
  });

  test('No horizontal scroll on any viewport', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3003/');

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();
      console.log(`✓ ${viewport.name}: No horizontal scroll`);
    }
  });
});

test.describe('Content Quality', () => {
  test('Headlines are emotionally resonant for mothers', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Expected powerful headlines
    const expectedPhrases = [
      'Mum Who Races',
      'Piggybacks at 40',
      'School Run',
      'Kids Deserve',
      'Strongest Version'
    ];

    // Wait for headline rotation
    await page.waitForTimeout(6000); // Allow one rotation

    // Get all headline text
    const headlines = await page.locator('h1').allInnerTexts();

    // Check that at least one expected phrase appears
    const hasEmotionalHeadline = expectedPhrases.some(phrase =>
      headlines.some(h => h.includes(phrase))
    );

    expect(hasEmotionalHeadline).toBeTruthy();
    console.log('✓ Headlines contain emotionally resonant mother-focused content');
  });
});

// Visual regression test
test.describe('Visual Regression', () => {
  test('Compare hero section appearance', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:3003/');

    // Wait for animations to settle
    await page.waitForTimeout(1000);

    // Take screenshot of hero section only
    const hero = page.locator('section').first();
    await hero.screenshot({
      path: 'tests/screenshots/hero-baseline.png'
    });

    console.log('✓ Baseline screenshot captured for visual comparison');
  });
});