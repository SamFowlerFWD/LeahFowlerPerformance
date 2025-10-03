-- ============================================================================
-- FIX ADMIN AUTHENTICATION - NO ADMIN_ROLES TABLE VERSION
-- ============================================================================
-- This version doesn't assume admin_roles table exists
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION 1: CREATE OR REPLACE is_admin() FUNCTION
-- ============================================================================

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Use current user if no user_id provided
  IF user_id IS NULL THEN
    user_id := auth.uid();
  END IF;

  -- Return false if still no user_id
  IF user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user exists in admin_users table and is active
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
      AND is_active = true
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- ============================================================================
-- SECTION 2: ENSURE ADMIN USER IS ACTIVE
-- ============================================================================

-- Update admin user to be active
UPDATE public.admin_users
SET is_active = true
WHERE user_id = 'dfd9154b-4238-4672-8a0a-e657a18532c5';

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
-- SECTION 5: CREATE SIMPLE ADMIN POLICIES
-- ============================================================================

-- -------------------------------
-- ADMIN_USERS TABLE POLICIES
-- -------------------------------

-- Admins can view admin users
CREATE POLICY "admins_view_admin_users" ON public.admin_users
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Super admins can manage admin users (check role directly, no admin_roles table)
CREATE POLICY "super_admins_manage_admin_users" ON public.admin_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role = 'super_admin'
    )
  );

-- -------------------------------
-- ASSESSMENT_SUBMISSIONS TABLE POLICIES
-- -------------------------------

-- Public can insert assessments
CREATE POLICY "public_insert_assessments" ON public.assessment_submissions
  FOR INSERT
  WITH CHECK (true);

-- Admins can view all assessments
CREATE POLICY "admins_view_assessments" ON public.assessment_submissions
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can manage all assessments
CREATE POLICY "admins_manage_assessments" ON public.assessment_submissions
  FOR ALL
  USING (is_admin(auth.uid()));

-- -------------------------------
-- LEAD_MAGNETS TABLE POLICIES
-- -------------------------------

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
END;
$$;

-- Admins can manage lead magnets
CREATE POLICY "admins_manage_lead_magnets" ON public.lead_magnets
  FOR ALL
  USING (is_admin(auth.uid()));

-- -------------------------------
-- POSTS TABLE POLICIES
-- -------------------------------

DO $$
BEGIN
  IF temp_column_exists('posts', 'status') THEN
    -- Policy with status check
    EXECUTE $policy$
      CREATE POLICY "public_view_published_posts" ON public.posts
        FOR SELECT
        USING (status = 'published' OR is_admin(auth.uid()))
    $policy$;
  ELSE
    -- Policy without status check
    EXECUTE $policy$
      CREATE POLICY "public_view_posts" ON public.posts
        FOR SELECT
        USING (true)
    $policy$;
  END IF;
END;
$$;

-- Admins can manage posts
CREATE POLICY "admins_manage_posts" ON public.posts
  FOR ALL
  USING (is_admin(auth.uid()));

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
END;
$$;

-- Admins can manage categories
CREATE POLICY "admins_manage_categories" ON public.categories
  FOR ALL
  USING (is_admin(auth.uid()));

-- -------------------------------
-- TAGS TABLE POLICIES (no is_active column)
-- -------------------------------

-- Public can view all tags
CREATE POLICY "public_view_tags" ON public.tags
  FOR SELECT
  USING (true);

-- Admins can manage tags
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
      CREATE POLICY "service_bypass_%1$s" ON public.%1$s
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
-- SECTION 7: CLEAN UP AND VERIFY
-- ============================================================================

-- Clean up temp function
DROP FUNCTION IF EXISTS temp_column_exists(text, text);

-- Verify is_admin function works
DO $$
DECLARE
  v_admin_id UUID := 'dfd9154b-4238-4672-8a0a-e657a18532c5';
  v_is_admin BOOLEAN;
BEGIN
  -- Test the function
  SELECT is_admin(v_admin_id) INTO v_is_admin;

  IF v_is_admin THEN
    RAISE NOTICE '✅ SUCCESS: is_admin function works correctly!';
    RAISE NOTICE 'Admin user dfd9154b-4238-4672-8a0a-e657a18532c5 is recognized as admin';
  ELSE
    RAISE WARNING '❌ PROBLEM: is_admin returned false for admin user';
  END IF;
END;
$$;

-- Show created policies count
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN (
      'admin_users',
      'assessment_submissions',
      'lead_magnets',
      'posts',
      'categories',
      'tags'
    );

  RAISE NOTICE '';
  RAISE NOTICE '=== FINAL SUMMARY ===';
  RAISE NOTICE 'Created % RLS policies', policy_count;
  RAISE NOTICE 'is_admin function created successfully';
  RAISE NOTICE 'Admin user is active';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Admin system is now ready!';
  RAISE NOTICE 'You can login at: https://leah.coach/admin/login';
  RAISE NOTICE 'Email: info@leah.coach';
END;
$$;

COMMIT;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================