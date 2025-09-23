"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  BadgeCheck,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    name: 'James Richardson',
    role: 'Mother of 3',
    company: 'Tech Innovations UK',
    industry: 'Technology',
    content: 'Leah\'s fitness programme was transformational. My energy levels improved by 60%, strength increased by 40%, and I finally achieved the balance between motherhood and fitness I\'d been seeking for years. Her evidence-based approach is revolutionary.',
    rating: 5,
    metrics: {
      before: 'Burnout & declining performance',
      after: '40% productivity increase',
      timeframe: '3 months'
    },
    highlight: '£2.3M revenue increase',
    verified: true,
    featured: true
},
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Senior Partner',
    company: 'Mitchell & Associates Law',
    industry: 'Legal',
    content: 'The personalised strategies Leah developed for me have been game-changing. I\'ve never felt more in control - my billable hours increased by 25% while working 15% fewer hours. The ROI on this investment exceeded 500% in the first year alone.',
    rating: 5,
    metrics: {
      before: 'Working 70+ hour weeks',
      after: 'Work-life balance achieved',
      timeframe: '8 weeks'
    },
    highlight: '500% ROI in Year 1',
    verified: true,
    featured: false
},
  {
    id: 3,
    name: 'David Thompson',
    role: 'Olympic Athlete',
    company: 'Team GB Athletics',
    industry: 'Sports',
    content: 'Leah helped me break through a performance plateau I\'d been stuck at for 2 years. Her holistic approach to mental and physical optimisation helped me achieve personal bests in all my events and secure Olympic qualification.',
    rating: 5,
    metrics: {
      before: 'Performance plateau',
      after: 'Personal bests achieved',
      timeframe: '12 weeks'
    },
    highlight: 'Olympic qualification secured',
    verified: true,
    featured: false
},
  {
    id: 4,
    name: 'Emma Williams',
    role: 'Managing Director',
    company: 'Williams Consulting Group',
    industry: 'Consulting',
    content: 'Working with Leah during my post-pregnancy recovery was the best decision I\'ve made. Her fitness coaching helped me regain strength with confidence, resulting in achieving all my fitness goals and 150% improvement in energy.',
    rating: 5,
    metrics: {
      before: 'Overwhelmed by growth',
      after: '150% company growth',
      timeframe: '6 months'
    },
    highlight: '3 successful acquisitions',
    verified: true,
    featured: true
},
  {
    id: 5,
    name: 'Michael Chen',
    role: 'Mother of 2',
    company: 'FinTech Solutions Europe',
    industry: 'Finance',
    content: 'Leah\'s systematic approach transformed how I manage my energy and focus. Within 6 months, I achieved all my fitness goals, inspired my family, and completed my first marathon. Her methods are scientifically grounded and incredibly effective.',
    rating: 5,
    metrics: {
      before: 'Senior Developer',
      after: 'Marathon completed',
      timeframe: '6 months'
    },
    highlight: 'Leading 120+ team',
    verified: true,
    featured: false
},
  {
    id: 6,
    name: 'Alexandra Foster',
    role: 'Venture Capital Partner',
    company: 'Foster Capital Partners',
    industry: 'Investment',
    content: 'Leah\'s programme elevated my performance to levels I didn\'t think were possible. My fund\'s returns increased by 35%, and I finally found sustainable ways to manage the intense pressure of the VC world.',
    rating: 5,
    metrics: {
      before: 'High stress, declining health',
      after: '35% fund returns increase',
      timeframe: '4 months'
    },
    highlight: '£50M+ deals closed',
    verified: true,
    featured: true
},
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const featuredTestimonials = testimonials.filter(t => t.featured)
  const currentTestimonial = featuredTestimonials[currentIndex]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
  }

  // Auto-advance
  React.useEffect(() => {
    const timer = setInterval(nextTestimonial, 7000)
    return () => clearInterval(timer)
  }, [currentIndex])

  return (
    <section id="testimonials" className="py-32 lg:py-48 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
}}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold/10 to-amber-100/20 backdrop-blur-sm border border-gold/20 text-gold-dark text-sm font-semibold mb-8 shadow-lg"
          >
            <Award className="h-5 w-5" />
            SUCCESS STORIES
            <Award className="h-5 w-5" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-navy mb-8 leading-tight">
            Transformative
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
              Client Results
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Real stories from industry leaders who&apos;ve achieved extraordinary 
            breakthroughs with our evidence-based performance programmes.
          </p>
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <div className="mb-20">
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Left: Metrics Panel */}
                  <div className="md:col-span-2 bg-gradient-to-br from-navy via-navy/95 to-navy-dark p-10 lg:p-12 text-white">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-gold text-xs font-semibold mb-6">
                          <BadgeCheck className="h-3 w-3" />
                          VERIFIED CLIENT
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{currentTestimonial.name}</h3>
                        <p className="text-gold mb-1">{currentTestimonial.role}</p>
                        <p className="text-white/70 text-sm mb-1">{currentTestimonial.company}</p>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-6">{currentTestimonial.industry}</p>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Before</p>
                            <p className="text-sm text-white/90">{currentTestimonial.metrics.before}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-r from-gold/20 to-amber-600/20 backdrop-blur-sm border border-gold/30">
                            <p className="text-xs text-gold uppercase tracking-wider mb-1">After</p>
                            <p className="text-sm font-semibold text-white">{currentTestimonial.metrics.after}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <TrendingUp className="h-4 w-4" />
                          <span>Achieved in {currentTestimonial.metrics.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Testimonial Content */}
                  <div className="md:col-span-3 p-10 lg:p-12">
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <Quote className="h-10 w-10 text-gold/20" />
                      </div>
                      
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                        ))}
                      </div>
                      
                      <blockquote className="flex-1">
                        <p className="text-lg lg:text-xl text-gray-700 leading-relaxed italic">
                          &quot;{currentTestimonial.content}&quot;
                        </p>
                      </blockquote>
                      
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-amber-100/20 text-gold-dark font-semibold">
                            <Sparkles className="h-4 w-4" />
                            {currentTestimonial.highlight}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={prevTestimonial}
                              className="rounded-full"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={nextTestimonial}
                              className="rounded-full"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-gold rounded-full'
                      : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.filter(t => !t.featured).slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 line-clamp-3 italic">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-navy">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-gray-500">{testimonial.company}</p>
              </div>
              
              <div className="mt-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage/10 text-sage text-xs font-medium">
                  <ArrowUpRight className="h-3 w-3" />
                  {testimonial.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-navy mb-2">237+</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">Mother of 3</div>
              <div className="text-sm text-gray-600">Real Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sage mb-2">98%</div>
              <div className="text-sm text-gray-600">Achievement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">£2.8M</div>
              <div className="text-sm text-gray-600">Client ROI Generated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}