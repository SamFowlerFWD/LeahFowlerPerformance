-- Leah Fowler Performance Coach Platform
-- Complete Database Migration Script
-- Generated: 2025-09-27T17:57:40.004Z
-- Target: https://ltlbfltlhysjxslusypq.supabase.co

-- ================================================
-- IMPORTANT: Execute this in Supabase SQL Editor
-- URL: https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql
-- ================================================


-- ================================================
-- Migration: 000_MASTER_MIGRATION.sql
-- ================================================

-- ============================================================================
-- MASTER MIGRATION SCRIPT FOR LEAH FOWLER PERFORMANCE COACH
-- ============================================================================
-- Version: 1.0.0
-- Date: 2025-09-27
-- Description: Complete database setup with conflict resolution and optimizations
--
-- EXECUTION INSTRUCTIONS:
-- 1. Take a full backup before executing
-- 2. Run in a transaction if possible
-- 3. Verify each section completes successfully
-- 4. Run verification queries after completion
--
-- ROLLBACK INSTRUCTIONS:
-- See rollback sections at the end of this file
-- ============================================================================

-- ============================================================================
-- SECTION 0: INITIAL SETUP AND EXTENSIONS
-- ============================================================================

-- Enable required extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- ============================================================================
-- SECTION 1: COMMON FUNCTIONS (Create once, use everywhere)
-- ============================================================================

-- Drop function if exists to avoid conflicts
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create the updated_at trigger function (single definition)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Email validation function
CREATE OR REPLACE FUNCTION public.validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- UK phone validation function
CREATE OR REPLACE FUNCTION public.validate_uk_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~* '^(\+44|0)[1-9][0-9]{9,10}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- SECTION 2: ADMIN AND ROLE MANAGEMENT (NEW - Missing from original)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT UNIQUE NOT NULL CHECK (role_name IN ('super_admin', 'admin', 'coach', 'support', 'viewer')),
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role_id UUID REFERENCES public.admin_roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default roles
INSERT INTO public.admin_roles (role_name, description, permissions)
VALUES
  ('super_admin', 'Full system access', '{"all": true}'::jsonb),
  ('admin', 'Administrative access', '{"users": true, "content": true, "reports": true}'::jsonb),
  ('coach', 'Coach access', '{"clients": true, "sessions": true, "metrics": true}'::jsonb),
  ('support', 'Support staff access', '{"users": "read", "tickets": true}'::jsonb),
  ('viewer', 'Read-only access', '{"read_only": true}'::jsonb)
ON CONFLICT (role_name) DO NOTHING;

-- ============================================================================
-- SECTION 3: USER PROFILES AND AUTHENTICATION
-- ============================================================================

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

  -- Health & Performance Profile (Encrypted in application layer)
  current_fitness_level TEXT CHECK (current_fitness_level IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')),
  primary_goals JSONB DEFAULT '[]',
  health_conditions JSONB DEFAULT '[]', -- Encrypted
  injury_history JSONB DEFAULT '[]', -- Encrypted

  -- Preferences
  preferred_training_times JSONB DEFAULT '[]',
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
  current_weight_kg DECIMAL(5,2) CHECK (current_weight_kg > 0 AND current_weight_kg < 500),
  current_body_fat_percentage DECIMAL(4,2) CHECK (current_body_fat_percentage >= 0 AND current_body_fat_percentage <= 100),
  max_squat_kg DECIMAL(5,2) CHECK (max_squat_kg >= 0),
  max_deadlift_kg DECIMAL(5,2) CHECK (max_deadlift_kg >= 0),
  max_bench_press_kg DECIMAL(5,2) CHECK (max_bench_press_kg >= 0),
  vo2_max DECIMAL(4,2) CHECK (vo2_max > 0 AND vo2_max < 100),

  -- Engagement & Status
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  total_sessions_completed INTEGER DEFAULT 0 CHECK (total_sessions_completed >= 0),

  -- GDPR & Privacy
  data_consent_given BOOLEAN DEFAULT false,
  data_consent_version TEXT,
  data_consent_timestamp TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_phone CHECK (phone IS NULL OR validate_uk_phone(phone))
);

-- ============================================================================
-- SECTION 4: ASSESSMENT AND LEAD CAPTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User Information
  name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (validate_email(email)),
  phone TEXT CHECK (phone IS NULL OR validate_uk_phone(phone)),

  -- Assessment Metadata
  assessment_version TEXT DEFAULT '1.0',
  submission_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completion_time_seconds INTEGER CHECK (completion_time_seconds > 0),

  -- Assessment Answers (JSONB for flexibility)
  answers JSONB NOT NULL,

  -- Calculated Profile
  profile JSONB NOT NULL,
  qualified BOOLEAN NOT NULL,
  tier TEXT CHECK (tier IN ('not-qualified', 'developing', 'established', 'elite')),
  investment_level TEXT CHECK (investment_level IN ('low', 'moderate', 'high', 'premium')),
  readiness_score DECIMAL(5,2) CHECK (readiness_score >= 0 AND readiness_score <= 100),
  performance_level TEXT,
  recommended_programme TEXT,
  estimated_investment TEXT,

  -- GDPR Compliance
  consent_given BOOLEAN DEFAULT false NOT NULL,
  consent_timestamp TIMESTAMPTZ,
  consent_version TEXT DEFAULT '1.0',
  ip_address INET,
  user_agent TEXT,

  -- Marketing Preferences
  marketing_consent BOOLEAN DEFAULT false,
  contact_preference TEXT CHECK (contact_preference IN ('email', 'phone', 'both', 'none')) DEFAULT 'email',

  -- Admin Fields
  contacted BOOLEAN DEFAULT false,
  contacted_date TIMESTAMPTZ,
  contacted_by TEXT,
  admin_notes TEXT,
  follow_up_date DATE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'not_qualified', 'archived')),

  -- Analytics
  source TEXT,
  medium TEXT,
  campaign TEXT,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- GDPR Consent Log
CREATE TABLE IF NOT EXISTS public.gdpr_consent_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL CHECK (validate_email(email)),
  consent_type TEXT NOT NULL CHECK (consent_type IN ('assessment', 'marketing', 'data_processing')),
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  consent_version TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Admin Audit Log
CREATE TABLE IF NOT EXISTS public.assessment_admin_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  admin_user TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('view', 'contact', 'update_status', 'add_note', 'export', 'delete')),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- SECTION 5: SUBSCRIPTIONS AND BILLING (STRIPE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tier TEXT UNIQUE NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stripe_price_id_monthly TEXT,
  stripe_price_id_quarterly TEXT,
  stripe_price_id_annual TEXT,
  price_monthly_gbp INTEGER NOT NULL CHECK (price_monthly_gbp > 0),
  price_quarterly_gbp INTEGER NOT NULL CHECK (price_quarterly_gbp > 0),
  price_annual_gbp INTEGER NOT NULL CHECK (price_annual_gbp > 0),
  description TEXT,
  features JSONB DEFAULT '[]',
  badge TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'quarterly', 'annual')),
  price_gbp INTEGER NOT NULL CHECK (price_gbp > 0),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER CHECK (card_exp_month >= 1 AND card_exp_month <= 12),
  card_exp_year INTEGER CHECK (card_exp_year >= EXTRACT(YEAR FROM NOW())),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  invoice_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  amount_paid INTEGER NOT NULL CHECK (amount_paid >= 0),
  amount_due INTEGER NOT NULL CHECK (amount_due >= 0),
  amount_remaining INTEGER NOT NULL CHECK (amount_remaining >= 0),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  tax INTEGER DEFAULT 0 CHECK (tax >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  currency TEXT DEFAULT 'gbp',
  description TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ============================================================================
-- SECTION 6: COACHING AND SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coaching_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (validate_email(email)),
  phone TEXT CHECK (phone IS NULL OR validate_uk_phone(phone)),
  programme TEXT NOT NULL,
  goals TEXT NOT NULL,
  experience TEXT,
  availability TEXT,
  location TEXT,
  message TEXT,
  data_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'archived')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Session Participants
  coach_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Details
  session_type TEXT CHECK (session_type IN ('initial_consultation', 'one_to_one', 'group', 'assessment', 'review')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Scheduling
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  timezone TEXT DEFAULT 'Europe/London',

  -- Location/Format
  format TEXT CHECK (format IN ('in_person', 'video_call', 'phone_call')) NOT NULL,
  location_address TEXT,
  video_call_link TEXT,

  -- Session Content
  session_plan JSONB,
  exercises_prescribed JSONB,
  homework_assigned JSONB,

  -- Performance Metrics Recorded
  metrics_recorded JSONB,
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

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User Reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coaching_session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,

  -- Measurement Date
  recorded_date DATE NOT NULL,
  recorded_by TEXT CHECK (recorded_by IN ('self', 'coach', 'device')) DEFAULT 'self',

  -- Body Composition
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg < 500),
  body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  muscle_mass_kg DECIMAL(5,2) CHECK (muscle_mass_kg >= 0 AND muscle_mass_kg < 200),

  -- Strength Metrics (kg)
  squat_1rm_kg DECIMAL(5,2) CHECK (squat_1rm_kg >= 0),
  deadlift_1rm_kg DECIMAL(5,2) CHECK (deadlift_1rm_kg >= 0),
  bench_press_1rm_kg DECIMAL(5,2) CHECK (bench_press_1rm_kg >= 0),

  -- Cardiovascular Fitness
  resting_heart_rate INTEGER CHECK (resting_heart_rate > 0 AND resting_heart_rate < 200),
  vo2_max DECIMAL(4,2) CHECK (vo2_max > 0 AND vo2_max < 100),

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

-- ============================================================================
-- SECTION 7: BLOG AND CONTENT MANAGEMENT
-- ============================================================================

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  meta_title VARCHAR(255),
  meta_description TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0 CHECK (usage_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors table
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  expertise JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  featured_image_alt TEXT,
  featured_image_caption TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,

  -- Content type
  content_type VARCHAR(50) DEFAULT 'article' CHECK (content_type IN ('article', 'case_study', 'research_paper', 'video_post')),

  -- Status management
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  -- SEO metadata
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  canonical_url TEXT,

  -- Content metadata
  reading_time INTEGER CHECK (reading_time > 0),
  word_count INTEGER CHECK (word_count > 0),
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', NULL)),

  -- Engagement metrics
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),
  share_count INTEGER DEFAULT 0 CHECK (share_count >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),

  -- Feature flags
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  show_toc BOOLEAN DEFAULT true,
  show_related BOOLEAN DEFAULT true,

  -- Search optimisation
  search_vector tsvector,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete

  CONSTRAINT valid_scheduled_for CHECK (
    (status != 'scheduled') OR (scheduled_for IS NOT NULL)
  ),
  CONSTRAINT valid_published_at CHECK (
    (status != 'published') OR (published_at IS NOT NULL)
  )
);

-- Post tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================================================
-- SECTION 8: LEAD GENERATION AND CONVERSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('ebook', 'guide', 'checklist', 'video', 'webinar', 'assessment', 'template')) NOT NULL,
  file_url TEXT,
  file_size_mb DECIMAL(10,2) CHECK (file_size_mb > 0),
  page_count INTEGER CHECK (page_count > 0),
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  target_audience JSONB DEFAULT '[]',
  topic_tags JSONB DEFAULT '[]',
  download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
  conversion_rate DECIMAL(5,2) CHECK (conversion_rate >= 0 AND conversion_rate <= 100),
  average_rating DECIMAL(3,2) CHECK (average_rating >= 0 AND average_rating <= 5),
  is_active BOOLEAN DEFAULT true,
  requires_assessment BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lead_magnet_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_magnet_id UUID REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  email TEXT NOT NULL CHECK (validate_email(email)),
  name TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  referrer_url TEXT,
  landing_page_url TEXT,
  download_url TEXT,
  download_expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
  last_downloaded_at TIMESTAMPTZ,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  resource_accessed BOOLEAN DEFAULT false,
  resource_accessed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER CHECK (time_spent_seconds >= 0),
  converted_to_assessment BOOLEAN DEFAULT false,
  assessment_completed_at TIMESTAMPTZ,
  converted_to_programme BOOLEAN DEFAULT false,
  programme_purchased_at TIMESTAMPTZ,
  programme_type TEXT,
  consent_given BOOLEAN DEFAULT false NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.performance_barriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL CHECK (validate_email(email)),
  time_constraints BOOLEAN DEFAULT false,
  lack_of_confidence BOOLEAN DEFAULT false,
  past_failures BOOLEAN DEFAULT false,
  unclear_goals BOOLEAN DEFAULT false,
  no_accountability BOOLEAN DEFAULT false,
  information_overload BOOLEAN DEFAULT false,
  financial_concerns BOOLEAN DEFAULT false,
  work_life_balance BOOLEAN DEFAULT false,
  time_severity INTEGER CHECK (time_severity BETWEEN 1 AND 10),
  confidence_severity INTEGER CHECK (confidence_severity BETWEEN 1 AND 10),
  motivation_severity INTEGER CHECK (motivation_severity BETWEEN 1 AND 10),
  recommended_solutions JSONB,
  action_plan JSONB,
  why_different_framework TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.programme_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  primary_programme TEXT NOT NULL CHECK (primary_programme IN ('Foundation', 'Acceleration', 'Elite')),
  alternative_programme TEXT CHECK (alternative_programme IN ('Foundation', 'Acceleration', 'Elite')),
  foundation_match_score DECIMAL(5,2) CHECK (foundation_match_score >= 0 AND foundation_match_score <= 100),
  acceleration_match_score DECIMAL(5,2) CHECK (acceleration_match_score >= 0 AND acceleration_match_score <= 100),
  elite_match_score DECIMAL(5,2) CHECK (elite_match_score >= 0 AND elite_match_score <= 100),
  matching_factors JSONB NOT NULL,
  unique_benefits JSONB,
  expected_outcomes JSONB,
  recommended_price DECIMAL(10,2) NOT NULL CHECK (recommended_price > 0),
  payment_options JSONB,
  value_proposition TEXT,
  urgency_factor TEXT,
  next_steps JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- SECTION 9: SUCCESS METRICS AND TESTIMONIALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.client_success_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'energy_increase', 'productivity_gain', 'stress_reduction',
    'performance_improvement', 'roi_achieved', 'goals_achieved',
    'weight_loss', 'strength_gain', 'endurance_improvement'
  )),
  metric_value DECIMAL(10,2) NOT NULL CHECK (metric_value >= 0),
  metric_unit TEXT NOT NULL,
  client_industry TEXT,
  client_role_level TEXT CHECK (client_role_level IN ('Executive', 'Senior Manager', 'Manager', 'Professional')),
  programme_type TEXT CHECK (programme_type IN ('Foundation', 'Performance', 'Elite')),
  measurement_period TEXT,
  achievement_date DATE,
  is_featured BOOLEAN DEFAULT false,
  display_priority INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  verification_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL,
  client_company TEXT,
  client_image_url TEXT,
  headline TEXT NOT NULL,
  testimonial_text TEXT NOT NULL,
  video_url TEXT,
  key_results JSONB,
  programme_type TEXT CHECK (programme_type IN ('Foundation', 'Performance', 'Elite')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  category TEXT CHECK (category IN ('Executive', 'Entrepreneur', 'Professional', 'Elite Athlete')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- SECTION 10: EMAIL MARKETING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  from_name TEXT DEFAULT 'Leah Fowler',
  from_email TEXT DEFAULT 'leah@leahfowlerperformance.com' CHECK (validate_email(from_email)),
  type TEXT CHECK (type IN ('newsletter', 'nurture', 'promotional', 'transactional', 'automated')) NOT NULL,
  automation_trigger TEXT,
  html_content TEXT,
  plain_text_content TEXT,
  segment_criteria JSONB,
  recipient_count INTEGER DEFAULT 0 CHECK (recipient_count >= 0),
  sent_count INTEGER DEFAULT 0 CHECK (sent_count >= 0),
  delivered_count INTEGER DEFAULT 0 CHECK (delivered_count >= 0),
  opened_count INTEGER DEFAULT 0 CHECK (opened_count >= 0),
  clicked_count INTEGER DEFAULT 0 CHECK (clicked_count >= 0),
  unsubscribed_count INTEGER DEFAULT 0 CHECK (unsubscribed_count >= 0),
  bounced_count INTEGER DEFAULT 0 CHECK (bounced_count >= 0),
  open_rate DECIMAL(5,2) CHECK (open_rate >= 0 AND open_rate <= 100),
  click_rate DECIMAL(5,2) CHECK (click_rate >= 0 AND click_rate <= 100),
  conversion_rate DECIMAL(5,2) CHECK (conversion_rate >= 0 AND conversion_rate <= 100),
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')) DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (validate_email(email)),
  first_name TEXT,
  last_name TEXT,
  status TEXT CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained', 'cleaned')) DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  tags JSONB DEFAULT '[]',
  segments JSONB DEFAULT '[]',
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  source TEXT,
  signup_method TEXT CHECK (signup_method IN ('form', 'import', 'api', 'assessment', 'lead_magnet')),
  last_email_sent_at TIMESTAMPTZ,
  last_email_opened_at TIMESTAMPTZ,
  last_email_clicked_at TIMESTAMPTZ,
  total_emails_sent INTEGER DEFAULT 0 CHECK (total_emails_sent >= 0),
  total_emails_opened INTEGER DEFAULT 0 CHECK (total_emails_opened >= 0),
  total_emails_clicked INTEGER DEFAULT 0 CHECK (total_emails_clicked >= 0),
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- SECTION 11: ENGAGEMENT AND ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.engagement_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'assessment_started', 'assessment_completed', 'assessment_abandoned',
    'barrier_quiz_started', 'barrier_quiz_completed',
    'programme_viewed', 'programme_compared',
    'calendar_opened', 'whatsapp_clicked',
    'exit_intent_shown', 'exit_intent_converted',
    'testimonial_viewed', 'metrics_viewed',
    'contact_form_opened', 'contact_form_submitted'
  )),
  event_data JSONB,
  page_url TEXT,
  referrer TEXT,
  time_on_page INTEGER CHECK (time_on_page >= 0),
  scroll_depth INTEGER CHECK (scroll_depth >= 0 AND scroll_depth <= 100),
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Analytics events partitioned by month for better performance
CREATE TABLE IF NOT EXISTS public.analytics_events_2025_01 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- ============================================================================
-- SECTION 12: WEARABLE INTEGRATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type TEXT CHECK (device_type IN ('fitbit', 'garmin', 'apple_watch', 'whoop', 'oura', 'polar', 'other')) NOT NULL,
  device_id TEXT,
  device_name TEXT,
  access_token TEXT, -- Encrypted in application
  refresh_token TEXT, -- Encrypted in application
  token_expires_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')) DEFAULT 'daily',
  sync_activity BOOLEAN DEFAULT true,
  sync_heart_rate BOOLEAN DEFAULT true,
  sync_sleep BOOLEAN DEFAULT true,
  sync_nutrition BOOLEAN DEFAULT false,
  sync_weight BOOLEAN DEFAULT true,
  connection_status TEXT CHECK (connection_status IN ('active', 'expired', 'revoked', 'error')) DEFAULT 'active',
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, device_type, device_id)
);

CREATE TABLE IF NOT EXISTS public.wearable_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES public.wearable_connections(id) ON DELETE CASCADE,
  data_type TEXT CHECK (data_type IN ('activity', 'heart_rate', 'sleep', 'nutrition', 'weight', 'workout')) NOT NULL,
  recorded_date DATE NOT NULL,
  raw_data JSONB NOT NULL,
  processed_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, connection_id, data_type, recorded_date)
);

-- ============================================================================
-- SECTION 13: CALENDAR INTEGRATION (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.calendar_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  provider TEXT CHECK (provider IN ('google', 'outlook', 'apple', 'caldav')) NOT NULL,
  access_token TEXT, -- Encrypted
  refresh_token TEXT, -- Encrypted
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT,
  calendar_name TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  sync_direction TEXT CHECK (sync_direction IN ('pull', 'push', 'both')) DEFAULT 'both',
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT CHECK (sync_frequency IN ('realtime', 'hourly', 'daily')) DEFAULT 'hourly',
  connection_status TEXT CHECK (connection_status IN ('active', 'expired', 'error')) DEFAULT 'active',
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- SECTION 14: SECURITY AND RATE LIMITING (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user_id
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1 CHECK (requests_count > 0),
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_success', 'login_failed', 'logout', 'password_reset',
    'email_changed', 'profile_updated', 'subscription_changed',
    'admin_action', 'data_export', 'data_deletion', 'suspicious_activity'
  )),
  event_details JSONB,
  ip_address INET,
  user_agent TEXT,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CREATE ALL INDEXES
-- ============================================================================

-- Assessment indexes
CREATE INDEX idx_assessment_submissions_email ON public.assessment_submissions(email);
CREATE INDEX idx_assessment_submissions_qualified ON public.assessment_submissions(qualified);
CREATE INDEX idx_assessment_submissions_status ON public.assessment_submissions(status);
CREATE INDEX idx_assessment_submissions_created_at ON public.assessment_submissions(created_at DESC);
CREATE INDEX idx_assessment_submissions_tier ON public.assessment_submissions(tier);

-- User profile indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_programme ON public.user_profiles(current_programme) WHERE current_programme IS NOT NULL;
CREATE INDEX idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
CREATE INDEX idx_user_profiles_last_active ON public.user_profiles(last_active_at DESC);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Coaching indexes
CREATE INDEX idx_coaching_sessions_coach ON public.coaching_sessions(coach_id);
CREATE INDEX idx_coaching_sessions_client ON public.coaching_sessions(client_id);
CREATE INDEX idx_coaching_sessions_date ON public.coaching_sessions(scheduled_date, scheduled_time);
CREATE INDEX idx_coaching_sessions_status ON public.coaching_sessions(status);
CREATE INDEX idx_coaching_sessions_upcoming ON public.coaching_sessions(scheduled_date, scheduled_time)
  WHERE status IN ('scheduled', 'confirmed') AND scheduled_date >= CURRENT_DATE;

-- Performance metrics indexes
CREATE INDEX idx_performance_metrics_user ON public.performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_date ON public.performance_metrics(recorded_date DESC);

-- Blog indexes
CREATE INDEX idx_posts_slug ON public.posts(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON public.posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_search_vector ON public.posts USING gin(search_vector);

-- Email indexes
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON public.email_subscribers(status) WHERE status = 'active';

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_session ON public.analytics_events(user_id, session_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp DESC);
CREATE INDEX idx_engagement_tracking_session ON public.engagement_tracking(session_id);
CREATE INDEX idx_engagement_tracking_created ON public.engagement_tracking(created_at DESC);

-- Security indexes
CREATE INDEX idx_rate_limits_identifier ON public.rate_limits(identifier, endpoint);
CREATE INDEX idx_security_audit_user ON public.security_audit_log(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_security_audit_severity ON public.security_audit_log(severity, created_at DESC);

-- ============================================================================
-- CREATE ALL TRIGGERS
-- ============================================================================

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_admin_roles_updated_at BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_submissions_updated_at BEFORE UPDATE ON public.assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaching_applications_updated_at BEFORE UPDATE ON public.coaching_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON public.coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON public.performance_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_magnets_updated_at BEFORE UPDATE ON public.lead_magnets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_subscribers_updated_at BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wearable_connections_updated_at BEFORE UPDATE ON public.wearable_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_integrations_updated_at BEFORE UPDATE ON public.calendar_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_admin_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnet_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Admin role policies
CREATE POLICY "Super admins can manage roles" ON public.admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid() AND ar.role_name = 'super_admin'
    )
  );

-- User profile policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Assessment policies
CREATE POLICY "Anyone can insert assessment" ON public.assessment_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all assessments" ON public.assessment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Coaching session policies
CREATE POLICY "Users can view own sessions" ON public.coaching_sessions
  FOR SELECT USING (auth.uid() IN (coach_id, client_id));

-- Blog policies
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Authors can manage own posts" ON public.posts
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.authors WHERE id = posts.author_id
    )
  );

-- Public read policies
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view active authors" ON public.authors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view approved testimonials" ON public.testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view featured metrics" ON public.client_success_metrics
  FOR SELECT USING (is_featured = true);

CREATE POLICY "Public can view active lead magnets" ON public.lead_magnets
  FOR SELECT USING (is_active = true);

-- Insert policies for public forms
CREATE POLICY "Anyone can download lead magnets" ON public.lead_magnet_downloads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit coaching application" ON public.coaching_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to emails" ON public.email_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track engagement" ON public.engagement_tracking
  FOR INSERT WITH CHECK (true);

-- Service role policies
CREATE POLICY "Service role manages webhooks" ON public.webhook_events
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role manages email campaigns" ON public.email_campaigns
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- INSERT DEFAULT DATA
-- ============================================================================

-- Insert pricing tiers
INSERT INTO public.pricing_tiers (tier, name, slug, price_monthly_gbp, price_quarterly_gbp, price_annual_gbp, description, features, badge, is_popular, display_order)
VALUES
  ('foundation', 'Foundation', 'foundation', 197, 497, 1970,
   'For those building their commitment to excellence',
   '["Group Training (max 6 people)", "Trainerize App Programming", "Monthly Progress Reviews", "Access to Exercise Library", "Community Support Group", "Commitment Tracking Tools"]'::jsonb,
   NULL, false, 1),

  ('performance', 'Performance', 'performance', 497, 1297, 4970,
   'For the seriously committed athlete or high achiever',
   '["Everything in Foundation, plus:", "Weekly 1-to-1 Coaching", "Fully Customised Programming", "Nutrition Optimisation Plan", "WhatsApp Support Access", "Competition Preparation", "Performance Testing & Metrics", "Recovery Protocol Design", "Monthly Performance Analysis"]'::jsonb,
   'MOST POPULAR', true, 2),

  ('elite', 'Elite Performance', 'elite', 997, 2497, 9970,
   'For those pursuing excellence without compromise',
   '["Everything in Performance, plus:", "2x Weekly Training Sessions", "Competition & Event Preparation", "Full Lifestyle Optimisation", "Daily WhatsApp Check-ins", "Quarterly Testing & Assessment", "Priority Access to All Services", "Family Member Discount (25%)", "VIP Events & Masterminds", "Lifetime Alumni Benefits"]'::jsonb,
   NULL, false, 3),

  ('youth', 'Youth Development', 'youth', 297, 797, 2970,
   'Safe strength training for young athletes (ages 8-18)',
   '["Age-Appropriate Programming", "Sport-Specific Development", "2x Weekly Group Sessions", "Long-Term Athletic Development", "Injury Prevention Focus", "Parent Education Included", "Quarterly Progress Testing", "Competition Preparation", "Nutritional Guidance for Growth", "Sibling Discount Available"]'::jsonb,
   'UNIQUE', false, 4)
ON CONFLICT (tier) DO NOTHING;

-- Insert blog categories
INSERT INTO public.categories (slug, name, description, icon, color, position)
VALUES
  ('sleep-recovery', 'Sleep & Recovery', 'Optimise your sleep and recovery for better performance', 'Moon', 'from-blue-500 to-indigo-600', 1),
  ('breaking-barriers', 'Breaking Exercise Barriers', 'Overcome obstacles and build sustainable exercise habits', 'Dumbbell', 'from-purple-500 to-pink-600', 2),
  ('strength-longevity', 'Strength & Longevity', 'Build strength for a longer, healthier life', 'Heart', 'from-red-500 to-orange-600', 3),
  ('nutrition-performance', 'Nutrition for Performance', 'Fuel your body for optimal performance', 'Utensils', 'from-green-500 to-teal-600', 4),
  ('lifestyle-optimisation', 'Lifestyle Optimisation', 'Habits and strategies for peak performance', 'Brain', 'from-amber-500 to-yellow-600', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default author
INSERT INTO public.authors (slug, display_name, bio, expertise)
VALUES
  ('leah-fowler', 'Leah Fowler',
   'Performance Consultant specialising in strength training, nutrition, and lifestyle optimisation for busy professionals.',
   '["Strength Training", "Nutrition Science", "Sleep Optimisation", "Behaviour Change"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

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

-- Insert sample success metrics
INSERT INTO public.client_success_metrics (metric_type, metric_value, metric_unit, client_industry, client_role_level, programme_type, measurement_period, is_featured, display_priority)
VALUES
  ('energy_increase', 47, '%', 'Finance', 'Executive', 'Elite', '3 months', true, 1),
  ('productivity_gain', 38, '%', 'Technology', 'Senior Manager', 'Performance', '6 months', true, 2),
  ('stress_reduction', 52, '%', 'Healthcare', 'Manager', 'Foundation', '3 months', true, 3),
  ('roi_achieved', 312, '%', 'Consulting', 'Executive', 'Elite', '12 months', true, 4);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Public (anonymous) access
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.tags TO anon;
GRANT SELECT ON public.authors TO anon;
GRANT SELECT ON public.posts TO anon;
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT ON public.client_success_metrics TO anon;
GRANT SELECT ON public.lead_magnets TO anon;
GRANT SELECT ON public.pricing_tiers TO anon;

GRANT INSERT ON public.assessment_submissions TO anon;
GRANT INSERT ON public.coaching_applications TO anon;
GRANT INSERT ON public.lead_magnet_downloads TO anon;
GRANT INSERT ON public.email_subscribers TO anon;
GRANT INSERT ON public.engagement_tracking TO anon;

-- Authenticated user access
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Service role (full access)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================================
-- VERIFICATION QUERIES (Run these after migration to verify success)
-- ============================================================================

/*
-- Verify all tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify RLS is enabled
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;

-- Verify indexes created
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify policies created
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check for any errors in functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
*/

-- ============================================================================
-- ROLLBACK SCRIPT (Save this separately before running migration)
-- ============================================================================

/*
-- DANGER: This will DROP all tables and functions. Only use if migration fails.

-- Drop all policies first
DROP POLICY IF EXISTS * ON public.*;

-- Drop all tables (in reverse order of creation to respect foreign keys)
DROP TABLE IF EXISTS public.security_audit_log CASCADE;
DROP TABLE IF EXISTS public.rate_limits CASCADE;
DROP TABLE IF EXISTS public.calendar_integrations CASCADE;
DROP TABLE IF EXISTS public.wearable_data CASCADE;
DROP TABLE IF EXISTS public.wearable_connections CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.engagement_tracking CASCADE;
DROP TABLE IF EXISTS public.email_subscribers CASCADE;
DROP TABLE IF EXISTS public.email_campaigns CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.client_success_metrics CASCADE;
DROP TABLE IF EXISTS public.programme_recommendations CASCADE;
DROP TABLE IF EXISTS public.performance_barriers CASCADE;
DROP TABLE IF EXISTS public.lead_magnet_downloads CASCADE;
DROP TABLE IF EXISTS public.lead_magnets CASCADE;
DROP TABLE IF EXISTS public.post_tags CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;
DROP TABLE IF EXISTS public.coaching_sessions CASCADE;
DROP TABLE IF EXISTS public.coaching_applications CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.pricing_tiers CASCADE;
DROP TABLE IF EXISTS public.assessment_admin_log CASCADE;
DROP TABLE IF EXISTS public.gdpr_consent_log CASCADE;
DROP TABLE IF EXISTS public.assessment_submissions CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.admin_roles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.validate_email(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.validate_uk_phone(TEXT) CASCADE;

-- Drop extensions if needed
-- DROP EXTENSION IF EXISTS pgcrypto CASCADE;
-- DROP EXTENSION IF EXISTS pg_trgm CASCADE;
-- DROP EXTENSION IF EXISTS unaccent CASCADE;
*/

-- ============================================================================
-- END OF MASTER MIGRATION SCRIPT
-- ============================================================================


-- ================================================
-- Migration: 001_STORAGE_BUCKETS.sql
-- ================================================

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


-- ================================================
-- Migration Verification
-- ================================================

-- ============================================================================
-- MIGRATION VERIFICATION SCRIPT FOR LEAH FOWLER PERFORMANCE COACH
-- ============================================================================
-- Version: 1.0.0
-- Date: 2025-09-27
-- Description: Comprehensive verification queries to validate migration success
--
-- Run these queries after migration to ensure everything is working correctly
-- ============================================================================

-- ============================================================================
-- SECTION 1: TABLE VERIFICATION
-- ============================================================================

-- Check all tables were created successfully
SELECT
  'Tables Created' as check_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE table_name IN (
    'admin_roles', 'admin_users', 'user_profiles', 'assessment_submissions',
    'gdpr_consent_log', 'assessment_admin_log', 'pricing_tiers', 'subscriptions',
    'payment_methods', 'invoices', 'webhook_events', 'coaching_applications',
    'coaching_sessions', 'performance_metrics', 'categories', 'tags', 'authors',
    'posts', 'post_tags', 'lead_magnets', 'lead_magnet_downloads',
    'performance_barriers', 'programme_recommendations', 'client_success_metrics',
    'testimonials', 'email_campaigns', 'email_subscribers', 'engagement_tracking',
    'analytics_events', 'wearable_connections', 'wearable_data',
    'calendar_integrations', 'rate_limits', 'security_audit_log'
  )) as expected_tables,
  CASE
    WHEN COUNT(*) >= 35 THEN '✅ PASS'
    ELSE '❌ FAIL - Missing tables'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- List any missing tables
WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'admin_roles', 'admin_users', 'user_profiles', 'assessment_submissions',
    'gdpr_consent_log', 'assessment_admin_log', 'pricing_tiers', 'subscriptions',
    'payment_methods', 'invoices', 'webhook_events', 'coaching_applications',
    'coaching_sessions', 'performance_metrics', 'categories', 'tags', 'authors',
    'posts', 'post_tags', 'lead_magnets', 'lead_magnet_downloads',
    'performance_barriers', 'programme_recommendations', 'client_success_metrics',
    'testimonials', 'email_campaigns', 'email_subscribers', 'engagement_tracking',
    'analytics_events', 'wearable_connections', 'wearable_data',
    'calendar_integrations', 'rate_limits', 'security_audit_log'
  ]) as table_name
)
SELECT
  'Missing Tables' as check_type,
  et.table_name
FROM expected_tables et
LEFT JOIN information_schema.tables t
  ON t.table_name = et.table_name
  AND t.table_schema = 'public'
WHERE t.table_name IS NULL;

-- ============================================================================
-- SECTION 2: ROW LEVEL SECURITY VERIFICATION
-- ============================================================================

-- Check RLS is enabled on all tables
SELECT
  'RLS Enabled' as check_type,
  tablename,
  rowsecurity,
  CASE
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled - SECURITY RISK!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN ('schema_migrations') -- Exclude migration tracking tables
ORDER BY
  CASE WHEN rowsecurity = false THEN 0 ELSE 1 END,
  tablename;

-- Count RLS policies per table
SELECT
  'RLS Policies' as check_type,
  tablename,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policies,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '⚠️ No policies defined'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC, tablename;

-- ============================================================================
-- SECTION 3: INDEX VERIFICATION
-- ============================================================================

-- Check critical indexes exist
SELECT
  'Critical Indexes' as check_type,
  tablename,
  COUNT(*) as index_count,
  string_agg(indexname, ', ') as indexes
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
  'assessment_submissions', 'subscriptions', 'coaching_sessions',
  'performance_metrics', 'posts', 'email_subscribers', 'analytics_events'
)
GROUP BY tablename
ORDER BY tablename;

-- Check for missing foreign key indexes
SELECT
  'Missing FK Indexes' as check_type,
  tc.table_name,
  kcu.column_name,
  '⚠️ Missing index on foreign key' as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN pg_indexes pi
  ON pi.schemaname = tc.table_schema
  AND pi.tablename = tc.table_name
  AND pi.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND pi.indexname IS NULL;

-- ============================================================================
-- SECTION 4: FUNCTION VERIFICATION
-- ============================================================================

-- Check all required functions exist
SELECT
  'Functions' as check_type,
  routine_name,
  routine_type,
  CASE
    WHEN routine_name IN (
      'update_updated_at_column', 'validate_email', 'validate_uk_phone',
      'anonymize_assessment_submission', 'get_assessment_statistics',
      'get_programme_recommendation', 'get_live_success_metrics',
      'calculate_related_posts', 'get_user_progress_summary',
      'calculate_client_ltv', 'calculate_lead_score',
      'export_user_data', 'delete_user_data'
    ) THEN '✅ Core function'
    ELSE '📝 Additional function'
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================================================
-- SECTION 5: TRIGGER VERIFICATION
-- ============================================================================

-- Check updated_at triggers
SELECT
  'Updated_at Triggers' as check_type,
  event_object_table as table_name,
  trigger_name,
  CASE
    WHEN action_timing = 'BEFORE' AND event_manipulation = 'UPDATE' THEN '✅ Correct'
    ELSE '⚠️ Check configuration'
  END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================================================
-- SECTION 6: DATA VERIFICATION
-- ============================================================================

-- Check default data was inserted
SELECT
  'Default Data' as check_type,
  'Pricing Tiers' as data_type,
  COUNT(*) as count,
  string_agg(tier, ', ') as items,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ All tiers present'
    ELSE '❌ Missing tiers'
  END as status
FROM public.pricing_tiers

UNION ALL

SELECT
  'Default Data',
  'Blog Categories',
  COUNT(*),
  string_agg(name, ', ' ORDER BY position),
  CASE
    WHEN COUNT(*) >= 5 THEN '✅ Categories present'
    ELSE '⚠️ Check categories'
  END
FROM public.categories

UNION ALL

SELECT
  'Default Data',
  'Admin Roles',
  COUNT(*),
  string_agg(role_name, ', '),
  CASE
    WHEN COUNT(*) = 5 THEN '✅ All roles present'
    ELSE '❌ Missing roles'
  END
FROM public.admin_roles

UNION ALL

SELECT
  'Default Data',
  'Lead Magnets',
  COUNT(*),
  string_agg(title, ', '),
  CASE
    WHEN COUNT(*) >= 3 THEN '✅ Lead magnets present'
    ELSE '⚠️ Check lead magnets'
  END
FROM public.lead_magnets;

-- ============================================================================
-- SECTION 7: CONSTRAINT VERIFICATION
-- ============================================================================

-- Check important constraints
SELECT
  'Constraints' as check_type,
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name,
  CASE
    WHEN tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'UNIQUE') THEN '✅'
    ELSE '📝'
  END as status
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('user_profiles', 'assessment_submissions', 'subscriptions', 'coaching_sessions')
ORDER BY tc.table_name, tc.constraint_type;

-- ============================================================================
-- SECTION 8: STORAGE VERIFICATION
-- ============================================================================

-- Check storage buckets
SELECT
  'Storage Buckets' as check_type,
  id as bucket_name,
  public as is_public,
  ROUND(file_size_limit / 1048576.0, 0) || ' MB' as size_limit,
  array_length(allowed_mime_types, 1) || ' types' as mime_types,
  CASE
    WHEN id IN ('avatars', 'lead-magnets', 'blog-images', 'coaching-resources', 'exports') THEN '✅ Core bucket'
    ELSE '📝 Additional bucket'
  END as status
FROM storage.buckets
ORDER BY id;

-- Check storage policies
SELECT
  'Storage Policies' as check_type,
  bucket_id,
  action,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '⚠️ No policies'
  END as status
FROM storage.policies
GROUP BY bucket_id, action
ORDER BY bucket_id, action;

-- ============================================================================
-- SECTION 9: PERFORMANCE CHECKS
-- ============================================================================

-- Table sizes and row counts
SELECT
  'Table Sizes' as check_type,
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  n_live_tup as row_count,
  n_dead_tup as dead_rows,
  CASE
    WHEN n_dead_tup > n_live_tup * 0.2 THEN '⚠️ Needs VACUUM'
    ELSE '✅ Healthy'
  END as health_status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Check for slow queries (if pg_stat_statements is enabled)
-- Uncomment if extension is available
/*
SELECT
  'Slow Queries' as check_type,
  substring(query, 1, 50) || '...' as query_start,
  calls,
  ROUND(mean_exec_time::numeric, 2) as avg_ms,
  ROUND(max_exec_time::numeric, 2) as max_ms,
  CASE
    WHEN mean_exec_time > 1000 THEN '❌ Very slow'
    WHEN mean_exec_time > 100 THEN '⚠️ Slow'
    ELSE '✅ Fast'
  END as performance
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
AND mean_exec_time > 50
ORDER BY mean_exec_time DESC
LIMIT 10;
*/

-- ============================================================================
-- SECTION 10: SECURITY AUDIT
-- ============================================================================

-- Check for tables without RLS
SELECT
  'Security Audit' as check_type,
  'Tables without RLS' as issue,
  tablename,
  '❌ SECURITY RISK - Enable RLS' as recommendation
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
AND tablename NOT IN ('schema_migrations')

UNION ALL

-- Check for overly permissive policies
SELECT
  'Security Audit',
  'Permissive Policies',
  tablename || ': ' || policyname,
  CASE
    WHEN qual = 'true' THEN '⚠️ Review - Very permissive'
    ELSE '✅ Has conditions'
  END
FROM pg_policies
WHERE schemaname = 'public'
AND (qual = 'true' OR qual IS NULL)
AND cmd = 'SELECT';

-- ============================================================================
-- SECTION 11: MIGRATION SUMMARY
-- ============================================================================

WITH summary AS (
  SELECT
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as index_count,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as function_count,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as trigger_count,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as policy_count,
    (SELECT COUNT(*) FROM storage.buckets) as bucket_count
)
SELECT
  '=' as "=",
  'MIGRATION SUMMARY' as "=",
  '=' as "="
FROM generate_series(1, 50)

UNION ALL

SELECT
  '',
  'Tables: ' || table_count,
  CASE WHEN table_count >= 35 THEN '✅' ELSE '❌' END
FROM summary

UNION ALL

SELECT
  '',
  'Indexes: ' || index_count,
  CASE WHEN index_count >= 50 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Functions: ' || function_count,
  CASE WHEN function_count >= 10 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Triggers: ' || trigger_count,
  CASE WHEN trigger_count >= 20 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'RLS Policies: ' || policy_count,
  CASE WHEN policy_count >= 30 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '',
  'Storage Buckets: ' || bucket_count,
  CASE WHEN bucket_count >= 5 THEN '✅' ELSE '⚠️' END
FROM summary

UNION ALL

SELECT
  '=',
  '=================',
  '='
FROM generate_series(1, 1);

-- ============================================================================
-- SECTION 12: CRITICAL ISSUES CHECK
-- ============================================================================

-- This query will return rows ONLY if there are critical issues
SELECT
  '🚨 CRITICAL ISSUE' as severity,
  issue_type,
  details,
  action_required
FROM (
  -- Check for tables without primary keys
  SELECT
    'Missing Primary Key' as issue_type,
    t.table_name as details,
    'Add primary key immediately' as action_required
  FROM information_schema.tables t
  LEFT JOIN information_schema.table_constraints tc
    ON t.table_name = tc.table_name
    AND tc.constraint_type = 'PRIMARY KEY'
  WHERE t.table_schema = 'public'
  AND tc.constraint_name IS NULL

  UNION ALL

  -- Check for missing critical functions
  SELECT
    'Missing Critical Function',
    'update_updated_at_column',
    'Re-run migration - function is required'
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'update_updated_at_column'
  )

  UNION ALL

  -- Check for disabled RLS on sensitive tables
  SELECT
    'RLS Disabled on Sensitive Table',
    tablename,
    'Enable RLS immediately for security'
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename IN (
    'user_profiles', 'assessment_submissions', 'subscriptions',
    'payment_methods', 'invoices', 'coaching_sessions'
  )
) critical_issues;

-- ============================================================================
-- END OF VERIFICATION SCRIPT
-- ============================================================================

-- If all checks pass, you should see:
-- ✅ 35+ tables created
-- ✅ RLS enabled on all tables
-- ✅ Policies defined for all tables
-- ✅ All critical indexes present
-- ✅ All required functions created
-- ✅ All triggers configured
-- ✅ Default data inserted
-- ✅ Storage buckets configured

-- If you see any ❌ or ⚠️ symbols, investigate and fix the issues before proceeding.
