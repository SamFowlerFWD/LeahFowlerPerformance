"use client"

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  Award,
  GraduationCap,
  Users,
  Target,
  Heart,
  CheckCircle,
  Trophy,
  Star,
  Sparkles
} from 'lucide-react'

const credentials = [
  {
    icon: Heart,
    title: 'Mother of 3',
    subtitle: 'Who Gets the Real-Life Juggle',
    color: 'from-red-600 to-pink-600'
  },
  {
    icon: Trophy,
    title: 'Spartan Ultra Finisher',
    subtitle: 'From Zero Press-ups to 50K Races',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Users,
    title: '500+ Mums Stronger',
    subtitle: 'Properly Strong, Not Just Surviving',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Award,
    title: '15 Years Coaching',
    subtitle: 'Real Experience, Real Results',
    color: 'from-green-500 to-emerald-500'
  },
]

const stats = [
  { value: '500+', label: 'Mums Trained', icon: Heart },
  { value: '127', label: 'Race Finishes', icon: Trophy },
  { value: '300%', label: 'Average Strength Gain', icon: Star },
  { value: '3wk', label: 'First Press-up', icon: Target },
]

const expertise = [
  'Strength Training for Mums',
  'Postnatal Fitness Recovery',
  'Progressive Strength Building',
  'Real-Life Fitness Solutions',
  'Sustainable Training Plans',
  'No-Guilt Fitness Approach',
  'School-Run Friendly Sessions',
  'Building Lasting Strength',
]

const mediaLogos = [
  { name: 'Spartan', placeholder: 'SPARTAN RACE' },
  { name: 'Norfolk', placeholder: 'NORFOLK FITNESS' },
  { name: 'Community', placeholder: 'MUM FITNESS COMMUNITY' },
  { name: 'Success', placeholder: 'SUCCESS STORIES' },
]

// iOS 16 Glassmorphism Card Component
const GlassCard = ({
  children,
  className = '',
  delay = 0,
  position = 'top-right'
}: {
  children: React.ReactNode,
  className?: string,
  delay?: number,
  position?: 'top-right' | 'bottom-left'
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking for light refraction effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 300 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / rect.width
    const y = (e.clientY - centerY) / rect.height

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  // Float animation
  const floatY = position === 'top-right'
    ? [0, -8, 0]
    : [0, -10, 0]

  return (
    <motion.div
      ref={cardRef}
      animate={{ y: floatY }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`absolute ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94] // iOS easing curve
        }}
        className="relative"
      >
        {/* iOS 16 Premium Glass Effect Container */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            // iOS 16 exact glassmorphism values
            background: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)', // Safari support
            border: '1px solid rgba(255, 255, 255, 0.125)',
            boxShadow: `
              0 8px 32px rgba(31, 38, 135, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              inset 0 0 0 1px rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 0 rgba(255, 255, 255, 0.2)
            `,
            willChange: 'transform',
          }}
        >
          {/* Light refraction overlay - tracks mouse */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `radial-gradient(
                600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%,
                rgba(255, 255, 255, 0.15),
                transparent 40%
              )`,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Subtle gradient overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
            }}
          />

          {/* Content with proper padding */}
          <div className="relative p-4 md:p-6">
            {children}
          </div>
        </div>

        {/* Subtle pulse glow on hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
            filter: 'blur(1px)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-navy via-navy/95 to-navy-dark relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02]" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="w-full h-full bg-gradient-to-br from-gold/10 via-transparent to-sage/10 blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
          
          {/* Left: Image & Credentials */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/30 via-amber-300/20 to-sage/30 rounded-3xl blur-2xl opacity-60" />
              
              {/* Coach Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl z-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/images/leah/leah-about.webp"
                    alt="Leah Fowler - Performance Consultant"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority
                  />
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* iOS 16 Style Floating Credential Cards */}
              <GlassCard
                position="top-right"
                className="-top-6 -right-6 z-10 hidden md:block max-w-[200px] lg:max-w-[240px] group"
                delay={0}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/40 backdrop-blur-sm transition-all duration-300 group-hover:from-gold/30 group-hover:to-amber-100/50">
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-gold-dark transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-medium">Strength Coach</p>
                    <p className="font-bold text-navy text-sm md:text-lg">Mum Fitness Expert</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard
                position="bottom-left"
                className="-bottom-6 -left-6 z-10 hidden md:block max-w-[200px] lg:max-w-[240px] group"
                delay={1.5}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-100/40 to-indigo-100/40 backdrop-blur-sm transition-all duration-300 group-hover:from-blue-100/50 group-hover:to-indigo-100/50">
                    <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-medium">Specialist</p>
                    <p className="font-bold text-navy text-sm md:text-lg">S&C Coach</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 sm:mt-10 md:mt-12 text-center"
            >
              <div className="inline-block">
                <div className="h-16 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-signature text-gold italic">
                  Leah Fowler
                </div>
                <p className="text-white/60 text-sm sm:text-base mt-1 sm:mt-2">Founder & Lead Coach</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-gold/20 to-amber-100/20 backdrop-blur-sm border border-gold/30 text-gold-light text-xs sm:text-sm md:text-base font-semibold mb-6 sm:mb-8 md:mb-10"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="uppercase tracking-wider">YOUR FAMILY FITNESS COACH</span>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
              Leah Fowler
            </h2>

            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl text-orange-500 font-medium mb-6 sm:mb-8 md:mb-10 leading-tight">
              Family Fitness & Athletic Performance Specialist
            </p>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                From new mum to Ultra athlete, I understand the challenges of balancing family life with fitness goals.
                I&apos;ve completed 3 Spartan Ultra Beasts, an Outlaw Triathlon, and coached over 200 families to transform
                their health together. As a mum of two, I prove daily that extraordinary is possible.
              </p>

              <p className="text-sm sm:text-base md:text-lg lg:text-lg text-white/80 leading-relaxed">
                Whether you&apos;re training for your first 5K or your fifth Spartan Race, developing your child&apos;s athletic
                potential, or wanting to get fit as a family, I provide the coaching, community, and accountability you
                need. From our Dereham base, we&apos;re building Norfolk&apos;s strongest, most supportive fitness family.
              </p>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              {credentials.map((cred, index) => (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:bg-white/15 transition-all hover:scale-105 duration-300"
                >
                  <div className={`inline-flex p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${cred.color} mb-3 sm:mb-4`}>
                    <cred.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{cred.title}</h4>
                  <p className="text-white/60 text-xs sm:text-sm md:text-base leading-relaxed">{cred.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-6 md:gap-8 p-6 sm:p-8 md:p-10 lg:p-12 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="text-center"
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gold mx-auto mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm md:text-base text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Expertise & Media */}
        <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-32">
          {/* Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-6 sm:mb-8 md:mb-10">Core Expertise</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 max-w-5xl mx-auto">
              {expertise.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs sm:text-sm md:text-base hover:bg-white/15 transition-colors"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-sage" />
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Media Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-white/60 text-xs sm:text-sm md:text-base uppercase tracking-wider mb-6 sm:mb-8">Proud Partners & Achievements</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 opacity-60">
              {mediaLogos.map((media) => (
                <div key={media.name} className="text-white/80 font-bold text-sm sm:text-base md:text-xl lg:text-2xl tracking-wider">
                  {media.placeholder}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}