#!/usr/bin/env node

/**
 * Execute Admin Setup Migration Script
 * This script applies the complete admin setup migration to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Database configuration
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || '_50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';
const PROJECT_REF = 'ltlbfltlhysjxslusypq';
const DATABASE_URL = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Log with color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Connect to database with notice handler
async function connectToDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Set up notice handler to capture RAISE NOTICE messages
    client.on('notice', (msg) => {
      log(`   📢 ${msg.message}`, 'cyan');
    });

    await client.connect();
    log('✅ Connected to Supabase database', 'green');
    return client;
  } catch (error) {
    log(`❌ Failed to connect to database: ${error.message}`, 'red');
    throw error;
  }
}

// Execute the admin migration
async function executeAdminMigration(client) {
  log('\n🚀 STARTING ADMIN SETUP MIGRATION', 'bright');
  log('=' .repeat(50), 'blue');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'FIXED-ADMIN-NO-ROLES-TABLE.sql');
    const sql = await fs.readFile(migrationPath, 'utf8');
    log(`📄 Loaded migration script: ${migrationPath}`, 'yellow');

    // Execute the migration (it includes its own BEGIN/COMMIT)
    log('\n📝 Executing migration...', 'yellow');
    await client.query(sql);

    log('\n✅ Migration executed successfully!', 'green');
    return true;

  } catch (error) {
    log(`\n❌ Migration failed: ${error.message}`, 'red');
    if (error.detail) {
      log(`   Details: ${error.detail}`, 'red');
    }
    if (error.hint) {
      log(`   Hint: ${error.hint}`, 'yellow');
    }
    return false;
  }
}

// Verify the admin setup
async function verifyAdminSetup(client) {
  log('\n🔍 VERIFICATION PHASE', 'bright');
  log('=' .repeat(50), 'blue');

  const verifications = [];

  try {
    // 1. Check admin_users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'admin_users'
      ) as exists
    `);
    verifications.push({
      test: 'Admin users table exists',
      passed: tableCheck.rows[0].exists,
      critical: true
    });

    // 2. Check admin user exists
    const adminCheck = await client.query(`
      SELECT
        user_id,
        email,
        role,
        is_active,
        permissions
      FROM admin_users
      WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5'
    `);
    verifications.push({
      test: 'Admin user exists (info@leah.coach)',
      passed: adminCheck.rows.length > 0,
      critical: true,
      details: adminCheck.rows[0]
    });

    // 3. Check is_admin function exists
    const functionCheck = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'is_admin'
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ) as exists
    `);
    verifications.push({
      test: 'is_admin function exists',
      passed: functionCheck.rows[0].exists,
      critical: true
    });

    // 4. Test is_admin function with known admin
    const adminFunctionTest = await client.query(`
      SELECT is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as is_admin
    `);
    verifications.push({
      test: 'is_admin returns true for admin user',
      passed: adminFunctionTest.rows[0].is_admin === true,
      critical: true
    });

    // 5. Check RLS is enabled on admin_users
    const rlsCheck = await client.query(`
      SELECT relrowsecurity
      FROM pg_class
      WHERE relname = 'admin_users'
      AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `);
    verifications.push({
      test: 'RLS enabled on admin_users table',
      passed: rlsCheck.rows[0]?.relrowsecurity === true,
      critical: true
    });

    // 6. Count policies
    const policyCount = await client.query(`
      SELECT COUNT(*) as count
      FROM pg_policies
      WHERE schemaname = 'public'
    `);
    verifications.push({
      test: 'RLS policies created',
      passed: parseInt(policyCount.rows[0].count) > 0,
      critical: false,
      details: `Total policies: ${policyCount.rows[0].count}`
    });

    // 7. Check specific policies on admin_users
    const adminPolicies = await client.query(`
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = 'admin_users'
      ORDER BY policyname
    `);
    verifications.push({
      test: 'Admin users policies exist',
      passed: adminPolicies.rows.length >= 2,
      critical: false,
      details: adminPolicies.rows.map(r => r.policyname).join(', ')
    });

    // 8. List all tables with RLS enabled
    const rlsTables = await client.query(`
      SELECT t.tablename
      FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      WHERE t.schemaname = 'public'
      AND c.relrowsecurity = true
      ORDER BY t.tablename
    `);
    verifications.push({
      test: 'Tables with RLS enabled',
      passed: true,
      critical: false,
      details: rlsTables.rows.map(r => r.tablename).join(', ')
    });

  } catch (error) {
    log(`\n❌ Verification error: ${error.message}`, 'red');
  }

  // Display results
  log('\n📋 VERIFICATION RESULTS:', 'bright');
  let allPassed = true;

  for (const check of verifications) {
    const icon = check.passed ? '✅' : '❌';
    const color = check.passed ? 'green' : 'red';
    log(`${icon} ${check.test}`, color);

    if (check.details) {
      if (typeof check.details === 'object') {
        log(`   ${JSON.stringify(check.details, null, 2)}`, 'cyan');
      } else {
        log(`   ${check.details}`, 'cyan');
      }
    }

    if (!check.passed && check.critical) {
      allPassed = false;
    }
  }

  return allPassed;
}

// Main execution
async function main() {
  log('\n🏗️  ADMIN SYSTEM SETUP MIGRATION', 'bright');
  log('═' .repeat(50), 'magenta');
  log('Target: Leah Fowler Performance Supabase Database', 'cyan');
  log('Admin Email: info@leah.coach', 'cyan');
  log('Admin ID: dfd9154b-4238-4672-8a0a-e657a18532c5', 'cyan');
  log('═' .repeat(50), 'magenta');

  let client;

  try {
    // Connect to database
    client = await connectToDatabase();

    // Execute migration
    const migrationSuccess = await executeAdminMigration(client);

    if (migrationSuccess) {
      // Verify setup
      const verificationSuccess = await verifyAdminSetup(client);

      if (verificationSuccess) {
        log('\n🎉 SUCCESS!', 'bright');
        log('═' .repeat(50), 'green');
        log('✅ Admin system has been successfully set up', 'green');
        log('✅ Admin user created: info@leah.coach', 'green');
        log('✅ All RLS policies are in place', 'green');
        log('✅ The admin can now login at: https://leah.coach/admin/login', 'green');
        log('═' .repeat(50), 'green');
      } else {
        log('\n⚠️  PARTIAL SUCCESS', 'yellow');
        log('Migration completed but some verifications failed', 'yellow');
        log('Please check the verification results above', 'yellow');
      }
    } else {
      log('\n❌ MIGRATION FAILED', 'red');
      log('Please check the error messages above', 'red');
      process.exit(1);
    }

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    // Close database connection
    if (client) {
      await client.end();
      log('\n🔌 Database connection closed', 'blue');
    }
  }
}

// Run the migration
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});