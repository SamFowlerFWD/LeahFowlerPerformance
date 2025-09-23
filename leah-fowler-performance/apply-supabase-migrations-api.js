#!/usr/bin/env node

/**
 * Supabase Migration Deployment via Management API
 * Uses the Supabase Management API to execute SQL migrations
 */

const fs = require('fs').promises;
const path = require('path');

// Supabase project details
const PROJECT_REF = 'ltlbfltlhysjxslusypq';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Migration files in order
const migrations = [
  '001_assessment_submissions.sql',
  '001_subscriptions_schema.sql',
  '002_enhanced_conversion_features.sql',
  '003_blog_schema.sql',
  '004_complete_platform_schema.sql'
];

// Execute SQL via Supabase SQL Editor API
async function executeSqlViaApi(sql, migrationName) {
  console.log(`\n📝 Processing migration: ${migrationName}`);

  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements to execute`);

    let successCount = 0;
    let skipCount = 0;
    const errors = [];

    // Process each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip certain problematic statements that need manual execution
      if (statement.includes('CREATE EXTENSION') ||
          statement.includes('pg_policies') ||
          statement.includes('information_schema')) {
        skipCount++;
        continue;
      }

      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: statement
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (errorText.includes('already exists') || errorText.includes('duplicate')) {
            console.log(`   ⚠️  Statement ${i + 1}: Already exists (skipping)`);
            skipCount++;
          } else {
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } else {
          successCount++;
        }

        if ((i + 1) % 10 === 0 || i === statements.length - 1) {
          process.stdout.write(`   Progress: ${i + 1}/${statements.length} statements\r`);
        }

      } catch (error) {
        errors.push({
          statementIndex: i,
          preview: statement.substring(0, 50) + '...',
          error: error.message
        });
      }
    }

    console.log(`\n   ✅ Processed: ${successCount} successful, ${skipCount} skipped, ${errors.length} errors`);

    return {
      success: errors.length === 0,
      migrationName,
      totalStatements: statements.length,
      successCount,
      skipCount,
      errorCount: errors.length,
      errors: errors.slice(0, 5) // Only show first 5 errors
    };

  } catch (error) {
    console.error(`   ❌ Failed to process migration:`, error.message);
    return {
      success: false,
      migrationName,
      error: error.message
    };
  }
}

// Alternative approach using Supabase client
async function applyMigrationsViaSupabase() {
  const { createClient } = require('@supabase/supabase-js');

  console.log('\n🔄 Attempting alternative deployment via Supabase client...');

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const results = {
    migrations: [],
    verification: {},
    summary: {
      totalMigrations: migrations.length,
      processedMigrations: 0,
      tablesVerified: 0
    }
  };

  // Process each migration file
  for (const migration of migrations) {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);

    try {
      console.log(`\n📂 Reading migration: ${migration}`);
      const sql = await fs.readFile(migrationPath, 'utf8');

      // Parse and extract table creation statements
      const tableMatches = sql.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/g) || [];
      const tables = tableMatches.map(match => match.replace('CREATE TABLE IF NOT EXISTS public.', ''));

      console.log(`   Found ${tables.length} tables to create`);

      // For now, we'll document what needs to be done
      results.migrations.push({
        file: migration,
        tables: tables,
        status: 'requires_manual_execution',
        message: 'Use Supabase Dashboard SQL Editor to execute'
      });

      results.summary.processedMigrations++;

    } catch (error) {
      console.error(`   ❌ Error processing ${migration}:`, error.message);
      results.migrations.push({
        file: migration,
        status: 'error',
        error: error.message
      });
    }
  }

  // Verify what tables exist
  console.log('\n🔍 Verifying existing tables...');

  const criticalTables = [
    'assessment_submissions',
    'subscriptions',
    'pricing_tiers',
    'posts',
    'categories',
    'user_profiles',
    'coaching_sessions',
    'performance_metrics'
  ];

  let existingTables = 0;

  for (const table of criticalTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`   ✅ Table exists: ${table}`);
        existingTables++;
      } else {
        console.log(`   ❌ Table missing: ${table}`);
      }
    } catch (err) {
      console.log(`   ❌ Table missing: ${table}`);
    }
  }

  results.summary.tablesVerified = existingTables;
  results.verification.criticalTables = {
    expected: criticalTables.length,
    found: existingTables,
    percentage: Math.round((existingTables / criticalTables.length) * 100)
  };

  return results;
}

// Generate SQL script for manual execution
async function generateCombinedSqlScript() {
  console.log('\n📄 Generating combined SQL script for manual execution...');

  let combinedSql = `-- Combined Supabase Migration Script
-- Generated: ${new Date().toISOString()}
-- Project: ltlbfltlhysjxslusypq
-- ========================================

`;

  for (const migration of migrations) {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);

    try {
      const sql = await fs.readFile(migrationPath, 'utf8');

      combinedSql += `\n-- ========================================\n`;
      combinedSql += `-- Migration: ${migration}\n`;
      combinedSql += `-- ========================================\n\n`;
      combinedSql += sql;
      combinedSql += `\n\n`;

    } catch (error) {
      console.error(`   ❌ Could not read ${migration}:`, error.message);
    }
  }

  const outputPath = path.join(__dirname, 'combined-migrations.sql');
  await fs.writeFile(outputPath, combinedSql);

  console.log(`   ✅ Combined SQL script saved to: ${outputPath}`);
  console.log(`   📋 Total size: ${(combinedSql.length / 1024).toFixed(2)} KB`);

  return outputPath;
}

// Main deployment function
async function deployMigrations() {
  console.log('🚀 Supabase Migration Deployment');
  console.log('=================================');
  console.log(`Project: ${PROJECT_REF}`);
  console.log(`URL: ${SUPABASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');

  // Try Supabase client approach
  const results = await applyMigrationsViaSupabase();

  // Generate combined SQL script
  const sqlScriptPath = await generateCombinedSqlScript();

  // Generate final report
  console.log('\n' + '='.repeat(70));
  console.log('📊 DEPLOYMENT REPORT');
  console.log('='.repeat(70));

  console.log('\n📝 Migration Status:');
  console.log(`   Files processed: ${results.summary.processedMigrations}/${results.summary.totalMigrations}`);
  console.log(`   Critical tables verified: ${results.summary.tablesVerified}/8`);

  if (results.verification.criticalTables) {
    const v = results.verification.criticalTables;
    console.log(`   Database readiness: ${v.percentage}%`);
  }

  console.log('\n⚠️  IMPORTANT: Manual Action Required');
  console.log('=====================================');
  console.log('\n📋 To complete the migration deployment:');
  console.log('');
  console.log('1. Open Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log('');
  console.log('2. Copy the SQL from the generated file:');
  console.log(`   ${sqlScriptPath}`);
  console.log('');
  console.log('3. Paste into the SQL Editor and execute');
  console.log('');
  console.log('4. After execution, configure:');
  console.log('   - Authentication > Providers > Enable Email');
  console.log('   - Authentication > Email Templates (use UK English)');
  console.log('   - Authentication > URL Configuration');
  console.log('   - Storage > Create buckets if needed');
  console.log('');

  console.log('🔗 Quick Links:');
  console.log(`   SQL Editor: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log(`   Auth Settings: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers`);
  console.log(`   Storage: https://supabase.com/dashboard/project/${PROJECT_REF}/storage/buckets`);
  console.log(`   Database: https://supabase.com/dashboard/project/${PROJECT_REF}/database/tables`);

  console.log('\n✅ Script preparation completed!');
  console.log('   Please complete manual steps in Supabase Dashboard');

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    project: PROJECT_REF,
    results,
    sqlScriptPath,
    nextSteps: [
      'Execute combined SQL script in Supabase Dashboard',
      'Enable Email authentication',
      'Configure email templates',
      'Set up storage buckets',
      'Test authentication flow'
    ]
  };

  const reportPath = path.join(__dirname, 'migration-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);

  return report;
}

// Execute deployment
deployMigrations().catch(console.error);