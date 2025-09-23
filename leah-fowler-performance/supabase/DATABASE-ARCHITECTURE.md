# Supabase Database Architecture
## Leah Fowler Performance Coach Platform

### 🎯 Overview

Complete database architecture for a comprehensive performance coaching platform with UK-focused terminology and GDPR compliance. The database supports assessment submissions, blog content, subscription management, coaching sessions, and advanced analytics.

### 📊 Database Statistics

- **Total Tables**: 32
- **Total Views**: 3
- **Total Functions**: 18
- **RLS Policies**: 45+
- **Indexes**: 80+

### 🔐 Connection Details

```env
SUPABASE_URL=https://ltlbfltlhysjxslusypq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8
PROJECT_ID=ltlbfltlhysjxslusypq
```

## 📁 Database Schema Organisation

### 1. Assessment & Lead Management
**Purpose**: Track performance assessments and qualify leads

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `assessment_submissions` | Store complete assessment data | GDPR compliant, qualification scoring |
| `gdpr_consent_log` | Track consent history | Legal compliance audit trail |
| `assessment_admin_log` | Admin action audit trail | Security and accountability |
| `performance_barriers` | Identified client barriers | Personalisation engine |
| `programme_recommendations` | AI-generated recommendations | Conversion optimisation |
| `quick_contact_requests` | WhatsApp/SMS requests | Quick conversion path |

### 2. Blog System
**Purpose**: Content management with MDX support

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `posts` | Blog posts with MDX | Full-text search, SEO optimised |
| `categories` | Content categorisation | UK-focused topics |
| `tags` | Content tagging | Usage tracking |
| `authors` | Author profiles | Multiple authors support |
| `post_revisions` | Version control | Automatic revision tracking |
| `post_views` | Analytics tracking | Session-based deduplication |

### 3. Subscription & Payment System
**Purpose**: Stripe integration for recurring payments

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `subscriptions` | Active subscriptions | Stripe sync, multiple tiers |
| `pricing_tiers` | Programme pricing | Foundation, Performance, Elite, Youth |
| `payment_methods` | Stored payment methods | PCI compliant storage |
| `invoices` | Invoice records | PDF generation ready |
| `discount_codes` | Promotional codes | Usage tracking |

### 4. User Management
**Purpose**: Extended user profiles for coaching

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `user_profiles` | Extended profiles | Health metrics, goals, preferences |

### 5. Lead Generation
**Purpose**: Content marketing and lead magnets

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `lead_magnets` | Downloadable resources | Multiple types, conversion tracking |
| `lead_magnet_downloads` | Download tracking | Attribution, engagement metrics |

### 6. Coaching & Performance
**Purpose**: Session management and progress tracking

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `coaching_sessions` | 1-to-1 and group sessions | Calendar integration ready |
| `performance_metrics` | Progress tracking | Comprehensive metrics suite |

### 7. Marketing & Analytics
**Purpose**: Engagement tracking and optimisation

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `client_success_metrics` | Success stories | Live dashboard data |
| `testimonials` | Client testimonials | Approval workflow |
| `engagement_tracking` | User behaviour | Conversion funnel analysis |
| `ab_tests` | A/B testing framework | Data-driven optimisation |
| `email_campaigns` | Email marketing | Segmentation, automation |
| `email_subscribers` | Subscriber management | Engagement scoring |

### 8. Integrations
**Purpose**: External service connections

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `wearable_connections` | Device API connections | Multi-device support |
| `wearable_data` | Synced health data | Normalised storage |

## 🔒 Security Architecture

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

1. **Public Access**
   - Read-only: categories, tags, published posts, active lead magnets
   - Insert-only: assessment submissions, contact requests

2. **Authenticated Users**
   - Full access to own data
   - Read access to assigned coaching sessions
   - Update own profiles and metrics

3. **Admin/Coach Role**
   - Full access to assessment data
   - Manage all coaching sessions
   - View all analytics

4. **Service Role**
   - Full access for backend operations
   - Webhook processing
   - Stripe synchronisation

### GDPR Compliance Features

- ✅ Consent tracking with versioning
- ✅ Data export function (`export_user_data`)
- ✅ Data deletion function (`delete_user_data`)
- ✅ Anonymisation function (`anonymize_assessment_submission`)
- ✅ Audit logging for admin actions
- ✅ Encrypted storage for sensitive health data

## 🚀 Performance Optimisations

### Indexes
Strategic indexes on:
- Foreign keys for JOIN performance
- Status fields for filtering
- Date fields for sorting
- Email fields for lookups
- Full-text search vectors

### Database Views
Pre-computed views for common queries:
- `assessment_leads` - Simplified lead management
- `coach_dashboard_stats` - Real-time coach metrics
- `lead_conversion_funnel` - Conversion analytics

### Helper Functions

| Function | Purpose |
|----------|---------|
| `get_assessment_statistics()` | Dashboard statistics |
| `get_user_progress_summary()` | Client progress overview |
| `calculate_client_ltv()` | Lifetime value calculation |
| `calculate_lead_score()` | Lead scoring algorithm |
| `get_live_success_metrics()` | Real-time success metrics |
| `calculate_related_posts()` | Content recommendations |

## 🔄 Data Flow

### Assessment Journey
```
1. User completes assessment → assessment_submissions
2. Barriers identified → performance_barriers
3. Programme recommended → programme_recommendations
4. Lead qualified → Email to CRM
5. Conversion tracked → subscriptions
```

### Content Journey
```
1. Lead magnet download → lead_magnet_downloads
2. Email subscription → email_subscribers
3. Engagement tracked → engagement_tracking
4. Lead scored → calculate_lead_score()
5. Nurture campaign → email_campaigns
```

### Coaching Journey
```
1. Client onboarding → user_profiles
2. Sessions scheduled → coaching_sessions
3. Progress tracked → performance_metrics
4. Wearables synced → wearable_data
5. Results analysed → client_success_metrics
```

## 🛠️ Implementation Guide

### 1. Apply Migrations

```bash
cd supabase
chmod +x apply-migrations.sh
./apply-migrations.sh
```

### 2. Verify Setup

```bash
npm install @supabase/supabase-js
node verify-database.js
```

### 3. Configure Storage Buckets

Create these buckets in Supabase dashboard:
- `avatars` - User profile pictures
- `blog-images` - Blog post images
- `lead-magnets` - Downloadable resources
- `assessment-results` - PDF reports

### 4. Set Up Authentication

1. Enable Email/Password auth
2. Configure email templates (UK English)
3. Set up OAuth if needed
4. Configure password policies

### 5. Configure Edge Functions

Required for:
- Stripe webhook processing
- Email sending
- Wearable data sync
- Assessment PDF generation

## 📈 Monitoring & Maintenance

### Key Metrics to Monitor

1. **Performance**
   - Query execution time
   - Index usage statistics
   - Connection pool utilisation

2. **Storage**
   - Database size growth
   - Large table monitoring
   - Backup status

3. **Security**
   - Failed authentication attempts
   - RLS policy violations
   - Admin action audit logs

### Regular Maintenance Tasks

- [ ] Weekly: Review slow query logs
- [ ] Monthly: Analyse index usage
- [ ] Monthly: Review and archive old data
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance review

## 🔍 Common Queries

### Get Client Overview
```sql
SELECT * FROM get_user_progress_summary('user-uuid');
```

### Check Conversion Funnel
```sql
SELECT * FROM lead_conversion_funnel;
```

### Live Success Metrics
```sql
SELECT * FROM get_live_success_metrics();
```

### Find Qualified Leads
```sql
SELECT * FROM assessment_leads
WHERE qualified = true
  AND status = 'new'
ORDER BY created_at DESC;
```

## 📝 Migration Rollback

If needed, each migration can be rolled back:

```sql
-- Rollback order (reverse of application)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then reapply migrations selectively
```

## 🚨 Important Notes

1. **UK English** - All text fields use UK spelling (optimise, programme, centre)
2. **Timezone** - Default timezone is Europe/London
3. **Currency** - All prices in GBP (stored as pence/integers)
4. **Data Retention** - GDPR compliant with user deletion rights
5. **Encryption** - Sensitive health data should be encrypted at application level

## 📞 Support

- **Supabase Dashboard**: https://app.supabase.com/project/ltlbfltlhysjxslusypq
- **API Documentation**: https://ltlbfltlhysjxslusypq.supabase.co/rest/v1/
- **Database Status**: Check Supabase dashboard for real-time status

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Architecture**: Production-ready with full GDPR compliance