'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { PremiumButton } from '@/components/ui/premium-button'
import {
  fadeIn,
  slideInFromBottom,
  easings
} from '@/lib/animations'

// Real testimonials from Aphrodite Fitness clients
const testimonials = [
  {
    id: 1,
    name: "Mary Ewin",
    role: "HIIT Enthusiast",
    location: "Norfolk",
    rating: 5,
    headline: "Weekly Workouts I Actually Look Forward To",
    quote: "I really enjoy Leah's workouts and look forward to them each week. Leah is great at explaining how to pinpoint which muscles to use for each exercise to ensure the exercises are done correctly. She makes every session effective and enjoyable.",
    programme: "Group HIIT Sessions"
  },
  {
    id: 2,
    name: "Lauren Seamons",
    role: "1:1 Client",
    location: "Norfolk",
    rating: 5,
    headline: "Supportive, Knowledgeable and Fun 1:1 Training",
    quote: "I have recently started some 1:1 sessions with Leah. Leah is really supportive, knowledgeable and fun! She is particular and really makes sure you understand how to do an exercise correctly. The sessions are challenging but achievable.",
    programme: "1:1 Personal Training"
  },
  {
    id: 3,
    name: "Catherine Cane",
    role: "4 Week Plan Member",
    location: "Norfolk",
    rating: 5,
    headline: "Kickstarting a Healthier, More Active Lifestyle",
    quote: "For the past 3 weeks, I've tried to kickstart my path to a healthier, more active lifestyle. I wanted to lose weight, feel stronger and happier. I signed up to Aphrodite Fitness 4 week plan and it's been amazing - feeling stronger already!",
    programme: "4 Week Programme"
  },
  {
    id: 6,
    name: "Michelle Dunsire",
    role: "Group Class Member",
    location: "Norfolk",
    rating: 5,
    headline: "Encouraging, Clear Instruction Every Time",
    quote: "Leah always explains everything really well and is super encouraging throughout! They are tough but you always feel accomplished afterwards. The perfect balance of challenge and support.",
    programme: "Group Training"
  }
]

// Video testimonial data
const videoTestimonial = {
  thumbnail: "/images/hero/performance-consultant-norfolk-uk.webp",
  thumbnailAlt: "Leah Fowler Performance Coach video testimonial thumbnail Norfolk UK",
  videoUrl: "#", // Replace with actual video URL
  title: "Watch Client Transformations",
  duration: "2:47",
  views: "15K+"
}

export default function PremiumTestimonialsSection() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        {/* Section Header with SEO-optimized H2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-4 sm:mb-6">
            Real Results from{' '}
            <span className="bg-gradient-to-r from-gold to-sage bg-clip-text text-transparent">
              Real Clients
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
            Here's what clients have to say....
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-20">
          <div className="flex items-center justify-center">
            {/* Previous button */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 sm:left-2 z-20 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white dark:bg-navy shadow-xl hover:scale-110 transition-transform"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-navy dark:text-white" />
            </button>

            {/* Testimonial Cards */}
            <div className="relative max-w-4xl w-full mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: easings.easeOutCubic }}
                  className="bg-white dark:bg-navy-light rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gold fill-current" />
                      ))}
                    </div>

                    {/* Headline */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy dark:text-white mb-3 sm:mb-4">
                      {testimonials[activeIndex].headline}
                    </h3>

                    {/* Quote */}
                    <blockquote className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 italic leading-relaxed">
                      "{testimonials[activeIndex].quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                      <p className="font-semibold text-base sm:text-lg text-navy dark:text-white">
                        {testimonials[activeIndex].name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next button */}
            <button
              onClick={nextTestimonial}
              className="absolute right-0 sm:right-2 z-20 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white dark:bg-navy shadow-xl hover:scale-110 transition-transform"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-navy dark:text-white" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 sm:h-2 min-h-[44px] min-w-[44px] transition-all duration-300 ${
                  index === activeIndex ? 'w-12 sm:w-8 bg-gold' : 'w-3 sm:w-2 bg-gray-300 dark:bg-gray-600'
                } rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gold/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-sage/10 via-transparent to-transparent rounded-full blur-3xl" />
    </section>
  )
}