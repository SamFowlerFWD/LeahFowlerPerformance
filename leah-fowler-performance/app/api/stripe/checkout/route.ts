import { NextRequest, NextResponse } from 'next/server'
import { stripe, createOrRetrieveCustomer, getStripePriceId } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tier,
      billingPeriod,
      userId,
      email,
      name,
      successUrl,
      cancelUrl,
      discountCode
    } = body

    // Validate required fields
    if (!tier || !billingPeriod || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, billingPeriod, email' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['foundation', 'performance', 'elite', 'youth']
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Validate billing period
    const validPeriods = ['monthly', 'quarterly', 'annual']
    if (!validPeriods.includes(billingPeriod)) {
      return NextResponse.json(
        { error: 'Invalid billing period' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customerId = await createOrRetrieveCustomer({
      email,
      userId: userId || email, // Use email as fallback if no userId
      name,
    })

    // Get the correct price ID
    const priceId = getStripePriceId(tier, billingPeriod)

    // Build checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/account/subscription?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/services?cancelled=true`,
      client_reference_id: userId || undefined,
      metadata: {
        tier,
        billing_period: billingPeriod,
        user_id: userId || email,
      },
      subscription_data: {
        metadata: {
          tier,
          billing_period: billingPeriod,
          user_id: userId || email,
        },
      },
      // UK-specific settings
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
        required: 'if_supported',
      },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      // Strong Customer Authentication (SCA) compliance
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session',
        },
      },
      // Allow promotion codes
      allow_promotion_codes: !discountCode,
      consent_collection: {
        terms_of_service: 'required',
      },
    }

    // If a discount code is provided, apply it
    if (discountCode) {
      // First, check if the discount code exists in our database
      const { data: discount } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode)
        .eq('is_active', true)
        .single()

      if (discount) {
        // Check if discount applies to this tier
        if (discount.applies_to.length === 0 || discount.applies_to.includes(tier)) {
          // Check if discount is still valid
          const now = new Date()
          const validFrom = discount.valid_from ? new Date(discount.valid_from) : null
          const validUntil = discount.valid_until ? new Date(discount.valid_until) : null

          if ((!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)) {
            // Check usage limit
            if (!discount.max_uses || discount.uses_count < discount.max_uses) {
              // Apply the discount
              if (discount.stripe_coupon_id) {
                sessionParams.discounts = [
                  {
                    coupon: discount.stripe_coupon_id,
                  },
                ]
              }
            }
          }
        }
      }
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve session status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    })

    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      subscription: session.subscription,
      customer_email: session.customer_details?.email,
    })
  } catch (error) {
    console.error('Error retrieving session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}