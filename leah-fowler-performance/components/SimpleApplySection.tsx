"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SimpleApplySection() {
  return (
    <section id="apply-section" className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-6">
            Start Your Online Package Today
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              £100/month - Transform From Anywhere
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our most popular programme with smart app accountability, progress tracking,
            and weekly one-on-one reviews. 3-month commitment for lasting results.
          </p>

          {/* Simple benefits list */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-5 w-5 text-gold" />
              <span>Smart accountability system</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-5 w-5 text-gold" />
              <span>App-based tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-5 w-5 text-gold" />
              <span>Weekly progress reviews</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-8 py-6 text-lg shadow-xl hover:shadow-gold/30 transition-all duration-300"
                asChild
              >
                <Link href="/apply" className="flex items-center gap-2">
                  Apply for Online Package
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-navy dark:border-white text-navy dark:text-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy px-8 py-6 text-lg font-bold transition-all duration-300"
                asChild
              >
                <Link href="#programmes" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  View Programmes
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}