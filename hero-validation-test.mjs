import { chromium } from 'playwright';

const TEST_URL = 'http://localhost:3001';

// Test configuration for different viewports
const viewports = {
  desktop: { width: 1366, height: 768, name: 'Desktop (1366x768)' },
  mobile: { width: 375, height: 667, name: 'iPhone SE (375x667)' }
};

async function runHeroValidation() {
  console.log('🚀 Starting Hero Section Validation Tests\n');
  console.log('=' .repeat(80));

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const results = {
    desktop: {},
    mobile: {},
    summary: { passed: 0, failed: 0, total: 0 }
  };

  try {
    // Test Desktop Viewport (1366x768)
    console.log('\n📊 TESTING DESKTOP VIEWPORT (1366x768)');
    console.log('-'.repeat(50));

    const desktopContext = await browser.newContext({
      viewport: viewports.desktop
    });
    const desktopPage = await desktopContext.newPage();

    // Enable console logging
    desktopPage.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    await desktopPage.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await desktopPage.waitForTimeout(2000); // Allow animations to complete

    // Test 1: Viewport Constraint Test
    console.log('\n✅ Test 1: Viewport Constraint');
    const heroHeight = await desktopPage.evaluate(() => {
      const hero = document.querySelector('.hero-section, [class*="hero"], section:first-of-type');
      if (!hero) return null;
      return {
        height: hero.offsetHeight,
        computedHeight: window.getComputedStyle(hero).height,
        windowHeight: window.innerHeight,
        hasScrollbar: document.documentElement.scrollHeight > window.innerHeight
      };
    });

    results.desktop.viewportConstraint = {
      passed: heroHeight && heroHeight.height === heroHeight.windowHeight && !heroHeight.hasScrollbar,
      heroHeight: heroHeight?.height,
      windowHeight: heroHeight?.windowHeight,
      hasScrollbar: heroHeight?.hasScrollbar,
      message: heroHeight ?
        `Hero height: ${heroHeight.height}px, Window: ${heroHeight.windowHeight}px, Scrollbar: ${heroHeight.hasScrollbar}` :
        'Hero section not found'
    };

    console.log(`  Hero height: ${heroHeight?.height}px`);
    console.log(`  Window height: ${heroHeight?.windowHeight}px`);
    console.log(`  Match: ${heroHeight?.height === heroHeight?.windowHeight ? '✅' : '❌'}`);
    console.log(`  Scrollbar present: ${heroHeight?.hasScrollbar ? '❌ Yes' : '✅ No'}`);

    // Test 2: Visual Artifacts Check
    console.log('\n✅ Test 2: Visual Artifacts Check');
    const visualArtifacts = await desktopPage.evaluate(() => {
      // Check for floating badges in upper left quadrant
      const badges = document.querySelectorAll('[class*="badge"], [class*="achievement"]');
      let floatingBadges = [];

      badges.forEach(badge => {
        const rect = badge.getBoundingClientRect();
        const style = window.getComputedStyle(badge);

        // Check if badge is in upper left quadrant and floating
        if (rect.top < window.innerHeight / 2 &&
            rect.left < window.innerWidth / 2 &&
            (style.position === 'fixed' || style.position === 'absolute')) {
          floatingBadges.push({
            class: badge.className,
            position: style.position,
            top: rect.top,
            left: rect.left
          });
        }
      });

      // Check for particle overflow
      const particleContainers = document.querySelectorAll('[class*="particle"], canvas');
      let overflowingElements = [];

      particleContainers.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
          overflowingElements.push({
            element: el.tagName,
            class: el.className,
            overflow: {
              right: rect.right > window.innerWidth,
              bottom: rect.bottom > window.innerHeight
            }
          });
        }
      });

      return {
        floatingBadges,
        overflowingElements,
        hasFloatingBadges: floatingBadges.length > 0,
        hasOverflow: overflowingElements.length > 0
      };
    });

    results.desktop.visualArtifacts = {
      passed: !visualArtifacts.hasFloatingBadges && !visualArtifacts.hasOverflow,
      floatingBadges: visualArtifacts.floatingBadges,
      overflowingElements: visualArtifacts.overflowingElements
    };

    console.log(`  Floating badges: ${visualArtifacts.hasFloatingBadges ? `❌ Found ${visualArtifacts.floatingBadges.length}` : '✅ None'}`);
    console.log(`  Particle overflow: ${visualArtifacts.hasOverflow ? `❌ Found ${visualArtifacts.overflowingElements.length}` : '✅ None'}`);

    // Test 3: Hero Image Check
    console.log('\n✅ Test 3: Hero Image Verification');
    const heroImage = await desktopPage.evaluate(() => {
      const expectedPath = '/images/hero/leah-hero-optimized.webp';

      // Check various possible selectors for hero image
      const selectors = [
        `img[src*="${expectedPath}"]`,
        '[class*="hero"] img',
        'section:first-of-type img',
        '[style*="background-image"]'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const src = el.src || '';
          const bgImage = window.getComputedStyle(el).backgroundImage || '';

          if (src.includes(expectedPath) || bgImage.includes(expectedPath)) {
            return {
              found: true,
              src: src || bgImage,
              selector,
              loaded: el.complete !== false
            };
          }
        }
      }

      return { found: false };
    });

    results.desktop.heroImage = {
      passed: heroImage.found && heroImage.loaded !== false,
      ...heroImage
    };

    console.log(`  Hero image found: ${heroImage.found ? '✅' : '❌'}`);
    if (heroImage.found) {
      console.log(`  Image path: ${heroImage.src}`);
      console.log(`  Image loaded: ${heroImage.loaded !== false ? '✅' : '❌'}`);
    }

    // Test 4: Content Visibility
    console.log('\n✅ Test 4: Content Visibility Check');
    const contentVisibility = await desktopPage.evaluate(() => {
      const checks = {
        headline: null,
        subheading: null,
        ctaButtons: [],
        scrollIndicator: null
      };

      // Check headline
      const headlineSelectors = ['h1', '[class*="headline"]', '[class*="title"]'];
      for (const selector of headlineSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          const rect = el.getBoundingClientRect();
          checks.headline = {
            found: true,
            visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
            text: el.textContent.substring(0, 50),
            position: { top: rect.top, bottom: rect.bottom }
          };
          break;
        }
      }

      // Check subheading
      const subheadingSelectors = ['h2', '[class*="subheading"]', '[class*="subtitle"]', 'p'];
      for (const selector of subheadingSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el.textContent.trim() && el.textContent.length > 20) {
            const rect = el.getBoundingClientRect();
            if (rect.top > 0 && rect.top < window.innerHeight / 2) {
              checks.subheading = {
                found: true,
                visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
                text: el.textContent.substring(0, 50),
                position: { top: rect.top, bottom: rect.bottom }
              };
              break;
            }
          }
        }
        if (checks.subheading) break;
      }

      // Check CTA buttons
      const buttons = document.querySelectorAll('button, a[class*="btn"], [class*="cta"]');
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          checks.ctaButtons.push({
            text: btn.textContent.trim(),
            visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
            position: { top: rect.top, bottom: rect.bottom }
          });
        }
      });

      // Check scroll indicator
      const scrollSelectors = ['[class*="scroll"]', '[class*="arrow"]', 'svg'];
      for (const selector of scrollSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 100 && rect.bottom <= window.innerHeight) {
            checks.scrollIndicator = {
              found: true,
              position: { top: rect.top, bottom: rect.bottom },
              nearBottom: rect.bottom > window.innerHeight - 100
            };
            break;
          }
        }
        if (checks.scrollIndicator) break;
      }

      return checks;
    });

    results.desktop.contentVisibility = {
      passed: contentVisibility.headline?.visible &&
              contentVisibility.subheading?.visible &&
              contentVisibility.ctaButtons.filter(b => b.visible).length >= 2,
      ...contentVisibility
    };

    console.log(`  Headline visible: ${contentVisibility.headline?.visible ? '✅' : '❌'}`);
    console.log(`  Subheading visible: ${contentVisibility.subheading?.visible ? '✅' : '❌'}`);
    console.log(`  CTA buttons visible: ${contentVisibility.ctaButtons.filter(b => b.visible).length} of ${contentVisibility.ctaButtons.length}`);
    console.log(`  Scroll indicator: ${contentVisibility.scrollIndicator?.found ? `✅ at bottom: ${contentVisibility.scrollIndicator.nearBottom}` : '⚠️ Not found'}`);

    // Test 5: Achievement Badge Position
    console.log('\n✅ Test 5: Achievement Badge Position');
    const achievementBadge = await desktopPage.evaluate(() => {
      const badges = document.querySelectorAll('[class*="achievement"], [class*="badge"]');
      let heroBottom = 0;

      const hero = document.querySelector('.hero-section, [class*="hero"], section:first-of-type');
      if (hero) {
        heroBottom = hero.getBoundingClientRect().bottom;
      }

      for (const badge of badges) {
        const rect = badge.getBoundingClientRect();
        const style = window.getComputedStyle(badge);

        // Check if badge is after hero section
        if (rect.top >= heroBottom || rect.top >= window.innerHeight) {
          return {
            found: true,
            afterHero: true,
            position: { top: rect.top, heroBottom },
            style: { position: style.position, zIndex: style.zIndex }
          };
        }
      }

      // Check if any badge is floating over hero
      for (const badge of badges) {
        const rect = badge.getBoundingClientRect();
        const style = window.getComputedStyle(badge);

        if ((style.position === 'fixed' || style.position === 'absolute') &&
            rect.top < heroBottom) {
          return {
            found: true,
            afterHero: false,
            floating: true,
            position: { top: rect.top, heroBottom },
            style: { position: style.position, zIndex: style.zIndex }
          };
        }
      }

      return { found: false };
    });

    results.desktop.achievementBadge = {
      passed: !achievementBadge.found || achievementBadge.afterHero,
      ...achievementBadge
    };

    console.log(`  Achievement badge: ${achievementBadge.found ?
      (achievementBadge.afterHero ? '✅ Positioned after hero' : '❌ Floating over hero') :
      '✅ No floating badges found'}`);

    // Take desktop screenshot
    await desktopPage.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/hero-desktop-validation.png',
      fullPage: false
    });

    await desktopContext.close();

    // Test Mobile Viewport (375x667)
    console.log('\n📱 TESTING MOBILE VIEWPORT (375x667)');
    console.log('-'.repeat(50));

    const mobileContext = await browser.newContext({
      viewport: viewports.mobile,
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(TEST_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await mobilePage.waitForTimeout(2000);

    // Mobile Test 1: Viewport Constraint
    console.log('\n✅ Mobile Test 1: Viewport Constraint');
    const mobileHeroHeight = await mobilePage.evaluate(() => {
      const hero = document.querySelector('.hero-section, [class*="hero"], section:first-of-type');
      if (!hero) return null;
      return {
        height: hero.offsetHeight,
        windowHeight: window.innerHeight,
        fits: hero.offsetHeight <= window.innerHeight,
        hasScrollbar: document.documentElement.scrollHeight > window.innerHeight
      };
    });

    results.mobile.viewportConstraint = {
      passed: mobileHeroHeight && mobileHeroHeight.fits,
      ...mobileHeroHeight
    };

    console.log(`  Hero height: ${mobileHeroHeight?.height}px`);
    console.log(`  Window height: ${mobileHeroHeight?.windowHeight}px`);
    console.log(`  Fits in viewport: ${mobileHeroHeight?.fits ? '✅' : '❌'}`);

    // Mobile Test 2: Content Overflow
    console.log('\n✅ Mobile Test 2: Content Overflow Check');
    const mobileOverflow = await mobilePage.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let overflowing = [];

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.width > window.innerWidth) {
          overflowing.push({
            tag: el.tagName,
            class: el.className,
            width: rect.width,
            right: rect.right
          });
        }
      });

      return {
        hasOverflow: overflowing.length > 0,
        elements: overflowing.slice(0, 5) // Limit to first 5
      };
    });

    results.mobile.overflow = {
      passed: !mobileOverflow.hasOverflow,
      ...mobileOverflow
    };

    console.log(`  Content overflow: ${mobileOverflow.hasOverflow ?
      `❌ ${mobileOverflow.elements.length} elements` : '✅ None'}`);

    // Take mobile screenshot
    await mobilePage.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/hero-mobile-validation.png',
      fullPage: false
    });

    await mobileContext.close();

    // Calculate summary
    const allTests = [...Object.values(results.desktop), ...Object.values(results.mobile)];
    results.summary.total = allTests.length;
    results.summary.passed = allTests.filter(t => t.passed).length;
    results.summary.failed = results.summary.total - results.summary.passed;

    // Print Summary
    console.log('\n' + '='.repeat(80));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(80));

    console.log('\n🖥️  Desktop Results:');
    Object.entries(results.desktop).forEach(([test, result]) => {
      console.log(`  ${test}: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    });

    console.log('\n📱 Mobile Results:');
    Object.entries(results.mobile).forEach(([test, result]) => {
      console.log(`  ${test}: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`OVERALL: ${results.summary.passed}/${results.summary.total} tests passed`);
    console.log(results.summary.failed === 0 ?
      '✅ ALL TESTS PASSED!' :
      `❌ ${results.summary.failed} tests failed`);
    console.log('='.repeat(80));

    // Save detailed results
    const fs = await import('fs');
    await fs.promises.writeFile(
      '/Users/samfowler/Code/LeahFowlerPerformance-1/hero-validation-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n📸 Screenshots saved:');
    console.log('  - hero-desktop-validation.png');
    console.log('  - hero-mobile-validation.png');
    console.log('\n📊 Detailed results saved to: hero-validation-results.json');

  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    await browser.close();
  }
}

// Run the validation
runHeroValidation().catch(console.error);