import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface UIIssue {
  page: string;
  viewport: string;
  type: string;
  selector?: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  value?: any;
}

const issues: UIIssue[] = [];

// Focus on main pages only
const routes = [
  { path: '/', name: 'Home' },
  { path: '/assessment', name: 'Assessment' },
  { path: '/services', name: 'Services' },
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('Quick UI/UX Inspection', () => {
  test.setTimeout(120000);

  test('Inspect main pages for UI/UX issues', async ({ page }) => {
    for (const route of routes) {
      for (const viewport of viewports) {
        console.log(`\nInspecting ${route.name} at ${viewport.name}`);

        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        try {
          await page.goto(route.path, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(1000);

          // Quick padding check
          const buttons = await page.$$('button');
          for (const button of buttons) {
            const padding = await button.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                top: parseFloat(computed.paddingTop),
                right: parseFloat(computed.paddingRight),
                bottom: parseFloat(computed.paddingBottom),
                left: parseFloat(computed.paddingLeft),
              };
            });

            // Check for asymmetric padding
            if (Math.abs(padding.left - padding.right) > 5) {
              issues.push({
                page: route.path,
                viewport: viewport.name,
                type: 'padding',
                selector: 'button',
                description: `Asymmetric horizontal padding: ${padding.left}px left vs ${padding.right}px right`,
                severity: 'minor'
              });
            }
          }

          // Quick contrast check on headings
          const headings = await page.$$('h1, h2, h3');
          for (const heading of headings) {
            const contrast = await heading.evaluate(el => {
              const computed = window.getComputedStyle(el);
              const bg = window.getComputedStyle(el.parentElement!).backgroundColor;
              return {
                color: computed.color,
                background: bg,
                fontSize: parseFloat(computed.fontSize)
              };
            });

            // Basic contrast check (simplified)
            if (contrast.color.includes('rgb(') && contrast.background.includes('rgb(')) {
              const colorMatch = contrast.color.match(/\\d+/g);
              const bgMatch = contrast.background.match(/\\d+/g);

              if (colorMatch && bgMatch) {
                const colorLum = (parseInt(colorMatch[0]) + parseInt(colorMatch[1]) + parseInt(colorMatch[2])) / 3;
                const bgLum = (parseInt(bgMatch[0]) + parseInt(bgMatch[1]) + parseInt(bgMatch[2])) / 3;
                const ratio = Math.abs(colorLum - bgLum);

                if (ratio < 100) { // Very simplified contrast check
                  issues.push({
                    page: route.path,
                    viewport: viewport.name,
                    type: 'contrast',
                    selector: 'heading',
                    description: `Potential low contrast: ${contrast.color} on ${contrast.background}`,
                    severity: 'major',
                    value: ratio
                  });
                }
              }
            }
          }

          // Check for overlapping elements
          const allElements = await page.$$('button, a, input, select, textarea');
          const bounds: any[] = [];

          for (const element of allElements) {
            const box = await element.boundingBox();
            if (box && box.width > 0 && box.height > 0) {
              bounds.push({ element, box });
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
                issues.push({
                  page: route.path,
                  viewport: viewport.name,
                  type: 'overlap',
                  description: `Interactive elements overlap by ${overlapX}x${overlapY}px`,
                  severity: 'critical'
                });
                break; // Only report first overlap per page
              }
            }
          }

          // Take screenshot
          await page.screenshot({
            path: path.join('tests/ui-ux-inspection/screenshots', `${route.name.replace(/\\s+/g, '-')}-${viewport.name}.png`),
            fullPage: false
          });

        } catch (error) {
          console.error(`Error inspecting ${route.name}:`, error);
          issues.push({
            page: route.path,
            viewport: viewport.name,
            type: 'error',
            description: error.toString(),
            severity: 'critical'
          });
        }
      }
    }

    // Generate quick report
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      majorIssues: issues.filter(i => i.severity === 'major').length,
      minorIssues: issues.filter(i => i.severity === 'minor').length,
      byType: {
        padding: issues.filter(i => i.type === 'padding').length,
        contrast: issues.filter(i => i.type === 'contrast').length,
        overlap: issues.filter(i => i.type === 'overlap').length,
        error: issues.filter(i => i.type === 'error').length,
      },
      issues: issues
    };

    // Save report
    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'quick-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\\n=== Quick Inspection Summary ===');
    console.log(`Total Issues: ${report.totalIssues}`);
    console.log(`- Critical: ${report.criticalIssues}`);
    console.log(`- Major: ${report.majorIssues}`);
    console.log(`- Minor: ${report.minorIssues}`);
    console.log('\\nBy Type:');
    console.log(`- Padding: ${report.byType.padding}`);
    console.log(`- Contrast: ${report.byType.contrast}`);
    console.log(`- Overlap: ${report.byType.overlap}`);
    console.log(`- Errors: ${report.byType.error}`);
  });
});