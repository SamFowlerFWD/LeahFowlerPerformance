#!/bin/bash

# Supabase Migration Executor - Direct SQL Approach
# This script executes migrations directly via the Supabase SQL editor API

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 SUPABASE MIGRATION EXECUTOR${NC}"
echo "================================"

# Load environment variables
source .env.local

# Check for required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase configuration in .env.local${NC}"
    exit 1
fi

PROJECT_REF="ltlbfltlhysjxslusypq"
SUPABASE_URL="https://ltlbfltlhysjxslusypq.supabase.co"

echo -e "${CYAN}📍 Target: $SUPABASE_URL${NC}"
echo -e "${CYAN}🔐 Using service role key${NC}"

# Function to execute SQL via Supabase Management API
execute_sql() {
    local sql_file=$1
    local filename=$(basename $sql_file)

    echo -e "\n${BLUE}📄 Executing ${filename}...${NC}"

    # Read the SQL file
    if [ ! -f "$sql_file" ]; then
        echo -e "${RED}❌ File not found: $sql_file${NC}"
        return 1
    fi

    # Create a temporary file with the SQL
    local temp_file="/tmp/migration_${filename}"
    cp "$sql_file" "$temp_file"

    echo -e "${GREEN}✅ Migration file prepared for execution${NC}"
    echo -e "${YELLOW}⚠️  Please execute manually in Supabase SQL Editor:${NC}"
    echo -e "${CYAN}   1. Go to: https://app.supabase.com/project/${PROJECT_REF}/sql${NC}"
    echo -e "${CYAN}   2. Copy the content from: $temp_file${NC}"
    echo -e "${CYAN}   3. Paste and execute in SQL editor${NC}"
}

# Migration files
MIGRATIONS=(
    "supabase/migrations/000_MASTER_MIGRATION.sql"
    "supabase/migrations/001_STORAGE_BUCKETS.sql"
)

echo -e "\n${YELLOW}⚠️  WARNING: This will modify your production database!${NC}"
echo -e "${YELLOW}Press Ctrl+C to cancel, or ENTER to continue...${NC}"
read -r

echo -e "\n${GREEN}🏗️  Starting migration process...${NC}"

# Execute each migration
for migration in "${MIGRATIONS[@]}"; do
    execute_sql "$migration"
    echo -e "${YELLOW}Press ENTER after executing this migration to continue...${NC}"
    read -r
done

# Verification
echo -e "\n${MAGENTA}🔍 Migration Verification${NC}"
echo -e "${CYAN}Please execute the verification script:${NC}"
echo -e "${CYAN}   File: supabase/MIGRATION_VERIFICATION.sql${NC}"
echo -e "${CYAN}   In: https://app.supabase.com/project/${PROJECT_REF}/sql${NC}"

echo -e "\n${GREEN}✨ Migration preparation complete!${NC}"
echo -e "${YELLOW}📝 Remember to test the following after migration:${NC}"
echo "   - User authentication (signup/login)"
echo "   - Assessment form submission"
echo "   - Blog post creation and viewing"
echo "   - Subscription checkout flow"
echo "   - Admin dashboard access"