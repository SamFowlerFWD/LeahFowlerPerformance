#!/usr/bin/env node

/**
 * Direct Supabase Deployment Script using REST API
 * Alternative approach using direct HTTP calls
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('='.repeat(60));
console.log('DIRECT SUPABASE DEPLOYMENT');
console.log('='.repeat(60));
console.log(`Target: ${SUPABASE_URL}`);
console.log(`Time: ${new Date().toISOString()}\n`);

/**
 * Execute SQL using Supabase's query endpoint
 */
async function executeSQL(sql) {
  // Method 1: Try using the admin endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    }
  } catch (e) {
    // Continue to next method
  }

  // Method 2: Try using pg endpoint directly
  try {
    const response = await fetch(`${SUPABASE_URL}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    }
  } catch (e) {
    // Continue to next method
  }

  // Method 3: Use Supabase client to create a function that executes SQL
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    // First create the function if it doesn't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(query text)
      RETURNS json AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE query;
        RETURN json_build_object('success', true);
      EXCEPTION WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    await supabase.rpc('exec_sql', { query: createFunctionSQL }).catch(() => {});

    // Now use the function
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create storage buckets using Supabase Storage API
 */
async function createBuckets() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const buckets = [
    { id: 'avatars', public: true },
    { id: 'lead-magnets', public: false },
    { id: 'blog-images', public: true },
    { id: 'testimonial-media', public: true },
    { id: 'assessment-attachments', public: false },
    { id: 'email-assets', public: true },
    { id: 'video-content', public: false },
    { id: 'exports', public: false }
  ];

  console.log('\nCreating Storage Buckets...');

  for (const bucket of buckets) {
    process.stdout.write(`  Creating ${bucket.id}... `);

    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✓ Already exists');
      } else {
        console.log(`✗ Error: ${error.message}`);
      }
    } else {
      console.log('✓ Created');
    }
  }
}

/**
 * Read and execute migration file
 */
async function executeMigrationFile() {
  const migrationPath = path.join(__dirname, '..', 'EXECUTE_THIS_MIGRATION.sql');

  console.log('\nReading migration file...');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split into statements (simple split by semicolon followed by newline)
  const statements = sql
    .split(/;\s*\n/)
    .filter(stmt => stmt.trim().length > 0 && !stmt.trim().startsWith('--'))
    .map(stmt => stmt.trim() + ';');

  console.log(`Found ${statements.length} SQL statements\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 50).replace(/\s+/g, ' ');

    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `);

    const result = await executeSQL(stmt);

    if (result.success) {
      console.log('✓');
      success++;
    } else if (result.error && (
      result.error.includes('already exists') ||
      result.error.includes('duplicate')
    )) {
      console.log('⚠ Skipped (already exists)');
      skipped++;
    } else {
      console.log(`✗ ${result.error}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Migration Summary:`);
  console.log(`  ✓ Successful: ${success}`);
  console.log(`  ⚠ Skipped: ${skipped}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log('='.repeat(60));

  return failed === 0;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Test connection
    console.log('Testing connection...');
    const testResult = await executeSQL('SELECT 1 as test;');

    if (!testResult.success) {
      console.log('✗ Failed to connect to database');
      console.log('Trying alternative connection method...\n');
    } else {
      console.log('✓ Connected successfully\n');
    }

    // Execute migrations
    const migrationSuccess = await executeMigrationFile();

    // Create buckets
    await createBuckets();

    // Final summary
    console.log('\n' + '='.repeat(60));
    if (migrationSuccess) {
      console.log('DEPLOYMENT COMPLETED SUCCESSFULLY!');
    } else {
      console.log('DEPLOYMENT COMPLETED WITH SOME ERRORS');
      console.log('Please review the logs above.');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    process.exit(1);
  }
}

// Run the script
main();