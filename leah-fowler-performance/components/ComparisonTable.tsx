"use client"

import * as React from 'react'
import { Check, X, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComparisonTable() {
  const features = [
    {
      category: 'Training & Coaching',
      items: [
        {
          feature: 'Group Training Sessions',
          foundation: true,
          performance: true,
          elite: true,
          youth: true,
        },
        {
          feature: '1-to-1 Coaching Sessions',
          foundation: false,
          performance: 'Weekly',
          elite: '2x Weekly',
          youth: false,
        },
        {
          feature: 'Customised Programming',
          foundation: false,
          performance: true,
          elite: true,
          youth: true,
        },
        {
          feature: 'Trainerize App Access',
          foundation: true,
          performance: true,
          elite: true,
          youth: true,
        },
      ],
    },
    {
      category: 'Support & Accountability',
      items: [
        {
          feature: 'WhatsApp Support',
          foundation: false,
          performance: true,
          elite: 'Daily',
          youth: false,
        },
        {
          feature: 'Progress Reviews',
          foundation: 'Monthly',
          performance: 'Monthly',
          elite: 'Fortnightly',
          youth: 'Quarterly',
        },
        {
          feature: 'Community Access',
          foundation: true,
          performance: true,
          elite: true,
          youth: true,
        },
        {
          feature: 'Priority Booking',
          foundation: false,
          performance: false,
          elite: true,
          youth: false,
        },
      ],
    },
    {
      category: 'Nutrition & Lifestyle',
      items: [
        {
          feature: 'Nutrition Guidance',
          foundation: false,
          performance: true,
          elite: true,
          youth: true,
        },
        {
          feature: 'Meal Planning',
          foundation: false,
          performance: 'Basic',
          elite: 'Advanced',
          youth: 'Growth-focused',
        },
        {
          feature: 'Lifestyle Optimisation',
          foundation: false,
          performance: 'Basic',
          elite: 'Complete',
          youth: false,
        },
        {
          feature: 'Recovery Protocols',
          foundation: false,
          performance: true,
          elite: true,
          youth: true,
        },
      ],
    },
    {
      category: 'Testing & Analysis',
      items: [
        {
          feature: 'Performance Testing',
          foundation: false,
          performance: 'Quarterly',
          elite: 'Monthly',
          youth: 'Quarterly',
        },
        {
          feature: 'Body Composition',
          foundation: false,
          performance: true,
          elite: true,
          youth: false,
        },
        {
          feature: 'Competition Prep',
          foundation: false,
          performance: true,
          elite: true,
          youth: true,
        },
        {
          feature: 'Video Analysis',
          foundation: false,
          performance: false,
          elite: true,
          youth: false,
        },
      ],
    },
    {
      category: 'Exclusive Benefits',
      items: [
        {
          feature: 'Family Discount',
          foundation: false,
          performance: false,
          elite: '25% off',
          youth: 'Sibling discount',
        },
        {
          feature: 'VIP Events Access',
          foundation: false,
          performance: false,
          elite: true,
          youth: false,
        },
        {
          feature: 'Alumni Benefits',
          foundation: false,
          performance: false,
          elite: 'Lifetime',
          youth: false,
        },
        {
          feature: 'Parent Education',
          foundation: false,
          performance: false,
          elite: false,
          youth: true,
        },
      ],
    },
  ]

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      )
    }
    if (value === false) {
      return (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )
    }
    return (
      <span className="text-sm font-medium text-navy dark:text-gold text-center block">
        {value}
      </span>
    )
  }

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-navy-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white mb-4">
            Compare Programme Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find the perfect programme for your performance goals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-navy/30">
                  <th className="text-left p-4 font-semibold text-navy dark:text-white">
                    Features
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold">Foundation</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      £197/mo
                    </div>
                  </th>
                  <th className="p-4 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-gold text-navy text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                    <div className="text-navy dark:text-white font-bold mt-4">Performance</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      £497/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold">Elite</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      £997/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold">Youth</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      £297/mo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIdx) => (
                  <React.Fragment key={categoryIdx}>
                    <tr className="bg-gray-50 dark:bg-navy/50">
                      <td
                        colSpan={5}
                        className="p-3 font-semibold text-sm uppercase tracking-wider text-gray-600 dark:text-gray-300"
                      >
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-b border-gray-100 dark:border-navy/20 hover:bg-gray-50 dark:hover:bg-navy/30 transition-colors"
                      >
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          {item.feature}
                        </td>
                        <td className="p-4">{renderValue(item.foundation)}</td>
                        <td className="p-4 bg-gold/5 dark:bg-gold/10">
                          {renderValue(item.performance)}
                        </td>
                        <td className="p-4">{renderValue(item.elite)}</td>
                        <td className="p-4">{renderValue(item.youth)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-sage/10 rounded-xl border border-gold/20"
        >
          <div className="flex items-start gap-3">
            <Star className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-navy dark:text-white mb-2">
                Not sure which programme is right for you?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Take our free performance assessment to receive a personalised recommendation
                based on your goals, current fitness level, and lifestyle.
              </p>
              <a
                href="/assessment"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-light transition-colors"
              >
                Take the Assessment
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}