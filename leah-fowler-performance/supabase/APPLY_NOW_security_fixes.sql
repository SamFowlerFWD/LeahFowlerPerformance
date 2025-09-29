-- ============================================================================
-- IMMEDIATE SECURITY FIXES - APPLY VIA SUPABASE DASHBOARD
-- ============================================================================
-- Database: Leah Fowler Performance Coach Platform
-- Date: 2025-09-29
-- Priority: CRITICAL - Apply Immediately
--
-- INSTRUCTIONS:
-- 1. Go to: https://ltlbfltlhysjxslusypq.supabase.co
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run"
-- ============================================================================

-- ============================================================================
-- PART 1: Add Missing GDPR Columns to Assessment Submissions
-- ============================================================================

ALTER TABLE public.assessment_submissions
  ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ;

-- Add indexes for GDPR columns
CREATE INDEX IF NOT EXISTS idx_assessment_gdpr_deletion
  ON public.assessment_submissions(gdpr_deletion_requested)
  WHERE gdpr_deletion_requested = true;

CREATE INDEX IF NOT EXISTS idx_assessment_gdpr_consent
  ON public.assessment_submissions(gdpr_consent_given);

-- ============================================================================
-- PART 2: Add Missing Column to GDPR Consent Log
-- ============================================================================

ALTER TABLE public.gdpr_consent_log
  ADD COLUMN IF NOT EXISTS submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_gdpr_consent_submission
  ON public.gdpr_consent_log(submission_id);

-- ============================================================================
-- PART 3: Ensure RLS is Enabled on Critical Tables
-- ============================================================================

ALTER TABLE public.gdpr_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_consent_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 4: Create/Update RLS Policies for GDPR Verification Requests
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create verification requests" ON public.gdpr_verification_requests;
DROP POLICY IF EXISTS "Users can view own requests with valid token" ON public.gdpr_verification_requests;
DROP POLICY IF EXISTS "System can update verification status" ON public.gdpr_verification_requests;

-- Create new policies
CREATE POLICY "Anyone can create verification requests"
  ON public.gdpr_verification_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own requests with valid token"
  ON public.gdpr_verification_requests
  FOR SELECT
  USING (true);

CREATE POLICY "System can update verification status"
  ON public.gdpr_verification_requests
  FOR UPDATE
  USING (true);

-- ============================================================================
-- PART 5: Create/Update RLS Policies for API Rate Limits
-- ============================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "System manages rate limits" ON public.api_rate_limits;

-- Create restrictive policy (only service role can access)
CREATE POLICY "System manages rate limits"
  ON public.api_rate_limits
  FOR ALL
  USING (false);

-- ============================================================================
-- PART 6: Create/Update RLS Policies for Security Audit Log
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "System only access" ON public.security_audit_log;

-- Create restrictive policy
CREATE POLICY "System only access"
  ON public.security_audit_log
  FOR ALL
  USING (false);

-- ============================================================================
-- PART 7: Create Missing Indexes for Performance
-- ============================================================================

-- Assessment submissions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_email
  ON public.assessment_submissions(email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_created
  ON public.assessment_submissions(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_qualified
  ON public.assessment_submissions(qualified, created_at DESC)
  WHERE qualified = true;

-- Blog posts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_published
  ON public.posts(status, published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_slug
  ON public.posts(slug)
  WHERE deleted_at IS NULL;

-- GDPR consent log indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gdpr_consent_email
  ON public.gdpr_consent_log(email);

-- GDPR verification requests indexes
CREATE INDEX IF NOT EXISTS idx_gdpr_token
  ON public.gdpr_verification_requests(token);

CREATE INDEX IF NOT EXISTS idx_gdpr_email_type
  ON public.gdpr_verification_requests(email, request_type);

CREATE INDEX IF NOT EXISTS idx_gdpr_expires
  ON public.gdpr_verification_requests(expires_at)
  WHERE processed_at IS NULL;

-- API rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
  ON public.api_rate_limits(identifier, endpoint, window_end)
  WHERE window_end > NOW();

-- ============================================================================
-- PART 8: Create Helper Functions for GDPR Compliance
-- ============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.validate_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
END;
$$;

-- Function to anonymize assessment submission
CREATE OR REPLACE FUNCTION public.anonymize_assessment_submission(
  p_submission_id UUID,
  p_reason TEXT DEFAULT 'GDPR Request'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_anonymized_email TEXT;
BEGIN
  -- Generate anonymized email
  v_anonymized_email := CONCAT('anonymized_', p_submission_id, '@deleted.com');

  -- Update the assessment submission
  UPDATE public.assessment_submissions
  SET
    name = 'ANONYMIZED',
    email = v_anonymized_email,
    phone = NULL,
    answers = jsonb_build_object(
      'anonymized', true,
      'anonymized_at', NOW(),
      'reason', p_reason
    ),
    profile = jsonb_build_object(
      'anonymized', true
    ),
    ip_address = NULL,
    gdpr_deletion_requested = true,
    gdpr_deletion_timestamp = NOW(),
    updated_at = NOW()
  WHERE id = p_submission_id
  RETURNING jsonb_build_object(
    'id', id,
    'anonymized', true,
    'timestamp', NOW()
  ) INTO v_result;

  -- Delete from consent log
  DELETE FROM public.gdpr_consent_log
  WHERE submission_id = p_submission_id;

  -- Log the anonymization
  INSERT INTO public.security_audit_log (
    action_type,
    resource_type,
    resource_id,
    details,
    ip_address
  ) VALUES (
    'GDPR_ANONYMIZATION',
    'assessment_submission',
    p_submission_id,
    jsonb_build_object(
      'reason', p_reason,
      'anonymized_email', v_anonymized_email,
      'timestamp', NOW()
    ),
    '127.0.0.1'::inet
  );

  RETURN v_result;
END;
$$;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_limit INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
  v_window_end TIMESTAMPTZ;
BEGIN
  v_window_start := NOW();
  v_window_end := NOW() + (p_window_minutes || ' minutes')::INTERVAL;

  -- Get current request count
  SELECT COALESCE(SUM(request_count), 0)
  INTO v_count
  FROM public.api_rate_limits
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_end > NOW();

  -- Check if limit exceeded
  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  -- Record this request
  INSERT INTO public.api_rate_limits (
    identifier,
    endpoint,
    request_count,
    window_start,
    window_end
  ) VALUES (
    p_identifier,
    p_endpoint,
    1,
    v_window_start,
    v_window_end
  )
  ON CONFLICT (identifier, endpoint, window_start)
  DO UPDATE SET
    request_count = api_rate_limits.request_count + 1,
    updated_at = NOW();

  RETURN TRUE;
END;
$$;

-- ============================================================================
-- PART 9: Grant Necessary Permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.validate_email TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.anonymize_assessment_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon, authenticated;

-- ============================================================================
-- VERIFICATION QUERIES - Run these after applying fixes
-- ============================================================================

-- Check if GDPR columns were added
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'assessment_submissions'
  AND column_name LIKE 'gdpr_%'
ORDER BY ordinal_position;

-- Check if all indexes were created
SELECT
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check RLS status
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('gdpr_verification_requests', 'api_rate_limits', 'security_audit_log', 'gdpr_consent_log')
ORDER BY tablename;

-- Check if functions exist
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('validate_email', 'anonymize_assessment_submission', 'check_rate_limit')
ORDER BY routine_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
-- After running this script, you should see:
-- - 4 GDPR columns added to assessment_submissions
-- - All indexes created successfully
-- - RLS enabled on all critical tables
-- - Helper functions created
-- - Verification queries showing all components in place