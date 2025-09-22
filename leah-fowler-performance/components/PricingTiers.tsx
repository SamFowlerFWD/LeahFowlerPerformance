"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, ArrowRight, Shield, TrendingUp, Users, Brain, Calendar, Phone, Video, FileText, BarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingTier {
  name: string
  slug: string
  price: number
  currency: string
  period: string
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
  bonus?: string
}

export default function PricingTiers() {
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'quarterly'>('monthly')

  const tiers: PricingTier[] = [
    {
      name: 'Foundation',
      slug: 'foundation',
      price: billingPeriod === 'monthly' ? 197 : 497,
      currency: '£',
      period: billingPeriod === 'monthly' ? '/month' : '/quarter',
      description: 'For those building their commitment to excellence',
      features: [
        { text: 'Group Training (max 6 people)', included: true },
        { text: 'Trainerize App Programming', included: true },
        { text: 'Monthly Progress Reviews', included: true },
        { text: 'Access to Exercise Library', included: true },
        { text: 'Community Support Group', included: true },
        { text: 'Commitment Tracking Tools', included: true },
        { text: '1-to-1 Coaching Sessions', included: false },
        { text: 'Customised Programming', included: false },
        { text: 'Nutrition Guidance', included: false },
        { text: 'WhatsApp Support', included: false }
      ],
      cta: 'Start Foundation',
      popular: false,
      color: 'sage',
      icon: <Zap className="h-6 w-6" />,
      guarantee: '30-day money-back guarantee'
    },
    {
      name: 'Performance',
      slug: 'performance',
      price: billingPeriod === 'monthly' ? 497 : 1297,
      currency: '£',
      period: billingPeriod === 'monthly' ? '/month' : '/quarter',
      description: 'For the seriously committed athlete or high achiever',
      badge: 'MOST POPULAR',
      features: [
        { text: 'Everything in Foundation, plus:', included: true, highlight: true },
        { text: 'Weekly 1-to-1 Coaching', included: true },
        { text: 'Fully Customised Programming', included: true },
        { text: 'Nutrition Optimisation Plan', included: true },
        { text: 'WhatsApp Support Access', included: true },
        { text: 'Competition Preparation', included: true },
        { text: 'Performance Testing & Metrics', included: true },
        { text: 'Recovery Protocol Design', included: true },
        { text: 'Monthly Performance Analysis', included: true },
        { text: 'Priority Booking Access', included: false }
      ],
      cta: 'Commit to Performance',
      popular: true,
      color: 'gold',
      icon: <Star className="h-6 w-6" />,
      guarantee: '60-day results guarantee',
      bonus: 'Save £198 with quarterly billing'
    },
    {
      name: 'Elite Performance',
      slug: 'elite',
      price: billingPeriod === 'monthly' ? 997 : 2497,
      currency: '£',
      period: billingPeriod === 'monthly' ? '/month' : '/quarter',
      description: 'For those pursuing excellence without compromise',
      features: [
        { text: 'Everything in Performance, plus:', included: true, highlight: true },
        { text: '2x Weekly Training Sessions', included: true },
        { text: 'Competition & Event Preparation', included: true },
        { text: 'Full Lifestyle Optimisation', included: true },
        { text: 'Daily WhatsApp Check-ins', included: true },
        { text: 'Quarterly Testing & Assessment', included: true },
        { text: 'Priority Access to All Services', included: true },
        { text: 'Family Member Discount (25%)', included: true },
        { text: 'VIP Events & Masterminds', included: true },
        { text: 'Lifetime Alumni Benefits', included: true }
      ],
      cta: 'Apply for Elite',
      popular: false,
      color: 'navy',
      icon: <Crown className="h-6 w-6" />,
      guarantee: '90-day transformation guarantee'
    },
    {
      name: 'Youth Development',
      slug: 'youth',
      price: billingPeriod === 'monthly' ? 297 : 797,
      currency: '£',
      period: billingPeriod === 'monthly' ? '/month' : '/quarter',
      description: 'Safe strength training for young athletes (ages 8-18)',
      badge: 'UNIQUE',
      features: [
        { text: 'Age-Appropriate Programming', included: true },
        { text: 'Sport-Specific Development', included: true },
        { text: '2x Weekly Group Sessions', included: true },
        { text: 'Long-Term Athletic Development', included: true },
        { text: 'Injury Prevention Focus', included: true },
        { text: 'Parent Education Included', included: true },
        { text: 'Quarterly Progress Testing', included: true },
        { text: 'Competition Preparation', included: true },
        { text: 'Nutritional Guidance for Growth', included: true },
        { text: 'Sibling Discount Available', included: true }
      ],
      cta: 'Develop Young Athletes',
      popular: false,
      color: 'sage',
      icon: <Users className="h-6 w-6" />,
      guarantee: 'Safe training guarantee',
      bonus: "Norfolk's only youth strength specialist"
    }
  ]

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
            Investment in Excellence
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold mt-2">Performance Path</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Evidence-based programmes designed for measurable transformation.
            Join 500+ mothers who've reclaimed their identity and strength.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-gray-100 dark:bg-navy-dark/50 border border-gray-200 dark:border-gold/20">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('quarterly')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'quarterly'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              Quarterly
              <span className="ml-2 text-xs text-gold dark:text-navy font-bold">Save 15%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {tiers.map((tier, index) => (
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
                className={`relative h-full p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                  tier.popular
                    ? 'bg-gradient-to-br from-gold via-gold-light to-gold shadow-2xl border-2 border-gold/30'
                    : 'bg-white dark:bg-navy-dark shadow-xl hover:shadow-2xl border border-gray-200 dark:border-navy/30'
                }`}
              >
                {/* Tier Header */}
                <div className="text-center mb-8">
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

                  <h3 className={`text-2xl font-bold mb-2 ${
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
                    <span className={`text-5xl font-bold ${
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

                  {tier.bonus && billingPeriod === 'quarterly' && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {tier.bonus}
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            tier.popular ? 'bg-navy/10' : 'bg-gold/10'
                          }`}>
                            <Check className={`h-3 w-3 ${
                              tier.popular ? 'text-navy' : 'text-gold'
                            }`} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-400">−</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-sm ${
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
                <motion.div className="space-y-4">
                  <Button
                    className={`w-full py-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      tier.popular
                        ? 'bg-navy hover:bg-navy-dark text-white shadow-xl hover:shadow-2xl'
                        : tier.name === 'Elite'
                        ? 'bg-gradient-to-r from-navy to-navy-dark hover:from-navy-dark hover:to-navy text-white'
                        : 'bg-gradient-to-r from-sage to-sage-light hover:from-sage-light hover:to-sage text-white'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Guarantee */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className={
                      tier.popular ? 'text-navy/70' : 'text-gray-600 dark:text-gray-400'
                    }>
                      {tier.guarantee}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
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
              <h4 className="font-semibold">Results Guarantee</h4>
              <p className="text-sm text-white/70">Measurable improvements or your money back</p>
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
              variant="outline"
              className="px-8 py-6 rounded-xl font-medium border-2 border-gold text-gold hover:bg-gold hover:text-navy transition-all duration-300"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Consultation
            </Button>
            <Button
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