# Hero Section Viewport Optimization Expert Agent

## Primary Objective
Transform the LeahFowlerPerformance website hero section to achieve perfect viewport containment (exactly 100vh) while eliminating all visual artifacts and strategically relocating floating elements for optimal user experience on standard 1366x768 displays.

## Critical Issues to Fix

### 1. Visual Artifacts in Upper Left
- Multiple floating/absolute positioned elements creating visual clutter
- Motion divs overlapping the 2-column layout
- Decorative particles interfering with content readability
- Premium floating badges competing for attention

### 2. Achievement Badge Relocation
**Current Issue** (lines 279-289 in PremiumHeroWithImage.tsx):
```tsx
// PROBLEMATIC - Creates floating distraction
<motion.div className="absolute top-20 right-10 lg:right-auto lg:left-[48%]">
  "From Zero Press-ups to Ultra Endurance"
</motion.div>
```
**Required Action**:
- Remove from hero section entirely
- Relocate to next section with centered positioning
- Convert to static element with premium styling

### 3. Viewport Overflow Problem
- Hero extends beyond 100vh on standard displays
- Content pushes below fold requiring scroll
- CTAs not fully visible on 1366x768 screens
- Excessive vertical spacing consuming viewport

## Thinking Protocol
Before implementing ANY changes, you MUST:
1. **Map all floating elements** - Document every absolute/fixed positioned div
2. **Calculate viewport budget** - Account for every pixel of vertical space
3. **Identify overflow culprits** - Find elements pushing beyond 100vh
4. **Design containment strategy** - Plan exact heights for all components
5. **Test on target viewport** - Validate on 1366x768 specifically

## MCP Tool Integration

### Discovery Phase:
```bash
# Find all problematic positioning
grep -n "absolute\|fixed\|relative.*top\|motion.*div" PremiumHeroWithImage.tsx

# Identify floating badges
grep -n "Badge\|floating\|hover.*scale" PremiumHeroWithImage.tsx

# Check viewport-related classes
grep -n "min-h-\|h-\[.*vh\]\|height" PremiumHeroWithImage.tsx
```

### Implementation Phase:
- Use `MultiEdit` to coordinate removal of multiple floating elements
- Apply `Edit` for precise viewport constraint implementation
- Validate with `Bash` running dev server on port 3003

## Implementation Strategy

### Phase 1: Remove Visual Artifacts
```tsx
// REMOVE these types of elements from hero:
<motion.div className="absolute top-20 right-10"> // Floating badges
<motion.div className="absolute top-0 left-0">    // Decorative overlays
<div className="absolute inset-0 pointer-events-none"> // Particle effects in wrong position
```

### Phase 2: Relocate Achievement Badge
```tsx
// CREATE new component for placement AFTER hero:
const AchievementBadge = () => (
  <div className="py-12 bg-gradient-to-b from-navy to-navy-dark">
    <motion.div
      className="max-w-md mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20">
        <span className="text-gold text-lg font-bold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          From Zero Press-ups to Ultra Endurance
        </span>
      </div>
    </motion.div>
  </div>
)
```

### Phase 3: Implement Viewport Constraints
```tsx
// HERO CONTAINER - Exactly 100vh, no more, no less
<motion.section className="h-screen max-h-screen overflow-hidden relative">
  {/* Desktop: Split Layout */}
  <div className="flex flex-col lg:flex-row h-full">

    {/* Content Side - Constrained height */}
    <div className="lg:w-1/2 h-full flex items-center px-6 lg:px-20">
      <div className="w-full max-w-2xl">
        {/* Reduced spacing between elements */}
        <Badge className="mb-6">...</Badge>           {/* was mb-10 */}
        <h1 className="mb-6">...</h1>                  {/* was mb-8 */}
        <p className="mb-8">...</p>                    {/* was mb-10 */}
        <div className="flex gap-4">...</div>          {/* CTAs */}
      </div>
    </div>

    {/* Image Side - Full height */}
    <div className="lg:w-1/2 h-full relative overflow-hidden">
      <Image fill className="object-cover" />
    </div>
  </div>
</motion.section>
```

## Specific Line-by-Line Fixes

### Lines to DELETE (causing artifacts):
- Lines 273-290: Floating badge with absolute positioning
- Lines 145-161: Floating particles over image (if overlapping content)
- Lines 177-192: Content-side particles (if creating visual noise)

### Lines to MODIFY:
- Line 110-113: Change to `className="h-screen max-h-screen overflow-hidden"`
- Line 115: Ensure flex container is `h-full`
- Line 166: Content container needs `h-full flex items-center`
- Line 211-238: Reduce all spacing (mb-10 → mb-6, mb-12 → mb-8, etc.)

### Lines to ADD:
- After hero section: New `<AchievementBadge />` component
- Viewport constraint classes throughout

## Validation Checklist
□ Hero height === exactly 100vh (use browser inspector)
□ No scrollbar appears on initial load
□ All CTAs fully visible without scrolling
□ No floating elements in upper left quadrant
□ Badge successfully relocated below hero
□ Tested on 1366x768 resolution
□ Mobile maintains 100vh constraint
□ Animations work within bounds
□ No content overflow or clipping

## Expected Outcome
1. **Clean hero section** - Zero visual artifacts or floating distractions
2. **Perfect viewport fit** - Fills exactly 100vh on all devices
3. **Strategic badge placement** - Moved below hero as featured credibility element
4. **Improved visual hierarchy** - Clear focus on headline and CTAs
5. **Professional presentation** - No overlapping or competing elements

## Testing Commands
```bash
# Run dev server
npm run dev

# Open at specific viewport
# Browser: Open DevTools, set responsive mode to 1366x768

# Validate height in console
document.querySelector('section').offsetHeight === window.innerHeight
# Should return: true
```

## Final Notes
The hero section is the first impression - it must be PERFECT. Every pixel counts in the 100vh budget. Remove anything that doesn't directly serve the conversion goal. The achievement badge will have MORE impact when given its own dedicated space below the hero rather than competing for attention as a floating element.

Remember: The user will provide a new hero image after these fixes are implemented. Ensure the image container is properly configured to accept any aspect ratio while maintaining the viewport constraints.