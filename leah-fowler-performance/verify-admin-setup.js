/**
 * Verify Admin Setup Script
 * Run after executing COMPLETE-ADMIN-FIX.sql in Supabase
 * Usage: node verify-admin-setup.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifySetup() {
  console.log('========================================');
  console.log('ADMIN SETUP VERIFICATION');
  console.log('========================================\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  });

  // Check admin user
  console.log('1. Checking admin user...');
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', 'info@leah.coach')
    .single();

  if (adminError) {
    console.error('❌ Error:', adminError.message);
    return;
  }

  if (!admin) {
    console.error('❌ Admin user not found');
    console.log('   Run COMPLETE-ADMIN-FIX.sql first');
    return;
  }

  console.log('✅ Admin user found:');
  console.log('   Email:', admin.email);
  console.log('   User ID:', admin.user_id || '⚠️  NOT SET - Need to link to Auth user');
  console.log('   Active:', admin.is_active ? '✅' : '❌');
  console.log('   Role ID:', admin.role_id || '⚠️  NOT SET');

  // Check role
  if (admin.role_id) {
    const { data: role } = await supabase
      .from('admin_roles')
      .select('role_name')
      .eq('id', admin.role_id)
      .single();

    if (role) {
      console.log('   Role:', role.role_name);
    }
  }

  // Test functions if user_id exists
  if (admin.user_id) {
    console.log('\n2. Testing helper functions...');

    const { data: isAdmin } = await supabase
      .rpc('is_admin', { check_user_id: admin.user_id });
    console.log('   is_admin():', isAdmin ? '✅' : '❌');

    const { data: isSuperAdmin } = await supabase
      .rpc('is_super_admin', { check_user_id: admin.user_id });
    console.log('   is_super_admin():', isSuperAdmin ? '✅' : '❌');

    const { data: role } = await supabase
      .rpc('get_admin_role', { check_user_id: admin.user_id });
    console.log('   get_admin_role():', role || 'None');
  } else {
    console.log('\n⚠️  Cannot test functions - user_id not set');
    console.log('   Action needed: Link admin_users entry to auth.users');
  }

  // Test audit log
  console.log('\n3. Testing audit log...');
  if (admin.id) {
    const { error: auditError } = await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: admin.id,
        user_email: admin.email,
        action_type: 'verify_test',
        resource_type: 'setup_verification',
        resource_details: { test: true }
      });

    if (auditError) {
      console.error('❌ Audit log insert failed:', auditError.message);
    } else {
      console.log('✅ Audit log insert successful');
    }
  }

  console.log('\n========================================');
  console.log('STATUS SUMMARY:');
  console.log('========================================');

  if (!admin.user_id) {
    console.log('\n⚠️  ADMIN NOT FULLY CONFIGURED');
    console.log('\nNext steps:');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Create user with email: info@leah.coach');
    console.log('3. Copy the user ID');
    console.log('4. Run this SQL in Supabase:');
    console.log(`   UPDATE admin_users`);
    console.log(`   SET user_id = 'PASTE-USER-ID-HERE'`);
    console.log(`   WHERE email = 'info@leah.coach';`);
    console.log('5. Run this verification script again');
  } else if (admin.is_active && admin.role_id) {
    console.log('\n✅ ADMIN FULLY CONFIGURED');
    console.log('\nYou can now log in at:');
    console.log('https://leah.coach/admin/login');
    console.log('\nCredentials:');
    console.log('Email: info@leah.coach');
    console.log('Password: (the one you set in Supabase Auth)');
  } else {
    console.log('\n⚠️  ADMIN PARTIALLY CONFIGURED');
    console.log('Check the issues above and fix them.');
  }
}

verifySetup().catch(console.error);