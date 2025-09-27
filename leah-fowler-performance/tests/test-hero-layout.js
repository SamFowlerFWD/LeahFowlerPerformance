const { chromium } = require('@playwright/test');

async function testHeroLayout() {
  console.log('🧪 Testing Hero Section Layout Fix...');
  const browser = await chromium.launch();

  try {
    // Test Desktop Layout
    console.log('\n📱 Desktop Test (1920x1080)...');
    const desktopPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    await desktopPage.goto('http://localhost:3004', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000);

    // Check if hero image container is relative on desktop
    const desktopImagePosition = await desktopPage.evaluate(() => {
      const imageContainer = document.querySelector('.lg\\:relative.lg\\:w-2\\/5');
      if (imageContainer) {
        const styles = window.getComputedStyle(imageContainer);
        return {
          position: styles.position,
          zIndex: styles.zIndex,
          width: styles.width,
          display: styles.display
        };
      }
      return null;
    });

    console.log('Desktop Image Container:', desktopImagePosition);

    // Check if content and image are side by side
    const heroLayout = await desktopPage.evaluate(() => {
      const heroSection = document.querySelector('section');
      const flexContainer = heroSection?.querySelector('.lg\\:flex.lg\\:flex-row');
      if (flexContainer) {
        const styles = window.getComputedStyle(flexContainer);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection
        };
      }
      return null;
    });

    console.log('Desktop Hero Layout:', heroLayout);

    // Take screenshot
    await desktopPage.screenshot({
      path: 'tests/screenshots/hero-desktop-fixed.png',
      fullPage: false
    });
    console.log('✅ Desktop screenshot saved');

    // Test Mobile Layout
    console.log('\n📱 Mobile Test (375x812)...');
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 }
    });

    await mobilePage.goto('http://localhost:3004', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000);

    // Check if hero image is absolute on mobile
    const mobileImagePosition = await mobilePage.evaluate(() => {
      const imageContainer = document.querySelector('section motion.div');
      if (imageContainer) {
        const styles = window.getComputedStyle(imageContainer);
        return {
          position: styles.position,
          zIndex: styles.zIndex
        };
      }
      return null;
    });

    console.log('Mobile Image Container:', mobileImagePosition);

    // Take screenshot
    await mobilePage.screenshot({
      path: 'tests/screenshots/hero-mobile-fixed.png',
      fullPage: false
    });
    console.log('✅ Mobile screenshot saved');

    // Final check
    if (desktopImagePosition?.position === 'relative') {
      console.log('\n✅ SUCCESS: Hero image is properly positioned on desktop!');
    } else {
      console.log('\n⚠️ WARNING: Desktop positioning may still need adjustment');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testHeroLayout();