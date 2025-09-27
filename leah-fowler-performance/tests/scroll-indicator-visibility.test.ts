import { test, expect } from '@playwright/test';

test.describe('Hero Section Scroll Indicator', () => {
  test('scroll indicator should be visible without scrolling on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navigate to the homepage
    await page.goto('http://localhost:3001');

    // Wait for the hero section to be loaded
    await page.waitForLoadState('networkidle');

    // Locate the scroll indicator
    const scrollIndicator = page.locator('.hidden.lg\\:block.absolute.bottom-24.left-1\\/2');

    // Check if it exists
    await expect(scrollIndicator).toBeVisible({ timeout: 5000 });

    // Get the bounding box to verify it's within viewport
    const box = await scrollIndicator.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      console.log(`Scroll indicator position: Y=${box.y}, Height=${box.height}, Bottom=${box.y + box.height}`);
      console.log(`Viewport height: 1080`);
      console.log(`Distance from viewport bottom: ${1080 - (box.y + box.height)}px`);

      // The indicator should be fully within the viewport (bottom edge < viewport height)
      expect(box.y + box.height).toBeLessThan(1080);

      // The indicator should be visible (top edge > 0)
      expect(box.y).toBeGreaterThan(0);

      // The indicator should have comfortable spacing from the bottom (at least 80px)
      const distanceFromBottom = 1080 - (box.y + box.height);
      expect(distanceFromBottom).toBeGreaterThan(80);
    }
  });

  test('scroll indicator should be hidden on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the homepage
    await page.goto('http://localhost:3001');

    // Wait for the hero section to be loaded
    await page.waitForLoadState('networkidle');

    // Locate the scroll indicator
    const scrollIndicator = page.locator('.hidden.lg\\:block.absolute.bottom-24.left-1\\/2');

    // It should not be visible on mobile (has hidden class)
    await expect(scrollIndicator).not.toBeVisible();
  });
});