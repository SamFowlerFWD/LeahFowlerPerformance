// Aphrodite Fitness - Actual Package Structure from Welcome Pack
// SEO-optimized content for all training packages

export const aphroditeFitnessPackages = {
  // Online Package - Main Product Offering
  onlinePackage: {
    id: "online-package",
    name: "Online Package",
    slug: "online-package",
    price: 100,
    currency: "£",
    period: "/month",
    billing: "monthly",
    tagline: "Complete Digital Transformation",
    shortDescription: "Full online coaching with smart app accountability and personalised programming",
    popular: true,
    color: "gold" as const,
    badge: "MOST POPULAR • BEST VALUE",

    longDescription: `Transform your life with our comprehensive Online Package - the perfect solution for busy
    professionals who want expert coaching without the constraints of scheduled sessions. Get daily support,
    personalised programming, and real accountability that fits around your life, not the other way around.`,

    features: [
      { text: "Smart app accountability with weekly coaching reviews", included: true, highlight: true },
      { text: "App-based workout tracking", included: true, highlight: true },
      { text: "Personalised nutrition guidance", included: true, highlight: true },
      { text: "Weekly video check-ins", included: true },
      { text: "Goal setting & progression tracking", included: true },
      { text: "Exercise form video reviews", included: true },
      { text: "Direct messaging support", included: true },
      { text: "Community access", included: true },
      { text: "3-month minimum commitment", included: true },
      { text: "In-person sessions", included: false }
    ],

    idealFor: [
      "Busy professionals needing flexibility",
      "Parents who can't commit to fixed sessions",
      "Those wanting comprehensive accountability systems",
      "Anyone serious about transformation"
    ],

    outcomes: [
      "Build sustainable habits",
      "Transform your strength and energy",
      "Achieve work-life-fitness balance",
      "Join a supportive community"
    ],

    testimonial: {
      quote: "The app tracking and weekly coaching keep me accountable every single day. I've achieved more in 3 months than 3 years on my own!",
      author: "James P.",
      role: "CEO & Dad of 2",
      result: "Lost 15kg, gained confidence"
    },

    cta: "Start Your Transformation",
    guarantee: "30-day money-back guarantee"
  },

  // Small Group Training
  smallGroup: {
    id: "small-group-training",
    name: "Small Group Training",
    slug: "small-group",
    price: 120,
    currency: "£",
    period: "12 sessions over 3 months",
    billing: "one-time",
    tagline: "Circuit Style Training for Parents",
    shortDescription: "Dynamic group sessions combining strength and cardio, perfect for busy parents",
    popular: false,
    color: "sage" as const,

    longDescription: `Join our energising Small Group Training programme - where parents transform together.
    With a maximum of 6 participants, you'll receive personalised attention while enjoying the motivation
    of training alongside like-minded parents. Our circuit-style sessions are designed to build real-world
    strength that translates directly to your daily life.`,

    features: [
      { text: "Circuit style strength & cardio training", included: true, highlight: true },
      { text: "Maximum 6 people per group", included: true },
      { text: "12 sessions over 3 months", included: true },
      { text: "Monday 10:30am sessions", included: true },
      { text: "Friday 12:30pm sessions", included: true },
      { text: "Progressive programming", included: true },
      { text: "Community support network", included: true },
      { text: "Access to Facebook group", included: true },
      { text: "Beginner-friendly options", included: true },
      { text: "1:1 coaching", included: false }
    ],

    sessions: {
      monday: "10:30am",
      friday: "12:30pm"
    },

    idealFor: [
      "Parents wanting accountability and community",
      "Those who thrive in group environments",
      "Beginners looking for a supportive start",
      "Parents with school-hours availability"
    ],

    outcomes: [
      "Build foundational strength",
      "Improve cardiovascular fitness",
      "Connect with like-minded parents",
      "Establish consistent exercise habits"
    ],

    testimonial: {
      quote: "The small group sessions fit perfectly around school runs. I've made great friends and feel stronger than I have in years!",
      author: "Sarah M.",
      role: "Mum of 2",
      result: "Lost 2 stone, gained confidence"
    },

    cta: "Reserve Your Spot",
    guarantee: "First session free trial"
  },

  // NOTE: Flexi Coaching programme has been DISCONTINUED

  // Semi-Private Coaching
  semiPrivate: {
    id: "semi-private-coaching",
    name: "Semi-Private Coaching",
    slug: "semi-private",
    price: 90,
    currency: "£",
    period: "/month per person",
    billing: "monthly",
    tagline: "Train With a Partner",
    shortDescription: "Premium 2:1 coaching - perfect for couples or training partners",
    popular: false,
    color: "sage" as const,
    badge: "GREAT VALUE",

    longDescription: `Get all the benefits of personal training at a fraction of the cost. Train with your
    partner, friend, or another parent for motivation, accountability, and shared success. Each session
    is tailored to both participants' needs while maintaining individual progression.`,

    features: [
      { text: "2:1 personal training format", included: true, highlight: true },
      { text: "All Silver package benefits", included: true },
      { text: "Shared cost advantage", included: true },
      { text: "Partner accountability", included: true },
      { text: "Individualised within sessions", included: true },
      { text: "Nutrition guidance included", included: true },
      { text: "Goal setting & programming", included: true },
      { text: "Private Facebook group access", included: true },
      { text: "Ad hoc sessions available (£25/person)", included: true },
      { text: "Flexible scheduling", included: true }
    ],

    idealFor: [
      "Couples wanting to train together",
      "Friends seeking shared fitness goals",
      "Parents wanting cost-effective PT",
      "Those who enjoy training with others"
    ],

    outcomes: [
      "Shared motivation and accountability",
      "Cost-effective personal training",
      "Faster progress through partnership",
      "Strengthened relationships"
    ],

    testimonial: {
      quote: "Training with my husband has been game-changing. We motivate each other and it's become our time together.",
      author: "Emma & Tom",
      role: "Parents of 2",
      result: "Both completed Tough Mudder"
    },

    cta: "Book Semi-Private",
    guarantee: "First session £25 trial"
  },

  // Silver Package
  silver: {
    id: "silver-package",
    name: "Silver",
    slug: "silver",
    price: 140,
    currency: "£",
    period: "/month",
    billing: "monthly",
    tagline: "Weekly 1:1 Personal Training",
    shortDescription: "Premium personal training with comprehensive support",
    popular: false,
    color: "sage" as const,
    badge: "PREMIUM OPTION",

    longDescription: `Our Silver package delivers the perfect balance of personal attention and comprehensive
    support. With weekly 1:1 sessions, personalised nutrition guidance, and access to our supportive
    community, you'll have everything needed for transformation.`,

    features: [
      { text: "Weekly 1:1 face-to-face sessions", included: true, highlight: true },
      { text: "Personalised nutrition advice", included: true },
      { text: "Custom goal setting", included: true },
      { text: "Individualised programming", included: true },
      { text: "Private Facebook group", included: true },
      { text: "Workout video library", included: true },
      { text: "Monthly progress reviews", included: true },
      { text: "Form correction & technique", included: true },
      { text: "WhatsApp support", included: true },
      { text: "Multiple weekly sessions", included: false }
    ],

    idealFor: [
      "Parents ready for serious change",
      "Those wanting personalised attention",
      "Anyone with specific goals",
      "Parents needing nutrition guidance"
    ],

    outcomes: [
      "Rapid strength gains",
      "Improved body composition",
      "Enhanced energy levels",
      "Sustainable lifestyle changes"
    ],

    testimonial: {
      quote: "The Silver package changed my life. I'm stronger at 40 than I was at 30, and I can keep up with my kids!",
      author: "Rachel K.",
      role: "Mum of 3",
      result: "300% strength increase"
    },

    cta: "Start Silver Training",
    guarantee: "30-day transformation guarantee"
  },

  // Gold Package
  gold: {
    id: "gold-package",
    name: "Gold",
    slug: "gold",
    price: 250,
    currency: "£",
    period: "/month",
    billing: "monthly",
    tagline: "Elite Performance Training",
    shortDescription: "Premium 2x weekly training for accelerated results",
    popular: false,
    color: "gold" as const,
    badge: "PREMIUM",

    longDescription: `For parents serious about transformation. With twice-weekly 1:1 sessions and comprehensive
    support, the Gold package accelerates your journey to peak performance. Perfect for those preparing
    for events or wanting rapid results.`,

    features: [
      { text: "2x weekly 1:1 sessions", included: true, highlight: true },
      { text: "Everything in Silver package", included: true },
      { text: "Advanced programming", included: true },
      { text: "Competition preparation", included: true },
      { text: "Recovery protocols", included: true },
      { text: "Priority scheduling", included: true },
      { text: "Quarterly fitness assessments", included: true },
      { text: "Advanced nutrition planning", included: true },
      { text: "Daily WhatsApp check-ins", included: true },
      { text: "Guest passes for family", included: true }
    ],

    idealFor: [
      "Parents training for events",
      "Those wanting rapid transformation",
      "Athletes returning to fitness",
      "Parents prioritising their health"
    ],

    outcomes: [
      "Accelerated results",
      "Event readiness",
      "Peak physical condition",
      "Complete lifestyle transformation"
    ],

    testimonial: {
      quote: "Gold training prepared me for my first Spartan Race. Leah's expertise and support were incredible.",
      author: "Michael D.",
      role: "Dad of 2",
      result: "Completed 3 Spartan Races"
    },

    cta: "Go Gold",
    guarantee: "60-day results guarantee"
  },

  // Pathway to Endurance - UPDATED: Now one-off payment
  pathwayToEndurance: {
    id: "pathway-to-endurance",
    name: "Pathway to Endurance",
    slug: "pathway",
    price: 48,
    currency: "£",
    period: " for 16 weeks",
    billing: "one-time",
    tagline: "16-Week Online Foundation Programme",
    shortDescription: "Complete 16-week online programme to build your fitness foundation",
    popular: false,
    color: "navy" as const,

    longDescription: `Transform your fitness foundation with our comprehensive 16-week online programme.
    For just £48 (one-off payment), you'll receive a complete progressive training system
    that builds strength, endurance, and confidence. Perfect for busy professionals wanting
    to train on their own schedule with expert guidance.`,

    features: [
      { text: "Complete 16-week progressive programme", included: true, highlight: true },
      { text: "One-off payment of just £48", included: true, highlight: true },
      { text: "Train anywhere, anytime", included: true },
      { text: "Progressive strength training", included: true },
      { text: "Mobility and flexibility work", included: true },
      { text: "Core strengthening focus", included: true },
      { text: "Functional movement patterns", included: true },
      { text: "Full exercise video library", included: true },
      { text: "Community forum access", included: true },
      { text: "Option to upgrade to coaching", included: true }
    ],

    idealFor: [
      "Complete beginners",
      "Parents returning to fitness",
      "Those building foundation strength",
      "Budget-conscious parents"
    ],

    outcomes: [
      "Build fitness foundations",
      "Improve mobility and flexibility",
      "Develop exercise confidence",
      "Prepare for advanced training"
    ],

    testimonial: {
      quote: "Pathway to Endurance gave me the confidence to start. Now I'm ready for in-person training!",
      author: "Lisa T.",
      role: "New mum",
      result: "Progressed to Silver package"
    },

    cta: "Start 16 Weeks - £48",
    guarantee: "30-day money-back guarantee"
  }
};

// Social Runs - Free Community Events
export const socialRuns = {
  name: "Social Runs",
  description: "Free community runs throughout Norfolk",
  frequency: "Weekly events",
  locations: ["Dereham", "Norwich", "Thetford Forest"],
  features: [
    "All abilities welcome",
    "Family-friendly routes",
    "5K and 10K options",
    "Post-run coffee meetups",
    "Running technique tips"
  ],
  cta: "Join Our Running Community"
};

// Location Information
export const locationInfo = {
  venue: "Barrett's Health & Fitness",
  address: "Dereham, Norfolk",
  facilities: [
    "State-of-the-art gym",
    "Outdoor training space",
    "Free parking",
    "Shower facilities",
    "Café on-site"
  ],
  contact: {
    phone: "07990600958",
    email: "leah@aphroditefitness.co.uk",
    website: "www.aphroditefitness.co.uk"
  }
};

// Package Comparison Helper
export const packageComparison = {
  features: [
    {
      name: "Training Format",
      onlinePackage: "Online Coaching",
      smallGroup: "Group (max 6)",
      semiPrivate: "2:1 Personal",
      silver: "1:1 Personal",
      gold: "1:1 Personal",
      pathway: "Online"
    },
    {
      name: "Sessions per Week",
      onlinePackage: "App tracking + weekly coaching",
      smallGroup: "1 (scheduled)",
      semiPrivate: "1",
      silver: "1",
      gold: "2",
      pathway: "Self-paced"
    },
    {
      name: "Nutrition Guidance",
      onlinePackage: "Personalised",
      smallGroup: "Basic tips",
      semiPrivate: "Included",
      silver: "Personalised",
      gold: "Advanced",
      pathway: "Educational"
    },
    {
      name: "Coach Access",
      onlinePackage: "Daily + video weekly",
      smallGroup: "During sessions",
      semiPrivate: "Weekly",
      silver: "Weekly + support",
      gold: "2x weekly + daily",
      pathway: "Monthly Q&A"
    },
    {
      name: "Best For",
      onlinePackage: "Busy professionals",
      smallGroup: "Community & fun",
      semiPrivate: "Partner training",
      silver: "Personalisation",
      gold: "Rapid results",
      pathway: "Getting started"
    },
    {
      name: "Investment",
      onlinePackage: "£100/month",
      smallGroup: "£120 (3 months)",
      semiPrivate: "£90/month",
      silver: "£140/month",
      gold: "£250/month",
      pathway: "£48 (16 weeks)"
    }
  ]
};

// Pricing Messages
export const pricingMessages = {
  value: "Invest in your strength, energy, and confidence",
  guarantee: "Satisfaction guaranteed on all packages",
  flexibility: "Flexible payment options available",
  comparison: "Less than a coffee per day for Pathway programme",
  roi: "Average client gains 300% strength increase",
  familyValue: "Strong parents raise strong children"
};

// Urgency & Social Proof
export const urgencyContent = {
  limited: {
    smallGroup: "Only 2 spots left in morning group",
    silver: "3 spaces available this month",
    gold: "Limited availability - book consultation"
  },
  social: {
    totalClients: "500+ parents transformed",
    weeklyJoiners: "5 parents joined this week",
    retention: "85% still training after 6 months"
  }
};