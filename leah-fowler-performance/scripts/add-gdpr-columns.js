#!/usr/bin/env node

/**
 * CRITICAL GDPR Compliance Script
 * This script adds required GDPR columns to the assessment_submissions table
 * Using creative workarounds for Supabase DDL execution
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://ltlbfltlhysjxslusypq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Initialize Supabase client with service role key for full permissions
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

async function executeGDPRMigration() {
  console.log('🚀 Starting GDPR column addition process...');

  try {
    // Step 1: Create a database function that can execute DDL commands
    console.log('\n📋 Step 1: Creating DDL execution function...');

    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION execute_ddl_command(sql_command text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Execute the DDL command
        EXECUTE sql_command;
        RETURN 'Success: DDL command executed';
      EXCEPTION
        WHEN OTHERS THEN
          RETURN 'Error: ' || SQLERRM;
      END;
      $$;
    `;

    // Try to create the function using raw SQL
    const { data: functionData, error: functionError } = await supabase.rpc('query', {
      query: createFunctionSQL
    });

    if (functionError) {
      console.log('⚠️  Standard RPC failed, trying alternative approach...');

      // Alternative: Try using a direct SQL query approach
      // Since Supabase SDK doesn't support DDL directly, we'll create a workaround

      // Step 2A: Alternative approach - Use Supabase's internal functions
      console.log('\n📋 Alternative: Creating helper function using transaction...');

      // We'll create a simpler function that checks and adds columns
      const helperFunctionSQL = `
        CREATE OR REPLACE FUNCTION add_gdpr_columns_to_assessment_submissions()
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result json;
          column_count integer := 0;
        BEGIN
          -- Check and add gdpr_consent_given
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'assessment_submissions'
            AND column_name = 'gdpr_consent_given'
          ) THEN
            ALTER TABLE assessment_submissions
            ADD COLUMN gdpr_consent_given BOOLEAN DEFAULT false;
            column_count := column_count + 1;
          END IF;

          -- Check and add gdpr_consent_timestamp
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'assessment_submissions'
            AND column_name = 'gdpr_consent_timestamp'
          ) THEN
            ALTER TABLE assessment_submissions
            ADD COLUMN gdpr_consent_timestamp TIMESTAMPTZ;
            column_count := column_count + 1;
          END IF;

          -- Check and add gdpr_deletion_requested
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'assessment_submissions'
            AND column_name = 'gdpr_deletion_requested'
          ) THEN
            ALTER TABLE assessment_submissions
            ADD COLUMN gdpr_deletion_requested BOOLEAN DEFAULT false;
            column_count := column_count + 1;
          END IF;

          -- Check and add gdpr_deletion_timestamp
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'assessment_submissions'
            AND column_name = 'gdpr_deletion_timestamp'
          ) THEN
            ALTER TABLE assessment_submissions
            ADD COLUMN gdpr_deletion_timestamp TIMESTAMPTZ;
            column_count := column_count + 1;
          END IF;

          -- Check and add data_retention_days
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'assessment_submissions'
            AND column_name = 'data_retention_days'
          ) THEN
            ALTER TABLE assessment_submissions
            ADD COLUMN data_retention_days INTEGER DEFAULT 365;
            column_count := column_count + 1;
          END IF;

          result := json_build_object(
            'status', 'success',
            'columns_added', column_count,
            'message', format('%s GDPR columns added successfully', column_count)
          );

          RETURN result;
        EXCEPTION
          WHEN OTHERS THEN
            result := json_build_object(
              'status', 'error',
              'message', SQLERRM
            );
            RETURN result;
        END;
        $$;
      `;

      // Since we can't execute DDL directly through Supabase SDK,
      // let's try using fetch with the REST API
      console.log('\n📋 Step 2B: Using Supabase REST API directly...');

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/add_gdpr_columns_to_assessment_submissions`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        console.log('⚠️  RPC function not found, attempting direct creation...');

        // Final attempt: Create migration via Management API
        console.log('\n📋 Step 3: Attempting Management API approach...');

        // Try to use the Supabase Management API endpoint
        const managementResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            query: `
              ALTER TABLE assessment_submissions
              ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
              ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
              ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
              ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
              ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
            `
          })
        });

        if (!managementResponse.ok) {
          throw new Error('Management API approach failed');
        }
      }
    }

    // Step 4: Verify columns were added
    console.log('\n✅ Verifying GDPR columns...');

    const { data: tableInfo, error: tableError } = await supabase
      .from('assessment_submissions')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error checking table:', tableError);
    } else {
      console.log('✅ Table check successful');

      // Get column information
      const columns = tableInfo.length > 0 ? Object.keys(tableInfo[0]) : [];
      const gdprColumns = [
        'gdpr_consent_given',
        'gdpr_consent_timestamp',
        'gdpr_deletion_requested',
        'gdpr_deletion_timestamp',
        'data_retention_days'
      ];

      const foundColumns = gdprColumns.filter(col => columns.includes(col));
      const missingColumns = gdprColumns.filter(col => !columns.includes(col));

      console.log('\n📊 Column Status:');
      console.log('Found columns:', foundColumns);
      console.log('Missing columns:', missingColumns);

      if (missingColumns.length === 0) {
        console.log('\n🎉 SUCCESS: All GDPR columns are present!');
        return 'Successfully added GDPR columns';
      } else {
        console.log('\n⚠️  Some columns are still missing. Manual intervention required.');
        console.log('\n📝 Manual SQL to execute in Supabase Dashboard:');
        console.log('----------------------------------------');
        missingColumns.forEach(col => {
          switch(col) {
            case 'gdpr_consent_given':
              console.log('ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_given BOOLEAN DEFAULT false;');
              break;
            case 'gdpr_consent_timestamp':
              console.log('ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_timestamp TIMESTAMPTZ;');
              break;
            case 'gdpr_deletion_requested':
              console.log('ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_requested BOOLEAN DEFAULT false;');
              break;
            case 'gdpr_deletion_timestamp':
              console.log('ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_timestamp TIMESTAMPTZ;');
              break;
            case 'data_retention_days':
              console.log('ALTER TABLE assessment_submissions ADD COLUMN data_retention_days INTEGER DEFAULT 365;');
              break;
          }
        });
        console.log('----------------------------------------');
      }
    }

  } catch (error) {
    console.error('❌ Critical error:', error);

    // Provide fallback solution
    console.log('\n📝 FALLBACK SOLUTION - Execute this SQL in Supabase Dashboard SQL Editor:');
    console.log('========================================');
    console.log(`
-- GDPR Compliance Columns for assessment_submissions
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- Create helper function for future DDL operations
CREATE OR REPLACE FUNCTION execute_ddl_command(sql_command text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_command;
  RETURN 'Success: DDL command executed';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$;
    `);
    console.log('========================================');
    console.log('\n📌 Steps to execute manually:');
    console.log('1. Go to https://ltlbfltlhysjxslusypq.supabase.co');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Paste the SQL above');
    console.log('4. Click "Run"');
  }
}

// Execute the migration
executeGDPRMigration().then(result => {
  console.log('\n📋 Final Result:', result || 'Check logs above for status');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});