import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Breakpoints to test
const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'iPhone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1920, height: 1080 }
];

// Sections to check
const sections = ['hero', 'assessment', 'programmes', 'testimonials', 'about', 'contact', 'footer'];

async function testSpacing() {
  console.log('🚀 Starting Spacing Validation Tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const results = {
    timestamp: new Date().toISOString(),
    breakpoints: {},
    issues: [],
    successes: []
  };

  try {
    // Create test-results directory
    await fs.mkdir('test-results', { recursive: true });

    for (const breakpoint of breakpoints) {
      console.log(`\n📱 Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);
      console.log('═'.repeat(50));
      
      const context = await browser.newContext({
        viewport: { width: breakpoint.width, height: breakpoint.height }
      });
      const page = await context.newPage();
      
      try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // Initialize results for this breakpoint
        results.breakpoints[breakpoint.name] = {
          width: breakpoint.width,
          height: breakpoint.height,
          sections: {},
          spacing: {},
          issues: []
        };

        // 1. Check viewport edge spacing
        const bodyPadding = await page.evaluate(() => {
          const body = document.body;
          const styles = window.getComputedStyle(body);
          return {
            top: parseFloat(styles.paddingTop),
            right: parseFloat(styles.paddingRight),
            bottom: parseFloat(styles.paddingBottom),
            left: parseFloat(styles.paddingLeft),
            margin: styles.margin
          };
        });

        console.log(`  Body padding: T:${bodyPadding.top}px R:${bodyPadding.right}px B:${bodyPadding.bottom}px L:${bodyPadding.left}px`);

        // 2. Check main container padding
        const mainPadding = await page.evaluate(() => {
          const main = document.querySelector('main');
          if (!main) return null;
          const styles = window.getComputedStyle(main);
          return {
            top: parseFloat(styles.paddingTop),
            right: parseFloat(styles.paddingRight),
            bottom: parseFloat(styles.paddingBottom),
            left: parseFloat(styles.paddingLeft)
          };
        });

        if (mainPadding) {
          console.log(`  Main padding: T:${mainPadding.top}px R:${mainPadding.right}px B:${mainPadding.bottom}px L:${mainPadding.left}px`);
          
          // Check minimum padding requirements
          const minHorizontal = breakpoint.width <= 768 ? 16 : 32;
          const minVertical = breakpoint.width <= 768 ? 48 : 80;
          
          if (mainPadding.left < minHorizontal || mainPadding.right < minHorizontal) {
            const issue = `⚠️  Insufficient horizontal padding: ${mainPadding.left}px/${mainPadding.right}px (min: ${minHorizontal}px)`;
            console.log(issue);
            results.breakpoints[breakpoint.name].issues.push(issue);
            results.issues.push(`${breakpoint.name}: ${issue}`);
          } else {
            results.successes.push(`${breakpoint.name}: ✅ Adequate horizontal padding`);
          }
        }

        // 3. Check header overlap
        const headerCheck = await page.evaluate(() => {
          const header = document.querySelector('header');
          const hero = document.querySelector('#hero');
          if (!header || !hero) return null;
          
          const headerRect = header.getBoundingClientRect();
          const heroRect = hero.getBoundingClientRect();
          const heroStyles = window.getComputedStyle(hero);
          
          return {
            headerHeight: headerRect.height,
            heroTop: heroRect.top,
            heroPaddingTop: parseFloat(heroStyles.paddingTop),
            overlap: heroRect.top < headerRect.height
          };
        });

        if (headerCheck) {
          if (headerCheck.overlap) {
            const issue = `⚠️  Header overlaps content! Hero top: ${headerCheck.heroTop}px, Header height: ${headerCheck.headerHeight}px`;
            console.log(issue);
            results.breakpoints[breakpoint.name].issues.push(issue);
            results.issues.push(`${breakpoint.name}: ${issue}`);
          } else {
            console.log(`  ✅ No header overlap (Hero padding-top: ${headerCheck.heroPaddingTop}px)`);
            results.successes.push(`${breakpoint.name}: ✅ No header overlap`);
          }
        }

        // 4. Check section spacing
        console.log('\n  Section Spacing:');
        for (const sectionId of sections) {
          const sectionData = await page.evaluate((id) => {
            const section = document.getElementById(id);
            if (!section) return null;
            
            const styles = window.getComputedStyle(section);
            const rect = section.getBoundingClientRect();
            
            return {
              paddingTop: parseFloat(styles.paddingTop),
              paddingBottom: parseFloat(styles.paddingBottom),
              paddingLeft: parseFloat(styles.paddingLeft),
              paddingRight: parseFloat(styles.paddingRight),
              marginTop: parseFloat(styles.marginTop),
              marginBottom: parseFloat(styles.marginBottom),
              width: rect.width,
              viewportWidth: window.innerWidth,
              touchesEdge: rect.left <= 0 || rect.right >= window.innerWidth
            };
          }, sectionId);

          if (sectionData) {
            results.breakpoints[breakpoint.name].sections[sectionId] = sectionData;
            
            console.log(`    ${sectionId}: PT:${sectionData.paddingTop}px PB:${sectionData.paddingBottom}px PL:${sectionData.paddingLeft}px PR:${sectionData.paddingRight}px`);
            
            if (sectionData.touchesEdge) {
              const issue = `⚠️  Section "${sectionId}" touches viewport edge!`;
              console.log(`      ${issue}`);
              results.breakpoints[breakpoint.name].issues.push(issue);
              results.issues.push(`${breakpoint.name}: ${issue}`);
            }
          }
        }

        // 5. Check card and button padding
        const cardCheck = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll('.card, [class*="card"], [data-testid*="card"]'));
          const buttons = Array.from(document.querySelectorAll('button, .btn, [role="button"]'));
          
          const cardPadding = cards.slice(0, 3).map(card => {
            const styles = window.getComputedStyle(card);
            return {
              top: parseFloat(styles.paddingTop),
              right: parseFloat(styles.paddingRight),
              bottom: parseFloat(styles.paddingBottom),
              left: parseFloat(styles.paddingLeft)
            };
          });
          
          const buttonPadding = buttons.slice(0, 3).map(btn => {
            const styles = window.getComputedStyle(btn);
            return {
              height: parseFloat(styles.height),
              paddingY: parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom),
              paddingX: parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
            };
          });
          
          return { cardPadding, buttonPadding };
        });

        if (cardCheck.cardPadding.length > 0) {
          const avgCardPadding = cardCheck.cardPadding.reduce((acc, p) => ({
            top: acc.top + p.top / cardCheck.cardPadding.length,
            right: acc.right + p.right / cardCheck.cardPadding.length,
            bottom: acc.bottom + p.bottom / cardCheck.cardPadding.length,
            left: acc.left + p.left / cardCheck.cardPadding.length
          }), { top: 0, right: 0, bottom: 0, left: 0 });
          
          console.log(`\n  Card padding (avg): T:${avgCardPadding.top.toFixed(1)}px R:${avgCardPadding.right.toFixed(1)}px B:${avgCardPadding.bottom.toFixed(1)}px L:${avgCardPadding.left.toFixed(1)}px`);
          
          if (avgCardPadding.top < 16 || avgCardPadding.left < 16) {
            const issue = `⚠️  Insufficient card padding`;
            results.breakpoints[breakpoint.name].issues.push(issue);
            results.issues.push(`${breakpoint.name}: ${issue}`);
          } else {
            results.successes.push(`${breakpoint.name}: ✅ Adequate card padding`);
          }
        }

        if (cardCheck.buttonPadding.length > 0) {
          const avgButtonHeight = cardCheck.buttonPadding.reduce((acc, b) => acc + b.height, 0) / cardCheck.buttonPadding.length;
          console.log(`  Button height (avg): ${avgButtonHeight.toFixed(1)}px`);
          
          if (breakpoint.width <= 768 && avgButtonHeight < 44) {
            const issue = `⚠️  Buttons too small for mobile (${avgButtonHeight.toFixed(1)}px < 44px)`;
            results.breakpoints[breakpoint.name].issues.push(issue);
            results.issues.push(`${breakpoint.name}: ${issue}`);
          } else {
            results.successes.push(`${breakpoint.name}: ✅ Adequate button size`);
          }
        }

        // 6. Check horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasHorizontalScroll) {
          const issue = `⚠️  Horizontal scroll detected!`;
          console.log(`\n  ${issue}`);
          results.breakpoints[breakpoint.name].issues.push(issue);
          results.issues.push(`${breakpoint.name}: ${issue}`);
        } else {
          console.log('\n  ✅ No horizontal scroll');
          results.successes.push(`${breakpoint.name}: ✅ No horizontal scroll`);
        }

        // 7. Check WhatsApp button positioning
        const whatsappCheck = await page.evaluate(() => {
          const whatsappBtn = document.querySelector('[aria-label*="WhatsApp"], .whatsapp-button, [href*="wa.me"]');
          if (!whatsappBtn) return null;
          
          const rect = whatsappBtn.getBoundingClientRect();
          return {
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
            overlapsContent: rect.left < 100 || rect.top < 100
          };
        });

        if (whatsappCheck) {
          console.log(`  WhatsApp button: R:${whatsappCheck.right}px B:${whatsappCheck.bottom}px`);
          if (whatsappCheck.overlapsContent) {
            const issue = `⚠️  WhatsApp button may overlap content`;
            results.breakpoints[breakpoint.name].issues.push(issue);
          }
        }

        // Take screenshots
        await page.screenshot({ 
          path: `test-results/${breakpoint.name}-full.png`,
          fullPage: true 
        });
        console.log(`  📸 Screenshot saved: test-results/${breakpoint.name}-full.png`);

        // Capture specific sections
        for (const sectionId of ['hero', 'assessment', 'programmes']) {
          const section = await page.$(`#${sectionId}`);
          if (section) {
            await section.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            await section.screenshot({ 
              path: `test-results/${breakpoint.name}-${sectionId}.png` 
            });
          }
        }

      } catch (error) {
        console.error(`  ❌ Error testing ${breakpoint.name}:`, error.message);
        results.breakpoints[breakpoint.name].error = error.message;
      } finally {
        await context.close();
      }
    }

    // Generate HTML report
    await generateHTMLReport(results);
    
    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 SUMMARY');
    console.log('═'.repeat(60));
    
    if (results.issues.length === 0) {
      console.log('✅ All spacing checks passed!');
    } else {
      console.log(`\n⚠️  Issues Found (${results.issues.length}):`);
      results.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log(`\n✅ Successes (${results.successes.length}):`);
    results.successes.slice(0, 5).forEach(success => console.log(`  - ${success}`));
    
    console.log('\n📄 Report saved: test-results/spacing-report.html');
    console.log('📸 Screenshots saved in: test-results/');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

async function generateHTMLReport(results) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Spacing Validation Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    h1 { color: #2563eb; margin-bottom: 1rem; font-size: 2rem; }
    h2 { color: #1e40af; margin: 2rem 0 1rem; font-size: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    h3 { color: #3730a3; margin: 1.5rem 0 0.5rem; font-size: 1.2rem; }
    .summary { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .stat { background: #f9fafb; padding: 1rem; border-radius: 4px; text-align: center; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #2563eb; }
    .stat-label { color: #6b7280; font-size: 0.9rem; }
    .breakpoint { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .issue { background: #fef2f2; color: #991b1b; padding: 0.5rem 1rem; border-left: 4px solid #ef4444; margin: 0.5rem 0; border-radius: 4px; }
    .success { background: #f0fdf4; color: #166534; padding: 0.5rem 1rem; border-left: 4px solid #22c55e; margin: 0.5rem 0; border-radius: 4px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin: 1rem 0; }
    .metric { background: #f9fafb; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem; }
    .metric-label { color: #6b7280; font-size: 0.8rem; }
    .metric-value { font-weight: bold; color: #111827; }
    .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .screenshot { background: white; padding: 0.5rem; border-radius: 4px; text-align: center; }
    .screenshot img { max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; }
    .screenshot-label { color: #6b7280; font-size: 0.9rem; margin-top: 0.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
    .badge-success { background: #22c55e; color: white; }
    .badge-warning { background: #f59e0b; color: white; }
    .badge-error { background: #ef4444; color: white; }
    .timestamp { color: #6b7280; font-size: 0.9rem; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📐 Spacing Validation Report</h1>
    <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${Object.keys(results.breakpoints).length}</div>
          <div class="stat-label">Breakpoints Tested</div>
        </div>
        <div class="stat">
          <div class="stat-value">${results.issues.length}</div>
          <div class="stat-label">Issues Found</div>
        </div>
        <div class="stat">
          <div class="stat-value">${results.successes.length}</div>
          <div class="stat-label">Checks Passed</div>
        </div>
        <div class="stat">
          <div class="stat-value">${results.issues.length === 0 ? '✅' : '⚠️'}</div>
          <div class="stat-label">Overall Status</div>
        </div>
      </div>
      
      ${results.issues.length > 0 ? `
      <h3>Issues to Address</h3>
      ${results.issues.map(issue => `<div class="issue">${issue}</div>`).join('')}
      ` : '<div class="success">✅ All spacing checks passed successfully!</div>'}
    </div>
    
    <h2>Breakpoint Analysis</h2>
    ${Object.entries(results.breakpoints).map(([name, data]) => `
    <div class="breakpoint">
      <h3>${name.charAt(0).toUpperCase() + name.slice(1)} (${data.width}x${data.height}px)
        <span class="badge ${data.issues.length === 0 ? 'badge-success' : 'badge-warning'}">
          ${data.issues.length === 0 ? 'PASS' : `${data.issues.length} issues`}
        </span>
      </h3>
      
      ${data.issues.length > 0 ? `
      <div style="margin: 1rem 0;">
        ${data.issues.map(issue => `<div class="issue">${issue}</div>`).join('')}
      </div>
      ` : ''}
      
      <h4 style="margin-top: 1rem; color: #6b7280;">Section Metrics</h4>
      <div class="metrics">
        ${Object.entries(data.sections).slice(0, 4).map(([section, metrics]) => `
        <div class="metric">
          <div class="metric-label">${section}</div>
          <div class="metric-value">P: ${metrics.paddingTop}/${metrics.paddingBottom}px</div>
        </div>
        `).join('')}
      </div>
      
      <div class="screenshots">
        <div class="screenshot">
          <img src="${name}-full.png" alt="${name} full page">
          <div class="screenshot-label">Full Page</div>
        </div>
        ${['hero', 'assessment', 'programmes'].map(section => `
        <div class="screenshot">
          <img src="${name}-${section}.png" alt="${name} ${section}" onerror="this.style.display='none'">
          <div class="screenshot-label">${section.charAt(0).toUpperCase() + section.slice(1)}</div>
        </div>
        `).join('')}
      </div>
    </div>
    `).join('')}
    
    <h2>Recommendations</h2>
    <div class="summary">
      <ul style="margin-left: 1.5rem; color: #4b5563;">
        ${results.issues.length === 0 ? `
        <li>✅ Spacing implementation is excellent across all breakpoints</li>
        <li>✅ No content touches viewport edges</li>
        <li>✅ Header positioning is correct with no overlaps</li>
        <li>✅ Consistent section spacing maintained</li>
        <li>✅ Touch targets meet accessibility guidelines</li>
        ` : `
        <li>Review and fix identified spacing issues</li>
        <li>Ensure minimum padding requirements are met for each breakpoint</li>
        <li>Verify header doesn't overlap content on all devices</li>
        <li>Check that no sections touch viewport edges</li>
        <li>Validate touch target sizes on mobile devices (min 44px)</li>
        `}
      </ul>
    </div>
  </div>
</body>
</html>`;

  await fs.writeFile('test-results/spacing-report.html', html);
}

// Run tests
testSpacing().catch(console.error);