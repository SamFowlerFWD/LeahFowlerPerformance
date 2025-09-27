import { test, expect } from '@playwright/test';

test.describe('Diagnose Missing Mobile Sections', () => {
  test('Check visibility and styles of all homepage sections on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const sections = [
      { name: 'PremiumTestimonialsSection', selector: '[data-section="testimonials"], section:has(h2:text-matches("Client Success Stories|What Our Clients Say"))', fallback: 'section:has-text("testimonial")' },
      { name: 'OnlinePackageShowcase', selector: '[data-section="online-package"], section:has(h2:text-matches("Online Package|Virtual Training"))', fallback: 'section:has-text("Online")' },
      { name: 'AphroditePricingTiers', selector: '[data-section="pricing"], section:has(h2:text-matches("Pricing|Investment|Packages"))', fallback: 'section:has-text("pricing")' },
      { name: 'AboutSection', selector: '[data-section="about"], section:has(h2:text-matches("About|Meet"))', fallback: 'section:has-text("About")' },
      { name: 'FAQSection', selector: '[data-section="faq"], section:has(h2:text-matches("FAQ|Questions"))', fallback: 'section:has-text("FAQ")' },
      { name: 'ContactSection', selector: '[data-section="contact"], section:has(h2:text-matches("Contact|Get in Touch"))', fallback: 'section:has-text("Contact")' },
      { name: 'Footer', selector: 'footer', fallback: 'footer' }
    ];

    console.log('\n=== MOBILE SECTION VISIBILITY DIAGNOSTIC ===\n');

    for (const section of sections) {
      console.log(`\n--- ${section.name} ---`);

      // Try multiple selectors
      let element = await page.$(section.selector);
      if (!element && section.fallback) {
        element = await page.$(section.fallback);
      }

      if (!element) {
        // Try to find by partial text match
        const possibleElements = await page.$$('section, div[class*="section"], div[class*="Section"]');
        for (const el of possibleElements) {
          const text = await el.textContent();
          if (text && text.toLowerCase().includes(section.name.toLowerCase().replace('Section', ''))) {
            element = el;
            break;
          }
        }
      }

      if (element) {
        // Get computed styles
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const parent = el.parentElement;
          const parentStyles = parent ? window.getComputedStyle(parent) : null;

          return {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            position: computed.position,
            transform: computed.transform,
            zIndex: computed.zIndex,
            height: computed.height,
            width: computed.width,
            overflow: computed.overflow,
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            top: computed.top,
            left: computed.left,
            right: computed.right,
            bottom: computed.bottom,
            marginTop: computed.marginTop,
            marginBottom: computed.marginBottom,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            rect: {
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              isVisible: rect.width > 0 && rect.height > 0
            },
            hasContent: el.textContent?.trim().length > 0,
            className: el.className,
            tagName: el.tagName,
            parentDisplay: parentStyles?.display,
            parentVisibility: parentStyles?.visibility,
            parentOpacity: parentStyles?.opacity,
            childrenCount: el.children.length,
            textContent: el.textContent?.substring(0, 100)
          };
        });

        console.log('Found:', true);
        console.log('Display:', styles.display);
        console.log('Visibility:', styles.visibility);
        console.log('Opacity:', styles.opacity);
        console.log('Position:', styles.position);
        console.log('Transform:', styles.transform);
        console.log('Z-Index:', styles.zIndex);
        console.log('Height:', styles.height);
        console.log('Width:', styles.width);
        console.log('Overflow:', styles.overflow);
        console.log('Color:', styles.color);
        console.log('Background:', styles.backgroundColor);
        console.log('Rect Visible:', styles.rect.isVisible);
        console.log('Rect:', `top: ${styles.rect.top}, left: ${styles.rect.left}, width: ${styles.rect.width}, height: ${styles.rect.height}`);
        console.log('Has Content:', styles.hasContent);
        console.log('Class:', styles.className);
        console.log('Tag:', styles.tagName);
        console.log('Parent Display:', styles.parentDisplay);
        console.log('Parent Visibility:', styles.parentVisibility);
        console.log('Children Count:', styles.childrenCount);

        if (styles.position === 'absolute' || styles.position === 'fixed') {
          console.log('Positioning:', `top: ${styles.top}, left: ${styles.left}, right: ${styles.right}, bottom: ${styles.bottom}`);
        }

        if (styles.marginTop || styles.marginBottom || styles.paddingTop || styles.paddingBottom) {
          console.log('Spacing:', `mt: ${styles.marginTop}, mb: ${styles.marginBottom}, pt: ${styles.paddingTop}, pb: ${styles.paddingBottom}`);
        }

        if (styles.textContent) {
          console.log('Content Preview:', styles.textContent);
        }

        // Check if element is actually visible
        const isVisible = await element.isVisible();
        console.log('Playwright isVisible:', isVisible);

        // Check for potential issues
        if (styles.display === 'none') {
          console.log('⚠️ ISSUE: display: none');
        }
        if (styles.visibility === 'hidden') {
          console.log('⚠️ ISSUE: visibility: hidden');
        }
        if (parseFloat(styles.opacity) === 0) {
          console.log('⚠️ ISSUE: opacity: 0');
        }
        if (styles.rect.height === 0 || styles.rect.width === 0) {
          console.log('⚠️ ISSUE: Zero dimensions');
        }
        if (styles.rect.top > 10000 || styles.rect.left > 10000 || styles.rect.left < -10000) {
          console.log('⚠️ ISSUE: Positioned off-screen');
        }
        if (styles.color === styles.backgroundColor && styles.color !== 'rgba(0, 0, 0, 0)') {
          console.log('⚠️ ISSUE: Text color matches background');
        }

      } else {
        console.log('Found:', false);
        console.log('⚠️ ISSUE: Section not found in DOM');
      }
    }

    // Take a screenshot to visualize
    await page.screenshot({
      path: '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/tests/screenshots/mobile-sections-diagnostic.png',
      fullPage: true
    });

    // Check for any media query styles
    const mediaQueryStyles = await page.evaluate(() => {
      const styles = [];
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (rule.media && rule.media.mediaText.includes('max-width')) {
              styles.push({
                media: rule.media.mediaText,
                rules: rule.cssText.substring(0, 500)
              });
            }
          }
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      }
      return styles;
    });

    console.log('\n=== MOBILE MEDIA QUERIES ===');
    mediaQueryStyles.forEach(mq => {
      if (mq.rules.includes('display: none') || mq.rules.includes('visibility: hidden') || mq.rules.includes('opacity: 0')) {
        console.log('\n⚠️ Potentially problematic media query:');
        console.log('Media:', mq.media);
        console.log('Rules:', mq.rules);
      }
    });

    // Scroll through the page and check what's visible
    console.log('\n=== SCROLL TEST ===');
    const viewportHeight = 844;
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    for (let y = 0; y < pageHeight; y += viewportHeight) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(100);

      const visibleContent = await page.evaluate(() => {
        const viewport = {
          top: window.scrollY,
          bottom: window.scrollY + window.innerHeight
        };

        const elements = document.querySelectorAll('section, footer, div[class*="section"], div[class*="Section"]');
        const visible = [];

        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          const absoluteBottom = rect.bottom + window.scrollY;

          if (absoluteBottom > viewport.top && absoluteTop < viewport.bottom) {
            const heading = el.querySelector('h1, h2, h3');
            visible.push({
              tag: el.tagName,
              class: el.className,
              heading: heading?.textContent || 'No heading',
              contentLength: el.textContent?.length || 0
            });
          }
        });

        return visible;
      });

      if (visibleContent.length > 0) {
        console.log(`\nAt scroll position ${y}px:`);
        visibleContent.forEach(item => {
          console.log(`  - ${item.tag}.${item.class}: "${item.heading}" (${item.contentLength} chars)`);
        });
      }
    }
  });

  test('Check specific CSS files for mobile hiding rules', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check all loaded stylesheets for problematic rules
    const problematicRules = await page.evaluate(() => {
      const issues = [];

      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;

          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];

            if (rule.style) {
              const selector = rule.selectorText;
              const style = rule.style;

              // Check for hiding properties
              if (style.display === 'none' ||
                  style.visibility === 'hidden' ||
                  style.opacity === '0' ||
                  (style.position === 'absolute' && (
                    parseInt(style.left) < -1000 ||
                    parseInt(style.top) < -1000 ||
                    parseInt(style.left) > 10000 ||
                    parseInt(style.top) > 10000
                  ))) {

                // Check if it's in a mobile media query
                let mediaQuery = null;
                if (rule.parentRule && rule.parentRule.media) {
                  mediaQuery = rule.parentRule.media.mediaText;
                } else if (sheet.media && sheet.media.mediaText) {
                  mediaQuery = sheet.media.mediaText;
                }

                issues.push({
                  selector,
                  display: style.display,
                  visibility: style.visibility,
                  opacity: style.opacity,
                  position: style.position,
                  left: style.left,
                  top: style.top,
                  mediaQuery,
                  source: sheet.href || 'inline'
                });
              }
            }
          }
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      }

      return issues;
    });

    console.log('\n=== POTENTIALLY PROBLEMATIC CSS RULES ===\n');
    problematicRules.forEach(rule => {
      if (rule.mediaQuery && rule.mediaQuery.includes('max-width')) {
        console.log('Mobile-specific hiding rule found:');
        console.log('  Selector:', rule.selector);
        console.log('  Media Query:', rule.mediaQuery);
        console.log('  Properties:', {
          display: rule.display,
          visibility: rule.visibility,
          opacity: rule.opacity,
          position: rule.position,
          left: rule.left,
          top: rule.top
        });
        console.log('  Source:', rule.source);
        console.log('---');
      }
    });
  });
});