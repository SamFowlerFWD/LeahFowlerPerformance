const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

// The SQL to execute
const sqlCommand = `
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
`;

async function executeGDPRSQL() {
  console.log('🚀 Executing GDPR columns addition...\n');

  try {
    // First, verify connection by checking the table
    console.log('Step 1: Verifying table access...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('assessment_submissions')
      .select('id')
      .limit(1);

    if (tableError) {
      console.log('Table access error:', tableError.message);
    } else {
      console.log('✓ Table accessible\n');
    }

    // Try to create a database function to execute the ALTER command
    console.log('Step 2: Creating execution function...');
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_gdpr_columns()
      RETURNS void AS $$
      BEGIN
        ALTER TABLE assessment_submissions
        ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Since we can't directly execute DDL, let's check if columns exist by trying to query them
    console.log('Step 3: Checking if GDPR columns exist...');
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('id')
      .limit(0);

    if (!error) {
      // Try to insert a test record with GDPR fields to see if they exist
      const testInsert = {
        programme_id: `gdpr-test-${Date.now()}`,
        name: 'GDPR Column Test',
        email: `test-${Date.now()}@example.com`,
        company: 'Test Company',
        role: 'Test Role',
        management_level: 'mid_level',
        team_size: '10-50',
        score: 0,
        status: 'pending',
        gdpr_consent_given: true,
        gdpr_consent_timestamp: new Date().toISOString(),
        gdpr_deletion_requested: false,
        gdpr_deletion_timestamp: null,
        data_retention_days: 365
      };

      const { data: insertData, error: insertError } = await supabase
        .from('assessment_submissions')
        .insert([testInsert])
        .select();

      if (!insertError) {
        console.log('\n✅ SUCCESS: GDPR columns already exist in assessment_submissions table!');

        // Delete test record
        if (insertData && insertData[0]) {
          await supabase
            .from('assessment_submissions')
            .delete()
            .eq('id', insertData[0].id);
          console.log('✓ Test record cleaned up');
        }

        console.log('\nColumns confirmed:');
        console.log('- gdpr_consent_given (BOOLEAN, default: false)');
        console.log('- gdpr_consent_timestamp (TIMESTAMPTZ)');
        console.log('- gdpr_deletion_requested (BOOLEAN, default: false)');
        console.log('- gdpr_deletion_timestamp (TIMESTAMPTZ)');
        console.log('- data_retention_days (INTEGER, default: 365)');
      } else {
        if (insertError.message.includes('gdpr_consent_given') ||
            insertError.message.includes('gdpr_consent_timestamp') ||
            insertError.message.includes('gdpr_deletion_requested') ||
            insertError.message.includes('gdpr_deletion_timestamp') ||
            insertError.message.includes('data_retention_days')) {

          console.log('\n❌ GDPR columns do not exist yet.');
          console.log('\nError details:', insertError.message);

          console.log('\n' + '='.repeat(70));
          console.log('⚠️  MANUAL ACTION REQUIRED');
          console.log('='.repeat(70));
          console.log('\nThe GDPR columns need to be added manually through the Supabase Dashboard.\n');
          console.log('1. Open your browser and go to:');
          console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new\n');
          console.log('2. Copy and paste this SQL command:\n');
          console.log('-'.repeat(70));
          console.log(sqlCommand);
          console.log('-'.repeat(70));
          console.log('\n3. Click "RUN" button to execute the SQL\n');
          console.log('4. You should see "Success. No rows returned" message\n');
          console.log('5. The GDPR columns will be added immediately\n');
          console.log('='.repeat(70));

          // Create SQL file for convenience
          const fs = require('fs');
          fs.writeFileSync('/Users/samfowler/Code/LeahFowlerPerformance-1/gdpr-columns.sql', sqlCommand);
          console.log('\n📄 SQL saved to: gdpr-columns.sql (for your convenience)\n');
        } else {
          console.log('\nOther error occurred:', insertError.message);
        }
      }
    } else {
      console.log('Initial connection error:', error.message);
    }

  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

executeGDPRSQL();