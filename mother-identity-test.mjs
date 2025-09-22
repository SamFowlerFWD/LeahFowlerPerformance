#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

async function verifyMotherIdentity() {
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see the browser
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log(`${colors.cyan}${colors.bright}🔍 MOTHER IDENTITY TRANSFORMATION VERIFICATION TEST${colors.reset}\n`);
  console.log('='.repeat(60));

  const testResults = {
    announcement: {},
    hero: {},
    trust: {},
    programmes: {},
    testimonials: {},
    inappropriate: {},
    ukEnglish: {}
  };

  try {
    // Navigate to the website
    console.log(`${colors.blue}Loading website...${colors.reset}`);
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'test-screenshots-final');
    await fs.mkdir(screenshotDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Take full page screenshot
    const fullPagePath = path.join(screenshotDir, `01-full-page-${timestamp}.png`);
    await page.screenshot({
      path: fullPagePath,
      fullPage: true
    });
    console.log(`${colors.green}✅ Full page screenshot saved${colors.reset}\n`);

    // Test 1: Announcement Bar
    console.log(`${colors.bright}📊 TEST 1: ANNOUNCEMENT BAR${colors.reset}`);
    console.log('-'.repeat(40));

    const announcementText = await page.evaluate(() => {
      const bar = document.querySelector('[class*="announcement"], [class*="sticky"], header > div:first-child');
      return bar ? bar.textContent.trim() : '';
    });

    console.log(`Found text: "${announcementText}"`);

    testResults.announcement = {
      'Contains "500+ Mothers Reclaimed"': announcementText.includes('500+ Mothers Reclaimed'),
      'Contains "92% Identity Breakthroughs"': announcementText.includes('92% Identity Breakthroughs'),
      'Contains "Mother of 2"': announcementText.includes('Mother of 2'),
      'Contains "Ultra Athlete"': announcementText.includes('Ultra Athlete'),
      'NO "Executives" reference': !announcementText.toLowerCase().includes('executive'),
      'NO "Success Rate" (uses Breakthroughs)': !announcementText.includes('Success Rate')
    };

    Object.entries(testResults.announcement).forEach(([test, passed]) => {
      console.log(`  ${passed ? colors.green + '✅' : colors.red + '❌'} ${test}${colors.reset}`);
    });

    // Take announcement bar screenshot
    await page.screenshot({
      path: path.join(screenshotDir, `02-announcement-${timestamp}.png`),
      clip: { x: 0, y: 0, width: 1920, height: 200 }
    });

    // Test 2: Hero Section
    console.log(`\n${colors.bright}🏆 TEST 2: HERO SECTION${colors.reset}`);
    console.log('-'.repeat(40));

    const heroData = await page.evaluate(() => {
      const badge = document.querySelector('main span[class*="badge"], main div[class*="badge"], main [class*="inline-flex"][class*="rounded"]');
      const headline = document.querySelector('h1');
      const subheadlines = Array.from(document.querySelectorAll('h2')).slice(0, 3);

      return {
        badge: badge ? badge.textContent.trim() : '',
        headline: headline ? headline.textContent.trim() : '',
        subheadlines: subheadlines.map(h => h.textContent.trim())
      };
    });

    console.log(`Badge: "${heroData.badge}"`);
    console.log(`Headline: "${heroData.headline}"`);
    console.log(`Subheadlines: ${heroData.subheadlines.join(' | ')}`);

    testResults.hero = {
      'Badge contains "Mother of 2"': heroData.badge.includes('Mother of 2'),
      'Badge contains "Spartan Ultra Finisher"': heroData.badge.includes('Spartan Ultra Finisher'),
      'Badge contains "Identity Coach"': heroData.badge.includes('Identity Coach'),
      'Headlines mention identity/mother':
        heroData.headline.toLowerCase().includes('mother') ||
        heroData.headline.toLowerCase().includes('identity') ||
        heroData.subheadlines.some(h => h.toLowerCase().includes('mother') || h.toLowerCase().includes('identity'))
    };

    Object.entries(testResults.hero).forEach(([test, passed]) => {
      console.log(`  ${passed ? colors.green + '✅' : colors.red + '❌'} ${test}${colors.reset}`);
    });

    // Scroll to hero and take screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.screenshot({
      path: path.join(screenshotDir, `03-hero-${timestamp}.png`),
      clip: { x: 0, y: 50, width: 1920, height: 800 }
    });

    // Test 3: Trust Bar
    console.log(`\n${colors.bright}🤝 TEST 3: TRUST BAR${colors.reset}`);
    console.log('-'.repeat(40));

    const trustBarContent = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const trustSection = sections.find(s =>
        s.textContent.includes('Truly Understands') ||
        s.textContent.includes('500+ Mothers') ||
        s.textContent.includes('From Postnatal')
      );

      if (!trustSection) return { items: [] };

      const items = Array.from(trustSection.querySelectorAll('[class*="text-center"], [class*="flex-col"]'))
        .map(item => item.textContent.trim())
        .filter(text => text.length > 5 && text.length < 100);

      return {
        fullText: trustSection.textContent,
        items
      };
    });

    console.log(`Trust items found: ${trustBarContent.items.length}`);
    trustBarContent.items.forEach(item => console.log(`  • ${item}`));

    testResults.trust = {
      'Contains "Mother of 2 Who Truly Understands"':
        trustBarContent.fullText.includes('Mother of 2 Who Truly Understands'),
      'Contains "500+ Mothers Reclaimed"':
        trustBarContent.fullText.includes('500+ Mothers Reclaimed'),
      'Contains "From Postnatal to Spartan Ultra"':
        trustBarContent.fullText.includes('From Postnatal to Spartan Ultra')
    };

    Object.entries(testResults.trust).forEach(([test, passed]) => {
      console.log(`  ${passed ? colors.green + '✅' : colors.red + '❌'} ${test}${colors.reset}`);
    });

    // Test 4: Programme Cards
    console.log(`\n${colors.bright}💪 TEST 4: PROGRAMME CARDS${colors.reset}`);
    console.log('-'.repeat(40));

    const programmes = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="card"], article');
      const programmeData = [];

      cards.forEach(card => {
        const title = card.querySelector('h3, h4, [class*="text-2xl"], [class*="font-bold"]');
        const price = card.querySelector('[class*="price"], [class*="text-4xl"], [class*="text-3xl"]');
        const duration = card.querySelector('[class*="duration"], [class*="text-sm"], [class*="text-gray"]');

        if (title && price) {
          programmeData.push({
            title: title.textContent.trim(),
            price: price.textContent.trim(),
            duration: duration ? duration.textContent.trim() : ''
          });
        }
      });

      return programmeData;
    });

    console.log(`Found ${programmes.length} programmes:`);
    programmes.forEach(p => {
      console.log(`  ${colors.cyan}• ${p.title}${colors.reset}`);
      console.log(`    Price: ${p.price}`);
      if (p.duration) console.log(`    Duration: ${p.duration}`);
    });

    const expectedProgrammes = ['Rediscovery Phase', 'Strength Building', 'Warrior Mother'];
    testResults.programmes = {
      'Has Rediscovery Phase (£197)':
        programmes.some(p => p.title.includes('Rediscovery') && p.price.includes('197')),
      'Has Strength Building (£297)':
        programmes.some(p => p.title.includes('Strength') && p.price.includes('297')),
      'Has Warrior Mother (£197/month)':
        programmes.some(p => p.title.includes('Warrior Mother') && p.price.includes('197'))
    };

    Object.entries(testResults.programmes).forEach(([test, passed]) => {
      console.log(`  ${passed ? colors.green + '✅' : colors.red + '❌'} ${test}${colors.reset}`);
    });

    // Scroll to programmes and take screenshot
    await page.evaluate(() => {
      const section = Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('Programme') || s.textContent.includes('Transform')
      );
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({
      path: path.join(screenshotDir, `04-programmes-${timestamp}.png`),
      fullPage: false
    });

    // Test 5: Check for inappropriate references
    console.log(`\n${colors.bright}🚫 TEST 5: CHECKING FOR INAPPROPRIATE REFERENCES${colors.reset}`);
    console.log('-'.repeat(40));

    const pageText = await page.evaluate(() => document.body.textContent.toLowerCase());
    const inappropriateTerms = [
      'executive', 'c-suite', 'ceo', 'cfo', 'cto',
      'business professional', 'corporate leader'
    ];

    const foundTerms = inappropriateTerms.filter(term => pageText.includes(term));

    testResults.inappropriate = {
      'No executive/business references': foundTerms.length === 0
    };

    if (foundTerms.length === 0) {
      console.log(`  ${colors.green}✅ No inappropriate business/executive terms found${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Found inappropriate terms: ${foundTerms.join(', ')}${colors.reset}`);
    }

    // Test 6: UK English
    console.log(`\n${colors.bright}🇬🇧 TEST 6: UK ENGLISH VERIFICATION${colors.reset}`);
    console.log('-'.repeat(40));

    const ukChecks = await page.evaluate(() => {
      const text = document.body.textContent;
      return {
        programme: /programme/i.test(text),
        mum: /\bmum\b/i.test(text),
        optimise: /optimise/i.test(text),
        realise: /realise/i.test(text),
        behaviour: /behaviour/i.test(text)
      };
    });

    testResults.ukEnglish = ukChecks;

    Object.entries(ukChecks).forEach(([term, found]) => {
      console.log(`  ${found ? colors.green + '✅' : colors.yellow + '⚠️'} UK spelling "${term}": ${found ? 'found' : 'not found'}${colors.reset}`);
    });

    // Test 7: Testimonials
    console.log(`\n${colors.bright}📝 TEST 7: TESTIMONIALS${colors.reset}`);
    console.log('-'.repeat(40));

    const testimonials = await page.evaluate(() => {
      const testimonialSection = Array.from(document.querySelectorAll('section')).find(s =>
        s.textContent.includes('Emma') || s.textContent.includes('testimonial') || s.textContent.includes('Transform')
      );

      if (!testimonialSection) return [];

      const testimonialElements = testimonialSection.querySelectorAll('blockquote, [class*="testimonial"], [class*="quote"]');
      return Array.from(testimonialElements).map(t => ({
        text: t.textContent.trim().slice(0, 100),
        hasMumReference: /mum/i.test(t.textContent),
        hasIdentityReference: /identity/i.test(t.textContent)
      }));
    });

    if (testimonials.length > 0) {
      console.log(`Found ${testimonials.length} testimonials`);
      testimonials.forEach((t, i) => {
        console.log(`  ${i + 1}. "${t.text}..."`);
        if (t.hasMumReference) console.log(`     ${colors.green}✓ Contains "mum" reference${colors.reset}`);
        if (t.hasIdentityReference) console.log(`     ${colors.green}✓ Contains "identity" reference${colors.reset}`);
      });
    }

    testResults.testimonials = {
      'Has testimonials': testimonials.length > 0,
      'Testimonials mention mum/mother': testimonials.some(t => t.hasMumReference),
      'Testimonials mention identity': testimonials.some(t => t.hasIdentityReference)
    };

    // FINAL SUMMARY
    console.log(`\n${colors.bright}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}📊 FINAL TEST SUMMARY${colors.reset}`);
    console.log(`${colors.bright}${'='.repeat(60)}${colors.reset}\n`);

    let totalTests = 0;
    let passedTests = 0;

    Object.entries(testResults).forEach(([section, tests]) => {
      const sectionTests = Object.values(tests).filter(v => typeof v === 'boolean');
      const sectionPassed = sectionTests.filter(t => t).length;
      totalTests += sectionTests.length;
      passedTests += sectionPassed;

      const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
      const passRate = sectionTests.length > 0 ? (sectionPassed / sectionTests.length * 100).toFixed(0) : 0;

      console.log(`${colors.bright}${sectionName}:${colors.reset} ${sectionPassed}/${sectionTests.length} tests passed (${passRate}%)`);
    });

    const overallPassRate = (passedTests / totalTests * 100).toFixed(1);

    console.log(`\n${colors.bright}Overall Results:${colors.reset}`);
    console.log(`  Tests Passed: ${colors.bright}${passedTests}/${totalTests}${colors.reset}`);
    console.log(`  Pass Rate: ${colors.bright}${overallPassRate}%${colors.reset}`);

    if (overallPassRate === '100.0') {
      console.log(`\n${colors.green}${colors.bright}🎉 SUCCESS: Mother identity transformation is COMPLETE!${colors.reset}`);
      console.log(`${colors.green}All references to executives have been replaced with mother-focused messaging.${colors.reset}`);
    } else if (passedTests >= totalTests * 0.9) {
      console.log(`\n${colors.yellow}${colors.bright}⚠️  MOSTLY COMPLETE: Minor issues remain${colors.reset}`);
      console.log(`${colors.yellow}Review the failed tests above for remaining fixes.${colors.reset}`);
    } else {
      console.log(`\n${colors.red}${colors.bright}❌ INCOMPLETE: Significant issues found${colors.reset}`);
      console.log(`${colors.red}Multiple tests failed - mother identity transformation needs work.${colors.reset}`);
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      overallPassRate,
      passedTests,
      totalTests,
      testResults,
      screenshots: {
        fullPage: fullPagePath,
        sections: [
          `02-announcement-${timestamp}.png`,
          `03-hero-${timestamp}.png`,
          `04-programmes-${timestamp}.png`
        ].map(f => path.join(screenshotDir, f))
      },
      summary: overallPassRate === '100.0' ?
        'Mother identity transformation complete' :
        `${100 - parseFloat(overallPassRate)}% of tests still failing`
    };

    const reportPath = path.join(__dirname, `mother-identity-test-report-${timestamp}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n${colors.cyan}📄 Detailed report saved to:${colors.reset}`);
    console.log(`   ${reportPath}`);

    console.log(`\n${colors.cyan}📸 Screenshots saved in:${colors.reset}`);
    console.log(`   ${screenshotDir}`);

    // Keep browser open for 3 seconds to review
    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error) {
    console.error(`${colors.red}${colors.bright}❌ Test failed with error:${colors.reset}`);
    console.error(error);
  } finally {
    await browser.close();
    console.log(`\n${colors.cyan}Test complete. Browser closed.${colors.reset}`);
  }
}

// Run the test
console.log(`${colors.bright}Starting Mother Identity Verification Test...${colors.reset}\n`);
verifyMotherIdentity().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});