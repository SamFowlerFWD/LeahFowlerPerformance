const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Quick iOS 16 Glassmorphism Check...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Navigate with shorter timeout
    console.log('📍 Navigating to localhost:3002...');
    await page.goto('http://localhost:3002', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Scroll to About section
    console.log('📍 Scrolling to About section...');
    await page.evaluate(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        console.log('About section not found!');
      }
    });

    // Wait for any animations
    await page.waitForTimeout(1500);

    // Quick check for glass cards
    const glassCardCount = await page.locator('.absolute.z-10.group').count();
    console.log(`\n✅ Found ${glassCardCount} potential glass cards`);

    // Check for any absolute positioned cards
    const absoluteCards = await page.$$eval('.absolute', elements => {
      return elements.filter(el => {
        const text = el.textContent || '';
        return text.includes('Expert') || text.includes('Coach') || text.includes('Specialist');
      }).map(el => ({
        text: el.textContent?.trim().substring(0, 50),
        classes: el.className,
        styles: {
          background: window.getComputedStyle(el).backgroundColor,
          backdropFilter: window.getComputedStyle(el).backdropFilter,
        }
      }));
    });

    if (absoluteCards.length > 0) {
      console.log('\n📱 Found credential cards:');
      absoluteCards.forEach((card, i) => {
        console.log(`   ${i + 1}. ${card.text}`);
        console.log(`      Classes: ${card.classes.substring(0, 100)}...`);
        console.log(`      Background: ${card.styles.background}`);
        console.log(`      Backdrop: ${card.styles.backdropFilter || 'none'}`);
      });
    }

    // Take a screenshot
    console.log('\n📸 Taking screenshot of About section...');
    const aboutSection = page.locator('#about');
    const aboutExists = await aboutSection.count() > 0;

    if (aboutExists) {
      await aboutSection.screenshot({
        path: 'about-glass-check.png'
      });
      console.log('   ✅ Screenshot saved: about-glass-check.png');
    } else {
      console.log('   ❌ About section not found for screenshot');
    }

    // Try to screenshot the specific glass card area
    const imageContainer = page.locator('.relative').filter({
      has: page.locator('img[alt*="Leah"]')
    });
    const containerExists = await imageContainer.count() > 0;

    if (containerExists) {
      await imageContainer.first().screenshot({
        path: 'glass-cards-area.png'
      });
      console.log('   ✅ Screenshot saved: glass-cards-area.png');
    }

    console.log('\n✨ Check complete! Review the screenshots to see the glassmorphism effect.');
    console.log('   Browser will stay open for 5 seconds...');

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed.');
  }
})();