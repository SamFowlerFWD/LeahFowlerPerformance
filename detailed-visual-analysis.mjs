import { chromium } from 'playwright';

async function detailedAnalysis() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔬 DETAILED VISUAL ANALYSIS - LEAH FOWLER PERFORMANCE\n');
  console.log('=' .repeat(80) + '\n');

  // Test Mobile View
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('📱 MOBILE VIEW (375px) - HOMEPAGE\n');
  console.log('-'.repeat(40));

  // 1. HERO SECTION ANALYSIS
  console.log('\n1. HERO SECTION:');
  const hero = await page.$('section:first-of-type, .hero, [class*="hero"]');
  if (hero) {
    const heroData = await hero.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const heading = el.querySelector('h1');
      const button = el.querySelector('button, a[role="button"]');

      return {
        height: rect.height,
        padding: {
          top: styles.paddingTop,
          bottom: styles.paddingBottom,
          left: styles.paddingLeft,
          right: styles.paddingRight
        },
        heading: heading ? {
          fontSize: window.getComputedStyle(heading).fontSize,
          lineHeight: window.getComputedStyle(heading).lineHeight,
          marginBottom: window.getComputedStyle(heading).marginBottom
        } : null,
        button: button ? {
          width: button.offsetWidth,
          height: button.offsetHeight,
          padding: window.getComputedStyle(button).padding
        } : null
      };
    });

    console.log(`   Height: ${heroData.height}px`);
    console.log(`   Padding: T:${heroData.padding.top} R:${heroData.padding.right} B:${heroData.padding.bottom} L:${heroData.padding.left}`);
    if (heroData.heading) {
      console.log(`   H1: ${heroData.heading.fontSize}, line-height: ${heroData.heading.lineHeight}`);
    }
    if (heroData.button) {
      console.log(`   CTA Button: ${heroData.button.width}x${heroData.button.height}px`);
    }
  }

  // 2. NAVIGATION ANALYSIS
  console.log('\n2. NAVIGATION:');
  const nav = await page.$('nav, header');
  if (nav) {
    const navData = await nav.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const logo = el.querySelector('img, svg, [class*="logo"]');
      const menuButton = el.querySelector('button');

      return {
        height: rect.height,
        padding: styles.padding,
        logo: logo ? {
          width: logo.offsetWidth,
          height: logo.offsetHeight
        } : null,
        menuButton: menuButton ? {
          width: menuButton.offsetWidth,
          height: menuButton.offsetHeight
        } : null
      };
    });

    console.log(`   Height: ${navData.height}px`);
    console.log(`   Padding: ${navData.padding}`);
    if (navData.logo) {
      console.log(`   Logo: ${navData.logo.width}x${navData.logo.height}px`);
    }
    if (navData.menuButton) {
      console.log(`   Menu Button: ${navData.menuButton.width}x${navData.menuButton.height}px`);
    }
  }

  // 3. SERVICES/FEATURES SECTION
  console.log('\n3. SERVICES/FEATURES CARDS:');
  const serviceCards = await page.$$('[class*="service"], [class*="feature"], .grid > div');
  if (serviceCards.length > 0) {
    const firstCard = serviceCards[0];
    const cardData = await firstCard.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        padding: styles.padding,
        margin: styles.margin,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
      };
    });

    console.log(`   Card Size: ${cardData.width}x${cardData.height}px`);
    console.log(`   Padding: ${cardData.padding}`);
    console.log(`   Border Radius: ${cardData.borderRadius}`);
    console.log(`   Shadow: ${cardData.boxShadow}`);
    console.log(`   Total Cards Found: ${serviceCards.length}`);
  }

  // 4. FORM ELEMENTS
  console.log('\n4. FORM ELEMENTS:');
  const forms = await page.$$('form');
  if (forms.length > 0) {
    const firstForm = forms[0];
    const formData = await firstForm.evaluate(form => {
      const input = form.querySelector('input[type="text"], input[type="email"]');
      const button = form.querySelector('button[type="submit"], button');
      const label = form.querySelector('label');

      return {
        input: input ? {
          height: input.offsetHeight,
          padding: window.getComputedStyle(input).padding,
          fontSize: window.getComputedStyle(input).fontSize
        } : null,
        button: button ? {
          height: button.offsetHeight,
          width: button.offsetWidth,
          padding: window.getComputedStyle(button).padding
        } : null,
        label: label ? {
          marginBottom: window.getComputedStyle(label).marginBottom
        } : null
      };
    });

    if (formData.input) {
      console.log(`   Input Height: ${formData.input.height}px`);
      console.log(`   Input Padding: ${formData.input.padding}`);
      console.log(`   Input Font: ${formData.input.fontSize}`);
    }
    if (formData.button) {
      console.log(`   Submit Button: ${formData.button.width}x${formData.button.height}px`);
      console.log(`   Button Padding: ${formData.button.padding}`);
    }
  }

  // 5. PRICING SECTION
  console.log('\n5. PRICING CARDS:');
  const pricingCards = await page.$$('[class*="pricing"], [class*="plan"], [class*="tier"]');
  if (pricingCards.length > 0) {
    const firstPricing = pricingCards[0];
    const pricingData = await firstPricing.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const price = el.querySelector('[class*="price"], h3, .text-3xl, .text-4xl');

      return {
        width: rect.width,
        height: rect.height,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
        priceSize: price ? window.getComputedStyle(price).fontSize : null
      };
    });

    console.log(`   Card Size: ${pricingData.width}x${pricingData.height}px`);
    console.log(`   Padding: ${pricingData.padding}`);
    console.log(`   Border Radius: ${pricingData.borderRadius}`);
    if (pricingData.priceSize) {
      console.log(`   Price Font Size: ${pricingData.priceSize}`);
    }
    console.log(`   Total Pricing Cards: ${pricingCards.length}`);
  }

  // 6. TESTIMONIALS
  console.log('\n6. TESTIMONIALS:');
  const testimonials = await page.$$('[class*="testimonial"], blockquote');
  if (testimonials.length > 0) {
    const firstTestimonial = testimonials[0];
    const testimonialData = await firstTestimonial.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);

      return {
        width: rect.width,
        padding: styles.padding,
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight
      };
    });

    console.log(`   Width: ${testimonialData.width}px`);
    console.log(`   Padding: ${testimonialData.padding}`);
    console.log(`   Font: ${testimonialData.fontSize}, line-height: ${testimonialData.lineHeight}`);
  }

  // 7. FOOTER
  console.log('\n7. FOOTER:');
  const footer = await page.$('footer');
  if (footer) {
    const footerData = await footer.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const links = el.querySelectorAll('a');

      return {
        height: rect.height,
        padding: styles.padding,
        backgroundColor: styles.backgroundColor,
        linkCount: links.length,
        firstLinkSize: links[0] ? {
          width: links[0].offsetWidth,
          height: links[0].offsetHeight
        } : null
      };
    });

    console.log(`   Height: ${footerData.height}px`);
    console.log(`   Padding: ${footerData.padding}`);
    console.log(`   Background: ${footerData.backgroundColor}`);
    console.log(`   Link Count: ${footerData.linkCount}`);
    if (footerData.firstLinkSize) {
      console.log(`   Link Touch Target: ${footerData.firstLinkSize.width}x${footerData.firstLinkSize.height}px`);
    }
  }

  // 8. SPACING ANALYSIS
  console.log('\n8. SECTION SPACING:');
  const sections = await page.$$('section, main > div:not([class*="container"])');
  const gaps = [];
  let prevBottom = 0;

  for (let i = 0; i < Math.min(sections.length, 5); i++) {
    const section = sections[i];
    const bounds = await section.boundingBox();
    if (bounds) {
      if (prevBottom > 0) {
        const gap = bounds.y - prevBottom;
        gaps.push(gap);
        console.log(`   Gap after Section ${i}: ${gap}px`);
      }
      prevBottom = bounds.y + bounds.height;
    }
  }

  // Switch to Desktop View for comparison
  console.log('\n' + '='.repeat(80));
  console.log('\n💻 DESKTOP VIEW (1440px) - HOMEPAGE\n');
  console.log('-'.repeat(40));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Desktop Hero Analysis
  console.log('\n1. HERO SECTION (Desktop):');
  const desktopHero = await page.$('section:first-of-type, .hero, [class*="hero"]');
  if (desktopHero) {
    const heroData = await desktopHero.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const heading = el.querySelector('h1');

      return {
        height: rect.height,
        padding: styles.padding,
        maxWidth: styles.maxWidth,
        heading: heading ? {
          fontSize: window.getComputedStyle(heading).fontSize,
          lineHeight: window.getComputedStyle(heading).lineHeight
        } : null
      };
    });

    console.log(`   Height: ${heroData.height}px`);
    console.log(`   Padding: ${heroData.padding}`);
    console.log(`   Max Width: ${heroData.maxWidth}`);
    if (heroData.heading) {
      console.log(`   H1: ${heroData.heading.fontSize}, line-height: ${heroData.heading.lineHeight}`);
    }
  }

  // Desktop Grid Analysis
  console.log('\n2. GRID LAYOUTS (Desktop):');
  const grids = await page.$$('.grid, [class*="grid"]');
  if (grids.length > 0) {
    const firstGrid = grids[0];
    const gridData = await firstGrid.evaluate(el => {
      const styles = window.getComputedStyle(el);
      const children = el.children;

      return {
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
        childCount: children.length,
        firstChildWidth: children[0] ? children[0].getBoundingClientRect().width : null
      };
    });

    console.log(`   Grid Columns: ${gridData.gridTemplateColumns}`);
    console.log(`   Gap: ${gridData.gap}`);
    console.log(`   Items: ${gridData.childCount}`);
    if (gridData.firstChildWidth) {
      console.log(`   Item Width: ${gridData.firstChildWidth}px`);
    }
  }

  await browser.close();

  // RECOMMENDATIONS SUMMARY
  console.log('\n' + '='.repeat(80));
  console.log('\n🎯 PRIORITY RECOMMENDATIONS\n');
  console.log('-'.repeat(40));

  console.log('\n🔴 CRITICAL FIXES:');
  console.log('1. Increase all button heights to min 44px (WCAG requirement)');
  console.log('2. Add proper padding to all cards (min p-6)');
  console.log('3. Fix section spacing (use py-12 mobile, py-16 desktop)');
  console.log('4. Standardize container widths');

  console.log('\n🟡 MAJOR IMPROVEMENTS:');
  console.log('1. Hero section needs more vertical padding');
  console.log('2. Form inputs need to be taller (min h-12)');
  console.log('3. Navigation needs better spacing');
  console.log('4. Footer needs substantial padding');

  console.log('\n🟢 POLISH ITEMS:');
  console.log('1. Add consistent border-radius (rounded-lg or rounded-xl)');
  console.log('2. Implement proper shadow hierarchy');
  console.log('3. Improve typography scale for mobile');
  console.log('4. Add hover states to all interactive elements');

  console.log('\n✅ TAILWIND CLASSES TO APPLY:');
  console.log('• Buttons: min-h-[44px] px-6 py-3');
  console.log('• Cards: p-6 lg:p-8 rounded-xl shadow-lg');
  console.log('• Sections: py-12 lg:py-16');
  console.log('• Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
  console.log('• Inputs: h-12 px-4 rounded-lg');
  console.log('• Footer: py-12 lg:py-16 px-4 sm:px-6 lg:px-8');
}

detailedAnalysis().catch(console.error);