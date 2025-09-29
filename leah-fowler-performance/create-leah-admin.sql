-- COMPLETE ADMIN SETUP FOR info@leah.coach
-- Run this entire script in Supabase SQL Editor

-- Step 1: Get the User ID and create admin in one go
DO $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
BEGIN
    -- Get the user ID for info@leah.coach
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'info@leah.coach'
    LIMIT 1;

    -- Check if user was found
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email info@leah.coach not found in auth.users. Please create the user first in Authentication > Users';
    END IF;

    -- Get the super_admin role ID
    SELECT id INTO v_role_id
    FROM admin_roles
    WHERE role_name = 'super_admin'
    LIMIT 1;

    -- Check if admin already exists
    IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = v_user_id) THEN
        -- Update existing admin
        UPDATE admin_users
        SET
            email = 'info@leah.coach',
            role_id = v_role_id,
            is_active = true,
            updated_at = NOW()
        WHERE user_id = v_user_id;

        RAISE NOTICE 'Admin user updated for info@leah.coach';
    ELSE
        -- Create new admin
        INSERT INTO admin_users (
            user_id,
            email,
            role_id,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            v_user_id,
            'info@leah.coach',
            v_role_id,
            true,
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Admin user created for info@leah.coach';
    END IF;
END $$;

-- Verify the setup
SELECT
    au.email,
    au.user_id,
    ar.role_name,
    au.is_active,
    au.created_at,
    'Ready to login at https://leah.coach/admin/login' as next_step
FROM admin_users au
JOIN admin_roles ar ON au.role_id = ar.id
WHERE au.email = 'info@leah.coach';

-- Test admin functions
SELECT
    is_admin(au.user_id) as is_admin,
    is_super_admin(au.user_id) as is_super_admin,
    get_admin_role(au.user_id) as role
FROM admin_users au
WHERE au.email = 'info@leah.coach';