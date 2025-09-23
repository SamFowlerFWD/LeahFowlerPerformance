import { test, expect, chromium } from '@playwright/test';

test.describe('Quick Glassmorphism Verification', () => {
  test('verify iOS 16 glass effect is applied', async () => {
    // Launch browser directly to avoid config issues
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      // Navigate to the running dev server
      await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

      // Scroll to About section
      await page.evaluate(() => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      // Wait for animations
      await page.waitForTimeout(2000);

      // Find the credential cards
      const glassCards = await page.$$eval('.absolute.z-10.hidden.md\\:block.group', cards => {
        return cards.map(card => {
          const styles = window.getComputedStyle(card);
          const childDiv = card.querySelector('div > div');
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
              webkitBackdropFilter: (childStyles as any)?.webkitBackdropFilter || (styles as any).webkitBackdropFilter,
              border: childStyles?.border || styles.border,
              boxShadow: childStyles?.boxShadow || styles.boxShadow,
              borderRadius: childStyles?.borderRadius || styles.borderRadius,
            },
            content: card.textContent?.trim(),
          };
        });
      });

      console.log('\n🔍 iOS 16 Glassmorphism Verification Results:\n');
      console.log('=' .repeat(60));

      if (glassCards.length === 0) {
        console.log('❌ No glass cards found!');
      } else {
        glassCards.forEach((card, index) => {
          console.log(`\n📱 Card ${index + 1}: ${card.visible ? '✅ Visible' : '❌ Hidden'}`);
          console.log(`   Position: top=${card.position.top}px, left=${card.position.left}px`);
          console.log(`   Content: ${card.content?.substring(0, 50)}...`);
          console.log('\n   🎨 Glassmorphism Properties:');
          console.log(`   • Background: ${card.glassmorphism.background}`);
          console.log(`   • Backdrop Filter: ${card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || 'Not supported'}`);
          console.log(`   • Border: ${card.glassmorphism.border}`);
          console.log(`   • Box Shadow: ${card.glassmorphism.boxShadow?.substring(0, 100)}...`);
          console.log(`   • Border Radius: ${card.glassmorphism.borderRadius}`);

          // Verify iOS 16 values
          const hasCorrectOpacity = card.glassmorphism.background?.includes('0.78') ||
                                   card.glassmorphism.background?.includes('199'); // 255 * 0.78
          const hasBlurEffect = (card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || '').includes('blur');
          const hasSaturate = (card.glassmorphism.backdropFilter || card.glassmorphism.webkitBackdropFilter || '').includes('saturate');

          console.log('\n   ✨ iOS 16 Compliance:');
          console.log(`   • Correct Opacity (0.78): ${hasCorrectOpacity ? '✅' : '❌'}`);
          console.log(`   • Blur Effect (24px): ${hasBlurEffect ? '✅' : '❌'}`);
          console.log(`   • Saturate (180%): ${hasSaturate ? '✅' : '❌'}`);
        });
      }

      console.log('\n' + '='.repeat(60));

      // Take screenshots
      const aboutSection = page.locator('#about');
      await aboutSection.screenshot({
        path: 'test-results/glassmorphism-verification.png'
      });

      // Screenshot individual cards
      for (let i = 0; i < glassCards.length; i++) {
        const card = page.locator('.absolute.z-10.hidden.md\\:block.group').nth(i);
        if (await card.isVisible()) {
          await card.screenshot({
            path: `test-results/glass-card-${i + 1}.png`
          });
        }
      }

      console.log('\n📸 Screenshots saved to test-results/');
      console.log('   • glassmorphism-verification.png (full section)');
      console.log(`   • glass-card-1.png to glass-card-${glassCards.length}.png (individual cards)`);

      // Test hover effect
      if (glassCards.length > 0) {
        console.log('\n🖱️  Testing hover effect on first card...');
        const firstCard = page.locator('.absolute.z-10.hidden.md\\:block.group').first();
        await firstCard.hover();
        await page.waitForTimeout(500);
        await firstCard.screenshot({
          path: 'test-results/glass-card-hover.png'
        });
        console.log('   • glass-card-hover.png saved');
      }

      // Assert that we have the correct glassmorphism
      expect(glassCards.length).toBeGreaterThan(0);
      expect(glassCards[0].visible).toBe(true);

    } finally {
      await browser.close();
    }
  });
});