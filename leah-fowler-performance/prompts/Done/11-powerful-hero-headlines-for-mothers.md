# Powerful Hero Headlines for Mothers - Complete Transformation Agent

## Primary Objective
Replace weak, generic hero headlines with powerful, emotionally resonant messages that make mothers stop scrolling and think "that's exactly me" or "that's exactly what I want."

## Current Weak Headlines (MUST REPLACE)
```typescript
// THESE ARE FAILING BECAUSE THEY'RE GENERIC:
"Get Properly Strong" // Sounds like any gym
"Feel Fit Again" // Vague and uninspiring
"Become Unstoppable" // Corporate motivation poster
"Build Real Strength" // Says nothing specific
"Gain Full Energy" // Energy drink ad
"Stay Strong Always" // Meaningless platitude
```

## Thinking Protocol
Before creating ANY headline, you MUST:
1. **Picture the exact mother**: 38, three kids, looking in mirror at 6am
2. **Feel her exhaustion**: Can't race her 8-year-old anymore
3. **Understand her desire**: Wants to be the mum who CAN, not who watches
4. **Channel Leah's voice**: Mother of 3, Spartan finisher, gets it
5. **Test conversational flow**: Would this be said over coffee?

## MCP Tool Integration
- **Read**: Analyze PremiumHeroWithImage.tsx for current implementation
- **MultiEdit**: Update heroSentences array with new headlines
- **Bash**: Test build after headline updates
- **Write**: Save selected headlines to component

## Powerful Headline Options

### OPTION SET A: Single Complete Headlines (Recommended)
```typescript
const heroHeadlines = [
  "Be the Mum Who Races Them Up the Stairs",
  "Strong Enough for Piggybacks at 40",
  "From School Run Exhaustion to Spartan Strong",
  "Your Kids Deserve the Strongest Version of You"
]
```

### OPTION SET B: Pain Point to Transformation
```typescript
const heroHeadlines = [
  "Exhausted at 3pm? Not Anymore.",
  "Remember When You Had Energy? Let's Get It Back.",
  "Stop Watching. Start Doing. Get Strong.",
  "The Mum at Sports Day Everyone Asks About"
]
```

### OPTION SET C: Identity and Capability
```typescript
const heroHeadlines = [
  "You're Not Just 'Mum'. You're an Athlete.",
  "Stronger at 40 Than You Were at 20",
  "From Surviving Motherhood to Thriving In It",
  "Be Their Hero. Start With Being Your Own."
]
```

### OPTION SET D: Specific Achievements Focus
```typescript
const heroHeadlines = [
  "Your First Pull-Up Is Closer Than You Think",
  "Yes, You Can Do a Spartan Race After Kids",
  "10K at 40? Three Kids? Absolutely.",
  "Strong Mums Raise Strong Kids"
]
```

## Implementation Guidelines

### For PremiumHeroWithImage.tsx:
```typescript
// Replace the complex split structure with simple rotation
const heroHeadlines = [
  "Be the Mum Who Races Them Up the Stairs",
  "From School Run Exhaustion to Spartan Strong",
  "Strong Enough for Piggybacks at 40",
  "Your Kids Deserve the Strongest Version of You"
]

// Simple implementation - no split text needed
return (
  <motion.h1
    key={currentHeadline}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
  >
    {heroHeadlines[currentHeadline]}
  </motion.h1>
)
```

### Rotation Timing:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHeadline((prev) => (prev + 1) % heroHeadlines.length)
  }, 5000) // 5 seconds per headline - enough time to read and absorb
  return () => clearInterval(interval)
}, [])
```

## Validation Tests

### The Kitchen Test
Read it aloud. Would Leah say this to a friend over tea?
- ✅ "Be the mum who races them up the stairs"
- ❌ "Unlock your maternal potential" (too corporate)

### The Mirror Test
Would a tired mum see herself in these words?
- ✅ "Exhausted at 3pm? Not anymore."
- ❌ "Transform your paradigm" (meaningless)

### The Hope Test
Does it create excitement without false promises?
- ✅ "Your first pull-up is closer than you think"
- ❌ "Become superhuman" (unrealistic)

### The Specificity Test
Can they picture the exact moment?
- ✅ "Strong enough for piggybacks at 40"
- ❌ "Achieve your goals" (too vague)

## Language Guidelines

### Power Phrases That Work:
- "Be the mum who..."
- "Remember when you..."
- "Your kids will..."
- "At 40..." / "After 3 kids..."
- "From [specific pain] to [specific gain]"

### Banned Generic Phrases:
- "Unlock your potential"
- "Transform your life"
- "Discover your power"
- "Journey to wellness"
- "Elevate your performance"
- "Optimize your fitness"

## Success Criteria
□ Headlines make mothers stop scrolling
□ Each addresses specific mother experiences
□ Sound like friend-to-friend conversation
□ Create "that's me" recognition moment
□ Include specific, achievable outcomes
□ Rotate smoothly without animation complexity
□ Work at all viewport sizes
□ Generate emotional response without cheese

## Testing Protocol
1. Show headlines to 5 actual mothers
2. Ask: "Which one makes you want to know more?"
3. Track which generates most clicks
4. A/B test different rotation speeds
5. Monitor time on page after headline view

## Recommended Implementation
Start with **Option Set A** as it:
- Balances specific imagery with emotional connection
- Uses conversational language
- Addresses both pain and aspiration
- Includes Leah's Spartan achievement context

## Final Implementation Code
```typescript
// In PremiumHeroWithImage.tsx
const heroHeadlines = [
  "Be the Mum Who Races Them Up the Stairs",
  "From School Run Exhaustion to Spartan Strong",
  "Strong Enough for Piggybacks at 40",
  "Your Kids Deserve the Strongest Version of You"
]

// Remove complex heroSentences structure
// Remove split text animation
// Implement simple rotation with full headlines
```

These headlines will resonate because they're not about abstract fitness - they're about specific moments every mother has experienced: the stairs that leave you breathless, the piggyback you can't give anymore, the sports day where you're just watching. They paint a picture of what's possible without making unrealistic promises.