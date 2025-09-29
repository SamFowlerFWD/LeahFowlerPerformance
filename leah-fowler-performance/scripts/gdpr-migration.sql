
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
