"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Target,
  Zap,
  HeartHandshake,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const assessmentAreas = [
  {
    icon: BarChart3,
    title: 'Current Fitness Level',
    description: 'Get a clear picture of your starting point and potential gains',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    features: ['Baseline strength test', 'Movement quality check', 'Recovery capacity'],
    metrics: 'Strength improvement potential'
  },
  {
    icon: Target,
    title: 'Training Capacity',
    description: 'Understand what your body can handle and how to progress safely',
    color: 'from-gold to-gold-light',
    bgColor: 'bg-gold/10',
    features: ['Physical readiness', 'Available training time', 'Progressive overload plan'],
    metrics: 'Personalised training level'
  },
  {
    icon: Users,
    title: 'Programme Match',
    description: 'Find the right training approach for your life and goals',
    color: 'from-sage to-sage-light',
    bgColor: 'bg-sage/10',
    features: ['Schedule compatibility', 'Training style preference', 'Support needs'],
    metrics: 'Programme fit score'
  },
  {
    icon: Zap,
    title: 'Energy & Recovery',
    description: 'Optimise your training for maximum energy throughout the day',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    features: ['Current energy patterns', 'Recovery requirements', 'Nutrition guidance'],
    metrics: 'Training readiness score'
  }
]

const benefits = [
  'Get your personalised strength baseline in 5 minutes',
  'See exactly how strong you can become in 12 weeks',
  'Find the perfect programme for your schedule',
  'Match with the right support level for success',
  'Track measurable fitness improvements',
  'Free training programme guide'
]

export default function ModernAssessmentSection() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null)

  return (
    <section ref={ref} id="assessment" className="relative luxury-section overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-navy-dark dark:via-navy/50 dark:to-navy-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
}}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
}}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%'
}}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 lg:mb-24"
        >
          <Badge className="inline-flex items-center gap-3 px-6 py-3 mb-8 lg:mb-10 bg-gold/10 text-gold border-gold/20">
            <Sparkles className="h-4 w-4" />
            Fitness Assessment
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-8 lg:mb-10">
            Find Your Starting Point
            <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              Build Real Strength
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Take our 5-minute fitness assessment to understand your current strength level
            and get a personalised training plan that fits your life
          </p>
        </motion.div>

        {/* 3D Assessment Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {assessmentAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
              style={{
                transformStyle: 'preserve-3d',
                transform: hoveredCard === index ? 'rotateY(5deg) rotateX(-5deg)' : '',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Card Glow Effect */}
              <div className={cn(
                "absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                `bg-gradient-to-r ${area.color}`
              )} />
              
              {/* Card Content */}
              <div className="relative bg-white dark:bg-navy-dark rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-navy/30 overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", area.bgColor)}
                  animate={hoveredCard === index ? {
                    backgroundPosition: ['0% 0%', '100% 100%']
} : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
}}
                />
                
                {/* Icon with Animation */}
                <div className="relative mb-6">
                  <motion.div
                    animate={hoveredCard === index ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "inline-flex p-4 rounded-2xl",
                      area.bgColor
                    )}
                  >
                    <area.icon className={cn(
                      "h-8 w-8 bg-gradient-to-br bg-clip-text",
                      `text-gradient ${area.color}`
                    )} />
                  </motion.div>
                  
                  <Badge variant="secondary" className="absolute -top-2 -right-2 bg-white dark:bg-navy shadow-lg">
                    {area.metrics}
                  </Badge>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {area.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {area.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {area.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <motion.div
                  className="flex items-center gap-2 text-gold font-medium group/link"
                  whileHover={{ x: 5 }}
                >
                  <span>Explore this area</span>
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
}}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse'
}}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212, 165, 116, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(135, 169, 107, 0.3) 0%, transparent 50%)'
}}
            />
          </div>

          <div className="relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Your Free Assessment Includes:
                </h3>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-gold" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="text-center lg:text-right">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="inline-block"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <BarChart3 className="h-16 w-16 text-gold mx-auto mb-4" />
                    <p className="text-4xl font-bold text-white mb-2">15 Minutes</p>
                    <p className="text-white/80 mb-6">To unlock your potential</p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold py-6 rounded-xl shadow-2xl hover:shadow-gold/40 transition-all duration-300"
                        asChild
                      >
                        <Link href="/assessment" className="flex items-center justify-center gap-2">
                          Start Free Assessment
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    
                    <p className="text-sm text-white/60 mt-4">No credit card required</p>
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                  className="mt-8 flex justify-center lg:justify-end gap-4"
                >
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    <Shield className="h-3 w-3 mr-1" />
                    GDPR Compliant
                  </Badge>
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    <HeartHandshake className="h-3 w-3 mr-1" />
                    100% Confidential
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join <span className="font-bold text-gold">2,847</span> parents who&apos;ve discovered their strength potential this month
          </p>
        </motion.div>
      </div>
    </section>
  )
}