#!/usr/bin/env node

/**
 * Apply Admin Authentication Fix Migration
 *
 * This script applies the defensive migration that fixes admin authentication
 * and RLS policies, adapting to the actual table structure.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Use node-postgres directly for running migrations
const { Client } = require('pg');

async function applyMigration() {
  console.log('🚀 Starting Admin Authentication Fix Migration...\n');

  // Extract connection string from Supabase URL and service key
  const dbUrl = supabaseUrl.replace('https://', '');
  const projectRef = dbUrl.split('.')[0];

  // Construct database URL (standard Supabase pattern)
  const DATABASE_URL = `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`;

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '20250129_fix_admin_auth_defensive.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Applying migration: 20250129_fix_admin_auth_defensive.sql');
    console.log('   This migration will:');
    console.log('   ✓ Create or replace is_admin() function');
    console.log('   ✓ Ensure admin user is active');
    console.log('   ✓ Drop and recreate all RLS policies');
    console.log('   ✓ Adapt policies to actual table structure\n');

    // Execute the entire migration as a transaction
    console.log('⏳ Executing migration...');

    try {
      await client.query('BEGIN');
      await client.query(migrationSQL);
      await client.query('COMMIT');
      console.log('✅ Migration executed successfully\n');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    console.log('🔍 Verifying migration results...\n');

    // Test is_admin function
    console.log('Testing is_admin() function:');
    const adminResult = await client.query(`
      SELECT
        au.user_id,
        au.is_active,
        u.email,
        ar.role_name
      FROM public.admin_users au
      JOIN auth.users u ON u.id = au.user_id
      LEFT JOIN public.admin_roles ar ON ar.id = au.role_id
      WHERE u.email = 'leah@leahfowlerperformance.com'
      LIMIT 1
    `);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log('   ✅ Admin user found:');
      console.log(`      Email: ${admin.email}`);
      console.log(`      Active: ${admin.is_active}`);
      console.log(`      Role: ${admin.role_name || 'N/A'}`);

      // Test the is_admin function
      const functionTest = await client.query(`
        SELECT is_admin($1::uuid) as is_admin
      `, [admin.user_id]);

      console.log(`      is_admin() returns: ${functionTest.rows[0].is_admin}`);
    } else {
      console.log('   ⚠️  Admin user not found for leah@leahfowlerperformance.com');
    }

    // Check RLS policies
    console.log('\nChecking RLS policies:');
    const policyResult = await client.query(`
      SELECT
        tablename,
        COUNT(*) as policy_count
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename IN ('admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags')
      GROUP BY tablename
      ORDER BY tablename
    `);

    for (const row of policyResult.rows) {
      console.log(`   ✅ ${row.tablename}: ${row.policy_count} policies created`);
    }

    // Check RLS is enabled
    console.log('\nChecking RLS status:');
    const rlsResult = await client.query(`
      SELECT
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename IN ('admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags')
      ORDER BY tablename
    `);

    for (const row of rlsResult.rows) {
      const status = row.rowsecurity ? '✅ Enabled' : '❌ Disabled';
      console.log(`   ${status} on ${row.tablename}`);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   • is_admin() function created/updated');
    console.log('   • Admin user activation ensured');
    console.log('   • RLS policies recreated for all tables');
    console.log('   • Policies adapted to actual table structure');
    console.log('\n🎉 Admin authentication system is now properly configured!');

  } catch (error) {
    console.error('\n❌ Migration error:', error.message);

    // Show more details if it's a PostgreSQL error
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    if (error.hint) {
      console.error('   Hint:', error.hint);
    }
    if (error.where) {
      console.error('   Where:', error.where);
    }

    process.exit(1);
  } finally {
    // Close database connection
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

// Run the migration
applyMigration().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});