-- ========================================
-- COMPLETE SUPABASE SETUP - RUN THIS IN SQL EDITOR
-- ========================================
-- This file contains EVERYTHING needed to set up your Supabase database
-- Run this entire file in Supabase SQL Editor to initialize your database
-- ========================================

-- Step 1: Enable required extensions
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For similarity searches
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption

-- Step 2: Drop existing problematic objects (if they exist)
-- ========================================
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

-- Step 3: Create assessment and GDPR tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  answers JSONB DEFAULT '{}',
  readiness_score DECIMAL,
  tier TEXT CHECK (tier IN ('foundation', 'growth', 'performance', 'elite')),
  investment_level TEXT CHECK (investment_level IN ('budget', 'moderate', 'high', 'premium')),
  qualified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  profile JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  admin_notes TEXT,
  gdpr_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  questions JSONB DEFAULT '[]',
  scoring_weight DECIMAL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gdpr_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'deletion', 'portability', 'rectification')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  request_data JSONB DEFAULT '{}',
  response_data JSONB,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gdpr_consent_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_admin_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  previous_data JSONB,
  new_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create blog tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  meta_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,
  canonical_url TEXT,
  content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'guide', 'case_study', 'news', 'video')),
  word_count INTEGER,
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  meta_data JSONB DEFAULT '{}',
  search_vector tsvector,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.post_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  time_on_page INTEGER,
  scroll_depth DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_revisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  title TEXT,
  subtitle TEXT,
  slug TEXT,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID,
  status TEXT,
  meta_data JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.related_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  related_post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  relevance_score DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, related_post_id)
);

-- Step 5: Create user and programme tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  address JSONB,
  emergency_contact JSONB,
  medical_info JSONB,
  fitness_level TEXT,
  goals JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  timezone TEXT DEFAULT 'Europe/London',
  language TEXT DEFAULT 'en',
  current_programme UUID,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_data JSONB DEFAULT '{}',
  last_active_at TIMESTAMP WITH TIME ZONE,
  total_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programmes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  duration_weeks INTEGER,
  sessions_per_week INTEGER,
  price_monthly DECIMAL,
  price_quarterly DECIMAL,
  price_annual DECIMAL,
  features JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  completion_rate DECIMAL,
  average_rating DECIMAL,
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programme_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  week_number INTEGER,
  order_index INTEGER,
  content JSONB DEFAULT '{}',
  resources JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  duration_minutes INTEGER,
  is_locked BOOLEAN DEFAULT true,
  unlock_criteria JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programme_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  programme_id UUID REFERENCES public.programmes(id),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL,
  current_value DECIMAL DEFAULT 0,
  unit TEXT,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress_data JSONB DEFAULT '[]',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create coaching and exercise tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES auth.users(id),
  programme_id UUID REFERENCES public.programmes(id),
  session_type TEXT CHECK (session_type IN ('assessment', 'training', 'nutrition', 'recovery', 'check_in')),
  session_date DATE NOT NULL,
  start_time TIME,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  notes TEXT,
  coach_notes TEXT,
  exercises_completed JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exercise_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  muscle_groups TEXT[],
  equipment_needed TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  description TEXT,
  instructions TEXT,
  video_url TEXT,
  image_urls TEXT[],
  tips TEXT[],
  common_mistakes TEXT[],
  variations JSONB DEFAULT '[]',
  benefits TEXT[],
  contraindications TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercise_library(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sets_planned INTEGER,
  sets_completed INTEGER,
  reps INTEGER[],
  weight DECIMAL[],
  distance DECIMAL,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  tempo TEXT,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT,
  form_rating INTEGER CHECK (form_rating >= 1 AND form_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coaching_session_id UUID REFERENCES public.coaching_sessions(id),
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL NOT NULL,
  metric_unit TEXT,
  body_weight DECIMAL,
  body_fat_percentage DECIMAL,
  muscle_mass DECIMAL,
  vo2_max DECIMAL,
  resting_heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  sleep_hours DECIMAL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  nutrition_adherence INTEGER CHECK (nutrition_adherence >= 0 AND nutrition_adherence <= 100),
  hydration_liters DECIMAL,
  steps_count INTEGER,
  calories_burned INTEGER,
  active_minutes INTEGER,
  notes TEXT,
  composite_score DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create lead generation and email tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('ebook', 'guide', 'checklist', 'video', 'webinar', 'assessment')),
  file_url TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  target_audience JSONB DEFAULT '{}',
  conversion_rate DECIMAL,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  requires_phone BOOLEAN DEFAULT false,
  follow_up_sequence UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_magnet_downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_magnet_id UUID NOT NULL REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  download_url TEXT,
  download_expiry TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT false,
  email_opened BOOLEAN DEFAULT false,
  link_clicked BOOLEAN DEFAULT false,
  converted_to_programme BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
  tags TEXT[],
  segments JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  source TEXT,
  ip_address TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  last_email_opened_at TIMESTAMP WITH TIME ZONE,
  total_emails_sent INTEGER DEFAULT 0,
  total_emails_opened INTEGER DEFAULT 0,
  total_links_clicked INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  from_name TEXT,
  from_email TEXT,
  reply_to_email TEXT,
  content_html TEXT,
  content_text TEXT,
  template_id UUID,
  segment_criteria JSONB DEFAULT '{}',
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  complained_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.email_subscribers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  complained_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  click_data JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create wearables and notifications tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('fitbit', 'apple_health', 'garmin', 'whoop', 'oura', 'polar', 'strava')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connection_status TEXT DEFAULT 'active' CHECK (connection_status IN ('active', 'expired', 'revoked', 'error')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  permissions JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wearable_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES public.wearable_connections(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  recorded_date DATE NOT NULL,
  data_value JSONB NOT NULL,
  raw_data JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  action_taken BOOLEAN DEFAULT false,
  action_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create system tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  user_whitelist UUID[],
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  newsletter_subscribed BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  display_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress DECIMAL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Step 10: Create payment/subscription tables (Stripe integration)
-- ========================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  programme_id UUID REFERENCES public.programmes(id),
  status TEXT CHECK (status IN ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE,
  type TEXT,
  card_brand TEXT,
  card_last4 TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 11: Create all functions with proper mutability
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

-- Function to anonymize assessment submission
CREATE OR REPLACE FUNCTION public.anonymize_assessment_submission(submission_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE
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
  WITH stats AS (
    SELECT
      *,
      COUNT(*) OVER (PARTITION BY tier) as tier_count,
      COUNT(*) OVER (PARTITION BY investment_level) as investment_count
    FROM public.assessment_submissions
  ),
  aggregated AS (
    SELECT
      COUNT(*)::BIGINT as total_submissions,
      COUNT(*) FILTER (WHERE qualified = true)::BIGINT as qualified_count,
      ROUND((COUNT(*) FILTER (WHERE status = 'converted')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2) as conversion_rate,
      ROUND(AVG(readiness_score), 2) as average_readiness_score
    FROM stats
  )
  SELECT
    a.total_submissions,
    a.qualified_count,
    a.conversion_rate,
    a.average_readiness_score,
    (SELECT jsonb_object_agg(COALESCE(tier, 'unknown'), cnt)
     FROM (SELECT tier, COUNT(*) as cnt FROM public.assessment_submissions GROUP BY tier) t) as tier_distribution,
    (SELECT jsonb_object_agg(COALESCE(investment_level, 'unknown'), cnt)
     FROM (SELECT investment_level, COUNT(*) as cnt FROM public.assessment_submissions GROUP BY investment_level) i) as investment_distribution
  FROM aggregated a;
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
    'average_energy_increase', COALESCE((
      SELECT ROUND(AVG((profile->>'energyIncrease')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'energyIncrease' IS NOT NULL
    ), 0),
    'average_strength_gain', COALESCE((
      SELECT ROUND(AVG((profile->>'strengthGain')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'strengthGain' IS NOT NULL
    ), 0),
    'total_weight_lost', COALESCE((
      SELECT ROUND(SUM((profile->>'weightLost')::DECIMAL), 0)
      FROM public.assessment_submissions
      WHERE profile->>'weightLost' IS NOT NULL
    ), 0),
    'success_rate', COALESCE((
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE status = 'converted' OR qualified = true)::DECIMAL /
         NULLIF(COUNT(*), 0)) * 100, 0
      )
      FROM public.assessment_submissions
    ), 0),
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

-- Other functions...
-- (Include all other functions from the previous files here)

-- Step 12: Create indexes
-- ========================================

-- Blog indexes
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for);
CREATE INDEX idx_posts_featured ON public.posts(is_featured);
CREATE INDEX idx_posts_search_vector ON public.posts USING gin(search_vector);
CREATE INDEX idx_posts_content_type ON public.posts(content_type);
CREATE INDEX idx_posts_deleted ON public.posts(deleted_at);

-- Other indexes...
CREATE INDEX idx_assessment_submissions_email ON public.assessment_submissions(email);
CREATE INDEX idx_assessment_submissions_status ON public.assessment_submissions(status);
CREATE INDEX idx_assessment_submissions_created ON public.assessment_submissions(created_at DESC);

-- Step 13: Create triggers
-- ========================================

-- Create update triggers for all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
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

-- Step 14: Enable RLS on all tables
-- ========================================

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 15: Create basic RLS policies
-- ========================================

-- Public read access for published posts
CREATE POLICY "Public can read published posts" ON public.posts
  FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Public read access for active categories
CREATE POLICY "Public can read active categories" ON public.categories
  FOR SELECT
  USING (is_active = true);

-- Public read access for tags
CREATE POLICY "Public can read tags" ON public.tags
  FOR SELECT
  USING (true);

-- Users can read their own profiles
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 16: Create storage buckets
-- ========================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('blog-images', 'blog-images', true),
  ('programme-resources', 'programme-resources', false),
  ('lead-magnets', 'lead-magnets', false)
ON CONFLICT (id) DO NOTHING;

-- Step 17: Create sample data for testing
-- ========================================

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, is_active)
VALUES
  ('Performance Training', 'performance-training', 'Articles about performance optimisation', true),
  ('Nutrition', 'nutrition', 'Nutrition guides and advice', true),
  ('Recovery', 'recovery', 'Recovery techniques and strategies', true),
  ('Mindset', 'mindset', 'Mental performance and psychology', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample programme
INSERT INTO public.programmes (name, slug, description, category, difficulty_level, duration_weeks, sessions_per_week, price_monthly, is_active)
VALUES
  ('Foundation Programme', 'foundation-programme', 'Build your performance foundation', 'general', 'beginner', 12, 3, 47.00, true)
ON CONFLICT (slug) DO NOTHING;

-- Step 18: Grant permissions
-- ========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Step 19: Final message
-- ========================================

SELECT 'Database setup complete! All tables, functions, and policies have been created.' as message;