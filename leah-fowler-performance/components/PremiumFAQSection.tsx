'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import Script from 'next/script'
import { seoOptimizedContent } from '@/content/seo/premium-positioning-content'

const faqData = [
  {
    question: "What exactly is performance consultancy, and how does it differ from coaching?",
    answer: "Performance consultancy applies scientific methodologies to optimise human performance across cognitive, physical, and emotional domains. Unlike traditional coaching which relies on motivation and accountability, consultancy uses data analysis, evidence-based interventions, and measurable protocols. Think of it as hiring McKinsey for your personal performance—we diagnose, prescribe, and measure, rather than motivate.",
    category: "methodology"
  },
  {
    question: "I'm already successful. Why would I need performance consultancy?",
    answer: "Our data shows that even busy mothers typically operate at 60-70% of their physical capacity. The difference between surviving and thriving often lies in the final 30%. We work with mothers who want to become strong and energised. If you're content with feeling tired, we're not the right fit. If you believe there's another level of strength and vitality, we have the methodology to unlock it.",
    category: "value"
  },
  {
    question: "How much time commitment does this require? I'm already overwhelmed.",
    answer: "The programme requires 45-90 minutes per week for consultancy sessions, plus 15-20 minutes daily for protocol implementation. However, our clients consistently report saving 5-10 hours per week within the first month through improved decision-making, energy management, and cognitive clarity. The ROI on time invested averages 312%.",
    category: "logistics"
  },
  {
    question: "What makes Leah Fowler different from other performance coaches?",
    answer: "Three key differentiators: First, we position as consultants, not coaches—we're hired for expertise, not motivation. Second, Leah is a mother of three who maintains elite fitness, understanding real-world family constraints. Third, every protocol is evidence-based, with £45,000 annual investment in fitness education ensuring cutting-edge methodologies.",
    category: "differentiation"
  },
  {
    question: "How quickly will I see measurable results?",
    answer: "Initial subjective improvements (energy, clarity, sleep quality) typically appear within 7-14 days. Objective biomarker changes (HRV, cortisol patterns) become significant by day 30. Full performance transformation, including sustained behaviour change and measurable productivity gains, requires the full 90-day programme. We provide bi-weekly progress reports with quantified metrics.",
    category: "results"
  },
  {
    question: "Is this suitable if I'm not based in Norfolk?",
    answer: "Absolutely. While Leah is Norfolk's premier performance consultant, 60% of our clients engage virtually from across the UK and internationally. Our virtual consultancy delivers identical outcomes to in-person sessions. For Strategic Partnership clients, we offer quarterly in-person intensives in London, Manchester, or Norwich.",
    category: "logistics"
  },
  {
    question: "What if I've tried coaching before and it didn't work?",
    answer: "Most coaching fails because it addresses symptoms, not systems. We use behavioural architecture and implementation science to make excellence inevitable, not exhausting. Our approach doesn't rely on willpower or motivation—we engineer your environment and habits so that high performance becomes the path of least resistance. This is why our success rate is 94%.",
    category: "objections"
  },
  {
    question: "How do you measure success? What ROI can I expect?",
    answer: "We track both subjective and objective metrics. Subjective: energy levels, cognitive clarity, stress perception. Objective: HRV scores, productivity metrics, sleep quality data, biomarkers. The average client sees 312% ROI within the first quarter through increased productivity, better decision-making, and reduced sick days. We provide quarterly ROI reports documenting time saved versus time invested.",
    category: "results"
  },
  {
    question: "What's included in the initial Performance Diagnostic?",
    answer: "The Performance Diagnostic includes a comprehensive 60-minute consultation covering all performance domains, baseline biometric testing recommendations, gap analysis against peer benchmarks, prioritised intervention framework, and a detailed three-page report with your personalised 90-day roadmap. This is currently available at £197 (usually £497) with no obligation to continue.",
    category: "programmes"
  },
  {
    question: "Do you work with teams or just individuals?",
    answer: "While our primary focus is individual mother fitness transformation, we offer group fitness consultancy for mother groups of up to 8 people. This includes individual assessments, group dynamics support, and coordinated fitness protocols. Several mother groups have engaged us for quarterly fitness transformation workshops.",
    category: "programmes"
  }
]

const PremiumFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'methodology', label: 'Our Approach' },
    { value: 'value', label: 'Value & ROI' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'results', label: 'Results' },
    { value: 'programmes', label: 'Programmes' },
    { value: 'objections', label: 'Common Concerns' }
  ]

  const filteredFAQs = selectedCategory === 'all'
    ? faqData
    : faqData.filter(faq => faq.category === selectedCategory)

  // Generate FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      {/* FAQ Schema Markup for Rich Results */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-navy-dark dark:to-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <HelpCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Intelligent Questions From High Performers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Evidence-based answers to the questions that matter
              </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-navy-light text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-lighter'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-navy-light rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-navy transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openIndex === index ? (
                          <Minus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CTA at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 text-center bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-navy-light dark:to-navy rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Have a Question Not Answered Here?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Book a complimentary 15-minute consultation to discuss your specific situation
              </p>
              <a
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Schedule Brief Consultation
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                No sales pressure. Just answers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PremiumFAQSection