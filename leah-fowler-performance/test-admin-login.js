/**
 * Test script for admin login functionality
 * Run with: node test-admin-login.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'info@leah.coach';

console.log('Testing Admin Login Functionality');
console.log('==================================\n');

async function testAdminLogin() {
  // Test 1: Check environment variables
  console.log('1. Checking environment variables...');
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing environment variables');
    console.log('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
    console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓' : '✗');
    console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
    process.exit(1);
  }
  console.log('✅ All environment variables present\n');

  // Create clients
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Test 2: Check if admin user exists in auth.users
  console.log('2. Checking if admin user exists in auth.users...');
  const { data: authUsers, error: authError } = await serviceClient
    .from('auth.users')
    .select('id, email')
    .eq('email', ADMIN_EMAIL);

  if (authError) {
    console.error('❌ Error checking auth.users:', authError.message);
    console.log('Note: You might need to access this directly in Supabase dashboard\n');
  } else if (!authUsers || authUsers.length === 0) {
    console.error('❌ User not found in auth.users');
    console.log('Action needed: Create user in Supabase Dashboard > Authentication > Users\n');
  } else {
    console.log('✅ User found in auth.users');
    console.log('   User ID:', authUsers[0].id, '\n');
  }

  // Test 3: Check admin_users table
  console.log('3. Checking admin_users table...');
  const { data: adminUsers, error: adminError } = await serviceClient
    .from('admin_users')
    .select('*, admin_roles!inner(role_name)')
    .eq('email', ADMIN_EMAIL);

  if (adminError) {
    console.error('❌ Error checking admin_users:', adminError.message);
  } else if (!adminUsers || adminUsers.length === 0) {
    console.error('❌ Admin user not found in admin_users table');
    console.log('Action needed: Run create-leah-admin.sql in Supabase SQL editor\n');
  } else {
    console.log('✅ Admin user found');
    const admin = adminUsers[0];
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.admin_roles?.role_name || 'Unknown');
    console.log('   Active:', admin.is_active);
    console.log('   User ID:', admin.user_id, '\n');
  }

  // Test 4: Check RLS policies on admin_audit_log
  console.log('4. Checking RLS policies on admin_audit_log...');
  const { data: policies, error: policyError } = await serviceClient
    .rpc('check_table_policies', { table_name: 'admin_audit_log' })
    .catch(() => ({ data: null, error: 'Function not available' }));

  if (policyError || !policies) {
    console.log('⚠️  Cannot automatically check RLS policies');
    console.log('   Manual check needed in Supabase dashboard\n');
  } else {
    console.log('✅ RLS policies checked\n');
  }

  // Test 5: Test inserting to admin_audit_log
  console.log('5. Testing admin_audit_log insertion...');
  const { error: insertError } = await serviceClient
    .from('admin_audit_log')
    .insert({
      admin_user_id: adminUsers?.[0]?.id || null,
      user_email: ADMIN_EMAIL,
      action_type: 'test',
      resource_type: 'test_script',
      resource_details: { test: true }
    });

  if (insertError) {
    console.error('❌ Failed to insert audit log:', insertError.message);
    console.log('Action needed: Run fix-admin-rls-policies.sql\n');
  } else {
    console.log('✅ Successfully inserted test audit log\n');
  }

  // Test 6: Test functions
  console.log('6. Testing helper functions...');
  if (adminUsers && adminUsers[0]) {
    const userId = adminUsers[0].user_id;

    // Test is_admin function
    const { data: isAdmin, error: isAdminError } = await serviceClient
      .rpc('is_admin', { check_user_id: userId });

    if (isAdminError) {
      console.log('❌ is_admin function error:', isAdminError.message);
    } else {
      console.log(`✅ is_admin(${userId}):`, isAdmin);
    }

    // Test is_super_admin function
    const { data: isSuperAdmin, error: isSuperAdminError } = await serviceClient
      .rpc('is_super_admin', { check_user_id: userId });

    if (isSuperAdminError) {
      console.log('❌ is_super_admin function error:', isSuperAdminError.message);
    } else {
      console.log(`✅ is_super_admin(${userId}):`, isSuperAdmin);
    }

    // Test get_admin_role function
    const { data: role, error: roleError } = await serviceClient
      .rpc('get_admin_role', { check_user_id: userId });

    if (roleError) {
      console.log('❌ get_admin_role function error:', roleError.message);
    } else {
      console.log(`✅ get_admin_role(${userId}):`, role);
    }
  }

  console.log('\n==================================');
  console.log('Test Summary:');
  console.log('If all tests passed (✅), the admin login should work.');
  console.log('If any tests failed (❌), run the suggested SQL files in Supabase.');
  console.log('\nSQL files to run (in order):');
  console.log('1. create-leah-admin.sql');
  console.log('2. fix-admin-rls-policies.sql');
}

testAdminLogin().catch(console.error);