'use client'

import dynamic from 'next/dynamic'
import SectionErrorBoundary from '@/components/SectionErrorBoundary'
import AnnouncementBar from '@/components/AnnouncementBar'
import ModernHeader from '@/components/ModernHeader'
import PremiumHeroWithImage from '@/components/PremiumHeroWithImage'
import AphroditePricingTiers from '@/components/AphroditePricingTiers'
// import MobileDock from '@/components/MobileDock' - Removed for cleaner mobile UI
import PremiumTestimonialsSection from '@/components/PremiumTestimonialsSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
// import HeroStatsSection from '@/components/HeroStatsSection' - Removed per request
import OnlinePackageShowcase from '@/components/OnlinePackageShowcase'
import FAQSection from '@/components/FAQSection'

// Only use dynamic imports for client-only components
const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { ssr: false })
// const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false }) - Removed per request
// const ViewportIndicator = dynamic(() => import('@/components/ViewportIndicator'), { ssr: false })

// Metadata has been moved to layout.tsx since this is now a client component

export default function Home() {
  return (
    <>
      {/* Announcement Bar - Mother Identity Metrics */}
      {/* <AnnouncementBar /> - Removed for cleaner header */}

      {/* Modern Glassmorphism Header */}
      <ModernHeader />

      {/* Main Content - No padding needed as hero handles its own spacing */}
      <main className="min-h-screen">
        {/* Premium Hero Section with Professional Imagery */}
        <PremiumHeroWithImage />

        {/* Premium Testimonials Section - Moved up right after hero */}
        <SectionErrorBoundary sectionName="PremiumTestimonialsSection">
          <PremiumTestimonialsSection />
        </SectionErrorBoundary>

        {/* FEATURED: Online Package Showcase - Main Product Offering */}
        <SectionErrorBoundary sectionName="OnlinePackageShowcase">
          <OnlinePackageShowcase />
        </SectionErrorBoundary>

        {/* Aphrodite Fitness Packages - Complete Training Options */}
        <SectionErrorBoundary sectionName="AphroditePricingTiers">
          <AphroditePricingTiers />
        </SectionErrorBoundary>

        {/* About Section */}
        <SectionErrorBoundary sectionName="AboutSection">
          <AboutSection />
        </SectionErrorBoundary>

        {/* FAQ Section */}
        <SectionErrorBoundary sectionName="FAQSection">
          <FAQSection />
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

      {/* Exit Intent Popup - Removed per request */}

      {/* Mobile Navigation Dock - Removed for cleaner mobile UI */}
    </>
  )
}