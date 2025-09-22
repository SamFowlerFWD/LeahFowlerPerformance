import { test, expect } from '@playwright/test';

test.describe('Leah Fowler Performance - Shadcn UI Upgrade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
  });

  test('should load the homepage with all key elements', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('Unlock Your Peak Performance');
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav').getByText('Leah Fowler Performance')).toBeVisible();
    
    // Check hero buttons
    const assessmentButton = page.getByRole('link', { name: /Start Your Assessment/i });
    const programmesButton = page.getByRole('link', { name: /View Programmes/i });
    await expect(assessmentButton).toBeVisible();
    await expect(programmesButton).toBeVisible();
  });

  test('should navigate to assessment section and display shadcn components', async ({ page }) => {
    // Click assessment button
    await page.getByRole('link', { name: /Start Your Assessment/i }).click();
    
    // Wait for assessment section
    await page.waitForSelector('#assessment');
    
    // Check for shadcn Card component
    const assessmentCard = page.locator('[data-slot="card"]').first();
    await expect(assessmentCard).toBeVisible();
    
    // Check for Progress component
    const progress = page.locator('[data-slot="progress"]');
    await expect(progress).toBeVisible();
    
    // Check question display
    await expect(page.getByText(/How would you rate your current energy levels/i)).toBeVisible();
  });

  test('should allow rating selection', async ({ page }) => {
    await page.goto('http://localhost:3004#assessment');
    
    // Wait for assessment to load
    await page.waitForSelector('[data-slot="card"]');
    await page.waitForTimeout(500); // Wait for animations
    
    // Click on the button containing "7"
    const rating7Button = page.getByRole('button', { name: /Rate 7 out of 10/i });
    await rating7Button.click();
    
    // Verify selection is highlighted
    await expect(rating7Button).toHaveClass(/bg-gold/);
  });

  test('should navigate through assessment questions', async ({ page }) => {
    await page.goto('http://localhost:3004#assessment');
    
    // Wait for assessment
    await page.waitForSelector('[data-slot="card"]');
    await page.waitForTimeout(500); // Wait for animations
    
    // Check initial state - Back button disabled
    const backButton = page.getByRole('button', { name: /Back/i });
    await expect(backButton).toBeDisabled();
    
    // Select a rating by clicking the button
    const rating8Button = page.getByRole('button', { name: /Rate 8 out of 10/i });
    await rating8Button.click();
    
    const nextButton = page.getByRole('button', { name: 'Go to next question' });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    
    // Wait for animation
    await page.waitForTimeout(400);
    
    // Check we're on question 2
    await expect(page.getByText('Question 2 of 8')).toBeVisible();
    
    // Back button should now be enabled
    await expect(backButton).toBeEnabled();
    
    // Progress bar should update
    const progressIndicator = page.locator('[data-slot="progress-indicator"]');
    const progressStyle = await progressIndicator.getAttribute('style');
    expect(progressStyle).toContain('translateX');
  });

  test('should display programme cards with shadcn Card components', async ({ page }) => {
    await page.goto('http://localhost:3004#programmes');
    
    // Wait for programmes section
    await page.waitForSelector('#programmes');
    
    // Check for programme cards in programmes section specifically
    const programmesSection = page.locator('#programmes');
    const programmeCards = programmesSection.locator('[data-slot="card"]');
    await expect(programmeCards).toHaveCount(3); // 3 programme cards
    
    // Check specific programme
    const executiveCard = programmeCards.filter({ hasText: 'Executive Excellence Programme' });
    await expect(executiveCard).toBeVisible();
    
    // Check for shadcn Button in card
    const learnMoreButton = executiveCard.getByRole('button', { name: /Learn More/i });
    await expect(learnMoreButton).toBeVisible();
    await expect(learnMoreButton).toHaveClass(/bg-navy/);
  });

  test('should display testimonials with shadcn Card components', async ({ page }) => {
    await page.goto('http://localhost:3004#testimonials');
    
    // Check testimonial cards
    const testimonialSection = page.locator('#testimonials');
    const testimonialCards = testimonialSection.locator('[data-slot="card"]');
    await expect(testimonialCards).toHaveCount(3);
    
    // Check star ratings are visible
    const stars = testimonialSection.locator('.fill-gold');
    await expect(stars.first()).toBeVisible();
  });

  test('should display contact form with shadcn Input components', async ({ page }) => {
    await page.goto('http://localhost:3004#contact');
    
    // Check contact card
    const contactCard = page.locator('#contact [data-slot="card"]');
    await expect(contactCard).toBeVisible();
    
    // Check form inputs
    const nameInput = page.getByPlaceholder('Your Name');
    const emailInput = page.getByPlaceholder('Your Email');
    const goalsTextarea = page.getByPlaceholder('Tell us about your goals');
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(goalsTextarea).toBeVisible();
    
    // Check submit button
    const submitButton = page.getByRole('button', { name: /Schedule Consultation/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveClass(/bg-gold/);
  });

  test('should maintain brand colors throughout', async ({ page }) => {
    // Check navigation button (it's a Button component)
    const bookButton = page.locator('nav').locator('[data-slot="button"]').filter({ hasText: 'Book Consultation' });
    await expect(bookButton).toHaveClass(/bg-gold/);
    
    // Check hero CTA button (it's inside a Button component)
    const ctaButton = page.locator('[data-slot="button"]').filter({ hasText: 'Start Your Assessment' }).first();
    await expect(ctaButton).toHaveClass(/bg-gold/);
    
    // Check text gradient
    const gradientText = page.locator('.text-gradient');
    await expect(gradientText).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip to main
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // Assessment link
    
    // Check focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate to assessment
    await page.goto('http://localhost:3004#assessment');
    await page.waitForSelector('[data-slot="card"]');
    await page.waitForTimeout(500);
    
    // Click first rating to enable navigation
    const firstRating = page.getByRole('button', { name: /Rate 5 out of 10/i });
    await firstRating.click();
    
    // Tab to Next button and click
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Wait for animation and transition
    await page.waitForTimeout(1000);
    
    // Verify we moved to next question
    await expect(page.getByText('Question 2 of 8')).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check skip navigation link
    const skipLink = page.getByRole('link', { name: /Skip to main content/i });
    await expect(skipLink).toHaveClass(/sr-only/);
    
    // Check form ARIA labels
    await page.goto('http://localhost:3004#assessment');
    const assessmentForm = page.getByRole('form', { name: /Performance assessment questionnaire/i });
    await expect(assessmentForm).toBeVisible();
    
    // Check button ARIA labels
    const backButton = page.getByRole('button', { name: /Go back to previous question/i });
    await expect(backButton).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check layout adjusts
    await expect(page.locator('h1')).toBeVisible();
    
    // Check assessment card is still functional
    await page.goto('http://localhost:3004#assessment');
    await page.waitForSelector('[data-slot="card"]');
    await page.waitForTimeout(500); // Wait for animations
    
    // Rating grid should still be visible
    const ratingButtons = page.getByRole('button', { name: /Rate \d+ out of 10/i });
    await expect(ratingButtons.first()).toBeVisible();
    
    // Should be able to select rating on mobile by clicking button
    const rating5Button = page.getByRole('button', { name: /Rate 5 out of 10/i });
    await rating5Button.click();
    await expect(rating5Button).toHaveClass(/bg-gold/);
  });

  test('should complete full assessment flow', async ({ page }) => {
    await page.goto('http://localhost:3004#assessment');
    await page.waitForSelector('[data-slot="card"]');
    await page.waitForTimeout(500); // Initial wait
    
    // Answer all 8 questions
    const ratings = [8, 7, 6, 9, 7, 8, 6, 7];
    
    for (const i = 0; i < ratings.length; i++) {
      // Select rating by clicking button
      const ratingButton = page.getByRole('button', { name: new RegExp(`Rate ${ratings[i]} out of 10`, 'i') });
      await ratingButton.click();
      
      // Click next/see results - be specific to avoid Next.js dev tools button
      if (i < ratings.length - 1) {
        await page.getByRole('button', { name: 'Go to next question' }).click();
      } else {
        await page.getByRole('button', { name: 'See your results' }).click();
      }
      
      // Wait for animation
      await page.waitForTimeout(500);
    }
    
    // Check results are displayed
    await expect(page.getByText(/Your Performance Assessment Results/i)).toBeVisible();
    
    // Check for overall score
    await expect(page.getByText(/Overall Performance Score/i)).toBeVisible();
    
    // Check for recommended programme
    await expect(page.getByText(/Recommended Programme/i)).toBeVisible();
    
    // Check for email form (be specific to results section)
    const resultsSection = page.locator('[data-slot="card"]').filter({ hasText: 'Your Performance Assessment Results' });
    const emailInput = resultsSection.getByPlaceholder('Your Email');
    await expect(emailInput).toBeVisible();
    
    // Check for action buttons
    const getReportButton = page.getByRole('button', { name: /Get My Full Report/i });
    const startOverButton = page.getByRole('button', { name: /Start Over/i });
    await expect(getReportButton).toBeVisible();
    await expect(startOverButton).toBeVisible();
  });

  test('should verify UK English spelling', async ({ page }) => {
    // Check for UK spellings
    await expect(page.locator('body')).toContainText('optimisation');
    await expect(page.locator('body')).toContainText('personalised');
    await expect(page.locator('body')).toContainText('Programme');
    await expect(page.locator('body')).toContainText('organisation');
    
    // Should not contain US spellings
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('optimization');
    expect(bodyText).not.toContain('personalized');
    expect(bodyText).not.toContain('organization');
  });
});