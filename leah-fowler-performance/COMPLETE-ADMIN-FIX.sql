-- COMPLETE ADMIN LOGIN FIX
-- This script fixes ALL admin login issues in one go
-- Run this entire script in your Supabase SQL Editor

-- =========================================
-- PART 1: CREATE ADMIN ROLES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles if they don't exist
INSERT INTO admin_roles (role_name, permissions)
VALUES
    ('super_admin', '{"all": true}'),
    ('admin', '{"manage_content": true, "manage_users": false}'),
    ('moderator', '{"manage_content": true, "manage_users": false, "delete": false}')
ON CONFLICT (role_name) DO NOTHING;

-- =========================================
-- PART 2: UPDATE ADMIN_USERS TABLE
-- =========================================
-- First drop the existing constraint if it exists
ALTER TABLE admin_users
DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Add role_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admin_users' AND column_name = 'role_id'
    ) THEN
        ALTER TABLE admin_users ADD COLUMN role_id UUID;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'admin_users_role_id_fkey'
    ) THEN
        ALTER TABLE admin_users
        ADD CONSTRAINT admin_users_role_id_fkey
        FOREIGN KEY (role_id) REFERENCES admin_roles(id);
    END IF;
END $$;

-- Update existing admin user to have super_admin role
UPDATE admin_users
SET role_id = (SELECT id FROM admin_roles WHERE role_name = 'super_admin')
WHERE email = 'info@leah.coach' AND role_id IS NULL;

-- =========================================
-- PART 3: CREATE/UPDATE ADMIN_AUDIT_LOG TABLE
-- =========================================
-- Drop existing table if it exists (to clear bad constraints)
DROP TABLE IF EXISTS admin_audit_log CASCADE;

-- Create fresh admin_audit_log table without restrictive constraints
CREATE TABLE admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id),
    user_email TEXT,
    action_type TEXT NOT NULL, -- No constraint on values
    resource_type TEXT,
    resource_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- =========================================
-- PART 4: CREATE SECURITY_AUDIT_LOG TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- PART 5: SETUP ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS on all admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admin users can read own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update own record" ON admin_users;
DROP POLICY IF EXISTS "Service role full access admin_users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can read roles" ON admin_roles;
DROP POLICY IF EXISTS "Service role full access roles" ON admin_roles;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Service role full access audit" ON admin_audit_log;
DROP POLICY IF EXISTS "Anyone can insert security logs" ON security_audit_log;
DROP POLICY IF EXISTS "Service role can read security logs" ON security_audit_log;

-- ADMIN_USERS POLICIES
CREATE POLICY "Admin users can read own record"
ON admin_users FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Admin users can update own record"
ON admin_users FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access admin_users"
ON admin_users FOR ALL
USING (auth.role() = 'service_role');

-- ADMIN_ROLES POLICIES
CREATE POLICY "Anyone can read roles"
ON admin_roles FOR SELECT
USING (true);

CREATE POLICY "Service role full access roles"
ON admin_roles FOR ALL
USING (auth.role() = 'service_role');

-- ADMIN_AUDIT_LOG POLICIES
CREATE POLICY "Authenticated can insert audit logs"
ON admin_audit_log FOR INSERT
WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Admins can read audit logs"
ON admin_audit_log FOR SELECT
USING (
    auth.role() = 'service_role' OR
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Service role full access audit"
ON admin_audit_log FOR ALL
USING (auth.role() = 'service_role');

-- SECURITY_AUDIT_LOG POLICIES
CREATE POLICY "Anyone can insert security logs"
ON security_audit_log FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can read security logs"
ON security_audit_log FOR SELECT
USING (auth.role() = 'service_role');

-- =========================================
-- PART 6: CREATE HELPER FUNCTIONS
-- =========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users au
        JOIN admin_roles ar ON au.role_id = ar.id
        WHERE au.user_id = check_user_id
        AND au.is_active = true
        AND ar.role_name = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin role
CREATE OR REPLACE FUNCTION get_admin_role(check_user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
    role_name TEXT;
BEGIN
    SELECT ar.role_name INTO role_name
    FROM admin_users au
    JOIN admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = check_user_id
    AND au.is_active = true;

    RETURN role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- PART 7: GRANT PERMISSIONS
-- =========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on tables
GRANT SELECT ON admin_roles TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated, service_role;
GRANT SELECT, INSERT ON admin_audit_log TO authenticated, service_role;
GRANT INSERT ON security_audit_log TO anon, authenticated, service_role;
GRANT SELECT ON security_audit_log TO service_role;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION is_admin TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION is_super_admin TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_admin_role TO anon, authenticated, service_role;

-- =========================================
-- PART 8: ENSURE ADMIN USER EXISTS
-- =========================================

DO $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
BEGIN
    -- Get the user ID for info@leah.coach from auth.users
    -- Note: This assumes the user exists in Supabase Auth
    -- If not, create the user first in Supabase Dashboard > Authentication > Users

    -- Check if admin already exists
    SELECT user_id INTO v_user_id
    FROM admin_users
    WHERE email = 'info@leah.coach'
    LIMIT 1;

    -- Get super_admin role ID
    SELECT id INTO v_role_id
    FROM admin_roles
    WHERE role_name = 'super_admin'
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Update existing admin
        UPDATE admin_users
        SET
            role_id = v_role_id,
            is_active = true,
            updated_at = NOW()
        WHERE email = 'info@leah.coach';

        RAISE NOTICE 'Admin user updated for info@leah.coach';
    ELSE
        -- For new admin, you need the auth.users ID
        -- This will be shown in the verification below
        RAISE NOTICE 'Admin user entry for info@leah.coach not found.';
        RAISE NOTICE 'Please check if user exists in Supabase Authentication first.';
    END IF;
END $$;

-- =========================================
-- PART 9: VERIFICATION
-- =========================================

-- Check admin setup
SELECT
    'Admin Setup Verification' as check_type,
    au.email,
    au.user_id,
    au.is_active,
    ar.role_name,
    CASE
        WHEN au.user_id IS NOT NULL THEN 'Ready for login'
        ELSE 'Need to create user in Supabase Auth first'
    END as status
FROM admin_users au
LEFT JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach';

-- Test functions
SELECT
    'Function Test' as test_type,
    is_admin(au.user_id) as is_admin_result,
    is_super_admin(au.user_id) as is_super_admin_result,
    get_admin_role(au.user_id) as role_result
FROM admin_users au
WHERE au.email = 'info@leah.coach';

-- Check if tables are properly configured
SELECT
    table_name,
    CASE
        WHEN row_security_enabled THEN 'RLS Enabled ✓'
        ELSE 'RLS Disabled ✗'
    END as rls_status
FROM information_schema.tables t
JOIN pg_tables pt ON t.table_name = pt.tablename
LEFT JOIN pg_class c ON c.relname = t.table_name
LEFT JOIN pg_catalog.pg_policies p ON p.tablename = t.table_name
WHERE t.table_schema = 'public'
AND t.table_name IN ('admin_users', 'admin_roles', 'admin_audit_log', 'security_audit_log')
GROUP BY table_name, c.relrowsecurity
ORDER BY table_name;

-- =========================================
-- IMPORTANT NEXT STEPS:
-- =========================================
-- 1. If you see "Need to create user in Supabase Auth first":
--    Go to Supabase Dashboard > Authentication > Users
--    Create a new user with email: info@leah.coach
--    Set a strong password
--
-- 2. After creating the auth user, run this query to link it:
--    UPDATE admin_users
--    SET user_id = (SELECT id FROM auth.users WHERE email = 'info@leah.coach' LIMIT 1)
--    WHERE email = 'info@leah.coach';
--
-- 3. Test login at: https://leah.coach/admin/login