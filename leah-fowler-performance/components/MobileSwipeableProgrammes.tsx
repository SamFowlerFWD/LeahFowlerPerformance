'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  PanInfo
} from 'framer-motion'
import {
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
  Calendar,
  Target
} from 'lucide-react'

interface Programme {
  id: string
  title: string
  subtitle: string
  description: string
  price: string
  originalPrice?: string
  duration: string
  location: string
  ageGroup: string
  intensity: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  image: string
  features: string[]
  testimonial: {
    name: string
    quote: string
    rating: number
  }
  spots?: number
  badge?: string
  color: string
}

const programmes: Programme[] = [
  {
    id: 'family-fitness',
    title: 'Family Foundations',
    subtitle: 'Train Together, Win Together',
    description: 'Fun fitness for the whole family. Build healthy habits that last a lifetime.',
    price: '£120',
    originalPrice: '£150',
    duration: '45 mins',
    location: 'Dereham Park',
    ageGroup: 'Ages 5+',
    intensity: 'All Levels',
    image: '/images/programmes/family-training.webp',
    features: [
      'Parent & child workouts',
      'Saturday family bootcamps',
      'Nutrition workshops',
      'Monthly challenges'
    ],
    testimonial: {
      name: 'The Johnson Family',
      quote: 'We lost 10 stone together!',
      rating: 5
    },
    spots: 3,
    badge: 'Most Popular',
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'youth-athletics',
    title: 'Future Champions',
    subtitle: 'Youth Athletic Development',
    description: 'Build speed, strength, and confidence. From playground to podium.',
    price: '£79',
    duration: '60 mins',
    location: 'Norwich Sports Centre',
    ageGroup: 'Ages 8-17',
    intensity: 'Progressive',
    image: '/images/programmes/youth-training.webp',
    features: [
      'Sport-specific training',
      'Speed & agility drills',
      'Strength building',
      'Mental coaching'
    ],
    testimonial: {
      name: 'Tom, 14',
      quote: 'Made the county rugby team!',
      rating: 5
    },
    badge: 'Limited Spots',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'spartan-parents',
    title: 'Spartan Strong',
    subtitle: 'Parent Power Hour',
    description: 'For parents who want more. Train like an athlete while kids are at school.',
    price: '£149',
    originalPrice: '£199',
    duration: '60 mins',
    location: 'Multiple Locations',
    ageGroup: 'Adults',
    intensity: 'Intermediate',
    image: '/images/programmes/spartan-training.webp',
    features: [
      'OCR race prep',
      'Strength circuits',
      'Obstacle training',
      'Race day support'
    ],
    testimonial: {
      name: 'Sarah, Mum of 3',
      quote: 'Completed my first Spartan!',
      rating: 5
    },
    spots: 5,
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'mums-morning',
    title: 'Morning Power',
    subtitle: 'Mums Only Sessions',
    description: 'Drop the kids, find your strength. Coffee and community included.',
    price: '£89',
    duration: '45 mins',
    location: 'Dereham Studio',
    ageGroup: 'Mums',
    intensity: 'All Levels',
    image: '/images/programmes/mums-fitness.webp',
    features: [
      'Post-natal safe',
      'Childcare available',
      'Coffee & chat after',
      'WhatsApp support'
    ],
    testimonial: {
      name: 'Emma, Mum of 2',
      quote: 'Found my tribe and my abs!',
      rating: 5
    },
    badge: 'New',
    color: 'from-pink-400 to-pink-600'
  }
]

const MobileSwipeableProgrammes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const [showNavButtons, setShowNavButtons] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Calculate card width based on viewport
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth
        // Card takes 85% of viewport on mobile, 45% on tablet
        const cardWidth = window.innerWidth < 640 ? containerWidth * 0.85 : containerWidth * 0.45
        setWidth(cardWidth)
        // Only show nav buttons on larger screens
        setShowNavButtons(cardWidth > 400 && window.innerWidth >= 768)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = width * 0.2
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -threshold && currentIndex < programmes.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleWhatsApp = (programme: Programme) => {
    const message = `Hi Leah, I'm interested in the ${programme.title} programme. Can you tell me more?`
    window.open(`https://wa.me/447123456789?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleBooking = (programme: Programme) => {
    // Navigate to booking with programme pre-selected
    window.location.href = `/booking?programme=${programme.id}`
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              <Target className="w-4 h-4" />
              Choose Your Journey
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            Find Your Perfect Programme
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            From first steps to finish lines. Expert coaching for every family member.
            <span className="block mt-2 text-sm text-orange-600 font-semibold">
              Swipe to explore • Tap to learn more
            </span>
          </motion.p>
        </div>

        {/* Mobile Carousel Container */}
        <div ref={carouselRef} className="relative">
          {/* Cards Container */}
          <div className="flex gap-4 md:gap-6 pb-6">
            <AnimatePresence mode="popLayout">
              {programmes.map((programme, index) => (
                <motion.div
                  key={programme.id}
                  className="flex-shrink-0"
                  style={{
                    width: width || '85vw',
                    x: x
}}
                  drag="x"
                  dragConstraints={{ left: -width * (programmes.length - 1), right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: -currentIndex * (width + 16),
                    scale: index === currentIndex ? 1 : 0.95,
                    opacity: index === currentIndex ? 1 : 0.7
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                    {/* Programme Image with Badge */}
                    <div className="relative h-48 md:h-56">
                      <Image
                        src={programme.image}
                        alt={programme.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Badge */}
                      {programme.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          {programme.badge}
                        </span>
                      )}

                      {/* Price Badge */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">{programme.price}</span>
                            {programme.originalPrice && (
                              <span className="text-sm text-slate-500 line-through">{programme.originalPrice}</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-600">/month</span>
                        </div>
                      </div>

                      {/* Spots Available */}
                      {programme.spots && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full">
                            Only {programme.spots} spots left!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title & Subtitle */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                          {programme.title}
                        </h3>
                        <p className="text-orange-600 font-semibold">
                          {programme.subtitle}
                        </p>
                      </div>

                      {/* Quick Info Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs">
                          <Clock className="w-3 h-3" />
                          {programme.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs">
                          <MapPin className="w-3 h-3" />
                          {programme.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs">
                          <Users className="w-3 h-3" />
                          {programme.ageGroup}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 mb-6 line-clamp-2">
                        {programme.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {programme.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${programme.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Testimonial */}
                      <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(programme.testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 italic mb-1">
                          "{programme.testimonial.quote}"
                        </p>
                        <p className="text-xs text-slate-500">- {programme.testimonial.name}</p>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleBooking(programme)}
                          className={`flex-1 bg-gradient-to-r ${programme.color} text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 min-h-[56px]`}
                          aria-label={`Book ${programme.title}`}
                        >
                          <Calendar className="w-5 h-5" />
                          Book Now
                        </button>
                        <button
                          onClick={() => handleWhatsApp(programme)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold p-4 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[56px] min-h-[56px]"
                          aria-label={`Ask about ${programme.title} on WhatsApp`}
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {programmes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-orange-500 rounded-full'
                    : 'w-2 h-2 bg-slate-300 rounded-full hover:bg-slate-400'
                }`}
                aria-label={`Go to programme ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons for Tablet/Desktop */}
          {showNavButtons && (
            <>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-all z-10"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(programmes.length - 1, currentIndex + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-all z-10"
                disabled={currentIndex === programmes.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Mobile CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center md:hidden"
        >
          <h3 className="text-xl font-bold mb-2">Not sure which to choose?</h3>
          <p className="text-white/90 mb-4">Get a FREE consultation with Leah</p>
          <button
            onClick={() => handleWhatsApp(programmes[0])}
            className="bg-white text-orange-500 font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with Leah Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default MobileSwipeableProgrammes