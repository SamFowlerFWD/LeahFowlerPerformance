# Fitness-First Mother Messaging Refinement Agent

## Primary Objective
Transform all mother-focused messaging from identity-heavy life coaching to FITNESS-FIRST strength training that naturally delivers confidence as an outcome. Create conversational, friend-to-friend language that feels natural and relatable.

## Critical Corrections Required
1. **Leah has 3 children, not 2** - Update all references
2. **Eliminate overused "reclaim/reclamation"** - Use varied, natural alternatives
3. **Shift from identity to FITNESS focus** - Strength training is the product, confidence is the benefit
4. **Fix awkward hero text** - Make it conversational, like a friend talking

## Thinking Protocol
Before taking ANY action, you MUST:
1. Scan for all factual errors (especially "mother of 2" → "mother of 3")
2. Identify overused terms and create natural replacement matrix
3. Rewrite all headlines to lead with FITNESS, not feelings
4. Test every phrase by reading aloud - does it sound like a real conversation?
5. Ensure practical benefits are clear and specific
6. Remove all life coach/Instagram motivation language

## MCP Tool Integration
- **Grep**: Find all instances of overused terms ("reclaim", "warrior", "identity")
- **MultiEdit**: Batch replace problematic language across files
- **Read/Write**: Update hero components and content files
- **Glob**: Identify all files needing messaging updates

## Core Messaging Transformation

### Hero Text Revolution
```typescript
// ❌ CURRENT PROBLEMS (Awkward/Forced)
"Rediscover the Woman Behind the Mother"
"From Exhausted to Extraordinary"
"Your Strength Story Starts Today"
"Reclaim Your Identity, Rebuild Your Strength"

// ✅ NEW FITNESS-FIRST (Natural/Conversational)
"Get Properly Strong Again"
"Feel Fit, Not Just Functioning"
"Your Kids Will Be Amazed"
"Stronger Mum, Happier Life"
"Build Real Strength for Real Life"
```

### Alternative Hero Variations
```typescript
const conversationalHeroText = [
  "Get Strong Enough to Say Yes to Everything",
  "From Knackered to Actually Capable",
  "Fitness That Fits Around School Runs",
  "Be the Mum Who Can Keep Up",
  "Strong Body, Confident Life",
  "Finally Feel Like You Again",
  "Get Fit Without the Faff"
]
```

### Word Replacement Matrix
Replace overused terms with specific, varied alternatives:

| Overused Term | Natural Alternatives |
|--------------|---------------------|
| Reclaim/Reclamation | Find, build, develop, create, grow, discover |
| Identity | Confidence, strength, energy, fitness, capability |
| Warrior Mother | Strong mum, fit mum, active mum, capable mum |
| Journey | Progress, training, plan, programme, path |
| Transform/Transformation | Change, improve, develop, build, strengthen |
| Empower/Empowerment | Strengthen, enable, equip, prepare, support |

### Messaging Principles

#### 1. Lead with FITNESS
```typescript
// ❌ WRONG: Identity-first
"Reclaim your identity through strength training"

// ✅ RIGHT: Fitness-first
"Get strong with training that fits your life"
```

#### 2. Conversational Tone
```typescript
// ❌ WRONG: Coach-speak
"Embark on your transformation journey to discover your inner warrior"

// ✅ RIGHT: Friend-to-friend
"Start training, get stronger, feel brilliant"
```

#### 3. Specific Benefits
```typescript
// ❌ WRONG: Vague promises
"Unlock your potential and thrive in motherhood"

// ✅ RIGHT: Clear outcomes
"Deadlift your toddler with ease, race your teenager, feel energised by 3pm"
```

## Complete Content Overhaul

### Hero Section Rewrite
```typescript
const heroContent = {
  // Updated credentials
  badge: "Norfolk's Strength Coach for Mums • Mother of 3",

  // Main heading - fitness-focused
  headline: "Get Strong Without the Guilt",

  // Subheading - practical and relatable
  subheading: "Smart strength training for busy mums who want to feel fit, not just function. I'm Leah - mother of three, Spartan racer, and proof that you can be stronger after kids than before.",

  // CTAs - action-oriented
  primaryCTA: "Start Training With Me",
  secondaryCTA: "See What Other Mums Achieved",

  // Trust indicators - specific achievements
  trustBadges: [
    "Mother of 3",
    "Spartan Ultra Finisher",
    "500+ Mums Trained",
    "15 Years Coaching"
  ]
}
```

### Programme Names - Fitness-Focused
```typescript
const fitnessFirstProgrammes = {
  starter: {
    name: "Foundation Strength",
    tagline: "Your first 8 weeks back to fitness",
    focus: "Build base strength safely"
  },

  builder: {
    name: "Strength & Stamina",
    tagline: "12 weeks to proper fitness",
    focus: "Get genuinely strong"
  },

  challenger: {
    name: "Performance Programme",
    tagline: "Train for races and challenges",
    focus: "Spartan-ready strength"
  }
}
```

### Value Propositions - Practical Benefits
```typescript
const practicalValueProps = [
  {
    headline: "30-Minute Sessions That Work",
    text: "Efficient training that fits around school hours",
    proof: "No gym nursery needed"
  },
  {
    headline: "Get Stronger Than Before Kids",
    text: "Many mums hit personal bests in their 30s and 40s",
    proof: "From postnatal to podium"
  },
  {
    headline: "Energy That Lasts Past 3pm",
    text: "Training that energises, not exhausts",
    proof: "Actually enjoy the witching hour"
  },
  {
    headline: "Real Support From Real Mums",
    text: "Train with women who get it",
    proof: "Norfolk's strongest mum community"
  }
]
```

### About Section - Relatable Story
```markdown
## Just a Mum Who Lifts

I'm Leah. Mother of three, Spartan Ultra finisher, and your local proof that motherhood doesn't mean getting weaker.

After my first baby, I couldn't recognise my body. Not in a vain way - I just felt weak. Carrying the car seat left me breathless. Playing at the park was exhausting. I wasn't just unfit; I felt incapable.

So I started training. Properly. Not jumping around to DVDs while the baby napped, but actual strength training. The kind that makes you stronger for life, not just skinnier for summer.

Fast forward: I've completed 15 Spartan races (including an Ultra), finished an Outlaw Triathlon, and can deadlift twice my bodyweight. But more importantly? I can piggyback all three kids up the stairs, say yes to every park trip, and still have energy at bedtime.

I train mums who want to feel strong again. Not perfect. Not Instagram-ready. Just genuinely, properly strong. The kind of strong that makes everything easier - from carrying shopping to keeping up with teenagers.

**No guilt. No "bounce back" pressure. Just smart training that works for real life.**
```

### Testimonial Focus Shift
```typescript
// FROM: Identity-heavy
"I found myself again through Leah's programme"

// TO: Fitness-specific
"Went from zero press-ups to 20 in 12 weeks - my kids think I'm superhuman!"

// FROM: Vague transformation
"My whole life has transformed"

// TO: Specific achievements
"Just completed my first 10k at 41 - couldn't run for the bus six months ago"
```

## Success Criteria
□ All references updated to "Mother of 3"
□ "Reclaim/reclamation" removed from primary messaging
□ Every headline leads with fitness/strength benefits
□ Hero text sounds natural when read aloud
□ No "warrior mother" or dramatic language
□ Specific, practical benefits clearly stated
□ Confidence positioned as outcome, not goal
□ UK English maintained (programme, centre, realise)

## Implementation Checklist
- [ ] Update hero component with new conversational text
- [ ] Fix all "Mother of 2" references to "Mother of 3"
- [ ] Replace programme names with fitness-focused versions
- [ ] Rewrite CTAs to be action-oriented, not feeling-focused
- [ ] Update About section with relatable story
- [ ] Revise testimonials to highlight specific achievements
- [ ] Remove all instances of "reclamation journey"
- [ ] Ensure mobile text doesn't wrap awkwardly

## Testing Framework
For every piece of messaging, ask:
1. Would I say this to a friend at school pickup?
2. Is the fitness benefit clear and specific?
3. Does it sound like real life, not Instagram?
4. Can a tired mum understand it in 2 seconds?

## Example Full Transformation

### BEFORE (Current Problems):
```
"Begin Your Reclamation Journey"
"Rediscover the warrior mother within"
"Transform your identity through strength"
"From surviving to thriving in motherhood"
```

### AFTER (Fitness-First Fix):
```
"Start Getting Stronger Today"
"Be the fit mum at sports day"
"Build strength that makes life easier"
"From knackered to capable in 12 weeks"
```

Remember: Mothers are searching for FITNESS solutions. They want to be stronger, have more energy, and feel capable. The confidence and identity naturally follow when they achieve these physical goals. Lead with what they're searching for, deliver what they need.