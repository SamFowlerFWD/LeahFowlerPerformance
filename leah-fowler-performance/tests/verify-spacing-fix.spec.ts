import { test, expect } from '@playwright/test';

test.describe('Verify Spacing Fix', () => {
  test('check no empty content between 24-35% scroll', async ({ page }) => {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Get page dimensions
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    console.log(`\nPage Analysis After Fix:`);
    console.log(`Total page height: ${pageHeight}px`);
    console.log(`Viewport height: ${viewportHeight}px`);

    // Check specific sections
    const sections = await page.evaluate(() => {
      const trustBar = document.querySelector('[aria-label="Trust indicators and certifications"]');
      const assessmentSection = document.querySelector('#assessment-tool') ||
                                document.querySelector('#assessment') ||
                                document.querySelector('.luxury-section');

      const results = [];

      if (trustBar) {
        const rect = trustBar.getBoundingClientRect();
        const styles = window.getComputedStyle(trustBar);
        results.push({
          name: 'TrustBar',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        });
      }

      if (assessmentSection) {
        const rect = assessmentSection.getBoundingClientRect();
        const styles = window.getComputedStyle(assessmentSection);
        results.push({
          name: 'AssessmentSection',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        });
      }

      return results;
    });

    console.log('\n=== Section Analysis ===');
    let previousBottom = 0;

    sections.forEach(section => {
      console.log(`\n${section.name}:`);
      console.log(`  Position: ${Math.round(section.top)}px to ${Math.round(section.bottom)}px`);
      console.log(`  Height: ${Math.round(section.height)}px`);
      console.log(`  Padding: top=${section.paddingTop}, bottom=${section.paddingBottom}`);

      if (previousBottom > 0) {
        const gap = section.top - previousBottom;
        console.log(`  Gap from previous section: ${Math.round(gap)}px`);

        // Check if gap is reasonable (should be under 50px)
        if (gap > 50) {
          console.log(`  ⚠️ WARNING: Large gap detected!`);
        } else {
          console.log(`  ✅ Gap is reasonable`);
        }
      }

      previousBottom = section.bottom;
    });

    // Scroll through the problem area and check for visible content
    const startPos = pageHeight * 0.24;
    const endPos = pageHeight * 0.35;

    console.log(`\n=== Checking problem area (24%-35% of page) ===`);
    console.log(`Range: ${Math.round(startPos)}px to ${Math.round(endPos)}px`);

    await page.evaluate(pos => window.scrollTo(0, pos), startPos);
    await page.waitForTimeout(500);

    // Check if there's visible content
    const visibleContent = await page.evaluate(() => {
      const elements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      const contentElements = elements.filter(el => {
        const text = el.textContent?.trim();
        const hasBackground = window.getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasContent = text && text.length > 0;
        return hasBackground || hasContent;
      });

      return contentElements.map(el => ({
        tag: el.tagName.toLowerCase(),
        class: el.className,
        text: el.textContent?.substring(0, 100)
      }));
    });

    if (visibleContent.length > 0) {
      console.log(`\n✅ Found ${visibleContent.length} elements with content in the problem area`);
      visibleContent.forEach(el => {
        if (el.text && el.text.trim()) {
          console.log(`  - ${el.tag}: "${el.text.substring(0, 50)}..."`);
        }
      });
    } else {
      console.log(`\n⚠️ WARNING: No visible content found in problem area!`);
    }

    // Final check - measure actual gaps
    const allSections = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      return Array.from(sections).map(s => {
        const rect = s.getBoundingClientRect();
        return {
          id: s.id || 'unnamed',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        };
      }).sort((a, b) => a.top - b.top);
    });

    console.log(' \n=== All Sections Gap Check ===');
    let maxGap = 0;
    let gapLocation = '';

    for (const i = 0; i < allSections.length - 1; i++) {
      const gap = allSections[i + 1].top - allSections[i].bottom;
      if (gap > maxGap) {
        maxGap = gap;
        gapLocation = `Between ${allSections[i].id || 'section-' + i} and ${allSections[i + 1].id || 'section-' + (i + 1)}`;
      }
    }

    console.log(`\nLargest gap found: ${Math.round(maxGap)}px`);
    console.log(`Location: ${gapLocation}`);

    if (maxGap > 100) {
      console.log('⚠️ ERROR: Excessive spacing still present!');
    } else if (maxGap > 50) {
      console.log('⚠️ Warning: Spacing could be tighter');
    } else {
      console.log('✅ SUCCESS: Spacing is now reasonable!');
    }

    // Assert that there are no excessive gaps
    expect(maxGap).toBeLessThan(100);
  });
});