# Playwright-Driven Hero Section Visual Optimization Agent

## Primary Objective
Systematically optimize the hero section's text sizing, visual hierarchy, and content balance using Playwright testing to achieve perfect desktop fit while maintaining impact and reducing repetitive "Spartan" references.

## Critical Issues to Fix

### 1. Text Size Overflow (URGENT)
```css
/* CURRENT - TOO LARGE */
.hero-headline {
  font-size: 7xl; /* 112px on desktop - overwhelming */
}

/* TARGET - BALANCED */
.hero-headline {
  font-size: 4xl to 5xl; /* 36-48px - professional yet impactful */
}
```

### 2. Spartan Reference Overload
Current repetitive mentions:
- Badge: "Mother of 3 • Spartan Finisher"
- Stats: "Spartan Ultra Finisher"
- Subheading: "Mother of 3 • Spartan Finisher"
- Headlines: "Spartan Strong"

Target: Maximum 1-2 strategic mentions

### 3. Poor Desktop Viewport Fit
- Content overflows on standard 1366x768 screens
- CTAs pushed below fold
- Visual hierarchy competing for attention

## Thinking Protocol
Before implementing ANY changes:
1. Map current text sizes across all breakpoints
2. Audit all "Spartan" references for redundancy
3. Calculate above-the-fold boundaries for standard viewports
4. Design progressive size reduction test matrix
5. Create visual hierarchy scoring system

## MCP Tool Integration

### Test Setup Commands:
```bash
# Install Playwright if needed
npm install -D @playwright/test

# Create test file
touch tests/hero-optimization.spec.ts

# Run optimization tests
npx playwright test hero-optimization --headed
```

## Playwright Test Implementation

### 1. Viewport Testing Suite
```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1920, height: 1080, name: 'full-hd' },
  { width: 1440, height: 900, name: 'macbook' },
  { width: 1366, height: 768, name: 'standard' },
  { width: 1280, height: 720, name: 'compact' }
];

test.describe('Hero Section Optimization', () => {
  for (const viewport of viewports) {
    test(`Fits perfectly at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Test hero visibility
      const hero = await page.locator('.hero-section');
      const heroBox = await hero.boundingBox();

      // Ensure hero doesn't exceed viewport
      expect(heroBox.height).toBeLessThan(viewport.height);

      // Ensure CTA is above fold
      const cta = await page.locator('.hero-cta').first();
      const ctaPosition = await cta.boundingBox();
      expect(ctaPosition.y + ctaPosition.height).toBeLessThan(viewport.height);
    });
  }
});
```

### 2. Text Size Optimization Tests
```typescript
test.describe('Text Size Variations', () => {
  const sizeVariants = [
    { class: 'text-7xl', size: 112, label: 'current-too-large' },
    { class: 'text-6xl', size: 60, label: 'still-large' },
    { class: 'text-5xl', size: 48, label: 'balanced-impact' },
    { class: 'text-4xl', size: 36, label: 'professional' }
  ];

  for (const variant of sizeVariants) {
    test(`Test readability at ${variant.label}`, async ({ page }) => {
      await page.goto('/');

      // Apply size variant
      await page.evaluate((size) => {
        document.querySelector('.hero-headline').className =
          document.querySelector('.hero-headline').className
            .replace(/text-\dxl/g, size);
      }, variant.class);

      // Take screenshot for visual comparison
      await page.screenshot({
        path: `tests/screenshots/hero-${variant.label}.png`,
        fullPage: false
      });

      // Test readability metrics
      const metrics = await page.evaluate(() => {
        const headline = document.querySelector('.hero-headline');
        const rect = headline.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          viewportRatio: rect.height / window.innerHeight
        };
      });

      // Headline shouldn't take more than 15% of viewport
      expect(metrics.viewportRatio).toBeLessThan(0.15);
    });
  }
});
```

### 3. Content Optimization Tests
```typescript
test('Reduce Spartan repetition', async ({ page }) => {
  await page.goto('/');

  // Count Spartan mentions
  const spartanCount = await page.evaluate(() => {
    const text = document.body.innerText;
    const matches = text.match(/spartan/gi) || [];
    return matches.length;
  });

  // Should have maximum 2 mentions in hero
  expect(spartanCount).toBeLessThanOrEqual(2);
});
```

## Recommended Changes

### 1. Text Size Adjustments
```typescript
// In PremiumHeroWithImage.tsx
const headlineClasses = {
  mobile: "text-2xl",     // 24px - readable on small screens
  tablet: "text-3xl",     // 30px - balanced for tablets
  desktop: "text-4xl",    // 36px - professional impact
  large: "lg:text-5xl"    // 48px - optional for large screens
};

// Implementation
<motion.h1 className={`
  ${headlineClasses.mobile}
  sm:${headlineClasses.tablet}
  md:${headlineClasses.desktop}
  ${headlineClasses.large}
  font-bold leading-tight
`}>
```

### 2. Content Strategy
```typescript
// Remove redundant Spartan references
const heroContent = {
  badge: "Norfolk's Strength Coach for Mothers", // Remove Spartan
  subheading: "Mother of 3 helping you get stronger", // Simplified
  stats: [
    { label: "Mothers Trained", value: "100+" },
    { label: "Spartan Finisher", value: "Ultra" }, // Single strategic mention
    { label: "Years Experience", value: "10+" },
    { label: "Success Rate", value: "95%" }
  ]
};
```

### 3. Visual Hierarchy Fix
```css
/* Progressive size reduction for better hierarchy */
.hero-headline {
  @apply text-3xl md:text-4xl lg:text-5xl; /* 30px → 36px → 48px */
}

.hero-subheading {
  @apply text-lg md:text-xl lg:text-2xl; /* 18px → 20px → 24px */
}

.hero-badge {
  @apply text-sm md:text-base; /* 14px → 16px */
}
```

## Success Criteria
□ Headlines fit comfortably on 1366x768 screens without overflow
□ All critical content visible above fold at standard viewport
□ Maximum 2 "Spartan" references in entire hero section
□ Text hierarchy follows 1.5x scale ratio between levels
□ Visual regression tests pass for all viewports
□ Readability score > 90% at all sizes
□ CTA buttons remain above fold on all tested viewports
□ No horizontal scrolling on any viewport

## Validation Commands
```bash
# Run all optimization tests
npx playwright test tests/hero-optimization.spec.ts

# Generate visual comparison report
npx playwright test --reporter=html

# Check specific viewport
npx playwright test --project=chromium --viewport=1366x768

# Update baseline screenshots
npx playwright test --update-snapshots
```

## Expected Outcomes
1. **Desktop text**: Reduced from 7xl (112px) to 4xl-5xl (36-48px)
2. **Spartan mentions**: Reduced from 5+ to maximum 2
3. **Viewport fit**: 100% content visible at 1366x768
4. **Visual hierarchy**: Clear 3-tier structure
5. **Professional feel**: Balanced impact without overwhelming

## Implementation Checklist
- [ ] Create Playwright test file with viewport tests
- [ ] Run baseline screenshots at current sizes
- [ ] Test progressive size reductions
- [ ] Remove redundant Spartan references
- [ ] Validate above-fold content visibility
- [ ] Compare visual regression screenshots
- [ ] Update component with optimal sizes
- [ ] Run final validation suite
- [ ] Document chosen sizes in style guide

This systematic Playwright-driven approach ensures data-backed decisions for optimal hero section presentation across all devices.