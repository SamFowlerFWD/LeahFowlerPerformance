'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Trophy,
  TrendingUp,
  Heart,
  Users,
  Target,
  Award,
  Play
} from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  age: string
  location: string
  category: 'parent' | 'youth' | 'family' | 'athlete'
  avatar?: string
  beforeImage?: string
  afterImage?: string
  videoUrl?: string
  quote: string
  achievement: string
  stats: {
    label: string
    value: string
    icon: React.ElementType
  }[]
  rating: number
  timeframe: string
  programme: string
}

const testimonials: Testimonial[] = [
  {
    id: 'sarah-mum',
    name: 'Sarah Thompson',
    age: '42, Mum of 3',
    location: 'Dereham',
    category: 'parent',
    avatar: '/images/testimonials/sarah-avatar.webp',
    beforeImage: '/images/testimonials/sarah-before.webp',
    afterImage: '/images/testimonials/sarah-after.webp',
    quote: "Leah didn't just help me lose weight - she gave me my life back. I can now keep up with my kids, and we've all become healthier as a family.",
    achievement: 'Lost 3 stone & completed first Spartan Race',
    stats: [
      { label: 'Weight Lost', value: '3 stone', icon: TrendingUp },
      { label: 'Energy Level', value: '+200%', icon: Heart },
      { label: 'Race Time', value: '1:45', icon: Trophy }
    ],
    rating: 5,
    timeframe: '6 months',
    programme: 'Spartan Strong'
  },
  {
    id: 'tom-youth',
    name: 'Tom Mitchell',
    age: '14',
    location: 'Norwich',
    category: 'youth',
    avatar: '/images/testimonials/tom-avatar.webp',
    quote: "Coach Leah believed in me when I didn't believe in myself. From being last picked to team captain - she changed everything!",
    achievement: 'Made county rugby team & school captain',
    stats: [
      { label: 'Speed', value: '+25%', icon: TrendingUp },
      { label: 'Confidence', value: '10/10', icon: Award },
      { label: 'Team Role', value: 'Captain', icon: Trophy }
    ],
    rating: 5,
    timeframe: '4 months',
    programme: 'Future Champions'
  },
  {
    id: 'johnson-family',
    name: 'The Johnsons',
    age: 'Parents + 3 Kids',
    location: 'Swaffham',
    category: 'family',
    avatar: '/images/testimonials/johnson-family.webp',
    beforeImage: '/images/testimonials/johnson-before.webp',
    afterImage: '/images/testimonials/johnson-after.webp',
    quote: "Saturday mornings with Leah have become our favourite family time. We're fitter, happier, and closer than ever.",
    achievement: 'Lost 10 stone collectively & completed family 5K',
    stats: [
      { label: 'Combined Loss', value: '10 stone', icon: Users },
      { label: 'Family 5K', value: 'Completed!', icon: Trophy },
      { label: 'Happiness', value: '100%', icon: Heart }
    ],
    rating: 5,
    timeframe: '8 months',
    programme: 'Family Foundations'
  },
  {
    id: 'emma-new-mum',
    name: 'Emma Davies',
    age: '35, New Mum',
    location: 'Fakenham',
    category: 'parent',
    avatar: '/images/testimonials/emma-avatar.webp',
    quote: "Post-pregnancy, I thought I'd never feel strong again. Leah's mum-specific training gave me my body AND confidence back.",
    achievement: 'Stronger than pre-pregnancy & pain-free',
    stats: [
      { label: 'Core Strength', value: 'Restored', icon: Target },
      { label: 'Back Pain', value: 'Gone', icon: Heart },
      { label: 'Me Time', value: 'Priceless', icon: Award }
    ],
    rating: 5,
    timeframe: '3 months',
    programme: 'Morning Power'
  },
  {
    id: 'jack-athlete',
    name: 'Jack Williams',
    age: '16',
    location: 'Kings Lynn',
    category: 'athlete',
    videoUrl: '/videos/jack-testimonial.mp4',
    quote: "Leah's training took my football to the next level. Academy scouts are now watching me play!",
    achievement: 'Football academy trial & 40% speed increase',
    stats: [
      { label: 'Sprint Time', value: '-1.2s', icon: TrendingUp },
      { label: 'Vertical Jump', value: '+15cm', icon: Trophy },
      { label: 'Scouts Watching', value: '3', icon: Award }
    ],
    rating: 5,
    timeframe: '5 months',
    programme: 'Future Champions'
  }
]

// Category filter options
const categories = [
  { id: 'all', label: 'All Stories', icon: Star },
  { id: 'parent', label: 'Parents', icon: Heart },
  { id: 'youth', label: 'Youth Athletes', icon: Trophy },
  { id: 'family', label: 'Families', icon: Users },
  { id: 'athlete', label: 'Athletes', icon: Target }
]

const MobileTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showBeforeAfter, setShowBeforeAfter] = useState<string | null>(null)

  // Filter testimonials by category
  const filteredTestimonials = selectedCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory)

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -threshold && currentIndex < filteredTestimonials.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex(Math.min(filteredTestimonials.length - 1, currentIndex + 1))
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold backdrop-blur-sm">
              <Star className="w-4 h-4" />
              Real Results, Real People
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Success Stories That Inspire
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            From Norfolk families just like yours. Real transformations, lasting change.
          </motion.p>
        </div>

        {/* Category Filter Pills - Horizontally Scrollable on Mobile */}
        <div className="mb-8 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Testimonial Cards - Swipeable */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {(() => {
                const testimonial = filteredTestimonials[currentIndex]
                return (
                  <div className="flex flex-col lg:flex-row">
                    {/* Visual Content */}
                    <div className="lg:w-1/2">
                      {/* Before/After Images */}
                      {testimonial.beforeImage && testimonial.afterImage ? (
                        <div className="relative h-64 md:h-80 lg:h-full">
                          <div className="absolute inset-0 grid grid-cols-2">
                            <div className="relative">
                              <Image
                                src={testimonial.beforeImage}
                                alt={`${testimonial.name} before`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                                BEFORE
                              </span>
                            </div>
                            <div className="relative">
                              <Image
                                src={testimonial.afterImage}
                                alt={`${testimonial.name} after`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span className="absolute bottom-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                                AFTER
                              </span>
                            </div>
                          </div>

                          {/* Swipe to Compare Overlay */}
                          <button
                            onClick={() => setShowBeforeAfter(showBeforeAfter === testimonial.id ? null : testimonial.id)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-semibold">Swipe</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : testimonial.videoUrl ? (
                        <div className="relative h-64 md:h-80 lg:h-full bg-slate-900 flex items-center justify-center">
                          <button className="bg-orange-500 text-white p-6 rounded-full shadow-xl hover:scale-110 transition-all">
                            <Play className="w-8 h-8" />
                          </button>
                          <span className="absolute bottom-4 left-4 text-white font-semibold">
                            Watch {testimonial.name}&apos;s Story
                          </span>
                        </div>
                      ) : (
                        <div className="relative h-64 md:h-80 lg:h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <Quote className="w-24 h-24 text-white/20" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 lg:w-1/2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg md:text-xl text-slate-700 mb-6 leading-relaxed">
                        <Quote className="w-8 h-8 text-orange-200 mb-2" />
                        {testimonial.quote}
                      </blockquote>

                      {/* Achievement Badge */}
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-5 h-5" />
                          <span className="font-bold">Achievement Unlocked!</span>
                        </div>
                        <p className="text-white/90">{testimonial.achievement}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {testimonial.stats.map((stat, idx) => (
                          <div key={idx} className="text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <stat.icon className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                            <div className="text-xs text-slate-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                        <div>
                          <p className="font-bold text-slate-900">{testimonial.name}</p>
                          <p className="text-sm text-slate-600">
                            {testimonial.age} • {testimonial.location}
                          </p>
                          <p className="text-xs text-orange-600 font-semibold mt-1">
                            {testimonial.programme} • {testimonial.timeframe}
                          </p>
                        </div>
                        {testimonial.avatar && (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {/* Previous/Next Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full transition-all ${
                  currentIndex === 0
                    ? 'bg-white/10 text-white/30'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredTestimonials.length - 1}
                className={`p-3 rounded-full transition-all ${
                  currentIndex === filteredTestimonials.length - 1
                    ? 'bg-white/10 text-white/30'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-orange-500 rounded-full'
                      : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-white/70 text-sm font-medium">
              {currentIndex + 1} / {filteredTestimonials.length}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-white/70 mb-6">
            Join hundreds of Norfolk families who&apos;ve transformed their lives
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Start Your Journey Today
          </button>
        </motion.div>
      </div>

    </section>
  )
}

export default MobileTestimonials