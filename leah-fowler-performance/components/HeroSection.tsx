"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { icon: CheckCircle, label: '200+ Mothers Transformed' },
  { icon: Star, label: '98% Success Rate' },
  { icon: Sparkles, label: 'Evidence-Based Methods' },
]

export default function HeroSection() {
  const { scrollY } = useScroll()
  const [particles, setParticles] = React.useState<Array<{x: string, y: string, duration: number, delay: number}>>([])  
  
  // Parallax effects for different elements
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const scaleText = useTransform(scrollY, [0, 200], [1, 0.95])
  
  // Generate particles on client side only
  React.useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 md:py-40 lg:py-48">
      {/* Gradient Background with Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy-dark">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sage/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: [null, "-100vh"],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        style={{ 
          y: heroY, 
          opacity: heroOpacity, 
          scale: scaleText,
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}
        className="relative z-10 max-w-8xl mx-auto pt-40 md:pt-48 lg:pt-56 pb-32 md:pb-40"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-base font-medium mb-12 md:mb-16"
          >
            <Sparkles className="h-5 w-5 text-gold" />
            Norfolk&apos;s Elite Performance Consultant
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-white mb-12 md:mb-16 leading-[0.9] tracking-tight"
          >
            Unlock Your
            <span className="block mt-4 md:mt-6 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              Peak Performance
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white/90 mb-12 md:mb-16 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Transform your fitness excellence with evidence-based strategies
            for sustainable high achievement
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xl sm:text-2xl md:text-3xl text-gold mb-16 md:mb-20 max-w-4xl mx-auto font-semibold leading-relaxed"
          >
            You&apos;ll be amazed at what your body can do.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center mb-20 md:mb-24"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy text-xl font-bold px-16 py-10 h-auto shadow-2xl hover:shadow-gold/30 transform hover:-translate-y-1 transition-all duration-300 rounded-2xl"
              asChild
            >
              <Link href="#assessment" className="flex items-center gap-2">
                Start Your Assessment
                <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-navy text-xl font-bold px-16 py-10 h-auto backdrop-blur-sm transition-all duration-300 rounded-2xl"
              asChild
            >
              <Link href="#programmes">
                Explore Programmes
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="h-6 w-6 text-gold" />
                <span className="text-lg text-white/90 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}