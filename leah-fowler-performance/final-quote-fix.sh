#!/bin/bash

echo "Fixing all remaining double single quote issues..."

cd /Users/samfowler/Code/LeahFowlerPerformance-1/leah-fowler-performance

# Fix all patterns
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Fix common patterns of double quotes
  sed -i.fixbak "s/useState(''')/useState('')/g" "$file"
  sed -i.fixbak "s/useState(''all')/useState('all')/g" "$file"
  sed -i.fixbak "s/useState(''sage')/useState('sage')/g" "$file"
  sed -i.fixbak "s/useState(''navy')/useState('navy')/g" "$file"
  sed -i.fixbak "s/useState(''acceleration')/useState('acceleration')/g" "$file"
  sed -i.fixbak "s/case ''sage'/case 'sage'/g" "$file"
  sed -i.fixbak "s/case ''navy'/case 'navy'/g" "$file"
  sed -i.fixbak "s/join(''  ')/join('')/g" "$file"
  sed -i.fixbak "s/join('' ')/join(' ')/g" "$file"
  sed -i.fixbak "s/(''all')/('all')/g" "$file"
  sed -i.fixbak "s/(''form')/('form')/g" "$file"

  # Fix patterns with double quotes at start
  sed -i.fixbak "s/''all'/'all'/g" "$file"
  sed -i.fixbak "s/''sage'/'sage'/g" "$file"
  sed -i.fixbak "s/''navy'/'navy'/g" "$file"
  sed -i.fixbak "s/''email'/'email'/g" "$file"
  sed -i.fixbak "s/''phone'/'phone'/g" "$file"
  sed -i.fixbak "s/''both'/'both'/g" "$file"

  # Remove backup
  rm -f "$file.fixbak"
done

echo "Done fixing quote issues"