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