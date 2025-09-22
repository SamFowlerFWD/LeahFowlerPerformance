import { chromium } from 'playwright';

async function testVisualLayout() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  
  console.log('📸 Visual Layout Testing...\n');
  
  // Test Desktop View
  console.log('🖥️  Desktop View (1920x1080)');
  const desktopPage = await context.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });
  await desktopPage.goto('http://localhost:3004');
  await desktopPage.waitForLoadState('networkidle');
  
  // Check container padding
  const desktopContainer = await desktopPage.locator('.container').first();
  const desktopStyles = await desktopContainer.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight,
      marginLeft: computed.marginLeft,
      marginRight: computed.marginRight,
      width: computed.width
    };
  });
  console.log('  Container styles:', desktopStyles);
  
  // Take desktop screenshot
  await desktopPage.screenshot({ path: 'desktop-layout.png', fullPage: false });
  console.log('  ✅ Screenshot saved: desktop-layout.png\n');
  
  // Test Tablet View
  console.log('📱 Tablet View (768x1024)');
  const tabletPage = await context.newPage();
  await tabletPage.setViewportSize({ width: 768, height: 1024 });
  await tabletPage.goto('http://localhost:3004');
  await tabletPage.waitForLoadState('networkidle');
  
  const tabletContainer = await tabletPage.locator('.container').first();
  const tabletStyles = await tabletContainer.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight,
      marginLeft: computed.marginLeft,
      marginRight: computed.marginRight,
      width: computed.width
    };
  });
  console.log('  Container styles:', tabletStyles);
  
  // Take tablet screenshot
  await tabletPage.screenshot({ path: 'tablet-layout.png', fullPage: false });
  console.log('  ✅ Screenshot saved: tablet-layout.png\n');
  
  // Test Mobile View
  console.log('📱 Mobile View (375x667)');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 667 });
  await mobilePage.goto('http://localhost:3004');
  await mobilePage.waitForLoadState('networkidle');
  
  const mobileContainer = await mobilePage.locator('.container').first();
  const mobileStyles = await mobileContainer.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight,
      marginLeft: computed.marginLeft,
      marginRight: computed.marginRight,
      width: computed.width
    };
  });
  console.log('  Container styles:', mobileStyles);
  
  // Take mobile screenshot
  await mobilePage.screenshot({ path: 'mobile-layout.png', fullPage: false });
  console.log('  ✅ Screenshot saved: mobile-layout.png\n');
  
  // Check specific sections
  console.log('🔍 Checking Individual Sections...\n');
  
  const sections = [
    { id: '#assessment', name: 'Assessment' },
    { id: '#programmes', name: 'Programmes' },
    { id: '#about', name: 'About' },
    { id: '#testimonials', name: 'Testimonials' },
    { id: '#contact', name: 'Contact' }
  ];
  
  for (const section of sections) {
    await desktopPage.goto(`http://localhost:3004${section.id}`);
    await desktopPage.waitForTimeout(500);
    
    const sectionElement = await desktopPage.locator(section.id).first();
    const sectionBox = await sectionElement.boundingBox();
    
    if (sectionBox) {
      console.log(`${section.name} Section:`);
      console.log(`  Width: ${sectionBox.width}px`);
      console.log(`  Left position: ${sectionBox.x}px`);
      console.log(`  ✅ Centered: ${sectionBox.x > 0 ? 'Yes' : 'Check needed'}\n`);
    }
  }
  
  console.log('✨ Visual testing complete!');
  console.log('📁 Screenshots saved in project root directory');
  
  await browser.close();
}

testVisualLayout().catch(console.error);