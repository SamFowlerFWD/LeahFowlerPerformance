import { test, expect } from '@playwright/test';

test('verify scroll indicator is now properly positioned', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the homepage on the new port
  await page.goto('http://localhost:3001');

  // Wait for page to be fully loaded
  await page.waitForLoadState('domcontentloaded');

  // Look for any element with bottom-24 class
  const bottomElements = await page.locator('.bottom-24').count();
  console.log(`Found ${bottomElements} elements with bottom-24 class`);

  // Try to find the scroll indicator specifically with new positioning
  const scrollIndicator = page.locator('.hidden.lg\\:block.absolute.bottom-24.left-1\\/2');

  // Check if it exists
  const count = await scrollIndicator.count();
  console.log(`Found ${count} scroll indicators with bottom-24`);

  if (count > 0) {
    // Check visibility
    const isVisible = await scrollIndicator.isVisible();
    console.log(`Scroll indicator visible: ${isVisible}`);

    // Get the bounding box to verify position
    const box = await scrollIndicator.boundingBox();

    if (box) {
      console.log(`\nScroll indicator positioning:`);
      console.log(`  Y position: ${box.y}px`);
      console.log(`  Height: ${box.height}px`);
      console.log(`  Bottom edge: ${box.y + box.height}px`);
      console.log(`  Distance from viewport bottom: ${1080 - (box.y + box.height)}px`);

      // Verify it's well within the viewport
      expect(box.y + box.height).toBeLessThan(1080);

      // Verify it has good spacing from the bottom (at least 80px)
      const distanceFromBottom = 1080 - (box.y + box.height);
      expect(distanceFromBottom).toBeGreaterThan(80);

      console.log(`\n✓ Scroll indicator is properly positioned with ${distanceFromBottom}px from viewport bottom`);
    }
  } else {
    throw new Error('Scroll indicator with bottom-24 not found');
  }
});