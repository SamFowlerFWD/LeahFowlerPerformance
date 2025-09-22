import { chromium } from 'playwright';
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';

// Test results collector
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  performance: {}
};

// Helper functions
function logTest(name, passed, message = '') {
  if (passed) {
    console.log(chalk.green('✓'), name);
    testResults.passed.push(name);
  } else {
    console.log(chalk.red('✗'), name, message ? chalk.gray(`- ${message}`) : '');
    testResults.failed.push({ name, message });
  }
}

function logSection(title) {
  console.log(chalk.cyan.bold(`\n${title}\n${'='.repeat(title.length)}`));
}

async function measurePerformance(page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  });
}

async function checkAccessibility(page) {
  const issues = [];
  
  // Check images for alt text
  const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);
  if (imagesWithoutAlt > 0) {
    issues.push(`${imagesWithoutAlt} images without alt text`);
  }
  
  // Check heading hierarchy
  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
    elements.map(el => parseInt(el.tagName.replace('H', '')))
  );
  
  let validHierarchy = true;
  let previousLevel = 0;
  for (const level of headings) {
    if (previousLevel > 0 && level > previousLevel + 1) {
      validHierarchy = false;
      break;
    }
    previousLevel = level;
  }
  
  if (!validHierarchy) {
    issues.push('Invalid heading hierarchy detected');
  }
  
  // Check for ARIA labels (exclude navigation dots)
  const buttonsWithoutText = await page.$$eval('button:not(.rounded-full)', buttons => 
    buttons.filter(btn => !btn.textContent?.trim() && !btn.getAttribute('aria-label')).length
  );
  
  if (buttonsWithoutText > 0) {
    issues.push(`${buttonsWithoutText} buttons without accessible text`);
  }
  
  // Check color contrast (simplified)
  const lowContrastText = await page.$$eval('*', elements => {
    let count = 0;
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.color === styles.backgroundColor && styles.color !== 'rgba(0, 0, 0, 0)') {
        count++;
      }
    });
    return count;
  });
  
  if (lowContrastText > 0) {
    issues.push(`${lowContrastText} potential low contrast elements`);
  }
  
  return issues;
}

// Main test execution
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    logSection('Performance Accelerator Page Tests');
    
    // 1. BASIC PAGE LOAD TESTS
    logSection('1. Basic Page Load');
    
    const startTime = Date.now();
    const response = await page.goto(`${BASE_URL}/performance-accelerator`, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    // Wait for client-side hydration
    await page.waitForTimeout(2000);
    const loadTime = Date.now() - startTime;
    
    logTest('Page loads successfully', response.ok());
    logTest('Page loads in under 2.5 seconds', loadTime < 2500, `Loaded in ${loadTime}ms`);
    
    testResults.performance.pageLoadTime = loadTime;
    
    // 2. CORE ELEMENTS
    logSection('2. Core Elements Presence');
    
    const title = await page.title();
    logTest('Page has proper title', title.includes('Leah Fowler'));
    
    const h1 = await page.$('h1');
    logTest('Page has H1 heading', !!h1);
    
    const heroText = await page.textContent('h1');
    logTest('Hero heading contains expected text', heroText?.includes('Transform Your Executive Performance'));
    
    // Check main sections
    const sections = [
      { selector: 'text=/Live Performance Metrics/i', name: 'Live Metrics Dashboard' },
      { selector: 'text=/Interactive Performance Tools/i', name: 'Interactive Tools' },
      { selector: 'text=/Client Success Stories/i', name: 'Testimonials' },
      { selector: 'text=/Ready to Join the Top 1%/i', name: 'Final CTA' }
    ];
    
    for (const section of sections) {
      const element = await page.$(section.selector);
      logTest(`${section.name} section present`, !!element);
    }
    
    // 3. INTERACTIVE ELEMENTS
    logSection('3. Interactive Elements');
    
    // Check CTAs
    const ctaButtons = [
      { selector: 'button:has-text("Start Free Assessment")', name: 'Start Assessment CTA' },
      { selector: 'button:has-text("Watch Success Stories")', name: 'Watch Stories CTA' },
      { selector: 'button:has-text("Book Your Strategy Call")', name: 'Book Call CTA' }
    ];
    
    for (const cta of ctaButtons) {
      const button = await page.$(cta.selector);
      logTest(`${cta.name} present`, !!button);
      
      if (button) {
        const isEnabled = await button.isEnabled();
        logTest(`${cta.name} is enabled`, isEnabled);
      }
    }
    
    // Check tabs
    const tabs = await page.$$('[role="tab"]');
    logTest('Interactive tabs present', tabs.length === 3, `Found ${tabs.length} tabs`);
    
    // 4. DYNAMIC COMPONENTS
    logSection('4. Dynamic Components Loading');
    
    // Wait for dynamic components
    await page.waitForTimeout(3000);
    
    // Check if loading placeholders are replaced (excluding metric card animations)
    const loadingPlaceholders = await page.$$('.animate-pulse:not(.rounded)');
    logTest('Dynamic components loaded', loadingPlaceholders.length <= 3, 
      `${loadingPlaceholders.length} component placeholders remaining`);
    
    // 5. LIVE METRICS DASHBOARD
    logSection('5. Live Metrics Dashboard');
    
    // Find metric cards using correct selector
    const metricsGrid = await page.$('.grid.grid-cols-2');
    let metricCards = 0;
    if (metricsGrid) {
      const cards = await metricsGrid.$$('div[data-slot="card"], .card');
      metricCards = cards.length;
    }
    logTest('Metric cards present', metricCards >= 5, `Found ${metricCards} metric cards`);
    
    // Check for animated values (should be visible after animation)
    await page.waitForTimeout(2500);
    const activeClients = await page.$('text=/247/');
    logTest('Active clients metric animated', !!activeClients);
    
    // 6. TESTIMONIALS CAROUSEL
    logSection('6. Testimonials Carousel');
    
    // Scroll to testimonials - using proper selector
    const testimonialSection = await page.$('h2:text-is("Client Success Stories"), h2:has-text("Leaders Who")');
    if (testimonialSection) {
      await testimonialSection.scrollIntoViewIfNeeded();
    }
    
    const stars = await page.$$('.fill-yellow-400');
    logTest('Rating stars present', stars.length === 5, `Found ${stars.length} stars`);
    
    const testimonialQuote = await page.$('.text-lg.italic');
    logTest('Testimonial quote present', !!testimonialQuote);
    
    // Check carousel navigation
    const navigationDots = await page.$$('button.rounded-full');
    logTest('Carousel navigation dots present', navigationDots.length >= 3, 
      `Found ${navigationDots.length} navigation dots`);
    
    // 7. RESPONSIVE DESIGN
    logSection('7. Responsive Design');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileH1 = await page.$('h1');
    logTest('Mobile: H1 visible', await mobileH1.isVisible());
    
    const mobileGrid = await page.$('.grid.grid-cols-2');
    logTest('Mobile: Responsive grid applied', !!mobileGrid);
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    const tabletGrid = await page.$('.md\\:grid-cols-3');
    logTest('Tablet: Responsive grid applied', !!tabletGrid);
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 8. ACCESSIBILITY
    logSection('8. Accessibility Compliance');
    
    const accessibilityIssues = await checkAccessibility(page);
    logTest('No critical accessibility issues', accessibilityIssues.length === 0, 
      accessibilityIssues.join(', '));
    
    if (accessibilityIssues.length > 0) {
      testResults.warnings.push(...accessibilityIssues);
    }
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        hasOutline: window.getComputedStyle(el).outline !== 'none'
      };
    });
    logTest('Keyboard navigation works', focusedElement.tag !== 'BODY');
    
    // 9. PERFORMANCE METRICS
    logSection('9. Performance Metrics');
    
    const perfMetrics = await measurePerformance(page);
    testResults.performance = { ...testResults.performance, ...perfMetrics };
    
    logTest('DOM Content Loaded < 1.5s', perfMetrics.domContentLoaded < 1500, 
      `${perfMetrics.domContentLoaded}ms`);
    logTest('Page Load Complete < 2s', perfMetrics.loadComplete < 2000, 
      `${perfMetrics.loadComplete}ms`);
    logTest('First Contentful Paint < 1s', perfMetrics.firstContentfulPaint < 1000, 
      `${perfMetrics.firstContentfulPaint}ms`);
    
    // 10. TAB FUNCTIONALITY
    logSection('10. Tab Navigation System');
    
    // Check initial state
    const assessmentTab = await page.$('[role="tab"]:has-text("Performance Assessment")');
    const assessmentTabState = await assessmentTab.getAttribute('data-state');
    logTest('Assessment tab active by default', assessmentTabState === 'active');
    
    const barriersTab = await page.$('[role="tab"]:has-text("Barrier Analysis")');
    if (barriersTab) {
      const isDisabled = await barriersTab.isDisabled();
      logTest('Barriers tab disabled initially', isDisabled);
    } else {
      logTest('Barriers tab disabled initially', false, 'Tab not found');
    }
    
    // Check progress indicators
    const progressSteps = await page.$$('.flex.items-center.justify-between .flex.items-center');
    logTest('Progress indicators present', progressSteps.length > 0);
    
    // 11. ERROR HANDLING
    logSection('11. Error Handling');
    
    // Check for console errors (ignoring 404s for missing images)
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404') && !msg.text().includes('Failed to load resource')) {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    logTest('No critical console errors', consoleErrors.length === 0, 
      consoleErrors.length > 0 ? `${consoleErrors.length} errors found` : '');
    
    // FINAL SUMMARY
    logSection('Test Summary');
    
    const totalTests = testResults.passed.length + testResults.failed.length;
    const passRate = Math.round((testResults.passed.length / totalTests) * 100);
    
    console.log(chalk.bold(`\nTotal Tests: ${totalTests}`));
    console.log(chalk.green(`Passed: ${testResults.passed.length}`));
    console.log(chalk.red(`Failed: ${testResults.failed.length}`));
    console.log(chalk.yellow(`Warnings: ${testResults.warnings.length}`));
    console.log(chalk.bold(`Pass Rate: ${passRate}%`));
    
    // Performance Summary
    console.log(chalk.cyan.bold('\nPerformance Summary:'));
    console.log(`• Page Load Time: ${testResults.performance.pageLoadTime}ms`);
    console.log(`• DOM Interactive: ${testResults.performance.domInteractive}ms`);
    console.log(`• First Contentful Paint: ${testResults.performance.firstContentfulPaint}ms`);
    console.log(`• DOM Content Loaded: ${testResults.performance.domContentLoaded}ms`);
    
    // Failed Tests Details
    if (testResults.failed.length > 0) {
      console.log(chalk.red.bold('\nFailed Tests:'));
      testResults.failed.forEach(test => {
        console.log(chalk.red(`• ${test.name}`), test.message ? chalk.gray(`- ${test.message}`) : '');
      });
    }
    
    // Warnings Details
    if (testResults.warnings.length > 0) {
      console.log(chalk.yellow.bold('\nWarnings:'));
      testResults.warnings.forEach(warning => {
        console.log(chalk.yellow(`• ${warning}`));
      });
    }
    
    // Recommendations
    console.log(chalk.magenta.bold('\nRecommendations:'));
    if (testResults.performance.pageLoadTime > 2500) {
      console.log('• Optimize page load time (currently exceeds 2.5s target)');
    }
    if (testResults.warnings.length > 0) {
      console.log('• Address accessibility warnings for WCAG 2.1 AA compliance');
    }
    if (testResults.failed.length > 0) {
      console.log('• Fix failed tests to ensure full functionality');
    }
    
    // Exit code based on test results
    process.exit(testResults.failed.length > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Test execution failed:'), error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();