'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, BarChart3, Users, Microscope, Target, BookOpen } from 'lucide-react'
import { trustBuildingContent } from '@/content/seo/premium-positioning-content'

const WhyChooseSection: React.FC = () => {
  const iconMap = {
    Award,
    BarChart3,
    Users,
    Microscope,
    Target,
    BookOpen
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-navy dark:to-navy-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {trustBuildingContent.methodologyOverview.headline}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {trustBuildingContent.methodologyOverview.subheadline}
            </p>
          </motion.div>

          {/* Four Pillars Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {trustBuildingContent.methodologyOverview.pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-navy-light rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {pillar.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="font-medium">Scientific Basis:</span> {pillar.scientific_basis}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Measurable Metrics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.metrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 dark:bg-navy-dark rounded-full text-xs text-gray-700 dark:text-gray-300"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    {pillar.outcome}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mother Fitness Expertise Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-navy-light dark:to-navy rounded-3xl p-12 mb-20"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Qualifications */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Mother Fitness Expertise
                </h3>
                <ul className="space-y-2">
                  {trustBuildingContent.professionalAuthority.qualifications.map((qual, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {qual}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Continuous Education */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Continuous Excellence
                </h3>
                <ul className="space-y-2">
                  {trustBuildingContent.professionalAuthority.continuousEducation.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unique Context */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {trustBuildingContent.professionalAuthority.uniqueContext.headline}
                </h3>
                <ul className="space-y-2">
                  {trustBuildingContent.professionalAuthority.uniqueContext.points.map((point, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Transformation Stories */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            >
              {trustBuildingContent.transformationStories.headline}
            </motion.h2>

            <div className="grid lg:grid-cols-3 gap-6">
              {Object.entries(trustBuildingContent.transformationStories)
                .filter(([key]) => key !== 'headline')
                .map(([key, story], index) => {
                  const transformationStory = story as unknown
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white dark:bg-navy-light rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transformationStory.profile}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Challenge: {transformationStory.challenge}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Intervention:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transformationStory.intervention}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantified Results:
                        </p>
                        <ul className="space-y-1">
                          {transformationStory.results.quantitative.map((result: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                              <span className="mt-1">✓</span>
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">
                          &quot;{transformationStory.results.qualitative}&quot;
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection