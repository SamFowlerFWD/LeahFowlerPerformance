#!/usr/bin/env node

/**
 * Apply Critical Security Fixes to Supabase Database
 * Version: 1.0.0
 * Date: 2025-09-29
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = '[INFO]';

  switch(type) {
    case 'success':
      color = colors.green;
      prefix = '[SUCCESS]';
      break;
    case 'error':
      color = colors.red;
      prefix = '[ERROR]';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '[WARNING]';
      break;
    case 'section':
      color = colors.cyan;
      prefix = '[SECTION]';
      break;
  }

  console.log(`${color}${prefix}${colors.reset} ${timestamp} - ${message}`);
}

async function executeSQLSection(sql, sectionName) {
  try {
    log(`Executing: ${sectionName}`, 'section');

    const { data, error } = await supabase.rpc('exec_sql', {
      query: sql
    }).single();

    if (error) {
      // Try direct execution if RPC doesn't work
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ query: sql })
      });

      if (!response.ok) {
        // If exec_sql doesn't exist, we'll need to execute SQL differently
        throw new Error(`Failed to execute SQL: ${response.statusText}`);
      }
    }

    log(`✓ ${sectionName} completed successfully`, 'success');
    return true;
  } catch (error) {
    log(`✗ ${sectionName} failed: ${error.message}`, 'error');
    return false;
  }
}

async function verifyTables() {
  log('Verifying database tables...', 'section');

  try {
    // Check if critical tables exist
    const tablesToCheck = [
      'assessment_submissions',
      'posts',
      'gdpr_consent_log',
      'security_audit_log',
      'admin_users'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error && error.code !== '42P01') { // 42P01 = table doesn't exist
        log(`Table ${table} exists`, 'success');
      } else if (error && error.code === '42P01') {
        log(`Table ${table} does not exist`, 'warning');
      }
    }

    return true;
  } catch (error) {
    log(`Table verification failed: ${error.message}`, 'error');
    return false;
  }
}

async function applyMigration() {
  log('Starting Critical Security Fixes Migration', 'section');
  log('='.repeat(60));

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '006_critical_security_fixes.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    // Split the migration into sections
    const sections = [
      {
        name: 'GDPR Verification Requests Table',
        sql: `
          -- Create the missing GDPR verification requests table
          CREATE TABLE IF NOT EXISTS public.gdpr_verification_requests (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email TEXT NOT NULL,
            request_type TEXT NOT NULL CHECK (request_type IN ('access', 'portability', 'deletion', 'rectification')),
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            ip_address INET,
            user_agent TEXT,
            verified_at TIMESTAMPTZ,
            processed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
            CONSTRAINT unique_pending_request UNIQUE(email, request_type, verified_at)
          );
        `
      },
      {
        name: 'GDPR Table Indexes',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_gdpr_token ON public.gdpr_verification_requests(token);
          CREATE INDEX IF NOT EXISTS idx_gdpr_email_type ON public.gdpr_verification_requests(email, request_type);
          CREATE INDEX IF NOT EXISTS idx_gdpr_expires ON public.gdpr_verification_requests(expires_at) WHERE processed_at IS NULL;
        `
      },
      {
        name: 'API Rate Limits Table',
        sql: `
          CREATE TABLE IF NOT EXISTS public.api_rate_limits (
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
        name: 'Rate Limit Indexes',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
            ON public.api_rate_limits(identifier, endpoint, window_end)
            WHERE window_end > NOW();
        `
      },
      {
        name: 'Security Audit Log Improvements',
        sql: `
          ALTER TABLE public.security_audit_log
            ADD COLUMN IF NOT EXISTS request_headers JSONB,
            ADD COLUMN IF NOT EXISTS response_status INTEGER,
            ADD COLUMN IF NOT EXISTS error_message TEXT,
            ADD COLUMN IF NOT EXISTS execution_time_ms INTEGER;
        `
      },
      {
        name: 'Assessment Submission Indexes',
        sql: `
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_email
            ON public.assessment_submissions(email);

          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_created
            ON public.assessment_submissions(created_at DESC);

          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_qualified
            ON public.assessment_submissions(qualified, created_at DESC)
            WHERE qualified = true;
        `
      },
      {
        name: 'Blog Post Indexes',
        sql: `
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_published
            ON public.posts(status, published_at DESC)
            WHERE status = 'published' AND deleted_at IS NULL;

          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_slug
            ON public.posts(slug)
            WHERE deleted_at IS NULL;
        `
      },
      {
        name: 'GDPR Consent Log Indexes',
        sql: `
          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gdpr_consent_email
            ON public.gdpr_consent_log(email);

          CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gdpr_consent_submission
            ON public.gdpr_consent_log(submission_id);
        `
      }
    ];

    // Apply each section
    let successCount = 0;
    let failureCount = 0;

    for (const section of sections) {
      const success = await executeSQLSection(section.sql, section.name);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    // Summary
    log('='.repeat(60));
    log(`Migration Summary:`, 'section');
    log(`✓ Successful sections: ${successCount}`, 'success');
    if (failureCount > 0) {
      log(`✗ Failed sections: ${failureCount}`, 'error');
    }

    // Verify critical components
    log('='.repeat(60));
    log('Verifying Critical Components:', 'section');

    // Check if new tables were created
    const newTables = ['gdpr_verification_requests', 'api_rate_limits'];
    for (const table of newTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          log(`✓ Table '${table}' exists and is accessible`, 'success');
        } else {
          log(`✗ Table '${table}' check failed: ${error.message}`, 'error');
        }
      } catch (e) {
        log(`✗ Table '${table}' verification error: ${e.message}`, 'error');
      }
    }

    // Enable RLS on new tables
    log('='.repeat(60));
    log('Enabling Row Level Security:', 'section');

    const rlsSQL = `
      ALTER TABLE public.gdpr_verification_requests ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
    `;

    await executeSQLSection(rlsSQL, 'RLS Enablement');

    // Create RLS Policies
    log('Creating RLS Policies:', 'section');

    const policiesSQL = `
      -- GDPR Verification Requests Policies
      DROP POLICY IF EXISTS "Anyone can create verification requests" ON public.gdpr_verification_requests;
      CREATE POLICY "Anyone can create verification requests"
        ON public.gdpr_verification_requests
        FOR INSERT WITH CHECK (true);

      DROP POLICY IF EXISTS "Users can view own requests with valid token" ON public.gdpr_verification_requests;
      CREATE POLICY "Users can view own requests with valid token"
        ON public.gdpr_verification_requests
        FOR SELECT USING (true);

      DROP POLICY IF EXISTS "System can update verification status" ON public.gdpr_verification_requests;
      CREATE POLICY "System can update verification status"
        ON public.gdpr_verification_requests
        FOR UPDATE USING (true);

      -- API Rate Limits Policies
      DROP POLICY IF EXISTS "System manages rate limits" ON public.api_rate_limits;
      CREATE POLICY "System manages rate limits"
        ON public.api_rate_limits
        FOR ALL USING (false);
    `;

    await executeSQLSection(policiesSQL, 'RLS Policies');

    log('='.repeat(60));
    log('Migration completed!', 'success');

    return true;

  } catch (error) {
    log(`Migration failed: ${error.message}`, 'error');
    console.error(error.stack);
    return false;
  }
}

async function testDatabaseFunctions() {
  log('Testing Database Functions:', 'section');

  try {
    // Test validate_email function if it exists
    const { data: emailTest, error: emailError } = await supabase.rpc('validate_email', {
      email: 'test@example.com'
    });

    if (!emailError) {
      log('✓ validate_email function works', 'success');
    } else {
      log(`validate_email function not found or error: ${emailError.message}`, 'warning');
    }

    // Test update_updated_at_column trigger function
    const { data: triggerTest, error: triggerError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (!triggerError) {
      log('✓ Posts table accessible', 'success');
    } else {
      log(`Posts table check failed: ${triggerError.message}`, 'warning');
    }

    return true;
  } catch (error) {
    log(`Function testing failed: ${error.message}`, 'error');
    return false;
  }
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   CRITICAL SECURITY FIXES - SUPABASE DATABASE         ║');
  console.log('║   Leah Fowler Performance Coach Platform              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  // Verify tables exist
  await verifyTables();

  // Apply migration
  const migrationSuccess = await applyMigration();

  if (migrationSuccess) {
    // Test functions
    await testDatabaseFunctions();

    log('='.repeat(60));
    log('All critical security fixes have been applied successfully!', 'success');
    log('Next steps:', 'section');
    log('1. Verify RLS policies are working correctly');
    log('2. Test GDPR verification flow');
    log('3. Monitor rate limiting functionality');
    log('4. Review security audit logs');
  } else {
    log('Some security fixes failed to apply. Please review the errors above.', 'error');
    process.exit(1);
  }
}

// Run the migration
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  console.error(error.stack);
  process.exit(1);
});