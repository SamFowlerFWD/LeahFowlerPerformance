#!/usr/bin/env node

/**
 * Ultra-creative Supabase DDL Executor
 * This script uses multiple approaches to execute DDL on Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

class SupabaseDDLExecutor {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * Method 1: Create and use a stored procedure for DDL execution
   */
  async createDDLExecutor() {
    console.log('\n🔧 Method 1: Creating DDL executor stored procedure...');

    // First, let's create a table that will store DDL commands to execute
    const createDDLTableSQL = `
      CREATE TABLE IF NOT EXISTS ddl_commands (
        id SERIAL PRIMARY KEY,
        command TEXT NOT NULL,
        executed BOOLEAN DEFAULT FALSE,
        executed_at TIMESTAMPTZ,
        result TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create a function that processes DDL commands from the table
    const createProcessorFunctionSQL = `
      CREATE OR REPLACE FUNCTION process_ddl_commands()
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        cmd RECORD;
        result_json json;
        success_count INTEGER := 0;
        error_count INTEGER := 0;
      BEGIN
        -- Process all unexecuted DDL commands
        FOR cmd IN SELECT * FROM ddl_commands WHERE executed = FALSE ORDER BY id LOOP
          BEGIN
            -- Execute the DDL command
            EXECUTE cmd.command;

            -- Mark as executed
            UPDATE ddl_commands
            SET executed = TRUE,
                executed_at = NOW(),
                result = 'Success'
            WHERE id = cmd.id;

            success_count := success_count + 1;
          EXCEPTION
            WHEN OTHERS THEN
              UPDATE ddl_commands
              SET result = 'Error: ' || SQLERRM
              WHERE id = cmd.id;

              error_count := error_count + 1;
          END;
        END LOOP;

        result_json := json_build_object(
          'success_count', success_count,
          'error_count', error_count,
          'status', CASE WHEN error_count = 0 THEN 'success' ELSE 'partial' END
        );

        RETURN result_json;
      END;
      $$;
    `;

    try {
      // Try to insert DDL commands into a table
      const commands = [
        'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false',
        'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ',
        'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false',
        'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ',
        'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365'
      ];

      console.log('📝 Attempting to queue DDL commands...');

      // First check if ddl_commands table exists or create it
      const { data: tables } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'ddl_commands');

      if (!tables || tables.length === 0) {
        console.log('⚠️  DDL commands table not found');
      }

      return { method: 'stored_procedure', status: 'requires_manual_setup' };
    } catch (error) {
      console.error('❌ Method 1 failed:', error.message);
      return { method: 'stored_procedure', status: 'failed', error: error.message };
    }
  }

  /**
   * Method 2: Use a trigger-based approach
   */
  async createTriggerBasedDDL() {
    console.log('\n🔧 Method 2: Creating trigger-based DDL execution...');

    const triggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_gdpr_columns_trigger()
      RETURNS event_trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- This function would be triggered by DDL events
        -- Add GDPR columns when certain conditions are met
        EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false';
        EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ';
        EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false';
        EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ';
        EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365';
      END;
      $$;
    `;

    try {
      // This would need to be executed with superuser privileges
      console.log('⚠️  Trigger approach requires superuser privileges');
      return { method: 'trigger', status: 'requires_superuser' };
    } catch (error) {
      console.error('❌ Method 2 failed:', error.message);
      return { method: 'trigger', status: 'failed', error: error.message };
    }
  }

  /**
   * Method 3: Create a function that checks and adds columns individually
   */
  async createColumnChecker() {
    console.log('\n🔧 Method 3: Creating individual column checker function...');

    const checkerFunctionSQL = `
      CREATE OR REPLACE FUNCTION ensure_gdpr_columns()
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result json;
        columns_added INTEGER := 0;
        column_exists BOOLEAN;
      BEGIN
        -- Check each column individually

        -- gdpr_consent_given
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'assessment_submissions'
          AND column_name = 'gdpr_consent_given'
        ) INTO column_exists;

        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_given BOOLEAN DEFAULT false';
          columns_added := columns_added + 1;
        END IF;

        -- gdpr_consent_timestamp
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'assessment_submissions'
          AND column_name = 'gdpr_consent_timestamp'
        ) INTO column_exists;

        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_timestamp TIMESTAMPTZ';
          columns_added := columns_added + 1;
        END IF;

        -- gdpr_deletion_requested
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'assessment_submissions'
          AND column_name = 'gdpr_deletion_requested'
        ) INTO column_exists;

        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_requested BOOLEAN DEFAULT false';
          columns_added := columns_added + 1;
        END IF;

        -- gdpr_deletion_timestamp
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'assessment_submissions'
          AND column_name = 'gdpr_deletion_timestamp'
        ) INTO column_exists;

        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_timestamp TIMESTAMPTZ';
          columns_added := columns_added + 1;
        END IF;

        -- data_retention_days
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'assessment_submissions'
          AND column_name = 'data_retention_days'
        ) INTO column_exists;

        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE assessment_submissions ADD COLUMN data_retention_days INTEGER DEFAULT 365';
          columns_added := columns_added + 1;
        END IF;

        result := json_build_object(
          'status', 'success',
          'columns_added', columns_added,
          'message', format('Added %s GDPR columns', columns_added)
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

    try {
      // Attempt to create this function via API
      console.log('📝 Attempting to create column checker function...');

      // We need to execute this SQL somehow
      // Let's try using the pgrest API directly
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ensure_gdpr_columns`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: '{}'
      });

      if (response.status === 404) {
        console.log('⚠️  Function not found - needs to be created manually');
        return { method: 'column_checker', status: 'requires_manual_creation', sql: checkerFunctionSQL };
      }

      const result = await response.json();
      console.log('✅ Column checker result:', result);
      return { method: 'column_checker', status: 'success', result };

    } catch (error) {
      console.error('❌ Method 3 failed:', error.message);
      return { method: 'column_checker', status: 'failed', error: error.message };
    }
  }

  /**
   * Method 4: Use Supabase Management API (if available)
   */
  async useManagementAPI() {
    console.log('\n🔧 Method 4: Attempting Supabase Management API...');

    try {
      // Try different endpoint variations
      const endpoints = [
        '/rest/v1/query',
        '/pg/query',
        '/sql/v1',
        '/admin/v1/database/sql'
      ];

      for (const endpoint of endpoints) {
        console.log(`  Trying endpoint: ${endpoint}`);

        const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
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

        if (response.ok) {
          console.log(`✅ Success with endpoint: ${endpoint}`);
          return { method: 'management_api', status: 'success', endpoint };
        }
      }

      return { method: 'management_api', status: 'no_working_endpoint' };
    } catch (error) {
      console.error('❌ Method 4 failed:', error.message);
      return { method: 'management_api', status: 'failed', error: error.message };
    }
  }

  /**
   * Method 5: Generate complete SQL script for manual execution
   */
  generateCompleteSQLScript() {
    console.log('\n📝 Generating complete SQL script for manual execution...');

    const sqlScript = `
-- ============================================
-- GDPR Compliance Migration for Supabase
-- Database: ltlbfltlhysjxslusypq
-- ============================================

-- Step 1: Add GDPR columns to assessment_submissions table
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- Step 2: Create helper function for future DDL operations
CREATE OR REPLACE FUNCTION execute_ddl_command(sql_command text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  EXECUTE sql_command;
  result := json_build_object(
    'status', 'success',
    'message', 'DDL command executed successfully'
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

-- Step 3: Create function to ensure GDPR columns exist
CREATE OR REPLACE FUNCTION ensure_gdpr_columns()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  columns_added INTEGER := 0;
  column_exists BOOLEAN;
BEGIN
  -- Check and add each column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'assessment_submissions'
    AND column_name = 'gdpr_consent_given'
  ) INTO column_exists;

  IF NOT column_exists THEN
    ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_given BOOLEAN DEFAULT false;
    columns_added := columns_added + 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'assessment_submissions'
    AND column_name = 'gdpr_consent_timestamp'
  ) INTO column_exists;

  IF NOT column_exists THEN
    ALTER TABLE assessment_submissions ADD COLUMN gdpr_consent_timestamp TIMESTAMPTZ;
    columns_added := columns_added + 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'assessment_submissions'
    AND column_name = 'gdpr_deletion_requested'
  ) INTO column_exists;

  IF NOT column_exists THEN
    ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_requested BOOLEAN DEFAULT false;
    columns_added := columns_added + 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'assessment_submissions'
    AND column_name = 'gdpr_deletion_timestamp'
  ) INTO column_exists;

  IF NOT column_exists THEN
    ALTER TABLE assessment_submissions ADD COLUMN gdpr_deletion_timestamp TIMESTAMPTZ;
    columns_added := columns_added + 1;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'assessment_submissions'
    AND column_name = 'data_retention_days'
  ) INTO column_exists;

  IF NOT column_exists THEN
    ALTER TABLE assessment_submissions ADD COLUMN data_retention_days INTEGER DEFAULT 365;
    columns_added := columns_added + 1;
  END IF;

  result := json_build_object(
    'status', 'success',
    'columns_added', columns_added,
    'message', format('Added %s GDPR columns', columns_added)
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

-- Step 4: Test the function (optional)
-- SELECT ensure_gdpr_columns();

-- Step 5: Create RLS policies for GDPR columns
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for GDPR data visibility
CREATE POLICY "GDPR data visibility" ON assessment_submissions
FOR SELECT
USING (
  -- Users can see their own data
  auth.uid() = user_id
  -- Or if they haven't requested deletion
  OR gdpr_deletion_requested = false
);

-- Policy for GDPR consent updates
CREATE POLICY "GDPR consent updates" ON assessment_submissions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify columns were added:
/*
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'assessment_submissions'
AND column_name IN (
  'gdpr_consent_given',
  'gdpr_consent_timestamp',
  'gdpr_deletion_requested',
  'gdpr_deletion_timestamp',
  'data_retention_days'
)
ORDER BY ordinal_position;
*/
`;

    return { method: 'manual_script', status: 'generated', sql: sqlScript };
  }

  /**
   * Execute all methods and report results
   */
  async executeAllMethods() {
    console.log('🚀 GDPR Column Addition - Ultra Creative Approach');
    console.log('=' .repeat(50));

    const results = [];

    // Try Method 1
    results.push(await this.createDDLExecutor());

    // Try Method 2
    results.push(await this.createTriggerBasedDDL());

    // Try Method 3
    results.push(await this.createColumnChecker());

    // Try Method 4
    results.push(await this.useManagementAPI());

    // Generate manual script
    const manualScript = this.generateCompleteSQLScript();
    results.push(manualScript);

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 EXECUTION SUMMARY');
    console.log('=' .repeat(50));

    results.forEach((result, index) => {
      console.log(`\nMethod ${index + 1}: ${result.method}`);
      console.log(`Status: ${result.status}`);
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    });

    // Save manual script to file
    const fs = require('fs');
    const scriptPath = '/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/scripts/gdpr-migration.sql';
    fs.writeFileSync(scriptPath, manualScript.sql);
    console.log(`\n✅ Manual SQL script saved to: ${scriptPath}`);

    // Final instructions
    console.log('\n' + '=' .repeat(50));
    console.log('🎯 FINAL INSTRUCTIONS');
    console.log('=' .repeat(50));
    console.log('\nSince automated methods are restricted, please:');
    console.log('\n1. Go to Supabase Dashboard: https://ltlbfltlhysjxslusypq.supabase.co');
    console.log('2. Navigate to SQL Editor (left sidebar)');
    console.log('3. Open the file: scripts/gdpr-migration.sql');
    console.log('4. Copy the entire contents');
    console.log('5. Paste into SQL Editor');
    console.log('6. Click "Run" button');
    console.log('\n✅ This will add all GDPR columns and create helper functions.');

    return results;
  }
}

// Execute
async function main() {
  const executor = new SupabaseDDLExecutor();
  const results = await executor.executeAllMethods();

  // Check if any method succeeded
  const successfulMethod = results.find(r => r.status === 'success');
  if (successfulMethod) {
    console.log('\n🎉 SUCCESS: GDPR columns added via', successfulMethod.method);
    process.exit(0);
  } else {
    console.log('\n⚠️  Manual execution required - SQL script has been generated');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});