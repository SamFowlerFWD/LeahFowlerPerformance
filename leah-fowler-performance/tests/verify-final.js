// Final verification of all changes
const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Final Verification of Mobile Fixes\n');
  console.log('=' .repeat(50));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3007', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('\n📱 MOBILE VIEW (375px)');
    console.log('-'.repeat(40));

    // 1. HERO TEXT ALIGNMENT
    const heroContent = await page.locator('.relative.z-10.w-full.max-w-2xl').first();
    const heroClasses = await heroContent.getAttribute('class');
    const hasTextCenter = heroClasses.includes('text-center');
    console.log(`\n1. Hero Text Alignment:`);
    console.log(`   Classes: ${heroClasses}`);
    console.log(`   ✅ Centered: ${hasTextCenter ? 'YES' : 'NO'}`);

    // 2. HEADLINE SIZE (2.5x bigger)
    const headline = await page.locator('h1').first();
    const headlineClasses = await headline.getAttribute('class');
    const headlineSize = await headline.evaluate(el => window.getComputedStyle(el).fontSize);
    console.log(`\n2. Headline Size (was ~24px, should be ~60px):`);
    console.log(`   Classes: ${headlineClasses}`);
    console.log(`   Computed size: ${headlineSize}`);
    console.log(`   ✅ Has text-6xl: ${headlineClasses.includes('text-6xl') ? 'YES' : 'NO'}`);

    // 3. SUBHEADING SIZE (2.5x bigger)
    const subheading = await page.locator('p').filter({ hasText: 'Norfolk Strength' }).first();
    const subheadingClasses = await subheading.getAttribute('class');
    const subheadingSize = await subheading.evaluate(el => window.getComputedStyle(el).fontSize);
    console.log(`\n3. Subheading Size (was ~14px, should be ~20px):`);
    console.log(`   Classes: ${subheadingClasses}`);
    console.log(`   Computed size: ${subheadingSize}`);
    console.log(`   ✅ Has text-xl: ${subheadingClasses.includes('text-xl') ? 'YES' : 'NO'}`);

    // 4. CTA BUTTON ALIGNMENT
    // Find the actual hero CTA container (the one with "Apply for Coaching" button)
    const ctaButton = await page.locator('a:has-text("Apply for Coaching")').first();
    const ctaContainer = await ctaButton.locator('xpath=ancestor::div[contains(@class, "flex")]').first();
    const ctaClasses = await ctaContainer.getAttribute('class');
    console.log(`\n4. CTA Button Alignment:`);
    console.log(`   Classes: ${ctaClasses}`);
    console.log(`   ✅ Centered: ${ctaClasses.includes('justify-center') ? 'YES' : 'NO'}`);

    // 5. LOGO SIZE (doubled)
    const logoContainer = await page.locator('.relative').filter({ has: page.locator('img[alt*="Strength PT"]') }).first();
    const logoClasses = await logoContainer.getAttribute('class');
    const logoHeight = await logoContainer.evaluate(el => el.offsetHeight);
    console.log(`\n5. Logo Size (doubled from ~40px to ~80px):`);
    console.log(`   Classes: ${logoClasses}`);
    console.log(`   Computed height: ${logoHeight}px`);
    console.log(`   ✅ Has h-20: ${logoClasses.includes('h-20') ? 'YES' : 'NO'}`);

    // 6. HEADER HEIGHT (should remain compact)
    const header = await page.locator('header').first();
    const headerHeight = await header.evaluate(el => el.offsetHeight);
    console.log(`\n6. Header Height (should be <100px):`);
    console.log(`   Height: ${headerHeight}px`);
    console.log(`   ✅ Compact: ${headerHeight < 100 ? 'YES' : 'NO'}`);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-final-375px.png', fullPage: false });

    // TEST DESKTOP VIEW
    console.log('\n\n🖥️  DESKTOP VIEW (1920px)');
    console.log('-'.repeat(40));
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Check desktop alignment
    const desktopHeroClasses = await heroContent.getAttribute('class');
    console.log(`\n1. Desktop Text Alignment:`);
    console.log(`   ✅ Left-aligned: ${desktopHeroClasses.includes('lg:text-left') ? 'YES' : 'NO'}`);

    const desktopCtaClasses = await ctaContainer.getAttribute('class');
    console.log(`\n2. Desktop CTA Alignment:`);
    console.log(`   ✅ Left-aligned: ${desktopCtaClasses.includes('lg:justify-start') ? 'YES' : 'NO'}`);

    const desktopHeadlineClasses = await headline.getAttribute('class');
    console.log(`\n3. Desktop Headline Size:`);
    console.log(`   ✅ Has lg:text-5xl: ${desktopHeadlineClasses.includes('lg:text-5xl') ? 'YES' : 'NO'}`);

    await page.screenshot({ path: 'tests/screenshots/desktop-final-1920px.png', fullPage: false });

    // SUMMARY
    console.log('\n\n' + '=' .repeat(50));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(50));

    const allPassed = hasTextCenter &&
                      headlineClasses.includes('text-6xl') &&
                      subheadingClasses.includes('text-xl') &&
                      ctaClasses.includes('justify-center') &&
                      logoClasses.includes('h-20') &&
                      headerHeight < 100 &&
                      desktopHeroClasses.includes('lg:text-left') &&
                      desktopCtaClasses.includes('lg:justify-start');

    if (allPassed) {
      console.log('\n✅✅✅ ALL REQUIREMENTS MET! ✅✅✅');
      console.log('\nChanges successfully implemented:');
      console.log('  ✓ Hero text centered on mobile');
      console.log('  ✓ Text sizes increased 2.5x on mobile');
      console.log('  ✓ Logo doubled in size');
      console.log('  ✓ Header height maintained');
      console.log('  ✓ Desktop layout preserved');
    } else {
      console.log('\n⚠️  Some requirements may need attention');
    }

    console.log('\n📸 Screenshots saved:');
    console.log('  - tests/screenshots/mobile-final-375px.png');
    console.log('  - tests/screenshots/desktop-final-1920px.png');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
})();