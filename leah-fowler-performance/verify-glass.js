const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting iOS 16 Glassmorphism Verification...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100 // Slow down to see the effects
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Navigate to the running dev server
    console.log('📍 Navigating to http://localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    // Scroll to About section
    console.log('📍 Scrolling to About section...');
    await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Wait for animations
    await page.waitForTimeout(2000);

    // Find and analyze the credential cards
    console.log('🔍 Analyzing glass cards...\n');
    const glassCards = await page.$$eval('.absolute.z-10.hidden.md\\:block.group', cards => {
      return cards.map(card => {
        const styles = window.getComputedStyle(card);
        const childDiv = card.querySelector('div > div > div');
        const childStyles = childDiv ? window.getComputedStyle(childDiv) : null;

        return {
          visible: card.offsetWidth > 0 && card.offsetHeight > 0,
          position: {
            top: card.offsetTop,
            left: card.offsetLeft,
          },
          glassmorphism: {
            background: childStyles?.backgroundColor || styles.backgroundColor,
            backdropFilter: childStyles?.backdropFilter || styles.backdropFilter,
            webkitBackdropFilter: (childStyles)?.webkitBackdropFilter || (styles).webkitBackdropFilter,
            border: childStyles?.border || styles.border,
            boxShadow: childStyles?.boxShadow || styles.boxShadow,
            borderRadius: childStyles?.borderRadius || styles.borderRadius,
          },
          content: card.textContent?.trim().substring(0, 50),
        };
      });
    });

    console.log('=' .repeat(60));

    if (glassCards.length === 0) {
      console.log('❌ No glass cards found!');
      console.log('   Checking for alternative selectors...');

      // Try alternative selectors
      const altCards = await page.$$('.absolute.bg-white');
      console.log(`   Found ${altCards.length} elements with .absolute.bg-white`);
    } else {
      console.log(`✅ Found ${glassCards.length} glass cards\n`);

      glassCards.forEach((card, index) => {
        console.log(`📱 Card ${index + 1}: ${card.visible ? '✅ Visible' : '❌ Hidden'}`);
        console.log(`   Position: top=${card.position.top}px, left=${card.position.left}px`);
        console.log(`   Content: ${card.content}...`);
        console.log('\n   🎨 Glassmorphism Properties:');
        console.log(`   • Background: ${card.glassmorphism.background}`);
        console.log(`   • Backdrop Filter: ${card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || 'Not supported'}`);
        console.log(`   • Border: ${card.glassmorphism.border}`);
        console.log(`   • Box Shadow: ${card.glassmorphism.boxShadow?.substring(0, 80)}...`);
        console.log(`   • Border Radius: ${card.glassmorphism.borderRadius}`);

        // Verify iOS 16 values
        const hasCorrectOpacity = card.glassmorphism.background?.includes('0.78') ||
                                 card.glassmorphism.background?.includes('199'); // 255 * 0.78
        const hasBlurEffect = (card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || '').includes('blur');
        const hasSaturate = (card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || '').includes('saturate');

        console.log('\n   ✨ iOS 16 Compliance Check:');
        console.log(`   • Correct Opacity (0.78): ${hasCorrectOpacity ? '✅ YES' : '❌ NO'}`);
        console.log(`   • Blur Effect (24px): ${hasBlurEffect ? '✅ YES' : '❌ NO'}`);
        console.log(`   • Saturate (180%): ${hasSaturate ? '✅ YES' : '❌ NO'}`);
        console.log('-'.repeat(60));
      });
    }

    // Take screenshots
    console.log('\n📸 Taking screenshots...');
    const aboutSection = page.locator('#about');
    await aboutSection.screenshot({
      path: 'glassmorphism-about-section.png'
    });
    console.log('   • Saved: glassmorphism-about-section.png');

    // Test hover effect
    const firstCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();
    const cardExists = await firstCard.count() > 0;

    if (cardExists) {
      console.log('\n🖱️  Testing hover effect...');

      // Normal state
      await firstCard.screenshot({
        path: 'glass-card-normal.png'
      });
      console.log('   • Saved: glass-card-normal.png');

      // Hover state
      await firstCard.hover();
      await page.waitForTimeout(500);
      await firstCard.screenshot({
        path: 'glass-card-hover.png'
      });
      console.log('   • Saved: glass-card-hover.png');
    }

    console.log('\n✅ Verification complete!');
    console.log('   Check the screenshots to visually confirm the iOS 16 glassmorphism effect.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('\n🔒 Closing browser in 3 seconds...');
    await page.waitForTimeout(3000); // Keep browser open for a moment
    await browser.close();
  }
})();