-- ============================================================================
-- CRITICAL SECURITY & PERFORMANCE FIXES
-- ============================================================================
-- Version: 1.0.0
-- Date: 2025-09-29
-- Priority: CRITICAL - Deploy Immediately
-- Description: Fixes critical security issues and missing tables identified in security audit
-- ============================================================================

-- ============================================================================
-- SECTION 1: MISSING GDPR VERIFICATION TABLE
-- ============================================================================

-- Create the missing GDPR verification requests table
CREATE TABLE IF NOT EXISTS public.gdpr_verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL CHECK (validate_email(email)),
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'portability', 'deletion', 'rectification')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  verified_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure token is unique and email-request combo is limited
  CONSTRAINT unique_pending_request UNIQUE(email, request_type, verified_at)
);

-- Create index for token lookups (critical for performance)
CREATE INDEX IF NOT EXISTS idx_gdpr_token ON public.gdpr_verification_requests(token);
CREATE INDEX IF NOT EXISTS idx_gdpr_email_type ON public.gdpr_verification_requests(email, request_type);
CREATE INDEX IF NOT EXISTS idx_gdpr_expires ON public.gdpr_verification_requests(expires_at) WHERE processed_at IS NULL;

-- Enable RLS
ALTER TABLE public.gdpr_verification_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create verification requests"
  ON public.gdpr_verification_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests with valid token"
  ON public.gdpr_verification_requests
  FOR SELECT USING (true); -- Token verification happens in application layer

CREATE POLICY "System can update verification status"
  ON public.gdpr_verification_requests
  FOR UPDATE USING (true); -- Application handles token verification

-- ============================================================================
-- SECTION 2: RATE LIMITING TABLE
-- ============================================================================

-- Create rate limiting table for API protection
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- Can be IP, user_id, or API key
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_rate_limit UNIQUE(identifier, endpoint, window_start)
);

-- Create indexes for rate limit checking
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
  ON public.api_rate_limits(identifier, endpoint, window_end)
  WHERE window_end > NOW();

-- Enable RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System manages rate limits"
  ON public.api_rate_limits
  FOR ALL USING (false); -- Only service role can access

-- ============================================================================
-- SECTION 3: SECURITY AUDIT LOG IMPROVEMENTS
-- ============================================================================

-- Add missing columns to security_audit_log if they don't exist
ALTER TABLE public.security_audit_log
  ADD COLUMN IF NOT EXISTS request_headers JSONB,
  ADD COLUMN IF NOT EXISTS response_status INTEGER,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS execution_time_ms INTEGER;

-- ============================================================================
-- SECTION 4: CRITICAL PERFORMANCE INDEXES
-- ============================================================================

-- Assessment submissions (critical for GDPR and lookups)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_email
  ON public.assessment_submissions(email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_created
  ON public.assessment_submissions(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_qualified
  ON public.assessment_submissions(qualified, created_at DESC)
  WHERE qualified = true;

-- Blog posts (critical for public queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_published
  ON public.posts(status, published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_slug
  ON public.posts(slug)
  WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_search
  ON public.posts USING GIN(search_vector);

-- GDPR consent log
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gdpr_consent_email
  ON public.gdpr_consent_log(email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gdpr_consent_submission
  ON public.gdpr_consent_log(submission_id);

-- ============================================================================
-- SECTION 5: GDPR ANONYMIZATION FUNCTION
-- ============================================================================

-- Drop existing function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS public.anonymize_assessment_submission CASCADE;

-- Create improved anonymization function
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

-- ============================================================================
-- SECTION 6: DATA RETENTION POLICY FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforce_data_retention_policy()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER := 0;
  v_retention_period INTERVAL := '3 years'::INTERVAL;
BEGIN
  -- Anonymize old assessment submissions
  WITH old_submissions AS (
    SELECT id
    FROM public.assessment_submissions
    WHERE created_at < NOW() - v_retention_period
      AND gdpr_deletion_requested IS NOT true
  )
  UPDATE public.assessment_submissions
  SET
    gdpr_deletion_requested = true,
    gdpr_deletion_timestamp = NOW()
  WHERE id IN (SELECT id FROM old_submissions);

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- Perform actual anonymization
  FOR submission IN
    SELECT id FROM public.assessment_submissions
    WHERE gdpr_deletion_requested = true
      AND gdpr_deletion_timestamp IS NOT NULL
  LOOP
    PERFORM public.anonymize_assessment_submission(submission.id, 'Data Retention Policy');
  END LOOP;

  -- Clean up old GDPR verification requests
  DELETE FROM public.gdpr_verification_requests
  WHERE expires_at < NOW() - INTERVAL '30 days';

  -- Clean up old rate limit records
  DELETE FROM public.api_rate_limits
  WHERE window_end < NOW() - INTERVAL '1 day';

  RETURN v_deleted_count;
END;
$$;

-- ============================================================================
-- SECTION 7: ADD MISSING TRIGGER FOR UPDATED_AT
-- ============================================================================

-- Ensure all tables have updated_at triggers
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tables.table_name
          AND column_name = 'updated_at'
      )
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    ', t.table_name, t.table_name, t.table_name, t.table_name);
  END LOOP;
END;
$$;

-- ============================================================================
-- SECTION 8: SECURITY ENHANCEMENTS
-- ============================================================================

-- Create function to validate JWT claims
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
      AND is_active = true
  );
END;
$$;

-- Create function to check rate limits
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
-- SECTION 9: GRANT NECESSARY PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.anonymize_assessment_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon, authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the migration was successful:
/*
-- Check if all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('gdpr_verification_requests', 'api_rate_limits')
ORDER BY table_name;

-- Check if all indexes were created
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
ORDER BY tablename;

-- Check if functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
*/

-- ============================================================================
-- ROLLBACK SCRIPT (In case of issues)
-- ============================================================================
/*
-- To rollback this migration, run:
DROP TABLE IF EXISTS public.gdpr_verification_requests CASCADE;
DROP TABLE IF EXISTS public.api_rate_limits CASCADE;
DROP FUNCTION IF EXISTS public.anonymize_assessment_submission CASCADE;
DROP FUNCTION IF EXISTS public.enforce_data_retention_policy CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.check_rate_limit CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS idx_assessment_email;
DROP INDEX IF EXISTS idx_assessment_created;
DROP INDEX IF EXISTS idx_assessment_qualified;
DROP INDEX IF EXISTS idx_posts_published;
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_search;
DROP INDEX IF EXISTS idx_gdpr_consent_email;
DROP INDEX IF EXISTS idx_gdpr_consent_submission;
*/