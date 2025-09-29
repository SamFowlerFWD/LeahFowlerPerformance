
# GDPR COMPLIANCE - CRITICAL DATABASE MIGRATION

## IMMEDIATE ACTION REQUIRED

The assessment_submissions table MUST have the following GDPR columns added for legal compliance:

1. gdpr_consent_given (BOOLEAN DEFAULT false)
2. gdpr_consent_timestamp (TIMESTAMPTZ)
3. gdpr_deletion_requested (BOOLEAN DEFAULT false)
4. gdpr_deletion_timestamp (TIMESTAMPTZ)
5. data_retention_days (INTEGER DEFAULT 365)

## METHOD 1: Supabase Dashboard (FASTEST)

1. Go to: https://ltlbfltlhysjxslusypq.supabase.co
2. Login with your credentials
3. Navigate to SQL Editor (left sidebar)
4. Copy and paste the SQL from: scripts/gdpr-migration.sql
5. Click "Run"
6. Verify in Table Editor that columns were added

## METHOD 2: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref ltlbfltlhysjxslusypq

# Run migration
supabase db execute -f scripts/gdpr-migration.sql
```

## METHOD 3: Edge Function (Advanced)

Deploy the Edge Function from supabase/functions/gdpr-ddl-executor/
Then invoke it to add the columns programmatically.

## VERIFICATION

After adding columns, run this query to verify:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'assessment_submissions'
AND column_name LIKE 'gdpr%' OR column_name = 'data_retention_days';
```

## CRITICAL NOTES

- These columns are REQUIRED for GDPR compliance
- Without them, the platform cannot legally process user data
- This must be completed before any user data collection

## Support

If you encounter issues:
1. Check Supabase service status
2. Verify service role key permissions
3. Contact Supabase support if needed

DEADLINE: IMMEDIATE - Required for legal compliance
