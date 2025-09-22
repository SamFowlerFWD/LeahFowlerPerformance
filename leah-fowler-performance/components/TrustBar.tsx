"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Users, TrendingUp, Star, Clock } from 'lucide-react'

export default function TrustBar() {
  const trustMetrics = [
    {
      icon: <Users className="h-6 w-6" />,
      metric: '500+',
      label: 'Clients Transformed',
      color: 'text-gold',
    },
    {
      icon: <Award className="h-6 w-6" />,
      metric: '15+',
      label: 'Years Experience',
      color: 'text-sage',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      metric: '92%',
      label: 'Achievement Rate',
      color: 'text-navy dark:text-gold',
    },
    {
      icon: <Star className="h-6 w-6" />,
      metric: '4.9/5',
      label: 'Client Rating',
      color: 'text-gold',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      metric: '24hr',
      label: 'Response Time',
      color: 'text-sage',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      metric: '100%',
      label: 'Secure Payments',
      color: 'text-navy dark:text-gold',
    },
  ]

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-navy-dark dark:via-navy dark:to-navy-dark border-y border-gray-200 dark:border-navy/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {trustMetrics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex p-3 rounded-full bg-gray-100 dark:bg-navy-dark/50 mb-3 ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-navy dark:text-white mb-1">
                {item.metric}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-navy/30"
        >
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                PCI DSS Compliant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                GDPR Compliant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                SSL Encrypted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Stripe Verified
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trusted by executives, entrepreneurs, and elite athletes across Norfolk and beyond
          </p>
        </motion.div>
      </div>
    </section>
  )
}