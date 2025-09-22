#!/bin/bash

# Manual fixes for specific unescaped entity errors based on ESLint output

echo "🔧 Applying manual fixes for unescaped entities..."

cd /root/app/leah-fowler-performance

# Fix app/family-athlete-demo/page.tsx - Line 76
sed -i "76s/mother's/mother\&apos;s/" app/family-athlete-demo/page.tsx

# Fix app/mobile-demo/page.tsx - Lines 61, 172, 185, 202
sed -i "61s/mum's/mum\&apos;s/" app/mobile-demo/page.tsx
sed -i "172s/You're/You\&apos;re/" app/mobile-demo/page.tsx
sed -i "185s/can't/can\&apos;t/" app/mobile-demo/page.tsx
sed -i "202s/You're/You\&apos;re/" app/mobile-demo/page.tsx

# Fix app/performance-accelerator/page.tsx - Lines 137, 230, 253, 340, 346, 477
sed -i "137s/Let's identify what's/Let\&apos;s identify what\&apos;s/" app/performance-accelerator/page.tsx
sed -i "230s/you're/you\&apos;re/" app/performance-accelerator/page.tsx
sed -i '253s/"bulletproof"/\&ldquo;bulletproof\&rdquo;/' app/performance-accelerator/page.tsx
sed -i "340s/It's/It\&apos;s/" app/performance-accelerator/page.tsx
sed -i "346s/We'd/We\&apos;d/" app/performance-accelerator/page.tsx
sed -i "477s/you'll/you\&apos;ll/" app/performance-accelerator/page.tsx

# Fix components/AboutSection.tsx - Lines 211, 216, 218
sed -i "211s/Leah's/Leah\&apos;s/" components/AboutSection.tsx
sed -i "216s/isn't/isn\&apos;t/g" components/AboutSection.tsx
sed -i "218s/who've/who\&apos;ve/g" components/AboutSection.tsx

# Fix components/AphroditePricingTiers.tsx - Line 145
sed -i "145s/You're/You\&apos;re/" components/AphroditePricingTiers.tsx

# Fix components/AssessmentSection.tsx - Line 82
sed -i "82s/you're/you\&apos;re/" components/AssessmentSection.tsx

# Fix components/AssessmentTool.tsx - Lines 299, 300
sed -i "299s/you're/you\&apos;re/g" components/AssessmentTool.tsx
sed -i "300s/you're/you\&apos;re/" components/AssessmentTool.tsx

# Fix components/BarrierIdentificationSystem.tsx - Line 708
sed -i "708s/what's/what\&apos;s/" components/BarrierIdentificationSystem.tsx

# Fix components/ChatWidget.tsx - Lines 182, 207
sed -i "182s/I'm/I\&apos;m/" components/ChatWidget.tsx
sed -i "207s/Let's/Let\&apos;s/" components/ChatWidget.tsx

# Fix components/ConsultancyProgrammes.tsx - Line 116
sed -i "116s/You're/You\&apos;re/" components/ConsultancyProgrammes.tsx

# Fix components/ContactSection.tsx - Lines 176, 252, 272, 328, 417
sed -i "176s/Let's/Let\&apos;s/" components/ContactSection.tsx
sed -i "252s/you're/you\&apos;re/" components/ContactSection.tsx
sed -i "272s/I'll/I\&apos;ll/" components/ContactSection.tsx
sed -i "328s/you're/you\&apos;re/" components/ContactSection.tsx
sed -i "417s/I'd/I\&apos;d/" components/ContactSection.tsx

# Fix components/ExitIntentPopup.tsx - Lines 164, 238
sed -i "164s/Don't/Don\&apos;t/" components/ExitIntentPopup.tsx
sed -i "238s/you're/you\&apos;re/" components/ExitIntentPopup.tsx

# Fix components/Footer.tsx - Line 379
sed -i "379s/Let's/Let\&apos;s/" components/Footer.tsx

# Fix components/HeroStatsSection.tsx - Line 74
sed -i "74s/didn't/didn\&apos;t/" components/HeroStatsSection.tsx

# Fix components/InteractiveProgrammeGallery.tsx - Lines 339, 365
sed -i "339s/you're/you\&apos;re/" components/InteractiveProgrammeGallery.tsx
sed -i '365s/"ultimate"/\&ldquo;ultimate\&rdquo;/' components/InteractiveProgrammeGallery.tsx

# Fix components/LeadMagnetDelivery.tsx - Lines 323, 391, 426, 499, 511
sed -i "323s/You're/You\&apos;re/" components/LeadMagnetDelivery.tsx
sed -i "391s/You're/You\&apos;re/" components/LeadMagnetDelivery.tsx
sed -i "426s/We've/We\&apos;ve/" components/LeadMagnetDelivery.tsx
sed -i "499s/you'll/you\&apos;ll/" components/LeadMagnetDelivery.tsx
sed -i "511s/Don't/Don\&apos;t/" components/LeadMagnetDelivery.tsx

# Fix components/NorfolkCommunitySection.tsx - Lines 168, 171, 175, 426
sed -i "168s/We're/We\&apos;re/" components/NorfolkCommunitySection.tsx
sed -i "171s/who've/who\&apos;ve/" components/NorfolkCommunitySection.tsx
sed -i "175s/mum's/mum\&apos;s/" components/NorfolkCommunitySection.tsx
sed -i "426s/Let's/Let\&apos;s/" components/NorfolkCommunitySection.tsx

# Fix components/PerformanceBreakthroughLeadMagnet.tsx - Line 255
sed -i "255s/You're/You\&apos;re/" components/PerformanceBreakthroughLeadMagnet.tsx

# Fix components/PremiumProgrammeComparison.tsx - Line 121
sed -i "121s/What's/What\&apos;s/" components/PremiumProgrammeComparison.tsx

# Fix components/PremiumTestimonialsSection.tsx - Lines 150, 208, 420
sed -i "150s/Leah's/Leah\&apos;s/" components/PremiumTestimonialsSection.tsx
sed -i '208s/"completely changed"/\&ldquo;completely changed\&rdquo;/' components/PremiumTestimonialsSection.tsx
sed -i "420s/doesn't/doesn\&apos;t/g" components/PremiumTestimonialsSection.tsx

# Fix components/PricingTiers.tsx - Line 185
sed -i "185s/can't/can\&apos;t/" components/PricingTiers.tsx

# Fix components/ProgrammeRecommendationEngine.tsx - Lines 355, 394, 458, 601, 602, 626
sed -i "355s/you're/you\&apos;re/" components/ProgrammeRecommendationEngine.tsx
sed -i '394s/"all-in"/\&ldquo;all-in\&rdquo;/' components/ProgrammeRecommendationEngine.tsx
sed -i "458s/let's/let\&apos;s/" components/ProgrammeRecommendationEngine.tsx
sed -i "601s/You're/You\&apos;re/" components/ProgrammeRecommendationEngine.tsx
sed -i "602s/isn't/isn\&apos;t/" components/ProgrammeRecommendationEngine.tsx
sed -i "626s/Don't/Don\&apos;t/" components/ProgrammeRecommendationEngine.tsx

# Fix components/ProgrammesSection.tsx - Line 136
sed -i "136s/you're/you\&apos;re/" components/ProgrammesSection.tsx

# Fix components/SectionErrorBoundary.tsx - Line 50
sed -i "50s/couldn't/couldn\&apos;t/" components/SectionErrorBoundary.tsx

# Fix components/TestimonialsSection.tsx - Lines 192, 260, 333
sed -i "192s/couldn't/couldn\&apos;t/" components/TestimonialsSection.tsx
sed -i '260s/"life-changing"/\&ldquo;life-changing\&rdquo;/' components/TestimonialsSection.tsx
sed -i '333s/"changed my life"/\&ldquo;changed my life\&rdquo;/' components/TestimonialsSection.tsx

# Fix components/TruthfulTrustSection.tsx - Lines 208, 235, 236
sed -i '208s/"trust you"/\&ldquo;trust you\&rdquo;/' components/TruthfulTrustSection.tsx
sed -i "235s/doesn't/doesn\&apos;t/" components/TruthfulTrustSection.tsx
sed -i "236s/You'll/You\&apos;ll/" components/TruthfulTrustSection.tsx

# Fix components/VideoTestimonials.tsx - Lines 216, 309
sed -i '216s/"life-changing"/\&ldquo;life-changing\&rdquo;/' components/VideoTestimonials.tsx
sed -i '309s/"incredible impact"/\&ldquo;incredible impact\&rdquo;/' components/VideoTestimonials.tsx

# Fix components/WhyChooseSection.tsx - Lines 203
sed -i '203s/"actually understand"/\&ldquo;actually understand\&rdquo;/' components/WhyChooseSection.tsx

# Fix components/spacing/SpacingShowcase.tsx - Lines 25, 180, 181
sed -i "25s/I'm/I\&apos;m/" components/spacing/SpacingShowcase.tsx
sed -i "180s/spacing's/spacing\&apos;s/" components/spacing/SpacingShowcase.tsx
sed -i "181s/we've/we\&apos;ve/" components/spacing/SpacingShowcase.tsx

echo "✅ Manual fixes applied!"