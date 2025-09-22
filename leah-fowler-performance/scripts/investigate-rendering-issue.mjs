#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const SITE_URL = 'http://localhost:3000';
const REPORT_DIR = path.join(process.cwd(), 'rendering-investigation');

async function investigateRenderingIssue() {
  console.log('🔍 Starting rendering issue investigation...\n');

  // Create report directory
  await fs.mkdir(REPORT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false, // Show browser to see what's happening
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    const log = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    };
    consoleLogs.push(log);
    console.log(`[CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
    console.error('[PAGE ERROR]:', error.message);
  });

  // Capture request failures
  const failedRequests = [];
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure(),
      method: request.method()
    });
    console.error('[REQUEST FAILED]:', request.url(), request.failure());
  });

  // Capture response errors
  const responseErrors = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      responseErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.error('[RESPONSE ERROR]:', response.url(), response.status());
    }
  });

  try {
    console.log(`\n📡 Navigating to ${SITE_URL}...`);
    const response = await page.goto(SITE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log(`✅ Page loaded with status: ${response.status()}\n`);

    // Wait a bit for any dynamic content
    await page.waitForTimeout(3000);

    // Take initial screenshot
    const screenshotPath = path.join(REPORT_DIR, 'current-state.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}\n`);

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page Title: "${title}"`);
    console.log(`🔗 Current URL: ${url}\n`);

    // Check for visible text
    console.log('📝 Checking for visible text...');
    const visibleText = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;

            const style = window.getComputedStyle(parent);
            if (style.display === 'none' ||
                style.visibility === 'hidden' ||
                style.opacity === '0' ||
                parent.offsetWidth === 0 ||
                parent.offsetHeight === 0) {
              return NodeFilter.FILTER_REJECT;
            }

            const text = node.textContent.trim();
            return text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const texts = [];
      let node;
      while (node = walker.nextNode()) {
        texts.push(node.textContent.trim());
      }
      return texts;
    });

    console.log(`Found ${visibleText.length} visible text elements`);
    if (visibleText.length > 0) {
      console.log('Sample visible texts:', visibleText.slice(0, 5));
    }

    // Check for images
    console.log('\n🖼️ Checking for images...');
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        displayed: img.offsetWidth > 0 && img.offsetHeight > 0,
        loaded: img.complete && img.naturalHeight !== 0
      }));
    });

    console.log(`Found ${images.length} images:`);
    images.forEach((img, i) => {
      console.log(`  Image ${i + 1}: ${img.src.substring(img.src.lastIndexOf('/') + 1)}`);
      console.log(`    - Displayed: ${img.displayed}, Loaded: ${img.loaded}, Size: ${img.width}x${img.height}`);
    });

    // Check DOM structure
    console.log('\n🏗️ Analyzing DOM structure...');
    const domAnalysis = await page.evaluate(() => {
      const analysis = {
        totalElements: document.querySelectorAll('*').length,
        bodyChildren: document.body.children.length,
        mainContent: null,
        headers: [],
        hiddenElements: [],
        zeroSizeElements: []
      };

      // Check for main content areas
      const main = document.querySelector('main, #main, [role="main"], #__next');
      if (main) {
        analysis.mainContent = {
          tag: main.tagName,
          id: main.id,
          className: main.className,
          childCount: main.children.length,
          textContent: main.textContent.substring(0, 100)
        };
      }

      // Check headers
      const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach(h => {
        const style = window.getComputedStyle(h);
        analysis.headers.push({
          tag: h.tagName,
          text: h.textContent,
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          color: style.color,
          fontSize: style.fontSize
        });
      });

      // Find hidden elements with content
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent && el.textContent.trim().length > 0) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') {
            analysis.hiddenElements.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              textSnippet: el.textContent.substring(0, 50)
            });
          }
          if (el.offsetWidth === 0 || el.offsetHeight === 0) {
            analysis.zeroSizeElements.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              textSnippet: el.textContent.substring(0, 50)
            });
          }
        }
      });

      return analysis;
    });

    console.log(`Total DOM elements: ${domAnalysis.totalElements}`);
    console.log(`Body children: ${domAnalysis.bodyChildren}`);
    if (domAnalysis.mainContent) {
      console.log(`Main content found: ${domAnalysis.mainContent.tag} with ${domAnalysis.mainContent.childCount} children`);
    }
    console.log(`Headers found: ${domAnalysis.headers.length}`);
    console.log(`Hidden elements with text: ${domAnalysis.hiddenElements.length}`);
    console.log(`Zero-size elements with text: ${domAnalysis.zeroSizeElements.length}`);

    // Check CSS and fonts
    console.log('\n🎨 Checking CSS and fonts...');
    const stylesAnalysis = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const fonts = Array.from(document.fonts);

      return {
        stylesheetCount: stylesheets.length,
        stylesheets: stylesheets.map(sheet => ({
          href: sheet.href,
          disabled: sheet.disabled,
          ruleCount: sheet.cssRules ? sheet.cssRules.length : 0
        })),
        fontsLoaded: fonts.filter(f => f.status === 'loaded').length,
        fontsPending: fonts.filter(f => f.status === 'loading').length,
        fontsFailed: fonts.filter(f => f.status === 'error').length,
        fonts: fonts.map(f => ({
          family: f.family,
          status: f.status
        }))
      };
    });

    console.log(`Stylesheets: ${stylesAnalysis.stylesheetCount}`);
    console.log(`Fonts loaded: ${stylesAnalysis.fontsLoaded}`);
    console.log(`Fonts pending: ${stylesAnalysis.fontsPending}`);
    console.log(`Fonts failed: ${stylesAnalysis.fontsFailed}`);

    // Check for React/Next.js specific issues
    console.log('\n⚛️ Checking for React/Next.js issues...');
    const reactAnalysis = await page.evaluate(() => {
      const analysis = {
        hasReactRoot: false,
        hasNextData: false,
        hydrationErrors: [],
        reactVersion: null
      };

      // Check for React root
      const reactRoot = document.querySelector('#__next, #root, [data-reactroot]');
      if (reactRoot) {
        analysis.hasReactRoot = true;
        analysis.reactRootContent = reactRoot.innerHTML.substring(0, 200);
      }

      // Check for Next.js data
      const nextData = document.querySelector('script#__NEXT_DATA__');
      if (nextData) {
        analysis.hasNextData = true;
        try {
          const data = JSON.parse(nextData.textContent);
          analysis.nextDataKeys = Object.keys(data);
        } catch (e) {
          analysis.nextDataError = e.message;
        }
      }

      // Try to detect React version
      if (window.React) {
        analysis.reactVersion = window.React.version;
      }

      return analysis;
    });

    console.log(`Has React root: ${reactAnalysis.hasReactRoot}`);
    console.log(`Has Next.js data: ${reactAnalysis.hasNextData}`);
    if (reactAnalysis.reactVersion) {
      console.log(`React version: ${reactAnalysis.reactVersion}`);
    }

    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url: SITE_URL,
      pageTitle: title,
      consoleLogs,
      pageErrors,
      failedRequests,
      responseErrors,
      visibleTextCount: visibleText.length,
      sampleVisibleText: visibleText.slice(0, 10),
      images,
      domAnalysis,
      stylesAnalysis,
      reactAnalysis
    };

    const reportPath = path.join(REPORT_DIR, 'investigation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Full report saved to: ${reportPath}`);

    // Generate summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 INVESTIGATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Page loads: ${response.status() === 200 ? 'YES' : 'NO'}`);
    console.log(`❌ Console errors: ${consoleLogs.filter(l => l.type === 'error').length}`);
    console.log(`⚠️ Console warnings: ${consoleLogs.filter(l => l.type === 'warning').length}`);
    console.log(`🚫 Failed requests: ${failedRequests.length}`);
    console.log(`📝 Visible text elements: ${visibleText.length}`);
    console.log(`🖼️ Images found: ${images.length} (displayed: ${images.filter(i => i.displayed).length})`);
    console.log(`🏗️ DOM elements: ${domAnalysis.totalElements}`);
    console.log(`🎨 Stylesheets: ${stylesAnalysis.stylesheetCount}`);
    console.log(`🔤 Fonts loaded: ${stylesAnalysis.fontsLoaded}`);

    console.log('\n🔍 LIKELY ISSUES:');
    if (visibleText.length === 0) {
      console.log('  ❗ No visible text found - possible CSS issue');
    }
    if (domAnalysis.hiddenElements.length > 10) {
      console.log(`  ❗ ${domAnalysis.hiddenElements.length} elements are hidden but contain text`);
    }
    if (domAnalysis.zeroSizeElements.length > 10) {
      console.log(`  ❗ ${domAnalysis.zeroSizeElements.length} elements have zero size but contain text`);
    }
    if (stylesAnalysis.fontsFailed > 0) {
      console.log(`  ❗ ${stylesAnalysis.fontsFailed} fonts failed to load`);
    }
    if (failedRequests.length > 0) {
      console.log(`  ❗ ${failedRequests.length} network requests failed`);
    }

    console.log('\n💡 Press Ctrl+C to close the browser and exit');

    // Keep browser open for manual inspection
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('\n❌ Investigation failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the investigation
investigateRenderingIssue().catch(console.error);