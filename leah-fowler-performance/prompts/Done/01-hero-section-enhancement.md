# Elite Hero Section Enhancement Agent for Leah Fowler Performance

## Primary Objective
Transform the hero section of Leah Fowler Performance website into a premium, high-converting masterpiece that prominently features the new consultant imagery while maintaining sub-2-second load times and creating an immersive experience that immediately establishes credibility with data-driven executives.

## Thinking Protocol
Before taking ANY action, you MUST:
1. **Analyse the Complete Visual Architecture**
   - Map the existing hero component structure and all dependencies
   - Document current kinetic text animations and particle effect implementations
   - Identify all viewport breakpoints and responsive behaviour patterns
   - Measure baseline performance metrics for hero section load times
   - Audit current accessibility implementation against WCAG 2.1 AA

2. **Design the Hero Image Integration Strategy**
   - Calculate optimal image display dimensions for each breakpoint
   - Plan seamless integration with existing animations without visual conflicts
   - Design focal point preservation across all device sizes
   - Create visual hierarchy that guides the eye from imagery to text to CTA
   - Plan lazy-loading and progressive enhancement strategies

3. **Map Performance Optimisation Architecture**
   - Design image preloading strategy with priority hints
   - Plan srcset implementations for responsive images
   - Calculate Critical CSS for above-the-fold rendering
   - Design skeleton loading states for perceived performance
   - Plan intersection observer implementations for animation triggers

4. **Consider Edge Cases and Failure Modes**
   - Slow network conditions (3G/2G fallbacks)
   - JavaScript disabled scenarios
   - Screen reader navigation patterns
   - High contrast mode compatibility
   - Reduced motion preferences

5. **Plan Implementation Sequence**
   - Image integration with existing layout
   - Spacing and padding enhancements
   - Animation synchronisation
   - Performance optimisations
   - Accessibility validations

## MCP Tool Integration
Available MCP tools for this task:
- **Read**: Analyse existing hero component code, styles, and configurations
- **Grep**: Search for animation implementations, image references, and breakpoint definitions
- **Glob**: Locate all hero-related files including components, styles, and assets
- **Edit/MultiEdit**: Implement hero section enhancements across multiple files
- **Bash**: Run build processes, performance tests, and accessibility audits
- **WebSearch**: Research latest hero section patterns for performance consultancy sites

Tool usage strategy:
- Use Glob → Read to map complete hero section architecture
- Chain Grep → Read to understand animation and particle implementations
- Use MultiEdit for simultaneous updates across component, style, and config files
- Validate with Bash running Lighthouse CI and axe-core tests
- Implement WebP fallbacks using Edit with picture element strategy

## Sub-Agent Architecture
Orchestrate the following specialised sub-agents:

### Visual Design Agent
- **Responsibility**: Hero image integration and visual hierarchy optimisation
- **Input**: Current hero structure, new image assets, brand guidelines
- **Output**: Enhanced hero layout with prominent imagery and improved spacing
- **Validation**: Visual regression testing, design system compliance checks

### Performance Optimisation Agent
- **Responsibility**: Image loading optimisation and Core Web Vitals improvement
- **Input**: Current performance metrics, image assets, loading patterns
- **Output**: Optimised image delivery system with <2s load times
- **Validation**: Lighthouse scores, WebPageTest results, CrUX data

### Animation Orchestration Agent
- **Responsibility**: Synchronise image reveals with kinetic text and particles
- **Input**: Existing animation timelines, new image elements
- **Output**: Cohesive animation sequence that enhances rather than distracts
- **Validation**: 60fps animation performance, no layout shifts

### Accessibility Compliance Agent
- **Responsibility**: WCAG 2.1 AA compliance for all hero enhancements
- **Input**: Current accessibility implementation, new visual elements
- **Output**: Fully accessible hero with proper ARIA labels and keyboard navigation
- **Validation**: axe-core audit, screen reader testing, colour contrast checks

### Inter-Agent Communication Protocol
- Context sharing: JSON state objects passed between agents with current metrics
- Handoff procedure: Each agent validates previous agent's output before proceeding
- Conflict resolution: Performance metrics take precedence, then accessibility, then aesthetics

## Implementation Guidelines

### Hero Image Integration Strategy
```typescript
// Image configuration with art direction
interface HeroImageConfig {
  mobile: {
    src: '/images/hero/leah-fowler-performance-coach-norfolk.webp',
    aspect: '3:4',
    focal: { x: 50, y: 35 } // Percentage-based focal point
  },
  tablet: {
    src: '/images/hero/performance-consultant-norfolk-uk.webp',
    aspect: '16:10',
    focal: { x: 65, y: 50 }
  },
  desktop: {
    src: '/images/hero/performance-consultant-norfolk-uk.webp',
    aspect: '21:9',
    focal: { x: 70, y: 45 }
  }
}
```

### Visual Hierarchy Enhancement
- **Primary**: Hero images with subtle Ken Burns effect
- **Secondary**: Kinetic text animations with refined timing
- **Tertiary**: Particle effects as ambient enhancement
- **Quaternary**: CTA buttons with micro-interactions

### Spacing System (8-point grid)
```css
/* Mobile-first spacing scale */
--hero-padding-mobile: clamp(2rem, 5vw, 3rem);
--hero-padding-tablet: clamp(3rem, 6vw, 4rem);
--hero-padding-desktop: clamp(4rem, 7vw, 6rem);
--hero-image-offset: calc(var(--hero-padding) * -0.5); /* Bleed effect */
```

### Performance Requirements
- Largest Contentful Paint (LCP): <1.5s
- First Input Delay (FID): <50ms
- Cumulative Layout Shift (CLS): <0.05
- Total hero load time: <2s on 4G connection
- Image format: WebP with JPEG fallback
- Implement responsive images with srcset and sizes

### Animation Specifications
```javascript
// Stagger sequence for cohesive reveal
const animationTimeline = {
  heroImage: { start: 0, duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  particles: { start: 200, duration: 1000, easing: 'ease-out' },
  headline: { start: 400, duration: 600, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  subtext: { start: 600, duration: 500, easing: 'ease-out' },
  cta: { start: 800, duration: 400, easing: 'ease-out' }
}
```

### Accessibility Standards
- Alternative text for all hero images describing Leah Fowler's professional context
- Prefers-reduced-motion: disable Ken Burns and particle effects
- Colour contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text
- Focus indicators: 3px solid outline with 2px offset
- Semantic HTML: <section> with role="banner" and appropriate headings

### Brand Integration
```css
/* Premium colour application */
.hero-overlay {
  background: linear-gradient(
    135deg,
    hsla(225, 45%, 18%, 0.95) 0%, /* Navy with transparency */
    hsla(89, 24%, 54%, 0.1) 100%  /* Sage accent */
  );
}

.hero-accent {
  color: #FFD700; /* Gold for CTAs and highlights */
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
}
```

## Success Criteria
□ Hero images prominently displayed with >40% viewport coverage on desktop
□ Load time maintained under 2 seconds on 4G connection (measured via WebPageTest)
□ Visual hierarchy score >90% based on heatmap analysis
□ Perfect Lighthouse accessibility score (100)
□ Core Web Vitals all in "green" zone
□ Smooth 60fps animations across all supported devices
□ Zero layout shift after initial paint
□ Increased time-on-page by minimum 15% (current baseline required)
□ WCAG 2.1 AA compliance verified through automated and manual testing
□ Mobile experience rated 5/5 in user testing with target demographic

## Failure Recovery Protocol
If errors occur:
1. **Immediate Image Fallback**: Serve optimised JPEG if WebP fails with automatic format detection
2. **Progressive Enhancement**: Ensure hero functions without JavaScript using CSS-only fallbacks
3. **Performance Degradation**: Implement adaptive loading based on connection speed
4. **Animation Bailout**: Disable complex animations if frame rate drops below 30fps
5. **Documentation**: Log all performance anomalies to monitoring service with detailed metrics

## Codebase Integration Checklist
- [ ] Analysed existing Hero.tsx/jsx component structure and props
- [ ] Identified current animation libraries (Framer Motion, GSAP, etc.)
- [ ] Validated Tailwind configuration for custom spacing values
- [ ] Ensured Next.js Image component compatibility (if applicable)
- [ ] Confirmed build process handles WebP generation
- [ ] Documented particle system implementation method
- [ ] Verified existing lazy-loading strategy compatibility
- [ ] Checked current intersection observer usage patterns
- [ ] Validated responsive image breakpoints match design system
- [ ] Ensured UK English spelling in all user-facing text

## Advanced Optimisation Directives

### Image Preloading Strategy
```html
<!-- Preload critical hero image with responsive hints -->
<link rel="preload"
      as="image"
      type="image/webp"
      imagesrcset="/images/hero/performance-consultant-norfolk-uk.webp 1920w,
                   /images/hero/leah-fowler-performance-coach-norfolk.webp 768w"
      imagesizes="(max-width: 768px) 100vw, 50vw">
```

### Critical CSS Extraction
- Inline all hero styles in <head> for instant rendering
- Defer non-critical animations to post-load
- Use CSS containment for performance isolation

### Cursor-Specific Optimisations
- Structure hero component with clear prop interfaces for AI suggestions
- Use descriptive variable names following consultancy terminology
- Implement JSDoc comments for complex animation sequences
- Create modular sub-components for each hero element
- Export typed configuration objects for easy modification

Remember: This is an elite performance consultancy. Every pixel, every millisecond, and every interaction must exemplify excellence. The hero section is not just a visual element—it's a statement of competence that resonates with C-suite executives who measure everything.

Think step-by-step through the entire solution before implementing any code. Leverage all available MCP tools for maximum efficiency and reliability. Orchestrate specialised sub-agents for complex subtasks requiring domain expertise. Validate every assumption against the actual codebase before proceeding. Ensure all code is optimised for Cursor's AI-assisted development environment. Document your reasoning at each decision point for future reference. Consider the broader system impact of every change.