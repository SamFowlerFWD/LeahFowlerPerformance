import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Direct UI/UX Inspection', () => {
  test('Inspect home page for UI issues', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    const issues: any[] = [];

    try {
      console.log('Navigating to home page...');
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(2000);

      console.log('Page loaded, analyzing...');

      // 1. Check for padding issues
      const elements = await page.$$('button, [class*="btn"], [class*="card"], section');
      console.log(`Found ${elements.length} elements to check`);

      for (let i = 0; i < Math.min(elements.length, 10); i++) {
        const element = elements[i];
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const className = await element.evaluate(el => el.className);

        const padding = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            top: styles.paddingTop,
            right: styles.paddingRight,
            bottom: styles.paddingBottom,
            left: styles.paddingLeft,
          };
        });

        console.log(`  ${tagName}.${className}: ${JSON.stringify(padding)}`);

        // Check for asymmetric padding
        const topNum = parseFloat(padding.top);
        const rightNum = parseFloat(padding.right);
        const bottomNum = parseFloat(padding.bottom);
        const leftNum = parseFloat(padding.left);

        if (Math.abs(leftNum - rightNum) > 5) {
          issues.push({
            type: 'padding',
            element: `${tagName}.${className}`,
            issue: `Asymmetric horizontal padding: ${padding.left} left vs ${padding.right} right`,
            severity: 'minor'
          });
        }

        if (Math.abs(topNum - bottomNum) > 5) {
          issues.push({
            type: 'padding',
            element: `${tagName}.${className}`,
            issue: `Asymmetric vertical padding: ${padding.top} top vs ${padding.bottom} bottom`,
            severity: 'minor'
          });
        }
      }

      // 2. Check text contrast
      const textElements = await page.$$('h1, h2, h3, p, a, button');
      console.log(`Checking contrast on ${textElements.length} text elements`);

      for (let i = 0; i < Math.min(textElements.length, 10); i++) {
        const element = textElements[i];
        const contrast = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          let bg = styles.backgroundColor;

          // Try to find actual background
          let parent = el.parentElement;
          while (parent && (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)')) {
            bg = window.getComputedStyle(parent).backgroundColor;
            parent = parent.parentElement;
          }

          return {
            color: styles.color,
            background: bg,
            text: el.textContent?.substring(0, 50)
          };
        });

        // Simple contrast check
        if (contrast.color && contrast.background &&
            contrast.color !== 'rgba(0, 0, 0, 0)' &&
            contrast.background !== 'rgba(0, 0, 0, 0)') {

          console.log(`  Text: "${contrast.text}" - ${contrast.color} on ${contrast.background}`);

          // Parse RGB values
          const colorMatch = contrast.color.match(/\\d+/g);
          const bgMatch = contrast.background.match(/\\d+/g);

          if (colorMatch && bgMatch) {
            const colorBrightness = (parseInt(colorMatch[0]) * 299 +
                                   parseInt(colorMatch[1]) * 587 +
                                   parseInt(colorMatch[2]) * 114) / 1000;
            const bgBrightness = (parseInt(bgMatch[0]) * 299 +
                                parseInt(bgMatch[1]) * 587 +
                                parseInt(bgMatch[2]) * 114) / 1000;

            const difference = Math.abs(colorBrightness - bgBrightness);

            if (difference < 125) {
              issues.push({
                type: 'contrast',
                element: contrast.text,
                issue: `Low contrast: ${contrast.color} on ${contrast.background} (difference: ${difference.toFixed(0)})`,
                severity: difference < 50 ? 'critical' : 'major'
              });
            }
          }
        }
      }

      // 3. Check for overlapping interactive elements
      const interactive = await page.$$('button, a, input, select, textarea');
      const bounds: any[] = [];

      for (const elem of interactive) {
        const box = await elem.boundingBox();
        if (box) {
          bounds.push(box);
        }
      }

      for (let i = 0; i < bounds.length; i++) {
        for (let j = i + 1; j < bounds.length; j++) {
          const box1 = bounds[i];
          const box2 = bounds[j];

          const overlapX = Math.max(0, Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x));
          const overlapY = Math.max(0, Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y));

          if (overlapX > 10 && overlapY > 10) {
            issues.push({
              type: 'overlap',
              element: `Element ${i} and ${j}`,
              issue: `Interactive elements overlap by ${overlapX.toFixed(0)}x${overlapY.toFixed(0)}px`,
              severity: 'critical'
            });
          }
        }
      }

      // Take screenshot
      await page.screenshot({
        path: path.join('tests/ui-ux-inspection/screenshots', 'home-inspection.png'),
        fullPage: true
      });

    } catch (error) {
      console.error('Error during inspection:', error);
      issues.push({
        type: 'error',
        element: 'page',
        issue: error.toString(),
        severity: 'critical'
      });
    }

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      page: 'Home',
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      majorIssues: issues.filter(i => i.severity === 'major').length,
      minorIssues: issues.filter(i => i.severity === 'minor').length,
      issues: issues
    };

    fs.writeFileSync(
      path.join('tests/ui-ux-inspection', 'direct-inspection-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\\n=== Inspection Complete ===');
    console.log(`Total Issues: ${report.totalIssues}`);
    console.log(`- Critical: ${report.criticalIssues}`);
    console.log(`- Major: ${report.majorIssues}`);
    console.log(`- Minor: ${report.minorIssues}`);

    if (issues.length > 0) {
      console.log('\\nIssues Found:');
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.issue}`);
      });
    }

    await context.close();
  });
});