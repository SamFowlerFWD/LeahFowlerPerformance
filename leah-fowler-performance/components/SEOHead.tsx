import { Metadata } from 'next'
import { schemaOrganization, seoOptimizedContent } from '@/content/seo/premium-positioning-content'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  articleData?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  noindex?: boolean
  canonical?: string
}

export const generateSEOMetadata = ({
  title = "Leah Fowler Performance | Norfolk's Premier Performance Consultant",
  description = seoOptimizedContent.metaDescriptions.homepage,
  keywords = seoOptimizedContent.keywordTargets.primary,
  ogImage = "/images/leah-fowler-og.jpg",
  articleData,
  noindex = false,
  canonical
}: SEOHeadProps = {}): Metadata => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leahfowlerperformance.com'
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Leah Fowler', url: siteUrl }],
    creator: 'Leah Fowler',
    publisher: 'Leah Fowler Performance Consultancy',

    // Open Graph
    openGraph: {
      title,
      description,
      url: fullCanonical || siteUrl,
      siteName: 'Leah Fowler Performance',
      images: [
        {
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: 'Leah Fowler Performance Consultancy'
        }
      ],
      locale: 'en_GB',
      type: articleData ? 'article' : 'website',
      ...(articleData && {
        publishedTime: articleData.publishedTime,
        modifiedTime: articleData.modifiedTime,
        authors: articleData.author ? [articleData.author] : undefined,
        section: articleData.section,
        tags: articleData.tags
      })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}${ogImage}`],
      creator: '@leahfowlerperf',
      site: '@leahfowlerperf'
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical
    alternates: {
      canonical: fullCanonical
    },

    // Additional meta tags
    other: {
      'geo.region': 'GB-NFK',
      'geo.placename': 'Norwich',
      'geo.position': '52.6309;1.2974',
      'ICBM': '52.6309, 1.2974',
      'application-name': 'Leah Fowler Performance',
      'apple-mobile-web-app-title': 'LF Performance',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  }
}

// Page-specific metadata generators
export const pageMetadata = {
  home: (): Metadata => generateSEOMetadata({
    title: "Strength Coach for Mothers Norfolk | Leah Fowler Performance",
    description: seoOptimizedContent.metaDescriptions.homepage,
    keywords: [...seoOptimizedContent.keywordTargets.primary, ...seoOptimizedContent.keywordTargets.local],
    canonical: '/'
  }),

  about: (): Metadata => generateSEOMetadata({
    title: "About Leah Fowler | Evidence-Based Performance Consultant UK",
    description: "Meet Leah Fowler, Norfolk's leading strength coach for mums. MSc Exercise Psychology, mother of three, elite athlete. Smart strength training that fits real life.",
    keywords: [
      'Leah Fowler',
      'performance consultant Norwich',
      'strength coach for mothers Norfolk',
      'evidence-based coaching UK',
      'performance psychology consultant'
    ],
    canonical: '/about'
  }),

  programmes: (): Metadata => generateSEOMetadata({
    title: "Fitness Programmes for Mothers | Mother Transformation UK",
    description: "Evidence-based fitness programmes for mothers. From £497 assessment to £1,497/month partnerships. 94% success rate, 312% average transformation.",
    keywords: [
      'mother fitness programmes UK',
      'fitness consultancy services for mothers',
      'mother coaching programmes Norwich',
      'fitness transformation Norfolk',
      'mother fitness consultant'
    ],
    canonical: '/programmes'
  }),

  assessment: (): Metadata => generateSEOMetadata({
    title: "Free Mother Fitness Assessment | Discover Your Strength",
    description: seoOptimizedContent.metaDescriptions.diagnostic,
    keywords: [
      'mother fitness assessment',
      'free fitness analysis UK',
      'fitness diagnostic tool',
      'mother assessment Norwich',
      'fitness gap analysis'
    ],
    canonical: '/assessment'
  }),

  methodology: (): Metadata => generateSEOMetadata({
    title: "Our Methodology | Four-Pillar Performance Framework",
    description: seoOptimizedContent.metaDescriptions.methodology,
    keywords: [
      'performance methodology',
      'mother coaching framework',
      'evidence-based performance UK',
      'cognitive optimisation methods',
      'performance science consultant'
    ],
    canonical: '/methodology'
  }),

  blog: (article?: {
    title: string,
    description: string,
    publishedTime: string,
    modifiedTime?: string,
    tags: string[]
  }): Metadata => {
    if (article) {
      return generateSEOMetadata({
        title: `${article.title} | Leah Fowler Performance Blog`,
        description: article.description,
        keywords: article.tags,
        articleData: {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          author: 'Leah Fowler',
          section: 'Performance Optimisation',
          tags: article.tags
        },
        canonical: `/blog/${article.title.toLowerCase().replace(/ /g, '-')}`
      })
    }

    return generateSEOMetadata({
      title: "Fitness Insights Blog | Mother Fitness Articles",
      description: "Evidence-based insights on mother fitness, strength training, and sustainable wellness. From Norfolk's leading fitness consultant for mothers.",
      keywords: [
        'mother fitness blog',
        'performance optimisation articles',
        'cognitive performance insights',
        'leadership development blog UK',
        'performance consultant blog Norwich'
      ],
      canonical: '/blog'
    })
  },

  contact: (): Metadata => generateSEOMetadata({
    title: "Contact Leah Fowler | Book Fitness Consultation Norwich",
    description: "Contact Norfolk's premier fitness consultant for mothers. Book your mother fitness assessment. Virtual and in-person consultations available.",
    keywords: [
      'contact performance consultant',
      'book mother coaching Norwich',
      'fitness consultation Norfolk',
      'mother coach contact UK',
      'schedule performance assessment'
    ],
    canonical: '/contact'
  }),

  successStories: (): Metadata => generateSEOMetadata({
    title: "Client Success Stories | Mother Transformations",
    description: "Real transformations from real mothers. See how our evidence-based approach delivered amazing results and 94% success rate.",
    keywords: [
      'mother coaching success stories',
      'fitness transformation results',
      'mother testimonials Norwich',
      'mother coaching case studies UK',
      'performance consultant reviews'
    ],
    canonical: '/success-stories'
  })
}

// Structured data for specific pages
export const structuredData = {
  service: (name: string, description: string, price: string) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Performance Consultancy",
    "provider": schemaOrganization,
    "name": name,
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "GBP"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  }),

  person: () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Leah Fowler",
    "jobTitle": "Performance Consultant",
    "worksFor": schemaOrganization,
    "alumniOf": "Loughborough University",
    "knowsAbout": [
      "Performance Psychology",
      "Mother Fitness Coaching",
      "Cognitive Optimisation",
      "Behavioural Change",
      "Exercise Science"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/leahfowler",
      "https://twitter.com/leahfowlerperf",
      "https://www.instagram.com/leahfowlerperformance"
    ]
  }),

  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://leahfowlerperformance.com${item.url}`
    }))
  })
}