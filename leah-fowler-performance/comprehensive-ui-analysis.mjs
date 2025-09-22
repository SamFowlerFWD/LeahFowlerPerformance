import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const VIEWPORTS = {
  mobile: { width: 375, height: 667, label: 'Mobile (iPhone SE)' },
  tablet: { width: 768, height: 1024, label: 'Tablet (iPad)' },
  desktop: { width: 1440, height: 900, label: 'Desktop (MacBook)' }
};

const PAGES = [
  { url: '/', name: 'Homepage' },
  { url: '/about', name: 'About' },
  { url: '/services', name: 'Services' },
  { url: '/results', name: 'Results' },
  { url: '/contact', name: 'Contact' },
  { url: '/privacy-policy', name: 'Privacy Policy' },
  { url: '/terms', name: 'Terms' }
];

const issues = {
  critical: [],
  high: [],
  medium: [],
  low: []
};

async function analyzeVisualIssues() {
  const browser = await chromium.launch({ headless: true });
  const screenshotsDir = './ui-analysis-screenshots';

  try {
    await fs.mkdir(screenshotsDir, { recursive: true });
  } catch (e) {
    // Directory exists
  }

  console.log('🔍 Starting comprehensive UI analysis...\n');
  console.log('=' .repeat(80));

  for (const viewport of Object.entries(VIEWPORTS)) {
    const [key, config] = viewport;
    console.log(`\n📱 Testing on ${config.label} (${config.width}x${config.height})`);
    console.log('-' .repeat(60));

    const context = await browser.newContext({
      viewport: { width: config.width, height: config.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const pageConfig of PAGES) {
      console.log(`\n  📄 Analyzing ${pageConfig.name}...`);

      try {
        await page.goto(`http://localhost:3000${pageConfig.url}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        // Wait for content to stabilize
        await page.waitForTimeout(1000);

        // Take screenshot for visual reference
        const screenshotPath = path.join(screenshotsDir, `${key}-${pageConfig.name.toLowerCase().replace(/\s+/g, '-')}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        // Analyze specific UI elements
        const analysis = await page.evaluate((viewportWidth) => {
          const issues = [];

          // Check hero section
          const hero = document.querySelector('[class*="hero"], header + section, main > section:first-child');
          if (hero) {
            const heroStyles = window.getComputedStyle(hero);
            const heroPadding = {
              top: parseInt(heroStyles.paddingTop),
              bottom: parseInt(heroStyles.paddingBottom),
              left: parseInt(heroStyles.paddingLeft),
              right: parseInt(heroStyles.paddingRight)
            };

            // Check for inadequate padding on mobile
            if (viewportWidth < 768) {
              if (heroPadding.left < 16 || heroPadding.right < 16) {
                issues.push({
                  severity: 'high',
                  element: 'Hero Section',
                  issue: `Insufficient horizontal padding: ${heroPadding.left}px / ${heroPadding.right}px (should be at least 16px)`,
                  location: 'Hero section'
                });
              }
            }

            // Check vertical spacing
            if (heroPadding.top < 32 || heroPadding.bottom < 32) {
              issues.push({
                severity: 'medium',
                element: 'Hero Section',
                issue: `Insufficient vertical padding: ${heroPadding.top}px top / ${heroPadding.bottom}px bottom`,
                location: 'Hero section'
              });
            }
          }

          // Check navigation
          const nav = document.querySelector('nav');
          if (nav) {
            const navStyles = window.getComputedStyle(nav);
            const navHeight = nav.offsetHeight;

            if (viewportWidth < 768 && navHeight < 56) {
              issues.push({
                severity: 'high',
                element: 'Navigation',
                issue: `Navigation height too small for mobile: ${navHeight}px (should be at least 56px)`,
                location: 'Navigation bar'
              });
            }
          }

          // Check all buttons
          const buttons = document.querySelectorAll('button, a[class*="button"], a[class*="btn"], [role="button"]');
          buttons.forEach((button, index) => {
            const rect = button.getBoundingClientRect();
            const styles = window.getComputedStyle(button);

            // Check touch target size on mobile
            if (viewportWidth < 768) {
              if (rect.height < 44 || rect.width < 44) {
                issues.push({
                  severity: 'critical',
                  element: `Button ${index + 1}`,
                  issue: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum 44x44px required)`,
                  location: button.textContent?.trim() || 'Unknown button'
                });
              }
            }

            // Check padding consistency
            const paddingY = parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
            const paddingX = parseInt(styles.paddingLeft) + parseInt(styles.paddingRight);

            if (paddingY < 16 || paddingX < 24) {
              issues.push({
                severity: 'medium',
                element: `Button ${index + 1}`,
                issue: `Insufficient padding: ${paddingX}px horizontal, ${paddingY}px vertical`,
                location: button.textContent?.trim() || 'Unknown button'
              });
            }
          });

          // Check form fields
          const inputs = document.querySelectorAll('input, textarea, select');
          inputs.forEach((input, index) => {
            const rect = input.getBoundingClientRect();
            const styles = window.getComputedStyle(input);

            if (viewportWidth < 768 && rect.height < 44) {
              issues.push({
                severity: 'critical',
                element: `Form field ${index + 1}`,
                issue: `Input height too small for mobile: ${Math.round(rect.height)}px (minimum 44px)`,
                location: input.placeholder || input.name || 'Unknown input'
              });
            }

            // Check padding
            const padding = parseInt(styles.paddingLeft) + parseInt(styles.paddingRight);
            if (padding < 24) {
              issues.push({
                severity: 'medium',
                element: `Form field ${index + 1}`,
                issue: `Insufficient horizontal padding: ${padding}px`,
                location: input.placeholder || input.name || 'Unknown input'
              });
            }
          });

          // Check card components
          const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
          const cardPaddings = [];
          cards.forEach((card, index) => {
            const styles = window.getComputedStyle(card);
            const padding = {
              top: parseInt(styles.paddingTop),
              bottom: parseInt(styles.paddingBottom),
              left: parseInt(styles.paddingLeft),
              right: parseInt(styles.paddingRight)
            };
            cardPaddings.push(padding);

            // Check for insufficient padding
            if (padding.top < 16 || padding.bottom < 16 || padding.left < 16 || padding.right < 16) {
              issues.push({
                severity: 'medium',
                element: `Card ${index + 1}`,
                issue: `Insufficient padding: ${padding.top}/${padding.right}/${padding.bottom}/${padding.left}px`,
                location: card.querySelector('h2, h3, h4')?.textContent?.trim() || 'Unknown card'
              });
            }
          });

          // Check padding consistency across cards
          if (cardPaddings.length > 1) {
            const firstPadding = JSON.stringify(cardPaddings[0]);
            const inconsistent = cardPaddings.some(p => JSON.stringify(p) !== firstPadding);
            if (inconsistent) {
              issues.push({
                severity: 'high',
                element: 'Cards',
                issue: 'Inconsistent padding across card components',
                location: 'Multiple cards on page'
              });
            }
          }

          // Check section spacing
          const sections = document.querySelectorAll('section, main > div');
          sections.forEach((section, index) => {
            const styles = window.getComputedStyle(section);
            const marginTop = parseInt(styles.marginTop);
            const marginBottom = parseInt(styles.marginBottom);
            const paddingTop = parseInt(styles.paddingTop);
            const paddingBottom = parseInt(styles.paddingBottom);

            const totalSpacingTop = marginTop + paddingTop;
            const totalSpacingBottom = marginBottom + paddingBottom;

            if (totalSpacingTop < 48 || totalSpacingBottom < 48) {
              issues.push({
                severity: 'medium',
                element: `Section ${index + 1}`,
                issue: `Insufficient section spacing: ${totalSpacingTop}px top, ${totalSpacingBottom}px bottom`,
                location: section.querySelector('h1, h2, h3')?.textContent?.trim() || 'Unknown section'
              });
            }
          });

          // Check text readability
          const textElements = document.querySelectorAll('p, li, span');
          textElements.forEach((element, index) => {
            const styles = window.getComputedStyle(element);
            const fontSize = parseInt(styles.fontSize);
            const lineHeight = parseInt(styles.lineHeight);

            if (fontSize > 0 && lineHeight / fontSize < 1.4) {
              issues.push({
                severity: 'medium',
                element: `Text element ${index + 1}`,
                issue: `Line height too tight: ${(lineHeight / fontSize).toFixed(2)} (should be at least 1.4)`,
                location: element.textContent?.substring(0, 50) || 'Unknown text'
              });
            }

            // Check for text that's too small on mobile
            if (viewportWidth < 768 && fontSize < 14) {
              issues.push({
                severity: 'high',
                element: `Text element ${index + 1}`,
                issue: `Text too small for mobile: ${fontSize}px (minimum 14px)`,
                location: element.textContent?.substring(0, 50) || 'Unknown text'
              });
            }
          });

          // Check footer
          const footer = document.querySelector('footer');
          if (footer) {
            const footerStyles = window.getComputedStyle(footer);
            const footerPadding = parseInt(footerStyles.paddingTop) + parseInt(footerStyles.paddingBottom);

            if (footerPadding < 64) {
              issues.push({
                severity: 'low',
                element: 'Footer',
                issue: `Insufficient footer padding: ${footerPadding}px total vertical padding`,
                location: 'Page footer'
              });
            }
          }

          // Check for horizontal scrolling
          if (document.documentElement.scrollWidth > viewportWidth) {
            issues.push({
              severity: 'critical',
              element: 'Page Layout',
              issue: `Horizontal scrolling detected at ${viewportWidth}px width`,
              location: 'Overall page layout'
            });
          }

          return issues;
        }, config.width);

        // Categorize issues
        analysis.forEach(issue => {
          const issueWithContext = {
            ...issue,
            page: pageConfig.name,
            viewport: config.label
          };
          issues[issue.severity].push(issueWithContext);
        });

      } catch (error) {
        console.error(`    ❌ Error analyzing ${pageConfig.name}: ${error.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  // Generate comprehensive report
  console.log('\n' + '=' .repeat(80));
  console.log('📊 COMPREHENSIVE UI ANALYSIS REPORT');
  console.log('=' .repeat(80));

  const severityOrder = ['critical', 'high', 'medium', 'low'];
  let totalIssues = 0;

  for (const severity of severityOrder) {
    if (issues[severity].length > 0) {
      console.log(`\n🔴 ${severity.toUpperCase()} PRIORITY ISSUES (${issues[severity].length})`);
      console.log('-' .repeat(60));

      // Group by element type
      const grouped = {};
      issues[severity].forEach(issue => {
        const key = issue.element;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(issue);
      });

      Object.entries(grouped).forEach(([element, elementIssues]) => {
        console.log(`\n  📍 ${element}:`);
        elementIssues.forEach(issue => {
          console.log(`     • ${issue.issue}`);
          console.log(`       Location: ${issue.location}`);
          console.log(`       Page: ${issue.page} | Viewport: ${issue.viewport}`);
        });
      });

      totalIssues += issues[severity].length;
    }
  }

  // Generate fix recommendations
  console.log('\n' + '=' .repeat(80));
  console.log('🔧 RECOMMENDED FIXES (PRIORITY ORDER)');
  console.log('=' .repeat(80));

  const recommendations = generateRecommendations(issues);
  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.title}`);
    console.log(`   Priority: ${rec.priority}`);
    console.log(`   Files to modify: ${rec.files.join(', ')}`);
    console.log(`   Solution: ${rec.solution}`);
    if (rec.code) {
      console.log(`   Example code:\n${rec.code}`);
    }
  });

  console.log('\n' + '=' .repeat(80));
  console.log(`📈 SUMMARY: Found ${totalIssues} total issues`);
  console.log(`   - Critical: ${issues.critical.length}`);
  console.log(`   - High: ${issues.high.length}`);
  console.log(`   - Medium: ${issues.medium.length}`);
  console.log(`   - Low: ${issues.low.length}`);
  console.log('=' .repeat(80));
  console.log('\n📸 Screenshots saved to: ./ui-analysis-screenshots/');

  return issues;
}

function generateRecommendations(issues) {
  const recommendations = [];

  // Check for touch target issues
  if (issues.critical.some(i => i.issue.includes('Touch target'))) {
    recommendations.push({
      title: 'Fix Mobile Touch Targets',
      priority: 'CRITICAL',
      files: ['components/ui/button.tsx', 'app/globals.css'],
      solution: 'Ensure all interactive elements are at least 44x44px on mobile',
      code: `    // In button.tsx
    className={cn(
      "min-h-[44px] px-6 py-3", // Ensures 44px min height
      "touch-manipulation", // Better touch handling
      className
    )}`
    });
  }

  // Check for horizontal scrolling
  if (issues.critical.some(i => i.issue.includes('Horizontal scrolling'))) {
    recommendations.push({
      title: 'Fix Horizontal Overflow',
      priority: 'CRITICAL',
      files: ['app/globals.css'],
      solution: 'Add overflow-x-hidden to body and ensure all content respects viewport width',
      code: `    /* In globals.css */
    body {
      overflow-x: hidden;
      max-width: 100vw;
    }`
    });
  }

  // Check for padding inconsistencies
  if (issues.high.some(i => i.issue.includes('padding'))) {
    recommendations.push({
      title: 'Standardize Component Padding',
      priority: 'HIGH',
      files: ['tailwind.config.ts'],
      solution: 'Create consistent spacing scale and apply across all components',
      code: `    // Define standard spacing in tailwind.config.ts
    theme: {
      extend: {
        spacing: {
          'card': '1.5rem',    // 24px
          'section': '4rem',    // 64px
          'mobile': '1rem',     // 16px
        }
      }
    }`
    });
  }

  // Check for text readability
  if (issues.medium.some(i => i.issue.includes('Line height'))) {
    recommendations.push({
      title: 'Improve Text Readability',
      priority: 'MEDIUM',
      files: ['app/globals.css'],
      solution: 'Set proper line-height for all text elements',
      code: `    /* In globals.css */
    p, li { line-height: 1.6; }
    h1, h2, h3 { line-height: 1.3; }`
    });
  }

  // Mobile-specific fixes
  if (issues.high.some(i => i.viewport.includes('Mobile'))) {
    recommendations.push({
      title: 'Enhance Mobile Experience',
      priority: 'HIGH',
      files: ['app/globals.css', 'components/navigation.tsx'],
      solution: 'Apply mobile-first responsive design patterns',
      code: `    /* Mobile-first approach */
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      .card { padding: 1.5rem; }
      .section { padding: 3rem 1rem; }
    }`
    });
  }

  return recommendations;
}

// Run the analysis
analyzeVisualIssues().catch(console.error);