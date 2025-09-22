'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Star, Award, Users } from 'lucide-react'
import { fitnessHeroContent } from '@/content/seo/fitness-parent-content'

const stats = [
  { icon: Users, label: 'Parents Trained', value: '500+', color: 'text-gold', glow: 'shadow-gold/30' },
  { icon: Star, label: 'Strength Gains', value: '300%', color: 'text-sage', glow: 'shadow-sage/30' },
  { icon: Award, label: 'Mother of 3', value: 'Ultra Athlete', color: 'text-gold', glow: 'shadow-gold/30' },
  { icon: Brain, label: 'First Press-up', value: '3 Weeks', color: 'text-sage', glow: 'shadow-sage/30' },
]

export default function HeroStatsSection() {
  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-b from-navy-dark to-navy overflow-hidden">
      {/* Background texture - using class instead of inline style to avoid hydration issues */}
      <div className="absolute inset-0 opacity-[0.02] bg-noise" />

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Subheading - The compelling value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
            {fitnessHeroContent.subHeading}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative group"
            >
              <div className="relative flex flex-col items-center gap-2 px-6 py-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/70 text-center">{stat.label}</span>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl ${stat.glow} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Authority Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto">
            Smart strength training for busy parents • Norfolk's specialist parent fitness coach
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gold/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-sage/5 to-transparent rounded-full blur-3xl" />
    </section>
  )
}