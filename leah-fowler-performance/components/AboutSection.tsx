"use client"

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  Award,
  GraduationCap
} from 'lucide-react'

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
    <section id="about" className="py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-navy via-navy/95 to-navy-dark relative overflow-hidden">
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
          <div className="w-full h-full bg-gradient-to-br from-[#e7007d]/10 via-transparent to-[#e7007d]/10 blur-3xl" />
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
              <div className="absolute -inset-4 bg-gradient-to-r from-[#e7007d]/30 via-amber-300/20 to-[#e7007d]/30 rounded-3xl blur-2xl opacity-60" />
              
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
                  <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-[#e7007d]/20 to-amber-100/40 backdrop-blur-sm transition-all duration-300 group-hover:from-[#e7007d]/30 group-hover:to-amber-100/50">
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-[#e7007d]-dark transition-transform duration-300 group-hover:scale-110" />
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
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
<h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-normal text-white mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
              My Goal for you
            </h2>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                I work with busy parents, parents with high pressure jobs, people who are juggling family life and responsibilities around their busy schedules.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                My coaching is centred around building a body that enables you to live your life to the fullest.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-[#e7007d] leading-relaxed font-semibold">
                You&apos;ll be amazed at what your body can do.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                Coaching that isn&apos;t centred around quick fixes, gimmicks or unrealistic visions.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                I understand what it feels like to lose a bit of yourself through becoming a parent. Although I have always loved being outside and physically active, now I am a mum I can appreciate just how important exercise is, both physically and mentally.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 leading-relaxed">
                I can help you to build strength and confidence that will help you to feel like you again.
              </p>
            </div>

          </motion.div>
        </div>

        {/* My Story - Full Width Single Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-12 sm:mb-16 md:mb-20"
        >
          <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              This is more than just future proofing your body. I want you to enjoy life right now.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              Whether you want to get better at a sport or hobby, try something new or go back to something you enjoyed when you were younger, I can help you achieve that, and hopefully you&apos;ll be able to have fun along the way too. Life is for living, this is your opportunity to grab it.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              All you need to do to get started is make a plan, that can start with a chat.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              If you&apos;re ready to invest in yourself, for your future self and the person you want to be right now, let&apos;s arrange a call.
            </p>
          </div>
        </motion.div>


      </div>
    </section>
  )
}