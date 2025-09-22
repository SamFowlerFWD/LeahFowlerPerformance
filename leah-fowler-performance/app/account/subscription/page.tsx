'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Shield,
  TrendingUp,
  Receipt,
  Settings,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/stripe'
import { subscriptionQueries, invoiceQueries, paymentMethodQueries } from '@/lib/supabase'
import type { Subscription, Invoice, PaymentMethod } from '@/lib/supabase'

export default function SubscriptionDashboard() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [subscription, setSubscription] = React.useState<Subscription | null>(null)
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([])
  const [processingAction, setProcessingAction] = React.useState<string | null>(null)

  // Mock user ID for now - in production this would come from auth context
  const userId = 'mock-user-id'

  React.useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      // In production, these would make actual API calls
      // For now, using mock data
      const mockSubscription: Subscription = {
        id: '1',
        user_id: userId,
        stripe_customer_id: 'cus_mock',
        stripe_subscription_id: 'sub_mock',
        tier: 'performance',
        status: 'active',
        billing_period: 'monthly',
        price_gbp: 497,
        current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }
      setSubscription(mockSubscription)

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          user_id: userId,
          subscription_id: '1',
          stripe_invoice_id: 'inv_1',
          invoice_number: 'INV-2024-001',
          status: 'paid',
          amount_paid: 49700,
          amount_due: 49700,
          amount_remaining: 0,
          subtotal: 41417,
          tax: 8283,
          total: 49700,
          currency: 'gbp',
          description: 'Performance Programme - Monthly',
          period_start: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          period_end: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          paid_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setInvoices(mockInvoices)

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          user_id: userId,
          stripe_customer_id: 'cus_mock',
          stripe_payment_method_id: 'pm_mock',
          type: 'card',
          card_brand: 'visa',
          card_last4: '4242',
          card_exp_month: 12,
          card_exp_year: 2025,
          is_default: true,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      setPaymentMethods(mockPaymentMethods)
    } catch (error) {
      console.error('Failed to load subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setProcessingAction('portal')
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening portal:', error)
      setProcessingAction(null)
    }
  }

  const handleUpgrade = () => {
    router.push('/services')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTierDetails = (tier: string) => {
    const details = {
      foundation: {
        name: 'Foundation',
        color: 'text-sage',
        icon: '⚡',
      },
      performance: {
        name: 'Performance',
        color: 'text-gold',
        icon: '⭐',
      },
      elite: {
        name: 'Elite Performance',
        color: 'text-navy dark:text-gold',
        icon: '👑',
      },
      youth: {
        name: 'Youth Development',
        color: 'text-sage',
        icon: '👥',
      },
    }
    return details[tier as keyof typeof details] || details.foundation
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  const tierDetails = subscription ? getTierDetails(subscription.tier) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-dark py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">
            Subscription Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your subscription, billing, and payment methods
          </p>
        </div>

        {/* Success message */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300">
                Your subscription has been activated successfully!
              </p>
            </div>
          </motion.div>
        )}

        {subscription ? (
          <>
            {/* Current Plan Card */}
            <Card className="mb-8 border-2 border-gold/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Current Plan</CardTitle>
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl ${tierDetails?.color}`}>
                        {tierDetails?.icon}
                      </span>
                      <h2 className="text-3xl font-bold text-navy dark:text-white">
                        {tierDetails?.name}
                      </h2>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-navy dark:text-white">
                      {formatPrice(subscription.price_gbp, 'GBP')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      per {subscription.billing_period === 'annual' ? 'year' : subscription.billing_period === 'quarterly' ? 'quarter' : 'month'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Current Period
                    </p>
                    <p className="font-medium text-navy dark:text-white">
                      {subscription.current_period_start &&
                        new Date(subscription.current_period_start).toLocaleDateString('en-GB')}
                      {' - '}
                      {subscription.current_period_end &&
                        new Date(subscription.current_period_end).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Next Billing Date
                    </p>
                    <p className="font-medium text-navy dark:text-white">
                      {subscription.current_period_end &&
                        new Date(subscription.current_period_end).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Member Since
                    </p>
                    <p className="font-medium text-navy dark:text-white">
                      {new Date(subscription.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                {subscription.cancel_at_period_end && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Your subscription will end on {subscription.current_period_end &&
                          new Date(subscription.current_period_end).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    onClick={handleManageSubscription}
                    disabled={processingAction === 'portal'}
                    className="bg-navy hover:bg-navy-dark text-white"
                  >
                    {processingAction === 'portal' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Opening Portal...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Subscription
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleUpgrade}
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-navy"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Change Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Additional Information */}
            <Tabs defaultValue="invoices" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="invoices" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>
                      View and download your past invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length > 0 ? (
                      <div className="space-y-4">
                        {invoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-navy/30 hover:bg-gray-50 dark:hover:bg-navy/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-gold/10">
                                <Receipt className="h-5 w-5 text-gold" />
                              </div>
                              <div>
                                <p className="font-medium text-navy dark:text-white">
                                  {invoice.description || `Invoice ${invoice.invoice_number}`}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {invoice.paid_at &&
                                    new Date(invoice.paid_at).toLocaleDateString('en-GB')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-navy dark:text-white">
                                  {formatPrice(invoice.total / 100, 'GBP')}
                                </p>
                                <Badge className={getStatusColor(invoice.status)}>
                                  {invoice.status}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gold hover:text-gold-light"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No invoices yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods for subscriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-navy/30"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-navy/10 dark:bg-gold/10">
                                <CreditCard className="h-5 w-5 text-navy dark:text-gold" />
                              </div>
                              <div>
                                <p className="font-medium text-navy dark:text-white">
                                  {method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)} •••• {method.card_last4}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Expires {method.card_exp_month}/{method.card_exp_year}
                                </p>
                              </div>
                            </div>
                            {method.is_default && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Default
                              </Badge>
                            )}
                          </div>
                        ))}
                        <Button
                          onClick={handleManageSubscription}
                          variant="outline"
                          className="w-full"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add New Payment Method
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          No payment methods added
                        </p>
                        <Button
                          onClick={handleManageSubscription}
                          className="bg-gold hover:bg-gold-light text-navy"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* No Subscription Card */
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">
                    No Active Subscription
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose a programme to start your performance transformation journey
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/services')}
                  className="bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-xl"
                  size="lg"
                >
                  View Programmes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-navy rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your payment information is securely processed by Stripe. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}