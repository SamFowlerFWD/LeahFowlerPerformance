import { chromium } from 'playwright';
import * as fs from 'fs';

async function directAnalysis() {
  const browser = await chromium.launch({ headless: false });

  console.log('\n=== DIRECT UI/UX ANALYSIS - LEAH FOWLER PERFORMANCE ===\n');

  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 812 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 }
  ];

  const allIssues: any[] = [];

  for (const viewport of viewports) {
    console.log(`\nAnalysing at ${viewport.name}...`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });

    const page = await context.newPage();

    try {
      // Navigate to homepage
      await page.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(2000);

      // 1. CHECK PADDING CONSISTENCY
      console.log('  Checking padding consistency...');
      const paddingIssues = await page.evaluate(() => {
        const issues: any[] = [];

        // Check buttons
        const buttons = document.querySelectorAll('button, a[role="button"], .btn');
        const buttonPaddings = new Map<string, number[]>();

        buttons.forEach((btn) => {
          const styles = window.getComputedStyle(btn);
          const padding = {
            top: parseFloat(styles.paddingTop),
            right: parseFloat(styles.paddingRight),
            bottom: parseFloat(styles.paddingBottom),
            left: parseFloat(styles.paddingLeft)
          };

          const key = btn.className || 'button';
          if (!buttonPaddings.has(key)) buttonPaddings.set(key, []);
          buttonPaddings.get(key)!.push(padding.top, padding.right, padding.bottom, padding.left);
        });

        // Check for inconsistencies
        buttonPaddings.forEach((values, key) => {
          const unique = [...new Set(values)];
          if (unique.length > 2) {
            issues.push({
              type: 'padding-inconsistency',
              element: key,
              values: unique,
              message: `Button padding varies: ${unique.join(', ')}px`
            });
          }
        });

        return issues;
      });

      if (paddingIssues.length > 0) {
        console.log(`    ⚠️  Found ${paddingIssues.length} padding issues`);
        paddingIssues.forEach(i => console.log(`      - ${i.message}`));
        allIssues.push(...paddingIssues.map(i => ({ ...i, viewport: viewport.name })));
      }

      // 2. CHECK ALIGNMENT
      console.log('  Checking alignment...');
      const alignmentIssues = await page.evaluate(() => {
        const issues: any[] = [];

        // Check grid/flex containers
        const containers = document.querySelectorAll('[class*="grid"], [class*="flex"]');

        containers.forEach((container) => {
          const children = Array.from(container.children);
          if (children.length < 2) return;

          const positions = children.map(child => {
            const rect = child.getBoundingClientRect();
            return { left: rect.left, top: rect.top };
          });

          // Check if items that should align don't
          const leftPositions = positions.map(p => p.left);
          const uniqueLefts = [...new Set(leftPositions.map(l => Math.round(l)))];

          if (uniqueLefts.length > 1 && uniqueLefts.length < positions.length) {
            const diff = Math.max(...uniqueLefts) - Math.min(...uniqueLefts);
            if (diff > 2 && diff < 20) {
              issues.push({
                type: 'alignment',
                element: container.className,
                deviation: diff,
                message: `Children misaligned by ${diff}px`
              });
            }
          }
        });

        return issues;
      });

      if (alignmentIssues.length > 0) {
        console.log(`    ⚠️  Found ${alignmentIssues.length} alignment issues`);
        alignmentIssues.forEach(i => console.log(`      - ${i.message}`));
        allIssues.push(...alignmentIssues.map(i => ({ ...i, viewport: viewport.name })));
      }

      // 3. CHECK OVERLAPS
      console.log('  Checking for overlapping elements...');
      const overlapIssues = await page.evaluate(() => {
        const issues: any[] = [];
        const elements = Array.from(document.querySelectorAll('*')).filter(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 &&
                 styles.display !== 'none' &&
                 styles.visibility !== 'hidden';
        });

        for (let i = 0; i < elements.length; i++) {
          for (let j = i + 1; j < elements.length; j++) {
            const rect1 = elements[i].getBoundingClientRect();
            const rect2 = elements[j].getBoundingClientRect();

            // Check if parent-child
            if (elements[i].contains(elements[j]) || elements[j].contains(elements[i])) continue;

            // Check overlap
            const overlap = !(rect1.right < rect2.left ||
                            rect2.right < rect1.left ||
                            rect1.bottom < rect2.top ||
                            rect2.bottom < rect1.top);

            if (overlap) {
              const isInteractive1 = elements[i].tagName === 'BUTTON' || elements[i].tagName === 'A' || elements[i].tagName === 'INPUT';
              const isInteractive2 = elements[j].tagName === 'BUTTON' || elements[j].tagName === 'A' || elements[j].tagName === 'INPUT';

              if (isInteractive1 || isInteractive2) {
                issues.push({
                  type: 'overlap',
                  element1: elements[i].tagName + (elements[i].className ? '.' + elements[i].className.split(' ')[0] : ''),
                  element2: elements[j].tagName + (elements[j].className ? '.' + elements[j].className.split(' ')[0] : ''),
                  message: 'Interactive elements overlap'
                });
                break; // Only report once per element
              }
            }
          }
        }

        return issues.slice(0, 5); // Limit to first 5 overlaps
      });

      if (overlapIssues.length > 0) {
        console.log(`    ⚠️  Found ${overlapIssues.length} overlap issues`);
        overlapIssues.forEach(i => console.log(`      - ${i.element1} overlaps ${i.element2}`));
        allIssues.push(...overlapIssues.map(i => ({ ...i, viewport: viewport.name })));
      }

      // 4. CHECK CONTRAST
      console.log('  Checking colour contrast (WCAG AA)...');
      const contrastIssues = await page.evaluate(() => {
        const issues: any[] = [];

        function getContrast(rgb1: string, rgb2: string): number {
          const parseRgb = (rgb: string) => {
            const match = rgb.match(/\d+/g);
            if (!match) return { r: 0, g: 0, b: 0 };
            return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
          };

          const getLuminance = (rgb: { r: number, g: number, b: number }) => {
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
              val = val / 255;
              return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };

          const c1 = parseRgb(rgb1);
          const c2 = parseRgb(rgb2);
          const l1 = getLuminance(c1);
          const l2 = getLuminance(c2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);

          return (lighter + 0.05) / (darker + 0.05);
        }

        // Check text elements
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');

        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;

          // Get background colour
          let bgColor = styles.backgroundColor;
          let parent = el.parentElement;
          while (parent && (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)')) {
            bgColor = window.getComputedStyle(parent).backgroundColor;
            parent = parent.parentElement;
          }
          if (!bgColor || bgColor === 'transparent') bgColor = 'rgb(255, 255, 255)';

          const contrast = getContrast(color, bgColor);
          const fontSize = parseFloat(styles.fontSize);
          const isLarge = fontSize >= 18 || (fontSize >= 14 && parseInt(styles.fontWeight) >= 700);
          const required = isLarge ? 3.0 : 4.5;

          if (contrast < required) {
            issues.push({
              type: 'contrast',
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              ratio: contrast.toFixed(2),
              required: required,
              message: `Contrast ${contrast.toFixed(2)} < ${required} required`
            });
          }
        });

        return issues.slice(0, 10); // Limit to first 10 issues
      });

      if (contrastIssues.length > 0) {
        console.log(`    ❌ Found ${contrastIssues.length} contrast violations`);
        contrastIssues.forEach(i => console.log(`      - ${i.element}: ${i.message}`));
        allIssues.push(...contrastIssues.map(i => ({ ...i, viewport: viewport.name, severity: 'critical' })));
      }

      // 5. CHECK HORIZONTAL SCROLL
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        console.log('    ❌ Page has horizontal scroll');
        allIssues.push({
          type: 'horizontal-scroll',
          viewport: viewport.name,
          severity: 'major',
          message: 'Page has horizontal scroll'
        });
      }

      // 6. CHECK TOUCH TARGETS (mobile only)
      if (viewport.width <= 768) {
        console.log('  Checking touch target sizes...');
        const touchIssues = await page.evaluate(() => {
          const issues: any[] = [];
          const interactive = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');

          interactive.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
              issues.push({
                type: 'touch-target',
                element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (min 44x44)`
              });
            }
          });

          return issues;
        });

        if (touchIssues.length > 0) {
          console.log(`    ⚠️  Found ${touchIssues.length} touch target issues`);
          touchIssues.forEach(i => console.log(`      - ${i.element}: ${i.size}`));
          allIssues.push(...touchIssues.map(i => ({ ...i, viewport: viewport.name, severity: 'major' })));
        }
      }

      // Take screenshot
      await page.screenshot({
        path: `tests/ui-ux-inspection/screenshots/home-${viewport.width}.png`,
        fullPage: false
      });
      console.log(`  ✓ Screenshot saved: home-${viewport.width}.png`);

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }

    await context.close();
  }

  await browser.close();

  // Generate report
  console.log('\n\n=== FINAL REPORT ===\n');

  const criticalIssues = allIssues.filter(i => i.severity === 'critical');
  const majorIssues = allIssues.filter(i => i.severity === 'major');
  const minorIssues = allIssues.filter(i => !i.severity || i.severity === 'minor');

  console.log(`Total Issues Found: ${allIssues.length}`);
  console.log(`  - Critical: ${criticalIssues.length}`);
  console.log(`  - Major: ${majorIssues.length}`);
  console.log(`  - Minor: ${minorIssues.length}`);

  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Must Fix for WCAG AA Compliance):');
    criticalIssues.forEach(issue => {
      console.log(`  - [${issue.viewport}] ${issue.type}: ${issue.message || issue.element}`);
    });
  }

  if (majorIssues.length > 0) {
    console.log('\n⚠️  MAJOR ISSUES:');
    majorIssues.forEach(issue => {
      console.log(`  - [${issue.viewport}] ${issue.type}: ${issue.message || issue.element}`);
    });
  }

  console.log('\n📋 RECOMMENDATIONS:');
  console.log('  1. Fix all contrast issues to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)');
  console.log('  2. Ensure all touch targets are at least 44x44px on mobile devices');
  console.log('  3. Remove horizontal scroll on mobile viewports');
  console.log('  4. Standardise button and card padding across the site');
  console.log('  5. Fix alignment issues in grid/flex containers');
  console.log('  6. Review and fix any overlapping interactive elements');

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: allIssues.length,
      critical: criticalIssues.length,
      major: majorIssues.length,
      minor: minorIssues.length
    },
    issues: allIssues
  };

  fs.writeFileSync(
    'tests/ui-ux-inspection/reports/analysis-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n✅ Report saved to: tests/ui-ux-inspection/reports/analysis-report.json');
}

directAnalysis().catch(console.error);