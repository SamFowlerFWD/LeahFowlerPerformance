import { chromium } from 'playwright';

async function testLayout() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('🔍 Testing Layout Centering and Padding...\n');
  
  await page.goto('http://localhost:3004');
  await page.waitForLoadState('networkidle');
  
  // Test Header Layout
  console.log('📌 Testing Header...');
  const header = await page.locator('header').first();
  const headerBox = await header.boundingBox();
  console.log(`  Header width: ${headerBox?.width}px`);
  
  const headerContainer = await page.locator('header .container').first();
  const headerContainerBox = await headerContainer.boundingBox();
  console.log(`  Header container width: ${headerContainerBox?.width}px`);
  console.log(`  Header container left: ${headerContainerBox?.x}px`);
  
  // Test if header is centered
  const viewportWidth = 1920;
  const expectedMargin = (viewportWidth - (headerContainerBox?.width || 0)) / 2;
  const actualLeftMargin = headerContainerBox?.x || 0;
  console.log(`  Expected margin: ${expectedMargin}px, Actual: ${actualLeftMargin}px`);
  console.log(`  ✅ Header is ${Math.abs(expectedMargin - actualLeftMargin) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Hero Section
  console.log('🚀 Testing Hero Section...');
  const heroContainer = await page.locator('#main section').first().locator('.container').first();
  const heroBox = await heroContainer.boundingBox();
  console.log(`  Hero container width: ${heroBox?.width}px`);
  console.log(`  Hero container left: ${heroBox?.x}px`);
  const heroExpectedMargin = (viewportWidth - (heroBox?.width || 0)) / 2;
  console.log(`  ✅ Hero is ${Math.abs(heroExpectedMargin - (heroBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Assessment Section
  console.log('📊 Testing Assessment Section...');
  const assessmentContainer = await page.locator('#assessment .container').first();
  const assessmentBox = await assessmentContainer.boundingBox();
  console.log(`  Assessment container width: ${assessmentBox?.width}px`);
  console.log(`  Assessment container left: ${assessmentBox?.x}px`);
  
  const assessmentTool = await page.locator('#assessment .max-w-4xl').first();
  const assessmentToolBox = await assessmentTool.boundingBox();
  console.log(`  Assessment tool width: ${assessmentToolBox?.width}px`);
  console.log(`  Assessment tool left: ${assessmentToolBox?.x}px`);
  const assessmentExpectedMargin = (viewportWidth - (assessmentToolBox?.width || 0)) / 2;
  console.log(`  ✅ Assessment tool is ${Math.abs(assessmentExpectedMargin - (assessmentToolBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Programmes Section
  console.log('💼 Testing Programmes Section...');
  const programmesContainer = await page.locator('#programmes .container').first();
  const programmesBox = await programmesContainer.boundingBox();
  console.log(`  Programmes container width: ${programmesBox?.width}px`);
  console.log(`  Programmes container left: ${programmesBox?.x}px`);
  
  const programmesGrid = await page.locator('#programmes .max-w-7xl').first();
  const programmesGridBox = await programmesGrid.boundingBox();
  console.log(`  Programmes grid width: ${programmesGridBox?.width}px`);
  console.log(`  Programmes grid left: ${programmesGridBox?.x}px`);
  const programmesExpectedMargin = (viewportWidth - (programmesGridBox?.width || 0)) / 2;
  console.log(`  ✅ Programmes grid is ${Math.abs(programmesExpectedMargin - (programmesGridBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test About Section
  console.log('👤 Testing About Section...');
  const aboutContainer = await page.locator('#about .container').first();
  const aboutBox = await aboutContainer.boundingBox();
  console.log(`  About container width: ${aboutBox?.width}px`);
  console.log(`  About container left: ${aboutBox?.x}px`);
  const aboutExpectedMargin = (viewportWidth - (aboutBox?.width || 0)) / 2;
  console.log(`  ✅ About section is ${Math.abs(aboutExpectedMargin - (aboutBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Testimonials Section
  console.log('⭐ Testing Testimonials Section...');
  const testimonialsContainer = await page.locator('#testimonials .container').first();
  const testimonialsBox = await testimonialsContainer.boundingBox();
  console.log(`  Testimonials container width: ${testimonialsBox?.width}px`);
  console.log(`  Testimonials container left: ${testimonialsBox?.x}px`);
  
  const carousel = await page.locator('#testimonials .max-w-5xl').first();
  const carouselBox = await carousel.boundingBox();
  console.log(`  Carousel width: ${carouselBox?.width}px`);
  console.log(`  Carousel left: ${carouselBox?.x}px`);
  const carouselExpectedMargin = (viewportWidth - (carouselBox?.width || 0)) / 2;
  console.log(`  ✅ Carousel is ${Math.abs(carouselExpectedMargin - (carouselBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Contact Section
  console.log('📧 Testing Contact Section...');
  const contactContainer = await page.locator('#contact .container').first();
  const contactBox = await contactContainer.boundingBox();
  console.log(`  Contact container width: ${contactBox?.width}px`);
  console.log(`  Contact container left: ${contactBox?.x}px`);
  
  const contactForm = await page.locator('#contact .max-w-5xl').first();
  const contactFormBox = await contactForm.boundingBox();
  console.log(`  Contact form width: ${contactFormBox?.width}px`);
  console.log(`  Contact form left: ${contactFormBox?.x}px`);
  const contactExpectedMargin = (viewportWidth - (contactFormBox?.width || 0)) / 2;
  console.log(`  ✅ Contact form is ${Math.abs(contactExpectedMargin - (contactFormBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test Footer
  console.log('🦶 Testing Footer...');
  const footerContainer = await page.locator('footer .container').first();
  const footerBox = await footerContainer.boundingBox();
  console.log(`  Footer container width: ${footerBox?.width}px`);
  console.log(`  Footer container left: ${footerBox?.x}px`);
  const footerExpectedMargin = (viewportWidth - (footerBox?.width || 0)) / 2;
  console.log(`  ✅ Footer is ${Math.abs(footerExpectedMargin - (footerBox?.x || 0)) < 10 ? 'CENTERED' : 'NOT CENTERED'}\n`);
  
  // Test on different screen sizes
  console.log('📱 Testing Responsive Layout...\n');
  
  // Tablet view
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  console.log('Tablet View (768px):');
  const tabletHeader = await page.locator('header .container').first();
  const tabletHeaderBox = await tabletHeader.boundingBox();
  console.log(`  Header container width: ${tabletHeaderBox?.width}px`);
  console.log(`  Header container left: ${tabletHeaderBox?.x}px`);
  console.log(`  ✅ Tablet layout is ${tabletHeaderBox?.x && tabletHeaderBox.x >= 16 ? 'PROPERLY PADDED' : 'NOT PROPERLY PADDED'}\n`);
  
  // Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  console.log('Mobile View (375px):');
  const mobileHeader = await page.locator('header .container').first();
  const mobileHeaderBox = await mobileHeader.boundingBox();
  console.log(`  Header container width: ${mobileHeaderBox?.width}px`);
  console.log(`  Header container left: ${mobileHeaderBox?.x}px`);
  console.log(`  ✅ Mobile layout is ${mobileHeaderBox?.x && mobileHeaderBox.x >= 16 ? 'PROPERLY PADDED' : 'NOT PROPERLY PADDED'}\n`);
  
  // Check for horizontal scrolling
  await page.setViewportSize({ width: 1920, height: 1080 });
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const windowWidth = await page.evaluate(() => window.innerWidth);
  console.log('🔍 Horizontal Scroll Check:');
  console.log(`  Body width: ${bodyWidth}px`);
  console.log(`  Window width: ${windowWidth}px`);
  console.log(`  ✅ ${bodyWidth <= windowWidth ? 'NO HORIZONTAL SCROLL' : '❌ HORIZONTAL SCROLL DETECTED!'}\n`);
  
  console.log('✨ Layout testing complete!');
  
  await browser.close();
}

testLayout().catch(console.error);