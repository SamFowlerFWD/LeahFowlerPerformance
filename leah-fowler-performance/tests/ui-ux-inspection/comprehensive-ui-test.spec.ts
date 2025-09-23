import { test, expect, Page, devices } from '@playwright/test';
import { PaddingAnalyzer } from './utils/paddingAnalyzer';
import { AlignmentDetector } from './utils/alignmentDetector';
import { OverlapScanner } from './utils/overlapScanner';
import { ContrastValidator } from './utils/contrastValidator';
import { discoverRoutes, VIEWPORTS } from './utils/routeDiscovery';
import * as fs from 'fs';
import * as path from 'path';

// Configure test settings
test.use({
  // Set longer timeout for comprehensive tests
  timeout: 60000,
  // Ensure animations are disabled
  screenshot: {
    animations: 'disabled',
  },
  // Slow down actions for visual testing
  actionTimeout: 10000,
});

// Test data structure
interface TestResult {
  route: string;
  viewport: string;
  timestamp: string;
  paddingIssues: any[];
  alignmentIssues: any[];
  overlapIssues: any[];
  contrastIssues: any[];
  horizontalScroll: boolean;
  touchTargetIssues: any[];
  textJustificationIssues: any[];
  breakpointTransitionIssues: any[];
  screenshots: string[];
}

const testResults: TestResult[] = [];

// Discover routes before tests
const routes = [
  '/',
  '/services',
  '/performance-accelerator',
  '/apply',
  '/assessment',
  '/blog',
  '/account',
  '/admin',
  '/family-athlete-demo',
  '/mobile-demo',
  '/test'
];

// Run tests for each viewport and route combination
for (const viewport of VIEWPORTS) {
  test.describe(`UI/UX Inspection - ${viewport.name}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
    });

    for (const route of routes) {
      test(`Route: ${route}`, async ({ page }) => {
        const result: TestResult = {
          route,
          viewport: viewport.name,
          timestamp: new Date().toISOString(),
          paddingIssues: [],
          alignmentIssues: [],
          overlapIssues: [],
          contrastIssues: [],
          horizontalScroll: false,
          touchTargetIssues: [],
          textJustificationIssues: [],
          breakpointTransitionIssues: [],
          screenshots: [],
        };

        try {
          // Navigate to the route
          const response = await page.goto(`http://localhost:3000${route}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          // Check if page loaded successfully
          if (!response || response.status() >= 400) {
            console.warn(`Failed to load ${route}: ${response?.status()}`);
            continue;
          }

          // Wait for content to be visible
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(1000); // Allow time for animations

          // Initialize analyzers
          const paddingAnalyzer = new PaddingAnalyzer(page);
          const alignmentDetector = new AlignmentDetector(page);
          const overlapScanner = new OverlapScanner(page);
          const contrastValidator = new ContrastValidator(page);

          // 1. Analyze Padding
          console.log(`Analyzing padding for ${route} at ${viewport.name}...`);
          const buttonPadding = await paddingAnalyzer.analyzePadding(['button', 'a[role="button"]', '.btn']);
          const cardPadding = await paddingAnalyzer.analyzePadding(['.card', 'article', '.bg-white', '.bg-gray-50']);
          const sectionPadding = await paddingAnalyzer.analyzePadding(['section', 'main > div', '.container']);
          result.paddingIssues = [...buttonPadding, ...cardPadding, ...sectionPadding];

          // 2. Detect Alignment Issues
          console.log(`Detecting alignment issues for ${route} at ${viewport.name}...`);
          result.alignmentIssues = await alignmentDetector.detectAlignmentIssues();

          // 3. Scan for Overlaps
          console.log(`Scanning for overlaps for ${route} at ${viewport.name}...`);
          result.overlapIssues = await overlapScanner.scanForOverlaps();

          // 4. Validate Contrast
          console.log(`Validating contrast for ${route} at ${viewport.name}...`);
          result.contrastIssues = await contrastValidator.validateContrast();

          // 5. Check for Horizontal Scroll
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          result.horizontalScroll = hasHorizontalScroll;

          // 6. Check Touch Target Sizes (mobile viewports)
          if (viewport.width <= 768) {
            const touchTargets = await page.$$('button, a, input, select, textarea, [role="button"], [onclick]');
            const touchTargetIssues = [];

            for (const target of touchTargets) {
              const box = await target.boundingBox();
              if (!box) continue;

              if (box.width < 44 || box.height < 44) {
                const selector = await target.evaluate(el => {
                  if (el.id) return `#${el.id}`;
                  if (el.className && typeof el.className === 'string') {
                    return `.${el.className.split(' ')[0]}`;
                  }
                  return el.tagName.toLowerCase();
                });

                touchTargetIssues.push({
                  selector,
                  size: `${box.width}x${box.height}`,
                  minimum: '44x44',
                  severity: box.width < 24 || box.height < 24 ? 'critical' : 'major',
                });
              }
            }
            result.touchTargetIssues = touchTargetIssues;
          }

          // 7. Check Text Justification
          const textElements = await page.$$('p, div, span, h1, h2, h3, h4, h5, h6');
          const justificationIssues = [];

          for (const element of textElements) {
            const textAlign = await element.evaluate(el => window.getComputedStyle(el).textAlign);
            if (textAlign === 'justify') {
              const selector = await element.evaluate(el => {
                if (el.id) return `#${el.id}`;
                if (el.className && typeof el.className === 'string') {
                  return `.${el.className.split(' ')[0]}`;
                }
                return el.tagName.toLowerCase();
              });

              justificationIssues.push({
                selector,
                issue: 'Text justification can reduce readability',
                recommendation: 'Use left alignment for better readability',
              });
            }
          }
          result.textJustificationIssues = justificationIssues;

          // 8. Capture Screenshots of Issues
          if (result.paddingIssues.length > 0 ||
              result.alignmentIssues.length > 0 ||
              result.overlapIssues.length > 0 ||
              result.contrastIssues.length > 0) {

            const screenshotPath = `tests/ui-ux-inspection/screenshots/${route.replace(/\//g, '-')}-${viewport.name}-${Date.now()}.png`;
            await page.screenshot({
              path: screenshotPath,
              fullPage: true,
            });
            result.screenshots.push(screenshotPath);
          }

        } catch (error) {
          console.error(`Error testing ${route} at ${viewport.name}:`, error);
        }

        // Store results
        testResults.push(result);
      });
    }
  });
}

// After all tests, generate reports
test.afterAll(async () => {
  // Generate JSON report
  const jsonReport = {
    timestamp: new Date().toISOString(),
    totalRoutes: routes.length,
    totalViewports: VIEWPORTS.length,
    results: testResults,
    summary: {
      totalIssues: testResults.reduce((sum, r) =>
        sum + r.paddingIssues.length + r.alignmentIssues.length +
        r.overlapIssues.length + r.contrastIssues.length +
        r.touchTargetIssues.length + r.textJustificationIssues.length, 0
      ),
      criticalIssues: testResults.reduce((sum, r) =>
        sum + r.contrastIssues.filter(i => i.severity === 'critical').length +
        r.overlapIssues.filter(i => i.severity === 'critical').length +
        r.alignmentIssues.filter(i => i.severity === 'critical').length, 0
      ),
      routesWithHorizontalScroll: testResults.filter(r => r.horizontalScroll).length,
    },
  };

  fs.writeFileSync(
    'tests/ui-ux-inspection/reports/ui-inspection-report.json',
    JSON.stringify(jsonReport, null, 2)
  );

  // Generate HTML report
  const htmlReport = generateHTMLReport(jsonReport);
  fs.writeFileSync(
    'tests/ui-ux-inspection/reports/ui-inspection-report.html',
    htmlReport
  );

  // Generate CSV for issue tracking
  const csvReport = generateCSVReport(testResults);
  fs.writeFileSync(
    'tests/ui-ux-inspection/reports/ui-inspection-issues.csv',
    csvReport
  );

  console.log('\n=== UI/UX Inspection Complete ===');
  console.log(`Total Issues Found: ${jsonReport.summary.totalIssues}`);
  console.log(`Critical Issues: ${jsonReport.summary.criticalIssues}`);
  console.log(`Reports generated in: tests/ui-ux-inspection/reports/`);
});

function generateHTMLReport(data: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI/UX Inspection Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
    .summary-card h3 { margin-top: 0; color: #007bff; }
    .summary-card .value { font-size: 2em; font-weight: bold; color: #333; }
    .critical { border-left-color: #dc3545; }
    .critical h3 { color: #dc3545; }
    .issue-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .issue-table th { background: #007bff; color: white; padding: 10px; text-align: left; }
    .issue-table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .issue-table tr:hover { background: #f5f5f5; }
    .severity-critical { color: #dc3545; font-weight: bold; }
    .severity-major { color: #fd7e14; font-weight: bold; }
    .severity-minor { color: #ffc107; }
    .route-section { margin: 40px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>UI/UX Inspection Report</h1>
    <p>Generated: ${data.timestamp}</p>

    <div class="summary">
      <div class="summary-card">
        <h3>Total Issues</h3>
        <div class="value">${data.summary.totalIssues}</div>
      </div>
      <div class="summary-card critical">
        <h3>Critical Issues</h3>
        <div class="value">${data.summary.criticalIssues}</div>
      </div>
      <div class="summary-card">
        <h3>Routes Tested</h3>
        <div class="value">${data.totalRoutes}</div>
      </div>
      <div class="summary-card">
        <h3>Viewports</h3>
        <div class="value">${data.totalViewports}</div>
      </div>
    </div>

    <h2>Issues by Category</h2>
    ${generateIssuesByCategory(data.results)}

    <h2>Issues by Route</h2>
    ${generateIssuesByRoute(data.results)}
  </div>
</body>
</html>
  `;
}

function generateIssuesByCategory(results: TestResult[]): string {
  const categories = {
    'Contrast': results.flatMap(r => r.contrastIssues.map(i => ({ ...i, route: r.route, viewport: r.viewport }))),
    'Padding': results.flatMap(r => r.paddingIssues.map(i => ({ ...i, route: r.route, viewport: r.viewport }))),
    'Alignment': results.flatMap(r => r.alignmentIssues.map(i => ({ ...i, route: r.route, viewport: r.viewport }))),
    'Overlap': results.flatMap(r => r.overlapIssues.map(i => ({ ...i, route: r.route, viewport: r.viewport }))),
    'Touch Targets': results.flatMap(r => r.touchTargetIssues.map(i => ({ ...i, route: r.route, viewport: r.viewport }))),
  };

  return Object.entries(categories)
    .filter(([_, issues]) => issues.length > 0)
    .map(([category, issues]) => `
      <div class="route-section">
        <h3>${category} (${issues.length} issues)</h3>
        <table class="issue-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Viewport</th>
              <th>Severity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${issues.slice(0, 10).map(issue => `
              <tr>
                <td>${issue.route}</td>
                <td>${issue.viewport}</td>
                <td class="severity-${issue.severity || 'minor'}">${issue.severity || 'minor'}</td>
                <td>${JSON.stringify(issue).substring(0, 100)}...</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
}

function generateIssuesByRoute(results: TestResult[]): string {
  const routeGroups = results.reduce((acc, result) => {
    if (!acc[result.route]) acc[result.route] = [];
    acc[result.route].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return Object.entries(routeGroups).map(([route, routeResults]) => {
    const totalIssues = routeResults.reduce((sum, r) =>
      sum + r.paddingIssues.length + r.alignmentIssues.length +
      r.overlapIssues.length + r.contrastIssues.length +
      r.touchTargetIssues.length + r.textJustificationIssues.length, 0
    );

    return `
      <div class="route-section">
        <h3>${route} (${totalIssues} total issues)</h3>
        <ul>
          ${routeResults.map(r => `
            <li>
              <strong>${r.viewport}:</strong>
              Padding: ${r.paddingIssues.length},
              Alignment: ${r.alignmentIssues.length},
              Overlap: ${r.overlapIssues.length},
              Contrast: ${r.contrastIssues.length}
              ${r.horizontalScroll ? '<span style="color: red;">(Has horizontal scroll)</span>' : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

function generateCSVReport(results: TestResult[]): string {
  const headers = ['Route', 'Viewport', 'Issue Type', 'Severity', 'Selector', 'Details'];
  const rows: string[][] = [headers];

  for (const result of results) {
    // Add padding issues
    for (const issue of result.paddingIssues) {
      rows.push([
        result.route,
        result.viewport,
        'Padding',
        issue.severity || 'minor',
        issue.selector || '',
        `Deviation: ${issue.deviation}%`
      ]);
    }

    // Add alignment issues
    for (const issue of result.alignmentIssues) {
      rows.push([
        result.route,
        result.viewport,
        'Alignment',
        issue.severity || 'minor',
        issue.selector || '',
        `Type: ${issue.type}, Deviation: ${issue.deviation}px`
      ]);
    }

    // Add overlap issues
    for (const issue of result.overlapIssues) {
      rows.push([
        result.route,
        result.viewport,
        'Overlap',
        issue.severity || 'minor',
        `${issue.selector1} / ${issue.selector2}`,
        issue.description
      ]);
    }

    // Add contrast issues
    for (const issue of result.contrastIssues) {
      rows.push([
        result.route,
        result.viewport,
        'Contrast',
        issue.severity || 'minor',
        issue.selector || '',
        `Ratio: ${issue.ratio}, Required: ${issue.requiredRatio}`
      ]);
    }

    // Add touch target issues
    for (const issue of result.touchTargetIssues) {
      rows.push([
        result.route,
        result.viewport,
        'Touch Target',
        issue.severity || 'minor',
        issue.selector || '',
        `Size: ${issue.size}, Minimum: ${issue.minimum}`
      ]);
    }
  }

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}