import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, constructWebhookEvent } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Create Supabase admin client for webhook processing
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Log webhook event
  await supabaseAdmin
    .from('webhook_events')
    .insert({
      stripe_event_id: event.id,
      type: event.type,
      data: event.data,
      processed: false,
    })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get the subscription and customer details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const customerId = session.customer as string
        const userId = session.client_reference_id || session.metadata?.user_id

        if (!userId) {
          throw new Error('User ID not found in session')
        }

        // Calculate prices in GBP
        const priceGbp = Math.round((subscription.items.data[0].price.unit_amount || 0) / 100)

        // Create subscription record in database
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            tier: session.metadata?.tier || 'foundation',
            status: subscription.status,
            billing_period: session.metadata?.billing_period || 'monthly',
            price_gbp: priceGbp,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            metadata: {
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_product_id: subscription.items.data[0].price.product,
            },
          })

        // Create subscription items
        for (const item of subscription.items.data) {
          await supabaseAdmin
            .from('subscription_items')
            .upsert({
              subscription_id: subscription.id,
              stripe_subscription_item_id: item.id,
              stripe_price_id: item.price.id,
              stripe_product_id: item.price.product as string,
              quantity: item.quantity,
            })
        }

        // Store payment method if available
        if (session.payment_method_types.includes('card')) {
          const paymentIntents = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 1,
          })

          if (paymentIntents.data.length > 0 && paymentIntents.data[0].payment_method) {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntents.data[0].payment_method as string
            )

            await supabaseAdmin
              .from('payment_methods')
              .upsert({
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_payment_method_id: paymentMethod.id,
                type: paymentMethod.type,
                card_brand: paymentMethod.card?.brand,
                card_last4: paymentMethod.card?.last4,
                card_exp_month: paymentMethod.card?.exp_month,
                card_exp_year: paymentMethod.card?.exp_year,
                is_default: true,
              })
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const priceGbp = Math.round((subscription.items.data[0].price.unit_amount || 0) / 100)

        // Update subscription in database
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            price_gbp: priceGbp,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            cancelled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Mark subscription as cancelled
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (!invoice.subscription) break

        // Store invoice in database
        await supabaseAdmin
          .from('invoices')
          .upsert({
            user_id: invoice.metadata?.user_id || invoice.customer_email,
            subscription_id: invoice.subscription as string,
            stripe_invoice_id: invoice.id,
            invoice_number: invoice.number,
            status: invoice.status || 'paid',
            amount_paid: invoice.amount_paid,
            amount_due: invoice.amount_due,
            amount_remaining: invoice.amount_remaining,
            subtotal: invoice.subtotal,
            tax: invoice.tax || 0,
            total: invoice.total,
            currency: invoice.currency,
            description: invoice.description,
            period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
            period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
            paid_at: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
            invoice_pdf: invoice.invoice_pdf,
            hosted_invoice_url: invoice.hosted_invoice_url,
            metadata: invoice.metadata,
          })

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (!invoice.subscription) break

        // Update subscription status
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
          })
          .eq('stripe_subscription_id', invoice.subscription as string)

        // Store failed invoice
        await supabaseAdmin
          .from('invoices')
          .upsert({
            user_id: invoice.metadata?.user_id || invoice.customer_email,
            subscription_id: invoice.subscription as string,
            stripe_invoice_id: invoice.id,
            invoice_number: invoice.number,
            status: invoice.status || 'open',
            amount_paid: invoice.amount_paid,
            amount_due: invoice.amount_due,
            amount_remaining: invoice.amount_remaining,
            subtotal: invoice.subtotal,
            tax: invoice.tax || 0,
            total: invoice.total,
            currency: invoice.currency,
            description: invoice.description,
            period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
            period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
            due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
            invoice_pdf: invoice.invoice_pdf,
            hosted_invoice_url: invoice.hosted_invoice_url,
            metadata: invoice.metadata,
          })

        // TODO: Send email notification to customer about failed payment

        break
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod

        if (!paymentMethod.customer) break

        const customer = await stripe.customers.retrieve(paymentMethod.customer as string)
        const userId = (customer as any).metadata?.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('payment_methods')
            .upsert({
              user_id: userId,
              stripe_customer_id: paymentMethod.customer as string,
              stripe_payment_method_id: paymentMethod.id,
              type: paymentMethod.type,
              card_brand: paymentMethod.card?.brand,
              card_last4: paymentMethod.card?.last4,
              card_exp_month: paymentMethod.card?.exp_month,
              card_exp_year: paymentMethod.card?.exp_year,
              is_default: false,
            })
        }

        break
      }

      case 'payment_method.detached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod

        await supabaseAdmin
          .from('payment_methods')
          .delete()
          .eq('stripe_payment_method_id', paymentMethod.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await supabaseAdmin
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)

    // Log error in webhook_events
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('stripe_event_id', event.id)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}