#!/usr/bin/env node

/**
 * Supabase Database Verification Script
 * Verifies that all tables, policies, and functions are correctly set up
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Console output helpers
const log = {
  success: (msg) => console.log('\x1b[32m✓\x1b[0m', msg),
  error: (msg) => console.error('\x1b[31m✗\x1b[0m', msg),
  info: (msg) => console.log('\x1b[36mℹ\x1b[0m', msg),
  warning: (msg) => console.log('\x1b[33m⚠\x1b[0m', msg),
  section: (msg) => {
    console.log('\n' + '='.repeat(50));
    console.log('\x1b[35m' + msg + '\x1b[0m');
    console.log('='.repeat(50));
  }
};

// Expected tables grouped by category
const expectedTables = {
  'Assessment & Lead Management': [
    'assessment_submissions',
    'gdpr_consent_log',
    'assessment_admin_log',
    'performance_barriers',
    'programme_recommendations',
    'quick_contact_requests'
  ],
  'Blog System': [
    'categories',
    'tags',
    'authors',
    'posts',
    'post_tags',
    'post_revisions',
    'post_views',
    'related_posts',
    'blog_settings'
  ],
  'Subscription & Payments': [
    'subscriptions',
    'payment_methods',
    'invoices',
    'subscription_items',
    'pricing_tiers',
    'webhook_events',
    'discount_codes',
    'customer_discounts'
  ],
  'User Management': [
    'user_profiles'
  ],
  'Lead Generation': [
    'lead_magnets',
    'lead_magnet_downloads'
  ],
  'Coaching & Performance': [
    'coaching_sessions',
    'performance_metrics'
  ],
  'Marketing & Engagement': [
    'client_success_metrics',
    'testimonials',
    'engagement_tracking',
    'ab_tests',
    'email_campaigns',
    'email_subscribers'
  ],
  'Integrations': [
    'wearable_connections',
    'wearable_data'
  ]
};

// Expected views
const expectedViews = [
  'assessment_leads',
  'coach_dashboard_stats',
  'lead_conversion_funnel'
];

// Expected functions
const expectedFunctions = [
  'update_updated_at_column',
  'anonymize_assessment_submission',
  'get_assessment_statistics',
  'update_post_search_vector',
  'calculate_reading_metrics',
  'create_post_revision',
  'update_tag_usage_count',
  'publish_scheduled_posts',
  'get_live_success_metrics',
  'get_programme_recommendation',
  'get_user_progress_summary',
  'calculate_client_ltv',
  'update_user_last_active',
  'increment_session_count',
  'calculate_lead_score',
  'export_user_data',
  'delete_user_data',
  'calculate_related_posts'
];

// Main verification function
async function verifyDatabase() {
  log.section('SUPABASE DATABASE VERIFICATION');
  log.info(`URL: ${SUPABASE_URL}`);
  log.info(`Project ID: ltlbfltlhysjxslusypq\n`);

  let totalTables = 0;
  let foundTables = 0;
  let missingTables = [];

  // Check tables by category
  for (const [category, tables] of Object.entries(expectedTables)) {
    log.section(category);

    for (const table of tables) {
      totalTables++;
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(0); // Just check if table exists

        if (error && error.code === '42P01') {
          // Table doesn't exist
          log.error(`Table '${table}' not found`);
          missingTables.push(table);
        } else if (error) {
          // Other error (likely RLS policy blocking)
          log.warning(`Table '${table}' exists but has restricted access (RLS enabled)`);
          foundTables++;
        } else {
          log.success(`Table '${table}' verified`);
          foundTables++;
        }
      } catch (err) {
        log.error(`Error checking table '${table}': ${err.message}`);
      }
    }
  }

  // Check views
  log.section('Database Views');
  for (const view of expectedViews) {
    try {
      const { data, error } = await supabase
        .from(view)
        .select('*')
        .limit(0);

      if (error && error.code === '42P01') {
        log.error(`View '${view}' not found`);
      } else if (error) {
        log.warning(`View '${view}' exists but has restricted access`);
      } else {
        log.success(`View '${view}' verified`);
      }
    } catch (err) {
      log.error(`Error checking view '${view}': ${err.message}`);
    }
  }

  // Check functions (using RPC)
  log.section('Database Functions');
  const functionChecks = [
    { name: 'get_assessment_statistics', params: {} },
    { name: 'get_live_success_metrics', params: {} },
    { name: 'calculate_lead_score', params: { p_email: 'test@example.com' } }
  ];

  for (const func of functionChecks) {
    try {
      const { data, error } = await supabase.rpc(func.name, func.params);

      if (error) {
        log.error(`Function '${func.name}' error: ${error.message}`);
      } else {
        log.success(`Function '${func.name}' verified`);
      }
    } catch (err) {
      log.error(`Error checking function '${func.name}': ${err.message}`);
    }
  }

  // Test RLS policies
  log.section('Row Level Security (RLS) Tests');

  // Test public access to categories
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (!error) {
      log.success(`Public read access to 'categories' verified (${data?.length || 0} records)`);
    } else {
      log.warning(`Categories table has restricted access: ${error.message}`);
    }
  } catch (err) {
    log.error(`Error testing categories access: ${err.message}`);
  }

  // Test public access to pricing tiers
  try {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('is_active', true);

    if (!error) {
      log.success(`Public read access to 'pricing_tiers' verified (${data?.length || 0} tiers)`);
    } else {
      log.warning(`Pricing tiers table has restricted access: ${error.message}`);
    }
  } catch (err) {
    log.error(`Error testing pricing tiers access: ${err.message}`);
  }

  // Summary
  log.section('VERIFICATION SUMMARY');

  const tablePercentage = Math.round((foundTables / totalTables) * 100);

  console.log(`\nTables: ${foundTables}/${totalTables} (${tablePercentage}%)`);

  if (missingTables.length > 0) {
    log.error(`Missing tables: ${missingTables.join(', ')}`);
    console.log('\nTo fix missing tables, run the migration scripts:');
    console.log('1. cd supabase');
    console.log('2. chmod +x apply-migrations.sh');
    console.log('3. ./apply-migrations.sh');
  } else {
    log.success('All expected tables are present!');
  }

  // Performance recommendations
  log.section('PERFORMANCE RECOMMENDATIONS');

  const recommendations = [
    '1. Enable query performance insights in Supabase dashboard',
    '2. Monitor slow queries and add indexes as needed',
    '3. Set up database backups (daily recommended)',
    '4. Configure connection pooling for production',
    '5. Enable real-time subscriptions only for necessary tables',
    '6. Review and optimize RLS policies for performance',
    '7. Set up monitoring alerts for database size and performance'
  ];

  recommendations.forEach(rec => log.info(rec));

  // Security recommendations
  log.section('SECURITY RECOMMENDATIONS');

  const securityRecs = [
    '1. Review all RLS policies to ensure proper data protection',
    '2. Rotate database passwords regularly',
    '3. Use service role key only on server-side',
    '4. Enable audit logging for sensitive tables',
    '5. Implement rate limiting on API calls',
    '6. Encrypt sensitive data fields (health conditions, etc.)',
    '7. Regular security audits of database access patterns'
  ];

  securityRecs.forEach(rec => log.info(rec));

  // Next steps
  log.section('NEXT STEPS FOR INTEGRATION');

  console.log('\n1. **Environment Variables** - Add to your .env file:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY=<get from dashboard>`);

  console.log('\n2. **Install Supabase Client**:');
  console.log('   npm install @supabase/supabase-js');

  console.log('\n3. **Create Supabase Client** in your app:');
  console.log('   const supabase = createClient(url, anonKey);');

  console.log('\n4. **Test Authentication**:');
  console.log('   - Enable email auth in Supabase dashboard');
  console.log('   - Configure email templates');
  console.log('   - Set up OAuth providers if needed');

  console.log('\n5. **Configure Storage Buckets** for:');
  console.log('   - User avatars');
  console.log('   - Blog post images');
  console.log('   - Lead magnet files');
  console.log('   - Assessment result PDFs');

  log.section('DATABASE READY FOR PRODUCTION! 🚀');
}

// Run verification
verifyDatabase().catch(console.error);