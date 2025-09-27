const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004', {
    waitUntil: 'domcontentloaded'
  });

  console.log('\n=== MOBILE SECTIONS VISIBILITY CHECK ===\n');

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Check for sections containing specific text
  const sectionsToCheck = [
    'Client Success Stories',  // Testimonials
    'Online Package',          // OnlinePackageShowcase
    'Choose Your',             // Pricing
    'Meet Your Coach',         // About
    'Frequently Asked',        // FAQ
    'Get in Touch'            // Contact
  ];

  for (const searchText of sectionsToCheck) {
    console.log(`\nChecking for: ${searchText}`);

    const result = await page.evaluate((text) => {
      // Find all elements containing this text
      const elements = Array.from(document.querySelectorAll('*'));
      const found = elements.find(el => {
        return el.textContent?.includes(text) && !el.querySelector('*:has-text("' + text + '")');
      });

      if (!found) {
        return { found: false };
      }

      // Find the parent section
      const section = found.closest('section') || found.closest('div[class*="section"]') || found.parentElement;

      if (!section) {
        return { found: true, sectionFound: false };
      }

      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();

      return {
        found: true,
        sectionFound: true,
        tagName: section.tagName,
        className: section.className,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        height: rect.height,
        width: rect.width,
        top: rect.top,
        overflow: styles.overflow,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    }, searchText);

    if (!result.found) {
      console.log('  ❌ NOT FOUND IN DOM AT ALL');
    } else if (!result.sectionFound) {
      console.log('  ⚠️ Text found but no containing section');
    } else {
      console.log(`  ✓ Found in ${result.tagName}.${result.className}`);
      console.log(`    Display: ${result.display}`);
      console.log(`    Visibility: ${result.visibility}`);
      console.log(`    Opacity: ${result.opacity}`);
      console.log(`    Size: ${result.width}x${result.height}px`);
      console.log(`    Position from top: ${result.top}px`);
      console.log(`    Overflow: ${result.overflow}`);

      if (result.display === 'none') {
        console.log('    🚨 HIDDEN: display: none');
      } else if (result.visibility === 'hidden') {
        console.log('    🚨 HIDDEN: visibility: hidden');
      } else if (result.opacity === '0') {
        console.log('    🚨 HIDDEN: opacity: 0');
      } else if (result.height === 0) {
        console.log('    🚨 HIDDEN: height is 0');
      } else if (result.top > 10000) {
        console.log('    🚨 OFF-SCREEN: positioned way down');
      } else if (result.width === 0) {
        console.log('    🚨 HIDDEN: width is 0');
      } else if (result.color === result.backgroundColor && result.color !== 'rgba(0, 0, 0, 0)') {
        console.log('    ⚠️ POSSIBLE ISSUE: Text color matches background');
      }
    }
  }

  // Take screenshots
  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-diagnostic.png',
    fullPage: true
  });

  console.log('\n\nFull page screenshot saved to tests/screenshots/mobile-diagnostic.png');

  // Scroll to different positions and take screenshots
  const scrollPositions = [0, 2000, 4000, 6000, 8000, 10000];
  for (const pos of scrollPositions) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), pos);
    await page.waitForTimeout(500);
    const visibleText = await page.evaluate(() => {
      return document.body.innerText.substring(0, 100);
    });
    console.log(`\nAt scroll position ${pos}px: ${visibleText.substring(0, 50)}...`);
  }

  console.log('\n\nBrowser will stay open for manual inspection. Close when done.');
})();