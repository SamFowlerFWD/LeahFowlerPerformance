'use client'

import dynamic from 'next/dynamic'
import ModernHeader from '@/components/ModernHeader'
import PremiumHeroWithImage from '@/components/PremiumHeroWithImage'
import TrustBar from '@/components/TrustBar'
import ModernAssessmentSection from '@/components/ModernAssessmentSection'
// import component here if needed
import PremiumProgrammeComparison from '@/components/PremiumProgrammeComparison'
import PremiumSocialProof from '@/components/PremiumSocialProof'
import MobileDock from '@/components/MobileDock'
import PremiumTestimonialsSection from '@/components/PremiumTestimonialsSection'
import TrustSection from '@/components/TrustSection'
import AboutSection from '@/components/AboutSection'
import LeadMagnetDelivery from '@/components/LeadMagnetDelivery'
import PerformanceBreakthroughLeadMagnet from '@/components/PerformanceBreakthroughLeadMagnet'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

// Only use dynamic imports for client-only components
const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { ssr: false })
const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false })

// Metadata has been moved to layout.tsx since this is now a client component

export default function Home() {
  return (
    <>
      {/* Premium Social Proof Notifications */}
      <PremiumSocialProof />

      {/* Modern Glassmorphism Header */}
      <ModernHeader />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Premium Hero Section with Professional Imagery */}
        <PremiumHeroWithImage />

        {/* Trust Bar - Build immediate credibility */}
        <TrustBar />

        {/* Modern Assessment Section with 3D Cards */}
        <ModernAssessmentSection />

        {/* Premium Programme Comparison - Enhanced */}
        <PremiumProgrammeComparison />

        {/* Original Pricing Tiers (Alternative View) */}
        {/* <PricingTiers /> */}

        {/* Premium Testimonials Section - World-class social proof with SEO optimization */}
        <PremiumTestimonialsSection />

        {/* Trust Building Section */}
        <TrustSection />

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
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Mobile Navigation Dock */}
      <MobileDock />
    </>
  )
}