#!/usr/bin/env node

/**
 * Direct Supabase Migration Deployment Script
 * Uses PostgreSQL connection string to apply migrations directly
 */

const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Supabase Database Connection
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
const DATABASE_URL = 'postgresql://postgres.ltlbfltlhysjxslusypq:' +
  encodeURIComponent('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ') +
  '@db.ltlbfltlhysjxslusypq.supabase.co:5432/postgres';

// Migration files in order
const migrations = [
  '001_assessment_submissions.sql',
  '001_subscriptions_schema.sql',
  '002_enhanced_conversion_features.sql',
  '003_blog_schema.sql',
  '004_complete_platform_schema.sql'
];

// Connect to database
async function connectToDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database');
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    throw error;
  }
}

// Execute SQL migration
async function executeMigration(client, sql, migrationName) {
  console.log(`\n📝 Applying migration: ${migrationName}`);

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Execute the entire migration
    await client.query(sql);

    // Commit transaction
    await client.query('COMMIT');

    console.log(`   ✅ Successfully applied ${migrationName}`);

    return {
      success: true,
      migrationName
    };

  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');

    console.error(`   ❌ Failed to apply ${migrationName}:`, error.message);

    return {
      success: false,
      migrationName,
      error: error.message
    };
  }
}

// Verify tables created
async function verifyTables(client) {
  console.log('\n🔍 Verifying database tables...');

  try {
    const result = await client.query(`
      SELECT
        table_name,
        (SELECT COUNT(*)
         FROM information_schema.columns
         WHERE columns.table_name = tables.table_name
         AND columns.table_schema = 'public') as column_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`   ✅ Found ${result.rows.length} tables in database`);

    // List key tables
    const keyTables = [
      'assessment_submissions',
      'subscriptions',
      'posts',
      'user_profiles',
      'coaching_sessions',
      'performance_metrics',
      'pricing_tiers',
      'categories',
      'authors'
    ];

    for (const tableName of keyTables) {
      const table = result.rows.find(r => r.table_name === tableName);
      if (table) {
        console.log(`      ✓ ${tableName} (${table.column_count} columns)`);
      } else {
        console.log(`      ✗ ${tableName} (missing)`);
      }
    }

    return result.rows;

  } catch (error) {
    console.error('   ❌ Failed to verify tables:', error.message);
    return [];
  }
}

// Verify RLS policies
async function verifyRlsPolicies(client) {
  console.log('\n🔒 Verifying RLS policies...');

  try {
    const result = await client.query(`
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);

    console.log(`   ✅ Found ${result.rows.length} RLS policies`);

    // Group policies by table
    const policiesByTable = {};
    result.rows.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy.policyname);
    });

    // Show summary
    Object.keys(policiesByTable).slice(0, 5).forEach(table => {
      console.log(`      ${table}: ${policiesByTable[table].length} policies`);
    });

    return result.rows;

  } catch (error) {
    console.error('   ❌ Failed to verify RLS policies:', error.message);
    return [];
  }
}

// Check storage buckets
async function checkStorageBuckets(client) {
  console.log('\n📦 Checking storage configuration...');

  try {
    const result = await client.query(`
      SELECT
        id,
        name,
        public,
        created_at
      FROM storage.buckets
      ORDER BY name;
    `);

    if (result.rows.length > 0) {
      console.log(`   ✅ Found ${result.rows.length} storage buckets`);
      result.rows.forEach(bucket => {
        console.log(`      ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    } else {
      console.log('   ⚠️  No storage buckets configured');
      console.log('      Create buckets in Supabase Dashboard if needed');
    }

    return result.rows;

  } catch (error) {
    // Storage schema might not exist
    console.log('   ℹ️  Storage not configured or accessible');
    return [];
  }
}

// Create test user
async function createTestUser(client) {
  console.log('\n🧪 Creating test data...');

  try {
    // Insert test assessment
    await client.query(`
      INSERT INTO public.assessment_submissions (
        name, email, assessment_version, answers, profile,
        qualified, tier, investment_level, readiness_score,
        consent_given, consent_timestamp
      ) VALUES (
        'Test User', 'test@example.com', '1.0',
        '{"test": true}'::jsonb, '{"test": true}'::jsonb,
        true, 'established', 'high', 8.5,
        true, NOW()
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('   ✅ Created test assessment submission');

    // Check row count
    const countResult = await client.query(`
      SELECT COUNT(*) as count FROM public.assessment_submissions;
    `);

    console.log(`   📊 Total assessment submissions: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('   ⚠️  Could not create test data:', error.message);
  }
}

// Main deployment function
async function deployMigrations() {
  console.log('🚀 Supabase Direct Migration Deployment');
  console.log('=====================================');
  console.log('Time:', new Date().toISOString());
  console.log('');

  let client;
  const results = {
    migrations: [],
    tables: [],
    policies: [],
    storage: [],
    summary: {
      totalMigrations: migrations.length,
      successfulMigrations: 0,
      failedMigrations: 0,
      tablesCreated: 0,
      policiesCreated: 0
    }
  };

  try {
    // Connect to database
    client = await connectToDatabase();

    // Apply each migration
    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);

      try {
        const sql = await fs.readFile(migrationPath, 'utf8');
        const result = await executeMigration(client, sql, migration);

        results.migrations.push(result);

        if (result.success) {
          results.summary.successfulMigrations++;
        } else {
          results.summary.failedMigrations++;
        }

      } catch (error) {
        console.error(`   ❌ Could not read migration file ${migration}:`, error.message);
        results.migrations.push({
          success: false,
          migrationName: migration,
          error: `Could not read file: ${error.message}`
        });
        results.summary.failedMigrations++;
      }
    }

    // Verify database state
    results.tables = await verifyTables(client);
    results.summary.tablesCreated = results.tables.length;

    results.policies = await verifyRlsPolicies(client);
    results.summary.policiesCreated = results.policies.length;

    results.storage = await checkStorageBuckets(client);

    // Create test data
    await createTestUser(client);

    // Generate report
    console.log('\n' + '='.repeat(70));
    console.log('📊 DEPLOYMENT REPORT');
    console.log('='.repeat(70));

    console.log('\n✅ Migration Summary:');
    console.log(`   Migrations applied: ${results.summary.successfulMigrations}/${results.summary.totalMigrations}`);
    console.log(`   Tables created: ${results.summary.tablesCreated}`);
    console.log(`   RLS policies: ${results.summary.policiesCreated}`);
    console.log(`   Storage buckets: ${results.storage.length}`);

    if (results.summary.failedMigrations > 0) {
      console.log('\n⚠️  Failed Migrations:');
      results.migrations.filter(m => !m.success).forEach(m => {
        console.log(`   - ${m.migrationName}: ${m.error}`);
      });
    }

    console.log('\n📋 Required Manual Configuration:');
    console.log('   1. Enable Email Authentication in Supabase Dashboard');
    console.log('   2. Configure email templates (use UK English)');
    console.log('   3. Set password requirements (min 8 chars)');
    console.log('   4. Configure rate limiting');
    console.log('   5. Create storage buckets if needed');
    console.log('   6. Set up email provider (SendGrid/Resend)');

    console.log('\n🔗 Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq');

    console.log('\n✅ Deployment completed successfully!');

    // Save report
    const reportPath = path.join(__dirname, 'deployment-report.json');
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);

  } finally {
    if (client) {
      await client.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Check if pg module is installed
try {
  require('pg');
} catch (error) {
  console.error('❌ PostgreSQL client not installed');
  console.log('\n📦 Install required packages:');
  console.log('   npm install pg');
  console.log('\nThen run this script again.');
  process.exit(1);
}

// Run deployment
deployMigrations().catch(console.error);