import { chromium, Page } from 'playwright';
import { PaddingAnalyzer } from './utils/paddingAnalyzer';
import { AlignmentDetector } from './utils/alignmentDetector';
import { OverlapScanner } from './utils/overlapScanner';
import { ContrastValidator } from './utils/contrastValidator';
import * as fs from 'fs';
import * as path from 'path';

// Routes to test
const routes = [
  '/',
  '/services',
  '/performance-accelerator',
  '/apply',
  '/blog'
];

// Viewports
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

interface IssueReport {
  route: string;
  viewport: string;
  issues: {
    padding: any[];
    alignment: any[];
    overlap: any[];
    contrast: any[];
    horizontalScroll: boolean;
    touchTargets: any[];
  };
}

async function runInspection() {
  const browser = await chromium.launch({ headless: true });
  const results: IssueReport[] = [];

  console.log('Starting UI/UX Inspection...\n');

  for (const viewport of viewports) {
    console.log(`\nTesting viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      userAgent: viewport.width <= 768
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });

    const page = await context.newPage();

    for (const route of routes) {
      console.log(`  Testing route: ${route}`);

      try {
        // Navigate to the route
        const response = await page.goto(`http://localhost:3000${route}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        if (!response || response.status() >= 400) {
          console.log(`    ❌ Failed to load (status: ${response?.status()})`);
          continue;
        }

        // Wait for content
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);

        // Initialize analyzers
        const paddingAnalyzer = new PaddingAnalyzer(page);
        const alignmentDetector = new AlignmentDetector(page);
        const overlapScanner = new OverlapScanner(page);
        const contrastValidator = new ContrastValidator(page);

        // Run analyses
        const paddingIssues = await paddingAnalyzer.analyzePadding([
          'button', 'a[role="button"]', '.btn',
          '.card', 'article', '.bg-white',
          'section', '.container'
        ]);

        const alignmentIssues = await alignmentDetector.detectAlignmentIssues();
        const overlapIssues = await overlapScanner.scanForOverlaps();
        const contrastIssues = await contrastValidator.validateContrast();

        // Check horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        // Check touch targets (mobile only)
        const touchTargetIssues: any[] = [];
        if (viewport.width <= 768) {
          const buttons = await page.$$('button, a, input, select, [role="button"]');
          for (const button of buttons) {
            const box = await button.boundingBox();
            if (box && (box.width < 44 || box.height < 44)) {
              touchTargetIssues.push({
                size: `${box.width}x${box.height}`,
                minimum: '44x44'
              });
            }
          }
        }

        // Store results
        const report: IssueReport = {
          route,
          viewport: viewport.name,
          issues: {
            padding: paddingIssues,
            alignment: alignmentIssues,
            overlap: overlapIssues,
            contrast: contrastIssues,
            horizontalScroll: hasHorizontalScroll,
            touchTargets: touchTargetIssues
          }
        };

        results.push(report);

        // Log summary
        const totalIssues =
          paddingIssues.length +
          alignmentIssues.length +
          overlapIssues.length +
          contrastIssues.length +
          touchTargetIssues.length;

        console.log(`    ✓ Complete - ${totalIssues} issues found`);
        if (paddingIssues.length > 0) console.log(`      - Padding: ${paddingIssues.length}`);
        if (alignmentIssues.length > 0) console.log(`      - Alignment: ${alignmentIssues.length}`);
        if (overlapIssues.length > 0) console.log(`      - Overlap: ${overlapIssues.length}`);
        if (contrastIssues.length > 0) console.log(`      - Contrast: ${contrastIssues.length}`);
        if (touchTargetIssues.length > 0) console.log(`      - Touch targets: ${touchTargetIssues.length}`);
        if (hasHorizontalScroll) console.log(`      - ⚠️  Has horizontal scroll`);

      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  // Generate report
  generateReport(results);
}

function generateReport(results: IssueReport[]) {
  console.log('\n\n=== UI/UX INSPECTION REPORT ===\n');

  // Summary statistics
  let totalPadding = 0, totalAlignment = 0, totalOverlap = 0, totalContrast = 0, totalTouch = 0;
  let horizontalScrollCount = 0;

  for (const report of results) {
    totalPadding += report.issues.padding.length;
    totalAlignment += report.issues.alignment.length;
    totalOverlap += report.issues.overlap.length;
    totalContrast += report.issues.contrast.length;
    totalTouch += report.issues.touchTargets.length;
    if (report.issues.horizontalScroll) horizontalScrollCount++;
  }

  console.log('SUMMARY:');
  console.log(`  Total Issues: ${totalPadding + totalAlignment + totalOverlap + totalContrast + totalTouch}`);
  console.log(`  - Padding Issues: ${totalPadding}`);
  console.log(`  - Alignment Issues: ${totalAlignment}`);
  console.log(`  - Overlap Issues: ${totalOverlap}`);
  console.log(`  - Contrast Issues: ${totalContrast}`);
  console.log(`  - Touch Target Issues: ${totalTouch}`);
  console.log(`  - Pages with Horizontal Scroll: ${horizontalScrollCount}`);

  // Critical issues
  console.log('\nCRITICAL ISSUES:');

  // Find critical contrast issues
  const criticalContrast = results.filter(r =>
    r.issues.contrast.some(c => c.severity === 'critical')
  );

  if (criticalContrast.length > 0) {
    console.log('\n  Contrast Violations (WCAG AA):');
    for (const report of criticalContrast) {
      for (const issue of report.issues.contrast.filter(c => c.severity === 'critical')) {
        console.log(`    - ${report.route} (${report.viewport}): ${issue.selector}`);
        console.log(`      Ratio: ${issue.ratio} (required: ${issue.requiredRatio})`);
      }
    }
  }

  // Find critical overlaps
  const criticalOverlaps = results.filter(r =>
    r.issues.overlap.some(o => o.severity === 'critical')
  );

  if (criticalOverlaps.length > 0) {
    console.log('\n  Critical Overlaps:');
    for (const report of criticalOverlaps) {
      for (const issue of report.issues.overlap.filter(o => o.severity === 'critical')) {
        console.log(`    - ${report.route} (${report.viewport}): ${issue.description}`);
        console.log(`      Elements: ${issue.selector1} overlaps ${issue.selector2}`);
      }
    }
  }

  // Mobile-specific issues
  const mobileResults = results.filter(r => r.viewport === 'mobile');
  if (mobileResults.length > 0) {
    console.log('\nMOBILE-SPECIFIC ISSUES:');

    const horizontalScrollMobile = mobileResults.filter(r => r.issues.horizontalScroll);
    if (horizontalScrollMobile.length > 0) {
      console.log('  Pages with horizontal scroll on mobile:');
      for (const report of horizontalScrollMobile) {
        console.log(`    - ${report.route}`);
      }
    }

    const touchIssues = mobileResults.filter(r => r.issues.touchTargets.length > 0);
    if (touchIssues.length > 0) {
      console.log('  Touch target violations (< 44x44px):');
      for (const report of touchIssues) {
        console.log(`    - ${report.route}: ${report.issues.touchTargets.length} elements`);
      }
    }
  }

  // Route-by-route breakdown
  console.log('\nROUTE-BY-ROUTE BREAKDOWN:');
  const routeMap = new Map<string, IssueReport[]>();

  for (const report of results) {
    if (!routeMap.has(report.route)) {
      routeMap.set(report.route, []);
    }
    routeMap.get(report.route)!.push(report);
  }

  for (const [route, reports] of routeMap) {
    console.log(`\n  ${route}:`);
    for (const report of reports) {
      const total =
        report.issues.padding.length +
        report.issues.alignment.length +
        report.issues.overlap.length +
        report.issues.contrast.length +
        report.issues.touchTargets.length;

      if (total > 0 || report.issues.horizontalScroll) {
        console.log(`    ${report.viewport}: ${total} issues${report.issues.horizontalScroll ? ' + horizontal scroll' : ''}`);
      } else {
        console.log(`    ${report.viewport}: ✓ No issues`);
      }
    }
  }

  // Recommendations
  console.log('\n\nRECOMMENDATIONS:');
  console.log('  1. Fix all critical contrast issues immediately (WCAG AA compliance)');
  console.log('  2. Address horizontal scroll on mobile devices');
  console.log('  3. Ensure touch targets are at least 44x44px on mobile');
  console.log('  4. Review and fix element overlaps, especially for interactive elements');
  console.log('  5. Standardise padding across similar components');
  console.log('  6. Align grid/flex items consistently');

  // Save JSON report
  const reportPath = path.join(__dirname, 'reports', 'inspection-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n\nFull report saved to: ${reportPath}`);
}

// Run the inspection
runInspection().catch(console.error);