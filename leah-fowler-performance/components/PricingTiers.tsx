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
  Target,
  Dumbbell,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { aphroditeFitnessPackages } from '@/content/seo/aphrodite-pricing-content'

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

  const getIcon = (color: string) => {
    switch(color) {
      case 'gold': return <Crown className="h-6 w-6" />
      case 'sage': return <Dumbbell className="h-6 w-6" />
      case 'navy': return <Target className="h-6 w-6" />
      default: return <Star className="h-6 w-6" />
    }
  }

  // Convert packages to tier format with proper ordering
  const tiers: PricingTier[] = [
    // Pathway to Endurance - Entry Level Online
    {
      name: aphroditeFitnessPackages.pathwayToEndurance.name,
      slug: aphroditeFitnessPackages.pathwayToEndurance.slug,
      price: aphroditeFitnessPackages.pathwayToEndurance.price,
      currency: aphroditeFitnessPackages.pathwayToEndurance.currency,
      period: aphroditeFitnessPackages.pathwayToEndurance.period,
      description: aphroditeFitnessPackages.pathwayToEndurance.shortDescription,
      features: aphroditeFitnessPackages.pathwayToEndurance.features,
      cta: aphroditeFitnessPackages.pathwayToEndurance.cta,
      popular: false,
      color: 'navy' as 'gold' | 'sage' | 'navy',
      icon: getIcon('navy'),
      guarantee: aphroditeFitnessPackages.pathwayToEndurance.guarantee
    },
    // Semi-Private - Partner Training
    {
      name: aphroditeFitnessPackages.semiPrivate.name,
      slug: aphroditeFitnessPackages.semiPrivate.slug,
      price: aphroditeFitnessPackages.semiPrivate.price,
      currency: aphroditeFitnessPackages.semiPrivate.currency,
      period: aphroditeFitnessPackages.semiPrivate.period,
      description: aphroditeFitnessPackages.semiPrivate.shortDescription,
      badge: aphroditeFitnessPackages.semiPrivate.badge,
      features: aphroditeFitnessPackages.semiPrivate.features,
      cta: aphroditeFitnessPackages.semiPrivate.cta,
      popular: false,
      color: 'sage' as 'gold' | 'sage' | 'navy',
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
      description: aphroditeFitnessPackages.smallGroup.shortDescription,
      features: aphroditeFitnessPackages.smallGroup.features,
      cta: aphroditeFitnessPackages.smallGroup.cta,
      popular: false,
      color: 'navy' as 'gold' | 'sage' | 'navy',
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
      description: aphroditeFitnessPackages.silver.shortDescription,
      badge: aphroditeFitnessPackages.silver.badge,
      features: aphroditeFitnessPackages.silver.features,
      cta: aphroditeFitnessPackages.silver.cta,
      popular: true,
      color: 'gold' as 'gold' | 'sage' | 'navy',
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
      description: aphroditeFitnessPackages.gold.shortDescription,
      badge: aphroditeFitnessPackages.gold.badge,
      features: aphroditeFitnessPackages.gold.features,
      cta: aphroditeFitnessPackages.gold.cta,
      popular: false,
      color: 'gold' as 'gold' | 'sage' | 'navy',
      icon: <Crown className="h-6 w-6" />,
      guarantee: aphroditeFitnessPackages.gold.guarantee
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
            Transform Your Strength • Transform Your Life
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold mt-2">Training Journey</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Evidence-based strength training for busy parents. From £48 one-off online programmes
            to premium 1:1 coaching. Join 500+ parents who&apos;ve transformed their strength and confidence.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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

                  {tier.badge && tier.badge !== 'MOST POPULAR' && tier.badge !== 'PREMIUM' && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {tier.badge}
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
            Why Choose Aphrodite Fitness
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Brain className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Mother of 3</h4>
              <p className="text-sm text-white/70">I understand the unique challenges parents face</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Activity className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Spartan Athlete</h4>
              <p className="text-sm text-white/70">Elite performance expertise made accessible</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">500+ Parents Transformed</h4>
              <p className="text-sm text-white/70">Join a supportive community of strong parents</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Shield className="h-7 w-7 text-gold" />
              </div>
              <h4 className="font-semibold">Results Guaranteed</h4>
              <p className="text-sm text-white/70">Real strength gains or your money back</p>
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