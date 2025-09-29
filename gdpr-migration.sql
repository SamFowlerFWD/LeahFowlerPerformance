
-- 1. ADD MISSING GDPR COLUMNS
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- 2. CREATE GDPR VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS gdpr_verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'portability', 'deletion', 'rectification')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  verified_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. CREATE RATE LIMITING TABLE
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_rate_limit UNIQUE(identifier, endpoint, window_start)
);

-- 4. CREATE SECURITY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  email TEXT,
  ip_address INET,
  user_agent TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  metadata JSONB,
  request_headers JSONB,
  response_status INTEGER,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_assessment_email ON assessment_submissions(email);
CREATE INDEX IF NOT EXISTS idx_gdpr_token ON gdpr_verification_requests(token);
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON api_rate_limits(identifier, endpoint, window_end);

-- 6. ENABLE RLS
ALTER TABLE gdpr_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- 7. CREATE ANONYMIZATION FUNCTION
CREATE OR REPLACE FUNCTION anonymize_user_data(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE assessment_submissions
  SET email = 'anonymized@example.com',
      first_name = 'ANONYMIZED',
      last_name = 'USER',
      phone = NULL,
      gdpr_deletion_timestamp = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
