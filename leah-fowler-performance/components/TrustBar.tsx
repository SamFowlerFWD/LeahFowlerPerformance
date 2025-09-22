"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Users, Calendar, CheckCircle2, TrendingUp, Brain, Star } from 'lucide-react'

interface TrustSignal {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: string
}

export default function TrustBar() {
  const trustSignals: TrustSignal[] = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Mother of 3",
      description: "Who Gets Real Life",
      highlight: "Real Experience"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "500+ Parents",
      description: "Now Properly Strong",
      highlight: "Proven Results"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "From Postnatal",
      description: "To Spartan Ultra",
      highlight: "Living Proof"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "3-Week Progress",
      description: "First Press-up Achieved",
      highlight: "Quick Wins"
    }
  ]

  const additionalSignals: TrustSignal[] = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Strength-First",
      description: "Not Diet Focused",
      highlight: "Holistic"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "92% Success Rate",
      description: "Parents Feel Themselves Again",
      highlight: "Transformation"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Community Strong",
      description: "200+ Warrior Parents",
      highlight: "Support System"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Real Life Fitness",
      description: "Fits Around School Runs",
      highlight: "Sustainable"
    }
  ]

  const [isExpanded, setIsExpanded] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  // Auto-scroll on mobile for better discovery
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || window.innerWidth >= 768) return

    let scrollInterval: NodeJS.Timeout
    let isUserScrolling = false

    const startAutoScroll = () => {
      if (isUserScrolling) return

      scrollInterval = setInterval(() => {
        if (!isUserScrolling && container.scrollLeft < container.scrollWidth - container.clientWidth) {
          container.scrollLeft += 1
        } else if (!isUserScrolling) {
          container.scrollLeft = 0
        }
      }, 30)
    }

    const handleUserScroll = () => {
      isUserScrolling = true
      clearInterval(scrollInterval)

      // Resume auto-scroll after user stops
      setTimeout(() => {
        isUserScrolling = false
        startAutoScroll()
      }, 5000)
    }

    container.addEventListener('touchstart', handleUserScroll)
    container.addEventListener('touchmove', handleUserScroll)

    // Start auto-scroll after a delay
    setTimeout(startAutoScroll, 3000)

    return () => {
      clearInterval(scrollInterval)
      container?.removeEventListener('touchstart', handleUserScroll)
      container?.removeEventListener('touchmove', handleUserScroll)
    }
  }, [])

  const allSignals = isExpanded ? [...trustSignals, ...additionalSignals] : trustSignals

  return (
    <section
      className="relative py-8 md:py-10 lg:py-12 xl:py-16 overflow-hidden"
      aria-label="Trust indicators and certifications"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy-dark opacity-95" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 165, 116, 0.1) 35px, rgba(212, 165, 116, 0.1) 70px)`
        }} />
      </div>

      <div className="relative z-10">
        {/* Desktop: Grid layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto px-8 lg:px-12"
        >
          {trustSignals.map((signal, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="relative p-8 lg:p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-gold/20">
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

                <div className="flex flex-col items-center text-center space-y-4 lg:space-y-6">
                  {/* Icon container with glow effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 blur-xl group-hover:bg-gold/30 transition-colors duration-300" />
                    <div className="relative p-3 rounded-full bg-gradient-to-br from-gold to-gold-light text-navy">
                      {signal.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 lg:space-y-3">
                    {signal.highlight && (
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">
                        {signal.highlight}
                      </span>
                    )}
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {signal.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {signal.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allSignals.map((signal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] snap-center"
              >
                <div className="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-gold/20 h-full">
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

                  <div className="flex items-center space-x-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-2.5 rounded-full bg-gradient-to-br from-gold to-gold-light text-navy">
                        {signal.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {signal.highlight && (
                        <span className="text-xs font-bold text-gold uppercase tracking-wider">
                          {signal.highlight}
                        </span>
                      )}
                      <h3 className="text-white font-semibold text-base truncate">
                        {signal.title}
                      </h3>
                      <p className="text-white/70 text-sm truncate">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile scroll indicators */}
          <div className="flex justify-center mt-4 gap-1">
            {[...Array(Math.ceil(allSignals.length / 1))].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold/30 transition-all duration-300"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Expand button for desktop */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex justify-center mt-8"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="px-6 py-3 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 font-medium text-sm"
              aria-label="Show more trust indicators"
            >
              View All Credentials
            </button>
          </motion.div>
        )}

        {/* Expanded signals for desktop */}
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto px-8 lg:px-12 mt-12"
          >
            {additionalSignals.map((signal, index) => (
              <motion.div
                key={`additional-${index}`}
                variants={itemVariants}
                className="group"
              >
                <div className="relative p-8 lg:p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-sage/20 hover:border-sage/40 transition-all duration-300 hover:bg-white/10 hover:scale-105">
                  {/* Sage accent line for additional signals */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sage to-transparent opacity-60" />

                  <div className="flex flex-col items-center text-center space-y-4 lg:space-y-6">
                    {/* Icon container */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-sage/20 blur-xl group-hover:bg-sage/30 transition-colors duration-300" />
                      <div className="relative p-3 rounded-full bg-gradient-to-br from-sage to-sage-light text-navy">
                        {signal.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      {signal.highlight && (
                        <span className="text-xs font-bold text-sage uppercase tracking-wider">
                          {signal.highlight}
                        </span>
                      )}
                      <h3 className="text-white font-semibold text-lg leading-tight">
                        {signal.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}