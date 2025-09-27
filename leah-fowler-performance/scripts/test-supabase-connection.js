#!/usr/bin/env node

/**
 * Test Supabase Connection and List Existing Tables
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Method 1: Try to list tables via information_schema
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!error && data) {
      console.log('✓ Connected successfully!');
      console.log(`Found ${data.length} tables in public schema:`);
      data.forEach(table => console.log(`  - ${table.table_name}`));
      return;
    }
  } catch (e) {
    console.log('Could not query information_schema directly');
  }

  // Method 2: Try to query known tables
  const testTables = [
    'profiles', 'admin_users', 'admin_roles', 'subscriptions',
    'coaching_applications', 'blog_posts', 'testimonials',
    'newsletter_subscribers', 'assessments', 'assessment_submissions'
  ];

  console.log('Checking for existing tables:');

  for (const table of testTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`  ✓ ${table} exists (${count || 0} rows)`);
      } else if (error.message.includes('does not exist')) {
        console.log(`  ✗ ${table} does not exist`);
      } else {
        console.log(`  ⚠ ${table}: ${error.message}`);
      }
    } catch (e) {
      console.log(`  ⚠ ${table}: Error checking`);
    }
  }

  // Method 3: Try to check storage buckets
  console.log('\nChecking storage buckets:');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (!error && buckets) {
      console.log(`Found ${buckets.length} storage buckets:`);
      buckets.forEach(bucket => console.log(`  ✓ ${bucket.id} (${bucket.public ? 'public' : 'private'})`));
    }
  } catch (e) {
    console.log('Could not list storage buckets');
  }

  // Method 4: Test authentication
  console.log('\nTesting authentication:');
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log(`  ${error ? '✗' : '✓'} Auth system is ${error ? 'not ' : ''}accessible`);
  } catch (e) {
    console.log('  ⚠ Auth check failed');
  }
}

testConnection();