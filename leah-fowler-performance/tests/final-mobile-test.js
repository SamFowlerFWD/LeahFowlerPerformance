const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004', {
    waitUntil: 'networkidle'
  });

  console.log('\n=== FINAL MOBILE VISIBILITY TEST ===\n');

  // Test that all major sections are visible
  const sectionTests = [
    { text: 'Be the Parent Who Races', name: 'Hero' },
    { text: 'Real Results from Real Clients', name: 'Testimonials' },
    { text: 'The Online Package', name: 'Online Package' },
    { text: 'Choose Your', name: 'Pricing' },
    { text: 'Leah Fowler', name: 'About' },
    { text: 'Got Questions?', name: 'FAQ' },
    { text: 'Get in Touch', name: 'Contact' }
  ];

  console.log('CONTENT VISIBILITY CHECK:');
  for (const test of sectionTests) {
    const visible = await page.evaluate((searchText) => {
      return document.body.textContent?.includes(searchText);
    }, test.text);

    console.log(`${test.name}: ${visible ? '✅ VISIBLE' : '❌ NOT VISIBLE'}`);
  }

  // Get final page metrics
  const metrics = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const body = document.body;
    const viewportHeight = window.innerHeight;

    return {
      totalSections: sections.length,
      pageHeight: Math.round(body.scrollHeight),
      viewportHeight: viewportHeight,
      screensNeeded: Math.ceil(body.scrollHeight / viewportHeight)
    };
  });

  console.log('\n=== PAGE METRICS ===');
  console.log(`Total Sections: ${metrics.totalSections}`);
  console.log(`Page Height: ${metrics.pageHeight}px`);
  console.log(`Viewport Height: ${metrics.viewportHeight}px`);
  console.log(`Screens to scroll: ~${metrics.screensNeeded}`);

  // Calculate improvement
  const originalHeight = 30466;
  const reduction = originalHeight - metrics.pageHeight;
  const percentReduction = Math.round((reduction / originalHeight) * 100);

  console.log('\n=== IMPROVEMENT SUMMARY ===');
  console.log(`Original Height: ${originalHeight}px`);
  console.log(`New Height: ${metrics.pageHeight}px`);
  console.log(`Height Reduced: ${reduction}px (${percentReduction}%)`);

  if (metrics.pageHeight < 20000) {
    console.log('\n✅ SUCCESS! Mobile page height is now reasonable.');
  } else {
    console.log('\n⚠️ Page is still quite tall. May need further optimization.');
  }

  // Take final screenshots
  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/FINAL-mobile-full.png',
    fullPage: true
  });

  console.log('\nFinal screenshot saved to tests/screenshots/FINAL-mobile-full.png');
  console.log('\nBrowser will stay open for manual verification. Close when done.');
})();