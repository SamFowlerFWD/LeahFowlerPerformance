# Critical Hero Text & Assessment Section Fix Agent

## Primary Objective
Fix two critical messaging failures: (1) Hero text animation creating grammatically nonsensical sentences, and (2) Assessment section saturated with identity/reclamation language instead of fitness-focused metrics.

## Critical Issues to Fix

### ISSUE 1: Hero Text Grammar Disaster
Current implementation catastrophically fails by:
- Taking headlines like "Get Properly Strong Again" (4 words)
- Removing last 2 words to show "Get Properly"
- Then showing kinetic word "Properly Strong" below
- Creating nonsense: "Get Properly" / "Properly Strong"

### ISSUE 2: Assessment Section Identity Overload
ModernAssessmentSection (46-52% viewport) contains:
- "Identity Clarity"
- "Identity reclamation score"
- "Energy Reclamation"
- "Warrior mother potential"
- "how much of yourself you've lost"

## Thinking Protocol
Before taking ANY action, you MUST:
1. Analyze complete grammatical structure of every hero headline combination
2. Map ALL instances of identity/reclamation language in assessment section
3. Design grammatically correct text splitting patterns for hero animation
4. Create fitness-focused assessment metrics mothers actually search for
5. Validate every change maintains conversational, friend-to-friend tone
6. Ensure all metrics are measurable, practical, and fitness-oriented

## MCP Tool Integration
- **Grep**: Find ALL instances of problematic identity language
- **Read**: Analyze current component implementations
- **MultiEdit**: Batch edit multiple sections efficiently
- **Write**: Update component files with corrections

Tool usage strategy:
- First scan for all identity/reclamation language occurrences
- Update hero text arrays for proper grammar
- Replace assessment metrics with fitness-focused alternatives
- Validate TypeScript typing remains intact

## Implementation Guidelines

### FIX 1: Hero Text Grammar Solution

#### CORRECT STRUCTURE:
```typescript
// Base phrases that NEED completion
const heroBaseText = [
  "Get Properly",      // Needs: "Strong Again"
  "Feel",              // Needs: "Strong Again" or "Like Yourself"
  "Become",            // Needs: "Unstoppable" or "Properly Strong"
  "Build Real",        // Needs: "Strength" or "Fitness"
  "Train Smart, Get"   // Needs: "Strong" or "Results"
]

// Completions that make grammatical sense
const kineticCompletions = [
  "Strong Again",
  "Like Yourself",
  "Unstoppable",
  "Strength Daily",
  "Properly Fit"
]

// Alternative approach - Complete sentences split naturally:
const heroSentences = [
  { base: "Get", completion: "Properly Strong" },
  { base: "Feel", completion: "Fit Again" },
  { base: "Become", completion: "Unstoppable" },
  { base: "Build", completion: "Real Strength" },
  { base: "Train Smart,", completion: "Get Strong" }
]
```

#### Implementation Fix in PremiumHeroWithImage.tsx:
```typescript
// Remove the complex split logic at line 228
// Replace with simple base + completion display:

<span className="block mb-3">{heroSentences[currentIndex].base}</span>
<span className="block kinetic-text">
  {heroSentences[currentIndex].completion}
</span>
```

### FIX 2: Assessment Section De-Identity

#### REPLACE ALL INSTANCES:
```typescript
const replacements = {
  // OLD → NEW
  "Identity Clarity": "Strength Baseline",
  "Discover how much of yourself you've lost": "See where your fitness currently stands",
  "Identity reclamation score": "Strength improvement potential",
  "Strength Potential": "Training Capacity",
  "hidden warrior strength": "untapped physical potential",
  "Warrior mother potential": "Athletic capability score",
  "Mother Load Balance": "Training Schedule Fit",
  "create space for yourself": "find time to train",
  "Energy Reclamation": "Energy Optimisation",
  "energy drains": "fatigue patterns",
  "exhausted to energised": "tired to energetic",
  "Transformation readiness": "Training readiness score"
}
```

#### NEW FITNESS-FOCUSED ASSESSMENT AREAS:
```typescript
const assessmentAreas = [
  {
    icon: BarChart3,
    title: 'Current Fitness Level',
    description: 'Get a clear picture of your starting point and potential gains',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    features: [
      'Baseline strength test',
      'Movement quality check',
      'Recovery capacity'
    ],
    metrics: 'Strength improvement potential'
  },
  {
    icon: Target,
    title: 'Training Capacity',
    description: 'Understand what your body can handle and how to progress safely',
    color: 'from-gold to-gold-light',
    bgColor: 'bg-gold/10',
    features: [
      'Physical readiness',
      'Available training time',
      'Progressive overload plan'
    ],
    metrics: 'Personalised training level'
  },
  {
    icon: Users,
    title: 'Programme Match',
    description: 'Find the right training approach for your life and goals',
    color: 'from-sage to-sage-light',
    bgColor: 'bg-sage/10',
    features: [
      'Schedule compatibility',
      'Training style preference',
      'Support needs'
    ],
    metrics: 'Programme fit score'
  },
  {
    icon: Zap,
    title: 'Energy & Recovery',
    description: 'Optimise your training for maximum energy throughout the day',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    features: [
      'Current energy patterns',
      'Recovery requirements',
      'Nutrition guidance'
    ],
    metrics: 'Training readiness score'
  }
]
```

### Additional Fixes Required

#### Update Assessment Benefits:
```typescript
const benefits = [
  {
    icon: CheckCircle,
    text: 'Get your personalised strength baseline in 5 minutes'
  },
  {
    icon: TrendingUp,
    text: 'See exactly how strong you can become in 12 weeks'
  },
  {
    icon: Shield,
    text: 'Find the perfect programme for your schedule'
  },
  {
    icon: HeartHandshake,
    text: 'Match with the right support level for success'
  }
]
```

#### Update Assessment CTAs:
```typescript
// OLD: "Begin Your Identity Assessment"
// NEW: "Take the Strength Assessment"

// OLD: "Discover Who You Are Beyond 'Just Mum'"
// NEW: "Find Your Starting Point"

// OLD: "Start Your Reclamation Journey"
// NEW: "Get Your Fitness Plan"
```

## Success Criteria
□ Hero text reads naturally: "Get Properly" + "Strong Again" ✓
□ Zero instances of "identity", "reclaim", "warrior mother" in assessment
□ All metrics focus on measurable fitness outcomes
□ Conversational tone maintained throughout
□ No grammatically awkward text combinations
□ Assessment focuses on strength, fitness, energy - not feelings

## Validation Tests

### Grammar Test for Hero:
```
✓ "Get" + "Properly Strong" = Natural
✓ "Feel" + "Fit Again" = Natural
✓ "Become" + "Unstoppable" = Natural
✓ "Build" + "Real Strength" = Natural

✗ "Get Properly" + "Fit Mum" = Awkward
✗ "Feel Strong" + "Strong Again" = Redundant
```

### Language Test for Assessment:
Search and verify ZERO instances remain of:
- identity / Identity
- reclaim / reclamation / Reclamation
- warrior mother / Warrior
- "who you are"
- "lost yourself" / "find yourself"
- "beyond mum"
- "transformation" (unless referring to physical change)

## Implementation Checklist
- [ ] Fix hero text arrays in PremiumHeroWithImage.tsx
- [ ] Update display logic to show base + completion properly
- [ ] Replace all assessment areas in ModernAssessmentSection.tsx
- [ ] Update all benefits and CTAs to fitness-focused language
- [ ] Verify TypeScript interfaces remain properly typed
- [ ] Test all Framer Motion animations still function
- [ ] Confirm no identity language remains via grep search
- [ ] Validate hero text combinations all make grammatical sense

## Critical Note
The site MUST lead with FITNESS. Mothers are searching for "personal trainer", "strength training", "get fit after baby" - NOT "identity coach" or "reclamation journey". Fix these issues to align with what mothers actually search for while maintaining emotional resonance through practical, achievable fitness goals.