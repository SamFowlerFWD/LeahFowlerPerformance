const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const page = await context.newPage();

  console.log('📱 Analyzing Tablet Layout at 768px x 1024px\n');
  console.log('='.repeat(50));

  try {
    await page.goto('http://localhost:3004', { waitUntil: 'networkidle' });

    // Wait for hero section
    await page.waitForSelector('section', { timeout: 10000 });

    // Analyze hero text
    const heroText = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const subtitle = document.querySelector('p.text-lg, p.text-xl');

      if (!h1) return { error: 'No h1 found' };

      const h1Styles = window.getComputedStyle(h1);
      const h1Rect = h1.getBoundingClientRect();

      return {
        headline: {
          text: h1.textContent,
          fontSize: h1Styles.fontSize,
          lineHeight: h1Styles.lineHeight,
          fontWeight: h1Styles.fontWeight,
          position: {
            left: h1Rect.left,
            top: h1Rect.top,
            width: h1Rect.width,
            height: h1Rect.height
          }
        },
        subtitle: subtitle ? {
          text: subtitle.textContent?.substring(0, 50) + '...',
          fontSize: window.getComputedStyle(subtitle).fontSize
        } : null
      };
    });

    console.log('\n📝 Text Content Analysis:');
    console.log('  Headline:');
    console.log(`    Text: "${heroText.headline.text}"`);
    console.log(`    Font Size: ${heroText.headline.fontSize}`);
    console.log(`    Line Height: ${heroText.headline.lineHeight}`);
    console.log(`    Font Weight: ${heroText.headline.fontWeight}`);
    console.log(`    Position: left=${Math.round(heroText.headline.position.left)}px, width=${Math.round(heroText.headline.position.width)}px`);

    if (heroText.subtitle) {
      console.log('  Subtitle:');
      console.log(`    Font Size: ${heroText.subtitle.fontSize}`);
    }

    // Analyze image
    const imageAnalysis = await page.evaluate(() => {
      const img = document.querySelector('img');
      if (!img) return { found: false };

      const rect = img.getBoundingClientRect();
      const styles = window.getComputedStyle(img);
      const parent = img.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : null;

      return {
        found: true,
        visible: rect.width > 0 && rect.height > 0,
        src: img.src?.includes('leah') || img.src?.includes('hero'),
        position: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        },
        styles: {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          objectFit: styles.objectFit
        },
        parent: parentRect ? {
          left: parentRect.left,
          width: parentRect.width
        } : null
      };
    });

    console.log('\n🖼️  Image Analysis:');
    if (!imageAnalysis.found) {
      console.log('  ❌ No image found in hero section');
    } else {
      console.log(`  Image Found: ${imageAnalysis.found ? '✅' : '❌'}`);
      console.log(`  Visible: ${imageAnalysis.visible ? '✅' : '❌'}`);
      console.log(`  Position: left=${Math.round(imageAnalysis.position.left)}px, width=${Math.round(imageAnalysis.position.width)}px`);
      console.log(`  Display: ${imageAnalysis.styles.display}`);
      console.log(`  Visibility: ${imageAnalysis.styles.visibility}`);
      console.log(`  Opacity: ${imageAnalysis.styles.opacity}`);
      console.log(`  Object Fit: ${imageAnalysis.styles.objectFit}`);
    }

    // Analyze layout
    const layoutAnalysis = await page.evaluate(() => {
      const section = document.querySelector('section');
      const container = section?.querySelector('.container');
      const gridContainer = container?.querySelector('div');

      if (!gridContainer) return { error: 'No grid container found' };

      const styles = window.getComputedStyle(gridContainer);
      const children = Array.from(gridContainer.children);

      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        flexDirection: styles.flexDirection,
        gap: styles.gap,
        alignItems: styles.alignItems,
        childCount: children.length,
        childrenPositions: children.map(child => {
          const rect = child.getBoundingClientRect();
          return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          };
        })
      };
    });

    console.log('\n📐 Layout Analysis:');
    console.log(`  Display Type: ${layoutAnalysis.display}`);
    console.log(`  Grid Columns: ${layoutAnalysis.gridTemplateColumns || 'N/A'}`);
    console.log(`  Flex Direction: ${layoutAnalysis.flexDirection || 'N/A'}`);
    console.log(`  Gap: ${layoutAnalysis.gap}`);
    console.log(`  Child Elements: ${layoutAnalysis.childCount}`);

    // Determine if side-by-side
    let layoutType = 'Unknown';
    if (layoutAnalysis.childCount >= 2) {
      const [first, second] = layoutAnalysis.childrenPositions;
      if (first && second) {
        const horizontalOverlap = first.left + first.width > second.left && second.left + second.width > first.left;
        const verticalOverlap = first.top + first.height > second.top && second.top + second.height > first.top;

        if (!horizontalOverlap && verticalOverlap) {
          layoutType = '✅ SIDE-BY-SIDE (elements are horizontally separated)';
        } else if (horizontalOverlap && !verticalOverlap) {
          layoutType = '❌ STACKED (elements are vertically separated)';
        } else {
          layoutType = '⚠️  OVERLAPPING or complex layout';
        }

        console.log(`\n  Layout Type: ${layoutType}`);
        console.log(`  First Element: left=${Math.round(first.left)}px, width=${Math.round(first.width)}px`);
        console.log(`  Second Element: left=${Math.round(second.left)}px, width=${Math.round(second.width)}px`);
      }
    }

    // Final assessment
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL ASSESSMENT:');
    console.log('='.repeat(50));

    const isSideBySide = layoutType.includes('SIDE-BY-SIDE');
    const imageVisible = imageAnalysis.visible;
    const fontSizeNum = parseFloat(heroText.headline.fontSize);

    console.log(`\n1. Layout: ${isSideBySide ? '✅ Side-by-side' : '❌ NOT side-by-side (stacked)'}`);
    console.log(`2. Headline Font Size: ${heroText.headline.fontSize} (${fontSizeNum >= 32 ? '✅ Good size' : '⚠️ Smaller than expected'})`);
    console.log(`3. Image Visibility: ${imageVisible ? '✅ Image is visible' : '❌ Image NOT visible'}`);
    console.log(`4. Overall: ${isSideBySide && imageVisible ? '✅ TABLET VIEW WORKING CORRECTLY' : '❌ TABLET VIEW NEEDS FIXES'}`);

    if (!isSideBySide || !imageVisible) {
      console.log('\n⚠️  ISSUES DETECTED:');
      if (!isSideBySide) {
        console.log('  - Content is stacked vertically instead of side-by-side');
        console.log('  - Check md: responsive classes in the code');
      }
      if (!imageVisible) {
        console.log('  - Hero image is not visible or has zero dimensions');
        console.log('  - Check image loading and display properties');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();