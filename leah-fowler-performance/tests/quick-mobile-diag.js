const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log('\n=== QUICK MOBILE SECTION CHECK ===\n');

    // Just check if sections exist in DOM
    const sectionInfo = await page.evaluate(() => {
      const sections = [];

      // Check each component by searching for unique text
      const searches = [
        { name: 'Testimonials', text: 'Client Success Stories' },
        { name: 'Online Package', text: 'Online Package' },
        { name: 'Pricing', text: 'Choose Your' },
        { name: 'About', text: 'Meet Your Coach' },
        { name: 'FAQ', text: 'Frequently Asked' },
        { name: 'Contact', text: 'Get in Touch' }
      ];

      searches.forEach(search => {
        const elements = Array.from(document.querySelectorAll('*'));
        const found = elements.find(el => el.textContent?.includes(search.text));

        if (found) {
          const section = found.closest('section') || found.closest('div');
          if (section) {
            const styles = window.getComputedStyle(section);
            sections.push({
              name: search.name,
              found: true,
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              height: section.getBoundingClientRect().height,
              className: section.className
            });
          } else {
            sections.push({
              name: search.name,
              found: true,
              elementFound: true,
              sectionFound: false
            });
          }
        } else {
          sections.push({
            name: search.name,
            found: false
          });
        }
      });

      return sections;
    });

    sectionInfo.forEach(info => {
      console.log(`${info.name}:`);
      if (!info.found) {
        console.log('  ❌ NOT FOUND IN DOM');
      } else if (!info.sectionFound) {
        console.log('  ⚠️ Text found but no parent section');
      } else {
        console.log(`  ✓ Found`);
        console.log(`  Display: ${info.display}`);
        console.log(`  Visibility: ${info.visibility}`);
        console.log(`  Opacity: ${info.opacity}`);
        console.log(`  Height: ${info.height}px`);

        if (info.display === 'none' ||
            info.visibility === 'hidden' ||
            info.opacity === '0' ||
            info.height === 0) {
          console.log('  🚨 SECTION IS HIDDEN!');
        }
      }
      console.log('');
    });

    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
  }
})();