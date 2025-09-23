#!/usr/bin/env node

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Parse the project reference from URL
const PROJECT_REF = 'ltlbfltlhysjxslusypq';

// Migration files in order
const migrations = [
  '001_assessment_submissions.sql',
  '001_subscriptions_schema.sql',
  '002_enhanced_conversion_features.sql',
  '003_blog_schema.sql',
  '004_complete_platform_schema.sql'
];

// Function to make HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Execute SQL via Supabase Management API
async function executeSQLViaManagementAPI(sql) {
  const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const result = await makeRequest(options, { query: sql });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Alternative: Execute via REST endpoint
async function executeSQLViaREST(sql) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/rpc`);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };

  try {
    // Try to execute as raw SQL
    const result = await makeRequest(options, {
      query: sql
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function processSQL(sql, filename) {
  console.log(`\n📄 Processing: ${filename}`);

  // Clean and split SQL statements
  const statements = sql
    .split(/;(?![^(]*\))/g) // Split by semicolon not inside parentheses
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^--/));

  console.log(`   Found ${statements.length} statements to execute`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];

    // Skip pure comments
    if (!stmt || stmt.match(/^--/) || stmt.match(/^\s*$/)) {
      continue;
    }

    // Add semicolon back
    const fullStatement = stmt + ';';

    try {
      // First try Management API
      let result = await executeSQLViaManagementAPI(fullStatement);

      // If that fails, try REST API
      if (!result.success && result.error.includes('404')) {
        result = await executeSQLViaREST(fullStatement);
      }

      if (result.success) {
        successCount++;
        process.stdout.write(`\r   ✅ Progress: ${successCount}/${statements.length} successful`);
      } else {
        // Check if it's an "already exists" error
        if (result.error.includes('already exists') ||
            result.error.includes('duplicate') ||
            result.error.includes('42P07') ||
            result.error.includes('42710')) {
          skipCount++;
          process.stdout.write(`\r   ⚠️  Progress: ${successCount} successful, ${skipCount} skipped`);
        } else {
          errorCount++;
          errors.push({
            statement: stmt.substring(0, 50),
            error: result.error.substring(0, 100)
          });
          console.log(`\n   ❌ Error in statement ${i + 1}: ${result.error.substring(0, 100)}`);
        }
      }
    } catch (err) {
      errorCount++;
      errors.push({
        statement: stmt.substring(0, 50),
        error: err.message.substring(0, 100)
      });
      console.log(`\n   ❌ Error in statement ${i + 1}: ${err.message.substring(0, 100)}`);
    }
  }

  console.log(`\n   📊 Results: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`);

  if (errors.length > 0 && errors.length <= 3) {
    console.log('   First few errors:');
    errors.slice(0, 3).forEach(e => {
      console.log(`     - ${e.statement}... : ${e.error}`);
    });
  }

  return { successCount, skipCount, errorCount };
}

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');

  const url = new URL(`${SUPABASE_URL}/rest/v1/`);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  };

  try {
    await makeRequest(options);
    console.log('   ✅ Connection successful!\n');
    return true;
  } catch (error) {
    console.log(`   ⚠️  Connection test warning: ${error.message}\n`);
    return true; // Continue anyway
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying Critical Tables...');

  const tables = [
    'assessment_submissions',
    'user_profiles',
    'blog_posts',
    'subscriptions',
    'performance_metrics'
  ];

  for (const table of tables) {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
    const options = {
      hostname: url.hostname,
      path: `${url.pathname}?select=count&limit=1`,
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    };

    try {
      await makeRequest(options);
      console.log(`   ✅ ${table}: Created`);
    } catch (error) {
      if (error.message.includes('404')) {
        console.log(`   ❌ ${table}: Not found`);
      } else {
        console.log(`   ⚠️  ${table}: ${error.message.substring(0, 50)}`);
      }
    }
  }
}

async function setupStorageBuckets() {
  console.log('\n🗂️  Setting up Storage Buckets...');

  const buckets = [
    { name: 'profile-images', public: true },
    { name: 'blog-media', public: true },
    { name: 'assessment-files', public: false },
    { name: 'coaching-resources', public: false }
  ];

  for (const bucket of buckets) {
    const url = new URL(`${SUPABASE_URL}/storage/v1/bucket`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      await makeRequest(options, {
        id: bucket.name,
        name: bucket.name,
        public: bucket.public
      });
      console.log(`   ✅ ${bucket.name}: Created (${bucket.public ? 'public' : 'private'})`);
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('409')) {
        console.log(`   ⚠️  ${bucket.name}: Already exists`);
      } else {
        console.log(`   ❌ ${bucket.name}: ${error.message.substring(0, 50)}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Supabase Migration Tool');
  console.log('==========================\n');
  console.log(`📍 Project: ${PROJECT_REF}`);
  console.log(`🔗 URL: ${SUPABASE_URL}\n`);

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Could not connect to Supabase. Please check your credentials.');
    return;
  }

  // Process migrations
  const results = {
    total: 0,
    success: 0,
    skipped: 0,
    errors: 0
  };

  for (const migration of migrations) {
    try {
      const filePath = path.join(__dirname, 'supabase', 'migrations', migration);
      const sql = await fs.readFile(filePath, 'utf8');

      const result = await processSQL(sql, migration);
      results.total++;
      results.success += result.successCount;
      results.skipped += result.skipCount;
      results.errors += result.errorCount;
    } catch (error) {
      console.log(`❌ Failed to process ${migration}: ${error.message}`);
      results.errors++;
    }
  }

  // Summary
  console.log('\n=====================================');
  console.log('📊 Migration Summary');
  console.log('=====================================');
  console.log(`Files processed: ${results.total}`);
  console.log(`✅ Successful statements: ${results.success}`);
  console.log(`⚠️  Skipped (already exists): ${results.skipped}`);
  console.log(`❌ Errors: ${results.errors}`);

  // Verify tables
  await verifyTables();

  // Setup storage buckets
  await setupStorageBuckets();

  console.log('\n✨ Migration process complete!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Configure authentication providers in Supabase Dashboard');
  console.log('   2. Set up email templates for auth flows');
  console.log('   3. Configure SMTP settings for transactional emails');
  console.log('   4. Review and adjust RLS policies as needed');
  console.log('   5. Set up environment variables in your application');
}

// Run the migration
main().catch(console.error);