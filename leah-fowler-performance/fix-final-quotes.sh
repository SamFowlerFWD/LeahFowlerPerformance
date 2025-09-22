#!/bin/bash

echo "Fixing final quote issues in specific files..."

# Fix app/admin/blog/new/page.tsx
sed -i '' "s/push('' \/admin\/blog')/push('\/admin\/blog')/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' status'/setValue('status'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' content_type'/setValue('content_type'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' category_id'/setValue('category_id'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' difficulty_level'/setValue('difficulty_level'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' is_featured'/setValue('is_featured'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' is_premium'/setValue('is_premium'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' allow_comments'/setValue('allow_comments'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' show_toc'/setValue('show_toc'/g" app/admin/blog/new/page.tsx
sed -i '' "s/setValue('' show_related'/setValue('show_related'/g" app/admin/blog/new/page.tsx

# Fix app/admin/blog/page.tsx
sed -i '' "s/push('' \/admin\/blog\/new')/push('\/admin\/blog\/new')/g" app/admin/blog/page.tsx

# Fix all files with pattern '' followed by space
for file in app/admin/blog/new/page.tsx app/admin/blog/page.tsx tests/verify-spacing-fix.spec.ts components/PerformanceBreakthroughLeadMagnet.tsx components/Header.tsx components/PricingTiersWithStripe.tsx lib/api-client.ts; do
  if [ -f "$file" ]; then
    # Replace '' followed by space with single quote
    sed -i '' "s/'' /'/g" "$file"
    # Fix any remaining ''  patterns
    sed -i '' "s/''  /'/g" "$file"
    echo "Fixed: $file"
  fi
done

echo "Done fixing final quote issues"