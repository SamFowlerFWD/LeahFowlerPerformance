'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Users,
  Trophy,
  Heart,
  Target,
  ArrowRight,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react'
// Transformation programmes data is defined locally in this component

interface Programme {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  alt: string
  stats: { label: string; value: string }[]
  features: string[]
  testimonial?: {
    name: string
    quote: string
    achievement: string
  }
  ageGroup?: string
  duration: string
  location: string
  intensity: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  price: string
}

const programmes: Programme[] = [
  {
    id: 'family-foundations',
    title: 'Family Foundations',
    subtitle: 'Train Together, Grow Together',
    description: 'Start your familys fitness journey with fun, engaging sessions designed for all ages and abilities. Build healthy habits that last a lifetime.',
    image: '/images/programmes/family-training.webp',
    alt: 'Families training together in Norfolk park',
    stats: [
      { label: 'Families Active', value: '200+' },
      { label: 'Weekly Sessions', value: '6' },
      { label: 'Success Rate', value: '92%' }
    ],
    features: [
      'Parent-child bonding activities',
      'Age-appropriate challenges',
      'Monthly family events',
      'Nutrition education for families',
      'Progress tracking for all members'
    ],
    testimonial: {
      name: 'The Johnsons',
      quote: 'Best decision we ever made for our family!',
      achievement: 'Lost 10 stone collectively'
    },
    ageGroup: '5+ years',
    duration: '45 minutes',
    location: 'Dereham & Norwich',
    intensity: 'All Levels',
    price: '£120/month'
  },
  {
    id: 'youth-athletics',
    title: 'Future Champions',
    subtitle: 'Youth Athletic Development',
    description: 'Comprehensive athletic development programme building strength, speed, agility and confidence in young athletes aged 8-17.',
    image: '/images/programmes/youth-training.webp',
    alt: 'Young athletes training on track',
    stats: [
      { label: 'Youth Champions', value: '23' },
      { label: 'School Teams Made', value: '45+' },
      { label: 'Scholarships Won', value: '8' }
    ],
    features: [
      'Sport-specific skill development',
      'Strength & conditioning',
      'Speed & agility training',
      'Mental resilience coaching',
      'Competition preparation'
    ],
    testimonial: {
      name: 'Tom, age 14',
      quote: 'Coach Leah helped me make the county rugby team!',
      achievement: 'From last picked to team captain'
    },
    ageGroup: '8-17 years',
    duration: '60 minutes',
    location: 'Dereham Sports Centre',
    intensity: 'Progressive',
    price: '£150/month'
  },
  {
    id: 'spartan-warriors',
    title: 'Spartan Warriors',
    subtitle: 'Obstacle Race Training',
    description: 'Train like a Spartan with the coach whos conquered Ultra Beasts. From first timer to elite, well get you race ready.',
    image: '/images/programmes/spartan-training.webp',
    alt: 'Group training for Spartan race obstacles',
    stats: [
      { label: 'Races Completed', value: '127' },
      { label: 'Finish Rate', value: '100%' },
      { label: 'Podium Finishes', value: '34' }
    ],
    features: [
      'Obstacle-specific training',
      'Endurance & strength building',
      'Race strategy & planning',
      'Group training sessions',
      'Race day support'
    ],
    testimonial: {
      name: 'Sarah, 42',
      quote: 'From couch to Spartan Sprint in 12 weeks!',
      achievement: 'Now training for Trifecta'
    },
    ageGroup: '16+ years',
    duration: '90 minutes',
    location: 'Outdoor locations',
    intensity: 'Intermediate',
    price: '£180/month'
  },
  {
    id: 'mums-on-mission',
    title: 'Mums on a Mission',
    subtitle: 'Reclaim Your Fitness',
    description: 'For mums ready to prioritise themselves. Train with other mums who understand the juggle, led by a mum who gets it.',
    image: '/images/programmes/mums-training.webp',
    alt: 'Group of mums training together',
    stats: [
      { label: 'Mums Strong', value: '150+' },
      { label: 'Total Weight Lost', value: '200+ stone' },
      { label: 'Energy Increased', value: '300%' }
    ],
    features: [
      'Child-friendly session times',
      'Postnatal recovery focus',
      'Supportive community',
      'Nutrition for busy mums',
      'Home workout options'
    ],
    testimonial: {
      name: 'Emma, mum of 3',
      quote: 'Finally found my tribe and my strength!',
      achievement: 'Completed first 10K'
    },
    ageGroup: 'All mums welcome',
    duration: '45 minutes',
    location: 'Multiple locations',
    intensity: 'All Levels',
    price: '£99/month'
  }
]

export default function InteractiveProgrammeGallery() {
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % programmes.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + programmes.length) % programmes.length)
  }

  return (
    <motion.section
      ref={containerRef}
      className="py-24 md:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      style={{ opacity, scale }}
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0]
}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full"
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-100/30 via-transparent to-blue-100/30 blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Programme
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            From first steps to finish lines, we have a programme to match your goals and inspire your journey
          </p>
        </motion.div>

        {/* Main Gallery Carousel */}
        <div className="relative mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Image Section */}
              <motion.div
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={programmes[currentIndex].image}
                  alt={programmes[currentIndex].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex gap-6">
                    {programmes[currentIndex].stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-white"
                      >
                        <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Intensity Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold text-gray-800">
                      {programmes[currentIndex].intensity}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content Section */}
              <div className="space-y-6">
                <div>
                  <motion.h3
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {programmes[currentIndex].title}
                  </motion.h3>
                  <motion.p
                    className="text-xl text-orange-500 font-semibold mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {programmes[currentIndex].subtitle}
                  </motion.p>
                  <motion.p
                    className="text-gray-600 text-lg leading-relaxed"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {programmes[currentIndex].description}
                  </motion.p>
                </div>

                {/* Programme Details */}
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>{programmes[currentIndex].duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{programmes[currentIndex].location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>{programmes[currentIndex].ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-semibold">
                    <span className="text-xl">{programmes[currentIndex].price}</span>
                  </div>
                </motion.div>

                {/* Features List */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Included:</h4>
                  <ul className="space-y-2">
                    {programmes[currentIndex].features.slice(0, 3).map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Testimonial */}
                {programmes[currentIndex].testimonial && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg"
                  >
                    <p className="text-gray-700 italic mb-3">
                      &quot;{programmes[currentIndex].testimonial.quote}&quot;
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        — {programmes[currentIndex].testimonial.name}
                      </span>
                      <span className="text-sm text-orange-600">
                        {programmes[currentIndex].testimonial.achievement}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  className="flex gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <button
                    onClick={() => setSelectedProgramme(programmes[currentIndex])}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-4 px-6 rounded-lg transition-all hover:scale-105">
                    Book Free Trial
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:-translate-x-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
            aria-label="Previous programme"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
            aria-label="Next programme"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Programme Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {programmes.map((programme, idx) => (
            <motion.button
              key={programme.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                idx === currentIndex
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  idx === currentIndex ? 'bg-orange-500' : 'bg-gray-200'
                }`}>
                  {idx === 0 && <Users className={`w-5 h-5 ${idx === currentIndex ? 'text-white' : 'text-gray-600'}`} />}
                  {idx === 1 && <Trophy className={`w-5 h-5 ${idx === currentIndex ? 'text-white' : 'text-gray-600'}`} />}
                  {idx === 2 && <Target className={`w-5 h-5 ${idx === currentIndex ? 'text-white' : 'text-gray-600'}`} />}
                  {idx === 3 && <Heart className={`w-5 h-5 ${idx === currentIndex ? 'text-white' : 'text-gray-600'}`} />}
                </div>
                <div className="text-left">
                  <div className={`font-semibold text-sm ${
                    idx === currentIndex ? 'text-orange-900' : 'text-gray-900'
                  }`}>
                    {programme.title}
                  </div>
                  <div className={`text-xs ${
                    idx === currentIndex ? 'text-orange-700' : 'text-gray-500'
                  }`}>
                    {programme.ageGroup}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detailed Programme Modal */}
      <AnimatePresence>
        {selectedProgramme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProgramme(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content would go here */}
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-4">{selectedProgramme.title}</h3>
                <p className="text-gray-600 mb-6">{selectedProgramme.description}</p>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}