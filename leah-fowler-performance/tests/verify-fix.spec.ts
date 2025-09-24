import { test, expect, devices } from '@playwright/test';

const viewports = [
  { name: 'mobile', viewport: { width: 375, height: 812 } },
  { name: 'tablet', viewport: { width: 768, height: 1024 } },
  { name: 'desktop', viewport: { width: 1024, height: 768 } },
  { name: 'large', viewport: { width: 1440, height: 900 } }
];

for (const device of viewports) {
  test(`Apply page should not have partial text on ${device.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // Navigate to the apply page
    await page.goto('http://localhost:3005/apply');
    await page.waitForLoadState('networkidle');

    // Take screenshot for this viewport
    await page.screenshot({
      path: `test-results/apply-page-${device.name}-after-fix.png`,
      fullPage: true
    });

    // Check for partial text (single letters)
    const partialTextElements = await page.evaluate(() => {
      const suspicious = [];
      document.querySelectorAll('*').forEach(el => {
        // Skip script and style tags
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;

        // Get direct text content (not from children)
        const walker = document.createTreeWalker(
          el,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function(node) {
              if (node.parentElement === el) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_SKIP;
            }
          }
        );

        let directText = '';
        let node;
        while (node = walker.nextNode()) {
          directText += node.textContent;
        }

        directText = directText.trim();

        // Check if it's a single letter or very short unexpected text
        if (directText && directText.length === 1) {
          const styles = window.getComputedStyle(el);
          const fontSize = parseInt(styles.fontSize);

          // Only flag large text (likely the issue we're looking for)
          if (fontSize > 30) {
            suspicious.push({
              text: directText,
              tagName: el.tagName,
              className: el.className,
              fontSize: fontSize + 'px',
              parentTag: el.parentElement?.tagName,
              parentClass: el.parentElement?.className
            });
          }
        }
      });
      return suspicious;
    });

    // Log any suspicious elements found
    if (partialTextElements.length > 0) {
      console.log(`Found partial text on ${device.name}:`, partialTextElements);
    }

    // The test passes if no large single letters are found
    expect(partialTextElements).toHaveLength(0);

    await context.close();
  });
}