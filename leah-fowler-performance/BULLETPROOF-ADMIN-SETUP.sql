-- BULLETPROOF Admin Setup Script
-- This script analyzes the current database state and adapts accordingly

-- Start transaction for atomic operation
BEGIN;

-- Create temporary function to check if table exists
CREATE OR REPLACE FUNCTION temp_table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
    );
END;
$$ LANGUAGE plpgsql;

-- Create temporary function to check if column exists
CREATE OR REPLACE FUNCTION temp_column_exists(table_name text, column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Analysis phase: Report current state
DO $$
DECLARE
    v_table_name text;
    v_column_count integer;
    v_has_user_id boolean;
    v_has_author_id boolean;
BEGIN
    RAISE NOTICE '=== DATABASE ANALYSIS STARTED ===';

    -- Check each table
    FOR v_table_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        -- Count columns
        SELECT COUNT(*) INTO v_column_count
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = v_table_name;

        -- Check for user_id
        v_has_user_id := temp_column_exists(v_table_name, 'user_id');

        -- Check for author_id
        v_has_author_id := temp_column_exists(v_table_name, 'author_id');

        RAISE NOTICE 'Table: % | Columns: % | Has user_id: % | Has author_id: %',
            v_table_name, v_column_count, v_has_user_id, v_has_author_id;
    END LOOP;

    RAISE NOTICE '=== ANALYSIS COMPLETE ===';
END $$;

-- Step 1: Create admin_users table
DROP TABLE IF EXISTS admin_users CASCADE;
CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'admin',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Insert admin user
INSERT INTO admin_users (user_id, email, role)
VALUES ('dfd9154b-4238-4672-8a0a-e657a18532c5', 'info@leah.coach', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

RAISE NOTICE 'Admin users table created and admin user inserted';

-- Step 2: Create admin check function
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = check_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Admin check function created';

-- Step 3: Create admin audit log table
DROP TABLE IF EXISTS admin_audit_log CASCADE;
CREATE TABLE admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid NOT NULL,
    action text NOT NULL,
    table_name text,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

RAISE NOTICE 'Admin audit log table created';

-- Step 4: Create audit function
CREATE OR REPLACE FUNCTION log_admin_action(
    p_action text,
    p_table_name text DEFAULT NULL,
    p_record_id uuid DEFAULT NULL,
    p_old_data jsonb DEFAULT NULL,
    p_new_data jsonb DEFAULT NULL
) RETURNS void AS $$
BEGIN
    INSERT INTO admin_audit_log (admin_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), p_action, p_table_name, p_record_id, p_old_data, p_new_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Audit function created';

-- Step 5: Create adaptive RLS policies
DO $$
DECLARE
    v_table_record RECORD;
    v_policy_name text;
    v_policy_sql text;
    v_has_user_id boolean;
    v_has_author_id boolean;
    v_has_created_at boolean;
    v_has_id boolean;
    v_id_column_type text;
BEGIN
    RAISE NOTICE '=== CREATING ADAPTIVE RLS POLICIES ===';

    -- Loop through all tables
    FOR v_table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('admin_users', 'admin_audit_log', 'spatial_ref_sys')
        ORDER BY table_name
    LOOP
        -- Check what columns exist
        v_has_user_id := temp_column_exists(v_table_record.table_name, 'user_id');
        v_has_author_id := temp_column_exists(v_table_record.table_name, 'author_id');
        v_has_created_at := temp_column_exists(v_table_record.table_name, 'created_at');
        v_has_id := temp_column_exists(v_table_record.table_name, 'id');

        -- Get id column type if it exists
        IF v_has_id THEN
            SELECT data_type INTO v_id_column_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = v_table_record.table_name
            AND column_name = 'id';
        END IF;

        RAISE NOTICE 'Processing table: % (user_id: %, author_id: %, id: %)',
            v_table_record.table_name, v_has_user_id, v_has_author_id, v_has_id;

        -- Enable RLS if not already enabled
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', v_table_record.table_name);

        -- Drop existing admin policies for this table
        FOR v_policy_name IN
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = v_table_record.table_name
            AND policyname LIKE 'admin_%'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', v_policy_name, v_table_record.table_name);
        END LOOP;

        -- Create SELECT policy
        v_policy_name := 'admin_select_' || v_table_record.table_name;
        v_policy_sql := format(
            'CREATE POLICY %I ON %I FOR SELECT TO authenticated USING (is_admin() OR %s)',
            v_policy_name,
            v_table_record.table_name,
            CASE
                WHEN v_has_user_id THEN 'user_id = auth.uid()'
                WHEN v_has_author_id THEN 'author_id = auth.uid()'
                ELSE 'true'
            END
        );
        EXECUTE v_policy_sql;
        RAISE NOTICE '  Created SELECT policy for %', v_table_record.table_name;

        -- Create INSERT policy
        v_policy_name := 'admin_insert_' || v_table_record.table_name;
        v_policy_sql := format(
            'CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (is_admin()%s)',
            v_policy_name,
            v_table_record.table_name,
            CASE
                WHEN v_has_user_id THEN ' OR user_id = auth.uid()'
                WHEN v_has_author_id THEN ' OR author_id = auth.uid()'
                ELSE ''
            END
        );
        EXECUTE v_policy_sql;
        RAISE NOTICE '  Created INSERT policy for %', v_table_record.table_name;

        -- Create UPDATE policy
        v_policy_name := 'admin_update_' || v_table_record.table_name;
        v_policy_sql := format(
            'CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (is_admin()%s) WITH CHECK (is_admin()%s)',
            v_policy_name,
            v_table_record.table_name,
            CASE
                WHEN v_has_user_id THEN ' OR user_id = auth.uid()'
                WHEN v_has_author_id THEN ' OR author_id = auth.uid()'
                ELSE ''
            END,
            CASE
                WHEN v_has_user_id THEN ' OR user_id = auth.uid()'
                WHEN v_has_author_id THEN ' OR author_id = auth.uid()'
                ELSE ''
            END
        );
        EXECUTE v_policy_sql;
        RAISE NOTICE '  Created UPDATE policy for %', v_table_record.table_name;

        -- Create DELETE policy
        v_policy_name := 'admin_delete_' || v_table_record.table_name;
        v_policy_sql := format(
            'CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (is_admin()%s)',
            v_policy_name,
            v_table_record.table_name,
            CASE
                WHEN v_has_user_id THEN ' OR user_id = auth.uid()'
                WHEN v_has_author_id THEN ' OR author_id = auth.uid()'
                ELSE ''
            END
        );
        EXECUTE v_policy_sql;
        RAISE NOTICE '  Created DELETE policy for %', v_table_record.table_name;

    END LOOP;

    RAISE NOTICE '=== RLS POLICIES CREATED ===';
END $$;

-- Step 6: Create policies for admin tables
-- Admin users table policies
DROP POLICY IF EXISTS admin_users_select ON admin_users;
CREATE POLICY admin_users_select ON admin_users
    FOR SELECT TO authenticated
    USING (is_admin());

DROP POLICY IF EXISTS admin_users_all ON admin_users;
CREATE POLICY admin_users_all ON admin_users
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Admin audit log policies
DROP POLICY IF EXISTS admin_audit_select ON admin_audit_log;
CREATE POLICY admin_audit_select ON admin_audit_log
    FOR SELECT TO authenticated
    USING (is_admin());

DROP POLICY IF EXISTS admin_audit_insert ON admin_audit_log;
CREATE POLICY admin_audit_insert ON admin_audit_log
    FOR INSERT TO authenticated
    WITH CHECK (is_admin());

RAISE NOTICE 'Admin table policies created';

-- Step 7: Create helper functions for common admin tasks
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE(
    table_name text,
    row_count bigint,
    has_rls boolean,
    policy_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.table_name::text,
        (SELECT COUNT(*) FROM information_schema.tables it WHERE it.table_name = t.table_name)::bigint as row_count,
        COALESCE(rls.rowsecurity, false) as has_rls,
        COALESCE(p.policy_count, 0)::bigint as policy_count
    FROM information_schema.tables t
    LEFT JOIN pg_tables rls ON rls.tablename = t.table_name AND rls.schemaname = 'public'
    LEFT JOIN (
        SELECT tablename, COUNT(*) as policy_count
        FROM pg_policies
        WHERE schemaname = 'public'
        GROUP BY tablename
    ) p ON p.tablename = t.table_name
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Helper functions created';

-- Step 8: Final verification
DO $$
DECLARE
    v_admin_count integer;
    v_table_count integer;
    v_policy_count integer;
BEGIN
    -- Count admins
    SELECT COUNT(*) INTO v_admin_count FROM admin_users;

    -- Count tables with RLS
    SELECT COUNT(*) INTO v_table_count
    FROM pg_tables
    WHERE schemaname = 'public' AND rowsecurity = true;

    -- Count policies
    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'public';

    RAISE NOTICE '=== SETUP COMPLETE ===';
    RAISE NOTICE 'Admin users: %', v_admin_count;
    RAISE NOTICE 'Tables with RLS: %', v_table_count;
    RAISE NOTICE 'Total policies: %', v_policy_count;
    RAISE NOTICE '======================';
END $$;

-- Cleanup temporary functions
DROP FUNCTION IF EXISTS temp_table_exists(text);
DROP FUNCTION IF EXISTS temp_column_exists(text, text);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

RAISE NOTICE 'Permissions granted';

-- Commit transaction
COMMIT;

-- Final summary
SELECT
    'Setup Summary' as status,
    (SELECT COUNT(*) FROM admin_users) as admin_users,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) as tables_with_rls,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_policies;