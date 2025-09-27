'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import Script from 'next/script'

const faqData = [
  {
    question: "I haven't exercised since having children - is this programme suitable for me?",
    answer: "Absolutely! Most of my clients in Norfolk are mums returning to fitness after years away. We start exactly where you are now, even if that's struggling with a single press-up. As a mum of three myself, I understand the physical changes after pregnancy and create personalised programmes that rebuild your strength safely."
  },
  {
    question: "How much time do I need to commit each week?",
    answer: "We work around YOUR schedule, not the other way round. Most mums train 2-3 times per week for 45-60 minutes, with sessions available from 6am before school runs or during nursery hours. Online coaching means you can also train from home when the kids are asleep - whatever works for your family life in Norfolk."
  },
  {
    question: "Do you offer sessions in Dereham or do I need to travel to Norwich?",
    answer: "I'm based right here in Dereham! Face-to-face sessions happen at my private studio near Neatherd Moor, or we can arrange outdoor sessions at Dereham Memorial Hall recreation ground. I also offer online coaching for busy Norfolk mums who prefer training at home or can't make the journey."
  },
  {
    question: "What if I can't arrange childcare?",
    answer: "This is exactly why I offer flexible online coaching - you can train while your little ones nap or play nearby. Many Dereham mums train early morning (5:30am) before their partners leave for work, or in the evening once bedtime is done. I'll help you find pockets of time you didn't know existed."
  },
  {
    question: "How quickly will I see results?",
    answer: "Most mums feel stronger and more energised within 2-3 weeks. You'll likely achieve your first full press-up within 4-6 weeks, and see visible changes within 8-12 weeks. My Norfolk clients consistently report feeling more confident at soft play and keeping up with their kids without getting breathless."
  },
  {
    question: "What makes your approach different from other personal trainers in Norfolk?",
    answer: "I'm a mum who truly gets it - the exhaustion, the guilt, the 'touched out' feeling. I've gone from struggling postnatally to completing Ultra endurance races, proving what consistency achieves. Unlike generic fitness programmes, everything is designed specifically for mothers' bodies and real-life schedules in Norfolk."
  },
  {
    question: "How much does personal training cost?",
    answer: "Online coaching starts from £97/month, making professional support accessible for Norfolk families. Face-to-face sessions in Dereham begin at £150/month for weekly training. Consider it an investment in being the energetic, strong mum your family deserves - most clients say it's the best money they've spent on themselves."
  },
  {
    question: "Do I need any equipment to get started?",
    answer: "Not at all! We start with bodyweight exercises you can do in your living room. As you progress, I might suggest resistance bands (£10-15) but even these are optional. My Dereham studio has everything needed for face-to-face sessions, so you just need to show up in comfortable clothes."
  },
  {
    question: "What if I have injuries or physical limitations?",
    answer: "I specialise in working with postnatal bodies, including diastasis recti, pelvic floor issues, and back problems common after pregnancy. Every programme is personalised to work around your limitations whilst building strength safely. I'll also refer you to specialists in Norfolk when needed."
  },
  {
    question: "Can I really get strong enough to do obstacle races like you?",
    answer: "If that's your goal, absolutely! But most mums simply want to feel strong carrying their children, confident in their bodies, and energised for family life. Whether your goal is your first 5K parkrun at Dereham Neatherd or an endurance race, we'll get you there at your pace."
  },
  {
    question: "How do I know if online coaching will work for me?",
    answer: "Over 200 Norfolk mums have transformed their fitness through my online programmes. You'll get weekly check-ins, personalised workouts, WhatsApp support, and accountability that keeps you consistent. Most clients say they achieve more with online coaching than they ever did with gym memberships."
  },
  {
    question: "What's the first step to getting started?",
    answer: "Book a free 15-minute chat where we'll discuss your goals, challenges, and what's held you back before. There's no pressure to sign up - it's just two Norfolk mums talking about how to fit fitness into real life. You can start with a trial week to see if my approach works for your family."
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/5 via-transparent to-transparent rounded-full blur-3xl" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gold/10 dark:bg-gold/20 text-gold-dark rounded-full text-sm font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
              Got Questions?
              <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
                Real Answers from a Real Mum
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything Norfolk mums want to know about getting strong again after children.
              No judgement, just honest answers from someone who's been there.
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
                    <div className="mt-1 p-2 bg-gradient-to-br from-gold/20 to-amber-100/20 rounded-lg flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-gold-dark" />
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
                    <ChevronDown className="h-5 w-5 text-gold" />
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
              Still have questions? Let's chat about your specific situation
            </p>
            <a
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300"
              style={{
                backgroundColor: '#d4a574',
                color: '#000000'
              }}
            >
              Book Your Free Chat
              <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}