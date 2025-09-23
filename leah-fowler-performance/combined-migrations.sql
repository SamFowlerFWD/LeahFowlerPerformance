-- Combined Supabase Migration Script
-- Generated: 2025-09-22T21:04:59.542Z
-- Project: ltlbfltlhysjxslusypq
-- ========================================


-- ========================================
-- Migration: 001_assessment_submissions.sql
-- ========================================

-- Create assessment_submissions table for storing complete assessment data
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Assessment Metadata
  assessment_version TEXT DEFAULT '1.0',
  submission_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completion_time_seconds INTEGER,
  
  -- Assessment Answers (JSONB for flexibility)
  answers JSONB NOT NULL,
  
  -- Calculated Profile (from analyzeClientProfile)
  profile JSONB NOT NULL,
  qualified BOOLEAN NOT NULL,
  tier TEXT CHECK (tier IN ('not-qualified', 'developing', 'established', 'elite')),
  investment_level TEXT CHECK (investment_level IN ('low', 'moderate', 'high', 'premium')),
  readiness_score DECIMAL(5,2),
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
  source TEXT, -- Where they came from (utm_source)
  medium TEXT, -- Marketing medium (utm_medium)
  campaign TEXT, -- Campaign name (utm_campaign)
  referrer TEXT, -- HTTP referrer
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_assessment_submissions_email ON public.assessment_submissions(email);
CREATE INDEX idx_assessment_submissions_qualified ON public.assessment_submissions(qualified);
CREATE INDEX idx_assessment_submissions_status ON public.assessment_submissions(status);
CREATE INDEX idx_assessment_submissions_created_at ON public.assessment_submissions(created_at DESC);
CREATE INDEX idx_assessment_submissions_tier ON public.assessment_submissions(tier);
CREATE INDEX idx_assessment_submissions_investment_level ON public.assessment_submissions(investment_level);

-- Create assessment_leads view for simplified lead management
CREATE OR REPLACE VIEW public.assessment_leads AS
SELECT 
  id,
  name,
  email,
  phone,
  qualified,
  tier,
  investment_level,
  readiness_score,
  performance_level,
  recommended_programme,
  estimated_investment,
  status,
  contacted,
  follow_up_date,
  created_at,
  profile->>'strengths' as strengths,
  profile->>'gaps' as gaps,
  profile->>'nextSteps' as next_steps
FROM public.assessment_submissions
ORDER BY created_at DESC;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_assessment_submissions_updated_at
  BEFORE UPDATE ON public.assessment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create GDPR compliance table for tracking consent history
CREATE TABLE IF NOT EXISTS public.gdpr_consent_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('assessment', 'marketing', 'data_processing')),
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  consent_version TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_gdpr_consent_log_email ON public.gdpr_consent_log(email);
CREATE INDEX idx_gdpr_consent_log_submission_id ON public.gdpr_consent_log(submission_id);

-- Create admin audit log for tracking admin actions
CREATE TABLE IF NOT EXISTS public.assessment_admin_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  admin_user TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('view', 'contact', 'update_status', 'add_note', 'export', 'delete')),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_assessment_admin_log_submission_id ON public.assessment_admin_log(submission_id);
CREATE INDEX idx_assessment_admin_log_admin_user ON public.assessment_admin_log(admin_user);
CREATE INDEX idx_assessment_admin_log_action ON public.assessment_admin_log(action);

-- Row Level Security (RLS) Policies
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_admin_log ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert their own assessment submission
CREATE POLICY "Anyone can insert assessment submission" ON public.assessment_submissions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users with admin role can view submissions
CREATE POLICY "Admins can view all submissions" ON public.assessment_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Only authenticated users with admin role can update submissions
CREATE POLICY "Admins can update submissions" ON public.assessment_submissions
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Only authenticated users with admin role can delete submissions (GDPR)
CREATE POLICY "Admins can delete submissions" ON public.assessment_submissions
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Users can view their own consent history
CREATE POLICY "Users can view own consent" ON public.gdpr_consent_log
  FOR SELECT
  USING (email = auth.jwt() ->> 'email' OR auth.jwt() ->> 'role' = 'admin');

-- Policy: Anyone can insert consent log (for tracking)
CREATE POLICY "Anyone can log consent" ON public.gdpr_consent_log
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view admin logs
CREATE POLICY "Only admins can view admin logs" ON public.assessment_admin_log
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to anonymize data (GDPR right to be forgotten)
CREATE OR REPLACE FUNCTION public.anonymize_assessment_submission(submission_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.assessment_submissions
  SET 
    name = 'ANONYMIZED',
    email = CONCAT('anonymized-', submission_id, '@deleted.com'),
    phone = NULL,
    ip_address = NULL,
    user_agent = NULL,
    admin_notes = 'Data anonymized per GDPR request',
    status = 'archived',
    updated_at = NOW()
  WHERE id = submission_id;
  
  -- Log the anonymization
  INSERT INTO public.assessment_admin_log (submission_id, admin_user, action, details)
  VALUES (submission_id, auth.jwt() ->> 'email', 'delete', '{"type": "gdpr_anonymization"}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get assessment statistics (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_assessment_statistics()
RETURNS TABLE (
  total_submissions BIGINT,
  qualified_count BIGINT,
  conversion_rate DECIMAL,
  average_readiness_score DECIMAL,
  tier_distribution JSONB,
  investment_level_distribution JSONB,
  recent_submissions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_submissions,
    COUNT(*) FILTER (WHERE qualified = true)::BIGINT as qualified_count,
    ROUND(COUNT(*) FILTER (WHERE qualified = true)::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0) * 100, 2) as conversion_rate,
    ROUND(AVG(readiness_score)::DECIMAL, 2) as average_readiness_score,
    jsonb_object_agg(tier, tier_count) FILTER (WHERE tier IS NOT NULL) as tier_distribution,
    jsonb_object_agg(investment_level, inv_count) FILTER (WHERE investment_level IS NOT NULL) as investment_level_distribution,
    (
      SELECT jsonb_agg(row_to_json(s))
      FROM (
        SELECT id, name, email, qualified, tier, created_at
        FROM public.assessment_submissions
        ORDER BY created_at DESC
        LIMIT 10
      ) s
    ) as recent_submissions
  FROM (
    SELECT 
      tier,
      COUNT(*) as tier_count,
      investment_level,
      COUNT(*) as inv_count
    FROM public.assessment_submissions
    GROUP BY ROLLUP(tier, investment_level)
  ) stats
  CROSS JOIN public.assessment_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE public.assessment_submissions IS 'Stores all assessment form submissions with GDPR compliance';
COMMENT ON TABLE public.gdpr_consent_log IS 'Tracks consent history for GDPR compliance';
COMMENT ON TABLE public.assessment_admin_log IS 'Audit log for admin actions on assessment submissions';
COMMENT ON FUNCTION public.anonymize_assessment_submission IS 'Anonymizes personal data for GDPR right to be forgotten';
COMMENT ON FUNCTION public.get_assessment_statistics IS 'Returns aggregated statistics for admin dashboard';


-- ========================================
-- Migration: 001_subscriptions_schema.sql
-- ========================================

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    tier TEXT NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused')),
    billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'quarterly', 'annual')),
    price_gbp INTEGER NOT NULL,
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

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT UNIQUE NOT NULL,
    invoice_number TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    amount_paid INTEGER NOT NULL,
    amount_due INTEGER NOT NULL,
    amount_remaining INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    tax INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
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

-- Create subscription_items table
CREATE TABLE IF NOT EXISTS public.subscription_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    stripe_subscription_item_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    stripe_product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pricing_tiers table for reference
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier TEXT UNIQUE NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_price_id_monthly TEXT,
    stripe_price_id_quarterly TEXT,
    stripe_price_id_annual TEXT,
    price_monthly_gbp INTEGER NOT NULL,
    price_quarterly_gbp INTEGER NOT NULL,
    price_annual_gbp INTEGER NOT NULL,
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

-- Create webhook_events table for tracking
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

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    stripe_coupon_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value INTEGER NOT NULL, -- percentage (0-100) or fixed amount in pence
    applies_to TEXT[] DEFAULT ARRAY[]::TEXT[], -- empty means all tiers
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_discounts table
CREATE TABLE IF NOT EXISTS public.customer_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    discount_code_id UUID REFERENCES public.discount_codes(id),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_customer_id ON public.payment_methods(stripe_customer_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX idx_invoices_stripe_invoice_id ON public.invoices(stripe_invoice_id);
CREATE INDEX idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_type ON public.webhook_events(type);
CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_items_updated_at BEFORE UPDATE ON public.subscription_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON public.pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_discounts ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Payment methods policies
CREATE POLICY "Users can view own payment methods" ON public.payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment methods" ON public.payment_methods
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all invoices" ON public.invoices
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Subscription items policies (read-only for users)
CREATE POLICY "Users can view own subscription items" ON public.subscription_items
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all subscription items" ON public.subscription_items
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Pricing tiers policies (public read)
CREATE POLICY "Anyone can view active pricing tiers" ON public.pricing_tiers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage pricing tiers" ON public.pricing_tiers
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Webhook events policies (service role only)
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Discount codes policies (public read for active codes)
CREATE POLICY "Anyone can view active discount codes" ON public.discount_codes
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Service role can manage discount codes" ON public.discount_codes
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Customer discounts policies
CREATE POLICY "Users can view own discounts" ON public.customer_discounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all customer discounts" ON public.customer_discounts
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert initial pricing tiers data
INSERT INTO public.pricing_tiers (tier, name, slug, price_monthly_gbp, price_quarterly_gbp, price_annual_gbp, description, features, badge, is_popular, display_order)
VALUES
    ('foundation', 'Foundation', 'foundation', 197, 497, 1970, 'For those building their commitment to excellence',
     '["Group Training (max 6 people)", "Trainerize App Programming", "Monthly Progress Reviews", "Access to Exercise Library", "Community Support Group", "Commitment Tracking Tools"]'::jsonb,
     NULL, false, 1),

    ('performance', 'Performance', 'performance', 497, 1297, 4970, 'For the seriously committed athlete or high achiever',
     '["Everything in Foundation, plus:", "Weekly 1-to-1 Coaching", "Fully Customised Programming", "Nutrition Optimisation Plan", "WhatsApp Support Access", "Competition Preparation", "Performance Testing & Metrics", "Recovery Protocol Design", "Monthly Performance Analysis"]'::jsonb,
     'MOST POPULAR', true, 2),

    ('elite', 'Elite Performance', 'elite', 997, 2497, 9970, 'For those pursuing excellence without compromise',
     '["Everything in Performance, plus:", "2x Weekly Training Sessions", "Competition & Event Preparation", "Full Lifestyle Optimisation", "Daily WhatsApp Check-ins", "Quarterly Testing & Assessment", "Priority Access to All Services", "Family Member Discount (25%)", "VIP Events & Masterminds", "Lifetime Alumni Benefits"]'::jsonb,
     NULL, false, 3),

    ('youth', 'Youth Development', 'youth', 297, 797, 2970, 'Safe strength training for young athletes (ages 8-18)',
     '["Age-Appropriate Programming", "Sport-Specific Development", "2x Weekly Group Sessions", "Long-Term Athletic Development", "Injury Prevention Focus", "Parent Education Included", "Quarterly Progress Testing", "Competition Preparation", "Nutritional Guidance for Growth", "Sibling Discount Available"]'::jsonb,
     'UNIQUE', false, 4)
ON CONFLICT (tier) DO NOTHING;


-- ========================================
-- Migration: 002_enhanced_conversion_features.sql
-- ========================================

-- Enhanced Conversion Features Database Schema
-- UK English: optimise, programme, centre

-- 1. Barrier Identification System
CREATE TABLE IF NOT EXISTS public.performance_barriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  
  -- Identified Barriers
  time_constraints BOOLEAN DEFAULT false,
  lack_of_confidence BOOLEAN DEFAULT false,
  past_failures BOOLEAN DEFAULT false,
  unclear_goals BOOLEAN DEFAULT false,
  no_accountability BOOLEAN DEFAULT false,
  information_overload BOOLEAN DEFAULT false,
  financial_concerns BOOLEAN DEFAULT false,
  work_life_balance BOOLEAN DEFAULT false,
  
  -- Barrier Severity Scores (1-10)
  time_severity INTEGER CHECK (time_severity BETWEEN 1 AND 10),
  confidence_severity INTEGER CHECK (confidence_severity BETWEEN 1 AND 10),
  motivation_severity INTEGER CHECK (motivation_severity BETWEEN 1 AND 10),
  
  -- Personalised Solutions Generated
  recommended_solutions JSONB,
  action_plan JSONB,
  why_different_framework TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Programme Recommendations Engine
CREATE TABLE IF NOT EXISTS public.programme_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  
  -- Recommendation Details
  primary_programme TEXT NOT NULL CHECK (primary_programme IN ('Foundation', 'Acceleration', 'Elite')),
  alternative_programme TEXT CHECK (alternative_programme IN ('Foundation', 'Acceleration', 'Elite')),
  
  -- Matching Scores
  foundation_match_score DECIMAL(5,2),
  acceleration_match_score DECIMAL(5,2),
  elite_match_score DECIMAL(5,2),
  
  -- Personalisation Factors
  matching_factors JSONB NOT NULL, -- Why this programme matches
  unique_benefits JSONB, -- Specific benefits for this client
  expected_outcomes JSONB, -- Predicted results timeline
  
  -- Pricing
  recommended_price DECIMAL(10,2) NOT NULL,
  payment_options JSONB, -- Monthly, quarterly, full payment options
  value_proposition TEXT,
  
  -- Call-to-Action
  urgency_factor TEXT, -- Limited spots, cohort starting, etc.
  next_steps JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Client Success Metrics (for live dashboard)
CREATE TABLE IF NOT EXISTS public.client_success_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Metric Details
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'energy_increase', 'productivity_gain', 'stress_reduction',
    'performance_improvement', 'roi_achieved', 'goals_achieved',
    'weight_loss', 'strength_gain', 'endurance_improvement'
  )),
  
  -- Values
  metric_value DECIMAL(10,2) NOT NULL,
  metric_unit TEXT NOT NULL, -- percentage, kg, hours, etc.
  
  -- Client Information (anonymised)
  client_industry TEXT,
  client_role_level TEXT CHECK (client_role_level IN ('Executive', 'Senior Manager', 'Manager', 'Professional')),
  programme_type TEXT CHECK (programme_type IN ('Foundation', 'Acceleration', 'Elite')),
  
  -- Time Frame
  measurement_period TEXT, -- '3 months', '6 months', '12 months'
  achievement_date DATE,
  
  -- Display Settings
  is_featured BOOLEAN DEFAULT false,
  display_priority INTEGER DEFAULT 0,
  
  -- Verification
  verified BOOLEAN DEFAULT true,
  verification_method TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Testimonials Management
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_role TEXT NOT NULL,
  client_company TEXT,
  client_image_url TEXT,
  
  -- Testimonial Content
  headline TEXT NOT NULL,
  testimonial_text TEXT NOT NULL,
  video_url TEXT,
  
  -- Results Achieved
  key_results JSONB, -- Array of specific results
  programme_type TEXT CHECK (programme_type IN ('Foundation', 'Acceleration', 'Elite')),
  
  -- Display Settings
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  category TEXT CHECK (category IN ('Executive', 'Entrepreneur', 'Professional', 'Elite Athlete')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Engagement Tracking
CREATE TABLE IF NOT EXISTS public.engagement_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  email TEXT,
  
  -- Engagement Events
  event_type TEXT NOT NULL CHECK (event_type IN (
    'assessment_started', 'assessment_completed', 'assessment_abandoned',
    'barrier_quiz_started', 'barrier_quiz_completed',
    'programme_viewed', 'programme_compared',
    'calendar_opened', 'whatsapp_clicked',
    'exit_intent_shown', 'exit_intent_converted',
    'testimonial_viewed', 'metrics_viewed',
    'contact_form_opened', 'contact_form_submitted'
  )),
  
  -- Event Details
  event_data JSONB,
  page_url TEXT,
  referrer TEXT,
  
  -- Timing
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage
  
  -- Device Information
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  browser TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. A/B Testing Framework
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Test Configuration
  test_name TEXT NOT NULL UNIQUE,
  test_description TEXT,
  variant_a JSONB NOT NULL, -- Control configuration
  variant_b JSONB NOT NULL, -- Test configuration
  
  -- Targeting
  target_audience JSONB, -- Criteria for test inclusion
  traffic_allocation INTEGER DEFAULT 50, -- Percentage for variant B
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  
  -- Results
  variant_a_conversions INTEGER DEFAULT 0,
  variant_a_views INTEGER DEFAULT 0,
  variant_b_conversions INTEGER DEFAULT 0,
  variant_b_views INTEGER DEFAULT 0,
  
  -- Dates
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. WhatsApp/SMS Quick Contact
CREATE TABLE IF NOT EXISTS public.quick_contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact Information
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_method TEXT CHECK (preferred_method IN ('whatsapp', 'sms', 'call')),
  
  -- Context
  enquiry_type TEXT CHECK (enquiry_type IN (
    'programme_info', 'pricing', 'availability',
    'quick_question', 'book_consultation', 'other'
  )),
  message TEXT,
  
  -- Source
  source_page TEXT,
  session_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'converted', 'archived')),
  responded_at TIMESTAMPTZ,
  response_method TEXT,
  
  -- GDPR
  consent_given BOOLEAN DEFAULT false NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_barriers_email ON public.performance_barriers(email);
CREATE INDEX idx_barriers_submission_id ON public.performance_barriers(submission_id);

CREATE INDEX idx_recommendations_submission_id ON public.programme_recommendations(submission_id);
CREATE INDEX idx_recommendations_programme ON public.programme_recommendations(primary_programme);

CREATE INDEX idx_metrics_type ON public.client_success_metrics(metric_type);
CREATE INDEX idx_metrics_featured ON public.client_success_metrics(is_featured);
CREATE INDEX idx_metrics_programme ON public.client_success_metrics(programme_type);

CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX idx_testimonials_category ON public.testimonials(category);

CREATE INDEX idx_engagement_session ON public.engagement_tracking(session_id);
CREATE INDEX idx_engagement_email ON public.engagement_tracking(email);
CREATE INDEX idx_engagement_event ON public.engagement_tracking(event_type);
CREATE INDEX idx_engagement_created ON public.engagement_tracking(created_at DESC);

CREATE INDEX idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX idx_ab_tests_name ON public.ab_tests(test_name);

CREATE INDEX idx_quick_contact_status ON public.quick_contact_requests(status);
CREATE INDEX idx_quick_contact_created ON public.quick_contact_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.performance_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_contact_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Performance Barriers - Users can insert their own
CREATE POLICY "Users can insert barriers" ON public.performance_barriers
  FOR INSERT WITH CHECK (true);

-- Programme Recommendations - Public read, admin write
CREATE POLICY "Public can view recommendations" ON public.programme_recommendations
  FOR SELECT USING (true);

-- Client Success Metrics - Public read for featured
CREATE POLICY "Public can view featured metrics" ON public.client_success_metrics
  FOR SELECT USING (is_featured = true OR auth.jwt() ->> 'role' = 'admin');

-- Testimonials - Public read for approved
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
  FOR SELECT USING (status = 'approved' OR auth.jwt() ->> 'role' = 'admin');

-- Engagement Tracking - Anyone can insert
CREATE POLICY "Anyone can track engagement" ON public.engagement_tracking
  FOR INSERT WITH CHECK (true);

-- Quick Contact - Anyone can insert
CREATE POLICY "Anyone can request contact" ON public.quick_contact_requests
  FOR INSERT WITH CHECK (true);

-- Functions for real-time metrics dashboard
CREATE OR REPLACE FUNCTION public.get_live_success_metrics()
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_clients', (SELECT COUNT(DISTINCT email) FROM public.assessment_submissions WHERE qualified = true),
    'average_energy_increase', (
      SELECT ROUND(AVG(metric_value), 0)
      FROM public.client_success_metrics
      WHERE metric_type = 'energy_increase' AND verified = true
    ),
    'average_productivity_gain', (
      SELECT ROUND(AVG(metric_value), 0)
      FROM public.client_success_metrics
      WHERE metric_type = 'productivity_gain' AND verified = true
    ),
    'average_roi', (
      SELECT ROUND(AVG(metric_value), 0)
      FROM public.client_success_metrics
      WHERE metric_type = 'roi_achieved' AND verified = true
    ),
    'success_rate', 95, -- Static for now, can be calculated
    'featured_metrics', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'type', metric_type,
          'value', metric_value,
          'unit', metric_unit,
          'programme', programme_type,
          'period', measurement_period
        )
      )
      FROM public.client_success_metrics
      WHERE is_featured = true
      ORDER BY display_priority, created_at DESC
      LIMIT 6
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get personalised programme recommendations
CREATE OR REPLACE FUNCTION public.get_programme_recommendation(
  p_readiness_score DECIMAL,
  p_investment_level TEXT,
  p_performance_level TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_programme TEXT;
  v_price DECIMAL;
BEGIN
  -- Determine programme based on scores
  IF p_readiness_score >= 8 AND p_investment_level IN ('high', 'premium') THEN
    v_programme := 'Elite';
    v_price := 2997;
  ELSIF p_readiness_score >= 6 AND p_investment_level IN ('moderate', 'high') THEN
    v_programme := 'Acceleration';
    v_price := 997;
  ELSE
    v_programme := 'Foundation';
    v_price := 297;
  END IF;
  
  RETURN jsonb_build_object(
    'programme', v_programme,
    'price', v_price,
    'payment_options', jsonb_build_object(
      'full', v_price,
      'monthly_3', ROUND(v_price / 3 * 1.05, 2),
      'monthly_6', ROUND(v_price / 6 * 1.08, 2)
    ),
    'included_features', CASE v_programme
      WHEN 'Elite' THEN jsonb_build_array(
        'Weekly 1:1 consultations',
        'Personalised performance optimisation plan',
        'Executive health screening',
        'Quarterly performance reviews',
        'Direct WhatsApp support',
        'Wearable device integration'
      )
      WHEN 'Acceleration' THEN jsonb_build_array(
        'Bi-weekly consultations',
        'Custom programme design',
        'Monthly progress reviews',
        'Email support',
        'Performance tracking dashboard'
      )
      ELSE jsonb_build_array(
        'Monthly group consultations',
        'Foundation programme access',
        'Quarterly check-ins',
        'Community support access'
      )
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for updated_at
CREATE TRIGGER update_barriers_updated_at
  BEFORE UPDATE ON public.performance_barriers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.programme_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at
  BEFORE UPDATE ON public.client_success_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at
  BEFORE UPDATE ON public.ab_tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_contact_updated_at
  BEFORE UPDATE ON public.quick_contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample success metrics for dashboard
INSERT INTO public.client_success_metrics (metric_type, metric_value, metric_unit, client_industry, client_role_level, programme_type, measurement_period, is_featured, display_priority)
VALUES 
  ('energy_increase', 47, '%', 'Finance', 'Executive', 'Elite', '3 months', true, 1),
  ('productivity_gain', 38, '%', 'Technology', 'Senior Manager', 'Acceleration', '6 months', true, 2),
  ('stress_reduction', 52, '%', 'Healthcare', 'Manager', 'Foundation', '3 months', true, 3),
  ('roi_achieved', 312, '%', 'Consulting', 'Executive', 'Elite', '12 months', true, 4)
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.performance_barriers IS 'Tracks identified barriers to success for personalised content';
COMMENT ON TABLE public.programme_recommendations IS 'Stores AI-generated programme recommendations based on assessment';
COMMENT ON TABLE public.client_success_metrics IS 'Aggregated success metrics for live dashboard display';
COMMENT ON TABLE public.testimonials IS 'Client testimonials with approval workflow';
COMMENT ON TABLE public.engagement_tracking IS 'Tracks user engagement events for conversion optimisation';
COMMENT ON TABLE public.ab_tests IS 'A/B testing configuration and results';
COMMENT ON TABLE public.quick_contact_requests IS 'WhatsApp/SMS quick contact requests';


-- ========================================
-- Migration: 003_blog_schema.sql
-- ========================================

-- Blog Platform Database Schema
-- Version: 1.0.0
-- Description: Comprehensive blog platform with MDX support, revisions, and advanced features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors table (extends profiles if needed)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    content TEXT NOT NULL, -- MDX content
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
    reading_time INTEGER, -- in minutes
    word_count INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', NULL)),

    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,

    -- Feature flags
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    show_toc BOOLEAN DEFAULT true, -- Table of contents
    show_related BOOLEAN DEFAULT true,

    -- Additional metadata
    custom_css TEXT,
    custom_js TEXT,
    video_url TEXT, -- For video posts
    research_data JSONB, -- For research papers
    case_study_results JSONB, -- For case studies

    -- Search optimisation
    search_vector tsvector,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- Soft delete

    -- Indexes will be created below
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

-- Post revisions table
CREATE TABLE IF NOT EXISTS public.post_revisions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_data JSONB, -- Store all other fields as JSON
    revision_number INTEGER NOT NULL,
    revision_message TEXT,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(post_id, revision_number)
);

-- Post views tracking
CREATE TABLE IF NOT EXISTS public.post_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    viewer_ip INET,
    viewer_country VARCHAR(2),
    viewer_city VARCHAR(100),
    referrer_url TEXT,
    user_agent TEXT,
    session_id VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    time_on_page INTEGER, -- in seconds

    -- Prevent duplicate views in same session
    UNIQUE(post_id, session_id)
);

-- Related posts mapping
CREATE TABLE IF NOT EXISTS public.related_posts (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    related_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3, 2) DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, related_post_id),
    CHECK (post_id != related_post_id)
);

-- Blog settings table
CREATE TABLE IF NOT EXISTS public.blog_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_posts_slug ON public.posts(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON public.posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_category ON public.posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author ON public.posts(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for) WHERE status = 'scheduled' AND deleted_at IS NULL;
CREATE INDEX idx_posts_featured ON public.posts(is_featured) WHERE is_featured = true AND deleted_at IS NULL;
CREATE INDEX idx_posts_search_vector ON public.posts USING gin(search_vector);
CREATE INDEX idx_posts_content_type ON public.posts(content_type) WHERE deleted_at IS NULL;

CREATE INDEX idx_categories_slug ON public.categories(slug) WHERE is_active = true;
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tags_usage ON public.tags(usage_count DESC);

CREATE INDEX idx_post_views_post ON public.post_views(post_id);
CREATE INDEX idx_post_views_date ON public.post_views(viewed_at DESC);
CREATE INDEX idx_post_views_user ON public.post_views(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX idx_post_revisions_post ON public.post_revisions(post_id, revision_number DESC);

-- Create full-text search function
CREATE OR REPLACE FUNCTION public.update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER update_post_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, subtitle, excerpt, content
ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_post_search_vector();

-- Create function to update reading time and word count
CREATE OR REPLACE FUNCTION public.calculate_reading_metrics()
RETURNS TRIGGER AS $$
DECLARE
    word_count_val INTEGER;
    reading_time_val INTEGER;
BEGIN
    -- Calculate word count (rough estimation)
    word_count_val := array_length(string_to_array(NEW.content, ' '), 1);

    -- Calculate reading time (assuming 200 words per minute)
    reading_time_val := CEIL(word_count_val::DECIMAL / 200);

    NEW.word_count := word_count_val;
    NEW.reading_time := reading_time_val;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reading metrics
CREATE TRIGGER calculate_reading_metrics_trigger
BEFORE INSERT OR UPDATE OF content
ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.calculate_reading_metrics();

-- Create function to handle post revisions
CREATE OR REPLACE FUNCTION public.create_post_revision()
RETURNS TRIGGER AS $$
DECLARE
    next_revision_number INTEGER;
BEGIN
    -- Only create revision if content or title changed
    IF OLD.title != NEW.title OR OLD.content != NEW.content THEN
        -- Get next revision number
        SELECT COALESCE(MAX(revision_number), 0) + 1
        INTO next_revision_number
        FROM public.post_revisions
        WHERE post_id = NEW.id;

        -- Insert revision
        INSERT INTO public.post_revisions (
            post_id, title, content, excerpt, meta_data,
            revision_number, author_id
        ) VALUES (
            NEW.id, OLD.title, OLD.content, OLD.excerpt,
            jsonb_build_object(
                'subtitle', OLD.subtitle,
                'featured_image', OLD.featured_image,
                'category_id', OLD.category_id,
                'meta_title', OLD.meta_title,
                'meta_description', OLD.meta_description
            ),
            next_revision_number,
            NEW.author_id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post revisions
CREATE TRIGGER create_post_revision_trigger
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.create_post_revision();

-- Create function to update tag usage counts
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags
        SET usage_count = usage_count - 1
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tag usage
CREATE TRIGGER update_tag_usage_count_trigger
AFTER INSERT OR DELETE ON public.post_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_tag_usage_count();

-- Create function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.posts
    SET
        status = 'published',
        published_at = scheduled_for,
        updated_at = NOW()
    WHERE
        status = 'scheduled'
        AND scheduled_for <= NOW()
        AND deleted_at IS NULL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_settings_updated_at BEFORE UPDATE ON public.blog_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can view published posts" ON public.posts
    FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated users can view all their own posts
CREATE POLICY "Authors can view own posts" ON public.posts
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        author_id IN (SELECT id FROM public.authors WHERE user_id = auth.uid())
    );

-- Admin write access (you'll need to implement admin role check)
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Public read access for active categories
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (is_active = true);

-- Public read access for tags
CREATE POLICY "Public can view tags" ON public.tags
    FOR SELECT USING (true);

-- Public read access for authors
CREATE POLICY "Public can view authors" ON public.authors
    FOR SELECT USING (is_active = true);

-- Public read access for post tags
CREATE POLICY "Public can view post tags" ON public.post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE id = post_tags.post_id
            AND status = 'published'
            AND deleted_at IS NULL
        )
    );

-- Insert for post views (anyone can create a view)
CREATE POLICY "Anyone can create post views" ON public.post_views
    FOR INSERT WITH CHECK (true);

-- Public read for related posts
CREATE POLICY "Public can view related posts" ON public.related_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE id = related_posts.post_id
            AND status = 'published'
            AND deleted_at IS NULL
        )
    );

-- Admin access for revisions
CREATE POLICY "Admins can view revisions" ON public.post_revisions
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Admin access for blog settings
CREATE POLICY "Admins can manage blog settings" ON public.blog_settings
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Insert default categories matching the UK repositioning
INSERT INTO public.categories (slug, name, description, icon, color, position) VALUES
    ('sleep-recovery', 'Sleep & Recovery', 'Optimise your sleep and recovery for better performance', 'Moon', 'from-blue-500 to-indigo-600', 1),
    ('breaking-barriers', 'Breaking Exercise Barriers', 'Overcome obstacles and build sustainable exercise habits', 'Dumbbell', 'from-purple-500 to-pink-600', 2),
    ('strength-longevity', 'Strength & Longevity', 'Build strength for a longer, healthier life', 'Heart', 'from-red-500 to-orange-600', 3),
    ('nutrition-performance', 'Nutrition for Performance', 'Fuel your body for optimal performance', 'Utensils', 'from-green-500 to-teal-600', 4),
    ('lifestyle-optimisation', 'Lifestyle Optimisation', 'Habits and strategies for peak performance', 'Brain', 'from-amber-500 to-yellow-600', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog settings
INSERT INTO public.blog_settings (key, value) VALUES
    ('posts_per_page', '12'::jsonb),
    ('enable_comments', 'true'::jsonb),
    ('enable_social_sharing', 'true'::jsonb),
    ('default_og_image', '"/og-default.jpg"'::jsonb),
    ('rss_enabled', 'true'::jsonb),
    ('sitemap_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create a sample author for Leah
INSERT INTO public.authors (slug, display_name, bio, expertise) VALUES
    ('leah-fowler', 'Leah Fowler', 'Performance Consultant specialising in strength training, nutrition, and lifestyle optimisation for busy professionals.',
    '["Strength Training", "Nutrition Science", "Sleep Optimisation", "Behaviour Change"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions to authenticated users for post views
GRANT INSERT ON public.post_views TO authenticated;
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT SELECT ON public.authors TO anon, authenticated;
GRANT SELECT ON public.post_tags TO anon, authenticated;
GRANT SELECT ON public.related_posts TO anon, authenticated;

-- Create function to calculate related posts
CREATE OR REPLACE FUNCTION public.calculate_related_posts(post_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    related_post_id UUID,
    relevance_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH post_data AS (
        SELECT
            p.category_id,
            array_agg(pt.tag_id) AS tag_ids
        FROM public.posts p
        LEFT JOIN public.post_tags pt ON p.id = pt.post_id
        WHERE p.id = post_uuid
        GROUP BY p.category_id
    )
    SELECT
        p.id AS related_post_id,
        (
            -- Category match weight: 0.4
            CASE WHEN p.category_id = pd.category_id THEN 0.4 ELSE 0 END +
            -- Tag match weight: 0.6 (divided by number of matching tags)
            (
                SELECT COALESCE(COUNT(*)::DECIMAL * 0.6 / GREATEST(array_length(pd.tag_ids, 1), 1), 0)
                FROM public.post_tags pt2
                WHERE pt2.post_id = p.id
                AND pt2.tag_id = ANY(pd.tag_ids)
            )
        ) AS relevance_score
    FROM public.posts p, post_data pd
    WHERE
        p.id != post_uuid
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    ORDER BY relevance_score DESC, p.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA public IS 'Blog Platform Schema - Comprehensive CMS for Leah Fowler Performance';


-- ========================================
-- Migration: 004_complete_platform_schema.sql
-- ========================================

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

