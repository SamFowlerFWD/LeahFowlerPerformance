const https = require('https');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const PROJECT_REF = 'ltlbfltlhysjxslusypq';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Function to execute SQL via REST API
async function executeSQL(sql, description) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });

    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ SUCCESS: ${description}`);
          resolve(true);
        } else {
          console.log(`❌ FAILED: ${description} - Status: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ERROR: ${description} - ${e.message}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Use direct PostgreSQL connection string approach
async function executeMigrationsViaConnection() {
  const { createClient } = require('@supabase/supabase-js');

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Combined migration SQL
  const fullMigration = `
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
`;

  // Write migration to file and execute via psql or similar
  const fs = require('fs');
  fs.writeFileSync('/Users/samfowler/Code/LeahFowlerPerformance-1/gdpr-migration.sql', fullMigration);

  console.log('🚀 Migration SQL file created: gdpr-migration.sql');
  console.log('\n📋 MANUAL EXECUTION REQUIRED:');
  console.log('=====================================');
  console.log('The migrations have been prepared but need to be executed manually.');
  console.log('\nOPTION 1 - Use Supabase Dashboard:');
  console.log('1. Go to https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql');
  console.log('2. Copy the contents of gdpr-migration.sql');
  console.log('3. Paste and execute in the SQL editor');

  console.log('\nOPTION 2 - Use Supabase CLI:');
  console.log('1. Install Supabase CLI: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link project: supabase link --project-ref ltlbfltlhysjxslusypq');
  console.log('4. Execute: supabase db push < gdpr-migration.sql');

  console.log('\nOPTION 3 - Direct PostgreSQL connection:');
  console.log('Use any PostgreSQL client with the connection string from your Supabase dashboard');
  console.log('=====================================\n');

  // Try to verify if tables already exist
  console.log('📊 Checking current database state...\n');

  const tablesToCheck = [
    'assessment_submissions',
    'gdpr_verification_requests',
    'api_rate_limits',
    'security_audit_log'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (!error || error.code === 'PGRST116') {
        console.log(`✅ Table exists: ${table}`);
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log(`❌ Table NOT found: ${table} (needs to be created)`);
      } else {
        console.log(`⚠️  Table ${table}: ${error.message}`);
      }
    } catch (e) {
      console.log(`⚠️  Could not check table ${table}`);
    }
  }

  // Check for GDPR columns in assessment_submissions
  try {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('gdpr_consent_given')
      .limit(1);

    if (!error) {
      console.log('✅ GDPR columns exist in assessment_submissions');
    } else if (error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('❌ GDPR columns NOT found in assessment_submissions (need to be added)');
    }
  } catch (e) {
    console.log('⚠️  Could not check GDPR columns');
  }
}

// Execute
executeMigrationsViaConnection()
  .then(() => {
    console.log('\n✅ Migration preparation completed!');
    console.log('📝 Next step: Execute the migration using one of the options above.');
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });