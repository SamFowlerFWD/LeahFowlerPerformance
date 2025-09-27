const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004');
  await page.waitForLoadState('networkidle');

  console.log('\n=== VERIFYING MOBILE SECTION HEIGHT FIXES ===\n');

  // Get all sections and their heights
  const sections = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const results = [];

    sections.forEach((section, index) => {
      const heading = section.querySelector('h1, h2, h3');
      const text = section.textContent || '';
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();

      let sectionName = 'Unknown Section';
      if (text.includes('Be the Parent')) sectionName = 'Hero Section';
      else if (text.includes('Client Success') || text.includes('Real Results')) sectionName = 'Testimonials';
      else if (text.includes('Online Package')) sectionName = 'Online Package';
      else if (text.includes('Choose Your')) sectionName = 'Pricing';
      else if (text.includes('Leah Fowler') || text.includes('About')) sectionName = 'About';
      else if (text.includes('FAQ') || text.includes('Questions')) sectionName = 'FAQ';
      else if (text.includes('Contact') || text.includes('Get in Touch')) sectionName = 'Contact';

      results.push({
        index,
        name: sectionName,
        heading: heading?.textContent || 'No heading',
        height: rect.height,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      });
    });

    return results;
  });

  console.log(`Found ${sections.length} sections\n`);
  console.log('Section Heights After Fixes:\n');

  let totalHeight = 0;
  let problematicSections = [];

  sections.forEach(section => {
    const heightStatus = section.height > 2000 ? '🚨 STILL TOO TALL' :
                         section.height > 1000 ? '⚠️ Could be optimized' :
                         '✅ Good';

    console.log(`${section.name}:`);
    console.log(`  Height: ${section.height.toFixed(0)}px ${heightStatus}`);
    console.log(`  Padding: ${section.paddingTop} / ${section.paddingBottom}`);
    console.log(`  Visibility: display=${section.display}, visibility=${section.visibility}, opacity=${section.opacity}`);

    totalHeight += section.height;

    if (section.height > 2000) {
      problematicSections.push({
        name: section.name,
        height: section.height
      });
    }

    console.log('');
  });

  console.log(`\nTotal page height: ${totalHeight.toFixed(0)}px`);

  if (problematicSections.length > 0) {
    console.log('\n⚠️ SECTIONS STILL NEEDING ATTENTION:');
    problematicSections.forEach(s => {
      console.log(`  - ${s.name}: ${s.height.toFixed(0)}px`);
    });
  } else {
    console.log('\n✅ ALL SECTIONS HAVE REASONABLE HEIGHTS!');
  }

  // Check if all content is visible
  const contentVisibility = await page.evaluate(() => {
    const searches = [
      'Online Package',
      'Choose Your',
      'About',
      'FAQ',
      'Contact'
    ];

    const results = [];
    searches.forEach(search => {
      const found = document.body.textContent?.includes(search);
      results.push({ search, found });
    });

    return results;
  });

  console.log('\n=== CONTENT VISIBILITY CHECK ===');
  contentVisibility.forEach(item => {
    console.log(`${item.search}: ${item.found ? '✅ Visible' : '❌ Not found'}`);
  });

  // Take screenshots at different scroll positions
  console.log('\n=== TAKING SCREENSHOTS ===');

  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-fixed-full.png',
    fullPage: true
  });
  console.log('Full page screenshot saved');

  // Scroll to each major section and screenshot
  const scrollPositions = [
    { name: 'testimonials', y: 1000 },
    { name: 'online-package', y: 3000 },
    { name: 'pricing', y: 6000 },
    { name: 'about', y: 9000 },
    { name: 'faq', y: 12000 }
  ];

  for (const pos of scrollPositions) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), pos.y);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-${pos.name}.png`
    });
    console.log(`Screenshot saved for ${pos.name} section`);
  }

  console.log('\nBrowser will stay open for manual inspection.');
})();