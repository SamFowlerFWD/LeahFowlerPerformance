'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Microscope,
  Zap,
  Rocket,
  CheckCircle,
  ChevronRight,
  Clock,
  Award,
  Shield,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { programmePositioning, conversionPsychology } from '@/content/seo/premium-positioning-content'

const ConsultancyProgrammes: React.FC = () => {
  const [selectedProgramme, setSelectedProgramme] = useState<string>('strategic')

  const programmeIcons = {
    diagnostic: Microscope,
    strategic: Zap,
    intensive: Rocket
  }

  return (
    <section className="py-20 bg-white dark:bg-navy">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Consultancy Engagement Options
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Select the engagement model that matches your ambition and timeline.
              Each is designed for measurable transformation, not incremental improvement.
            </p>
          </motion.div>

          {/* Programme Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(programmePositioning.consultancyTiers).map(([key, programme]) => {
              const IconComponent = programmeIcons[key as keyof typeof programmeIcons]
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedProgramme(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedProgramme === key
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-navy-light text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-lighter'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{programme.name}</span>
                  <span className="text-sm opacity-80">{programme.investment}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Programme Details */}
          <AnimatePresence mode="wait">
            {Object.entries(programmePositioning.consultancyTiers).map(([key, programme]) => {
              if (key !== selectedProgramme) return null
              const IconComponent = programmeIcons[key as keyof typeof programmeIcons]

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid lg:grid-cols-3 gap-8"
                >
                  {/* Main Programme Card */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white dark:from-navy-light dark:to-navy rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {programme.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {programme.positioning}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {programme.investment}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {programme.duration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        What&apos;s Included:
                      </h4>
                      <ul className="space-y-3">
                        {programme.includes.map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ideal For:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {programme.idealFor}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-navy rounded-xl p-4">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                          Expected Outcome:
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 font-semibold">
                          {programme.outcome}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Side Information Card */}
                  <div className="space-y-6">
                    {/* Risk Reversal */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-navy-light dark:to-navy rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800"
                    >
                      <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        {conversionPsychology.riskReversal.headline}
                      </h4>
                      {conversionPsychology.riskReversal.guarantees.map((guarantee, index) => (
                        <div key={index} className="mb-3">
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                            {guarantee.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {guarantee.description}
                          </p>
                        </div>
                      ))}
                    </motion.div>

                    {/* Urgency */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-navy-light dark:to-navy rounded-2xl p-6 border border-orange-200 dark:border-orange-800"
                    >
                      <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        Limited Availability
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {conversionPsychology.sophisticatedUrgency.scarcity}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {conversionPsychology.sophisticatedUrgency.qualification}
                      </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      <Link
                        href="/book-consultation"
                        className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <span>Begin Engagement Process</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <button className="w-full px-6 py-3 bg-white dark:bg-navy-light text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy transition-colors">
                        Download Programme Details
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Low Commitment Entry */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center bg-gradient-to-r from-gray-50 to-blue-50 dark:from-navy-light dark:to-navy rounded-2xl p-8"
          >
            <Award className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Not Ready for Full Engagement?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start with our {conversionPsychology.lowCommitmentEntry.primaryOffer.name}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {conversionPsychology.lowCommitmentEntry.primaryOffer.price}
              </span>
              <span className="text-sm text-gray-500">
                {conversionPsychology.lowCommitmentEntry.primaryOffer.duration}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {conversionPsychology.lowCommitmentEntry.primaryOffer.outcome}
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-navy text-blue-600 dark:text-blue-400 font-semibold rounded-xl border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-navy-dark transition-colors"
            >
              {conversionPsychology.lowCommitmentEntry.primaryOffer.bookingText}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              {conversionPsychology.lowCommitmentEntry.primaryOffer.noStrings}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ConsultancyProgrammes