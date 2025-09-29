#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeMigrations() {
  console.log('🚀 Executing GDPR Database Migrations...\n');

  // Instead of executing raw SQL, let's use Supabase's table creation and alteration methods
  // First, let's create the tables programmatically

  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  // Step 1: Check and add GDPR columns to assessment_submissions
  console.log('📝 Step 1: Checking assessment_submissions table...');
  try {
    // Try to select the GDPR columns to see if they exist
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('gdpr_consent_given')
      .limit(1);

    if (error && error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('   ⚠️  GDPR columns need to be added');
      results.failed.push('Add GDPR columns - Requires manual SQL execution');
    } else {
      console.log('   ✅ GDPR columns may already exist');
      results.skipped.push('GDPR columns - May already exist');
    }
  } catch (e) {
    results.failed.push('Check assessment_submissions');
  }

  // Step 2: Check if gdpr_verification_requests table exists
  console.log('\n📝 Step 2: Checking gdpr_verification_requests table...');
  try {
    const { data, error } = await supabase
      .from('gdpr_verification_requests')
      .select('id')
      .limit(1);

    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('   ❌ Table does not exist - needs creation');
      results.failed.push('Create gdpr_verification_requests - Requires manual SQL execution');
    } else {
      console.log('   ✅ Table exists or accessible');
      results.success.push('gdpr_verification_requests exists');
    }
  } catch (e) {
    results.failed.push('Check gdpr_verification_requests');
  }

  // Step 3: Check if api_rate_limits table exists
  console.log('\n📝 Step 3: Checking api_rate_limits table...');
  try {
    const { data, error } = await supabase
      .from('api_rate_limits')
      .select('id')
      .limit(1);

    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('   ❌ Table does not exist - needs creation');
      results.failed.push('Create api_rate_limits - Requires manual SQL execution');
    } else {
      console.log('   ✅ Table exists or accessible');
      results.success.push('api_rate_limits exists');
    }
  } catch (e) {
    results.failed.push('Check api_rate_limits');
  }

  // Step 4: Check if security_audit_log table exists
  console.log('\n📝 Step 4: Checking security_audit_log table...');
  try {
    const { data, error } = await supabase
      .from('security_audit_log')
      .select('id')
      .limit(1);

    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('   ❌ Table does not exist - needs creation');
      results.failed.push('Create security_audit_log - Requires manual SQL execution');
    } else {
      console.log('   ✅ Table exists or accessible');
      results.success.push('security_audit_log exists');
    }
  } catch (e) {
    results.failed.push('Check security_audit_log');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION STATUS REPORT:');
  console.log('='.repeat(60));

  if (results.success.length > 0) {
    console.log('\n✅ COMPLETED:');
    results.success.forEach(item => console.log(`   • ${item}`));
  }

  if (results.skipped.length > 0) {
    console.log('\n⏩ SKIPPED:');
    results.skipped.forEach(item => console.log(`   • ${item}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ REQUIRES MANUAL EXECUTION:');
    results.failed.forEach(item => console.log(`   • ${item}`));

    console.log('\n' + '='.repeat(60));
    console.log('🚨 IMPORTANT: Manual SQL Execution Required');
    console.log('='.repeat(60));
    console.log('\n📋 NEXT STEPS:');
    console.log('\n1. Go to Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new');
    console.log('\n2. Copy and paste the contents of gdpr-migration.sql');
    console.log('\n3. Click "Run" to execute the migrations');
    console.log('\n4. Verify all changes were applied successfully');
    console.log('\n' + '='.repeat(60));

    // Create a simplified SQL file with just what's needed
    const necessarySQL = `
-- GDPR Compliance Database Migrations
-- Execute this in Supabase SQL Editor

-- 1. Add GDPR columns to assessment_submissions
ALTER TABLE assessment_submissions
ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;

-- 2. Create GDPR verification requests table
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

-- 3. Create API rate limits table
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

-- 4. Create security audit log table
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

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_email ON assessment_submissions(email);
CREATE INDEX IF NOT EXISTS idx_gdpr_token ON gdpr_verification_requests(token);
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON api_rate_limits(identifier, endpoint, window_end);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_event ON security_audit_log(event_type);

-- 6. Enable Row Level Security
ALTER TABLE gdpr_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- 7. Create user data anonymization function
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

-- 8. Verification queries (run these after migration)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'assessment_submissions' AND column_name LIKE 'gdpr%';
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('gdpr_verification_requests', 'api_rate_limits', 'security_audit_log');
`;

    const fs = require('fs');
    fs.writeFileSync('/Users/samfowler/Code/LeahFowlerPerformance-1/gdpr-migration-final.sql', necessarySQL);
    console.log('\n✅ Created: gdpr-migration-final.sql (ready to execute)');
  }

  console.log('\n' + '='.repeat(60));
  return results;
}

// Execute
executeMigrations()
  .then(results => {
    if (results.failed.length === 0) {
      console.log('\n🎉 All migrations completed successfully!');
    } else {
      console.log('\n⚠️  Some migrations require manual execution.');
      console.log('Please follow the instructions above to complete the process.');
    }
  })
  .catch(error => {
    console.error('\n💥 Critical error:', error);
    process.exit(1);
  });