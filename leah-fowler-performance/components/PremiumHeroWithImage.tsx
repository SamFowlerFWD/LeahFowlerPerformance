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
  { icon: Users, label: 'Parents Trained', value: '500+', color: 'text-orange-500', glow: 'shadow-orange-500/30' },
  { icon: Trophy, label: 'Average Strength Gain', value: '300%', color: 'text-blue-500', glow: 'shadow-blue-500/30' },
  { icon: Award, label: 'Years Experience', value: '10+', color: 'text-green-500', glow: 'shadow-green-500/30' },
  { icon: Heart, label: 'Still Training', value: '85%', color: 'text-red-500', glow: 'shadow-red-500/30' },
]

// Powerful headlines that speak directly to parents' experiences and aspirations
// Each one addresses a specific moment every parent has felt or wanted
const powerfulHeadlines = [
  "Be the Parent Who Races Them Up the Stairs",
  "From School Run Exhaustion to Spartan Strong",
  "Strong Enough for Piggybacks at 40",
  "Your Kids Deserve the Strongest Version of You",
  "Remember When You Had Energy? Let's Get It Back.",
  "The Parent at Sports Day Everyone Asks About"
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
      className="relative min-h-screen overflow-x-visible overflow-y-hidden"
      style={{
        background: 'linear-gradient(to bottom right, var(--hero-background), var(--background))'
      }}
    >
      {/* Desktop: Split Layout / Mobile: Stacked - Full height */}
      <div className="relative flex flex-col lg:flex-row min-h-screen pt-32">

        {/* Image Container with Ken Burns & Parallax - Allow overflow */}
        <motion.div
          className="relative w-full lg:w-2/5 h-[40vh] md:h-[45vh] lg:h-[calc(100vh-8rem)] overflow-visible order-1 lg:order-2 lg:absolute lg:right-0 lg:top-0"
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

          {/* Gradient overlay for text readability */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--hero-background), transparent)',
              '@media (min-width: 1024px)': {
                background: 'linear-gradient(to right, var(--hero-background), transparent)'
              }
            }}
            style={{ opacity: overlayOpacity }}
          />

          {/* Premium gradient mesh overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold/20 via-transparent to-transparent blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sage/20 via-transparent to-transparent blur-2xl" />
          </div>

          {/* Removed floating particles that were creating visual artifacts */}
        </motion.div>

        {/* Content Container - Enhanced Premium Spacing */}
        <motion.div
          className="relative w-full lg:w-3/5 flex flex-col justify-center order-2 lg:order-1 px-6 sm:px-10 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 lg:h-full"
          style={{ y: contentY }}
        >
          {/* Background effects for content side */}
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, var(--hero-background), var(--background))' }} />
            {/* Noise texture - using class instead of inline style to avoid hydration issues */}
            <div className="absolute inset-0 opacity-[0.02] bg-noise" />
          </div>

          {/* Removed floating particles that were creating visual artifacts */}

          <div className="relative z-10 w-full max-w-2xl mx-auto lg:mx-0 lg:pt-8">
            {/* Powerful Headlines That Make Parents Stop Scrolling */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentHeadline}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-[1.1]"
                >
                  <span className="block" style={{ color: 'var(--hero-foreground)' }}>
                    {powerfulHeadlines[currentHeadline]}
                  </span>
                </motion.h1>
              </AnimatePresence>

              {/* Subheading - Leah's authentic credentials */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-sm md:text-base lg:text-lg max-w-2xl opacity-80"
                style={{ color: 'var(--hero-foreground)' }}
              >
                <span className="opacity-90" style={{ color: 'var(--hero-foreground)' }}>Norfolk Strength and Conditioning Coach</span> • Online Personal Trainer
              </motion.p>
            </div>

            {/* Premium CTAs with glass morphism - Consistent Sizing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/apply" className="inline-block">
                <button
                  className="px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 flex items-center gap-2"
                  style={{
                    backgroundColor: '#d4a574',
                    color: '#000000'
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <div className="w-6 h-10 border-2 rounded-full flex justify-center relative overflow-hidden transition-colors"
            style={{
              borderColor: 'var(--hero-foreground)',
              borderOpacity: 0.2
            }}>
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full mt-2"
              style={{ backgroundColor: 'var(--hero-foreground)' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default PremiumHeroWithImage