// Find the actual hero CTA container
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext({ viewport: { width: 375, height: 667 } }).then(ctx => ctx.newPage());

  await page.goto('http://localhost:3007', { waitUntil: 'networkidle' });

  // Find all containers with "Apply for Coaching"
  const applyLinks = await page.locator('a:has-text("Apply for Coaching")').all();
  console.log(`Found ${applyLinks.length} "Apply for Coaching" links\n`);

  for (let i = 0; i < applyLinks.length; i++) {
    const link = applyLinks[i];
    const href = await link.getAttribute('href');
    const parent = await link.locator('..').first();
    const parentClasses = await parent.getAttribute('class');
    const grandparent = await link.locator('../..').first();
    const grandparentClasses = await grandparent.getAttribute('class');

    console.log(`Link ${i + 1}:`);
    console.log(`  href: ${href}`);
    console.log(`  Parent classes: ${parentClasses}`);
    console.log(`  Grandparent classes: ${grandparentClasses}`);
    console.log('');
  }

  await browser.close();
})();