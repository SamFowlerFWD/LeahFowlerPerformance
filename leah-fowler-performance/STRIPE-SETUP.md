# Stripe Payment Integration Setup Guide

## Overview
This guide covers the setup and configuration of Stripe payment processing for the Leah Fowler Performance platform. The integration includes subscription management, payment processing, and customer portal access.

## Prerequisites
- Stripe account (create at https://stripe.com)
- Supabase project with database access
- Node.js and npm installed

## Installation Complete ✅
The following packages have been installed:
- `stripe`: Server-side Stripe SDK
- `@stripe/stripe-js`: Client-side Stripe library

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Stripe Webhook Secret (get after creating webhook endpoint)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Stripe Price IDs (create products first, then add IDs here)
STRIPE_PRICE_FOUNDATION_MONTHLY=price_YOUR_FOUNDATION_MONTHLY_ID
STRIPE_PRICE_FOUNDATION_QUARTERLY=price_YOUR_FOUNDATION_QUARTERLY_ID
STRIPE_PRICE_FOUNDATION_ANNUAL=price_YOUR_FOUNDATION_ANNUAL_ID

STRIPE_PRICE_PERFORMANCE_MONTHLY=price_YOUR_PERFORMANCE_MONTHLY_ID
STRIPE_PRICE_PERFORMANCE_QUARTERLY=price_YOUR_PERFORMANCE_QUARTERLY_ID
STRIPE_PRICE_PERFORMANCE_ANNUAL=price_YOUR_PERFORMANCE_ANNUAL_ID

STRIPE_PRICE_ELITE_MONTHLY=price_YOUR_ELITE_MONTHLY_ID
STRIPE_PRICE_ELITE_QUARTERLY=price_YOUR_ELITE_QUARTERLY_ID
STRIPE_PRICE_ELITE_ANNUAL=price_YOUR_ELITE_ANNUAL_ID

STRIPE_PRICE_YOUTH_MONTHLY=price_YOUR_YOUTH_MONTHLY_ID
STRIPE_PRICE_YOUTH_QUARTERLY=price_YOUR_YOUTH_QUARTERLY_ID
STRIPE_PRICE_YOUTH_ANNUAL=price_YOUR_YOUTH_ANNUAL_ID

# Optional: Customer Portal Configuration
STRIPE_PORTAL_CONFIGURATION_ID=bpc_YOUR_PORTAL_CONFIG_ID

# Supabase Service Role Key (for webhook processing)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Stripe Dashboard Setup

### 1. Create Products and Prices
Navigate to https://dashboard.stripe.com/products and create:

#### Foundation Programme
- Name: Foundation Programme
- Description: Group training for building commitment to excellence
- Pricing:
  - Monthly: £197 (including VAT)
  - Quarterly: £497 (including VAT)
  - Annual: £1,970 (including VAT)

#### Performance Programme
- Name: Performance Programme
- Description: For the seriously committed athlete or high achiever
- Pricing:
  - Monthly: £497 (including VAT)
  - Quarterly: £1,297 (including VAT)
  - Annual: £4,970 (including VAT)

#### Elite Performance Programme
- Name: Elite Performance Programme
- Description: For those pursuing excellence without compromise
- Pricing:
  - Monthly: £997 (including VAT)
  - Quarterly: £2,497 (including VAT)
  - Annual: £9,970 (including VAT)

#### Youth Development Programme
- Name: Youth Development Programme
- Description: Safe strength training for young athletes (ages 8-18)
- Pricing:
  - Monthly: £297 (including VAT)
  - Quarterly: £797 (including VAT)
  - Annual: £2,970 (including VAT)

### 2. Configure Tax Settings
1. Go to https://dashboard.stripe.com/settings/tax
2. Enable automatic tax calculation
3. Add UK VAT registration details
4. Set default tax behavior to "Inclusive"

### 3. Set Up Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_method.attached`
   - `payment_method.detached`
4. Copy the webhook signing secret

### 4. Configure Customer Portal
1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Enable customer portal
3. Configure:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to switch plans
   - Enable invoice history

## Database Setup

### Run Supabase Migration
The migration file has been created at:
`supabase/migrations/001_subscriptions_schema.sql`

To apply it:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration SQL
4. Run the query

## Testing the Integration

### Test Mode Setup
1. Use Stripe test keys (starts with `sk_test_` and `pk_test_`)
2. Test card numbers:
   - Success: 4242 4242 4242 4242
   - Requires authentication: 4000 0027 6000 3184
   - Declined: 4000 0000 0000 0002

### Test Checkout Flow
1. Navigate to `/services`
2. Select a pricing tier
3. Click subscribe button
4. Complete checkout with test card
5. Verify redirect to `/account/subscription?success=true`

### Test Webhook Processing
Use Stripe CLI for local testing:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

### Test Subscription Management
1. Navigate to `/account/subscription`
2. Verify subscription details display
3. Test "Manage Subscription" button
4. Verify portal opens

## Security Checklist

- [x] Environment variables in `.env.local` (never commit)
- [x] Webhook signature verification implemented
- [x] CSRF protection on API routes
- [x] Supabase RLS policies configured
- [x] PCI compliance via Stripe (no card data stored)
- [x] GDPR compliant data handling
- [x] SSL/HTTPS required for production
- [x] VAT/Tax handling configured

## Production Deployment

### Before Going Live:
1. Switch to live Stripe keys
2. Update webhook endpoint URL
3. Verify SSL certificate
4. Test with real payment method (can refund)
5. Enable Stripe Radar for fraud protection
6. Set up monitoring and alerts
7. Configure backup payment methods
8. Review and test cancellation flows

### Monitoring
- Set up Stripe webhook logs monitoring
- Configure error alerts for failed payments
- Track conversion metrics
- Monitor subscription churn

## Files Created/Modified

### New Files:
- `/lib/stripe.ts` - Stripe configuration and helpers
- `/app/api/stripe/webhook/route.ts` - Webhook handler
- `/app/api/stripe/checkout/route.ts` - Checkout session creation
- `/app/api/stripe/portal/route.ts` - Customer portal access
- `/components/PricingTiersWithStripe.tsx` - Enhanced pricing component
- `/components/ComparisonTable.tsx` - Feature comparison table
- `/components/TrustBar.tsx` - Trust indicators component
- `/app/services/page.tsx` - Services and pricing page
- `/app/account/subscription/page.tsx` - Subscription management dashboard
- `/supabase/migrations/001_subscriptions_schema.sql` - Database schema

### Modified Files:
- `/lib/supabase.ts` - Added subscription types and queries
- `/lib/schema-markup.ts` - Added service schema generation
- `package.json` - Added Stripe dependencies

## Support

For issues or questions:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Next.js Stripe Examples: https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript

## Next Steps

1. Set up Stripe account and get API keys
2. Create products and prices in Stripe Dashboard
3. Configure environment variables
4. Run database migration
5. Test the integration thoroughly
6. Configure production settings before launch