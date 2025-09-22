'use client'

import dynamic from 'next/dynamic'
import SectionErrorBoundary from '@/components/SectionErrorBoundary'
import AnnouncementBar from '@/components/AnnouncementBar'
import ModernHeader from '@/components/ModernHeader'
import PremiumHeroWithImage from '@/components/PremiumHeroWithImage'
import AchievementBadge from '@/components/AchievementBadge'
import TrustBar from '@/components/TrustBar'
import ModernAssessmentSection from '@/components/ModernAssessmentSection'
import AphroditePricingTiers from '@/components/AphroditePricingTiers'
import PackageSelectorQuiz from '@/components/PackageSelectorQuiz'
import MobileDock from '@/components/MobileDock'
import PremiumTestimonialsSection from '@/components/PremiumTestimonialsSection'
// import TrustSection from '@/components/TrustSection' // REMOVED: Contains false claims - legal liability
import TruthfulTrustSection from '@/components/TruthfulTrustSection' // TRUTHFUL replacement
import AboutSection from '@/components/AboutSection'
import LeadMagnetDelivery from '@/components/LeadMagnetDelivery'
import PerformanceBreakthroughLeadMagnet from '@/components/PerformanceBreakthroughLeadMagnet'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import HeroStatsSection from '@/components/HeroStatsSection'

// Only use dynamic imports for client-only components
const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { ssr: false })
const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false })
const ViewportIndicator = dynamic(() => import('@/components/ViewportIndicator'), { ssr: false })

// Metadata has been moved to layout.tsx since this is now a client component

export default function Home() {
  return (
    <>
      {/* Announcement Bar - Mother Identity Metrics */}
      <AnnouncementBar />

      {/* Modern Glassmorphism Header */}
      <ModernHeader />

      {/* Main Content - No padding needed as hero handles its own spacing */}
      <main className="min-h-screen">
        {/* Premium Hero Section with Professional Imagery */}
        <PremiumHeroWithImage />

        {/* Achievement Badge - Positioned below hero */}
        <AchievementBadge />

        {/* Hero Stats Section - Value Proposition and Credibility */}
        <HeroStatsSection />

        {/* Trust Bar - Build immediate credibility */}
        <TrustBar />

        {/* Modern Assessment Section with 3D Cards */}
        <SectionErrorBoundary sectionName="ModernAssessmentSection">
          <ModernAssessmentSection />
        </SectionErrorBoundary>

        {/* Package Selector Quiz - Help Parents Find Their Perfect Programme */}
        <SectionErrorBoundary sectionName="PackageSelectorQuiz">
          <PackageSelectorQuiz />
        </SectionErrorBoundary>

        {/* Aphrodite Fitness Packages - Complete Training Options */}
        <SectionErrorBoundary sectionName="AphroditePricingTiers">
          <AphroditePricingTiers />
        </SectionErrorBoundary>

        {/* Premium Testimonials Section - World-class social proof with SEO optimization */}
        <SectionErrorBoundary sectionName="PremiumTestimonialsSection">
          <PremiumTestimonialsSection />
        </SectionErrorBoundary>

        {/* Trust Building Section - Now 100% Truthful */}
        <TruthfulTrustSection />

        {/* Performance Breakthrough Assessment - Lead Magnet */}
        <section className="luxury-section bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy">
          <div className="container mx-auto">
            <PerformanceBreakthroughLeadMagnet />
          </div>
        </section>

        {/* Additional Lead Magnets */}
        <section className="luxury-section bg-gray-50 dark:bg-navy">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <LeadMagnetDelivery />
            </div>
          </div>
        </section>

        {/* About Section */}
        <SectionErrorBoundary sectionName="AboutSection">
          <AboutSection />
        </SectionErrorBoundary>

        {/* Contact Section */}
        <SectionErrorBoundary sectionName="ContactSection">
          <ContactSection />
        </SectionErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Mobile Navigation Dock */}
      <MobileDock />

      {/* Viewport Position Indicator */}
      <ViewportIndicator />
    </>
  )
}