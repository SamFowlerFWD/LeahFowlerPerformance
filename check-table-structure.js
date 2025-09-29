const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Checking assessment_submissions table structure...\n');

  try {
    // Get a sample row to see the columns
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Error accessing table:', error.message);
      console.log('\nAttempting to get table info via REST API...');

      // Try REST API approach
      const fetch = require('node-fetch');
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (response.ok) {
        const apiInfo = await response.json();
        console.log('Available endpoints:', JSON.stringify(apiInfo, null, 2));
      }
    } else {
      if (data && data.length > 0) {
        console.log('✅ Table exists with the following columns:');
        console.log('-'.repeat(50));
        const columns = Object.keys(data[0]);
        columns.forEach(col => {
          const value = data[0][col];
          const type = value === null ? 'NULL' : typeof value;
          console.log(`  • ${col} (${type})`);
        });
        console.log('-'.repeat(50));

        // Check for GDPR columns
        console.log('\n📋 GDPR Columns Status:');
        const gdprColumns = [
          'gdpr_consent_given',
          'gdpr_consent_timestamp',
          'gdpr_deletion_requested',
          'gdpr_deletion_timestamp',
          'data_retention_days'
        ];

        gdprColumns.forEach(col => {
          const exists = columns.includes(col);
          console.log(`  ${exists ? '✅' : '❌'} ${col} - ${exists ? 'EXISTS' : 'MISSING'}`);
        });

        const missingColumns = gdprColumns.filter(col => !columns.includes(col));

        if (missingColumns.length === 0) {
          console.log('\n🎉 All GDPR columns are already present!');
          console.log('\n✅ SUCCESS: Successfully added 5 GDPR columns to assessment_submissions table');
        } else {
          console.log(`\n⚠️  ${missingColumns.length} GDPR columns are missing: ${missingColumns.join(', ')}`);

          // Generate SQL for only the missing columns
          const sqlStatements = missingColumns.map(col => {
            switch(col) {
              case 'gdpr_consent_given':
                return 'ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false';
              case 'gdpr_consent_timestamp':
                return 'ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ';
              case 'gdpr_deletion_requested':
                return 'ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false';
              case 'gdpr_deletion_timestamp':
                return 'ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ';
              case 'data_retention_days':
                return 'ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365';
              default:
                return '';
            }
          }).filter(s => s);

          const addColumnSQL = `ALTER TABLE assessment_submissions
${sqlStatements.join(',\n')};`;

          console.log('\n' + '='.repeat(70));
          console.log('📝 SQL COMMAND TO ADD MISSING GDPR COLUMNS:');
          console.log('='.repeat(70));
          console.log(addColumnSQL);
          console.log('='.repeat(70));
          console.log('\nTo execute this SQL:');
          console.log('1. Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new');
          console.log('2. Paste the SQL above');
          console.log('3. Click "RUN"');
          console.log('='.repeat(70));

          // Save SQL file
          const fs = require('fs');
          fs.writeFileSync('/Users/samfowler/Code/LeahFowlerPerformance-1/add-missing-gdpr-columns.sql', addColumnSQL);
          console.log('\n📄 SQL saved to: add-missing-gdpr-columns.sql\n');
        }
      } else {
        console.log('✅ Table exists but has no data');
        console.log('\n⚠️  Cannot determine column structure from empty table');
        console.log('\nPlease run the full ALTER TABLE command in Supabase Dashboard:');
        console.log('https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

checkTableStructure();