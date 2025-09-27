const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004');
  await page.waitForLoadState('networkidle');

  console.log('\n=== CHECKING MOBILE SECTIONS ===\n');

  // Get all sections
  const sections = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const results = [];

    sections.forEach((section, index) => {
      const heading = section.querySelector('h1, h2, h3');
      const text = section.textContent || '';
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();

      results.push({
        index,
        heading: heading?.textContent || 'No heading',
        hasOnlinePackage: text.includes('Online Package'),
        hasChooseYour: text.includes('Choose Your'),
        hasAbout: text.includes('About'),
        hasFAQ: text.includes('FAQ') || text.includes('Frequently'),
        hasContact: text.includes('Contact') || text.includes('Get in Touch'),
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        height: rect.height,
        width: rect.width,
        top: rect.top,
        className: section.className
      });
    });

    return results;
  });

  console.log(`Found ${sections.length} sections total\n`);

  sections.forEach(section => {
    console.log(`Section ${section.index}: ${section.heading}`);
    console.log(`  Class: ${section.className}`);
    console.log(`  Position: top=${section.top}px, size=${section.width}x${section.height}px`);
    console.log(`  Styles: display=${section.display}, visibility=${section.visibility}, opacity=${section.opacity}`);

    if (section.hasOnlinePackage) console.log('  ✓ Contains Online Package content');
    if (section.hasChooseYour) console.log('  ✓ Contains Pricing content');
    if (section.hasAbout) console.log('  ✓ Contains About content');
    if (section.hasFAQ) console.log('  ✓ Contains FAQ content');
    if (section.hasContact) console.log('  ✓ Contains Contact content');

    if (section.display === 'none' ||
        section.visibility === 'hidden' ||
        section.opacity === '0' ||
        section.height === 0) {
      console.log('  🚨 SECTION IS HIDDEN!');
    }

    console.log('');
  });

  // Check page height
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Total page height: ${pageHeight}px`);

  // Take full page screenshot
  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-full.png',
    fullPage: true
  });

  console.log('\nScreenshot saved to tests/screenshots/mobile-full.png');
  console.log('\nBrowser will stay open for inspection. Close manually when done.');
})();