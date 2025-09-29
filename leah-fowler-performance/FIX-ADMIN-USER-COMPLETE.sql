-- COMPLETE FIX FOR ADMIN USER SETUP
-- Run this entire script in Supabase SQL Editor

-- Step 1: Check table structure and add missing columns if needed
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Remove any existing entry for this user
DELETE FROM admin_users WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Step 3: Insert the admin user
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
    '{"all": true}'::jsonb,
    true,
    NOW(),
    NOW()
);

-- Step 4: Fix RLS policies - Drop existing and recreate
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated to view audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow admin to insert audit logs" ON admin_audit_log;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create simple permissive policies for admin_users
CREATE POLICY "Allow authenticated read admin_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert admin_users"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update admin_users"
ON admin_users FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policies for admin_audit_log
CREATE POLICY "Allow authenticated read audit_log"
ON admin_audit_log FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert audit_log"
ON admin_audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Create or replace the admin check functions
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_role(check_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM admin_users
    WHERE user_id = check_user_id
    AND is_active = true
    LIMIT 1;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Verify the admin user is properly created
SELECT
    au.user_id,
    au.email,
    au.role,
    au.is_active,
    au.created_at,
    'User exists in admin_users table' as status
FROM admin_users au
WHERE au.user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

-- Step 7: Test the admin functions
SELECT
    is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5') as is_admin_check,
    is_super_admin('dfd9154b-4238-4672-8a0a-e657a18532c5') as is_super_admin_check,
    get_admin_role('dfd9154b-4238-4672-8a0a-e657a18532c5') as role_check;

-- Step 8: Final verification - should return 1 row
SELECT COUNT(*) as admin_count FROM admin_users WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';