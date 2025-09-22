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