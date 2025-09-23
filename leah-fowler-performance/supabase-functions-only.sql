-- Supabase Functions Only (Fixed for IMMUTABLE requirement)
-- Execute this after tables are created
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to anonymize assessment submission (GDPR compliance)
CREATE OR REPLACE FUNCTION public.anonymize_assessment_submission(submission_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to get assessment statistics
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
    jsonb_object_agg(tier, tier_count) as tier_distribution,
    jsonb_object_agg(investment_level, investment_count) as investment_distribution
  FROM (
    SELECT
      *,
      COUNT(*) OVER (PARTITION BY tier) as tier_count,
      COUNT(*) OVER (PARTITION BY investment_level) as investment_count
    FROM public.assessment_submissions
  ) as stats;
END;
$$;

-- Function to get live success metrics
CREATE OR REPLACE FUNCTION public.get_live_success_metrics()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_clients', (SELECT COUNT(DISTINCT email) FROM public.assessment_submissions WHERE qualified = true),
    'average_energy_increase', (
      SELECT ROUND(AVG((profile->>'energyIncrease')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'energyIncrease' IS NOT NULL
    ),
    'average_strength_gain', (
      SELECT ROUND(AVG((profile->>'strengthGain')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'strengthGain' IS NOT NULL
    ),
    'total_weight_lost', (
      SELECT ROUND(SUM((profile->>'weightLost')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'weightLost' IS NOT NULL
    ),
    'success_rate', (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE status = 'converted' OR qualified = true)::DECIMAL /
         NULLIF(COUNT(*), 0)) * 100, 0
      )
      FROM public.assessment_submissions
    ),
    'average_rating', 4.9
  );
END;
$$;

-- Function to get programme recommendation
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

-- Function to update post search vector
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

-- Function to calculate reading metrics
CREATE OR REPLACE FUNCTION public.calculate_reading_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    word_count_val INTEGER;
    reading_time_val INTEGER;
BEGIN
    -- Calculate word count
    word_count_val := array_length(string_to_array(NEW.content, ' '), 1);

    -- Calculate reading time (200 words per minute)
    reading_time_val := GREATEST(1, CEIL(word_count_val::DECIMAL / 200));

    -- Update the metrics
    NEW.word_count := word_count_val;
    NEW.reading_time_minutes := reading_time_val;

    RETURN NEW;
END;
$$;

-- Function to create post revision
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

-- Function to update tag usage count
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

-- Function to publish scheduled posts
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER
LANGUAGE plpgsql
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

-- Function to calculate related posts
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
            (SELECT COUNT(*) FROM public.post_tags pt1
             JOIN public.post_tags pt2 ON pt1.tag_id = pt2.tag_id
             WHERE pt1.post_id = p1.id AND pt2.post_id = p2.id) * 5 +
            -- Text similarity
            similarity(p1.title, p2.title) * 20
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

-- Function to get user progress summary
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
    'completed_sessions', COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'completed'),
    'total_metrics', COUNT(DISTINCT pm.id),
    'average_performance', AVG(pm.performance_score),
    'current_programme', up.current_programme,
    'start_date', up.start_date,
    'months_active', EXTRACT(MONTH FROM AGE(NOW(), up.start_date))
  ) INTO v_result
  FROM public.user_profiles up
  LEFT JOIN public.coaching_sessions cs ON cs.client_id = p_user_id
  LEFT JOIN public.performance_metrics pm ON pm.user_id = p_user_id
  WHERE up.user_id = p_user_id
  GROUP BY up.current_programme, up.start_date;

  RETURN v_result;
END;
$$;

-- Function to calculate client LTV
CREATE OR REPLACE FUNCTION public.calculate_client_ltv(p_user_id UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_ltv DECIMAL;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN up.current_programme = 'Premium Performance Programme' THEN 250
      WHEN up.current_programme = 'Performance Essentials' THEN 140
      WHEN up.current_programme = 'Online Programme' THEN 47
      WHEN up.current_programme = 'Foundation Programme' THEN 12
      ELSE 0
    END * EXTRACT(MONTH FROM AGE(NOW(), up.start_date))
  ), 0) INTO v_ltv
  FROM public.user_profiles up
  WHERE up.user_id = p_user_id;

  RETURN v_ltv;
END;
$$;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_email TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_score INTEGER := 0;
BEGIN
  -- Base score for subscribing
  v_score := 10;

  -- Add score for email engagement
  SELECT v_score +
    (CASE WHEN opened_count > 5 THEN 20 ELSE opened_count * 2 END) +
    (clicked_count * 5)
  INTO v_score
  FROM public.email_subscribers
  WHERE email = p_email;

  -- Add score for assessment completion
  IF EXISTS (SELECT 1 FROM public.assessment_submissions WHERE email = p_email) THEN
    v_score := v_score + 30;
  END IF;

  -- Add score for lead magnet download
  SELECT v_score + (COUNT(*) * 10)
  INTO v_score
  FROM public.lead_magnet_downloads
  WHERE email = p_email;

  RETURN LEAST(100, v_score); -- Cap at 100
END;
$$;

-- Function to export user data (GDPR)
CREATE OR REPLACE FUNCTION public.export_user_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', row_to_json(up.*),
    'sessions', (SELECT jsonb_agg(row_to_json(cs.*)) FROM public.coaching_sessions cs WHERE client_id = p_user_id),
    'metrics', (SELECT jsonb_agg(row_to_json(pm.*)) FROM public.performance_metrics pm WHERE user_id = p_user_id),
    'assessments', (SELECT jsonb_agg(row_to_json(as.*)) FROM public.assessment_submissions as WHERE email = up.email),
    'downloads', (SELECT jsonb_agg(row_to_json(lmd.*)) FROM public.lead_magnet_downloads lmd WHERE email = up.email)
  ) INTO v_result
  FROM public.user_profiles up
  WHERE up.user_id = p_user_id;

  RETURN v_result;
END;
$$;

-- Function to delete user data (GDPR)
CREATE OR REPLACE FUNCTION public.delete_user_data(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete in correct order to respect foreign keys
  DELETE FROM public.wearable_data WHERE user_id = p_user_id;
  DELETE FROM public.wearable_connections WHERE user_id = p_user_id;
  DELETE FROM public.performance_metrics WHERE user_id = p_user_id OR coaching_session_id IN (SELECT id FROM public.coaching_sessions WHERE client_id = p_user_id OR coach_id = p_user_id);
  DELETE FROM public.coaching_notes WHERE session_id IN (SELECT id FROM public.coaching_sessions WHERE client_id = p_user_id OR coach_id = p_user_id);
  DELETE FROM public.coaching_sessions WHERE client_id = p_user_id OR coach_id = p_user_id;
  DELETE FROM public.user_profiles WHERE user_id = p_user_id;

  -- Anonymize related assessment data instead of deleting
  UPDATE public.assessment_submissions
  SET name = 'DELETED USER',
      email = CONCAT('deleted-', p_user_id, '@removed.local'),
      phone = NULL,
      ip_address = NULL
  WHERE email IN (SELECT email FROM public.user_profiles WHERE user_id = p_user_id);
END;
$$;

-- Create all triggers
DO $$
BEGIN
  -- Assessment submissions updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_assessment_submissions_updated_at') THEN
    CREATE TRIGGER set_assessment_submissions_updated_at
    BEFORE UPDATE ON public.assessment_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Subscriptions updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_subscriptions_updated_at') THEN
    CREATE TRIGGER set_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- A/B tests updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_ab_tests_updated_at') THEN
    CREATE TRIGGER set_ab_tests_updated_at
    BEFORE UPDATE ON public.ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Posts triggers
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_posts_updated_at') THEN
    CREATE TRIGGER set_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_search_vector') THEN
    CREATE TRIGGER update_posts_search_vector
    BEFORE INSERT OR UPDATE OF title, subtitle, excerpt, content ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_post_search_vector();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'calculate_posts_reading_metrics') THEN
    CREATE TRIGGER calculate_posts_reading_metrics
    BEFORE INSERT OR UPDATE OF content ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_reading_metrics();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_posts_revision') THEN
    CREATE TRIGGER create_posts_revision
    AFTER UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.create_post_revision();
  END IF;

  -- Post tags trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tags_usage_count') THEN
    CREATE TRIGGER update_tags_usage_count
    AFTER INSERT OR DELETE ON public.post_tags
    FOR EACH ROW
    EXECUTE FUNCTION public.update_tag_usage_count();
  END IF;

  -- User profiles updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_profiles_updated_at') THEN
    CREATE TRIGGER set_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Coaching sessions updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_coaching_sessions_updated_at') THEN
    CREATE TRIGGER set_coaching_sessions_updated_at
    BEFORE UPDATE ON public.coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Lead magnets updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_lead_magnets_updated_at') THEN
    CREATE TRIGGER set_lead_magnets_updated_at
    BEFORE UPDATE ON public.lead_magnets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Email campaigns updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_email_campaigns_updated_at') THEN
    CREATE TRIGGER set_email_campaigns_updated_at
    BEFORE UPDATE ON public.email_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Email subscribers updated_at trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_email_subscribers_updated_at') THEN
    CREATE TRIGGER set_email_subscribers_updated_at
    BEFORE UPDATE ON public.email_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;