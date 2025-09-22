"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Star, Crown, Zap, ArrowRight, Info } from 'lucide-react'
import { PremiumButton } from '@/components/ui/premium-button'
import { Badge } from '@/components/ui/badge'
import {
  fadeInUp,
  staggerContainer,
  luxuryScale,
  glowPulse,
  viewportSettings
} from '@/lib/animations'

const programmes = [
  {
    id: 'rediscovery',
    name: 'Foundation Strength',
    tagline: 'Build Your Base',
    price: '£197',
    period: '8 weeks',
    color: 'from-sage/20 to-sage/10',
    borderColor: 'border-sage/30',
    glowColor: 'shadow-sage/20',
    popular: false,
    features: [
      { name: 'Movement Assessment', included: true, detail: 'Full fitness evaluation' },
      { name: 'Weekly Coaching Calls', included: true, detail: '45 minutes 1-1' },
      { name: 'Foundation Training Plan', included: true, detail: 'Build strength safely' },
      { name: 'Nutrition Guidance', included: true, detail: 'Fuel your fitness' },
      { name: 'WhatsApp Support', included: false },
      { name: 'Parent Fitness Community', included: false },
      { name: 'Family Workout Sessions', included: false },
      { name: 'Race Preparation', included: false },
    ],
    cta: 'Start Training Today',
    ideal: 'Perfect for parents starting their fitness journey'
},
  {
    id: 'strength',
    name: 'Strength & Stamina',
    tagline: 'Level Up Your Fitness',
    price: '£297',
    period: '12 weeks',
    color: 'from-gold/30 to-gold/20',
    borderColor: 'border-gold/50',
    glowColor: 'shadow-gold/30',
    popular: true,
    badge: 'Most Popular',
    features: [
      { name: 'Full Fitness Assessment', included: true, detail: 'Track your progress' },
      { name: 'Weekly Coaching Calls', included: true, detail: '60 minutes 1-1' },
      { name: 'Progressive Training Plan', included: true, detail: 'Build strength & stamina' },
      { name: 'Mental Resilience Training', included: true, detail: 'Build confidence' },
      { name: 'WhatsApp Support', included: true, detail: 'Mon-Fri priority access' },
      { name: 'Parent Fitness Community', included: true, detail: 'Private support group' },
      { name: 'Family Workout Sessions', included: true, detail: 'Train with your children' },
      { name: 'Race Preparation', included: false },
    ],
    cta: 'Get Stronger Now',
    ideal: 'Most chosen by parents ready to level up'
},
  {
    id: 'warrior',
    name: 'Performance Training',
    tagline: 'Achieve the Extraordinary',
    price: '£197',
    period: 'monthly ongoing',
    color: 'from-navy/30 to-navy/20',
    borderColor: 'border-navy/50',
    glowColor: 'shadow-navy/30',
    popular: false,
    badge: 'Legacy Programme',
    features: [
      { name: 'Monthly Performance Review', included: true, detail: 'Track elite progress' },
      { name: 'Weekly Group Training', included: true, detail: 'Train with strong parents' },
      { name: 'Advanced Training Plans', included: true, detail: 'Race & challenge prep' },
      { name: 'Mental Performance Work', included: true, detail: 'Build resilience' },
      { name: 'WhatsApp Support', included: true, detail: '24/7 community support' },
      { name: 'Elite Parent Community', included: true, detail: 'Lead & inspire others' },
      { name: 'Family Fitness Sessions', included: true, detail: 'Lead by example' },
      { name: 'Race Preparation', included: true, detail: 'Spartan, OCR, marathons' },
    ],
    cta: 'Train at Elite Level',
    ideal: 'For parents ready to achieve extraordinary'
},
]

export default function PremiumProgrammeComparison() {
  const [hoveredProgramme, setHoveredProgramme] = React.useState<string | null>(null)
  const [selectedProgramme, setSelectedProgramme] = React.useState('performance')

  return (
    <motion.section
      className="luxury-section bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={viewportSettings}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 lg:mb-24"
          variants={fadeInUp}
        >
          <Badge className="mb-6 bg-gold/10 text-gold border-gold/30 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Your Fitness Investment
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-navy dark:text-white">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-sage ml-3">
              Training Programme
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Each programme is designed for parents at different fitness levels.
            From first press-up to first race, we&apos;ll get you properly strong.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 xl:gap-16 max-w-7xl mx-auto"
          variants={staggerContainer}
        >
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              variants={luxuryScale}
              custom={index}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredProgramme(programme.id)}
              onHoverEnd={() => setHoveredProgramme(null)}
              className="relative"
            >
              {/* Popular badge */}
              {programme.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
                >
                  <Badge className="bg-gradient-to-r from-gold to-gold-light text-navy px-6 py-2 font-bold shadow-2xl">
                    <Crown className="w-4 h-4 mr-2" />
                    {programme.badge}
                  </Badge>
                </motion.div>
              )}

              <motion.div
                className={`
                  relative h-full rounded-3xl p-8
                  ${programme.popular ? 'bg-gradient-to-br from-white to-gold/5 dark:from-navy-light dark:to-gold/10' : 'bg-white dark:bg-navy-light'}
                  border-2 ${programme.borderColor}
                  ${hoveredProgramme === programme.id ? 'shadow-2xl' : 'shadow-xl'}
                  transition-all duration-500
                `}
                style={{
                  boxShadow: hoveredProgramme === programme.id
                    ? `0 30px 60px -15px rgba(212, 165, 116, 0.3)`
                    : undefined
                }}
              >
                {/* Glow effect on hover */}
                <AnimatePresence>
                  {hoveredProgramme === programme.id && (
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${programme.color} blur-2xl`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Programme Header */}
                <div className="relative z-10 text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-navy dark:text-white">
                    {programme.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {programme.tagline}
                  </p>

                  {/* Price */}
                  <motion.div
                    className="mb-6"
                    animate={selectedProgramme === programme.id ? glowPulse.animate : {}}
                  >
                    <span className="text-5xl font-bold text-navy dark:text-white">
                      {programme.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {programme.period}
                    </span>
                  </motion.div>

                  {/* Ideal for */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-8">
                    {programme.ideal}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {programme.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * featureIndex }}
                      className="flex items-start justify-between"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className={`text-sm ${feature.included ? 'text-navy dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                            {feature.name}
                          </span>
                          {feature.included && feature.detail && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {feature.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <PremiumButton
                  variant={programme.popular ? 'primary' : 'secondary'}
                  size="lg"
                  fullWidth
                  pulse={programme.popular}
                  shimmer={hoveredProgramme === programme.id}
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => setSelectedProgramme(programme.id)}
                >
                  {programme.cta}
                </PremiumButton>

                {/* Programme specific perks */}
                {programme.popular && (
                  <motion.div
                    className="mt-6 pt-6 border-t border-gold/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gold">
                      <Star className="w-4 h-4 fill-gold" />
                      <span className="font-semibold">Free Strategy Call Included</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          variants={fadeInUp}
        >
          <div className="bg-white/50 dark:bg-navy-light/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-sage-light flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-navy dark:text-white">30-Day Guarantee</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full refund if not satisfied</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <Star className="w-6 h-6 text-navy" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-navy dark:text-white">Cancel Anytime</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No long-term contracts</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-navy dark:text-white">Personalised Approach</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tailored to your goals</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}