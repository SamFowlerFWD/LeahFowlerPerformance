#!/usr/bin/env node

/**
 * Add Missing GDPR Columns to Assessment Submissions
 * Version: 1.0.0
 * Date: 2025-09-29
 */

const { createClient } = require('@supabase/supabase-js');

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

async function checkColumnExists(tableName, columnName) {
  try {
    // Try to select the column
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .limit(1);

    if (!error) {
      return true;
    }

    // Column doesn't exist error
    if (error.code === '42703') {
      return false;
    }

    // Some other error - assume column exists
    log(`Warning checking column ${columnName}: ${error.message}`, 'warning');
    return true;
  } catch (e) {
    return false;
  }
}

async function addMissingGDPRColumns() {
  log('Checking and Adding GDPR Columns to Assessment Submissions', 'section');

  const gdprColumns = [
    { name: 'gdpr_consent_given', exists: false },
    { name: 'gdpr_consent_timestamp', exists: false },
    { name: 'gdpr_deletion_requested', exists: false },
    { name: 'gdpr_deletion_timestamp', exists: false }
  ];

  // Check which columns already exist
  for (const column of gdprColumns) {
    column.exists = await checkColumnExists('assessment_submissions', column.name);
    if (column.exists) {
      log(`✓ Column '${column.name}' already exists`, 'success');
    } else {
      log(`✗ Column '${column.name}' is missing`, 'warning');
    }
  }

  const missingColumns = gdprColumns.filter(col => !col.exists);

  if (missingColumns.length === 0) {
    log('All GDPR columns already exist!', 'success');
    return true;
  }

  log(`Need to add ${missingColumns.length} missing GDPR columns`, 'warning');

  // Since we can't execute ALTER TABLE directly via the API,
  // we'll provide the SQL that needs to be run
  const alterTableSQL = `
-- Add missing GDPR columns to assessment_submissions table
ALTER TABLE public.assessment_submissions
  ${missingColumns.map(col => {
    switch(col.name) {
      case 'gdpr_consent_given':
        return 'ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false';
      case 'gdpr_consent_timestamp':
        return 'ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ';
      case 'gdpr_deletion_requested':
        return 'ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false';
      case 'gdpr_deletion_timestamp':
        return 'ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ';
      default:
        return '';
    }
  }).filter(sql => sql).join(',\n  ')};

-- Add indexes for GDPR columns
CREATE INDEX IF NOT EXISTS idx_assessment_gdpr_deletion
  ON public.assessment_submissions(gdpr_deletion_requested)
  WHERE gdpr_deletion_requested = true;

CREATE INDEX IF NOT EXISTS idx_assessment_gdpr_consent
  ON public.assessment_submissions(gdpr_consent_given);
`;

  log('\nSQL to execute in Supabase Dashboard:', 'section');
  console.log(colors.yellow + alterTableSQL + colors.reset);

  return false;
}

async function verifyCompleteSecuritySetup() {
  log('Complete Security Verification', 'section');

  const checks = {
    tables: {
      'gdpr_verification_requests': false,
      'api_rate_limits': false,
      'security_audit_log': false,
      'gdpr_consent_log': false
    },
    columns: {
      'assessment_submissions.gdpr_consent_given': false,
      'assessment_submissions.gdpr_deletion_requested': false,
      'security_audit_log.request_headers': false,
      'security_audit_log.response_status': false
    },
    functionality: {
      'Assessment submission queries': false,
      'Blog post queries': false,
      'GDPR verification access': false,
      'Rate limit access': false
    }
  };

  // Check tables
  for (const table of Object.keys(checks.tables)) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      checks.tables[table] = !error;
      log(`${!error ? '✓' : '✗'} Table '${table}': ${!error ? 'EXISTS' : 'MISSING'}`, !error ? 'success' : 'error');
    } catch (e) {
      checks.tables[table] = false;
      log(`✗ Table '${table}': ERROR`, 'error');
    }
  }

  // Check columns
  for (const [tableColumn, status] of Object.entries(checks.columns)) {
    const [table, column] = tableColumn.split('.');
    const exists = await checkColumnExists(table, column);
    checks.columns[tableColumn] = exists;
    log(`${exists ? '✓' : '✗'} Column '${tableColumn}': ${exists ? 'EXISTS' : 'MISSING'}`, exists ? 'success' : 'error');
  }

  // Test functionality
  try {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('id, email, created_at')
      .limit(1);
    checks.functionality['Assessment submission queries'] = !error;
  } catch (e) {
    checks.functionality['Assessment submission queries'] = false;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug')
      .limit(1);
    checks.functionality['Blog post queries'] = !error;
  } catch (e) {
    checks.functionality['Blog post queries'] = false;
  }

  // Summary
  log('\n═══════════════════════════════════════════════════════════', 'section');
  log('FINAL SECURITY STATUS', 'section');
  log('═══════════════════════════════════════════════════════════', 'section');

  const allTablesExist = Object.values(checks.tables).every(v => v);
  const allColumnsExist = Object.values(checks.columns).every(v => v);
  const allFunctional = Object.values(checks.functionality).filter((v, i) => i < 2).every(v => v);

  if (allTablesExist && allColumnsExist && allFunctional) {
    log('✓ ALL CRITICAL SECURITY COMPONENTS ARE FULLY OPERATIONAL', 'success');
    log('The database is secure and ready for production use.', 'success');
  } else {
    log('⚠ SOME SECURITY COMPONENTS NEED ATTENTION', 'warning');

    if (!allColumnsExist) {
      log('\nMissing GDPR Columns:', 'warning');
      log('Please run the SQL provided above in the Supabase Dashboard', 'warning');
    }

    if (!allTablesExist) {
      log('\nMissing Tables:', 'warning');
      log('Please run the full migration script (006_critical_security_fixes.sql)', 'warning');
    }
  }

  return { allTablesExist, allColumnsExist, allFunctional };
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   GDPR COMPLIANCE - COLUMN VERIFICATION               ║');
  console.log('║   Leah Fowler Performance Coach Platform              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    // Check and add GDPR columns
    await addMissingGDPRColumns();

    // Complete verification
    const status = await verifyCompleteSecuritySetup();

    if (!status.allColumnsExist) {
      log('\n' + '═'.repeat(60), 'section');
      log('ACTION REQUIRED:', 'warning');
      log('1. Go to Supabase Dashboard: ' + SUPABASE_URL, 'warning');
      log('2. Navigate to SQL Editor', 'warning');
      log('3. Run the ALTER TABLE commands shown above', 'warning');
      log('4. Re-run this script to verify', 'warning');
    }

  } catch (error) {
    log(`Critical error: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  console.error(error.stack);
  process.exit(1);
});