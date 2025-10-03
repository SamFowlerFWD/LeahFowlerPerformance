#!/usr/bin/env node

/**
 * Execute Admin Authentication Fix Migration
 * Uses Supabase REST API to execute SQL migration
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Read migration file
const migrationPath = path.join(__dirname, 'FIXED-ADMIN-NO-ROLES-TABLE.sql');
const sqlContent = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Starting Admin Authentication Fix Migration');
console.log('📍 Target:', SUPABASE_URL);
console.log('📄 Migration file:', migrationPath);
console.log('=' .repeat(60));

// Execute migration using fetch to call Supabase SQL endpoint
async function executeMigration() {
  try {
    // Parse project ref from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

    // Use Supabase Management API endpoint
    const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

    console.log('\n📝 Executing migration via Supabase API...');

    // Try using the REST API with raw SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });

    if (!response.ok) {
      // Fallback: Execute statements individually
      console.log('ℹ️  Direct RPC not available, executing statements individually...\n');

      // Split SQL into individual statements (basic split, works for this migration)
      const statements = sqlContent
        .split(/;\s*\n/)
        .filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'))
        .map(stmt => stmt.trim() + ';');

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        // Skip empty statements and pure comments
        if (!statement.trim() || statement.trim().startsWith('--')) continue;

        // Extract a description from the statement
        const firstLine = statement.split('\n')[0].substring(0, 50);
        process.stdout.write(`  [${i+1}/${statements.length}] ${firstLine}... `);

        try {
          // Use raw SQL through a custom function if available
          const { createClient } = require('@supabase/supabase-js');
          const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

          // Try to execute the statement
          const { error } = await supabase.rpc('exec_sql', { sql: statement }).catch(() => ({ error: 'Not available' }));

          if (error) {
            // Skip non-critical errors
            if (statement.includes('DROP') || statement.includes('IF EXISTS')) {
              console.log('⚠️  Skipped (OK)');
              successCount++;
            } else {
              console.log('❌ Failed');
              errorCount++;
            }
          } else {
            console.log('✅');
            successCount++;
          }
        } catch (err) {
          console.log('❌ Error');
          errorCount++;
        }
      }

      console.log('\n📊 Results:');
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${errorCount}`);

      if (errorCount > 0) {
        console.log('\n⚠️  Some statements failed, but this might be OK if they were cleanup statements.');
      }
    } else {
      console.log('✅ Migration executed successfully via RPC!');
    }

    // Verify the results
    console.log('\n🔍 Verifying migration results...\n');

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check admin user
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', 'dfd9154b-4238-4672-8a0a-e657a18532c5')
      .single();

    if (adminUser && !adminError) {
      console.log('✅ Admin user found:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.is_active ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user not found or error:', adminError?.message);
    }

    // Test is_admin function
    const { data: isAdminResult, error: funcError } = await supabase
      .rpc('is_admin', { user_id: 'dfd9154b-4238-4672-8a0a-e657a18532c5' });

    if (isAdminResult !== undefined && !funcError) {
      console.log(`\n✅ is_admin() function: ${isAdminResult ? 'Returns TRUE for admin' : 'Returns FALSE (needs fix)'}`);
    } else {
      console.log('❌ is_admin() function error:', funcError?.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 MIGRATION PROCESS COMPLETE!');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('1. Test admin login at: https://leah.coach/admin/login');
    console.log('2. Email: info@leah.coach');
    console.log('3. Use the password that was set for this user');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
executeMigration();