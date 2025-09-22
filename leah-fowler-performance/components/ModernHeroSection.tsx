"use client"

import * as React from 'react'
importfrom 'next/link'
importfrom 'next/image'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Star,
  Sparkles,
  Users,
  Award,
  Brain,
  Play
} from 'lucide-react'
 '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PremiumButton } from '@/components/ui/premium-button'
import { OptimizedHeroImage } from './OptimizedHeroImage'
import {
  easings
} from '@/lib/animations'

const stats = [
  { icon: Users, label: 'Mothers Transformed', value: '500+', color: 'text-gold', glow: 'shadow-gold/30' },
  { icon: Star, label: 'Success Rate', value: '98%', color: 'text-sage', glow: 'shadow-sage/30' },
  { icon: Award, label: 'Years Excellence', value: '15+', color: 'text-gold', glow: 'shadow-gold/30' },
  { icon: Brain, label: 'Science-Based', value: '100%', color: 'text-sage', glow: 'shadow-sage/30' },
]

const kineticWords = ['Peak Performance', 'Elite Energy', 'Mental Clarity', 'Life Balance', 'Sustainable Success']

export default function ModernHeroSection() {
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  const [currentWord, setCurrentWord] = React.useState(0)
  const [particles, setParticles] = React.useState<Array<{x: string, y: string, xEnd: string, duration: number, delay: number}>>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  // Premium parallax transformations
  const heroY = useTransform(scrollY, [0, 1000], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1])
  const textY = useTransform(scrollY, [0, 300], [0, -50])
  const bgY = useTransform(scrollY, [0, 1000], [0, 400])
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.1])
  
  // Kinetic text animation with smooth transitions
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % kineticWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      mouseX.set(x)
      mouseY.set(y)
      setMousePosition({ x: clientX, y: clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  // Generate premium particles on client side only (reduced for performance)
  React.useEffect(() => {
    if (!shouldReduceMotion) {
      const newParticles = [...Array(30)].map(() => ({
        x: `${Math.random() * 100}%`,
        y: `120%`,
        xEnd: `${Math.random() * 100}%`,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 15
      }))
      setParticles(newParticles)
    }
  }, [shouldReduceMotion])
  
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: shouldReduceMotion ? 1 : heroOpacity }}
      aria-label="Hero section with performance coaching introduction"
      role="region"
    >
      {/* Hero Image Container with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 1.1, opacity: 0 }}
        animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: easings.luxury }}
        aria-hidden="true"
      >
        {/* Desktop Hero Image with Ken Burns */}
        <motion.div
          className="hidden md:block absolute inset-0"
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.05, 1]
}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <OptimizedHeroImage
            webpSrc="/images/hero/performance-consultant-norfolk-uk.webp"
            jpegSrc="/images/hero/performance-consultant-norfolk-uk.jpg"
            alt="Leah Fowler - Elite Fitness Consultant specialising in mother fitness and strength training in Norfolk, UK"
            sizes="100vw"
            objectPosition="center"
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Mobile Hero Image - Different composition */}
        <motion.div
          className="md:hidden absolute inset-0"
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.08, 1]
}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <OptimizedHeroImage
            webpSrc="/images/hero/leah-fowler-performance-coach-norfolk.webp"
            jpegSrc="/images/hero/leah-fowler-performance-coach-norfolk.jpg"
            alt="Leah Fowler - Performance Coach helping busy mothers achieve peak fitness and sustainable success in Dereham, Norfolk"
            sizes="100vw"
            objectPosition="top"
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy-dark/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/40 via-transparent to-navy-dark/40" />
      </motion.div>

      {/* Enhanced Gradient Background Layer */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 bg-gradient-to-br from-navy/20 via-transparent to-navy-dark/30"
      >
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.5" />
          </svg>
        </div>
        
        {/* Interactive gradient that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 165, 116, 0.3), transparent)`
}}
        />

        {/* Premium animated gradient orbs - Respect reduced motion */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, 150, 0],
            y: [0, -150, 0],
            scale: [1, 1.2, 1]
}}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-gradient-radial from-gold/50 via-gold/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : {
            x: [0, -150, 0],
            y: [0, 150, 0],
            scale: [1, 1.3, 1]
}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 -right-48 w-[700px] h-[700px] bg-gradient-radial from-sage/40 via-sage/20 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </motion.div>

      {/* Floating particles with glow - Delayed Entry */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          aria-hidden="true"
        >
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gradient-to-br from-gold to-gold-light rounded-full shadow-[0_0_10px_rgba(212,165,116,0.5)]"
              initial={{
                x: particle.x,
                y: particle.y
}}
              animate={{
                y: "-20%",
                x: particle.xEnd
}}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear",
                delay: particle.delay + 0.2
}}
            />
          ))}
        </motion.div>
      )}

      {/* Floating premium badges */}
      <motion.div
        className="absolute top-20 left-10 lg:left-20 z-20"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        role="complementary"
        aria-label="Achievement badge"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-2xl"
          animate={shouldReduceMotion ? {} : {
            y: [0, -10, 0]
}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: easings.smooth
}}
        >
          <span className="text-gold text-sm font-bold">Top 1% Consultant</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 lg:right-20 z-20"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        role="complementary"
        aria-label="Experience badge"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-2xl"
          animate={shouldReduceMotion ? {} : {
            y: [0, 10, 0]
}}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: easings.smooth
}}
        >
          <span className="text-sage text-sm font-bold">15 Years Excellence</span>
        </motion.div>
      </motion.div>

      {/* Main Content with enhanced animations */}
      <motion.div
        style={{
          y: textY
}}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-20 lg:pb-28"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Trust Badge - Staggered Entry */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }}
            className="inline-block mb-12"
          >
            <Badge className="px-8 py-4 text-sm font-bold bg-gradient-to-r from-gold/20 to-sage/20 backdrop-blur-xl border-2 border-gold/30 text-white hover:bg-gold/30 hover:border-gold/50 transition-all duration-500 shadow-2xl">
              <Sparkles className="h-5 w-5 text-gold mr-3 animate-pulse" />
              UK&apos;s Premier Performance Consultant • Dereham, Norfolk
              <Award className="h-5 w-5 text-sage ml-3" />
            </Badge>
          </motion.div>

          {/* Main Heading with Kinetic Text - Staggered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.85] tracking-tight">
              <span className="block mb-4">Transform Your</span>
              <span className="block h-[1.2em] relative" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 50, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -50, filter: 'blur(20px)' }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: easings.luxury }}
                    className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent font-bold drop-shadow-2xl"
                    role="text"
                  >
                    {kineticWords[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* Enhanced Subheading - Refined Timing */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Expert coaching for busy mothers who want to
            <span className="text-gold font-medium"> feel stronger, perform better, and live longer</span>.
            Online or In-Person Training Available.
          </motion.p>

          {/* Premium CTA Buttons with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-24"
          >
            <PremiumButton
              size="xl"
              variant="primary"
              pulse={!shouldReduceMotion}
              shimmer={!shouldReduceMotion}
              icon={<ArrowRight className="w-6 h-6" aria-hidden="true" />}
              className="min-w-[300px]"
              aria-label="Start your transformation journey with Leah Fowler Performance"
            >
              Start Your Transformation
            </PremiumButton>

            <PremiumButton
              size="xl"
              variant="luxury"
              icon={<Play className="w-6 h-6" aria-hidden="true" />}
              iconPosition="left"
              className="min-w-[250px]"
              aria-label="Watch client success stories and testimonials"
            >
              Watch Success Stories
            </PremiumButton>
          </motion.div>

          {/* Animated Stats Grid - Final Entry */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.2 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"
                  style={{
                    boxShadow: `0 0 40px rgba(212, 165, 116, 0.3)`
}}
                />
                <motion.div
                  className="relative flex flex-col items-center gap-2 px-6 py-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 transition-all duration-500"
                  style={shouldReduceMotion ? {} : {
                    transformStyle: 'preserve-3d',
                    rotateY: smoothMouseX,
                    rotateX: smoothMouseY
}}
                  whileHover={shouldReduceMotion ? {} : {
                    boxShadow: '0 20px 40px rgba(212, 165, 116, 0.3)'
}}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} aria-hidden="true" />
                  <motion.span
                    className="text-4xl font-bold text-white"
                    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 1.4 + index * 0.1, type: "spring", stiffness: 100 }}
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-sm text-white/80 text-center font-medium" aria-hidden="true">{stat.label}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Live notification (appears after delay) */}
          {!shouldReduceMotion && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3, duration: 0.5 }}
              className="fixed bottom-8 left-8 z-50 hidden lg:block"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 max-w-xs border border-gold/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-navy">New client from Norfolk</p>
                    <p className="text-xs text-gray-600">Just started their fitness assessment</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        role="navigation"
        aria-label="Scroll indicator"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">Scroll to explore</span>
          <button
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden group hover:border-white/50 transition-colors duration-300"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            aria-label="Scroll down to explore more content"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gradient-to-b from-gold to-gold-light rounded-full mt-2"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}