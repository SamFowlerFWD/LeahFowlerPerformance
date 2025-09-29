const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Navigate to the site
    await page.goto('http://localhost:3009', { waitUntil: 'networkidle' });
    console.log('✓ Navigated to localhost:3009');

    // Wait for the page to load
    await page.waitForTimeout(2000);

    // Try different selectors to find the About section
    let aboutSection = null;

    // Try finding by text first
    try {
      aboutSection = await page.locator('section:has(h2:text("About Leah"))').first();
      if (await aboutSection.isVisible()) {
        console.log('✓ Found About section by h2 header');
      }
    } catch (e) {
      console.log('Could not find section by h2');
    }

    // Try alternative selector
    if (!aboutSection || !(await aboutSection.isVisible())) {
      try {
        aboutSection = await page.locator('#about').first();
        if (await aboutSection.isVisible()) {
          console.log('✓ Found About section by ID');
        }
      } catch (e) {
        console.log('Could not find section by ID');
      }
    }

    // Try another alternative
    if (!aboutSection || !(await aboutSection.isVisible())) {
      try {
        aboutSection = await page.locator('section').filter({ hasText: 'About Leah' }).first();
        if (await aboutSection.isVisible()) {
          console.log('✓ Found About section by filter');
        }
      } catch (e) {
        console.log('Could not find section by filter');
      }
    }

    // Scroll to the About section if found
    if (aboutSection && await aboutSection.isVisible()) {
      await aboutSection.scrollIntoViewIfNeeded();
      console.log('✓ Scrolled to About section');
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️ Could not find About section, continuing anyway...');
    }

    // Look for the qualifications button with multiple selector approaches
    let qualButton = null;

    try {
      // First try exact text match
      qualButton = await page.locator('button:text-is("See All Qualifications")').first();
      if (!(await qualButton.isVisible())) {
        // Try partial text match
        qualButton = await page.locator('button:has-text("See All Qualifications")').first();
      }
      if (!(await qualButton.isVisible())) {
        // Try finding any button with "Qualifications"
        qualButton = await page.locator('button:has-text("Qualifications")').first();
      }
    } catch (e) {
      console.log('Error finding button:', e.message);
    }

    if (qualButton && await qualButton.isVisible()) {
      await qualButton.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await qualButton.click();
      console.log('✓ Clicked qualifications button');

      // Wait for the dropdown to expand
      await page.waitForTimeout(1500);

      // Scroll to ensure the expanded content is visible
      await qualButton.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ Could not find qualifications button');
    }

    // Take the screenshot
    const screenshotPath = path.join(process.cwd(), 'qualifications-centered.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });
    console.log(`✓ Screenshot saved to: ${screenshotPath}`);

    // Check for various text elements to verify centering
    try {
      const elements = {
        button: await page.locator('button:has-text("Qualifications")').first(),
        qualHeader: await page.locator('h4:has-text("Qualifications")').first(),
        cpdHeader: await page.locator('h4:has-text("Continued Professional Development")').first(),
      };

      for (const [name, element] of Object.entries(elements)) {
        if (element && await element.isVisible()) {
          const classes = await element.getAttribute('class');
          console.log(`${name} classes:`, classes);
        }
      }
    } catch (e) {
      console.log('Could not check element classes:', e.message);
    }

    // Wait a bit before closing to see the result
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('Error during verification:', error);

    // Still take a screenshot to see what's on the page
    try {
      const errorScreenshotPath = path.join(process.cwd(), 'qualifications-error.png');
      await page.screenshot({
        path: errorScreenshotPath,
        fullPage: true
      });
      console.log(`Error screenshot saved to: ${errorScreenshotPath}`);
    } catch (screenshotError) {
      console.error('Could not take error screenshot:', screenshotError);
    }
  } finally {
    await browser.close();
    console.log('✓ Browser closed');
  }
})();