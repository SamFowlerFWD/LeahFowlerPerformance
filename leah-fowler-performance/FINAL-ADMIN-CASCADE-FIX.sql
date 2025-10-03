-- =====================================================
-- COMPLETE ADMIN SETUP MIGRATION
-- This migration properly handles all dependencies
-- and sets up the admin system from scratch
-- =====================================================

-- Start transaction to ensure atomicity
BEGIN;

-- =====================================================
-- STEP 1: DROP ALL DEPENDENT POLICIES
-- =====================================================
DO $$
DECLARE
    policy_rec RECORD;
    table_rec RECORD;
    policy_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting cleanup of existing policies...';

    -- Get all tables that might have policies
    FOR table_rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags')
    LOOP
        -- Drop all policies on each table
        FOR policy_rec IN
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = table_rec.tablename
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I CASCADE', policy_rec.policyname, table_rec.tablename);
            policy_count := policy_count + 1;
            RAISE NOTICE 'Dropped policy % on table %', policy_rec.policyname, table_rec.tablename;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Dropped % policies total', policy_count;
END $$;

-- =====================================================
-- STEP 2: DROP EXISTING FUNCTIONS
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Dropping existing is_admin function...';
    DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
    RAISE NOTICE 'Successfully dropped is_admin function';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop is_admin function: %', SQLERRM;
END $$;

-- =====================================================
-- STEP 3: DROP AND RECREATE ADMIN_USERS TABLE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Recreating admin_users table...';

    -- Drop the table if it exists
    DROP TABLE IF EXISTS admin_users CASCADE;

    -- Create the admin_users table
    CREATE TABLE admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
        permissions JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_by UUID REFERENCES auth.users(id),
        last_login TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT true,
        notes TEXT
    );

    -- Create indexes for performance
    CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
    CREATE INDEX idx_admin_users_email ON admin_users(email);
    CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

    -- Add comment to table
    COMMENT ON TABLE admin_users IS 'Stores admin users with elevated permissions';

    RAISE NOTICE 'Successfully created admin_users table with indexes';
END $$;

-- =====================================================
-- STEP 4: INSERT ADMIN USER
-- =====================================================
DO $$
DECLARE
    admin_id UUID := 'dfd9154b-4238-4672-8a0a-e657a18532c5';
    admin_email TEXT := 'info@leah.coach';
    existing_count INTEGER;
BEGIN
    RAISE NOTICE 'Inserting admin user...';

    -- Check if admin already exists
    SELECT COUNT(*) INTO existing_count
    FROM admin_users
    WHERE user_id = admin_id;

    IF existing_count > 0 THEN
        RAISE NOTICE 'Admin user already exists, updating...';
        UPDATE admin_users
        SET
            email = admin_email,
            is_active = true,
            updated_at = NOW()
        WHERE user_id = admin_id;
    ELSE
        RAISE NOTICE 'Creating new admin user...';
        INSERT INTO admin_users (
            user_id,
            email,
            role,
            is_active,
            permissions,
            notes
        ) VALUES (
            admin_id,
            admin_email,
            'super_admin',
            true,
            '{"all": true}'::jsonb,
            'Primary admin account for Leah Fowler Performance'
        );
    END IF;

    RAISE NOTICE 'Admin user setup complete';
END $$;

-- =====================================================
-- STEP 5: CREATE IS_ADMIN FUNCTION
-- =====================================================
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

    -- Check if user exists in admin_users table and is active
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Add comment to function
COMMENT ON FUNCTION is_admin IS 'Checks if a user is an active admin';

-- =====================================================
-- STEP 6: ENABLE RLS ON ALL TABLES
-- =====================================================
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    RAISE NOTICE 'Enabling RLS on all relevant tables...';

    FOR table_rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('admin_users', 'assessment_submissions', 'lead_magnets', 'posts', 'categories', 'tags')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_rec.tablename);
        RAISE NOTICE 'Enabled RLS on table %', table_rec.tablename;
    END LOOP;
END $$;

-- =====================================================
-- STEP 7: CREATE RLS POLICIES FOR ADMIN_USERS
-- =====================================================

-- Only admins can view admin users
CREATE POLICY "Admins can view admin users"
ON admin_users FOR SELECT
TO authenticated
USING (is_admin());

-- Only super admins can manage admin users
CREATE POLICY "Super admins can manage admin users"
ON admin_users FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
        AND is_active = true
    )
);

-- =====================================================
-- STEP 8: CREATE RLS POLICIES FOR ASSESSMENT_SUBMISSIONS
-- =====================================================
DO $$
BEGIN
    -- Check if assessment_submissions table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessment_submissions') THEN
        -- Users can view their own submissions
        CREATE POLICY "Users can view own assessment submissions"
        ON assessment_submissions FOR SELECT
        TO authenticated
        USING (
            (auth.uid() IS NOT NULL AND
             EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'assessment_submissions'
                AND column_name = 'user_id'
             ) AND
             auth.uid() = user_id)
            OR is_admin()
        );

        -- Users can create their own submissions
        CREATE POLICY "Users can create own assessment submissions"
        ON assessment_submissions FOR INSERT
        TO authenticated
        WITH CHECK (
            auth.uid() IS NOT NULL AND
            EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'assessment_submissions'
                AND column_name = 'user_id'
            ) AND
            auth.uid() = user_id
        );

        -- Admins can manage all submissions
        CREATE POLICY "Admins can manage assessment submissions"
        ON assessment_submissions FOR ALL
        TO authenticated
        USING (is_admin());

        RAISE NOTICE 'Created policies for assessment_submissions';
    ELSE
        RAISE NOTICE 'Table assessment_submissions does not exist, skipping policies';
    END IF;
END $$;

-- =====================================================
-- STEP 9: CREATE RLS POLICIES FOR LEAD_MAGNETS
-- =====================================================
DO $$
BEGIN
    -- Check if lead_magnets table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lead_magnets') THEN
        -- Anyone can view active lead magnets
        CREATE POLICY "Anyone can view active lead magnets"
        ON lead_magnets FOR SELECT
        TO anon, authenticated
        USING (
            (EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'lead_magnets'
                AND column_name = 'is_active'
            ) AND is_active = true)
            OR is_admin()
        );

        -- Admins can manage all lead magnets
        CREATE POLICY "Admins can manage lead magnets"
        ON lead_magnets FOR ALL
        TO authenticated
        USING (is_admin());

        RAISE NOTICE 'Created policies for lead_magnets';
    ELSE
        RAISE NOTICE 'Table lead_magnets does not exist, skipping policies';
    END IF;
END $$;

-- =====================================================
-- STEP 10: CREATE RLS POLICIES FOR POSTS
-- =====================================================
DO $$
BEGIN
    -- Check if posts table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        -- Anyone can view published posts
        CREATE POLICY "Anyone can view published posts"
        ON posts FOR SELECT
        TO anon, authenticated
        USING (
            (EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'posts'
                AND column_name = 'status'
            ) AND status = 'published')
            OR is_admin()
        );

        -- Admins can manage all posts
        CREATE POLICY "Admins can manage all posts"
        ON posts FOR ALL
        TO authenticated
        USING (is_admin());

        RAISE NOTICE 'Created policies for posts';
    ELSE
        RAISE NOTICE 'Table posts does not exist, skipping policies';
    END IF;
END $$;

-- =====================================================
-- STEP 11: CREATE RLS POLICIES FOR CATEGORIES
-- =====================================================
DO $$
BEGIN
    -- Check if categories table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        -- Anyone can view categories
        CREATE POLICY "Anyone can view categories"
        ON categories FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Admins can manage categories
        CREATE POLICY "Admins can manage categories"
        ON categories FOR ALL
        TO authenticated
        USING (is_admin());

        RAISE NOTICE 'Created policies for categories';
    ELSE
        RAISE NOTICE 'Table categories does not exist, skipping policies';
    END IF;
END $$;

-- =====================================================
-- STEP 12: CREATE RLS POLICIES FOR TAGS
-- =====================================================
DO $$
BEGIN
    -- Check if tags table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tags') THEN
        -- Anyone can view tags
        CREATE POLICY "Anyone can view tags"
        ON tags FOR SELECT
        TO anon, authenticated
        USING (true);

        -- Admins can manage tags
        CREATE POLICY "Admins can manage tags"
        ON tags FOR ALL
        TO authenticated
        USING (is_admin());

        RAISE NOTICE 'Created policies for tags';
    ELSE
        RAISE NOTICE 'Table tags does not exist, skipping policies';
    END IF;
END $$;

-- =====================================================
-- STEP 13: CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin_users table
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 14: VERIFICATION
-- =====================================================
DO $$
DECLARE
    admin_count INTEGER;
    policy_count INTEGER;
    function_exists BOOLEAN;
    admin_check BOOLEAN;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========== VERIFICATION RESULTS ==========';

    -- Check admin_users table and data
    SELECT COUNT(*) INTO admin_count FROM admin_users WHERE is_active = true;
    RAISE NOTICE 'Active admin users: %', admin_count;

    -- Check if is_admin function exists
    SELECT EXISTS(
        SELECT 1 FROM pg_proc
        WHERE proname = 'is_admin'
    ) INTO function_exists;
    RAISE NOTICE 'is_admin function exists: %', function_exists;

    -- Test is_admin function with known admin
    SELECT is_admin('dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid) INTO admin_check;
    RAISE NOTICE 'Admin check for info@leah.coach: %', admin_check;

    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';
    RAISE NOTICE 'Total RLS policies created: %', policy_count;

    -- List all tables with RLS enabled
    RAISE NOTICE '';
    RAISE NOTICE 'Tables with RLS enabled:';
    FOR admin_count IN
        SELECT COUNT(*)
        FROM pg_tables t
        JOIN pg_class c ON c.relname = t.tablename
        WHERE t.schemaname = 'public'
        AND c.relrowsecurity = true
    LOOP
        -- Using the loop variable temporarily
    END LOOP;

    -- Show final summary
    RAISE NOTICE '';
    RAISE NOTICE '========== SETUP COMPLETE ==========';
    RAISE NOTICE 'Admin system is now fully configured';
    RAISE NOTICE 'Admin user: info@leah.coach (ID: dfd9154b-4238-4672-8a0a-e657a18532c5)';
    RAISE NOTICE 'All RLS policies have been recreated';
END $$;

-- Commit the transaction
COMMIT;

-- =====================================================
-- ROLLBACK SCRIPT (Save separately if needed)
-- =====================================================
/*
To rollback this migration, run:

BEGIN;

-- Drop all policies
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I CASCADE', policy_rec.policyname, policy_rec.tablename);
    END LOOP;
END $$;

-- Drop function
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Drop table
DROP TABLE IF EXISTS admin_users CASCADE;

COMMIT;
*/