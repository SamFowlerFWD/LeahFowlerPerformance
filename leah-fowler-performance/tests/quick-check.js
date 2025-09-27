// Quick verification script to check our mobile changes
const { chromium } = require('playwright');

(async () => {
  console.log('Starting quick mobile responsiveness check...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    console.log('📱 Testing Mobile (375px)...');
    await page.goto('http://localhost:3007', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Check hero text alignment
    const heroContent = await page.locator('.relative.z-10.w-full.max-w-2xl').first();
    const hasTextCenter = await heroContent.evaluate(el => el.classList.contains('text-center'));
    console.log(`✓ Hero text centered on mobile: ${hasTextCenter ? 'YES ✅' : 'NO ❌'}`);

    // Check headline size
    const headline = await page.locator('h1').first();
    const headlineClasses = await headline.getAttribute('class');
    const hasLargeText = headlineClasses.includes('text-6xl');
    console.log(`✓ Headline has text-6xl: ${hasLargeText ? 'YES ✅' : 'NO ❌'}`);

    // Check subheading size
    const subheading = await page.locator('p').filter({ hasText: 'Norfolk Strength' }).first();
    const subheadingClasses = await subheading.getAttribute('class');
    const hasLargeSubtext = subheadingClasses.includes('text-xl');
    console.log(`✓ Subheading has text-xl: ${hasLargeSubtext ? 'YES ✅' : 'NO ❌'}`);

    // Check CTA alignment
    const ctaContainer = await page.locator('.flex.flex-col').filter({ has: page.locator('button') }).first();
    const ctaClasses = await ctaContainer.getAttribute('class');
    const hasCenterJustify = ctaClasses.includes('justify-center');
    console.log(`✓ CTA buttons centered: ${hasCenterJustify ? 'YES ✅' : 'NO ❌'}`);

    // Check logo size
    const logoContainer = await page.locator('.relative').filter({ has: page.locator('img[alt*="Strength PT"]') }).first();
    const logoClasses = await logoContainer.getAttribute('class');
    const hasLargeLogo = logoClasses.includes('h-20');
    console.log(`✓ Logo has h-20 class: ${hasLargeLogo ? 'YES ✅' : 'NO ❌'}`);

    // Check header height
    const header = await page.locator('header').first();
    const headerHeight = await header.evaluate(el => el.offsetHeight);
    console.log(`✓ Header height: ${headerHeight}px (should be <100px): ${headerHeight < 100 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-quick-check.png' });
    console.log('\n📸 Screenshot saved to tests/screenshots/mobile-quick-check.png');

    console.log('\n\n🖥️  Testing Desktop (1920px)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Check desktop text alignment
    const desktopHasLeftAlign = await heroContent.evaluate(el => el.classList.contains('lg:text-left'));
    console.log(`✓ Hero text left-aligned on desktop: ${desktopHasLeftAlign ? 'YES ✅' : 'NO ❌'}`);

    // Check desktop headline size
    const desktopHeadlineClasses = await headline.getAttribute('class');
    const hasDesktopSize = desktopHeadlineClasses.includes('lg:text-5xl');
    console.log(`✓ Headline has lg:text-5xl: ${hasDesktopSize ? 'YES ✅' : 'NO ❌'}`);

    // Check desktop CTA alignment
    const desktopCtaClasses = await ctaContainer.getAttribute('class');
    const hasDesktopJustify = desktopCtaClasses.includes('lg:justify-start');
    console.log(`✓ CTA buttons left-aligned on desktop: ${hasDesktopJustify ? 'YES ✅' : 'NO ❌'}`);

    // Take desktop screenshot
    await page.screenshot({ path: 'tests/screenshots/desktop-quick-check.png' });
    console.log('\n📸 Screenshot saved to tests/screenshots/desktop-quick-check.png');

    console.log('\n✅ Quick check complete! Review the screenshots to verify visual appearance.');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
})();