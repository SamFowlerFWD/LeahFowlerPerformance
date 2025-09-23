import { test, expect } from '@playwright/test';

test.describe('About Section Improvements Verification', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  viewports.forEach(viewport => {
    test(`Verify layout improvements on ${viewport.name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize(viewport);

      // Navigate to homepage
      await page.goto('http://localhost:3000');

      // Wait for the about section to be visible
      const aboutSection = await page.locator('section:has-text("YOUR FAMILY FITNESS COACH")').first();
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000); // Wait for animations

      // Take screenshot for visual comparison
      await aboutSection.screenshot({
        path: `tests/ui-ux-inspection/screenshots/about-section-after-${viewport.name}.png`
      });

      // Test 1: Check that header badge is properly sized and visible
      const headerBadge = await aboutSection.locator('.inline-flex:has-text("YOUR FAMILY FITNESS COACH")').first();
      await expect(headerBadge).toBeVisible();

      // Test 2: Verify typography hierarchy
      const mainHeading = await aboutSection.locator('h2:has-text("Leah Fowler")').first();
      await expect(mainHeading).toBeVisible();

      const headingFontSize = await mainHeading.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      // Font sizes should be responsive
      if (viewport.name === 'mobile') {
        expect(parseInt(headingFontSize)).toBeLessThanOrEqual(48); // 3xl or 4xl
      } else if (viewport.name === 'desktop') {
        expect(parseInt(headingFontSize)).toBeGreaterThanOrEqual(48); // 6xl or 7xl
      }

      // Test 3: Check credentials grid is properly responsive
      const credentialsGrid = await aboutSection.locator('.grid:has(div:has-text("Mother of 3"))').first();
      const gridColumns = await credentialsGrid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.gridTemplateColumns;
      });

      if (viewport.name === 'mobile') {
        // Should be single column on mobile
        expect(gridColumns).toContain('1fr');
      } else {
        // Should be 2 columns on tablet and desktop
        expect(gridColumns).toContain('1fr 1fr');
      }

      // Test 4: Check stats bar is properly responsive
      const statsBar = await aboutSection.locator('.grid:has(div:has-text("500+"))').first();
      const statsColumns = await statsBar.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.gridTemplateColumns;
      });

      if (viewport.name === 'mobile') {
        // Should be 2 columns on mobile
        expect(statsColumns).toContain('1fr 1fr');
      } else {
        // Should be 4 columns on tablet and desktop
        expect(statsColumns).toContain('1fr 1fr 1fr 1fr');
      }

      // Test 5: Check for text overflow issues
      const textElements = await aboutSection.locator('h1, h2, h3, p').all();
      let overflowCount = 0;

      for (const element of textElements) {
        const isOverflowing = await element.evaluate((el) => {
          return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        });
        if (isOverflowing) {
          const text = await element.textContent();
          console.log(`WARNING: Text overflow in ${viewport.name}: "${text?.substring(0, 50)}..."`);
          overflowCount++;
        }
      }

      // No text should overflow
      expect(overflowCount).toBe(0);

      // Test 6: Check spacing and padding
      const sectionPadding = await aboutSection.evaluate(el => {
        const section = el.querySelector('section');
        if (!section) return null;
        const styles = window.getComputedStyle(section);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        };
      });

      if (sectionPadding) {
        const topPadding = parseInt(sectionPadding.paddingTop);
        const bottomPadding = parseInt(sectionPadding.paddingBottom);

        // Padding should be responsive
        if (viewport.name === 'mobile') {
          expect(topPadding).toBeLessThanOrEqual(80); // Should be smaller on mobile
          expect(bottomPadding).toBeLessThanOrEqual(80);
        } else if (viewport.name === 'desktop') {
          expect(topPadding).toBeGreaterThanOrEqual(64); // Should be larger on desktop
          expect(bottomPadding).toBeGreaterThanOrEqual(64);
        }
      }

      // Test 7: Check expertise tags are properly sized
      const expertiseTags = await aboutSection.locator('.inline-flex:has(.h-3, .h-4, .h-5)').all();
      for (const tag of expertiseTags.slice(0, 3)) { // Check first 3 tags
        const tagWidth = await tag.evaluate(el => el.offsetWidth);
        const tagHeight = await tag.evaluate(el => el.offsetHeight);

        // Tags should be reasonably sized
        expect(tagWidth).toBeGreaterThan(50);
        expect(tagWidth).toBeLessThan(400);
        expect(tagHeight).toBeGreaterThan(20);
        expect(tagHeight).toBeLessThan(60);
      }

      // Test 8: Visual hierarchy check - subtitle should be smaller than title
      const subtitle = await aboutSection.locator('p:has-text("Family Fitness & Athletic Performance Specialist")').first();
      const subtitleFontSize = await subtitle.evaluate(el =>
        parseInt(window.getComputedStyle(el).fontSize)
      );

      expect(parseInt(headingFontSize)).toBeGreaterThan(subtitleFontSize);

      console.log(`✅ ${viewport.name} layout verified successfully`);
      console.log(`   - Heading size: ${headingFontSize}`);
      console.log(`   - Grid columns: ${gridColumns.split(' ').length}`);
      console.log(`   - Stats columns: ${statsColumns.split(' ').length}`);
      console.log(`   - No text overflow detected`);
    });
  });

  test('Compare before and after screenshots', async ({ page }) => {
    // This test just logs that screenshots have been taken for manual comparison
    console.log('Screenshots have been captured for comparison:');
    console.log('Before: tests/ui-ux-inspection/screenshots/about-section-before-*.png');
    console.log('After: tests/ui-ux-inspection/screenshots/about-section-after-*.png');
    console.log('Please review the screenshots to verify visual improvements.');
  });
});