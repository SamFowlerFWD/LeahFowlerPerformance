-- CRITICAL DATABASE MIGRATION: GDPR and Security Fixes
-- Leah Fowler Performance Database
-- Date: 2025-09-29

-- =====================================================
-- 1. ADD GDPR COLUMNS TO ASSESSMENT_SUBMISSIONS TABLE
-- =====================================================

-- Check if columns exist before adding them
DO $$
BEGIN
    -- Add gdpr_consent_given column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_submissions'
        AND column_name = 'gdpr_consent_given'
    ) THEN
        ALTER TABLE assessment_submissions
        ADD COLUMN gdpr_consent_given BOOLEAN DEFAULT false;
    END IF;

    -- Add gdpr_consent_timestamp column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_submissions'
        AND column_name = 'gdpr_consent_timestamp'
    ) THEN
        ALTER TABLE assessment_submissions
        ADD COLUMN gdpr_consent_timestamp TIMESTAMPTZ;
    END IF;

    -- Add gdpr_deletion_requested column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_submissions'
        AND column_name = 'gdpr_deletion_requested'
    ) THEN
        ALTER TABLE assessment_submissions
        ADD COLUMN gdpr_deletion_requested BOOLEAN DEFAULT false;
    END IF;

    -- Add gdpr_deletion_timestamp column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_submissions'
        AND column_name = 'gdpr_deletion_timestamp'
    ) THEN
        ALTER TABLE assessment_submissions
        ADD COLUMN gdpr_deletion_timestamp TIMESTAMPTZ;
    END IF;

    -- Add data_retention_days column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assessment_submissions'
        AND column_name = 'data_retention_days'
    ) THEN
        ALTER TABLE assessment_submissions
        ADD COLUMN data_retention_days INTEGER DEFAULT 365;
    END IF;
END $$;

-- =====================================================
-- 2. CREATE MISSING DATABASE FUNCTIONS
-- =====================================================

-- Create validate_email function
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic email validation using regex
    IF email IS NULL OR email = '' THEN
        RETURN FALSE;
    END IF;

    -- Check for valid email format
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create check_rate_limit function
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_endpoint TEXT,
    p_max_requests INTEGER DEFAULT 100,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    v_request_count INTEGER;
    v_window_start TIMESTAMPTZ;
BEGIN
    v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;

    -- Count requests in the current window
    SELECT COUNT(*) INTO v_request_count
    FROM api_rate_limits
    WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND created_at >= v_window_start;

    -- Check if limit exceeded
    IF v_request_count >= p_max_requests THEN
        RETURN FALSE; -- Rate limit exceeded
    END IF;

    -- Log this request
    INSERT INTO api_rate_limits (identifier, endpoint, created_at, window_end)
    VALUES (p_identifier, p_endpoint, NOW(), NOW() + (p_window_minutes || ' minutes')::INTERVAL);

    -- Clean up old entries
    DELETE FROM api_rate_limits
    WHERE created_at < NOW() - INTERVAL '24 hours';

    RETURN TRUE; -- Request allowed
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create anonymize_assessment_submission function for GDPR compliance
CREATE OR REPLACE FUNCTION anonymize_assessment_submission(submission_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE assessment_submissions
    SET
        email = 'anonymized_' || submission_id || '@example.com',
        first_name = 'ANONYMIZED',
        last_name = 'USER',
        phone = NULL,
        ip_address = '0.0.0.0',
        gdpr_deletion_requested = true,
        gdpr_deletion_timestamp = NOW()
    WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. ADD CRITICAL PERFORMANCE INDEXES
-- =====================================================

-- Create index on assessment_submissions email column
CREATE INDEX IF NOT EXISTS idx_assessment_email
ON assessment_submissions(email);

-- Create composite index on posts for status and published_at
CREATE INDEX IF NOT EXISTS idx_posts_status_published
ON posts(status, published_at)
WHERE status = 'published';

-- Create index on gdpr_verification_requests token column
CREATE INDEX IF NOT EXISTS idx_gdpr_token
ON gdpr_verification_requests(token);

-- Create composite index on api_rate_limits for efficient lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
ON api_rate_limits(identifier, endpoint, window_end);

-- Additional performance indexes for GDPR compliance
CREATE INDEX IF NOT EXISTS idx_assessment_gdpr_deletion
ON assessment_submissions(gdpr_deletion_requested)
WHERE gdpr_deletion_requested = true;

CREATE INDEX IF NOT EXISTS idx_assessment_created
ON assessment_submissions(created_at DESC);

-- =====================================================
-- 4. UPDATE RLS POLICIES FOR GDPR TABLES
-- =====================================================

-- Enable RLS on gdpr_verification_requests
ALTER TABLE gdpr_verification_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role only for GDPR requests" ON gdpr_verification_requests;
DROP POLICY IF EXISTS "Public can insert GDPR requests" ON gdpr_verification_requests;

-- Create RLS policies for gdpr_verification_requests
CREATE POLICY "Public can insert GDPR requests"
ON gdpr_verification_requests
FOR INSERT
TO public, anon
WITH CHECK (true);

CREATE POLICY "Service role full access to GDPR requests"
ON gdpr_verification_requests
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS on api_rate_limits
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role only for rate limits" ON api_rate_limits;

-- Create RLS policy for api_rate_limits (service role only)
CREATE POLICY "Service role only for rate limits"
ON api_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Update RLS policies for assessment_submissions to include GDPR compliance
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Service role full access to assessments" ON assessment_submissions;
DROP POLICY IF EXISTS "Users can view own assessments" ON assessment_submissions;

-- Create new policies for assessment_submissions
CREATE POLICY "Public can insert assessments"
ON assessment_submissions
FOR INSERT
TO public, anon
WITH CHECK (
    gdpr_consent_given = true
    AND gdpr_consent_timestamp IS NOT NULL
);

CREATE POLICY "Service role full access to assessments"
ON assessment_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view own assessments"
ON assessment_submissions
FOR SELECT
TO public, anon
USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    AND gdpr_deletion_requested = false
);

-- =====================================================
-- 5. ADD SECURITY AUDIT COLUMNS
-- =====================================================

-- Add security audit columns to security_audit_log table
DO $$
BEGIN
    -- Add request_headers column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'security_audit_log'
        AND column_name = 'request_headers'
    ) THEN
        ALTER TABLE security_audit_log
        ADD COLUMN request_headers JSONB;
    END IF;

    -- Add response_status column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'security_audit_log'
        AND column_name = 'response_status'
    ) THEN
        ALTER TABLE security_audit_log
        ADD COLUMN response_status INTEGER;
    END IF;

    -- Add error_message column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'security_audit_log'
        AND column_name = 'error_message'
    ) THEN
        ALTER TABLE security_audit_log
        ADD COLUMN error_message TEXT;
    END IF;

    -- Add execution_time_ms column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'security_audit_log'
        AND column_name = 'execution_time_ms'
    ) THEN
        ALTER TABLE security_audit_log
        ADD COLUMN execution_time_ms INTEGER;
    END IF;
END $$;

-- =====================================================
-- 6. CREATE GDPR HELPER FUNCTIONS
-- =====================================================

-- Function to anonymize user data for GDPR
CREATE OR REPLACE FUNCTION anonymize_user_data(user_email TEXT)
RETURNS VOID AS $$
DECLARE
    v_submission_count INTEGER;
BEGIN
    -- Count submissions to be anonymized
    SELECT COUNT(*) INTO v_submission_count
    FROM assessment_submissions
    WHERE email = user_email;

    -- Log the anonymization request
    INSERT INTO security_audit_log (
        action,
        user_email,
        ip_address,
        created_at,
        details
    ) VALUES (
        'gdpr_anonymization',
        user_email,
        '0.0.0.0',
        NOW(),
        jsonb_build_object('submissions_count', v_submission_count)
    );

    -- Anonymize all submissions for this email
    UPDATE assessment_submissions
    SET
        email = 'anonymized@example.com',
        first_name = 'ANONYMIZED',
        last_name = 'USER',
        phone = NULL,
        ip_address = '0.0.0.0',
        gdpr_deletion_requested = true,
        gdpr_deletion_timestamp = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle GDPR data export requests
CREATE OR REPLACE FUNCTION export_user_data(user_email TEXT)
RETURNS JSON AS $$
DECLARE
    v_data JSON;
BEGIN
    -- Validate email
    IF NOT validate_email(user_email) THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    -- Export all user data as JSON
    SELECT json_agg(row_to_json(t))
    INTO v_data
    FROM (
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            current_fitness_level,
            fitness_goals,
            health_conditions,
            time_availability,
            stress_level,
            sleep_quality,
            work_life_balance,
            created_at,
            gdpr_consent_given,
            gdpr_consent_timestamp
        FROM assessment_submissions
        WHERE email = user_email
        AND gdpr_deletion_requested = false
        ORDER BY created_at DESC
    ) t;

    -- Log the export request
    INSERT INTO security_audit_log (
        action,
        user_email,
        ip_address,
        created_at,
        details
    ) VALUES (
        'gdpr_data_export',
        user_email,
        '0.0.0.0',
        NOW(),
        jsonb_build_object('exported_records', COALESCE(json_array_length(v_data), 0))
    );

    RETURN COALESCE(v_data, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired data based on retention policy
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Delete assessments past their retention period
    WITH deleted AS (
        DELETE FROM assessment_submissions
        WHERE created_at < NOW() - (data_retention_days || ' days')::INTERVAL
        RETURNING *
    )
    SELECT COUNT(*) INTO v_deleted_count FROM deleted;

    -- Log the cleanup
    INSERT INTO security_audit_log (
        action,
        user_email,
        ip_address,
        created_at,
        details
    ) VALUES (
        'data_retention_cleanup',
        'system',
        '0.0.0.0',
        NOW(),
        jsonb_build_object('deleted_records', v_deleted_count)
    );

    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. CREATE TRIGGERS FOR AUTOMATIC GDPR COMPLIANCE
-- =====================================================

-- Trigger to automatically set GDPR consent timestamp
CREATE OR REPLACE FUNCTION set_gdpr_consent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.gdpr_consent_given = true AND NEW.gdpr_consent_timestamp IS NULL THEN
        NEW.gdpr_consent_timestamp = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_gdpr_consent_timestamp ON assessment_submissions;
CREATE TRIGGER trg_set_gdpr_consent_timestamp
BEFORE INSERT OR UPDATE ON assessment_submissions
FOR EACH ROW
EXECUTE FUNCTION set_gdpr_consent_timestamp();

-- =====================================================
-- 8. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions to appropriate roles
GRANT EXECUTE ON FUNCTION validate_email(TEXT) TO public, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION anonymize_assessment_submission(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION anonymize_user_data(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION export_user_data(TEXT) TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_data() TO service_role;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verification query
SELECT
    'Migration completed successfully' as status,
    NOW() as completed_at;