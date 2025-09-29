import { test, expect } from '@playwright/test';

test('Verify updated About section statistics', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3007');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Scroll to the About section
  const aboutSection = page.locator('section').filter({ hasText: 'About Leah' }).first();
  await aboutSection.scrollIntoViewIfNeeded();

  // Wait a moment for any animations
  await page.waitForTimeout(500);

  // Take a screenshot of the About section
  await aboutSection.screenshot({
    path: 'updated-about-stats.png',
    fullPage: false
  });

  // Verify the three credential cards contain the correct text
  const credentialCards = aboutSection.locator('.bg-neutral-900, .bg-zinc-900').filter({ hasText: /Mother of 3|Elite Qualifications|Years Elite Training/ });

  // Check first card - "Mother of 3"
  const motherCard = credentialCards.filter({ hasText: 'Mother of 3' }).first();
  await expect(motherCard).toBeVisible();
  await expect(motherCard).toContainText('Mother of 3');

  // Check second card - "Elite Qualifications"
  const qualificationsCard = credentialCards.filter({ hasText: 'Elite Qualifications' }).first();
  await expect(qualificationsCard).toBeVisible();
  await expect(qualificationsCard).toContainText('Elite Qualifications');
  await expect(qualificationsCard).toContainText('Level 4 S&C + Level 3 PT');

  // Check third card - "5+ Years Elite Training"
  const experienceCard = credentialCards.filter({ hasText: 'Years Elite Training' }).first();
  await expect(experienceCard).toBeVisible();
  await expect(experienceCard).toContainText('5+ Years Elite Training');
  await expect(experienceCard).toContainText('Transforming Parents Into Athletes');

  console.log('✓ All three credential cards have been verified with updated statistics:');
  console.log('  1. Mother of 3 (unchanged)');
  console.log('  2. Elite Qualifications - Level 4 S&C + Level 3 PT (updated)');
  console.log('  3. 5+ Years Elite Training - Transforming Parents Into Athletes (updated)');
});