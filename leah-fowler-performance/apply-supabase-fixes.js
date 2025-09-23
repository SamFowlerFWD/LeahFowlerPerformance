#!/usr/bin/env node

/**
 * Apply Supabase Fixes Script
 * Applies all SQL fixes to the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

// Supabase credentials
const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath) {
  console.log(chalk.blue(`\n📄 Reading SQL file: ${filePath}`));

  try {
    const sql = await fs.readFile(filePath, 'utf8');

    // Split SQL into individual statements (naive split, might need improvement)
    const statements = sql
      .split(/;(?=\s*\n)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(chalk.gray(`Found ${statements.length} SQL statements to execute`));

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();

      // Skip empty statements or comments
      if (!statement || statement.startsWith('--')) continue;

      // Add semicolon back if needed
      const finalStatement = statement.endsWith(';') ? statement : statement + ';';

      try {
        // For complex statements, we need to execute them directly
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: finalStatement
        }).catch(async () => {
          // If exec_sql doesn't exist, try direct execution through REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql_query: finalStatement })
          });

          if (!response.ok) {
            throw new Error('Direct SQL execution not available');
          }

          return response.json();
        });

        if (error) {
          throw error;
        }

        successCount++;
        process.stdout.write(chalk.green('.'));
      } catch (err) {
        errorCount++;
        process.stdout.write(chalk.red('x'));

        // Log specific error for debugging
        errors.push({
          statement: finalStatement.substring(0, 100) + '...',
          error: err.message || err
        });
      }
    }

    console.log('\n');
    console.log(chalk.green(`✅ Successfully executed: ${successCount} statements`));

    if (errorCount > 0) {
      console.log(chalk.red(`❌ Failed: ${errorCount} statements`));
      console.log(chalk.yellow('\nError details:'));
      errors.forEach((e, idx) => {
        console.log(chalk.gray(`${idx + 1}. ${e.statement}`));
        console.log(chalk.red(`   Error: ${e.error}\n`));
      });
    }

    return { success: successCount, errors: errorCount };
  } catch (err) {
    console.error(chalk.red(`Failed to read/execute SQL file: ${err.message}`));
    return { success: 0, errors: 1 };
  }
}

async function applyFixes() {
  console.log(chalk.bold.cyan('========================================'));
  console.log(chalk.bold.cyan('APPLYING SUPABASE FIXES'));
  console.log(chalk.bold.cyan('========================================\n'));

  console.log(chalk.yellow('⚠️  Note: Direct SQL execution through Supabase JS client is limited.'));
  console.log(chalk.yellow('For best results, execute the SQL files directly in Supabase Dashboard.\n'));

  // Files to execute in order
  const sqlFiles = [
    'supabase-fix-all-issues.sql'
  ];

  let totalSuccess = 0;
  let totalErrors = 0;

  for (const file of sqlFiles) {
    const filePath = path.join(__dirname, file);

    // Check if file exists
    try {
      await fs.access(filePath);
      const result = await executeSqlFile(filePath);
      totalSuccess += result.success;
      totalErrors += result.errors;
    } catch (err) {
      console.log(chalk.yellow(`⚠️  File not found: ${file}`));
    }
  }

  console.log(chalk.bold.cyan('\n========================================'));
  console.log(chalk.bold.cyan('SUMMARY'));
  console.log(chalk.bold.cyan('========================================\n'));

  console.log(chalk.bold('Total successful statements:'), totalSuccess);
  console.log(chalk.bold('Total failed statements:'), totalErrors);

  if (totalErrors === 0) {
    console.log(chalk.bold.green('\n✨ All fixes applied successfully!'));
  } else {
    console.log(chalk.bold.yellow('\n⚠️  Some fixes could not be applied automatically.'));
    console.log(chalk.yellow('Please execute the SQL file manually in Supabase Dashboard:'));
    console.log(chalk.cyan('1. Go to https://supabase.com/dashboard'));
    console.log(chalk.cyan('2. Select your project'));
    console.log(chalk.cyan('3. Go to SQL Editor'));
    console.log(chalk.cyan('4. Copy and paste the content of supabase-fix-all-issues.sql'));
    console.log(chalk.cyan('5. Click "Run"'));
  }

  console.log(chalk.bold.cyan('\n========================================\n'));
}

// Alternative: Create a helper function for Supabase
async function createExecSqlFunction() {
  console.log(chalk.blue('Creating exec_sql helper function...'));

  const createFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$;
  `;

  try {
    // This won't work directly, but showing the SQL needed
    console.log(chalk.yellow('\nTo enable direct SQL execution, run this in Supabase SQL Editor:'));
    console.log(chalk.gray(createFunction));
  } catch (err) {
    console.error(chalk.red('Could not create helper function'));
  }
}

// Run the fixes
async function main() {
  // Try to create helper function first
  await createExecSqlFunction();

  // Then apply fixes
  await applyFixes();

  // Run tests after applying fixes
  console.log(chalk.bold.cyan('\nRunning validation tests...'));

  try {
    const { spawn } = require('child_process');
    const testProcess = spawn('node', ['test-supabase-complete.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('\n✅ Tests completed successfully!'));
      } else {
        console.log(chalk.yellow('\n⚠️  Some tests failed. Please review.'));
      }
    });
  } catch (err) {
    console.log(chalk.yellow('Could not run tests automatically.'));
    console.log(chalk.cyan('Run manually with: node test-supabase-complete.js'));
  }
}

main().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});