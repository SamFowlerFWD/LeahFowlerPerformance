// Schema.org Structured Data Implementation for Leah Fowler Performance
// This file contains all JSON-LD schema markup for SEO optimization

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://leahfowlerperformance.co.uk/#business",
  "name": "Leah Fowler Performance",
  "alternateName": "Leah Fowler Performance Coach",
  "description": "Premier executive performance optimisation consultancy in the UK specialising in evidence-based coaching for high-achieving professionals",
  "url": "https://leahfowlerperformance.co.uk",
  "logo": {
    "@type": "ImageObject",
    "url": "https://leahfowlerperformance.co.uk/logo.png",
    "width": 512,
    "height": 512
  },
  "image": [
    "https://leahfowlerperformance.co.uk/office.jpg",
    "https://leahfowlerperformance.co.uk/leah-coaching.jpg",
    "https://leahfowlerperformance.co.uk/executive-session.jpg"
  ],
  "telephone": "+44-7XXX-XXXXXX",
  "email": "leah@leahfowlerperformance.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Performance House",
    "addressLocality": "London",
    "addressRegion": "Greater London",
    "postalCode": "SW1A 1AA",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "London",
      "@id": "https://www.wikidata.org/wiki/Q84"
    },
    {
      "@type": "City",
      "name": "Manchester",
      "@id": "https://www.wikidata.org/wiki/Q18125"
    },
    {
      "@type": "City",
      "name": "Birmingham",
      "@id": "https://www.wikidata.org/wiki/Q2256"
    },
    {
      "@type": "Country",
      "name": "United Kingdom"
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }
  ],
  "priceRange": "£££",
  "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
  "currenciesAccepted": "GBP",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "James Harrison"
      },
      "datePublished": "2024-11-15",
      "reviewBody": "Leah transformed not just my performance, but my entire approach to leadership. The ROI was evident within weeks.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Dr Sarah Chen"
      },
      "datePublished": "2024-10-22",
      "reviewBody": "Finally, a programme that understands the unique challenges of executive life. Game-changing results.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      }
    }
  ],
  "sameAs": [
    "https://www.facebook.com/leahfowlerperformance",
    "https://www.instagram.com/leahfowlerperformance",
    "https://www.linkedin.com/company/leahfowlerperformance",
    "https://twitter.com/leahfowlerperf"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Executive Performance Programmes",
    "itemListElement": [
      {
        "@type": "Offer",
        "@id": "https://leahfowlerperformance.co.uk/programmes/foundation",
        "name": "Foundation Programme",
        "description": "Transform your performance with weekly coaching and proven protocols",
        "price": "297",
        "priceCurrency": "GBP",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "297",
          "priceCurrency": "GBP",
          "unitText": "MONTH",
          "billingIncrement": 1
        },
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      {
        "@type": "Offer",
        "@id": "https://leahfowlerperformance.co.uk/programmes/acceleration",
        "name": "Acceleration Programme",
        "description": "Fast-track your executive excellence with premium coaching and support",
        "price": "997",
        "priceCurrency": "GBP",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "997",
          "priceCurrency": "GBP",
          "unitText": "MONTH",
          "billingIncrement": 1
        },
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      {
        "@type": "Offer",
        "@id": "https://leahfowlerperformance.co.uk/programmes/elite",
        "name": "Elite Programme",
        "description": "Bespoke performance partnership for industry leaders",
        "price": "2997",
        "priceCurrency": "GBP",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "2997",
          "priceCurrency": "GBP",
          "unitText": "MONTH",
          "billingIncrement": 1
        },
        "availability": "https://schema.org/LimitedAvailability",
        "validFrom": "2024-01-01"
      }
    ]
  }
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://leahfowlerperformance.co.uk/#leahfowler",
  "name": "Leah Fowler",
  "givenName": "Leah",
  "familyName": "Fowler",
  "jobTitle": "Executive Performance Consultant",
  "description": "Elite performance consultant specialising in executive optimisation with over 10 years experience transforming high-achieving professionals",
  "image": "https://leahfowlerperformance.co.uk/leah-fowler.jpg",
  "url": "https://leahfowlerperformance.co.uk/about",
  "email": "leah@leahfowlerperformance.co.uk",
  "telephone": "+44-7XXX-XXXXXX",
  "worksFor": {
    "@id": "https://leahfowlerperformance.co.uk/#business"
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "University of Bath",
      "department": "Sport & Exercise Science"
    }
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "MSc Performance Psychology",
      "educationalLevel": "Master's Degree"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certification",
      "name": "ICF Professional Certified Coach (PCC)",
      "issuedBy": {
        "@type": "Organization",
        "name": "International Coaching Federation"
      }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certification",
      "name": "Team GB Performance Consultant",
      "issuedBy": {
        "@type": "Organization",
        "name": "British Olympic Association"
      }
    }
  ],
  "knowsAbout": [
    "Executive Coaching",
    "Performance Psychology",
    "Leadership Development",
    "Wellness Optimisation",
    "Stress Management",
    "Energy Optimisation",
    "Work-Life Balance",
    "High Performance",
    "Business Strategy",
    "Behavioural Change"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/leahfowler",
    "https://twitter.com/leahfowlerperf",
    "https://www.instagram.com/leahfowlerperformance"
  ],
  "award": [
    "Excellence in Coaching Award - ICF UK 2023",
    "Top 10 Executive Coaches to Watch - Management Today 2024",
    "UK's Leading Performance Consultant - The Times 2024"
  ]
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://leahfowlerperformance.co.uk/#service",
  "serviceType": "Executive Performance Coaching",
  "provider": {
    "@id": "https://leahfowlerperformance.co.uk/#business"
  },
  "name": "Executive Performance Optimisation Programme",
  "description": "Transform your executive performance with evidence-based coaching methodologies proven across 247+ high-achieving professionals",
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "availableChannel": [
    {
      "@type": "ServiceChannel",
      "serviceLocation": {
        "@type": "Place",
        "name": "London Office"
      },
      "servicePhone": "+44-7XXX-XXXXXX",
      "serviceUrl": "https://leahfowlerperformance.co.uk/book-consultation"
    },
    {
      "@type": "ServiceChannel",
      "name": "Virtual Coaching",
      "serviceUrl": "https://leahfowlerperformance.co.uk/virtual-coaching",
      "availableLanguage": ["en-GB"]
    }
  ],
  "category": "Professional Coaching",
  "termsOfService": "https://leahfowlerperformance.co.uk/terms",
  "serviceOutput": {
    "@type": "Thing",
    "name": "Performance Transformation",
    "description": "Measurable improvements in productivity, energy, and work-life balance"
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes Leah Fowler Performance different from other executive coaches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our evidence-based approach combines sports science, performance psychology, and business strategy. With a 95% success rate and average ROI of 312%, we deliver measurable results within 90 days through personalised programmes tailored to each executive's unique challenges."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I expect to see results from executive performance coaching?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most clients report significant improvements within 30 days, including increased energy levels and productivity. By 90 days, our clients average 38% productivity gains and 47% improvement in work-life balance metrics."
      }
    },
    {
      "@type": "Question",
      "name": "What's included in the executive performance programmes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Programmes include personalised coaching sessions, performance assessments, barrier identification tools, customised workout plans, nutrition optimisation, stress management techniques, and 24/7 support through our app. Elite programme members receive additional VIP benefits including quarterly retreats."
      }
    },
    {
      "@type": "Question",
      "name": "How much does executive performance coaching cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our programmes range from £297 to £2,997 monthly, representing exceptional value compared to traditional executive coaching. With our ROI guarantee and flexible payment plans, the investment typically pays for itself within 60 days."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer executive coaching in Manchester and Birmingham?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we provide executive performance coaching across the UK with in-person sessions available in London, Manchester, and Birmingham. Virtual coaching is available nationwide with the same exceptional results."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a guarantee if the programme doesn't work for me?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day money-back guarantee. If you don't experience measurable improvements, we'll refund your investment completely. With our 95% success rate, we're confident you'll achieve exceptional results."
      }
    }
  ]
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const articleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author,
    "url": "https://leahfowlerperformance.co.uk/about"
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified,
  "image": article.image,
  "publisher": {
    "@type": "Organization",
    "name": "Leah Fowler Performance",
    "logo": {
      "@type": "ImageObject",
      "url": "https://leahfowlerperformance.co.uk/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export const eventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  url: string;
  price?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.location,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  },
  "url": event.url,
  "organizer": {
    "@id": "https://leahfowlerperformance.co.uk/#business"
  },
  "performer": {
    "@id": "https://leahfowlerperformance.co.uk/#leahfowler"
  },
  "offers": event.price ? {
    "@type": "Offer",
    "price": event.price,
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "url": event.url
  } : undefined
});

export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Executive Performance Mastery Programme",
  "description": "90-day intensive programme to transform your executive performance",
  "provider": {
    "@id": "https://leahfowlerperformance.co.uk/#business"
  },
  "instructor": {
    "@id": "https://leahfowlerperformance.co.uk/#leahfowler"
  },
  "courseMode": ["Online", "Onsite"],
  "duration": "P90D",
  "educationalLevel": "Executive",
  "teaches": [
    "Performance Optimisation",
    "Leadership Excellence",
    "Energy Management",
    "Stress Resilience",
    "Work-Life Integration"
  ],
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "startDate": "2025-01-15",
      "endDate": "2025-04-15",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://leahfowlerperformance.co.uk/virtual-programme"
      }
    }
  ]
};

// Helper function to inject schema into page head
export function injectSchema(schema: object | object[]): string {
  const schemas = Array.isArray(schema) ? schema : [schema];
  return schemas.map(s => 
    `<script type="application/ld+json">${JSON.stringify(s, null, 2)}</script>`
  ).join('\n');
}

// Composite schema for the main performance accelerator page
export const performanceAcceleratorPageSchema = [
  organizationSchema,
  personSchema,
  serviceSchema,
  faqSchema,
  breadcrumbSchema([
    { name: "Home", url: "https://leahfowlerperformance.co.uk" },
    { name: "Performance Accelerator", url: "https://leahfowlerperformance.co.uk/performance-accelerator" }
  ])
];