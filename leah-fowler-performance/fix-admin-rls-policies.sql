-- Fix Admin RLS Policies for Login Issues
-- This migration addresses the 403 errors on admin_audit_log and related tables

-- First, ensure the tables exist
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id),
    user_email TEXT,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    resource_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action_type TEXT NOT NULL,
    resource_type TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Admin users can insert audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admin users can read audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Service role can do everything" ON admin_audit_log;
DROP POLICY IF EXISTS "Anyone can insert security logs" ON security_audit_log;
DROP POLICY IF EXISTS "Service role can read security logs" ON security_audit_log;

-- Enable RLS on tables
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for admin_audit_log
-- Allow authenticated users who are admins to insert audit logs
CREATE POLICY "Admins can insert audit logs"
ON admin_audit_log FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
        AND admin_users.is_active = true
    )
);

-- Allow authenticated users who are admins to read audit logs
CREATE POLICY "Admins can read audit logs"
ON admin_audit_log FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
        AND admin_users.is_active = true
    )
);

-- Allow service role full access
CREATE POLICY "Service role full access audit"
ON admin_audit_log FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create permissive policy for security_audit_log
-- Allow anyone to insert (for logging failed attempts)
CREATE POLICY "Anyone can insert security logs"
ON security_audit_log FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow service role to read
CREATE POLICY "Service role can read security logs"
ON security_audit_log FOR SELECT
TO service_role
USING (true);

-- Fix admin_users table RLS if needed
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update own record" ON admin_users;
DROP POLICY IF EXISTS "Service role full access admin_users" ON admin_users;

-- Allow authenticated users to read their own admin record
CREATE POLICY "Admin users can read own record"
ON admin_users FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow authenticated admin users to update their own record (for last_login_at)
CREATE POLICY "Admin users can update own record"
ON admin_users FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Service role full access
CREATE POLICY "Service role full access admin_users"
ON admin_users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure admin_roles table is readable
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read roles" ON admin_roles;
DROP POLICY IF EXISTS "Service role full access roles" ON admin_roles;

CREATE POLICY "Anyone can read roles"
ON admin_roles FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role full access roles"
ON admin_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create helper functions for checking admin status
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON admin_roles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT INSERT ON admin_audit_log TO authenticated;
GRANT INSERT ON security_audit_log TO anon, authenticated;

-- Verify the admin user exists and is properly configured
SELECT
    au.email,
    au.user_id,
    au.is_active,
    ar.role_name,
    'Admin user configured correctly' as status
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach';

-- Test that the functions work
SELECT
    'Testing admin functions for info@leah.coach user' as test,
    is_admin(au.user_id) as is_admin_result,
    is_super_admin(au.user_id) as is_super_admin_result,
    get_admin_role(au.user_id) as role_result
FROM admin_users au
WHERE au.email = 'info@leah.coach';