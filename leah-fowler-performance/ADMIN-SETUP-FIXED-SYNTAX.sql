-- Admin System Setup with Proper DO Block Structure
-- All RAISE NOTICE statements are within PL/pgSQL contexts

BEGIN;

-- Step 1: Analyze existing database structure
DO $$
DECLARE
    table_rec RECORD;
    col_rec RECORD;
    policy_rec RECORD;
    v_table_count INTEGER;
    v_policy_count INTEGER;
BEGIN
    RAISE NOTICE '=== Starting Admin System Setup ===';
    RAISE NOTICE 'Timestamp: %', NOW();

    -- Count existing tables
    SELECT COUNT(*) INTO v_table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';

    RAISE NOTICE 'Found % tables in public schema', v_table_count;

    -- List all tables with their columns
    FOR table_rec IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        RAISE NOTICE 'Table: %', table_rec.table_name;

        -- List columns for each table
        FOR col_rec IN
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_rec.table_name
            ORDER BY ordinal_position
            LIMIT 5  -- Show first 5 columns only
        LOOP
            RAISE NOTICE '  Column: % (%)', col_rec.column_name, col_rec.data_type;
        END LOOP;
    END LOOP;

    -- Count existing RLS policies
    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'public';

    RAISE NOTICE 'Found % existing RLS policies', v_policy_count;
END $$;

-- Step 2: Create admin_users table if it doesn't exist
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_user_exists BOOLEAN;
BEGIN
    -- Check if admin_users table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'admin_users'
    ) INTO v_table_exists;

    IF NOT v_table_exists THEN
        RAISE NOTICE 'Creating admin_users table...';

        CREATE TABLE public.admin_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL DEFAULT 'admin',
            permissions JSONB DEFAULT '{"full_access": true}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_by UUID,
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMPTZ,
            metadata JSONB DEFAULT '{}'::jsonb
        );

        -- Create indexes
        CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
        CREATE INDEX idx_admin_users_email ON public.admin_users(email);
        CREATE INDEX idx_admin_users_is_active ON public.admin_users(is_active);

        -- Add comments
        COMMENT ON TABLE public.admin_users IS 'Admin users with elevated privileges';
        COMMENT ON COLUMN public.admin_users.permissions IS 'JSON object containing specific permissions';

        -- Enable RLS
        ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

        RAISE NOTICE 'admin_users table created successfully';
    ELSE
        RAISE NOTICE 'admin_users table already exists';
    END IF;

    -- Check if admin user exists
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE NOTICE 'Inserting admin user...';

        INSERT INTO public.admin_users (
            user_id,
            email,
            role,
            permissions,
            is_active,
            metadata
        ) VALUES (
            'dfd9154b-4238-4672-8a0a-e657a18532c5'::uuid,
            'info@leah.coach',
            'super_admin',
            '{"full_access": true, "can_manage_admins": true, "can_access_all_data": true}'::jsonb,
            true,
            '{"created_via": "migration", "version": "1.0"}'::jsonb
        );

        RAISE NOTICE 'Admin user inserted successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- Step 3: Create admin check functions
DO $$
DECLARE
    v_function_exists BOOLEAN;
BEGIN
    -- Drop existing function if it exists
    DROP FUNCTION IF EXISTS public.is_admin(UUID);

    RAISE NOTICE 'Creating is_admin function...';
END $$;

-- Create the is_admin function (outside DO block as CREATE FUNCTION has its own context)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $func$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = user_uuid
        AND is_active = true
    );
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create current user admin check function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $func$
BEGIN
    RETURN public.is_admin(auth.uid());
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create admin or owner check function
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(owner_id UUID)
RETURNS BOOLEAN AS $func$
BEGIN
    RETURN auth.uid() = owner_id OR public.is_admin(auth.uid());
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 4: Create adaptive RLS policies for existing tables
DO $$
DECLARE
    table_rec RECORD;
    v_has_user_id BOOLEAN;
    v_has_owner_id BOOLEAN;
    v_has_created_by BOOLEAN;
    v_policy_name TEXT;
    v_policy_exists BOOLEAN;
BEGIN
    RAISE NOTICE 'Creating adaptive RLS policies for existing tables...';

    FOR table_rec IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('admin_users', 'schema_migrations')
        ORDER BY table_name
    LOOP
        RAISE NOTICE 'Processing table: %', table_rec.table_name;

        -- Check what user-related columns exist
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_rec.table_name
            AND column_name = 'user_id'
        ) INTO v_has_user_id;

        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_rec.table_name
            AND column_name = 'owner_id'
        ) INTO v_has_owner_id;

        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = table_rec.table_name
            AND column_name = 'created_by'
        ) INTO v_has_created_by;

        -- Enable RLS on the table
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_rec.table_name);

        -- Create admin bypass policy (SELECT)
        v_policy_name := 'admin_select_' || table_rec.table_name;
        SELECT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = table_rec.table_name
            AND policyname = v_policy_name
        ) INTO v_policy_exists;

        IF NOT v_policy_exists THEN
            EXECUTE format(
                'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_admin(auth.uid()))',
                v_policy_name,
                table_rec.table_name
            );
            RAISE NOTICE '  Created SELECT policy: %', v_policy_name;
        END IF;

        -- Create admin bypass policy (INSERT)
        v_policy_name := 'admin_insert_' || table_rec.table_name;
        SELECT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = table_rec.table_name
            AND policyname = v_policy_name
        ) INTO v_policy_exists;

        IF NOT v_policy_exists THEN
            EXECUTE format(
                'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()))',
                v_policy_name,
                table_rec.table_name
            );
            RAISE NOTICE '  Created INSERT policy: %', v_policy_name;
        END IF;

        -- Create admin bypass policy (UPDATE)
        v_policy_name := 'admin_update_' || table_rec.table_name;
        SELECT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = table_rec.table_name
            AND policyname = v_policy_name
        ) INTO v_policy_exists;

        IF NOT v_policy_exists THEN
            EXECUTE format(
                'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()))',
                v_policy_name,
                table_rec.table_name
            );
            RAISE NOTICE '  Created UPDATE policy: %', v_policy_name;
        END IF;

        -- Create admin bypass policy (DELETE)
        v_policy_name := 'admin_delete_' || table_rec.table_name;
        SELECT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = table_rec.table_name
            AND policyname = v_policy_name
        ) INTO v_policy_exists;

        IF NOT v_policy_exists THEN
            EXECUTE format(
                'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.is_admin(auth.uid()))',
                v_policy_name,
                table_rec.table_name
            );
            RAISE NOTICE '  Created DELETE policy: %', v_policy_name;
        END IF;

        -- Create user-specific policies based on available columns
        IF v_has_user_id THEN
            v_policy_name := 'user_own_access_' || table_rec.table_name;
            SELECT EXISTS (
                SELECT 1 FROM pg_policies
                WHERE schemaname = 'public'
                AND tablename = table_rec.table_name
                AND policyname = v_policy_name
            ) INTO v_policy_exists;

            IF NOT v_policy_exists THEN
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()))',
                    v_policy_name,
                    table_rec.table_name
                );
                RAISE NOTICE '  Created user_id based policy: %', v_policy_name;
            END IF;
        ELSIF v_has_owner_id THEN
            v_policy_name := 'owner_access_' || table_rec.table_name;
            SELECT EXISTS (
                SELECT 1 FROM pg_policies
                WHERE schemaname = 'public'
                AND tablename = table_rec.table_name
                AND policyname = v_policy_name
            ) INTO v_policy_exists;

            IF NOT v_policy_exists THEN
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (owner_id = auth.uid() OR public.is_admin(auth.uid()))',
                    v_policy_name,
                    table_rec.table_name
                );
                RAISE NOTICE '  Created owner_id based policy: %', v_policy_name;
            END IF;
        ELSIF v_has_created_by THEN
            v_policy_name := 'creator_access_' || table_rec.table_name;
            SELECT EXISTS (
                SELECT 1 FROM pg_policies
                WHERE schemaname = 'public'
                AND tablename = table_rec.table_name
                AND policyname = v_policy_name
            ) INTO v_policy_exists;

            IF NOT v_policy_exists THEN
                EXECUTE format(
                    'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (created_by = auth.uid() OR public.is_admin(auth.uid()))',
                    v_policy_name,
                    table_rec.table_name
                );
                RAISE NOTICE '  Created created_by based policy: %', v_policy_name;
            END IF;
        END IF;
    END LOOP;
END $$;

-- Step 5: Create admin management functions
CREATE OR REPLACE FUNCTION public.add_admin(
    p_user_id UUID,
    p_email TEXT,
    p_role TEXT DEFAULT 'admin',
    p_permissions JSONB DEFAULT '{"full_access": true}'::jsonb
)
RETURNS BOOLEAN AS $func$
DECLARE
    v_success BOOLEAN := false;
BEGIN
    -- Only allow existing admins to add new admins
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can add new admins';
    END IF;

    INSERT INTO public.admin_users (user_id, email, role, permissions, created_by)
    VALUES (p_user_id, p_email, p_role, p_permissions, auth.uid())
    ON CONFLICT (user_id) DO UPDATE
    SET role = EXCLUDED.role,
        permissions = EXCLUDED.permissions,
        updated_at = NOW()
    RETURNING true INTO v_success;

    RETURN v_success;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.remove_admin(p_user_id UUID)
RETURNS BOOLEAN AS $func$
DECLARE
    v_success BOOLEAN := false;
BEGIN
    -- Only allow existing admins to remove admins
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can remove admins';
    END IF;

    -- Prevent removing self
    IF p_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot remove yourself as admin';
    END IF;

    UPDATE public.admin_users
    SET is_active = false, updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING true INTO v_success;

    RETURN v_success;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create audit log table for admin actions
DO $$
DECLARE
    v_table_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'admin_audit_log'
    ) INTO v_table_exists;

    IF NOT v_table_exists THEN
        RAISE NOTICE 'Creating admin_audit_log table...';

        CREATE TABLE public.admin_audit_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            admin_id UUID NOT NULL,
            action TEXT NOT NULL,
            table_name TEXT,
            record_id UUID,
            old_data JSONB,
            new_data JSONB,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
        CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
        CREATE INDEX idx_admin_audit_log_table_name ON public.admin_audit_log(table_name);

        ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

        -- Only admins can view audit logs
        CREATE POLICY admin_audit_log_select ON public.admin_audit_log
            FOR SELECT TO authenticated
            USING (public.is_admin(auth.uid()));

        -- Only system can insert (via triggers)
        CREATE POLICY admin_audit_log_insert ON public.admin_audit_log
            FOR INSERT TO authenticated
            WITH CHECK (false);

        RAISE NOTICE 'admin_audit_log table created successfully';
    ELSE
        RAISE NOTICE 'admin_audit_log table already exists';
    END IF;
END $$;

-- Step 7: Create trigger function for audit logging
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER AS $func$
BEGIN
    -- Only log if action is performed by an admin
    IF public.is_admin(auth.uid()) THEN
        INSERT INTO public.admin_audit_log (
            admin_id,
            action,
            table_name,
            record_id,
            old_data,
            new_data
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            CASE
                WHEN TG_OP = 'DELETE' THEN (OLD.id)::UUID
                ELSE (NEW.id)::UUID
            END,
            CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
            CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
        );
    END IF;

    RETURN CASE
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Final summary
DO $$
DECLARE
    v_admin_count INTEGER;
    v_table_count INTEGER;
    v_policy_count INTEGER;
    v_function_count INTEGER;
BEGIN
    -- Count admins
    SELECT COUNT(*) INTO v_admin_count
    FROM public.admin_users
    WHERE is_active = true;

    -- Count tables with RLS
    SELECT COUNT(*) INTO v_table_count
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public'
    AND c.relrowsecurity = true;

    -- Count policies
    SELECT COUNT(*) INTO v_policy_count
    FROM pg_policies
    WHERE schemaname = 'public';

    -- Count functions
    SELECT COUNT(*) INTO v_function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name LIKE '%admin%';

    RAISE NOTICE '=== Admin System Setup Complete ===';
    RAISE NOTICE 'Active admins: %', v_admin_count;
    RAISE NOTICE 'Tables with RLS: %', v_table_count;
    RAISE NOTICE 'Total policies: %', v_policy_count;
    RAISE NOTICE 'Admin functions: %', v_function_count;
    RAISE NOTICE 'Setup completed at: %', NOW();
END $$;

COMMIT;

-- Post-installation verification queries (commented out, run manually if needed)
/*
-- Verify admin user
SELECT * FROM public.admin_users;

-- Check if current user is admin
SELECT public.is_admin(auth.uid());

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- List all admin functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%admin%';

-- Check tables with RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
AND c.relrowsecurity = true;
*/