// Aphrodite Fitness - Actual Package Structure from Welcome Pack
// SEO-optimized content for all training packages

export const aphroditeFitnessPackages = {
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

  // Flexi Coaching
  flexiCoaching: {
    id: "flexi-coaching",
    name: "Flexi Coaching",
    slug: "flexi",
    price: 80,
    currency: "£",
    period: "/month",
    billing: "monthly",
    tagline: "Train On Your Schedule",
    shortDescription: "App-delivered personalised programmes with regular coach check-ins",
    popular: false,
    color: "navy" as const,

    longDescription: `Perfect for busy parents who need flexibility. Your personalised programme is delivered
    via our app, allowing you to train when it suits you. With regular 1:1 coaching sessions and ongoing
    support, you'll have expert guidance without rigid scheduling constraints.`,

    features: [
      { text: "Personalised app-based programming", included: true, highlight: true },
      { text: "Train on your own schedule", included: true },
      { text: "1:1 coaching sessions every 4-6 weeks", included: true },
      { text: "Face-to-face or online sessions", included: true },
      { text: "App subscription included", included: true },
      { text: "Regular check-ins and reviews", included: true },
      { text: "Exercise video library", included: true },
      { text: "Progress tracking tools", included: true },
      { text: "WhatsApp support", included: true },
      { text: "Weekly group sessions", included: false }
    ],

    idealFor: [
      "Parents with unpredictable schedules",
      "Self-motivated individuals",
      "Those who travel frequently",
      "Parents wanting home workout options"
    ],

    outcomes: [
      "Flexibility to train anywhere",
      "Consistent progress tracking",
      "Personalised progression",
      "Sustainable fitness habits"
    ],

    testimonial: {
      quote: "Flexi Coaching lets me fit training around my hectic life. The app is brilliant and Leah's check-ins keep me accountable.",
      author: "James P.",
      role: "Dad of 3",
      result: "Fittest I've been since my 20s"
    },

    cta: "Start Flexi Training",
    guarantee: "30-day money-back guarantee"
  },

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
    popular: true,
    color: "gold" as const,
    badge: "MOST POPULAR",

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

  // Pathway to Endurance
  pathwayToEndurance: {
    id: "pathway-to-endurance",
    name: "Pathway to Endurance",
    slug: "pathway",
    price: 12,
    currency: "£",
    period: "/month",
    billing: "monthly",
    tagline: "Online Foundation Programme",
    shortDescription: "Build your fitness foundation with guided online training",
    popular: false,
    color: "navy" as const,

    longDescription: `Start your fitness journey with our online Pathway to Endurance programme.
    Designed to build strength and conditioning foundations through progressive training,
    perfect for parents beginning their fitness journey or returning after a break.`,

    features: [
      { text: "Complete online programme", included: true },
      { text: "Progressive strength training", included: true },
      { text: "Mobility and flexibility work", included: true },
      { text: "Core strengthening focus", included: true },
      { text: "Functional movement patterns", included: true },
      { text: "Self-paced progression", included: true },
      { text: "Video demonstrations", included: true },
      { text: "Community forum access", included: true },
      { text: "Monthly live Q&A sessions", included: true },
      { text: "Personal coaching", included: false }
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

    cta: "Start Your Pathway",
    guarantee: "7-day free trial"
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
      smallGroup: "Group (max 6)",
      flexi: "App-based",
      semiPrivate: "2:1 Personal",
      silver: "1:1 Personal",
      gold: "1:1 Personal",
      pathway: "Online"
    },
    {
      name: "Sessions per Week",
      smallGroup: "1 (scheduled)",
      flexi: "Flexible",
      semiPrivate: "1",
      silver: "1",
      gold: "2",
      pathway: "Self-paced"
    },
    {
      name: "Nutrition Guidance",
      smallGroup: "Basic tips",
      flexi: "App guidance",
      semiPrivate: "Included",
      silver: "Personalised",
      gold: "Advanced",
      pathway: "Educational"
    },
    {
      name: "Coach Access",
      smallGroup: "During sessions",
      flexi: "Monthly check-ins",
      semiPrivate: "Weekly",
      silver: "Weekly + support",
      gold: "2x weekly + daily",
      pathway: "Monthly Q&A"
    },
    {
      name: "Best For",
      smallGroup: "Community & fun",
      flexi: "Flexibility",
      semiPrivate: "Partner training",
      silver: "Personalisation",
      gold: "Rapid results",
      pathway: "Getting started"
    },
    {
      name: "Investment",
      smallGroup: "£120 (3 months)",
      flexi: "£80/month",
      semiPrivate: "£90/month",
      silver: "£140/month",
      gold: "£250/month",
      pathway: "£12/month"
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