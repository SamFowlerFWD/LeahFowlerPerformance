"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Star,
  Crown,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Brain,
  Calendar,
  Phone,
  BarChart,
  Loader2,
  Target,
  Dumbbell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStripe } from '@/lib/stripe'
import { formatPrice } from '@/lib/stripe'
import { useRouter } from 'next/navigation'
import { aphroditeFitnessPackages } from '@/content/seo/aphrodite-pricing-content'

interface PricingTier {
  name: string
  slug: string
  price: number
  currency: string
  period: string
  billing: 'monthly' | 'one-time'
  description: string
  badge?: string
  features: {
    text: string
    included: boolean
    highlight?: boolean
  }[]
  cta: string
  popular: boolean
  color: 'gold' | 'sage' | 'navy'
  icon: React.ReactNode
  guarantee: string
}

interface PricingTiersWithStripeProps {
  userId?: string
  userEmail?: string
  userName?: string
}

export default function PricingTiersWithStripe({ userId, userEmail, userName }: PricingTiersWithStripeProps) {
  const [loadingTier, setLoadingTier] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const getIcon = (color: string) => {
    switch(color) {
      case 'gold': return <Crown className="h-6 w-6" />
      case 'sage': return <Dumbbell className="h-6 w-6" />
      case 'navy': return <Target className="h-6 w-6" />
      default: return <Star className="h-6 w-6" />
    }
  }

  // Convert packages to tier format
  const tiers: PricingTier[] = [
    // Pathway to Endurance - Entry Level Online
    {
      name: aphroditeFitnessPackages.pathwayToEndurance.name,
      slug: aphroditeFitnessPackages.pathwayToEndurance.slug,
      price: aphroditeFitnessPackages.pathwayToEndurance.price,
      currency: aphroditeFitnessPackages.pathwayToEndurance.currency,
      period: aphroditeFitnessPackages.pathwayToEndurance.period,
      billing: 'monthly' as const,
      description: aphroditeFitnessPackages.pathwayToEndurance.shortDescription,
      features: aphroditeFitnessPackages.pathwayToEndurance.features.slice(0, 10),
      cta: aphroditeFitnessPackages.pathwayToEndurance.cta,
      popular: false,
      color: 'navy' as const,
      icon: getIcon('navy'),
      guarantee: aphroditeFitnessPackages.pathwayToEndurance.guarantee
    },
    // Flexi Coaching - Flexible App-Based
    {
      name: aphroditeFitnessPackages.flexiCoaching.name,
      slug: aphroditeFitnessPackages.flexiCoaching.slug,
      price: aphroditeFitnessPackages.flexiCoaching.price,
      currency: aphroditeFitnessPackages.flexiCoaching.currency,
      period: aphroditeFitnessPackages.flexiCoaching.period,
      billing: 'monthly' as const,
      description: aphroditeFitnessPackages.flexiCoaching.shortDescription,
      features: aphroditeFitnessPackages.flexiCoaching.features.slice(0, 10),
      cta: aphroditeFitnessPackages.flexiCoaching.cta,
      popular: false,
      color: 'sage' as const,
      icon: getIcon('sage'),
      guarantee: aphroditeFitnessPackages.flexiCoaching.guarantee
    },
    // Semi-Private - Partner Training
    {
      name: aphroditeFitnessPackages.semiPrivate.name,
      slug: aphroditeFitnessPackages.semiPrivate.slug,
      price: aphroditeFitnessPackages.semiPrivate.price,
      currency: aphroditeFitnessPackages.semiPrivate.currency,
      period: aphroditeFitnessPackages.semiPrivate.period,
      billing: 'monthly' as const,
      description: aphroditeFitnessPackages.semiPrivate.shortDescription,
      badge: aphroditeFitnessPackages.semiPrivate.badge,
      features: aphroditeFitnessPackages.semiPrivate.features.slice(0, 10),
      cta: aphroditeFitnessPackages.semiPrivate.cta,
      popular: false,
      color: 'sage' as const,
      icon: getIcon('sage'),
      guarantee: aphroditeFitnessPackages.semiPrivate.guarantee
    },
    // Small Group Training
    {
      name: aphroditeFitnessPackages.smallGroup.name,
      slug: aphroditeFitnessPackages.smallGroup.slug,
      price: aphroditeFitnessPackages.smallGroup.price,
      currency: aphroditeFitnessPackages.smallGroup.currency,
      period: ' for ' + aphroditeFitnessPackages.smallGroup.period,
      billing: 'one-time' as const,
      description: aphroditeFitnessPackages.smallGroup.shortDescription,
      features: aphroditeFitnessPackages.smallGroup.features.slice(0, 10),
      cta: aphroditeFitnessPackages.smallGroup.cta,
      popular: false,
      color: 'navy' as const,
      icon: <Users className="h-6 w-6" />,
      guarantee: aphroditeFitnessPackages.smallGroup.guarantee
    },
    // Silver - Most Popular
    {
      name: aphroditeFitnessPackages.silver.name,
      slug: aphroditeFitnessPackages.silver.slug,
      price: aphroditeFitnessPackages.silver.price,
      currency: aphroditeFitnessPackages.silver.currency,
      period: aphroditeFitnessPackages.silver.period,
      billing: 'monthly' as const,
      description: aphroditeFitnessPackages.silver.shortDescription,
      badge: aphroditeFitnessPackages.silver.badge,
      features: aphroditeFitnessPackages.silver.features.slice(0, 10),
      cta: aphroditeFitnessPackages.silver.cta,
      popular: true,
      color: 'gold' as const,
      icon: <Star className="h-6 w-6" />,
      guarantee: aphroditeFitnessPackages.silver.guarantee
    },
    // Gold - Premium
    {
      name: aphroditeFitnessPackages.gold.name,
      slug: aphroditeFitnessPackages.gold.slug,
      price: aphroditeFitnessPackages.gold.price,
      currency: aphroditeFitnessPackages.gold.currency,
      period: aphroditeFitnessPackages.gold.period,
      billing: 'monthly' as const,
      description: aphroditeFitnessPackages.gold.shortDescription,
      badge: aphroditeFitnessPackages.gold.badge,
      features: aphroditeFitnessPackages.gold.features.slice(0, 10),
      cta: aphroditeFitnessPackages.gold.cta,
      popular: false,
      color: 'gold' as const,
      icon: <Crown className="h-6 w-6" />,
      guarantee: aphroditeFitnessPackages.gold.guarantee
    }
  ]

  const handleSubscribe = async (tierSlug: string) => {
    try {
      setLoadingTier(tierSlug)
      setError(null)

      const selectedTier = tiers.find(t => t.slug === tierSlug)
      if (!selectedTier) {
        throw new Error('Invalid tier selected')
      }

      // If no email is provided, redirect to contact form first
      if (!userEmail) {
        router.push(`/contact?intent=subscribe&tier=${tierSlug}`)
        return
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
},
        body: JSON.stringify({
          tier: tierSlug,
          billingPeriod: selectedTier.billing,
          userId,
          email: userEmail,
          name: userName
})
})

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe not loaded')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId
})

      if (stripeError) {
        throw stripeError
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
      setLoadingTier(null)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold font-medium text-sm mb-6">
            <TrendingUp className="h-4 w-4" />
            Transform Your Strength • Transform Your Life
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold mt-2">Training Journey</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Evidence-based strength training for busy parents. From £12/month online programmes
            to premium 1:1 coaching. Join 500+ parents who&apos;ve transformed their strength and confidence.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {tiers.map((tier) => {
            const vatInfo = React.useMemo(() => {
              const subtotal = Math.round(tier.price / 1.2)
              const vat = tier.price - subtotal
              return { subtotal, vat }
            }, [tier.price])

            return (
              <motion.div
                key={tier.slug}
                variants={cardVariants}
                className={`relative ${tier.popular ? 'lg:-mt-8' : ''}`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy text-xs font-bold shadow-lg">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div
                  className={`relative h-full p-6 rounded-2xl transition-all duration-500 hover:scale-105 ${
                    tier.popular
                      ? 'bg-gradient-to-br from-gold via-gold-light to-gold shadow-2xl border-2 border-gold/30'
                      : 'bg-white dark:bg-navy-dark shadow-xl hover:shadow-2xl border border-gray-200 dark:border-navy/30'
                  }`}
                >
                  {/* Tier Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${
                      tier.popular
                        ? 'bg-navy/10'
                        : tier.color === 'sage'
                        ? 'bg-sage/10'
                        : 'bg-gold/10'
                    }`}>
                      <div className={
                        tier.popular
                          ? 'text-navy'
                          : tier.color === 'sage'
                          ? 'text-sage'
                          : tier.color === 'navy'
                          ? 'text-navy dark:text-gold'
                          : 'text-gold'
                      }>
                        {tier.icon}
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${
                      tier.popular ? 'text-navy' : 'text-navy dark:text-white'
                    }`}>
                      {tier.name}
                    </h3>

                    <p className={`text-sm mb-6 ${
                      tier.popular ? 'text-navy/80' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div className="mb-2">
                      <span className={`text-4xl font-bold ${
                        tier.popular ? 'text-navy' : 'text-navy dark:text-white'
                      }`}>
                        {tier.currency}{tier.price}
                      </span>
                      <span className={`text-lg ${
                        tier.popular ? 'text-navy/70' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {tier.period}
                      </span>
                    </div>

                    {/* VAT Info */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Inc. VAT ({formatPrice(vatInfo.vat, 'GBP')})
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {tier.features.slice(0, 6).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {feature.included ? (
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              tier.popular ? 'bg-navy/10' : 'bg-gold/10'
                            }`}>
                              <Check className={`h-2.5 w-2.5 ${
                                tier.popular ? 'text-navy' : 'text-gold'
                              }`} />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">−</span>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs ${
                          feature.highlight
                            ? tier.popular ? 'font-bold text-navy' : 'font-bold text-navy dark:text-white'
                            : feature.included
                            ? tier.popular ? 'text-navy/80' : 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-600 line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div className="space-y-3">
                    <Button
                      onClick={() => handleSubscribe(tier.slug)}
                      disabled={loadingTier === tier.slug}
                      className={`w-full py-5 rounded-xl font-bold text-base transition-all duration-300 ${
                        tier.popular
                          ? 'bg-navy hover:bg-navy-dark text-white shadow-xl hover:shadow-2xl'
                          : tier.slug === 'elite'
                          ? 'bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy text-white'
                          : 'bg-gradient-to-r from-sage to-sage-light hover:from-sage-light hover:to-sage text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingTier === tier.slug ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className={
                        tier.popular ? 'text-navy/70' : 'text-gray-600 dark:text-gray-400'
                      }>
                        Secure payment via Stripe
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* What's Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-navy via-navy-dark to-navy-dark text-white"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">
            Every Programme Includes
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Brain className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Evidence-Based Methods</h4>
              <p className="text-sm text-white/70">Neuroscience-backed techniques proven to deliver results</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <BarChart className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Progress Tracking</h4>
              <p className="text-sm text-white/70">Real-time metrics to measure your transformation</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Elite Community</h4>
              <p className="text-sm text-white/70">Network with 500+ strong mothers</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Shield className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Secure Payments</h4>
              <p className="text-sm text-white/70">PCI-compliant payment processing with Stripe</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ / Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Not sure which programme is right for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/contact?intent=consultation')}
              variant="outline"
              className="px-8 py-6 rounded-xl font-medium border-2 border-gold text-gold hover:bg-gold hover:text-navy transition-all duration-300"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Consultation
            </Button>
            <Button
              onClick={() => router.push('/contact')}
              variant="outline"
              className="px-8 py-6 rounded-xl font-medium border-2 border-navy dark:border-gold text-navy dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Speak to an Advisor
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}