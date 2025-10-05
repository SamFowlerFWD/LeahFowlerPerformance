# Typography System Guide

## Font Configuration

The Leah Fowler Performance Coach platform uses a carefully selected typography system optimised for performance and readability:

### Fonts

1. **Be Vietnam Pro (Regular 400)** - Headings
   - Clean, modern, professional
   - Used for all headings (H1-H6)
   - CSS variable: `--font-heading`
   - Tailwind class: `font-heading`

2. **Alegreya Sans (Light 300)** - Body Text
   - Readable, elegant, sophisticated
   - Used for all body text and paragraphs
   - CSS variable: `--font-body`
   - Tailwind class: `font-body` or `font-sans`

### Performance Optimisation

The fonts are loaded using Next.js's `next/font/google` which:
- ✅ Self-hosts fonts (zero external requests)
- ✅ Optimises font loading for Core Web Vitals
- ✅ Eliminates layout shift (CLS)
- ✅ Uses `display: swap` for immediate text visibility
- ✅ Only loads required weights (400 for headings, 300 for body)

## Usage Examples

### Headings

```tsx
// H1 - Hero headings
<h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal">
  Optimise Your Performance
</h1>

// H2 - Section headings
<h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-normal">
  Data-Driven Results
</h2>

// H3 - Subsection headings
<h3 className="font-heading text-3xl md:text-4xl font-normal">
  Evidence-Based Training
</h3>

// H4 - Card headings
<h4 className="font-heading text-2xl md:text-3xl font-normal">
  Your Performance Journey
</h4>

// H5 - Component headings
<h5 className="font-heading text-xl md:text-2xl font-normal">
  Client Success Stories
</h5>

// H6 - Small headings
<h6 className="font-heading text-lg md:text-xl font-normal">
  Programme Details
</h6>
```

### Body Text

```tsx
// Paragraph - Standard body text
<p className="font-body text-base md:text-lg leading-relaxed">
  Transform your performance with evidence-based training programmes...
</p>

// Large paragraph - Featured text
<p className="font-body text-lg md:text-xl leading-relaxed">
  Leah Fowler is a performance consultant specialising in...
</p>

// Small text - Captions, metadata
<p className="font-body text-sm md:text-base leading-normal">
  Published: 5th October 2025
</p>
```

### Button Text

```tsx
// Primary button - Use heading font for prominence
<button className="font-heading text-base md:text-lg">
  Book Consultation
</button>

// Secondary button - Use body font
<button className="font-body text-base">
  Learn More
</button>
```

### Navigation

```tsx
// Main navigation - Use heading font
<nav className="font-heading text-base md:text-lg">
  <a href="/">Services</a>
  <a href="/about">About</a>
</nav>

// Footer navigation - Use body font
<nav className="font-body text-sm md:text-base">
  <a href="/privacy">Privacy Policy</a>
</nav>
```

## Typography Scale

The project uses a comprehensive typography scale defined in `tailwind.config.js`:

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem | 1rem | Very small text, labels |
| `text-sm` | 0.875rem | 1.25rem | Small text, captions |
| `text-base` | 1rem | 1.5rem | Body text (default) |
| `text-lg` | 1.125rem | 1.75rem | Large body text |
| `text-xl` | 1.25rem | 1.75rem | H6, small headings |
| `text-2xl` | 1.5rem | 2rem | H5 |
| `text-3xl` | 1.875rem | 2.25rem | H4 |
| `text-4xl` | 2.25rem | 2.5rem | H3 |
| `text-5xl` | 3rem | 1.2 | H2 |
| `text-6xl` | 3.75rem | 1.1 | H1 |
| `text-7xl` | 4.5rem | 1.1 | Hero H1 (desktop) |
| `text-8xl` | 6rem | 1 | Display headings |
| `text-9xl` | 8rem | 1 | Oversized display |

## Line Height Guidelines

Use these line height utilities for optimal readability:

- `leading-tight` (1.1) - Large display headings
- `leading-snug` (1.25) - Headings H1-H3
- `leading-normal` (1.5) - Body text (default)
- `leading-relaxed` (1.625) - Large paragraphs, featured text
- `leading-loose` (1.75) - Maximum readability for long-form content
- `leading-premium` (1.8) - Premium feel for hero sections

## Letter Spacing

Apply letter spacing for refined typography:

- `tracking-tighter` (-0.05em) - Tight spacing for large headings
- `tracking-tight` (-0.025em) - Headings
- `tracking-normal` (0) - Default
- `tracking-wide` (0.025em) - Body text emphasis
- `tracking-premium` (0.02em) - Premium subtle spacing

## Best Practices

### DO:
✅ Use `font-heading` for all heading elements (H1-H6)
✅ Use `font-body` or `font-sans` for all body text
✅ Apply responsive typography with `text-base md:text-lg`
✅ Use appropriate line heights for readability
✅ Maintain consistency across all pages and components
✅ Test typography on mobile devices for readability

### DON'T:
❌ Mix heading and body fonts inappropriately
❌ Use font weights other than configured (400 for headings, 300 for body)
❌ Set fixed font sizes without responsive scaling
❌ Use tight line heights for body text
❌ Forget to test typography in dark mode

## Accessibility

Typography is configured for WCAG 2.1 AA compliance:

- Minimum font size: 16px (1rem) for body text
- Appropriate contrast ratios in both light and dark modes
- Sufficient line height for readability (minimum 1.5 for body text)
- Responsive scaling prevents text zoom issues
- Semantic HTML heading hierarchy maintained

## Performance Metrics

Target metrics with this typography system:

- **Font load time**: <100ms (self-hosted via Next.js)
- **Cumulative Layout Shift (CLS)**: 0 (fonts loaded with proper sizing)
- **First Contentful Paint (FCP)**: <1.8s
- **Largest Contentful Paint (LCP)**: <2.5s

## Examples in Context

### Hero Section
```tsx
<section className="py-hero-y px-hero-x">
  <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-normal mb-6 tracking-tight">
    Optimise Your Performance
  </h1>
  <p className="font-body text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl">
    Evidence-based performance coaching for high-achieving professionals
  </p>
</section>
```

### Card Component
```tsx
<div className="p-card bg-white dark:bg-navy rounded-premium">
  <h3 className="font-heading text-2xl md:text-3xl font-normal mb-4">
    1-to-1 Coaching
  </h3>
  <p className="font-body text-base md:text-lg leading-relaxed">
    Personalised performance optimisation with data-driven insights
  </p>
</div>
```

### Testimonial
```tsx
<blockquote className="p-6">
  <p className="font-body text-lg md:text-xl leading-relaxed italic mb-4">
    "Leah's data-driven approach transformed my performance both in the gym and at work."
  </p>
  <cite className="font-heading text-base not-italic">
    Sarah Mitchell, CEO
  </cite>
</blockquote>
```

## Migration from Previous Fonts

Previous configuration:
- ❌ Inter (replaced by Alegreya Sans Light 300)
- ❌ Playfair Display (replaced by Be Vietnam Pro Regular 400)

Update components by:
1. Replace `font-sans` with `font-body` (or keep as is - they're aliased)
2. Replace any `font-playfair` with `font-heading`
3. Remove any custom font weight classes (we use single weights now)
4. Test all pages for visual consistency

## Technical Implementation

### File Locations
- Font configuration: `/app/layout.tsx`
- Tailwind config: `/tailwind.config.js`
- Global styles: `/app/globals.css`

### CSS Variables
```css
:root {
  --font-heading: Be Vietnam Pro, system-ui, sans-serif;
  --font-body: Alegreya Sans, system-ui, sans-serif;
}
```

### Tailwind Classes
```javascript
fontFamily: {
  'heading': ['var(--font-heading)', 'system-ui', 'sans-serif'],
  'body': ['var(--font-body)', 'system-ui', 'sans-serif'],
  'sans': ['var(--font-body)', 'system-ui', 'sans-serif'],
}
```
