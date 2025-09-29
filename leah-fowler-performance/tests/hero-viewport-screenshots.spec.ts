import { test } from '@playwright/test';

test.describe('Hero Section Viewport Screenshots', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const viewport of viewports) {
    test(`Capture hero section at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to the page
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

      // Wait for hero section to be fully loaded
      await page.waitForSelector('.hero-section', { timeout: 10000 });

      // Wait a bit for any animations to complete
      await page.waitForTimeout(1000);

      // Take screenshot of the hero section
      const heroSection = await page.locator('.hero-section').first();
      await heroSection.screenshot({
        path: `tests/screenshots/hero-${viewport.name}-${viewport.width}px.png`
      });

      // Also take a full page screenshot for context
      await page.screenshot({
        path: `tests/screenshots/full-page-${viewport.name}-${viewport.width}px.png`,
        fullPage: false // Just the viewport
      });

      // Log verification details
      const heroImage = await page.locator('.hero-section img').first();
      const heroText = await page.locator('.hero-section h1').first();

      if (await heroImage.isVisible()) {
        const imageBounds = await heroImage.boundingBox();
        console.log(`${viewport.name}: Image visible at`, imageBounds);
      }

      if (await heroText.isVisible()) {
        const textBounds = await heroText.boundingBox();
        const fontSize = await heroText.evaluate(el => window.getComputedStyle(el).fontSize);
        console.log(`${viewport.name}: Text visible at`, textBounds, 'Font size:', fontSize);
      }

      // Check layout type (overlay vs side-by-side)
      const heroContainer = await page.locator('.hero-section > div').first();
      const containerClasses = await heroContainer.getAttribute('class');

      if (containerClasses?.includes('absolute') || containerClasses?.includes('overlay')) {
        console.log(`${viewport.name}: Using OVERLAY layout`);
      } else if (containerClasses?.includes('grid') || containerClasses?.includes('flex')) {
        console.log(`${viewport.name}: Using SIDE-BY-SIDE layout`);
      }
    });
  }
});