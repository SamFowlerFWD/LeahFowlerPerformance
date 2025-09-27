const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3004');
  await page.waitForLoadState('networkidle');

  console.log('\n=== DIAGNOSING EXCESSIVE HEIGHT ISSUE ===\n');

  // Check the OnlinePackageShowcase section specifically
  const onlinePackageInfo = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s =>
      s.textContent?.includes('Online Package')
    );

    if (!section) return { found: false };

    const styles = window.getComputedStyle(section);
    const rect = section.getBoundingClientRect();

    // Get all child elements and their heights
    const children = Array.from(section.querySelectorAll('*')).slice(0, 20); // First 20 children
    const childInfo = children.map(child => {
      const childStyles = window.getComputedStyle(child);
      const childRect = child.getBoundingClientRect();
      return {
        tag: child.tagName,
        class: child.className,
        height: childRect.height,
        marginTop: childStyles.marginTop,
        marginBottom: childStyles.marginBottom,
        paddingTop: childStyles.paddingTop,
        paddingBottom: childStyles.paddingBottom,
        display: childStyles.display,
        text: child.textContent?.substring(0, 30)
      };
    });

    // Get direct children
    const directChildren = Array.from(section.children);
    const directChildInfo = directChildren.map(child => {
      const childRect = child.getBoundingClientRect();
      const childStyles = window.getComputedStyle(child);
      return {
        tag: child.tagName,
        class: child.className,
        height: childRect.height,
        marginBottom: childStyles.marginBottom,
        paddingBottom: childStyles.paddingBottom
      };
    });

    return {
      found: true,
      totalHeight: rect.height,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      className: section.className,
      childCount: section.children.length,
      directChildren: directChildInfo,
      firstChildren: childInfo
    };
  });

  if (onlinePackageInfo.found) {
    console.log('OnlinePackageShowcase Section:');
    console.log(`  Total Height: ${onlinePackageInfo.totalHeight}px`);
    console.log(`  Padding Top: ${onlinePackageInfo.paddingTop}`);
    console.log(`  Padding Bottom: ${onlinePackageInfo.paddingBottom}`);
    console.log(`  Direct Child Count: ${onlinePackageInfo.childCount}`);
    console.log(`  Class: ${onlinePackageInfo.className}`);
    console.log('\n  Direct Children:');
    onlinePackageInfo.directChildren.forEach((child, i) => {
      console.log(`    ${i}. ${child.tag}.${child.class}`);
      console.log(`       Height: ${child.height}px`);
      console.log(`       Margin Bottom: ${child.marginBottom}`);
      console.log(`       Padding Bottom: ${child.paddingBottom}`);
    });
  }

  // Check for FAQ section too
  console.log('\n\n=== FAQ SECTION ===\n');
  const faqInfo = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s =>
      s.textContent?.includes('FAQ') || s.textContent?.includes('Questions')
    );

    if (!section) return { found: false };

    const styles = window.getComputedStyle(section);
    const rect = section.getBoundingClientRect();

    // Get accordion items
    const accordionItems = section.querySelectorAll('[data-radix-collection-item], [data-state], button[type="button"]');

    return {
      found: true,
      totalHeight: rect.height,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      className: section.className,
      accordionCount: accordionItems.length
    };
  });

  if (faqInfo.found) {
    console.log('FAQ Section:');
    console.log(`  Total Height: ${faqInfo.totalHeight}px`);
    console.log(`  Padding Top: ${faqInfo.paddingTop}`);
    console.log(`  Padding Bottom: ${faqInfo.paddingBottom}`);
    console.log(`  Accordion Items: ${faqInfo.accordionCount}`);
    console.log(`  Class: ${faqInfo.className}`);
  }

  // Check specific elements in OnlinePackageShowcase for excessive spacing
  console.log('\n\n=== CHECKING FOR SPACING ISSUES ===\n');

  const spacingIssues = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s =>
      s.textContent?.includes('Online Package')
    );

    if (!section) return [];

    const issues = [];
    const elements = section.querySelectorAll('*');

    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Check for excessive margins or paddings
      const marginTop = parseFloat(styles.marginTop);
      const marginBottom = parseFloat(styles.marginBottom);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);

      if (marginTop > 100 || marginBottom > 100 || paddingTop > 100 || paddingBottom > 100) {
        issues.push({
          tag: el.tagName,
          class: el.className,
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          height: rect.height
        });
      }

      // Check for elements with huge heights
      if (rect.height > 1000) {
        issues.push({
          tag: el.tagName,
          class: el.className,
          height: rect.height,
          issue: 'Excessive height'
        });
      }
    });

    return issues;
  });

  if (spacingIssues.length > 0) {
    console.log('Found spacing issues:');
    spacingIssues.forEach(issue => {
      console.log(`  ${issue.tag}.${issue.class}`);
      if (issue.marginTop) console.log(`    Margin Top: ${issue.marginTop}px`);
      if (issue.marginBottom) console.log(`    Margin Bottom: ${issue.marginBottom}px`);
      if (issue.paddingTop) console.log(`    Padding Top: ${issue.paddingTop}px`);
      if (issue.paddingBottom) console.log(`    Padding Bottom: ${issue.paddingBottom}px`);
      if (issue.height) console.log(`    Height: ${issue.height}px`);
      if (issue.issue) console.log(`    Issue: ${issue.issue}`);
      console.log('');
    });
  }

  console.log('\nBrowser will stay open for inspection.');
})();