"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Star,
  Crown,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Brain,
  Calendar,
  Phone,
  FileText,
  BarChart,
  MapPin,
  MessageCircle,
  ChevronRight,
  Heart,
  Trophy,
  Activity,
  Target,
  Dumbbell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  aphroditeFitnessPackages,
  socialRuns,
  locationInfo,
  packageComparison,
  urgencyContent
} from '@/content/seo/aphrodite-pricing-content'

export default function AphroditePricingTiers() {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'group' | 'personal' | 'online'>('online')
  const [showComparison, setShowComparison] = React.useState(true)
  const [isAnimating, setIsAnimating] = React.useState(false)

  // Convert packages object to array for mapping with error handling
  const packages = React.useMemo(() => {
    try {
      return Object.values(aphroditeFitnessPackages).filter(pkg => pkg && pkg.slug)
    } catch (error) {
      console.error('Error loading packages:', error)
      return []
    }
  }, [])

  // Filter packages based on selected category with error handling
  const filteredPackages = React.useMemo(() => {
    try {
      // Ensure packages exist and have valid data
      if (!packages || packages.length === 0) {
        console.warn('No packages available for filtering')
        return []
      }

      const filtered = packages.filter(pkg => {
        // Validate package has required properties
        if (!pkg || !pkg.slug) {
          console.warn('Invalid package data:', pkg)
          return false
        }

        // Apply category filters
        switch (selectedCategory) {
          case 'all':
            return true
          case 'group':
            return pkg.slug === 'small-group'
          case 'personal':
            return ['semi-private', 'silver', 'gold'].includes(pkg.slug)
          case 'online':
            return ['online-package', 'pathway'].includes(pkg.slug)
          default:
            console.warn('Unknown category:', selectedCategory)
            return true // Fallback to showing all packages
        }
      })

      // Log filter results for debugging
      console.log(`Filtered ${filtered.length} packages for category '${selectedCategory}'`)
      return filtered
    } catch (error) {
      console.error('Error filtering packages:', error)
      // Return all packages as fallback on error
      return packages || []
    }
  }, [selectedCategory, packages])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 0.8
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  }

  const getIcon = (color: string) => {
    switch(color) {
      case 'gold': return <Crown className="h-6 w-6" />
      case 'sage': return <Dumbbell className="h-6 w-6" />
      case 'navy': return <Target className="h-6 w-6" />
      default: return <Star className="h-6 w-6" />
    }
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi Leah, I'm interested in your training packages. Can we discuss which option would be best for me?`)
    window.open(`https://wa.me/447990600958?text=${message}`, '_blank')
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7007d]/10 border border-[#e7007d]/20 text-[#e7007d] font-medium text-sm mb-6">
            <TrendingUp className="h-4 w-4" />
            Transform Your Strength • Transform Your Life
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold mt-2">Training Journey</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Evidence-based strength training for busy parents and professionals.
            Reclaim your strength, energy and confidence with personalised coaching.
          </p>

          {/* Social Proof Bar */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#e7007d]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {urgencyContent.social.totalClients}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#e7007d]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {urgencyContent.social.retention}
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div
            role="tablist"
            aria-label="Filter training packages"
            className="flex items-center justify-center w-full px-2 sm:inline-flex sm:w-auto sm:px-0"
          >
            <div className="inline-flex items-center p-0.5 sm:p-1 rounded-full bg-gray-100 dark:bg-navy-dark/50 border border-gray-200 dark:border-[#e7007d]/20 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true)
                  setSelectedCategory('all')
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                role="tab"
                aria-selected={selectedCategory === 'all'}
                aria-controls="pricing-panel"
                className={`px-2 sm:px-4 md:px-6 py-1 sm:py-2.5 rounded-full font-medium text-[10px] sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-[#e7007d] text-navy shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true)
                  setSelectedCategory('group')
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                role="tab"
                aria-selected={selectedCategory === 'group'}
                aria-controls="pricing-panel"
                className={`px-2 sm:px-4 md:px-6 py-1 sm:py-2.5 rounded-full font-medium text-[10px] sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                  selectedCategory === 'group'
                    ? 'bg-white dark:bg-[#e7007d] text-navy shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
                }`}
              >
                Group
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true)
                  setSelectedCategory('personal')
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                role="tab"
                aria-selected={selectedCategory === 'personal'}
                aria-controls="pricing-panel"
                className={`px-2 sm:px-4 md:px-6 py-1 sm:py-2.5 rounded-full font-medium text-[10px] sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                  selectedCategory === 'personal'
                    ? 'bg-white dark:bg-[#e7007d] text-navy shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true)
                  setSelectedCategory('online')
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                role="tab"
                aria-selected={selectedCategory === 'online'}
                aria-controls="pricing-panel"
                className={`px-2 sm:px-4 md:px-6 py-1 sm:py-2.5 rounded-full font-medium text-[10px] sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                  selectedCategory === 'online'
                    ? 'bg-white dark:bg-[#e7007d] text-navy shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
                }`}
              >
                Online
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          id="pricing-panel"
          role="tabpanel"
          aria-label="Training packages"
          key={selectedCategory} // Force remount on category change for clean animation
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className={`grid gap-8 lg:gap-10 mb-16 ${
            filteredPackages.length === 1
              ? 'md:grid-cols-1 lg:grid-cols-1 place-items-center'
              : filteredPackages.length === 2
              ? 'md:grid-cols-2 lg:grid-cols-2 justify-center max-w-4xl mx-auto'
              : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
          style={{
            opacity: isAnimating ? 0.5 : 1,
            pointerEvents: isAnimating ? 'none' : 'auto'
          }}
        >
          {filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.slug}
              variants={cardVariants}
              className={`relative ${pkg.popular ? 'lg:-mt-8' : ''} ${
                filteredPackages.length === 1 ? 'w-full max-w-md' : ''
              }`}
            >
              <div
                className={`relative h-full p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-[#e7007d] via-gold-light to-[#e7007d] shadow-2xl border-2 border-[#e7007d]/30'
                    : 'bg-white dark:bg-navy-dark shadow-xl hover:shadow-2xl border border-gray-200 dark:border-navy/30'
                }`}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    pkg.popular
                      ? 'bg-navy/10'
                      : pkg.color === 'sage'
                      ? 'bg-sage/10'
                      : pkg.color === 'navy'
                      ? 'bg-navy/10 dark:bg-[#e7007d]/10'
                      : 'bg-[#e7007d]/10'
                  }`}>
                    <div className={
                      pkg.popular
                        ? 'text-navy'
                        : pkg.color === 'sage'
                        ? 'text-sage'
                        : pkg.color === 'navy'
                        ? 'text-navy dark:text-[#e7007d]'
                        : 'text-[#e7007d]'
                    }>
                      {getIcon(pkg.color)}
                    </div>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${
                    pkg.popular ? 'text-navy' : 'text-navy dark:text-white'
                  }`}>
                    {pkg.name}
                  </h3>

                  <p className={`text-sm mb-6 ${
                    pkg.popular ? 'text-navy/80' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {pkg.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-2">
                    <span className={`text-5xl font-bold ${
                      pkg.popular ? 'text-navy' : 'text-navy dark:text-white'
                    }`}>
                      {pkg.currency}{pkg.price}
                    </span>
                    <span className={`text-lg ${
                      pkg.popular ? 'text-navy/70' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {pkg.period}
                    </span>
                  </div>

                  {/* Session times for small group */}
                  {pkg.sessions && (
                    <div className="flex justify-center gap-4 text-xs mt-3">
                      <span className="px-3 py-1 bg-sage/10 text-sage rounded-full">
                        Mon {pkg.sessions.monday}
                      </span>
                      <span className="px-3 py-1 bg-sage/10 text-sage rounded-full">
                        Fri {pkg.sessions.friday}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {pkg.features.slice(0, 8).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            pkg.popular ? 'bg-navy/10' : 'bg-[#e7007d]/10'
                          }`}>
                            <Check className={`h-3 w-3 ${
                              pkg.popular ? 'text-navy' : 'text-[#e7007d]'
                            }`} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-400">−</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-sm ${
                        feature.highlight
                          ? pkg.popular ? 'font-bold text-navy' : 'font-bold text-navy dark:text-white'
                          : feature.included
                          ? pkg.popular ? 'text-navy/80' : 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-600 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div className="space-y-4">
                  <Button
                    className={`w-full px-6 py-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                      pkg.popular
                        ? 'bg-navy hover:bg-navy-dark text-white shadow-xl hover:shadow-2xl'
                        : pkg.name === 'Gold'
                        ? 'bg-gradient-to-r from-[#e7007d] to-[#e7007d]-light hover:from-[#e7007d]-light hover:to-[#e7007d] text-navy'
                        : 'bg-gradient-to-r from-sage to-[#e7007d]-light hover:from-sage-light hover:to-[#e7007d] text-white'
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )) : (
            <motion.div
              variants={cardVariants}
              className="col-span-full text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  No packages available in this category.
                </p>
                <Button
                  onClick={() => {
                    setIsAnimating(true)
                    setSelectedCategory('all')
                    setTimeout(() => setIsAnimating(false), 300)
                  }}
                  variant="outline"
                  className="px-6 py-3"
                >
                  View All Packages
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  )
}