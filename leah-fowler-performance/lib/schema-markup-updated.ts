/**
 * Comprehensive Schema.org structured data for Strength PT
 * Aphrodite Fitness with Leah Fowler
 * Personal training and strength coaching in Norfolk
 * Optimised for local SEO and brand recognition
 */

// Brand Evolution Schema - Shows the progression
export const brandEvolutionSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "@id": "https://strengthpt.co.uk/#brand-evolution",
  "name": "Aphrodite Fitness with Leah Fowler",
  "description": "Personal training and strength coaching for parents and professionals in Norfolk",
  "foundingDate": "2009",
  "foundingLocation": {
    "@type": "Place",
    "name": "Norfolk, UK"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Aphrodite Fitness",
    "description": "Original fitness coaching brand founded by Leah Fowler"
  },
  "sameAs": [
    "https://aphroditefitness.co.uk",
    "https://leah.coach"
  ]
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://strengthpt.co.uk/#organization",
  "name": "Aphrodite Fitness with Leah Fowler",
  "alternateName": ["Aphrodite Fitness", "Strength PT"],
  "legalName": "Aphrodite Fitness",
  "url": "https://strengthpt.co.uk",
  "logo": {
    "@type": "ImageObject",
    "url": "https://strengthpt.co.uk/images/af-full-logo.avif",
    "width": 360,
    "height": 96,
    "caption": "Aphrodite Fitness with Leah Fowler - Personal Training & Strength Coaching Norfolk",
    "name": "Aphrodite Fitness Logo"
  },
  "image": "https://strengthpt.co.uk/og-image.jpg",
  "description": "Aphrodite Fitness with Leah Fowler delivers personal training and strength coaching for busy parents and professionals in Norfolk. Online and in-person training from £100/month. Mother of 3, 15 years experience.",
  "email": "leah@aphroditefitness.co.uk",
  "telephone": "+447990600958",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Business Centre",
    "addressLocality": "Dereham",
    "addressRegion": "Norfolk",
    "postalCode": "NR19",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 52.6852,
    "longitude": 0.9392
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Dereham"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Norfolk"
    },
    {
      "@type": "Country",
      "name": "United Kingdom"
    }
  ],
  "priceRange": "£12-£250/month",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "06:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "07:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/leah-fowler-performance",
    "https://www.instagram.com/leahfowlerperformance",
    "https://www.facebook.com/leahfowlerperformance",
    "https://strengthpt.co.uk",
    "https://aphroditefitness.co.uk"
  ],
  "founder": {
    "@type": "Person",
    "@id": "https://leah.coach/#leahfowler"
  },
  "brand": {
    "@type": "Brand",
    "name": "Leah Coach",
    "alternateName": ["Aphrodite Fitness", "Strength PT"],
    "slogan": "From Aphrodite Fitness to Elite Performance",
    "description": "Premium performance consultancy evolved from Aphrodite Fitness"
  },
  "knowsAbout": [
    "Performance Optimisation",
    "Executive Coaching",
    "Professional Development",
    "Life Performance",
    "Formerly Aphrodite Fitness",
    "Previously Strength PT",
    "High Achiever Coaching"
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://leah.coach/#localbusiness",
  "name": "Leah Coach - Performance Consultancy (formerly Aphrodite Fitness)",
  "description": "Elite performance consultancy for high-achieving professionals. Evolved from Aphrodite Fitness to premium life optimisation. Evidence-based coaching from £48/month. 500+ executives transformed.",
  "url": "https://leah.coach",
  "alternateName": ["Aphrodite Fitness", "Strength PT", "Leah Fowler Performance"],
  "telephone": "+447990600958",
  "priceRange": "£12-£250/month",
  "image": [
    "https://leah.coach/og-image.jpg",
    "https://leah.coach/consultancy-space.jpg",
    "https://leah.coach/performance-assessment.jpg"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Business Centre",
    "addressLocality": "Dereham",
    "addressRegion": "Norfolk",
    "postalCode": "NR19",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 52.6852,
    "longitude": 0.9392
  },
  "hasMap": "https://maps.google.com/?q=Dereham,Norfolk,UK",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "06:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "07:00",
      "closes": "17:00"
    }
  ],
  "areaServed": [
    {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 52.6852,
        "longitude": 0.9392
      },
      "geoRadius": "50 miles"
    }
  ],
  "serviceType": [
    "Executive Performance Coaching",
    "Professional Life Optimisation",
    "High Achiever Development",
    "Parent Performance Consultancy",
    "Leadership Wellness",
    "Formerly Aphrodite Fitness Services",
    "Premium Performance Transformation"
  ],
  "knowsAbout": [
    "Executive Performance Optimisation",
    "Professional Development",
    "High Achiever Coaching",
    "Life Performance Enhancement",
    "Parent Executive Balance",
    "Aphrodite Fitness Legacy",
    "Strength PT Evolution",
    "Sustainable High Performance",
    "Leadership Wellness",
    "Premium Life Coaching"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://leah.coach/#leahfowler",
  "name": "Leah Fowler",
  "givenName": "Leah",
  "familyName": "Fowler",
  "jobTitle": "Elite Performance Consultant",
  "alternateName": ["Leah Coach", "Aphrodite Fitness Founder", "Strength PT Founder"],
  "description": "Elite performance consultant and founder of Leah Coach (formerly Aphrodite Fitness). Mother of 3, Spartan Ultra finisher, transforming high achievers. From fitness coach to performance consultancy. 500+ executives optimised.",
  "url": "https://leah.coach/about",
  "image": [
    "https://leah.coach/images/leah/leah-fowler-consultant.webp",
    "https://leah.coach/images/leah/leah-fowler-300x300.webp"
  ],
  "email": "leah@leah.coach",
  "telephone": "+447990600958",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dereham",
    "addressRegion": "Norfolk",
    "addressCountry": "GB"
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "UK Coaching",
      "url": "https://www.ukcoaching.org/"
    }
  ],
  "worksFor": {
    "@type": "Organization",
    "@id": "https://leah.coach/#organization"
  },
  "affiliation": [
    {
      "@type": "Organization",
      "name": "Aphrodite Fitness",
      "description": "Previous fitness brand, now evolved to Leah Coach"
    },
    {
      "@type": "Organization",
      "name": "Strength PT",
      "description": "Previous training brand, now part of Leah Coach"
    }
  ],
  "gender": "Female",
  "nationality": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "knowsAbout": [
    "Performance Optimisation",
    "Strength & Conditioning",
    "Executive Performance Coaching",
    "Behavioural Psychology",
    "Athletic Performance",
    "Obstacle Race Training",
    "Triathlon Training",
    "Aphrodite Fitness Methodology",
    "High Achiever Psychology",
    "Family-Work Integration"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Certified Performance Coach",
      "credentialCategory": "Professional Certification"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Strength & Conditioning Specialist",
      "credentialCategory": "Professional Qualification"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Executive Wellness Specialist",
      "credentialCategory": "Professional Qualification"
    }
  ],
  "award": [
    "Spartan Ultra Finisher",
    "Triathlon Competitor",
    "500+ Successful Client Transformations",
    "Aphrodite Fitness Founder"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/leahfowlerperformance",
    "https://www.instagram.com/leahfowlerperformance",
    "https://www.facebook.com/leahfowlerperformance"
  ]
};

export const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leah.coach/#pathway-programme",
    "serviceType": "Pathway to Performance",
    "name": "Pathway Programme - Foundation Performance Optimisation",
    "description": "Foundation performance programme for professionals beginning their optimisation journey. Evidence-based protocols evolved from Aphrodite Fitness methodology. Self-paced with expert guidance and elite community support.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leah.coach/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Foundation Programme Features",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Monthly Performance Review",
            "description": "30-minute strategy session with performance consultant"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Performance Assessment",
            "description": "Comprehensive baseline assessment of current performance metrics"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Resource Library",
            "description": "Access to performance optimisation guides and tools"
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "12",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "12",
        "priceCurrency": "GBP",
        "unitText": "MONTH"
      }
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://leah.coach/programmes/pathway",
      "serviceType": "Online consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leah.coach/#silver-programme",
    "serviceType": "Silver Programme",
    "name": "Silver - Weekly Elite Performance Consultancy",
    "description": "Premium performance consultancy with comprehensive support. Weekly 1:1 sessions, personalised optimisation protocols, and access to our elite community. For professionals ready for serious transformation.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leah.coach/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Silver Programme Features",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Weekly Executive Coaching",
            "description": "60-minute weekly sessions with senior performance consultant"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Biometric Performance Tracking",
            "description": "Advanced wearable integration and data analysis"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Quarterly Performance Reviews",
            "description": "In-depth quarterly assessments and strategy adjustments"
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "140",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "140",
        "priceCurrency": "GBP",
        "unitText": "MONTH"
      }
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://leah.coach/programmes/silver",
      "serviceType": "Hybrid consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leah.coach/#gold-programme",
    "serviceType": "Gold Programme",
    "name": "Gold - Premium Executive Performance Programme",
    "description": "Premium 2x weekly consultancy for accelerated results. Perfect for executives serious about transformation. Includes advanced protocols evolved from Aphrodite Fitness elite methodology.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leah.coach/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Gold Programme Features",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Unlimited Consultancy Access",
            "description": "24/7 access to performance consultant via dedicated channels"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Executive Health Optimisation",
            "description": "Comprehensive health screening and optimisation protocols"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Leadership Performance Enhancement",
            "description": "Advanced cognitive and leadership performance strategies"
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "250",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "250",
        "priceCurrency": "GBP",
        "unitText": "MONTH"
      }
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://leah.coach/programmes/gold",
      "serviceType": "Premium consultancy",
      "availableLanguage": ["en-GB"]
    }
  }
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://leah.coach/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes Leah Coach different from traditional personal training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Leah Coach is an elite performance consultancy evolved from Aphrodite Fitness. We're not fitness trainers - we're performance consultants for high achievers. This is about optimising every aspect of your life performance, from executive wellness to family balance. We bring the same evidence-based approach that built Aphrodite Fitness, now elevated for professionals who demand excellence."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Leah Coach based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Leah Coach (formerly Aphrodite Fitness) is based in Dereham, Norfolk, serving high-achieving professionals throughout the UK. We offer premium consultancy both in-person and through our elite online programmes. Our roots are in Norfolk, but our reach is nationwide."
      }
    },
    {
      "@type": "Question",
      "name": "What is Leah's background and how did Aphrodite Fitness evolve into Leah Coach?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I founded Aphrodite Fitness as a fitness coaching service, which evolved into Strength PT, and has now transformed into Leah Coach - a premium performance consultancy. This evolution reflects my journey from fitness trainer to performance consultant, serving increasingly ambitious professionals. My qualifications span performance coaching, executive wellness, and behavioural psychology, combined with real-world experience transforming 500+ high achievers."
      }
    },
    {
      "@type": "Question",
      "name": "What investment levels are available for performance programmes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Leah Coach offers six performance tiers: Pathway Programme (£12/month) foundation online consultancy, Flexi Coaching (£80/month) app-based programme, Semi-Private (£90/month per person) partner consultancy, Small Group (£120 for 3 months) group optimisation, Silver (£140/month) weekly 1:1 consultancy - our most popular, and Gold (£250/month) premium 2x weekly executive programme."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I expect to see results with Leah Coach?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "High performers see measurable improvements within 2-3 weeks. Performance metrics improve consistently from week 4, with significant transformation by week 12. Our approach, evolved from Aphrodite Fitness's proven methodology, ensures rapid yet sustainable results for committed professionals."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with clients outside of Norfolk?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Leah Coach works with high-achieving professionals throughout the UK via our elite online consultancy platform. Our digital programmes deliver the same transformative results that made Aphrodite Fitness successful, now elevated for executive performance."
      }
    },
    {
      "@type": "Question",
      "name": "Can I switch between programme tiers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We recommend starting with the tier that matches your current needs and commitment level. You can upgrade or adjust your programme monthly based on your evolving requirements and goals."
      }
    },
    {
      "@type": "Question",
      "name": "What's included in the initial performance assessment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our comprehensive assessment evaluates multiple performance dimensions including energy management, stress resilience, cognitive function, movement quality, and lifestyle factors. You'll receive a detailed report with personalised recommendations and benchmarks."
      }
    }
  ]
};

export const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "@id": "https://leah.coach/#rating",
  "itemReviewed": {
    "@type": "ProfessionalService",
    "@id": "https://leah.coach/#localbusiness"
  },
  "ratingValue": "4.9",
  "bestRating": "5",
  "worstRating": "1",
  "ratingCount": "47",
  "reviewCount": "43"
};

export const courseSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": "https://leah.coach/#executive-wellness-course",
    "name": "Executive Wellness Mastery",
    "description": "Comprehensive 12-week programme designed for senior professionals to optimise physical and cognitive performance whilst managing executive responsibilities. Evolved from Aphrodite Fitness elite protocols.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leah.coach/#organization"
    },
    "educationalCredentialAwarded": "Certificate of Completion",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "blended",
      "duration": "P12W",
      "inLanguage": "en-GB",
      "courseWorkload": "P3H",
      "instructor": {
        "@type": "Person",
        "@id": "https://leah.coach/#leahfowler"
      }
    },
    "coursePrerequisites": "Senior professional or executive role",
    "numberOfCredits": "12",
    "occupationalCredentialAwarded": "Executive Wellness Practitioner",
    "teaches": [
      "Stress physiology and management",
      "Energy optimisation strategies",
      "Cognitive performance enhancement",
      "Sleep architecture optimisation",
      "Executive nutrition protocols",
      "Movement integration for busy professionals"
    ],
    "offers": {
      "@type": "Offer",
      "price": "120",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": "https://leah.coach/#performance-foundation-course",
    "name": "Performance Foundation Programme",
    "description": "8-week foundational programme introducing evidence-based performance optimisation strategies for professionals ready to transform their capabilities.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leah.coach/#organization"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "duration": "P8W",
      "inLanguage": "en-GB",
      "courseWorkload": "P2H"
    },
    "teaches": [
      "Performance assessment and benchmarking",
      "Habit formation psychology",
      "Basic nutrition principles",
      "Movement fundamentals",
      "Sleep hygiene",
      "Stress management basics"
    ],
    "offers": {
      "@type": "Offer",
      "price": "80",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    }
  }
];

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://leah.coach/#performance-optimisation-howto",
  "name": "How to Optimise Your Executive Performance with Leah Coach",
  "description": "Evidence-based approach to enhancing professional performance through integrated lifestyle optimisation. Methodology evolved from Aphrodite Fitness success stories.",
  "image": "https://leah.coach/performance-optimisation-guide.jpg",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "GBP",
    "value": "12-250"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Performance tracking device (smartwatch/wearable)"
    },
    {
      "@type": "HowToSupply",
      "name": "Sleep tracking capability"
    },
    {
      "@type": "HowToSupply",
      "name": "Nutrition tracking app"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Leah Coach Performance app"
    },
    {
      "@type": "HowToTool",
      "name": "Performance assessment toolkit"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Complete Performance Assessment",
      "text": "Begin with our comprehensive performance assessment to establish baseline metrics across physical, cognitive, and lifestyle dimensions.",
      "url": "https://leah.coach/assessment",
      "image": "https://leah.coach/assessment-step.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Identify Performance Gaps",
      "text": "Analyse assessment results to identify key areas for improvement and prioritise based on impact potential and feasibility.",
      "url": "https://leah.coach/analysis"
    },
    {
      "@type": "HowToStep",
      "name": "Design Personalised Protocol",
      "text": "Create a customised performance protocol addressing sleep, nutrition, movement, and stress management tailored to your schedule.",
      "url": "https://leah.coach/protocol"
    },
    {
      "@type": "HowToStep",
      "name": "Implement Daily Practices",
      "text": "Begin implementing daily performance practices, starting with keystone habits that create cascading positive effects.",
      "url": "https://leah.coach/implementation"
    },
    {
      "@type": "HowToStep",
      "name": "Track and Measure Progress",
      "text": "Use wearable technology and regular check-ins to monitor progress against baseline metrics and adjust protocols accordingly.",
      "url": "https://leah.coach/tracking"
    },
    {
      "@type": "HowToStep",
      "name": "Optimise and Scale",
      "text": "Refine successful strategies, eliminate ineffective practices, and scale what works to achieve sustained performance improvement.",
      "url": "https://leah.coach/optimisation"
    }
  ],
  "totalTime": "P90D",
  "performTime": "PT30M",
  "prepTime": "PT15M",
  "yield": "Sustained 30-50% improvement in performance metrics"
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://leah.coach/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://leah.coach"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Programmes",
      "item": "https://leah.coach/programmes"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Assessment",
      "item": "https://leah.coach/assessment"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "About",
      "item": "https://leah.coach/about"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Contact",
      "item": "https://leah.coach/contact"
    }
  ]
};

export const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://leah.coach/#performance-workshop",
  "name": "Executive Performance Workshop by Leah Coach",
  "description": "Monthly workshop for senior professionals covering performance optimisation strategies, stress management, and leadership wellness. Evolved from Aphrodite Fitness methodology.",
  "startDate": "2024-02-01T10:00:00+00:00",
  "endDate": "2024-02-01T16:00:00+00:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": [
    {
      "@type": "Place",
      "name": "Leah Coach Performance Centre",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dereham",
        "addressRegion": "Norfolk",
        "addressCountry": "GB"
      }
    },
    {
      "@type": "VirtualLocation",
      "url": "https://leah.coach/workshop-online"
    }
  ],
  "image": "https://leah.coach/workshop.jpg",
  "organizer": {
    "@type": "Organization",
    "@id": "https://leah.coach/#organization"
  },
  "performer": {
    "@type": "Person",
    "@id": "https://leah.coach/#leahfowler"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://leah.coach/workshop-registration",
    "price": "140",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01T00:00:00+00:00"
  },
  "maximumAttendeeCapacity": 20,
  "isAccessibleForFree": false
};

export const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": "https://leah.coach/#intro-video",
  "name": "Transform Your Performance with Leah Coach",
  "description": "Discover how Leah Coach (formerly Aphrodite Fitness) helps executives and high-achieving professionals optimise their life performance. Elite consultancy evolved from fitness to total life optimisation.",
  "thumbnailUrl": "https://leah.coach/video-thumbnail.jpg",
  "uploadDate": "2024-01-15T08:00:00+00:00",
  "duration": "PT2M30S",
  "contentUrl": "https://leah.coach/intro-video.mp4",
  "embedUrl": "https://www.youtube.com/embed/XXXXX",
  "publisher": {
    "@type": "Organization",
    "@id": "https://leah.coach/#organization"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": {
      "@type": "WatchAction"
    },
    "userInteractionCount": 5432
  }
};

export const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://leah.coach/blog/executive-performance#article",
  "headline": "The Executive's Guide to Sustained High Performance",
  "alternativeHeadline": "From Aphrodite Fitness to Elite Performance: The Evolution of Executive Coaching",
  "image": "https://leah.coach/article-image.jpg",
  "author": {
    "@type": "Person",
    "@id": "https://leah.coach/#leahfowler"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://leah.coach/#organization"
  },
  "datePublished": "2024-01-10T09:00:00+00:00",
  "dateModified": "2024-01-15T10:00:00+00:00",
  "articleSection": "Performance Optimisation",
  "articleBody": "Comprehensive guide to optimising executive performance through integrated lifestyle strategies, evolved from the proven Aphrodite Fitness methodology...",
  "wordCount": 2500,
  "keywords": "executive performance, professional wellness, performance optimisation, leadership wellness, Aphrodite Fitness, Leah Coach, Norfolk business coaching",
  "inLanguage": "en-GB",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://leah.coach/blog/executive-performance"
  }
};

/**
 * Combine all schemas for the website
 */
export const getAllSchemas = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      brandEvolutionSchema,
      organizationSchema,
      localBusinessSchema,
      personSchema,
      ...serviceSchemas,
      faqSchema,
      reviewSchema,
      ...courseSchemas,
      howToSchema,
      breadcrumbSchema,
      eventSchema,
      videoSchema,
      articleSchema
    ]
  };
};

/**
 * Generate service schema for services page
 */
export const generateServiceSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": serviceSchemas
  };
};

/**
 * Get schema for specific page type
 */
export const getPageSchema = (pageType: string) => {
  switch (pageType) {
    case 'home':
      return {
        "@context": "https://schema.org",
        "@graph": [
          brandEvolutionSchema,
          organizationSchema,
          localBusinessSchema,
          personSchema,
          reviewSchema,
          breadcrumbSchema
        ]
      };
    case 'programmes':
      return {
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          ...serviceSchemas,
          ...courseSchemas,
          breadcrumbSchema
        ]
      };
    case 'about':
      return {
        "@context": "https://schema.org",
        "@graph": [
          brandEvolutionSchema,
          organizationSchema,
          personSchema,
          breadcrumbSchema
        ]
      };
    case 'faq':
      return {
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          faqSchema,
          breadcrumbSchema
        ]
      };
    case 'blog':
      return {
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          articleSchema,
          breadcrumbSchema
        ]
      };
    default:
      return {
        "@context": "https://schema.org",
        "@graph": [
          organizationSchema,
          breadcrumbSchema
        ]
      };
  }
};