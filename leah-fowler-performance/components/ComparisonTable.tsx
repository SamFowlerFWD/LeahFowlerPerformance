"use client"

import * as React from 'react'
import {
  Check,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComparisonTable() {
  const features = [
    {
      category: 'Training Format',
      items: [
        {
          feature: 'Group Training (Max 6)',
          pathway: false,
          flexi: false,
          semiPrivate: false,
          smallGroup: true,
          silver: false,
          gold: false
},
        {
          feature: '1-to-1 Personal Training',
          pathway: false,
          flexi: 'Every 4-6 weeks',
          semiPrivate: false,
          smallGroup: false,
          silver: 'Weekly',
          gold: '2x Weekly'
},
        {
          feature: '2-to-1 Partner Training',
          pathway: false,
          flexi: false,
          semiPrivate: true,
          smallGroup: false,
          silver: false,
          gold: false
},
        {
          feature: 'Online Programme',
          pathway: true,
          flexi: true,
          semiPrivate: false,
          smallGroup: false,
          silver: false,
          gold: false
},
        {
          feature: 'App-Based Training',
          pathway: true,
          flexi: true,
          semiPrivate: true,
          smallGroup: false,
          silver: true,
          gold: true
},
      ]
},
    {
      category: 'Programming & Support',
      items: [
        {
          feature: 'Personalised Programming',
          pathway: 'Self-paced',
          flexi: true,
          semiPrivate: true,
          smallGroup: 'Group-based',
          silver: true,
          gold: 'Advanced'
},
        {
          feature: 'Nutrition Guidance',
          pathway: false,
          flexi: false,
          semiPrivate: true,
          smallGroup: false,
          silver: true,
          gold: 'Advanced'
},
        {
          feature: 'WhatsApp Support',
          pathway: false,
          flexi: true,
          semiPrivate: false,
          smallGroup: false,
          silver: true,
          gold: 'Daily'
},
        {
          feature: 'Progress Reviews',
          pathway: false,
          flexi: 'Monthly',
          semiPrivate: 'Monthly',
          smallGroup: false,
          silver: 'Monthly',
          gold: 'Fortnightly'
},
        {
          feature: 'Exercise Video Library',
          pathway: true,
          flexi: true,
          semiPrivate: true,
          smallGroup: true,
          silver: true,
          gold: true
},
      ]
},
    {
      category: 'Community & Access',
      items: [
        {
          feature: 'Private Facebook Group',
          pathway: false,
          flexi: false,
          semiPrivate: true,
          smallGroup: true,
          silver: true,
          gold: true
},
        {
          feature: 'Community Forum',
          pathway: true,
          flexi: false,
          semiPrivate: false,
          smallGroup: false,
          silver: false,
          gold: false
},
        {
          feature: 'Monthly Live Q&A',
          pathway: true,
          flexi: false,
          semiPrivate: false,
          smallGroup: false,
          silver: false,
          gold: false
},
        {
          feature: 'Priority Scheduling',
          pathway: false,
          flexi: false,
          semiPrivate: false,
          smallGroup: false,
          silver: false,
          gold: true
},
        {
          feature: 'Flexible Session Times',
          pathway: true,
          flexi: true,
          semiPrivate: true,
          smallGroup: 'Fixed times',
          silver: true,
          gold: true
},
      ]
},
    {
      category: 'Testing & Assessment',
      items: [
        {
          feature: 'Initial Assessment',
          pathway: false,
          flexi: true,
          semiPrivate: true,
          smallGroup: true,
          silver: true,
          gold: true
},
        {
          feature: 'Performance Testing',
          pathway: false,
          flexi: false,
          semiPrivate: 'Quarterly',
          smallGroup: false,
          silver: 'Quarterly',
          gold: 'Monthly'
},
        {
          feature: 'Competition Preparation',
          pathway: false,
          flexi: false,
          semiPrivate: true,
          smallGroup: false,
          silver: true,
          gold: true
},
        {
          feature: 'Recovery Protocols',
          pathway: false,
          flexi: false,
          semiPrivate: false,
          smallGroup: false,
          silver: false,
          gold: true
},
      ]
},
    {
      category: 'Pricing & Value',
      items: [
        {
          feature: 'Monthly Price',
          pathway: '£12',
          flexi: '£80',
          semiPrivate: '£90/person',
          smallGroup: '£40/month*',
          silver: '£140',
          gold: '£250'
},
        {
          feature: 'Trial/Guarantee',
          pathway: '7 days free',
          flexi: '30-day guarantee',
          semiPrivate: 'First session £25',
          smallGroup: 'First session free',
          silver: '30-day guarantee',
          gold: '60-day guarantee'
},
        {
          feature: 'Ad-hoc Sessions',
          pathway: false,
          flexi: false,
          semiPrivate: '£25/person',
          smallGroup: false,
          silver: false,
          gold: false
},
        {
          feature: 'Family/Guest Benefits',
          pathway: false,
          flexi: false,
          semiPrivate: 'Partner discount',
          smallGroup: false,
          silver: false,
          gold: 'Guest passes'
},
      ]
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
      <span className="text-xs font-medium text-navy dark:text-gold text-center block">
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
            Compare Training Packages
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find the perfect training programme for your fitness goals
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            *Small Group: £120 for 12 sessions over 3 months = £40/month average
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[1000px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-navy/30">
                  <th className="text-left p-4 font-semibold text-navy dark:text-white">
                    Features
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold text-sm">Pathway</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £12/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold text-sm">Flexi</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £80/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold text-sm">Semi-Private</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £90/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold text-sm">Small Group</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £120/3mo
                    </div>
                  </th>
                  <th className="p-4 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-2 py-1 rounded-full bg-gold text-navy text-xs font-bold">
                        POPULAR
                      </span>
                    </div>
                    <div className="text-navy dark:text-white font-bold text-sm mt-4">Silver</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £140/mo
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-navy dark:text-white font-bold text-sm">Gold</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      £250/mo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIdx) => (
                  <React.Fragment key={categoryIdx}>
                    <tr className="bg-gray-50 dark:bg-navy/50">
                      <td
                        colSpan={7}
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
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                          {item.feature}
                        </td>
                        <td className="p-4">{renderValue(item.pathway)}</td>
                        <td className="p-4">{renderValue(item.flexi)}</td>
                        <td className="p-4">{renderValue(item.semiPrivate)}</td>
                        <td className="p-4">{renderValue(item.smallGroup)}</td>
                        <td className="p-4 bg-gold/5 dark:bg-gold/10">
                          {renderValue(item.silver)}
                        </td>
                        <td className="p-4">{renderValue(item.gold)}</td>
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
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Need help choosing the right package for you?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold hover:shadow-2xl transition-all duration-300"
          >
            Get Personalised Recommendation
          </a>
        </motion.div>
      </div>
    </section>
  )
}