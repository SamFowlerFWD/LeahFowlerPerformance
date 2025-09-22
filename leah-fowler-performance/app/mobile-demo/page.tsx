'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Import mobile-optimized components
import MobileOptimizedHero from '@/components/MobileOptimizedHero'
import MobileBottomNav from '@/components/MobileBottomNav'

// Lazy load mobile-optimized components
const MobileSwipeableProgrammes = dynamic(() => import('@/components/MobileSwipeableProgrammes'), {
  loading: () => <LoadingSection height="600px" />,
  ssr: false // Disable SSR for swipe gestures
})

const MobileTestimonials = dynamic(() => import('@/components/MobileTestimonials'), {
  loading: () => <LoadingSection height="500px" />,
  ssr: false
})

const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  loading: () => <LoadingSection height="400px" />
})

const NorfolkCommunitySection = dynamic(() => import('@/components/NorfolkCommunitySection'), {
  loading: () => <LoadingSection height="600px" />
})

// Loading placeholder with skeleton animation
function LoadingSection({ height }: { height: string }) {
  return (
    <div
      className="animate-pulse bg-gradient-to-br from-slate-100 to-slate-200"
      style={{ height }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="h-8 bg-slate-300 rounded-lg w-1/3 mx-auto mb-8"></div>
        <div className="h-4 bg-slate-300 rounded w-2/3 mx-auto mb-4"></div>
        <div className="h-4 bg-slate-300 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  )
}

export default function MobileDemoPage() {
  return (
    <>
      <main className="min-h-screen pb-20">
        {/* Mobile-Optimized Hero Section */}
        <MobileOptimizedHero />

        {/* About Section - Family Focused */}
        <Suspense fallback={<LoadingSection height="400px" />}>
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                  Meet Your Coach
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Mum of 2, Spartan Ultra Finisher, and Norfolk&apos;s most trusted family fitness coach
                </p>
              </div>
              <AboutSection />
            </div>
          </section>
        </Suspense>

        {/* Mobile Swipeable Programme Gallery */}
        <Suspense fallback={<LoadingSection height="600px" />}>
          <MobileSwipeableProgrammes />
        </Suspense>

        {/* Mobile Testimonials with Swipe */}
        <Suspense fallback={<LoadingSection height="500px" />}>
          <MobileTestimonials />
        </Suspense>

        {/* Quick Info Section for Parents */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Everything Parents Need to Know
            </h2>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Schedule Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  📅 Class Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-semibold">Family Bootcamp</p>
                      <p className="text-sm text-slate-600">All ages welcome</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-500">Sat 9am</p>
                      <p className="text-xs text-slate-600">Dereham Park</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-semibold">Mums Morning Power</p>
                      <p className="text-sm text-slate-600">Childcare available</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-500">Mon/Wed 9:30am</p>
                      <p className="text-xs text-slate-600">Studio</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-semibold">Youth Athletics</p>
                      <p className="text-sm text-slate-600">Ages 8-17</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-500">Tue/Thu 4pm</p>
                      <p className="text-xs text-slate-600">Sports Centre</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all">
                  View Full Timetable
                </button>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  📍 Training Locations
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-900">Dereham Neatherd High</p>
                    <p className="text-sm text-slate-600 mt-1">Free parking • Changing rooms</p>
                    <button className="text-orange-500 text-sm font-semibold mt-2">Get Directions →</button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-900">Norwich Sports Park</p>
                    <p className="text-sm text-slate-600 mt-1">Indoor/outdoor • Café on-site</p>
                    <button className="text-orange-500 text-sm font-semibold mt-2">Get Directions →</button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-900">Outdoor Sessions</p>
                    <p className="text-sm text-slate-600 mt-1">Various Norfolk parks</p>
                    <button className="text-orange-500 text-sm font-semibold mt-2">View Map →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs for Parents */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                💭 Common Questions from Parents
              </h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-slate-900 py-3 border-b">
                    Can I bring my baby/toddler to sessions?
                    <span className="text-orange-500 group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="mt-3 text-slate-600">
                    Yes! Our morning sessions have a designated buggy park area, and we have partnerships with local childcare providers. Many mums bring babies in carriers too!
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-slate-900 py-3 border-b">
                    What if I haven&apos;t exercised in years?
                    <span className="text-orange-500 group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="mt-3 text-slate-600">
                    Perfect! Most of our parents start exactly there. Every exercise can be modified, and we focus on progress, not perfection. Your first session is free so you can try with no pressure.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-slate-900 py-3 border-b">
                    Do you offer family discounts?
                    <span className="text-orange-500 group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="mt-3 text-slate-600">
                    Yes! We have special family packages where additional family members get 50% off. Many families train together on Saturdays - it&apos;s our busiest session!
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Norfolk Community Section */}
        <Suspense fallback={<LoadingSection height="600px" />}>
          <NorfolkCommunitySection />
        </Suspense>

        {/* Final Mobile-Optimized CTA */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Norfolk&apos;s Strongest Family?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              First session free • No contracts • Just results
            </p>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">500+</div>
                <div className="text-sm text-white/60">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">4.9★</div>
                <div className="text-sm text-white/60">Google Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">10+</div>
                <div className="text-sm text-white/60">Years Experience</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-8 rounded-xl text-lg shadow-2xl transition-all min-h-[60px]">
                Book Your Free Session
              </button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-8 rounded-xl text-lg shadow-2xl transition-all min-h-[60px]">
                WhatsApp Leah Now
              </button>
            </div>

            {/* Urgency Message */}
            <p className="text-orange-400 mt-6 font-semibold animate-pulse">
              ⚡ Only 3 spots left in January programmes!
            </p>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  )
}

// Metadata should be defined in layout.tsx for client components
// See mobile-demo/layout.tsx for metadata configuration