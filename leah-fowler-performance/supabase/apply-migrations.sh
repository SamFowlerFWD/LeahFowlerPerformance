#!/bin/bash

# Supabase Database Migration Script for Leah Fowler Performance Coach
# This script applies all migrations to the Supabase database

# Configuration
SUPABASE_URL="https://ltlbfltlhysjxslusypq.supabase.co"
SUPABASE_DB_URL="postgresql://postgres.ltlbfltlhysjxslusypq:postgres@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"
MIGRATION_DIR="./migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Supabase Database Migration Tool${NC}"
echo -e "${GREEN}Leah Fowler Performance Coach${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if migrations directory exists
if [ ! -d "$MIGRATION_DIR" ]; then
    echo -e "${RED}Error: Migrations directory not found!${NC}"
    exit 1
fi

# Function to apply a migration
apply_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file")

    echo -e "${YELLOW}Applying migration: $migration_name${NC}"

    # Use psql to apply the migration
    psql "$SUPABASE_DB_URL" -f "$migration_file" 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully applied: $migration_name${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to apply: $migration_name${NC}"
        return 1
    fi
}

# Counter for migrations
total_migrations=0
successful_migrations=0
failed_migrations=0

# Apply migrations in order
for migration in $(ls -1 $MIGRATION_DIR/*.sql | sort); do
    total_migrations=$((total_migrations + 1))

    apply_migration "$migration"

    if [ $? -eq 0 ]; then
        successful_migrations=$((successful_migrations + 1))
    else
        failed_migrations=$((failed_migrations + 1))
        echo -e "${RED}Migration failed. Do you want to continue? (y/n)${NC}"
        read -r continue_choice
        if [ "$continue_choice" != "y" ]; then
            echo "Aborting migration process."
            break
        fi
    fi

    echo ""
done

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration Summary${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Total migrations: $total_migrations"
echo -e "${GREEN}Successful: $successful_migrations${NC}"
if [ $failed_migrations -gt 0 ]; then
    echo -e "${RED}Failed: $failed_migrations${NC}"
else
    echo "Failed: 0"
fi

# Additional information
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Test the database schema in your Supabase dashboard"
echo "2. Verify RLS policies are working correctly"
echo "3. Check that all tables and functions were created"
echo "4. Test API access with the anon key"
echo ""
echo -e "${GREEN}Database URL:${NC} $SUPABASE_URL"
echo -e "${GREEN}Dashboard:${NC} https://app.supabase.com/project/ltlbfltlhysjxslusypq"

exit 0