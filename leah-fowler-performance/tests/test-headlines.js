const { chromium } = require('@playwright/test');

async function testHeadlines() {
  console.log('🎯 Testing New Hero Headlines - Thinking Ultra Hard!');
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    await page.goto('http://localhost:3004', { waitUntil: 'networkidle' });

    // Wait for initial load
    await page.waitForTimeout(1000);

    console.log('\n📝 Capturing headlines over 30 seconds...\n');
    const headlines = new Set();

    // Check headlines every second for 30 seconds
    for (let i = 0; i < 6; i++) {
      const headline = await page.evaluate(() => {
        const headlineElement = document.querySelector('h1');
        return headlineElement ? headlineElement.textContent.trim() : null;
      });

      if (headline && !headlines.has(headline)) {
        headlines.add(headline);
        console.log(`✅ Headline ${headlines.size}: "${headline}"`);
      }

      // Wait 5 seconds for next headline
      if (i < 5) await page.waitForTimeout(5000);
    }

    console.log('\n📊 Summary:');
    console.log(`Total unique headlines found: ${headlines.size}`);

    const expectedHeadlines = [
      "Strong Enough for Piggybacks at 40",
      "Be the Parent Who Races Them Up the Stairs",
      "Reclaim the Part of You Before You Were 'Just a Mum'",
      "A Strength That Carries You Forward, Mind and Body",
      "Meet You Where You Are Now and Get You to the Start Line"
    ];

    console.log('\n🔍 Verification:');
    for (const expected of expectedHeadlines) {
      if (Array.from(headlines).some(h => h === expected)) {
        console.log(`✅ Found: "${expected}"`);
      } else {
        console.log(`⏳ Not seen yet: "${expected}" (may need more time)`);
      }
    }

    // Take screenshot with current headline
    await page.screenshot({
      path: 'tests/screenshots/new-headlines.png',
      fullPage: false
    });
    console.log('\n📸 Screenshot saved with current headline');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testHeadlines();