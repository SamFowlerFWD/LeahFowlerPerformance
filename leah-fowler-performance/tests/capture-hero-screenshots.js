const { chromium } = require('@playwright/test');

async function captureScreenshots() {
  const browser = await chromium.launch();

  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const viewport of viewports) {
    console.log(`\nCapturing ${viewport.name} at ${viewport.width}px...`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

      // Wait for content to stabilize
      await page.waitForTimeout(2000);

      // Take full viewport screenshot
      const filename = `tests/screenshots/hero-${viewport.name}-${viewport.width}px.png`;
      await page.screenshot({ path: filename });
      console.log(`✓ Saved: ${filename}`);

      // Analyze layout
      const analysis = await page.evaluate(() => {
        const sections = document.querySelectorAll('section');
        const firstSection = sections[0];

        if (!firstSection) return { error: 'No sections found' };

        // Check for image
        const img = firstSection.querySelector('img');
        const hasImage = !!img;

        // Check for heading
        const h1 = firstSection.querySelector('h1');
        const hasHeading = !!h1;

        // Check layout type
        const containerStyle = window.getComputedStyle(firstSection.firstElementChild || firstSection);
        const isGrid = containerStyle.display === 'grid';
        const isFlex = containerStyle.display === 'flex';

        // Check for overlay indicators
        const hasAbsolute = Array.from(firstSection.querySelectorAll('*')).some(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'absolute' && el.querySelector('h1');
        });

        return {
          hasImage,
          hasHeading,
          headingText: h1?.textContent?.trim(),
          headingFontSize: h1 ? window.getComputedStyle(h1).fontSize : null,
          layout: isGrid ? 'grid' : isFlex ? 'flex' : 'other',
          isOverlay: hasAbsolute,
          containerDisplay: containerStyle.display,
          imagePosition: img ? window.getComputedStyle(img.parentElement || img).position : null
        };
      });

      console.log('Layout analysis:', analysis);

      // Determine layout type
      if (analysis.isOverlay) {
        console.log(`→ ${viewport.name} is using OVERLAY layout (text over image)`);
      } else if (analysis.layout === 'grid' || analysis.layout === 'flex') {
        console.log(`→ ${viewport.name} is using SIDE-BY-SIDE layout (${analysis.layout})`);
      }

    } catch (error) {
      console.error(`Error for ${viewport.name}:`, error.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
}

captureScreenshots().catch(console.error);