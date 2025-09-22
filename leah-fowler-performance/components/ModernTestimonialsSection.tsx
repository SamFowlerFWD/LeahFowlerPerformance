"use client"

import * as React from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Quote, Star, Play, ChevronLeft, ChevronRight, Building2, Linkedin, Award } from 'lucide-react'
 '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
importfrom 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Mum of 2',
    company: 'Norwich',
    image: '/testimonials/sarah.jpg',
    video: '/testimonials/sarah.mp4',
    hasVideo: true,
    rating: 5,
    text: "I've never felt stronger or more energetic. Leah's holistic approach to fitness and lifestyle changed everything. I'm now running 5k easily and sleeping better than I have in years.",
    results: [
      'Lost 12kg in 4 months',
      'Energy levels increased 50%',
      'Off blood pressure medication'
    ],
    programme: 'Premium Performance Programme',
    linkedin: 'https://linkedin.com/in/sarahmitchell'
  },
  {
    id: 2,
    name: 'James Thompson',
    role: 'Father of 1',
    company: 'Dereham',
    image: '/testimonials/james.jpg',
    hasVideo: false,
    rating: 5,
    text: "At 45, I'm in the best shape of my life. Leah's strength training programme and nutrition guidance helped me build muscle, lose fat, and feel 10 years younger.",
    results: [
      '30% increase in strength',
      'Body fat reduced from 28% to 18%',
      'Chronic back pain eliminated'
    ],
    programme: 'Performance Essentials',
    linkedin: 'https://linkedin.com/in/jamesthompson'
  },
  {
    id: 3,
    name: 'Rachel Adams',
    role: 'Busy Mum of 3',
    company: 'Swaffham',
    image: '/testimonials/rachel.jpg',
    video: '/testimonials/rachel.mp4',
    hasVideo: true,
    rating: 5,
    text: "Leah understands the challenges of being a busy mum. Her flexible approach helped me find time for fitness, and now I have energy to keep up with my kids!",
    results: [
      'Consistent training for 6 months',
      'Energy throughout the day',
      'Setting a healthy example for my kids'
    ],
    programme: 'Small Group Training',
    linkedin: 'https://linkedin.com/in/racheladams'
  },
  {
    id: 4,
    name: 'Michael Chen',
    role: 'Working Dad',
    company: 'Remote - London',
    image: '/testimonials/michael.jpg',
    hasVideo: false,
    rating: 5,
    text: "The online programme fits perfectly with my travel schedule. Leah's monthly programming keeps me progressing, and the app makes it easy to train anywhere.",
    results: [
      'Maintained fitness while travelling',
      'Improved sleep quality',
      'Better focus at work'
    ],
    programme: 'Online Programme Only',
    linkedin: 'https://linkedin.com/in/michaelchen'
  },
  {
    id: 5,
    name: 'Emma Williams',
    role: 'NHS Worker & Mum',
    company: "King's Lynn",
    image: '/testimonials/emma.jpg',
    video: '/testimonials/emma.mp4',
    hasVideo: true,
    rating: 5,
    text: "After years of shift work destroying my health, Leah helped me reclaim my fitness. Her circadian rhythm strategies and flexible training approach were game-changing.",
    results: [
      'Consistent sleep pattern established',
      'Stress resilience improved 70%',
      'Running first half-marathon at 52'
    ],
    programme: 'Premium Performance Programme',
    linkedin: 'https://linkedin.com/in/emmawilliams'
  }
]

export default function ModernTestimonialsSection() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [autoplay, setAutoplay] = React.useState(true)

  // Auto-advance carousel
  React.useEffect(() => {
    if (!autoplay) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoplay])

  const handlePrevious = () => {
    setAutoplay(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section ref={ref} id="testimonials" className="relative py-14 sm:py-18 md:py-24 lg:py-28 xl:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy/50 dark:to-navy-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,165,116,0.05),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(135,169,107,0.05),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gold/10 text-gold border-gold/20">
            <Award className="h-4 w-4" />
            Success Stories
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Transformations That
            <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
              Speak for Themselves
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real results from real people. Discover how our personalised approach 
            has transformed health and fitness across Norfolk and beyond.
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-16"
        >
          <div className="bg-white dark:bg-navy-dark rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left Side - Media */}
              <div className="relative bg-gradient-to-br from-navy via-navy-dark to-navy p-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {currentTestimonial.hasVideo && !isPlaying ? (
                      <div className="relative">
                        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-sage/20 flex items-center justify-center">
                            <span className="text-6xl text-white/20">
                              {currentTestimonial.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsPlaying(true)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-colors">
                            <Play className="h-8 w-8 text-navy ml-1" />
                          </div>
                        </motion.button>
                      </div>
                    ) : currentTestimonial.hasVideo && isPlaying ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <video
                          src={currentTestimonial.video}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          onEnded={() => setIsPlaying(false)}
                        />
                      </div>
                    ) : (
                      <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                        <div className="w-full h-full bg-gradient-to-br from-gold/20 to-sage/20 flex items-center justify-center">
                          <span className="text-6xl text-white/20">
                            {currentTestimonial.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quote Icon */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Quote className="h-8 w-8 text-gold" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side - Content */}
              <div className="p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="h-5 w-5 fill-gold text-gold" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                      "{currentTestimonial.text}"
                    </p>

                    {/* Results */}
                    <div className="bg-gray-50 dark:bg-navy/30 rounded-2xl p-6 mb-6">
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Key Results
                      </p>
                      <ul className="space-y-2">
                        {currentTestimonial.results.map((result, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-gold rounded-full" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{result}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-navy dark:text-white">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {currentTestimonial.role}, {currentTestimonial.company}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {currentTestimonial.programme}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.a
                          href={currentTestimonial.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-navy/30 hover:bg-gray-200 dark:hover:bg-navy/50 transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-navy dark:text-white" />
                        </motion.a>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-navy/30 hover:bg-gray-200 dark:hover:bg-navy/50 transition-colors"
                        >
                          <Building2 className="h-5 w-5 text-navy dark:text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="pointer-events-auto -ml-4 lg:-ml-12 p-3 rounded-full bg-white dark:bg-navy-dark shadow-xl hover:shadow-2xl transition-shadow"
            >
              <ChevronLeft className="h-6 w-6 text-navy dark:text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="pointer-events-auto -mr-4 lg:-mr-12 p-3 rounded-full bg-white dark:bg-navy-dark shadow-xl hover:shadow-2xl transition-shadow"
            >
              <ChevronRight className="h-6 w-6 text-navy dark:text-white" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false)
                  setCurrentIndex(index)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "w-8 bg-gold" 
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Testimonial Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-20"
        >
          {[
            { value: '500+', label: 'Clients Transformed' },
            { value: '98%', label: 'Success Rate' },
            { value: '4.9', label: 'Average Rating' },
            { value: '92%', label: 'Goal Achievement Rate' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="text-4xl font-bold text-navy dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}