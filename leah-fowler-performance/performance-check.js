const { chromium } = require('@playwright/test');

async function checkPerformance() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🚀 Starting performance check...\n');

  // Enable performance metrics collection
  await context.newCDPSession(page).then(client =>
    client.send('Performance.enable')
  );

  const startTime = Date.now();

  // Navigate and measure
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });

  const loadTime = Date.now() - startTime;

  // Scroll to About section
  await page.evaluate(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  // Collect performance metrics
  const performanceMetrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');

    return {
      navigation: {
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart,
        domInteractive: perfData?.domInteractive,
        responseTime: perfData?.responseEnd - perfData?.requestStart
      },
      paint: {
        firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime
      },
      resources: performance.getEntriesByType('resource').length,
      memory: performance.memory ? {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB'
      } : null
    };
  });

  // Check for layout shifts specifically in About section
  const layoutShifts = await page.evaluate(() => {
    return new Promise((resolve) => {
      let totalShift = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            totalShift += entry.value;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      // Trigger animations and check for shifts
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        observer.disconnect();
        resolve(totalShift);
      }, 3000);
    });
  });

  // Check image loading performance
  const imageMetrics = await page.evaluate(() => {
    const image = document.querySelector('img[alt*="Leah Fowler"]');
    if (!image) return null;

    return {
      loaded: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      displayWidth: image.offsetWidth,
      displayHeight: image.offsetHeight,
      src: image.src,
      loading: image.loading,
      decoding: image.decoding
    };
  });

  // Check z-index performance (no excessive layers)
  const layerCount = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const zIndexValues = new Set();

    elements.forEach(el => {
      const zIndex = window.getComputedStyle(el).zIndex;
      if (zIndex !== 'auto' && zIndex !== '0') {
        zIndexValues.add(zIndex);
      }
    });

    return zIndexValues.size;
  });

  // Print results
  console.log('📊 PERFORMANCE METRICS');
  console.log('======================\n');

  console.log('⏱️  Load Times:');
  console.log(`   • Page Load: ${loadTime}ms ${loadTime < 2000 ? '✅' : '⚠️'}`);
  console.log(`   • DOM Interactive: ${performanceMetrics.navigation.domInteractive?.toFixed(0)}ms`);
  console.log(`   • First Paint: ${performanceMetrics.paint.firstPaint?.toFixed(0)}ms`);
  console.log(`   • First Contentful Paint: ${performanceMetrics.paint.firstContentfulPaint?.toFixed(0)}ms`);

  console.log('\n📈 Resource Usage:');
  console.log(`   • Total Resources: ${performanceMetrics.resources}`);
  if (performanceMetrics.memory) {
    console.log(`   • JS Heap Used: ${performanceMetrics.memory.usedJSHeapSize}`);
    console.log(`   • JS Heap Total: ${performanceMetrics.memory.totalJSHeapSize}`);
  }

  console.log('\n🖼️  Image Performance:');
  if (imageMetrics) {
    console.log(`   • Image Loaded: ${imageMetrics.loaded ? '✅' : '❌'}`);
    console.log(`   • Natural Size: ${imageMetrics.naturalWidth}x${imageMetrics.naturalHeight}px`);
    console.log(`   • Display Size: ${imageMetrics.displayWidth}x${imageMetrics.displayHeight}px`);
    console.log(`   • Loading Strategy: ${imageMetrics.loading || 'eager'}`);
  }

  console.log('\n🎨 Layout Performance:');
  console.log(`   • Cumulative Layout Shift: ${layoutShifts.toFixed(4)} ${layoutShifts < 0.1 ? '✅ Good' : layoutShifts < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'}`);
  console.log(`   • Z-index Layers: ${layerCount} ${layerCount < 20 ? '✅' : '⚠️'}`);

  console.log('\n📋 PERFORMANCE SUMMARY');
  console.log('======================');

  const issues = [];
  if (loadTime >= 2000) issues.push('Page load time exceeds 2 seconds');
  if (layoutShifts >= 0.1) issues.push('Layout shift needs improvement');
  if (layerCount >= 20) issues.push('Too many z-index layers');

  if (issues.length === 0) {
    console.log('✅ All performance metrics are within acceptable ranges!');
  } else {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   • ${issue}`));
  }

  await browser.close();
}

checkPerformance().catch(console.error);