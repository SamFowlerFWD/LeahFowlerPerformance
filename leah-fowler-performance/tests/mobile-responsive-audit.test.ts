import { test, expect, Page } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure screenshots directory exists
const screenshotDir = join(process.cwd(), 'screenshots', 'mobile-audit');
mkdirSync(screenshotDir, { recursive: true });

interface AuditIssue {
  page: string;
  viewport: string;
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  elements?: string[];
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

const issues: AuditIssue[] = [];

async function auditPage(page: Page, pagePath: string, pageName: string, viewport: typeof viewports[0]) {
  const pageIssues: AuditIssue[] = [];

  // Navigate to the page
  await page.goto(`http://localhost:3001${pagePath}`, { waitUntil: 'networkidle' });

  // Wait for content to stabilize
  await page.waitForTimeout(1000);

  // 1. Check for horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return html.scrollWidth > html.clientWidth || body.scrollWidth > body.clientWidth;
  });

  if (hasHorizontalScroll) {
    const overflowingElements = await page.evaluate(() => {
      const elements: string[] = [];
      const all = document.querySelectorAll('*');
      const viewportWidth = window.innerWidth;

      all.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > viewportWidth || rect.left < 0) {
          const selector = el.tagName.toLowerCase() +
            (el.className ? '.' + el.className.split(' ').join('.') : '') +
            (el.id ? '#' + el.id : '');
          elements.push(selector);
        }
      });

      return elements.slice(0, 5); // Limit to first 5 for readability
    });

    pageIssues.push({
      page: pageName,
      viewport: viewport.name,
      type: 'Horizontal Scroll',
      description: 'Page has horizontal scroll which breaks mobile UX',
      severity: 'critical',
      elements: overflowingElements
    });
  }

  // 2. Check touch target sizes
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
          (el.className ? '.' + (el as HTMLElement).className.split(' ').filter(c => c).slice(0, 2).join('.') : '') +
          (el.id ? '#' + el.id : '');
        elements.push(`${selector} (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
      }
    });

    return elements.slice(0, 10);
  });

  if (smallTouchTargets.length > 0) {
    pageIssues.push({
      page: pageName,
      viewport: viewport.name,
      type: 'Small Touch Targets',
      description: `${smallTouchTargets.length} elements below 44x44px minimum`,
      severity: 'high',
      elements: smallTouchTargets
    });
  }

  // 3. Check minimum font sizes
  const smallFonts = await page.evaluate(() => {
    const minFontSize = 14;
    const elements: string[] = [];
    const textElements = document.querySelectorAll('p, span, a, button, li, td, th, label, h1, h2, h3, h4, h5, h6');

    textElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize);

      // Check if element is visible and has text
      if (styles.display === 'none' || styles.visibility === 'hidden' || !el.textContent?.trim()) {
        return;
      }

      if (fontSize < minFontSize) {
        const selector = el.tagName.toLowerCase() +
          (el.className ? '.' + (el as HTMLElement).className.split(' ').filter(c => c).slice(0, 2).join('.') : '');
        elements.push(`${selector} (${fontSize.toFixed(1)}px)`);
      }
    });

    return [...new Set(elements)].slice(0, 10);
  });

  if (smallFonts.length > 0) {
    pageIssues.push({
      page: pageName,
      viewport: viewport.name,
      type: 'Small Font Size',
      description: `${smallFonts.length} elements with font size below 14px`,
      severity: 'medium',
      elements: smallFonts
    });
  }

  // 4. Check for text overlap and content overflow
  const overlappingElements = await page.evaluate(() => {
    const elements: string[] = [];
    const allElements = document.querySelectorAll('*');

    // Check for text overflow
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.overflow === 'hidden' && el.scrollWidth > el.clientWidth) {
        const selector = el.tagName.toLowerCase() +
          (el.className ? '.' + (el as HTMLElement).className.split(' ').filter(c => c).slice(0, 2).join('.') : '');
        elements.push(`${selector} (text overflow)`);
      }
    });

    return elements.slice(0, 5);
  });

  if (overlappingElements.length > 0) {
    pageIssues.push({
      page: pageName,
      viewport: viewport.name,
      type: 'Content Overflow',
      description: 'Elements with hidden overflow or overlapping content',
      severity: 'high',
      elements: overlappingElements
    });
  }

  // 5. Check for navigation usability on mobile
  if (viewport.width < 768) {
    const hasMobileNav = await page.evaluate(() => {
      // Check for hamburger menu or mobile navigation
      const hamburger = document.querySelector('[aria-label*="menu" i], [class*="hamburger" i], [class*="burger" i], [class*="mobile-menu" i]');
      const desktopNav = document.querySelector('nav');

      if (desktopNav) {
        const styles = window.getComputedStyle(desktopNav);
        const navRect = desktopNav.getBoundingClientRect();

        // Check if desktop nav is hidden or properly adapted
        if (styles.display !== 'none' && navRect.width > window.innerWidth * 0.9) {
          return { hasIssue: true, hasMobileNav: !!hamburger };
        }
      }

      return { hasIssue: false, hasMobileNav: !!hamburger };
    });

    if (hasMobileNav.hasIssue && !hasMobileNav.hasMobileNav) {
      pageIssues.push({
        page: pageName,
        viewport: viewport.name,
        type: 'Navigation Issue',
        description: 'Desktop navigation not adapted for mobile (no hamburger menu)',
        severity: 'critical'
      });
    }
  }

  // 6. Check for form input usability
  const formIssues = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const issues: string[] = [];

    inputs.forEach(input => {
      const rect = input.getBoundingClientRect();
      const styles = window.getComputedStyle(input);

      if (styles.display === 'none' || styles.visibility === 'hidden') return;

      // Check height for touch targets
      if (rect.height < 44) {
        const selector = input.tagName.toLowerCase() +
          (input.getAttribute('name') ? `[name="${input.getAttribute('name')}"]` : '') +
          (input.getAttribute('type') ? `[type="${input.getAttribute('type')}"]` : '');
        issues.push(`${selector} (${Math.round(rect.height)}px height)`);
      }
    });

    return issues.slice(0, 5);
  });

  if (formIssues.length > 0) {
    pageIssues.push({
      page: pageName,
      viewport: viewport.name,
      type: 'Form Accessibility',
      description: 'Form inputs not optimized for touch',
      severity: 'high',
      elements: formIssues
    });
  }

  // Take screenshot
  const screenshotName = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`;
  await page.screenshot({
    path: join(screenshotDir, screenshotName),
    fullPage: true
  });

  return pageIssues;
}

test.describe('Mobile Responsive Audit', () => {
  test.setTimeout(120000); // 2 minutes timeout for all tests

  for (const viewport of viewports) {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        });

        const page = await context.newPage();

        try {
          const pageIssues = await auditPage(page, pageInfo.path, pageInfo.name, viewport);
          issues.push(...pageIssues);

          // Log issues immediately for this page/viewport
          if (pageIssues.length > 0) {
            console.log(`\n${pageInfo.name} on ${viewport.name}:`);
            pageIssues.forEach(issue => {
              console.log(`  - ${issue.type}: ${issue.description}`);
              if (issue.elements && issue.elements.length > 0) {
                console.log(`    Elements: ${issue.elements.slice(0, 3).join(', ')}`);
              }
            });
          }
        } catch (error) {
          console.error(`Error auditing ${pageInfo.name} on ${viewport.name}:`, error);
          issues.push({
            page: pageInfo.name,
            viewport: viewport.name,
            type: 'Audit Error',
            description: `Failed to audit page: ${error}`,
            severity: 'critical'
          });
        } finally {
          await context.close();
        }
      });
    }
  }

  test.afterAll(() => {
    // Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      highIssues: issues.filter(i => i.severity === 'high').length,
      mediumIssues: issues.filter(i => i.severity === 'medium').length,
      lowIssues: issues.filter(i => i.severity === 'low').length,
      issuesByType: {} as Record<string, number>,
      issuesByPage: {} as Record<string, number>,
      issuesByViewport: {} as Record<string, number>,
      details: issues
    };

    // Aggregate statistics
    issues.forEach(issue => {
      report.issuesByType[issue.type] = (report.issuesByType[issue.type] || 0) + 1;
      report.issuesByPage[issue.page] = (report.issuesByPage[issue.page] || 0) + 1;
      report.issuesByViewport[issue.viewport] = (report.issuesByViewport[issue.viewport] || 0) + 1;
    });

    // Write report to file
    const reportPath = join(screenshotDir, 'audit-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown summary
    let markdown = `# Mobile Responsive Audit Report\n\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total Issues:** ${report.totalIssues}\n`;
    markdown += `- **Critical:** ${report.criticalIssues}\n`;
    markdown += `- **High:** ${report.highIssues}\n`;
    markdown += `- **Medium:** ${report.mediumIssues}\n`;
    markdown += `- **Low:** ${report.lowIssues}\n\n`;

    markdown += `## Issues by Type\n\n`;
    Object.entries(report.issuesByType).forEach(([type, count]) => {
      markdown += `- **${type}:** ${count} issues\n`;
    });

    markdown += `\n## Issues by Page\n\n`;
    Object.entries(report.issuesByPage).forEach(([page, count]) => {
      markdown += `- **${page}:** ${count} issues\n`;
    });

    markdown += `\n## Detailed Issues\n\n`;
    const groupedByPage = issues.reduce((acc, issue) => {
      if (!acc[issue.page]) acc[issue.page] = [];
      acc[issue.page].push(issue);
      return acc;
    }, {} as Record<string, AuditIssue[]>);

    Object.entries(groupedByPage).forEach(([page, pageIssues]) => {
      markdown += `### ${page}\n\n`;
      pageIssues.forEach(issue => {
        markdown += `- **[${issue.severity.toUpperCase()}] ${issue.type}** (${issue.viewport}): ${issue.description}\n`;
        if (issue.elements && issue.elements.length > 0) {
          markdown += `  - Affected elements: ${issue.elements.slice(0, 3).join(', ')}\n`;
        }
      });
      markdown += '\n';
    });

    const markdownPath = join(screenshotDir, 'audit-report.md');
    writeFileSync(markdownPath, markdown);

    console.log('\n' + '='.repeat(80));
    console.log('AUDIT COMPLETE');
    console.log('='.repeat(80));
    console.log(`Total Issues Found: ${report.totalIssues}`);
    console.log(`Critical: ${report.criticalIssues}, High: ${report.highIssues}, Medium: ${report.mediumIssues}, Low: ${report.lowIssues}`);
    console.log(`\nReports saved to:`);
    console.log(`  - ${reportPath}`);
    console.log(`  - ${markdownPath}`);
    console.log(`  - Screenshots: ${screenshotDir}/`);
  });
});