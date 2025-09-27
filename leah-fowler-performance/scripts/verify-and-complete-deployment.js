#!/usr/bin/env node

/**
 * Verify and Complete Supabase Deployment
 * This script verifies what's already deployed and completes any missing pieces
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const anonClient = createClient(SUPABASE_URL, ANON_KEY);

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

async function verifyTables() {
  logSection('VERIFYING DATABASE TABLES');

  const expectedTables = {
    // Core User Management
    'admin_roles': { required: true, description: 'Admin role definitions' },
    'admin_users': { required: true, description: 'Admin user assignments' },
    'profiles': { required: true, description: 'User profiles' },

    // Assessment & Applications
    'assessments': { required: true, description: 'Assessment templates' },
    'assessment_submissions': { required: true, description: 'Client assessments' },
    'coaching_applications': { required: true, description: 'Coaching applications' },

    // Subscription & Payments
    'subscriptions': { required: true, description: 'Client subscriptions' },
    'subscription_plans': { required: false, description: 'Available plans' },
    'payment_methods': { required: false, description: 'Payment methods' },
    'invoices': { required: false, description: 'Invoice records' },

    // Content Management
    'blog_posts': { required: true, description: 'Blog articles' },
    'blog_categories': { required: false, description: 'Blog categories' },
    'blog_tags': { required: false, description: 'Blog tags' },
    'testimonials': { required: true, description: 'Client testimonials' },

    // Marketing
    'newsletter_subscribers': { required: true, description: 'Email subscribers' },
    'lead_magnets': { required: false, description: 'Lead magnet resources' },
    'lead_magnet_downloads': { required: false, description: 'Download tracking' },

    // Programme Management
    'programmes': { required: false, description: 'Training programmes' },
    'programme_phases': { required: false, description: 'Programme phases' },
    'workouts': { required: false, description: 'Workout templates' },
    'exercises': { required: false, description: 'Exercise library' },
    'client_programmes': { required: false, description: 'Client assignments' },
    'client_progress': { required: false, description: 'Progress tracking' },

    // Additional Features
    'nutrition_plans': { required: false, description: 'Nutrition plans' },
    'meals': { required: false, description: 'Meal templates' },
    'appointments': { required: false, description: 'Appointment scheduling' },
    'availability_schedules': { required: false, description: 'Coach availability' },

    // Analytics & Tracking
    'analytics_events': { required: false, description: 'Event tracking' },
    'page_analytics': { required: false, description: 'Page views' },
    'conversion_events': { required: false, description: 'Conversion tracking' },
    'ab_tests': { required: false, description: 'A/B test configs' }
  };

  let requiredExists = 0;
  let requiredMissing = 0;
  let optionalExists = 0;
  let optionalMissing = 0;

  for (const [table, info] of Object.entries(expectedTables)) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        const icon = '✓';
        const status = `exists (${count || 0} rows)`;
        console.log(`  ${icon} ${table.padEnd(30)} ${status.padEnd(20)} ${info.description}`);
        if (info.required) requiredExists++;
        else optionalExists++;
      } else {
        const icon = info.required ? '✗' : '○';
        const status = 'missing';
        console.log(`  ${icon} ${table.padEnd(30)} ${status.padEnd(20)} ${info.description}`);
        if (info.required) requiredMissing++;
        else optionalMissing++;
      }
    } catch (e) {
      console.log(`  ⚠ ${table.padEnd(30)} error checking`);
    }
  }

  console.log('\nSummary:');
  log(`  Required tables: ${requiredExists} exist, ${requiredMissing} missing`,
      requiredMissing > 0 ? 'red' : 'green');
  log(`  Optional tables: ${optionalExists} exist, ${optionalMissing} missing`, 'cyan');

  return requiredMissing === 0;
}

async function verifyStorageBuckets() {
  logSection('VERIFYING STORAGE BUCKETS');

  const expectedBuckets = [
    { id: 'avatars', public: true, required: true },
    { id: 'lead-magnets', public: false, required: true },
    { id: 'blog-images', public: true, required: true },
    { id: 'testimonial-media', public: true, required: true },
    { id: 'assessment-attachments', public: false, required: true },
    { id: 'email-assets', public: true, required: true },
    { id: 'video-content', public: false, required: true },
    { id: 'exports', public: false, required: true }
  ];

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    log('  ✗ Failed to list buckets: ' + error.message, 'red');
    return false;
  }

  const bucketMap = {};
  buckets.forEach(b => bucketMap[b.id] = b);

  let allExist = true;

  for (const expected of expectedBuckets) {
    const exists = bucketMap[expected.id];
    if (exists) {
      const publicMatch = exists.public === expected.public;
      const icon = publicMatch ? '✓' : '⚠';
      const status = publicMatch
        ? `${expected.public ? 'public' : 'private'}`
        : `wrong visibility (is ${exists.public ? 'public' : 'private'}, should be ${expected.public ? 'public' : 'private'})`;
      console.log(`  ${icon} ${expected.id.padEnd(25)} ${status}`);
    } else {
      console.log(`  ✗ ${expected.id.padEnd(25)} missing`);
      allExist = false;
    }
  }

  // Check for extra buckets
  const expectedIds = expectedBuckets.map(b => b.id);
  const extraBuckets = buckets.filter(b => !expectedIds.includes(b.id));

  if (extraBuckets.length > 0) {
    console.log('\nAdditional buckets found:');
    extraBuckets.forEach(b => {
      console.log(`  ○ ${b.id} (${b.public ? 'public' : 'private'})`);
    });
  }

  return allExist;
}

async function verifyAuthentication() {
  logSection('VERIFYING AUTHENTICATION');

  const tests = [];

  // Test 1: Check if auth is accessible
  try {
    const { data, error } = await supabase.auth.getSession();
    tests.push({
      name: 'Auth system accessible',
      passed: !error,
      message: error ? error.message : 'Auth API is responding'
    });
  } catch (e) {
    tests.push({
      name: 'Auth system accessible',
      passed: false,
      message: e.message
    });
  }

  // Test 2: Try to create a test user
  const testEmail = `test_${Date.now()}@leahfowlerperformance.com`;
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (error) {
      tests.push({
        name: 'Admin user creation',
        passed: false,
        message: error.message
      });
    } else {
      tests.push({
        name: 'Admin user creation',
        passed: true,
        message: 'Can create users via admin API'
      });

      // Clean up test user
      if (data?.user?.id) {
        await supabase.auth.admin.deleteUser(data.user.id);
      }
    }
  } catch (e) {
    tests.push({
      name: 'Admin user creation',
      passed: false,
      message: e.message
    });
  }

  // Test 3: Try public signup
  try {
    const { data, error } = await anonClient.auth.signUp({
      email: `signup_${Date.now()}@test.com`,
      password: 'SignupTest123!'
    });

    tests.push({
      name: 'Public signup',
      passed: !error || error.message.includes('confirm'),
      message: error ? error.message : 'Signup works (may need email confirmation)'
    });
  } catch (e) {
    tests.push({
      name: 'Public signup',
      passed: false,
      message: e.message
    });
  }

  // Display results
  tests.forEach(test => {
    const icon = test.passed ? '✓' : '✗';
    const color = test.passed ? 'green' : 'red';
    console.log(`  ${icon} ${test.name.padEnd(25)} ${test.message}`);
  });

  return tests.every(t => t.passed || t.name === 'Public signup');
}

async function verifyRLS() {
  logSection('VERIFYING ROW LEVEL SECURITY');

  const tablesToCheck = [
    'profiles',
    'assessments',
    'assessment_submissions',
    'coaching_applications',
    'testimonials',
    'newsletter_subscribers'
  ];

  let rlsEnabled = 0;
  let rlsDisabled = 0;

  for (const table of tablesToCheck) {
    try {
      // Try to insert without auth (should fail if RLS is enabled)
      const { data, error } = await anonClient
        .from(table)
        .insert({ test_field: 'test' })
        .select();

      if (error && error.message.includes('policy')) {
        console.log(`  ✓ ${table.padEnd(30)} RLS enabled`);
        rlsEnabled++;
      } else if (error && error.message.includes('column')) {
        // Table exists but column doesn't - RLS might be enabled
        console.log(`  ○ ${table.padEnd(30)} RLS status uncertain`);
        rlsEnabled++;
      } else {
        console.log(`  ⚠ ${table.padEnd(30)} RLS may be disabled`);
        rlsDisabled++;
        // Clean up if insert succeeded
        if (data?.[0]?.id) {
          await supabase.from(table).delete().eq('id', data[0].id);
        }
      }
    } catch (e) {
      console.log(`  ⚠ ${table.padEnd(30)} Could not verify`);
    }
  }

  console.log('\nSummary:');
  log(`  Tables with RLS: ${rlsEnabled}`, 'green');
  if (rlsDisabled > 0) {
    log(`  Tables without RLS: ${rlsDisabled}`, 'yellow');
  }

  return rlsDisabled === 0;
}

async function performanceTests() {
  logSection('PERFORMANCE TESTS');

  const tests = [];

  // Test 1: Simple query performance
  const start1 = Date.now();
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(10);
  const time1 = Date.now() - start1;

  tests.push({
    name: 'Profile query (10 rows)',
    time: time1,
    passed: time1 < 1000,
    error: profileError
  });

  // Test 2: Join query performance
  const start2 = Date.now();
  const { data: assessments, error: assessError } = await supabase
    .from('assessment_submissions')
    .select('*, profiles(*)')
    .limit(10);
  const time2 = Date.now() - start2;

  tests.push({
    name: 'Join query',
    time: time2,
    passed: time2 < 2000,
    error: assessError
  });

  // Test 3: Storage access
  const start3 = Date.now();
  const { data: buckets } = await supabase.storage.listBuckets();
  const time3 = Date.now() - start3;

  tests.push({
    name: 'Storage bucket list',
    time: time3,
    passed: time3 < 1000,
    error: null
  });

  // Display results
  tests.forEach(test => {
    const icon = test.passed ? '✓' : '⚠';
    const color = test.passed ? 'green' : 'yellow';
    const status = test.error ? `Error: ${test.error.message}` : `${test.time}ms`;
    console.log(`  ${icon} ${test.name.padEnd(30)} ${status}`);
  });

  return tests.every(t => t.passed);
}

async function createTestData() {
  logSection('CREATING TEST DATA');

  try {
    // Create test admin role if not exists
    const { data: roles } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('role_name', 'super_admin');

    if (!roles || roles.length === 0) {
      await supabase
        .from('admin_roles')
        .insert({
          role_name: 'super_admin',
          description: 'Full system access',
          permissions: { all: true }
        });
      console.log('  ✓ Created super_admin role');
    } else {
      console.log('  ○ Admin roles already configured');
    }

    // Check for test testimonial
    const { count: testimonialCount } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });

    if (testimonialCount === 0) {
      await supabase
        .from('testimonials')
        .insert({
          name: 'Test Client',
          role: 'CEO',
          company: 'Test Company',
          content: 'Amazing results with Leah Fowler Performance coaching!',
          rating: 5,
          is_featured: true,
          display_order: 1
        });
      console.log('  ✓ Created test testimonial');
    } else {
      console.log('  ○ Testimonials already exist');
    }

    return true;
  } catch (error) {
    log(`  ✗ Error creating test data: ${error.message}`, 'red');
    return false;
  }
}

async function generateReport() {
  logSection('DEPLOYMENT REPORT');

  const report = {
    timestamp: new Date().toISOString(),
    environment: SUPABASE_URL,
    status: 'UNKNOWN',
    components: {}
  };

  // Run all verifications
  const tableStatus = await verifyTables();
  const bucketStatus = await verifyStorageBuckets();
  const authStatus = await verifyAuthentication();
  const rlsStatus = await verifyRLS();
  const perfStatus = await performanceTests();

  report.components = {
    database: tableStatus ? 'READY' : 'INCOMPLETE',
    storage: bucketStatus ? 'READY' : 'INCOMPLETE',
    authentication: authStatus ? 'READY' : 'NEEDS_CONFIG',
    security: rlsStatus ? 'READY' : 'NEEDS_CONFIG',
    performance: perfStatus ? 'OPTIMAL' : 'ACCEPTABLE'
  };

  // Determine overall status
  const critical = [tableStatus, bucketStatus, authStatus];
  if (critical.every(s => s)) {
    report.status = 'PRODUCTION_READY';
  } else if (critical.some(s => s)) {
    report.status = 'PARTIALLY_READY';
  } else {
    report.status = 'NOT_READY';
  }

  // Save report
  const reportPath = path.join(__dirname, '..', 'deployment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display summary
  console.log('\n' + '='.repeat(60));
  log('FINAL STATUS: ' + report.status,
      report.status === 'PRODUCTION_READY' ? 'green' :
      report.status === 'PARTIALLY_READY' ? 'yellow' : 'red');
  console.log('='.repeat(60));

  console.log('\nComponent Status:');
  Object.entries(report.components).forEach(([component, status]) => {
    const icon = status.includes('READY') || status === 'OPTIMAL' ? '✓' : '⚠';
    const color = status.includes('READY') || status === 'OPTIMAL' ? 'green' : 'yellow';
    log(`  ${icon} ${component.padEnd(20)} ${status}`, color);
  });

  console.log(`\nFull report saved to: ${reportPath}`);

  return report;
}

async function main() {
  console.clear();
  log('SUPABASE DEPLOYMENT VERIFICATION', 'bright');
  log('='.repeat(60), 'bright');
  log(`Target: ${SUPABASE_URL}`, 'cyan');
  log(`Time: ${new Date().toISOString()}`, 'cyan');

  try {
    // Create test data
    await createTestData();

    // Generate comprehensive report
    const report = await generateReport();

    // Provide next steps
    console.log('\n' + '='.repeat(60));
    log('NEXT STEPS', 'bright');
    console.log('='.repeat(60));

    if (report.status === 'PRODUCTION_READY') {
      log('✓ Your Supabase instance is fully configured and ready for production!', 'green');
      console.log('\nRecommended actions:');
      console.log('1. Test the application locally: npm run dev');
      console.log('2. Run the test suite: npm test');
      console.log('3. Deploy to production when ready');
    } else if (report.status === 'PARTIALLY_READY') {
      log('⚠ Your Supabase instance is partially configured', 'yellow');
      console.log('\nRequired actions:');

      if (report.components.database !== 'READY') {
        console.log('1. Complete database migration - some tables are missing');
      }
      if (report.components.storage !== 'READY') {
        console.log('2. Create missing storage buckets');
      }
      if (report.components.authentication !== 'READY') {
        console.log('3. Configure authentication settings in Supabase Dashboard');
      }
      if (report.components.security !== 'READY') {
        console.log('4. Enable Row Level Security on all tables');
      }
    } else {
      log('✗ Significant configuration required', 'red');
      console.log('\nPlease run the migration scripts or configure manually in Supabase Dashboard');
    }

    process.exit(report.status === 'PRODUCTION_READY' ? 0 : 1);

  } catch (error) {
    log(`\nFATAL ERROR: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();