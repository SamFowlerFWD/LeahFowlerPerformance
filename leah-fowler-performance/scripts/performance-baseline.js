#!/usr/bin/env node

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

const runLighthouse = async () => {
  console.log('🚀 Starting Lighthouse Performance Analysis...\n');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu']
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 675
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      disabled: false
    }
  };

  const pages = [
    '/',
    '/apply',
    '/about',
    '/services',
    '/contact',
    '/testimonials',
    '/resources',
    '/performance-accelerator',
    '/online-training'
  ];

  const results = {};

  for (const page of pages) {
    const url = `http://localhost:3000${page}`;
    console.log(`\n📊 Analyzing: ${url}`);

    try {
      const runnerResult = await lighthouse(url, options);
      const report = JSON.parse(runnerResult.report);

      results[page] = {
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100),
        metrics: {
          FCP: report.audits['first-contentful-paint'].numericValue,
          LCP: report.audits['largest-contentful-paint'].numericValue,
          TBT: report.audits['total-blocking-time'].numericValue,
          CLS: report.audits['cumulative-layout-shift'].numericValue,
          TTI: report.audits['interactive'].numericValue,
          SpeedIndex: report.audits['speed-index'].numericValue
        }
      };

      console.log(`  ✅ Performance: ${results[page].performance}/100`);
      console.log(`  ✅ Accessibility: ${results[page].accessibility}/100`);
      console.log(`  ✅ Best Practices: ${results[page].bestPractices}/100`);
      console.log(`  ✅ SEO: ${results[page].seo}/100`);
      console.log(`  ⏱️  LCP: ${(results[page].metrics.LCP / 1000).toFixed(2)}s`);
      console.log(`  ⏱️  CLS: ${results[page].metrics.CLS.toFixed(3)}`);

    } catch (error) {
      console.error(`  ❌ Error analyzing ${page}: ${error.message}`);
      results[page] = { error: error.message };
    }
  }

  await chrome.kill();

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(process.cwd(), `lighthouse-baseline-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log(`\n📁 Full report saved to: ${reportPath}`);

  // Summary
  console.log('\n========================================');
  console.log('📈 PERFORMANCE BASELINE SUMMARY');
  console.log('========================================\n');

  const avgScores = {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0
  };

  let validPages = 0;

  for (const [page, data] of Object.entries(results)) {
    if (!data.error) {
      avgScores.performance += data.performance;
      avgScores.accessibility += data.accessibility;
      avgScores.bestPractices += data.bestPractices;
      avgScores.seo += data.seo;
      validPages++;
    }
  }

  if (validPages > 0) {
    console.log(`📊 Average Scores (${validPages} pages):`);
    console.log(`  Performance:    ${Math.round(avgScores.performance / validPages)}/100`);
    console.log(`  Accessibility:  ${Math.round(avgScores.accessibility / validPages)}/100`);
    console.log(`  Best Practices: ${Math.round(avgScores.bestPractices / validPages)}/100`);
    console.log(`  SEO:           ${Math.round(avgScores.seo / validPages)}/100`);
  }

  console.log('\n✅ Analysis complete!');
};

runLighthouse().catch(console.error);