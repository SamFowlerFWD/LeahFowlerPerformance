// SEO-Optimized Hero Section Content Component
// Contains all hero section copy with proper keyword optimization

export const heroContent = {
  badge: "UK's Premier Performance Optimisation Platform",
  
  // Primary H1 with target keywords
  mainHeading: "Transform Your Executive Performance in 90 Days with UK's Premier Performance Consultant",
  
  // Supporting subheading with LSI keywords
  subHeading: "Join 247+ high-achieving executives who've unlocked peak performance through our evidence-based optimisation system. Average productivity gain: 38%. Success rate: 95%.",
  
  // Value proposition bullets
  valueProps: [
    {
      icon: "CheckCircle",
      text: "Personalised performance roadmap designed for your specific challenges",
      keyword: "personalised performance"
    },
    {
      icon: "TrendingUp", 
      text: "Evidence-based methodologies proven across 247+ executives",
      keyword: "evidence-based coaching"
    },
    {
      icon: "Shield",
      text: "Measurable ROI within 30 days or your money back",
      keyword: "guaranteed results"
    },
    {
      icon: "Clock",
      text: "24/7 support from certified performance consultants",
      keyword: "performance consultant support"
    }
  ],
  
  // CTA buttons with conversion-focused copy
  primaryCTA: {
    text: "Start Your Performance Transformation",
    subtext: "Book Strategy Call",
    ariaLabel: "Book your executive performance strategy call",
    href: "/book-consultation"
  },
  
  secondaryCTA: {
    text: "See Real Client Results",
    subtext: "View Success Stories", 
    ariaLabel: "View executive coaching success stories",
    href: "/success-stories"
  },
  
  // Trust indicators for above-fold placement
  trustIndicators: {
    clientCount: "247+",
    clientLabel: "Executives Transformed",
    successRate: "95%",
    successLabel: "Success Rate",
    avgROI: "312%",
    roiLabel: "Average ROI"
  },
  
  // SEO-friendly alt text for hero image
  heroImageAlt: "Leah Fowler conducting executive performance coaching session in London",
  
  // Video content (if applicable)
  videoContent: {
    thumbnailAlt: "Watch Leah Fowler explain executive performance optimisation",
    videoTitle: "How Executive Performance Coaching Transforms Leaders",
    videoDuration: "2:47"
  }
};

// Mobile-optimized version with shorter copy
export const mobileHeroContent = {
  mainHeading: "Transform Executive Performance in 90 Days",
  subHeading: "Join 247+ executives achieving 38% productivity gains",
  primaryCTA: "Book Strategy Call",
  trustBadge: "95% Success Rate"
};

// A/B test variations for conversion optimization
export const heroVariations = {
  A: {
    heading: "Transform Your Executive Performance in 90 Days with UK's Premier Performance Consultant",
    cta: "Start Your Performance Transformation"
  },
  B: {
    heading: "Unlock 40% More Productivity as an Executive Leader",
    cta: "Claim Your Free Strategy Session"
  },
  C: {
    heading: "Join 247+ Executives Who've Transformed Their Performance",
    cta: "Book Your Breakthrough Call"
  }
};

// Dynamic content based on traffic source
export const trafficSourceContent = {
  organic: {
    heading: "Executive Performance Coach UK | Transform Your Leadership",
    emphasis: "Evidence-based coaching with proven results"
  },
  ppc: {
    heading: "Transform Your Performance - First Session Free",
    emphasis: "Limited offer: Complimentary strategy session this week"
  },
  social: {
    heading: "See How 247+ Executives Transformed Their Lives",
    emphasis: "Real stories, real results, real transformation"
  },
  direct: {
    heading: "Welcome Back to Your Performance Journey",
    emphasis: "Continue where you left off"
  }
};

// Seasonal variations for campaigns
export const seasonalContent = {
  newYear: {
    badge: "New Year, Peak Performance",
    heading: "Make 2025 Your Breakthrough Year",
    urgency: "January cohort filling fast - 3 spots remaining"
  },
  spring: {
    badge: "Spring Performance Sprint",
    heading: "Accelerate Your Performance This Spring",
    urgency: "Q2 transformation programme now open"
  },
  summer: {
    badge: "Summer Excellence Programme",
    heading: "Achieve More While Working Less This Summer",
    urgency: "Limited summer programme availability"
  },
  autumn: {
    badge: "Q4 Performance Push",
    heading: "Finish Strong with Elite Performance Coaching",
    urgency: "Final quarter spaces available"
  }
};

// Location-specific content for local SEO
export const locationContent = {
  london: {
    heading: "Executive Performance Coach London | Transform Your Leadership",
    subtext: "In-person sessions available in Central London",
    localProof: "Trusted by FTSE 100 executives"
  },
  manchester: {
    heading: "Executive Performance Coach Manchester | Elite Coaching",
    subtext: "Serving Manchester's business leaders since 2019",
    localProof: "Preferred by Northern Powerhouse executives"
  },
  birmingham: {
    heading: "Executive Performance Coach Birmingham | Peak Performance",
    subtext: "Birmingham's premier performance consultant",
    localProof: "Transforming Midlands business leaders"
  },
  virtual: {
    heading: "Virtual Executive Performance Coaching | Work From Anywhere",
    subtext: "Same results, ultimate flexibility",
    localProof: "247+ executives coached remotely"
  }
};

// Industry-specific messaging
export const industryContent = {
  finance: {
    heading: "Performance Coaching for Finance Executives",
    painPoint: "Manage stress while maximizing returns",
    proof: "Trusted by investment banking leaders"
  },
  tech: {
    heading: "Executive Coaching for Tech Leaders",
    painPoint: "Scale yourself as fast as your startup",
    proof: "Chosen by unicorn founders"
  },
  healthcare: {
    heading: "Performance Optimisation for Healthcare Leaders",
    painPoint: "Lead with energy despite demanding schedules",
    proof: "Supporting NHS executives and private healthcare"
  },
  legal: {
    heading: "Executive Performance for Legal Professionals",
    painPoint: "Maintain peak performance during critical cases",
    proof: "Preferred by Magic Circle partners"
  }
};