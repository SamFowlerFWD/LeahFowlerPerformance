import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Test configuration
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'desktop-xl', width: 1440, height: 900 }
];

const adminPages = [
  { name: 'login', path: '/admin/login', requiresAuth: false },
  { name: 'dashboard', path: '/admin/dashboard', requiresAuth: true },
  { name: 'assessments', path: '/admin/assessments', requiresAuth: true },
  { name: 'blog', path: '/admin/blog', requiresAuth: true, optional: true },
  { name: 'blog-new', path: '/admin/blog/new', requiresAuth: true, optional: true }
];

// Brand colors to verify
const brandColors = {
  navy: 'rgb(1, 14, 30)', // #010e1e
  gold: 'rgb(188, 151, 75)', // #bc974b
  sage: 'rgb(165, 179, 162)', // #a5b3a2
  white: 'rgb(255, 255, 255)',
  greyLight: 'rgb(245, 245, 245)'
};

// Helper function to login
async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3004/admin/login');
  await page.fill('input[type="email"]', 'admin@leahfowlerperformance.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
}

// Helper to check element colors
async function checkElementColors(page: Page, selector: string): Promise<{
  backgroundColor: string;
  color: string;
  borderColor: string;
}> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return { backgroundColor: '', color: '', borderColor: '' };
    const styles = window.getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      borderColor: styles.borderColor
    };
  }, selector);
}

// Helper to check touch target size
async function checkTouchTargetSize(page: Page, selector: string): Promise<{
  width: number;
  height: number;
  meetsMinimum: boolean;
}> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return { width: 0, height: 0, meetsMinimum: false };
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      meetsMinimum: rect.width >= 44 && rect.height >= 44
    };
  }, selector);
}

// Helper to check for horizontal scroll
async function hasHorizontalScroll(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

// Test suite
test.describe('Admin Panel Comprehensive Test', () => {
  let testResults: any = {
    brandConsistency: [],
    mobileResponsiveness: [],
    adminLayoutUsage: [],
    specificIssues: [],
    scores: {
      brandConsistency: 0,
      mobileResponsiveness: 0,
      userExperience: 0
    }
  };

  test.beforeAll(async () => {
    // Create screenshots directory
    const screenshotsDir = path.join(process.cwd(), 'tests', 'admin-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('1. Test Admin Login Page', async ({ page }) => {
    console.log('🔐 Testing Admin Login Page...');

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/admin/login');

      // Take screenshot
      await page.screenshot({
        path: `tests/admin-screenshots/login-${viewport.name}.png`,
        fullPage: true
      });

      // Check brand colors
      const formColors = await checkElementColors(page, 'form');
      const buttonColors = await checkElementColors(page, 'button[type="submit"]');

      // Check for horizontal scroll
      const hasScroll = await hasHorizontalScroll(page);

      // Check touch targets on mobile
      if (viewport.width <= 768) {
        const buttonSize = await checkTouchTargetSize(page, 'button[type="submit"]');
        const inputSize = await checkTouchTargetSize(page, 'input[type="email"]');

        testResults.mobileResponsiveness.push({
          page: 'login',
          viewport: viewport.name,
          touchTargets: {
            button: buttonSize,
            input: inputSize
          },
          horizontalScroll: hasScroll
        });
      }

      // Check for brand elements
      const hasLogo = await page.locator('img[alt*="Leah Fowler"]').count() > 0;
      const hasBackdropBlur = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const styles = window.getComputedStyle(el);
          return styles.backdropFilter && styles.backdropFilter !== 'none';
        });
      });

      testResults.brandConsistency.push({
        page: 'login',
        viewport: viewport.name,
        hasLogo,
        hasBackdropBlur,
        colors: {
          form: formColors,
          button: buttonColors
        }
      });
    }
  });

  test('2. Test Admin Dashboard', async ({ page }) => {
    console.log('📊 Testing Admin Dashboard...');

    // Login first
    await loginAsAdmin(page);

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/admin/dashboard');
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `tests/admin-screenshots/dashboard-${viewport.name}.png`,
        fullPage: true
      });

      // Check for AdminHeader
      const hasAdminHeader = await page.locator('[data-testid="admin-header"], header').count() > 0;

      // Check for stat cards with brand colors
      const statCards = await page.locator('[class*="stat"], [class*="card"]').all();
      const cardColors = [];

      for (const card of statCards) {
        const colors = await card.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor
          };
        });
        cardColors.push(colors);
      }

      // Check mobile menu on small viewports
      if (viewport.width <= 768) {
        const hasMobileMenu = await page.locator('[aria-label*="menu"], button[class*="menu"]').count() > 0;
        const hasSheet = await page.locator('[role="dialog"], [class*="sheet"]').count() > 0;

        testResults.adminLayoutUsage.push({
          page: 'dashboard',
          viewport: viewport.name,
          hasAdminHeader,
          hasMobileMenu,
          hasSheet
        });

        // Test mobile menu interaction
        const menuButton = await page.locator('[aria-label*="menu"], button[class*="menu"]').first();
        if (await menuButton.isVisible()) {
          const menuSize = await checkTouchTargetSize(page, '[aria-label*="menu"], button[class*="menu"]');
          testResults.mobileResponsiveness.push({
            page: 'dashboard',
            viewport: viewport.name,
            menuTouchTarget: menuSize
          });
        }
      }

      // Check for horizontal scroll
      const hasScroll = await hasHorizontalScroll(page);

      testResults.specificIssues.push({
        page: 'dashboard',
        viewport: viewport.name,
        hasAdminHeader,
        statCardColors: cardColors,
        horizontalScroll: hasScroll
      });
    }
  });

  test('3. Test Admin Assessments Page', async ({ page }) => {
    console.log('📋 Testing Admin Assessments Page...');

    // Login first
    await loginAsAdmin(page);

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3004/admin/assessments');
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `tests/admin-screenshots/assessments-${viewport.name}.png`,
        fullPage: true
      });

      // Check for tables
      const hasTables = await page.locator('table').count() > 0;

      // On mobile, check if tables convert to cards
      if (viewport.width <= 768) {
        const tableDisplay = await page.evaluate(() => {
          const table = document.querySelector('table');
          if (!table) return 'no-table';
          const styles = window.getComputedStyle(table);
          return styles.display;
        });

        const hasCards = await page.locator('[class*="card"]').count() > 0;

        testResults.mobileResponsiveness.push({
          page: 'assessments',
          viewport: viewport.name,
          tableDisplay,
          hasCards,
          tableResponsive: tableDisplay === 'none' || tableDisplay === 'block' || hasCards
        });
      }

      // Check for horizontal scroll
      const hasScroll = await hasHorizontalScroll(page);

      // Check button colors
      const buttons = await page.locator('button').all();
      const buttonColors = [];

      for (const button of buttons.slice(0, 3)) { // Check first 3 buttons
        const colors = await button.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });
        buttonColors.push(colors);
      }

      testResults.specificIssues.push({
        page: 'assessments',
        viewport: viewport.name,
        hasTables,
        horizontalScroll: hasScroll,
        buttonColors
      });
    }
  });

  test('4. Test Blog Pages (if exists)', async ({ page }) => {
    console.log('📝 Testing Blog Pages...');

    // Login first
    await loginAsAdmin(page);

    // Check if blog pages exist
    const blogPages = ['/admin/blog', '/admin/blog/new'];

    for (const blogPath of blogPages) {
      try {
        await page.goto(`http://localhost:3004${blogPath}`, { waitUntil: 'domcontentloaded', timeout: 5000 });

        const pageExists = page.url().includes(blogPath) && !page.url().includes('404');

        if (pageExists) {
          for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });

            // Take screenshot
            await page.screenshot({
              path: `tests/admin-screenshots/blog-${blogPath.replace('/admin/', '').replace('/', '-')}-${viewport.name}.png`,
              fullPage: true
            });

            // Check for AdminHeader
            const hasAdminHeader = await page.locator('[data-testid="admin-header"], header').count() > 0;

            testResults.adminLayoutUsage.push({
              page: blogPath,
              viewport: viewport.name,
              hasAdminHeader,
              exists: true
            });
          }
        } else {
          testResults.adminLayoutUsage.push({
            page: blogPath,
            exists: false
          });
        }
      } catch (error) {
        testResults.adminLayoutUsage.push({
          page: blogPath,
          exists: false,
          error: error.message
        });
      }
    }
  });

  test('5. Test Logout Functionality', async ({ page }) => {
    console.log('🚪 Testing Logout Functionality...');

    // Login first
    await loginAsAdmin(page);

    // Find and click logout button
    const logoutButton = await page.locator('button:has-text("Logout"), a:has-text("Logout")').first();

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL('**/admin/login', { timeout: 5000 });

      testResults.specificIssues.push({
        feature: 'logout',
        working: true,
        redirectsToLogin: page.url().includes('/admin/login')
      });
    } else {
      testResults.specificIssues.push({
        feature: 'logout',
        working: false,
        error: 'Logout button not found'
      });
    }
  });

  test('6. Generate Comprehensive Report', async ({ page }) => {
    console.log('📊 Generating Comprehensive Report...');

    // Calculate scores
    const brandConsistencyScore = calculateBrandScore(testResults.brandConsistency);
    const mobileResponsivenessScore = calculateMobileScore(testResults.mobileResponsiveness);
    const userExperienceScore = calculateUXScore(testResults);

    testResults.scores = {
      brandConsistency: brandConsistencyScore,
      mobileResponsiveness: mobileResponsivenessScore,
      userExperience: userExperienceScore
    };

    // Generate markdown report
    const report = generateMarkdownReport(testResults);

    // Save report
    fs.writeFileSync(
      path.join(process.cwd(), 'tests', 'admin-panel-test-report.md'),
      report
    );

    // Also save JSON results
    fs.writeFileSync(
      path.join(process.cwd(), 'tests', 'admin-panel-test-results.json'),
      JSON.stringify(testResults, null, 2)
    );

    console.log('\n✅ Test Complete! Report saved to tests/admin-panel-test-report.md');
    console.log(`\n📊 SCORES:`);
    console.log(`   Brand Consistency: ${brandConsistencyScore}/10`);
    console.log(`   Mobile Responsiveness: ${mobileResponsivenessScore}/10`);
    console.log(`   User Experience: ${userExperienceScore}/10`);
  });
});

// Score calculation functions
function calculateBrandScore(brandData: any[]): number {
  let score = 10;
  const issues = [];

  brandData.forEach(item => {
    if (!item.hasLogo) {
      score -= 0.5;
      issues.push('Missing logo');
    }
    if (!item.hasBackdropBlur) {
      score -= 0.3;
      issues.push('Missing backdrop blur effects');
    }
    // Check for brand colors in buttons/forms
    if (item.colors?.button?.backgroundColor) {
      const bgColor = item.colors.button.backgroundColor;
      if (!bgColor.includes('188') && !bgColor.includes('151') && !bgColor.includes('75')) {
        score -= 0.2; // Not using gold color
      }
    }
  });

  return Math.max(0, Math.min(10, score));
}

function calculateMobileScore(mobileData: any[]): number {
  let score = 10;

  mobileData.forEach(item => {
    // Check touch targets
    if (item.touchTargets) {
      Object.values(item.touchTargets).forEach((target: any) => {
        if (!target.meetsMinimum) {
          score -= 0.5;
        }
      });
    }

    // Check for horizontal scroll
    if (item.horizontalScroll) {
      score -= 1;
    }

    // Check table responsiveness
    if (item.tableResponsive === false) {
      score -= 1;
    }
  });

  return Math.max(0, Math.min(10, score));
}

function calculateUXScore(testResults: any): number {
  let score = 10;

  // Check for admin header presence
  const headerIssues = testResults.adminLayoutUsage.filter(item => !item.hasAdminHeader);
  score -= headerIssues.length * 0.5;

  // Check for logout functionality
  const logoutIssue = testResults.specificIssues.find(item => item.feature === 'logout');
  if (logoutIssue && !logoutIssue.working) {
    score -= 1;
  }

  // Check for horizontal scroll issues
  const scrollIssues = testResults.specificIssues.filter(item => item.horizontalScroll);
  score -= scrollIssues.length * 0.3;

  return Math.max(0, Math.min(10, score));
}

function generateMarkdownReport(results: any): string {
  const timestamp = new Date().toISOString();

  return `# Admin Panel Comprehensive Test Report
Generated: ${timestamp}

## 📊 Overall Scores

| Category | Score | Status |
|----------|-------|--------|
| Brand Consistency | ${results.scores.brandConsistency}/10 | ${getStatusEmoji(results.scores.brandConsistency)} |
| Mobile Responsiveness | ${results.scores.mobileResponsiveness}/10 | ${getStatusEmoji(results.scores.mobileResponsiveness)} |
| User Experience | ${results.scores.userExperience}/10 | ${getStatusEmoji(results.scores.userExperience)} |

## 🎨 Brand Consistency Issues

${formatBrandIssues(results.brandConsistency)}

## 📱 Mobile Responsiveness Issues

${formatMobileIssues(results.mobileResponsiveness)}

## 🏗️ Admin Layout Usage

${formatLayoutIssues(results.adminLayoutUsage)}

## 🔍 Specific Issues Found

${formatSpecificIssues(results.specificIssues)}

## 📸 Screenshots

Screenshots have been saved to \`tests/admin-screenshots/\` directory:

- Login page (4 viewports)
- Dashboard (4 viewports)
- Assessments page (4 viewports)
- Blog pages (if available)

## 🔧 Recommended Fixes

${generateRecommendations(results)}

## ✅ What's Working Well

${generatePositives(results)}
`;
}

function getStatusEmoji(score: number): string {
  if (score >= 8) return '✅ Excellent';
  if (score >= 6) return '⚠️ Needs Improvement';
  return '❌ Critical Issues';
}

function formatBrandIssues(brandData: any[]): string {
  const issues = [];

  brandData.forEach(item => {
    if (!item.hasLogo) {
      issues.push(`- **${item.page}** (${item.viewport}): Missing brand logo`);
    }
    if (!item.hasBackdropBlur) {
      issues.push(`- **${item.page}** (${item.viewport}): Missing backdrop blur effects`);
    }
  });

  return issues.length > 0 ? issues.join('\n') : '✅ No brand consistency issues found';
}

function formatMobileIssues(mobileData: any[]): string {
  const issues = [];

  mobileData.forEach(item => {
    if (item.touchTargets) {
      Object.entries(item.touchTargets).forEach(([key, target]: [string, any]) => {
        if (!target.meetsMinimum) {
          issues.push(`- **${item.page}** (${item.viewport}): ${key} touch target too small (${target.width}x${target.height}px, minimum 44x44px)`);
        }
      });
    }

    if (item.horizontalScroll) {
      issues.push(`- **${item.page}** (${item.viewport}): Has horizontal scroll`);
    }

    if (item.tableResponsive === false) {
      issues.push(`- **${item.page}** (${item.viewport}): Table not responsive`);
    }
  });

  return issues.length > 0 ? issues.join('\n') : '✅ No mobile responsiveness issues found';
}

function formatLayoutIssues(layoutData: any[]): string {
  const issues = [];

  layoutData.forEach(item => {
    if (item.exists === false) {
      issues.push(`- **${item.page}**: Page does not exist`);
    } else if (!item.hasAdminHeader) {
      issues.push(`- **${item.page}** (${item.viewport}): Missing AdminHeader component`);
    }
  });

  return issues.length > 0 ? issues.join('\n') : '✅ AdminLayout properly implemented across all pages';
}

function formatSpecificIssues(specificData: any[]): string {
  const issues = [];

  specificData.forEach(item => {
    if (item.horizontalScroll) {
      issues.push(`- **${item.page}** (${item.viewport}): Horizontal scroll detected`);
    }
    if (item.feature === 'logout' && !item.working) {
      issues.push(`- **Logout functionality**: ${item.error || 'Not working'}`);
    }
    if (!item.hasAdminHeader) {
      issues.push(`- **${item.page}** (${item.viewport}): Missing admin header`);
    }
  });

  return issues.length > 0 ? issues.join('\n') : '✅ No specific issues found';
}

function generateRecommendations(results: any): string {
  const recommendations = [];

  if (results.scores.brandConsistency < 8) {
    recommendations.push('1. **Brand Colors**: Ensure all buttons use the gold (#bc974b) color scheme');
    recommendations.push('2. **Backdrop Blur**: Add backdrop-filter effects to cards and modals');
    recommendations.push('3. **Typography**: Use consistent font weights and sizes');
  }

  if (results.scores.mobileResponsiveness < 8) {
    recommendations.push('1. **Touch Targets**: Increase button and link sizes to minimum 44x44px');
    recommendations.push('2. **Table Responsiveness**: Convert tables to cards on mobile viewports');
    recommendations.push('3. **Horizontal Scroll**: Fix container widths to prevent overflow');
  }

  if (results.scores.userExperience < 8) {
    recommendations.push('1. **AdminHeader**: Ensure consistent header across all admin pages');
    recommendations.push('2. **Navigation**: Improve mobile menu accessibility');
    recommendations.push('3. **Logout**: Ensure logout button is visible and functional');
  }

  return recommendations.join('\n') || '✅ No critical recommendations';
}

function generatePositives(results: any): string {
  const positives = [];

  if (results.scores.brandConsistency >= 7) {
    positives.push('- Brand consistency is generally good');
  }

  if (results.scores.mobileResponsiveness >= 7) {
    positives.push('- Mobile responsiveness is well implemented');
  }

  if (results.scores.userExperience >= 7) {
    positives.push('- User experience is smooth and intuitive');
  }

  const hasLogout = results.specificIssues.find(item => item.feature === 'logout' && item.working);
  if (hasLogout) {
    positives.push('- Logout functionality working correctly');
  }

  return positives.join('\n') || 'Several areas need improvement';
}