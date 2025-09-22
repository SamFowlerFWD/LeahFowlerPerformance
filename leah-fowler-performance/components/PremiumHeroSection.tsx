'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, TrendingUp, Shield, Activity, ChevronRight, CheckCircle, Award } from 'lucide-react'
import { premiumHeroContent } from '@/content/seo/premium-positioning-content'

const PremiumHeroSection: React.FC = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0)
  const headlines = [
    premiumHeroContent.mainHeading,
    premiumHeroContent.heroVariations.analytical.heading,
    premiumHeroContent.heroVariations.authority.heading,
    premiumHeroContent.heroVariations.efficiency.heading
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const iconMap = {
    Brain: Brain,
    Graph: TrendingUp,
    Shield: Shield,
    Microscope: Activity
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-navy-dark dark:via-navy dark:to-navy-light overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Premium gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Authority Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-navy-light/90 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {premiumHeroContent.badge}
              </span>
            </div>
          </motion.div>

          {/* Dynamic Headline */}
          <div className="text-center mb-12">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeadline}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                {headlines[currentHeadline]}
              </motion.h1>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              {premiumHeroContent.subHeading}
            </motion.p>
          </div>

          {/* Core Value Props Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {premiumHeroContent.coreValueProps.map((prop, index) => {
              const IconComponent = iconMap[prop.icon as keyof typeof iconMap]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
                >
                  <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {prop.headline}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {prop.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {prop.proof}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Credibility Markers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {Object.values(premiumHeroContent.credibilityMarkers).map((marker, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marker.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {marker.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {marker.detail}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/assessment"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>{premiumHeroContent.primaryCTA.text}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="hidden sm:inline text-sm opacity-90">
                ({premiumHeroContent.primaryCTA.subtext})
              </span>
            </Link>

            <Link
              href="/methodology"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 dark:bg-navy-light/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy transition-colors"
            >
              <span>{premiumHeroContent.secondaryCTA.text}</span>
              <span className="text-sm opacity-90">
                ({premiumHeroContent.secondaryCTA.subtext})
              </span>
            </Link>
          </motion.div>

          {/* Local Authority Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {premiumHeroContent.geographicAuthority.local.differentiator}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {premiumHeroContent.geographicAuthority.local.proof}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PremiumHeroSection