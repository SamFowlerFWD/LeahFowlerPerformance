#!/usr/bin/env node

/**
 * SEO Verification Script
 * Checks that all metadata and SEO elements are correctly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Implementation Verification\n');
console.log('=' .repeat(50));

// Check main layout metadata
console.log('\n📋 Checking Main Layout Metadata...');
const layoutPath = path.join(__dirname, '../app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

const checks = {
  'Online PT positioning': /Online PT Norfolk/,
  'Strength Coach positioning': /Strength & Conditioning Coach/,
  'Phone number': /447990600958/,
  'Evidence-based keyword': /evidence-based/,
  'Price point (£48)': /£48/,
  'Professional transformation': /professionals transformed/
};

let passCount = 0;
let failCount = 0;

for (const [name, pattern] of Object.entries(checks)) {
  if (pattern.test(layoutContent)) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name} - Not found`);
    failCount++;
  }
}

// Check services page
console.log('\n📋 Checking Services Page Metadata...');
const servicesPath = path.join(__dirname, '../app/services/page.tsx');
const servicesContent = fs.readFileSync(servicesPath, 'utf8');

const servicesChecks = {
  'Online PT Packages title': /Online PT Packages/,
  'From £48 pricing': /From £48/,
  'App-based training': /app-based training/,
  'Personalised coaching': /Personalised coaching/
};

for (const [name, pattern] of Object.entries(servicesChecks)) {
  if (pattern.test(servicesContent)) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name} - Not found`);
    failCount++;
  }
}

// Check schema markup
console.log('\n📋 Checking Schema Markup...');
const schemaPath = path.join(__dirname, '../lib/schema-markup.ts');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

const schemaChecks = {
  'LocalBusiness schema': /@type.*HealthAndBeautyBusiness/,
  'Person schema': /@type.*Person/,
  'Service schema': /@type.*Service/,
  'Correct phone number': /447990600958/,
  'Norfolk location': /Norfolk/,
  'Dereham location': /Dereham/
};

for (const [name, pattern] of Object.entries(schemaChecks)) {
  if (pattern.test(schemaContent)) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name} - Not found`);
    failCount++;
  }
}

// Check WhatsApp links
console.log('\n📋 Checking WhatsApp Configuration...');
const componentsToCheck = [
  '../components/FloatingElements.tsx',
  '../components/MobileBottomNav.tsx',
  '../components/MobileSwipeableProgrammes.tsx'
];

let whatsAppCorrect = true;
for (const component of componentsToCheck) {
  try {
    const componentPath = path.join(__dirname, component);
    const content = fs.readFileSync(componentPath, 'utf8');
    if (content.includes('447990600958')) {
      console.log(`✅ ${path.basename(component)}`);
      passCount++;
    } else if (content.includes('447123456789')) {
      console.log(`❌ ${path.basename(component)} - Still using old number`);
      failCount++;
      whatsAppCorrect = false;
    }
  } catch (e) {
    console.log(`⚠️  ${path.basename(component)} - File not found`);
  }
}

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('=' .repeat(50));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📈 Success Rate: ${Math.round((passCount / (passCount + failCount)) * 100)}%`);

if (failCount === 0) {
  console.log('\n🎉 All SEO checks passed! Site is optimized for "Online PT / Strength Coach" positioning.');
} else {
  console.log('\n⚠️  Some checks failed. Please review and fix the issues above.');
}

// Recommendations
console.log('\n💡 SEO RECOMMENDATIONS:');
console.log('1. Ensure all pages have unique, keyword-rich titles under 60 characters');
console.log('2. Meta descriptions should be compelling and under 155 characters');
console.log('3. Use structured data on all pages for rich snippets');
console.log('4. Include location keywords for local SEO (Norfolk, Dereham, Norwich)');
console.log('5. Monitor Core Web Vitals for performance impact on SEO');

console.log('\n✅ Script complete!');