import { test, expect } from '@playwright/test';

test('debug visual rendering issues', async ({ page }) => {
  await page.goto('http://localhost:3004');
  
  // Check if sections are visible
  const heroSection = page.locator('#hero');
  const assessmentSection = page.locator('#assessment-tool');
  const contactSection = page.locator('#contact');
  
  // Check visibility
  await expect(heroSection).toBeVisible();
  await expect(assessmentSection).toBeVisible();
  await expect(contactSection).toBeVisible();
  
  // Check computed styles for hero section
  const heroStyles = await heroSection.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      padding: styles.padding,
      paddingLeft: styles.paddingLeft,
      paddingRight: styles.paddingRight,
      minHeight: styles.minHeight,
    };
  });
  
  console.log('Hero Section Styles:', heroStyles);
  
  // Check for background colors on child elements
  const heroBg = await page.locator('#hero > div').first().evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage,
    };
  });
  
  console.log('Hero Background Div:', heroBg);
  
  // Check container styles
  const heroContainer = await page.locator('#hero .max-w-7xl').evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      maxWidth: styles.maxWidth,
      marginLeft: styles.marginLeft,
      marginRight: styles.marginRight,
      paddingLeft: styles.paddingLeft,
      paddingRight: styles.paddingRight,
    };
  });
  
  console.log('Hero Container Styles:', heroContainer);
  
  // Check text color
  const heroHeading = await page.locator('#hero h1').evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      color: styles.color,
      fontSize: styles.fontSize,
    };
  });
  
  console.log('Hero Heading Styles:', heroHeading);
  
  // Take screenshot for manual inspection
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
});