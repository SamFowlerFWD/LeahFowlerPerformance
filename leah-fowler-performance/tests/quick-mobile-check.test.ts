import { test, expect } from '@playwright/test';

test('Quick mobile sections check', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('domcontentloaded');

  // Just check for the presence and visibility of key sections
  const sections = [
    'testimonials',
    'online',
    'pricing',
    'about',
    'faq',
    'contact'
  ];

  console.log('\n=== QUICK MOBILE CHECK ===\n');

  for (const sectionName of sections) {
    // Look for sections containing these keywords
    const elements = await page.$$eval('section, div[class*="section"], div[class*="Section"]', (els, name) => {
      return els.map(el => {
        const text = el.textContent || '';
        const hasKeyword = text.toLowerCase().includes(name);
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);

        if (hasKeyword) {
          return {
            found: true,
            class: el.className,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            height: rect.height,
            width: rect.width,
            top: rect.top,
            contentLength: text.length
          };
        }
        return null;
      }).filter(Boolean);
    }, sectionName);

    if (elements.length > 0) {
      console.log(`\n${sectionName.toUpperCase()}:`);
      elements.forEach(el => {
        console.log('  Found:', el.class || 'no class');
        console.log('  Display:', el.display);
        console.log('  Visibility:', el.visibility);
        console.log('  Opacity:', el.opacity);
        console.log('  Size:', `${el.width}x${el.height}`);
        console.log('  Top position:', el.top);
        console.log('  Content length:', el.contentLength);

        if (el.display === 'none' || el.visibility === 'hidden' || el.opacity === '0' || el.height === 0) {
          console.log('  ⚠️ HIDDEN!');
        }
      });
    } else {
      console.log(`\n${sectionName.toUpperCase()}: NOT FOUND`);
    }
  }

  // Take screenshot
  await page.screenshot({
    path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/quick-mobile-check.png',
    fullPage: true
  });
});