"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewsletterSection() {
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Add Mailchimp integration here
    // For now, just simulate submission
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1000)
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-navy via-navy-dark to-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[#e7007d]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#e7007d] to-amber-500 mb-6 sm:mb-8"
          >
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Stay Connected
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our community and get expert training tips, performance insights, and exclusive updates delivered to your inbox.
          </p>

          {/* Form or Success Message */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-2xl mx-auto w-full">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xl justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 sm:h-14 px-6 text-base sm:text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-[#e7007d] transition-all duration-300 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto sm:min-w-[160px] h-12 sm:h-14 px-8 bg-gradient-to-r from-[#e7007d] to-amber-500 hover:from-[#c70069] hover:to-amber-600 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group whitespace-nowrap"
                >
                  {isLoading ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-white/60 text-xs sm:text-sm mt-4 text-center">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Welcome to the Community!
                </h3>
                <p className="text-white/70">
                  Check your inbox for a confirmation email.
                </p>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </section>
  )
}
