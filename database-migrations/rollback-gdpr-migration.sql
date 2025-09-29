-- =====================================================
-- ROLLBACK SCRIPT FOR GDPR MIGRATION
-- Leah Fowler Performance Database
-- USE ONLY IF MIGRATION CAUSES ISSUES
-- =====================================================

-- WARNING: This will remove all GDPR compliance features!
-- Only use if absolutely necessary and have a plan to re-implement

DO $$
BEGIN
    RAISE WARNING 'STARTING ROLLBACK OF GDPR MIGRATION';
    RAISE WARNING 'This will remove GDPR compliance features!';
END $$;

-- =====================================================
-- 1. DROP TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS trg_set_gdpr_consent_timestamp ON assessment_submissions;

-- =====================================================
-- 2. DROP FUNCTIONS
-- =====================================================
DROP FUNCTION IF EXISTS set_gdpr_consent_timestamp() CASCADE;
DROP FUNCTION IF EXISTS validate_email(TEXT) CASCADE;
DROP FUNCTION IF EXISTS check_rate_limit(TEXT, TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS anonymize_assessment_submission(UUID) CASCADE;
DROP FUNCTION IF EXISTS anonymize_user_data(TEXT) CASCADE;
DROP FUNCTION IF EXISTS export_user_data(TEXT) CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_data() CASCADE;

-- =====================================================
-- 3. DROP INDEXES (Only the ones we added)
-- =====================================================
DROP INDEX IF EXISTS idx_assessment_email;
DROP INDEX IF EXISTS idx_posts_status_published;
DROP INDEX IF EXISTS idx_gdpr_token;
DROP INDEX IF EXISTS idx_rate_limit_lookup;
DROP INDEX IF EXISTS idx_assessment_gdpr_deletion;
DROP INDEX IF EXISTS idx_assessment_created;

-- =====================================================
-- 4. DROP RLS POLICIES
-- =====================================================

-- Drop policies on gdpr_verification_requests
DROP POLICY IF EXISTS "Public can insert GDPR requests" ON gdpr_verification_requests;
DROP POLICY IF EXISTS "Service role full access to GDPR requests" ON gdpr_verification_requests;

-- Drop policies on api_rate_limits
DROP POLICY IF EXISTS "Service role only for rate limits" ON api_rate_limits;

-- Drop policies on assessment_submissions
DROP POLICY IF EXISTS "Public can insert assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Service role full access to assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Users can view own assessments" ON assessment_submissions;

-- =====================================================
-- 5. REMOVE COLUMNS (BE VERY CAREFUL - DATA LOSS!)
-- =====================================================

-- Remove GDPR columns from assessment_submissions
-- WARNING: This will permanently delete any GDPR consent data!
ALTER TABLE assessment_submissions
DROP COLUMN IF EXISTS gdpr_consent_given,
DROP COLUMN IF EXISTS gdpr_consent_timestamp,
DROP COLUMN IF EXISTS gdpr_deletion_requested,
DROP COLUMN IF EXISTS gdpr_deletion_timestamp,
DROP COLUMN IF EXISTS data_retention_days;

-- Remove security audit columns from security_audit_log
ALTER TABLE security_audit_log
DROP COLUMN IF EXISTS request_headers,
DROP COLUMN IF EXISTS response_status,
DROP COLUMN IF EXISTS error_message,
DROP COLUMN IF EXISTS execution_time_ms;

-- =====================================================
-- ROLLBACK COMPLETE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ROLLBACK COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'WARNING: GDPR compliance features have been removed!';
    RAISE NOTICE 'The application may not be compliant with data protection laws.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Fix any issues that caused the rollback';
    RAISE NOTICE '2. Re-run the migration when ready';
    RAISE NOTICE '3. Ensure GDPR compliance is maintained';
    RAISE NOTICE '';
    RAISE NOTICE 'Timestamp: %', NOW();
    RAISE NOTICE '========================================';
END $$;