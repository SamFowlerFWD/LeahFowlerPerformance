import { test, expect } from '@playwright/test';

test('Check Apply Page for Partial Text', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3005/apply');
  await page.waitForLoadState('networkidle');

  // Take a screenshot for visual inspection
  await page.screenshot({
    path: 'test-results/apply-page-check.png',
    fullPage: true
  });

  // Look for any elements with just "A" or "C" as their text content
  const suspiciousElements = await page.evaluate(() => {
    const elements = [];
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent?.trim();
      // Check for single letters or very short text that shouldn't be there
      if (text && text.length <= 2 && !el.querySelector('*') && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
        const styles = window.getComputedStyle(el);
        if (styles.fontSize && parseInt(styles.fontSize) > 20) { // Large text
          elements.push({
            tag: el.tagName,
            text: text,
            fontSize: styles.fontSize,
            class: el.className,
            parent: el.parentElement?.tagName,
            parentClass: el.parentElement?.className
          });
        }
      }
    });
    return elements;
  });

  console.log('Suspicious elements found:', suspiciousElements);

  // Check specifically for the Card component area
  const cardHeader = await page.locator('[data-slot="card-header"]').first();
  if (await cardHeader.count() > 0) {
    const headerBounds = await cardHeader.boundingBox();
    console.log('Card header bounds:', headerBounds);

    const headerText = await cardHeader.textContent();
    console.log('Card header text content:', headerText);
  }

  // Highlight any single letter elements
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length === 1 && !el.querySelector('*')) {
        const styles = window.getComputedStyle(el);
        if (parseInt(styles.fontSize) > 20) {
          (el as HTMLElement).style.border = '3px solid red';
          (el as HTMLElement).style.backgroundColor = 'yellow';
          console.warn('Found single letter element:', {
            text,
            element: el,
            parent: el.parentElement
          });
        }
      }
    });
  });

  // Take another screenshot with highlights
  await page.screenshot({
    path: 'test-results/apply-page-highlighted.png',
    fullPage: true
  });

  // Check if the issue is still present
  expect(suspiciousElements.filter(el => el.text === 'A' || el.text === 'C').length).toBe(0);
});