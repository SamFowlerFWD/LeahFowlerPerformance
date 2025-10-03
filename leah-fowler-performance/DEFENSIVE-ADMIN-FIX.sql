-- ============================================================================
-- FIX ADMIN AUTHENTICATION AND RLS POLICIES - DEFENSIVE VERSION
-- ============================================================================
-- Version: 2.0.0
-- Date: 2025-01-29
-- Description: Defensive migration that adapts to actual table structure
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE OR REPLACE is_admin() FUNCTION
-- ============================================================================

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Check if user exists in admin_users table and is active
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
      AND is_active = true
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- ============================================================================
-- SECTION 2: ENSURE ADMIN USER IS ACTIVE
-- ============================================================================

-- Create temp function to check column existence
CREATE OR REPLACE FUNCTION temp_column_exists(
  p_table_name text,
  p_column_name text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table_name
      AND column_name = p_column_name
  );
END;
$$;

-- Update admin user to be active (if the column exists)
DO $$
BEGIN
  IF temp_column_exists('admin_users', 'is_active') THEN
    UPDATE public.admin_users
    SET is_active = true
    WHERE user_id IN (
      SELECT id FROM auth.users
      WHERE email = 'leah@leahfowlerperformance.com'
    );

    -- Log the update
    RAISE NOTICE 'Updated admin_users.is_active for leah@leahfowlerperformance.com';
  END IF;
END;
$$;

-- ============================================================================
-- SECTION 3: DROP ALL EXISTING POLICIES (CLEAN SLATE)
-- ============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop all existing policies for our target tables
  FOR r IN (
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'admin_users',
        'assessment_submissions',
        'lead_magnets',
        'posts',
        'categories',
        'tags'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    RAISE NOTICE 'Dropped policy % on table %', r.policyname, r.tablename;
  END LOOP;
END;
$$;

-- ============================================================================
-- SECTION 4: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 5: CREATE ADAPTIVE POLICIES BASED ON TABLE STRUCTURE
-- ============================================================================

-- -------------------------------
-- ADMIN_USERS TABLE POLICIES
-- -------------------------------

-- Public can view active admins (needed for auth checks)
CREATE POLICY "public_view_active_admins" ON public.admin_users
  FOR SELECT
  USING (is_active = true);

-- Admins can view all admin users
CREATE POLICY "admins_view_all_admin_users" ON public.admin_users
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Super admins can manage admin users
CREATE POLICY "super_admins_manage_admin_users" ON public.admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND ar.role_name = 'super_admin'
    )
  );

-- -------------------------------
-- ASSESSMENT_SUBMISSIONS TABLE POLICIES
-- -------------------------------

DO $$
BEGIN
  -- Check for gdpr columns
  IF temp_column_exists('assessment_submissions', 'gdpr_consent_given') AND
     temp_column_exists('assessment_submissions', 'gdpr_deletion_requested') THEN

    -- Policy with GDPR checks
    EXECUTE $policy$
      CREATE POLICY "public_insert_with_gdpr" ON public.assessment_submissions
        FOR INSERT
        WITH CHECK (
          gdpr_consent_given = true
          AND gdpr_deletion_requested IS NOT false
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "users_view_own_non_deleted" ON public.assessment_submissions
        FOR SELECT
        USING (
          (email = current_setting('request.jwt.claims', true)::json->>'email'
           AND gdpr_deletion_requested != true)
          OR is_admin(auth.uid())
        )
    $policy$;

  ELSE
    -- Simpler policies without GDPR columns
    EXECUTE $policy$
      CREATE POLICY "public_insert_assessments" ON public.assessment_submissions
        FOR INSERT
        WITH CHECK (true)
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "users_view_own_assessments" ON public.assessment_submissions
        FOR SELECT
        USING (
          email = current_setting('request.jwt.claims', true)::json->>'email'
          OR is_admin(auth.uid())
        )
    $policy$;
  END IF;

  -- Admin policies (always the same)
  EXECUTE $policy$
    CREATE POLICY "admins_manage_assessments" ON public.assessment_submissions
      FOR ALL
      USING (is_admin(auth.uid()))
  $policy$;

END;
$$;

-- -------------------------------
-- LEAD_MAGNETS TABLE POLICIES
-- -------------------------------

DO $$
BEGIN
  IF temp_column_exists('lead_magnets', 'is_active') THEN
    -- Policy with is_active check
    EXECUTE $policy$
      CREATE POLICY "public_view_active_lead_magnets" ON public.lead_magnets
        FOR SELECT
        USING (is_active = true OR is_admin(auth.uid()))
    $policy$;
  ELSE
    -- Policy without is_active check
    EXECUTE $policy$
      CREATE POLICY "public_view_lead_magnets" ON public.lead_magnets
        FOR SELECT
        USING (true)
    $policy$;
  END IF;

  -- Admin policies
  EXECUTE $policy$
    CREATE POLICY "admins_manage_lead_magnets" ON public.lead_magnets
      FOR ALL
      USING (is_admin(auth.uid()))
  $policy$;
END;
$$;

-- -------------------------------
-- POSTS TABLE POLICIES
-- -------------------------------

DO $$
BEGIN
  -- Check what columns exist
  IF temp_column_exists('posts', 'status') AND
     temp_column_exists('posts', 'deleted_at') THEN

    -- Full policy with status and soft delete
    EXECUTE $policy$
      CREATE POLICY "public_view_published_posts" ON public.posts
        FOR SELECT
        USING (
          (status = 'published' AND deleted_at IS NULL)
          OR is_admin(auth.uid())
        )
    $policy$;

  ELSIF temp_column_exists('posts', 'status') THEN

    -- Policy with just status
    EXECUTE $policy$
      CREATE POLICY "public_view_published_posts" ON public.posts
        FOR SELECT
        USING (status = 'published' OR is_admin(auth.uid()))
    $policy$;

  ELSIF temp_column_exists('posts', 'is_published') THEN

    -- Policy with is_published flag
    EXECUTE $policy$
      CREATE POLICY "public_view_published_posts" ON public.posts
        FOR SELECT
        USING (is_published = true OR is_admin(auth.uid()))
    $policy$;

  ELSE
    -- Fallback - public can view all
    EXECUTE $policy$
      CREATE POLICY "public_view_posts" ON public.posts
        FOR SELECT
        USING (true)
    $policy$;
  END IF;

  -- Admin policies
  EXECUTE $policy$
    CREATE POLICY "admins_manage_posts" ON public.posts
      FOR ALL
      USING (is_admin(auth.uid()))
  $policy$;
END;
$$;

-- -------------------------------
-- CATEGORIES TABLE POLICIES
-- -------------------------------

DO $$
BEGIN
  IF temp_column_exists('categories', 'is_active') THEN
    -- Policy with is_active check
    EXECUTE $policy$
      CREATE POLICY "public_view_active_categories" ON public.categories
        FOR SELECT
        USING (is_active = true OR is_admin(auth.uid()))
    $policy$;
  ELSE
    -- Policy without is_active check
    EXECUTE $policy$
      CREATE POLICY "public_view_categories" ON public.categories
        FOR SELECT
        USING (true)
    $policy$;
  END IF;

  -- Admin policies
  EXECUTE $policy$
    CREATE POLICY "admins_manage_categories" ON public.categories
      FOR ALL
      USING (is_admin(auth.uid()))
  $policy$;
END;
$$;

-- -------------------------------
-- TAGS TABLE POLICIES
-- -------------------------------

-- Tags table doesn't have is_active column
CREATE POLICY "public_view_tags" ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "admins_manage_tags" ON public.tags
  FOR ALL
  USING (is_admin(auth.uid()));

-- ============================================================================
-- SECTION 6: CREATE SERVICE ROLE BYPASS POLICIES
-- ============================================================================

-- Service role can bypass RLS on all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'admin_users',
        'assessment_submissions',
        'lead_magnets',
        'posts',
        'categories',
        'tags'
      )
  ) LOOP
    EXECUTE format($policy$
      CREATE POLICY "service_role_bypass_%1$s" ON public.%1$s
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true)
    $policy$, r.tablename);

    RAISE NOTICE 'Created service role bypass policy for %', r.tablename;
  END LOOP;
END;
$$;

-- ============================================================================
-- SECTION 7: CLEAN UP TEMP FUNCTION
-- ============================================================================

DROP FUNCTION IF EXISTS temp_column_exists(text, text);

-- ============================================================================
-- SECTION 8: VERIFICATION QUERIES
-- ============================================================================

-- Verify is_admin function works
DO $$
DECLARE
  v_admin_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  -- Get admin user ID
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'leah@leahfowlerperformance.com'
  LIMIT 1;

  IF v_admin_id IS NOT NULL THEN
    -- Test the function
    SELECT is_admin(v_admin_id) INTO v_is_admin;
    RAISE NOTICE 'Admin check for leah@leahfowlerperformance.com: %', v_is_admin;
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users';
  END IF;
END;
$$;

-- Show created policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'admin_users',
    'assessment_submissions',
    'lead_magnets',
    'posts',
    'categories',
    'tags'
  )
ORDER BY tablename, policyname;

-- ============================================================================
-- ROLLBACK SCRIPT
-- ============================================================================

/*
To rollback this migration:

-- Drop all policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'admin_users',
        'assessment_submissions',
        'lead_magnets',
        'posts',
        'categories',
        'tags'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END;
$$;

-- Drop the is_admin function
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

*/