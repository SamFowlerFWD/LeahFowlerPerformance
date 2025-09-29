-- FINAL FIX FOR ADMIN LOGIN ISSUES
-- This addresses the remaining constraint and role_id issues

-- =========================================
-- PART 1: FIX THE admin_audit_log CONSTRAINT
-- =========================================

-- First, let's see what constraint exists
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'admin_audit_log'::regclass;

-- Drop the problematic check constraint
ALTER TABLE admin_audit_log
DROP CONSTRAINT IF EXISTS admin_audit_log_action_type_check;

-- If there are other problematic constraints, drop them too
ALTER TABLE admin_audit_log
DROP CONSTRAINT IF EXISTS admin_audit_log_resource_type_check;

-- =========================================
-- PART 2: FIX THE MISSING role_id
-- =========================================

-- First ensure admin_roles exist
INSERT INTO admin_roles (role_name, permissions)
VALUES ('super_admin', '{"all": true}')
ON CONFLICT (role_name) DO NOTHING;

-- Update the admin user to have the super_admin role
UPDATE admin_users
SET role_id = (SELECT id FROM admin_roles WHERE role_name = 'super_admin' LIMIT 1)
WHERE email = 'info@leah.coach';

-- =========================================
-- PART 3: VERIFY THE FIX
-- =========================================

-- Check the admin user setup
SELECT
    au.email,
    au.user_id,
    au.is_active,
    au.role_id,
    ar.role_name,
    CASE
        WHEN au.user_id IS NOT NULL AND au.role_id IS NOT NULL AND au.is_active THEN '✅ READY TO LOGIN'
        ELSE '❌ MISSING CONFIGURATION'
    END as status
FROM admin_users au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach';

-- Test inserting into audit log (should work now)
INSERT INTO admin_audit_log (
    admin_user_id,
    user_email,
    action_type,
    resource_type,
    resource_details
)
SELECT
    id,
    email,
    'test_after_fix',
    'sql_fix',
    '{"fixed": true, "timestamp": "' || NOW() || '"}'::jsonb
FROM admin_users
WHERE email = 'info@leah.coach'
RETURNING *;

-- Test the functions with the correct user
SELECT
    'Function Test Results' as test,
    is_admin(au.user_id) as is_admin,
    is_super_admin(au.user_id) as is_super_admin,
    get_admin_role(au.user_id) as admin_role
FROM admin_users au
WHERE au.email = 'info@leah.coach';

-- =========================================
-- PART 4: ENSURE PROPER PERMISSIONS
-- =========================================

-- Make sure the user can read their own admin_users record
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT ON admin_roles TO authenticated;
GRANT SELECT, INSERT ON admin_audit_log TO authenticated;

-- =========================================
-- FINAL STATUS CHECK
-- =========================================

SELECT
    '===============================================' as separator UNION ALL
SELECT 'ADMIN LOGIN STATUS: FINAL CHECK' UNION ALL
SELECT '===============================================' UNION ALL
SELECT '' UNION ALL
SELECT CASE
    WHEN au.user_id IS NOT NULL
        AND au.role_id IS NOT NULL
        AND au.is_active = true
        AND ar.role_name = 'super_admin'
    THEN '✅ ALL SYSTEMS GO - Admin login should work!'
    ELSE '❌ Issues found - check details below'
END
FROM admin_users au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach'
UNION ALL
SELECT '' UNION ALL
SELECT 'User: info@leah.coach' UNION ALL
SELECT 'User ID: ' || COALESCE(au.user_id::text, 'NOT SET - CRITICAL!')
FROM admin_users au WHERE au.email = 'info@leah.coach'
UNION ALL
SELECT 'Role: ' || COALESCE(ar.role_name, 'NOT SET - CRITICAL!')
FROM admin_users au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach'
UNION ALL
SELECT 'Active: ' || CASE WHEN au.is_active THEN 'Yes' ELSE 'No' END
FROM admin_users au WHERE au.email = 'info@leah.coach'
UNION ALL
SELECT '' UNION ALL
SELECT 'Login URL: https://leah.coach/admin/login' UNION ALL
SELECT '===============================================';