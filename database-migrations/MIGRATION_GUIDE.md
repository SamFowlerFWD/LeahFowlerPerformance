# Database Migration Guide - Leah Fowler Performance

## Critical GDPR and Security Migrations

**Date:** 2025-09-29
**Database:** Supabase (ltlbfltlhysjxslusypq)
**Priority:** CRITICAL - Execute Immediately

## ⚠️ IMPORTANT: Manual Execution Required

Due to Supabase RPC limitations, these migrations must be executed directly in the Supabase SQL Editor.

## Step-by-Step Execution Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Migration Script

1. Open the file: `01-gdpr-security-migration.sql`
2. Copy the ENTIRE contents of the file
3. Paste into the SQL Editor
4. Click **Run** to execute

### Step 3: Verify Migration Success

After executing the main migration, run the verification script:

1. Open the file: `verify-migration.sql`
2. Copy the contents
3. Paste into a new SQL query
4. Click **Run**
5. Check that all counts are greater than 0

### Migration Checklist

#### GDPR Columns Added to assessment_submissions:
- [ ] gdpr_consent_given (BOOLEAN DEFAULT false)
- [ ] gdpr_consent_timestamp (TIMESTAMPTZ)
- [ ] gdpr_deletion_requested (BOOLEAN DEFAULT false)
- [ ] gdpr_deletion_timestamp (TIMESTAMPTZ)
- [ ] data_retention_days (INTEGER DEFAULT 365)

#### Database Functions Created:
- [ ] validate_email - Email validation function
- [ ] check_rate_limit - API rate limiting function
- [ ] anonymize_assessment_submission - GDPR data anonymization
- [ ] anonymize_user_data - Complete user data anonymization
- [ ] export_user_data - GDPR data export function
- [ ] cleanup_expired_data - Data retention cleanup

#### Performance Indexes Created:
- [ ] idx_assessment_email - On assessment_submissions(email)
- [ ] idx_posts_status_published - On posts(status, published_at)
- [ ] idx_gdpr_token - On gdpr_verification_requests(token)
- [ ] idx_rate_limit_lookup - On api_rate_limits
- [ ] idx_assessment_gdpr_deletion - For GDPR deletion tracking
- [ ] idx_assessment_created - For time-based queries

#### RLS Policies Updated:
- [ ] gdpr_verification_requests - Service role and public insert
- [ ] api_rate_limits - Service role only
- [ ] assessment_submissions - GDPR-compliant policies

#### Security Audit Columns Added:
- [ ] request_headers (JSONB)
- [ ] response_status (INTEGER)
- [ ] error_message (TEXT)
- [ ] execution_time_ms (INTEGER)

#### GDPR Helper Functions:
- [ ] anonymize_user_data - Complete user anonymization
- [ ] export_user_data - JSON export of user data
- [ ] cleanup_expired_data - Automated retention management
- [ ] set_gdpr_consent_timestamp - Trigger for consent tracking

## Testing the Migration

### Test 1: Verify Email Validation
```sql
SELECT
    validate_email('test@example.com') as should_be_true,
    validate_email('invalid-email') as should_be_false;
```

### Test 2: Check GDPR Columns Exist
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'assessment_submissions'
AND column_name LIKE 'gdpr%'
ORDER BY column_name;
```

### Test 3: Verify RLS Policies
```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('assessment_submissions', 'gdpr_verification_requests', 'api_rate_limits')
ORDER BY tablename, policyname;
```

### Test 4: Test Rate Limiting
```sql
-- This should return TRUE for the first call
SELECT check_rate_limit('test-user', '/api/test', 5, 1);

-- Run this 5 times quickly - the 6th call should return FALSE
SELECT check_rate_limit('test-user', '/api/test', 5, 1);
```

### Test 5: Test Data Export Function
```sql
-- Insert test data
INSERT INTO assessment_submissions (
    email, first_name, last_name,
    gdpr_consent_given, gdpr_consent_timestamp
) VALUES (
    'test@example.com', 'Test', 'User',
    true, NOW()
);

-- Export the data
SELECT export_user_data('test@example.com');
```

## Rollback Script (If Needed)

If you need to rollback the migration, use the rollback script:
`rollback-gdpr-migration.sql`

## Post-Migration Tasks

After successful migration:

1. **Update Application Code:**
   - Ensure all new assessment submissions include GDPR consent
   - Implement GDPR request handling endpoints
   - Add rate limiting to API routes

2. **Configure Scheduled Jobs:**
   - Set up daily cleanup job for expired data
   - Configure rate limit cleanup (hourly)

3. **Update Documentation:**
   - Document new GDPR compliance features
   - Update API documentation with rate limits
   - Create user privacy documentation

## Troubleshooting

### Common Issues:

1. **"Permission denied" errors:**
   - Ensure you're using the Service Role Key
   - Check RLS policies are not blocking the operation

2. **"Column already exists" errors:**
   - The migration is idempotent and checks for existing columns
   - If you see this, the column was likely already added

3. **"Function already exists" errors:**
   - Use CREATE OR REPLACE FUNCTION syntax
   - The migration handles this automatically

## Support

For issues with the migration:
1. Check the Supabase logs
2. Verify you're in the correct project
3. Ensure you have admin/service role permissions

## Migration Status Tracking

Use this to track your progress:

| Component | Status | Verified | Notes |
|-----------|--------|----------|-------|
| GDPR Columns | ⏳ Pending | ❌ | |
| Functions | ⏳ Pending | ❌ | |
| Indexes | ⏳ Pending | ❌ | |
| RLS Policies | ⏳ Pending | ❌ | |
| Audit Columns | ⏳ Pending | ❌ | |
| Triggers | ⏳ Pending | ❌ | |

Update the status as you complete each component:
- ⏳ Pending
- 🔄 In Progress
- ✅ Complete
- ❌ Failed (add notes)