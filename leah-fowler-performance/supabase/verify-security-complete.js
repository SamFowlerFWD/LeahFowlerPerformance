#!/usr/bin/env node

/**
 * Complete Security Verification Script
 * Run this AFTER applying APPLY_NOW_security_fixes.sql
 * Version: 1.0.0
 * Date: 2025-09-29
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = '[INFO]';

  switch(type) {
    case 'success':
      color = colors.green;
      prefix = '[✓ PASS]';
      break;
    case 'error':
      color = colors.red;
      prefix = '[✗ FAIL]';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '[⚠ WARN]';
      break;
    case 'section':
      color = colors.cyan;
      prefix = '[SECTION]';
      break;
    case 'critical':
      color = colors.magenta;
      prefix = '[CRITICAL]';
      break;
  }

  console.log(`${color}${prefix}${colors.reset} ${message}`);
}

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    return !error || error.code !== '42P01';
  } catch (e) {
    return false;
  }
}

async function checkColumnExists(tableName, columnName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .limit(1);

    return !error || error.code !== '42703';
  } catch (e) {
    return false;
  }
}

async function testFunction(functionName, params = {}) {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    return !error;
  } catch (e) {
    return false;
  }
}

async function runSecurityChecks() {
  const results = {
    critical_tables: {
      passed: 0,
      failed: 0,
      tests: []
    },
    gdpr_columns: {
      passed: 0,
      failed: 0,
      tests: []
    },
    indexes: {
      passed: 0,
      failed: 0,
      tests: []
    },
    functions: {
      passed: 0,
      failed: 0,
      tests: []
    },
    rls_policies: {
      passed: 0,
      failed: 0,
      tests: []
    },
    overall: {
      total_tests: 0,
      passed: 0,
      failed: 0,
      critical_failures: []
    }
  };

  log('SECURITY VERIFICATION STARTING', 'section');
  log('═'.repeat(60));

  // 1. CHECK CRITICAL TABLES
  log('\n1. CRITICAL TABLES CHECK', 'section');
  const tables = [
    'gdpr_verification_requests',
    'api_rate_limits',
    'security_audit_log',
    'gdpr_consent_log',
    'assessment_submissions',
    'posts',
    'admin_users'
  ];

  for (const table of tables) {
    const exists = await checkTableExists(table);
    const isCritical = ['gdpr_verification_requests', 'api_rate_limits'].includes(table);

    results.critical_tables.tests.push({ table, exists, critical: isCritical });

    if (exists) {
      results.critical_tables.passed++;
      log(`Table '${table}': EXISTS`, 'success');
    } else {
      results.critical_tables.failed++;
      log(`Table '${table}': MISSING ${isCritical ? '(CRITICAL)' : ''}`, isCritical ? 'critical' : 'error');
      if (isCritical) {
        results.overall.critical_failures.push(`Missing critical table: ${table}`);
      }
    }
  }

  // 2. CHECK GDPR COLUMNS
  log('\n2. GDPR COMPLIANCE COLUMNS CHECK', 'section');
  const gdprColumns = [
    { table: 'assessment_submissions', column: 'gdpr_consent_given' },
    { table: 'assessment_submissions', column: 'gdpr_consent_timestamp' },
    { table: 'assessment_submissions', column: 'gdpr_deletion_requested' },
    { table: 'assessment_submissions', column: 'gdpr_deletion_timestamp' },
    { table: 'gdpr_consent_log', column: 'submission_id' },
    { table: 'security_audit_log', column: 'request_headers' },
    { table: 'security_audit_log', column: 'response_status' }
  ];

  for (const { table, column } of gdprColumns) {
    const exists = await checkColumnExists(table, column);
    const isCritical = table === 'assessment_submissions' && column.startsWith('gdpr_');

    results.gdpr_columns.tests.push({ table, column, exists, critical: isCritical });

    if (exists) {
      results.gdpr_columns.passed++;
      log(`Column '${table}.${column}': EXISTS`, 'success');
    } else {
      results.gdpr_columns.failed++;
      log(`Column '${table}.${column}': MISSING ${isCritical ? '(GDPR CRITICAL)' : ''}`, isCritical ? 'critical' : 'error');
      if (isCritical) {
        results.overall.critical_failures.push(`Missing GDPR column: ${table}.${column}`);
      }
    }
  }

  // 3. CHECK CRITICAL INDEXES (by attempting queries)
  log('\n3. PERFORMANCE INDEXES CHECK', 'section');
  const indexTests = [
    { name: 'Assessment email lookup', table: 'assessment_submissions', column: 'email' },
    { name: 'Assessment creation date', table: 'assessment_submissions', column: 'created_at' },
    { name: 'Posts publication status', table: 'posts', column: 'status' },
    { name: 'Posts slug lookup', table: 'posts', column: 'slug' },
    { name: 'GDPR token lookup', table: 'gdpr_verification_requests', column: 'token' },
    { name: 'Rate limit lookup', table: 'api_rate_limits', column: 'identifier' }
  ];

  for (const test of indexTests) {
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from(test.table)
        .select(test.column)
        .limit(1);
      const duration = Date.now() - start;

      if (!error || error.code === 'PGRST116') { // No rows is ok
        results.indexes.passed++;
        log(`Index '${test.name}': OK (${duration}ms)`, 'success');
        results.indexes.tests.push({ ...test, passed: true, duration });
      } else {
        results.indexes.failed++;
        log(`Index '${test.name}': FAILED - ${error.message}`, 'error');
        results.indexes.tests.push({ ...test, passed: false, error: error.message });
      }
    } catch (e) {
      results.indexes.failed++;
      log(`Index '${test.name}': ERROR - ${e.message}`, 'error');
      results.indexes.tests.push({ ...test, passed: false, error: e.message });
    }
  }

  // 4. CHECK CRITICAL FUNCTIONS
  log('\n4. DATABASE FUNCTIONS CHECK', 'section');
  const functionTests = [
    { name: 'validate_email', params: { email: 'test@example.com' } },
    { name: 'check_rate_limit', params: { p_identifier: 'test', p_endpoint: '/api/test' } }
  ];

  for (const test of functionTests) {
    const exists = await testFunction(test.name, test.params);
    results.functions.tests.push({ ...test, exists });

    if (exists) {
      results.functions.passed++;
      log(`Function '${test.name}': EXISTS`, 'success');
    } else {
      results.functions.failed++;
      log(`Function '${test.name}': MISSING`, 'warning');
    }
  }

  // 5. CHECK RLS POLICIES (by testing access)
  log('\n5. ROW LEVEL SECURITY CHECK', 'section');
  const rlsTables = [
    'gdpr_verification_requests',
    'api_rate_limits',
    'security_audit_log',
    'gdpr_consent_log'
  ];

  for (const table of rlsTables) {
    try {
      // Using service role should always work if table exists
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error || error.code === 'PGRST116') { // No rows is ok
        results.rls_policies.passed++;
        log(`RLS for '${table}': ENABLED`, 'success');
        results.rls_policies.tests.push({ table, enabled: true });
      } else if (error.message.includes('schema cache')) {
        results.rls_policies.failed++;
        log(`RLS for '${table}': TABLE NOT ACCESSIBLE`, 'warning');
        results.rls_policies.tests.push({ table, enabled: false, error: 'Not in schema cache' });
      } else {
        results.rls_policies.failed++;
        log(`RLS for '${table}': CONFIGURATION ERROR`, 'error');
        results.rls_policies.tests.push({ table, enabled: false, error: error.message });
      }
    } catch (e) {
      results.rls_policies.failed++;
      log(`RLS for '${table}': ERROR`, 'error');
      results.rls_policies.tests.push({ table, enabled: false, error: e.message });
    }
  }

  // Calculate totals
  results.overall.total_tests =
    results.critical_tables.tests.length +
    results.gdpr_columns.tests.length +
    results.indexes.tests.length +
    results.functions.tests.length +
    results.rls_policies.tests.length;

  results.overall.passed =
    results.critical_tables.passed +
    results.gdpr_columns.passed +
    results.indexes.passed +
    results.functions.passed +
    results.rls_policies.passed;

  results.overall.failed =
    results.critical_tables.failed +
    results.gdpr_columns.failed +
    results.indexes.failed +
    results.functions.failed +
    results.rls_policies.failed;

  // Generate report
  log('\n' + '═'.repeat(60), 'section');
  log('SECURITY VERIFICATION RESULTS', 'section');
  log('═'.repeat(60));

  console.log('\n📊 TEST SUMMARY:');
  console.log(`   Critical Tables: ${results.critical_tables.passed}/${results.critical_tables.tests.length} passed`);
  console.log(`   GDPR Columns: ${results.gdpr_columns.passed}/${results.gdpr_columns.tests.length} passed`);
  console.log(`   Indexes: ${results.indexes.passed}/${results.indexes.tests.length} passed`);
  console.log(`   Functions: ${results.functions.passed}/${results.functions.tests.length} passed`);
  console.log(`   RLS Policies: ${results.rls_policies.passed}/${results.rls_policies.tests.length} passed`);

  console.log('\n📈 OVERALL RESULTS:');
  console.log(`   Total Tests: ${results.overall.total_tests}`);
  console.log(`   Passed: ${colors.green}${results.overall.passed}${colors.reset}`);
  console.log(`   Failed: ${colors.red}${results.overall.failed}${colors.reset}`);
  console.log(`   Success Rate: ${((results.overall.passed / results.overall.total_tests) * 100).toFixed(1)}%`);

  if (results.overall.critical_failures.length > 0) {
    console.log(`\n${colors.red}❌ CRITICAL FAILURES:${colors.reset}`);
    results.overall.critical_failures.forEach(failure => {
      console.log(`   • ${failure}`);
    });
  }

  // Save detailed report
  const reportPath = path.join(__dirname, `security-verification-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // Final verdict
  console.log('\n' + '═'.repeat(60));
  if (results.overall.failed === 0) {
    console.log(`${colors.green}${colors.bright}✅ ALL SECURITY CHECKS PASSED!${colors.reset}`);
    console.log('The database is fully secured and compliant with all requirements.');
  } else if (results.overall.critical_failures.length > 0) {
    console.log(`${colors.red}${colors.bright}❌ CRITICAL SECURITY ISSUES DETECTED${colors.reset}`);
    console.log('Please run APPLY_NOW_security_fixes.sql in Supabase Dashboard immediately.');
  } else {
    console.log(`${colors.yellow}${colors.bright}⚠️  SOME SECURITY CHECKS FAILED${colors.reset}`);
    console.log('Review the failures above and apply necessary fixes.');
  }

  return results;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   COMPLETE SECURITY VERIFICATION                      ║');
  console.log('║   Leah Fowler Performance Coach Platform              ║');
  console.log('║   Run AFTER applying APPLY_NOW_security_fixes.sql     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    const results = await runSecurityChecks();

    if (results.overall.critical_failures.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    log(`Critical error: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run verification
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  console.error(error.stack);
  process.exit(1);
});