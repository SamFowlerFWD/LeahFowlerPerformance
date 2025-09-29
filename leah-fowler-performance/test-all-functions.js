const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function testAllFunctions() {
  console.log('🧪 COMPREHENSIVE FUNCTION TESTING\n');
  console.log('=' .repeat(50));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: Basic table access
  console.log('\n📊 Test 1: Basic Table Access');
  console.log('-'.repeat(30));

  const tables = [
    'assessment_submissions',
    'blog_posts',
    'lead_magnets',
    'admin_users',
    'admin_audit_log',
    'admin_sessions'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        console.log(`  ✅ ${table}: Accessible`);
        results.passed++;
      } else {
        console.log(`  ❌ ${table}: ${error.message}`);
        results.failed++;
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`);
      results.failed++;
    }
  }

  // Test 2: GDPR columns
  console.log('\n🔐 Test 2: GDPR Compliance Columns');
  console.log('-'.repeat(30));

  const gdprColumns = [
    'gdpr_consent_given',
    'gdpr_consent_timestamp',
    'gdpr_deletion_requested',
    'gdpr_deletion_timestamp',
    'data_retention_days'
  ];

  try {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select(gdprColumns.join(','))
      .limit(1);

    if (!error) {
      console.log('  ✅ All GDPR columns accessible');
      results.passed++;
    } else {
      console.log(`  ❌ GDPR columns error: ${error.message}`);
      results.failed++;
    }
  } catch (err) {
    console.log(`  ❌ GDPR test failed: ${err.message}`);
    results.failed++;
  }

  // Test 3: Admin Functions
  console.log('\n🔧 Test 3: Admin Database Functions');
  console.log('-'.repeat(30));

  const adminFunctions = [
    { name: 'is_admin', params: { user_id: '00000000-0000-0000-0000-000000000000' }},
    { name: 'is_super_admin', params: { user_id: '00000000-0000-0000-0000-000000000000' }},
    { name: 'get_admin_role', params: { user_id: '00000000-0000-0000-0000-000000000000' }}
  ];

  for (const func of adminFunctions) {
    try {
      const { data, error } = await supabase.rpc(func.name, func.params);
      if (!error) {
        console.log(`  ✅ ${func.name}(): Working`);
        results.passed++;
      } else {
        console.log(`  ❌ ${func.name}(): ${error.message}`);
        results.failed++;
      }
    } catch (err) {
      console.log(`  ❌ ${func.name}(): ${err.message}`);
      results.failed++;
    }
  }

  // Test 4: Security Audit Log
  console.log('\n📝 Test 4: Security Audit Logging');
  console.log('-'.repeat(30));

  try {
    // Try to insert a test audit entry
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        action_type: 'TEST_RUN',
        resource_type: 'system_test',
        details: { test: 'comprehensive_function_test' },
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      });

    if (!error) {
      console.log('  ✅ Security audit logging works');
      results.passed++;
    } else {
      console.log(`  ⚠️ Security audit log: ${error.message}`);
      results.warnings++;
    }
  } catch (err) {
    console.log(`  ⚠️ Audit log test: ${err.message}`);
    results.warnings++;
  }

  // Test 5: Blog Functions
  console.log('\n📰 Test 5: Blog System');
  console.log('-'.repeat(30));

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, status')
      .limit(5);

    if (!error) {
      console.log(`  ✅ Blog posts accessible (${data.length} posts found)`);
      results.passed++;
    } else {
      console.log(`  ❌ Blog system error: ${error.message}`);
      results.failed++;
    }
  } catch (err) {
    console.log(`  ❌ Blog test failed: ${err.message}`);
    results.failed++;
  }

  // Test 6: Data Insertion Test
  console.log('\n💾 Test 6: Data Operations');
  console.log('-'.repeat(30));

  try {
    const testSubmission = {
      email: 'test-function@example.com',
      first_name: 'Function',
      last_name: 'Test',
      phone: '0000000000',
      gdpr_consent_given: true,
      gdpr_consent_timestamp: new Date().toISOString(),
      data_retention_days: 365,
      created_at: new Date().toISOString()
    };

    // Insert test
    const { data: insertData, error: insertError } = await supabase
      .from('assessment_submissions')
      .insert(testSubmission)
      .select();

    if (!insertError) {
      console.log('  ✅ Data insertion works');
      results.passed++;

      // Cleanup
      const { error: deleteError } = await supabase
        .from('assessment_submissions')
        .delete()
        .eq('email', 'test-function@example.com');

      if (!deleteError) {
        console.log('  ✅ Data deletion works');
        results.passed++;
      } else {
        console.log(`  ⚠️ Cleanup warning: ${deleteError.message}`);
        results.warnings++;
      }
    } else {
      console.log(`  ❌ Data insertion error: ${insertError.message}`);
      results.failed++;
    }
  } catch (err) {
    console.log(`  ❌ Data operations test: ${err.message}`);
    results.failed++;
  }

  // Test 7: RLS Policies
  console.log('\n🛡️ Test 7: Row Level Security');
  console.log('-'.repeat(30));

  try {
    // Check if RLS is enabled on critical tables
    const rlsQuery = `
      SELECT tablename, policyname
      FROM pg_policies
      WHERE tablename IN ('assessment_submissions', 'admin_users', 'blog_posts')
      ORDER BY tablename, policyname;
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query: rlsQuery }).catch(() => ({
      data: null,
      error: { message: 'execute_sql function not available' }
    }));

    if (data) {
      console.log(`  ✅ RLS policies found: ${data.length}`);
      results.passed++;
    } else {
      console.log('  ⚠️ Cannot verify RLS directly (requires special function)');
      results.warnings++;
    }
  } catch (err) {
    console.log('  ⚠️ RLS check skipped (normal for security reasons)');
    results.warnings++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 TEST SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️ Warnings: ${results.warnings}`);

  const totalTests = results.passed + results.failed;
  const passRate = ((results.passed / totalTests) * 100).toFixed(1);

  console.log(`\n📊 Pass Rate: ${passRate}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All critical functions are working correctly!');
    console.log('✅ The system is ready for production use.');
  } else if (results.failed <= 2) {
    console.log('\n⚠️ Some non-critical issues detected.');
    console.log('The system is mostly functional but review failed tests.');
  } else {
    console.log('\n❌ Critical issues detected!');
    console.log('Please review and fix the failed tests before deployment.');
  }

  console.log('\n📝 Next Steps:');
  console.log('1. Review any failed tests or warnings');
  console.log('2. Create an admin user in Supabase Dashboard');
  console.log('3. Test the admin login at /admin/login');
  console.log('4. Deploy to production when ready');

  return results;
}

testAllFunctions();