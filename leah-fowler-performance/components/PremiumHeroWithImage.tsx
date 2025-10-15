'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  Award,
  Users,
  ArrowRight,
  Play,
  Trophy,
  Heart
} from 'lucide-react'
 '@/content/seo/fitness-parent-content'
import { PremiumButton } from '@/components/ui/premium-button'
 '@/lib/animations'

interface HeroImageConfig {
  src: string
  alt: string
  priority: boolean
  sizes: string
  quality: number
  placeholder: 'blur' | 'empty'
  blurDataURL?: string
}

const heroImageConfig: HeroImageConfig = {
  src: '/images/hero/leah-hero-optimized.webp',
  alt: 'Leah Fowler - Strength Coach for Parents, Norfolk',
  priority: true,
  quality: 95,
  placeholder: 'blur',
  sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw',
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEB//EACYQAAIBAwMEAgMAAAAAAAAAAAECAwAEEQUhMRJBUWEGgZGhsf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMhMf/aAAwDAQACEQMRAD8AmdW1vRzNdvJcXDNyOpnGT7FBCnwQdTlNnYh3y3djuTRRUjZsf//Z'
}

// Premium spacing scale based on 8-point grid
const spacingScale = {
  mobile: 'clamp(2rem, 5vw, 3rem)',
  tablet: 'clamp(3rem, 6vw, 4rem)',
  desktop: 'clamp(4rem, 7vw, 6rem)'
}

const stats = [
  { icon: Award, label: 'Industry Leading', value: 'Level 4 S&C', color: 'text-orange-500', glow: 'shadow-orange-500/30' },
  { icon: Trophy, label: 'Years of Experience', value: 'Proven', color: 'text-blue-500', glow: 'shadow-blue-500/30' },
  { icon: Users, label: 'Client Retention', value: '85%+', color: 'text-green-500', glow: 'shadow-green-500/30' },
  { icon: Heart, label: 'Mother of', value: '3 Kids', color: 'text-red-500', glow: 'shadow-red-500/30' },
]

// Powerful headlines that speak directly to parents' experiences and aspirations
const powerfulHeadlines = [
  "Strong Enough for Piggybacks at 40",
  "Be the Parent Who Races Them Up the Stairs",
  "Reclaim the Part of You Before You Were 'Just a Mum'",
  "A Strength That Carries You Forward, Mind and Body",
  "Meet You Where You Are Now and Get You to the Start Line"
]

const PremiumHeroWithImage: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0)
  // Removed particles state to eliminate visual artifacts
  const { scrollY } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const heroRef = useRef<HTMLElement>(null)

  // Premium parallax transformations with improved thresholds
  const imageScale = useTransform(scrollY, [0, 800], [1, 1.1]) // Ken Burns effect - gentler and longer range
  const imageY = useTransform(scrollY, [0, 800], [0, 30]) // Parallax with gentler 0.15 factor
  const contentY = useTransform(scrollY, [0, 600], [0, -15]) // Much gentler content movement
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.4, 0.6]) // Subtler opacity change
  // Removed heroOpacity that was causing text to disappear

  // Rotate through powerful headlines that resonate with parents
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % powerfulHeadlines.length)
    }, 5000) // 5 seconds - enough time to read and connect emotionally
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 10
      const y = (clientY / window.innerHeight - 0.5) * 10
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Particles removed to eliminate visual artifacts

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-[100vh] md:min-h-[80vh] overflow-x-visible overflow-y-hidden"
      style={{
        background: 'linear-gradient(to bottom right, var(--hero-background), var(--background))'
      }}
    >
      {/* Desktop: Split Layout / Mobile: Full Screen Overlay */}
      <div className="relative min-h-[100vh] md:min-h-[80vh] md:flex md:flex-row">

        {/* Image Container - Full screen on mobile, split on desktop */}
        <motion.div
          className="absolute inset-0 md:relative md:w-2/5 md:h-[80vh] overflow-visible md:order-2"
          style={{ scale: imageScale, y: imageY }}
        >
          {/* Image with art direction */}
          <div className="absolute inset-0">
            <Image
              {...heroImageConfig}
              fill
              className="object-cover object-[50%_20%] lg:object-[50%_30%] scale-100"
              style={{ filter: 'brightness(0.95) contrast(1.1)' }}
            />
          </div>

          {/* Strong gradient overlay for mobile text readability */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent lg:hidden"
            style={{ opacity: overlayOpacity }}
          />
          {/* Desktop gradient */}
          <motion.div
            className="absolute inset-0 hidden lg:block"
            style={{
              background: 'linear-gradient(to right, var(--hero-background), transparent)',
              opacity: overlayOpacity.get()
            }}
          />

          {/* Premium gradient mesh overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e7007d]/20 via-transparent to-transparent blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#e7007d]/20 via-transparent to-transparent blur-2xl" />
          </div>

          {/* Removed floating particles that were creating visual artifacts */}
        </motion.div>

        {/* Content Container - Overlay on mobile, split on tablet/desktop */}
        <motion.div
          className="absolute inset-0 flex items-end pb-20 px-4 sm:px-6 md:relative md:w-3/5 md:flex md:flex-col md:justify-start md:items-start md:order-1 md:px-8 lg:px-16 md:py-8 lg:py-12 md:pt-16 lg:pt-20 md:pb-8 lg:pb-12 md:h-full"
          style={{ y: contentY }}
        >
          {/* Background effects for tablet/desktop content side only */}
          <div className="absolute inset-0 hidden md:block">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, var(--hero-background), var(--background))' }} />
            {/* Noise texture - using class instead of inline style to avoid hydration issues */}
            <div className="absolute inset-0 opacity-[0.02] bg-noise" />
          </div>

          {/* Removed floating particles that were creating visual artifacts */}

          <div className="relative z-10 w-full max-w-2xl mx-auto text-center md:text-left md:mx-0 md:pt-0">
            {/* Main Headline */}
            <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3 sm:space-y-4"
              >
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white md:text-foreground">
                  I can help you begin feeling like yourself again - in fact, my aim is to get you feeling better than ever before.
                </p>
              </motion.div>

            </div>

            {/* Premium CTAs with glass morphism - Consistent Sizing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Link href="/apply" className="inline-block">
                <button
                  className="px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 flex items-center gap-2"
                  style={{
                    backgroundColor: '#e7007d',
                    color: '#ffffff'
                  }}
                >
                  Apply for Coaching
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Rolling Headlines - Above scroll indicator, hidden on mobile */}
      <div className="hidden md:block absolute bottom-44 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentHeadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.2] text-white text-center"
          >
            {powerfulHeadlines[currentHeadline]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Scroll indicator - Hidden on mobile overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center relative overflow-hidden bg-black/30 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-4 rounded-full mt-2 bg-white"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default PremiumHeroWithImage