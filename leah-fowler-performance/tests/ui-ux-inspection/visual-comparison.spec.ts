import { test, expect } from '@playwright/test';

test.describe('About Section Visual Comparison', () => {
  test('Capture improved layouts at all viewports', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const aboutSection = await page.locator('section:has-text("YOUR FAMILY FITNESS COACH")').first();
    await aboutSection.scrollIntoViewIfNeeded();

    const viewports = [
      { name: 'mobile-375', width: 375, height: 812 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'desktop-1440', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);

      // Take full section screenshot
      await aboutSection.screenshot({
        path: `tests/ui-ux-inspection/screenshots/final-${viewport.name}.png`
      });

      // Verify key improvements
      const badge = await aboutSection.locator('span:has-text("YOUR FAMILY FITNESS COACH")').first();
      const badgeSize = await badge.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          padding: el.parentElement?.style.padding || window.getComputedStyle(el.parentElement!).padding
        };
      });

      console.log(`${viewport.name} Badge: Font ${badgeSize.fontSize}, Padding: ${badgeSize.padding}`);

      // Check main heading size
      const heading = await aboutSection.locator('h2:has-text("Leah Fowler")').first();
      const headingSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`${viewport.name} Heading: ${headingSize}`);

      // Check credentials are visible and properly sized
      const credentials = await aboutSection.locator('h4:has-text("Mother of 3")').first();
      const credSize = await credentials.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`${viewport.name} Credentials text: ${credSize}`);

      // Check stats are visible
      const stats = await aboutSection.locator('div:has-text("500+")').first();
      const statsSize = await stats.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`${viewport.name} Stats text: ${statsSize}`);

      // Verify no overflow
      const hasOverflow = await aboutSection.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > window.innerWidth;
      });

      expect(hasOverflow).toBe(false);
      console.log(`✅ ${viewport.name}: Layout fits viewport, no overflow detected`);
      console.log('---');
    }
  });
});