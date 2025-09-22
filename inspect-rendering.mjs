import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 Inspecting page rendering issue...\n');

  // Navigate to the local development server
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  } catch (error) {
    console.log('⚠️ Page load timeout/error, continuing with inspection...');
  }

  // Get the viewport dimensions
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const viewportWidth = await page.evaluate(() => window.innerWidth);

  console.log(`📐 Viewport dimensions: ${viewportWidth}x${viewportHeight}\n`);

  // Check if the hero section is blocking content
  const heroSection = await page.evaluate(() => {
    const hero = document.querySelector('section');
    if (hero) {
      const styles = window.getComputedStyle(hero);
      return {
        position: styles.position,
        height: styles.height,
        minHeight: styles.minHeight,
        overflow: styles.overflow,
        zIndex: styles.zIndex,
        display: styles.display
      };
    }
    return null;
  });

  console.log('🎯 Hero section styles:', heroSection, '\n');

  // Check if body/html have scroll issues
  const scrollInfo = await page.evaluate(() => {
    const htmlStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);
    return {
      html: {
        overflow: htmlStyles.overflow,
        overflowX: htmlStyles.overflowX,
        overflowY: htmlStyles.overflowY,
        height: htmlStyles.height
      },
      body: {
        overflow: bodyStyles.overflow,
        overflowX: bodyStyles.overflowX,
        overflowY: bodyStyles.overflowY,
        height: bodyStyles.height,
        minHeight: bodyStyles.minHeight
      },
      scrollHeight: document.body.scrollHeight,
      clientHeight: document.body.clientHeight,
      canScroll: document.body.scrollHeight > document.body.clientHeight
    };
  });

  console.log('📜 Scroll info:', scrollInfo, '\n');

  // Check if other sections exist but are hidden
  const sectionsInfo = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    return Array.from(sections).map((section, index) => {
      const rect = section.getBoundingClientRect();
      const styles = window.getComputedStyle(section);
      const classNames = section.className.split(' ').slice(0, 3).join(' '); // First 3 classes for brevity
      return {
        index,
        visible: rect.height > 0 && rect.width > 0,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        className: classNames
      };
    });
  });

  console.log('📦 All sections found:', sectionsInfo.length);
  sectionsInfo.forEach(section => {
    console.log(`  Section ${section.index}: ${section.visible ? '✅ Visible' : '❌ Hidden'} - top: ${section.top}px, height: ${section.height}px`);
  });
  console.log('');

  // Check for the main content container
  const mainContent = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) {
      const styles = window.getComputedStyle(main);
      const rect = main.getBoundingClientRect();
      return {
        exists: true,
        minHeight: styles.minHeight,
        height: styles.height,
        actualHeight: Math.round(rect.height),
        overflow: styles.overflow,
        childrenCount: main.children.length
      };
    }
    return { exists: false };
  });

  console.log('📄 Main content:', mainContent, '\n');

  // Check for any fixed/absolute positioned elements covering content
  const coveringElements = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const problematicElements = [];

    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Check for elements that might be covering the entire viewport
      if ((styles.position === 'fixed' && rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9) ||
          (styles.position === 'absolute' && rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9) ||
          (parseInt(styles.zIndex) > 9999)) {
        problematicElements.push({
          tagName: el.tagName,
          className: el.className.split(' ').slice(0, 3).join(' '),
          position: styles.position,
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          zIndex: styles.zIndex,
          top: Math.round(rect.top),
          background: styles.backgroundColor || styles.backgroundImage?.substring(0, 50)
        });
      }
    });

    return problematicElements;
  });

  if (coveringElements.length > 0) {
    console.log('⚠️ Elements potentially covering content:');
    coveringElements.forEach(el => {
      console.log(`  ${el.tagName}.${el.className} - position: ${el.position}, z-index: ${el.zIndex}, size: ${el.width}x${el.height}`);
    });
  } else {
    console.log('✅ No elements found covering the entire viewport');
  }
  console.log('');

  // Check specifically for the hero image
  const imageAnalysis = await page.evaluate(() => {
    // Find the hero image
    const heroImage = document.querySelector('img[alt*="Leah Fowler"]');
    const imageContainer = heroImage?.closest('div[style*="position"]') || heroImage?.parentElement;

    if (heroImage && imageContainer) {
      const imgStyles = window.getComputedStyle(heroImage);
      const containerStyles = window.getComputedStyle(imageContainer);
      const imgRect = heroImage.getBoundingClientRect();
      const containerRect = imageContainer.getBoundingClientRect();

      return {
        image: {
          position: imgStyles.position,
          height: Math.round(imgRect.height),
          width: Math.round(imgRect.width),
          objectFit: imgStyles.objectFit,
          zIndex: imgStyles.zIndex
        },
        container: {
          position: containerStyles.position,
          height: Math.round(containerRect.height),
          width: Math.round(containerRect.width),
          overflow: containerStyles.overflow,
          zIndex: containerStyles.zIndex
        }
      };
    }
    return null;
  });

  console.log('🖼️ Hero image analysis:', imageAnalysis, '\n');

  // Check if content is actually present but below the fold
  const contentBelowFold = await page.evaluate(() => {
    const viewportHeight = window.innerHeight;
    const sections = document.querySelectorAll('section');
    let belowFoldCount = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= viewportHeight) {
        belowFoldCount++;
      }
    });

    return {
      totalSections: sections.length,
      belowFoldCount,
      pageScrollable: document.body.scrollHeight > window.innerHeight
    };
  });

  console.log('📊 Content analysis:');
  console.log(`  Total sections: ${contentBelowFold.totalSections}`);
  console.log(`  Sections below fold: ${contentBelowFold.belowFoldCount}`);
  console.log(`  Page scrollable: ${contentBelowFold.pageScrollable ? 'Yes' : 'No'}\n`);

  // Final diagnosis
  console.log('🔎 DIAGNOSIS:');
  if (!contentBelowFold.pageScrollable && contentBelowFold.totalSections > 1) {
    console.log('  ❌ PROBLEM IDENTIFIED: Page is not scrollable but has multiple sections!');
    console.log('  This suggests the hero section or another element is preventing scroll.');
  } else if (coveringElements.length > 0) {
    console.log('  ❌ PROBLEM IDENTIFIED: Elements are covering the viewport!');
  } else if (contentBelowFold.pageScrollable) {
    console.log('  ✅ Page appears to be scrollable. Content may be below the fold.');
  }

  await browser.close();
})();