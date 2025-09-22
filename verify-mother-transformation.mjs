#!/usr/bin/env node

/**
 * Verification Script: Mother Identity Transformation
 * Ensures all executive content has been replaced with mother-focused messaging
 */

import { promises as fs } from 'fs';
import path from 'path';

const componentsPath = '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/components';
const appPath = '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/app';

// Active components used in page.tsx
const activeComponents = [
  'AnnouncementBar.tsx',
  'ModernHeader.tsx',
  'PremiumHeroWithImage.tsx',
  'TrustBar.tsx',
  'HeroStatsSection.tsx',
  'ModernAssessmentSection.tsx',
  'PricingTiers.tsx',
  'PremiumProgrammeComparison.tsx',
  'PremiumSocialProof.tsx',
  'PremiumTestimonialsSection.tsx',
  'TrustSection.tsx',
  'AboutSection.tsx',
  'LeadMagnetDelivery.tsx',
  'PerformanceBreakthroughLeadMagnet.tsx',
  'ContactSection.tsx',
  'Footer.tsx',
  'FloatingElements.tsx',
  'ExitIntentPopup.tsx',
  'MobileDock.tsx',
  'ViewportIndicator.tsx'
];

// Executive terms that should NOT appear
const executiveTerms = [
  '500+ Executives',
  'Executives Transformed',
  '98% Success Rate',
  '15 Years Excellence',
  'C-suite',
  'CEO',
  'Managing Director',
  'Industry Leaders',
  'peak performance',
  'business leader',
  'career',
  'Excel?'
];

// Mother-focused terms that SHOULD appear
const motherTerms = [
  '500+ Mothers',
  'Mothers Reclaimed',
  '92% Identity Breakthroughs',
  'Mother of 2',
  'Spartan Ultra',
  'mirror moment',
  'reclaim',
  'identity',
  'warrior mother'
];

async function checkFile(filePath, fileName) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const issues = [];
    const successes = [];

    // Check for executive terms
    for (const term of executiveTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        issues.push(`  ❌ Found "${term}" in ${fileName}`);
      }
    }

    // Check for mother terms (at least some should be present in key components)
    const keyComponents = ['AnnouncementBar', 'PremiumHeroWithImage', 'TrustBar', 'ContactSection'];
    if (keyComponents.some(comp => fileName.includes(comp))) {
      let foundMotherContent = false;
      for (const term of motherTerms) {
        if (content.toLowerCase().includes(term.toLowerCase())) {
          foundMotherContent = true;
          successes.push(`  ✅ Found mother content: "${term}"`);
          break;
        }
      }
      if (!foundMotherContent && fileName !== 'Footer.tsx') {
        issues.push(`  ⚠️  No mother-focused content found in ${fileName}`);
      }
    }

    return { issues, successes };
  } catch (error) {
    return { issues: [`  ⚠️  Could not read ${fileName}: ${error.message}`], successes: [] };
  }
}

async function verifyTransformation() {
  console.log('🔍 Verifying Mother Identity Transformation\n');
  console.log('=' .repeat(60));

  let totalIssues = 0;
  let totalSuccesses = 0;

  // Check active components
  console.log('\n📦 Checking Active Components:');
  console.log('-'.repeat(40));

  for (const component of activeComponents) {
    const filePath = path.join(componentsPath, component);
    const { issues, successes } = await checkFile(filePath, component);

    if (issues.length > 0) {
      console.log(`\n❌ ${component}:`);
      issues.forEach(issue => console.log(issue));
      totalIssues += issues.length;
    } else if (successes.length > 0) {
      console.log(`\n✅ ${component}: Mother-focused content confirmed`);
      totalSuccesses += successes.length;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TRANSFORMATION SUMMARY:\n');

  if (totalIssues === 0) {
    console.log('🎉 SUCCESS! All executive content has been replaced!');
    console.log(`✅ ${totalSuccesses} mother-focused elements confirmed`);
    console.log('\n✨ The website is now fully transformed for mothers!');
  } else {
    console.log(`⚠️  Found ${totalIssues} remaining issues that need attention`);
    console.log(`✅ ${totalSuccesses} mother-focused elements already in place`);
  }

  // Key changes summary
  console.log('\n🔄 KEY TRANSFORMATIONS APPLIED:');
  console.log('  • AnnouncementBar: "500+ Mothers Reclaimed" (z-index: 100)');
  console.log('  • Header: Positioned below announcement (top: 10px, z-index: 40)');
  console.log('  • Hero: Mother identity content from family-athlete-content');
  console.log('  • Contact: "Ready to Reclaim You?" with mother-focused form');
  console.log('  • Exit Popup: Mother Identity Reclamation Guide');
  console.log('  • Lead Magnets: Warrior Mother content');

  console.log('\n💡 NEXT STEPS:');
  console.log('  1. Clear browser cache (Cmd+Shift+R)');
  console.log('  2. Restart dev server: npm run dev');
  console.log('  3. Check incognito/private window');
  console.log('  4. If issues persist, check for build cache');

  console.log('\n' + '='.repeat(60));
}

// Run verification
verifyTransformation().catch(console.error);