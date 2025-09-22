import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  // Capture network errors
  page.on('requestfailed', request => {
    console.log('Request failed:', request.url(), request.failure().errorText);
  });
  
  try {
    console.log('Loading page...');
    await page.goto(`${BASE_URL}/performance-accelerator`, { 
      waitUntil: 'networkidle'
    });
    
    console.log('\nWaiting for dynamic components...');
    await page.waitForTimeout(5000);
    
    // Check for metric cards
    const metricCards = await page.$$('.card');
    console.log(`\nFound ${metricCards.length} cards on page`);
    
    // Check specific metric card structure
    const metricsSection = await page.$('.grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-5');
    if (metricsSection) {
      const cards = await metricsSection.$$('.card');
      console.log(`Found ${cards.length} metric cards in grid`);
      
      // Check card content
      for (let i = 0; i < Math.min(3, cards.length); i++) {
        const cardText = await cards[i].textContent();
        console.log(`Card ${i + 1}: ${cardText}`);
      }
    }
    
    // Check for loading placeholders
    const placeholders = await page.$$('.animate-pulse');
    console.log(`\n${placeholders.length} loading placeholders still present`);
    
    // Check tab states
    const barriersTab = await page.$('[role="tab"]:has-text("Barrier Analysis")');
    if (barriersTab) {
      const disabled = await barriersTab.getAttribute('data-disabled');
      const ariaDisabled = await barriersTab.getAttribute('aria-disabled');
      const isDisabled = await barriersTab.isDisabled();
      console.log(`\nBarriers tab - data-disabled: ${disabled}, aria-disabled: ${ariaDisabled}, isDisabled: ${isDisabled}`);
    }
    
    // Check console messages
    console.log('\nConsole Messages:');
    consoleMessages.forEach(msg => {
      if (msg.type === 'error') {
        console.log(`ERROR: ${msg.text}`);
        if (msg.location) {
          console.log(`  at ${msg.location.url}:${msg.location.lineNumber}`);
        }
      } else if (msg.type === 'warning') {
        console.log(`WARNING: ${msg.text}`);
      }
    });
    
    // Check buttons without text
    const buttons = await page.$$('button');
    let buttonsWithoutText = 0;
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      if (!text?.trim() && !ariaLabel) {
        buttonsWithoutText++;
        const classes = await button.getAttribute('class');
        console.log(`\nButton without accessible text: ${classes?.substring(0, 50)}...`);
      }
    }
    console.log(`\nTotal buttons without accessible text: ${buttonsWithoutText}`);
    
    // Wait for user to inspect
    console.log('\nBrowser window open for inspection. Press Ctrl+C to close.');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();