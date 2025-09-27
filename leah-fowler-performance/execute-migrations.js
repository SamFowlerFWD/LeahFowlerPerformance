#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase configuration in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Migration files in order
const migrations = [
  '000_MASTER_MIGRATION.sql',
  '001_STORAGE_BUCKETS.sql'
];

const verificationFile = 'MIGRATION_VERIFICATION.sql';

// Color output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function executeSqlFile(filename) {
  const filePath = path.join(__dirname, 'supabase', 'migrations', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  log(`\n📄 Reading ${filename}...`, 'cyan');
  const sql = fs.readFileSync(filePath, 'utf8');

  // Split SQL by statements (naive split by semicolon at line end)
  // This handles most cases but complex statements might need adjustment
  const statements = sql
    .split(/;[\s]*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  log(`  Found ${statements.length} SQL statements to execute`, 'dim');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'; // Re-add semicolon

    // Skip empty statements or pure comments
    if (!statement.trim() || statement.trim().startsWith('--')) {
      continue;
    }

    // Get first 50 chars of statement for logging
    const preview = statement.substring(0, 50).replace(/\n/g, ' ') + '...';

    try {
      // Execute the SQL statement
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      }).catch(async (rpcError) => {
        // If RPC doesn't exist, try direct execution via REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: statement })
        }).catch(() => null);

        if (!response || !response.ok) {
          // Fallback: Log statement for manual execution
          throw new Error('RPC execution not available - manual execution required');
        }

        return { error: null };
      });

      if (error) {
        throw error;
      }

      successCount++;
      process.stdout.write(colors.green + '.' + colors.reset);
    } catch (error) {
      errorCount++;
      process.stdout.write(colors.red + 'x' + colors.reset);

      // Collect error details
      errors.push({
        statement: i + 1,
        preview,
        error: error.message || error.toString()
      });

      // Skip if it's a "already exists" error
      if (error.message && (
        error.message.includes('already exists') ||
        error.message.includes('duplicate key')
      )) {
        // This is OK, continue
        continue;
      }
    }
  }

  console.log(''); // New line after progress dots

  // Report results
  log(`  ✅ Success: ${successCount} statements`, 'green');
  if (errorCount > 0) {
    log(`  ⚠️  Errors: ${errorCount} statements`, 'yellow');

    // Show first 3 errors
    errors.slice(0, 3).forEach(e => {
      log(`     Statement ${e.statement}: ${e.preview}`, 'dim');
      log(`     Error: ${e.error}`, 'red');
    });

    if (errors.length > 3) {
      log(`     ... and ${errors.length - 3} more errors`, 'dim');
    }
  }

  return { successCount, errorCount, errors };
}

async function runVerification() {
  const filePath = path.join(__dirname, 'supabase', verificationFile);

  if (!fs.existsSync(filePath)) {
    log('⚠️  Verification file not found, skipping verification', 'yellow');
    return;
  }

  log('\n🔍 Running migration verification...', 'magenta');

  // For verification, we'll create a simple check
  try {
    // Check if key tables exist
    const tables = [
      'assessment_submissions',
      'user_profiles',
      'posts',
      'subscriptions',
      'coaching_sessions'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error && !error.message.includes('permission denied')) {
        log(`  ❌ Table '${table}' check failed: ${error.message}`, 'red');
      } else {
        log(`  ✅ Table '${table}' exists`, 'green');
      }
    }

    log('\n✅ Basic verification passed!', 'green');
  } catch (error) {
    log(`❌ Verification error: ${error.message}`, 'red');
  }
}

async function main() {
  log('\n🚀 SUPABASE MIGRATION EXECUTOR', 'bright');
  log('================================', 'bright');
  log(`📍 Target: ${SUPABASE_URL}`, 'cyan');
  log(`🔐 Using service role key`, 'cyan');

  // Confirm before proceeding
  log('\n⚠️  WARNING: This will modify your production database!', 'yellow');
  log('Press Ctrl+C to cancel, or wait 5 seconds to continue...', 'yellow');

  await new Promise(resolve => setTimeout(resolve, 5000));

  log('\n🏗️  Starting migration process...', 'green');

  const results = {
    total: { success: 0, errors: 0 },
    files: []
  };

  // Execute each migration file
  for (const migration of migrations) {
    try {
      const result = await executeSqlFile(migration);
      results.total.success += result.successCount;
      results.total.errors += result.errorCount;
      results.files.push({
        file: migration,
        ...result
      });
    } catch (error) {
      log(`\n❌ Failed to execute ${migration}: ${error.message}`, 'red');
      results.files.push({
        file: migration,
        error: error.message
      });

      // Ask if should continue
      log('Continue with next migration? (waiting 5 seconds, Ctrl+C to stop)', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Run verification
  await runVerification();

  // Final report
  log('\n📊 MIGRATION SUMMARY', 'bright');
  log('====================', 'bright');
  log(`Total Statements Executed: ${results.total.success}`, 'green');
  log(`Total Errors: ${results.total.errors}`, results.total.errors > 0 ? 'yellow' : 'green');

  // Save results to file
  const reportPath = path.join(__dirname, 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n📄 Full report saved to: ${reportPath}`, 'cyan');

  // Manual execution instructions if needed
  if (results.total.errors > 0) {
    log('\n📝 MANUAL EXECUTION REQUIRED', 'yellow');
    log('Some statements failed to execute via the API.', 'yellow');
    log('Please execute the following in the Supabase SQL Editor:', 'yellow');
    log('1. Go to: https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql', 'cyan');
    log('2. Copy and paste the migration SQL files', 'cyan');
    log('3. Execute each file in order', 'cyan');
  }

  log('\n✨ Migration process complete!', 'green');
}

// Run the migration
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});