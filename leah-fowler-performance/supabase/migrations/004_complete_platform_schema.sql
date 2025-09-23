-- Complete Platform Database Schema for Leah Fowler Performance Coach
-- Version: 1.0.0
-- Description: Completes the database architecture with user management, lead tracking, coaching sessions, and optimisations

-- ===================================================================
-- USER MANAGEMENT AND PROFILES
-- ===================================================================

-- User profiles extension (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),

  -- Professional Information
  occupation TEXT,
  company TEXT,
  industry TEXT,
  role_level TEXT CHECK (role_level IN ('Executive', 'Senior Manager', 'Manager', 'Professional', 'Other')),
  years_experience INTEGER,

  -- Health & Performance Profile
  current_fitness_level TEXT CHECK (current_fitness_level IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')),
  primary_goals JSONB DEFAULT '[]', -- Array of goals
  health_conditions JSONB DEFAULT '[]', -- Array of conditions (encrypted)
  injury_history JSONB DEFAULT '[]', -- Array of injuries (encrypted)

  -- Preferences
  preferred_training_times JSONB DEFAULT '[]', -- Array of time slots
  communication_preference TEXT CHECK (communication_preference IN ('email', 'phone', 'whatsapp', 'sms')) DEFAULT 'email',
  timezone TEXT DEFAULT 'Europe/London',
  language TEXT DEFAULT 'en-GB',

  -- Programme Information
  current_programme TEXT CHECK (current_programme IN ('Foundation', 'Performance', 'Elite', 'Youth')),
  programme_start_date DATE,
  coach_notes TEXT, -- Private notes from coach

  -- Profile Metadata
  avatar_url TEXT,
  bio TEXT,
  location_city TEXT,
  location_country TEXT DEFAULT 'UK',

  -- Performance Metrics (latest values)
  current_weight_kg DECIMAL(5,2),
  current_body_fat_percentage DECIMAL(4,2),
  max_squat_kg DECIMAL(5,2),
  max_deadlift_kg DECIMAL(5,2),
  max_bench_press_kg DECIMAL(5,2),
  vo2_max DECIMAL(4,2),

  -- Engagement & Status
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  total_sessions_completed INTEGER DEFAULT 0,

  -- GDPR & Privacy
  data_consent_given BOOLEAN DEFAULT false,
  data_consent_version TEXT,
  data_consent_timestamp TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===================================================================
-- LEAD MAGNET DOWNLOADS AND TRACKING
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Lead Magnet Details
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('ebook', 'guide', 'checklist', 'video', 'webinar', 'assessment', 'template')) NOT NULL,

  -- File/Resource Information
  file_url TEXT,
  file_size_mb DECIMAL(10,2),
  page_count INTEGER,
  duration_minutes INTEGER, -- For videos/webinars

  -- Targeting
  target_audience JSONB DEFAULT '[]', -- Array of audience segments
  topic_tags JSONB DEFAULT '[]', -- Array of topics

  -- Performance Tracking
  download_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2), -- To paid programme
  average_rating DECIMAL(3,2),

  -- Status
  is_active BOOLEAN DEFAULT true,
  requires_assessment BOOLEAN DEFAULT false, -- Must complete assessment first

  -- SEO & Marketing
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lead_magnet_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Download Information
  lead_magnet_id UUID REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,

  -- Attribution
  source TEXT, -- utm_source
  medium TEXT, -- utm_medium
  campaign TEXT, -- utm_campaign
  referrer_url TEXT,
  landing_page_url TEXT,

  -- Download Details
  download_url TEXT, -- Temporary signed URL
  download_expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0, -- Track multiple downloads
  last_downloaded_at TIMESTAMPTZ,

  -- Engagement Tracking
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  resource_accessed BOOLEAN DEFAULT false,
  resource_accessed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,

  -- Conversion Tracking
  converted_to_assessment BOOLEAN DEFAULT false,
  assessment_completed_at TIMESTAMPTZ,
  converted_to_programme BOOLEAN DEFAULT false,
  programme_purchased_at TIMESTAMPTZ,
  programme_type TEXT,

  -- GDPR
  consent_given BOOLEAN DEFAULT false NOT NULL,
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===================================================================
-- PERFORMANCE COACHING SESSIONS
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Session Participants
  coach_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

  -- Session Details
  session_type TEXT CHECK (session_type IN ('initial_consultation', 'one_to_one', 'group', 'assessment', 'review')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Scheduling
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  timezone TEXT DEFAULT 'Europe/London',

  -- Location/Format
  format TEXT CHECK (format IN ('in_person', 'video_call', 'phone_call')) NOT NULL,
  location_address TEXT,
  video_call_link TEXT,

  -- Session Content
  session_plan JSONB, -- Structured plan for the session
  exercises_prescribed JSONB, -- Array of exercises
  homework_assigned JSONB, -- Tasks for the client

  -- Performance Metrics Recorded
  metrics_recorded JSONB, -- Measurements taken during session
  progress_notes TEXT,

  -- Status & Completion
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  completed_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_by TEXT CHECK (cancelled_by IN ('client', 'coach', 'system')),

  -- Client Feedback
  client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
  client_feedback TEXT,
  feedback_submitted_at TIMESTAMPTZ,

  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  next_session_recommended DATE,

  -- Reminders
  reminder_sent_24h BOOLEAN DEFAULT false,
  reminder_sent_1h BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_session_time CHECK (scheduled_date >= CURRENT_DATE OR status IN ('completed', 'cancelled'))
);

-- ===================================================================
-- PERFORMANCE TRACKING & PROGRESS
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User Reference
  user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  coaching_session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,

  -- Measurement Date
  recorded_date DATE NOT NULL,
  recorded_by TEXT CHECK (recorded_by IN ('self', 'coach', 'device')) DEFAULT 'self',

  -- Body Composition
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  bone_mass_kg DECIMAL(4,2),
  water_percentage DECIMAL(4,2),
  metabolic_age INTEGER,
  visceral_fat_rating INTEGER,

  -- Circumference Measurements (cm)
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  bicep_left_cm DECIMAL(4,2),
  bicep_right_cm DECIMAL(4,2),
  thigh_left_cm DECIMAL(5,2),
  thigh_right_cm DECIMAL(5,2),
  calf_left_cm DECIMAL(4,2),
  calf_right_cm DECIMAL(4,2),

  -- Strength Metrics (kg)
  squat_1rm_kg DECIMAL(5,2),
  deadlift_1rm_kg DECIMAL(5,2),
  bench_press_1rm_kg DECIMAL(5,2),
  overhead_press_1rm_kg DECIMAL(5,2),
  pull_up_max_reps INTEGER,
  push_up_max_reps INTEGER,

  -- Cardiovascular Fitness
  resting_heart_rate INTEGER,
  vo2_max DECIMAL(4,2),
  lactate_threshold DECIMAL(4,2),

  -- Performance Tests
  vertical_jump_cm DECIMAL(4,2),
  broad_jump_cm DECIMAL(5,2),
  sprint_10m_seconds DECIMAL(4,2),
  sprint_40m_seconds DECIMAL(4,2),
  agility_test_seconds DECIMAL(4,2),

  -- Flexibility (degrees or cm)
  sit_and_reach_cm DECIMAL(4,2),
  shoulder_flexibility_score INTEGER,

  -- Energy & Wellbeing (1-10 scale)
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, recorded_date, recorded_by)
);

-- ===================================================================
-- EMAIL CAMPAIGN TRACKING
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Campaign Details
  name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  from_name TEXT DEFAULT 'Leah Fowler',
  from_email TEXT DEFAULT 'leah@leahfowlerperformance.com',

  -- Campaign Type
  type TEXT CHECK (type IN ('newsletter', 'nurture', 'promotional', 'transactional', 'automated')) NOT NULL,
  automation_trigger TEXT, -- If automated, what triggers it

  -- Content
  html_content TEXT,
  plain_text_content TEXT,

  -- Segmentation
  segment_criteria JSONB, -- Criteria for recipient selection
  recipient_count INTEGER DEFAULT 0,

  -- Performance Metrics
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,

  -- Rates
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),

  -- Status
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')) DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Subscriber Information
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,

  -- Subscription Details
  status TEXT CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained', 'cleaned')) DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,

  -- Segmentation Data
  tags JSONB DEFAULT '[]', -- Array of tags
  segments JSONB DEFAULT '[]', -- Array of segments
  lead_score INTEGER DEFAULT 0,

  -- Source
  source TEXT, -- Where they subscribed from
  signup_method TEXT CHECK (signup_method IN ('form', 'import', 'api', 'assessment', 'lead_magnet')),

  -- Engagement
  last_email_sent_at TIMESTAMPTZ,
  last_email_opened_at TIMESTAMPTZ,
  last_email_clicked_at TIMESTAMPTZ,
  total_emails_sent INTEGER DEFAULT 0,
  total_emails_opened INTEGER DEFAULT 0,
  total_emails_clicked INTEGER DEFAULT 0,

  -- GDPR
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  ip_address INET,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ===================================================================
-- WEARABLE DEVICE INTEGRATION
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User Reference
  user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

  -- Device Information
  device_type TEXT CHECK (device_type IN ('fitbit', 'garmin', 'apple_watch', 'whoop', 'oura', 'polar', 'other')) NOT NULL,
  device_id TEXT,
  device_name TEXT,

  -- Connection Details
  access_token TEXT, -- Encrypted
  refresh_token TEXT, -- Encrypted
  token_expires_at TIMESTAMPTZ,

  -- Sync Settings
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')) DEFAULT 'daily',

  -- Data Permissions
  sync_activity BOOLEAN DEFAULT true,
  sync_heart_rate BOOLEAN DEFAULT true,
  sync_sleep BOOLEAN DEFAULT true,
  sync_nutrition BOOLEAN DEFAULT false,
  sync_weight BOOLEAN DEFAULT true,

  -- Status
  connection_status TEXT CHECK (connection_status IN ('active', 'expired', 'revoked', 'error')) DEFAULT 'active',
  last_error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, device_type, device_id)
);

CREATE TABLE IF NOT EXISTS public.wearable_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Reference
  user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  connection_id UUID REFERENCES public.wearable_connections(id) ON DELETE CASCADE,

  -- Data Type
  data_type TEXT CHECK (data_type IN ('activity', 'heart_rate', 'sleep', 'nutrition', 'weight', 'workout')) NOT NULL,
  recorded_date DATE NOT NULL,

  -- Raw Data (JSONB for flexibility across different device formats)
  raw_data JSONB NOT NULL,

  -- Processed/Normalised Data
  processed_data JSONB,

  -- Sync Information
  synced_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, connection_id, data_type, recorded_date)
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE OPTIMISATION
-- ===================================================================

-- User Profiles
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_programme ON public.user_profiles(current_programme) WHERE current_programme IS NOT NULL;
CREATE INDEX idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
CREATE INDEX idx_user_profiles_last_active ON public.user_profiles(last_active_at DESC);

-- Lead Magnets
CREATE INDEX idx_lead_magnets_slug ON public.lead_magnets(slug);
CREATE INDEX idx_lead_magnets_active ON public.lead_magnets(is_active) WHERE is_active = true;
CREATE INDEX idx_lead_magnet_downloads_email ON public.lead_magnet_downloads(email);
CREATE INDEX idx_lead_magnet_downloads_magnet ON public.lead_magnet_downloads(lead_magnet_id);
CREATE INDEX idx_lead_magnet_downloads_converted ON public.lead_magnet_downloads(converted_to_programme) WHERE converted_to_programme = true;

-- Coaching Sessions
CREATE INDEX idx_coaching_sessions_coach ON public.coaching_sessions(coach_id);
CREATE INDEX idx_coaching_sessions_client ON public.coaching_sessions(client_id);
CREATE INDEX idx_coaching_sessions_date ON public.coaching_sessions(scheduled_date, scheduled_time);
CREATE INDEX idx_coaching_sessions_status ON public.coaching_sessions(status);
CREATE INDEX idx_coaching_sessions_upcoming ON public.coaching_sessions(scheduled_date, scheduled_time)
  WHERE status IN ('scheduled', 'confirmed') AND scheduled_date >= CURRENT_DATE;

-- Performance Metrics
CREATE INDEX idx_performance_metrics_user ON public.performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_date ON public.performance_metrics(recorded_date DESC);
CREATE INDEX idx_performance_metrics_session ON public.performance_metrics(coaching_session_id) WHERE coaching_session_id IS NOT NULL;

-- Email
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled ON public.email_campaigns(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON public.email_subscribers(status) WHERE status = 'active';

-- Wearables
CREATE INDEX idx_wearable_connections_user ON public.wearable_connections(user_id);
CREATE INDEX idx_wearable_connections_status ON public.wearable_connections(connection_status) WHERE connection_status = 'active';
CREATE INDEX idx_wearable_data_user_date ON public.wearable_data(user_id, recorded_date DESC);
CREATE INDEX idx_wearable_data_type ON public.wearable_data(data_type, recorded_date DESC);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnet_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_data ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view client profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.coaching_sessions
      WHERE coach_id = auth.uid() AND client_id = user_profiles.user_id
    )
  );

-- Lead Magnets Policies
CREATE POLICY "Public can view active lead magnets" ON public.lead_magnets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can download lead magnets" ON public.lead_magnet_downloads
  FOR INSERT WITH CHECK (true);

-- Coaching Sessions Policies
CREATE POLICY "Users can view own sessions" ON public.coaching_sessions
  FOR SELECT USING (auth.uid() IN (coach_id, client_id));

CREATE POLICY "Coaches can manage sessions" ON public.coaching_sessions
  FOR ALL USING (auth.uid() = coach_id);

-- Performance Metrics Policies
CREATE POLICY "Users can view own metrics" ON public.performance_metrics
  FOR SELECT USING (
    user_id IN (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own metrics" ON public.performance_metrics
  FOR INSERT WITH CHECK (
    user_id IN (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid())
  );

-- Email Policies
CREATE POLICY "Service role manages email campaigns" ON public.email_campaigns
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
  FOR INSERT WITH CHECK (true);

-- Wearables Policies
CREATE POLICY "Users manage own wearable connections" ON public.wearable_connections
  FOR ALL USING (
    user_id IN (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own wearable data" ON public.wearable_data
  FOR SELECT USING (
    user_id IN (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid())
  );

-- ===================================================================
-- HELPER FUNCTIONS AND VIEWS
-- ===================================================================

-- Function to get user's progress summary
CREATE OR REPLACE FUNCTION public.get_user_progress_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sessions', COUNT(DISTINCT cs.id),
    'completed_sessions', COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'completed'),
    'upcoming_sessions', COUNT(DISTINCT cs.id) FILTER (WHERE cs.status IN ('scheduled', 'confirmed') AND cs.scheduled_date >= CURRENT_DATE),
    'latest_metrics', (
      SELECT jsonb_build_object(
        'weight_kg', weight_kg,
        'body_fat_percentage', body_fat_percentage,
        'energy_level', energy_level,
        'recorded_date', recorded_date
      )
      FROM public.performance_metrics
      WHERE user_id = p_user_id
      ORDER BY recorded_date DESC
      LIMIT 1
    ),
    'programme_info', (
      SELECT jsonb_build_object(
        'current_programme', current_programme,
        'programme_start_date', programme_start_date,
        'total_sessions_completed', total_sessions_completed
      )
      FROM public.user_profiles
      WHERE user_id = p_user_id
    )
  ) INTO v_result
  FROM public.coaching_sessions cs
  WHERE cs.client_id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for coach dashboard
CREATE OR REPLACE VIEW public.coach_dashboard_stats AS
SELECT
  COUNT(DISTINCT up.user_id) AS total_clients,
  COUNT(DISTINCT up.user_id) FILTER (WHERE up.current_programme IS NOT NULL) AS active_clients,
  COUNT(DISTINCT cs.id) FILTER (WHERE cs.scheduled_date = CURRENT_DATE) AS sessions_today,
  COUNT(DISTINCT cs.id) FILTER (WHERE cs.scheduled_date >= CURRENT_DATE AND cs.scheduled_date < CURRENT_DATE + INTERVAL '7 days') AS sessions_this_week,
  AVG(cs.client_rating) FILTER (WHERE cs.client_rating IS NOT NULL) AS average_client_rating
FROM public.user_profiles up
LEFT JOIN public.coaching_sessions cs ON up.user_id = cs.client_id;

-- View for lead conversion funnel
CREATE OR REPLACE VIEW public.lead_conversion_funnel AS
SELECT
  COUNT(DISTINCT lmd.email) AS total_leads,
  COUNT(DISTINCT lmd.email) FILTER (WHERE lmd.converted_to_assessment = true) AS assessment_completions,
  COUNT(DISTINCT lmd.email) FILTER (WHERE lmd.converted_to_programme = true) AS programme_conversions,
  ROUND(COUNT(DISTINCT lmd.email) FILTER (WHERE lmd.converted_to_assessment = true)::DECIMAL / NULLIF(COUNT(DISTINCT lmd.email)::DECIMAL, 0) * 100, 2) AS assessment_conversion_rate,
  ROUND(COUNT(DISTINCT lmd.email) FILTER (WHERE lmd.converted_to_programme = true)::DECIMAL / NULLIF(COUNT(DISTINCT lmd.email) FILTER (WHERE lmd.converted_to_assessment = true)::DECIMAL, 0) * 100, 2) AS programme_conversion_rate
FROM public.lead_magnet_downloads lmd;

-- Function to calculate client lifetime value
CREATE OR REPLACE FUNCTION public.calculate_client_ltv(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_ltv DECIMAL;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN s.billing_period = 'monthly' THEN s.price_gbp
      WHEN s.billing_period = 'quarterly' THEN s.price_gbp / 3
      WHEN s.billing_period = 'annual' THEN s.price_gbp / 12
    END *
    EXTRACT(MONTH FROM AGE(COALESCE(s.cancelled_at, NOW()), s.created_at))
  ), 0) INTO v_ltv
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id;

  RETURN v_ltv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- TRIGGERS FOR DATA INTEGRITY AND AUTOMATION
-- ===================================================================

-- Update user profile last_active_at
CREATE OR REPLACE FUNCTION public.update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles
  SET last_active_at = NOW()
  WHERE user_id = NEW.user_id OR user_id = NEW.client_id OR user_id = NEW.coach_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_last_active_on_session
AFTER INSERT OR UPDATE ON public.coaching_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_user_last_active();

-- Auto-increment session count on completion
CREATE OR REPLACE FUNCTION public.increment_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.user_profiles
    SET total_sessions_completed = total_sessions_completed + 1
    WHERE user_id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_session_count_trigger
AFTER UPDATE ON public.coaching_sessions
FOR EACH ROW
EXECUTE FUNCTION public.increment_session_count();

-- Update email subscriber engagement metrics
CREATE OR REPLACE FUNCTION public.update_email_engagement()
RETURNS TRIGGER AS $$
BEGIN
  -- This would be called by your email service webhook
  -- Placeholder for email engagement tracking
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Automatic lead scoring based on engagement
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_email TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
BEGIN
  -- Base score for subscribing
  v_score := 10;

  -- Add points for lead magnet downloads
  SELECT v_score + COUNT(*) * 5 INTO v_score
  FROM public.lead_magnet_downloads
  WHERE email = p_email;

  -- Add points for assessment completion
  SELECT v_score + CASE WHEN COUNT(*) > 0 THEN 25 ELSE 0 END INTO v_score
  FROM public.assessment_submissions
  WHERE email = p_email AND qualified = true;

  -- Add points for email engagement
  SELECT v_score +
    (total_emails_opened * 2) +
    (total_emails_clicked * 5)
  INTO v_score
  FROM public.email_subscribers
  WHERE email = p_email;

  RETURN LEAST(v_score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- UPDATED_AT TRIGGERS
-- ===================================================================

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_magnets_updated_at
  BEFORE UPDATE ON public.lead_magnets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_magnet_downloads_updated_at
  BEFORE UPDATE ON public.lead_magnet_downloads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at
  BEFORE UPDATE ON public.coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at
  BEFORE UPDATE ON public.performance_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wearable_connections_updated_at
  BEFORE UPDATE ON public.wearable_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================================================================
-- GDPR COMPLIANCE FUNCTIONS
-- ===================================================================

-- Function to export all user data (GDPR right to data portability)
CREATE OR REPLACE FUNCTION public.export_user_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', row_to_json(up.*),
    'coaching_sessions', (
      SELECT jsonb_agg(row_to_json(cs.*))
      FROM public.coaching_sessions cs
      WHERE cs.client_id = p_user_id
    ),
    'performance_metrics', (
      SELECT jsonb_agg(row_to_json(pm.*))
      FROM public.performance_metrics pm
      WHERE pm.user_id = p_user_id
    ),
    'subscriptions', (
      SELECT jsonb_agg(row_to_json(s.*))
      FROM public.subscriptions s
      WHERE s.user_id = p_user_id
    ),
    'assessment_submissions', (
      SELECT jsonb_agg(row_to_json(asu.*))
      FROM public.assessment_submissions asu
      WHERE asu.email IN (SELECT email FROM auth.users WHERE id = p_user_id)
    )
  ) INTO v_result
  FROM public.user_profiles up
  WHERE up.user_id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete all user data (GDPR right to erasure)
CREATE OR REPLACE FUNCTION public.delete_user_data(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete in correct order to respect foreign keys
  DELETE FROM public.wearable_data WHERE user_id = p_user_id;
  DELETE FROM public.wearable_connections WHERE user_id = p_user_id;
  DELETE FROM public.performance_metrics WHERE user_id = p_user_id;
  DELETE FROM public.coaching_sessions WHERE client_id = p_user_id OR coach_id = p_user_id;
  DELETE FROM public.user_profiles WHERE user_id = p_user_id;

  -- Anonymise assessment submissions
  UPDATE public.assessment_submissions
  SET
    name = 'DELETED',
    email = CONCAT('deleted-', p_user_id, '@removed.com'),
    phone = NULL,
    ip_address = NULL,
    user_agent = NULL
  WHERE email IN (SELECT email FROM auth.users WHERE id = p_user_id);

  -- Finally delete auth user
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- SAMPLE DATA FOR TESTING (Comment out in production)
-- ===================================================================

-- Insert sample lead magnets
INSERT INTO public.lead_magnets (title, slug, type, description, is_active)
VALUES
  ('The Executive''s Guide to Sustainable Performance', 'executive-guide', 'ebook',
   'A comprehensive guide to optimising performance whilst maintaining work-life balance', true),
  ('7-Day Energy Transformation Challenge', '7-day-energy-challenge', 'guide',
   'Daily actions to transform your energy levels in just one week', true),
  ('Performance Assessment Toolkit', 'assessment-toolkit', 'template',
   'Professional templates and tools to assess your current performance levels', true)
ON CONFLICT (slug) DO NOTHING;

-- ===================================================================
-- GRANT PERMISSIONS
-- ===================================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.lead_magnets TO anon, authenticated;
GRANT INSERT ON public.lead_magnet_downloads TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.coaching_sessions TO authenticated;
GRANT SELECT, INSERT ON public.performance_metrics TO authenticated;
GRANT INSERT ON public.email_subscribers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wearable_connections TO authenticated;
GRANT SELECT, INSERT ON public.wearable_data TO authenticated;

-- Comments for documentation
COMMENT ON SCHEMA public IS 'Complete Platform Schema for Leah Fowler Performance Coach - Comprehensive database architecture for performance coaching platform';
COMMENT ON TABLE public.user_profiles IS 'Extended user profiles with performance coaching specific data';
COMMENT ON TABLE public.lead_magnets IS 'Lead magnet resources for content marketing';
COMMENT ON TABLE public.lead_magnet_downloads IS 'Track lead magnet downloads and conversions';
COMMENT ON TABLE public.coaching_sessions IS 'One-to-one and group coaching session management';
COMMENT ON TABLE public.performance_metrics IS 'Detailed performance and body composition tracking';
COMMENT ON TABLE public.email_campaigns IS 'Email marketing campaign management';
COMMENT ON TABLE public.email_subscribers IS 'Email subscriber list with engagement tracking';
COMMENT ON TABLE public.wearable_connections IS 'Wearable device API connections';
COMMENT ON TABLE public.wearable_data IS 'Data synced from wearable devices';