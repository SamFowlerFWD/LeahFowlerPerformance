"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Star, TrendingUp, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface VideoTestimonial {
  id: string
  name: string
  role: string
  company: string
  transformation: string
  thumbnail: string
  videoUrl: string
  duration: string
  results: {
    metric: string
    improvement: string
  }[]
  programme: string
  rating: number
}

export default function VideoTestimonials() {
  const [selectedVideo, setSelectedVideo] = React.useState<VideoTestimonial | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const testimonials: VideoTestimonial[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      role: 'Mother of 2',
      company: 'Norfolk',
      transformation: 'From Burnout to Peak Performance in 12 Weeks',
      thumbnail: '/images/testimonials/sarah-thumbnail.jpg',
      videoUrl: 'https://example.com/videos/sarah-testimonial.mp4',
      duration: '3:42',
      results: [
        { metric: 'Productivity', improvement: '+47%' },
        { metric: 'Work-Life Balance', improvement: '+82%' },
        { metric: 'Team Performance', improvement: '+35%' }
      ],
      programme: 'Mother Fitness Excellence',
      rating: 5
    },
    {
      id: '2',
      name: 'James Harrison',
      role: 'Father of 2',
      company: 'Norwich',
      transformation: 'Gained Strength While Working Full Time',
      thumbnail: '/images/testimonials/james-thumbnail.jpg',
      videoUrl: 'https://example.com/videos/james-testimonial.mp4',
      duration: '4:15',
      results: [
        { metric: 'Strength Gains', improvement: '+312%' },
        { metric: 'Training Time', improvement: 'Consistent' },
        { metric: 'Energy Levels', improvement: '+65%' }
      ],
      programme: 'Elite Performance',
      rating: 5
    },
    {
      id: '3',
      name: 'Dr Emma Chen',
      role: 'Working Mum',
      company: 'Dereham',
      transformation: 'Achieved Fitness Goals While Working Full Time',
      thumbnail: '/images/testimonials/emma-thumbnail.jpg',
      videoUrl: 'https://example.com/videos/emma-testimonial.mp4',
      duration: '5:08',
      results: [
        { metric: 'Fitness Achievement', improvement: 'Strength Goals' },
        { metric: 'Stress Management', improvement: '+90%' },
        { metric: 'Family Time Quality', improvement: '+40%' }
      ],
      programme: 'Accelerator Programme',
      rating: 5
    }
  ]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const handleVideoClick = (testimonial: VideoTestimonial) => {
    setSelectedVideo(testimonial)
    setIsPlaying(false)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    })
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-navy-dark dark:via-navy dark:to-navy-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold font-medium text-sm mb-6">
            <Award className="h-4 w-4" />
            Client Success Stories
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white mb-6">
            Transformations That Speak
            <span className="block text-gradient-gold mt-2">Louder Than Words</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real mothers. Real results. Watch how mothers transformed their fitness
            with our evidence-based methodology.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="group"
            >
              <div className="relative bg-white dark:bg-navy-dark rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                {/* Video Thumbnail Container */}
                <div
                  className="relative aspect-video cursor-pointer overflow-hidden"
                  onClick={() => handleVideoClick(testimonial)}
                >
                  {/* Placeholder gradient as thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-gold/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-white/5 backdrop-blur-sm" />
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gold/30 blur-xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                        <Play className="h-8 w-8 text-navy ml-1" fill="currentColor" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
                    {testimonial.duration}
                  </div>

                  {/* Programme Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-gold/90 backdrop-blur-sm text-navy text-sm font-bold">
                    {testimonial.programme}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">5.0</span>
                  </div>

                  {/* Name and Role */}
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                    <p className="text-sm font-medium text-gold">
                      {testimonial.company}
                    </p>
                  </div>

                  {/* Transformation */}
                  <p className="text-base font-semibold text-navy dark:text-white border-l-4 border-gold pl-4">
                    "{testimonial.transformation}"
                  </p>

                  {/* Key Results */}
                  <div className="space-y-2 pt-2">
                    {testimonial.results.map((result, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-navy/30 last:border-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {result.metric}
                        </span>
                        <span className="text-sm font-bold text-gold">
                          {result.improvement}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVideoClick(testimonial)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-semibold hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg hover:shadow-gold/30"
                  >
                    Watch Full Story
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-navy-dark rounded-2xl shadow-xl overflow-hidden">
                    {/* Video Thumbnail */}
                    <div
                      className="relative aspect-video cursor-pointer"
                      onClick={() => handleVideoClick(testimonial)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-gold/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full bg-white/5 backdrop-blur-sm" />
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-6 w-6 text-navy ml-0.5" fill="currentColor" />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        {testimonial.duration}
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-gold/90 backdrop-blur-sm text-navy text-xs font-bold">
                        {testimonial.programme}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>

                      {/* Name and Role */}
                      <div>
                        <h3 className="text-lg font-bold text-navy dark:text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>

                      {/* Transformation */}
                      <p className="text-sm font-semibold text-navy dark:text-white">
                        "{testimonial.transformation}"
                      </p>

                      {/* Results Preview */}
                      <div className="flex gap-4">
                        {testimonial.results.slice(0, 2).map((result, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-bold text-gold">{result.improvement}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{result.metric}</div>
                          </div>
                        ))}
                      </div>

                      {/* Watch Button */}
                      <button
                        onClick={() => handleVideoClick(testimonial)}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-light text-navy font-semibold text-sm"
                      >
                        Watch Story
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-between items-center mt-6 px-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gold" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-gold' : 'bg-gold/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gold" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-navy/5 to-gold/5 border border-gold/10"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Success Stories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">100+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Mums Trained</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">312%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Average ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">90%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Retention Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden bg-navy border-0">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                  aria-label="Close video"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* Video Player Container */}
                <div className="relative aspect-video bg-black">
                  {isPlaying ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <video
                        src={selectedVideo.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                        onEnded={() => setIsPlaying(false)}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-navy">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(true)}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gold/30 blur-2xl animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-10 w-10 text-navy ml-1" fill="currentColor" />
                        </div>
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                {!isPlaying && (
                  <div className="p-6 bg-gradient-to-t from-navy-dark to-navy">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedVideo.name}
                    </h3>
                    <p className="text-gold mb-4">
                      {selectedVideo.role}, {selectedVideo.company}
                    </p>
                    <p className="text-lg text-white/90 mb-6">
                      {selectedVideo.transformation}
                    </p>

                    {/* Results Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {selectedVideo.results.map((result, idx) => (
                        <div key={idx} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                          <div className="text-2xl font-bold text-gold mb-1">
                            {result.improvement}
                          </div>
                          <div className="text-sm text-white/70">
                            {result.metric}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  )
}