"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Smartphone,
  CheckCircle,
  Trophy,
  Target,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Zap,
  Users,
  Clock,
  Star,
  ChartBar,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: CheckCircle,
    title: 'Daily Accountability',
    description: 'Check-ins every single day to keep you on track and motivated',
    highlight: true
  },
  {
    icon: Target,
    title: 'Personalised Goals',
    description: 'Custom targets and milestones designed specifically for your journey'
  },
  {
    icon: Smartphone,
    title: 'App-Based Tracking',
    description: 'Log your workouts, nutrition, and progress all in one place'
  },
  {
    icon: Calendar,
    title: 'Lifestyle Programming',
    description: 'Workouts that fit around your schedule, not the other way around'
  },
  {
    icon: MessageSquare,
    title: 'Weekly Reviews',
    description: 'One-on-one progress check-ins to adjust and optimise your plan',
    highlight: true
  },
  {
    icon: Trophy,
    title: '3-Month Transformation',
    description: 'Guaranteed results with our proven 12-week programme'
  }
]

const benefits = [
  'Train anywhere - home, gym, or outdoors',
  'Flexible scheduling that works for you',
  'Expert guidance from a qualified coach',
  'Community support and motivation',
  'Nutrition guidance included',
  'Progress tracking and analytics'
]

const transformationTimeline = [
  {
    week: 'Weeks 1-4',
    title: 'Foundation Building',
    description: 'Establish routines, learn proper form, build consistency',
    icon: Shield
  },
  {
    week: 'Weeks 5-8',
    title: 'Strength Development',
    description: 'Progressive overload, increased intensity, visible changes',
    icon: TrendingUp
  },
  {
    week: 'Weeks 9-12',
    title: 'Peak Performance',
    description: 'Advanced techniques, lifestyle integration, lasting habits',
    icon: Trophy
  }
]

export default function OnlinePackageShowcase() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="relative py-32 md:py-40 lg:py-48 xl:py-56 overflow-hidden bg-gradient-to-b from-white via-gold/5 to-white dark:from-navy-dark dark:via-gold/10 dark:to-navy-dark">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-navy dark:text-white mb-8 tracking-tight">
            The Online Package
            <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Transform From Anywhere
            </span>
          </h2>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Our flagship online coaching programme combining expert guidance,
            daily accountability, and app-based convenience for busy professionals
          </p>

          {/* Price Highlight */}
          <div className="inline-block bg-gradient-to-r from-gold/10 to-gold/20 dark:from-gold/20 dark:to-gold/30 rounded-3xl p-8 border-2 border-gold/30">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-navy dark:text-white">
                  £100
                  <span className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">/month</span>
                </p>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2">
                  3-month minimum commitment
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={cn(
                "bg-white dark:bg-navy-dark rounded-2xl p-8 shadow-lg transition-all duration-300",
                feature.highlight && "border-2 border-gold/30 shadow-gold/20"
              )}
            >
              <div className={cn(
                "inline-flex p-3 rounded-xl mb-4",
                feature.highlight
                  ? "bg-gradient-to-br from-gold to-gold-light"
                  : "bg-gradient-to-br from-sage to-sage-light"
              )}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* App Mockup Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-12 md:p-16 lg:p-20 mb-20 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Everything in One App
              </h3>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                Track your workouts, log your nutrition, monitor progress, and stay connected
                with your coach - all from your phone.
              </p>

              <div className="space-y-4">
                {['Workout Videos & Instructions', 'Nutrition Logging & Guidance', 'Progress Photos & Measurements', 'Direct Coach Messaging'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-gold" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[9/16] max-w-[300px] mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="h-full bg-gradient-to-br from-gold/20 to-sage/20 rounded-[2.5rem] flex items-center justify-center">
                  <Smartphone className="h-24 w-24 text-white/20" />
                </div>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-4 -right-4 bg-gold text-navy rounded-full p-3 shadow-lg"
              >
                <Star className="h-6 w-6" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-gold/10 to-sage/10 dark:from-gold/20 dark:to-sage/20 rounded-3xl p-12 md:p-16 mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white mb-8 text-center">
            What's Included in Your Package
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                className="flex items-center gap-4"
              >
                <CheckCircle className="h-6 w-6 text-gold flex-shrink-0" />
                <span className="text-lg text-gray-700 dark:text-gray-200">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transformation Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="my-24 md:my-32"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-navy dark:text-white text-center mb-12">
            Your 3 Steps to Longevity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transformationTimeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="relative"
              >
                {index < transformationTimeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gold/50" />
                  </div>
                )}

                <div className="bg-white dark:bg-navy-dark rounded-2xl p-8 shadow-lg h-full">
                  <div className="bg-gradient-to-br from-sage to-sage-light p-3 rounded-xl inline-block mb-4">
                    <phase.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-navy dark:text-white mb-3 mt-4">
                    {phase.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-center bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-16 md:p-20 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative">
            <Badge className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gold/20 text-gold border-gold/30 text-lg font-semibold">
              <Trophy className="h-5 w-5" />
              LIMITED SPACES AVAILABLE
            </Badge>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h3>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              Join hundreds of successful clients who've transformed their bodies
              and lives with our Online Package
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-16 py-8 rounded-2xl shadow-2xl hover:shadow-gold/40 transition-all duration-300 text-xl"
                asChild
              >
                <Link href="/apply" className="flex items-center gap-3">
                  Start Your Online Package Today
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </motion.div>

            <p className="mt-6 text-white/60 text-sm">
              3-month commitment • Cancel anytime after • 100% satisfaction guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}