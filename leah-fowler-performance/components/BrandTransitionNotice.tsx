'use client';

/**
 * Brand Transition Notice Component
 * Helps with SEO during the transition from Aphrodite Fitness to Leah Coach
 * Provides clear signals to search engines and users about the brand evolution
 */

export default function BrandTransitionNotice({ variant = 'subtle' }: { variant?: 'subtle' | 'prominent' }) {
  if (variant === 'prominent') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
            Welcome to Leah Coach
          </h3>
          <p className="text-amber-800 dark:text-amber-200">
            <span className="font-medium">Formerly Aphrodite Fitness</span> •
            <span className="ml-2">Previously Strength PT</span> •
            <span className="ml-2">Now Elite Performance Consultancy</span>
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-3">
            We've evolved from fitness training to comprehensive life performance optimisation for high-achieving professionals.
            Same expertise, elevated service, transformative results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-2 px-4">
      <p>
        Leah Coach - Elite Performance Consultancy
        <span className="mx-2">•</span>
        <span className="italic">Formerly Aphrodite Fitness & Strength PT</span>
      </p>
    </div>
  );
}

/**
 * Brand Evolution Timeline Component
 * Shows the progression from Aphrodite Fitness to Leah Coach
 * Useful for About pages and brand story sections
 */
export function BrandEvolutionTimeline() {
  const milestones = [
    {
      year: '2015',
      brand: 'Aphrodite Fitness',
      description: 'Founded as a personal fitness coaching service in Norfolk',
      focus: 'Fitness Training',
    },
    {
      year: '2022',
      brand: 'Strength PT',
      description: 'Evolved to specialised strength and conditioning coaching',
      focus: 'Performance Training',
    },
    {
      year: '2024',
      brand: 'Leah Coach',
      description: 'Transformed into elite performance consultancy for high achievers',
      focus: 'Life Performance Optimisation',
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-orange-500"></div>
      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div key={milestone.year} className="relative flex items-start">
            <div className="absolute left-8 w-4 h-4 bg-amber-500 rounded-full -translate-x-1/2 mt-1.5"></div>
            <div className="ml-20">
              <div className="flex items-baseline gap-4">
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {milestone.year}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {milestone.brand}
                </h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {milestone.description}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                {milestone.focus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SEO Footer Component
 * Includes brand transition information for SEO purposes
 */
export function SEOBrandFooter() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Leah Coach</strong> is the premium evolution of{' '}
          <span className="font-medium">Aphrodite Fitness</span> and{' '}
          <span className="font-medium">Strength PT</span>
        </p>
        <p>
          Elite performance consultancy for high-achieving professionals • Based in Dereham, Norfolk • Serving clients UK-wide
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <span>Previously: aphroditefitness.co.uk</span>
          <span>•</span>
          <span>Formerly: strengthpt.co.uk</span>
          <span>•</span>
          <span>Now: leah.coach</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hidden SEO Content Component
 * Provides additional context for search engines without affecting visual design
 * Uses proper semantic HTML that's visually hidden but accessible to crawlers
 */
export function HiddenSEOContent() {
  return (
    <div className="sr-only" aria-hidden="false">
      <h1>Leah Coach - Formerly Aphrodite Fitness - Previously Strength PT</h1>
      <p>
        Leah Coach represents the evolution of Aphrodite Fitness, Norfolk&apos;s premier fitness coaching service,
        which later became Strength PT. We&apos;ve transformed from personal training to elite performance consultancy,
        serving high-achieving professionals, executives, and parents across the UK.
      </p>
      <p>
        Our journey: Aphrodite Fitness (2015-2022) → Strength PT (2022-2024) → Leah Coach (2024-present).
        Same founder, Leah Fowler. Same commitment to excellence. Elevated service for ambitious professionals.
      </p>
      <p>
        Keywords: Leah Coach, Aphrodite Fitness, Strength PT, Leah Fowler, performance consultant,
        executive coaching, Norfolk coach, Dereham fitness, online coaching UK, formerly Aphrodite Fitness,
        previously Strength PT, high achiever coaching, professional performance optimisation.
      </p>
    </div>
  );
}