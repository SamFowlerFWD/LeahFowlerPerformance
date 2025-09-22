"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hasShown, setHasShown] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [role, setRole] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState('')
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  React.useEffect(() => {
    // Check if already shown in this session
    const alreadyShown = localStorage.getItem('exitIntentShown')
    const leadMagnetDelivered = localStorage.getItem('leadMagnetDelivered')

    if (alreadyShown || leadMagnetDelivered) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger on desktop and when mouse leaves from top
      if (e.clientY <= 0 && !hasShown && window.innerWidth > 768) {
        setIsOpen(true)
        setHasShown(true)
      }
    }

    // Also trigger after 30 seconds on page if not shown
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }, 30000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [hasShown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      // Store lead data in Supabase
      const { error: dbError } = await supabase
        .from('lead_magnets_delivered')
        .insert({
          name: name,
          email: email,
          role: role || null,
          lead_magnet_id: 'exit-intent-guide',
          lead_magnet_title: 'Mum Fitness Transformation Guide',
          marketing_consent: true, // Implied by form submission
          delivered_at: new Date().toISOString(),
          source: 'exit-intent',
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails
      }

      // Log GDPR consent
      await supabase
        .from('gdpr_consent_log')
        .insert({
          email: email,
          consent_type: 'marketing',
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
          consent_version: '2.0'
        })

      setSubmitSuccess(true)

      // Store in localStorage to prevent showing again
      localStorage.setItem('exitIntentShown', 'true')
      localStorage.setItem('leadMagnetDelivered', JSON.stringify({
        email: email,
        magnetId: 'exit-intent-guide',
        deliveredAt: new Date().toISOString()
      }))

      // Close popup after short delay to show success
      setTimeout(() => {
        setIsOpen(false)
      }, 2000)

    } catch (err) {
      console.error('Submission error:', err)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-0" aria-describedby="exit-popup-description">
            {/* Accessibility Title - Visually Hidden */}
            <DialogTitle className="sr-only">Special Offer - Free Fitness Transformation Guide</DialogTitle>
            <DialogDescription id="exit-popup-description" className="sr-only">
              Get your free fitness transformation guide worth £97. Enter your email to receive instant access to our comprehensive training programme.
            </DialogDescription>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-light to-sage opacity-10" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Close offer dialog"
              >
                <X className="h-5 w-5 text-navy dark:text-white" />
              </button>

              <div className="relative grid lg:grid-cols-2">
                {/* Left Side - Offer */}
                <div className="bg-gradient-to-br from-navy via-navy-dark to-navy p-12 text-white">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                    >
                      <Gift className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium">Exclusive Offer</span>
                    </motion.div>

                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-bold leading-tight"
                    >
                      Wait! Don't Leave Empty-Handed
                    </motion.h2>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-white/90"
                    >
                      Get your FREE Fitness Transformation Guide - normally £97
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-3 w-3 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold">From Zero to Hero</p>
                          <p className="text-sm text-white/70">The exact path I took from zero fitness to ultra athlete</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-3 w-3 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold">12-Week Strength Building Plan</p>
                          <p className="text-sm text-white/70">Your complete training programme to get properly strong</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-3 w-3 text-gold" />
                        </div>
                        <div>
                          <p className="font-semibold">Strong Mum Masterclass</p>
                          <p className="text-sm text-white/70">60-minute session on building strength as a busy mum</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-2 text-gold"
                    >
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Offer expires in 10 minutes</span>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white dark:bg-navy-dark p-12">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">
                        Yes! Send Me The Free Guide
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Join 500+ mums who've got properly strong
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSubmitting || submitSuccess}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting || submitSuccess}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Role (Optional)
                        </label>
                        <input
                          type="text"
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          disabled={isSubmitting || submitSuccess}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy/30 bg-white dark:bg-navy/30 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50"
                          placeholder="e.g., Mother of 3, New Mum"
                        />
                      </div>

                      {/* Error Message */}
                      {submitError && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                          {submitError}
                        </div>
                      )}

                      {/* Success Message */}
                      {submitSuccess && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
                          Success! Check your email for your free guide.
                        </div>
                      )}

                      <motion.div
                        whileHover={!isSubmitting && !submitSuccess ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting && !submitSuccess ? { scale: 0.98 } : {}}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting || submitSuccess}
                          className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold py-6 rounded-xl shadow-lg hover:shadow-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <span>Sending...</span>
                          ) : submitSuccess ? (
                            <span>Sent Successfully!</span>
                          ) : (
                            <>
                              <span>Get Your Free Guide Now</span>
                              <ArrowRight className="h-5 w-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>

                    {/* Trust Indicators */}
                    <div className="pt-6 border-t border-gray-200 dark:border-navy/30">
                      <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>No Spam</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}