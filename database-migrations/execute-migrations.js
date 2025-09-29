#!/usr/bin/env node

/**
 * Database Migration Executor for Leah Fowler Performance
 * This script connects to Supabase and executes critical GDPR and security migrations
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Execute SQL query and return results
 */
async function executeSql(sql, description = 'Executing SQL') {
  console.log(`\n${colors.cyan}➤ ${description}${colors.reset}`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    // If exec_sql doesn't exist, try direct query
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      // Use the Supabase REST API directly for DDL statements
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ sql_query: sql })
      });

      if (!response.ok) {
        // If exec_sql doesn't exist, we'll need to execute through direct connection
        // For now, we'll return a message indicating manual execution is needed
        console.log(`${colors.yellow}⚠️  Direct SQL execution not available via RPC.${colors.reset}`);
        console.log(`${colors.yellow}   Please execute the following SQL directly in Supabase SQL editor:${colors.reset}`);
        console.log(`${colors.blue}${sql.substring(0, 200)}...${colors.reset}`);
        return { success: 'manual', message: 'Requires manual execution in Supabase SQL editor' };
      }

      const result = await response.json();
      return { success: true, data: result };
    }

    if (error) {
      throw error;
    }

    console.log(`${colors.green}✓ ${description} completed successfully${colors.reset}`);
    return { success: true, data };
  } catch (error) {
    console.error(`${colors.red}✗ Error in ${description}: ${error.message}${colors.reset}`);
    return { success: false, error: error.message };
  }
}

/**
 * Create exec_sql function if it doesn't exist
 */
async function createExecSqlFunction() {
  const createFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result json;
    BEGIN
      EXECUTE sql_query;
      RETURN json_build_object('success', true, 'message', 'SQL executed successfully');
    EXCEPTION
      WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
    END;
    $$;
  `;

  // We'll output this for manual execution since we can't execute it directly without the function existing
  console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.yellow}IMPORTANT: First, create the exec_sql function in Supabase SQL Editor:${colors.reset}`);
  console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(createFunction);
  console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

/**
 * Read migration file
 */
async function readMigrationFile(filename) {
  const filepath = path.join(__dirname, filename);
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return content;
  } catch (error) {
    console.error(`${colors.red}✗ Error reading file ${filename}: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Generate migration report
 */
function generateReport(results) {
  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}                    MIGRATION REPORT                              ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const successful = results.filter(r => r.success === true).length;
  const failed = results.filter(r => r.success === false).length;
  const manual = results.filter(r => r.success === 'manual').length;

  console.log(`${colors.green}✓ Successful: ${successful}${colors.reset}`);
  if (failed > 0) console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  if (manual > 0) console.log(`${colors.yellow}⚠ Manual execution required: ${manual}${colors.reset}`);

  if (failed > 0) {
    console.log(`\n${colors.red}Failed operations:${colors.reset}`);
    results.filter(r => r.success === false).forEach(r => {
      console.log(`  - ${r.description}: ${r.error}`);
    });
  }

  if (manual > 0) {
    console.log(`\n${colors.yellow}Manual execution required:${colors.reset}`);
    console.log(`${colors.yellow}Please execute the migration SQL directly in the Supabase SQL Editor:${colors.reset}`);
    console.log(`${colors.yellow}1. Go to: ${SUPABASE_URL}/project/ltlbfltlhysjxslusypq/sql/new${colors.reset}`);
    console.log(`${colors.yellow}2. Copy and paste the SQL from: database-migrations/01-gdpr-security-migration.sql${colors.reset}`);
    console.log(`${colors.yellow}3. Execute the SQL${colors.reset}`);
  }

  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

/**
 * Main migration executor
 */
async function executeMigrations() {
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}     Leah Fowler Performance - Database Migration Executor        ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}Database: ${SUPABASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}Date: ${new Date().toISOString()}${colors.reset}\n`);

  const results = [];

  // First, show how to create the exec_sql function
  await createExecSqlFunction();

  // Read the migration file
  const migrationSql = await readMigrationFile('01-gdpr-security-migration.sql');

  if (!migrationSql) {
    console.error(`${colors.red}Failed to read migration file${colors.reset}`);
    return;
  }

  // Since we likely need manual execution, let's create a verification script instead
  const verificationSql = await readMigrationFile('verify-migration.sql');

  // Try to execute the migration
  const migrationResult = await executeSql(migrationSql, 'Executing GDPR and Security Migration');
  results.push({ ...migrationResult, description: 'GDPR and Security Migration' });

  // Generate and display report
  generateReport(results);

  // Create verification script
  await createVerificationScript();
}

/**
 * Create verification script
 */
async function createVerificationScript() {
  const verificationSql = `
-- MIGRATION VERIFICATION SCRIPT
-- Run this after executing the migration to verify all changes

-- 1. Check GDPR columns in assessment_submissions
SELECT
    'assessment_submissions GDPR columns' as check_type,
    COUNT(*) as columns_found
FROM information_schema.columns
WHERE table_name = 'assessment_submissions'
AND column_name IN (
    'gdpr_consent_given',
    'gdpr_consent_timestamp',
    'gdpr_deletion_requested',
    'gdpr_deletion_timestamp',
    'data_retention_days'
);

-- 2. Check functions exist
SELECT
    'Database functions' as check_type,
    COUNT(*) as functions_found
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'validate_email',
    'check_rate_limit',
    'anonymize_assessment_submission',
    'anonymize_user_data',
    'export_user_data',
    'cleanup_expired_data'
);

-- 3. Check indexes exist
SELECT
    'Performance indexes' as check_type,
    COUNT(*) as indexes_found
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_assessment_email',
    'idx_posts_status_published',
    'idx_gdpr_token',
    'idx_rate_limit_lookup',
    'idx_assessment_gdpr_deletion',
    'idx_assessment_created'
);

-- 4. Check RLS policies
SELECT
    'RLS policies' as check_type,
    tablename,
    COUNT(*) as policies_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('assessment_submissions', 'gdpr_verification_requests', 'api_rate_limits')
GROUP BY tablename;

-- 5. Check security_audit_log columns
SELECT
    'security_audit_log columns' as check_type,
    COUNT(*) as columns_found
FROM information_schema.columns
WHERE table_name = 'security_audit_log'
AND column_name IN (
    'request_headers',
    'response_status',
    'error_message',
    'execution_time_ms'
);

-- 6. Test email validation function
SELECT
    'Email validation test' as check_type,
    validate_email('test@example.com') as valid_email,
    validate_email('invalid-email') as invalid_email;

-- Summary
SELECT
    'Migration Status' as status,
    'Please verify all counts above are greater than 0' as message,
    NOW() as checked_at;
`;

  await fs.writeFile(
    path.join(__dirname, 'verify-migration.sql'),
    verificationSql,
    'utf8'
  );

  console.log(`${colors.green}✓ Created verification script: verify-migration.sql${colors.reset}`);
  console.log(`${colors.cyan}Run this in Supabase SQL Editor to verify the migration${colors.reset}`);
}

// Run the migrations
executeMigrations().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});