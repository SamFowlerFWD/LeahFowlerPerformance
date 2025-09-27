import { test, expect } from '@playwright/test';

test('quick scroll indicator check', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the homepage
  await page.goto('http://localhost:3008');

  // Wait for page to be fully loaded
  await page.waitForLoadState('domcontentloaded');

  // Look for any element with bottom-24 class
  const bottomElements = await page.locator('.bottom-24').count();
  console.log(`Found ${bottomElements} elements with bottom-24 class`);

  // Also check for bottom-8 (old value)
  const oldElements = await page.locator('.bottom-8').count();
  console.log(`Found ${oldElements} elements with bottom-8 class`);

  // Try to find the scroll indicator specifically
  const scrollIndicatorOld = await page.locator('.hidden.lg\\:block.absolute.bottom-8').count();
  console.log(`Scroll indicators with bottom-8: ${scrollIndicatorOld}`);

  const scrollIndicatorNew = await page.locator('.hidden.lg\\:block.absolute.bottom-24').count();
  console.log(`Scroll indicators with bottom-24: ${scrollIndicatorNew}`);

  // Take a screenshot for visual confirmation
  await page.screenshot({ path: '/tmp/scroll-indicator-check.png', fullPage: false });
  console.log('Screenshot saved to /tmp/scroll-indicator-check.png');

  // Let's also check the actual rendered HTML
  const heroSection = await page.locator('section').first();
  const heroHTML = await heroSection.innerHTML();

  // Look for the scroll indicator in the HTML
  if (heroHTML.includes('bottom-24')) {
    console.log('✓ Found bottom-24 in the HTML');
  } else if (heroHTML.includes('bottom-8')) {
    console.log('⚠ Still using bottom-8 in the HTML');
  } else {
    console.log('✗ Scroll indicator not found');
  }
});