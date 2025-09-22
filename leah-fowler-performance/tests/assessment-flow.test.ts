import { test, expect } from '@playwright/test'

test.describe('Assessment Flow', () => {
  test('should show ALL questions even with disqualifying answers', async ({ page }) => {
    // Navigate to assessment page
    await page.goto('http://localhost:3005/assessment')
    
    // Verify intro screen appears
    await expect(page.locator('text=Elite Performance Assessment')).toBeVisible()
    await expect(page.locator('text=Begin Elite Assessment')).toBeVisible()
    
    // Start assessment
    await page.click('text=Begin Elite Assessment')
    
    // PHASE 1: QUALIFICATION (5 questions)
    
    // Question 1: Select disqualifying answer (beginner)
    await expect(page.locator('text=What best describes your current performance level?')).toBeVisible()
    await page.click('text=Just starting my fitness journey')
    await page.click('text=Next')
    
    // Question 2: Should still show next question, not results
    await expect(page.locator('text=Question 2 of 5')).toBeVisible()
    await expect(page.locator('text=investment in performance optimisation')).toBeVisible()
    await page.click('text=Under £1,000')
    await page.click('text=Next')
    
    // Question 3
    await expect(page.locator('text=Question 3 of 5')).toBeVisible()
    await expect(page.locator('text=commitment level')).toBeVisible()
    await page.click('text=1-2 hours')
    await page.click('text=Next')
    
    // Question 4
    await expect(page.locator('text=Question 4 of 5')).toBeVisible()
    await expect(page.locator('text=decision timeline')).toBeVisible()
    await page.click('text=Just exploring')
    await page.click('text=Next')
    
    // Question 5
    await expect(page.locator('text=Question 5 of 5')).toBeVisible()
    await expect(page.locator('text=primary objective')).toBeVisible()
    await page.click('text=General fitness')
    await page.click('text=Next')
    
    // PHASE 2: AUDIT (9 questions) - Should continue despite disqualification
    await expect(page.locator('text=Performance Audit')).toBeVisible()
    await expect(page.locator('text=Question 1 of 9')).toBeVisible()
    
    // Verify we're not showing results yet
    await expect(page.locator('text=Assessment Complete')).not.toBeVisible()
    await expect(page.locator('text=Building Foundation')).not.toBeVisible()
    
    // Complete one audit question to verify flow continues
    await page.click('text=Rarely')
    await page.click('text=Next')
    
    // Verify question 2 of audit phase appears
    await expect(page.locator('text=Question 2 of 9')).toBeVisible()
    
    // Test back button
    await page.click('text=Back')
    await expect(page.locator('text=Question 1 of 9')).toBeVisible()
    
    console.log('✅ Assessment flow test passed - all questions shown despite disqualification')
  })
  
  test('should track overall progress correctly', async ({ page }) => {
    await page.goto('http://localhost:3005/assessment')
    
    // Start assessment
    await page.click('text=Begin Elite Assessment')
    
    // Check initial progress
    await expect(page.locator('text=Overall Progress:')).toBeVisible()
    await expect(page.locator('text=0 of 18 questions')).toBeVisible()
    
    // Answer first question
    await page.click('text=Competitive athlete')
    await page.click('text=Next')
    
    // Check progress updated
    await expect(page.locator('text=1 of 18 questions')).toBeVisible()
    
    console.log('✅ Progress tracking test passed')
  })
  
  test('should have proper mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('http://localhost:3005/assessment')
    
    // Check elements are visible on mobile
    await expect(page.locator('text=Elite Performance Assessment')).toBeVisible()
    await expect(page.locator('.w-20.h-20')).toBeVisible() // Mobile-sized icon
    
    // Start assessment
    await page.click('text=Begin Elite Assessment')
    
    // Check mobile layout
    await expect(page.locator('text=Qualification')).toBeVisible()
    await expect(page.locator('.flex.flex-col.sm\\:flex-row')).toBeVisible()
    
    // Test scrolling if needed
    const questionText = await page.locator('text=What best describes your current performance level?')
    await expect(questionText).toBeVisible()
    
    console.log('✅ Mobile responsiveness test passed')
  })
})