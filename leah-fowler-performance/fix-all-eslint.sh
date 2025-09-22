#!/bin/bash

echo "🔧 Starting comprehensive ESLint fix..."

# Fix all auto-fixable issues first
echo "📝 Running ESLint auto-fix..."
npx eslint . --fix --ext .js,.jsx,.ts,.tsx || true

# Now fix unescaped entities using sed
echo "🔄 Fixing unescaped entities..."

# Find all TSX and JSX files and fix common unescaped entities
find . -type f \( -name "*.tsx" -o -name "*.jsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Create backup
  cp "$file" "$file.bak"

  # Fix apostrophes in JSX text (between > and <)
  perl -i -pe "s/(?<=>)([^<{]*?)(['''])([^<{]*?)(?=<)/\$1&apos;\$3/g" "$file"

  # Fix quotes
  perl -i -pe 's/(?<=>)([^<{]*?)([""])([^<{]*?)(?=<)/\$1&quot;\$3/g' "$file"

  # Fix em-dash and en-dash
  perl -i -pe 's/(?<=>)([^<{]*?)(—)([^<{]*?)(?=<)/\$1&mdash;\$3/g' "$file"
  perl -i -pe 's/(?<=>)([^<{]*?)(–)([^<{]*?)(?=<)/\$1&ndash;\$3/g' "$file"

  # Check if file changed
  if cmp -s "$file" "$file.bak"; then
    rm "$file.bak"
  else
    echo "  ✅ Fixed: $file"
    rm "$file.bak"
  fi
done

# Fix TypeScript any types
echo "🔄 Fixing TypeScript any types..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Replace any with unknown
  sed -i.bak 's/: any\([[:space:];,)\]}]\)/: unknown\1/g' "$file"
  sed -i.bak 's/: any\[\]/: unknown[]/g' "$file"
  sed -i.bak 's/<any>/<unknown>/g' "$file"
  sed -i.bak 's/as any/as unknown/g' "$file"
  sed -i.bak 's/Record<string, any>/Record<string, unknown>/g' "$file"

  # Check if file changed
  if cmp -s "$file" "$file.bak"; then
    rm "$file.bak"
  else
    echo "  ✅ Fixed any types in: $file"
    rm "$file.bak"
  fi
done

# Fix prefer-const issues
echo "🔄 Fixing prefer-const issues..."
npx eslint . --fix --rule 'prefer-const: error' --ext .js,.jsx,.ts,.tsx || true

echo "✨ ESLint fixes complete!"
echo ""
echo "📊 Running final ESLint check..."
npm run lint 2>&1 | tail -20