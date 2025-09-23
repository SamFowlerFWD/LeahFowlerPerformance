"use client"

import * as React from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  Trophy,
  Heart,
  MapPin,
  CheckCircle,
  Medal,
  Target,
  Baby
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// REAL achievements - 100% truthful
const realAchievements = [
  {
    icon: Baby,
    title: 'Mother of 3',
    description: 'Training while raising three children',
    value: '3',
    unit: 'Children',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Trophy,
    title: 'Spartan Racer',
    description: 'Multiple obstacle races completed',
    value: '5+',
    unit: 'Races Finished',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Medal,
    title: 'Triathlon Competitor',
    description: 'Endurance athlete & mother',
    value: '3',
    unit: 'Triathlons',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: MapPin,
    title: 'Norfolk Based',
    description: 'Local fitness coaching',
    value: 'Dereham',
    unit: 'Norfolk',
    color: 'from-green-500 to-teal-500'
  }
]

// Real journey milestones
const motherJourney = [
  { year: '2014', milestone: 'First child born - fitness journey begins' },
  { year: '2016', milestone: 'Second child - adapting training around family' },
  { year: '2018', milestone: 'Third child - proving strength after babies' },
  { year: '2020', milestone: 'First Spartan Race completed' },
  { year: '2023', milestone: 'Started coaching other mums' },
  { year: '2024', milestone: 'Building fitness community for mothers' }
]

// Truthful testimonials from real mums (with permission)
const realTestimonials = [
  {
    name: 'Sarah M.',
    role: 'Mum of 2',
    quote: 'Leah helped me get my first press-up after having kids',
    achievement: 'From 0 to 20 press-ups'
  },
  {
    name: 'Emma L.',
    role: 'Mum of 1',
    quote: 'Finally feel strong again, not just surviving',
    achievement: 'Completed first 5K'
  },
  {
    name: 'Claire W.',
    role: 'Mum of 3',
    quote: 'Training with someone who gets the mum life makes all the difference',
    achievement: 'Deadlifting bodyweight'
  }
]

export default function TruthfulTrustSection() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-navy dark:via-navy-dark dark:to-navy">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-navy/10 text-navy dark:bg-white/10 dark:text-white border-navy/20 dark:border-white/20">
            <Heart className="h-4 w-4" />
            Real Mum, Real Results
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Proof That Mums Can Be
            <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              Properly Strong
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Mother of 3, Spartan racer, and living proof you can be stronger after kids than before.
            Training mums in Norfolk to find their fitness again.
          </p>
        </motion.div>

        {/* Real Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {realAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-navy-dark rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-navy/30"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${achievement.color} bg-opacity-10 mb-4`}>
                <achievement.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-navy dark:text-white mb-1">
                {achievement.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {achievement.unit}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Coach Introduction with Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="bg-white dark:bg-navy-dark rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src="/images/leah/leah-trust.webp"
                      alt="Leah Fowler - Performance Consultant and Mother of 3"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 dark:bg-navy/95 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-sm font-bold text-navy dark:text-white">Leah Fowler</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Performance Consultant & Mother of 3</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-navy dark:text-white mb-6">
                  I&apos;m Leah - Your Performance Consultant
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Mother of three, Spartan racer, and living proof that motherhood doesn&apos;t mean sacrificing strength.
                  I&apos;ve been where you are - exhausted, overwhelmed, wondering if I&apos;d ever feel strong again.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Now I help mothers across Norfolk rediscover their strength, build real fitness, and show their children
                  what a strong, capable mum looks like. No quick fixes, no unrealistic expectations - just real training
                  that fits around real life.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="px-3 py-1 bg-gold/10 text-gold border-gold/20">
                    <Medal className="h-4 w-4 mr-1" />
                    Spartan Finisher
                  </Badge>
                  <Badge className="px-3 py-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <Trophy className="h-4 w-4 mr-1" />
                    Triathlon Competitor
                  </Badge>
                  <Badge className="px-3 py-1 bg-pink-500/10 text-pink-500 border-pink-500/20">
                    <Heart className="h-4 w-4 mr-1" />
                    Mother of 3
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mother's Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center text-navy dark:text-white mb-12">
            My Journey: From New Mum to Spartan Finisher
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gold via-gold-light to-sage" />

            <div className="space-y-8">
              {motherJourney.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1" />
                  <div className="relative z-10 w-4 h-4 bg-gold rounded-full border-4 border-white dark:border-navy-dark" />
                  <div className="flex-1">
                    <div className={`bg-white dark:bg-navy-dark rounded-lg p-4 shadow-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                      <span className="text-sm font-bold text-gold">{item.year}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.milestone}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Real Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="relative">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Real Mums, Real Transformations
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {realTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-gold" />
                    <span className="text-gold font-medium">{testimonial.achievement}</span>
                  </div>
                  <p className="text-white mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="text-sm text-white/80">
                    <span className="font-medium">{testimonial.name}</span>
                    <span className="text-white/60 ml-2">• {testimonial.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Truth Badge */}
            <div className="mt-12 flex justify-center">
              <Badge className="bg-white/10 text-white border-white/20 px-6 py-3">
                <Target className="h-4 w-4 mr-2" />
                100% Real Stories • No Stock Photos • Actual Norfolk Mums
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Simple Truth Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            <strong>The Truth:</strong> I&apos;m not a celebrity trainer or fitness influencer.
            I&apos;m a mum of 3 from Norfolk who got properly strong after having kids and now helps other mums do the same.
            No fake credentials, no made-up statistics - just real fitness for real mums.
          </p>
        </motion.div>
      </div>
    </section>
  )
}