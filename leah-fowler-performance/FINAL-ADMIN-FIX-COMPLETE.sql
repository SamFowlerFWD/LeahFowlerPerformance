-- =================================================================
-- FINAL COMPLETE ADMIN SETUP WITH PROPER SYNTAX
-- Run this entire script in Supabase SQL Editor
-- =================================================================

-- =================================================================
-- STEP 1: DROP ALL EXISTING POLICIES WITH PROPER LOOP VARIABLE
-- =================================================================

-- Drop all existing policies for affected tables
DO $$
DECLARE
    r RECORD; -- Declare loop variable as RECORD type
BEGIN
    -- Drop policies for assessment_submissions
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'assessment_submissions')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON assessment_submissions', r.policyname);
    END LOOP;

    -- Drop policies for lead_magnets
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'lead_magnets')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON lead_magnets', r.policyname);
    END LOOP;

    -- Drop policies for posts
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'posts')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON posts', r.policyname);
    END LOOP;

    -- Drop policies for categories
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'categories')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON categories', r.policyname);
    END LOOP;

    -- Drop policies for tags
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tags')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON tags', r.policyname);
    END LOOP;

    -- Drop policies for admin_users
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admin_users')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON admin_users', r.policyname);
    END LOOP;

    -- Drop policies for admin_audit_log
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admin_audit_log')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON admin_audit_log', r.policyname);
    END LOOP;
END $$;

-- =================================================================
-- STEP 2: DROP ALL ADMIN FUNCTIONS WITH CASCADE
-- =================================================================

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

DROP FUNCTION IF EXISTS has_admin_permission(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS has_admin_permission(check_user_id UUID, permission_key TEXT) CASCADE;

-- =================================================================
-- STEP 3: ENSURE ADMIN TABLES EXIST WITH CORRECT STRUCTURE
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

-- Add any missing columns to admin_users
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
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    user_email TEXT,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    resource_details JSONB,
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
-- STEP 4: INSERT ADMIN USER
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
-- STEP 5: CREATE ADMIN CHECK FUNCTIONS
-- =================================================================

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    user_to_check UUID;
BEGIN
    -- Use provided ID or current user
    user_to_check := COALESCE(check_user_id, auth.uid());

    -- Return false if no user
    IF user_to_check IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user exists in admin_users and is active
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = user_to_check
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    user_to_check UUID;
BEGIN
    -- Use provided ID or current user
    user_to_check := COALESCE(check_user_id, auth.uid());

    -- Return false if no user
    IF user_to_check IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user is a super_admin and is active
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = user_to_check
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get the admin role of a user
CREATE OR REPLACE FUNCTION get_admin_role(check_user_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    user_to_check UUID;
    user_role TEXT;
BEGIN
    -- Use provided ID or current user
    user_to_check := COALESCE(check_user_id, auth.uid());

    -- Return NULL if no user
    IF user_to_check IS NULL THEN
        RETURN NULL;
    END IF;

    -- Get the role of the user if they're an active admin
    SELECT role INTO user_role
    FROM admin_users
    WHERE user_id = user_to_check
    AND is_active = true
    LIMIT 1;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =================================================================
-- STEP 6: ENABLE RLS ON ALL TABLES
-- =================================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- STEP 7: CREATE POLICIES FOR ADMIN TABLES
-- =================================================================

-- Policies for admin_users
CREATE POLICY "Admins can view admin users"
ON admin_users FOR SELECT
USING (is_admin());

CREATE POLICY "Super admins can insert admin users"
ON admin_users FOR INSERT
WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update admin users"
ON admin_users FOR UPDATE
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can delete admin users"
ON admin_users FOR DELETE
USING (is_super_admin());

-- Policies for admin_audit_log
CREATE POLICY "Admins can view audit logs"
ON admin_audit_log FOR SELECT
USING (is_admin());

CREATE POLICY "System can insert audit logs"
ON admin_audit_log FOR INSERT
WITH CHECK (true);

-- =================================================================
-- STEP 8: CREATE POLICIES FOR assessment_submissions
-- (No user_id column - public submissions)
-- =================================================================

CREATE POLICY "Public can insert assessment_submissions"
ON assessment_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can view their own assessment_submissions"
ON assessment_submissions FOR SELECT
USING (true); -- You might want to restrict this based on session or email

CREATE POLICY "Admins can manage assessment_submissions"
ON assessment_submissions FOR ALL
USING (is_admin());

-- =================================================================
-- STEP 9: CREATE POLICIES FOR lead_magnets
-- (No user_id column - public content)
-- =================================================================

CREATE POLICY "Public can view active lead_magnets"
ON lead_magnets FOR SELECT
USING (
    CASE
        WHEN COALESCE((SELECT value FROM settings WHERE key = 'lead_magnets_require_active'), 'false') = 'true'
        THEN is_active = true
        ELSE true
    END
);

CREATE POLICY "Admins can manage lead_magnets"
ON lead_magnets FOR ALL
USING (is_admin());

-- =================================================================
-- STEP 10: CREATE POLICIES FOR posts
-- (Uses author_id, not user_id)
-- =================================================================

CREATE POLICY "Public can view published posts"
ON posts FOR SELECT
USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= NOW())
    AND (deleted_at IS NULL)
);

-- If there's an authors table that links to auth.users
CREATE POLICY "Authors can manage their own posts"
ON posts FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM authors
        WHERE authors.id = posts.author_id
        AND authors.user_id = auth.uid()
    )
    OR is_admin()
);

-- If no authors table, admins only can manage
CREATE POLICY "Admins can manage all posts"
ON posts FOR ALL
USING (is_admin());

-- =================================================================
-- STEP 11: CREATE POLICIES FOR categories
-- (No user ownership - admin managed)
-- =================================================================

CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
USING (is_admin());

-- =================================================================
-- STEP 12: CREATE POLICIES FOR tags
-- (No user ownership - admin managed)
-- =================================================================

CREATE POLICY "Public can view active tags"
ON tags FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage tags"
ON tags FOR ALL
USING (is_admin());

-- =================================================================
-- STEP 13: GRANT NECESSARY PERMISSIONS
-- =================================================================

-- Grant usage on functions to authenticated role
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO authenticated;

-- Grant usage on functions to anon role (for checking in public contexts)
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO anon;

-- =================================================================
-- STEP 14: VERIFICATION QUERIES
-- =================================================================

-- Verify the admin user exists
SELECT
    'Admin User Check' as test_name,
    CASE
        WHEN COUNT(*) = 1 THEN '✅ PASS - Admin user exists'
        ELSE '❌ FAIL - Admin user not found'
    END as result
FROM admin_users
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Test the admin functions
SELECT
    'Admin Functions Test' as test_name,
    is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as is_admin_test,
    is_super_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as is_super_admin_test,
    get_admin_role('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) as role_test;

-- Check RLS is enabled
SELECT
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

-- =================================================================
-- FINAL SUCCESS MESSAGE
-- =================================================================
SELECT
    '🎉 Admin Setup Complete!' as message,
    'All functions created with proper signatures' as functions_status,
    'All policies created for affected tables' as policies_status,
    'User dfd9154b-4238-4672-8a0a-e657a18532c5 (info@leah.coach) is now a super_admin' as admin_status;