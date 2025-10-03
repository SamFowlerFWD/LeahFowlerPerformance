// SEO-Optimized Programme Descriptions
// Complete content for all performance coaching programmes

export const programmeContent = {
  // PATHWAY TO ENDURANCE - REMOVED FOR NOW
  // foundation: {
  //   id: "pathway-programme",
  //   name: "Pathway to Endurance",
  // },
  
  acceleration: {
    id: "silver-programme",
    name: "Silver Package",
    price: "£140",
    priceUnit: "/month",
    tagline: "Weekly 1:1 Personal Training",
    shortDescription: "Premium personal training with comprehensive support, nutrition guidance and community access",
    
    longDescription: `Our Acceleration Programme is designed for senior executives committed to rapid transformation. With bi-weekly coaching, in-person strategy sessions, and advanced performance tools, you'll achieve breakthrough results while maintaining sustainable work-life integration.`,
    
    benefits: [
      {
        title: "Bi-Weekly Intensive Coaching",
        description: "60-minute deep-dive sessions focused on breakthrough strategies",
        icon: "Rocket",
        keyword: "intensive executive coaching"
      },
      {
        title: "Quarterly Strategy Sessions",
        description: "In-person sessions in London or Manchester",
        icon: "MapPin",
        keyword: "in-person coaching London"
      },
      {
        title: "Advanced Biometric Tracking",
        description: "HRV, sleep, and stress monitoring with personalised insights",
        icon: "Activity",
        keyword: "performance biometrics"
      },
      {
        title: "Customised Wellness Protocols",
        description: "Nutrition and fitness plans designed for executives",
        icon: "Heart",
        keyword: "executive wellness programme"
      },
      {
        title: "Time Mastery System",
        description: "Reclaim 10+ hours per week with proven frameworks",
        icon: "Clock",
        keyword: "time management for executives"
      },
      {
        title: "Priority Support",
        description: "Email and WhatsApp access for urgent guidance",
        icon: "MessageCircle",
        keyword: "executive coaching support"
      },
      {
        title: "Executive Masterminds",
        description: "Monthly sessions with fellow high-performers",
        icon: "Users",
        keyword: "executive mastermind"
      },
      {
        title: "Partner Programme",
        description: "Wellness support for spouse/partner included",
        icon: "UserPlus",
        keyword: "family wellness programme"
      }
    ],
    
    idealFor: [
      "Senior executives seeking rapid transformation",
      "Leaders preparing for C-suite positions",
      "High-achievers balancing family and career",
      "Executives facing complex organisational challenges"
    ],
    
    outcomes: {
      primary: "50% performance improvement with enhanced work-life balance",
      metrics: [
        "38% productivity gain",
        "52% improvement in energy levels",
        "60% better work-life integration",
        "2x improvement in leadership effectiveness"
      ]
    },
    
    testimonial: {
      quote: "The Acceleration Programme transformed not just my performance, but my entire approach to leadership. The ROI has been extraordinary.",
      author: "Sarah Chen",
      role: "Finance Director",
      company: "Global Investment Firm",
      result: "Promoted twice in 18 months"
    },
    
    faqs: [
      {
        question: "What makes the Acceleration Programme different?",
        answer: "The Acceleration Programme provides intensive support with bi-weekly coaching, quarterly in-person sessions, and priority access. You'll also receive advanced biometric tracking and a complete wellness system including support for your partner."
      },
      {
        question: "Can I upgrade from the Pathway programme?",
        answer: "Yes, you can upgrade at any time to any of our in-person training packages. Many clients start online and progress to Silver or Gold packages."
      }
    ],
    
    ctas: {
      primary: "Accelerate My Performance",
      secondary: "Schedule Strategy Call",
      exit: "Join Acceleration Programme - 2 Spots Left"
    }
  },
  
  elite: {
    id: "gold-programme",
    name: "Gold Package",
    price: "£250",
    priceUnit: "/month",
    tagline: "Elite Performance Training",
    shortDescription: "Premium 2x weekly training for accelerated results with advanced programming and recovery protocols",
    
    longDescription: `The Gold Package delivers premium training for parents serious about transformation. With twice-weekly 1:1 sessions, advanced programming, and comprehensive support, you'll achieve rapid results whether training for events or pursuing peak fitness.`,
    
    benefits: [
      {
        title: "Weekly VIP Sessions",
        description: "90-minute sessions (virtual or in-person) with Leah personally",
        icon: "Crown",
        keyword: "VIP executive coaching"
      },
      {
        title: "24/7 On-Demand Support",
        description: "Direct WhatsApp access to Leah for real-time guidance",
        icon: "Phone",
        keyword: "24/7 coaching support"
      },
      {
        title: "Quarterly Performance Retreats",
        description: "Exclusive retreats in UK & European destinations",
        icon: "Globe",
        keyword: "executive retreats UK"
      },
      {
        title: "Complete Health Optimisation",
        description: "Full executive health screening and personalised protocols",
        icon: "Medical",
        keyword: "executive health screening"
      },
      {
        title: "Personal Performance Team",
        description: "Dedicated nutritionist, trainer, and psychologist",
        icon: "Users",
        keyword: "performance team"
      },
      {
        title: "Leadership Excellence Training",
        description: "Board presentation and public speaking mastery",
        icon: "Mic",
        keyword: "leadership training"
      },
      {
        title: "Family Guest Passes",
        description: "Complete optimisation support for your entire family",
        icon: "Home",
        keyword: "family wellness"
      },
      {
        title: "Elite Network Access",
        description: "Invitations to exclusive events including annual Davos gathering",
        icon: "Award",
        keyword: "executive networking"
      },
      {
        title: "100% Success Guarantee",
        description: "Guaranteed results or complete refund",
        icon: "Shield",
        keyword: "guaranteed coaching results"
      }
    ],
    
    idealFor: [
      "C-suite executives and board members",
      "Entrepreneurs scaling significant businesses",
      "Industry leaders seeking world-class performance",
      "Executives requiring discrete, high-touch support"
    ],
    
    outcomes: {
      primary: "Complete professional and personal transformation",
      metrics: [
        "60%+ productivity improvement",
        "10/10 work-life satisfaction score",
        "3x leadership impact",
        "Breakthrough business results"
      ]
    },
    
    testimonial: {
      quote: "The Gold package transformed me completely. Training twice a week with Leah prepared me for my first Spartan Race and beyond.",
      author: "James Harrison",
      role: "CEO",
      company: "£50M Tech Company",
      result: "3x revenue growth, optimal health"
    },
    
    faqs: [
      {
        question: "What makes the Gold Package worth the investment?",
        answer: "The Gold Package provides 2x weekly 1:1 training, advanced programming, recovery protocols, and priority scheduling. It's perfect for those wanting rapid transformation or training for specific events."
      },
      {
        question: "Who chooses the Gold Package?",
        answer: "Gold is chosen by parents training for events like Spartan races, those wanting rapid transformation, or anyone prioritising their health and wanting the best possible support."
      }
    ],
    
    ctas: {
      primary: "Start Gold Training",
      secondary: "Book Gold Consultation",
      exit: "Gold Package - Premium Training"
    }
  }
};

// Programme comparison table for decision support
export const programmeComparison = {
  features: [
    {
      name: "Coaching Frequency",
      acceleration: "Bi-weekly 60-min",
      elite: "Weekly 90-min"
    },
    {
      name: "Session Format",
      acceleration: "Virtual + Quarterly In-Person",
      elite: "Choice of Virtual or In-Person"
    },
    {
      name: "Coach Access",
      acceleration: "Priority Email/WhatsApp",
      elite: "24/7 Direct Access"
    },
    {
      name: "Biometric Tracking",
      acceleration: "Advanced",
      elite: "Comprehensive + Health Screening"
    },
    {
      name: "Support Team",
      acceleration: "Coach + Community",
      elite: "Full Performance Team"
    },
    {
      name: "Retreats",
      acceleration: false,
      elite: "Quarterly"
    },
    {
      name: "Family Support",
      acceleration: "Partner Programme",
      elite: "Full Family Programme"
    },
    {
      name: "Results Guarantee",
      acceleration: "30-day refund",
      elite: "100% success guarantee"
    },
    {
      name: "Investment",
      silver: "£140/month",
      gold: "£250/month"
    }
  ]
};

// Dynamic pricing messages
export const pricingMessages = {
  value: "Investment in yourself that pays dividends forever",
  guarantee: "30-day money-back guarantee on all programmes",
  flexibility: "Flexible payment plans available",
  comparison: "Less than one business lunch per day",
  roi: "Average ROI: 312% within 6 months",
  tax: "Tax-deductible professional development"
};

// Urgency and scarcity messages
export const urgencyContent = {
  limited: {
    acceleration: "Only 3 spots available this month",
    elite: "2 openings - Application required"
  },
  countdown: {
    days: "Programme starts in {days} days",
    hours: "Registration closes in {hours} hours",
    lastChance: "Final opportunity to join this cohort"
  },
  social: {
    joining: "17 executives joined this week",
    considering: "42 professionals viewing this programme",
    enrolled: "8 enrolled in the last 24 hours"
  }
};