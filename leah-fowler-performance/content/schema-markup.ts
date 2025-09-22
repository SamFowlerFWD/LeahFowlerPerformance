/**
 * Schema.org structured data for SEO optimization
 * All schemas follow JSON-LD format for Google Rich Results
 */

// Organization Schema - Main brand entity
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://leahfowlerperformance.com/#organization",
  "name": "Leah Fowler Performance",
  "alternateName": "LFP",
  "url": "https://leahfowlerperformance.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://leahfowlerperformance.com/logo.png",
    "width": 600,
    "height": 60
  },
  "image": "https://leahfowlerperformance.com/og-image.jpg",
  "description": "Elite performance consultancy for high-achieving professionals and executives. Transform your energy, decisions, and leadership impact.",
  "email": "hello@leahfowlerperformance.com",
  "telephone": "+44-20-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "London",
    "addressRegion": "England",
    "addressCountry": "GB"
  },
  "founder": {
    "@type": "Person",
    "name": "Leah Fowler",
    "jobTitle": "Elite Performance Consultant",
    "image": "https://leahfowlerperformance.com/leah-fowler.jpg"
  },
  "sameAs": [
    "https://www.linkedin.com/in/leahfowlerperformance",
    "https://www.instagram.com/leahfowlerperformance",
    "https://twitter.com/leahfowlerperf"
  ],
  "knowsAbout": [
    "Executive Performance Optimization",
    "Leadership Development",
    "Energy Management",
    "Peak Performance",
    "Executive Coaching",
    "Performance Psychology"
  ]
}

// Person Schema - Leah Fowler
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://leahfowlerperformance.com/#leahfowler",
  "name": "Leah Fowler",
  "jobTitle": "Elite Performance Consultant",
  "description": "Elite performance consultant specialising in executive transformation. Former athlete and mother who helps high-achieving professionals operate at their true capacity.",
  "url": "https://leahfowlerperformance.com/about",
  "image": "https://leahfowlerperformance.com/leah-fowler.jpg",
  "email": "leah@leahfowlerperformance.com",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "University Name"
  },
  "worksFor": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "knowsAbout": [
    "Executive Performance",
    "Leadership Coaching",
    "Performance Psychology",
    "Energy Management",
    "Stress Management",
    "Decision Optimization"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/leahfowler",
    "https://www.instagram.com/leahfowlerperformance"
  ]
}

// Service Schema - Main consulting service
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://leahfowlerperformance.com/#service",
  "name": "Elite Performance Accelerator",
  "description": "Comprehensive performance transformation programme for executives and high-achieving professionals. 90-day intensive with guaranteed ROI.",
  "provider": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "serviceType": "Executive Performance Consulting",
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Performance Transformation Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Elite Performance Accelerator",
          "description": "90-day executive transformation programme"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Performance Strategy Session",
          "description": "45-minute performance audit and strategy consultation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Executive Energy Audit",
          "description": "Comprehensive energy and performance assessment"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5"
  }
}

// WebSite Schema with SearchAction
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://leahfowlerperformance.com/#website",
  "url": "https://leahfowlerperformance.com",
  "name": "Leah Fowler Performance",
  "description": "Elite performance consultancy for executives and high-achieving professionals",
  "publisher": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://leahfowlerperformance.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-GB"
}

// Landing Page Schema - Executive Performance Protocol
export const leadMagnetPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Executive Performance Protocol - Free 7-Day Transformation Guide",
  "description": "Transform your executive performance with this proven 7-day protocol. Increase energy by 40%, improve decisions by 35%, achieve sustainable excellence.",
  "url": "https://leahfowlerperformance.com/executive-performance-protocol",
  "inLanguage": "en-GB",
  "isPartOf": {
    "@id": "https://leahfowlerperformance.com/#website"
  },
  "author": {
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString(),
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://leahfowlerperformance.com/images/executive-guide-hero.jpg"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://leahfowlerperformance.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resources",
        "item": "https://leahfowlerperformance.com/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Executive Performance Protocol",
        "item": "https://leahfowlerperformance.com/executive-performance-protocol"
      }
    ]
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "name": "Executive Performance Protocol Guide",
    "description": "7-Day transformation guide for executive performance",
    "seller": {
      "@id": "https://leahfowlerperformance.com/#organization"
    }
  }
}

// Product Schema - Lead Magnet
export const leadMagnetProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Executive Performance Protocol",
  "description": "A comprehensive 7-day transformation guide for executives and high-achieving professionals. Includes daily protocols, exercises, and strategies for sustainable peak performance.",
  "image": "https://leahfowlerperformance.com/images/protocol-cover.jpg",
  "brand": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://leahfowlerperformance.com/executive-performance-protocol",
    "priceCurrency": "GBP",
    "price": "0",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@id": "https://leahfowlerperformance.com/#organization"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "523",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sarah Mitchell"
      },
      "reviewBody": "This protocol transformed how I approach my work day. The energy management strategies alone were worth their weight in gold.",
      "datePublished": "2024-11-15"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "David Chen"
      },
      "reviewBody": "Practical, actionable, and based on real science. Implemented the protocols and saw immediate improvements in my decision-making and energy levels.",
      "datePublished": "2024-10-22"
    }
  ]
}

// FAQ Schema for common questions
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How is executive performance consulting different from coaching?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Performance consulting provides proven protocols and measurable systems, not just questions and support. We focus on data-driven strategies with guaranteed ROI, implementing specific frameworks that transform how executives operate."
      }
    },
    {
      "@type": "Question",
      "name": "How much time does the Executive Performance Protocol require?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The daily protocols take 15-30 minutes to implement. However, they save 2-3 hours daily through improved energy management and focus. Most executives report a net gain of 10-15 hours weekly."
      }
    },
    {
      "@type": "Question",
      "name": "What results can I expect from performance consulting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Typical results include 40% increase in sustained energy, 35% improvement in decision quality, 10-15 hours recovered weekly, and 47% average increase in team performance. ROI averages 23:1 within 6 months."
      }
    },
    {
      "@type": "Question",
      "name": "Who is Leah Fowler Performance best suited for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our services are designed for CEOs, senior executives, entrepreneurs, and high-achieving professionals who are already successful but know they're capable of more. We work with those ready to invest in sustainable transformation, not quick fixes."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Leah Fowler's approach unique?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Leah combines performance psychology with real-world experience as a mother who understands life's actual demands. Her consultancy model delivers proven protocols with measurable ROI, not just coaching conversations."
      }
    }
  ]
}

// Course Schema for the Performance Accelerator
export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Elite Performance Accelerator",
  "description": "90-day intensive performance transformation programme for executives and high-achieving professionals.",
  "provider": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "educationalCredentialAwarded": "Certificate of Completion",
  "timeRequired": "P90D",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "https://schema.org/OnlineOnly",
    "duration": "P90D",
    "instructor": {
      "@id": "https://leahfowlerperformance.com/#leahfowler"
    }
  },
  "offers": {
    "@type": "Offer",
    "category": "Professional Development",
    "url": "https://leahfowlerperformance.com/performance-accelerator",
    "availability": "https://schema.org/LimitedAvailability"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "89",
    "bestRating": "5"
  }
}

// HowTo Schema for the 7-Day Protocol
export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Transform Your Executive Performance in 7 Days",
  "description": "A step-by-step guide to implementing the Executive Performance Protocol for sustainable peak performance.",
  "image": "https://leahfowlerperformance.com/images/protocol-guide.jpg",
  "totalTime": "P7D",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "GBP",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Executive Performance Protocol Guide"
    },
    {
      "@type": "HowToSupply",
      "name": "Daily commitment of 15-30 minutes"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Complete Energy Audit",
      "text": "Map your energy patterns and establish performance baseline",
      "url": "https://leahfowlerperformance.com/protocol#day1"
    },
    {
      "@type": "HowToStep",
      "name": "Implement Cognitive Protocols",
      "text": "Optimize your cognitive operating system with focus blocks",
      "url": "https://leahfowlerperformance.com/protocol#day2"
    },
    {
      "@type": "HowToStep",
      "name": "Design Energy Management System",
      "text": "Create sustainable high-performance system",
      "url": "https://leahfowlerperformance.com/protocol#day3"
    },
    {
      "@type": "HowToStep",
      "name": "Master Stress-to-Success Protocol",
      "text": "Transform pressure into performance",
      "url": "https://leahfowlerperformance.com/protocol#day4"
    },
    {
      "@type": "HowToStep",
      "name": "Amplify Leadership Presence",
      "text": "Maximize your professional impact",
      "url": "https://leahfowlerperformance.com/protocol#day5"
    },
    {
      "@type": "HowToStep",
      "name": "Optimize Decision Systems",
      "text": "Enhance strategic thinking and decision quality",
      "url": "https://leahfowlerperformance.com/protocol#day6"
    },
    {
      "@type": "HowToStep",
      "name": "Integrate and Accelerate",
      "text": "Lock in transformation with sustainable protocols",
      "url": "https://leahfowlerperformance.com/protocol#day7"
    }
  ]
}

// Local Business Schema (if applicable)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Leah Fowler Performance",
  "image": "https://leahfowlerperformance.com/storefront.jpg",
  "@id": "https://leahfowlerperformance.com/#localbusiness",
  "url": "https://leahfowlerperformance.com",
  "telephone": "+44-20-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Performance Street",
    "addressLocality": "London",
    "addressRegion": "England",
    "postalCode": "SW1A 1AA",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "priceRange": "£££"
}

// Article Schema for blog posts
export const createArticleSchema = (article: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  wordCount: number
  keywords: string[]
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  },
  "publisher": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "wordCount": article.wordCount,
  "keywords": article.keywords.join(", "),
  "articleSection": "Performance Optimization",
  "inLanguage": "en-GB"
})

// Event Schema for webinars/workshops
export const createEventSchema = (event: {
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  url: string
  price?: number
  currency?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": event.location === "online" ? "VirtualLocation" : "Place",
    "url": event.location === "online" ? event.url : undefined,
    "name": event.location === "online" ? "Online" : event.location
  },
  "organizer": {
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "performer": {
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  },
  "offers": event.price ? {
    "@type": "Offer",
    "url": event.url,
    "price": event.price,
    "priceCurrency": event.currency || "GBP",
    "availability": "https://schema.org/InStock"
  } : undefined,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": event.location === "online"
    ? "https://schema.org/OnlineEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode"
})

// Video Schema for any video content
export const createVideoSchema = (video: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration: string
  contentUrl: string
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": video.name,
  "description": video.description,
  "thumbnailUrl": video.thumbnailUrl,
  "uploadDate": video.uploadDate,
  "duration": video.duration,
  "contentUrl": video.contentUrl,
  "publisher": {
    "@id": "https://leahfowlerperformance.com/#organization"
  }
})

// Helper function to generate complete schema for a page
export function generatePageSchema(pageType: string, additionalData?: any) {
  const schemas = []

  // Always include organization and website
  schemas.push(organizationSchema)
  schemas.push(websiteSchema)

  // Add page-specific schemas
  switch (pageType) {
    case 'home':
      schemas.push(serviceSchema)
      schemas.push(faqSchema)
      break
    case 'lead-magnet':
      schemas.push(leadMagnetPageSchema)
      schemas.push(leadMagnetProductSchema)
      schemas.push(howToSchema)
      break
    case 'about':
      schemas.push(personSchema)
      break
    case 'service':
      schemas.push(serviceSchema)
      schemas.push(courseSchema)
      break
    case 'article':
      if (additionalData) {
        schemas.push(createArticleSchema(additionalData))
      }
      break
    case 'event':
      if (additionalData) {
        schemas.push(createEventSchema(additionalData))
      }
      break
  }

  return schemas
}

// Export function to inject schema into page head
export function injectSchema(schemas: unknown[]): string {
  return schemas.map(schema =>
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  ).join('\n')
}