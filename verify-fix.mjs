import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Verifying the fix...\n');

  // Navigate to the page
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });

  // Wait a moment for any animations
  await page.waitForTimeout(2000);

  // Take a screenshot
  await page.screenshot({ path: '/tmp/after-fix.png', fullPage: true });
  console.log('📸 Screenshot saved to /tmp/after-fix.png\n');

  // Check if the page is now scrollable
  const scrollInfo = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const scrollHeight = Math.max(body.scrollHeight, html.scrollHeight);
    const clientHeight = Math.max(body.clientHeight, html.clientHeight);

    return {
      scrollHeight,
      clientHeight,
      isScrollable: scrollHeight > clientHeight,
      numberOfSections: document.querySelectorAll('section').length,
      visibleSections: Array.from(document.querySelectorAll('section')).filter(s => {
        const rect = s.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      }).length
    };
  });

  console.log('📊 Page Analysis:');
  console.log(`  Total height: ${scrollInfo.scrollHeight}px`);
  console.log(`  Viewport height: ${scrollInfo.clientHeight}px`);
  console.log(`  Scrollable: ${scrollInfo.isScrollable ? '✅ YES' : '❌ NO'}`);
  console.log(`  Total sections: ${scrollInfo.numberOfSections}`);
  console.log(`  Visible sections: ${scrollInfo.visibleSections}\n`);

  // Check hero section dimensions
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('section');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const styles = window.getComputedStyle(hero);
      return {
        height: rect.height,
        minHeight: styles.minHeight,
        viewportPercentage: (rect.height / window.innerHeight * 100).toFixed(1)
      };
    }
    return null;
  });

  if (heroInfo) {
    console.log('🎯 Hero Section:');
    console.log(`  Height: ${heroInfo.height}px`);
    console.log(`  Min-height: ${heroInfo.minHeight}`);
    console.log(`  Takes up: ${heroInfo.viewportPercentage}% of viewport\n`);
  }

  // Try scrolling down
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);

  const scrollPosition = await page.evaluate(() => window.scrollY);
  console.log(`📍 After scroll attempt: ${scrollPosition > 0 ? `✅ Scrolled to ${scrollPosition}px` : '❌ Could not scroll'}\n`);

  // Check if content below hero is visible
  const contentCheck = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const results = [];

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      const className = section.className.split(' ')[0] || 'unnamed';

      if (index > 0) { // Skip first section (hero)
        results.push({
          section: className,
          inViewport,
          top: Math.round(rect.top)
        });
      }
    });

    return results;
  });

  if (contentCheck.length > 0) {
    console.log('📦 Other Sections Visibility:');
    contentCheck.forEach(item => {
      console.log(`  ${item.section}: ${item.inViewport ? '✅ Visible' : '❌ Not visible'} (top: ${item.top}px)`);
    });
  }

  console.log('\n✨ Fix verification complete!');

  // Keep browser open for manual inspection
  console.log('\n👀 Browser window will stay open for manual inspection.');
  console.log('Press Ctrl+C to exit when done.');

  // Keep the script running
  await new Promise(() => {});
})();