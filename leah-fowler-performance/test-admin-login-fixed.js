/**
 * Fixed test script for admin login functionality
 * Run with: node test-admin-login-fixed.js
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
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  // Test 2: Check admin_users table (without join first)
  console.log('2. Checking admin_users table...');
  const { data: adminUsers, error: adminError } = await serviceClient
    .from('admin_users')
    .select('*')
    .eq('email', ADMIN_EMAIL);

  if (adminError) {
    console.error('❌ Error checking admin_users:', adminError.message);
    console.log('   This table might not exist. Run the migration SQL files.\n');
  } else if (!adminUsers || adminUsers.length === 0) {
    console.error('❌ Admin user not found in admin_users table');
    console.log('   Action needed: Run create-leah-admin.sql in Supabase SQL editor\n');
  } else {
    console.log('✅ Admin user found');
    const admin = adminUsers[0];
    console.log('   Email:', admin.email);
    console.log('   Active:', admin.is_active);
    console.log('   User ID:', admin.user_id);
    console.log('   Role ID:', admin.role_id, '\n');

    // Now check the role separately
    if (admin.role_id) {
      const { data: role } = await serviceClient
        .from('admin_roles')
        .select('role_name')
        .eq('id', admin.role_id)
        .single();

      if (role) {
        console.log('   Role Name:', role.role_name, '\n');
      }
    }
  }

  // Test 3: Check if tables exist
  console.log('3. Checking required tables...');
  const tables = ['admin_users', 'admin_roles', 'admin_audit_log'];

  for (const table of tables) {
    const { error } = await serviceClient
      .from(table)
      .select('*')
      .limit(1);

    if (error && error.message.includes('not found')) {
      console.error(`❌ Table '${table}' does not exist`);
    } else {
      console.log(`✅ Table '${table}' exists`);
    }
  }
  console.log();

  // Test 4: Test inserting to admin_audit_log (if admin exists)
  if (adminUsers && adminUsers[0]) {
    console.log('4. Testing admin_audit_log insertion...');
    const { error: insertError } = await serviceClient
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUsers[0].id,
        user_email: ADMIN_EMAIL,
        action_type: 'test',
        resource_type: 'test_script',
        resource_details: { test: true, timestamp: new Date().toISOString() }
      });

    if (insertError) {
      console.error('❌ Failed to insert audit log:', insertError.message);
      if (insertError.message.includes('violates row-level security')) {
        console.log('   RLS policies need to be fixed. Run fix-admin-rls-policies.sql\n');
      }
    } else {
      console.log('✅ Successfully inserted test audit log\n');
    }
  }

  // Test 5: Check if auth functions exist
  console.log('5. Testing auth helper functions...');
  if (adminUsers && adminUsers[0]) {
    const userId = adminUsers[0].user_id;

    // Test is_admin function
    try {
      const { data: isAdmin, error: isAdminError } = await serviceClient
        .rpc('is_admin', { check_user_id: userId });

      if (isAdminError) {
        if (isAdminError.message.includes('not exist')) {
          console.log('❌ is_admin function does not exist');
          console.log('   Run fix-admin-rls-policies.sql to create it');
        } else {
          console.log('❌ is_admin function error:', isAdminError.message);
        }
      } else {
        console.log(`✅ is_admin function works. Result:`, isAdmin);
      }
    } catch (e) {
      console.log('❌ Error testing is_admin:', e.message);
    }

    // Test get_admin_role function
    try {
      const { data: role, error: roleError } = await serviceClient
        .rpc('get_admin_role', { check_user_id: userId });

      if (roleError) {
        if (roleError.message.includes('not exist')) {
          console.log('❌ get_admin_role function does not exist');
          console.log('   Run fix-admin-rls-policies.sql to create it');
        } else {
          console.log('❌ get_admin_role function error:', roleError.message);
        }
      } else {
        console.log(`✅ get_admin_role function works. Result:`, role);
      }
    } catch (e) {
      console.log('❌ Error testing get_admin_role:', e.message);
    }
  }

  console.log('\n==================================');
  console.log('DIAGNOSIS COMPLETE\n');

  console.log('Next Steps:');
  console.log('1. Go to your Supabase Dashboard (https://supabase.com/dashboard)');
  console.log('2. Navigate to the SQL Editor');
  console.log('3. Run these SQL files in order:');
  console.log('   a. create-leah-admin.sql (creates admin user)');
  console.log('   b. fix-admin-rls-policies.sql (fixes permissions)');
  console.log('4. After running the SQL, try logging in at /admin/login');
  console.log('\nAdmin credentials: info@leah.coach (use the password you set in Supabase Auth)');
}

testAdminLogin().catch(console.error);