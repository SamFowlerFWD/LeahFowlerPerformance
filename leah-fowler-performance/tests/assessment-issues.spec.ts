import { test, expect } from '@playwright/test'

test.describe('Assessment Tool Issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/assessment')
    await page.waitForLoadState('networkidle')
  })

  test('Document current assessment issues', async ({ page }) => {
    // Test 1: Check intro screen loads correctly
    await expect(page.locator('h2:has-text("Elite Performance Assessment")')).toBeVisible()
    await expect(page.locator('text=Begin Elite Assessment')).toBeVisible()
    
    // Click to start assessment
    await page.click('text=Begin Elite Assessment')
    await page.waitForTimeout(500)
    
    // Test 2: Check qualification phase loads with questions
    const qualificationQuestions = page.locator('[data-phase="qualification"]')
    
    // Look for question text
    const questionText = await page.locator('h3').textContent()
    console.log('Current question text:', questionText)
    
    // Count visible question options
    const optionButtons = page.locator('button').filter({ hasText: /training|performance|investment/ })
    const optionCount = await optionButtons.count()
    console.log('Number of visible options:', optionCount)
    
    // Check progress indicator
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()
    
    // Check question counter
    const questionCounter = page.locator('text=/Question \\d+ of \\d+/')
    const counterText = await questionCounter.textContent()
    console.log('Question counter:', counterText)
    
    // Try to answer first question and proceed
    const firstOption = page.locator('button').filter({ hasText: /competitive|elite|executive/ }).first()
    if (await firstOption.isVisible()) {
      await firstOption.click()
      await page.waitForTimeout(300)
      
      // Try to click Next
      const nextButton = page.locator('button:has-text("Next")')
      await expect(nextButton).toBeVisible()
      await nextButton.click()
      await page.waitForTimeout(500)
      
      // Check if we moved to next question
      const newQuestionText = await page.locator('h3').textContent()
      console.log('Next question text:', newQuestionText)
    }
  })
  
  test('Check all phases have multiple questions', async ({ page }) => {
    // Start assessment
    await page.click('text=Begin Elite Assessment')
    await page.waitForTimeout(500)
    
    // Track questions seen
    const questionsLog = []
    
    // Qualification phase
    console.log('--- QUALIFICATION PHASE ---')
    for (let i = 0; i < 5; i++) {
      const questionText = await page.locator('h3').first().textContent()
      const counterText = await page.locator('text=/Question \\d+ of \\d+/').textContent()
      questionsLog.push({ phase: 'qualification', question: questionText, counter: counterText })
      console.log(`Q${i + 1}: ${questionText} | ${counterText}`)
      
      // Answer and proceed if possible
      const option = page.locator('button').filter({ hasText: /elite|5000|15-20|over/ }).first()
      if (await option.isVisible()) {
        await option.click()
        await page.waitForTimeout(200)
        
        const nextButton = page.locator('button:has-text("Next")')
        if (await nextButton.isEnabled()) {
          await nextButton.click()
          await page.waitForTimeout(500)
        } else {
          break
        }
      } else {
        break
      }
    }
    
    // Check if we're in audit phase
    const phaseIndicator = await page.locator('[data-testid="phase-badge"], .badge').textContent()
    console.log('Current phase indicator:', phaseIndicator)
  })
  
  test('Check visual styling and padding issues', async ({ page }) => {
    await page.click('text=Begin Elite Assessment')
    await page.waitForTimeout(500)
    
    // Take screenshots of issues
    await page.screenshot({ path: 'assessment-question-view.png', fullPage: true })
    
    // Check card padding
    const card = page.locator('.card, [class*="Card"]').first()
    const cardPadding = await card.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight
      }
    })
    console.log('Card padding:', cardPadding)
    
    // Check spacing between elements
    const questionContainer = page.locator('h3').first()
    const questionMargins = await questionContainer.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom
      }
    })
    console.log('Question margins:', questionMargins)
  })
  
  test('Test mobile responsiveness', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('http://localhost:3000/assessment')
      await page.waitForLoadState('networkidle')
      
      console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`)
      
      await page.click('text=Begin Elite Assessment')
      await page.waitForTimeout(500)
      
      // Check if elements are visible and properly sized
      const card = page.locator('.card, [class*="Card"]').first()
      const cardBox = await card.boundingBox()
      console.log(`Card width on ${viewport.name}:`, cardBox?.width)
      
      // Check for overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      console.log(`Has horizontal overflow on ${viewport.name}:`, hasOverflow)
      
      await page.screenshot({ path: `assessment-${viewport.name.toLowerCase().replace(' ', '-')}.png` })
    }
  })
})