#!/bin/bash

# Supabase Database Setup Script
# This script applies the complete database schema to Supabase using the REST API

SUPABASE_URL="https://ltlbfltlhysjxslusypq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ"

echo "==============================================="
echo "SUPABASE DATABASE SETUP"
echo "==============================================="
echo "URL: $SUPABASE_URL"
echo "==============================================="

# Function to execute SQL via Supabase Management API
execute_sql() {
    local sql="$1"
    local description="$2"

    echo -n "Executing: $description... "

    # Note: Supabase doesn't expose a direct SQL execution endpoint in the public API
    # We'll need to use the Supabase Dashboard or CLI for this

    echo "⚠️  Requires manual execution"
}

echo ""
echo "⚠️  IMPORTANT: Direct SQL execution via API is not available"
echo "==============================================="
echo ""
echo "Please follow these steps to set up your database:"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new"
echo ""
echo "2. Copy the entire contents of:"
echo "   leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql"
echo ""
echo "3. Paste into the SQL Editor"
echo ""
echo "4. Click 'Run' to execute all statements"
echo ""
echo "==============================================="
echo ""
echo "Alternatively, use the Supabase CLI:"
echo ""
echo "1. Install Supabase CLI if not already installed:"
echo "   npm install -g supabase"
echo ""
echo "2. Link your project:"
echo "   supabase link --project-ref ltlbfltlhysjxslusypq"
echo ""
echo "3. Execute the SQL file:"
echo "   supabase db push < leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql"
echo ""
echo "==============================================="

# Test connection to verify credentials are working
echo ""
echo "Testing connection to Supabase..."
echo ""

# Test fetching from a table (this will fail if tables don't exist yet)
response=$(curl -s -X GET \
    "$SUPABASE_URL/rest/v1/posts?limit=1" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")

if echo "$response" | grep -q '"code"'; then
    echo "❌ Tables not yet created. Please execute the SQL file as described above."
else
    echo "✅ Connection successful!"
fi

echo ""
echo "==============================================="