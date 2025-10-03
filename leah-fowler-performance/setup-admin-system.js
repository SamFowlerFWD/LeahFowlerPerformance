#!/usr/bin/env node

/**
 * Admin System Setup and Verification
 * This script checks the current state and provides migration instructions
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Log with color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check current database state
async function checkCurrentState() {
  log('\n🔍 CHECKING CURRENT DATABASE STATE', 'bright');
  log('=' .repeat(50), 'blue');

  const checks = [];

  // 1. Check if admin_users table exists
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (!error) {
      log('✅ admin_users table exists', 'green');
      checks.push({ item: 'admin_users table', exists: true });

      // Check for existing admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', 'dfd9154b-4238-4672-8a0a-e657a18532c5')
        .single();

      if (!adminError && adminData) {
        log('✅ Admin user already exists:', 'green');
        log(`   Email: ${adminData.email}`, 'cyan');
        log(`   Role: ${adminData.role}`, 'cyan');
        log(`   Active: ${adminData.is_active}`, 'cyan');
        checks.push({ item: 'admin user', exists: true, data: adminData });
      } else {
        log('❌ Admin user not found', 'red');
        checks.push({ item: 'admin user', exists: false });
      }
    } else {
      log('❌ admin_users table does not exist', 'red');
      checks.push({ item: 'admin_users table', exists: false });
    }
  } catch (error) {
    log('❌ Error checking admin_users table', 'red');
    checks.push({ item: 'admin_users table', exists: false, error: error.message });
  }

  // 2. Check other tables
  const tables = ['assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags'];

  for (const tableName of tables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (!error) {
        log(`✅ ${tableName} table exists`, 'green');
        checks.push({ item: `${tableName} table`, exists: true });
      } else {
        log(`⚠️  ${tableName} table does not exist`, 'yellow');
        checks.push({ item: `${tableName} table`, exists: false });
      }
    } catch (error) {
      log(`⚠️  Error checking ${tableName} table`, 'yellow');
      checks.push({ item: `${tableName} table`, exists: false });
    }
  }

  return checks;
}

// Test is_admin function via RPC
async function testIsAdminFunction() {
  log('\n🔍 TESTING is_admin FUNCTION', 'bright');
  log('=' .repeat(50), 'blue');

  try {
    // Test with known admin ID
    const { data, error } = await supabase
      .rpc('is_admin', { check_user_id: 'dfd9154b-4238-4672-8a0a-e657a18532c5' });

    if (!error && data === true) {
      log('✅ is_admin function works correctly', 'green');
      log('   Returns true for admin user', 'cyan');
      return true;
    } else if (error) {
      log('❌ is_admin function error:', 'red');
      log(`   ${error.message}`, 'red');
      return false;
    } else {
      log('⚠️  is_admin returned false for admin user', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Failed to test is_admin function', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Test admin authentication
async function testAdminAuth() {
  log('\n🔍 TESTING ADMIN AUTHENTICATION', 'bright');
  log('=' .repeat(50), 'blue');

  try {
    // Check if user exists in auth.users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (!error) {
      const adminUser = users.find(u => u.id === 'dfd9154b-4238-4672-8a0a-e657a18532c5');

      if (adminUser) {
        log('✅ Admin user exists in auth.users', 'green');
        log(`   Email: ${adminUser.email}`, 'cyan');
        log(`   Created: ${adminUser.created_at}`, 'cyan');
        log(`   Last sign in: ${adminUser.last_sign_in_at || 'Never'}`, 'cyan');
        return true;
      } else {
        log('❌ Admin user not found in auth.users', 'red');
        log('   User ID dfd9154b-4238-4672-8a0a-e657a18532c5 needs to be created', 'yellow');
        return false;
      }
    } else {
      log('❌ Error checking auth.users:', 'red');
      log(`   ${error.message}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Failed to check auth system', 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

// Main execution
async function main() {
  log('\n🏗️  ADMIN SYSTEM SETUP CHECKER', 'bright');
  log('═' .repeat(50), 'magenta');
  log('Target: Leah Fowler Performance Supabase Database', 'cyan');
  log('Admin Email: info@leah.coach', 'cyan');
  log('Admin ID: dfd9154b-4238-4672-8a0a-e657a18532c5', 'cyan');
  log('═' .repeat(50), 'magenta');

  try {
    // Check current state
    const checks = await checkCurrentState();

    // Test is_admin function
    const isAdminWorks = await testIsAdminFunction();

    // Test admin auth
    const authExists = await testAdminAuth();

    // Determine if migration is needed
    const adminTableExists = checks.find(c => c.item === 'admin_users table')?.exists;
    const adminUserExists = checks.find(c => c.item === 'admin user')?.exists;

    log('\n📋 SUMMARY', 'bright');
    log('=' .repeat(50), 'blue');

    if (!adminTableExists || !adminUserExists || !isAdminWorks) {
      log('\n⚠️  MIGRATION REQUIRED', 'yellow');
      log('The admin system is not fully configured.', 'yellow');
      log('\n📝 TO COMPLETE SETUP:', 'bright');
      log('=' .repeat(50), 'cyan');

      log('\n1. Go to your Supabase Dashboard SQL Editor:', 'cyan');
      log(`   ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '')}/sql/new`, 'blue');

      log('\n2. Copy the ENTIRE contents of:', 'cyan');
      log('   FINAL-ADMIN-CASCADE-FIX.sql', 'blue');

      log('\n3. Paste it into the SQL Editor', 'cyan');

      log('\n4. Click "Run" to execute the migration', 'cyan');

      log('\n5. After completion, run this script again to verify', 'cyan');

      if (!authExists) {
        log('\n⚠️  ADDITIONAL STEP REQUIRED:', 'yellow');
        log('The admin user does not exist in auth.users.', 'yellow');
        log('You need to create a user with email: info@leah.coach', 'yellow');
        log('Either through sign-up or manually in the Auth section.', 'yellow');
      }

    } else {
      log('\n🎉 SUCCESS!', 'bright');
      log('The admin system is fully configured and working!', 'green');

      log('\n✅ Verified:', 'green');
      log('   • admin_users table exists', 'cyan');
      log('   • Admin user (info@leah.coach) is active', 'cyan');
      log('   • is_admin function returns true for admin', 'cyan');
      log('   • Admin exists in auth.users', 'cyan');

      log('\n🔗 Admin login URL:', 'bright');
      log('   https://leah.coach/admin/login', 'blue');
    }

    // Show migration file location
    log('\n📁 Migration file location:', 'bright');
    const migrationPath = path.join(__dirname, 'FINAL-ADMIN-CASCADE-FIX.sql');
    log(`   ${migrationPath}`, 'blue');

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the checker
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});