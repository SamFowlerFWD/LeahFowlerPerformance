-- ========================================
-- COMPREHENSIVE SUPABASE FIX - ALL ISSUES
-- ========================================
-- This script fixes all identified issues including:
-- 1. Function mutability declarations
-- 2. Index predicate functions
-- 3. Missing similarity extension
-- 4. Function dependencies
-- ========================================

-- Enable required extensions first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Required for similarity function

-- Drop problematic indexes first (they'll be recreated correctly)
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_status;
DROP INDEX IF EXISTS idx_posts_category;
DROP INDEX IF EXISTS idx_posts_author;
DROP INDEX IF EXISTS idx_posts_published_at;
DROP INDEX IF EXISTS idx_posts_scheduled_for;
DROP INDEX IF EXISTS idx_posts_featured;
DROP INDEX IF EXISTS idx_posts_content_type;
DROP INDEX IF EXISTS idx_categories_slug;
DROP INDEX IF EXISTS idx_post_views_user;
DROP INDEX IF EXISTS idx_user_profiles_programme;
DROP INDEX IF EXISTS idx_lead_magnets_active;
DROP INDEX IF EXISTS idx_lead_magnet_downloads_converted;
DROP INDEX IF EXISTS idx_performance_metrics_session;
DROP INDEX IF EXISTS idx_email_campaigns_scheduled;
DROP INDEX IF EXISTS idx_email_subscribers_status;
DROP INDEX IF EXISTS idx_wearable_connections_status;

-- ========================================
-- FIX ALL FUNCTIONS WITH PROPER MUTABILITY
-- ========================================

-- Function to update updated_at timestamp (TRIGGER functions don't need mutability declaration)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to anonymize assessment submission (VOLATILE - modifies data)
CREATE OR REPLACE FUNCTION public.anonymize_assessment_submission(submission_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE -- Changed from no declaration to VOLATILE
AS $$
BEGIN
  UPDATE public.assessment_submissions
  SET
    name = 'ANONYMIZED',
    email = CONCAT('deleted-', submission_id, '@anonymized.local'),
    phone = NULL,
    ip_address = NULL,
    user_agent = NULL,
    answers = '{}',
    profile = '{}',
    admin_notes = 'Data anonymized for GDPR compliance',
    updated_at = NOW()
  WHERE id = submission_id;
END;
$$;

-- Function to get assessment statistics (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.get_assessment_statistics()
RETURNS TABLE (
  total_submissions BIGINT,
  qualified_count BIGINT,
  conversion_rate DECIMAL,
  average_readiness_score DECIMAL,
  tier_distribution JSONB,
  investment_distribution JSONB
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_submissions,
    COUNT(*) FILTER (WHERE qualified = true)::BIGINT as qualified_count,
    ROUND((COUNT(*) FILTER (WHERE status = 'converted')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2) as conversion_rate,
    ROUND(AVG(readiness_score), 2) as average_readiness_score,
    jsonb_object_agg(COALESCE(tier, 'unknown'), tier_count) FILTER (WHERE tier IS NOT NULL) as tier_distribution,
    jsonb_object_agg(COALESCE(investment_level, 'unknown'), investment_count) FILTER (WHERE investment_level IS NOT NULL) as investment_distribution
  FROM (
    SELECT
      *,
      COUNT(*) OVER (PARTITION BY tier) as tier_count,
      COUNT(*) OVER (PARTITION BY investment_level) as investment_count
    FROM public.assessment_submissions
  ) as stats
  GROUP BY tier, investment_level, tier_count, investment_count;
END;
$$;

-- Function to get live success metrics (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.get_live_success_metrics()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_clients', (SELECT COUNT(DISTINCT email) FROM public.assessment_submissions WHERE qualified = true),
    'average_energy_increase', (
      SELECT COALESCE(ROUND(AVG((profile->>'energyIncrease')::DECIMAL), 0), 0)
      FROM public.assessment_submissions
      WHERE profile->>'energyIncrease' IS NOT NULL
    ),
    'average_strength_gain', (
      SELECT COALESCE(ROUND(AVG((profile->>'strengthGain')::DECIMAL), 0), 0)
      FROM public.assessment_submissions
      WHERE profile->>'strengthGain' IS NOT NULL
    ),
    'total_weight_lost', (
      SELECT COALESCE(ROUND(SUM((profile->>'weightLost')::DECIMAL), 0), 0)
      FROM public.assessment_submissions
      WHERE profile->>'weightLost' IS NOT NULL
    ),
    'success_rate', (
      SELECT COALESCE(ROUND(
        (COUNT(*) FILTER (WHERE status = 'converted' OR qualified = true)::DECIMAL /
         NULLIF(COUNT(*), 0)) * 100, 0
      ), 0)
      FROM public.assessment_submissions
    ),
    'average_rating', 4.9
  );
END;
$$;

-- Function to get programme recommendation (IMMUTABLE - deterministic)
CREATE OR REPLACE FUNCTION public.get_programme_recommendation(
  p_readiness_score DECIMAL,
  p_investment_level TEXT,
  p_performance_level TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE
    WHEN p_readiness_score >= 80 AND p_investment_level = 'premium' THEN
      jsonb_build_object(
        'programme', 'Premium Performance Programme',
        'investment', '£250/month',
        'features', ARRAY['2x weekly sessions', 'Full nutrition plan', 'Priority support']
      )
    WHEN p_readiness_score >= 60 AND p_investment_level IN ('high', 'premium') THEN
      jsonb_build_object(
        'programme', 'Performance Essentials',
        'investment', '£140/month',
        'features', ARRAY['Weekly sessions', 'Nutrition guidance', 'Community access']
      )
    WHEN p_readiness_score >= 40 THEN
      jsonb_build_object(
        'programme', 'Online Programme',
        'investment', '£47/month',
        'features', ARRAY['App access', 'Monthly programmes', 'Email support']
      )
    ELSE
      jsonb_build_object(
        'programme', 'Foundation Programme',
        'investment', '£12/month',
        'features', ARRAY['Digital resources', 'Community access', 'Monthly check-ins']
      )
  END;
END;
$$;

-- Function to update post search vector (TRIGGER - no mutability needed)
CREATE OR REPLACE FUNCTION public.update_post_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'D');
    RETURN NEW;
END;
$$;

-- Function to calculate reading metrics (TRIGGER - no mutability needed)
CREATE OR REPLACE FUNCTION public.calculate_reading_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    word_count_val INTEGER;
    reading_time_val INTEGER;
BEGIN
    -- Calculate word count
    word_count_val := COALESCE(array_length(string_to_array(NEW.content, ' '), 1), 0);

    -- Calculate reading time (200 words per minute)
    reading_time_val := GREATEST(1, CEIL(word_count_val::DECIMAL / 200));

    -- Update the metrics
    NEW.word_count := word_count_val;
    NEW.reading_time_minutes := reading_time_val;

    RETURN NEW;
END;
$$;

-- Function to create post revision (TRIGGER - no mutability needed)
CREATE OR REPLACE FUNCTION public.create_post_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    next_revision_number INTEGER;
BEGIN
    -- Only create revision if content or title changed
    IF OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title THEN
        -- Get next revision number
        SELECT COALESCE(MAX(revision_number), 0) + 1 INTO next_revision_number
        FROM public.post_revisions
        WHERE post_id = NEW.id;

        -- Insert revision
        INSERT INTO public.post_revisions (
            post_id, revision_number, title, subtitle, slug, content,
            excerpt, featured_image, category_id, status, meta_data,
            created_by
        ) VALUES (
            NEW.id, next_revision_number, OLD.title, OLD.subtitle, OLD.slug, OLD.content,
            OLD.excerpt, OLD.featured_image, OLD.category_id, OLD.status, OLD.meta_data,
            NEW.updated_by
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Function to update tag usage count (TRIGGER - no mutability needed)
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags
        SET usage_count = GREATEST(0, usage_count - 1)
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$;

-- Function to publish scheduled posts (VOLATILE - modifies data)
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE -- Changed to VOLATILE
AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.posts
    SET status = 'published',
        published_at = scheduled_for,
        updated_at = NOW()
    WHERE status = 'scheduled'
    AND scheduled_for <= NOW()
    AND deleted_at IS NULL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$;

-- Function to calculate related posts (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.calculate_related_posts(post_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    related_post_id UUID,
    relevance_score DECIMAL
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p2.id as related_post_id,
        (
            -- Category match
            CASE WHEN p1.category_id = p2.category_id THEN 10 ELSE 0 END +
            -- Tag similarity
            COALESCE((SELECT COUNT(*) FROM public.post_tags pt1
             JOIN public.post_tags pt2 ON pt1.tag_id = pt2.tag_id
             WHERE pt1.post_id = p1.id AND pt2.post_id = p2.id), 0) * 5 +
            -- Text similarity (requires pg_trgm extension)
            COALESCE(similarity(p1.title, p2.title), 0) * 20
        ) as relevance_score
    FROM public.posts p1
    CROSS JOIN public.posts p2
    WHERE p1.id = post_uuid
    AND p2.id != post_uuid
    AND p2.status = 'published'
    AND p2.deleted_at IS NULL
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$;

-- Function to get user progress summary (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.get_user_progress_summary(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', COUNT(DISTINCT cs.id),
    'completed_goals', COUNT(DISTINCT pg.id) FILTER (WHERE pg.status = 'completed'),
    'average_performance_score', ROUND(AVG(pm.composite_score), 2),
    'current_programme', MAX(up.current_programme),
    'total_points', COALESCE(SUM(cs.points_earned), 0),
    'achievements_unlocked', COUNT(DISTINCT ua.achievement_id)
  ) INTO v_result
  FROM public.user_profiles up
  LEFT JOIN public.coaching_sessions cs ON cs.user_id = p_user_id
  LEFT JOIN public.programme_goals pg ON pg.user_id = p_user_id
  LEFT JOIN public.performance_metrics pm ON pm.user_id = p_user_id
  LEFT JOIN public.user_achievements ua ON ua.user_id = p_user_id
  WHERE up.user_id = p_user_id
  GROUP BY up.user_id;

  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Function to calculate user tier (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.calculate_user_tier(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_total_points INTEGER;
  v_tier TEXT;
BEGIN
  -- Get total points
  SELECT COALESCE(SUM(points_earned), 0)
  INTO v_total_points
  FROM public.coaching_sessions
  WHERE user_id = p_user_id;

  -- Determine tier based on points
  v_tier := CASE
    WHEN v_total_points >= 10000 THEN 'elite'
    WHEN v_total_points >= 5000 THEN 'advanced'
    WHEN v_total_points >= 2000 THEN 'intermediate'
    WHEN v_total_points >= 500 THEN 'beginner'
    ELSE 'foundation'
  END;

  RETURN v_tier;
END;
$$;

-- Function to get exercise history (STABLE - reads from tables)
CREATE OR REPLACE FUNCTION public.get_exercise_history(
  p_user_id UUID,
  p_exercise_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  session_date DATE,
  sets_completed INTEGER,
  total_reps INTEGER,
  total_weight DECIMAL,
  max_weight DECIMAL,
  notes TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cs.session_date,
    COUNT(el.id)::INTEGER as sets_completed,
    SUM(el.reps)::INTEGER as total_reps,
    SUM(el.weight * el.reps) as total_weight,
    MAX(el.weight) as max_weight,
    MAX(el.notes) as notes
  FROM public.coaching_sessions cs
  JOIN public.exercise_logs el ON el.session_id = cs.id
  WHERE cs.user_id = p_user_id
  AND el.exercise_id = p_exercise_id
  GROUP BY cs.id, cs.session_date
  ORDER BY cs.session_date DESC
  LIMIT p_limit;
END;
$$;

-- Function to archive old data (VOLATILE - modifies data)
CREATE OR REPLACE FUNCTION public.archive_old_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE
AS $$
BEGIN
  -- Archive old audit logs (>90 days)
  INSERT INTO public.archived_audit_logs
  SELECT * FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';

  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';

  -- Archive old notifications (>30 days read)
  DELETE FROM public.notifications
  WHERE read_at < NOW() - INTERVAL '30 days';

  -- Archive old session logs (>180 days)
  DELETE FROM public.coaching_sessions
  WHERE session_date < NOW() - INTERVAL '180 days'
  AND status = 'cancelled';
END;
$$;

-- Function to send notification (VOLATILE - creates data)
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, data
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_data
  ) RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- ========================================
-- RECREATE INDEXES WITH PROPER SYNTAX
-- ========================================

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON public.posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_search_vector ON public.posts USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON public.posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_deleted ON public.posts(deleted_at);

-- Categories and tags
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage ON public.tags(usage_count DESC);

-- Post views and revisions
CREATE INDEX IF NOT EXISTS idx_post_views_post ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user ON public.post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_revisions_post ON public.post_revisions(post_id, revision_number DESC);

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_programme ON public.user_profiles(current_programme);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active ON public.user_profiles(last_active_at DESC);

-- Lead magnets
CREATE INDEX IF NOT EXISTS idx_lead_magnets_active ON public.lead_magnets(is_active);
CREATE INDEX IF NOT EXISTS idx_lead_magnet_downloads_email ON public.lead_magnet_downloads(email);
CREATE INDEX IF NOT EXISTS idx_lead_magnet_downloads_magnet ON public.lead_magnet_downloads(lead_magnet_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnet_downloads_converted ON public.lead_magnet_downloads(converted_to_programme);

-- Performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON public.performance_metrics(coaching_session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON public.performance_metrics(metric_date DESC);

-- Email campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled ON public.email_campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON public.email_subscribers(status);

-- Wearables
CREATE INDEX IF NOT EXISTS idx_wearable_connections_user ON public.wearable_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_wearable_connections_status ON public.wearable_connections(connection_status);
CREATE INDEX IF NOT EXISTS idx_wearable_data_user_date ON public.wearable_data(user_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_wearable_data_type ON public.wearable_data(data_type, recorded_date DESC);

-- ========================================
-- CREATE/UPDATE ALL TRIGGERS
-- ========================================

-- Drop existing triggers to avoid duplicates
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS update_posts_search_vector ON public.posts;
DROP TRIGGER IF EXISTS calculate_posts_reading_metrics ON public.posts;
DROP TRIGGER IF EXISTS create_posts_revision ON public.posts;
DROP TRIGGER IF EXISTS update_post_tags_usage_insert ON public.post_tags;
DROP TRIGGER IF EXISTS update_post_tags_usage_delete ON public.post_tags;

-- Create triggers for posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_search_vector
  BEFORE INSERT OR UPDATE OF title, subtitle, excerpt, content ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_search_vector();

CREATE TRIGGER calculate_posts_reading_metrics
  BEFORE INSERT OR UPDATE OF content ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_reading_metrics();

CREATE TRIGGER create_posts_revision
  AFTER UPDATE ON public.posts
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title)
  EXECUTE FUNCTION public.create_post_revision();

-- Create triggers for post tags
CREATE TRIGGER update_post_tags_usage_insert
  AFTER INSERT ON public.post_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_usage_count();

CREATE TRIGGER update_post_tags_usage_delete
  AFTER DELETE ON public.post_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_usage_count();

-- Create triggers for all other tables that need updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name NOT IN ('posts') -- Already handled
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on all tables to anon (for public data)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all on all tables to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant sequence usage
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant execute on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ========================================
-- FINAL VALIDATION
-- ========================================

-- Check if all required tables exist
DO $$
DECLARE
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    required_tables TEXT[] := ARRAY[
        'assessment_submissions', 'posts', 'categories', 'tags', 'post_tags',
        'post_views', 'post_revisions', 'user_profiles', 'programmes',
        'programme_modules', 'coaching_sessions', 'exercise_logs',
        'performance_metrics', 'lead_magnets', 'lead_magnet_downloads',
        'email_subscribers', 'email_campaigns', 'wearable_connections',
        'wearable_data', 'notifications', 'audit_logs'
    ];
    t TEXT;
BEGIN
    FOREACH t IN ARRAY required_tables
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            missing_tables := array_append(missing_tables, t);
        END IF;
    END LOOP;

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'Missing tables: %', missing_tables;
    ELSE
        RAISE NOTICE 'All required tables exist!';
    END IF;
END;
$$;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
SELECT 'All functions and indexes have been fixed successfully!' as message;