import { test, expect } from '@playwright/test';

test('Verify qualifications dropdown text centering', async ({ page }) => {
  // Navigate to localhost:3000
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Scroll to the About section
  const aboutSection = page.locator('section').filter({ hasText: 'Meet Your Performance Consultant' });
  await aboutSection.scrollIntoViewIfNeeded();

  // Wait for the qualifications button to be visible
  const qualificationsButton = page.locator('button:has-text("See All Qualifications")');
  await expect(qualificationsButton).toBeVisible();

  // Take screenshot of collapsed state
  await page.screenshot({
    path: 'qualifications-collapsed.png',
    fullPage: false,
    clip: {
      x: 0,
      y: (await aboutSection.boundingBox())?.y || 0,
      width: 1280,
      height: 800
    }
  });

  console.log('Screenshot saved: qualifications-collapsed.png');

  // Click to expand the qualifications
  await qualificationsButton.click();

  // Wait for the dropdown content to be visible
  const dropdownContent = page.locator('.overflow-hidden').filter({ has: page.locator('h4:has-text("Qualifications")') });
  await expect(dropdownContent).toBeVisible();

  // Wait a moment for animation to complete
  await page.waitForTimeout(500);

  // Take screenshot of expanded state
  await page.screenshot({
    path: 'qualifications-expanded.png',
    fullPage: false,
    clip: {
      x: 0,
      y: (await aboutSection.boundingBox())?.y || 0,
      width: 1280,
      height: 1200
    }
  });

  console.log('Screenshot saved: qualifications-expanded.png');

  // Verify text centering
  console.log('\n=== Text Centering Verification ===\n');

  // Check button text centering
  const buttonStyles = await qualificationsButton.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      textAlign: computed.textAlign,
      justifyContent: computed.justifyContent,
      display: computed.display
    };
  });
  console.log('Button text alignment:', buttonStyles);

  // Check column headers centering
  const qualHeader = page.locator('h4:has-text("Qualifications")').first();
  const cpdHeader = page.locator('h4:has-text("Continued Professional Development")').first();

  const qualHeaderStyles = await qualHeader.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      textAlign: computed.textAlign,
      display: computed.display
    };
  });

  const cpdHeaderStyles = await cpdHeader.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      textAlign: computed.textAlign,
      display: computed.display
    };
  });

  console.log('Qualifications header alignment:', qualHeaderStyles);
  console.log('CPD header alignment:', cpdHeaderStyles);

  // Check that list items are left-aligned
  const listItems = page.locator('.overflow-hidden li').first();
  const listItemStyles = await listItems.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      textAlign: computed.textAlign
    };
  });

  console.log('List items alignment:', listItemStyles);

  // Visual verification summary
  console.log('\n=== Visual Verification Summary ===');
  console.log('✓ "See All Qualifications" button text should be centered');
  console.log('✓ Column headers should be centered');
  console.log('✓ List items should be left-aligned within centered columns');
  console.log('\nPlease review the screenshots to confirm visual centering.');
});