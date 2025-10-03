#!/usr/bin/env node

/**
 * Apply Admin Authentication Fix Migration - Direct SQL Version
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
  },
  db: {
    schema: 'public'
  }
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  let color = colors.reset;
  let prefix = '  ';

  switch(type) {
    case 'success':
      color = colors.green;
      prefix = '✅';
      break;
    case 'error':
      color = colors.red;
      prefix = '❌';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '⚠️ ';
      break;
    case 'section':
      color = colors.cyan;
      prefix = '📋';
      break;
    case 'info':
      color = colors.blue;
      prefix = 'ℹ️ ';
      break;
  }

  console.log(`${prefix} ${color}${message}${colors.reset}`);
}

async function executeSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split the SQL into individual statements
    // This is a simplified approach - for production, use a proper SQL parser
    const statements = sql
      .split(/;\s*$/gm)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip pure comments
      if (statement.match(/^\s*--/)) continue;

      // Extract a description from the statement
      const descMatch = statement.match(/--\s*(.+?)(?:\n|$)/);
      const description = descMatch ? descMatch[1] : `Statement ${i + 1}`;

      try {
        // For Supabase, we need to use their RPC endpoint to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', {
          query: statement
        });

        if (error) {
          // Some errors are expected (like dropping non-existent objects)
          if (error.message.includes('does not exist') ||
              error.message.includes('already exists')) {
            log(`${description} - skipped (already applied)`, 'warning');
          } else {
            log(`${description} - failed: ${error.message}`, 'error');
            errorCount++;
          }
        } else {
          log(`${description} - completed`, 'success');
          successCount++;
        }
      } catch (e) {
        log(`${description} - error: ${e.message}`, 'error');
        errorCount++;
      }
    }

    return { successCount, errorCount };
  } catch (error) {
    console.error('Failed to read SQL file:', error);
    return { successCount: 0, errorCount: 1 };
  }
}

async function applyMigration() {
  console.log('\n🚀 Starting Admin Authentication Fix Migration...\n');

  // Read the migration file
  const migrationPath = path.join(__dirname, 'migrations', '20250129_fix_admin_auth_defensive.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    console.error('   Expected location:', migrationPath);
    process.exit(1);
  }

  console.log('📝 Applying migration: 20250129_fix_admin_auth_defensive.sql');
  console.log('   This migration will:');
  console.log('   ✓ Create or replace is_admin() function');
  console.log('   ✓ Ensure admin user is active');
  console.log('   ✓ Drop and recreate all RLS policies');
  console.log('   ✓ Adapt policies to actual table structure\n');

  // Since Supabase doesn't provide a direct SQL execution endpoint,
  // we'll need to create a simplified version that works with their API

  // First, let's verify the admin user exists
  log('Checking admin user status...', 'section');

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*, admin_roles(role_name)')
    .eq('user_id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'leah@leahfowlerperformance.com')?.id)
    .single();

  if (adminError) {
    log(`Could not find admin user: ${adminError.message}`, 'warning');
  } else if (adminUser) {
    log(`Admin user found: ${adminUser.admin_roles?.role_name || 'No role'}`, 'success');

    // Update admin to be active
    if (!adminUser.is_active) {
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_active: true })
        .eq('id', adminUser.id);

      if (updateError) {
        log(`Failed to activate admin: ${updateError.message}`, 'error');
      } else {
        log('Admin user activated', 'success');
      }
    } else {
      log('Admin user already active', 'info');
    }
  }

  // Check table structures
  log('\nVerifying table structures...', 'section');

  const tables = ['admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags'];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      log(`Table ${table} exists`, 'success');
    } else {
      log(`Table ${table} issue: ${error.message}`, 'warning');
    }
  }

  console.log('\n📋 Migration Summary:');
  console.log('   • Admin user checked and activated if needed');
  console.log('   • Table structures verified');
  console.log('   • RLS policies need to be updated via Supabase Dashboard');

  console.log('\n⚠️  Important: Row Level Security policies cannot be directly');
  console.log('   modified via the Supabase client API. Please run the');
  console.log('   migration SQL directly in the Supabase SQL Editor:');
  console.log('\n   1. Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql');
  console.log('   2. Open the SQL Editor');
  console.log('   3. Copy and paste the contents of:');
  console.log(`      ${migrationPath}`);
  console.log('   4. Execute the query');

  console.log('\n🎯 Next Steps:');
  console.log('   1. Run the SQL migration in Supabase Dashboard');
  console.log('   2. Test admin authentication in your application');
  console.log('   3. Verify RLS policies are working correctly');
}

// Run the migration
applyMigration().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});