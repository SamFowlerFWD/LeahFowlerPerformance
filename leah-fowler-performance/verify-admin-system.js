const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function verifyAdminSystem() {
  console.log('🔍 Verifying Admin System Installation...\n');
  console.log('Target:', SUPABASE_URL);
  console.log('Admin User ID:', 'dfd9154b-4238-4672-8a0a-e657a18532c5');
  console.log('=' .repeat(60) + '\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

  const checks = {
    tables: ['admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags'],
    functions: ['is_admin'],
    passed: 0,
    failed: 0
  };

  // Check tables
  console.log('📊 Checking Admin Tables:');
  for (const table of checks.tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (!error) {
      console.log(`   ✅ ${table} exists and is accessible`);
      checks.passed++;
    } else {
      console.log(`   ❌ ${table}: ${error.message}`);
      checks.failed++;
    }
  }

  // Check if functions work by trying to call them
  console.log('\n🔧 Checking Admin Functions:');
  try {
    // Test is_admin function with actual admin user
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin', { user_id: 'dfd9154b-4238-4672-8a0a-e657a18532c5' });

    if (!isAdminError) {
      console.log(`   ✅ is_admin() function exists and returns: ${isAdminResult}`);
      if (isAdminResult === true) {
        console.log('   ✅ Admin user correctly identified as admin');
        checks.passed++;
      } else {
        console.log('   ❌ Admin user NOT recognized (function returns false)');
        checks.failed++;
      }
    } else {
      console.log(`   ❌ is_admin(): ${isAdminError.message}`);
      checks.failed++;
    }

    // Test with non-admin user (should return false)
    const { data: notAdminResult } = await supabase
      .rpc('is_admin', { user_id: '00000000-0000-0000-0000-000000000000' });

    if (notAdminResult === false) {
      console.log('   ✅ is_admin() correctly returns false for non-admin');
      checks.passed++;
    } else {
      console.log('   ⚠️  is_admin() unexpected result for non-admin:', notAdminResult);
    }

  } catch (err) {
    console.log('   ⚠️ Error checking functions:', err.message);
    checks.failed++;
  }

  // Check admin user details
  console.log('\n👤 Checking Admin User:');
  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', 'dfd9154b-4238-4672-8a0a-e657a18532c5')
      .single();

    if (adminUser && !error) {
      console.log('   ✅ Admin user found in admin_users table:');
      console.log(`      Email: ${adminUser.email}`);
      console.log(`      Role: ${adminUser.role}`);
      console.log(`      Active: ${adminUser.is_active ? 'Yes' : 'No'}`);
      console.log(`      Created: ${new Date(adminUser.created_at).toLocaleDateString()}`);

      if (adminUser.is_active && adminUser.role === 'super_admin') {
        checks.passed++;
      } else {
        console.log('   ⚠️  Admin user exists but may not be properly configured');
        checks.failed++;
      }
    } else {
      console.log('   ❌ Admin user not found in admin_users table');
      checks.failed++;
    }
  } catch (err) {
    console.log('   ❌ Error checking admin user:', err.message);
    checks.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 VERIFICATION SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${checks.passed}`);
  console.log(`❌ Failed: ${checks.failed}`);

  if (checks.failed === 0) {
    console.log('\n🎉 Admin system is fully installed and operational!');
    console.log('\n📝 You can now login at:');
    console.log('   URL: https://leah.coach/admin/login');
    console.log('   Email: info@leah.coach');
    console.log('   Password: Use the password that was set for this user');
  } else if (checks.passed > checks.failed) {
    console.log('\n⚠️  Admin system is mostly working but has some issues');
    console.log('   The core functionality should work for admin login');
  } else {
    console.log('\n❌ Admin system has critical issues that need attention');
  }

  return checks;
}

verifyAdminSystem();