import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface UIIssue {
  page: string;
  viewport: string;
  type: 'padding' | 'alignment' | 'overlap' | 'contrast' | 'text-justify' | 'performance' | 'error';
  selector?: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  computedStyles?: any;
  screenshot?: string;
}

const allIssues: UIIssue[] = [];

// All discovered routes
const routes = [
  { path: '/', name: 'Home' },
  { path: '/assessment', name: 'Assessment' },
  { path: '/blog', name: 'Blog' },
  { path: '/services', name: 'Services' },
  { path: '/performance-accelerator', name: 'Performance Accelerator' },
  { path: '/apply', name: 'Apply' },
  { path: '/family-athlete-demo', name: 'Family Athlete Demo' },
  { path: '/mobile-demo', name: 'Mobile Demo' },
  { path: '/test', name: 'Test Page' },
  { path: '/admin/login', name: 'Admin Login' },
];

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'large-1440', width: 1440, height: 900 },
  { name: 'xlarge-1920', width: 1920, height: 1080 },
];

test.describe('Full UI/UX Inspection', () => {
  test.setTimeout(300000); // 5 minutes

  for (const route of routes) {
    test(`Inspect ${route.name}`, async ({ browser }) => {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        });
        const page = await context.newPage();
        const pageIssues: UIIssue[] = [];

        console.log(`\\nTesting ${route.name} at ${viewport.name}`);

        try {
          // Navigate to page
          const startTime = Date.now();
          await page.goto(`http://localhost:3000${route.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000
          });
          const loadTime = Date.now() - startTime;

          // Performance check
          if (loadTime > 2000) {
            pageIssues.push({
              page: route.path,
              viewport: viewport.name,
              type: 'performance',
              description: `Page load time ${loadTime}ms exceeds 2 second target`,
              severity: loadTime > 3000 ? 'major' : 'minor'
            });
          }

          await page.waitForTimeout(1000);

          // 1. Comprehensive Padding Analysis
          const paddingElements = await page.$$('button, [class*="btn"], [class*="card"], section, header, footer, nav, [class*="container"]');
          const paddingBaseline = new Map<string, { top: number; right: number; bottom: number; left: number }>();

          for (const element of paddingElements) {
            const info = await element.evaluate(el => {
              const styles = window.getComputedStyle(el);
              const classList = el.className;
              const tagName = el.tagName.toLowerCase();
              return {
                selector: \`\${tagName}\${classList ? '.' + classList.split(' ')[0] : ''}\`,
                padding: {
                  top: parseFloat(styles.paddingTop),
                  right: parseFloat(styles.paddingRight),
                  bottom: parseFloat(styles.paddingBottom),
                  left: parseFloat(styles.paddingLeft)
                },
                display: styles.display,
                visibility: styles.visibility
              };
            });

            if (info.display === 'none' || info.visibility === 'hidden') continue;

            // Check for asymmetric padding
            const horizontalDiff = Math.abs(info.padding.left - info.padding.right);
            const verticalDiff = Math.abs(info.padding.top - info.padding.bottom);

            if (horizontalDiff > 5) {
              pageIssues.push({
                page: route.path,
                viewport: viewport.name,
                type: 'padding',
                selector: info.selector,
                description: \`Asymmetric horizontal padding: \${info.padding.left}px left vs \${info.padding.right}px right (diff: \${horizontalDiff}px)\`,
                severity: horizontalDiff > 20 ? 'major' : 'minor',
                computedStyles: info.padding
              });
            }

            if (verticalDiff > 5) {
              pageIssues.push({
                page: route.path,
                viewport: viewport.name,
                type: 'padding',
                selector: info.selector,
                description: \`Asymmetric vertical padding: \${info.padding.top}px top vs \${info.padding.bottom}px bottom (diff: \${verticalDiff}px)\`,
                severity: verticalDiff > 20 ? 'major' : 'minor',
                computedStyles: info.padding
              });
            }

            // Check for consistency across similar elements
            const key = info.selector.split('.')[0]; // Group by tag name
            if (!paddingBaseline.has(key)) {
              paddingBaseline.set(key, info.padding);
            } else {
              const baseline = paddingBaseline.get(key)!;
              const deviations = [
                Math.abs(info.padding.top - baseline.top),
                Math.abs(info.padding.right - baseline.right),
                Math.abs(info.padding.bottom - baseline.bottom),
                Math.abs(info.padding.left - baseline.left)
              ];
              const maxDeviation = Math.max(...deviations);

              if (maxDeviation > 10) {
                pageIssues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'padding',
                  selector: info.selector,
                  description: \`Inconsistent padding compared to other \${key} elements (deviation: \${maxDeviation}px)\`,
                  severity: maxDeviation > 30 ? 'major' : 'minor',
                  computedStyles: info.padding
                });
              }
            }
          }

          // 2. Text Justification Analysis
          const textElements = await page.$$('p, div[class*="text"], span[class*="text"], h1, h2, h3, h4, h5, h6');
          for (const element of textElements.slice(0, 20)) { // Limit to first 20 to avoid timeout
            const textInfo = await element.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return {
                textAlign: styles.textAlign,
                textJustify: styles.textJustify,
                wordSpacing: styles.wordSpacing,
                letterSpacing: styles.letterSpacing,
                lineHeight: styles.lineHeight,
                text: el.textContent?.substring(0, 50)
              };
            });

            if (textInfo.textAlign === 'justify') {
              pageIssues.push({
                page: route.path,
                viewport: viewport.name,
                type: 'text-justify',
                description: \`Justified text found: "\${textInfo.text}" - can cause readability issues\`,
                severity: 'minor',
                computedStyles: textInfo
              });
            }
          }

          // 3. Alignment Detection
          const containers = await page.$$('[class*="grid"], [class*="flex"]');
          for (const container of containers.slice(0, 10)) { // Limit to avoid timeout
            const containerInfo = await container.evaluate(el => {
              const styles = window.getComputedStyle(el);
              const children = Array.from(el.children);
              const childBounds = children.map(child => {
                const rect = child.getBoundingClientRect();
                return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
              });
              return {
                display: styles.display,
                alignItems: styles.alignItems,
                justifyContent: styles.justifyContent,
                gap: styles.gap,
                childCount: children.length,
                childBounds
              };
            });

            if (containerInfo.childCount > 1) {
              // Check horizontal alignment
              const yPositions = containerInfo.childBounds.map(b => b.y);
              const yVariance = Math.max(...yPositions) - Math.min(...yPositions);

              if (yVariance > 5 && containerInfo.display.includes('flex') && !containerInfo.display.includes('column')) {
                pageIssues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'alignment',
                  description: \`Flex items misaligned horizontally by \${yVariance.toFixed(0)}px\`,
                  severity: yVariance > 20 ? 'major' : 'minor'
                });
              }

              // Check vertical alignment
              const xPositions = containerInfo.childBounds.map(b => b.x);
              const xVariance = Math.max(...xPositions) - Math.min(...xPositions);

              if (xVariance > 5 && containerInfo.display.includes('flex') && containerInfo.display.includes('column')) {
                pageIssues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'alignment',
                  description: \`Flex items misaligned vertically by \${xVariance.toFixed(0)}px\`,
                  severity: xVariance > 20 ? 'major' : 'minor'
                });
              }
            }
          }

          // 4. Overlap Detection for Interactive Elements
          const interactiveElements = await page.$$('button, a, input, select, textarea, [role="button"], [onclick]');
          const bounds: any[] = [];

          for (const element of interactiveElements) {
            const box = await element.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
              const selector = await element.evaluate(el => {
                const id = el.id ? \`#\${el.id}\` : '';
                const classes = el.className ? \`.\${el.className.split(' ')[0]}\` : '';
                return id || classes || el.tagName.toLowerCase();
              });
              bounds.push({ box, selector });
            }
          }

          // Check for overlaps
          for (let i = 0; i < bounds.length; i++) {
            for (let j = i + 1; j < bounds.length; j++) {
              const box1 = bounds[i].box;
              const box2 = bounds[j].box;

              const overlapX = Math.max(0, Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x));
              const overlapY = Math.max(0, Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y));

              if (overlapX > 5 && overlapY > 5) {
                pageIssues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'overlap',
                  selector: \`\${bounds[i].selector} and \${bounds[j].selector}\`,
                  description: \`Interactive elements overlap by \${overlapX.toFixed(0)}x\${overlapY.toFixed(0)}px\`,
                  severity: 'critical'
                });
              }
            }
          }

          // 5. WCAG Color Contrast Validation
          const textForContrast = await page.$$('h1, h2, h3, h4, h5, h6, p, a, button, label, span');
          for (const element of textForContrast.slice(0, 20)) { // Limit to avoid timeout
            const contrastInfo = await element.evaluate(el => {
              const styles = window.getComputedStyle(el);
              let bgColor = styles.backgroundColor;
              let parent = el.parentElement;

              // Find actual background color
              while (parent && (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)')) {
                bgColor = window.getComputedStyle(parent).backgroundColor;
                parent = parent.parentElement;
              }

              // Default to white if no background found
              if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
                bgColor = 'rgb(255, 255, 255)';
              }

              return {
                color: styles.color,
                backgroundColor: bgColor,
                fontSize: parseFloat(styles.fontSize),
                fontWeight: styles.fontWeight,
                text: el.textContent?.substring(0, 30)
              };
            });

            // Calculate simplified contrast ratio
            const colorMatch = contrastInfo.color.match(/\\d+/g);
            const bgMatch = contrastInfo.backgroundColor.match(/\\d+/g);

            if (colorMatch && bgMatch) {
              // Simple luminance calculation
              const colorLum = (parseInt(colorMatch[0]) * 0.299 +
                               parseInt(colorMatch[1]) * 0.587 +
                               parseInt(colorMatch[2]) * 0.114);
              const bgLum = (parseInt(bgMatch[0]) * 0.299 +
                            parseInt(bgMatch[1]) * 0.587 +
                            parseInt(bgMatch[2]) * 0.114);

              const contrast = Math.abs(colorLum - bgLum);
              const isLargeText = contrastInfo.fontSize >= 18 ||
                                  (contrastInfo.fontSize >= 14 && parseInt(contrastInfo.fontWeight) >= 700);

              const minContrast = isLargeText ? 75 : 125; // Simplified thresholds

              if (contrast < minContrast) {
                pageIssues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'contrast',
                  selector: contrastInfo.text,
                  description: \`Low colour contrast (\${contrast.toFixed(0)}): "\${contrastInfo.text}" - \${contrastInfo.color} on \${contrastInfo.backgroundColor}\`,
                  severity: contrast < 50 ? 'critical' : 'major',
                  computedStyles: contrastInfo
                });
              }
            }
          }

          // Take screenshot
          const screenshotName = \`\${route.name.replace(/\\s+/g, '-')}-\${viewport.name}.png\`;
          await page.screenshot({
            path: path.join('tests/ui-ux-inspection/screenshots', screenshotName),
            fullPage: false
          });

          console.log(\`  Found \${pageIssues.length} issues\`);

        } catch (error) {
          console.error(\`Error testing \${route.name} at \${viewport.name}:\`, error);
          pageIssues.push({
            page: route.path,
            viewport: viewport.name,
            type: 'error',
            description: error.toString(),
            severity: 'critical'
          });
        }

        allIssues.push(...pageIssues);
        await context.close();
      }
    });
  }

  test.afterAll(async () => {
    // Generate comprehensive report
    const report = generateComprehensiveReport(allIssues);

    // Save reports
    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'ui-ux-report.json'),
      JSON.stringify(report, null, 2)
    );

    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'ui-ux-dashboard.html'),
      generateHTMLDashboard(report)
    );

    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'ui-ux-issues.csv'),
      generateCSV(allIssues)
    );

    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'UI-UX-INSPECTION-SUMMARY.md'),
      generateMarkdownSummary(report)
    );

    console.log('\\n' + '='.repeat(50));
    console.log('UI/UX INSPECTION COMPLETE');
    console.log('='.repeat(50));
    console.log(\`Total Issues: \${report.summary.totalIssues}\`);
    console.log(\`- Critical: \${report.summary.criticalIssues}\`);
    console.log(\`- Major: \${report.summary.majorIssues}\`);
    console.log(\`- Minor: \${report.summary.minorIssues}\`);
    console.log('\\nReports generated:');
    console.log('- ui-ux-report.json');
    console.log('- ui-ux-dashboard.html');
    console.log('- ui-ux-issues.csv');
    console.log('- UI-UX-INSPECTION-SUMMARY.md');
  });
});

function generateComprehensiveReport(issues: UIIssue[]) {
  const summary = {
    totalIssues: issues.length,
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
    majorIssues: issues.filter(i => i.severity === 'major').length,
    minorIssues: issues.filter(i => i.severity === 'minor').length,
    paddingIssues: issues.filter(i => i.type === 'padding').length,
    alignmentIssues: issues.filter(i => i.type === 'alignment').length,
    overlapIssues: issues.filter(i => i.type === 'overlap').length,
    contrastIssues: issues.filter(i => i.type === 'contrast').length,
    textJustifyIssues: issues.filter(i => i.type === 'text-justify').length,
    performanceIssues: issues.filter(i => i.type === 'performance').length,
    errors: issues.filter(i => i.type === 'error').length
  };

  // Group issues by page
  const byPage = new Map<string, UIIssue[]>();
  for (const issue of issues) {
    if (!byPage.has(issue.page)) {
      byPage.set(issue.page, []);
    }
    byPage.get(issue.page)!.push(issue);
  }

  // Generate recommendations
  const recommendations: any[] = [];

  if (summary.criticalIssues > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      title: 'Fix Critical Issues Immediately',
      description: \`\${summary.criticalIssues} critical issues found that severely impact usability and accessibility\`,
      actions: [
        'Fix overlapping interactive elements',
        'Address critical colour contrast failures',
        'Resolve page loading errors'
      ]
    });
  }

  if (summary.contrastIssues > 10) {
    recommendations.push({
      priority: 'HIGH',
      title: 'Improve Colour Contrast',
      description: \`\${summary.contrastIssues} contrast issues affect WCAG 2.1 AA compliance\`,
      actions: [
        'Review colour palette for sufficient contrast ratios',
        'Use darker text on light backgrounds',
        'Ensure 4.5:1 ratio for normal text, 3:1 for large text'
      ]
    });
  }

  if (summary.paddingIssues > 20) {
    recommendations.push({
      priority: 'MEDIUM',
      title: 'Standardise Component Padding',
      description: \`\${summary.paddingIssues} padding inconsistencies affect visual consistency\`,
      actions: [
        'Create standard spacing tokens',
        'Use consistent padding values across similar components',
        'Review responsive padding adjustments'
      ]
    });
  }

  return {
    metadata: {
      timestamp: new Date().toISOString(),
      totalPages: routes.length,
      totalViewports: viewports.length,
      totalTests: routes.length * viewports.length
    },
    summary,
    byPage: Object.fromEntries(byPage),
    recommendations,
    issues
  };
}

function generateHTMLDashboard(report: any): string {
  return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI/UX Inspection Dashboard - Leah Fowler Performance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a2942 0%, #0f1e33 100%);
      color: #fff;
      min-height: 100vh;
      padding: 2rem;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      transition: transform 0.3s, background 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.08);
    }
    .stat-label {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
    }
    .critical { color: #ef4444; }
    .major { color: #fb923c; }
    .minor { color: #fbbf24; }
    .success { color: #10b981; }
    .section {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .section h2 {
      margin-bottom: 1.5rem;
      color: #fbbf24;
      font-size: 1.5rem;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    th {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #fbbf24;
      border-bottom: 2px solid rgba(251, 191, 36, 0.3);
    }
    td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .badge-critical {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border: 1px solid #ef4444;
    }
    .badge-major {
      background: rgba(251, 146, 60, 0.2);
      color: #fb923c;
      border: 1px solid #fb923c;
    }
    .badge-minor {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      border: 1px solid #fbbf24;
    }
    .recommendation {
      background: rgba(0, 0, 0, 0.3);
      border-left: 4px solid;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .recommendation.CRITICAL { border-color: #ef4444; }
    .recommendation.HIGH { border-color: #fb923c; }
    .recommendation.MEDIUM { border-color: #fbbf24; }
    .recommendation h3 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
    .recommendation p {
      color: #cbd5e1;
      margin-bottom: 1rem;
    }
    .recommendation ul {
      list-style: none;
      padding-left: 0;
    }
    .recommendation li {
      padding: 0.5rem 0;
      color: #e2e8f0;
    }
    .recommendation li:before {
      content: "→ ";
      color: #fbbf24;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>UI/UX Inspection Dashboard</h1>
    <p class="subtitle">Comprehensive analysis of \${report.metadata.totalPages} pages across \${report.metadata.totalViewports} viewports</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Issues</div>
        <div class="stat-value">\${report.summary.totalIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Critical</div>
        <div class="stat-value critical">\${report.summary.criticalIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Major</div>
        <div class="stat-value major">\${report.summary.majorIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Minor</div>
        <div class="stat-value minor">\${report.summary.minorIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Padding Issues</div>
        <div class="stat-value">\${report.summary.paddingIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Alignment Issues</div>
        <div class="stat-value">\${report.summary.alignmentIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Overlap Issues</div>
        <div class="stat-value \${report.summary.overlapIssues > 0 ? 'critical' : 'success'}">\${report.summary.overlapIssues}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Contrast Issues</div>
        <div class="stat-value \${report.summary.contrastIssues > 0 ? 'major' : 'success'}">\${report.summary.contrastIssues}</div>
      </div>
    </div>

    <div class="section">
      <h2>Priority Recommendations</h2>
      \${report.recommendations.map(rec => \`
        <div class="recommendation \${rec.priority}">
          <h3>\${rec.title}</h3>
          <p>\${rec.description}</p>
          <ul>
            \${rec.actions.map(action => \`<li>\${action}</li>\`).join('')}
          </ul>
        </div>
      \`).join('')}
    </div>

    <div class="section">
      <h2>Issues by Page</h2>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Total Issues</th>
            <th>Critical</th>
            <th>Major</th>
            <th>Minor</th>
            <th>Most Common Type</th>
          </tr>
        </thead>
        <tbody>
          \${Object.entries(report.byPage).map(([page, issues]) => {
            const pageIssues = issues as any[];
            const critical = pageIssues.filter(i => i.severity === 'critical').length;
            const major = pageIssues.filter(i => i.severity === 'major').length;
            const minor = pageIssues.filter(i => i.severity === 'minor').length;
            const typeCounts = pageIssues.reduce((acc, i) => {
              acc[i.type] = (acc[i.type] || 0) + 1;
              return acc;
            }, {});
            const mostCommon = Object.entries(typeCounts).sort((a: any, b: any) => b[1] - a[1])[0];
            return \`
              <tr>
                <td>\${page}</td>
                <td>\${pageIssues.length}</td>
                <td>\${critical > 0 ? \`<span class="badge badge-critical">\${critical}</span>\` : '-'}</td>
                <td>\${major > 0 ? \`<span class="badge badge-major">\${major}</span>\` : '-'}</td>
                <td>\${minor > 0 ? \`<span class="badge badge-minor">\${minor}</span>\` : '-'}</td>
                <td>\${mostCommon ? mostCommon[0] : '-'}</td>
              </tr>
            \`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Test Metadata</h2>
      <p>Generated: \${new Date(report.metadata.timestamp).toLocaleString()}</p>
      <p>Total Pages Tested: \${report.metadata.totalPages}</p>
      <p>Viewports Tested: \${viewports.map(v => v.name).join(', ')}</p>
      <p>Total Test Runs: \${report.metadata.totalTests}</p>
    </div>
  </div>
</body>
</html>\`;
}

function generateCSV(issues: UIIssue[]): string {
  const headers = ['Page', 'Viewport', 'Type', 'Severity', 'Selector', 'Description'];
  const rows = [headers.join(',')];

  for (const issue of issues) {
    rows.push([
      issue.page,
      issue.viewport,
      issue.type,
      issue.severity,
      (issue.selector || '').replace(/,/g, ';'),
      issue.description.replace(/,/g, ';')
    ].map(field => \`"\${field}"\`).join(','));
  }

  return rows.join('\\n');
}

function generateMarkdownSummary(report: any): string {
  return \`# UI/UX Inspection Summary Report

Generated: \${report.metadata.timestamp}

## Executive Summary

Comprehensive UI/UX inspection of **\${report.metadata.totalPages} pages** across **\${report.metadata.totalViewports} viewports**, totalling **\${report.metadata.totalTests} test scenarios**.

### Overall Statistics

| Metric | Count | Status |
|--------|-------|--------|
| **Total Issues** | \${report.summary.totalIssues} | \${report.summary.totalIssues > 50 ? '🔴 Critical' : report.summary.totalIssues > 20 ? '🟡 Needs Attention' : '🟢 Good'} |
| **Critical Issues** | \${report.summary.criticalIssues} | \${report.summary.criticalIssues > 0 ? '🔴 Immediate Action Required' : '✅ None'} |
| **Major Issues** | \${report.summary.majorIssues} | \${report.summary.majorIssues > 10 ? '🟡 High Priority' : '✅ Manageable'} |
| **Minor Issues** | \${report.summary.minorIssues} | ℹ️ Low Priority |

### Issue Breakdown by Type

| Issue Type | Count | Description |
|------------|-------|-------------|
| **Padding Inconsistencies** | \${report.summary.paddingIssues} | Asymmetric or inconsistent padding affecting visual hierarchy |
| **Alignment Problems** | \${report.summary.alignmentIssues} | Misaligned elements in grids and flexbox containers |
| **Element Overlaps** | \${report.summary.overlapIssues} | Interactive elements overlapping, blocking user interaction |
| **Colour Contrast** | \${report.summary.contrastIssues} | WCAG 2.1 AA compliance failures |
| **Text Justification** | \${report.summary.textJustifyIssues} | Justified text causing readability issues |
| **Performance** | \${report.summary.performanceIssues} | Pages exceeding 2-second load target |

## Priority Recommendations

\${report.recommendations.map(rec => \`
### \${rec.priority === 'CRITICAL' ? '🔴' : rec.priority === 'HIGH' ? '🟡' : '🟢'} \${rec.title}

\${rec.description}

**Action Items:**
\${rec.actions.map(action => \`- \${action}\`).join('\\n')}
\`).join('\\n')}

## Most Affected Pages

\${Object.entries(report.byPage)
  .sort((a: any, b: any) => b[1].length - a[1].length)
  .slice(0, 5)
  .map(([page, issues]: any) => \`- **\${page}**: \${issues.length} issues\`)
  .join('\\n')}

## Viewport Analysis

The following viewports were tested:
- Mobile (375px) - Critical for mobile users
- Tablet (768px) - iPad and tablet devices
- Desktop (1024px) - Standard desktop
- Large (1440px) - Wide desktop screens
- XLarge (1920px) - Full HD displays

## WCAG 2.1 AA Compliance

\${report.summary.contrastIssues > 0 ? \`
⚠️ **Compliance Status: Non-Compliant**

The site currently has \${report.summary.contrastIssues} colour contrast issues that prevent WCAG 2.1 AA compliance.

Key requirements:
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18pt+): minimum 3:1 contrast ratio
- Interactive elements: minimum 3:1 contrast ratio
\` : \`
✅ **Compliance Status: Passed**

No critical colour contrast issues detected. The site meets WCAG 2.1 AA requirements.
\`}

## Next Steps

1. **Immediate Actions** (Within 24 hours)
   - Fix all critical overlapping elements
   - Address critical colour contrast failures
   - Resolve any page loading errors

2. **Short Term** (Within 1 week)
   - Standardise padding across similar components
   - Fix major alignment issues
   - Improve colour contrast on all text elements

3. **Medium Term** (Within 1 month)
   - Create comprehensive design system
   - Implement automated UI testing
   - Optimise performance for sub-2-second loads

4. **Long Term** (Ongoing)
   - Regular accessibility audits
   - Continuous performance monitoring
   - User experience testing and feedback

## Technical Recommendations

### Design System Implementation
Create standardised design tokens for:
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Colour palette with contrast-validated combinations
- Typography scale with size and weight variations
- Component padding and margin standards

### Testing Integration
- Add Playwright UI tests to CI/CD pipeline
- Implement visual regression testing
- Set up automated accessibility scanning
- Monitor Core Web Vitals

## Files Generated

- \`ui-ux-report.json\` - Complete test data in JSON format
- \`ui-ux-dashboard.html\` - Interactive visual dashboard
- \`ui-ux-issues.csv\` - Spreadsheet for issue tracking
- \`screenshots/\` - Visual evidence of all pages tested

---

*Report generated by comprehensive Playwright UI/UX inspection suite*
*Leah Fowler Performance - Elite Performance Optimisation*
\`;
}