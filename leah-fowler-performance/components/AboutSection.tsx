"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  GraduationCap, 
  Users, 
  Target,
  Heart,
  CheckCircle,
  BookOpen,
  Trophy,
  Star,
  Briefcase,
  Globe,
  TrendingUp,
  BadgeCheck,
  Sparkles,
  Dumbbell,
  Activity,
  Brain,
  Shield
} from 'lucide-react'
import Image from 'next/image'

const credentials = [
  {
    icon: Heart,
    title: 'Mother of 3',
    subtitle: 'Who Gets the Real-Life Juggle',
    color: 'from-red-600 to-pink-600'
  },
  {
    icon: Trophy,
    title: 'Spartan Ultra Finisher',
    subtitle: 'From Zero Press-ups to 50K Races',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Users,
    title: '500+ Mums Stronger',
    subtitle: 'Properly Strong, Not Just Surviving',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Award,
    title: '15 Years Coaching',
    subtitle: 'Real Experience, Real Results',
    color: 'from-green-500 to-emerald-500'
  },
]

const stats = [
  { value: '500+', label: 'Mums Trained', icon: Heart },
  { value: '127', label: 'Race Finishes', icon: Trophy },
  { value: '300%', label: 'Average Strength Gain', icon: Star },
  { value: '3wk', label: 'First Press-up', icon: Target },
]

const expertise = [
  'Strength Training for Mums',
  'Postnatal Fitness Recovery',
  'Progressive Strength Building',
  'Real-Life Fitness Solutions',
  'Sustainable Training Plans',
  'No-Guilt Fitness Approach',
  'School-Run Friendly Sessions',
  'Building Lasting Strength',
]

const mediaLogos = [
  { name: 'Spartan', placeholder: 'SPARTAN RACE' },
  { name: 'Norfolk', placeholder: 'NORFOLK FITNESS' },
  { name: 'Community', placeholder: 'MUM FITNESS COMMUNITY' },
  { name: 'Success', placeholder: 'SUCCESS STORIES' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-32 sm:py-40 md:py-48 lg:py-56 xl:py-64 bg-gradient-to-br from-navy via-navy/95 to-navy-dark relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02]" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="w-full h-full bg-gradient-to-br from-gold/10 via-transparent to-sage/10 blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
          
          {/* Left: Image & Credentials */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/30 via-amber-300/20 to-sage/30 rounded-3xl blur-2xl opacity-60" />
              
              {/* Coach Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-16 md:p-20 lg:p-24">
                <div className="aspect-[3/4] flex items-center justify-center">
                  {/* Placeholder for actual headshot */}
                  <div className="text-center">
                    <div className="w-56 h-56 md:w-64 md:h-64 mx-auto mb-10 rounded-full bg-gradient-to-br from-gold/20 to-sage/20 flex items-center justify-center">
                      <Users className="h-32 w-32 text-white/80" />
                    </div>
                    <p className="text-gray-600 font-medium text-lg">Coach Photo</p>
                    <p className="text-gray-500 text-base mt-3">High-resolution image</p>
                  </div>
                </div>
              </div>

              {/* Floating Credential Cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100">
                    <Award className="h-8 w-8 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Strength Coach</p>
                    <p className="font-bold text-navy text-lg">Mum Fitness Expert</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Specialist</p>
                    <p className="font-bold text-navy text-lg">S&C Coach</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 md:mt-16 text-center"
            >
              <div className="inline-block">
                <div className="h-20 flex items-center justify-center text-4xl md:text-5xl font-signature text-gold italic">
                  Leah Fowler
                </div>
                <p className="text-white/60 text-base mt-2">Founder & Lead Coach</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-gold/20 to-amber-100/20 backdrop-blur-sm border border-gold/30 text-gold-light text-base font-semibold mb-12"
            >
              <Sparkles className="h-6 w-6" />
              YOUR FAMILY FITNESS COACH
              <Sparkles className="h-6 w-6" />
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-10 leading-tight">
              Leah Fowler
            </h2>
            
            <p className="text-3xl md:text-4xl text-orange-500 font-medium mb-10">
              Family Fitness & Athletic Performance Specialist
            </p>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
              From new mum to Ultra athlete, I understand the challenges of balancing family life with fitness goals.
              I've completed 3 Spartan Ultra Beasts, an Outlaw Triathlon, and coached over 200 families to transform
              their health together. As a mum of two, I prove daily that extraordinary is possible.
            </p>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-16">
              Whether you're training for your first 5K or your fifth Spartan Race, developing your child's athletic
              potential, or wanting to get fit as a family, I provide the coaching, community, and accountability you
              need. From our Dereham base, we're building Norfolk's strongest, most supportive fitness family.
            </p>

            {/* Credentials Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-10 mb-16">
              {credentials.map((cred, index) => (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10 hover:bg-white/15 transition-all hover:scale-105 duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cred.color} mb-5`}>
                    <cred.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-base md:text-lg mb-2">{cred.title}</h4>
                  <p className="text-white/60 text-sm md:text-base">{cred.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-8 md:gap-10 p-10 md:p-12 lg:p-14 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="text-center"
                >
                  <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-gold mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm md:text-base text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Expertise & Media */}
        <div className="mt-32 md:mt-40">
          {/* Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gold mb-12">Core Expertise</h3>
            <div className="flex flex-wrap justify-center gap-5 md:gap-6 max-w-5xl mx-auto">
              {expertise.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-base md:text-lg hover:bg-white/15 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 text-sage" />
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Media Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-white/60 text-base uppercase tracking-wider mb-10">Proud Partners & Achievements</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20 opacity-60">
              {mediaLogos.map((media) => (
                <div key={media.name} className="text-white/80 font-bold text-2xl md:text-3xl tracking-wider">
                  {media.placeholder}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}