
-- GDPR Compliance: Add missing columns to assessment_submissions
-- Execute this in Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new

ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- Verify columns were added
SELECT
    column_name,
    data_type,
    column_default
FROM
    information_schema.columns
WHERE
    table_name = 'assessment_submissions'
    AND column_name LIKE 'gdpr%'
ORDER BY
    ordinal_position;
