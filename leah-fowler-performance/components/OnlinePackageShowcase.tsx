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
    title: 'Smart Accountability System',
    description: 'App-powered tracking with weekly coaching reviews to keep you on track',
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
    <section ref={ref} className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden bg-gradient-to-b from-white via-gold/5 to-white dark:from-navy-dark dark:via-gold/10 dark:to-navy-dark">
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
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-navy dark:text-white mb-6 tracking-tight">
            The Online Package
            <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Transform From Anywhere
            </span>
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-tight mb-3">
            Online coaching delivers you a fully supported programme through an app you can have on your phone. You&apos;ll receive expert guidance as each detail is programmed specifically for you, tailored to your individual needs and factoring in your lifestyle. Monthly goal setting and programme review as well as a weekly check in mean that you&apos;ll remain accountable and get the very best out of your workouts.
          </p>

          {/* Price Highlight */}
          <div className="inline-block bg-gradient-to-r from-gold/10 to-gold/20 dark:from-gold/20 dark:to-gold/30 rounded-3xl p-6 border-2 border-gold/30">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                  £100
                  <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300">/month</span>
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12 lg:mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={cn(
                "bg-white dark:bg-navy-dark rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300",
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
              <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
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
          className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 mb-6 md:mb-8 lg:mb-10 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Everything in One App
              </h3>
              <p className="text-base md:text-lg text-white/80 mb-6">
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
          className="bg-gradient-to-r from-gold/10 to-sage/10 dark:from-gold/20 dark:to-sage/20 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 mb-6 md:mb-8 lg:mb-10"
        >
          <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-white mb-6 text-center">
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
          className="my-8 sm:my-12 md:my-16 lg:my-24"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-8">
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

                <div className="bg-white dark:bg-navy-dark rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg h-full">
                  <div className="bg-gradient-to-br from-sage to-sage-light p-3 rounded-xl inline-block mb-4">
                    <phase.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-navy dark:text-white mb-3 mt-4">
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

        {/* Final CTA section removed - too pushy and repetitive */}
      </div>
    </section>
  )
}