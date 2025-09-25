'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, TrendingUp, Zap, Target, Award, ChevronLeft, ChevronRight, Play, Clock } from 'lucide-react'
import Image from 'next/image'
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
    image: "/images/testimonials/client-transformation-1.webp",
    imageAlt: "Mary Ewin Aphrodite Fitness client review",
    rating: 5,
    headline: "Weekly Workouts I Actually Look Forward To",
    quote: "I really enjoy Leah's workouts and look forward to them each week. Leah is great at explaining how to pinpoint which muscles to use for each exercise to ensure the exercises are done correctly. She makes every session effective and enjoyable.",
    results: [
      { metric: "Consistency", improvement: "Weekly", icon: Star },
      { metric: "Technique", improvement: "Improved", icon: Target },
      { metric: "Enjoyment", improvement: "100%", icon: TrendingUp },
    ],
    programme: "Group HIIT Sessions",
    beforeAfter: {
      before: "Looking for motivation",
      after: "Looking forward to workouts"
    }
  },
  {
    id: 2,
    name: "Lisa Tubby",
    role: "HIIT Regular",
    location: "Norfolk",
    image: "/images/testimonials/client-transformation-2.webp",
    imageAlt: "Lisa Tubby Aphrodite Fitness HIIT review",
    rating: 5,
    headline: "The Sweatiest, Most Effective Workouts",
    quote: "I've been joining in Leah's HIIT workouts for a few weeks and really enjoy them. Always feel like I've worked hard at the end and very sweaty. A great work out and Leah explains each exercise clearly so you know you're doing it right.",
    results: [
      { metric: "Workout Intensity", improvement: "High", icon: Clock },
      { metric: "Consistency", improvement: "Weeks", icon: Star },
      { metric: "Results Feeling", improvement: "100%", icon: Target },
    ],
    programme: "HIIT Classes",
    beforeAfter: {
      before: "Starting fitness journey",
      after: "Consistently sweating it out"
    }
  },
  {
    id: 3,
    name: "Lauren Seamons",
    role: "1:1 Client",
    location: "Norfolk",
    image: "/images/testimonials/client-transformation-3.webp",
    imageAlt: "Lauren Seamons personal training review",
    rating: 5,
    headline: "Supportive, Knowledgeable and Fun 1:1 Training",
    quote: "I have recently started some 1:1 sessions with Leah. Leah is really supportive, knowledgeable and fun! She is particular and really makes sure you understand how to do an exercise correctly. The sessions are challenging but achievable.",
    results: [
      { metric: "Form & Technique", improvement: "Excellent", icon: Star },
      { metric: "Knowledge Gained", improvement: "100%", icon: TrendingUp },
      { metric: "Support Level", improvement: "Outstanding", icon: Target },
    ],
    programme: "1:1 Personal Training",
    beforeAfter: {
      before: "New to personal training",
      after: "Confident with proper form"
    }
  },
  {
    id: 4,
    name: "Catherine Cane",
    role: "4 Week Plan Member",
    location: "Norfolk",
    image: "/images/testimonials/client-transformation-4.webp",
    imageAlt: "Catherine Cane Aphrodite Fitness transformation",
    rating: 5,
    headline: "Kickstarting a Healthier, More Active Lifestyle",
    quote: "For the past 3 weeks, I've tried to kickstart my path to a healthier, more active lifestyle. I wanted to lose weight, feel stronger and happier. I signed up to Aphrodite Fitness 4 week plan and it's been amazing - feeling stronger already!",
    results: [
      { metric: "Strength", improvement: "Increasing", icon: Star },
      { metric: "Consistency", improvement: "3 Weeks", icon: Target },
      { metric: "Happiness", improvement: "Improved", icon: Zap },
    ],
    programme: "4 Week Programme",
    beforeAfter: {
      before: "Wanting to get healthier",
      after: "Actively stronger & happier"
    }
  },
  {
    id: 5,
    name: "Becky Meade",
    role: "Regular Member",
    location: "Norfolk",
    image: "/images/testimonials/client-transformation-5.webp",
    imageAlt: "Becky Meade workout review",
    rating: 5,
    headline: "Fun, Challenging Workouts That Keep Me Coming Back",
    quote: "I always enjoy getting my butt kicked during these workouts! They're good fun and challenging, and Leah does a great job of keeping it different to keep things interesting. Never a dull session!",
    results: [
      { metric: "Workout Variety", improvement: "Excellent", icon: Star },
      { metric: "Challenge Level", improvement: "Perfect", icon: Target },
      { metric: "Fun Factor", improvement: "100%", icon: Zap },
    ],
    programme: "Group Sessions",
    beforeAfter: {
      before: "Looking for challenging workouts",
      after: "Consistently challenged & engaged"
    }
  },
  {
    id: 6,
    name: "Michelle Dunsire",
    role: "Group Class Member",
    location: "Norfolk",
    image: "/images/testimonials/client-transformation-6.webp",
    imageAlt: "Michelle Dunsire testimonial",
    rating: 5,
    headline: "Encouraging, Clear Instruction Every Time",
    quote: "Leah always explains everything really well and is super encouraging throughout! They are tough but you always feel accomplished afterwards. The perfect balance of challenge and support.",
    results: [
      { metric: "Instruction Quality", improvement: "Excellent", icon: Star },
      { metric: "Encouragement", improvement: "Constant", icon: Target },
      { metric: "Achievement", improvement: "Every Session", icon: Zap },
    ],
    programme: "Group Training",
    beforeAfter: {
      before: "Needing guidance & support",
      after: "Feeling accomplished & capable"
    }
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
    <section className="py-32 md:py-40 lg:py-48 xl:py-56 bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 relative z-10">
        {/* Section Header with SEO-optimized H2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Real Results from{' '}
            <span className="bg-gradient-to-r from-gold to-sage bg-clip-text text-transparent">
              Real Clients
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join hundreds of Norfolk clients who've transformed their strength and fitness with Leah's expert guidance
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-20">
          <div className="flex items-center justify-center">
            {/* Previous button */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 z-20 p-2 rounded-full bg-white dark:bg-navy shadow-xl hover:scale-110 transition-transform"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-navy dark:text-white" />
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
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image/Visual Side */}
                    <div className="relative h-64 md:h-full bg-gradient-to-br from-gold/20 to-sage/20">
                      {testimonials[activeIndex].image ? (
                        <Image
                          src={testimonials[activeIndex].image}
                          alt={testimonials[activeIndex].imageAlt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-gold to-sage flex items-center justify-center mb-4">
                              <span className="text-3xl font-bold text-white">
                                {testimonials[activeIndex].name.charAt(0)}
                              </span>
                            </div>
                            <p className="text-navy dark:text-white font-semibold">
                              {testimonials[activeIndex].programme}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div className="p-8 md:p-12">
                      {/* Rating */}
                      <div className="flex mb-4">
                        {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-gold fill-current" />
                        ))}
                      </div>

                      {/* Headline */}
                      <h3 className="text-2xl font-bold text-navy dark:text-white mb-4">
                        {testimonials[activeIndex].headline}
                      </h3>

                      {/* Quote */}
                      <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                        "{testimonials[activeIndex].quote}"
                      </blockquote>

                      {/* Author */}
                      <div className="mb-6">
                        <p className="font-semibold text-navy dark:text-white">
                          {testimonials[activeIndex].name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonials[activeIndex].role} • {testimonials[activeIndex].location}
                        </p>
                      </div>

                      {/* Results */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {testimonials[activeIndex].results.map((result, index) => {
                          const Icon = result.icon
                          return (
                            <div key={index} className="text-center">
                              <Icon className="h-6 w-6 text-gold mx-auto mb-2" />
                              <p className="text-2xl font-bold text-navy dark:text-white">
                                {result.improvement}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {result.metric}
                              </p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Before/After */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-navy rounded-xl">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Before</p>
                          <p className="text-sm font-medium text-navy dark:text-white">
                            {testimonials[activeIndex].beforeAfter.before}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">After</p>
                          <p className="text-sm font-medium text-gold">
                            {testimonials[activeIndex].beforeAfter.after}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next button */}
            <button
              onClick={nextTestimonial}
              className="absolute right-0 z-20 p-2 rounded-full bg-white dark:bg-navy shadow-xl hover:scale-110 transition-transform"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-navy dark:text-white" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 transition-all duration-300 ${
                  index === activeIndex ? 'w-8 bg-gold' : 'w-2 bg-gray-300 dark:bg-gray-600'
                } rounded-full`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Video Testimonial Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-navy to-navy-dark rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Transformation?
          </h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join our community of clients transforming their fitness with Norfolk&apos;s premier performance coaching
          </p>
          <div className="flex justify-center">
            <a href="/apply">
              <button
                className="px-8 py-4 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 min-w-[250px]"
                style={{
                  backgroundColor: '#d4a574',
                  color: '#000000'
                }}
              >
                Apply for Coaching
              </button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gold/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-sage/10 via-transparent to-transparent rounded-full blur-3xl" />
    </section>
  )
}