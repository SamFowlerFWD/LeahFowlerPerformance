-- =====================================================
-- CREATE ADMIN USER FOR LEAH
-- =====================================================
-- Run this after Leah has created her Supabase Auth account

-- Step 1: First, Leah needs to sign up via Supabase Dashboard:
-- 1. Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/auth/users
-- 2. Click "Invite User"
-- 3. Enter email: leah@strengthpt.co.uk
-- 4. She'll receive an email to set her password

-- Step 2: After she confirms her email and sets password, run this SQL:

-- Find Leah's user ID (run this first to verify)
SELECT id, email, created_at
FROM auth.users
WHERE email = 'leah@strengthpt.co.uk';

-- Create her admin user record (replace USER_ID with the ID from above)
INSERT INTO public.admin_users (
    user_id,
    email,
    role,
    permissions,
    is_active
)
SELECT
    id,
    email,
    'super_admin',
    '{"all": true}'::jsonb,
    true
FROM auth.users
WHERE email = 'leah@strengthpt.co.uk'
ON CONFLICT (email) DO UPDATE
SET
    role = 'super_admin',
    is_active = true,
    updated_at = NOW();

-- Verify the admin user was created
SELECT * FROM public.admin_users WHERE email = 'leah@strengthpt.co.uk';

-- Test the is_admin function
SELECT public.is_admin(
    (SELECT id FROM auth.users WHERE email = 'leah@strengthpt.co.uk')
);

-- =====================================================
-- AFTER SETUP COMPLETE
-- =====================================================
-- Leah can now access the admin panel at:
-- http://168.231.78.49/admin/login
--
-- Username: leah@strengthpt.co.uk
-- Password: [whatever she set during signup]
--
-- The admin dashboard provides:
-- - View all assessment submissions
-- - Create/edit/delete blog posts
-- - Manage categories and tags
-- - View analytics and metrics
-- - Export lead data
-- - Full audit trail of all actions