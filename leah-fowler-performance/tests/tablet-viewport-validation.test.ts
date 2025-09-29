import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Tablet Viewport Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for server to be ready
    await page.waitForTimeout(3000);
  });

  test('Capture tablet portrait view - 768px width', async ({ page }) => {
    // Set viewport to iPad portrait
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate to the page
    await page.goto('http://localhost:3006');

    // Wait for content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Capture screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'tablet-portrait-768px-final.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    console.log(`Screenshot saved: ${screenshotPath}`);

    // Log layout verification
    const heroSection = page.locator('section').first();
    const heroBox = await heroSection.boundingBox();
    console.log('Hero section dimensions:', heroBox);

    // Check if text and image are side-by-side
    const textContainer = page.locator('[class*="text-left"]').first();
    const imageContainer = page.locator('img[alt*="Leah"]').first();

    const textBox = await textContainer.boundingBox();
    const imageBox = await imageContainer.boundingBox();

    if (textBox && imageBox) {
      console.log('Text container:', textBox);
      console.log('Image container:', imageBox);

      // Verify side-by-side layout
      if (imageBox.x > textBox.x) {
        console.log('✓ Layout is side-by-side (text left, image right)');
      } else {
        console.log('✗ Layout issue: Image not to the right of text');
      }

      // Check if image is visible
      const imageVisible = await imageContainer.isVisible();
      console.log(`✓ Image is ${imageVisible ? 'visible' : 'hidden'}`);
    }
  });

  test('Capture tablet landscape view - 1024px width', async ({ page }) => {
    // Set viewport to iPad landscape
    await page.setViewportSize({ width: 1024, height: 768 });

    // Navigate to the page
    await page.goto('http://localhost:3006');

    // Wait for content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Capture screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'tablet-landscape-1024px-final.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    console.log(`Screenshot saved: ${screenshotPath}`);

    // Log layout verification
    const heroSection = page.locator('section').first();
    const heroBox = await heroSection.boundingBox();
    console.log('Hero section dimensions:', heroBox);

    // Check if text and image are side-by-side
    const textContainer = page.locator('[class*="text-left"]').first();
    const imageContainer = page.locator('img[alt*="Leah"]').first();

    const textBox = await textContainer.boundingBox();
    const imageBox = await imageContainer.boundingBox();

    if (textBox && imageBox) {
      console.log('Text container:', textBox);
      console.log('Image container:', imageBox);

      // Verify side-by-side layout
      if (imageBox.x > textBox.x) {
        console.log('✓ Layout is side-by-side (text left, image right)');
      } else {
        console.log('✗ Layout issue: Image not to the right of text');
      }

      // Check if image is visible
      const imageVisible = await imageContainer.isVisible();
      console.log(`✓ Image is ${imageVisible ? 'visible' : 'hidden'}`);
    }

    // Check text sizes
    const heading = page.locator('h1').first();
    const headingFontSize = await heading.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    console.log(`Heading font size: ${headingFontSize}`);

    const paragraph = page.locator('p').first();
    const paragraphFontSize = await paragraph.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    console.log(`Paragraph font size: ${paragraphFontSize}`);
  });

  test('Comprehensive tablet layout analysis', async ({ page }) => {
    const viewports = [
      { name: 'iPad Portrait', width: 768, height: 1024 },
      { name: 'iPad Landscape', width: 1024, height: 768 }
    ];

    for (const viewport of viewports) {
      console.log(`\n=== Testing ${viewport.name} (${viewport.width}x${viewport.height}) ===`);

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Analyze hero section
      const hero = page.locator('section').first();
      const heroVisible = await hero.isVisible();
      console.log(`Hero section visible: ${heroVisible}`);

      // Check for flexbox layout
      const flexContainer = await hero.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
          alignItems: styles.alignItems
        };
      });
      console.log('Hero container styles:', flexContainer);

      // Check image visibility and position
      const image = page.locator('img[alt*="Leah"]').first();
      const imageVisible = await image.isVisible();

      if (imageVisible) {
        const imageBox = await image.boundingBox();
        console.log('Image dimensions and position:', imageBox);

        // Check if image is appropriately sized
        if (imageBox) {
          const imageWidthRatio = imageBox.width / viewport.width;
          console.log(`Image takes up ${(imageWidthRatio * 100).toFixed(1)}% of viewport width`);
        }
      } else {
        console.log('✗ Image is not visible!');
      }

      // Check text container
      const textContent = page.locator('h1').first().locator('..');
      const textBox = await textContent.boundingBox();
      if (textBox) {
        const textWidthRatio = textBox.width / viewport.width;
        console.log(`Text container takes up ${(textWidthRatio * 100).toFixed(1)}% of viewport width`);
      }

      // Check for any overflow issues
      const hasHorizontalScroll = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      console.log(`Horizontal scroll: ${hasHorizontalScroll ? '✗ Present (BAD)' : '✓ None (GOOD)'}`);
    }
  });
});