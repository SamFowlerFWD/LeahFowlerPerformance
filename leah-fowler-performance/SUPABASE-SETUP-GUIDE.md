# Supabase Database Setup Guide

## Overview

This guide will help you complete the setup of your Supabase database for the Leah Fowler Performance Coach platform.

## Your Supabase Instance Details

- **Project URL**: https://ltlbfltlhysjxslusypq.supabase.co
- **Project Reference**: ltlbfltlhysjxslusypq
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ`

## Step 1: Apply Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. **Log into Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq
   - Navigate to the SQL Editor (left sidebar)

2. **Execute Migrations in Order**

   Execute each migration file in this specific order:

   a. **001_assessment_submissions.sql**
      - Creates assessment submission tracking tables
      - Sets up lead qualification system

   b. **001_subscriptions_schema.sql**
      - Creates subscription and payment tables
      - Sets up pricing tiers

   c. **002_enhanced_conversion_features.sql**
      - Creates conversion optimisation tables
      - Sets up A/B testing framework

   d. **003_blog_schema.sql**
      - Creates complete blog CMS system
      - Sets up SEO and analytics tracking

   e. **004_complete_platform_schema.sql**
      - Creates user profiles and coaching tables
      - Sets up performance tracking
      - Implements GDPR compliance functions

3. **How to Execute Each Migration**
   - Open the SQL Editor
   - Copy the contents of each migration file
   - Paste into the editor
   - Click "Run" or press Cmd+Enter
   - Wait for confirmation message
   - Move to the next file

### Option B: Using the Provided Shell Script

1. **Get Your Database Password**
   - Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/settings/database
   - Find "Database Password" section
   - Copy the password

2. **Run the Setup Script**
   ```bash
   cd /Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance
   ./setup-database-direct.sh
   ```
   - Enter your database password when prompted
   - The script will apply all migrations automatically

## Step 2: Configure Storage Buckets

The storage buckets have been created automatically:
- ✅ **profile-images** (public) - User profile photos
- ✅ **blog-media** (public) - Blog post images and media
- ✅ **assessment-files** (private) - Assessment submissions and reports
- ✅ **coaching-resources** (private) - Protected coaching materials

### Configure Bucket Policies

1. Go to Storage section in Supabase Dashboard
2. For each bucket, click on "Policies"
3. Add the following policies:

**For Public Buckets (profile-images, blog-media):**
```sql
-- Allow public read
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id IN ('profile-images', 'blog-media'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('profile-images', 'blog-media') AND
  auth.role() = 'authenticated'
);
```

**For Private Buckets (assessment-files, coaching-resources):**
```sql
-- Allow users to access their own files
CREATE POLICY "Users can access own files" ON storage.objects
FOR ALL USING (
  bucket_id IN ('assessment-files', 'coaching-resources') AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Configure Authentication

1. **Navigate to Authentication Settings**
   - Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/auth/providers

2. **Enable Email Authentication**
   - Ensure "Email" is enabled
   - Configure email templates for:
     - Sign up confirmation
     - Password reset
     - Magic link sign in

3. **Configure Social Providers (Optional)**
   - Google OAuth
   - LinkedIn OAuth (recommended for professional audience)

4. **Set Up Email Templates**
   - Go to Auth > Email Templates
   - Customise templates to match Leah Fowler branding
   - Use UK English throughout

## Step 4: Enable Row Level Security (RLS)

RLS has been configured in the migrations, but verify it's enabled:

1. Go to Table Editor
2. For each table, ensure the shield icon is green (RLS enabled)
3. Critical tables requiring RLS:
   - ✅ user_profiles
   - ✅ assessment_submissions
   - ✅ coaching_sessions
   - ✅ performance_metrics
   - ✅ subscriptions

## Step 5: Configure Environment Variables

Create or update your `.env` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ltlbfltlhysjxslusypq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ

# Database URL (for Prisma/Drizzle if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ltlbfltlhysjxslusypq.supabase.co:5432/postgres
```

## Step 6: Verify Setup

### Check Tables Created

Run this query in SQL Editor to verify all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables include:
- assessment_submissions
- blog_authors
- blog_categories
- blog_posts
- coaching_sessions
- lead_magnets
- performance_metrics
- subscriptions
- user_profiles
- And many more...

### Test Basic Operations

1. **Test User Registration**
```javascript
// In your application
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'TestPassword123!'
});
```

2. **Test Data Access**
```javascript
// Test reading public data
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
```

## Step 7: Production Checklist

Before going live:

- [ ] All migrations successfully applied
- [ ] RLS policies tested and working
- [ ] Storage buckets configured with correct policies
- [ ] Authentication providers configured
- [ ] Email templates customised
- [ ] Environment variables set in production
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] API rate limiting configured
- [ ] GDPR compliance functions tested

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check RLS policies are correctly configured
   - Verify you're using the correct API keys

2. **"Table does not exist" errors**
   - Ensure all migrations ran in the correct order
   - Check for any error messages during migration

3. **Authentication not working**
   - Verify email settings in Supabase Dashboard
   - Check SMTP configuration if using custom domain

4. **Storage upload failures**
   - Verify bucket policies are set correctly
   - Check file size limits in Supabase settings

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Project Dashboard**: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq
- **SQL Editor**: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql

## Next Steps

Once the database is set up:

1. Configure Stripe integration for payments
2. Set up monitoring and analytics
3. Implement caching with Redis
4. Configure CDN for static assets
5. Set up CI/CD pipeline for deployments

## Important Security Notes

⚠️ **Never commit the Service Role Key to version control**
⚠️ **Always use environment variables for sensitive credentials**
⚠️ **Regularly rotate your database passwords**
⚠️ **Monitor for unusual database activity**

---

Created by: Supabase Database Architect
Date: 2025-09-22
Platform: Leah Fowler Performance Coach