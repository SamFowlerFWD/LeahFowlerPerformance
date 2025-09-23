#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script applies the complete database schema to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'leah-fowler-performance', 'COMPLETE-SUPABASE-SETUP.sql');
    console.log(`📖 Reading SQL file from: ${sqlFilePath}`);
    const sqlContent = await fs.readFile(sqlFilePath, 'utf8');

    // Split the SQL into individual statements
    // We need to handle this carefully as some statements might contain semicolons in strings
    const statements = sqlContent
      .split(/;\s*\n/)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === ';') {
        continue;
      }

      // Get a description of what we're doing
      let description = 'Executing statement';
      if (statement.includes('CREATE TABLE')) {
        const tableMatch = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?(?:public\.)?(\w+)/i);
        description = tableMatch ? `Creating table: ${tableMatch[1]}` : 'Creating table';
      } else if (statement.includes('CREATE INDEX')) {
        const indexMatch = statement.match(/CREATE INDEX (?:IF NOT EXISTS )?(\w+)/i);
        description = indexMatch ? `Creating index: ${indexMatch[1]}` : 'Creating index';
      } else if (statement.includes('CREATE FUNCTION')) {
        const funcMatch = statement.match(/CREATE (?:OR REPLACE )?FUNCTION (?:public\.)?(\w+)/i);
        description = funcMatch ? `Creating function: ${funcMatch[1]}` : 'Creating function';
      } else if (statement.includes('CREATE POLICY')) {
        const policyMatch = statement.match(/CREATE POLICY "([^"]+)"/i);
        description = policyMatch ? `Creating policy: ${policyMatch[1]}` : 'Creating policy';
      } else if (statement.includes('CREATE TRIGGER')) {
        const triggerMatch = statement.match(/CREATE TRIGGER (\w+)/i);
        description = triggerMatch ? `Creating trigger: ${triggerMatch[1]}` : 'Creating trigger';
      } else if (statement.includes('CREATE EXTENSION')) {
        const extMatch = statement.match(/CREATE EXTENSION (?:IF NOT EXISTS )?"?(\w+)"?/i);
        description = extMatch ? `Creating extension: ${extMatch[1]}` : 'Creating extension';
      } else if (statement.includes('ALTER TABLE')) {
        const alterMatch = statement.match(/ALTER TABLE (?:public\.)?(\w+)/i);
        description = alterMatch ? `Altering table: ${alterMatch[1]}` : 'Altering table';
      } else if (statement.includes('INSERT INTO')) {
        const insertMatch = statement.match(/INSERT INTO (?:public\.)?(\w+)/i);
        description = insertMatch ? `Inserting into: ${insertMatch[1]}` : 'Inserting data';
      } else if (statement.includes('DROP')) {
        const dropMatch = statement.match(/DROP (?:TABLE|INDEX|FUNCTION|TRIGGER) (?:IF EXISTS )?(?:public\.)?(\w+)/i);
        description = dropMatch ? `Dropping: ${dropMatch[1]}` : 'Dropping object';
      } else if (statement.includes('GRANT')) {
        description = 'Granting permissions';
      } else if (statement.includes('DO $$')) {
        description = 'Executing procedural block';
      }

      process.stdout.write(`[${i + 1}/${statements.length}] ${description}... `);

      try {
        // Execute the statement using RPC call
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        }).timeout(30000); // 30 second timeout for complex operations

        // If exec_sql doesn't exist, try direct query (this might not work for all statements)
        if (error && error.message.includes('exec_sql')) {
          // For simple queries, we can try using the Supabase client directly
          // Note: This is limited and won't work for DDL statements
          console.log('⚠️  exec_sql function not found, statement may need manual execution');
          errors.push({
            statement: description,
            error: 'exec_sql function not available - manual execution required',
            sql: statement.substring(0, 100) + '...'
          });
          errorCount++;
        } else if (error) {
          console.log('❌');
          errors.push({
            statement: description,
            error: error.message,
            sql: statement.substring(0, 100) + '...'
          });
          errorCount++;
        } else {
          console.log('✅');
          successCount++;
        }
      } catch (err) {
        console.log('❌');
        errors.push({
          statement: description,
          error: err.message,
          sql: statement.substring(0, 100) + '...'
        });
        errorCount++;
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n❌ ERRORS ENCOUNTERED:');
      console.log('='.repeat(60));
      errors.forEach((err, idx) => {
        console.log(`\n${idx + 1}. ${err.statement}`);
        console.log(`   Error: ${err.error}`);
        if (process.env.DEBUG) {
          console.log(`   SQL: ${err.sql}`);
        }
      });

      console.log('\n💡 NEXT STEPS:');
      console.log('='.repeat(60));
      console.log('1. The SQL statements need to be executed directly in the Supabase SQL Editor');
      console.log('2. Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new');
      console.log('3. Copy the contents of COMPLETE-SUPABASE-SETUP.sql');
      console.log('4. Paste and execute in the SQL Editor');
      console.log('5. This will ensure all tables, functions, and policies are created correctly');
    }

    // Test if we can query the posts table
    console.log('\n🔍 Testing database setup...');
    console.log('='.repeat(60));

    try {
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, title, slug')
        .limit(5);

      if (postsError) {
        console.log('❌ Posts table test failed:', postsError.message);
        console.log('\n⚠️  Please execute the SQL directly in Supabase SQL Editor');
      } else {
        console.log('✅ Posts table exists and is accessible');
        console.log(`   Found ${posts ? posts.length : 0} posts`);
      }

      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(5);

      if (catError) {
        console.log('❌ Categories table test failed:', catError.message);
      } else {
        console.log('✅ Categories table exists and is accessible');
        console.log(`   Found ${categories ? categories.length : 0} categories`);
      }

      const { data: assessments, error: assessError } = await supabase
        .from('assessment_submissions')
        .select('id')
        .limit(1);

      if (assessError) {
        console.log('❌ Assessment submissions table test failed:', assessError.message);
      } else {
        console.log('✅ Assessment submissions table exists and is accessible');
      }

    } catch (testErr) {
      console.log('❌ Database test failed:', testErr.message);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the setup
console.log('='.repeat(60));
console.log('SUPABASE DATABASE SETUP SCRIPT');
console.log('='.repeat(60));
console.log('Project: Leah Fowler Performance Coach Platform');
console.log('Database URL:', SUPABASE_URL);
console.log('='.repeat(60) + '\n');

executeSQLFile()
  .then(() => {
    console.log('\n✨ Setup script completed!');
    console.log('='.repeat(60));
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Setup failed:', err);
    process.exit(1);
  });