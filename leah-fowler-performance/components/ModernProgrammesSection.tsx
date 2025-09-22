"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Rocket, Crown, Users, Sparkles, Clock, Calendar, Video, FileText, MessageSquare, Trophy, Star, ArrowRight, CheckCircle, TrendingUp, Dumbbell, Heart, Brain, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const programmes = [
  {
    id: 'premium',
    title: 'Premium Performance Programme',
    subtitle: 'Complete Physical & Lifestyle Transformation',
    duration: 'Monthly',
    price: '£350/month',
    popular: true,
    icon: Crown,
    color: 'from-gold to-gold-light',
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20',
    description: 'Comprehensive programme combining strength training, conditioning, nutrition planning, and lifestyle optimisation for maximum results',
    features: [
      { icon: Dumbbell, text: '2x weekly sessions (online or in-person)' },
      { icon: FileText, text: 'Personalised strength & conditioning programme' },
      { icon: Heart, text: 'Custom nutrition planning' },
      { icon: Brain, text: 'Sleep & circadian rhythm optimisation' },
      { icon: MessageSquare, text: 'Daily WhatsApp accountability' },
      { icon: Trophy, text: 'Monthly progress assessments' }
    ],
    outcomes: [
      '30% increase in strength',
      '50% improvement in energy levels',
      'Better sleep quality in 2 weeks'
    ],
    testimonial: {
      text: "I've never felt stronger or more energetic. Leah's approach to lifestyle optimisation changed everything.",
      author: 'David Chen',
      role: 'Mother of 1'
    }
  },
  {
    id: 'essentials',
    title: 'Performance Essentials',
    subtitle: 'Focused Training & Lifestyle Coaching',
    duration: 'Monthly',
    price: '£199/month',
    popular: false,
    icon: Rocket,
    color: 'from-sage to-sage-light',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    description: 'Perfect for busy mothers who want expert guidance with flexible scheduling and comprehensive lifestyle support',
    features: [
      { icon: Video, text: 'Weekly session (online or in-person)' },
      { icon: FileText, text: 'Custom training programme' },
      { icon: Heart, text: 'Nutrition guidance & meal plans' },
      { icon: Brain, text: 'Lifestyle coaching (sleep, stress, habits)' },
      { icon: MessageSquare, text: 'Bi-weekly check-ins' },
      { icon: Calendar, text: 'Flexible scheduling' }
    ],
    outcomes: [
      '25% strength improvement',
      'Sustainable habit formation',
      'Improved work-life balance'
    ],
    testimonial: {
      text: "The perfect balance of support and flexibility. I finally found a sustainable approach to fitness.",
      author: 'Sarah Williams',
      role: 'Marketing Director'
    }
  },
  {
    id: 'online',
    title: 'Online Programme Only',
    subtitle: 'Self-Paced with Expert Programme Design',
    duration: 'Monthly',
    price: '£97/month',
    popular: false,
    icon: Home,
    color: 'from-purple-600 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
    description: 'Expertly designed workout programmes delivered monthly with full exercise library access - perfect for self-motivated individuals',
    features: [
      { icon: FileText, text: 'Personalised workout programme (NO sessions)' },
      { icon: Calendar, text: 'Monthly programme updates' },
      { icon: Video, text: 'Full exercise video library' },
      { icon: Brain, text: 'Lifestyle optimisation resources' },
      { icon: Users, text: 'Community support access' },
      { icon: Trophy, text: 'Progress tracking tools' }
    ],
    outcomes: [
      'Build consistent training habits',
      'Learn proper form and technique',
      'Achieve goals at your own pace'
    ],
    testimonial: {
      text: "The programme design is exceptional. Perfect for my busy travel schedule.",
      author: 'Michael Brown',
      role: 'Mother of 2'
    }
  },
  {
    id: 'group',
    title: 'Small Group Training',
    subtitle: 'In-Person Group Sessions in Dereham',
    duration: 'Monthly',
    price: '£79/month',
    popular: false,
    icon: Users,
    color: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    description: 'High-energy small group training sessions (max 4 people) focusing on strength & conditioning - Dereham, Norfolk only',
    features: [
      { icon: Users, text: '2x weekly group sessions (max 4 people)' },
      { icon: Dumbbell, text: 'Strength & conditioning focus' },
      { icon: Trophy, text: 'Friendly, motivating environment' },
      { icon: Calendar, text: 'Fixed schedule times' },
      { icon: MessageSquare, text: 'Group WhatsApp support' },
      { icon: Heart, text: 'Basic nutrition guidance included' }
    ],
    outcomes: [
      'Build strength in supportive environment',
      'Make fitness friends locally',
      'Consistent training routine'
    ],
    testimonial: {
      text: "Love the small group energy! Great value and I've made some amazing friends.",
      author: 'Emma Thompson',
      role: 'Mother of 4'
    }
  }
]

export default function ModernProgrammesSection() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [selectedProgramme, setSelectedProgramme] = React.useState<string | null>(null)

  return (
    <section ref={ref} id="programmes" className="relative py-40 md:py-48 lg:py-64 xl:py-80 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-32 md:mb-40 lg:mb-48 xl:mb-56"
        >
          <Badge className="inline-flex items-center gap-4 px-10 py-5 mb-16 bg-sage/10 text-sage border-sage/20 text-lg font-medium">
            <Sparkles className="h-4 w-4" />
            Training Programmes • Online or In-Person
          </Badge>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-navy dark:text-white mb-16 tracking-tight">
            Choose Your
            <span className="block mt-4 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              Training Programme
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Expert coaching for strength, conditioning, nutrition, and lifestyle optimisation.
            Available online or in-person at our Dereham, Norfolk location.
          </p>
        </motion.div>

        {/* Programme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-20 xl:gap-16 2xl:gap-20 mb-40 md:mb-48 lg:mb-56 xl:mb-64">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setSelectedProgramme(programme.id)}
              onMouseLeave={() => setSelectedProgramme(null)}
              className="relative group"
            >
              {/* Popular Badge */}
              {programme.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-8 py-3 shadow-2xl text-base">
                    <Star className="h-4 w-4 mr-2" />
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                  "relative h-full rounded-3xl p-14 md:p-16 lg:p-20 xl:p-16 2xl:p-20 shadow-2xl transition-all duration-500 min-h-[750px] md:min-h-[800px] lg:min-h-[850px] xl:min-h-[900px] 2xl:min-h-[950px]",
                  programme.popular 
                    ? "bg-gradient-to-br from-white to-gold/5 dark:from-navy-dark dark:to-gold/10 border-2 border-gold/30" 
                    : "bg-white dark:bg-navy-dark border border-gray-200 dark:border-navy/30",
                  selectedProgramme === programme.id && "shadow-2xl"
                )}
                style={{
                  transform: selectedProgramme === programme.id ? 'perspective(1000px) rotateY(-5deg)' : '',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Animated Background Gradient */}
                <div className={cn(
                  "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  `bg-gradient-to-br ${programme.bgGradient}`
                )} />

                {/* Content */}
                <div className="relative">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-16">
                    <motion.div
                      animate={selectedProgramme === programme.id ? {
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "p-6 rounded-2xl bg-gradient-to-br shadow-lg",
                        programme.color
                      )}
                    >
                      <programme.icon className="h-12 w-12 text-white" />
                    </motion.div>
                    
                    <div className="text-right">
                      <p className="text-lg text-gray-500 dark:text-gray-400 mb-3">{programme.duration}</p>
                      <p className="text-4xl md:text-5xl lg:text-5xl xl:text-4xl 2xl:text-5xl font-bold text-navy dark:text-white">{programme.price}</p>
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-bold text-navy dark:text-white mb-8 tracking-tight">
                    {programme.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10">
                    {programme.subtitle}
                  </p>
                  <p className="text-lg md:text-xl lg:text-xl xl:text-lg 2xl:text-xl text-gray-600 dark:text-gray-300 mb-16 leading-relaxed">
                    {programme.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-8 mb-16">
                    {programme.features.slice(0, 4).map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-6"
                      >
                        <feature.icon className="h-7 w-7 text-gold mt-1 flex-shrink-0" />
                        <span className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Outcomes */}
                  <div className="bg-gray-50 dark:bg-navy/30 rounded-2xl p-10 mb-16">
                    <p className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                      Expected Outcomes
                    </p>
                    <div className="space-y-6">
                      {programme.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-center gap-5">
                          <TrendingUp className="h-6 w-6 text-green-500" />
                          <span className="text-lg text-gray-700 dark:text-gray-300">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={cn(
                        "w-full px-20 py-10 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02]",
                        programme.popular
                          ? "bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy shadow-gold/30"
                          : "bg-navy hover:bg-navy-dark text-white dark:bg-white dark:text-navy dark:hover:bg-gray-100"
                      )}
                      asChild
                    >
                      <Link href="/assessment" className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="h-6 w-6" />
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Testimonial Preview */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: selectedProgramme === programme.id ? 1 : 0,
                      height: selectedProgramme === programme.id ? 'auto' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-navy/30">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2">
                        "{programme.testimonial.text}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        — {programme.testimonial.author}, {programme.testimonial.role}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-navy via-navy-dark to-navy rounded-3xl p-20 md:p-24 lg:p-32 xl:p-40 2xl:p-48 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative">
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-12 tracking-tight">
              Ready to Transform Your Health & Performance?
            </h3>
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/80 mb-20 max-w-4xl mx-auto leading-relaxed">
              Take our free assessment to discover your current fitness level and get personalised programme recommendations
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-24 py-12 rounded-3xl shadow-2xl hover:shadow-gold/40 transition-all duration-300 text-2xl transform hover:scale-105"
                asChild
              >
                <Link href="/assessment" className="flex items-center gap-2">
                  <Calendar className="h-7 w-7" />
                  Start Free Assessment
                  <ArrowRight className="h-7 w-7" />
                </Link>
              </Button>
            </motion.div>

            <div className="mt-20 flex flex-col md:flex-row justify-center gap-10 md:gap-16 lg:gap-20 xl:gap-24">
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                5-minute assessment
              </div>
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                No obligation
              </div>
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                Programme recommendations
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}