-- =================================================================
-- COMPLETE ADMIN SETUP FIX - Handles all edge cases
-- Run this entire script in Supabase SQL Editor
-- =================================================================

-- =================================================================
-- STEP 1: DROP ALL EXISTING ADMIN-RELATED FUNCTIONS
-- We need to drop functions with all possible signatures
-- =================================================================

-- Drop is_admin function with all possible parameter signatures
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_admin(check_user_id UUID);
DROP FUNCTION IF EXISTS is_admin(user_id UUID);
DROP FUNCTION IF EXISTS is_admin();

-- Drop is_super_admin function with all possible parameter signatures
DROP FUNCTION IF EXISTS is_super_admin(UUID);
DROP FUNCTION IF EXISTS is_super_admin(check_user_id UUID);
DROP FUNCTION IF EXISTS is_super_admin(user_id UUID);
DROP FUNCTION IF EXISTS is_super_admin();

-- Drop get_admin_role function with all possible parameter signatures
DROP FUNCTION IF EXISTS get_admin_role(UUID);
DROP FUNCTION IF EXISTS get_admin_role(check_user_id UUID);
DROP FUNCTION IF EXISTS get_admin_role(user_id UUID);
DROP FUNCTION IF EXISTS get_admin_role();

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
-- STEP 4: SET UP RLS POLICIES
-- =================================================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow super admins full access" ON admin_users;
DROP POLICY IF EXISTS "Allow admins to read" ON admin_users;

DROP POLICY IF EXISTS "Allow authenticated to view audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow admin to insert audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow authenticated read audit_log" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow authenticated insert audit_log" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow super admins to view all logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow system to insert logs" ON admin_audit_log;

-- Enable RLS on both tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policies for admin_users
CREATE POLICY "admin_users_select_policy"
ON admin_users FOR SELECT
TO authenticated
USING (
    -- Allow users to see their own record or if they're a super_admin
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
);

CREATE POLICY "admin_users_insert_policy"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (
    -- Only super_admins can insert new admin users
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
);

CREATE POLICY "admin_users_update_policy"
ON admin_users FOR UPDATE
TO authenticated
USING (
    -- Super admins can update any record, regular admins only their own
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
)
WITH CHECK (
    -- Same check for updates
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
);

CREATE POLICY "admin_users_delete_policy"
ON admin_users FOR DELETE
TO authenticated
USING (
    -- Only super_admins can delete admin users
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
);

-- Create policies for admin_audit_log
CREATE POLICY "audit_log_select_policy"
ON admin_audit_log FOR SELECT
TO authenticated
USING (
    -- Admins can view all logs
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
    )
);

CREATE POLICY "audit_log_insert_policy"
ON admin_audit_log FOR INSERT
TO authenticated
WITH CHECK (
    -- Any authenticated user can insert logs (for tracking purposes)
    true
);

-- =================================================================
-- STEP 5: CREATE ADMIN CHECK FUNCTIONS WITH CONSISTENT SIGNATURES
-- =================================================================

-- Function to check if a user is an admin
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

-- =================================================================
-- STEP 6: CREATE HELPER FUNCTIONS FOR CURRENT USER
-- =================================================================

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

-- =================================================================
-- STEP 7: CREATE AUDIT LOG FUNCTION
-- =================================================================

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
-- STEP 8: CREATE UPDATE TRIGGER FOR admin_users
-- =================================================================

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
-- STEP 9: GRANT NECESSARY PERMISSIONS
-- =================================================================

-- Grant usage on functions to authenticated role
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action(TEXT, TEXT, UUID, JSONB) TO authenticated;

-- =================================================================
-- STEP 10: VERIFICATION QUERIES
-- =================================================================

-- Verify the admin user exists
SELECT
    'Admin User Check' as test_name,
    CASE
        WHEN COUNT(*) = 1 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as result,
    COUNT(*) as admin_count
FROM admin_users
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Verify admin user details
SELECT
    user_id,
    email,
    role,
    is_active,
    permissions,
    created_at,
    updated_at
FROM admin_users
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Test the admin functions
SELECT
    'Function Tests' as test_name,
    is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5') as is_admin_result,
    is_super_admin('dfd9154b-4238-4672-8a0a-e657a18532c5') as is_super_admin_result,
    get_admin_role('dfd9154b-4238-4672-8a0a-e657a18532c5') as role_result;

-- Check that functions exist with correct signatures
SELECT
    proname as function_name,
    pronargs as arg_count,
    pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN ('is_admin', 'is_super_admin', 'get_admin_role')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- Verify RLS is enabled
SELECT
    tablename,
    CASE
        WHEN rowsecurity = true THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log');

-- Count policies on each table
SELECT
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log')
GROUP BY tablename;

-- =================================================================
-- FINAL SUCCESS MESSAGE
-- =================================================================
SELECT
    '🎉 Admin Setup Complete!' as message,
    'User dfd9154b-4238-4672-8a0a-e657a18532c5 (info@leah.coach) is now a super_admin' as details;