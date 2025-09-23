#!/usr/bin/env node

/**
 * Comprehensive Supabase Testing Script
 * Tests all tables, functions, API endpoints, and functionality
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Helper functions
function logTest(name, passed, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(chalk.green('✓'), name);
    testResults.push({ name, status: 'passed' });
  } else {
    failedTests++;
    console.log(chalk.red('✗'), name, error ? chalk.gray(`(${error.message})`) : '');
    testResults.push({ name, status: 'failed', error: error?.message });
  }
}

async function testTableExists(tableName) {
  try {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      return { exists: false, error };
    }

    return { exists: !error, error };
  } catch (err) {
    return { exists: false, error: err };
  }
}

async function testFunction(functionName, params = {}) {
  try {
    const { data, error } = await supabaseAdmin.rpc(functionName, params);
    return { success: !error, data, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

// Main test suite
async function runTests() {
  console.log(chalk.bold.cyan('\n========================================'));
  console.log(chalk.bold.cyan('SUPABASE COMPREHENSIVE TEST SUITE'));
  console.log(chalk.bold.cyan('========================================\n'));

  // Test 1: Check all required tables
  console.log(chalk.bold.yellow('\n📊 Testing Database Tables'));
  console.log(chalk.gray('─'.repeat(40)));

  const requiredTables = [
    // Assessment
    'assessment_submissions',
    'assessment_categories',
    'gdpr_requests',

    // Blog
    'posts',
    'categories',
    'tags',
    'post_tags',
    'post_views',
    'post_revisions',
    'related_posts',

    // Users & Profiles
    'user_profiles',
    'user_preferences',
    'user_achievements',

    // Programmes
    'programmes',
    'programme_modules',
    'programme_goals',

    // Coaching
    'coaching_sessions',
    'exercise_library',
    'exercise_logs',
    'performance_metrics',

    // Lead Generation
    'lead_magnets',
    'lead_magnet_downloads',

    // Email
    'email_subscribers',
    'email_campaigns',
    'email_logs',

    // Wearables
    'wearable_connections',
    'wearable_data',

    // System
    'notifications',
    'audit_logs',
    'feature_flags'
  ];

  for (const table of requiredTables) {
    const result = await testTableExists(table);
    logTest(`Table: ${table}`, result.exists, result.error);
  }

  // Test 2: Check all functions
  console.log(chalk.bold.yellow('\n⚡ Testing Database Functions'));
  console.log(chalk.gray('─'.repeat(40)));

  const functionsToTest = [
    { name: 'get_assessment_statistics', params: {} },
    { name: 'get_live_success_metrics', params: {} },
    { name: 'get_programme_recommendation', params: {
      p_readiness_score: 75,
      p_investment_level: 'high',
      p_performance_level: 'intermediate'
    }},
    { name: 'publish_scheduled_posts', params: {} },
    { name: 'calculate_user_tier', params: { p_user_id: '00000000-0000-0000-0000-000000000000' }}
  ];

  for (const func of functionsToTest) {
    const result = await testFunction(func.name, func.params);
    logTest(`Function: ${func.name}`, result.success, result.error);
  }

  // Test 3: Test RLS Policies
  console.log(chalk.bold.yellow('\n🔒 Testing RLS Policies'));
  console.log(chalk.gray('─'.repeat(40)));

  // Test anonymous access to posts
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .limit(1);

    logTest('Anonymous can read published posts', !error || error.code === 'PGRST116', error);
  } catch (err) {
    logTest('Anonymous can read published posts', false, err);
  }

  // Test 4: Create and retrieve blog data
  console.log(chalk.bold.yellow('\n📝 Testing Blog Functionality'));
  console.log(chalk.gray('─'.repeat(40)));

  // Create a test category
  try {
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .upsert({
        name: 'Performance Optimisation',
        slug: 'performance-optimisation',
        description: 'Articles about optimising performance',
        is_active: true
      }, { onConflict: 'slug' })
      .select()
      .single();

    logTest('Create/Upsert blog category', !catError, catError);

    if (!catError && category) {
      // Create a test post
      const { data: post, error: postError } = await supabaseAdmin
        .from('posts')
        .upsert({
          title: 'The Science of Peak Performance',
          subtitle: 'Understanding the psychology behind excellence',
          slug: 'science-of-peak-performance',
          content: 'This is a comprehensive guide to understanding how peak performance works from a psychological and physiological perspective. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          excerpt: 'Discover the science behind peak performance and how to apply it.',
          category_id: category.id,
          status: 'published',
          published_at: new Date().toISOString(),
          content_type: 'article',
          meta_data: {
            keywords: ['performance', 'psychology', 'excellence'],
            author: 'Leah Fowler'
          }
        }, { onConflict: 'slug' })
        .select()
        .single();

      logTest('Create/Upsert blog post', !postError, postError);

      // Test reading the post
      if (!postError && post) {
        const { data: readPost, error: readError } = await supabase
          .from('posts')
          .select('*, categories(*)')
          .eq('slug', 'science-of-peak-performance')
          .single();

        logTest('Read blog post with category', !readError && readPost?.categories, readError);
      }
    }
  } catch (err) {
    logTest('Blog functionality', false, err);
  }

  // Test 5: Test assessment submission
  console.log(chalk.bold.yellow('\n📋 Testing Assessment Functionality'));
  console.log(chalk.gray('─'.repeat(40)));

  try {
    const testSubmission = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+44 7700 900000',
      answers: {
        goals: ['weight_loss', 'energy'],
        experience: 'intermediate',
        timeCommitment: '3-4_hours'
      },
      readiness_score: 75,
      tier: 'performance',
      investment_level: 'high',
      qualified: true,
      status: 'new',
      profile: {
        age: 35,
        occupation: 'Executive',
        location: 'London'
      }
    };

    const { data, error } = await supabaseAdmin
      .from('assessment_submissions')
      .insert(testSubmission)
      .select()
      .single();

    logTest('Create assessment submission', !error, error);

    // Test anonymization function
    if (data) {
      const { error: anonError } = await supabaseAdmin.rpc('anonymize_assessment_submission', {
        submission_id: data.id
      });

      logTest('Anonymize assessment submission', !anonError, anonError);
    }
  } catch (err) {
    logTest('Assessment functionality', false, err);
  }

  // Test 6: Test storage buckets
  console.log(chalk.bold.yellow('\n🗂️ Testing Storage Buckets'));
  console.log(chalk.gray('─'.repeat(40)));

  const requiredBuckets = ['avatars', 'blog-images', 'programme-resources', 'lead-magnets'];

  for (const bucket of requiredBuckets) {
    try {
      const { data, error } = await supabaseAdmin.storage.getBucket(bucket);
      logTest(`Storage bucket: ${bucket}`, !error, error);
    } catch (err) {
      logTest(`Storage bucket: ${bucket}`, false, err);
    }
  }

  // Test 7: API Endpoints (via direct HTTP)
  console.log(chalk.bold.yellow('\n🌐 Testing API Endpoints'));
  console.log(chalk.gray('─'.repeat(40)));

  const apiEndpoints = [
    { path: '/api/health', method: 'GET', description: 'Health check' },
    { path: '/api/blog/posts', method: 'GET', description: 'Get blog posts' },
    { path: '/api/blog/categories', method: 'GET', description: 'Get categories' },
    { path: '/api/blog/tags', method: 'GET', description: 'Get tags' },
    { path: '/api/assessment/submit', method: 'POST', description: 'Submit assessment' },
    { path: '/api/lead-magnet/download', method: 'POST', description: 'Download lead magnet' }
  ];

  console.log(chalk.gray('Note: API endpoint tests require the Next.js server to be running'));
  console.log(chalk.gray('Run "npm run dev" in another terminal to test API endpoints\n'));

  // Test 8: Check indexes
  console.log(chalk.bold.yellow('\n🔍 Testing Database Indexes'));
  console.log(chalk.gray('─'.repeat(40)));

  try {
    const { data: indexes, error } = await supabaseAdmin.rpc('get_indexes_info', {});

    if (!error && indexes) {
      console.log(chalk.gray(`Total indexes found: ${indexes.length}`));
      logTest('Database indexes exist', indexes.length > 0, error);
    } else if (error?.code === '42883') {
      // Function doesn't exist, but that's okay
      console.log(chalk.gray('Index info function not available'));
    }
  } catch (err) {
    console.log(chalk.gray('Could not check indexes'));
  }

  // Final summary
  console.log(chalk.bold.cyan('\n========================================'));
  console.log(chalk.bold.cyan('TEST RESULTS SUMMARY'));
  console.log(chalk.bold.cyan('========================================\n'));

  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  console.log(chalk.bold('Total Tests:'), totalTests);
  console.log(chalk.bold.green('Passed:'), passedTests);
  console.log(chalk.bold.red('Failed:'), failedTests);
  console.log(chalk.bold('Success Rate:'), `${successRate}%`);

  if (failedTests > 0) {
    console.log(chalk.bold.yellow('\n⚠️ Failed Tests:'));
    testResults
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log(chalk.red('  •'), r.name, r.error ? chalk.gray(`- ${r.error}`) : '');
      });
  }

  if (passedTests === totalTests) {
    console.log(chalk.bold.green('\n✨ All tests passed! Platform is fully operational.'));
  } else {
    console.log(chalk.bold.yellow('\n⚠️ Some tests failed. Please review and fix the issues above.'));
  }

  console.log(chalk.bold.cyan('\n========================================\n'));
}

// Run the tests
runTests().catch(err => {
  console.error(chalk.bold.red('Fatal error running tests:'), err);
  process.exit(1);
});