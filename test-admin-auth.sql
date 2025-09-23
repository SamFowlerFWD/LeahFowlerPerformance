-- =====================================================
-- ADMIN AUTHENTICATION SYSTEM TESTING & VERIFICATION
-- =====================================================
-- Run these queries to verify the admin system is working correctly

-- =====================================================
-- 1. CHECK TABLES AND SCHEMA
-- =====================================================

-- Verify all admin tables exist
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('admin_users', 'admin_audit_log', 'admin_sessions')
ORDER BY table_name;

-- Check table structures
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('admin_users', 'admin_audit_log', 'admin_sessions')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 2. CHECK FUNCTIONS
-- =====================================================

-- Verify admin functions exist
SELECT
    proname as function_name,
    pronargs as arg_count,
    prorettype::regtype as return_type
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
    'is_admin',
    'is_super_admin',
    'get_admin_role',
    'log_admin_action',
    'create_admin_user',
    'export_user_data',
    'anonymize_user_data',
    'cleanup_expired_admin_sessions'
)
ORDER BY proname;

-- =====================================================
-- 3. CHECK RLS POLICIES
-- =====================================================

-- Check RLS is enabled on admin tables
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions', 'assessment_submissions', 'posts', 'categories')
ORDER BY tablename;

-- List all admin-related policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND (
    tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions')
    OR policyname LIKE '%admin%'
    OR policyname LIKE '%Admin%'
)
ORDER BY tablename, policyname;

-- =====================================================
-- 4. CHECK ADMIN USERS
-- =====================================================

-- List all admin users
SELECT
    au.id,
    au.email,
    au.role,
    au.is_active,
    au.created_at,
    au.last_login_at,
    au.login_count,
    u.email_confirmed_at,
    u.last_sign_in_at
FROM public.admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at;

-- Check super admin exists
SELECT COUNT(*) as super_admin_count
FROM public.admin_users
WHERE role = 'super_admin' AND is_active = true;

-- =====================================================
-- 5. CHECK INDEXES
-- =====================================================

-- Verify indexes on admin tables
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions')
ORDER BY tablename, indexname;

-- =====================================================
-- 6. TEST ADMIN FUNCTIONS
-- =====================================================

-- Test with a known admin email (replace with actual admin email)
DO $$
DECLARE
    v_user_id UUID;
    v_is_admin BOOLEAN;
    v_is_super BOOLEAN;
    v_role TEXT;
BEGIN
    -- Get user ID for testing
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'leah@strengthpt.co.uk'
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Test admin check functions
        v_is_admin := public.is_admin(v_user_id);
        v_is_super := public.is_super_admin(v_user_id);
        v_role := public.get_admin_role(v_user_id);

        RAISE NOTICE 'User ID: %', v_user_id;
        RAISE NOTICE 'Is Admin: %', v_is_admin;
        RAISE NOTICE 'Is Super Admin: %', v_is_super;
        RAISE NOTICE 'Admin Role: %', v_role;
    ELSE
        RAISE NOTICE 'Test user not found';
    END IF;
END $$;

-- =====================================================
-- 7. CHECK AUDIT LOG
-- =====================================================

-- View recent audit log entries
SELECT
    id,
    user_email,
    action_type,
    resource_type,
    resource_id,
    status,
    performed_at
FROM public.admin_audit_log
ORDER BY performed_at DESC
LIMIT 10;

-- Count audit logs by action type
SELECT
    action_type,
    COUNT(*) as action_count
FROM public.admin_audit_log
GROUP BY action_type
ORDER BY action_count DESC;

-- =====================================================
-- 8. CHECK PERMISSIONS ON OTHER TABLES
-- =====================================================

-- Check if admin policies exist on content tables
SELECT
    tablename,
    COUNT(*) as policy_count,
    string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
AND policyname LIKE '%admin%'
AND tablename IN (
    'posts',
    'categories',
    'tags',
    'assessment_submissions',
    'lead_magnets',
    'profiles',
    'performance_goals',
    'assessment_results',
    'programme_enrollments'
)
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- 9. PERFORMANCE CHECKS
-- =====================================================

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions')
ORDER BY tablename;

-- Check for any performance issues with admin queries
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM public.admin_users
WHERE is_active = true;

-- =====================================================
-- 10. SECURITY VERIFICATION
-- =====================================================

-- Check for any public access to admin tables (should return no rows)
SELECT
    tablename,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'anon'
AND table_schema = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions')
AND privilege_type != 'SELECT';

-- Verify RLS is enforced
SELECT
    tablename,
    rowsecurity,
    (rowsecurity = true) as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions')
AND rowsecurity != true;

-- =====================================================
-- 11. CLEANUP CHECKS
-- =====================================================

-- Check for expired sessions that need cleanup
SELECT COUNT(*) as expired_sessions
FROM public.admin_sessions
WHERE expires_at < NOW() AND is_active = true;

-- Run session cleanup (if needed)
SELECT public.cleanup_expired_admin_sessions() as cleaned_sessions;

-- =====================================================
-- 12. SUMMARY REPORT
-- =====================================================

SELECT
    'Admin System Status Report' as report_title,
    NOW() as report_generated_at,
    (SELECT COUNT(*) FROM public.admin_users WHERE is_active = true) as active_admins,
    (SELECT COUNT(*) FROM public.admin_users WHERE role = 'super_admin' AND is_active = true) as super_admins,
    (SELECT COUNT(*) FROM public.admin_audit_log) as total_audit_logs,
    (SELECT COUNT(*) FROM public.admin_sessions WHERE is_active = true) as active_sessions,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%admin%') as admin_policies,
    (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname LIKE '%admin%') as admin_functions;