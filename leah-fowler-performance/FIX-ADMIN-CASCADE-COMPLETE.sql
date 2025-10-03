-- =================================================================
-- COMPREHENSIVE ADMIN SETUP WITH CASCADE - Handles ALL Dependencies
-- This script will drop and recreate everything properly
-- Run this entire script in Supabase SQL Editor
-- =================================================================

-- =================================================================
-- STEP 1: DROP ALL ADMIN FUNCTIONS WITH CASCADE
-- This will automatically drop all dependent policies
-- =================================================================

-- Drop all admin check functions with CASCADE to remove dependent policies
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin(check_user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin(user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

DROP FUNCTION IF EXISTS is_super_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin(check_user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin(user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;

DROP FUNCTION IF EXISTS get_admin_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_admin_role(check_user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS get_admin_role(user_id UUID) CASCADE;
DROP FUNCTION IF EXISTS get_admin_role() CASCADE;

DROP FUNCTION IF EXISTS is_current_user_admin() CASCADE;
DROP FUNCTION IF EXISTS is_current_user_super_admin() CASCADE;
DROP FUNCTION IF EXISTS get_current_user_admin_role() CASCADE;
DROP FUNCTION IF EXISTS log_admin_action(TEXT, TEXT, UUID, JSONB) CASCADE;

-- =================================================================
-- STEP 2: ENSURE ADMIN TABLES EXIST WITH CORRECT STRUCTURE
-- =================================================================

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns to admin_users table
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create admin_audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

-- =================================================================
-- STEP 3: CLEAN UP AND INSERT ADMIN USER
-- =================================================================

-- Remove any existing entry for this user to avoid conflicts
DELETE FROM admin_users WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';
DELETE FROM admin_users WHERE email = 'info@leah.coach';

-- Insert the admin user with super_admin role
INSERT INTO admin_users (
    user_id,
    email,
    role,
    permissions,
    is_active,
    created_at,
    updated_at
) VALUES (
    'dfd9154b-4238-4672-8a0a-e657a18532c5',
    'info@leah.coach',
    'super_admin',
    jsonb_build_object(
        'all', true,
        'manage_users', true,
        'manage_content', true,
        'manage_settings', true,
        'view_analytics', true,
        'manage_coaching', true,
        'manage_blog', true,
        'manage_leads', true
    ),
    true,
    NOW(),
    NOW()
);

-- =================================================================
-- STEP 4: CREATE ADMIN CHECK FUNCTIONS WITH CONSISTENT SIGNATURES
-- =================================================================

-- Function to check if a user is an admin (using UUID type consistently)
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN;
BEGIN
    -- Check if the user exists in admin_users and is active
    SELECT EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    ) INTO result;

    RETURN COALESCE(result, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    result BOOLEAN;
BEGIN
    -- Check if the user is a super_admin and is active
    SELECT EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = check_user_id
        AND role = 'super_admin'
        AND is_active = true
    ) INTO result;

    RETURN COALESCE(result, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get the admin role of a user
CREATE OR REPLACE FUNCTION get_admin_role(check_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get the role of the user if they're an active admin
    SELECT role INTO user_role
    FROM admin_users
    WHERE user_id = check_user_id
    AND is_active = true
    LIMIT 1;

    -- Return the role or NULL if not found
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Convenience function to check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Convenience function to check if current user is super admin
CREATE OR REPLACE FUNCTION is_current_user_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_super_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Convenience function to get current user's admin role
CREATE OR REPLACE FUNCTION get_current_user_admin_role()
RETURNS TEXT AS $$
BEGIN
    RETURN get_admin_role(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Audit log function
CREATE OR REPLACE FUNCTION log_admin_action(
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_changes JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        changes,
        created_at
    ) VALUES (
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_changes,
        NOW()
    )
    RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- STEP 5: SET UP RLS POLICIES FOR ADMIN TABLES
-- =================================================================

-- Enable RLS on admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on admin tables (cleanup)
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON admin_users;
DROP POLICY IF EXISTS "audit_log_select_policy" ON admin_audit_log;
DROP POLICY IF EXISTS "audit_log_insert_policy" ON admin_audit_log;

-- Create policies for admin_users
CREATE POLICY "Admins can view admin users"
ON admin_users FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    is_admin(auth.uid())
);

CREATE POLICY "Super admins can insert admin users"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (
    is_super_admin(auth.uid())
);

CREATE POLICY "Admins can update their own record super admins can update all"
ON admin_users FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id OR
    is_super_admin(auth.uid())
)
WITH CHECK (
    auth.uid() = user_id OR
    is_super_admin(auth.uid())
);

CREATE POLICY "Super admins can delete admin users"
ON admin_users FOR DELETE
TO authenticated
USING (
    is_super_admin(auth.uid())
);

-- Create policies for admin_audit_log
CREATE POLICY "Admins can view audit logs"
ON admin_audit_log FOR SELECT
TO authenticated
USING (
    is_admin(auth.uid())
);

CREATE POLICY "System can insert audit logs"
ON admin_audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- =================================================================
-- STEP 6: RECREATE RLS POLICIES FOR ASSESSMENT_SUBMISSIONS
-- =================================================================

-- Ensure RLS is enabled
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Users can submit assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Admins can view all assessment submissions" ON assessment_submissions;
DROP POLICY IF EXISTS "Admins can manage assessment submissions" ON assessment_submissions;

-- Recreate policies for assessment_submissions
CREATE POLICY "Users can view their own assessments"
ON assessment_submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can submit assessments"
ON assessment_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessment submissions"
ON assessment_submissions FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessment submissions"
ON assessment_submissions FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =================================================================
-- STEP 7: RECREATE RLS POLICIES FOR LEAD_MAGNETS
-- =================================================================

-- Ensure table exists and RLS is enabled
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active lead magnets" ON lead_magnets;
DROP POLICY IF EXISTS "Users can download lead magnets" ON lead_magnets;
DROP POLICY IF EXISTS "Admins can manage lead magnets" ON lead_magnets;

-- Recreate policies for lead_magnets
CREATE POLICY "Public can view active lead magnets"
ON lead_magnets FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage lead magnets"
ON lead_magnets FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =================================================================
-- STEP 8: RECREATE RLS POLICIES FOR POSTS (BLOG)
-- =================================================================

-- Ensure table exists and RLS is enabled
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;

-- Recreate policies for posts
CREATE POLICY "Public can view published posts"
ON posts FOR SELECT
TO anon, authenticated
USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Authors can view their own posts"
ON posts FOR SELECT
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts"
ON posts FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =================================================================
-- STEP 9: RECREATE RLS POLICIES FOR CATEGORIES
-- =================================================================

-- Ensure table exists and RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- Recreate policies for categories
CREATE POLICY "Public can view categories"
ON categories FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =================================================================
-- STEP 10: RECREATE RLS POLICIES FOR TAGS
-- =================================================================

-- Ensure table exists and RLS is enabled
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view tags" ON tags;
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;

-- Recreate policies for tags
CREATE POLICY "Public can view tags"
ON tags FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage tags"
ON tags FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- =================================================================
-- STEP 11: CREATE UPDATE TRIGGERS
-- =================================================================

-- Update trigger function for admin_users
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_admin_users_updated_at_trigger ON admin_users;

-- Create the trigger
CREATE TRIGGER update_admin_users_updated_at_trigger
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_updated_at();

-- =================================================================
-- STEP 12: GRANT NECESSARY PERMISSIONS
-- =================================================================

-- Grant usage on functions to authenticated role
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action(TEXT, TEXT, UUID, JSONB) TO authenticated;

-- Grant usage on functions to anon role (for checking public visibility)
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;

-- =================================================================
-- STEP 13: VERIFICATION QUERIES
-- =================================================================

-- Verify the admin user exists
SELECT
    'Admin User Check' as test_name,
    CASE
        WHEN COUNT(*) = 1 THEN '✅ PASS - Admin user exists'
        ELSE '❌ FAIL - Admin user not found'
    END as result,
    COUNT(*) as admin_count
FROM admin_users
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Verify admin user details
SELECT
    'Admin User Details' as test_name,
    user_id,
    email,
    role,
    is_active,
    permissions
FROM admin_users
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Test the admin functions
SELECT
    'Function Tests' as test_name,
    is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as is_admin_result,
    is_super_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as is_super_admin_result,
    get_admin_role('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as role_result;

-- Check that functions exist with correct signatures
SELECT
    'Function Signatures' as test_name,
    proname as function_name,
    pronargs as arg_count,
    pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN ('is_admin', 'is_super_admin', 'get_admin_role')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- Verify RLS is enabled on all important tables
SELECT
    'RLS Status' as test_name,
    tablename,
    CASE
        WHEN rowsecurity = true THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'admin_users',
    'admin_audit_log',
    'assessment_submissions',
    'lead_magnets',
    'posts',
    'categories',
    'tags'
)
ORDER BY tablename;

-- Count policies on each table
SELECT
    'Policy Count' as test_name,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
    'admin_users',
    'admin_audit_log',
    'assessment_submissions',
    'lead_magnets',
    'posts',
    'categories',
    'tags'
)
GROUP BY tablename
ORDER BY tablename;

-- List all policies to verify they were recreated
SELECT
    'Policy Details' as test_name,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
    'admin_users',
    'admin_audit_log',
    'assessment_submissions',
    'lead_magnets',
    'posts',
    'categories',
    'tags'
)
ORDER BY tablename, policyname;

-- =================================================================
-- FINAL SUCCESS MESSAGE
-- =================================================================
SELECT
    '🎉 Admin Setup Complete with CASCADE!' as message,
    'All functions recreated with consistent signatures' as functions_status,
    'All RLS policies recreated for affected tables' as policies_status,
    'User dfd9154b-4238-4672-8a0a-e657a18532c5 (info@leah.coach) is now a super_admin' as admin_status;

-- =================================================================
-- IMPORTANT NOTES
-- =================================================================
-- This script uses CASCADE to drop functions and their dependent policies
-- Then recreates everything with consistent function signatures
-- All functions now use UUID type consistently (not varchar or text)
-- All policies have been recreated for:
--   - admin_users
--   - admin_audit_log
--   - assessment_submissions
--   - lead_magnets
--   - posts
--   - categories
--   - tags