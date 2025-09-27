const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004', {
    waitUntil: 'domcontentloaded',
    timeout: 15000
  });

  // Wait for content
  await page.waitForTimeout(3000);

  console.log('\n=== MOBILE HEIGHT CHECK (AFTER FIXES) ===\n');

  // Get section heights
  const sectionHeights = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const heights = [];

    sections.forEach(section => {
      const text = section.textContent || '';
      let name = 'Unknown';

      if (text.includes('Be the Parent')) name = 'Hero';
      else if (text.includes('Client Success') || text.includes('Real Results')) name = 'Testimonials';
      else if (text.includes('Online Package')) name = 'OnlinePackage';
      else if (text.includes('Choose Your')) name = 'Pricing';
      else if (text.includes('Leah Fowler')) name = 'About';
      else if (text.includes('FAQ')) name = 'FAQ';
      else if (text.includes('Contact')) name = 'Contact';

      const rect = section.getBoundingClientRect();
      heights.push({
        name,
        height: Math.round(rect.height)
      });
    });

    return {
      sections: heights,
      totalHeight: Math.round(document.body.scrollHeight)
    };
  });

  console.log('Section Heights:');
  sectionHeights.sections.forEach(s => {
    const status = s.height > 2000 ? '❌' :
                   s.height > 1000 ? '⚠️' :
                   '✅';
    console.log(`  ${s.name}: ${s.height}px ${status}`);
  });

  console.log(`\nTotal Page Height: ${sectionHeights.totalHeight}px`);

  const improvement = 30466 - sectionHeights.totalHeight; // Original height was 30466px
  if (improvement > 0) {
    console.log(`\n✅ HEIGHT REDUCED BY ${improvement}px (${Math.round(improvement/30466*100)}%)`);
  }

  await browser.close();
  process.exit(0);
})();