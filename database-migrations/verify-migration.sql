-- =====================================================
-- MIGRATION VERIFICATION SCRIPT
-- Leah Fowler Performance Database
-- Run this after executing the migration to verify all changes
-- =====================================================

-- Clear previous results
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION VERIFICATION STARTING';
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- 1. CHECK GDPR COLUMNS IN ASSESSMENT_SUBMISSIONS
-- =====================================================
WITH gdpr_columns AS (
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'assessment_submissions'
    AND column_name IN (
        'gdpr_consent_given',
        'gdpr_consent_timestamp',
        'gdpr_deletion_requested',
        'gdpr_deletion_timestamp',
        'data_retention_days'
    )
)
SELECT
    'GDPR Columns Check' as verification_item,
    CASE
        WHEN COUNT(*) = 5 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected 5, Found ' || COUNT(*)
    END as status,
    COUNT(*) as columns_found,
    5 as expected,
    string_agg(column_name, ', ') as columns_list
FROM gdpr_columns;

-- =====================================================
-- 2. CHECK DATABASE FUNCTIONS EXIST
-- =====================================================
WITH functions_check AS (
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN (
        'validate_email',
        'check_rate_limit',
        'anonymize_assessment_submission',
        'anonymize_user_data',
        'export_user_data',
        'cleanup_expired_data',
        'set_gdpr_consent_timestamp'
    )
)
SELECT
    'Database Functions Check' as verification_item,
    CASE
        WHEN COUNT(*) >= 6 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected at least 6, Found ' || COUNT(*)
    END as status,
    COUNT(*) as functions_found,
    6 as min_expected,
    string_agg(routine_name, ', ') as functions_list
FROM functions_check;

-- =====================================================
-- 3. CHECK PERFORMANCE INDEXES EXIST
-- =====================================================
WITH indexes_check AS (
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname IN (
        'idx_assessment_email',
        'idx_posts_status_published',
        'idx_gdpr_token',
        'idx_rate_limit_lookup',
        'idx_assessment_gdpr_deletion',
        'idx_assessment_created'
    )
)
SELECT
    'Performance Indexes Check' as verification_item,
    CASE
        WHEN COUNT(*) >= 4 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected at least 4, Found ' || COUNT(*)
    END as status,
    COUNT(*) as indexes_found,
    4 as min_expected,
    string_agg(indexname, ', ') as indexes_list
FROM indexes_check;

-- =====================================================
-- 4. CHECK RLS POLICIES
-- =====================================================
WITH rls_check AS (
    SELECT
        tablename,
        COUNT(*) as policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('assessment_submissions', 'gdpr_verification_requests', 'api_rate_limits')
    GROUP BY tablename
)
SELECT
    'RLS Policies Check - ' || tablename as verification_item,
    CASE
        WHEN policy_count > 0 THEN '✅ PASS'
        ELSE '❌ FAIL - No policies found'
    END as status,
    policy_count as policies_found,
    'At least 1' as expected,
    tablename as table_name
FROM rls_check
ORDER BY tablename;

-- =====================================================
-- 5. CHECK SECURITY AUDIT LOG COLUMNS
-- =====================================================
WITH audit_columns AS (
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'security_audit_log'
    AND column_name IN (
        'request_headers',
        'response_status',
        'error_message',
        'execution_time_ms'
    )
)
SELECT
    'Security Audit Columns Check' as verification_item,
    CASE
        WHEN COUNT(*) = 4 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected 4, Found ' || COUNT(*)
    END as status,
    COUNT(*) as columns_found,
    4 as expected,
    string_agg(column_name, ', ') as columns_list
FROM audit_columns;

-- =====================================================
-- 6. TEST EMAIL VALIDATION FUNCTION
-- =====================================================
SELECT
    'Email Validation Function Test' as verification_item,
    CASE
        WHEN validate_email('test@example.com') = true
        AND validate_email('invalid-email') = false
        AND validate_email('user@domain.co.uk') = true
        AND validate_email('') = false
        AND validate_email(NULL) = false
        THEN '✅ PASS - All tests passed'
        ELSE '❌ FAIL - Function not working correctly'
    END as status,
    validate_email('test@example.com') as valid_email_test,
    validate_email('invalid-email') as invalid_email_test,
    'Should be true/false respectively' as expected;

-- =====================================================
-- 7. CHECK TRIGGERS
-- =====================================================
WITH triggers_check AS (
    SELECT
        trigger_name,
        event_object_table
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    AND trigger_name = 'trg_set_gdpr_consent_timestamp'
)
SELECT
    'GDPR Consent Trigger Check' as verification_item,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL - Trigger not found'
    END as status,
    COUNT(*) as triggers_found,
    1 as expected,
    string_agg(trigger_name, ', ') as trigger_list
FROM triggers_check;

-- =====================================================
-- 8. TEST RATE LIMIT FUNCTION (Basic Test)
-- =====================================================
DO $$
DECLARE
    test_result BOOLEAN;
BEGIN
    -- Clean up any test data first
    DELETE FROM api_rate_limits WHERE identifier = 'verification-test';

    -- Test rate limiting
    test_result := check_rate_limit('verification-test', '/api/verify', 3, 1);

    IF test_result = true THEN
        RAISE NOTICE 'Rate Limit Function: ✅ PASS - Function exists and works';
    ELSE
        RAISE NOTICE 'Rate Limit Function: ⚠️ WARNING - Function exists but returned unexpected result';
    END IF;

    -- Clean up test data
    DELETE FROM api_rate_limits WHERE identifier = 'verification-test';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Rate Limit Function: ❌ FAIL - Error: %', SQLERRM;
END $$;

-- =====================================================
-- 9. CHECK RLS IS ENABLED ON CRITICAL TABLES
-- =====================================================
WITH rls_enabled AS (
    SELECT
        schemaname,
        tablename,
        rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
        'assessment_submissions',
        'gdpr_verification_requests',
        'api_rate_limits',
        'security_audit_log'
    )
)
SELECT
    'RLS Enabled Check - ' || tablename as verification_item,
    CASE
        WHEN rowsecurity = true THEN '✅ PASS - RLS Enabled'
        WHEN rowsecurity = false THEN '⚠️ WARNING - RLS Not Enabled'
        ELSE '❓ UNKNOWN'
    END as status,
    rowsecurity as rls_enabled,
    true as expected,
    tablename as table_name
FROM rls_enabled
ORDER BY tablename;

-- =====================================================
-- SUMMARY REPORT
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION VERIFICATION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Please review the results above.';
    RAISE NOTICE 'All items should show ✅ PASS status.';
    RAISE NOTICE '';
    RAISE NOTICE 'If any items show ❌ FAIL:';
    RAISE NOTICE '1. Re-run the main migration script';
    RAISE NOTICE '2. Check for any error messages';
    RAISE NOTICE '3. Verify you have the correct permissions';
    RAISE NOTICE '';
    RAISE NOTICE 'Timestamp: %', NOW();
    RAISE NOTICE '========================================';
END $$;

-- Final check query - counts summary
SELECT
    'OVERALL MIGRATION STATUS' as check_type,
    CASE
        WHEN (
            -- Check for GDPR columns
            (SELECT COUNT(*) FROM information_schema.columns
             WHERE table_name = 'assessment_submissions'
             AND column_name LIKE 'gdpr%') >= 5
            AND
            -- Check for functions
            (SELECT COUNT(*) FROM information_schema.routines
             WHERE routine_schema = 'public'
             AND routine_name IN ('validate_email', 'check_rate_limit', 'anonymize_user_data')) >= 3
            AND
            -- Check for indexes
            (SELECT COUNT(*) FROM pg_indexes
             WHERE schemaname = 'public'
             AND indexname LIKE 'idx_%') >= 4
        )
        THEN '✅ MIGRATION SUCCESSFUL'
        ELSE '❌ MIGRATION INCOMPLETE - Review detailed results above'
    END as status,
    NOW() as verified_at;