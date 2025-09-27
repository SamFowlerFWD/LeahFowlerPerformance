const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');

  console.log('\n=== MOBILE SECTION VISIBILITY CHECK ===\n');

  // Check all sections
  const sections = await page.evaluate(() => {
    const allSections = Array.from(document.querySelectorAll('section'));
    const results = [];

    allSections.forEach((section, index) => {
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      const heading = section.querySelector('h1, h2, h3');
      const text = section.textContent?.substring(0, 100);

      results.push({
        index,
        heading: heading?.textContent || 'No heading',
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        height: rect.height,
        width: rect.width,
        overflow: styles.overflow,
        position: styles.position,
        transform: styles.transform,
        className: section.className,
        textPreview: text
      });
    });

    return results;
  });

  sections.forEach(section => {
    console.log(`\nSection ${section.index}: ${section.heading}`);
    console.log(`  Class: ${section.className || 'no class'}`);
    console.log(`  Display: ${section.display}`);
    console.log(`  Visibility: ${section.visibility}`);
    console.log(`  Opacity: ${section.opacity}`);
    console.log(`  Size: ${section.width}x${section.height}`);
    console.log(`  Overflow: ${section.overflow}`);
    console.log(`  Position: ${section.position}`);
    console.log(`  Transform: ${section.transform}`);

    if (section.display === 'none' ||
        section.visibility === 'hidden' ||
        section.opacity === '0' ||
        section.height === 0) {
      console.log('  ⚠️ HIDDEN!');
    }

    if (section.textPreview && section.textPreview.includes('Online Package')) {
      console.log('  >>> Found Online Package Section!');
    }
    if (section.textPreview && section.textPreview.includes('Choose Your')) {
      console.log('  >>> Found Pricing Section!');
    }
    if (section.textPreview && section.textPreview.includes('About')) {
      console.log('  >>> Found About Section!');
    }
    if (section.textPreview && section.textPreview.includes('FAQ')) {
      console.log('  >>> Found FAQ Section!');
    }
    if (section.textPreview && section.textPreview.includes('Contact')) {
      console.log('  >>> Found Contact Section!');
    }
  });

  // Check for any display: none media queries
  const mediaQueries = await page.evaluate(() => {
    const issues = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const rules = sheet.cssRules || sheet.rules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.media && rule.media.mediaText.includes('max-width')) {
            const text = rule.cssText;
            if (text.includes('display: none') ||
                text.includes('visibility: hidden') ||
                text.includes('opacity: 0')) {
              issues.push({
                media: rule.media.mediaText,
                rule: text.substring(0, 200)
              });
            }
          }
        }
      } catch (e) {}
    }
    return issues;
  });

  if (mediaQueries.length > 0) {
    console.log('\n=== PROBLEMATIC MEDIA QUERIES ===');
    mediaQueries.forEach(mq => {
      console.log(`\nMedia: ${mq.media}`);
      console.log(`Rule: ${mq.rule}`);
    });
  }

  // Take a full page screenshot
  await page.screenshot({
    path: 'mobile-full-page.png',
    fullPage: true
  });

  console.log('\nScreenshot saved as mobile-full-page.png');

  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for manual inspection. Close it manually when done.');
})();