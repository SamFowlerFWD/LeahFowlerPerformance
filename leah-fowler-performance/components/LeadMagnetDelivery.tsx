"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Mail, CheckCircle2, Loader2, AlertCircle, Gift, Sparkles, ArrowRight, FileText, Video, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface LeadMagnet {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'audio' | 'bundle'
  value: string
  downloadUrl: string
  icon: React.ReactNode
}

interface FormData {
  name: string
  email: string
  role?: string
  company?: string
  marketingConsent: boolean
}

type DeliveryState = 'form' | 'loading' | 'success' | 'error'

export default function LeadMagnetDelivery() {
  const [deliveryState, setDeliveryState] = React.useState<DeliveryState>('form')
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    role: '',
    company: '',
    marketingConsent: false
  })
  const [error, setError] = React.useState<string>('')
  const [deliveredMagnet, setDeliveredMagnet] = React.useState<LeadMagnet | null>(null)

  const leadMagnets: LeadMagnet[] = [
    {
      id: 'performance-guide',
      title: 'Mum Fitness Transformation Guide',
      description: '47-page guide: From zero press-ups to Spartan Ultra - my complete fitness journey',
      type: 'pdf',
      value: '£97',
      downloadUrl: '/downloads/performance-optimisation-guide.pdf',
      icon: <FileText className="h-6 w-6" />
    },
    {
      id: 'masterclass-recording',
      title: 'Strong Mum Masterclass',
      description: '60-minute masterclass on building real strength as a busy mum',
      type: 'video',
      value: '£197',
      downloadUrl: '/downloads/masterclass-recording.mp4',
      icon: <Video className="h-6 w-6" />
    },
    {
      id: 'meditation-series',
      title: 'Mindful Strength Series',
      description: '5-part series: Building mental resilience alongside physical strength',
      type: 'audio',
      value: '£67',
      downloadUrl: '/downloads/mindfulness-series.zip',
      icon: <Headphones className="h-6 w-6" />
    },
    {
      id: 'ultimate-bundle',
      title: 'Complete Fitness Bundle',
      description: 'Everything you need: Guide + Masterclass + Mindfulness + 12-Week Training Plan',
      type: 'bundle',
      value: '£397',
      downloadUrl: '/downloads/ultimate-bundle.zip',
      icon: <Gift className="h-6 w-6" />
    }
  ]

  // Select which lead magnet to deliver (can be customized based on context)
  const [selectedMagnet] = React.useState<LeadMagnet>(leadMagnets[0])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setDeliveryState('loading')

    try {
      // Store lead data in Supabase
      const { error: dbError } = await supabase
        .from('lead_magnets_delivered')
        .insert({
          name: formData.name,
          email: formData.email,
          role: formData.role || null,
          company: formData.company || null,
          lead_magnet_id: selectedMagnet.id,
          lead_magnet_title: selectedMagnet.title,
          marketing_consent: formData.marketingConsent,
          delivered_at: new Date().toISOString(),
          source: 'website',
          ip_address: null, // Would need server-side for this
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails - user experience is priority
      }

      // Log GDPR consent if given
      if (formData.marketingConsent) {
        await supabase
          .from('gdpr_consent_log')
          .insert({
            email: formData.email,
            consent_type: 'marketing',
            consent_given: true,
            consent_timestamp: new Date().toISOString(),
            consent_version: '2.0'
          })
      }

      // Simulate email delivery (in production, this would trigger actual email)
      await new Promise(resolve => setTimeout(resolve, 1500))

      setDeliveredMagnet(selectedMagnet)
      setDeliveryState('success')

      // Store in localStorage to prevent re-showing forms
      localStorage.setItem('leadMagnetDelivered', JSON.stringify({
        email: formData.email,
        magnetId: selectedMagnet.id,
        deliveredAt: new Date().toISOString()
      }))

    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again.')
      setDeliveryState('error')
    }
  }

  const handleDownload = () => {
    if (deliveredMagnet) {
      // Track download
      supabase
        .from('lead_magnet_downloads')
        .insert({
          email: formData.email,
          lead_magnet_id: deliveredMagnet.id,
          downloaded_at: new Date().toISOString()
        })
        .then(() => {
          // Open download in new tab
          window.open(deliveredMagnet.downloadUrl, '_blank')
        })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Form State */}
        {deliveryState === 'form' && (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-navy-dark rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header with Lead Magnet Preview */}
            <div className="bg-gradient-to-br from-gold via-gold-light to-sage p-8 text-navy">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-navy/10 backdrop-blur-sm">
                  {selectedMagnet.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-navy/20 px-2 py-1 rounded">
                      FREE RESOURCE
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/30 px-2 py-1 rounded">
                      VALUE: {selectedMagnet.value}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedMagnet.title}
                  </h3>
                  <p className="text-navy/80 text-sm">
                    {selectedMagnet.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Role Field (Optional) */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Role (Optional)
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="e.g., Mother of 3, Working Mum"
                  />
                </div>

                {/* Company Field (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Your company name"
                  />
                </div>

                {/* Marketing Consent */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gold/5 border border-gold/20">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded text-gold focus:ring-gold border-gray-300"
                  />
                  <label htmlFor="marketingConsent" className="text-sm text-gray-600 dark:text-gray-300">
                    Yes, I'd like to receive weekly performance insights and exclusive offers from Leah Fowler Performance.
                    You can unsubscribe at any time.
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 rounded-xl bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold text-lg shadow-xl hover:shadow-gold/30 transition-all duration-300"
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Me The Free {selectedMagnet.type === 'pdf' ? 'Guide' : selectedMagnet.type === 'video' ? 'Masterclass' : selectedMagnet.type === 'audio' ? 'Audio Series' : 'Bundle'}
              </Button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>No Spam</span>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Loading State */}
        {deliveryState === 'loading' && (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-navy-dark rounded-2xl shadow-2xl p-12 text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-gold" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">
                  Preparing Your Resource...
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're sending your {selectedMagnet.title} to {formData.email}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>This usually takes just a few seconds</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {deliveryState === 'success' && deliveredMagnet && (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-navy-dark rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Success Header */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-4"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              <h3 className="text-3xl font-bold mb-2">
                Success! Check Your Email
              </h3>
              <p className="text-white/90">
                We've sent your {deliveredMagnet.title} to {formData.email}
              </p>
            </div>

            {/* Success Content */}
            <div className="p-8 space-y-6">
              {/* Quick Access */}
              <div className="p-6 rounded-xl bg-gold/10 border border-gold/20">
                <h4 className="font-semibold text-navy dark:text-white mb-3">
                  Quick Access to Your Resource:
                </h4>
                <Button
                  onClick={handleDownload}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold transition-all duration-300"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download {deliveredMagnet.type === 'pdf' ? 'PDF Guide' : deliveredMagnet.type === 'video' ? 'Video' : deliveredMagnet.type === 'audio' ? 'Audio Files' : 'Bundle'} Now
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                  Also check your email for the download link
                </p>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h4 className="font-semibold text-navy dark:text-white">
                  Your Next Steps:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy dark:text-white">Check Your Inbox</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Look for an email from hello@leahfowlerperformance.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy dark:text-white">Review Your Resource</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Take 15 minutes to go through the key insights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy dark:text-white">Book Your Consultation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ready to accelerate your results? Schedule a free strategy call
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA for Consultation */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-navy to-navy-dark text-white">
                <h4 className="font-bold text-xl mb-2">
                  Ready to Transform Your Performance?
                </h4>
                <p className="text-white/80 text-sm mb-4">
                  Join 500+ mothers who've reclaimed their identity
                </p>
                <Button
                  className="w-full py-4 rounded-lg bg-white text-navy hover:bg-gray-100 font-semibold transition-all duration-300"
                >
                  Book Free Strategy Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Support Note */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or{' '}
                <button className="text-gold underline">contact support</button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {deliveryState === 'error' && (
          <motion.div
            key="error"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-navy-dark rounded-2xl shadow-2xl p-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white">
                Oops! Something Went Wrong
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {error || 'We encountered an issue delivering your resource.'}
              </p>
              <Button
                onClick={() => {
                  setDeliveryState('form')
                  setError('')
                }}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-semibold"
              >
                Try Again
              </Button>
              <p className="text-sm text-gray-500">
                Or email us directly at{' '}
                <a href="mailto:hello@leahfowlerperformance.com" className="text-gold underline">
                  hello@leahfowlerperformance.com
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}