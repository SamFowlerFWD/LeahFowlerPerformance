#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Migration files in order
const migrations = [
  '001_assessment_submissions.sql',
  '001_subscriptions_schema.sql',
  '002_enhanced_conversion_features.sql',
  '003_blog_schema.sql',
  '004_complete_platform_schema.sql'
];

async function executeSQLFile(filename) {
  const filePath = path.join(__dirname, 'supabase', 'migrations', filename);

  try {
    console.log(`\n📄 Reading migration file: ${filename}`);
    const sql = await fs.readFile(filePath, 'utf8');

    // Split SQL by semicolons but preserve those within strings
    const statements = sql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements and comments
      if (!statement || statement.startsWith('--')) {
        continue;
      }

      try {
        // Execute via REST API using rpc
        const { data, error } = await supabase.rpc('exec_sql', {
          query: statement + ';'
        }).catch(async (err) => {
          // If exec_sql doesn't exist, try direct execution
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ query: statement + ';' })
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          return { data: await response.json(), error: null };
        });

        if (error) {
          // Some errors are expected (like "already exists"), so we'll handle them gracefully
          if (error.message?.includes('already exists') ||
              error.message?.includes('duplicate key') ||
              error.code === '42P07' || // duplicate table
              error.code === '42710' || // duplicate object
              error.code === '42P06' || // duplicate schema
              error.code === '42P04') { // duplicate database
            console.log(`   ⚠️  Object already exists (statement ${i + 1}/${statements.length}) - skipping`);
          } else {
            errorCount++;
            errors.push({ statement: statement.substring(0, 100), error: error.message });
            console.log(`   ❌ Error in statement ${i + 1}/${statements.length}: ${error.message?.substring(0, 100)}`);
          }
        } else {
          successCount++;
          process.stdout.write(`\r   ✅ Progress: ${successCount} successful statements`);
        }
      } catch (err) {
        errorCount++;
        errors.push({ statement: statement.substring(0, 100), error: err.message });
        console.log(`   ❌ Error in statement ${i + 1}/${statements.length}: ${err.message?.substring(0, 100)}`);
      }
    }

    console.log(`\n   📊 Results: ${successCount} successful, ${errorCount} errors`);

    if (errors.length > 0 && errors.length <= 5) {
      console.log('   Errors encountered:');
      errors.forEach(e => {
        console.log(`     - ${e.statement.substring(0, 50)}... : ${e.error.substring(0, 100)}`);
      });
    }

    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error(`   ❌ Failed to read or parse file: ${error.message}`);
    return { success: 0, errors: 1 };
  }
}

async function applyMigrations() {
  console.log('🚀 Starting Supabase Migration Process');
  console.log('=====================================\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using Service Role Key for admin access\n`);

  const results = {
    total: migrations.length,
    successful: 0,
    failed: 0
  };

  // First, let's test the connection
  console.log('🔌 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('assessment_submissions').select('count').limit(1);
    if (error && !error.message.includes('does not exist')) {
      console.log(`   ⚠️  Connection test warning: ${error.message}`);
    } else {
      console.log('   ✅ Connection successful!\n');
    }
  } catch (err) {
    console.log('   ⚠️  Connection test skipped\n');
  }

  // Apply each migration file
  for (const migration of migrations) {
    const result = await executeSQLFile(migration);
    if (result.errors === 0) {
      results.successful++;
    } else {
      results.failed++;
    }
  }

  console.log('\n=====================================');
  console.log('📊 Migration Summary');
  console.log('=====================================');
  console.log(`Total migration files: ${results.total}`);
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);

  // Verify critical tables
  console.log('\n🔍 Verifying Critical Tables...');
  const criticalTables = [
    'assessment_submissions',
    'user_profiles',
    'blog_posts',
    'subscriptions',
    'performance_metrics'
  ];

  for (const table of criticalTables) {
    try {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`   ❌ ${table}: Not found or error`);
      } else {
        console.log(`   ✅ ${table}: Ready`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: Error checking`);
    }
  }

  console.log('\n✨ Migration process complete!');
}

// Check if @supabase/supabase-js is installed
async function checkDependencies() {
  try {
    require.resolve('@supabase/supabase-js');
    return true;
  } catch (e) {
    console.log('📦 Installing required dependencies...');
    const { exec } = require('child_process');
    return new Promise((resolve) => {
      exec('npm install @supabase/supabase-js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing dependencies: ${error}`);
          resolve(false);
        } else {
          console.log('✅ Dependencies installed successfully');
          resolve(true);
        }
      });
    });
  }
}

// Run the migration
(async () => {
  const depsOk = await checkDependencies();
  if (!depsOk) {
    console.error('❌ Failed to install dependencies. Please run: npm install @supabase/supabase-js');
    process.exit(1);
  }

  await applyMigrations();
})().catch(console.error);