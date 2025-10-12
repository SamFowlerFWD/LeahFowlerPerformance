"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  Smartphone,
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
  Shield,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Smartphone,
    title: 'Smart App-Based Accountability',
    description: 'Track workouts, nutrition, and progress with app-powered monitoring and weekly coaching reviews',
    highlight: true
  },
  {
    icon: Target,
    title: 'Personalised Goals',
    description: 'Custom targets and milestones designed specifically for your journey'
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
    icon: Star
  }
]

export default function OnlinePackageShowcase() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden bg-gradient-to-b from-white via-gold/5 to-white dark:from-navy-dark dark:via-gold/10 dark:to-navy-dark">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#e7007d]/10 rounded-full blur-3xl" />
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
            <span className="block mt-2 bg-gradient-to-r from-[#e7007d] via-gold-light to-[#e7007d] bg-clip-text text-transparent">
              Transform From Anywhere
            </span>
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-tight mb-3">
            Online coaching delivers you a fully supported programme through an app you can have on your phone. You&apos;ll receive guidance as each detail is programmed specifically for you, tailored to your individual needs and factoring in your lifestyle. Monthly goal setting and programme review as well as a weekly check in mean that you&apos;ll remain accountable and get the very best out of your workouts.
          </p>

          {/* Price Highlight */}
          <div className="inline-block bg-gradient-to-r from-[#e7007d]/10 to-[#e7007d]/20 dark:from-[#e7007d]/20 dark:to-[#e7007d]/30 rounded-3xl p-6 border-2 border-[#e7007d]/30">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                  £100
                  <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300">/month</span>
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-4 lg:gap-6 mb-8 md:mb-12 lg:mb-16"
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
                feature.highlight && "border-2 border-[#e7007d]/30 shadow-gold/20"
              )}
            >
              <div className={cn(
                "inline-flex p-3 rounded-xl mb-4",
                feature.highlight
                  ? "bg-gradient-to-br from-[#e7007d] to-[#e7007d]-light"
                  : "bg-gradient-to-br from-sage to-[#e7007d]-light"
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
                    <ArrowRight className="h-8 w-8 text-[#e7007d]/50" />
                  </div>
                )}

                <div className="bg-white dark:bg-navy-dark rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg h-full">
                  <div className="bg-gradient-to-br from-sage to-[#e7007d]-light p-3 rounded-xl inline-block mb-4">
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

        {/* In-Person Coaching Package */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-32"
        >
          <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy dark:to-navy-dark rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-2xl border border-gray-200 dark:border-navy/30">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-4">
                In Person Coaching Package
              </h3>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7007d]/10 border border-[#e7007d]/20 text-[#e7007d] font-medium text-sm mb-6">
                <Shield className="h-4 w-4" />
                Sessions take place at Barrett&apos;s gym in Dereham
              </div>
            </div>

            {/* Description */}
            <div className="max-w-4xl mx-auto">
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Weekly sessions to guide you through a progressive strength training programme that is designed to meet you where you&apos;re at right now and get to reach your goals. This package is ideal for those who want to work on form, try new exercises and those who want to build confidence in the gym environment. The sessions will support any activity you are already doing throughout the week - from park runs or group exercise to daily life such as gardening or running around after the kids. You&apos;ll build on all the tools you need for optimal performance and injury prevention.
              </p>

              {/* Price */}
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-[#e7007d]/10 to-[#e7007d]/20 dark:from-[#e7007d]/20 dark:to-[#e7007d]/30 rounded-3xl p-6 border-2 border-[#e7007d]/30">
                  <p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                    £150
                    <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300">/month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nutritional Guidance Package */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 sm:mt-10 md:mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-br from-white via-sage/5 to-white dark:from-navy-dark dark:via-sage/10 dark:to-navy-dark rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-2xl border border-sage/20 dark:border-sage/30">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy dark:text-white mb-4">
                Nutritional Guidance for Weight Management or Sport
              </h3>
            </div>

            {/* Description */}
            <div className="max-w-4xl mx-auto">
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Built around your current dietary preferences. I can offer lifestyle and mindset coaching alongside your exercise programme. It is not like a diet plan, I help you to create an all round, holistic approach to wellness.
              </p>

              {/* Price Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="bg-gradient-to-r from-sage/10 to-sage/20 dark:from-sage/20 dark:to-sage/30 rounded-3xl p-6 border-2 border-sage/30">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Standalone</p>
                  <p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                    £100
                    <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300">/month</span>
                  </p>
                </div>
                <div className="text-gray-400 dark:text-gray-500 font-bold">or</div>
                <div className="bg-gradient-to-r from-[#e7007d]/10 to-[#e7007d]/20 dark:from-[#e7007d]/20 dark:to-[#e7007d]/30 rounded-3xl p-6 border-2 border-[#e7007d]/30">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">As an add-on</p>
                  <p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                    £80
                    <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300">/month</span>
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-sage to-[#e7007d] hover:from-sage/90 hover:to-[#e7007d]/90 text-white font-bold px-12 py-6 rounded-2xl shadow-xl transition-all duration-300 text-lg"
                    asChild
                  >
                    <Link href="/apply" className="flex items-center gap-2">
                      Apply Here
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA section removed - too pushy and repetitive */}
      </div>
    </section>
  )
}