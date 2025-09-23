import { test, expect } from '@playwright/test';

test.describe('About Section Analysis', () => {
  test('Capture current layout issues', async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');

    // Wait for the about section to be visible
    const aboutSection = await page.locator('section:has-text("YOUR FAMILY FITNESS COACH")').first();
    await aboutSection.scrollIntoViewIfNeeded();

    // Take screenshots at different viewports
    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Wait for layout to settle

      // Screenshot the about section
      await aboutSection.screenshot({
        path: `tests/ui-ux-inspection/screenshots/about-section-before-${viewport.name}.png`
      });

      // Log dimensions and computed styles
      const boundingBox = await aboutSection.boundingBox();
      console.log(`${viewport.name} dimensions:`, boundingBox);

      // Check for text overflow
      const textElements = await aboutSection.locator('h1, h2, h3, p').all();
      for (const element of textElements) {
        const isOverflowing = await element.evaluate((el) => {
          return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        });
        if (isOverflowing) {
          const text = await element.textContent();
          console.log(`Text overflow detected in ${viewport.name}: "${text?.substring(0, 50)}..."`);
        }
      }

      // Check spacing issues
      const spacing = await aboutSection.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          padding: styles.padding,
          margin: styles.margin,
          gap: styles.gap
        };
      });
      console.log(`${viewport.name} spacing:`, spacing);
    }

    // Analyze typography hierarchy
    const headings = await aboutSection.locator('h1, h2, h3').all();
    for (const heading of headings) {
      const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);
      const text = await heading.textContent();
      console.log(`Heading: "${text}" - Size: ${fontSize}, Weight: ${fontWeight}`);
    }

    // Check credentials and stats layout
    const credentials = await aboutSection.locator('div:has-text("Mother of 3")').first();
    if (credentials) {
      const credBox = await credentials.boundingBox();
      console.log('Credentials section dimensions:', credBox);
    }

    const stats = await aboutSection.locator('div:has-text("500+ Mums Trained")').first();
    if (stats) {
      const statsBox = await stats.boundingBox();
      console.log('Stats section dimensions:', statsBox);
    }
  });
});