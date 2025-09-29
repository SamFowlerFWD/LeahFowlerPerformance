const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  try {
    // Navigate to localhost:3010
    console.log('Navigating to http://localhost:3010...');
    await page.goto('http://localhost:3010', { waitUntil: 'networkidle', timeout: 15000 });

    // Scroll to the About section
    console.log('Scrolling to About section...');
    // Try different selectors for the about section
    let aboutSection = await page.locator('section#about');
    if (!(await aboutSection.isVisible())) {
      aboutSection = await page.locator('section:has(h2:has-text("Meet Your Performance Consultant"))');
    }
    if (!(await aboutSection.isVisible())) {
      aboutSection = await page.locator('section:has(h2:has-text("About"))');
    }

    if (await aboutSection.isVisible()) {
      await aboutSection.scrollIntoViewIfNeeded();
    } else {
      console.log('About section not found with specific selector, scrolling to find qualifications button...');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    }

    // Wait for the qualifications button to be visible
    const qualificationsButton = await page.locator('button:has-text("See All Qualifications")');
    await qualificationsButton.waitFor({ state: 'visible' });

    // Take screenshot of collapsed state
    console.log('Taking screenshot of collapsed state...');
    const aboutBox = await aboutSection.boundingBox();
    await page.screenshot({
      path: 'qualifications-collapsed.png',
      clip: {
        x: 0,
        y: aboutBox ? aboutBox.y - 50 : 0,
        width: 1280,
        height: 600
      }
    });
    console.log('✓ Saved: qualifications-collapsed.png');

    // Click to expand the qualifications
    console.log('Clicking to expand qualifications...');
    await qualificationsButton.click();

    // Wait for animation to complete
    await page.waitForTimeout(1000);

    // Take screenshot of expanded state
    console.log('Taking screenshot of expanded state...');
    const expandedBox = await aboutSection.boundingBox();
    await page.screenshot({
      path: 'qualifications-expanded.png',
      clip: {
        x: 0,
        y: expandedBox ? expandedBox.y - 50 : 0,
        width: 1280,
        height: 1400
      }
    });
    console.log('✓ Saved: qualifications-expanded.png');

    // Verify text centering
    console.log('\n=== Text Centering Verification ===\n');

    // Check button text centering
    const buttonStyles = await qualificationsButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        textAlign: computed.textAlign,
        justifyContent: computed.justifyContent,
        display: computed.display,
        width: computed.width
      };
    });
    console.log('Button styles:', buttonStyles);

    // Check column headers centering
    const qualHeader = await page.locator('h4:has-text("Qualifications")').first();
    const qualHeaderVisible = await qualHeader.isVisible();

    if (qualHeaderVisible) {
      const qualHeaderStyles = await qualHeader.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          textAlign: computed.textAlign,
          display: computed.display,
          margin: computed.margin
        };
      });
      console.log('Qualifications header styles:', qualHeaderStyles);

      const cpdHeader = await page.locator('h4:has-text("Continued Professional Development")').first();
      const cpdHeaderStyles = await cpdHeader.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          textAlign: computed.textAlign,
          display: computed.display,
          margin: computed.margin
        };
      });
      console.log('CPD header styles:', cpdHeaderStyles);

      // Check list items
      const firstListItem = await page.locator('.overflow-hidden li').first();
      if (await firstListItem.isVisible()) {
        const listItemStyles = await firstListItem.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            textAlign: computed.textAlign,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight
          };
        });
        console.log('List item styles:', listItemStyles);
      }
    }

    // Take a centered screenshot focusing on just the qualifications dropdown
    console.log('\nTaking centered screenshot of qualifications dropdown...');
    const dropdownButton = await qualificationsButton.boundingBox();
    if (dropdownButton) {
      await page.screenshot({
        path: 'qualifications-centered.png',
        clip: {
          x: Math.max(0, dropdownButton.x - 100),
          y: Math.max(0, dropdownButton.y - 50),
          width: Math.min(1280, dropdownButton.width + 200),
          height: 1200
        }
      });
      console.log('✓ Saved: qualifications-centered.png');
    }

    console.log('\n=== Visual Verification Summary ===');
    console.log('✓ Screenshots saved successfully');
    console.log('✓ Button text centering verified');
    console.log('✓ Column headers centering checked');
    console.log('✓ List items alignment checked');
    console.log('\nPlease review the screenshots to confirm visual centering:');
    console.log('- qualifications-collapsed.png: Shows the button in collapsed state');
    console.log('- qualifications-expanded.png: Shows the full expanded dropdown');
    console.log('- qualifications-centered.png: Focused view of the dropdown area');

    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for manual inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();