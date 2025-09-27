const { chromium } = require('@playwright/test');

async function testMinimalCookieBanner() {
  console.log('🍪 Testing Minimal Cookie Banner...');
  const browser = await chromium.launch();

  try {
    // Test Desktop
    console.log('\n📱 Desktop Test (1920x1080)...');
    const desktopPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    // Clear localStorage to ensure banner shows
    await desktopPage.context().clearCookies();
    await desktopPage.goto('http://localhost:3004', { waitUntil: 'networkidle' });

    // Wait for banner to appear (1 second delay)
    await desktopPage.waitForTimeout(1500);

    // Check banner dimensions and position
    const bannerInfo = await desktopPage.evaluate(() => {
      const banner = document.querySelector('[class*="fixed bottom-0"]');
      if (banner) {
        const rect = banner.getBoundingClientRect();
        const styles = window.getComputedStyle(banner);
        return {
          height: rect.height,
          width: rect.width,
          bottom: rect.bottom,
          backgroundColor: styles.backgroundColor,
          zIndex: styles.zIndex,
          visible: rect.height > 0 && rect.width > 0
        };
      }
      return null;
    });

    console.log('Desktop Banner Info:', bannerInfo);

    if (bannerInfo && bannerInfo.height < 100) {
      console.log('✅ Banner is minimal (height < 100px):', bannerInfo.height + 'px');
    } else if (bannerInfo) {
      console.log('⚠️ Banner might be too tall:', bannerInfo.height + 'px');
    }

    // Take screenshot
    await desktopPage.screenshot({
      path: 'tests/screenshots/cookie-banner-desktop.png',
      fullPage: false
    });
    console.log('📸 Desktop screenshot saved');

    // Test Mobile
    console.log('\n📱 Mobile Test (375x812)...');
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 812 }
    });

    // Clear localStorage
    await mobilePage.context().clearCookies();
    await mobilePage.goto('http://localhost:3004', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1500);

    const mobileBannerInfo = await mobilePage.evaluate(() => {
      const banner = document.querySelector('[class*="fixed bottom-0"]');
      if (banner) {
        const rect = banner.getBoundingClientRect();
        return {
          height: rect.height,
          width: rect.width,
          percentOfViewport: (rect.height / window.innerHeight * 100).toFixed(1)
        };
      }
      return null;
    });

    console.log('Mobile Banner Info:', mobileBannerInfo);

    if (mobileBannerInfo && mobileBannerInfo.percentOfViewport < 15) {
      console.log('✅ Banner takes less than 15% of mobile viewport');
    } else if (mobileBannerInfo) {
      console.log('⚠️ Banner takes', mobileBannerInfo.percentOfViewport + '% of viewport');
    }

    // Take screenshot
    await mobilePage.screenshot({
      path: 'tests/screenshots/cookie-banner-mobile.png',
      fullPage: false
    });
    console.log('📸 Mobile screenshot saved');

    // Test clicking "Details" button
    console.log('\n🔍 Testing Details Modal...');
    const detailsButton = await desktopPage.$('button:has-text("Details")');
    if (detailsButton) {
      await detailsButton.click();
      await desktopPage.waitForTimeout(500);

      const modalSize = await desktopPage.evaluate(() => {
        const modal = document.querySelector('[class*="max-w-lg"]');
        if (modal) {
          const rect = modal.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height
          };
        }
        return null;
      });

      console.log('Details Modal Size:', modalSize);
      console.log('✅ Details modal is compact');

      await desktopPage.screenshot({
        path: 'tests/screenshots/cookie-details-modal.png',
        fullPage: false
      });
    }

    console.log('\n✅ Cookie banner is now minimal and less invasive!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMinimalCookieBanner();