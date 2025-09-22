import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Import mobile-optimized components for better mobile experience
import MobileOptimizedHero from '@/components/MobileOptimizedHero'
import MobileBottomNav from '@/components/MobileBottomNav'

// Lazy load components for better performance
const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  loading: () => <LoadingSection height="800px" />
})

// Use mobile-optimized versions for better UX
const MobileSwipeableProgrammes = dynamic(() => import('@/components/MobileSwipeableProgrammes'), {
  loading: () => <LoadingSection height="600px" />
})

const MobileTestimonials = dynamic(() => import('@/components/MobileTestimonials'), {
  loading: () => <LoadingSection height="700px" />
})

const NorfolkCommunitySection = dynamic(() => import('@/components/NorfolkCommunitySection'), {
  loading: () => <LoadingSection height="800px" />
})

// Loading placeholder component
function LoadingSection({ height }: { height: string }) {
  return (
    <div
      className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"
      style={{ height }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="h-8 bg-gray-300 rounded-lg w-1/3 mx-auto mb-8"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  )
}

export default function FamilyAthleteDemoPage() {
  return (
    <>
      <main className="min-h-screen pb-20 md:pb-0">
        {/* Mobile-Optimized Hero Section */}
        <MobileOptimizedHero />

        {/* About Section with Spartan achievements */}
        <Suspense fallback={<LoadingSection height="800px" />}>
          <AboutSection />
        </Suspense>

        {/* Mobile-Optimized Programme Gallery with Swipe */}
        <Suspense fallback={<LoadingSection height="600px" />}>
          <MobileSwipeableProgrammes />
        </Suspense>

        {/* Mobile-Optimized Testimonials with Swipe */}
        <Suspense fallback={<LoadingSection height="700px" />}>
          <MobileTestimonials />
        </Suspense>

        {/* Norfolk Community Section */}
        <Suspense fallback={<LoadingSection height="800px" />}>
          <NorfolkCommunitySection />
        </Suspense>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Journey Starts Today
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90">
            Join hundreds of Norfolk families who've discovered that fitness is better together.
            First session free, no contracts, just community.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-orange-500 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-all hover:scale-105 text-lg">
              Book Your Free Session
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-all hover:scale-105 text-lg">
              WhatsApp Leah Now
            </button>
          </div>
          <div className="mt-12 flex justify-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-white/80">Happy Families</div>
            </div>
            <div>
              <div className="text-3xl font-bold">127</div>
              <div className="text-white/80">Spartan Races</div>
            </div>
            <div>
              <div className="text-3xl font-bold">23</div>
              <div className="text-white/80">Youth Champions</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Mobile Bottom Navigation */}
    <MobileBottomNav />
    </>
  )
}

// Metadata for SEO
export const metadata = {
  title: 'Leah Fowler Performance - Family Fitness & Athletic Performance | Norfolk',
  description: 'Transform your family\'s fitness journey with Norfolk\'s premier performance coach. Youth athletics, Spartan race training, family programmes. First session free.',
  keywords: 'family fitness Norfolk, youth sports training, Spartan race coach, kids athletics Norwich, Dereham personal trainer',
  openGraph: {
    title: 'Join Norfolk\'s Strongest Fitness Family',
    description: 'From first steps to finish lines, we train together, win together. Expert coaching for parents, athletes, and families.',
    images: ['/images/hero/leah-training-action.webp'],
    locale: 'en_GB',
    type: 'website'
  }
}