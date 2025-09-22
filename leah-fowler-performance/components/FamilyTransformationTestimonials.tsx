'use client'

import React, { useState } from 'react'
importfrom 'next/image'
import {
  motion
} from 'framer-motion'
import {
  Quote,
  Star,
  Trophy,
  Heart,
  Users,
  Target,
  TrendingUp,
  Award,
  Activity,
  CheckCircle
} from 'lucide-react'

interface Transformation {
  id: string
  name: string
  age: string
  location: string
  category: 'parent' | 'youth' | 'family' | 'athlete'
  beforeImage?: string
  afterImage?: string
  videoTestimonial?: string
  story: {
    challenge: string
    journey: string
    breakthrough: string
  }
  results: {
    physical: string[]
    mental: string[]
    achievements: string[]
  }
  quote: string
  timeframe: string
  rating: number
}

const transformations: Transformation[] = [
  {
    id: 'sarah-mum-athlete',
    name: 'Sarah Thompson',
    age: '42',
    location: 'Dereham',
    category: 'parent',
    story: {
      challenge: "Three kids, zero energy, hadn't exercised in 10 years",
      journey: 'Started with twice-weekly sessions while kids at school',
      breakthrough: "Realised I could be a mum AND prioritise my health"
    },
    results: {
      physical: [
        'Lost 3 stone in 6 months',
        'Can now run 10K without stopping',
        'No more back pain despite desk job'
      ],
      mental: [
        'Energy to play with kids after work',
        'Confidence through the roof',
        'Inspiring my children to be active'
      ],
      achievements: [
        'Completed first Spartan Sprint',
        'Now coaches junior park run',
        'Whole family does Saturday morning runs'
      ]
    },
    quote: "Leah didn't just transform my body - she showed me I could be the role model my kids deserve",
    timeframe: '8 months',
    rating: 5
  },
  {
    id: 'tom-youth-rugby',
    name: 'Tom Mitchell',
    age: '14',
    location: 'Norwich',
    category: 'youth',
    story: {
      challenge: 'Always last picked for teams, zero confidence',
      journey: 'Youth performance programme 3x per week',
      breakthrough: 'First time making a school team selection'
    },
    results: {
      physical: [
        'Increased vertical jump by 15cm',
        'Sprint time improved by 1.2 seconds',
        '20kg increase in squat strength'
      ],
      mental: [
        'Made county rugby team',
        'Now mentors younger athletes',
        'Academic grades improved too'
      ],
      achievements: [
        'County Rugby U15 Squad',
        'School Sports Captain',
        'Regional Athletics Bronze Medal'
      ]
    },
    quote: 'Coach Leah believed in me when no one else did. Now I believe in myself',
    timeframe: '12 months',
    rating: 5
  },
  {
    id: 'johnson-family',
    name: 'The Johnson Family',
    age: 'Parents 40s, Kids 8 & 12',
    location: 'Wymondham',
    category: 'family',
    story: {
      challenge: 'Screen time taking over, losing family connection',
      journey: 'Weekly family sessions plus individual programmes',
      breakthrough: 'First family 5K - we all crossed together holding hands'
    },
    results: {
      physical: [
        'Combined weight loss of 8 stone',
        'All completed Tough Mudder together',
        'Kids off gaming, into training'
      ],
      mental: [
        'Saturday training is family time',
        'Stronger bonds than ever',
        'Kids proud of fit parents'
      ],
      achievements: [
        'Family Tough Mudder Team',
        '4 parkruns completed together',
        'Inspired 3 other families to join'
      ]
    },
    quote: "Training together didn't just make us fitter - it gave us our family back",
    timeframe: '6 months',
    rating: 5
  },
  {
    id: 'james-spartan',
    name: 'James Williams',
    age: '38',
    location: 'Dereham',
    category: 'athlete',
    story: {
      challenge: 'Dad bod at 35, wanted to be a hero to my son',
      journey: 'Spartan training programme, 4 sessions per week',
      breakthrough: 'Crossing that first Spartan finish line'
    },
    results: {
      physical: [
        'Lost 5 stone in 9 months',
        'Completed 3 Spartan races',
        'Deadlift increased to 180kg'
      ],
      mental: [
        'Son wants to train with dad',
        'Work performance improved',
        'Found my tribe in the community'
      ],
      achievements: [
        'Spartan Trifecta in one year',
        'Now assistant coach for youth',
        'Inspired 10+ dads to start'
      ]
    },
    quote: 'From Xbox dad to Spartan dad - my son has never been prouder',
    timeframe: '10 months',
    rating: 5
  },
  {
    id: 'emma-postpartum',
    name: 'Emma Davies',
    age: '35',
    location: 'Norwich',
    category: 'parent',
    story: {
      challenge: 'Postnatal depression, felt lost after second baby',
      journey: 'Mums on a Mission programme, amazing support network',
      breakthrough: 'Realising other mums felt the same way'
    },
    results: {
      physical: [
        'Stronger than pre-pregnancy',
        'Completed first 10K race',
        'Diastasis recti fully healed'
      ],
      mental: [
        "Found my identity beyond 'mum'",
        'Depression lifted completely',
        'Incredible mum friends'
      ],
      achievements: [
        'Race for Life 10K finisher',
        'Leading buggy fitness group',
        'Helping other new mums start'
      ]
    },
    quote: "Leah's programme saved me. I found my strength, my tribe, and myself again",
    timeframe: '5 months',
    rating: 5
  },
  {
    id: 'lucy-teen-athlete',
    name: 'Lucy Chen',
    age: '16',
    location: 'Dereham',
    category: 'youth',
    story: {
      challenge: 'Wanted to improve netball performance',
      journey: 'Teen performance programme focused on agility',
      breakthrough: 'Selected for regional squad trials'
    },
    results: {
      physical: [
        'Agility scores up 30%',
        'Injury-free full season',
        'Stronger and faster than ever'
      ],
      mental: [
        'Leadership on court',
        'Confidence in abilities',
        'Inspiring younger players'
      ],
      achievements: [
        'County Netball Squad',
        'Team Captain at school',
        'Sports Scholarship offer'
      ]
    },
    quote: 'Training with Leah took my game to levels I never imagined possible',
    timeframe: '8 months',
    rating: 5
  }
]

export default function FamilyTransformationTestimonials() {
  const [selectedTransformation, setSelectedTransformation] = useState(transformations[0])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'parent' | 'youth' | 'family' | 'athlete'>('all')

  const filteredTransformations = selectedCategory === 'all'
    ? transformations
    : transformations.filter(t => t.category === selectedCategory)

  const categories = [
    { id: 'all', label: 'All Stories', icon: Users },
    { id: 'parent', label: 'Parents', icon: Heart },
    { id: 'youth', label: 'Youth Athletes', icon: Trophy },
    { id: 'family', label: 'Families', icon: Users },
    { id: 'athlete', label: 'Adult Athletes', icon: Target }
  ]

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2"
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-200/20 via-transparent to-blue-200/20 blur-3xl" />
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
            Real People. Real Results. Real Inspiration.
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            Every transformation starts with a decision. These are the stories of your neighbours who decided to change their lives.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as unknown)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Transformation Display */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Story & Results */}
          <motion.div
            key={selectedTransformation.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedTransformation.name}</h3>
                  <p className="text-gray-600">{selectedTransformation.age} • {selectedTransformation.location}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(selectedTransformation.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-200" />
                <p className="text-xl text-gray-700 italic pl-8 pr-4">
                  {selectedTransformation.quote}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-gray-500">Transformation time:</span>
                <span className="font-semibold text-orange-600">{selectedTransformation.timeframe}</span>
              </div>
            </div>

            {/* Journey Story */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border-2 border-orange-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                The Journey
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-orange-600 mb-1">The Challenge:</p>
                  <p className="text-gray-700">{selectedTransformation.story.challenge}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-600 mb-1">The Process:</p>
                  <p className="text-gray-700">{selectedTransformation.story.journey}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-600 mb-1">The Breakthrough:</p>
                  <p className="text-gray-700">{selectedTransformation.story.breakthrough}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results & Achievements */}
          <motion.div
            key={`${selectedTransformation.id}-results`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Before/After Visual or Placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Visual Transformation</p>
                <p className="text-gray-500 text-sm mt-2">Before & After Photos</p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-6">
              {/* Physical Results */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Physical Achievements
                </h5>
                <ul className="space-y-2">
                  {selectedTransformation.results.physical.map((result, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mental/Life Results */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Life Impact
                </h5>
                <ul className="space-y-2">
                  {selectedTransformation.results.mental.map((result, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Major Achievements */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Major Milestones
                </h5>
                <ul className="space-y-2">
                  {selectedTransformation.results.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-semibold">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transformation Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredTransformations.map((transformation) => (
            <motion.button
              key={transformation.id}
              onClick={() => setSelectedTransformation(transformation)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedTransformation.id === transformation.id
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  selectedTransformation.id === transformation.id
                    ? 'bg-orange-500'
                    : 'bg-gray-200'
                }`}>
                  {transformation.category === 'parent' && <Heart className={`w-6 h-6 ${selectedTransformation.id === transformation.id ? 'text-white' : 'text-gray-600'}`} />}
                  {transformation.category === 'youth' && <Trophy className={`w-6 h-6 ${selectedTransformation.id === transformation.id ? 'text-white' : 'text-gray-600'}`} />}
                  {transformation.category === 'family' && <Users className={`w-6 h-6 ${selectedTransformation.id === transformation.id ? 'text-white' : 'text-gray-600'}`} />}
                  {transformation.category === 'athlete' && <Target className={`w-6 h-6 ${selectedTransformation.id === transformation.id ? 'text-white' : 'text-gray-600'}`} />}
                </div>
                <p className={`text-sm font-semibold ${
                  selectedTransformation.id === transformation.id
                    ? 'text-orange-900'
                    : 'text-gray-700'
                }`}>
                  {transformation.name.split(' ')[0]}
                </p>
                <p className={`text-xs ${
                  selectedTransformation.id === transformation.id
                    ? 'text-orange-700'
                    : 'text-gray-500'
                }`}>
                  {transformation.category}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Community Stats Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Our Community Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/90">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-white/90">Families Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-white/90">Races Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">23</div>
              <div className="text-white/90">Youth Champions</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}