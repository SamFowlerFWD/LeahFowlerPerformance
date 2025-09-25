export function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://strengthpt.co.uk/#business",
    "name": "Leah Fowler Performance",
    "alternateName": "LFP Online PT",
    "description": "Elite online personal trainer and strength & conditioning coach serving Norfolk and the UK. Evidence-based training programmes for high-achieving professionals.",
    "url": "https://strengthpt.co.uk",
    "telephone": "+447990600958",
    "priceRange": "££",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dereham",
      "addressRegion": "Norfolk",
      "postalCode": "NR19",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.6815,
      "longitude": 0.9392
    },
    "areaServed": [
      {
        "@type": "Place",
        "name": "Norfolk"
      },
      {
        "@type": "Place",
        "name": "Norwich"
      },
      {
        "@type": "Place",
        "name": "Dereham"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "06:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/leahfowlerperformance",
      "https://www.facebook.com/leahfowlerperformance"
    ],
    "image": "https://strengthpt.co.uk/og-image.jpg",
    "logo": "https://strengthpt.co.uk/logo.png"
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://strengthpt.co.uk/#coach",
    "name": "Leah Fowler",
    "jobTitle": "Strength & Conditioning Coach | Online Personal Trainer",
    "description": "Elite performance coach specialising in online personal training and strength & conditioning for high-achieving professionals.",
    "url": "https://strengthpt.co.uk/about",
    "worksFor": {
      "@id": "https://strengthpt.co.uk/#business"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Professional Fitness Education"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Level 3 Personal Trainer",
        "credentialCategory": "certificate"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Strength & Conditioning Specialist",
        "credentialCategory": "certificate"
      }
    ],
    "knowsAbout": [
      "Online Personal Training",
      "Strength and Conditioning",
      "Performance Optimization",
      "Evidence-Based Training",
      "Nutrition Coaching",
      "Behavioural Change"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Online Personal Training & Strength Coaching",
    "provider": {
      "@id": "https://strengthpt.co.uk/#business"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Foundation Online Programme",
        "description": "4-week starter programme with app access and weekly check-ins",
        "price": "48",
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock",
        "url": "https://strengthpt.co.uk/services#foundation"
      },
      {
        "@type": "Offer",
        "name": "Performance Programme",
        "description": "12-week transformation with personalised training and nutrition",
        "price": "120",
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock",
        "url": "https://strengthpt.co.uk/services#performance"
      },
      {
        "@type": "Offer",
        "name": "Elite 1:1 Coaching",
        "description": "Premium online personal training with daily support",
        "price": "250",
        "priceCurrency": "GBP",
        "availability": "https://schema.org/LimitedAvailability",
        "url": "https://strengthpt.co.uk/services#elite"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Online PT Programmes",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Online Personal Training",
          "description": "Personalised training programmes delivered via app"
        },
        {
          "@type": "Service",
          "name": "Strength & Conditioning Coaching",
          "description": "Evidence-based strength programmes for performance"
        },
        {
          "@type": "Service",
          "name": "Nutrition Guidance",
          "description": "Macro-based nutrition planning and support"
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is online personal training?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Online personal training provides personalised workout programmes, nutrition guidance, and coaching support delivered through a mobile app. You get the expertise of a qualified PT with the flexibility to train anywhere, anytime."
        }
      },
      {
        "@type": "Question",
        "name": "How much does online PT cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our online personal training starts from £48/month for the Foundation Programme. Performance programmes are £120/month, and Elite 1:1 coaching is £250/month. All include app access, personalised programming, and regular check-ins."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer in-person training in Norfolk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While we're based in Dereham, Norfolk, we specialise in online personal training to provide flexible, accessible coaching to clients across the UK. This allows you to train on your schedule with professional support."
        }
      },
      {
        "@type": "Question",
        "name": "What qualifications does Leah have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Leah is a Level 3 qualified Personal Trainer and Strength & Conditioning Specialist with additional certifications in nutrition and behavioural change. She has over 5 years experience transforming 500+ clients."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "name": "Services",
        "item": "https://strengthpt.co.uk/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": "https://strengthpt.co.uk/about"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact",
        "item": "https://strengthpt.co.uk/contact"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://strengthpt.co.uk/#webpage",
    "url": "https://strengthpt.co.uk",
    "name": "Online PT Norfolk | Strength & Conditioning Coach UK",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://strengthpt.co.uk/#website",
      "url": "https://strengthpt.co.uk",
      "name": "Leah Fowler Performance",
      "description": "Elite online personal training and strength coaching",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://strengthpt.co.uk/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    "inLanguage": "en-GB",
    "about": {
      "@id": "https://strengthpt.co.uk/#business"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://strengthpt.co.uk/og-image.jpg"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString()
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      localBusinessSchema,
      personSchema,
      serviceSchema,
      faqSchema,
      breadcrumbSchema,
      webPageSchema
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
    />
  );
}