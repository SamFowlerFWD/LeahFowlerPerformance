-- =====================================================
-- CREATE INITIAL ADMIN USER FOR LEAH FOWLER PERFORMANCE
-- =====================================================
-- This script creates the initial super admin user for Leah
-- Run this AFTER applying the admin-auth-migration.sql

-- IMPORTANT: This script needs to be run in two parts:
-- 1. First, create the auth user using Supabase Dashboard or CLI
-- 2. Then run this SQL to create the admin record

-- =====================================================
-- STEP 1: CREATE AUTH USER
-- =====================================================
-- Option A: Using Supabase Dashboard
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Invite User"
-- 3. Enter email: leah@strengthpt.co.uk
-- 4. The user will receive an invitation email to set password

-- Option B: Using Supabase CLI/SQL (requires service role)
-- Run this in SQL Editor with service role:
/*
-- Create the auth user with a temporary password
SELECT auth.admin_create_user(
    'leah@strengthpt.co.uk',
    'TempPassword123!', -- CHANGE THIS IMMEDIATELY
    true -- auto-confirm email
);
*/

-- =====================================================
-- STEP 2: CREATE ADMIN USER RECORD
-- =====================================================
-- Run this AFTER the auth user is created

-- First, check if the auth user exists
DO $$
DECLARE
    v_user_id UUID;
    v_admin_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'leah@strengthpt.co.uk'
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Auth user not found. Please create the auth user first using Supabase Dashboard or CLI.';
    END IF;

    -- Check if admin user already exists
    SELECT id INTO v_admin_id
    FROM public.admin_users
    WHERE email = 'leah@strengthpt.co.uk'
    LIMIT 1;

    IF v_admin_id IS NOT NULL THEN
        RAISE NOTICE 'Admin user already exists with ID: %', v_admin_id;
    ELSE
        -- Create the super admin record
        INSERT INTO public.admin_users (
            user_id,
            email,
            role,
            permissions,
            is_active,
            metadata
        ) VALUES (
            v_user_id,
            'leah@strengthpt.co.uk',
            'super_admin',
            jsonb_build_object(
                'all_access', true,
                'can_manage_admins', true,
                'can_view_analytics', true,
                'can_export_data', true,
                'can_delete_data', true,
                'can_manage_settings', true,
                'can_view_audit_logs', true,
                'can_manage_blog', true,
                'can_view_assessments', true,
                'can_manage_programmes', true
            ),
            true,
            jsonb_build_object(
                'initial_admin', true,
                'created_via', 'setup_script',
                'created_at', NOW(),
                'notes', 'Primary super admin account for Leah Fowler'
            )
        ) RETURNING id INTO v_admin_id;

        RAISE NOTICE 'Successfully created super admin user with ID: %', v_admin_id;

        -- Log the creation
        INSERT INTO public.admin_audit_log (
            admin_user_id,
            user_email,
            action_type,
            resource_type,
            resource_id,
            resource_details,
            status,
            metadata
        ) VALUES (
            v_admin_id,
            'leah@strengthpt.co.uk',
            'create',
            'admin_user',
            v_admin_id::TEXT,
            jsonb_build_object(
                'role', 'super_admin',
                'initial_setup', true
            ),
            'success',
            jsonb_build_object(
                'setup_script', true,
                'timestamp', NOW()
            )
        );
    END IF;
END $$;

-- =====================================================
-- STEP 3: CREATE ADDITIONAL ADMIN USERS (OPTIONAL)
-- =====================================================
-- Template for creating additional admin users

/*
-- Create a regular admin user
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- First create auth user via Dashboard or CLI
    -- Then get their user_id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'new-admin@example.com'
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.admin_users (
            user_id,
            email,
            role,
            permissions,
            is_active,
            created_by
        ) VALUES (
            v_user_id,
            'new-admin@example.com',
            'admin', -- or 'moderator' for limited access
            jsonb_build_object(
                'can_manage_blog', true,
                'can_view_assessments', true,
                'can_view_analytics', true,
                'can_export_data', false,
                'can_delete_data', false
            ),
            true,
            (SELECT id FROM public.admin_users WHERE email = 'leah@strengthpt.co.uk')
        );
    END IF;
END $$;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the super admin user was created
SELECT
    au.id,
    au.email,
    au.role,
    au.is_active,
    au.created_at,
    u.email as auth_email,
    u.email_confirmed_at
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'leah@strengthpt.co.uk';

-- Check all admin users
SELECT
    email,
    role,
    is_active,
    created_at,
    last_login_at,
    login_count
FROM public.admin_users
ORDER BY created_at;

-- Verify admin functions work
SELECT
    public.is_admin((SELECT id FROM auth.users WHERE email = 'leah@strengthpt.co.uk')) as is_admin,
    public.is_super_admin((SELECT id FROM auth.users WHERE email = 'leah@strengthpt.co.uk')) as is_super_admin,
    public.get_admin_role((SELECT id FROM auth.users WHERE email = 'leah@strengthpt.co.uk')) as admin_role;

-- Check RLS policies are in place
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND (
    policyname LIKE '%admin%'
    OR policyname LIKE '%Admin%'
)
ORDER BY tablename, policyname;