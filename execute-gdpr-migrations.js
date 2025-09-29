const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYnNlIiwicmVmiOiJsdGxiZmx0bGh5c2p4c2x1c3lwcSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client with service role key for full permissions
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// SQL Migrations to execute
const migrations = [
  {
    name: 'Add GDPR columns to assessment_submissions',
    sql: `
      ALTER TABLE assessment_submissions
      ADD COLUMN IF NOT EXISTS gdpr_consent_given BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS gdpr_consent_timestamp TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS gdpr_deletion_requested BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS gdpr_deletion_timestamp TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS data_retention_days INTEGER DEFAULT 365;
    `
  },
  {
    name: 'Create GDPR verification requests table',
    sql: `
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
    `
  },
  {
    name: 'Create API rate limits table',
    sql: `
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
    `
  },
  {
    name: 'Create security audit log table',
    sql: `
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
    `
  },
  {
    name: 'Create indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_assessment_email ON assessment_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_gdpr_token ON gdpr_verification_requests(token);
      CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON api_rate_limits(identifier, endpoint, window_end);
    `
  },
  {
    name: 'Enable RLS on new tables',
    sql: `
      ALTER TABLE gdpr_verification_requests ENABLE ROW LEVEL SECURITY;
      ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
      ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
    `
  },
  {
    name: 'Create anonymization function',
    sql: `
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
    `
  }
];

// Execute migrations
async function executeMigrations() {
  console.log('🚀 Starting database migrations...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    console.log(`📝 Executing: ${migration.name}`);
    try {
      // Use the SQL Editor endpoint via REST API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: migration.sql })
      });

      // If RPC doesn't exist, try direct query
      if (!response.ok) {
        // Use the Supabase client to execute raw SQL
        const { data, error } = await supabase.rpc('query', { sql: migration.sql });

        if (error) {
          // Try alternative approach - use pg endpoint
          const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
            method: 'POST',
            headers: {
              'apikey': SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: migration.sql })
          });

          if (!pgResponse.ok) {
            throw new Error(`Failed to execute migration: ${await pgResponse.text()}`);
          }
        }
      }

      console.log(`✅ Success: ${migration.name}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${migration.name}`);
      console.error(`   Error: ${error.message}\n`);
      failureCount++;
    }
  }

  // Verify tables were created
  console.log('\n📊 Verifying database changes...\n');

  try {
    // Check if tables exist
    const tablesToCheck = [
      'assessment_submissions',
      'gdpr_verification_requests',
      'api_rate_limits',
      'security_audit_log'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned (table exists but empty)
        console.log(`⚠️  Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: EXISTS`);
      }
    }

    // Check GDPR columns in assessment_submissions
    const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
      table_name: 'assessment_submissions'
    }).catch(() => ({ data: null, error: 'RPC not available' }));

    if (!columnsError && columns) {
      console.log('\n✅ GDPR columns verified in assessment_submissions');
    }

  } catch (verifyError) {
    console.log('\n⚠️  Verification partially completed');
  }

  console.log('\n' + '='.repeat(50));
  console.log(`MIGRATION SUMMARY:`);
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  if (failureCount > 0) {
    console.log(`❌ Failed: ${failureCount}/${migrations.length}`);
  }
  console.log('='.repeat(50));
}

// Execute the migrations
executeMigrations().then(() => {
  console.log('\n🎉 Migration process completed!');
}).catch(error => {
  console.error('\n💥 Critical error during migration:', error);
});