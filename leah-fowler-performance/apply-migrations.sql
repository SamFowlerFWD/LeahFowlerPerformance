-- Combined Migration Script for Leah Fowler Performance Coach Platform
-- This script applies all migrations in the correct order

-- Start transaction
BEGIN;

-- First, let's drop existing tables if they exist to ensure clean state
DROP TABLE IF EXISTS public.customer_discounts CASCADE;
DROP TABLE IF EXISTS public.discount_codes CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.pricing_tiers CASCADE;
DROP TABLE IF EXISTS public.subscription_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.wearable_metrics CASCADE;
DROP TABLE IF EXISTS public.wearable_integrations CASCADE;
DROP TABLE IF EXISTS public.email_campaigns CASCADE;
DROP TABLE IF EXISTS public.email_subscribers CASCADE;
DROP TABLE IF EXISTS public.performance_goals CASCADE;
DROP TABLE IF EXISTS public.performance_metrics CASCADE;
DROP TABLE IF EXISTS public.coaching_sessions CASCADE;
DROP TABLE IF EXISTS public.lead_nurture_sequences CASCADE;
DROP TABLE IF EXISTS public.lead_magnet_downloads CASCADE;
DROP TABLE IF EXISTS public.lead_magnets CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.quick_contact CASCADE;
DROP TABLE IF EXISTS public.ab_test_results CASCADE;
DROP TABLE IF EXISTS public.ab_tests CASCADE;
DROP TABLE IF EXISTS public.engagement_tracking CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.client_success_metrics CASCADE;
DROP TABLE IF EXISTS public.programme_recommendations CASCADE;
DROP TABLE IF EXISTS public.performance_barriers CASCADE;
DROP TABLE IF EXISTS public.blog_analytics CASCADE;
DROP TABLE IF EXISTS public.blog_subscribers CASCADE;
DROP TABLE IF EXISTS public.blog_comments CASCADE;
DROP TABLE IF EXISTS public.blog_post_tags CASCADE;
DROP TABLE IF EXISTS public.blog_tags CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP TABLE IF EXISTS public.blog_authors CASCADE;
DROP TABLE IF EXISTS public.assessment_submissions CASCADE;

DROP VIEW IF EXISTS public.assessment_leads CASCADE;
DROP VIEW IF EXISTS public.coach_dashboard CASCADE;
DROP VIEW IF EXISTS public.lead_conversion_funnel CASCADE;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.get_live_metrics() CASCADE;
DROP FUNCTION IF EXISTS public.get_personalised_recommendations(jsonb, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_progress_summary(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_client_ltv(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_user_activity() CASCADE;
DROP FUNCTION IF EXISTS public.update_session_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_email_engagement() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_lead_score() CASCADE;
DROP FUNCTION IF EXISTS public.export_user_data(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.delete_user_data(uuid) CASCADE;

-- Now apply migrations in order

COMMIT;

-- Apply each migration file separately to handle errors better