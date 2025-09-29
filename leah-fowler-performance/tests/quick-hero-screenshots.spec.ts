import { test } from '@playwright/test';

test.describe('Hero Section Screenshots', () => {
  test('Capture hero at all viewports', async ({ browser }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      try {
        console.log(`Testing ${viewport.name} at ${viewport.width}px...`);

        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

        // Wait for content to be visible
        await page.waitForTimeout(2000);

        // Take screenshot
        await page.screenshot({
          path: `tests/screenshots/hero-${viewport.name}-${viewport.width}px.png`
        });

        console.log(`✓ Screenshot saved: hero-${viewport.name}-${viewport.width}px.png`);

        // Check layout information
        const layoutInfo = await page.evaluate(() => {
          // Find the main hero container
          const hero = document.querySelector('section') || document.querySelector('[class*="hero"]') || document.querySelector('main > div');
          if (!hero) return { error: 'Hero not found' };

          // Check for image
          const img = hero.querySelector('img');
          const imgInfo = img ? {
            visible: img.offsetParent !== null,
            src: img.src,
            position: window.getComputedStyle(img.parentElement || img).position
          } : null;

          // Check for heading
          const heading = hero.querySelector('h1');
          const headingInfo = heading ? {
            text: heading.textContent,
            fontSize: window.getComputedStyle(heading).fontSize,
            visible: heading.offsetParent !== null
          } : null;

          // Check container layout
          const containerStyle = window.getComputedStyle(hero);

          return {
            display: containerStyle.display,
            flexDirection: containerStyle.flexDirection,
            gridTemplateColumns: containerStyle.gridTemplateColumns,
            image: imgInfo,
            heading: headingInfo
          };
        });

        console.log(`Layout info for ${viewport.name}:`, JSON.stringify(layoutInfo, null, 2));

      } catch (error) {
        console.error(`Error capturing ${viewport.name}:`, error);
      } finally {
        await context.close();
      }
    }
  });
});