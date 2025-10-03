/**
 * Comprehensive Schema.org structured data for Aphrodite Fitness
 * Optimised for UK market and local SEO in Norfolk/Dereham
 * Personal training and strength coaching business
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://strengthpt.co.uk/#organization",
  "name": "Aphrodite Fitness with Leah Fowler - Personal Training & Strength Coaching Norfolk",
  "alternateName": "Aphrodite Fitness | Leah Fowler PT",
  "legalName": "Aphrodite Fitness",
  "url": "https://strengthpt.co.uk",
  "logo": {
    "@type": "ImageObject",
    "url": "https://strengthpt.co.uk/images/strength-pt-logo.svg",
    "width": 800,
    "height": 200,
    "caption": "Strength PT - Elite Online Personal Training & Strength Coaching UK | PT Dereham",
    "name": "Strength PT Logo",
    "encodingFormat": "image/svg+xml"
  },
  "image": "https://strengthpt.co.uk/og-image.jpg",
  "description": "Aphrodite Fitness with Leah Fowler - Personal training and strength coaching for busy parents and professionals in Norfolk. Online and in-person training from £48. Mother of 3, 15 years experience.",
  "email": "enquiries@strengthpt.co.uk",
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
    "https://www.facebook.com/leahfowlerperformance"
  ],
  "founder": {
    "@type": "Person",
    "@id": "https://strengthpt.co.uk/#leahfowler"
  }
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": "https://strengthpt.co.uk/#localbusiness",
  "name": "Leah Fowler Performance - Online Personal Trainer Norfolk",
  "description": "Professional online PT & strength conditioning coach UK. Evidence-based training programmes. Personalised coaching from £48/month. 500+ professionals transformed.",
  "url": "https://strengthpt.co.uk",
  "telephone": "+447990600958",
  "priceRange": "£12-£250/month",
  "image": [
    "https://strengthpt.co.uk/og-image.jpg",
    "https://strengthpt.co.uk/consultancy-space.jpg",
    "https://strengthpt.co.uk/performance-assessment.jpg"
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
  "@id": "https://strengthpt.co.uk/#leahfowler",
  "name": "Leah Fowler",
  "givenName": "Leah",
  "familyName": "Fowler",
  "jobTitle": "Performance Consultant & Strength Coach",
  "alternateName": "Leah Fowler Performance Coach",
  "description": "Mother of 3, Spartan Ultra finisher, and Norfolk's premier performance consultant. From zero press-ups to ultra races. Helped 500+ parents achieve peak performance. Understanding the juggle because I live it.",
  "url": "https://strengthpt.co.uk/about",
  "image": [
    "https://strengthpt.co.uk/images/leah/leah-fowler-pt.webp",
    "https://strengthpt.co.uk/images/leah/leah-fowler-pt-300x300.webp"
  ],
  "email": "leah@strengthpt.co.uk",
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
    "@id": "https://strengthpt.co.uk/#organization"
  },
  "gender": "Female",
  "nationality": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "knowsAbout": [
    "Performance Optimisation",
    "Strength & Conditioning",
    "Mother Fitness Training",
    "Postnatal Recovery",
    "Executive Performance Coaching",
    "Behavioural Psychology",
    "Athletic Performance",
    "Obstacle Race Training",
    "Triathlon Training",
    "Family Fitness Integration"
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
      "name": "Postnatal Fitness Specialist",
      "credentialCategory": "Professional Qualification"
    }
  ],
  "award": [
    "Spartan Ultra Finisher",
    "Triathlon Competitor",
    "500+ Successful Client Transformations"
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
    "@id": "https://strengthpt.co.uk/#pathway-programme",
    "serviceType": "Pathway to Endurance",
    "name": "Pathway to Endurance - Online Foundation Programme",
    "description": "Build your fitness foundation with guided online training. Progressive strength training perfect for parents beginning their fitness journey or returning after a break. Self-paced with video demonstrations and community support.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
      "serviceUrl": "https://strengthpt.co.uk/programmes/pathway",
      "serviceType": "Online consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://strengthpt.co.uk/#silver-programme",
    "serviceType": "Silver Programme",
    "name": "Silver - Weekly 1:1 Personal Training",
    "description": "Premium personal training with comprehensive support. Weekly 1:1 sessions, personalised nutrition guidance, and access to our supportive community. Perfect for parents ready for serious transformation.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
      "serviceUrl": "https://strengthpt.co.uk/programmes/silver",
      "serviceType": "Hybrid consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://strengthpt.co.uk/#gold-programme",
    "serviceType": "Gold Programme",
    "name": "Gold - Elite Performance Training",
    "description": "Premium 2x weekly training for accelerated results. Perfect for parents serious about transformation, preparing for events, or wanting rapid results. Includes advanced programming and recovery protocols.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
      "serviceUrl": "https://strengthpt.co.uk/programmes/gold",
      "serviceType": "Premium consultancy",
      "availableLanguage": ["en-GB"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://strengthpt.co.uk/#youth-development-programme",
    "serviceType": "Youth Development Programme",
    "name": "Youth Athlete Development Programme",
    "description": "Safe strength training and athletic development for young athletes aged 8-18. Age-appropriate programming, sport-specific training, and long-term athletic development focus. Building Norfolk's next generation of high performers.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
      "serviceUrl": "https://strengthpt.co.uk/programmes/youth-development",
      "serviceType": "In-person training",
      "availableLanguage": ["en-GB"]
    }
  }
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://strengthpt.co.uk/#faq",
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
  "@id": "https://strengthpt.co.uk/#rating",
  "itemReviewed": {
    "@type": "ProfessionalService",
    "@id": "https://strengthpt.co.uk/#localbusiness"
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
    "@id": "https://strengthpt.co.uk/#executive-wellness-course",
    "name": "Executive Wellness Mastery",
    "description": "Comprehensive 12-week programme designed for senior professionals to optimise physical and cognitive performance whilst managing executive responsibilities.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
        "@id": "https://strengthpt.co.uk/#leahfowler"
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
    "@id": "https://strengthpt.co.uk/#performance-foundation-course",
    "name": "Performance Foundation Programme",
    "description": "8-week foundational programme introducing evidence-based performance optimisation strategies for professionals ready to transform their capabilities.",
    "provider": {
      "@type": "Organization",
      "@id": "https://strengthpt.co.uk/#organization"
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
  "@id": "https://strengthpt.co.uk/#performance-optimisation-howto",
  "name": "How to Optimise Your Executive Performance",
  "description": "Evidence-based approach to enhancing professional performance through integrated lifestyle optimisation.",
  "image": "https://strengthpt.co.uk/performance-optimisation-guide.jpg",
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
      "url": "https://strengthpt.co.uk/assessment",
      "image": "https://strengthpt.co.uk/assessment-step.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Identify Performance Gaps",
      "text": "Analyse assessment results to identify key areas for improvement and prioritise based on impact potential and feasibility.",
      "url": "https://strengthpt.co.uk/analysis"
    },
    {
      "@type": "HowToStep",
      "name": "Design Personalised Protocol",
      "text": "Create a customised performance protocol addressing sleep, nutrition, movement, and stress management tailored to your schedule.",
      "url": "https://strengthpt.co.uk/protocol"
    },
    {
      "@type": "HowToStep",
      "name": "Implement Daily Practices",
      "text": "Begin implementing daily performance practices, starting with keystone habits that create cascading positive effects.",
      "url": "https://strengthpt.co.uk/implementation"
    },
    {
      "@type": "HowToStep",
      "name": "Track and Measure Progress",
      "text": "Use wearable technology and regular check-ins to monitor progress against baseline metrics and adjust protocols accordingly.",
      "url": "https://strengthpt.co.uk/tracking"
    },
    {
      "@type": "HowToStep",
      "name": "Optimise and Scale",
      "text": "Refine successful strategies, eliminate ineffective practices, and scale what works to achieve sustained performance improvement.",
      "url": "https://strengthpt.co.uk/optimisation"
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
  "@id": "https://strengthpt.co.uk/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://strengthpt.co.uk"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Programmes",
      "item": "https://strengthpt.co.uk/programmes"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Assessment",
      "item": "https://strengthpt.co.uk/assessment"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "About",
      "item": "https://strengthpt.co.uk/about"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Contact",
      "item": "https://strengthpt.co.uk/contact"
    }
  ]
};

export const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://strengthpt.co.uk/#performance-workshop",
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
      "url": "https://strengthpt.co.uk/workshop-online"
    }
  ],
  "image": "https://strengthpt.co.uk/workshop.jpg",
  "organizer": {
    "@type": "Organization",
    "@id": "https://strengthpt.co.uk/#organization"
  },
  "performer": {
    "@type": "Person",
    "@id": "https://strengthpt.co.uk/#leahfowler"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://strengthpt.co.uk/workshop-registration",
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
  "@id": "https://strengthpt.co.uk/#intro-video",
  "name": "Transform Your Performance with Leah Fowler",
  "description": "Discover how Leah Fowler Performance helps executives and high-achieving professionals optimise their physical and cognitive performance.",
  "thumbnailUrl": "https://strengthpt.co.uk/video-thumbnail.jpg",
  "uploadDate": "2024-01-15T08:00:00+00:00",
  "duration": "PT2M30S",
  "contentUrl": "https://strengthpt.co.uk/intro-video.mp4",
  "embedUrl": "https://www.youtube.com/embed/XXXXX",
  "publisher": {
    "@type": "Organization",
    "@id": "https://strengthpt.co.uk/#organization"
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
  "@id": "https://strengthpt.co.uk/blog/executive-performance#article",
  "headline": "The Executive's Guide to Sustained High Performance",
  "alternativeHeadline": "Evidence-Based Strategies for Professional Excellence",
  "image": "https://strengthpt.co.uk/article-image.jpg",
  "author": {
    "@type": "Person",
    "@id": "https://strengthpt.co.uk/#leahfowler"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://strengthpt.co.uk/#organization"
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
    "@id": "https://strengthpt.co.uk/blog/executive-performance"
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