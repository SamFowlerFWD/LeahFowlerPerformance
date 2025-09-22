"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Zap, 
  Target, 
  Trophy, 
  Users, 
  Brain,
  ArrowRight,
  Star,
  Sparkles,
  Award,
  Rocket,
  Shield,
  Clock,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const programmes = [
  {
    title: 'Foundation Reset',
    subtitle: 'STARTER PROGRAMME',
    duration: '6 Weeks',
    price: '£1,497',
    originalPrice: '£1,997',
    description: 'Build unshakeable foundations for sustainable high performance',
    icon: Rocket,
    gradient: 'from-blue-500 to-indigo-600',
    lightGradient: 'from-blue-50 to-indigo-50',
    features: [
      'Weekly 60-min group coaching (max 8)',
      'Personal habit transformation system',
      'Sleep & recovery optimisation',
      'Stress resilience toolkit',
      'Private community access',
      'Digital resource library',
      '30-day post-programme support'
    ],
    popular: false,
    badge: null,
    guarantees: ['30-Day Money Back', 'Lifetime Resources'],
  },
  {
    title: 'Mother Fitness Excellence',
    subtitle: 'PREMIUM PROGRAMME',
    duration: '12 Weeks',
    price: '£4,997',
    originalPrice: '£6,997',
    description: 'Complete transformation for mothers ready to get strong',
    icon: Trophy,
    gradient: 'from-gold to-amber-600',
    lightGradient: 'from-amber-50 to-yellow-50',
    features: [
      'Weekly 90-min private coaching',
      'Mother fitness assessment',
      'Personal performance dashboard',
      'Energy management masterclass',
      'Leadership presence intensive',
      'Unlimited WhatsApp support',
      'Quarterly follow-up sessions',
      'VIP event invitations'
    ],
    popular: true,
    badge: 'MOST POPULAR',
    guarantees: ['Results Guarantee', 'Lifetime Support'],
  },
  {
    title: 'Elite Mastery',
    subtitle: 'PLATINUM PROGRAMME',
    duration: '6 Months',
    price: '£9,997',
    originalPrice: '£14,997',
    description: 'Bespoke programme for industry leaders seeking extraordinary results',
    icon: Award,
    gradient: 'from-purple-600 to-pink-600',
    lightGradient: 'from-purple-50 to-pink-50',
    features: [
      'Bi-weekly 120-min intensive sessions',
      'Full psychometric profiling suite',
      'Custom performance protocols',
      'Mother group sessions (2x)',
      'Personal board of advisors access',
      '24/7 direct line support',
      'Annual mastermind membership',
      'Speaking opportunities',
      'Published case study'
    ],
    popular: false,
    badge: 'LIMITED SPOTS',
    guarantees: ['200% ROI Guarantee', 'White Glove Service'],
  },
]

export default function ProgrammesSection() {
  return (
    <section id="programmes" className="py-32 lg:py-40 bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')]" />
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-navy/10 to-blue-100/20 backdrop-blur-sm border border-navy/20 text-navy text-sm font-semibold mb-8 shadow-lg"
          >
            <Star className="h-5 w-5" />
            TRANSFORMATION PROGRAMMES
            <Star className="h-5 w-5" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-navy mb-8 leading-tight">
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
              Performance Today
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join industry leaders who've unlocked their potential with our scientifically-proven 
            programmes. Every journey includes a complimentary strategy consultation.
          </p>
        </motion.div>

        {/* Premium Programme Cards */}
        <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Badge */}
              {programme.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold shadow-xl ${
                      programme.popular 
                        ? 'bg-gradient-to-r from-gold to-amber-500 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    {programme.badge}
                    <Sparkles className="h-3 w-3" />
                  </motion.span>
                </div>
              )}
              
              {/* Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`relative h-full bg-white rounded-3xl overflow-hidden ${
                  programme.popular 
                    ? 'shadow-2xl ring-2 ring-gold/30' 
                    : 'shadow-xl hover:shadow-2xl'
                }`}
              >
                {/* Card Header with Gradient */}
                <div className={`relative bg-gradient-to-r ${programme.gradient} p-10 text-white`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative">
                    <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm mb-4">
                      <programme.icon className="h-8 w-8" />
                    </div>
                    <div className="text-xs font-bold tracking-wider opacity-90 mb-2">
                      {programme.subtitle}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{programme.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {programme.description}
                    </p>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className={`px-10 py-8 bg-gradient-to-b ${programme.lightGradient} border-b border-gray-100`}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-navy">{programme.price}</span>
                    <span className="text-lg text-gray-500 line-through">{programme.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {programme.duration}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Flexible Start
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-10 py-8">
                  <ul className="space-y-3">
                    {programme.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${programme.gradient}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guarantees */}
                <div className="px-10 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {programme.guarantees.map((guarantee, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                        <Shield className="h-3 w-3" />
                        {guarantee}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-10 pb-10">
                  <Button 
                    className={`w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 ${
                      programme.popular
                        ? 'bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-white'
                        : `bg-gradient-to-r ${programme.gradient} text-white hover:opacity-90`
                    }`}
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    <MessageSquare className="inline h-3 w-3 mr-1" />
                    Free consultation included
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-navy/5 to-blue-50 rounded-2xl p-8 border border-navy/10">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-navy mb-1">250+</div>
                  <div className="text-sm text-gray-600">Leaders Transformed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold mb-1">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-sage mb-1">4.95⭐</div>
                  <div className="text-sm text-gray-600">Client Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}