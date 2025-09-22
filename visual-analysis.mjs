import { chromium } from 'playwright';

const viewports = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 }
];

const pages = [
  { name: 'Homepage', url: 'http://localhost:3001' },
  { name: 'Assessment', url: 'http://localhost:3001/assessment' }
];

async function analyzeVisuals() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const issues = {
    critical: [],
    major: [],
    minor: []
  };

  console.log('🔍 Starting Visual Analysis of Leah Fowler Performance Website\n');

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}px)\n`);

    for (const pageInfo of pages) {
      console.log(`  → Analyzing ${pageInfo.name}...`);

      try {
        await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(1000);

        // Take screenshot for reference
        await page.screenshot({
          path: `screenshots/${pageInfo.name.toLowerCase()}-${viewport.name.toLowerCase()}.png`,
          fullPage: true
        });

        // Analyze Hero Section
        const heroSection = await page.$('[data-hero], .hero, section:first-of-type, header + section');
        if (heroSection) {
          const heroBounds = await heroSection.boundingBox();
          const heroStyles = await heroSection.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              paddingTop: styles.paddingTop,
              paddingBottom: styles.paddingBottom,
              paddingLeft: styles.paddingLeft,
              paddingRight: styles.paddingRight,
              marginTop: styles.marginTop
            };
          });

          // Check hero padding issues
          if (viewport.name === 'Mobile' && parseInt(heroStyles.paddingLeft) < 16) {
            issues.critical.push({
              location: `${pageInfo.name} - Hero Section`,
              viewport: viewport.name,
              issue: `Insufficient horizontal padding: ${heroStyles.paddingLeft}`,
              recommendation: 'Apply px-4 or px-6 for mobile',
              priority: 'CRITICAL'
            });
          }
        }

        // Analyze Navigation
        const nav = await page.$('nav, [role="navigation"], header');
        if (nav) {
          const navStyles = await nav.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              height: el.offsetHeight,
              padding: styles.padding,
              position: styles.position
            };
          });

          // Check mobile menu button size
          if (viewport.name === 'Mobile') {
            const menuButton = await page.$('button[aria-label*="menu"], [data-menu-button], nav button');
            if (menuButton) {
              const buttonBounds = await menuButton.boundingBox();
              if (buttonBounds && buttonBounds.height < 44) {
                issues.major.push({
                  location: `${pageInfo.name} - Mobile Menu Button`,
                  viewport: viewport.name,
                  issue: `Touch target too small: ${buttonBounds.height}px (min 44px required)`,
                  recommendation: 'Increase button size with p-3 or min-h-[44px]',
                  priority: 'MAJOR'
                });
              }
            }
          }
        }

        // Analyze Cards/Components
        const cards = await page.$$('[class*="card"], [class*="Card"], .rounded-lg, .rounded-xl');
        for (const card of cards.slice(0, 3)) { // Check first 3 cards
          const cardStyles = await card.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              padding: styles.padding,
              margin: styles.margin,
              borderRadius: styles.borderRadius
            };
          });

          if (parseInt(cardStyles.padding) < 16) {
            issues.major.push({
              location: `${pageInfo.name} - Card Component`,
              viewport: viewport.name,
              issue: `Insufficient card padding: ${cardStyles.padding}`,
              recommendation: 'Apply p-6 or p-8 for better spacing',
              priority: 'MAJOR'
            });
          }
        }

        // Analyze Forms
        const forms = await page.$$('form');
        for (const form of forms) {
          const inputs = await form.$$('input, textarea, select');
          for (const input of inputs.slice(0, 2)) { // Check first 2 inputs
            const inputBounds = await input.boundingBox();
            if (inputBounds && inputBounds.height < 40) {
              issues.major.push({
                location: `${pageInfo.name} - Form Input`,
                viewport: viewport.name,
                issue: `Input height too small: ${inputBounds.height}px`,
                recommendation: 'Apply h-12 or py-3 for better touch targets',
                priority: 'MAJOR'
              });
            }
          }

          // Check form buttons
          const submitButton = await form.$('button[type="submit"], button:last-of-type');
          if (submitButton) {
            const buttonBounds = await submitButton.boundingBox();
            if (buttonBounds && buttonBounds.height < 44) {
              issues.critical.push({
                location: `${pageInfo.name} - Submit Button`,
                viewport: viewport.name,
                issue: `Submit button too small: ${buttonBounds.height}px`,
                recommendation: 'Apply min-h-[44px] py-3 for accessibility',
                priority: 'CRITICAL'
              });
            }
          }
        }

        // Analyze Section Spacing
        const sections = await page.$$('section, main > div');
        let previousBottom = 0;
        for (const section of sections.slice(0, 5)) { // Check first 5 sections
          const sectionBounds = await section.boundingBox();
          if (sectionBounds) {
            const gap = sectionBounds.y - previousBottom;
            if (previousBottom > 0 && gap < 40) {
              issues.major.push({
                location: `${pageInfo.name} - Section Spacing`,
                viewport: viewport.name,
                issue: `Insufficient gap between sections: ${gap}px`,
                recommendation: 'Apply py-12 or py-16 to sections',
                priority: 'MAJOR'
              });
            }
            previousBottom = sectionBounds.y + sectionBounds.height;
          }
        }

        // Check Typography
        const headings = await page.$$('h1, h2, h3');
        for (const heading of headings.slice(0, 3)) {
          const headingStyles = await heading.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              fontSize: styles.fontSize,
              lineHeight: styles.lineHeight,
              marginBottom: styles.marginBottom
            };
          });

          const fontSize = parseInt(headingStyles.fontSize);
          const lineHeight = parseFloat(headingStyles.lineHeight);

          if (viewport.name === 'Mobile' && fontSize > 40) {
            issues.minor.push({
              location: `${pageInfo.name} - Heading`,
              viewport: viewport.name,
              issue: `Heading too large on mobile: ${fontSize}px`,
              recommendation: 'Use responsive classes like text-3xl md:text-5xl',
              priority: 'MINOR'
            });
          }
        }

        // Check Pricing Cards if present
        const pricingCards = await page.$$('[class*="pricing"], [class*="plan"], [class*="tier"]');
        for (const pricingCard of pricingCards) {
          const pricingStyles = await pricingCard.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              padding: styles.padding,
              minHeight: el.offsetHeight
            };
          });

          if (parseInt(pricingStyles.padding) < 20) {
            issues.major.push({
              location: `${pageInfo.name} - Pricing Card`,
              viewport: viewport.name,
              issue: `Pricing card needs more padding: ${pricingStyles.padding}`,
              recommendation: 'Apply p-6 lg:p-8 for premium feel',
              priority: 'MAJOR'
            });
          }
        }

        // Check Footer
        const footer = await page.$('footer');
        if (footer) {
          const footerStyles = await footer.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              paddingTop: styles.paddingTop,
              paddingBottom: styles.paddingBottom
            };
          });

          if (parseInt(footerStyles.paddingTop) < 40) {
            issues.minor.push({
              location: `${pageInfo.name} - Footer`,
              viewport: viewport.name,
              issue: `Footer needs more vertical padding: ${footerStyles.paddingTop}`,
              recommendation: 'Apply py-12 or py-16',
              priority: 'MINOR'
            });
          }
        }

        // Check Container Consistency
        const containers = await page.$$('[class*="container"], [class*="max-w"]');
        const containerWidths = new Set();
        for (const container of containers.slice(0, 5)) {
          const bounds = await container.boundingBox();
          if (bounds) {
            containerWidths.add(bounds.width);
          }
        }

        if (containerWidths.size > 3) {
          issues.major.push({
            location: `${pageInfo.name} - Container Widths`,
            viewport: viewport.name,
            issue: `Inconsistent container widths detected: ${containerWidths.size} different widths`,
            recommendation: 'Standardize with max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
            priority: 'MAJOR'
          });
        }

      } catch (error) {
        console.log(`    ⚠️ Error analyzing ${pageInfo.name}: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 VISUAL ANALYSIS REPORT');
  console.log('='.repeat(80) + '\n');

  // Critical Issues
  console.log('🔴 CRITICAL ISSUES (Must fix immediately):');
  console.log('-'.repeat(40));
  if (issues.critical.length === 0) {
    console.log('✅ No critical issues found');
  } else {
    issues.critical.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.location} (${issue.viewport})`);
      console.log(`   Problem: ${issue.issue}`);
      console.log(`   Fix: ${issue.recommendation}`);
    });
  }

  // Major Issues
  console.log('\n\n🟡 MAJOR ISSUES (Significantly impact UX):');
  console.log('-'.repeat(40));
  if (issues.major.length === 0) {
    console.log('✅ No major issues found');
  } else {
    issues.major.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.location} (${issue.viewport})`);
      console.log(`   Problem: ${issue.issue}`);
      console.log(`   Fix: ${issue.recommendation}`);
    });
  }

  // Minor Issues
  console.log('\n\n🟢 MINOR ISSUES (Polish improvements):');
  console.log('-'.repeat(40));
  if (issues.minor.length === 0) {
    console.log('✅ No minor issues found');
  } else {
    issues.minor.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.location} (${issue.viewport})`);
      console.log(`   Problem: ${issue.issue}`);
      console.log(`   Fix: ${issue.recommendation}`);
    });
  }

  await browser.close();

  return issues;
}

// Create screenshots directory
import { mkdir } from 'fs/promises';
try {
  await mkdir('screenshots', { recursive: true });
} catch (e) {}

// Run analysis
analyzeVisuals().catch(console.error);