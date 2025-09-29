/**
 * SEO Configuration for Domain Migration
 * Handles redirects from Aphrodite Fitness and Strength PT to Leah Coach
 * Preserves SEO equity during brand transition
 */

export const seoRedirects = [
  // Core domain redirects - 301 permanent redirects
  {
    source: '/:path*',
    has: [
      {
        type: 'host',
        value: 'strengthpt.co.uk',
      },
    ],
    destination: 'https://leah.coach/:path*',
    permanent: true,
  },
  {
    source: '/:path*',
    has: [
      {
        type: 'host',
        value: 'www.strengthpt.co.uk',
      },
    ],
    destination: 'https://leah.coach/:path*',
    permanent: true,
  },
  {
    source: '/:path*',
    has: [
      {
        type: 'host',
        value: 'aphroditefitness.co.uk',
      },
    ],
    destination: 'https://leah.coach/:path*',
    permanent: true,
  },
  {
    source: '/:path*',
    has: [
      {
        type: 'host',
        value: 'www.aphroditefitness.co.uk',
      },
    ],
    destination: 'https://leah.coach/:path*',
    permanent: true,
  },

  // Legacy URL structure redirects
  {
    source: '/personal-training',
    destination: '/services',
    permanent: true,
  },
  {
    source: '/fitness-coaching',
    destination: '/performance-accelerator',
    permanent: true,
  },
  {
    source: '/aphrodite-fitness',
    destination: '/about',
    permanent: true,
  },
  {
    source: '/strength-pt',
    destination: '/about',
    permanent: true,
  },
  {
    source: '/online-pt',
    destination: '/programmes',
    permanent: true,
  },
  {
    source: '/personal-trainer-norfolk',
    destination: '/services',
    permanent: true,
  },
  {
    source: '/fitness-trainer-dereham',
    destination: '/services',
    permanent: true,
  },
];

export const seoHeaders = [
  {
    source: '/:path*',
    headers: [
      {
        key: 'X-Robots-Tag',
        value: 'index, follow',
      },
      {
        key: 'Link',
        value: '<https://leah.coach>; rel="canonical"',
      },
    ],
  },
];

/**
 * SEO Meta Tags for Brand Transition
 * To be injected into page headers
 */
export const brandTransitionMeta = {
  // For pages that need to reference the old brands
  alternates: {
    canonical: 'https://leah.coach',
    types: {
      'text/html': [
        { url: 'https://strengthpt.co.uk', title: 'Previously Strength PT' },
        { url: 'https://aphroditefitness.co.uk', title: 'Formerly Aphrodite Fitness' },
      ],
    },
  },

  // Open Graph tags for brand recognition
  openGraph: {
    siteName: 'Leah Coach (formerly Aphrodite Fitness)',
    locale: 'en_GB',
    alternateLocale: 'en_US',
  },

  // Additional meta tags
  other: {
    'brand:previous': 'Aphrodite Fitness, Strength PT',
    'brand:current': 'Leah Coach',
    'brand:evolution': 'Aphrodite Fitness → Strength PT → Leah Coach',
  },
};

/**
 * Content updates for brand transition
 * Key phrases to include in content for SEO continuity
 */
export const brandTransitionContent = {
  headerText: 'Leah Coach - Elite Performance Consultancy',
  subheaderText: 'Formerly Aphrodite Fitness | Previously Strength PT',

  aboutIntro: `Leah Coach represents the evolution of what began as Aphrodite Fitness -
    a journey from fitness training to elite performance consultancy. What started as
    personal training in Norfolk has transformed into a premium performance optimisation
    service for high-achieving professionals across the UK.`,

  seoFooterText: `Leah Coach is the premium evolution of Aphrodite Fitness and Strength PT,
    now serving high-achieving professionals with elite performance consultancy.
    Based in Dereham, Norfolk, serving clients nationwide.`,

  faqAddition: {
    question: 'Is Leah Coach the same as Aphrodite Fitness?',
    answer: `Yes! Leah Coach is the natural evolution of Aphrodite Fitness. We've grown from
      a fitness training service into an elite performance consultancy. While our name has
      changed to reflect our expanded scope, our commitment to transforming lives through
      evidence-based coaching remains unchanged. All the expertise that made Aphrodite Fitness
      successful is now elevated to serve high-achieving professionals seeking total life
      optimisation.`,
  },
};

/**
 * Structured data additions for brand transition
 */
export const brandTransitionSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'mainEntity': {
    '@type': 'Organization',
    'name': 'Leah Coach',
    'alternateName': ['Aphrodite Fitness', 'Strength PT'],
    'description': 'Elite performance consultancy evolved from Aphrodite Fitness',
    'foundingDate': '2015',
    'founder': {
      '@type': 'Person',
      'name': 'Leah Fowler',
    },
    'parentOrganization': {
      '@type': 'Organization',
      'name': 'Aphrodite Fitness',
      'dissolutionDate': '2024',
      'successorOrganization': {
        '@type': 'Organization',
        'name': 'Leah Coach',
      },
    },
  },
};

export default {
  seoRedirects,
  seoHeaders,
  brandTransitionMeta,
  brandTransitionContent,
  brandTransitionSchema,
};