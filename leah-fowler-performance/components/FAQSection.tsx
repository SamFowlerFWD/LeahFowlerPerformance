'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import Script from 'next/script'

const faqData = [
  {
    question: "I'm so unfit! I haven't exercised in such a long time and I've put on so much weight.",
    answer: "I understand you may feel nervous, but please be reassured that I will work with you from the level you are at now. We will spend time putting together a profile based on your strengths and areas to improve and together we will work on a plan to achieve realistic goals."
  },
  {
    question: "I've tried so many times to get in shape. No diet plans ever work.",
    answer: "We will spend time going through all of this, what's worked in the past and what hasn't. Then we can think about why. My approach to diet and weight loss is to look at your current lifestyle and make small changes. There's no food off limits, no shakes, sins or strict regimes to abide by and no weekly weigh ins!"
  },
  {
    question: "I've tried doing workouts and I can't keep up, I find some of the moves really hard.",
    answer: "Me too! It can feel overwhelming at first. However, my sessions follow a pattern that allows people to progress at their own pace. That is, there are enough variations of exercises that something will suit any level."
  },
  {
    question: "What will I need to bring to my session?",
    answer: "You do not need to bring anything more than yourself! Sensible clothes that you are comfortable to exercise in, be aware you may get hot so layers are ideal. Sports trainers and a well-fitting sports bra. Bring a drink (a water bottle, there is a refill point in the gym)."
  },
  {
    question: "I loved doing the session but now I ache!! What did I do wrong?!",
    answer: "You've not done anything wrong, do not worry! DOMs - Delayed Onset Muscle Soreness can occur after you start a new exercise or you increase your exercise. It is your body adapting, growing stronger. It is likely to last a few days but each time you take part the effects will reduce."
  }
]

// Generate FAQ Schema markup
const generateFAQSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return JSON.stringify(schemaData)
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Schema Markup */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQSchema() }}
      />

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-navy dark:via-navy-dark dark:to-navy relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#e7007d]/5 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sage/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#e7007d]/10 dark:bg-[#e7007d]/20 text-[#e7007d]-dark rounded-full text-sm font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
              Got Questions?
              <span className="block mt-2 bg-gradient-to-r from-[#e7007d] via-gold-light to-[#e7007d] bg-clip-text text-transparent">
                Your Common Concerns Answered
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're new to training or returning after time away, find answers to the questions most frequently asked by clients starting their fitness journey.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white dark:bg-navy-dark rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-navy/30"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-navy/50 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-start gap-4 pr-4">
                    <div className="mt-1 p-2 bg-gradient-to-br from-[#e7007d]/20 to-amber-100/20 rounded-lg flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-[#e7007d]-dark" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-navy dark:text-white">
                      {item.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-[#e7007d]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2">
                        <div className="pl-11 md:pl-14">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 md:mt-16 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Still have questions? Get in touch to discuss your specific goals and concerns
            </p>
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300"
              style={{
                backgroundColor: '#d4a574',
                color: '#000000'
              }}
            >
              Start Your Journey
              <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}