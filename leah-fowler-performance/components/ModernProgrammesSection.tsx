"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Rocket,
  Crown,
  Users,
  Sparkles,
  Calendar,
  Video,
  FileText,
  MessageSquare,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Dumbbell,
  Heart,
  Brain,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const programmes = [
  {
    id: 'online-package',
    title: 'Online Package',
    subtitle: 'Expert Online Coaching Programme',
    duration: '3-Month Commitment',
    price: '£100/month',
    popular: true,
    bestValue: true,
    icon: Crown,
    color: 'from-gold to-gold-light',
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20',
    description: 'The flagship online coaching programme delivering personalised training, smart app accountability, and expert guidance through our mobile app. Transform your performance with the flexibility to train anywhere.',
    features: [
      { icon: CheckCircle, text: 'Smart accountability system with weekly coaching support' },
      { icon: Trophy, text: 'Personalised goal setting and milestones' },
      { icon: Dumbbell, text: 'App-based exercise and diet tracking' },
      { icon: Calendar, text: 'Lifestyle-based workout programming' },
      { icon: MessageSquare, text: 'Weekly one-on-one progress reviews' },
      { icon: TrendingUp, text: '3-month transformation guarantee' }
    ],
    outcomes: [
      'Complete lifestyle transformation',
      'Sustainable fitness habits',
      'Measurable performance gains'
    ],
    testimonial: {
      text: "The combination of app tracking and weekly coaching creates unstoppable accountability. I've never been more consistent or seen better results!",
      author: 'James Patterson',
      role: 'CEO & Father of Three'
    }
  },
  {
    id: 'pathway',
    title: 'Pathway to Endurance',
    subtitle: '16-Week Online Foundation Programme',
    duration: 'One-off Payment',
    price: '£48',
    popular: false,
    icon: Rocket,
    color: 'from-sage to-sage-light',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    description: 'Complete 16-week online programme to build your strength and endurance foundation. Perfect for beginners or those returning to fitness.',
    features: [
      { icon: Home, text: 'Train from anywhere - home or gym' },
      { icon: Calendar, text: 'Full 16-week progressive programme' },
      { icon: Video, text: 'Complete exercise video library' },
      { icon: Brain, text: 'Lifestyle optimisation guidance' },
      { icon: Users, text: 'Community support network' },
      { icon: Trophy, text: 'One-off payment - lifetime access' }
    ],
    outcomes: [
      'Build fitness foundations',
      'Improve strength & endurance',
      'Develop sustainable habits'
    ],
    testimonial: {
      text: "Perfect starting point! The programme gave me confidence and real results in just 16 weeks.",
      author: 'Sarah Mitchell',
      role: 'Professional & Mother'
    }
  },
  {
    id: 'smallgroup',
    title: 'Small Group Training',
    subtitle: 'Circuit Style Group Sessions',
    duration: '12 Sessions',
    price: '£120',
    popular: false,
    icon: Users,
    color: 'from-purple-600 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
    description: 'High-energy circuit training in small groups of maximum 6 people. Get motivated by training with others whilst receiving personal attention.',
    features: [
      { icon: Users, text: 'Maximum 6 people per session' },
      { icon: Calendar, text: '12 sessions over 3 months' },
      { icon: Dumbbell, text: 'Circuit style training' },
      { icon: Trophy, text: 'Group motivation & support' },
      { icon: MessageSquare, text: 'Personal form correction' },
      { icon: TrendingUp, text: 'Progressive programming' }
    ],
    outcomes: [
      'Improved fitness levels',
      'Group accountability',
      'Cost-effective training'
    ],
    testimonial: {
      text: "Love the energy of the small groups! Personal attention with the motivation of training alongside others.",
      author: 'Mark Davies',
      role: 'Local Business Owner'
    }
  },
  {
    id: 'semiprivate',
    title: 'Semi-Private Coaching',
    subtitle: '2:1 Partner Training',
    duration: 'Monthly',
    price: '£90/month per person',
    popular: false,
    icon: Heart,
    color: 'from-pink-600 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
    description: 'Train with a partner, friend, or family member in exclusive 2:1 sessions. Split the cost whilst enjoying personalised coaching together.',
    features: [
      { icon: Users, text: '2:1 exclusive training sessions' },
      { icon: Heart, text: 'Perfect for couples or friends' },
      { icon: FileText, text: 'Personalised programme for both' },
      { icon: Calendar, text: 'Flexible scheduling together' },
      { icon: MessageSquare, text: 'Partner accountability' },
      { icon: Trophy, text: 'Shared achievement tracking' }
    ],
    outcomes: [
      'Motivation through partnership',
      'Cost-effective personal training',
      'Stronger relationships'
    ],
    testimonial: {
      text: "Training with my partner has been game-changing. We motivate each other and it's more affordable!",
      author: 'Emma & Tom Wilson',
      role: 'Working Couple'
    }
  },
  {
    id: 'silver',
    title: 'Silver Package',
    subtitle: 'Weekly 1:1 Personal Training',
    duration: 'Monthly',
    price: '£140/month',
    popular: false,
    icon: Star,
    color: 'from-gray-600 to-gray-500',
    bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20',
    description: 'Weekly one-to-one personal training sessions with full programme design and lifestyle support. Perfect for steady, consistent progress.',
    features: [
      { icon: Dumbbell, text: 'Weekly 1:1 training sessions' },
      { icon: FileText, text: 'Personalised programme design' },
      { icon: Brain, text: 'Lifestyle optimisation support' },
      { icon: Heart, text: 'Nutrition guidance included' },
      { icon: MessageSquare, text: 'WhatsApp check-ins' },
      { icon: Calendar, text: 'Flexible session scheduling' }
    ],
    outcomes: [
      'Consistent weekly progress',
      'Personalised attention',
      'Sustainable lifestyle changes'
    ],
    testimonial: {
      text: "The weekly sessions keep me accountable and on track. Seeing consistent improvements every month!",
      author: 'David Harrison',
      role: 'Executive Professional'
    }
  },
  {
    id: 'gold',
    title: 'Gold Elite Package',
    subtitle: 'Twice-Weekly Elite Training',
    duration: 'Monthly',
    price: '£250/month',
    popular: false,
    icon: Crown,
    color: 'from-gold to-gold-light',
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20',
    description: 'Our premium package with twice-weekly 1:1 sessions, comprehensive programme design, nutrition planning, and complete lifestyle optimisation.',
    features: [
      { icon: Crown, text: 'Twice-weekly 1:1 sessions' },
      { icon: FileText, text: 'Advanced programme design' },
      { icon: Heart, text: 'Full nutrition planning' },
      { icon: Brain, text: 'Complete lifestyle coaching' },
      { icon: MessageSquare, text: 'Daily WhatsApp support' },
      { icon: Trophy, text: 'Priority scheduling & support' }
    ],
    outcomes: [
      'Accelerated results',
      'Elite-level transformation',
      'Complete lifestyle overhaul'
    ],
    testimonial: {
      text: "The Gold package has transformed my life. The twice-weekly sessions and daily support are incredible!",
      author: 'Alexandra Chen',
      role: 'CEO & Mother'
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
            Train From Anywhere • Expert Online Coaching
          </Badge>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-navy dark:text-white mb-16 tracking-tight">
            Online Coaching
            <span className="block mt-4 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              That Delivers Results
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Transform your performance with expert online coaching programmes.
            Train from anywhere with personalised support and proven results.
          </p>
        </motion.div>

        {/* Programme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12 md:gap-16 lg:gap-20 xl:gap-16 2xl:gap-20 mb-40 md:mb-48 lg:mb-56 xl:mb-64">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setSelectedProgramme(programme.id)}
              onMouseLeave={() => setSelectedProgramme(null)}
              className={cn(
                "relative group",
                programme.bestValue ? "xl:col-span-2" : "xl:col-span-1"
              )}
            >
              {/* Popular Badge */}
              {(programme.popular || programme.bestValue) && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="flex gap-2">
                    {programme.bestValue && (
                      <Badge className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-6 py-3 shadow-2xl text-base animate-pulse">
                        <Trophy className="h-4 w-4 mr-2" />
                        BEST VALUE
                      </Badge>
                    )}
                    {programme.popular && (
                      <Badge className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-6 py-3 shadow-2xl text-base">
                        <Star className="h-4 w-4 mr-2" />
                        MOST POPULAR
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                  "relative h-full rounded-3xl p-14 md:p-16 lg:p-20 xl:p-16 2xl:p-20 shadow-2xl transition-all duration-500 min-h-[750px] md:min-h-[800px] lg:min-h-[850px] xl:min-h-[900px] 2xl:min-h-[950px]",
                  programme.bestValue
                    ? "bg-gradient-to-br from-gold/10 via-white to-gold/10 dark:from-gold/20 dark:via-navy-dark dark:to-gold/20 border-3 border-gold shadow-gold/30 ring-4 ring-gold/20"
                    : programme.popular
                    ? "bg-gradient-to-br from-white to-gold/5 dark:from-navy-dark dark:to-gold/10 border-2 border-gold/30"
                    : "bg-white dark:bg-navy-dark border border-gray-200 dark:border-navy/30",
                  selectedProgramme === programme.id && "shadow-2xl"
                )}
                style={{
                  transform: selectedProgramme === programme.id ? 'perspective(1000px) rotateY(-5deg)' : '',
                  transformStyle: 'preserve-3d'
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
                        rotate: [0, 10, -10, 0]
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
                        programme.bestValue
                          ? "bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light text-navy shadow-gold/50 animate-pulse hover:animate-none text-2xl py-12"
                          : programme.popular
                          ? "bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy shadow-gold/30"
                          : "bg-navy hover:bg-navy-dark text-white dark:bg-white dark:text-navy dark:hover:bg-gray-100"
                      )}
                      asChild
                    >
                      <Link href="/apply" className="flex items-center justify-center gap-2">
                        {programme.bestValue ? "Start Today - £100/month" : "Apply Now"}
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
                        &quot;{programme.testimonial.text}&quot;
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
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-12 tracking-tight">
              Ready to Start Your Online Training Journey?
            </h3>
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/80 mb-20 max-w-4xl mx-auto leading-relaxed">
              Apply for coaching today and discover which programme is perfect for your goals and lifestyle
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
                <Link href="/apply" className="flex items-center gap-2">
                  <Calendar className="h-7 w-7" />
                  Apply for Coaching
                  <ArrowRight className="h-7 w-7" />
                </Link>
              </Button>
            </motion.div>

            <div className="mt-20 flex flex-col md:flex-row justify-center gap-10 md:gap-16 lg:gap-20 xl:gap-24">
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                Quick application
              </div>
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                Free consultation
              </div>
              <div className="text-xl md:text-2xl text-white/80">
                <CheckCircle className="h-7 w-7 text-gold inline mr-4" />
                Personalised advice
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}