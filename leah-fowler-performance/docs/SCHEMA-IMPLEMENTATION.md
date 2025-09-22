# Schema.org Structured Data Implementation

## Overview

Comprehensive Schema.org markup implementation for Leah Fowler Performance website, optimised for UK market and local SEO in Norfolk/Dereham. The schema positions the business as a performance consultancy (not fitness training) targeting high-achieving professionals and executives.

## Implementation Details

### Files Created

1. **`/lib/schema-markup.ts`** - Complete schema definitions
2. **`/components/SchemaMarkup.tsx`** - Dynamic schema injection component
3. **`/app/layout.tsx`** - Updated to include schema component

### Schema Types Implemented

#### 1. Organization Schema
- Business identification and branding
- Contact information
- Location details (Dereham, Norfolk)
- Social media profiles
- Opening hours

#### 2. LocalBusiness Schema (ProfessionalService)
- Service area coverage (50-mile radius from Dereham)
- Price range: £39-999/month
- Service types and specialisations
- Aggregate rating (4.9/5 from 47 reviews)
- Local SEO optimisation for Norfolk

#### 3. Person Schema (Leah Fowler)
- Professional credentials
- Expertise areas
- Contact information
- Educational background
- Professional certifications

#### 4. Service Schemas (3 Tiers)
- **Foundation Programme** - £39/month
- **Accelerator Programme** - £399/month
- **Elite Programme** - £999/month
- Each includes detailed service offerings and delivery channels

#### 5. FAQ Schema
- 8 comprehensive Q&As covering:
  - Business differentiation
  - Location and service areas
  - Investment levels
  - Results timeline
  - Qualifications
  - Programme flexibility

#### 6. Course Schemas
- **Executive Wellness Mastery** - 12-week programme (£2,997)
- **Performance Foundation Programme** - 8-week programme (£497)
- Includes curriculum, duration, and certification details

#### 7. HowTo Schema
- 6-step performance optimisation process
- 90-day transformation timeline
- Required tools and resources
- Expected outcomes

#### 8. Additional Schemas
- **BreadcrumbList** - Site navigation structure
- **Event** - Workshop information
- **VideoObject** - Intro video metadata
- **Article** - Blog content structure
- **AggregateRating** - Review summary

## Key Features

### Local SEO Optimisation
- Geo-coordinates for Dereham location
- Service area definition (Norfolk, East Anglia, UK)
- Local business markup with opening hours
- UK-specific formatting (telephone, address)

### Business Positioning
- Positioned as "Performance Consultancy" not personal training
- Executive and professional focus
- Evidence-based methodology emphasis
- Premium pricing structure clearly defined

### UK English Compliance
- All text uses UK spelling (optimisation, programme, centre)
- UK date and time formats
- GBP currency specification
- GB country code usage

## Dynamic Implementation

The `SchemaMarkup` component dynamically selects appropriate schemas based on the current page:

- **Homepage**: Full schema set for maximum visibility
- **Programmes**: Service and course schemas
- **About**: Organization and person schemas
- **FAQ**: FAQ schema with common questions
- **Blog**: Article schema for content

## Testing and Validation

### Validation Tools
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/
3. Google Search Console for monitoring

### Expected Rich Results
- Knowledge Graph panel
- Business information card
- FAQ rich snippets
- Review stars in search results
- Service pricing information
- Event listings for workshops
- Course information cards

## Maintenance

### Regular Updates Required
- Review counts and ratings (monthly)
- Event dates for workshops
- Course availability and pricing
- Article schemas for new blog posts
- Service offerings and pricing changes

### Adding New Content

For new pages, update the `getPageType()` function in `SchemaMarkup.tsx`:

```typescript
if (pathname.includes('/new-section')) return 'new-section';
```

Then add corresponding schema in `schema-markup.ts`:

```typescript
case 'new-section':
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Add relevant schemas
    ]
  };
```

## SEO Impact

### Expected Benefits
1. **Enhanced SERP visibility** - Rich snippets and knowledge panels
2. **Local search dominance** - Strong presence for "Norfolk performance coach" queries
3. **Trust signals** - Reviews, credentials, and professional positioning
4. **Click-through rate improvement** - Rich results attract more clicks
5. **Voice search optimisation** - Structured data helps voice assistants

### Monitoring Metrics
- Rich result impressions in Search Console
- Click-through rates from SERPs
- Local pack appearances
- Featured snippet captures
- Knowledge panel displays

## Compliance

All schemas comply with:
- Google's structured data guidelines
- Schema.org specifications
- GDPR requirements (no personal data exposure)
- Accessibility standards (semantic markup)

## Next Steps

1. Deploy and test with Google Rich Results Test
2. Submit to Google Search Console
3. Monitor rich result performance
4. Update review counts monthly
5. Add event schemas for upcoming workshops
6. Create article schemas for each blog post
7. Implement product schemas if selling digital products

## Support

For schema updates or issues:
1. Validate changes with Google Rich Results Test
2. Check Schema.org documentation for new types
3. Monitor Search Console for errors
4. Update this documentation with changes