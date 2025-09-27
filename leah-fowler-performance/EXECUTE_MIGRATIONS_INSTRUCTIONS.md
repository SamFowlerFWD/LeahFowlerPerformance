# 🚀 Supabase Migration Execution Instructions

## Quick Links
- **Supabase SQL Editor**: https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql/new
- **Supabase Dashboard**: https://app.supabase.com/project/ltlbfltlhysjxslusypq

## ⚡ Quick Execution Steps

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com/project/ltlbfltlhysjxslusypq/sql/new
2. Make sure you're logged in with admin credentials

### Step 2: Execute Master Migration
1. Open file: `supabase/migrations/000_MASTER_MIGRATION.sql`
2. Copy the ENTIRE contents
3. Paste into SQL editor
4. Click "Run" button
5. Wait for completion (should take 30-60 seconds)

### Step 3: Execute Storage Buckets Migration
1. Clear the SQL editor
2. Open file: `supabase/migrations/001_STORAGE_BUCKETS.sql`
3. Copy the ENTIRE contents
4. Paste into SQL editor
5. Click "Run" button
6. Wait for completion (should take 10-20 seconds)

### Step 4: Verify Migration Success
1. Clear the SQL editor
2. Open file: `supabase/MIGRATION_VERIFICATION.sql`
3. Copy the ENTIRE contents
4. Paste into SQL editor
5. Click "Run" button
6. Review the results - all checks should pass

## ✅ Post-Migration Checklist

### Database Verification
- [ ] Check Tables tab - should see 35+ new tables
- [ ] Check Authentication > Users - auth system ready
- [ ] Check Storage > Buckets - 8 buckets created
- [ ] Check Database > Roles - proper roles configured

### Application Testing
- [ ] Test user signup/login
- [ ] Test assessment form submission
- [ ] Test blog post viewing
- [ ] Test admin login
- [ ] Test subscription checkout (Stripe test mode)

## 🚨 Troubleshooting

### If migrations fail with "already exists" errors:
This means some objects were already created. This is OK! Continue with the next steps.

### If you need to rollback:
```sql
-- DANGER: This will delete everything!
-- Only run if you need to start over
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### If RLS policies block access:
1. Go to Authentication > Policies
2. Temporarily disable RLS on affected tables
3. Test the functionality
4. Re-enable RLS when confirmed working

## 📊 Expected Results

After successful migration, you should have:

### Tables (35+)
- ✅ assessment_submissions
- ✅ user_profiles
- ✅ posts
- ✅ categories
- ✅ tags
- ✅ authors
- ✅ subscriptions
- ✅ pricing_tiers
- ✅ coaching_sessions
- ✅ performance_metrics
- ✅ lead_magnets
- ✅ email_subscribers
- ✅ admin_roles
- ✅ And 20+ more...

### Storage Buckets (8)
- ✅ avatars (public)
- ✅ blog-images (public)
- ✅ lead-magnets (private)
- ✅ coaching-resources (private)
- ✅ assessment-attachments (private)
- ✅ email-assets (public)
- ✅ video-content (private)
- ✅ exports (private)

### Functions (15+)
- ✅ GDPR compliance functions
- ✅ Analytics functions
- ✅ Helper utilities
- ✅ Trigger functions

### RLS Policies (40+)
- ✅ Secure access controls
- ✅ Role-based permissions
- ✅ Public read policies
- ✅ Admin override policies

## 🎯 Next Steps

1. **Update Environment Variables on VPS**
   ```bash
   ssh -i ~/.ssh/leah-deployment-key root@168.231.78.49
   cd /root/app/leah-fowler-performance
   nano .env.local
   # Ensure Supabase keys are set
   pm2 restart leah-fowler-performance
   ```

2. **Test Core Features**
   - Visit: http://168.231.78.49:3000
   - Test assessment form
   - Test blog access
   - Test admin login

3. **Configure Stripe Webhooks**
   - Go to Stripe Dashboard
   - Add webhook endpoint: https://your-domain.com/api/stripe/webhook
   - Configure events: checkout.session.completed, etc.

4. **Set Up Email Service**
   - Configure email provider (SendGrid, Postmark, etc.)
   - Update EMAIL_SERVICE_API_KEY in environment
   - Test email delivery

## 📝 Important Notes

- **UK English**: All text uses UK spelling (optimise, programme, centre)
- **Timezone**: Europe/London is default
- **Currency**: GBP (stored as pence)
- **GDPR**: Full compliance built-in
- **Accessibility**: WCAG 2.1 AA ready

## 🆘 Support

If you encounter issues:
1. Check Supabase logs: Dashboard > Logs
2. Verify environment variables are set correctly
3. Ensure all migrations ran in correct order
4. Check browser console for client-side errors

---

**Migration prepared by**: Supabase Database Architect Agent
**Date**: September 2024
**Platform**: Leah Fowler Performance Coach