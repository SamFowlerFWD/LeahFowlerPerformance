#!/bin/bash

echo "🔧 Reverting incorrectly escaped entities in JavaScript/TypeScript code..."

# Find all files and fix incorrectly escaped entities in JS/TS code
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./fix-*" \
  -not -path "./comprehensive-*" \
  -not -path "./revert-*" | while read file; do

  # Create backup
  cp "$file" "$file.prebak"

  # Revert &apos; to '' in JavaScript string literals
  sed -i '' "s/useState(&apos;/useState(''/g" "$file"
  sed -i '' "s/useState<[^>]*>(&apos;/useState(''/g" "$file"
  sed -i '' "s/: &apos;/: '/g" "$file"
  sed -i '' "s/= &apos;/= '/g" "$file"
  sed -i '' "s/(&apos;/('' /g" "$file"
  sed -i '' "s/ &apos;/ ''/g" "$file"
  sed -i '' "s/&apos;)/')/g" "$file"
  sed -i '' "s/&apos;,/',/g" "$file"
  sed -i '' "s/&apos;;/';/g" "$file"
  sed -i '' "s/&apos;}/'})/g" "$file"
  sed -i '' "s/{&apos;/{'/g" "$file"
  sed -i '' "s/\[&apos;/['/g" "$file"
  sed -i '' "s/&apos;\]/'])/g" "$file"

  # Revert &quot; to "" in JavaScript
  sed -i '' 's/useState(&quot;/useState(""/g' "$file"
  sed -i '' 's/: &quot;/: "/g' "$file"
  sed -i '' 's/= &quot;/= "/g' "$file"
  sed -i '' 's/(&quot;/("" /g' "$file"
  sed -i '' 's/ &quot;/ ""/g' "$file"
  sed -i '' 's/&quot;)/"))/g' "$file"
  sed -i '' 's/&quot;,/",/g' "$file"
  sed -i '' 's/&quot;;/";/g' "$file"

  # Fix <unknown> back to <any> in generic type parameters
  sed -i '' "s/<unknown>/<any>/g" "$file"
  sed -i '' "s/Array<unknown>/Array<any>/g" "$file"

  # Check if file changed
  if ! cmp -s "$file" "$file.prebak"; then
    echo "  ✅ Reverted: $file"
  fi

  rm "$file.prebak"
done

echo "✨ Revert complete!"