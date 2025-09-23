const { chromium } = require('@playwright/test');

async function verifyAboutSectionFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🔍 Navigating to site...');
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });

  console.log('📍 Scrolling to About section...');
  await page.evaluate(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Wait for animations to complete
  await page.waitForTimeout(2000);

  console.log('📸 Taking before/after screenshots...');
  const aboutSection = page.locator('#about');
  await aboutSection.screenshot({
    path: 'about-section-after-fix.png',
    fullPage: false
  });
  console.log('Screenshot saved: about-section-after-fix.png');

  console.log('\n🔎 Checking for overlays...');

  // Check for overlapping elements
  const overlayCheck = await page.evaluate(() => {
    const cards = document.querySelectorAll('.absolute.bg-white.rounded-2xl.shadow-2xl');
    const image = document.querySelector('img[alt*="Leah Fowler"]');

    if (!image) return { hasImage: false, error: 'Image not found' };

    const imageRect = image.getBoundingClientRect();
    const results = {
      hasImage: true,
      imageVisible: imageRect.width > 0 && imageRect.height > 0,
      imageDimensions: {
        width: imageRect.width,
        height: imageRect.height,
        top: imageRect.top,
        left: imageRect.left
      },
      cards: [],
      overlappingCards: []
    };

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardInfo = {
        index,
        text: card.textContent?.trim().substring(0, 50),
        visible: window.getComputedStyle(card).display !== 'none' && window.getComputedStyle(card).visibility !== 'hidden',
        position: {
          top: cardRect.top,
          left: cardRect.left,
          width: cardRect.width,
          height: cardRect.height
        },
        classes: card.className
      };

      results.cards.push(cardInfo);

      // Check if card overlaps with the center of the image
      const imageCenterX = imageRect.left + imageRect.width / 2;
      const imageCenterY = imageRect.top + imageRect.height / 2;

      const overlapsCenter =
        cardRect.left < imageCenterX &&
        (cardRect.left + cardRect.width) > imageCenterX &&
        cardRect.top < imageCenterY &&
        (cardRect.top + cardRect.height) > imageCenterY;

      if (overlapsCenter && cardInfo.visible) {
        results.overlappingCards.push(cardInfo);
      }
    });

    return results;
  });

  console.log('\n📊 Analysis Results:');
  console.log('==================');
  console.log(`✓ Image found: ${overlayCheck.hasImage}`);
  console.log(`✓ Image visible: ${overlayCheck.imageVisible}`);

  if (overlayCheck.imageDimensions) {
    console.log(`✓ Image dimensions: ${Math.round(overlayCheck.imageDimensions.width)}x${Math.round(overlayCheck.imageDimensions.height)}px`);
  }

  console.log(`\n📋 Credential cards found: ${overlayCheck.cards.length}`);
  overlayCheck.cards.forEach((card, i) => {
    console.log(`  Card ${i + 1}:`);
    console.log(`    - Visible: ${card.visible}`);
    console.log(`    - Text: "${card.text}"`);
    console.log(`    - Classes: ${card.classes.includes('hidden md:block') ? '✓ Hidden on mobile' : '⚠️ Always visible'}`);
  });

  console.log(`\n⚠️  Cards blocking image center: ${overlayCheck.overlappingCards.length}`);
  if (overlayCheck.overlappingCards.length > 0) {
    console.log('❌ ISSUE FOUND: Cards are still overlapping the image center!');
    overlayCheck.overlappingCards.forEach(card => {
      console.log(`  - Card with text: "${card.text}"`);
    });
  } else {
    console.log('✅ SUCCESS: No cards are blocking the image center!');
  }

  // Check z-index
  console.log('\n🎨 Checking z-index layering...');
  const zIndexCheck = await page.evaluate(() => {
    const imageContainer = document.querySelector('.relative.rounded-3xl.overflow-hidden.shadow-2xl');
    const cards = document.querySelectorAll('.absolute.bg-white.rounded-2xl.shadow-2xl');

    const results = {
      imageContainer: null,
      cards: []
    };

    if (imageContainer) {
      const styles = window.getComputedStyle(imageContainer);
      results.imageContainer = {
        zIndex: styles.zIndex,
        classes: imageContainer.className
      };
    }

    cards.forEach(card => {
      const styles = window.getComputedStyle(card);
      results.cards.push({
        zIndex: styles.zIndex,
        classes: card.className
      });
    });

    return results;
  });

  console.log('Image container z-index:', zIndexCheck.imageContainer?.zIndex || 'auto');
  zIndexCheck.cards.forEach((card, i) => {
    console.log(`Card ${i + 1} z-index:`, card.zIndex || 'auto');
  });

  // Check mobile view
  console.log('\n📱 Checking mobile view...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);

  const mobileCheck = await page.evaluate(() => {
    const cards = document.querySelectorAll('.absolute.bg-white.rounded-2xl.shadow-2xl');
    let visibleOnMobile = 0;

    cards.forEach(card => {
      const styles = window.getComputedStyle(card);
      if (styles.display !== 'none' && styles.visibility !== 'hidden') {
        visibleOnMobile++;
      }
    });

    return { visibleCards: visibleOnMobile };
  });

  if (mobileCheck.visibleCards === 0) {
    console.log('✅ Cards properly hidden on mobile');
  } else {
    console.log(`⚠️  ${mobileCheck.visibleCards} cards still visible on mobile`);
  }

  await aboutSection.screenshot({
    path: 'about-section-mobile.png',
    fullPage: false
  });
  console.log('Mobile screenshot saved: about-section-mobile.png');

  console.log('\n✨ Verification complete!');
  console.log('========================');

  const hasIssues = overlayCheck.overlappingCards.length > 0 || mobileCheck.visibleCards > 0;

  if (!hasIssues) {
    console.log('🎉 All checks passed! The overlay issue has been fixed successfully.');
  } else {
    console.log('⚠️  Some issues remain. Please review the results above.');
  }

  // Keep browser open for 5 seconds to view the result
  console.log('\nBrowser will close in 5 seconds...');
  await page.waitForTimeout(5000);

  await browser.close();
}

verifyAboutSectionFix().catch(console.error);