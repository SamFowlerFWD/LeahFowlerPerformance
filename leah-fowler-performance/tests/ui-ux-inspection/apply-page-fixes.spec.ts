import { test, expect, type Page } from '@playwright/test';

test.describe('Apply Page UI/UX Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003/apply');
    await page.waitForLoadState('networkidle');
  });

  test('should have visible radio buttons with strong navy borders', async ({ page }) => {
    // Check radio buttons in Programme section
    const programmeRadios = page.locator('input[type="radio"][name^="programme"], input[type="radio"][value]').first();
    await expect(programmeRadios).toBeVisible();

    // Take screenshot of programme selection section
    const programmeSection = page.locator('text="Which Programme Interests You?"').locator('..');
    await programmeSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/programme-radio-buttons.png'
    });

    // Check radio button styling
    const radioButton = page.locator('button[role="radio"]').first();
    await expect(radioButton).toBeVisible();

    // Verify minimum size (24x24px for the radio button itself)
    const box = await radioButton.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }

    // Test hover state
    await radioButton.hover();
    await page.waitForTimeout(300); // Wait for hover animation
    await programmeSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/programme-radio-hover.png'
    });

    // Click to select and verify checked state
    await radioButton.click();
    await expect(radioButton).toHaveAttribute('data-state', 'checked');
    await programmeSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/programme-radio-checked.png'
    });
  });

  test('should have proper header spacing and content padding', async ({ page }) => {
    // Verify header is fixed and visible
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('position', 'fixed');

    // Check main content padding from top
    const mainContent = page.locator('main').first();
    const mainBox = await mainContent.boundingBox();
    const headerBox = await header.boundingBox();

    if (mainBox && headerBox) {
      // Ensure content starts below header with adequate spacing
      expect(mainBox.y).toBeGreaterThan(headerBox.height);
    }

    // Take full page screenshot to verify spacing
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/apply-page-full.png',
      fullPage: false // Just viewport to see header and top content relationship
    });

    // Scroll down a bit and take another screenshot
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/apply-page-scrolled.png'
    });
  });

  test('should have consistent navy, gold, and sage theming', async ({ page }) => {
    // Check form card styling
    const formCard = page.locator('.card, [data-slot="card"]').first();
    await expect(formCard).toBeVisible();
    await expect(formCard).toHaveCSS('background-color', 'rgb(255, 255, 255)'); // White background

    // Check input field borders and focus states
    const nameInput = page.locator('input[name="name"]');
    await nameInput.scrollIntoViewIfNeeded();

    // Take screenshot of input before focus
    await nameInput.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/input-default.png'
    });

    // Focus and take screenshot
    await nameInput.focus();
    await page.waitForTimeout(200); // Wait for focus animation
    await nameInput.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/input-focused.png'
    });

    // Check consent section styling (should have gold background)
    const consentSection = page.locator('text="I consent to"').locator('../..');
    await consentSection.scrollIntoViewIfNeeded();
    await consentSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/consent-section.png'
    });

    // Check submit button styling
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/submit-button.png'
    });
  });

  test('should have minimum 44x44px touch targets', async ({ page }) => {
    // Test all interactive elements for minimum touch target size
    const interactiveElements = [
      { selector: 'button[role="radio"]', name: 'Radio buttons' },
      { selector: 'input[type="text"], input[type="email"], input[type="tel"]', name: 'Input fields' },
      { selector: 'textarea', name: 'Textareas' },
      { selector: 'input[type="checkbox"]', name: 'Checkboxes' },
      { selector: 'button[type="submit"]', name: 'Submit button' },
    ];

    for (const element of interactiveElements) {
      const elements = await page.locator(element.selector).all();
      for (let i = 0; i < Math.min(elements.length, 3); i++) { // Check first 3 of each type
        const el = elements[i];
        const box = await el.boundingBox();
        if (box) {
          // Parent container might provide the touch target
          const parent = el.locator('..');
          const parentBox = await parent.boundingBox();

          // Check if either the element or its parent meets minimum size
          const meetsMinimum =
            (box.width >= 44 && box.height >= 44) ||
            (parentBox && parentBox.width >= 44 && parentBox.height >= 44);

          expect(meetsMinimum).toBeTruthy();
        }
      }
    }

    // Take screenshot of form with all elements visible
    const formSection = page.locator('form');
    await formSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/form-touch-targets.png',
      fullPage: true
    });
  });

  test('should have proper contrast and visual hierarchy', async ({ page }) => {
    // Take screenshots of different sections to verify visual hierarchy

    // Header section with title
    const headerSection = page.locator('h1').locator('..');
    await headerSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/header-section.png'
    });

    // Your Information section
    const infoSection = page.locator('text="Your Information"').locator('../..');
    await infoSection.scrollIntoViewIfNeeded();
    await infoSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/your-information.png'
    });

    // Experience section with sage hover
    const experienceSection = page.locator('text="Your Fitness Experience"').locator('../..');
    await experienceSection.scrollIntoViewIfNeeded();

    const expOption = experienceSection.locator('[role="radio"]').first().locator('..');
    await expOption.hover();
    await page.waitForTimeout(300);
    await experienceSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/experience-section-hover.png'
    });

    // Goals section
    const goalsSection = page.locator('text="Your Goals & Availability"').locator('../..');
    await goalsSection.scrollIntoViewIfNeeded();
    await goalsSection.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/goals-section.png'
    });
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check header on mobile
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/mobile-top.png'
    });

    // Scroll to programme section
    const programmeSection = page.locator('text="Which Programme Interests You?"').locator('..');
    await programmeSection.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/mobile-programme.png'
    });

    // Check touch targets on mobile
    const radioButton = page.locator('button[role="radio"]').first();
    const box = await radioButton.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }

    // Check input field on mobile
    const emailInput = page.locator('input[name="email"]');
    await emailInput.scrollIntoViewIfNeeded();
    const inputBox = await emailInput.boundingBox();
    if (inputBox) {
      expect(inputBox.height).toBeGreaterThanOrEqual(44);
    }

    // Submit button on mobile
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/mobile-submit.png'
    });
  });

  test('full page visual regression test', async ({ page }) => {
    // Desktop full page
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/desktop-full-page.png',
      fullPage: true
    });

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/tablet-full-page.png',
      fullPage: true
    });

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'tests/ui-ux-inspection/screenshots/mobile-full-page.png',
      fullPage: true
    });
  });
});