#!/usr/bin/env node

/**
 * GDPR Column Verification Script
 * Checks the current status of GDPR columns in the database
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function verifyGDPRColumns() {
  console.log('🔍 GDPR Column Verification Report');
  console.log('=' .repeat(60));
  console.log('Database:', 'ltlbfltlhysjxslusypq');
  console.log('Table:', 'assessment_submissions');
  console.log('=' .repeat(60));

  const requiredColumns = [
    { name: 'gdpr_consent_given', type: 'BOOLEAN', default: 'false' },
    { name: 'gdpr_consent_timestamp', type: 'TIMESTAMPTZ', default: null },
    { name: 'gdpr_deletion_requested', type: 'BOOLEAN', default: 'false' },
    { name: 'gdpr_deletion_timestamp', type: 'TIMESTAMPTZ', default: null },
    { name: 'data_retention_days', type: 'INTEGER', default: '365' }
  ];

  try {
    // Try to select all columns including GDPR ones
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing table:', error.message);
      return false;
    }

    // Check which columns exist
    const existingColumns = data && data.length > 0 ? Object.keys(data[0]) : [];

    console.log('\n📊 Column Status:');
    console.log('-' .repeat(60));

    let allColumnsPresent = true;
    const missingColumns = [];

    for (const column of requiredColumns) {
      const exists = existingColumns.includes(column.name);
      const status = exists ? '✅' : '❌';
      console.log(`${status} ${column.name.padEnd(30)} ${exists ? 'PRESENT' : 'MISSING'}`);

      if (!exists) {
        allColumnsPresent = false;
        missingColumns.push(column);
      }
    }

    console.log('-' .repeat(60));

    if (allColumnsPresent) {
      console.log('\n🎉 SUCCESS: All GDPR columns are present!');
      console.log('The database is GDPR compliant.');
      return true;
    } else {
      console.log('\n⚠️  WARNING: GDPR columns are MISSING!');
      console.log(`Missing columns: ${missingColumns.map(c => c.name).join(', ')}`);

      console.log('\n🚨 URGENT ACTION REQUIRED:');
      console.log('=' .repeat(60));
      console.log('\nOPTION 1: Use Supabase Dashboard (RECOMMENDED)');
      console.log('-' .repeat(60));
      console.log('1. Go to: https://ltlbfltlhysjxslusypq.supabase.co');
      console.log('2. Click on "SQL Editor" in the left sidebar');
      console.log('3. Copy the SQL from: scripts/gdpr-migration.sql');
      console.log('4. Paste it into the SQL Editor');
      console.log('5. Click the "Run" button');

      console.log('\n\nOPTION 2: Install Supabase CLI and Deploy');
      console.log('-' .repeat(60));
      console.log('npm install -g supabase');
      console.log('supabase login');
      console.log('supabase link --project-ref ltlbfltlhysjxslusypq');
      console.log('supabase db execute -f scripts/gdpr-migration.sql');

      console.log('\n\nSQL TO EXECUTE:');
      console.log('-' .repeat(60));
      missingColumns.forEach(col => {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
        console.log(`ALTER TABLE assessment_submissions ADD COLUMN ${col.name} ${col.type}${defaultClause};`);
      });

      return false;
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    return false;
  }
}

// Execute verification
verifyGDPRColumns().then(success => {
  if (success) {
    console.log('\n✅ Database is GDPR compliant');
    process.exit(0);
  } else {
    console.log('\n❌ GDPR columns must be added manually');
    console.log('\n📝 All necessary files have been created:');
    console.log('   - SQL Migration: scripts/gdpr-migration.sql');
    console.log('   - Edge Function: supabase/functions/gdpr-ddl-executor/');
    console.log('   - Migration Guide: GDPR-MIGRATION-URGENT.md');
    process.exit(1);
  }
});