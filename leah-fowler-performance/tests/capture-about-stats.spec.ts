import { test } from '@playwright/test';

test('Capture About section screenshot', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the homepage
  await page.goto('http://localhost:3007', { waitUntil: 'networkidle' });

  // Wait for the page to fully load
  await page.waitForTimeout(2000);

  // Find and scroll to the About section
  const aboutSection = page.locator('section').filter({ hasText: 'About Leah' }).first();
  await aboutSection.scrollIntoViewIfNeeded();

  // Wait for any animations to complete
  await page.waitForTimeout(1000);

  // Take a screenshot of the About section
  await aboutSection.screenshot({
    path: 'updated-about-stats.png'
  });

  // Also log the text content for verification
  const credentialTexts = await aboutSection.locator('.bg-neutral-900, .bg-zinc-900').allTextContents();

  console.log('\n=== Credential Cards Content ===');
  credentialTexts.forEach((text, index) => {
    console.log(`\nCard ${index + 1}:`);
    console.log(text);
  });

  console.log('\n✓ Screenshot saved as updated-about-stats.png');
});