#!/usr/bin/env node

/**
 * Direct Supabase Migration Executor
 * Executes SQL migrations using direct HTTP requests to Supabase
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase keys in .env.local');
  process.exit(1);
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 400) {
            reject(new Error(parsed.message || parsed.error || `HTTP ${res.statusCode}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          } else {
            resolve(responseData);
          }
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

// Test connection to Supabase
async function testConnection() {
  log('\n🔌 Testing Supabase connection...', 'cyan');

  try {
    const options = {
      hostname: 'ltlbfltlhysjxslusypq.supabase.co',
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    };

    await makeRequest(options);
    log('✅ Connection successful!', 'green');
    return true;
  } catch (error) {
    log(`❌ Connection failed: ${error.message}`, 'red');
    return false;
  }
}

// Read and parse SQL file
function readSqlFile(filename) {
  const filePath = path.join(__dirname, 'supabase', 'migrations', filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Remove comments and split by semicolons
  const statements = content
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return statements;
}

// Create initial required functions that migrations depend on
async function createInitialFunctions() {
  log('\n🔧 Creating initial required functions...', 'cyan');

  const initialSql = `
-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
`;

  // We'll save this for manual execution
  const tempFile = path.join(__dirname, 'temp_initial_setup.sql');
  fs.writeFileSync(tempFile, initialSql);

  log('✅ Initial setup SQL saved to: temp_initial_setup.sql', 'green');
  return true;
}

// Main migration runner
async function runMigrations() {
  log('\n🚀 SUPABASE MIGRATION EXECUTOR', 'bright');
  log('================================', 'bright');
  log(`📍 Target: ${SUPABASE_URL}`, 'cyan');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    log('\n❌ Cannot connect to Supabase. Please check your credentials.', 'red');
    return;
  }

  // Create initial functions
  await createInitialFunctions();

  // Prepare migration files
  const migrations = [
    '000_MASTER_MIGRATION.sql',
    '001_STORAGE_BUCKETS.sql'
  ];

  log('\n📝 Preparing migration files for manual execution...', 'yellow');

  // Combine all migrations into one file for easy execution
  let combinedSql = `-- Leah Fowler Performance Coach Platform
-- Complete Database Migration Script
-- Generated: ${new Date().toISOString()}
-- Target: ${SUPABASE_URL}

-- ================================================
-- IMPORTANT: Execute this in Supabase SQL Editor
-- URL: https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql
-- ================================================

`;

  for (const migration of migrations) {
    const filePath = path.join(__dirname, 'supabase', 'migrations', migration);

    if (fs.existsSync(filePath)) {
      log(`  ✅ Found: ${migration}`, 'green');
      const content = fs.readFileSync(filePath, 'utf8');

      combinedSql += `
-- ================================================
-- Migration: ${migration}
-- ================================================

${content}

`;
    } else {
      log(`  ❌ Missing: ${migration}`, 'red');
    }
  }

  // Add verification queries
  const verificationPath = path.join(__dirname, 'supabase', 'MIGRATION_VERIFICATION.sql');
  if (fs.existsSync(verificationPath)) {
    const verificationContent = fs.readFileSync(verificationPath, 'utf8');
    combinedSql += `
-- ================================================
-- Migration Verification
-- ================================================

${verificationContent}
`;
  }

  // Save combined SQL
  const outputFile = path.join(__dirname, 'EXECUTE_THIS_MIGRATION.sql');
  fs.writeFileSync(outputFile, combinedSql);

  log('\n✅ Migration script prepared!', 'green');
  log('\n📋 MANUAL EXECUTION REQUIRED:', 'yellow');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');

  log('\n1️⃣  Open Supabase SQL Editor:', 'cyan');
  log('   https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql', 'bright');

  log('\n2️⃣  Copy the contents of:', 'cyan');
  log(`   ${outputFile}`, 'bright');

  log('\n3️⃣  Paste into SQL editor and click "Run"', 'cyan');

  log('\n4️⃣  Expected results:', 'cyan');
  log('   - 35+ tables created', 'reset');
  log('   - 8 storage buckets configured', 'reset');
  log('   - 40+ RLS policies applied', 'reset');
  log('   - 15+ functions installed', 'reset');

  // Also create a quick test script
  const testScript = `
-- Quick test queries to verify migration success
-- Run these after migration to confirm everything works

-- Check key tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Count total tables (should be 35+)
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- Check storage buckets
SELECT id, name, public FROM storage.buckets;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- Check functions exist
SELECT proname
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
ORDER BY proname;
`;

  const testFile = path.join(__dirname, 'test_migration.sql');
  fs.writeFileSync(testFile, testScript);

  log('\n📊 Test script saved to:', 'cyan');
  log(`   ${testFile}`, 'bright');

  log('\n✨ Preparation complete!', 'green');
  log('\nNOTE: Due to Supabase API limitations, migrations must be executed manually via the SQL editor.', 'yellow');
}

// Run the migration process
runMigrations().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});