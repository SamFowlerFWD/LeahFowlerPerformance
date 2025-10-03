-- =====================================================
-- QUICK FIX: Add Missing is_admin() Function
-- This fixes the critical issue blocking admin login
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Create the missing is_admin() function
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Creating missing is_admin() function...';

    -- Drop if exists (shouldn't exist but just in case)
    DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
END $$;

-- Create the function (outside DO block)
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    -- If no user_id provided, use current auth user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;

    -- Return false if still no user_id
    IF check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user is an active admin
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;

-- =====================================================
-- STEP 2: Ensure admin user is active
-- =====================================================
DO $$
DECLARE
    admin_id UUID := 'dfd9154b-4238-4672-8a0a-e657a18532c5';
    admin_active BOOLEAN;
BEGIN
    RAISE NOTICE 'Checking admin user status...';

    -- Check if admin is active
    SELECT is_active INTO admin_active
    FROM admin_users
    WHERE user_id = admin_id;

    IF admin_active IS NOT NULL THEN
        IF NOT admin_active THEN
            RAISE NOTICE 'Activating admin user...';
            UPDATE admin_users
            SET is_active = true,
                updated_at = NOW()
            WHERE user_id = admin_id;
        ELSE
            RAISE NOTICE 'Admin user is already active';
        END IF;
    ELSE
        RAISE NOTICE 'Admin user not found - this shouldn''t happen!';
    END IF;
END $$;

-- =====================================================
-- STEP 3: Enable RLS on all relevant tables
-- =====================================================
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    RAISE NOTICE 'Enabling RLS on all tables...';

    FOR table_rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('admin_users', 'admin_audit_log', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_rec.tablename);
        RAISE NOTICE 'Enabled RLS on %', table_rec.tablename;
    END LOOP;
END $$;

-- =====================================================
-- STEP 4: Create/Replace Admin Policies
-- =====================================================
DO $$
DECLARE
    policy_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Creating admin policies...';

    -- Drop and recreate policies for admin_users
    DROP POLICY IF EXISTS "admin_select_admin_users" ON admin_users;
    CREATE POLICY "admin_select_admin_users" ON admin_users
        FOR SELECT
        USING (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    DROP POLICY IF EXISTS "admin_all_admin_users" ON admin_users;
    CREATE POLICY "admin_all_admin_users" ON admin_users
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    -- Policies for assessment_submissions
    DROP POLICY IF EXISTS "users_own_assessments" ON assessment_submissions;
    DROP POLICY IF EXISTS "admin_all_assessments" ON assessment_submissions;

    CREATE POLICY "admin_all_assessments" ON assessment_submissions
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    CREATE POLICY "public_insert_assessments" ON assessment_submissions
        FOR INSERT
        WITH CHECK (true);
    policy_count := policy_count + 1;

    -- Policies for lead_magnets
    DROP POLICY IF EXISTS "public_view_lead_magnets" ON lead_magnets;
    DROP POLICY IF EXISTS "admin_all_lead_magnets" ON lead_magnets;

    CREATE POLICY "public_view_lead_magnets" ON lead_magnets
        FOR SELECT
        USING (is_active = true);
    policy_count := policy_count + 1;

    CREATE POLICY "admin_all_lead_magnets" ON lead_magnets
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    -- Policies for posts
    DROP POLICY IF EXISTS "public_view_posts" ON posts;
    DROP POLICY IF EXISTS "admin_all_posts" ON posts;

    CREATE POLICY "public_view_posts" ON posts
        FOR SELECT
        USING (status = 'published' AND published_at <= NOW());
    policy_count := policy_count + 1;

    CREATE POLICY "admin_all_posts" ON posts
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    -- Policies for categories
    DROP POLICY IF EXISTS "public_view_categories" ON categories;
    DROP POLICY IF EXISTS "admin_all_categories" ON categories;

    CREATE POLICY "public_view_categories" ON categories
        FOR SELECT
        USING (is_active = true);
    policy_count := policy_count + 1;

    CREATE POLICY "admin_all_categories" ON categories
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    -- Policies for tags
    DROP POLICY IF EXISTS "public_view_tags" ON tags;
    DROP POLICY IF EXISTS "admin_all_tags" ON tags;

    CREATE POLICY "public_view_tags" ON tags
        FOR SELECT
        USING (is_active = true);
    policy_count := policy_count + 1;

    CREATE POLICY "admin_all_tags" ON tags
        FOR ALL
        USING (is_admin(auth.uid()))
        WITH CHECK (is_admin(auth.uid()));
    policy_count := policy_count + 1;

    RAISE NOTICE 'Created % policies', policy_count;
END $$;

-- =====================================================
-- STEP 5: Test the function
-- =====================================================
DO $$
DECLARE
    admin_id UUID := 'dfd9154b-4238-4672-8a0a-e657a18532c5';
    test_result BOOLEAN;
BEGIN
    RAISE NOTICE 'Testing is_admin function...';

    -- Test with admin user
    test_result := is_admin(admin_id);

    IF test_result THEN
        RAISE NOTICE '✅ SUCCESS: is_admin function works correctly!';
    ELSE
        RAISE WARNING '❌ PROBLEM: is_admin returned false for admin user';
    END IF;
END $$;

-- =====================================================
-- STEP 6: Final Verification
-- =====================================================
DO $$
DECLARE
    func_count INTEGER;
    admin_count INTEGER;
    policy_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== FINAL VERIFICATION ===';

    -- Check function exists
    SELECT COUNT(*) INTO func_count
    FROM pg_proc
    WHERE proname = 'is_admin'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

    -- Check admin user exists
    SELECT COUNT(*) INTO admin_count
    FROM admin_users
    WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5'
    AND is_active = true;

    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND policyname LIKE '%admin%';

    RAISE NOTICE 'is_admin function exists: %', CASE WHEN func_count > 0 THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Admin user active: %', CASE WHEN admin_count > 0 THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Admin policies created: %', policy_count;

    IF func_count > 0 AND admin_count > 0 AND policy_count > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '🎉 SUCCESS! Admin system is now fully functional!';
        RAISE NOTICE 'You can now login at: https://leah.coach/admin/login';
        RAISE NOTICE 'Email: info@leah.coach';
    END IF;
END $$;

COMMIT;

-- =====================================================
-- END OF MIGRATION
-- =====================================================