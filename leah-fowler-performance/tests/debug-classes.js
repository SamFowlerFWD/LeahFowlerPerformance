// Debug script to check actual classes
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext({ viewport: { width: 375, height: 667 } }).then(ctx => ctx.newPage());

  await page.goto('http://localhost:3007', { waitUntil: 'domcontentloaded' });

  // Check CTA container
  const ctaContainers = await page.locator('.flex.flex-col').all();
  for (let i = 0; i < ctaContainers.length; i++) {
    const classes = await ctaContainers[i].getAttribute('class');
    const hasButton = await ctaContainers[i].locator('button').count() > 0 ||
                      await ctaContainers[i].locator('a button').count() > 0;
    if (hasButton) {
      console.log(`CTA Container ${i} classes:`, classes);
    }
  }

  // Check logo container
  const logoContainers = await page.locator('.relative').all();
  for (let i = 0; i < logoContainers.length; i++) {
    const hasLogo = await logoContainers[i].locator('img[alt*="Strength"]').count() > 0;
    if (hasLogo) {
      const classes = await logoContainers[i].getAttribute('class');
      console.log(`Logo Container ${i} classes:`, classes);

      const img = await logoContainers[i].locator('img').first();
      const imgClasses = await img.getAttribute('class');
      console.log(`Logo Image classes:`, imgClasses);
    }
  }

  await browser.close();
})();