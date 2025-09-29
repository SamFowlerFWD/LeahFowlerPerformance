-- Check current database schema
-- This script inspects the current state of the database tables

-- Check if assessment_submissions table exists and its structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'assessment_submissions'
ORDER BY ordinal_position;

-- Check existing functions
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('validate_email', 'check_rate_limit', 'anonymize_assessment_submission', 'anonymize_user_data');

-- Check existing indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('assessment_submissions', 'posts', 'gdpr_verification_requests', 'api_rate_limits');

-- Check existing RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('assessment_submissions', 'gdpr_verification_requests', 'api_rate_limits');

-- Check security_audit_log structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'security_audit_log'
ORDER BY ordinal_position;