'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  MapPin,
  Users,
  Trophy,
  Calendar,
  Heart,
  ArrowRight,
  MessageCircle,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

interface CommunityEvent {
  id: string
  title: string
  date: string
  location: string
  participants: number
  type: 'race' | 'training' | 'social' | 'charity'
  image?: string
  description: string
}

interface CommunityMember {
  id: string
  name: string
  achievement: string
  location: string
  quote: string
}

const upcomingEvents: CommunityEvent[] = [
  {
    id: 'family-fun-run',
    title: 'Norfolk Family Fun Run',
    date: 'Every Saturday, 9am',
    location: 'Dereham Neatherd Moor',
    participants: 50,
    type: 'training',
    description: 'Weekly community run for all abilities. Kids, parents, grandparents - everyone welcome!'
  },
  {
    id: 'youth-athletics',
    title: 'Youth Athletics Championships',
    date: '15th June 2025',
    location: 'UEA Sportspark, Norwich',
    participants: 200,
    type: 'race',
    description: 'Annual showcase of Norfolk\'s young athletic talent'
  },
  {
    id: 'spartan-prep',
    title: 'Spartan Race Prep Day',
    date: 'First Sunday monthly',
    location: 'Thetford Forest',
    participants: 75,
    type: 'training',
    description: 'Intensive obstacle training for upcoming Spartan races'
  },
  {
    id: 'charity-obstacle',
    title: 'Norfolk Heroes Challenge',
    date: '1st September 2025',
    location: 'Holkham Estate',
    participants: 300,
    type: 'charity',
    description: 'Annual charity obstacle race supporting local causes'
  }
]

const communityStats = [
  { label: 'Active Members', value: '500+', icon: Users, color: 'text-orange-500' },
  { label: 'Weekly Sessions', value: '15', icon: Calendar, color: 'text-blue-500' },
  { label: 'Locations', value: '5', icon: MapPin, color: 'text-green-500' },
  { label: 'Champions Made', value: '50+', icon: Trophy, color: 'text-purple-500' }
]

const locations = [
  { name: 'Dereham', sessions: 'Mon, Wed, Fri, Sat', members: '180+' },
  { name: 'Norwich', sessions: 'Tue, Thu, Sat, Sun', members: '150+' },
  { name: 'Wymondham', sessions: 'Wed, Sat', members: '80+' },
  { name: 'Thetford Forest', sessions: 'Sundays', members: '60+' },
  { name: 'North Norfolk Coast', sessions: 'Monthly beach sessions', members: '40+' }
]

const recentAchievements = [
  'Tom Mitchell selected for County Rugby Squad',
  'Johnson Family completes Tough Mudder together',
  'Sarah Thompson finishes first Spartan Race',
  '10 youth athletes achieve regional qualifications',
  'Community raises £5,000 for local charity',
  'Lucy Chen receives sports scholarship',
  '50th parkrun milestone for running group'
]

export default function NorfolkCommunitySection() {
  const [activeEventType, setActiveEventType] = useState<'all' | 'race' | 'training' | 'social' | 'charity'>('all')
  const [currentAchievement, setCurrentAchievement] = useState(0)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAchievement((prev) => (prev + 1) % recentAchievements.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const filteredEvents = activeEventType === 'all'
    ? upcomingEvents
    : upcomingEvents.filter(e => e.type === activeEventType)

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* Animated Map Background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[url('/images/norfolk-map-outline.svg')] bg-no-repeat bg-center bg-contain" />
      </motion.div>

      {/* Floating location pins animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${20 + i * 15}%`,
              y: '110%'
            }}
            animate={{
              y: '-10%'
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: 'linear'
            }}
          >
            <MapPin className="w-8 h-8 text-orange-300/20" />
          </motion.div>
        ))}
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
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full font-semibold mb-6">
            <MapPin className="w-5 h-5" />
            Norfolk&apos;s Strongest Community
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Join Norfolk&apos;s Most Supportive
            <span className="block text-orange-500">Fitness Family</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            From Dereham to the coast, we&apos;re building a community where everyone belongs, everyone improves, and everyone celebrates together
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {communityStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Training Locations */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-orange-500" />
              Training Locations Across Norfolk
            </h3>
            <div className="space-y-4">
              {locations.map((location, idx) => (
                <motion.div
                  key={location.name}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{location.name}</h4>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {location.members}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {location.sessions}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">Interactive Norfolk Map</p>
                <p className="text-gray-500 text-sm mt-1">Find your nearest session</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Events & Activities */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              Upcoming Community Events
            </h3>

            {/* Event Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'training', 'race', 'charity'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveEventType(type as unknown)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeEventType === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.type === 'race' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'training' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'charity' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.participants}+ attending
                    </span>
                    <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievement Ticker */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-16"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="w-10 h-10 text-yellow-300" />
              <div>
                <p className="text-sm font-semibold text-orange-100 mb-1">Latest Community Achievement</p>
                <motion.p
                  key={currentAchievement}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-xl font-bold"
                >
                  {recentAchievements[currentAchievement]}
                </motion.p>
              </div>
            </div>
            <div className="flex gap-2">
              {recentAchievements.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentAchievement ? 'bg-white w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Community Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support Network</h4>
            <p className="text-gray-600">
              Private Facebook group with 500+ members sharing tips, motivation, and celebrating wins
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Inclusive Environment</h4>
            <p className="text-gray-600">
              All ages, all abilities, all welcome. From first-timers to ultra athletes, we train together
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Celebrate Together</h4>
            <p className="text-gray-600">
              Monthly awards, race support crews, and celebration events for every achievement
            </p>
          </motion.div>
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-br from-orange-50 to-white rounded-2xl p-12 border-2 border-orange-100"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join Norfolk&apos;s Strongest Community?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your first session is free. Come see why hundreds of Norfolk families choose to train with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              Join the Community
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-4 px-8 rounded-lg transition-all hover:scale-105">
              View Schedule
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              No contracts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Family discounts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              First session free
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}