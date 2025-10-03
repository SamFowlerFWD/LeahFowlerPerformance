import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

test.describe('Admin Panel Quick Assessment', () => {
  test.setTimeout(120000); // 2 minutes timeout

  test('Quick Admin Panel Assessment', async ({ page }) => {
    const results = {
      issues: [],
      positives: [],
      screenshots: []
    };

    // Create screenshots directory
    const screenshotsDir = path.join(process.cwd(), 'tests', 'admin-assessment');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    console.log('\n📋 Starting Admin Panel Assessment...\n');

    // Test 1: Login Page
    console.log('🔐 Testing Login Page...');
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/admin/login');

      // Screenshot
      const loginScreenshot = `tests/admin-assessment/login-${viewport.name}.png`;
      await page.screenshot({ path: loginScreenshot, fullPage: true });
      results.screenshots.push(loginScreenshot);

      // Check brand colors
      const loginButton = await page.locator('button[type="submit"]').first();
      if (await loginButton.isVisible()) {
        const buttonBg = await loginButton.evaluate(el => window.getComputedStyle(el).backgroundColor);

        if (!buttonBg.includes('188') && !buttonBg.includes('151')) { // Check for gold color
          results.issues.push({
            page: 'login',
            viewport: viewport.name,
            issue: 'Login button not using brand gold color',
            actual: buttonBg
          });
        } else {
          results.positives.push(`✅ Login page uses brand colors on ${viewport.name}`);
        }
      }

      // Check for logo
      const hasLogo = await page.locator('img[alt*="Leah"], h1:has-text("Leah Fowler")').count() > 0;
      if (!hasLogo) {
        results.issues.push({
          page: 'login',
          viewport: viewport.name,
          issue: 'Missing brand logo or title'
        });
      }

      // Check mobile touch targets
      if (viewport.width <= 768) {
        const buttonRect = await loginButton.boundingBox();
        if (buttonRect && (buttonRect.height < 44 || buttonRect.width < 44)) {
          results.issues.push({
            page: 'login',
            viewport: viewport.name,
            issue: `Touch target too small: ${buttonRect.width}x${buttonRect.height}px (min 44x44)`
          });
        }
      }

      // Check for horizontal scroll
      const hasScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (hasScroll) {
        results.issues.push({
          page: 'login',
          viewport: viewport.name,
          issue: 'Horizontal scroll detected'
        });
      }
    }

    // Login for protected pages
    console.log('🔑 Logging in...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3004/admin/login');

    // Try to login
    await page.fill('input[type="email"]', 'admin@leahfowlerperformance.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for navigation or error
    try {
      await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
      console.log('✅ Login successful');
    } catch (e) {
      console.log('⚠️ Login might have failed, continuing with assessment...');
      results.issues.push({
        page: 'login',
        issue: 'Login functionality might not be working'
      });
    }

    // Test 2: Dashboard
    console.log('📊 Testing Dashboard...');
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      try {
        await page.goto('http://localhost:3004/admin/dashboard', { waitUntil: 'domcontentloaded' });

        // Screenshot
        const dashboardScreenshot = `tests/admin-assessment/dashboard-${viewport.name}.png`;
        await page.screenshot({ path: dashboardScreenshot, fullPage: true });
        results.screenshots.push(dashboardScreenshot);

        // Check for Admin Header
        const hasHeader = await page.locator('header, [data-testid="admin-header"]').count() > 0;
        if (!hasHeader) {
          results.issues.push({
            page: 'dashboard',
            viewport: viewport.name,
            issue: 'Missing admin header'
          });
        } else {
          results.positives.push(`✅ Dashboard has admin header on ${viewport.name}`);
        }

        // Check stat cards for brand colors
        const statCards = await page.locator('[class*="stat"], [class*="card"]').all();
        if (statCards.length > 0) {
          const firstCard = statCards[0];
          const cardBg = await firstCard.evaluate(el => window.getComputedStyle(el).backgroundColor);

          if (cardBg.includes('255, 255, 255') || cardBg.includes('245, 245, 245')) {
            results.positives.push(`✅ Stat cards using appropriate background colors`);
          }
        }

        // Check mobile menu
        if (viewport.width <= 768) {
          const mobileMenu = await page.locator('button[aria-label*="menu"], button:has-text("☰")').first();
          if (await mobileMenu.isVisible()) {
            const menuRect = await mobileMenu.boundingBox();
            if (menuRect && (menuRect.height < 44 || menuRect.width < 44)) {
              results.issues.push({
                page: 'dashboard',
                viewport: viewport.name,
                issue: `Mobile menu touch target too small: ${menuRect.width}x${menuRect.height}px`
              });
            } else {
              results.positives.push(`✅ Mobile menu has proper touch target size on ${viewport.name}`);
            }
          }
        }

        // Check horizontal scroll
        const hasScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (hasScroll) {
          results.issues.push({
            page: 'dashboard',
            viewport: viewport.name,
            issue: 'Horizontal scroll detected'
          });
        }

      } catch (e) {
        results.issues.push({
          page: 'dashboard',
          viewport: viewport.name,
          issue: 'Could not access dashboard page'
        });
      }
    }

    // Test 3: Assessments Page
    console.log('📋 Testing Assessments Page...');
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      try {
        await page.goto('http://localhost:3004/admin/assessments', { waitUntil: 'domcontentloaded' });

        // Screenshot
        const assessmentsScreenshot = `tests/admin-assessment/assessments-${viewport.name}.png`;
        await page.screenshot({ path: assessmentsScreenshot, fullPage: true });
        results.screenshots.push(assessmentsScreenshot);

        // Check for tables on desktop
        if (viewport.width >= 1024) {
          const hasTable = await page.locator('table').count() > 0;
          if (hasTable) {
            results.positives.push(`✅ Assessments page has table on ${viewport.name}`);
          }
        }

        // Check table responsiveness on mobile
        if (viewport.width <= 768) {
          const table = await page.locator('table').first();
          if (await table.isVisible()) {
            const tableDisplay = await table.evaluate(el => window.getComputedStyle(el).display);

            // Check if table converts to cards or has responsive wrapper
            const hasCards = await page.locator('[class*="card"]').count() > 0;
            const hasResponsiveWrapper = await page.locator('[class*="overflow"]').count() > 0;

            if (!hasCards && !hasResponsiveWrapper && tableDisplay !== 'none') {
              results.issues.push({
                page: 'assessments',
                viewport: viewport.name,
                issue: 'Table not responsive on mobile (should convert to cards or have scroll wrapper)'
              });
            } else {
              results.positives.push(`✅ Table is responsive on ${viewport.name}`);
            }
          }
        }

        // Check horizontal scroll
        const hasScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (hasScroll) {
          results.issues.push({
            page: 'assessments',
            viewport: viewport.name,
            issue: 'Horizontal scroll detected'
          });
        }

      } catch (e) {
        results.issues.push({
          page: 'assessments',
          viewport: viewport.name,
          issue: 'Could not access assessments page'
        });
      }
    }

    // Test 4: Check logout functionality
    console.log('🚪 Testing Logout...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3004/admin/dashboard', { waitUntil: 'domcontentloaded' });

    const logoutButton = await page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(2000);

      if (page.url().includes('/admin/login')) {
        results.positives.push('✅ Logout functionality working correctly');
      } else {
        results.issues.push({
          page: 'dashboard',
          issue: 'Logout button does not redirect to login page'
        });
      }
    } else {
      results.issues.push({
        page: 'dashboard',
        issue: 'Logout button not found'
      });
    }

    // Generate scores
    const brandScore = 10 - (results.issues.filter(i =>
      i.issue?.includes('color') || i.issue?.includes('logo') || i.issue?.includes('brand')
    ).length * 0.5);

    const mobileScore = 10 - (results.issues.filter(i =>
      i.issue?.includes('mobile') || i.issue?.includes('touch') || i.issue?.includes('responsive') || i.issue?.includes('scroll')
    ).length * 0.5);

    const uxScore = 10 - (results.issues.filter(i =>
      i.issue?.includes('header') || i.issue?.includes('logout') || i.issue?.includes('access')
    ).length * 0.5);

    // Generate report
    const report = `# Admin Panel Assessment Report
Generated: ${new Date().toISOString()}

## 📊 Scores

| Category | Score | Status |
|----------|-------|--------|
| Brand Consistency | ${Math.max(0, brandScore).toFixed(1)}/10 | ${brandScore >= 8 ? '✅ Excellent' : brandScore >= 6 ? '⚠️ Needs Improvement' : '❌ Critical'} |
| Mobile Responsiveness | ${Math.max(0, mobileScore).toFixed(1)}/10 | ${mobileScore >= 8 ? '✅ Excellent' : mobileScore >= 6 ? '⚠️ Needs Improvement' : '❌ Critical'} |
| User Experience | ${Math.max(0, uxScore).toFixed(1)}/10 | ${uxScore >= 8 ? '✅ Excellent' : uxScore >= 6 ? '⚠️ Needs Improvement' : '❌ Critical'} |

## ❌ Issues Found (${results.issues.length})

${results.issues.map(issue => {
  if (issue.viewport) {
    return `- **${issue.page}** (${issue.viewport}): ${issue.issue}`;
  }
  return `- **${issue.page || 'General'}**: ${issue.issue}`;
}).join('\n')}

## ✅ Positives (${results.positives.length})

${results.positives.join('\n')}

## 📸 Screenshots Captured

${results.screenshots.map(s => `- ${s}`).join('\n')}

## 🔧 Priority Fixes

Based on the assessment, here are the priority fixes:

${generatePriorityFixes(results.issues)}

## 📝 Files to Check

Based on the issues found, check these files:

- \`/app/admin/login/page.tsx\` - Login page branding
- \`/app/admin/layout.tsx\` - Admin layout and header
- \`/app/admin/dashboard/page.tsx\` - Dashboard stat cards
- \`/app/admin/assessments/page.tsx\` - Table responsiveness
- \`/components/admin/AdminHeader.tsx\` - Header component
- \`/components/admin/AdminSidebar.tsx\` - Mobile menu
`;

    fs.writeFileSync(path.join(process.cwd(), 'tests', 'admin-assessment-report.md'), report);

    console.log('\n' + report);

    // Assert to complete test
    expect(results.screenshots.length).toBeGreaterThan(0);
  });
});

function generatePriorityFixes(issues: any[]): string {
  const priorities = [];

  // Group issues by type
  const brandIssues = issues.filter(i => i.issue?.includes('color') || i.issue?.includes('logo'));
  const mobileIssues = issues.filter(i => i.issue?.includes('touch') || i.issue?.includes('mobile') || i.issue?.includes('scroll'));
  const tableIssues = issues.filter(i => i.issue?.includes('table') || i.issue?.includes('responsive'));
  const headerIssues = issues.filter(i => i.issue?.includes('header'));

  if (brandIssues.length > 0) {
    priorities.push(`1. **Brand Colors**: Update buttons to use gold (#bc974b) and navy (#010e1e) colors`);
  }

  if (mobileIssues.length > 0) {
    priorities.push(`2. **Touch Targets**: Increase all interactive elements to minimum 44x44px on mobile`);
  }

  if (tableIssues.length > 0) {
    priorities.push(`3. **Table Responsiveness**: Add responsive wrapper or convert to cards on mobile`);
  }

  if (headerIssues.length > 0) {
    priorities.push(`4. **Admin Header**: Ensure consistent AdminHeader component across all pages`);
  }

  const scrollIssues = issues.filter(i => i.issue?.includes('scroll'));
  if (scrollIssues.length > 0) {
    priorities.push(`5. **Horizontal Scroll**: Fix container widths with 'overflow-x-hidden' or 'max-w-full'`);
  }

  return priorities.join('\n') || 'No critical fixes needed';
}