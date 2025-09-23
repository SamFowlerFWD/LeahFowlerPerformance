# 🚀 SUPABASE DATABASE SETUP INSTRUCTIONS

## CRITICAL: Complete Database Setup Required

The test results show that **42 out of 44 tests are failing** because the database tables don't exist yet. Follow these steps to apply the complete database schema.

## Step 1: Access Supabase SQL Editor

1. **Open your Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new
   ```

2. **Login if required** using your credentials

## Step 2: Apply the Complete Database Schema

1. **Open the SQL file** in your code editor:
   ```
   /Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql
   ```

2. **Copy the ENTIRE contents** of the SQL file (all 923 lines)

3. **Paste into the Supabase SQL Editor**

4. **Click the "Run" button** to execute all statements

   ⚠️ **IMPORTANT**: The execution might take 30-60 seconds to complete all operations

## Step 3: Verify Database Creation

After running the SQL, you should see success messages for:

### Tables Created (30 total):
- ✅ assessment_submissions
- ✅ assessment_categories
- ✅ gdpr_requests
- ✅ gdpr_consent_log
- ✅ assessment_admin_log
- ✅ categories
- ✅ posts
- ✅ tags
- ✅ post_tags
- ✅ post_views
- ✅ post_revisions
- ✅ related_posts
- ✅ user_profiles
- ✅ programmes
- ✅ programme_modules
- ✅ programme_goals
- ✅ coaching_sessions
- ✅ exercise_library
- ✅ exercise_logs
- ✅ performance_metrics
- ✅ lead_magnets
- ✅ lead_magnet_downloads
- ✅ email_subscribers
- ✅ email_campaigns
- ✅ email_logs
- ✅ wearable_connections
- ✅ wearable_data
- ✅ notifications
- ✅ audit_logs
- ✅ feature_flags
- ✅ user_preferences
- ✅ user_achievements
- ✅ subscriptions
- ✅ payment_methods

### Functions Created:
- ✅ update_updated_at_column()
- ✅ anonymize_assessment_submission()
- ✅ get_assessment_statistics()
- ✅ get_live_success_metrics()
- ✅ get_programme_recommendation()

### RLS Policies Applied:
- ✅ Public read access for posts
- ✅ Public read access for categories
- ✅ User profile access controls
- ✅ Assessment submission policies

### Storage Buckets Created:
- ✅ avatars (public)
- ✅ blog-images (public)
- ✅ programme-resources (private)
- ✅ lead-magnets (private)

## Step 4: Add Sample Data

After the tables are created, run the sample data script:

```bash
cd /Users/samfowler/Code/LeahFowlerPerformance-1
node setup-database-direct.js
```

This will add:
- 5 blog categories
- 5 detailed blog posts with UK English content
- 10 relevant tags
- Sample programme data

## Step 5: Test the Blog Functionality

1. **Navigate to the blog page** in your application:
   ```
   http://localhost:3000/blog
   ```

2. **Verify**:
   - Blog posts are displayed
   - Categories are visible
   - Individual post pages work
   - No 404 errors occur

## Step 6: Run the Test Suite

```bash
cd /Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance
npm test
```

Expected result: All 44 tests should pass ✅

## Troubleshooting

### If you get permission errors:
- Ensure you're using the service role key for admin operations
- Check that RLS policies are properly configured

### If tables already exist:
- The SQL file includes `IF NOT EXISTS` clauses, so it's safe to run multiple times

### If the blog still shows 404:
1. Check the API routes in `/app/api/blog/`
2. Verify environment variables are set correctly
3. Check browser console for specific error messages

## Alternative Method: Using Supabase CLI

If you prefer using the CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ltlbfltlhysjxslusypq

# Apply the migrations
supabase db push < leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql
```

## Success Indicators

When everything is set up correctly:
- ✅ All 30 tables exist in your database
- ✅ Blog page displays sample posts
- ✅ No 404 errors on blog routes
- ✅ Test suite shows 44/44 tests passing
- ✅ Assessment forms can submit data
- ✅ Storage buckets are accessible

## Next Steps

Once the database is set up:
1. Test all blog functionality
2. Verify assessment submission works
3. Check user authentication flows
4. Test programme enrollment
5. Verify email subscriber management

## Support

If you encounter any issues:
1. Check Supabase logs for specific errors
2. Verify all environment variables are correct
3. Ensure the project URL matches: `ltlbfltlhysjxslusypq`
4. Check that both anon and service role keys are properly configured

---

**CRITICAL**: The database MUST be set up before the application will work correctly. The current test failures (42/44) are entirely due to missing database tables.