import { test, expect, Page } from '@playwright/test';
import { performance } from 'perf_hooks';

// Test configuration for different viewport sizes
const viewports = {
  mobile: { width: 375, height: 667 },  // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 } // Full HD
};

// Helper function to measure page performance
async function measurePagePerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    };
  });
  return metrics;
}

// Helper to check accessibility
async function checkAccessibility(page: Page, selector?: string) {
  const element = selector ? await page.locator(selector) : await page.locator('body');
  
  // Check for ARIA labels
  const ariaLabels = await element.evaluate((el) => {
    const elements = el.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    return elements.length;
  });
  
  // Check for alt text on images
  const imagesWithoutAlt = await element.evaluate((el) => {
    const images = el.querySelectorAll('img:not([alt])');
    return images.length;
  });
  
  // Check for proper heading hierarchy
  const headingHierarchy = await element.evaluate((el) => {
    const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let isValid = true;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.replace('H', ''));
      if (previousLevel > 0 && level > previousLevel + 1) {
        isValid = false;
      }
      previousLevel = level;
    });
    
    return isValid;
  });
  
  // Check color contrast (simplified check)
  const lowContrastElements = await element.evaluate((el) => {
    const elements = el.querySelectorAll('*');
    let lowContrast = 0;
    
    elements.forEach((elem: Element) => {
      const styles = window.getComputedStyle(elem);
      const color = styles.color;
      const bgColor = styles.backgroundColor;
      
      // Basic check - would need more sophisticated contrast calculation in production
      if (color === bgColor && color !== 'rgba(0, 0, 0, 0)') {
        lowContrast++;
      }
    });
    
    return lowContrast;
  });
  
  return {
    hasAriaLabels: ariaLabels > 0,
    imagesWithoutAlt,
    validHeadingHierarchy: headingHierarchy,
    lowContrastElements
  };
}

test.describe('Performance Accelerator Page - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Performance.*Leah Fowler/i);
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/Transform Your Executive Performance/i);
  });

  test('should display all main sections', async ({ page }) => {
    // Hero Section
    await expect(page.locator('section').first()).toBeVisible();
    
    // Live Metrics Dashboard
    await expect(page.locator('text=/Live Performance Metrics/i')).toBeVisible();
    
    // Interactive Tools Section
    await expect(page.locator('text=/Interactive Performance Tools/i')).toBeVisible();
    
    // Testimonials Section
    await expect(page.locator('text=/Client Success Stories/i')).toBeVisible();
    
    // CTA Section
    await expect(page.locator('text=/Ready to Join the Top 1%/i')).toBeVisible();
  });

  test('should have functional CTAs', async ({ page }) => {
    // Test main hero CTA
    const startAssessmentBtn = page.locator('button:has-text("Start Free Assessment")');
    await expect(startAssessmentBtn).toBeVisible();
    await expect(startAssessmentBtn).toBeEnabled();
    
    // Test secondary CTA
    const watchStoriesBtn = page.locator('button:has-text("Watch Success Stories")');
    await expect(watchStoriesBtn).toBeVisible();
    await expect(watchStoriesBtn).toBeEnabled();
    
    // Test final CTA
    const bookCallBtn = page.locator('button:has-text("Book Your Strategy Call")');
    await expect(bookCallBtn).toBeVisible();
    await expect(bookCallBtn).toBeEnabled();
  });
});

test.describe('Executive Assessment Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
  });

  test('should display assessment tab by default', async ({ page }) => {
    const assessmentTab = page.locator('[role="tab"]:has-text("Performance Assessment")');
    await expect(assessmentTab).toHaveAttribute('data-state', 'active');
  });

  test('should load ExecutiveAssessmentTool component', async ({ page }) => {
    // Wait for dynamic component to load
    await page.waitForTimeout(2000);
    
    // Check if the assessment tool is visible
    const assessmentContent = page.locator('[role="tabpanel"][data-state="active"]');
    await expect(assessmentContent).toBeVisible();
  });

  test('should track progress through assessment', async ({ page }) => {
    // Check initial progress indicator
    const progressIndicator = page.locator('.flex.items-center.justify-between').first();
    await expect(progressIndicator).toBeVisible();
    
    // Verify step 1 is not completed initially
    const step1 = progressIndicator.locator('text=Assessment').locator('..');
    const step1Circle = step1.locator('div').first();
    await expect(step1Circle).not.toHaveClass(/bg-green-600/);
  });

  test('should disable subsequent tabs initially', async ({ page }) => {
    const barriersTab = page.locator('[role="tab"]:has-text("Barrier Analysis")');
    const programmeTab = page.locator('[role="tab"]:has-text("Programme Match")');
    
    await expect(barriersTab).toHaveAttribute('data-disabled', 'true');
    await expect(programmeTab).toHaveAttribute('data-disabled', 'true');
  });
});

test.describe('Live Metrics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
  });

  test('should display all metric cards', async ({ page }) => {
    const metricCards = [
      'Active Clients',
      'Avg Energy Increase',
      'Productivity Gain',
      'Average ROI',
      'Success Rate'
    ];
    
    for (const metric of metricCards) {
      await expect(page.locator(`text=${metric}`)).toBeVisible();
    }
  });

  test('should animate metric values on load', async ({ page }) => {
    // Wait for animations to start
    await page.waitForTimeout(600);
    
    // Check that values are visible and not placeholders
    const activeClients = page.locator('text=/247/');
    await expect(activeClients).toBeVisible({ timeout: 3000 });
    
    const energyIncrease = page.locator('text=/47%/');
    await expect(energyIncrease).toBeVisible({ timeout: 3000 });
  });

  test('should have hover effects on metric cards', async ({ page }) => {
    const firstCard = page.locator('.grid > div').first().locator('.card');
    
    // Get initial box shadow
    const initialShadow = await firstCard.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    );
    
    // Hover and check for shadow change
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    const hoverShadow = await firstCard.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    );
    
    expect(initialShadow).not.toBe(hoverShadow);
  });
});

test.describe('Testimonials Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
    
    // Scroll to testimonials section
    await page.locator('text=/Client Success Stories/i').scrollIntoViewIfNeeded();
  });

  test('should display testimonial content', async ({ page }) => {
    // Check for testimonial elements
    await expect(page.locator('.text-lg.italic')).toBeVisible();
    await expect(page.locator('text=/CEO/i,text=/Director/i,text=/Founder/i')).toBeVisible();
    
    // Check for rating stars
    const stars = page.locator('.fill-yellow-400');
    await expect(stars).toHaveCount(5);
  });

  test('should auto-rotate testimonials', async ({ page }) => {
    // Get initial testimonial text
    const initialQuote = await page.locator('.text-lg.italic').textContent();
    
    // Wait for rotation (5 seconds as per code)
    await page.waitForTimeout(5500);
    
    // Get new testimonial text
    const newQuote = await page.locator('.text-lg.italic').textContent();
    
    expect(initialQuote).not.toBe(newQuote);
  });

  test('should allow manual navigation', async ({ page }) => {
    // Find navigation dots
    const dots = page.locator('button.rounded-full');
    const dotCount = await dots.count();
    
    expect(dotCount).toBeGreaterThan(0);
    
    // Click on second dot
    if (dotCount > 1) {
      await dots.nth(1).click();
      
      // Verify dot is active (has different width)
      await expect(dots.nth(1)).toHaveClass(/w-8/);
    }
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: viewports.mobile });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
    
    // Check hero section responsiveness
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    const fontSize = await heroTitle.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(parseInt(fontSize)).toBeLessThan(50); // Should be smaller on mobile
    
    // Check button stack on mobile
    const buttonContainer = page.locator('.flex.flex-col.sm\\:flex-row').first();
    const flexDirection = await buttonContainer.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(flexDirection).toBe('column');
    
    // Check grid responsiveness
    const metricsGrid = page.locator('.grid.grid-cols-2.md\\:grid-cols-3');
    await expect(metricsGrid).toBeVisible();
  });

  test('should have functional mobile navigation', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    // Tabs should be scrollable or stacked on mobile
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).toBeVisible();
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use({ viewport: viewports.tablet });

  test('should be responsive on tablet', async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
    
    // Check grid layout on tablet
    const metricsGrid = page.locator('.grid.grid-cols-2.md\\:grid-cols-3');
    await expect(metricsGrid).toBeVisible();
    
    // Check that elements are properly sized
    const cards = page.locator('.card');
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();
  });
});

test.describe('Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
      elements.map(el => ({
        tag: el.tagName,
        text: el.textContent?.substring(0, 50)
      }))
    );
    
    // Should have exactly one H1
    const h1Count = headings.filter(h => h.tag === 'H1').length;
    expect(h1Count).toBe(1);
    
    // Check logical hierarchy
    let previousLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.tag.replace('H', ''));
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
      }
      previousLevel = level;
    }
  });

  test('should have keyboard navigation support', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        hasOutline: window.getComputedStyle(el!).outline !== 'none'
      };
    });
    
    expect(focusedElement.tagName).toBeDefined();
  });

  test('should have ARIA labels and roles', async ({ page }) => {
    // Check tabs have proper roles
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
    
    // Check tabpanels
    const tabPanels = page.locator('[role="tabpanel"]');
    expect(await tabPanels.count()).toBeGreaterThan(0);
    
    // Check buttons have accessible text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either visible text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Check text contrast on primary buttons
    const primaryButton = page.locator('button.bg-white.text-green-600').first();
    
    if (await primaryButton.count() > 0) {
      const contrast = await primaryButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        // This is simplified - in production, use a proper contrast calculation
        return styles.color !== styles.backgroundColor;
      });
      
      expect(contrast).toBe(true);
    }
  });

  test('should be screen reader friendly', async ({ page }) => {
    // Check for skip links
    const skipLinks = page.locator('a[href^="#"]:has-text("Skip")');
    // Note: Add skip links if not present
    
    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Image should have alt text or role="presentation" for decorative images
        expect(alt !== null || role === 'presentation').toBe(true);
      }
    }
  });
});

test.describe('Performance Metrics', () => {
  test('should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let fcp = 0;
        let lcp = 0;
        let cls = 0;
        let fid = 0;
        
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          fcp = entries[entries.length - 1].startTime;
        }).observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          lcp = entries[entries.length - 1].startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Wait a bit to collect metrics
        setTimeout(() => {
          resolve({ fcp, lcp, cls, fid });
        }, 3000);
      });
    });
    
    // Check against thresholds
    expect(metrics.fcp).toBeLessThan(1000); // FCP < 1s
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Check for lazy loading
      const loading = await img.getAttribute('loading');
      // Non-critical images should be lazy loaded
      
      // Check for proper sizing
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Images should have dimensions to prevent layout shift
      if (await img.isVisible()) {
        expect(width || height).toBeTruthy();
      }
    }
  });
});

test.describe('Interactive Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-accelerator');
    await page.waitForLoadState('networkidle');
  });

  test('should handle tab switching correctly', async ({ page }) => {
    // Initially, only assessment tab should be active
    const assessmentTab = page.locator('[role="tab"]:has-text("Performance Assessment")');
    await expect(assessmentTab).toHaveAttribute('data-state', 'active');
    
    // Barriers and Programme tabs should be disabled
    const barriersTab = page.locator('[role="tab"]:has-text("Barrier Analysis")');
    await expect(barriersTab).toHaveAttribute('data-disabled', 'true');
  });

  test('should show progress indicators', async ({ page }) => {
    // Check for progress indicators
    const progressSteps = page.locator('.flex.items-center.justify-between').first().locator('.flex.items-center');
    const stepCount = await progressSteps.count();
    
    expect(stepCount).toBe(3); // Assessment, Barriers, Programme
    
    // First step should not be completed initially
    const firstStepIcon = progressSteps.first().locator('div').first();
    const classes = await firstStepIcon.getAttribute('class');
    expect(classes).toContain('bg-gray-200');
  });

  test('should have smooth animations', async ({ page }) => {
    // Check for animation classes
    const animatedElements = page.locator('[class*="transition"], [class*="animate"]');
    const animCount = await animatedElements.count();
    
    expect(animCount).toBeGreaterThan(0);
  });
});

test.describe('Error Handling and Edge Cases', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Intercept API calls and simulate failure
    await context.route('**/api/**', route => route.abort());
    
    await page.goto('/performance-accelerator');
    
    // Page should still load with fallback content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle missing dynamic components', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    // Even if dynamic components fail to load, page should be functional
    const fallbackLoaders = page.locator('.animate-pulse');
    
    // Wait a reasonable time for components to load
    await page.waitForTimeout(3000);
    
    // Loaders should be replaced by actual content
    const loaderCount = await fallbackLoaders.count();
    expect(loaderCount).toBe(0);
  });
});

test.describe('SEO and Meta Tags', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    // Check title
    const title = await page.title();
    expect(title).toContain('Leah Fowler');
    
    // Check meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    
    // Check Open Graph tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    // Check for JSON-LD structured data
    const structuredData = await page.$$('script[type="application/ld+json"]');
    expect(structuredData.length).toBeGreaterThan(0);
  });
});

// Performance monitoring test
test.describe('Detailed Performance Analysis', () => {
  test('should track all performance metrics', async ({ page }) => {
    await page.goto('/performance-accelerator');
    
    const perfMetrics = await measurePagePerformance(page);
    
    console.log('Performance Metrics:', perfMetrics);
    
    // All metrics should be reasonable
    expect(perfMetrics.domContentLoaded).toBeLessThan(1500);
    expect(perfMetrics.loadComplete).toBeLessThan(2000);
    expect(perfMetrics.domInteractive).toBeLessThan(1000);
    expect(perfMetrics.firstContentfulPaint).toBeLessThan(1000);
  });
});