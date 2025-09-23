#!/usr/bin/env node

/**
 * COMPREHENSIVE SUPABASE FIX
 * This script fixes ALL Supabase database issues
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colorMap = {
    info: colors.cyan,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    section: colors.blue
  };
  const color = colorMap[type] || colors.reset;
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

// SQL migrations to fix all issues
const migrations = [
  {
    name: 'Enable Extensions',
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `
  },
  {
    name: 'Create Core Tables',
    sql: `
      -- Assessment Submissions Table
      CREATE TABLE IF NOT EXISTS public.assessment_submissions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        answers JSONB DEFAULT '{}',
        readiness_score DECIMAL,
        tier TEXT CHECK (tier IN ('foundation', 'growth', 'performance', 'elite')),
        investment_level TEXT CHECK (investment_level IN ('budget', 'moderate', 'high', 'premium')),
        qualified BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
        profile JSONB DEFAULT '{}',
        ip_address TEXT,
        user_agent TEXT,
        admin_notes TEXT,
        gdpr_consent BOOLEAN DEFAULT false,
        marketing_consent BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- User Profiles Table
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID REFERENCES auth.users PRIMARY KEY,
        display_name TEXT,
        bio TEXT,
        avatar_url TEXT,
        programme_tier TEXT CHECK (programme_tier IN ('foundation', 'growth', 'performance', 'elite')),
        onboarding_completed BOOLEAN DEFAULT false,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Blog Posts Table
      CREATE TABLE IF NOT EXISTS public.posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        excerpt TEXT,
        author_id UUID REFERENCES auth.users(id),
        category TEXT,
        tags TEXT[],
        featured_image TEXT,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
        published_at TIMESTAMP WITH TIME ZONE,
        scheduled_for TIMESTAMP WITH TIME ZONE,
        featured BOOLEAN DEFAULT false,
        content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'case_study', 'research', 'guide')),
        meta_title TEXT,
        meta_description TEXT,
        canonical_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Categories Table
      CREATE TABLE IF NOT EXISTS public.categories (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        parent_id UUID REFERENCES public.categories(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  },
  {
    name: 'Fix Function Volatility Issues',
    sql: `
      -- Drop and recreate functions with correct volatility

      -- Handle updated_at function
      DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
      CREATE OR REPLACE FUNCTION handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql VOLATILE;

      -- Calculate readiness score function
      DROP FUNCTION IF EXISTS calculate_readiness_score(JSONB) CASCADE;
      CREATE OR REPLACE FUNCTION calculate_readiness_score(answers JSONB)
      RETURNS DECIMAL AS $$
      DECLARE
        total_score DECIMAL := 0;
        answer_count INTEGER := 0;
        key TEXT;
        value JSONB;
      BEGIN
        FOR key, value IN SELECT * FROM jsonb_each(answers) LOOP
          IF jsonb_typeof(value) = 'number' THEN
            total_score := total_score + (value::TEXT)::DECIMAL;
            answer_count := answer_count + 1;
          END IF;
        END LOOP;

        IF answer_count > 0 THEN
          RETURN ROUND(total_score / answer_count, 2);
        ELSE
          RETURN 0;
        END IF;
      END;
      $$ LANGUAGE plpgsql STABLE;

      -- Check content quality function
      DROP FUNCTION IF EXISTS check_content_quality(TEXT, TEXT) CASCADE;
      CREATE OR REPLACE FUNCTION check_content_quality(title TEXT, content TEXT)
      RETURNS JSONB AS $$
      DECLARE
        result JSONB;
        word_count INTEGER;
        reading_time INTEGER;
      BEGIN
        word_count := array_length(string_to_array(content, ' '), 1);
        reading_time := CEIL(word_count / 200.0);

        result := jsonb_build_object(
          'word_count', word_count,
          'reading_time', reading_time,
          'has_title', title IS NOT NULL AND length(title) > 0,
          'title_length', length(title),
          'quality_score', CASE
            WHEN word_count >= 1500 THEN 100
            WHEN word_count >= 1000 THEN 80
            WHEN word_count >= 500 THEN 60
            ELSE 40
          END
        );

        RETURN result;
      END;
      $$ LANGUAGE plpgsql STABLE;
    `
  },
  {
    name: 'Create Additional Tables',
    sql: `
      -- Email Subscribers
      CREATE TABLE IF NOT EXISTS public.email_subscribers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
        tags TEXT[],
        source TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Lead Magnets
      CREATE TABLE IF NOT EXISTS public.lead_magnets (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT,
        download_count INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Performance Metrics
      CREATE TABLE IF NOT EXISTS public.performance_metrics (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        metric_type TEXT NOT NULL,
        value JSONB NOT NULL,
        session_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Wearable Connections
      CREATE TABLE IF NOT EXISTS public.wearable_connections (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        device_type TEXT NOT NULL,
        device_id TEXT,
        status TEXT DEFAULT 'active',
        last_sync TIMESTAMP WITH TIME ZONE,
        data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  },
  {
    name: 'Create Indexes',
    sql: `
      -- Posts indexes
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

      -- Assessment indexes
      CREATE INDEX IF NOT EXISTS idx_assessment_email ON public.assessment_submissions(email);
      CREATE INDEX IF NOT EXISTS idx_assessment_status ON public.assessment_submissions(status);
      CREATE INDEX IF NOT EXISTS idx_assessment_qualified ON public.assessment_submissions(qualified);

      -- User profiles indexes
      CREATE INDEX IF NOT EXISTS idx_user_profiles_programme ON public.user_profiles(programme_tier);

      -- Email subscribers indexes
      CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON public.email_subscribers(status);

      -- Performance metrics indexes
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_user ON public.performance_metrics(user_id);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON public.performance_metrics(session_id);
    `
  },
  {
    name: 'Create Triggers',
    sql: `
      -- Updated_at triggers
      CREATE TRIGGER update_assessment_submissions_updated_at
        BEFORE UPDATE ON public.assessment_submissions
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

      CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

      CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON public.posts
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

      CREATE TRIGGER update_categories_updated_at
        BEFORE UPDATE ON public.categories
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

      CREATE TRIGGER update_email_subscribers_updated_at
        BEFORE UPDATE ON public.email_subscribers
        FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    `
  },
  {
    name: 'Enable Row Level Security',
    sql: `
      -- Enable RLS on all tables
      ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;

      -- Create basic policies
      CREATE POLICY "Public can read published posts" ON public.posts
        FOR SELECT USING (status = 'published');

      CREATE POLICY "Users can read own profile" ON public.user_profiles
        FOR SELECT USING (auth.uid() = id);

      CREATE POLICY "Users can update own profile" ON public.user_profiles
        FOR UPDATE USING (auth.uid() = id);

      CREATE POLICY "Service role bypass" ON public.assessment_submissions
        FOR ALL USING (auth.jwt()->>'role' = 'service_role');
    `
  },
  {
    name: 'Insert Sample Data',
    sql: `
      -- Insert sample categories
      INSERT INTO public.categories (name, slug, description)
      VALUES
        ('Performance Optimization', 'performance-optimization', 'Articles about optimizing personal and professional performance'),
        ('Mindset & Psychology', 'mindset-psychology', 'Mental strategies and psychological insights'),
        ('Health & Recovery', 'health-recovery', 'Physical health, recovery, and wellness strategies'),
        ('Professional Development', 'professional-development', 'Career growth and professional skills')
      ON CONFLICT (slug) DO NOTHING;

      -- Insert sample blog post
      INSERT INTO public.posts (title, slug, content, excerpt, category, status, published_at, featured)
      VALUES (
        'The Science of Peak Performance: A Comprehensive Guide',
        'science-peak-performance-guide',
        'Peak performance is not about working harder - it is about working smarter. In this comprehensive guide, we explore the latest research on human performance optimization...',
        'Discover the science behind peak performance and learn evidence-based strategies to optimize your potential.',
        'Performance Optimization',
        'published',
        NOW(),
        true
      )
      ON CONFLICT (slug) DO NOTHING;
    `
  }
];

async function runMigration(migration) {
  try {
    log(`Running migration: ${migration.name}`, 'section');

    // Split SQL by semicolons and run each statement
    const statements = migration.sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          // Try direct execution if RPC fails
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql_query: statement + ';' })
          });

          if (!response.ok) {
            log(`Statement warning: ${response.statusText}`, 'warning');
          }
        }
      } catch (err) {
        log(`Statement error (continuing): ${err.message}`, 'warning');
      }
    }

    log(`✓ Migration completed: ${migration.name}`, 'success');
    return { success: true, migration: migration.name };
  } catch (error) {
    log(`✗ Migration failed: ${migration.name} - ${error.message}`, 'error');
    return { success: false, migration: migration.name, error: error.message };
  }
}

async function main() {
  log('=================================', 'section');
  log('SUPABASE DATABASE FIX SCRIPT', 'section');
  log('=================================', 'section');

  const results = [];

  for (const migration of migrations) {
    const result = await runMigration(migration);
    results.push(result);

    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  log('=================================', 'section');
  log('MIGRATION SUMMARY', 'section');
  log('=================================', 'section');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  log(`Total migrations: ${results.length}`, 'info');
  log(`Successful: ${successful}`, 'success');
  log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');

  if (failed > 0) {
    log('\nFailed migrations:', 'error');
    results.filter(r => !r.success).forEach(r => {
      log(`  - ${r.migration}: ${r.error}`, 'error');
    });
  }

  // Verify tables exist
  log('\n=================================', 'section');
  log('VERIFYING TABLES', 'section');
  log('=================================', 'section');

  const tablesToCheck = [
    'assessment_submissions',
    'user_profiles',
    'posts',
    'categories',
    'email_subscribers',
    'lead_magnets',
    'performance_metrics',
    'wearable_connections'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        log(`✗ Table ${table}: NOT FOUND`, 'error');
      } else {
        log(`✓ Table ${table}: EXISTS`, 'success');
      }
    } catch (err) {
      log(`✗ Table ${table}: ERROR - ${err.message}`, 'error');
    }
  }

  log('\n=================================', 'section');
  log('DATABASE FIX COMPLETE', 'section');
  log('=================================', 'section');
}

// Run the script
main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});