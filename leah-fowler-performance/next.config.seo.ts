/**
 * SEO Configuration for Domain Migration
 * Primary domain: strengthpt.co.uk
 * Alternate domains: leah.coach, aphroditefitness.co.uk
 */

export const seoRedirects = [
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
        value: '<https://strengthpt.co.uk>; rel="canonical"',
      },
    ],
  },
];

/**
 * SEO Meta Tags for Brand
 */
export const brandTransitionMeta = {
  alternates: {
    canonical: 'https://strengthpt.co.uk',
    types: {
      'text/html': [
        { url: 'https://leah.coach', title: 'Also available at leah.coach' },
        { url: 'https://aphroditefitness.co.uk', title: 'Aphrodite Fitness' },
      ],
    },
  },

  openGraph: {
    siteName: 'Aphrodite Fitness with Leah Fowler',
    locale: 'en_GB',
    alternateLocale: 'en_US',
  },

  other: {
    'brand:name': 'Aphrodite Fitness',
    'brand:trainer': 'Leah Fowler',
  },
};

/**
 * Content for brand
 */
export const brandTransitionContent = {
  headerText: 'Aphrodite Fitness with Leah Fowler',
  subheaderText: 'Personal Training & Strength Coaching | Norfolk',

  aboutIntro: `Aphrodite Fitness delivers personal training and strength coaching for busy parents
    and professionals in Norfolk. Online and in-person training with expert guidance.`,

  seoFooterText: `Aphrodite Fitness with Leah Fowler - Personal training and strength coaching
    in Norfolk. Serving clients locally and nationwide with online and in-person training.`,

  faqAddition: {
    question: 'What is Aphrodite Fitness?',
    answer: `Aphrodite Fitness is a personal training and strength coaching service based in
      Norfolk, run by qualified coach Leah Fowler. We offer online and in-person training
      for busy parents and professionals who want to build strength and improve their fitness.`,
  },
};

/**
 * Structured data for brand
 */
export const brandTransitionSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'mainEntity': {
    '@type': 'Organization',
    'name': 'Aphrodite Fitness with Leah Fowler',
    'alternateName': ['Aphrodite Fitness', 'Strength PT'],
    'description': 'Personal training and strength coaching for busy parents and professionals in Norfolk',
    'foundingDate': '2009',
    'founder': {
      '@type': 'Person',
      'name': 'Leah Fowler',
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
