const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('🔍 Navigating to http://localhost:3008...');
    await page.goto('http://localhost:3008', { waitUntil: 'networkidle', timeout: 30000 });

    console.log('📍 Scrolling to About section...');
    // Scroll to the About section
    await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -100); // Adjust for any fixed header
      }
    });

    // Wait for the section to be visible
    await page.waitForTimeout(2000);

    console.log('📸 Taking screenshot of collapsed state...');
    await page.screenshot({
      path: 'qualifications-collapsed.png',
      fullPage: false
    });
    console.log('✅ Saved: qualifications-collapsed.png');

    // Find and click the "See All Qualifications" button
    console.log('🔍 Looking for "See All Qualifications" button...');

    // Try multiple selectors
    const buttonSelectors = [
      'button:has-text("See All Qualifications")',
      'button:has-text("See all qualifications")',
      'button:has-text("SEE ALL QUALIFICATIONS")',
      '[role="button"]:has-text("qualifications")',
      'text=/see.*all.*qualifications/i'
    ];

    let button = null;
    for (const selector of buttonSelectors) {
      try {
        button = await page.locator(selector).first();
        if (await button.isVisible({ timeout: 1000 })) {
          console.log(`✅ Found button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!button || !(await button.isVisible())) {
      console.log('❌ Could not find "See All Qualifications" button');
      console.log('Available buttons on page:');
      const buttons = await page.locator('button').allTextContents();
      buttons.forEach((text, i) => {
        if (text.trim()) console.log(`  Button ${i}: "${text.trim()}"`);
      });
    } else {
      console.log('🖱️ Clicking button to expand dropdown...');
      await button.click();

      // Wait for animation
      await page.waitForTimeout(1000);

      console.log('📸 Taking screenshot of expanded state...');
      await page.screenshot({
        path: 'qualifications-expanded.png',
        fullPage: false
      });
      console.log('✅ Saved: qualifications-expanded.png');

      // Check if dropdown content is visible
      const dropdownContent = await page.locator('[data-state="open"], .expanded, .dropdown-content').first();
      if (await dropdownContent.count() > 0) {
        console.log('✅ Dropdown is expanded');

        // Check for content
        const hasQualifications = await page.locator('text=/BSc|Bachelor|Degree/i').count() > 0;
        const hasCPD = await page.locator('text=/CPD|Metabolic|Training/i').count() > 0;

        if (hasQualifications) console.log('✅ Qualifications content visible');
        if (hasCPD) console.log('✅ CPD content visible');
      }

      // Test closing
      console.log('🖱️ Clicking button again to close...');
      await button.click();
      await page.waitForTimeout(1000);

      const isCollapsed = await page.locator('[data-state="closed"], .collapsed').count() > 0 ||
                         await page.locator('[data-state="open"], .expanded').count() === 0;

      if (isCollapsed) {
        console.log('✅ Dropdown closed successfully');
      }
    }

    console.log('\n📋 Test Summary:');
    console.log('Screenshots saved in the current directory:');
    console.log('  - qualifications-collapsed.png');
    console.log('  - qualifications-expanded.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();