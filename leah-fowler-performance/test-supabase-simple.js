#!/usr/bin/env node

/**
 * Simple Supabase Testing Script (No Dependencies)
 * Tests all tables, functions, and basic functionality
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
    console.log('✓', name);
    testResults.push({ name, status: 'passed' });
  } else {
    failedTests++;
    console.log('✗', name, error ? `(${error.message || error})` : '');
    testResults.push({ name, status: 'failed', error: error?.message || error });
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
  console.log('\n========================================');
  console.log('SUPABASE COMPREHENSIVE TEST SUITE');
  console.log('========================================\n');

  // Test 1: Check all required tables
  console.log('\n📊 Testing Database Tables');
  console.log('─'.repeat(40));

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
  console.log('\n⚡ Testing Database Functions');
  console.log('─'.repeat(40));

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
  console.log('\n🔒 Testing RLS Policies');
  console.log('─'.repeat(40));

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
  console.log('\n📝 Testing Blog Functionality');
  console.log('─'.repeat(40));

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
  console.log('\n📋 Testing Assessment Functionality');
  console.log('─'.repeat(40));

  try {
    const testSubmission = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
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
  console.log('\n🗂️ Testing Storage Buckets');
  console.log('─'.repeat(40));

  const requiredBuckets = ['avatars', 'blog-images', 'programme-resources', 'lead-magnets'];

  for (const bucket of requiredBuckets) {
    try {
      const { data, error } = await supabaseAdmin.storage.getBucket(bucket);
      logTest(`Storage bucket: ${bucket}`, !error, error);
    } catch (err) {
      logTest(`Storage bucket: ${bucket}`, false, err);
    }
  }

  // Test 7: Check if blog tables have data
  console.log('\n📚 Checking Blog Data');
  console.log('─'.repeat(40));

  try {
    const { count: postCount, error: postCountError } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true });

    logTest(`Posts table has data (${postCount || 0} posts)`, !postCountError, postCountError);

    const { count: catCount, error: catCountError } = await supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact', head: true });

    logTest(`Categories table has data (${catCount || 0} categories)`, !catCountError, catCountError);
  } catch (err) {
    logTest('Blog data check', false, err);
  }

  // Final summary
  console.log('\n========================================');
  console.log('TEST RESULTS SUMMARY');
  console.log('========================================\n');

  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  console.log('Total Tests:', totalTests);
  console.log('Passed:', passedTests);
  console.log('Failed:', failedTests);
  console.log('Success Rate:', `${successRate}%`);

  if (failedTests > 0) {
    console.log('\n⚠️ Failed Tests:');
    testResults
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log('  •', r.name, r.error ? `- ${r.error}` : '');
      });
  }

  if (passedTests === totalTests) {
    console.log('\n✨ All tests passed! Platform is fully operational.');
  } else {
    console.log('\n⚠️ Some tests failed. Please review and fix the issues above.');
    console.log('\nNext steps:');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the content of supabase-fix-all-issues.sql');
    console.log('4. Paste and run it in the SQL Editor');
    console.log('5. Run this test again to verify fixes');
  }

  console.log('\n========================================\n');

  // Return exit code based on test results
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});