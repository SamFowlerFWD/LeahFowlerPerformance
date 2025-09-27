import { test, expect, Page } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Ensure directories exist
const screenshotDir = join(process.cwd(), 'screenshots', 'mobile-validation');
const reportDir = join(process.cwd(), 'reports');
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(reportDir, { recursive: true });

interface ValidationResult {
  page: string;
  viewport: string;
  checks: {
    horizontalScroll: boolean;
    touchTargets: boolean;
    fontSizes: boolean;
    navigation: boolean;
    contentOverflow: boolean;
  };
  issues: string[];
}

const viewports = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone X', width: 375, height: 812 },
  { name: 'iPhone 11 Pro Max', width: 414, height: 896 },
  { name: 'iPad', width: 768, height: 1024 }
];

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/services', name: 'Services' },
  { path: '/apply', name: 'Apply' },
  { path: '/assessment', name: 'Assessment' },
  { path: '/performance-accelerator', name: 'Performance Accelerator' },
  { path: '/blog', name: 'Blog' },
  { path: '/family-athlete-demo', name: 'Family Athlete Demo' }
];

async function validatePage(page: Page, pagePath: string, pageName: string, viewport: typeof viewports[0]): Promise<ValidationResult> {
  const result: ValidationResult = {
    page: pageName,
    viewport: viewport.name,
    checks: {
      horizontalScroll: true,
      touchTargets: true,
      fontSizes: true,
      navigation: true,
      contentOverflow: true
    },
    issues: []
  };

  // Navigate to the page
  await page.goto(`http://localhost:3001${pagePath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for any animations to complete

  // 1. CHECK: No horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return html.scrollWidth > html.clientWidth || body.scrollWidth > body.clientWidth;
  });

  if (hasHorizontalScroll) {
    result.checks.horizontalScroll = false;
    result.issues.push('❌ Horizontal scroll detected');
  } else {
    result.issues.push('✅ No horizontal scroll');
  }

  // 2. CHECK: All touch targets are at least 44x44px
  const smallTouchTargets = await page.evaluate(() => {
    const minSize = 44;
    const elements: string[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [onclick], [role="button"], [tabindex]:not([tabindex="-1"])');

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);

      // Check if element is visible
      if (styles.display === 'none' || styles.visibility === 'hidden' || rect.width === 0 || rect.height === 0) {
        return;
      }

      if (rect.width < minSize || rect.height < minSize) {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(c => c).slice(0, 2).join('.') : '') +
          (el.id ? '#' + el.id : '');
        elements.push(`${selector} (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
      }
    });

    return elements;
  });

  if (smallTouchTargets.length > 0) {
    result.checks.touchTargets = false;
    result.issues.push(`❌ ${smallTouchTargets.length} small touch targets found: ${smallTouchTargets.slice(0, 3).join(', ')}`);
  } else {
    result.issues.push('✅ All touch targets are properly sized (≥44x44px)');
  }

  // 3. CHECK: All fonts are at least 14px
  const smallFonts = await page.evaluate(() => {
    const minFontSize = 14;
    const elements: string[] = [];
    const textElements = document.querySelectorAll('p, span, a, button, li, td, th, label, h1, h2, h3, h4, h5, h6, div');

    textElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize);

      // Check if element is visible and has text
      if (styles.display === 'none' || styles.visibility === 'hidden' || !el.textContent?.trim()) {
        return;
      }

      if (fontSize < minFontSize) {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(c => c).slice(0, 2).join('.') : '');
        elements.push(`${selector} (${fontSize.toFixed(1)}px)`);
      }
    });

    return [...new Set(elements)];
  });

  if (smallFonts.length > 0) {
    result.checks.fontSizes = false;
    result.issues.push(`❌ ${smallFonts.length} elements with small fonts: ${smallFonts.slice(0, 3).join(', ')}`);
  } else {
    result.issues.push('✅ All fonts are readable (≥14px)');
  }

  // 4. CHECK: Mobile navigation is present and functional
  if (viewport.width < 768) {
    const hasMobileNav = await page.evaluate(() => {
      // Check for hamburger menu or mobile navigation
      const hamburger = document.querySelector('[aria-label*="menu" i], [class*="hamburger" i], [class*="burger" i], [class*="mobile-menu" i], button[class*="Menu" i]');
      const mobileNavPresent = !!hamburger;

      if (!mobileNavPresent) {
        // Check if desktop nav is hidden on mobile
        const desktopNav = document.querySelector('nav');
        if (desktopNav) {
          const styles = window.getComputedStyle(desktopNav);
          const navRect = desktopNav.getBoundingClientRect();
          if (styles.display !== 'none' && navRect.width > window.innerWidth * 0.9) {
            return { present: false, functional: false };
          }
        }
      }

      return { present: mobileNavPresent, functional: true };
    });

    if (!hasMobileNav.present || !hasMobileNav.functional) {
      result.checks.navigation = false;
      result.issues.push('❌ Mobile navigation issues detected');
    } else {
      result.issues.push('✅ Mobile navigation is present and functional');
    }
  } else {
    result.issues.push('✅ Desktop viewport - navigation check skipped');
  }

  // 5. CHECK: No content overflow
  const overflowingElements = await page.evaluate(() => {
    const elements: string[] = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);

      // Check for elements extending beyond viewport
      if (rect.right > window.innerWidth || rect.left < 0) {
        if (styles.display !== 'none' && styles.visibility !== 'hidden') {
          const selector = el.tagName.toLowerCase() +
            (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(c => c).slice(0, 2).join('.') : '');
          elements.push(selector);
        }
      }

      // Check for text overflow
      if (styles.overflow === 'hidden' && el.scrollWidth > el.clientWidth) {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(c => c).slice(0, 2).join('.') : '');
        elements.push(`${selector} (text overflow)`);
      }
    });

    return [...new Set(elements)];
  });

  if (overflowingElements.length > 0) {
    result.checks.contentOverflow = false;
    result.issues.push(`❌ ${overflowingElements.length} overflowing elements: ${overflowingElements.slice(0, 3).join(', ')}`);
  } else {
    result.issues.push('✅ No content overflow detected');
  }

  // Take screenshot for visual verification
  const screenshotName = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}-validated.png`;
  await page.screenshot({
    path: join(screenshotDir, screenshotName),
    fullPage: true
  });

  return result;
}

test.describe('Mobile Responsive Validation', () => {
  test.setTimeout(180000); // 3 minutes timeout for all tests

  const allResults: ValidationResult[] = [];

  for (const viewport of viewports) {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} on ${viewport.name} - Validation`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        });

        const page = await context.newPage();

        try {
          const result = await validatePage(page, pageInfo.path, pageInfo.name, viewport);
          allResults.push(result);

          // Log results immediately
          console.log(`\n${pageInfo.name} on ${viewport.name}:`);
          result.issues.forEach(issue => console.log(`  ${issue}`));

          // Assert all checks pass
          expect(result.checks.horizontalScroll).toBe(true);
          expect(result.checks.touchTargets).toBe(true);
          expect(result.checks.fontSizes).toBe(true);
          if (viewport.width < 768) {
            expect(result.checks.navigation).toBe(true);
          }
          expect(result.checks.contentOverflow).toBe(true);
        } catch (error) {
          console.error(`Error validating ${pageInfo.name} on ${viewport.name}:`, error);
          throw error;
        } finally {
          await context.close();
        }
      });
    }
  }

  test.afterAll(() => {
    // Generate comprehensive validation report
    const totalTests = allResults.length;
    const passedTests = allResults.filter(r =>
      Object.values(r.checks).every(check => check === true)
    ).length;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        passRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`
      },
      checksSummary: {
        horizontalScroll: allResults.filter(r => r.checks.horizontalScroll).length,
        touchTargets: allResults.filter(r => r.checks.touchTargets).length,
        fontSizes: allResults.filter(r => r.checks.fontSizes).length,
        navigation: allResults.filter(r => r.checks.navigation).length,
        contentOverflow: allResults.filter(r => r.checks.contentOverflow).length,
      },
      details: allResults
    };

    // Write JSON report
    const jsonPath = join(reportDir, 'mobile-validation-report.json');
    writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    let markdown = `# Mobile Responsive Validation Report\n\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total Tests:** ${totalTests}\n`;
    markdown += `- **Passed:** ${passedTests}\n`;
    markdown += `- **Failed:** ${totalTests - passedTests}\n`;
    markdown += `- **Pass Rate:** ${report.summary.passRate}\n\n`;

    markdown += `## Checks Summary\n\n`;
    markdown += `| Check | Passed | Total | Pass Rate |\n`;
    markdown += `|-------|--------|-------|----------|\n`;
    markdown += `| No Horizontal Scroll | ${report.checksSummary.horizontalScroll} | ${totalTests} | ${((report.checksSummary.horizontalScroll / totalTests) * 100).toFixed(0)}% |\n`;
    markdown += `| Touch Targets ≥44px | ${report.checksSummary.touchTargets} | ${totalTests} | ${((report.checksSummary.touchTargets / totalTests) * 100).toFixed(0)}% |\n`;
    markdown += `| Font Size ≥14px | ${report.checksSummary.fontSizes} | ${totalTests} | ${((report.checksSummary.fontSizes / totalTests) * 100).toFixed(0)}% |\n`;
    markdown += `| Mobile Navigation | ${report.checksSummary.navigation} | ${allResults.filter(r => r.viewport !== 'iPad').length} | ${((report.checksSummary.navigation / allResults.filter(r => r.viewport !== 'iPad').length) * 100).toFixed(0)}% |\n`;
    markdown += `| No Content Overflow | ${report.checksSummary.contentOverflow} | ${totalTests} | ${((report.checksSummary.contentOverflow / totalTests) * 100).toFixed(0)}% |\n`;

    markdown += `\n## Detailed Results\n\n`;
    const groupedByPage = allResults.reduce((acc, result) => {
      if (!acc[result.page]) acc[result.page] = [];
      acc[result.page].push(result);
      return acc;
    }, {} as Record<string, ValidationResult[]>);

    Object.entries(groupedByPage).forEach(([page, results]) => {
      markdown += `### ${page}\n\n`;
      results.forEach(result => {
        const allPassed = Object.values(result.checks).every(check => check === true);
        const emoji = allPassed ? '✅' : '❌';
        markdown += `**${result.viewport}** ${emoji}\n`;
        result.issues.forEach(issue => {
          markdown += `- ${issue}\n`;
        });
        markdown += '\n';
      });
    });

    // Compare with initial audit if available
    const auditReportPath = join(process.cwd(), 'screenshots', 'mobile-audit', 'audit-report.json');
    if (existsSync(auditReportPath)) {
      const initialAudit = JSON.parse(readFileSync(auditReportPath, 'utf-8'));
      markdown += `\n## Improvement from Initial Audit\n\n`;
      markdown += `- **Initial Issues:** ${initialAudit.totalIssues}\n`;
      markdown += `- **Current Failed Tests:** ${totalTests - passedTests}\n`;
      markdown += `- **Improvement:** ${((initialAudit.totalIssues - (totalTests - passedTests)) / initialAudit.totalIssues * 100).toFixed(1)}% reduction in issues\n`;
    }

    const markdownPath = join(reportDir, 'mobile-validation-report.md');
    writeFileSync(markdownPath, markdown);

    // Console output
    console.log('\n' + '='.repeat(80));
    console.log('VALIDATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`Pass Rate: ${report.summary.passRate}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}`);
    console.log(`\nReports saved to:`);
    console.log(`  - ${jsonPath}`);
    console.log(`  - ${markdownPath}`);
    console.log(`  - Screenshots: ${screenshotDir}/`);
    console.log('='.repeat(80));
  });
});