import { test, expect } from '@playwright/test';

test('Apply page visual test', async ({ page }) => {
  // Navigate to the apply page
  await page.goto('http://localhost:3003/apply');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: 'tests/ui-ux-inspection/screenshots/apply-page-complete.png',
    fullPage: true
  });

  // Check if radio buttons are visible
  const radioButtons = await page.locator('button[role="radio"]').count();
  console.log(`Found ${radioButtons} radio buttons`);

  // Take screenshot of the form
  const form = page.locator('form').first();
  if (await form.isVisible()) {
    await form.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/apply-form.png'
    });
  }

  // Check mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'tests/ui-ux-inspection/screenshots/apply-mobile.png',
    fullPage: true
  });

  console.log('Screenshots saved successfully');
});