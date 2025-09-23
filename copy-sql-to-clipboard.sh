#!/bin/bash

# Script to copy the complete SQL setup to clipboard for easy pasting into Supabase

echo "============================================================"
echo "SUPABASE SQL SETUP - COPY TO CLIPBOARD"
echo "============================================================"
echo ""

SQL_FILE="leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql"

if [ -f "$SQL_FILE" ]; then
    # Copy to clipboard (macOS)
    cat "$SQL_FILE" | pbcopy

    echo "✅ SQL file copied to clipboard!"
    echo ""
    echo "Now follow these steps:"
    echo ""
    echo "1. Open Supabase SQL Editor:"
    echo "   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new"
    echo ""
    echo "2. Paste (Cmd+V) the SQL code"
    echo ""
    echo "3. Click 'Run' to execute all statements"
    echo ""
    echo "4. Wait for completion (30-60 seconds)"
    echo ""
    echo "============================================================"
    echo "File contains:"
    echo "- 30 table definitions"
    echo "- 5 database functions"
    echo "- Multiple indexes and triggers"
    echo "- RLS policies"
    echo "- Storage bucket configurations"
    echo "- Sample data inserts"
    echo "============================================================"
else
    echo "❌ Error: SQL file not found at $SQL_FILE"
    exit 1
fi