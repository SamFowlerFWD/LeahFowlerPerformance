-- ============================================================================
-- STORAGE BUCKET CONFIGURATION FOR LEAH FOWLER PERFORMANCE COACH
-- ============================================================================
-- Version: 1.0.0
-- Date: 2025-09-27
-- Description: Configure Supabase Storage buckets and policies
--
-- This script should be run AFTER the main database migration
-- ============================================================================

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Profile Avatars (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lead Magnets (Private - requires auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-magnets',
  'lead-magnets',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'video/mp4', 'video/quicktime']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Blog Images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, avif_autodetection)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  true -- Enable AVIF auto-conversion for better performance
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  avif_autodetection = EXCLUDED.avif_autodetection;

-- Coaching Resources (Private - coach/client access only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coaching-resources',
  'coaching-resources',
  false,
  104857600, -- 100MB limit
  ARRAY['application/pdf', 'video/mp4', 'video/quicktime', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Performance Data Exports (Private - temporary storage)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exports',
  'exports',
  false,
  10485760, -- 10MB limit
  ARRAY['text/csv', 'application/json', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Assessment Attachments (Private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assessment-attachments',
  'assessment-attachments',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Email Campaign Assets (Private - admin only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'email-assets',
  'email-assets',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Video Content (Public with signed URLs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-content',
  'video-content',
  false,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/webm']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- =========================
-- AVATAR POLICIES
-- =========================

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Public can view all avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- =========================
-- LEAD MAGNET POLICIES
-- =========================

-- Only admins can upload lead magnets
CREATE POLICY "Admins can upload lead magnets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lead-magnets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update lead magnets
CREATE POLICY "Admins can update lead magnets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lead-magnets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Only admins can delete lead magnets
CREATE POLICY "Admins can delete lead magnets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lead-magnets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Authenticated users with valid download can access lead magnets
CREATE POLICY "Users with valid download can access lead magnets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-magnets' AND
  EXISTS (
    SELECT 1 FROM public.lead_magnet_downloads lmd
    JOIN public.lead_magnets lm ON lmd.lead_magnet_id = lm.id
    WHERE lm.file_url LIKE '%' || storage.filename(name) || '%'
    AND lmd.download_expires_at > NOW()
  )
);

-- =========================
-- BLOG IMAGE POLICIES
-- =========================

-- Authors can upload blog images
CREATE POLICY "Authors can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  EXISTS (
    SELECT 1 FROM public.authors
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Authors can update blog images
CREATE POLICY "Authors can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (
    SELECT 1 FROM public.authors
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Authors can delete blog images
CREATE POLICY "Authors can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  EXISTS (
    SELECT 1 FROM public.authors
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Public can view blog images
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- =========================
-- COACHING RESOURCE POLICIES
-- =========================

-- Coaches can upload resources to their folder
CREATE POLICY "Coaches can upload coaching resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'coaching-resources' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Coaches can update their resources
CREATE POLICY "Coaches can update coaching resources"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'coaching-resources' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Coaches can delete their resources
CREATE POLICY "Coaches can delete coaching resources"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'coaching-resources' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Clients can view resources shared with them
CREATE POLICY "Clients can view shared coaching resources"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'coaching-resources' AND
  (
    -- User is a coach/admin
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND ar.role_name IN ('coach', 'admin', 'super_admin')
    )
    OR
    -- User is a client with active coaching sessions
    EXISTS (
      SELECT 1 FROM public.coaching_sessions
      WHERE client_id = auth.uid()
      AND status IN ('scheduled', 'confirmed', 'completed')
    )
  )
);

-- =========================
-- EXPORT POLICIES
-- =========================

-- Users can create their own exports
CREATE POLICY "Users can create own exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'exports' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own exports
CREATE POLICY "Users can view own exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'exports' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own exports
CREATE POLICY "Users can delete own exports"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'exports' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =========================
-- ASSESSMENT ATTACHMENT POLICIES
-- =========================

-- Anyone can upload assessment attachments (with size limits)
CREATE POLICY "Anyone can upload assessment attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'assessment-attachments'
);

-- Admins can view all assessment attachments
CREATE POLICY "Admins can view assessment attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assessment-attachments' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- =========================
-- EMAIL ASSET POLICIES
-- =========================

-- Only admins can manage email assets
CREATE POLICY "Admins can manage email assets"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'email-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  bucket_id = 'email-assets' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('admin', 'super_admin')
  )
);

-- =========================
-- VIDEO CONTENT POLICIES
-- =========================

-- Admins and coaches can upload videos
CREATE POLICY "Admins and coaches can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'video-content' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Admins and coaches can update videos
CREATE POLICY "Admins and coaches can update videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'video-content' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Admins and coaches can delete videos
CREATE POLICY "Admins and coaches can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'video-content' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.admin_roles ar ON au.role_id = ar.id
    WHERE au.user_id = auth.uid()
    AND ar.role_name IN ('coach', 'admin', 'super_admin')
  )
);

-- Authenticated users with active subscriptions can view videos
CREATE POLICY "Subscribers can view video content"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'video-content' AND
  EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND status = 'active'
  )
);

-- ============================================================================
-- STORAGE FUNCTIONS
-- ============================================================================

-- Function to generate signed URL for lead magnet download
CREATE OR REPLACE FUNCTION public.generate_lead_magnet_url(
  p_lead_magnet_id UUID,
  p_email TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_file_url TEXT;
  v_signed_url TEXT;
BEGIN
  -- Get the file URL from lead_magnets table
  SELECT file_url INTO v_file_url
  FROM public.lead_magnets
  WHERE id = p_lead_magnet_id AND is_active = true;

  IF v_file_url IS NULL THEN
    RETURN NULL;
  END IF;

  -- Record the download
  INSERT INTO public.lead_magnet_downloads (
    lead_magnet_id, email, download_url, download_expires_at
  ) VALUES (
    p_lead_magnet_id, p_email, v_file_url, NOW() + INTERVAL '7 days'
  );

  -- In production, this would generate a signed URL using Supabase storage API
  -- For now, return the file URL
  RETURN v_file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old exports (run as scheduled job)
CREATE OR REPLACE FUNCTION public.cleanup_old_exports()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete exports older than 7 days
  WITH deleted AS (
    DELETE FROM storage.objects
    WHERE bucket_id = 'exports'
    AND created_at < NOW() - INTERVAL '7 days'
    RETURNING id
  )
  SELECT COUNT(*) INTO v_deleted_count FROM deleted;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get storage usage by user
CREATE OR REPLACE FUNCTION public.get_user_storage_usage(p_user_id UUID)
RETURNS TABLE (
  bucket_name TEXT,
  file_count BIGINT,
  total_size_bytes BIGINT,
  total_size_mb DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    so.bucket_id::TEXT as bucket_name,
    COUNT(*) as file_count,
    SUM((so.metadata->>'size')::BIGINT) as total_size_bytes,
    ROUND(SUM((so.metadata->>'size')::BIGINT) / 1048576.0, 2) as total_size_mb
  FROM storage.objects so
  WHERE so.owner = p_user_id
  GROUP BY so.bucket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHEDULED JOBS (To be configured in Supabase Dashboard)
-- ============================================================================

/*
Recommended scheduled jobs to configure:

1. Daily Export Cleanup (Run at 2 AM UTC):
   SELECT public.cleanup_old_exports();

2. Monthly Storage Report (Run on 1st of each month):
   SELECT
     bucket_id,
     COUNT(*) as total_files,
     ROUND(SUM((metadata->>'size')::BIGINT) / 1073741824.0, 2) as total_gb
   FROM storage.objects
   GROUP BY bucket_id;

3. Weekly Lead Magnet Download Expiry Check:
   UPDATE public.lead_magnet_downloads
   SET download_url = NULL
   WHERE download_expires_at < NOW()
   AND download_url IS NOT NULL;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

/*
-- Verify buckets created
SELECT id, name, public, file_size_limit
FROM storage.buckets
ORDER BY id;

-- Verify storage policies
SELECT
  bucket_id,
  name,
  action,
  roles
FROM storage.policies
ORDER BY bucket_id, action;

-- Check storage usage
SELECT
  bucket_id,
  COUNT(*) as file_count,
  ROUND(SUM((metadata->>'size')::BIGINT) / 1048576.0, 2) as total_mb
FROM storage.objects
GROUP BY bucket_id;
*/

-- ============================================================================
-- ROLLBACK SCRIPT
-- ============================================================================

/*
-- Remove all storage policies
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload lead magnets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lead magnets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lead magnets" ON storage.objects;
DROP POLICY IF EXISTS "Users with valid download can access lead magnets" ON storage.objects;
DROP POLICY IF EXISTS "Authors can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authors can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authors can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can upload coaching resources" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can update coaching resources" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can delete coaching resources" ON storage.objects;
DROP POLICY IF EXISTS "Clients can view shared coaching resources" ON storage.objects;
DROP POLICY IF EXISTS "Users can create own exports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own exports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own exports" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload assessment attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view assessment attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage email assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins and coaches can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins and coaches can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins and coaches can delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Subscribers can view video content" ON storage.objects;

-- Delete all objects in buckets (CAREFUL!)
DELETE FROM storage.objects WHERE bucket_id IN (
  'avatars', 'lead-magnets', 'blog-images', 'coaching-resources',
  'exports', 'assessment-attachments', 'email-assets', 'video-content'
);

-- Delete buckets
DELETE FROM storage.buckets WHERE id IN (
  'avatars', 'lead-magnets', 'blog-images', 'coaching-resources',
  'exports', 'assessment-attachments', 'email-assets', 'video-content'
);

-- Drop functions
DROP FUNCTION IF EXISTS public.generate_lead_magnet_url(UUID, TEXT);
DROP FUNCTION IF EXISTS public.cleanup_old_exports();
DROP FUNCTION IF EXISTS public.get_user_storage_usage(UUID);
*/

-- ============================================================================
-- END OF STORAGE BUCKET CONFIGURATION
-- ============================================================================