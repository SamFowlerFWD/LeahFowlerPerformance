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
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'group' | 'personal' | 'online'>('all')
  const [showComparison, setShowComparison] = React.useState(false)
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
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold font-medium text-sm mb-6">
            <TrendingUp className="h-4 w-4" />
            Transform Your Strength • Transform Your Life
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold mt-2">Training Journey</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Evidence-based strength training for busy parents. Join 500+ parents who&apos;ve
            reclaimed their strength, energy and confidence.
          </p>

          {/* Social Proof Bar */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {urgencyContent.social.totalClients}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {urgencyContent.social.retention}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mother of 3 • Spartan Athlete
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <div
            role="tablist"
            aria-label="Filter training packages"
            className="inline-flex items-center p-1 rounded-full bg-gray-100 dark:bg-navy-dark/50 border border-gray-200 dark:border-gold/20"
          >
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
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              All Packages
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
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'group'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              Group Training
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
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'personal'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              Personal Training
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
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'online'
                  ? 'bg-white dark:bg-gold text-navy shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white'
              }`}
            >
              Online
            </button>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16"
          style={{
            opacity: isAnimating ? 0.5 : 1,
            pointerEvents: isAnimating ? 'none' : 'auto'
          }}
        >
          {filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.slug}
              variants={cardVariants}
              className={`relative ${pkg.popular ? 'lg:-mt-8' : ''}`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy text-xs font-bold shadow-lg">
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div
                className={`relative h-full p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-gold via-gold-light to-gold shadow-2xl border-2 border-gold/30'
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
                      ? 'bg-navy/10 dark:bg-gold/10'
                      : 'bg-gold/10'
                  }`}>
                    <div className={
                      pkg.popular
                        ? 'text-navy'
                        : pkg.color === 'sage'
                        ? 'text-sage'
                        : pkg.color === 'navy'
                        ? 'text-navy dark:text-gold'
                        : 'text-gold'
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
                            pkg.popular ? 'bg-navy/10' : 'bg-gold/10'
                          }`}>
                            <Check className={`h-3 w-3 ${
                              pkg.popular ? 'text-navy' : 'text-gold'
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
                    className={`w-full py-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-navy hover:bg-navy-dark text-white shadow-xl hover:shadow-2xl'
                        : pkg.name === 'Gold'
                        ? 'bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy'
                        : 'bg-gradient-to-r from-sage to-sage-light hover:from-sage-light hover:to-sage text-white'
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Guarantee */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className={
                      pkg.popular ? 'text-navy/70' : 'text-gray-600 dark:text-gray-400'
                    }>
                      {pkg.guarantee}
                    </span>
                  </div>
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

        {/* Social Runs Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-sage via-sage-light to-sage text-white"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{socialRuns.name}</h3>
              <p className="text-white/90 mb-3">{socialRuns.description}</p>
              <div className="flex flex-wrap gap-3">
                {socialRuns.features.map((feature, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-white/20 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <Button
              className="bg-white text-sage hover:bg-white/90 px-8 py-6 rounded-xl font-bold shadow-xl"
            >
              {socialRuns.cta}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Comparison Table Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
            className="px-8 py-6 rounded-xl font-medium border-2 border-navy dark:border-gold text-navy dark:text-gold hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all duration-300"
          >
            <BarChart className="mr-2 h-5 w-5" />
            {showComparison ? 'Hide' : 'Show'} Package Comparison
          </Button>
        </motion.div>

        {/* Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 overflow-x-auto"
          >
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-xl">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">Online Package</th>
                  <th className="p-4 text-center">Small Group</th>
                  <th className="p-4 text-center">Semi-Private</th>
                  <th className="p-4 text-center">Silver</th>
                  <th className="p-4 text-center">Gold</th>
                  <th className="p-4 text-center">Pathway</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-navy-dark">
                {packageComparison.features.map((feature, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-navy/30">
                    <td className="p-4 font-medium text-navy dark:text-white">{feature.name}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.onlinePackage}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.smallGroup}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.semiPrivate}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.silver}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.gold}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{feature.pathway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Location & What's Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {/* Location Info */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-navy via-navy-dark to-navy-dark text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-gold" />
              Training Location
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gold mb-2">{locationInfo.venue}</h4>
                <p className="text-white/80">{locationInfo.address}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Facilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {locationInfo.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gold" />
                      <span className="text-sm text-white/80">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-gold via-gold-light to-gold">
            <h3 className="text-2xl font-bold mb-6 text-navy flex items-center gap-3">
              <Trophy className="h-6 w-6" />
              Why Choose Aphrodite Fitness
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Mother of 3, Spartan Athlete</h4>
                  <p className="text-sm text-navy/80">I understand the challenges parents face</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Evidence-Based Methods</h4>
                  <p className="text-sm text-navy/80">Science-backed techniques for real results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">500+ Parents Transformed</h4>
                  <p className="text-sm text-navy/80">Join a supportive community of strong parents</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Real-World Strength</h4>
                  <p className="text-sm text-navy/80">Training that improves your daily life</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Not sure which programme is right for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                // Scroll to booking section
                const bookingSection = document.getElementById('booking')
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-gold to-gold-light text-navy hover:from-gold-light hover:to-gold transition-all duration-300 shadow-xl"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Assessment
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              variant="outline"
              className="px-8 py-6 rounded-xl font-bold text-lg border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Leah
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600 dark:text-gray-400">
            <a href={`tel:${locationInfo.contact.phone}`} className="flex items-center gap-2 hover:text-gold transition">
              <Phone className="h-4 w-4" />
              {locationInfo.contact.phone}
            </a>
            <a href={`mailto:${locationInfo.contact.email}`} className="flex items-center gap-2 hover:text-gold transition">
              <FileText className="h-4 w-4" />
              {locationInfo.contact.email}
            </a>
            <a href={`https://${locationInfo.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition">
              <Activity className="h-4 w-4" />
              {locationInfo.contact.website}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}