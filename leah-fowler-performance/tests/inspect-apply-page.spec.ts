import { test, expect } from '@playwright/test';

test.describe('Apply Page - Inspect Partial Text Issue', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the apply page on port 3004
    await page.goto('http://localhost:3004/apply');
    await page.waitForLoadState('networkidle');
  });

  test('Capture screenshots and inspect DOM for partial text', async ({ page, browserName }, testInfo) => {
    // Take initial screenshot
    await page.screenshot({
      path: `test-results/apply-page-initial-${browserName}.png`,
      fullPage: true
    });

    // Look for elements with partial overflow or visibility issues
    const elementsWithPartialText = await page.evaluate(() => {
      const results = [];
      const allElements = document.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        // Check for elements that might have text overflow
        if (element.textContent && element.textContent.trim()) {
          const hasOverflow = styles.overflow === 'hidden' ||
                             styles.textOverflow === 'ellipsis';
          const hasClipping = rect.width < element.scrollWidth ||
                            rect.height < element.scrollHeight;
          const hasOpacityIssue = parseFloat(styles.opacity) < 1 &&
                                 parseFloat(styles.opacity) > 0;

          // Check for specific text content
          const text = element.textContent.trim();
          const hasPartialA = text === 'A' || text.startsWith('A') && text.length <= 2;
          const hasPartialC = text === 'C' || text.startsWith('C') && text.length <= 2;

          if (hasOverflow || hasClipping || hasOpacityIssue || hasPartialA || hasPartialC) {
            results.push({
              tagName: element.tagName,
              className: element.className,
              id: element.id,
              text: text.substring(0, 50),
              styles: {
                position: styles.position,
                overflow: styles.overflow,
                opacity: styles.opacity,
                display: styles.display,
                visibility: styles.visibility,
                transform: styles.transform,
                fontSize: styles.fontSize,
                lineHeight: styles.lineHeight,
                zIndex: styles.zIndex
              },
              rect: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
              },
              scrollDimensions: {
                scrollWidth: element.scrollWidth,
                scrollHeight: element.scrollHeight
              }
            });
          }
        }
      });

      return results;
    });

    console.log('Elements with potential text issues:', JSON.stringify(elementsWithPartialText, null, 2));

    // Look specifically for elements containing just "A" or "C"
    const partialLetters = await page.locator('*:has-text(/^[AC]$/)')
      .evaluateAll(elements => elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        text: el.textContent,
        innerHTML: el.innerHTML,
        outerHTML: el.outerHTML.substring(0, 200)
      })));

    if (partialLetters.length > 0) {
      console.log('Found elements with just A or C:', JSON.stringify(partialLetters, null, 2));
    }

    // Check for animation-related issues
    const animatingElements = await page.evaluate(() => {
      const results = [];
      const allElements = document.querySelectorAll('*');

      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);

        if (styles.animation !== 'none' || styles.transition !== 'none 0s ease 0s') {
          const text = element.textContent?.trim() || '';
          if (text && text.length < 5) {  // Short text that might be partial
            results.push({
              tagName: element.tagName,
              className: element.className,
              text: text,
              animation: styles.animation,
              transition: styles.transition,
              animationPlayState: styles.animationPlayState
            });
          }
        }
      });

      return results;
    });

    if (animatingElements.length > 0) {
      console.log('Elements with animations and short text:', JSON.stringify(animatingElements, null, 2));
    }

    // Scroll to check if the issue persists
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `test-results/apply-page-after-scroll-${browserName}.png`,
      fullPage: true
    });

    // Highlight any suspicious elements
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.trim() || '';
        if ((text === 'A' || text === 'C') && el.children.length === 0) {
          el.style.border = '5px solid red';
          el.style.backgroundColor = 'yellow';
          console.log('Highlighted element:', el);
        }
      });
    });

    await page.screenshot({
      path: `test-results/apply-page-highlighted-${browserName}.png`,
      fullPage: true
    });
  });

  test('Check for hidden or mispositioned elements', async ({ page }) => {
    const hiddenElements = await page.evaluate(() => {
      const results = [];

      // Check all elements for suspicious positioning
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const text = el.textContent?.trim() || '';

        // Elements that might be partially visible
        if (text && (
          rect.top < 0 && rect.bottom > 0 ||  // Partially above viewport
          rect.left < 0 && rect.right > 0 ||  // Partially left of viewport
          styles.clipPath !== 'none' ||
          styles.clip !== 'auto'
        )) {
          results.push({
            tagName: el.tagName,
            text: text.substring(0, 30),
            position: `${rect.top}, ${rect.left}`,
            clipPath: styles.clipPath,
            clip: styles.clip
          });
        }
      });

      return results;
    });

    console.log('Hidden or clipped elements:', JSON.stringify(hiddenElements, null, 2));
  });
});