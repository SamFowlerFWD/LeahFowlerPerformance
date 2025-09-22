import {
  test
} from '@playwright/test';

test.describe('Spacing Issue Analysis', () => {
  test('analyze empty content gap between 24-35% scroll', async ({ page }) => {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Get page dimensions
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    console.log(`Total page height: ${pageHeight}px`);
    console.log(`Viewport height: ${viewportHeight}px`);

    // Calculate the critical scroll positions
    const startPos = pageHeight * 0.24;
    const endPos = pageHeight * 0.35;

    console.log(`\nAnalyzing from ${startPos}px to ${endPos}px (24% to 35%)`);

    // Scroll to the start of the problem area
    await page.evaluate(pos => window.scrollTo(0, pos), startPos);
    await page.waitForTimeout(500);

    // Get all visible elements in the problem area
    const visibleElements = await page.evaluate((startY, endY) => {
      const elements = document.querySelectorAll('section, div[class*="container"], div[class*="section"]');
      const results = [];

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = rect.bottom + window.scrollY;
        const styles = window.getComputedStyle(el);

        // Check if element overlaps with our problem area
        if ((absoluteTop <= endY && absoluteBottom >= startY) ||
            (absoluteTop >= startY && absoluteTop <= endY)) {

          const classList = Array.from(el.classList);
          const tagName = el.tagName.toLowerCase();
          const id = el.id || 'no-id';

          results.push({
            selector: el.className ? `.${classList.join('.')}` : tagName,
            id: id,
            tag: tagName,
            absoluteTop: Math.round(absoluteTop),
            absoluteBottom: Math.round(absoluteBottom),
            height: Math.round(rect.height),
            paddingTop: styles.paddingTop,
            paddingBottom: styles.paddingBottom,
            marginTop: styles.marginTop,
            marginBottom: styles.marginBottom,
            minHeight: styles.minHeight,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            transform: styles.transform,
            position: styles.position,
            textContent: el.textContent?.substring(0, 50) || 'empty'
          });
        }
      });

      return results.sort((a, b) => a.absoluteTop - b.absoluteTop);
    }, startPos, endPos);

    console.log('\n=== Elements in problem area ===');
    visibleElements.forEach(el => {
      console.log(`\n${el.selector} (${el.id})`);
      console.log(`  Position: ${el.absoluteTop}px to ${el.absoluteBottom}px`);
      console.log(`  Height: ${el.height}px`);
      console.log(`  Padding: top=${el.paddingTop}, bottom=${el.paddingBottom}`);
      console.log(`  Margin: top=${el.marginTop}, bottom=${el.marginBottom}`);
      console.log(`  Min-height: ${el.minHeight}`);
      console.log(`  Display: ${el.display}, Visibility: ${el.visibility}, Opacity: ${el.opacity}`);
      console.log(`  Transform: ${el.transform}`);
      console.log(`  Content: "${el.textContent}"`);
    });

    // Check for gaps between elements
    console.log('\n=== Gap Analysis ===');
    for (const i = 0; i < visibleElements.length - 1; i++) {
      const current = visibleElements[i];
      const next = visibleElements[i + 1];
      const gap = next.absoluteTop - current.absoluteBottom;

      if (gap > 50) {
        console.log(`\nLARGE GAP FOUND: ${gap}px`);
        console.log(`  Between: ${current.selector} (ends at ${current.absoluteBottom}px)`);
        console.log(`  And: ${next.selector} (starts at ${next.absoluteTop}px)`);
      }
    }

    // Look for specific problem areas
    const assessmentSection = await page.$('section:has-text("Transform Your Performance")');
    if (assessmentSection) {
      const assessmentStyles = await assessmentSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          minHeight: styles.minHeight,
          height: rect.height + 'px',
          absoluteTop: rect.top + window.scrollY,
          absoluteBottom: rect.bottom + window.scrollY
        };
      });

      console.log('\n=== Assessment Section Specific ===');
      console.log('Styles:', assessmentStyles);
    }

    // Check for parallax or transform issues
    const transformedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const transformed = [];

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.transform !== 'none' || styles.willChange === 'transform') {
          const rect = el.getBoundingClientRect();
          transformed.push({
            selector: el.className || el.tagName.toLowerCase(),
            transform: styles.transform,
            willChange: styles.willChange,
            position: styles.position,
            top: rect.top + window.scrollY
          });
        }
      });

      return transformed;
    });

    if (transformedElements.length > 0) {
      console.log('\n=== Elements with transforms ===');
      transformedElements.forEach(el => {
        console.log(`${el.selector}: transform=${el.transform}, position=${el.position}`);
      });
    }
  });
});