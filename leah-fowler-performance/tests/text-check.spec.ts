import { test, expect } from '@playwright/test';

test('Check if text is rendering on homepage', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3000');

  // Wait for initial load
  await page.waitForLoadState('networkidle');

  // Check if page has any visible text
  const bodyText = await page.textContent('body');
  console.log('Body text length:', bodyText?.length || 0);

  // Check for specific text elements that should be present
  const hasHeading = await page.locator('h1, h2, h3, h4, h5, h6').count();
  console.log('Number of headings found:', hasHeading);

  const hasParagraphs = await page.locator('p').count();
  console.log('Number of paragraphs found:', hasParagraphs);

  const hasButtons = await page.locator('button').count();
  console.log('Number of buttons found:', hasButtons);

  // Check for specific expected text
  const expectedTexts = [
    'Leah Fowler',
    'Performance',
    'Transform',
    'Norfolk'
  ];

  for (const text of expectedTexts) {
    const hasText = await page.getByText(text, { exact: false }).count();
    console.log(`Text "${text}" found:`, hasText > 0 ? 'Yes' : 'No');
  }

  // Get all visible text content
  const visibleText = await page.evaluate(() => {
    const elements = document.querySelectorAll('*:not(script):not(style)');
    const texts: string[] = [];
    elements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && el instanceof HTMLElement && el.offsetHeight > 0) {
        texts.push(text.substring(0, 100)); // First 100 chars
      }
    });
    return texts.slice(0, 20); // First 20 visible text elements
  });

  console.log('\nFirst 20 visible text elements:');
  visibleText.forEach((text, index) => {
    console.log(`${index + 1}. ${text}`);
  });

  // Check if there's meaningful content
  expect(bodyText?.length).toBeGreaterThan(100);
  expect(hasHeading).toBeGreaterThan(0);
});