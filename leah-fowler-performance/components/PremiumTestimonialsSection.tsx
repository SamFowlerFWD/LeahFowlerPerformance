"use client"

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp, Target, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PremiumButton } from '@/components/ui/premium-button'
import {
  easings
} from '@/lib/animations'

// Mother transformation testimonials - deeply relatable stories
const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "Mum of 2",
    location: "Norwich, Norfolk",
    image: "/images/testimonials/client-transformation-1.webp",
    imageAlt: "Emma Thompson mother transformation story Leah Fowler Performance Norfolk",
    rating: 5,
    headline: "From Zero Press-ups to Spartan Finisher in 6 Months",
    quote: "I couldn't do a single press-up when I started. Leah understood the juggle - she's got three kids herself. Now I can deadlift my bodyweight and my daughter says 'My mum is the strongest!' Best part? I feel properly strong.",
    results: [
      { metric: "Press-ups Achieved", improvement: "25", icon: Star },
      { metric: "Strength Gained", improvement: "+150%", icon: TrendingUp },
      { metric: "Energy for Kids", improvement: "Transformed", icon: Zap },
    ],
    programme: "Performance Training",
    beforeAfter: {
      before: "Zero fitness, exhausted, weak",
      after: "Spartan finisher, strong mum, energised"
    }
  },
  {
    id: 2,
    name: "Rachel Davies",
    role: "Mum of 3, Teacher",
    location: "Dereham, Norfolk",
    image: "/images/testimonials/client-transformation-2.webp",
    imageAlt: "Rachel Davies mother identity breakthrough Leah Fowler Performance",
    rating: 5,
    headline: "From Exhausted to 10K Runner: My 12-Week Journey",
    quote: "Three kids in four years left me with zero fitness. Leah's programme wasn't about weight loss - it was about getting strong. Now I'm training for my first obstacle race and can piggyback all three kids at once!",
    results: [
      { metric: "10K Completed", improvement: "45 mins", icon: Award },
      { metric: "Morning Energy", improvement: "+200%", icon: Zap },
      { metric: "Confidence", improvement: "Sky High", icon: Target },
    ],
    programme: "Strength & Stamina",
    beforeAfter: {
      before: "Survived each day, no energy",
      after: "10K runner, strong teacher"
    }
  },
  {
    id: 3,
    name: "Lisa Mitchell",
    role: "Mum of 1",
    location: "King's Lynn, Norfolk",
    image: null,
    imageAlt: "Lisa Mitchell postnatal transformation Norfolk mother coach",
    rating: 5,
    headline: "9 Months Postpartum to Obstacle Race Winner",
    quote: "Everyone talked about 'bouncing back' but I just wanted to feel strong. Leah helped me build real fitness - not just lose baby weight. Now I've won two races and my daughter will grow up seeing what strength looks like.",
    results: [
      { metric: "Deadlift PB", improvement: "80kg", icon: Star },
      { metric: "Physical Strength", improvement: "+180%", icon: TrendingUp },
      { metric: "Mental Resilience", improvement: "Unshakeable", icon: Target },
    ],
    programme: "Foundation Strength",
    beforeAfter: {
      before: "Postnatal weakness, no fitness",
      after: "Race winner, properly strong"
    }
  },
  {
    id: 4,
    name: "Sophie Anderson",
    role: "Mum of Twins",
    location: "Norfolk",
    image: null,
    imageAlt: "Sophie Anderson twin mum transformation Leah Fowler Performance",
    rating: 5,
    headline: "Twin Mum to Triathlete: Building Real Strength",
    quote: "After twins, I was exhausted. Couldn't carry both car seats without dying. Leah got it - she's juggling three kids herself. Started with basic movements, now I'm doing triathlons. My girls see mum being strong, not just tired.",
    results: [
      { metric: "Strength Gain", improvement: "+250%", icon: Star },
      { metric: "5K Time", improvement: "Sub-25min", icon: Target },
      { metric: "Daily Energy", improvement: "+300%", icon: Zap },
    ],
    programme: "Performance Training",
    beforeAfter: {
      before: "Surviving twin chaos, zero fitness",
      after: "Triathlon finisher, strong mum"
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
              Real Achievers
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our community of clients who&apos;ve transformed their lives with personalised fitness coaching in Norfolk
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white dark:bg-navy-dark/50 px-4 py-2 rounded-full shadow-md"
            >
              <Star className="h-5 w-5 text-gold fill-gold" />
              <span className="font-bold text-navy dark:text-white">Real Transformations</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white dark:bg-navy-dark/50 px-4 py-2 rounded-full shadow-md"
            >
              <Award className="h-5 w-5 text-sage" />
              <span className="font-bold text-navy dark:text-white">Goal Achievement Focused</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white dark:bg-navy-dark/50 px-4 py-2 rounded-full shadow-md"
            >
              <TrendingUp className="h-5 w-5 text-gold" />
              <span className="font-bold text-navy dark:text-white">Long-term Success</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center mb-20 lg:mb-24">
          {/* Featured Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: easings.smooth }}
            >
              <Card className="relative p-10 lg:p-12 xl:p-16 bg-white dark:bg-navy-dark shadow-2xl border-0">
                {/* Quote decoration */}
                <Quote className="absolute top-4 left-4 h-12 w-12 text-gold/20" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                  ))}
                </div>

                {/* Headline */}
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-4">
                  {testimonials[activeIndex].headline}
                </h3>

                {/* Quote */}
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
                  &quot;{testimonials[activeIndex].quote}&quot;
                </blockquote>

                {/* Results Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {testimonials[activeIndex].results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center"
                    >
                      <result.icon className="h-6 w-6 mx-auto mb-2 text-gold" />
                      <div className="text-2xl font-bold text-navy dark:text-white">
                        {result.improvement}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {result.metric}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Before/After */}
                <div className="bg-gray-50 dark:bg-navy/30 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-gray-500 dark:text-gray-400">Before:</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {testimonials[activeIndex].beforeAfter.before}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-sage">After:</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {testimonials[activeIndex].beforeAfter.after}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonials[activeIndex].image ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].imageAlt}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-sage flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[activeIndex].name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-navy dark:text-white">
                      {testimonials[activeIndex].name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonials[activeIndex].role}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {testimonials[activeIndex].location}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs text-gold font-bold bg-gold/10 px-3 py-1 rounded-full">
                      {testimonials[activeIndex].programme}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-white dark:bg-navy-dark shadow-lg hover:shadow-xl transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-navy dark:text-white" />
                </motion.button>

                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`transition-all duration-300 ${
                        i === activeIndex
                          ? 'w-8 h-2 bg-gold rounded-full'
                          : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gold/50'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white dark:bg-navy-dark shadow-lg hover:shadow-xl transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-navy dark:text-white" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Video Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="relative aspect-video overflow-hidden shadow-2xl border-0 group cursor-pointer"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Image
                src={videoTestimonial.thumbnail}
                alt={videoTestimonial.thumbnailAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

              {/* Play button overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-0 h-0 border-l-[20px] border-l-navy border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                </div>
              </motion.div>

              {/* Video info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-bold text-lg mb-2">
                  {videoTestimonial.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span>{videoTestimonial.duration}</span>
                  <span>•</span>
                  <span>{videoTestimonial.views} views</span>
                </div>
              </div>
            </Card>

            {/* Additional visual testimonials grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src="/images/about/spartan-race-achievement-norfolk-coach.webp"
                  alt="Spartan Race achievement with Leah Fowler Performance Coach Norfolk"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-bold">Spartan Race Finisher</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src="/images/about/outlaw-triathlon-performance-coach.webp"
                  alt="Outlaw Triathlon achievement Leah Fowler Performance Norfolk"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-bold">Outlaw Triathlon Complete</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-navy to-navy-dark rounded-3xl p-12 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join our community of clients transforming their fitness with Norfolk&apos;s premier performance coaching
          </p>
          <div className="flex justify-center">
            <a href="/apply">
              <PremiumButton
                size="xl"
                variant="primary"
                pulse
                shimmer
                className="min-w-[250px]"
              >
                Apply for Coaching
              </PremiumButton>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Schema.org structured data for testimonials */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": testimonials.map((testimonial, index) => ({
              "@type": "Review",
              "position": index + 1,
              "author": {
                "@type": "Person",
                "name": testimonial.name,
                "jobTitle": testimonial.role,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": testimonial.location
                }
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": "5"
              },
              "reviewBody": testimonial.quote,
              "about": {
                "@type": "Service",
                "name": testimonial.programme,
                "provider": {
                  "@type": "Person",
                  "name": "Leah Fowler",
                  "jobTitle": "Performance Coach",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dereham",
                    "addressRegion": "Norfolk",
                    "addressCountry": "UK"
                  }
                }
              }
            }))
          })
        }}
      />
    </section>
  )
}