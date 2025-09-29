import { test } from '@playwright/test';

test.describe('Qualifications Dropdown', () => {
  test('Test qualifications dropdown functionality', async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Scroll to the About section
    await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Wait for the about section to be visible
    await page.waitForTimeout(1500);

    // Take screenshot of collapsed state
    await page.screenshot({
      path: 'qualifications-collapsed.png',
      fullPage: false
    });

    // Look for and click the "See All Qualifications" button
    const seeAllButton = page.getByRole('button', { name: /see all qualifications/i });
    await seeAllButton.waitFor({ state: 'visible', timeout: 5000 });

    // Click the button to expand
    await seeAllButton.click();

    // Wait for the dropdown animation to complete
    await page.waitForTimeout(500);

    // Take screenshot of expanded state
    await page.screenshot({
      path: 'qualifications-expanded.png',
      fullPage: false
    });

    console.log('✅ Screenshots saved:');
    console.log('   - qualifications-collapsed.png');
    console.log('   - qualifications-expanded.png');

    // Verify the dropdown content is visible
    const dropdown = page.locator('[data-state="open"]').first();
    if (await dropdown.isVisible()) {
      console.log('✅ Dropdown expanded successfully');

      // Check for qualifications column
      const qualificationsColumn = page.locator('text=/BSc.*Sport.*Science/i');
      if (await qualificationsColumn.isVisible()) {
        console.log('✅ Qualifications column visible');
      }

      // Check for CPD column
      const cpdColumn = page.locator('text=/Metabolic.*Conditioning/i');
      if (await cpdColumn.isVisible()) {
        console.log('✅ CPD column visible');
      }
    }

    // Test closing the dropdown
    await seeAllButton.click();
    await page.waitForTimeout(500);

    const dropdownClosed = await page.locator('[data-state="closed"]').count() > 0;
    if (dropdownClosed) {
      console.log('✅ Dropdown closed successfully');
    }
  });
});