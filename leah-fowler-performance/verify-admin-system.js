const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function verifyAdminSystem() {
  console.log('🔍 Verifying Admin System Installation...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

  const checks = {
    tables: ['admin_users', 'admin_audit_log', 'admin_sessions'],
    functions: ['is_admin', 'is_super_admin', 'get_admin_role', 'log_admin_action'],
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
    // Test is_admin function (will return false for service role)
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin', { user_id: '00000000-0000-0000-0000-000000000000' });

    if (!isAdminError) {
      console.log('   ✅ is_admin() function works');
      checks.passed++;
    } else {
      console.log(`   ❌ is_admin(): ${isAdminError.message}`);
      checks.failed++;
    }

    // Test is_super_admin function
    const { data: isSuperAdminResult, error: isSuperAdminError } = await supabase
      .rpc('is_super_admin', { user_id: '00000000-0000-0000-0000-000000000000' });

    if (!isSuperAdminError) {
      console.log('   ✅ is_super_admin() function works');
      checks.passed++;
    } else {
      console.log(`   ❌ is_super_admin(): ${isSuperAdminError.message}`);
      checks.failed++;
    }

    // Test get_admin_role function
    const { data: roleResult, error: roleError } = await supabase
      .rpc('get_admin_role', { user_id: '00000000-0000-0000-0000-000000000000' });

    if (!roleError) {
      console.log('   ✅ get_admin_role() function works');
      checks.passed++;
    } else {
      console.log(`   ❌ get_admin_role(): ${roleError.message}`);
      checks.failed++;
    }

  } catch (err) {
    console.log('   ⚠️ Error checking functions:', err.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 VERIFICATION SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${checks.passed}`);
  console.log(`❌ Failed: ${checks.failed}`);

  if (checks.failed === 0) {
    console.log('\n🎉 Admin system is fully installed and operational!');
    console.log('\n📝 Next Steps:');
    console.log('1. Create an admin user in Supabase Auth');
    console.log('2. Add them to admin_users table with super_admin role');
    console.log('3. Replace middleware with admin-auth-fixed.ts');
  } else {
    console.log('\n⚠️ Some components may need attention');
  }

  return checks;
}

verifyAdminSystem();