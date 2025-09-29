ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;