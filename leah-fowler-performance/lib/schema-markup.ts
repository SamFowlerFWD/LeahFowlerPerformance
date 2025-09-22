/**
 * Comprehensive Schema.org structured data for Leah Fowler Performance
 * Optimised for UK market and local SEO in Norfolk/Dereham
 * Positions business as performance consultancy (not fitness training)
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://leahfowlerperformance.com/#organization",
  "name": "Leah Fowler Performance - Strength Coach for Mums",
  "alternateName": "LFP Mum Fitness",
  "legalName": "Leah Fowler Performance Ltd",
  "url": "https://leahfowlerperformance.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://leahfowlerperformance.com/logo.png",
    "width": 600,
    "height": 300,
    "caption": "Leah Fowler Performance - Strength Coach for Mums Norfolk"
  },
  "image": "https://leahfowlerperformance.com/og-image.jpg",
  "description": "Norfolk's premier strength coach for mums. Smart strength training that fits around real life. From zero press-ups to race finishes. 500+ mums stronger.",
  "email": "enquiries@leahfowlerperformance.com",
  "telephone": "+44-7XXX-XXXXXX",
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
    "https://www.facebook.com/leahfowlerperformance"
  ],
  "founder": {
    "@type": "Person",
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  }
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": "https://leahfowlerperformance.com/#localbusiness",
  "name": "Leah Fowler Performance - Strength & Fitness Coach for Mums",
  "description": "Norfolk's specialist mum fitness coach. From exhausted to energised. Smart strength training for busy mums. From postnatal recovery to Spartan races. Get properly strong.",
  "url": "https://leahfowlerperformance.com",
  "telephone": "+44-7XXX-XXXXXX",
  "priceRange": "£12-£250/month",
  "image": [
    "https://leahfowlerperformance.com/og-image.jpg",
    "https://leahfowlerperformance.com/consultancy-space.jpg",
    "https://leahfowlerperformance.com/performance-assessment.jpg"
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
    "Strength Training for Mums",
    "Postnatal Fitness Recovery",
    "Mum Fitness Training",
    "Personal Training for Mothers",
    "Fitness Transformation Specialist",
    "Real Results Coaching",
    "School-Run Compatible Training"
  ],
  "knowsAbout": [
    "Strength Training for Mothers",
    "Postnatal Recovery",
    "Fitness After Children",
    "Strong Mum Mindset",
    "Guilt-Free Fitness",
    "Progressive Strength Training",
    "Mum Athlete Development",
    "Sustainable Fitness Plans",
    "Family-Fitness Integration",
    "Building Mum Communities"
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
  "@id": "https://leahfowlerperformance.com/#leahfowler",
  "name": "Leah Fowler",
  "givenName": "Leah",
  "familyName": "Fowler",
  "jobTitle": "Strength Coach for Mums & Founder",
  "description": "Mother of 3, Spartan Ultra finisher, and Norfolk's specialist mum fitness coach. From zero press-ups to ultra races. Helped 500+ mums get properly strong. Understanding the juggle because I live it.",
  "url": "https://leahfowlerperformance.com/about",
  "image": "https://leahfowlerperformance.com/leah-fowler.jpg",
  "email": "leah@leahfowlerperformance.com",
  "telephone": "+44-7XXX-XXXXXX",
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
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "knowsAbout": [
    "Performance Psychology",
    "Executive Coaching",
    "Behavioural Science",
    "Stress Physiology",
    "Sleep Science",
    "Nutritional Strategy",
    "Movement Science",
    "Leadership Development"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Certified Performance Coach",
      "credentialCategory": "Professional Certification"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Nutrition Specialist",
      "credentialCategory": "Professional Qualification"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/in/leahfowlerperformance",
    "https://www.instagram.com/leahfowlerperformance"
  ]
};

export const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leahfowlerperformance.com/#pathway-programme",
    "serviceType": "Pathway to Endurance",
    "name": "Pathway to Endurance - Online Foundation Programme",
    "description": "Build your fitness foundation with guided online training. Progressive strength training perfect for parents beginning their fitness journey or returning after a break. Self-paced with video demonstrations and community support.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
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
      "serviceUrl": "https://leahfowlerperformance.com/programmes/pathway",
      "serviceType": "Online consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leahfowlerperformance.com/#silver-programme",
    "serviceType": "Silver Programme",
    "name": "Silver - Weekly 1:1 Personal Training",
    "description": "Premium personal training with comprehensive support. Weekly 1:1 sessions, personalised nutrition guidance, and access to our supportive community. Perfect for parents ready for serious transformation.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
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
      "serviceUrl": "https://leahfowlerperformance.com/programmes/silver",
      "serviceType": "Hybrid consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leahfowlerperformance.com/#gold-programme",
    "serviceType": "Gold Programme",
    "name": "Gold - Elite Performance Training",
    "description": "Premium 2x weekly training for accelerated results. Perfect for parents serious about transformation, preparing for events, or wanting rapid results. Includes advanced programming and recovery protocols.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
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
      "serviceUrl": "https://leahfowlerperformance.com/programmes/gold",
      "serviceType": "Premium consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://leahfowlerperformance.com/#youth-development-programme",
    "serviceType": "Youth Development Programme",
    "name": "Youth Athlete Development Programme",
    "description": "Safe strength training and athletic development for young athletes aged 8-18. Age-appropriate programming, sport-specific training, and long-term athletic development focus. Building Norfolk's next generation of high performers.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Youth Development Programme Features",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Age-Appropriate Strength Training",
            "description": "Safe, progressive strength training designed for developing bodies"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sport-Specific Development",
            "description": "Training tailored to your child's chosen sport"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Parent Education",
            "description": "Guidance for parents on supporting youth athletic development"
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "90",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "90",
        "priceCurrency": "GBP",
        "unitText": "MONTH"
      }
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://leahfowlerperformance.com/programmes/youth-development",
      "serviceType": "In-person training",
      "availableLanguage": ["en-GB"]
    }
  }
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://leahfowlerperformance.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What makes Leah Fowler Performance different from traditional personal training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I'm a performance coach for the seriously committed - athletes, former athletes, and high achievers who refuse to settle for average. This isn't about quick fixes or aesthetic goals. It's about sustainable high performance, measurable progress, and training with purpose. I also specialise in youth athlete development, building Norfolk's next generation of high performers."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Leah Fowler Performance based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're based in Dereham, Norfolk, serving clients throughout East Anglia and the UK. We offer in-person consultations in Norfolk and comprehensive online programmes nationwide."
      }
    },
    {
      "@type": "Question",
      "name": "What investment levels are available for performance programmes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I offer six training packages: Pathway to Endurance (£12/month) online programme, Flexi Coaching (£80/month) app-based training, Semi-Private (£90/month per person) partner training, Small Group (£120 for 3 months) circuit training, Silver (£140/month) weekly 1:1 coaching - our most popular option, and Gold (£250/month) premium 2x weekly training."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I expect to see results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Committed individuals see strength gains within 2-3 weeks. Performance metrics improve consistently from week 4, with significant measurable progress by week 12. The key is consistency - those who show up consistently achieve remarkable transformations."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with clients outside of Norfolk?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, I work with committed individuals throughout the UK via online coaching. The digital platform through Trainerize provides comprehensive programming and support. However, youth athlete programmes are in-person only in the Norfolk area."
      }
    },
    {
      "@type": "Question",
      "name": "What qualifications does Leah Fowler have?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I'm a certified performance coach with specialisations in strength and conditioning, youth athletic development, and performance psychology. I combine formal qualifications with years of experience training committed athletes and high achievers, plus unique insight as a parent who understands real-world demands."
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
  "@id": "https://leahfowlerperformance.com/#rating",
  "itemReviewed": {
    "@type": "ProfessionalService",
    "@id": "https://leahfowlerperformance.com/#localbusiness"
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
    "@id": "https://leahfowlerperformance.com/#executive-wellness-course",
    "name": "Executive Wellness Mastery",
    "description": "Comprehensive 12-week programme designed for senior professionals to optimise physical and cognitive performance whilst managing executive responsibilities.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
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
        "@id": "https://leahfowlerperformance.com/#leahfowler"
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
    "@id": "https://leahfowlerperformance.com/#performance-foundation-course",
    "name": "Performance Foundation Programme",
    "description": "8-week foundational programme introducing evidence-based performance optimisation strategies for professionals ready to transform their capabilities.",
    "provider": {
      "@type": "Organization",
      "@id": "https://leahfowlerperformance.com/#organization"
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
  "@id": "https://leahfowlerperformance.com/#performance-optimisation-howto",
  "name": "How to Optimise Your Executive Performance",
  "description": "Evidence-based approach to enhancing professional performance through integrated lifestyle optimisation.",
  "image": "https://leahfowlerperformance.com/performance-optimisation-guide.jpg",
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
      "name": "Leah Fowler Performance app"
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
      "url": "https://leahfowlerperformance.com/assessment",
      "image": "https://leahfowlerperformance.com/assessment-step.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Identify Performance Gaps",
      "text": "Analyse assessment results to identify key areas for improvement and prioritise based on impact potential and feasibility.",
      "url": "https://leahfowlerperformance.com/analysis"
    },
    {
      "@type": "HowToStep",
      "name": "Design Personalised Protocol",
      "text": "Create a customised performance protocol addressing sleep, nutrition, movement, and stress management tailored to your schedule.",
      "url": "https://leahfowlerperformance.com/protocol"
    },
    {
      "@type": "HowToStep",
      "name": "Implement Daily Practices",
      "text": "Begin implementing daily performance practices, starting with keystone habits that create cascading positive effects.",
      "url": "https://leahfowlerperformance.com/implementation"
    },
    {
      "@type": "HowToStep",
      "name": "Track and Measure Progress",
      "text": "Use wearable technology and regular check-ins to monitor progress against baseline metrics and adjust protocols accordingly.",
      "url": "https://leahfowlerperformance.com/tracking"
    },
    {
      "@type": "HowToStep",
      "name": "Optimise and Scale",
      "text": "Refine successful strategies, eliminate ineffective practices, and scale what works to achieve sustained performance improvement.",
      "url": "https://leahfowlerperformance.com/optimisation"
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
  "@id": "https://leahfowlerperformance.com/#breadcrumb",
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
      "name": "Programmes",
      "item": "https://leahfowlerperformance.com/programmes"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Assessment",
      "item": "https://leahfowlerperformance.com/assessment"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "About",
      "item": "https://leahfowlerperformance.com/about"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Contact",
      "item": "https://leahfowlerperformance.com/contact"
    }
  ]
};

export const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://leahfowlerperformance.com/#performance-workshop",
  "name": "Executive Performance Workshop",
  "description": "Monthly workshop for senior professionals covering performance optimisation strategies, stress management, and leadership wellness.",
  "startDate": "2024-02-01T10:00:00+00:00",
  "endDate": "2024-02-01T16:00:00+00:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": [
    {
      "@type": "Place",
      "name": "Leah Fowler Performance Centre",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dereham",
        "addressRegion": "Norfolk",
        "addressCountry": "GB"
      }
    },
    {
      "@type": "VirtualLocation",
      "url": "https://leahfowlerperformance.com/workshop-online"
    }
  ],
  "image": "https://leahfowlerperformance.com/workshop.jpg",
  "organizer": {
    "@type": "Organization",
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "performer": {
    "@type": "Person",
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://leahfowlerperformance.com/workshop-registration",
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
  "@id": "https://leahfowlerperformance.com/#intro-video",
  "name": "Transform Your Performance with Leah Fowler",
  "description": "Discover how Leah Fowler Performance helps executives and high-achieving professionals optimise their physical and cognitive performance.",
  "thumbnailUrl": "https://leahfowlerperformance.com/video-thumbnail.jpg",
  "uploadDate": "2024-01-15T08:00:00+00:00",
  "duration": "PT2M30S",
  "contentUrl": "https://leahfowlerperformance.com/intro-video.mp4",
  "embedUrl": "https://www.youtube.com/embed/XXXXX",
  "publisher": {
    "@type": "Organization",
    "@id": "https://leahfowlerperformance.com/#organization"
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
  "@id": "https://leahfowlerperformance.com/blog/executive-performance#article",
  "headline": "The Executive's Guide to Sustained High Performance",
  "alternativeHeadline": "Evidence-Based Strategies for Professional Excellence",
  "image": "https://leahfowlerperformance.com/article-image.jpg",
  "author": {
    "@type": "Person",
    "@id": "https://leahfowlerperformance.com/#leahfowler"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://leahfowlerperformance.com/#organization"
  },
  "datePublished": "2024-01-10T09:00:00+00:00",
  "dateModified": "2024-01-15T10:00:00+00:00",
  "articleSection": "Performance Optimisation",
  "articleBody": "Comprehensive guide to optimising executive performance through integrated lifestyle strategies...",
  "wordCount": 2500,
  "keywords": "executive performance, professional wellness, performance optimisation, leadership wellness, Norfolk business coaching",
  "inLanguage": "en-GB",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://leahfowlerperformance.com/blog/executive-performance"
  }
};

/**
 * Combine all schemas for the website
 */
export const getAllSchemas = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
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