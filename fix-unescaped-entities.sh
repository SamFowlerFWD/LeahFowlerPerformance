#!/bin/bash
# Fix all react/no-unescaped-entities errors in the Leah Fowler Performance codebase

echo "🔧 Fixing unescaped entities in React components..."

# Function to fix a single file
fix_file() {
    local file="$1"
    echo "Processing: $file"

    # Create backup
    cp "$file" "$file.bak"

    # Fix apostrophes (') - replace with &apos;
    sed -i "s/\([>][^<]*\)'\([^<]*[<]\)/\1\&apos;\2/g" "$file"

    # Fix quotes (") - replace with &ldquo; and &rdquo;
    sed -i "s/\([>][^<]*\)\"\([^\"]*\)\"\([^<]*[<]\)/\1\&ldquo;\2\&rdquo;\3/g" "$file"

    # Remove backup if successful
    if [ $? -eq 0 ]; then
        rm "$file.bak"
        echo "✓ Fixed: $file"
    else
        mv "$file.bak" "$file"
        echo "✗ Failed to fix: $file"
    fi
}

# Change to the project directory
cd /root/app/leah-fowler-performance

# Fix all component files with unescaped entities
fix_file "app/family-athlete-demo/page.tsx"
fix_file "app/mobile-demo/page.tsx"
fix_file "app/performance-accelerator/page.tsx"
fix_file "components/AboutSection.tsx"
fix_file "components/AphroditePricingTiers.tsx"
fix_file "components/AssessmentSection.tsx"
fix_file "components/AssessmentTool.tsx"
fix_file "components/BarrierIdentificationSystem.tsx"
fix_file "components/ChatWidget.tsx"
fix_file "components/ConsultancyProgrammes.tsx"
fix_file "components/ContactSection.tsx"
fix_file "components/ExitIntentPopup.tsx"
fix_file "components/Footer.tsx"
fix_file "components/HeroStatsSection.tsx"
fix_file "components/InteractiveProgrammeGallery.tsx"
fix_file "components/LeadMagnetDelivery.tsx"
fix_file "components/NorfolkCommunitySection.tsx"
fix_file "components/PerformanceBreakthroughLeadMagnet.tsx"
fix_file "components/PremiumProgrammeComparison.tsx"
fix_file "components/PremiumTestimonialsSection.tsx"
fix_file "components/PricingTiers.tsx"
fix_file "components/ProgrammeRecommendationEngine.tsx"
fix_file "components/ProgrammesSection.tsx"
fix_file "components/SectionErrorBoundary.tsx"
fix_file "components/TestimonialsSection.tsx"
fix_file "components/TruthfulTrustSection.tsx"
fix_file "components/VideoTestimonials.tsx"
fix_file "components/WhyChooseSection.tsx"
fix_file "components/spacing/SpacingShowcase.tsx"

echo "✅ Unescaped entities fix complete!"