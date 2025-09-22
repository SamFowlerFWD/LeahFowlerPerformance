import { test } from '@playwright/test';

test('Check what is visible on page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'current-state.png', fullPage: true });

  // Count visible elements
  const images = await page.locator('img:visible').count();
  const headings = await page.locator('h1:visible, h2:visible, h3:visible').count();
  const paragraphs = await page.locator('p:visible').count();
  const buttons = await page.locator('button:visible').count();

  console.log('=== VISIBLE ELEMENTS ===');
  console.log(`Images: ${images}`);
  console.log(`Headings: ${headings}`);
  console.log(`Paragraphs: ${paragraphs}`);
  console.log(`Buttons: ${buttons}`);

  // Check for any error messages in console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });

  // Get page title and first visible text
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Check what's in the viewport
  const viewport = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const visible = [];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight && rect.width > 0 && rect.height > 0) {
        const text = el.textContent?.trim();
        if (text && text.length > 0 && text.length < 100) {
          visible.push(text);
        }
      }
    }
    return visible.slice(0, 10);
  });

  console.log('\n=== VISIBLE TEXT IN VIEWPORT ===');
  viewport.forEach((text, i) => console.log(`${i + 1}. ${text}`));
});