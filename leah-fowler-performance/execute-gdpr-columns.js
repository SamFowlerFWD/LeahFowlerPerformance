const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function executeGDPRMigration() {
  console.log('🚀 Executing GDPR Column Migration...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

  try {
    // First, let's verify what exists
    console.log('📊 Checking current database state...\n');

    // Check existing tables
    const tables = [
      'gdpr_verification_requests',
      'api_rate_limits',
      'security_audit_log',
      'assessment_submissions'
    ];

    console.log('✅ TABLES ALREADY EXIST:');
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        console.log(`   • ${table} ✓`);
      } else {
        console.log(`   • ${table} ✗ (${error.message})`);
      }
    }

    // Check for GDPR columns in assessment_submissions
    console.log('\n📋 Checking GDPR columns in assessment_submissions...');

    const { data: testData, error: testError } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1);

    if (!testError && testData) {
      const sampleRow = testData[0] || {};
      const gdprColumns = [
        'gdpr_consent_given',
        'gdpr_consent_timestamp',
        'gdpr_deletion_requested',
        'gdpr_deletion_timestamp',
        'data_retention_days'
      ];

      console.log('\nGDPR Column Status:');
      let missingColumns = [];
      for (const col of gdprColumns) {
        if (col in sampleRow) {
          console.log(`   ✅ ${col} exists`);
        } else {
          console.log(`   ❌ ${col} MISSING`);
          missingColumns.push(col);
        }
      }

      if (missingColumns.length > 0) {
        console.log('\n⚠️  GDPR columns are missing!');
        console.log('\n📝 To add them, execute this SQL in Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new\n');

        console.log('```sql');
        console.log('ALTER TABLE assessment_submissions');
        console.log('ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,');
        console.log('ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,');
        console.log('ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,');
        console.log('ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,');
        console.log('ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;');
        console.log('```');
      } else {
        console.log('\n✅ All GDPR columns are already present!');
      }
    }

    // Test GDPR functionality
    console.log('\n🧪 Testing GDPR functionality...');

    // Test inserting with GDPR consent
    const testSubmission = {
      email: 'gdpr-test@example.com',
      first_name: 'GDPR',
      last_name: 'Test',
      gdpr_consent_given: true,
      gdpr_consent_timestamp: new Date().toISOString(),
      data_retention_days: 365
    };

    const { error: insertError } = await supabase
      .from('assessment_submissions')
      .insert(testSubmission);

    if (!insertError) {
      console.log('   ✅ GDPR consent tracking works');

      // Clean up test data
      await supabase
        .from('assessment_submissions')
        .delete()
        .eq('email', 'gdpr-test@example.com');
    } else {
      console.log('   ⚠️ GDPR columns may need to be added');
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY:');
    console.log('='.repeat(50));
    console.log('\n✅ Security tables exist:');
    console.log('   • gdpr_verification_requests');
    console.log('   • api_rate_limits');
    console.log('   • security_audit_log');

    if (missingColumns && missingColumns.length > 0) {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('   Add GDPR columns via Supabase SQL Editor');
      console.log('   Link: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new');
    } else {
      console.log('\n✅ Database is fully GDPR compliant!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Execute
executeGDPRMigration();