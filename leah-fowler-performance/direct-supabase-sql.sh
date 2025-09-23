#!/bin/bash

# Direct SQL execution using Supabase API
SUPABASE_URL="https://ltlbfltlhysjxslusypq.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ"

echo "================================================"
echo "APPLYING DIRECT SQL MIGRATIONS TO SUPABASE"
echo "================================================"

# Read the complete setup SQL file
SQL_CONTENT=$(cat COMPLETE-SUPABASE-SETUP.sql)

# Unfortunately, we can't execute raw SQL directly via the REST API
# We need to use the Supabase Dashboard or the CLI

echo ""
echo "To complete the database setup, please:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new"
echo ""
echo "2. Copy ALL the contents from: COMPLETE-SUPABASE-SETUP.sql"
echo ""
echo "3. Paste it into the SQL Editor"
echo ""
echo "4. Click 'Run' to execute all migrations"
echo ""
echo "================================================"
echo ""
echo "Alternatively, use the Supabase CLI:"
echo ""
echo "npx supabase db push --db-url 'postgresql://postgres.ltlbfltlhysjxslusypq:$SUPABASE_DB_PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres'"
echo ""
echo "================================================"

# Let's at least check what tables exist
echo ""
echo "Checking existing tables..."
echo ""

# Check tables via REST API
curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/assessment_submissions?select=count" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  | jq -r 'if . == [] then "✓ assessment_submissions table exists" else "✗ assessment_submissions table NOT found" end'

curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/posts?select=count" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  | jq -r 'if . == [] then "✓ posts table exists" else "✗ posts table NOT found" end'

curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/user_profiles?select=count" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Prefer: count=exact" \
  -H "Range: 0-0" \
  | jq -r 'if . == [] then "✓ user_profiles table exists" else "✗ user_profiles table NOT found" end'

echo ""
echo "================================================"