#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function analyzeDependencies() {
  console.log('📊 Analyzing Project Dependencies and Bundle Size...\n');

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  console.log('📦 Production Dependencies:', Object.keys(dependencies).length);
  console.log('🔧 Dev Dependencies:', Object.keys(devDependencies).length);

  // Heavy dependencies analysis
  const heavyDeps = [
    '@radix-ui',
    '@tiptap',
    'framer-motion',
    '@stripe',
    '@supabase'
  ];

  console.log('\n🏋️ Heavy Dependencies Analysis:');
  for (const dep of heavyDeps) {
    const deps = Object.keys(dependencies).filter(d => d.includes(dep));
    if (deps.length > 0) {
      console.log(`  ${dep}: ${deps.length} packages`);
      deps.forEach(d => {
        const version = dependencies[d];
        console.log(`    - ${d}: ${version}`);
      });
    }
  }

  // Check for duplicate dependencies
  console.log('\n🔍 Checking for potential optimizations...');

  try {
    const { stdout } = await execAsync('npm ls --depth=0 --json 2>/dev/null');
    const tree = JSON.parse(stdout);

    // Find packages that could be optimized
    const optimizationOpportunities = [];

    // Check Radix UI - could be bundled more efficiently
    const radixPackages = Object.keys(dependencies).filter(d => d.startsWith('@radix-ui'));
    if (radixPackages.length > 5) {
      optimizationOpportunities.push({
        issue: 'Multiple Radix UI packages',
        count: radixPackages.length,
        recommendation: 'Consider dynamic imports for rarely used components'
      });
    }

    // Check Tiptap
    const tiptapPackages = Object.keys(dependencies).filter(d => d.startsWith('@tiptap'));
    if (tiptapPackages.length > 0) {
      optimizationOpportunities.push({
        issue: 'Tiptap editor packages',
        count: tiptapPackages.length,
        recommendation: 'Lazy load the editor only when needed'
      });
    }

    // Check for large libraries
    const largeLibraries = {
      'framer-motion': 'Consider using CSS animations for simple cases',
      'lowlight': 'Only load for code highlighting features',
      'stripe': 'Load only on payment pages'
    };

    for (const [lib, recommendation] of Object.entries(largeLibraries)) {
      if (dependencies[lib]) {
        optimizationOpportunities.push({
          issue: `Large library: ${lib}`,
          recommendation
        });
      }
    }

    console.log('\n⚡ Optimization Opportunities:');
    optimizationOpportunities.forEach((opt, index) => {
      console.log(`\n${index + 1}. ${opt.issue}`);
      if (opt.count) console.log(`   Count: ${opt.count}`);
      console.log(`   → ${opt.recommendation}`);
    });

  } catch (error) {
    console.error('Error analyzing dependencies:', error.message);
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    dependencies: {
      production: Object.keys(dependencies).length,
      development: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    },
    heavyPackages: {
      radixUI: Object.keys(dependencies).filter(d => d.startsWith('@radix-ui')).length,
      tiptap: Object.keys(dependencies).filter(d => d.startsWith('@tiptap')).length,
      hasFramerMotion: !!dependencies['framer-motion'],
      hasStripe: !!dependencies['stripe'],
      hasSupabase: !!dependencies['@supabase/supabase-js']
    },
    recommendations: [
      'Implement dynamic imports for Tiptap editor',
      'Lazy load Stripe SDK only on payment pages',
      'Code split Radix UI components',
      'Use CSS for simple animations instead of Framer Motion',
      'Implement route-based code splitting',
      'Extract critical CSS and defer non-critical styles'
    ]
  };

  const reportPath = path.join(process.cwd(), 'dependency-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📁 Report saved to: ${reportPath}`);
  console.log('\n✅ Analysis complete!');
}

analyzeDependencies().catch(console.error);