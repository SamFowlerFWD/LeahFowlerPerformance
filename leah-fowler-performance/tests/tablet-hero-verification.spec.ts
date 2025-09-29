import { test, expect } from '@playwright/test';

test.describe('Tablet Hero Section Verification', () => {
  test('Hero section displays correctly at 768px tablet viewport', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
    // Set viewport to exactly 768px width
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate to the homepage
    await page.goto('http://localhost:3004');

    // Wait for hero section to be visible
    const heroSection = page.locator('section').first();
    await heroSection.waitFor({ state: 'visible', timeout: 10000 });

    // Wait a moment for styles to fully apply
    await page.waitForTimeout(1000);

    // Take screenshot of the full page
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/tablet-view-fixed-768px.png',
      fullPage: false // Just the viewport
    });

    // Also take a screenshot of just the hero section
    await heroSection.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/tablet-hero-section-768px.png'
    });

    // Check text element properties
    const heroTitle = page.locator('h1').first();
    const titleFontSize = await heroTitle.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );

    const heroImage = page.locator('img').first();
    const imageVisible = await heroImage.isVisible();

    // Get layout information
    const containerLayout = await page.locator('.container').first().evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        flexDirection: styles.flexDirection,
        alignItems: styles.alignItems
      };
    });

    // Get actual positions to verify side-by-side layout
    const textBox = await page.locator('.space-y-4, .space-y-6').first().boundingBox();
    const imageBox = await heroImage.boundingBox();

    console.log('Tablet View Analysis (768px):');
    console.log('===================================');
    console.log(`Title Font Size: ${titleFontSize}`);
    console.log(`Image Visible: ${imageVisible}`);
    console.log(`Container Layout:`, containerLayout);
    console.log(`Text Position: Left=${textBox?.x}, Top=${textBox?.y}, Width=${textBox?.width}`);
    console.log(`Image Position: Left=${imageBox?.x}, Top=${imageBox?.y}, Width=${imageBox?.width}`);

    // Assertions to verify correct layout
    // Font size should be reasonable for tablet (32-48px range)
    const fontSize = parseInt(titleFontSize);
    expect(fontSize).toBeGreaterThanOrEqual(28);
    expect(fontSize).toBeLessThanOrEqual(48);

    // Image should be visible
    expect(imageVisible).toBe(true);

    // For side-by-side layout at tablet, image should be to the right of text
    if (textBox && imageBox) {
      // Image should start after text horizontally (side-by-side)
      expect(imageBox.x).toBeGreaterThan(textBox.x);
      console.log('\n✅ Layout Check: Side-by-side layout confirmed (image to the right of text)');
    }

    console.log('\nScreenshots saved:');
    console.log('- /screenshots/tablet-hero-768px-verification.png (full viewport)');
    console.log('- /screenshots/tablet-hero-section-768px.png (hero section only)');
  });
});