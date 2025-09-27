-- ============================================================================
-- MIGRATION VERIFICATION SCRIPT FOR LEAH FOWLER PERFORMANCE COACH
-- ============================================================================
-- Version: 1.0.0
-- Date: 2025-09-27
-- Description: Comprehensive verification queries to validate migration success
--
-- Run these queries after migration to ensure everything is working correctly
-- ============================================================================

-- ============================================================================
-- SECTION 1: TABLE VERIFICATION
-- ============================================================================

-- Check all tables were created successfully
SELECT
  'Tables Created' as check_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE table_name IN (
    'admin_roles', 'admin_users', 'user_profiles', 'assessment_submissions',
    'gdpr_consent_log', 'assessment_admin_log', 'pricing_tiers', 'subscriptions',
    'payment_methods', 'invoices', 'webhook_events', 'coaching_applications',
    'coaching_sessions', 'performance_metrics', 'categories', 'tags', 'authors',
    'posts', 'post_tags', 'lead_magnets', 'lead_magnet_downloads',
    'performance_barriers', 'programme_recommendations', 'client_success_metrics',
    'testimonials', 'email_campaigns', 'email_subscribers', 'engagement_tracking',
    'analytics_events', 'wearable_connections', 'wearable_data',
    'calendar_integrations', 'rate_limits', 'security_audit_log'
  )) as expected_tables,
  CASE
    WHEN COUNT(*) >= 35 THEN '✅ PASS'
    ELSE '❌ FAIL - Missing tables'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- List any missing tables
WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'admin_roles', 'admin_users', 'user_profiles', 'assessment_submissions',
    'gdpr_consent_log', 'assessment_admin_log', 'pricing_tiers', 'subscriptions',
    'payment_methods', 'invoices', 'webhook_events', 'coaching_applications',
    'coaching_sessions', 'performance_metrics', 'categories', 'tags', 'authors',
    'posts', 'post_tags', 'lead_magnets', 'lead_magnet_downloads',
    'performance_barriers', 'programme_recommendations', 'client_success_metrics',
    'testimonials', 'email_campaigns', 'email_subscribers', 'engagement_tracking',
    'analytics_events', 'wearable_connections', 'wearable_data',
    'calendar_integrations', 'rate_limits', 'security_audit_log'
  ]) as table_name
)
SELECT
  'Missing Tables' as check_type,
  et.table_name
FROM expected_tables et
LEFT JOIN information_schema.tables t
  ON t.table_name = et.table_name
  AND t.table_schema = 'public'
WHERE t.table_name IS NULL;

-- ============================================================================
-- SECTION 2: ROW LEVEL SECURITY VERIFICATION
-- ============================================================================

-- Check RLS is enabled on all tables
SELECT
  'RLS Enabled' as check_type,
  tablename,
  rowsecurity,
  CASE
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled - SECURITY RISK!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN ('schema_migrations') -- Exclude migration tracking tables
ORDER BY
  CASE WHEN rowsecurity = false THEN 0 ELSE 1 END,
  tablename;

-- Count RLS policies per table
SELECT
  'RLS Policies' as check_type,
  tablename,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policies,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '⚠️ No policies defined'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC, tablename;

-- ============================================================================
-- SECTION 3: INDEX VERIFICATION
-- ============================================================================

-- Check critical indexes exist
SELECT
  'Critical Indexes' as check_type,
  tablename,
  COUNT(*) as index_count,
  string_agg(indexname, ', ') as indexes
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
  'assessment_submissions', 'subscriptions', 'coaching_sessions',
  'performance_metrics', 'posts', 'email_subscribers', 'analytics_events'
)
GROUP BY tablename
ORDER BY tablename;

-- Check for missing foreign key indexes
SELECT
  'Missing FK Indexes' as check_type,
  tc.table_name,
  kcu.column_name,
  '⚠️ Missing index on foreign key' as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN pg_indexes pi
  ON pi.schemaname = tc.table_schema
  AND pi.tablename = tc.table_name
  AND pi.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND pi.indexname IS NULL;

-- ============================================================================
-- SECTION 4: FUNCTION VERIFICATION
-- ============================================================================

-- Check all required functions exist
SELECT
  'Functions' as check_type,
  routine_name,
  routine_type,
  CASE
    WHEN routine_name IN (
      'update_updated_at_column', 'validate_email', 'validate_uk_phone',
      'anonymize_assessment_submission', 'get_assessment_statistics',
      'get_programme_recommendation', 'get_live_success_metrics',
      'calculate_related_posts', 'get_user_progress_summary',
      'calculate_client_ltv', 'calculate_lead_score',
      'export_user_data', 'delete_user_data'
    ) THEN '✅ Core function'
    ELSE '📝 Additional function'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================================================
-- SECTION 5: TRIGGER VERIFICATION
-- ============================================================================

-- Check updated_at triggers
SELECT
  'Updated_at Triggers' as check_type,
  event_object_table as table_name,
  trigger_name,
  CASE
    WHEN action_timing = 'BEFORE' AND event_manipulation = 'UPDATE' THEN '✅ Correct'
    ELSE '⚠️ Check configuration'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================================================
-- SECTION 6: DATA VERIFICATION
-- ============================================================================

-- Check default data was inserted
SELECT
  'Default Data' as check_type,
  'Pricing Tiers' as data_type,
  COUNT(*) as count,
  string_agg(tier, ', ') as items,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ All tiers present'
    ELSE '❌ Missing tiers'
  END as status
FROM public.pricing_tiers

UNION ALL

SELECT
  'Default Data',
  'Blog Categories',
  COUNT(*),
  string_agg(name, ', ' ORDER BY position),
  CASE
    WHEN COUNT(*) >= 5 THEN '✅ Categories present'
    ELSE '⚠️ Check categories'
  END
FROM public.categories

UNION ALL

SELECT
  'Default Data',
  'Admin Roles',
  COUNT(*),
  string_agg(role_name, ', '),
  CASE
    WHEN COUNT(*) = 5 THEN '✅ All roles present'
    ELSE '❌ Missing roles'
  END
FROM public.admin_roles

UNION ALL

SELECT
  'Default Data',
  'Lead Magnets',
  COUNT(*),
  string_agg(title, ', '),
  CASE
    WHEN COUNT(*) >= 3 THEN '✅ Lead magnets present'
    ELSE '⚠️ Check lead magnets'
  END
FROM public.lead_magnets;

-- ============================================================================
-- SECTION 7: CONSTRAINT VERIFICATION
-- ============================================================================

-- Check important constraints
SELECT
  'Constraints' as check_type,
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name,
  CASE
    WHEN tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'UNIQUE') THEN '✅'
    ELSE '📝'
  END as status
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('user_profiles', 'assessment_submissions', 'subscriptions', 'coaching_sessions')
ORDER BY tc.table_name, tc.constraint_type;

-- ============================================================================
-- SECTION 8: STORAGE VERIFICATION
-- ============================================================================

-- Check storage buckets
SELECT
  'Storage Buckets' as check_type,
  id as bucket_name,
  public as is_public,
  ROUND(file_size_limit / 1048576.0, 0) || ' MB' as size_limit,
  array_length(allowed_mime_types, 1) || ' types' as mime_types,
  CASE
    WHEN id IN ('avatars', 'lead-magnets', 'blog-images', 'coaching-resources', 'exports') THEN '✅ Core bucket'
    ELSE '📝 Additional bucket'
  END as status
FROM storage.buckets
ORDER BY id;

-- Check storage policies
SELECT
  'Storage Policies' as check_type,
  bucket_id,
  action,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '⚠️ No policies'
  END as status
FROM storage.policies
GROUP BY bucket_id, action
ORDER BY bucket_id, action;

-- ============================================================================
-- SECTION 9: PERFORMANCE CHECKS
-- ============================================================================

-- Table sizes and row counts
SELECT
  'Table Sizes' as check_type,
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  n_live_tup as row_count,
  n_dead_tup as dead_rows,
  CASE
    WHEN n_dead_tup > n_live_tup * 0.2 THEN '⚠️ Needs VACUUM'
    ELSE '✅ Healthy'
  END as health_status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Check for slow queries (if pg_stat_statements is enabled)
-- Uncomment if extension is available
/*
SELECT
  'Slow Queries' as check_type,
  substring(query, 1, 50) || '...' as query_start,
  calls,
  ROUND(mean_exec_time::numeric, 2) as avg_ms,
  ROUND(max_exec_time::numeric, 2) as max_ms,
  CASE
    WHEN mean_exec_time > 1000 THEN '❌ Very slow'
    WHEN mean_exec_time > 100 THEN '⚠️ Slow'
    ELSE '✅ Fast'
  END as performance
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
AND mean_exec_time > 50
ORDER BY mean_exec_time DESC
LIMIT 10;
*/

-- ============================================================================
-- SECTION 10: SECURITY AUDIT
-- ============================================================================

-- Check for tables without RLS
SELECT
  'Security Audit' as check_type,
  'Tables without RLS' as issue,
  tablename,
  '❌ SECURITY RISK - Enable RLS' as recommendation
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
AND tablename NOT IN ('schema_migrations')

UNION ALL

-- Check for overly permissive policies
SELECT
  'Security Audit',
  'Permissive Policies',
  tablename || ': ' || policyname,
  CASE
    WHEN qual = 'true' THEN '⚠️ Review - Very permissive'
    ELSE '✅ Has conditions'
  END
FROM pg_policies
WHERE schemaname = 'public'
AND (qual = 'true' OR qual IS NULL)
AND cmd = 'SELECT';

-- ============================================================================
-- SECTION 11: MIGRATION SUMMARY
-- ============================================================================

WITH summary AS (
  SELECT
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as index_count,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as function_count,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as trigger_count,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as policy_count,
    (SELECT COUNT(*) FROM storage.buckets) as bucket_count
)
SELECT
  '=' as "=",
  'MIGRATION SUMMARY' as "=",
  '=' as "="
FROM generate_series(1, 50)

UNION ALL

SELECT
  '',
  'Tables: ' || table_count,
  CASE WHEN table_count >= 35 THEN '✅' ELSE '❌' END
FROM summary

UNION ALL

SELECT
  '',
  'Indexes: ' || index_count,
  CASE WHEN index_count >= 50 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Functions: ' || function_count,
  CASE WHEN function_count >= 10 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Triggers: ' || trigger_count,
  CASE WHEN trigger_count >= 20 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'RLS Policies: ' || policy_count,
  CASE WHEN policy_count >= 30 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Storage Buckets: ' || bucket_count,
  CASE WHEN bucket_count >= 5 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '=',
  '=================',
  '='
FROM generate_series(1, 1);

-- ============================================================================
-- SECTION 12: CRITICAL ISSUES CHECK
-- ============================================================================

-- This query will return rows ONLY if there are critical issues
SELECT
  '🚨 CRITICAL ISSUE' as severity,
  issue_type,
  details,
  action_required
FROM (
  -- Check for tables without primary keys
  SELECT
    'Missing Primary Key' as issue_type,
    t.table_name as details,
    'Add primary key immediately' as action_required
  FROM information_schema.tables t
  LEFT JOIN information_schema.table_constraints tc
    ON t.table_name = tc.table_name
    AND tc.constraint_type = 'PRIMARY KEY'
  WHERE t.table_schema = 'public'
  AND tc.constraint_name IS NULL

  UNION ALL

  -- Check for missing critical functions
  SELECT
    'Missing Critical Function',
    'update_updated_at_column',
    'Re-run migration - function is required'
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'update_updated_at_column'
  )

  UNION ALL

  -- Check for disabled RLS on sensitive tables
  SELECT
    'RLS Disabled on Sensitive Table',
    tablename,
    'Enable RLS immediately for security'
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename IN (
    'user_profiles', 'assessment_submissions', 'subscriptions',
    'payment_methods', 'invoices', 'coaching_sessions'
  )
) critical_issues;

-- ============================================================================
-- END OF VERIFICATION SCRIPT
-- ============================================================================

-- If all checks pass, you should see:
-- ✅ 35+ tables created
-- ✅ RLS enabled on all tables
-- ✅ Policies defined for all tables
-- ✅ All critical indexes present
-- ✅ All required functions created
-- ✅ All triggers configured
-- ✅ Default data inserted
-- ✅ Storage buckets configured

-- If you see any ❌ or ⚠️ symbols, investigate and fix the issues before proceeding.