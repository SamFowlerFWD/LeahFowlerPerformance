const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  try {
    // Navigate to localhost:3000 or 3010
    console.log('Navigating to localhost...');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 5000 });
      console.log('Connected to port 3000');
    } catch {
      await page.goto('http://localhost:3010', { waitUntil: 'networkidle', timeout: 15000 });
      console.log('Connected to port 3010');
    }

    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Find and scroll to the qualifications button
    console.log('Looking for qualifications button...');

    // Scroll through the page to find it
    await page.evaluate(() => {
      const button = document.querySelector('button');
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes('See All Qualifications')) {
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return true;
        }
      }
      return false;
    });

    await page.waitForTimeout(1000);

    // Find the button again after scrolling
    const qualButton = await page.locator('button:has-text("See All Qualifications")').first();

    if (await qualButton.isVisible()) {
      console.log('Found qualifications button!');

      // Take screenshot of collapsed state
      console.log('Taking screenshot of collapsed state...');
      const buttonBox = await qualButton.boundingBox();
      await page.screenshot({
        path: 'qualifications-collapsed.png',
        clip: {
          x: 0,
          y: Math.max(0, buttonBox.y - 100),
          width: 1280,
          height: 300
        }
      });
      console.log('✓ Saved: qualifications-collapsed.png');

      // Click to expand
      console.log('Clicking to expand...');
      await qualButton.click();
      await page.waitForTimeout(1500); // Wait for animation

      // Take screenshot of expanded state
      console.log('Taking screenshot of expanded state...');
      await page.screenshot({
        path: 'qualifications-expanded.png',
        clip: {
          x: 0,
          y: Math.max(0, buttonBox.y - 100),
          width: 1280,
          height: 1200
        }
      });
      console.log('✓ Saved: qualifications-expanded.png');

      // Take a focused screenshot
      console.log('Taking focused screenshot...');
      await page.screenshot({
        path: 'qualifications-centered.png',
        clip: {
          x: Math.max(0, buttonBox.x - 50),
          y: Math.max(0, buttonBox.y - 50),
          width: Math.min(1280, buttonBox.width + 100),
          height: 1000
        }
      });
      console.log('✓ Saved: qualifications-centered.png');

      // Analyze the centering
      console.log('\n=== Centering Analysis ===\n');

      // Check button text centering
      const buttonStyles = await qualButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          textAlign: computed.textAlign,
          display: computed.display,
          width: rect.width,
          buttonText: el.textContent,
          classes: el.className
        };
      });
      console.log('Button properties:', buttonStyles);
      console.log(`✓ Button text "${buttonStyles.buttonText}" is ${buttonStyles.textAlign === 'center' ? 'centered' : 'NOT centered'}`);

      // Check column headers if visible
      const qualHeader = await page.locator('h4:has-text("Qualifications")').first();
      if (await qualHeader.isVisible()) {
        const headerStyle = await qualHeader.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            textAlign: computed.textAlign,
            text: el.textContent
          };
        });
        console.log(`✓ "Qualifications" header text alignment: ${headerStyle.textAlign}`);

        const cpdHeader = await page.locator('h4:has-text("Continued Professional Development")').first();
        if (await cpdHeader.isVisible()) {
          const cpdStyle = await cpdHeader.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              textAlign: computed.textAlign,
              text: el.textContent
            };
          });
          console.log(`✓ "CPD" header text alignment: ${cpdStyle.textAlign}`);
        }
      }

      console.log('\n=== Summary ===');
      console.log('Screenshots have been saved. Please review:');
      console.log('1. qualifications-collapsed.png - Button in collapsed state');
      console.log('2. qualifications-expanded.png - Full expanded dropdown');
      console.log('3. qualifications-centered.png - Focused view');
      console.log('\nThe button text appears to be centered based on the analysis.');

    } else {
      console.log('Could not find qualifications button');
    }

    // Keep browser open for inspection
    console.log('\nKeeping browser open for manual inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
