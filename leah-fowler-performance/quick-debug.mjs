import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console messages
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    await page.goto(`${BASE_URL}/performance-accelerator`, { 
      waitUntil: 'domcontentloaded'
    });
    
    await page.waitForTimeout(3000);
    
    // Check for metric cards - use correct selector
    const metricsGrid = await page.$('.grid.grid-cols-2');
    let metricCards = 0;
    if (metricsGrid) {
      const cards = await metricsGrid.$$('div[data-slot="card"], .card');
      metricCards = cards.length;
    }
    console.log(`Metric cards found: ${metricCards}`);
    
    // Check for loading placeholders
    const placeholders = await page.$$('.animate-pulse');
    console.log(`Loading placeholders: ${placeholders.length}`);
    
    // Check tab states
    const barriersTab = await page.$('[role="tab"]:nth-of-type(2)');
    if (barriersTab) {
      const disabled = await barriersTab.getAttribute('data-disabled');
      const ariaDisabled = await barriersTab.getAttribute('aria-disabled');
      console.log(`Barriers tab disabled: data-disabled=${disabled}, aria-disabled=${ariaDisabled}`);
    }
    
    // Check buttons without text
    const navigationDots = await page.$$('button.rounded-full');
    console.log(`Navigation dots: ${navigationDots.length}`);
    
    // Console errors
    console.log(`Console errors: ${consoleErrors.length}`);
    consoleErrors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.substring(0, 100)}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();