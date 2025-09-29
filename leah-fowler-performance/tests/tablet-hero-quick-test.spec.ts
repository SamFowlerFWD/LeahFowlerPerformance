import { test } from '@playwright/test';

test('Quick tablet hero check at 768px', async ({ page }) => {
  // Set viewport to exactly 768px width
  await page.setViewportSize({ width: 768, height: 1024 });

  // Navigate to the homepage
  await page.goto('http://localhost:3002');

  // Wait for hero section
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/screenshots/tablet-768px-fixed.png',
    fullPage: false
  });

  console.log('Screenshot saved to: screenshots/tablet-768px-fixed.png');
});