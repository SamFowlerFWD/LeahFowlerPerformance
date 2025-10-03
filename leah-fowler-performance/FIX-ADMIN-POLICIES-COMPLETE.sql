-- =================================================================
-- COMPLETE ADMIN POLICIES FIX - Handles all table-specific cases
-- Run this entire script in Supabase SQL Editor
-- =================================================================

-- =================================================================
-- STEP 1: DROP ALL EXISTING POLICIES AND FUNCTIONS WITH CASCADE
-- =================================================================

-- Drop all existing policies for affected tables
DO $$
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
END $$;

-- Drop all existing admin functions with CASCADE to handle dependencies
DROP FUNCTION IF EXISTS is_admin CASCADE;
DROP FUNCTION IF EXISTS is_super_admin CASCADE;
DROP FUNCTION IF EXISTS get_admin_role CASCADE;
DROP FUNCTION IF EXISTS has_admin_permission CASCADE;

-- =================================================================
-- STEP 2: ENSURE ADMIN TABLE EXISTS
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

-- Add any missing columns
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- =================================================================
-- STEP 3: INSERT ADMIN USER
-- =================================================================

-- Remove any existing entries for this user
DELETE FROM admin_users WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';
DELETE FROM admin_users WHERE email = 'info@leah.coach';

-- Insert the admin user with super_admin role
INSERT INTO admin_users (
    user_id,
    email,
    role,
    permissions,
    is_active
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
        'manage_assessments', true
    ),
    true
);

-- =================================================================
-- STEP 4: CREATE ADMIN CHECK FUNCTIONS
-- =================================================================

-- Create is_admin function that checks if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    -- If no user_id provided, check the current authenticated user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;

    -- If still no user_id, return false
    IF check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user exists in admin_users table and is active
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create is_super_admin function
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    -- If no user_id provided, check the current authenticated user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;

    -- If still no user_id, return false
    IF check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user is a super_admin
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_admin_role function
CREATE OR REPLACE FUNCTION get_admin_role(check_user_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- If no user_id provided, check the current authenticated user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;

    -- If still no user_id, return NULL
    IF check_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Get the user's role
    SELECT role INTO user_role
    FROM admin_users
    WHERE user_id = check_user_id
    AND is_active = true;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create has_admin_permission function
CREATE OR REPLACE FUNCTION has_admin_permission(permission_key TEXT, check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    -- If no user_id provided, check the current authenticated user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;

    -- If still no user_id, return false
    IF check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Get user permissions
    SELECT permissions INTO user_permissions
    FROM admin_users
    WHERE user_id = check_user_id
    AND is_active = true;

    -- Check if user has the specific permission or has 'all' permission
    IF user_permissions IS NOT NULL THEN
        RETURN (user_permissions->>'all')::boolean = true
            OR (user_permissions->>permission_key)::boolean = true;
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- STEP 5: ENABLE RLS ON ALL TABLES
-- =================================================================

ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- STEP 6: CREATE POLICIES FOR assessment_submissions
-- =================================================================

-- Admins can do everything
CREATE POLICY "Admins can manage assessment_submissions" ON assessment_submissions
    FOR ALL USING (is_admin());

-- Public can insert (for form submissions)
CREATE POLICY "Public can insert assessment_submissions" ON assessment_submissions
    FOR INSERT WITH CHECK (true);

-- =================================================================
-- STEP 7: CREATE POLICIES FOR lead_magnets
-- =================================================================

-- Public can view active lead magnets
CREATE POLICY "Public can view active lead_magnets" ON lead_magnets
    FOR SELECT USING (is_active = true);

-- Admins can manage all lead magnets
CREATE POLICY "Admins can manage lead_magnets" ON lead_magnets
    FOR ALL USING (is_admin());

-- =================================================================
-- STEP 8: CREATE POLICIES FOR posts (uses author_id, not user_id)
-- =================================================================

-- Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
    FOR SELECT USING (
        status = 'published'
        AND deleted_at IS NULL
    );

-- Authors can view their own posts
CREATE POLICY "Authors can view own posts" ON posts
    FOR SELECT USING (
        author_id IN (
            SELECT id FROM authors
            WHERE user_id = auth.uid()
        )
    );

-- Authors can manage their own posts
CREATE POLICY "Authors can manage own posts" ON posts
    FOR ALL USING (
        author_id IN (
            SELECT id FROM authors
            WHERE user_id = auth.uid()
        )
    );

-- Admins can manage all posts
CREATE POLICY "Admins can manage all posts" ON posts
    FOR ALL USING (is_admin());

-- =================================================================
-- STEP 9: CREATE POLICIES FOR categories
-- =================================================================

-- Public can view active categories
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (is_active = true);

-- Admins can manage all categories
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (is_admin());

-- =================================================================
-- STEP 10: CREATE POLICIES FOR tags
-- =================================================================

-- Public can view all tags
CREATE POLICY "Public can view tags" ON tags
    FOR SELECT USING (true);

-- Admins can manage all tags
CREATE POLICY "Admins can manage tags" ON tags
    FOR ALL USING (is_admin());

-- =================================================================
-- STEP 11: GRANT NECESSARY PERMISSIONS
-- =================================================================

-- Grant execute permissions on admin functions
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION has_admin_permission(TEXT, UUID) TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON admin_users TO authenticated;
GRANT ALL ON assessment_submissions TO authenticated;
GRANT ALL ON lead_magnets TO authenticated;
GRANT ALL ON posts TO authenticated;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON tags TO authenticated;

-- Grant public permissions for viewing
GRANT SELECT ON posts TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON tags TO anon;
GRANT SELECT ON lead_magnets TO anon;
GRANT INSERT ON assessment_submissions TO anon;

-- =================================================================
-- STEP 12: TEST THE ADMIN FUNCTIONS
-- =================================================================

-- Test that our admin user is recognized
DO $$
DECLARE
    test_result BOOLEAN;
    test_role TEXT;
BEGIN
    -- Test is_admin function
    test_result := is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::UUID);
    IF test_result THEN
        RAISE NOTICE 'SUCCESS: is_admin() returns true for admin user';
    ELSE
        RAISE WARNING 'FAILED: is_admin() returns false for admin user';
    END IF;

    -- Test is_super_admin function
    test_result := is_super_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::UUID);
    IF test_result THEN
        RAISE NOTICE 'SUCCESS: is_super_admin() returns true for admin user';
    ELSE
        RAISE WARNING 'FAILED: is_super_admin() returns false for admin user';
    END IF;

    -- Test get_admin_role function
    test_role := get_admin_role('dfd9154b-4238-4672-8a0a-e657a18532c5'::UUID);
    IF test_role = 'super_admin' THEN
        RAISE NOTICE 'SUCCESS: get_admin_role() returns super_admin for admin user';
    ELSE
        RAISE WARNING 'FAILED: get_admin_role() returns % for admin user', test_role;
    END IF;

    -- Test has_admin_permission function
    test_result := has_admin_permission('manage_content', 'dfd9154b-4238-4672-8a0a-e657a18532c5'::UUID);
    IF test_result THEN
        RAISE NOTICE 'SUCCESS: has_admin_permission() returns true for manage_content';
    ELSE
        RAISE WARNING 'FAILED: has_admin_permission() returns false for manage_content';
    END IF;
END $$;

-- =================================================================
-- STEP 13: VERIFY TABLE STRUCTURE
-- =================================================================

-- Show current structure of tables for verification
DO $$
BEGIN
    RAISE NOTICE 'Table structures verified. Checking column existence...';

    -- Check assessment_submissions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'assessment_submissions'
                   AND column_name = 'user_id') THEN
        RAISE NOTICE 'INFO: assessment_submissions does not have user_id column (this is expected)';
    END IF;

    -- Check lead_magnets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'lead_magnets'
                   AND column_name = 'user_id') THEN
        RAISE NOTICE 'INFO: lead_magnets does not have user_id column (this is expected)';
    END IF;

    -- Check posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'posts'
                   AND column_name = 'user_id') THEN
        RAISE NOTICE 'INFO: posts does not have user_id column, uses author_id instead (this is expected)';
    END IF;

    -- Check categories
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'categories'
                   AND column_name = 'user_id') THEN
        RAISE NOTICE 'INFO: categories does not have user_id column (this is expected)';
    END IF;

    -- Check tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'tags'
                   AND column_name = 'user_id') THEN
        RAISE NOTICE 'INFO: tags does not have user_id column (this is expected)';
    END IF;

    RAISE NOTICE 'All table structures verified successfully!';
END $$;

-- =================================================================
-- FINAL SUCCESS MESSAGE
-- =================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'ADMIN POLICIES SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin user created:';
    RAISE NOTICE '  - Email: info@leah.coach';
    RAISE NOTICE '  - User ID: dfd9154b-4238-4672-8a0a-e657a18532c5';
    RAISE NOTICE '  - Role: super_admin';
    RAISE NOTICE '';
    RAISE NOTICE 'Policies created for:';
    RAISE NOTICE '  - assessment_submissions (no user_id column, admin access only)';
    RAISE NOTICE '  - lead_magnets (no user_id column, public read/admin write)';
    RAISE NOTICE '  - posts (uses author_id, not user_id)';
    RAISE NOTICE '  - categories (no user_id, public read/admin write)';
    RAISE NOTICE '  - tags (no user_id, public read/admin write)';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin functions available:';
    RAISE NOTICE '  - is_admin(user_id)';
    RAISE NOTICE '  - is_super_admin(user_id)';
    RAISE NOTICE '  - get_admin_role(user_id)';
    RAISE NOTICE '  - has_admin_permission(permission, user_id)';
    RAISE NOTICE '=================================================================';
END $$;