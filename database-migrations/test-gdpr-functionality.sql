-- =====================================================
-- GDPR FUNCTIONALITY TEST SUITE
-- Leah Fowler Performance Database
-- Run this after migration to test GDPR features
-- =====================================================

-- Clean up any previous test data
DELETE FROM assessment_submissions WHERE email LIKE 'gdpr-test-%@example.com';
DELETE FROM api_rate_limits WHERE identifier LIKE 'gdpr-test-%';

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'STARTING GDPR FUNCTIONALITY TESTS';
    RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- TEST 1: EMAIL VALIDATION
-- =====================================================
DO $$
DECLARE
    test_passed BOOLEAN := true;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 1: Email Validation Function';
    RAISE NOTICE '-----------------------------------';

    -- Test valid emails
    IF NOT validate_email('user@example.com') THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: user@example.com should be valid';
    END IF;

    IF NOT validate_email('user.name+tag@example.co.uk') THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: user.name+tag@example.co.uk should be valid';
    END IF;

    -- Test invalid emails
    IF validate_email('invalid.email') THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: invalid.email should be invalid';
    END IF;

    IF validate_email('@example.com') THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: @example.com should be invalid';
    END IF;

    IF validate_email('') THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: empty string should be invalid';
    END IF;

    IF validate_email(NULL) THEN
        test_passed := false;
        RAISE NOTICE '❌ Failed: NULL should be invalid';
    END IF;

    IF test_passed THEN
        RAISE NOTICE '✅ PASS: All email validation tests passed';
    ELSE
        RAISE NOTICE '❌ FAIL: Some email validation tests failed';
    END IF;
END $$;

-- =====================================================
-- TEST 2: GDPR CONSENT TRACKING
-- =====================================================
DO $$
DECLARE
    test_id UUID;
    consent_timestamp TIMESTAMPTZ;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 2: GDPR Consent Tracking';
    RAISE NOTICE '-----------------------------------';

    -- Insert a test submission with GDPR consent
    INSERT INTO assessment_submissions (
        email,
        first_name,
        last_name,
        gdpr_consent_given,
        current_fitness_level,
        fitness_goals
    ) VALUES (
        'gdpr-test-1@example.com',
        'Test',
        'User',
        true,
        'Intermediate',
        'Improve performance'
    ) RETURNING id INTO test_id;

    -- Check if consent timestamp was automatically set
    SELECT gdpr_consent_timestamp INTO consent_timestamp
    FROM assessment_submissions
    WHERE id = test_id;

    IF consent_timestamp IS NOT NULL THEN
        RAISE NOTICE '✅ PASS: GDPR consent timestamp automatically set';
    ELSE
        RAISE NOTICE '❌ FAIL: GDPR consent timestamp not set';
    END IF;

    -- Clean up
    DELETE FROM assessment_submissions WHERE id = test_id;
END $$;

-- =====================================================
-- TEST 3: RATE LIMITING
-- =====================================================
DO $$
DECLARE
    i INTEGER;
    result BOOLEAN;
    rate_limited BOOLEAN := false;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 3: Rate Limiting Function';
    RAISE NOTICE '-----------------------------------';

    -- Test rate limiting with 3 requests max in 1 minute
    FOR i IN 1..5 LOOP
        result := check_rate_limit('gdpr-test-user', '/api/test', 3, 1);

        IF i <= 3 AND NOT result THEN
            RAISE NOTICE '❌ FAIL: Request % should have been allowed', i;
        ELSIF i > 3 AND result THEN
            RAISE NOTICE '❌ FAIL: Request % should have been rate limited', i;
        ELSIF i > 3 AND NOT result THEN
            rate_limited := true;
        END IF;
    END LOOP;

    IF rate_limited THEN
        RAISE NOTICE '✅ PASS: Rate limiting working correctly';
    ELSE
        RAISE NOTICE '❌ FAIL: Rate limiting not working';
    END IF;

    -- Clean up
    DELETE FROM api_rate_limits WHERE identifier = 'gdpr-test-user';
END $$;

-- =====================================================
-- TEST 4: DATA ANONYMIZATION
-- =====================================================
DO $$
DECLARE
    test_id UUID;
    anon_email TEXT;
    anon_first_name TEXT;
    anon_last_name TEXT;
    deletion_timestamp TIMESTAMPTZ;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 4: Data Anonymization';
    RAISE NOTICE '-----------------------------------';

    -- Insert test data
    INSERT INTO assessment_submissions (
        email,
        first_name,
        last_name,
        phone,
        gdpr_consent_given,
        gdpr_consent_timestamp,
        current_fitness_level,
        fitness_goals
    ) VALUES (
        'gdpr-test-2@example.com',
        'John',
        'Doe',
        '+44 7700 900000',
        true,
        NOW(),
        'Beginner',
        'Weight loss'
    ) RETURNING id INTO test_id;

    -- Anonymize the submission
    PERFORM anonymize_assessment_submission(test_id);

    -- Check anonymization
    SELECT email, first_name, last_name, gdpr_deletion_timestamp
    INTO anon_email, anon_first_name, anon_last_name, deletion_timestamp
    FROM assessment_submissions
    WHERE id = test_id;

    IF anon_first_name = 'ANONYMIZED' AND
       anon_last_name = 'USER' AND
       anon_email LIKE 'anonymized_%' AND
       deletion_timestamp IS NOT NULL THEN
        RAISE NOTICE '✅ PASS: Data anonymization successful';
    ELSE
        RAISE NOTICE '❌ FAIL: Data not properly anonymized';
        RAISE NOTICE '  Email: %', anon_email;
        RAISE NOTICE '  First Name: %', anon_first_name;
        RAISE NOTICE '  Last Name: %', anon_last_name;
    END IF;

    -- Clean up
    DELETE FROM assessment_submissions WHERE id = test_id;
END $$;

-- =====================================================
-- TEST 5: USER DATA ANONYMIZATION BY EMAIL
-- =====================================================
DO $$
DECLARE
    test_count INTEGER;
    anon_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 5: User Data Anonymization by Email';
    RAISE NOTICE '-----------------------------------';

    -- Insert multiple test submissions for same email
    INSERT INTO assessment_submissions (
        email, first_name, last_name, gdpr_consent_given,
        gdpr_consent_timestamp, current_fitness_level, fitness_goals
    ) VALUES
        ('gdpr-test-3@example.com', 'Jane', 'Smith', true, NOW(), 'Advanced', 'Marathon training'),
        ('gdpr-test-3@example.com', 'Jane', 'Smith', true, NOW(), 'Advanced', 'Strength training'),
        ('gdpr-test-3@example.com', 'Jane', 'Smith', true, NOW(), 'Advanced', 'Flexibility');

    SELECT COUNT(*) INTO test_count
    FROM assessment_submissions
    WHERE email = 'gdpr-test-3@example.com';

    -- Anonymize all data for this email
    PERFORM anonymize_user_data('gdpr-test-3@example.com');

    -- Check all records were anonymized
    SELECT COUNT(*) INTO anon_count
    FROM assessment_submissions
    WHERE email = 'anonymized@example.com'
    AND first_name = 'ANONYMIZED'
    AND last_name = 'USER'
    AND gdpr_deletion_requested = true;

    IF anon_count = test_count THEN
        RAISE NOTICE '✅ PASS: All user data anonymized (% records)', anon_count;
    ELSE
        RAISE NOTICE '❌ FAIL: Not all data anonymized. Expected %, got %', test_count, anon_count;
    END IF;

    -- Clean up
    DELETE FROM assessment_submissions WHERE email = 'anonymized@example.com';
END $$;

-- =====================================================
-- TEST 6: DATA EXPORT FUNCTION
-- =====================================================
DO $$
DECLARE
    export_result JSON;
    record_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 6: Data Export Function';
    RAISE NOTICE '-----------------------------------';

    -- Insert test data
    INSERT INTO assessment_submissions (
        email, first_name, last_name, gdpr_consent_given,
        gdpr_consent_timestamp, current_fitness_level, fitness_goals
    ) VALUES
        ('gdpr-test-4@example.com', 'Export', 'Test1', true, NOW(), 'Beginner', 'General fitness'),
        ('gdpr-test-4@example.com', 'Export', 'Test2', true, NOW(), 'Intermediate', 'Weight loss');

    -- Export data
    export_result := export_user_data('gdpr-test-4@example.com');
    record_count := json_array_length(export_result);

    IF record_count = 2 THEN
        RAISE NOTICE '✅ PASS: Data export returned % records', record_count;
        RAISE NOTICE '  Export preview: %', left(export_result::TEXT, 100) || '...';
    ELSE
        RAISE NOTICE '❌ FAIL: Expected 2 records, got %', record_count;
    END IF;

    -- Test export for non-existent user
    export_result := export_user_data('non-existent@example.com');
    IF export_result::TEXT = '[]' THEN
        RAISE NOTICE '✅ PASS: Empty array returned for non-existent user';
    ELSE
        RAISE NOTICE '❌ FAIL: Unexpected result for non-existent user';
    END IF;

    -- Clean up
    DELETE FROM assessment_submissions WHERE email = 'gdpr-test-4@example.com';
END $$;

-- =====================================================
-- TEST 7: RLS POLICIES
-- =====================================================
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 7: Row Level Security Policies';
    RAISE NOTICE '-----------------------------------';

    -- Check assessment_submissions policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'assessment_submissions';

    IF policy_count >= 3 THEN
        RAISE NOTICE '✅ PASS: assessment_submissions has % RLS policies', policy_count;
    ELSE
        RAISE NOTICE '❌ FAIL: assessment_submissions only has % policies (expected at least 3)', policy_count;
    END IF;

    -- Check gdpr_verification_requests policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'gdpr_verification_requests';

    IF policy_count >= 1 THEN
        RAISE NOTICE '✅ PASS: gdpr_verification_requests has % RLS policies', policy_count;
    ELSE
        RAISE NOTICE '❌ FAIL: gdpr_verification_requests has no RLS policies';
    END IF;

    -- Check api_rate_limits policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'api_rate_limits';

    IF policy_count >= 1 THEN
        RAISE NOTICE '✅ PASS: api_rate_limits has % RLS policies', policy_count;
    ELSE
        RAISE NOTICE '❌ FAIL: api_rate_limits has no RLS policies';
    END IF;
END $$;

-- =====================================================
-- TEST 8: DATA RETENTION
-- =====================================================
DO $$
DECLARE
    test_id UUID;
    retention_days INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'TEST 8: Data Retention Settings';
    RAISE NOTICE '-----------------------------------';

    -- Insert test data with custom retention
    INSERT INTO assessment_submissions (
        email,
        first_name,
        last_name,
        gdpr_consent_given,
        gdpr_consent_timestamp,
        data_retention_days,
        current_fitness_level,
        fitness_goals
    ) VALUES (
        'gdpr-test-5@example.com',
        'Retention',
        'Test',
        true,
        NOW(),
        90,  -- 90 days retention
        'Advanced',
        'Competition prep'
    ) RETURNING id, data_retention_days INTO test_id, retention_days;

    IF retention_days = 90 THEN
        RAISE NOTICE '✅ PASS: Custom retention period set correctly';
    ELSE
        RAISE NOTICE '❌ FAIL: Retention period not set correctly. Expected 90, got %', retention_days;
    END IF;

    -- Test default retention
    INSERT INTO assessment_submissions (
        email,
        first_name,
        last_name,
        gdpr_consent_given,
        gdpr_consent_timestamp,
        current_fitness_level,
        fitness_goals
    ) VALUES (
        'gdpr-test-6@example.com',
        'Default',
        'Retention',
        true,
        NOW(),
        'Beginner',
        'General fitness'
    ) RETURNING data_retention_days INTO retention_days;

    IF retention_days = 365 THEN
        RAISE NOTICE '✅ PASS: Default retention period (365 days) applied';
    ELSE
        RAISE NOTICE '❌ FAIL: Default retention not 365 days. Got %', retention_days;
    END IF;

    -- Clean up
    DELETE FROM assessment_submissions WHERE email LIKE 'gdpr-test-%@example.com';
END $$;

-- =====================================================
-- FINAL CLEANUP
-- =====================================================
DELETE FROM assessment_submissions WHERE email LIKE 'gdpr-test-%@example.com';
DELETE FROM assessment_submissions WHERE email = 'anonymized@example.com';
DELETE FROM api_rate_limits WHERE identifier LIKE 'gdpr-test-%';

-- =====================================================
-- TEST SUMMARY
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'GDPR FUNCTIONALITY TESTS COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Review the test results above.';
    RAISE NOTICE 'All tests should show ✅ PASS status.';
    RAISE NOTICE '';
    RAISE NOTICE 'If any tests failed:';
    RAISE NOTICE '1. Check the migration was completed successfully';
    RAISE NOTICE '2. Verify all functions and triggers are created';
    RAISE NOTICE '3. Ensure RLS policies are properly configured';
    RAISE NOTICE '';
    RAISE NOTICE 'Timestamp: %', NOW();
    RAISE NOTICE '========================================';
END $$;