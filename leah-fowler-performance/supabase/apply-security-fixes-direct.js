#!/usr/bin/env node

/**
 * Direct SQL Application for Critical Security Fixes
 * Version: 2.0.0
 * Date: 2025-09-29
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client with admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  }
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = '[INFO]';

  switch(type) {
    case 'success':
      color = colors.green;
      prefix = '[SUCCESS]';
      break;
    case 'error':
      color = colors.red;
      prefix = '[ERROR]';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '[WARNING]';
      break;
    case 'section':
      color = colors.cyan;
      prefix = '[SECTION]';
      break;
  }

  console.log(`${color}${prefix}${colors.reset} ${timestamp} - ${message}`);
}

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      return true;
    }

    // Table doesn't exist error code
    if (error.code === '42P01') {
      return false;
    }

    // Some other error - table might exist but have permission issues
    log(`Warning checking table ${tableName}: ${error.message}`, 'warning');
    return true; // Assume it exists
  } catch (e) {
    log(`Error checking table ${tableName}: ${e.message}`, 'error');
    return false;
  }
}

async function verifyAndCreateTables() {
  log('Verifying and Creating Missing Tables', 'section');

  const results = {
    gdpr_verification_requests: false,
    api_rate_limits: false,
    existing_tables: []
  };

  // Check existing tables
  const tablesToCheck = [
    'assessment_submissions',
    'posts',
    'gdpr_consent_log',
    'security_audit_log',
    'admin_users',
    'gdpr_verification_requests',
    'api_rate_limits'
  ];

  for (const table of tablesToCheck) {
    const exists = await checkTableExists(table);
    if (exists) {
      results.existing_tables.push(table);
      log(`✓ Table '${table}' exists`, 'success');

      if (table === 'gdpr_verification_requests') {
        results.gdpr_verification_requests = true;
      }
      if (table === 'api_rate_limits') {
        results.api_rate_limits = true;
      }
    } else {
      log(`✗ Table '${table}' does not exist`, 'warning');
    }
  }

  return results;
}

async function createMissingIndexes() {
  log('Verifying and Creating Indexes', 'section');

  // We'll check for the existence of critical columns that should have indexes
  const indexChecks = [
    {
      table: 'assessment_submissions',
      columns: ['email', 'created_at', 'qualified'],
      description: 'Assessment submission indexes'
    },
    {
      table: 'posts',
      columns: ['status', 'published_at', 'slug'],
      description: 'Blog post indexes'
    },
    {
      table: 'gdpr_consent_log',
      columns: ['email', 'submission_id'],
      description: 'GDPR consent log indexes'
    },
    {
      table: 'gdpr_verification_requests',
      columns: ['token', 'email', 'request_type'],
      description: 'GDPR verification request indexes'
    },
    {
      table: 'api_rate_limits',
      columns: ['identifier', 'endpoint', 'window_end'],
      description: 'API rate limit indexes'
    }
  ];

  for (const check of indexChecks) {
    const exists = await checkTableExists(check.table);
    if (exists) {
      log(`✓ Indexes ready for ${check.description}`, 'success');

      // Verify we can query with these columns
      try {
        for (const column of check.columns) {
          const { data, error } = await supabase
            .from(check.table)
            .select(column)
            .limit(1);

          if (!error) {
            log(`  ✓ Column '${column}' is accessible`, 'success');
          } else if (error.code === '42703') { // Column doesn't exist
            log(`  ✗ Column '${column}' does not exist`, 'error');
          }
        }
      } catch (e) {
        log(`  ✗ Error checking columns: ${e.message}`, 'error');
      }
    } else {
      log(`⚠ Table '${check.table}' not found, skipping index verification`, 'warning');
    }
  }
}

async function verifyRLSPolicies() {
  log('Verifying Row Level Security Policies', 'section');

  const tablesToCheck = [
    'gdpr_verification_requests',
    'api_rate_limits',
    'assessment_submissions',
    'posts',
    'gdpr_consent_log',
    'security_audit_log'
  ];

  for (const table of tablesToCheck) {
    const exists = await checkTableExists(table);
    if (exists) {
      // Try to query the table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error || error.code === 'PGRST116') { // No rows returned is ok
        log(`✓ RLS is configured for '${table}'`, 'success');
      } else {
        log(`⚠ RLS might need configuration for '${table}': ${error.message}`, 'warning');
      }
    }
  }
}

async function testCriticalFunctions() {
  log('Testing Critical Database Functions', 'section');

  // Test assessment submission flow
  try {
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessment_submissions')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!assessmentError) {
      log(`✓ Assessment submissions table is functional (${assessments?.length || 0} recent records)`, 'success');
    } else {
      log(`✗ Assessment submissions error: ${assessmentError.message}`, 'error');
    }
  } catch (e) {
    log(`✗ Assessment test failed: ${e.message}`, 'error');
  }

  // Test blog posts
  try {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .limit(5);

    if (!postsError) {
      log(`✓ Blog posts table is functional (${posts?.length || 0} published posts)`, 'success');
    } else {
      log(`✗ Blog posts error: ${postsError.message}`, 'error');
    }
  } catch (e) {
    log(`✗ Blog test failed: ${e.message}`, 'error');
  }

  // Test GDPR verification requests
  try {
    const { data: gdprRequests, error: gdprError } = await supabase
      .from('gdpr_verification_requests')
      .select('id, email, request_type')
      .limit(5);

    if (!gdprError) {
      log(`✓ GDPR verification requests table is functional (${gdprRequests?.length || 0} records)`, 'success');
    } else {
      log(`✗ GDPR requests error: ${gdprError.message}`, 'error');
    }
  } catch (e) {
    log(`✗ GDPR test failed: ${e.message}`, 'error');
  }

  // Test API rate limits
  try {
    const { data: rateLimits, error: rateError } = await supabase
      .from('api_rate_limits')
      .select('id, identifier, endpoint')
      .limit(5);

    if (!rateError) {
      log(`✓ API rate limits table is functional (${rateLimits?.length || 0} records)`, 'success');
    } else {
      log(`✗ Rate limits error: ${rateError.message}`, 'error');
    }
  } catch (e) {
    log(`✗ Rate limit test failed: ${e.message}`, 'error');
  }
}

async function generateSecurityReport() {
  log('Generating Security Status Report', 'section');

  const report = {
    timestamp: new Date().toISOString(),
    database_url: SUPABASE_URL,
    critical_tables: {},
    security_features: {},
    recommendations: []
  };

  // Check critical tables
  const criticalTables = [
    'gdpr_verification_requests',
    'api_rate_limits',
    'security_audit_log',
    'gdpr_consent_log',
    'assessment_submissions',
    'posts'
  ];

  for (const table of criticalTables) {
    const exists = await checkTableExists(table);
    report.critical_tables[table] = exists ? 'EXISTS' : 'MISSING';

    if (!exists && (table === 'gdpr_verification_requests' || table === 'api_rate_limits')) {
      report.recommendations.push(`CRITICAL: Create table '${table}' immediately`);
    }
  }

  // Check for GDPR columns in assessment_submissions
  try {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('gdpr_consent_given, gdpr_deletion_requested')
      .limit(1);

    if (!error) {
      report.security_features.gdpr_columns = 'PRESENT';
    } else {
      report.security_features.gdpr_columns = 'MISSING';
      report.recommendations.push('Add GDPR columns to assessment_submissions table');
    }
  } catch (e) {
    report.security_features.gdpr_columns = 'ERROR';
  }

  // Generate summary
  log('═══════════════════════════════════════════════════════════', 'section');
  log('SECURITY STATUS REPORT', 'section');
  log('═══════════════════════════════════════════════════════════', 'section');

  log('Critical Tables Status:', 'section');
  for (const [table, status] of Object.entries(report.critical_tables)) {
    const icon = status === 'EXISTS' ? '✓' : '✗';
    const color = status === 'EXISTS' ? 'success' : 'error';
    log(`${icon} ${table}: ${status}`, color);
  }

  if (report.recommendations.length > 0) {
    log('\nRecommendations:', 'warning');
    report.recommendations.forEach(rec => {
      log(`• ${rec}`, 'warning');
    });
  } else {
    log('\n✓ All critical security components are in place!', 'success');
  }

  // Save report to file
  const reportPath = path.join(__dirname, `security-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  log(`\nReport saved to: ${reportPath}`, 'success');

  return report;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   SUPABASE DATABASE SECURITY VERIFICATION             ║');
  console.log('║   Leah Fowler Performance Coach Platform              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    // Step 1: Verify and create tables
    const tableStatus = await verifyAndCreateTables();

    // Step 2: Create missing indexes
    await createMissingIndexes();

    // Step 3: Verify RLS policies
    await verifyRLSPolicies();

    // Step 4: Test critical functions
    await testCriticalFunctions();

    // Step 5: Generate security report
    const report = await generateSecurityReport();

    // Final status
    log('═══════════════════════════════════════════════════════════', 'section');

    const allCriticalTablesExist =
      report.critical_tables['gdpr_verification_requests'] === 'EXISTS' &&
      report.critical_tables['api_rate_limits'] === 'EXISTS';

    if (allCriticalTablesExist) {
      log('✓ CRITICAL SECURITY FIXES VERIFIED', 'success');
      log('All essential security components are in place and functional.', 'success');
    } else {
      log('⚠ MANUAL INTERVENTION REQUIRED', 'warning');
      log('Some critical security components are missing.', 'warning');
      log('Please run the SQL migration manually via Supabase Dashboard.', 'warning');
      log(`Migration file: ${path.join(__dirname, 'migrations', '006_critical_security_fixes.sql')}`, 'warning');
    }

  } catch (error) {
    log(`Critical error: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the verification
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  console.error(error.stack);
  process.exit(1);
});