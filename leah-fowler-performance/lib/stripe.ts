import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance (for API routes only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Client-side Stripe instance (for browser)
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Stripe Price IDs mapping (you'll need to update these with actual IDs from Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  foundation: {
    monthly: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY || 'price_foundation_monthly',
    quarterly: process.env.STRIPE_PRICE_FOUNDATION_QUARTERLY || 'price_foundation_quarterly',
    annual: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL || 'price_foundation_annual',
  },
  performance: {
    monthly: process.env.STRIPE_PRICE_PERFORMANCE_MONTHLY || 'price_performance_monthly',
    quarterly: process.env.STRIPE_PRICE_PERFORMANCE_QUARTERLY || 'price_performance_quarterly',
    annual: process.env.STRIPE_PRICE_PERFORMANCE_ANNUAL || 'price_performance_annual',
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_elite_monthly',
    quarterly: process.env.STRIPE_PRICE_ELITE_QUARTERLY || 'price_elite_quarterly',
    annual: process.env.STRIPE_PRICE_ELITE_ANNUAL || 'price_elite_annual',
  },
  youth: {
    monthly: process.env.STRIPE_PRICE_YOUTH_MONTHLY || 'price_youth_monthly',
    quarterly: process.env.STRIPE_PRICE_YOUTH_QUARTERLY || 'price_youth_quarterly',
    annual: process.env.STRIPE_PRICE_YOUTH_ANNUAL || 'price_youth_annual',
  },
}

// Helper function to get price ID
export function getStripePriceId(tier: string, period: 'monthly' | 'quarterly' | 'annual'): string {
  const tierPrices = STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS]
  if (!tierPrices) {
    throw new Error(`Invalid tier: ${tier}`)
  }
  return tierPrices[period]
}

// Helper function to calculate VAT (UK VAT is 20%)
export function calculateVAT(amount: number): { subtotal: number; vat: number; total: number } {
  const VAT_RATE = 0.20
  const subtotal = Math.round(amount / (1 + VAT_RATE)) // Price includes VAT
  const vat = amount - subtotal
  return {
    subtotal,
    vat,
    total: amount,
  }
}

// Format price for display
export function formatPrice(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// Convert price to Stripe format (pence)
export function toStripePence(amount: number): number {
  return Math.round(amount * 100)
}

// Convert from Stripe format (pence) to pounds
export function fromStripePence(amount: number): number {
  return amount / 100
}

// Validate webhook signature
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Create or get Stripe customer
export async function createOrRetrieveCustomer({
  email,
  userId,
  name,
}: {
  email: string
  userId: string
  name?: string
}) {
  // First, check if customer already exists in our database
  const { supabase } = await import('./supabase')

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (existingSubscription?.stripe_customer_id) {
    return existingSubscription.stripe_customer_id
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      supabase_user_id: userId,
    },
  })

  return customer.id
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

// Resume subscription
export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
  prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'create_prorations'
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: prorationBehavior,
  })
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['latest_invoice', 'customer'],
  })
}

// Get customer portal URL
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}