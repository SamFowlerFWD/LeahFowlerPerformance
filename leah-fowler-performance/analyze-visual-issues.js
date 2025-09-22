const { chromium } = require('playwright');

async function analyzeVisualIssues() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('🔍 Analyzing Leah Fowler Performance website...\n');
    
    await page.goto('http://localhost:3004', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await page.screenshot({ path: 'full-page.png', fullPage: true });
    console.log('📸 Full page screenshot saved as full-page.png\n');
    
    // Analyze each section
    const sections = [
      { name: 'Header', selector: 'header' },
      { name: 'Hero', selector: 'section:has-text("Transform Your Performance")' },
      { name: 'Assessment', selector: 'section:has-text("Discover Your Performance")' },
      { name: 'Programmes', selector: 'section:has-text("Programme")' },
      { name: 'About', selector: 'section:has-text("Your Performance Consultant")' },
      { name: 'Testimonials', selector: 'section:has-text("Success Stories")' },
      { name: 'Contact', selector: 'section:has-text("Ready to Excel")' },
      { name: 'Footer', selector: 'footer' }
    ];
    
    console.log('📊 VISUAL ANALYSIS RESULTS:\n');
    console.log('=' .repeat(60));
    
    for (const section of sections) {
      try {
        const element = await page.locator(section.selector).first();
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          const box = await element.boundingBox();
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              padding: computed.padding,
              paddingTop: computed.paddingTop,
              paddingBottom: computed.paddingBottom,
              paddingLeft: computed.paddingLeft,
              paddingRight: computed.paddingRight,
              margin: computed.margin,
              backgroundColor: computed.backgroundColor,
              maxWidth: el.querySelector('.container, .max-w-7xl, [class*="max-w"]')?.style.maxWidth || 
                       el.querySelector('.container, .max-w-7xl, [class*="max-w"]')?.className || 'none'
            };
          });
          
          console.log(`\n📍 ${section.name.toUpperCase()} SECTION:`);
          console.log(`   Position: ${Math.round(box.y)}px from top`);
          console.log(`   Height: ${Math.round(box.height)}px`);
          console.log(`   Width: ${Math.round(box.width)}px`);
          console.log(`   Padding: T:${styles.paddingTop} B:${styles.paddingBottom} L:${styles.paddingLeft} R:${styles.paddingRight}`);
          console.log(`   Background: ${styles.backgroundColor}`);
          
          // Check for visual issues
          const issues = [];
          
          // Check padding
          const topPadding = parseInt(styles.paddingTop);
          const bottomPadding = parseInt(styles.paddingBottom);
          const leftPadding = parseInt(styles.paddingLeft);
          const rightPadding = parseInt(styles.paddingRight);
          
          if (topPadding < 40 || bottomPadding < 40) {
            issues.push(`⚠️  Insufficient vertical padding (${topPadding}px top, ${bottomPadding}px bottom)`);
          }
          
          if (leftPadding < 16 || rightPadding < 16) {
            issues.push(`⚠️  Content may be touching edges (${leftPadding}px left, ${rightPadding}px right)`);
          }
          
          // Check width constraints
          if (box.width >= 1920) {
            issues.push(`⚠️  Section spans full width - needs container constraint`);
          }
          
          // Check background
          if (styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor === 'transparent') {
            issues.push(`⚠️  No background color set - looks flat`);
          }
          
          if (issues.length > 0) {
            console.log(`\n   ❌ ISSUES FOUND:`);
            issues.forEach(issue => console.log(`      ${issue}`));
          } else {
            console.log(`   ✅ Visual spacing appears correct`);
          }
          
        } else {
          console.log(`\n❌ ${section.name} section not found or not visible`);
        }
      } catch (e) {
        console.log(`\n❌ Could not analyze ${section.name} section: ${e.message}`);
      }
    }
    
    // Check overall visual hierarchy
    console.log('\n' + '=' .repeat(60));
    console.log('\n🎨 OVERALL VISUAL ASSESSMENT:\n');
    
    // Check for container constraints
    const containers = await page.locator('.container, .max-w-7xl, [class*="max-w"]').all();
    console.log(`   📦 Found ${containers.length} container elements`);
    
    // Check for cards
    const cards = await page.locator('[class*="shadow"], [class*="card"], [class*="rounded"]').all();
    console.log(`   🎴 Found ${cards.length} card-like elements`);
    
    // Check typography
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`   📝 Found ${headings.length} heading elements`);
    
    // Take viewport screenshots of key sections
    await page.locator('section').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'hero-section.png' });
    console.log('\n📸 Hero section screenshot saved as hero-section.png');
    
    // Scroll to assessment
    const assessment = await page.locator('text="Discover Your Performance"').first();
    if (await assessment.isVisible()) {
      await assessment.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'assessment-section.png' });
      console.log('📸 Assessment section screenshot saved as assessment-section.png');
    }
    
    // Scroll to programmes
    const programmes = await page.locator('text="Transform Your Performance"').nth(1);
    if (await programmes.isVisible()) {
      await programmes.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'programmes-section.png' });
      console.log('📸 Programmes section screenshot saved as programmes-section.png');
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n🔍 ANALYSIS COMPLETE!\n');
    console.log('Screenshots saved for visual inspection.');
    console.log('Review the issues identified above to improve the design.\n');
    
  } catch (error) {
    console.error('Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

analyzeVisualIssues();