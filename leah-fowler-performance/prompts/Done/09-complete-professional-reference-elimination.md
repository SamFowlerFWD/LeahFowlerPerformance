# Complete Professional Reference Elimination Agent

## CRITICAL ISSUE - LINE 323
**ModernAssessmentSection.tsx Line 323 MUST be fixed:**
```tsx
// CURRENT (WRONG):
Join 2,847 professionals who've discovered their performance potential

// MUST BECOME:
Join 2,847 mothers who've discovered their strength potential
```

## Primary Objective
Systematically eliminate ALL professional/executive/business references from the entire Leah Fowler Performance website and transform it into a 100% mother-focused platform. Previous prompts missed critical instances - this prompt ensures ZERO professional references remain.

## Critical Thinking Protocol
Before taking ANY action, you MUST:
1. Search for ALL variations of professional terminology across ALL files
2. Create mother-centric replacements for every instance
3. Validate the 46-52% viewport area is completely mother-focused
4. Ensure Line 323 and similar stats references are fixed

## MCP Tool Integration

### Comprehensive Search Commands:
```bash
# Find ALL professional references
grep -r -i "professional\|executive\|business\|corporate\|career\|workplace\|office" --include="*.tsx" --include="*.ts"

# Find specific problematic line
grep -n "professionals who've discovered" components/ModernAssessmentSection.tsx

# Count remaining issues
grep -c "professional" components/*.tsx | grep -v ":0$"
```

## Systematic Replacement Map

### Priority 1: Exact Word Replacements
| Find | Replace With |
|------|-------------|
| professionals | mothers |
| professional | mother |
| executives | mums |
| executive | mum |
| businesswoman | mother |
| businesswomen | mothers |
| career woman | busy mum |
| working professional | working mother |

### Priority 2: Phrase Replacements
| Find | Replace With |
|------|-------------|
| "professionals who've discovered" | "mothers who've discovered" |
| "high-performing professionals" | "dedicated mothers" |
| "busy professionals" | "busy mums" |
| "professional women" | "mothers" |
| "executive coaching" | "strength coaching for mums" |
| "professional development" | "personal growth" |
| "career goals" | "fitness goals" |
| "workplace performance" | "daily energy" |

### Priority 3: Context Rewrites
| Component | Current | Fix To |
|-----------|---------|--------|
| ModernAssessmentSection.tsx:323 | "Join 2,847 professionals..." | "Join 2,847 mothers..." |
| Testimonials | "As a CEO..." | "As a mother of three..." |
| Programme descriptions | "For executives who..." | "For mothers who..." |
| Trust badges | "Trusted by professionals" | "Trusted by mothers" |

## Implementation Steps

### Step 1: Fix Critical Line 323
```tsx
// File: components/ModernAssessmentSection.tsx
// Line: 323
// CHANGE:
<p className="text-lg text-gray-600 dark:text-gray-400">
  Join <span className="font-bold text-gold">2,847</span> mothers who've discovered their strength potential this month
</p>
```

### Step 2: Fix All Assessment Section References
Check lines 1-350 of ModernAssessmentSection.tsx for any remaining:
- Professional
- Executive
- Business
- Career
- Corporate

### Step 3: Update Trust Sections
All trust indicators must reference mothers:
- "500+ mothers transformed"
- "Trusted by busy mums"
- "Norfolk's leading mother fitness coach"

### Step 4: Fix Testimonial Components
Every testimonial must reflect mother experiences:
```tsx
// BEFORE:
{ name: "Sarah Johnson", role: "CEO", ... }

// AFTER:
{ name: "Sarah Johnson", role: "Mother of 2", ... }
```

## Files Requiring Updates

### CRITICAL (Visible in 46-52% viewport):
1. `/components/ModernAssessmentSection.tsx` - LINE 323 IS CRITICAL
2. `/components/TrustBar.tsx`
3. `/components/HeroStatsSection.tsx`

### HIGH PRIORITY:
- `/components/PremiumTestimonialsSection.tsx`
- `/components/PricingTiers.tsx`
- `/components/WhyChooseSection.tsx`
- `/components/ProgrammesSection.tsx`
- `/components/ModernProgrammesSection.tsx`

### MUST ALSO CHECK:
- `/components/AssessmentTool.tsx`
- `/components/ExecutiveAssessmentTool.tsx` → Rename to `MotherAssessmentTool.tsx`
- `/components/SEOHead.tsx`
- `/components/Footer.tsx`
- All files in `/content/seo/`

## Validation Tests

### Test 1: No Professional References
```bash
# Should return 0 results
grep -r "professional" components/ --include="*.tsx" | grep -v "mother"
```

### Test 2: Mother References Present
```bash
# Should show multiple matches per component
grep -r "mother\|mum" components/ --include="*.tsx" | wc -l
# Expected: > 100 matches
```

### Test 3: Line 323 Specifically
```bash
# Must show "mothers" not "professionals"
sed -n '323p' components/ModernAssessmentSection.tsx
```

## Success Criteria
□ Line 323 says "mothers who've discovered" NOT "professionals who've discovered"
□ Zero instances of "professional" without mother context
□ Zero instances of "executive", "business", "corporate", "career"
□ All testimonials show "Mother of X" not job titles
□ All programme descriptions address mothers specifically
□ Trust indicators reference mothers/mums
□ Footer says "Strength Coach for Mothers" not "Performance Consultant"
□ Meta descriptions reference "mothers" and "mums"

## Critical Validation Checklist
- [ ] Line 323 of ModernAssessmentSection.tsx fixed
- [ ] All assessment benefits mention mothers
- [ ] Hero stats reference mothers
- [ ] Testimonial roles are mother-focused
- [ ] Programme names don't include professional terms
- [ ] Trust bar shows mother-specific achievements
- [ ] No "executive" in any component
- [ ] No "professional" except in "unprofessional" contexts
- [ ] No "business" except in "none of your business" contexts
- [ ] No "career" anywhere in the codebase

## Example Implementations

### Assessment Section Fix:
```tsx
// Line 323 fix:
<p className="text-lg text-gray-600 dark:text-gray-400">
  Join <span className="font-bold text-gold">2,847</span> mothers who've discovered their strength potential this month
</p>
```

### Testimonial Fix:
```tsx
const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Mother of 3", // NOT "CEO"
    location: "Norwich",
    achievement: "First 10K at 41",
    quote: "As a busy mum, I never thought..." // NOT "As an executive..."
  }
]
```

### Programme Description Fix:
```tsx
const programme = {
  title: "Strength for Busy Mums", // NOT "Executive Performance"
  description: "Build real strength that fits around school runs", // NOT "workplace demands"
  target: "Mothers ready to get strong" // NOT "professionals seeking fitness"
}
```

## CRITICAL REMINDER
The previous prompt (08-critical-hero-assessment-fixes.md) fixed many issues but MISSED Line 323 and other professional references. This prompt MUST catch everything. The site is for MOTHERS, not professionals. Every single reference must be updated or the rebrand fails.