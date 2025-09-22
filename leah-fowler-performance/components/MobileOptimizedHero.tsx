'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  MessageCircle,
  Calendar,
  Users,
  Trophy,
  Star,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react'
 '@/content/seo/fitness-parent-content'

// Mobile-optimized hero configuration
const mobileBreakpoints = {
  xs: 375,  // iPhone SE
  sm: 390,  // iPhone 14/15
  md: 412,  // Samsung Galaxy
  lg: 428,  // iPhone 14 Pro Max
  tablet: 768 // iPad Mini
}

// Stats optimized for mobile viewing - mother-focused
const mobileStats = [
  { icon: Users, value: '500+', label: 'Mums Stronger', color: 'from-orange-400 to-orange-600' },
  { icon: Trophy, value: '300%', label: 'Strength Gain', color: 'from-blue-400 to-blue-600' },
  { icon: Star, value: '3', label: 'Children', color: 'from-pink-400 to-pink-600' },
  { icon: Clock, value: '15yrs', label: 'Experience', color: 'from-green-400 to-green-600' },
]

// Powerful headlines that make parents stop scrolling and think "that's me"
const powerfulHeadlines = [
  { main: 'Be the Parent Who', highlight: 'Races Them Up the Stairs', sub: 'From £12/month • Free trial available' },
  { main: 'From School Run Exhaustion to', highlight: 'Spartan Strong', sub: '6 training options from £12-250/month' },
  { main: 'Strong Enough for', highlight: 'Piggybacks at 40', sub: 'Small groups, 1:1 coaching, or app-based' },
  { main: 'Your Kids Deserve the', highlight: 'Strongest Version of You', sub: 'Free assessment • Dereham location' }
]

const MobileOptimizedHero: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const { scrollY } = useScroll()

  // Subtle parallax for performance
  const imageY = useTransform(scrollY, [0, 300], [0, 20])
  const contentY = useTransform(scrollY, [0, 300], [0, -10])

  useEffect(() => {
    setIsClient(true)
    // Check for mobile width after mount to avoid hydration mismatch
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setShowScrollIndicator(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % powerfulHeadlines.length)
    }, 5000) // 5 seconds - time to read and connect emotionally

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi Leah, I\'d love to get properly strong again. Can we chat about training?')
    window.open(`https://wa.me/447990600958?text=${message}`, '_blank')
  }

  const handleBookingClick = () => {
    // Smooth scroll to booking section or open calendar
    const bookingSection = document.getElementById('booking')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen md:min-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Mobile-First Image Container */}
      <motion.div
        className="absolute inset-0 md:relative md:h-[60vh] lg:h-[85vh]"
        style={{ y: imageY }}
      >
        {/* Responsive Image with Smart Focal Point */}
        <div className="relative h-full w-full">
          <Image
            src="/images/hero/leah-training-action.webp"
            alt="Leah Fowler - Strength Coach for Mums, Mother of 3, Norfolk"
            fill
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover"
            style={{
              objectPosition: isMobile ? '50% 25%' : '50% 35%'
            }}
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent md:bg-gradient-to-r md:from-slate-900 md:via-slate-900/60 md:to-transparent" />
        </div>
      </motion.div>

      {/* Content Container - Mobile Optimized */}
      <motion.div
        className="relative z-10 min-h-screen md:min-h-[85vh] flex items-end md:items-center"
        style={{ y: contentY }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-24 md:pb-0 md:max-w-2xl">

          {/* Location Badge - Always Visible on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white">Norfolk&apos;s Strength Coach for Mums</span>
            </div>
          </motion.div>

          {/* Dynamic Headlines - Large & Readable */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeadline}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mb-8 md:mb-10"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">{powerfulHeadlines[currentHeadline].main}</span>
                <span className="block mt-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  {powerfulHeadlines[currentHeadline].highlight}
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl mt-3 text-white/90">
                  {powerfulHeadlines[currentHeadline].sub}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Subheading - Mobile Optimized */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 md:mb-10 leading-relaxed"
          >
            Smart strength training that fits around real life. Mother of 3, Spartan racer.
            From £12/month • Small groups or 1:1 • Join 500+ parents
          </motion.p>

          {/* Mobile-Optimized CTAs - Stack on Small Screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12"
          >
            {/* Primary CTA - Full Width on Mobile */}
            <button
              onClick={handleBookingClick}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-5 px-8 rounded-xl text-lg hover:scale-105 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 min-h-[60px]"
              aria-label="Book your free fitness assessment"
            >
              <Calendar className="w-5 h-5" />
              Start Getting Strong
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* WhatsApp CTA - Full Width on Mobile */}
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 min-h-[60px]"
              aria-label="Contact Leah on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Leah
            </button>
          </motion.div>

          {/* Horizontally Scrollable Stats for Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {mobileStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[100px]"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicator for Stats */}
            {showScrollIndicator && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-slate-900 to-transparent w-12 h-full flex items-center justify-end pr-2 pointer-events-none">
                <ChevronRight className="w-5 h-5 text-white/50 animate-pulse" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile-Only Quick Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 md:hidden">
        <div className="flex items-center justify-around py-3 px-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-white/80">Dereham</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-white/80">Mon-Sat</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-white/80">Mother of 3</span>
          </div>
        </div>
      </div>

    </section>
  )
}

export default MobileOptimizedHero