#!/bin/bash

# Supabase Database Connection Details
DB_HOST="db.ltlbfltlhysjxslusypq.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
# Note: This password should be obtained from your Supabase dashboard
DB_PASSWORD="your-database-password"

echo "================================================"
echo "Supabase Database Migration Script"
echo "================================================"
echo ""
echo "IMPORTANT: You need to provide your database password"
echo "You can find this in your Supabase Dashboard:"
echo ""
echo "1. Go to https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq"
echo "2. Navigate to Settings -> Database"
echo "3. Find the 'Database Password' field"
echo "4. Copy the password"
echo ""
echo -n "Please enter your database password: "
read -s DB_PASSWORD
echo ""
echo ""

# Test connection first
echo "Testing database connection..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -c "SELECT version();" >/dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to connect to database. Please check your password and try again."
    exit 1
fi

echo "✅ Connection successful!"
echo ""

# Apply migrations in order
MIGRATIONS_DIR="/Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance/supabase/migrations"

echo "Applying migrations..."
echo "---------------------"

for migration in \
    "001_assessment_submissions.sql" \
    "001_subscriptions_schema.sql" \
    "002_enhanced_conversion_features.sql" \
    "003_blog_schema.sql" \
    "004_complete_platform_schema.sql"
do
    echo ""
    echo "📄 Applying: $migration"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -f "$MIGRATIONS_DIR/$migration" 2>&1 | grep -E "ERROR|NOTICE|CREATE|ALTER|INSERT" | head -20

    if [ $? -eq 0 ]; then
        echo "   ✅ Migration applied successfully"
    else
        echo "   ⚠️  Migration completed with warnings"
    fi
done

echo ""
echo "================================================"
echo "Verifying Tables"
echo "================================================"
echo ""

# Check if key tables exist
TABLES=(
    "assessment_submissions"
    "user_profiles"
    "blog_posts"
    "subscriptions"
    "performance_metrics"
    "blog_categories"
    "coaching_sessions"
    "lead_magnets"
)

for table in "${TABLES[@]}"; do
    result=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$table');" 2>/dev/null)

    if [[ "$result" == *"t"* ]]; then
        echo "   ✅ $table: exists"
    else
        echo "   ❌ $table: not found"
    fi
done

echo ""
echo "================================================"
echo "Migration Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Log into Supabase Dashboard to configure authentication providers"
echo "2. Set up email templates for auth flows"
echo "3. Configure storage bucket policies if needed"
echo "4. Update your .env file with the Supabase credentials"
echo ""
echo "Your Supabase credentials:"
echo "SUPABASE_URL=https://ltlbfltlhysjxslusypq.supabase.co"
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8"
echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU2MjA4MiwiZXhwIjoyMDc0MTM4MDgyfQ._50CDqU_v1Q61ZqR3bxgp_4qeZaUL8WGp3OQgH9DieQ"