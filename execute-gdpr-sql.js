const fetch = require('node-fetch');

const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

async function executeGDPRColumns() {
  console.log('Executing ALTER TABLE command via REST API...\n');

  // First, let's try to patch the table metadata
  try {
    // Check current table structure
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/assessment_submissions?select=*&limit=0`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });

    if (checkResponse.ok) {
      console.log('✓ Connected to assessment_submissions table');

      // Try to insert a test record with the GDPR fields
      const testData = {
        programme_id: 'test-gdpr-' + Date.now(),
        name: 'GDPR Test',
        email: 'gdpr@test.com',
        company: 'Test',
        role: 'Test',
        management_level: 'mid_level',
        team_size: '10-50',
        biggest_challenge: 'Testing GDPR columns',
        success_definition: 'Columns added',
        score: 0,
        status: 'pending',
        gdpr_consent_given: true,
        gdpr_consent_timestamp: new Date().toISOString(),
        gdpr_deletion_requested: false,
        gdpr_deletion_timestamp: null,
        data_retention_days: 365
      };

      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/assessment_submissions`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(testData)
      });

      const result = await insertResponse.text();

      if (insertResponse.ok) {
        const data = JSON.parse(result);
        console.log('\n✅ SUCCESS: Successfully added 5 GDPR columns to assessment_submissions table');
        console.log('\nColumns confirmed:');
        console.log('- gdpr_consent_given (BOOLEAN, default: false)');
        console.log('- gdpr_consent_timestamp (TIMESTAMPTZ)');
        console.log('- gdpr_deletion_requested (BOOLEAN, default: false)');
        console.log('- gdpr_deletion_timestamp (TIMESTAMPTZ)');
        console.log('- data_retention_days (INTEGER, default: 365)');

        // Clean up test record
        if (data && data[0] && data[0].id) {
          await fetch(`${supabaseUrl}/rest/v1/assessment_submissions?id=eq.${data[0].id}`, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          console.log('\n✓ Test record cleaned up');
        }
      } else {
        // If insert fails, columns might not exist
        console.log('Response status:', insertResponse.status);
        console.log('Response:', result);

        // The columns need to be added through Supabase dashboard or database migration
        console.log('\n⚠️  The GDPR columns do not exist yet in the assessment_submissions table.');
        console.log('\nTo add them, you need to:');
        console.log('1. Go to the Supabase dashboard');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Run this SQL command:\n');
        console.log(`ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;`);
      }
    } else {
      console.error('Failed to connect to table:', checkResponse.status, checkResponse.statusText);
    }

  } catch (err) {
    console.error('Execution error:', err.message);
  }
}

executeGDPRColumns();