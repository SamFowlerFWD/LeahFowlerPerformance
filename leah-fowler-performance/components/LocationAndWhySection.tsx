'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Trophy,
  Heart,
  Brain,
  Users,
  Activity,
  Check
} from 'lucide-react'

const locationInfo = {
  venue: "Barrett's Health & Fitness",
  address: "Dereham, Norfolk",
  what3words: "///factually.tapes.thrusters",
  facilities: [
    "State-of-the-art gym",
    "Outdoor training space",
    "Free parking",
    "Shower facilities"
  ]
}

export default function LocationAndWhySection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-navy-dark dark:to-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Location & What's Included Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Location Info */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-navy via-navy-dark to-navy-dark text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-[#e7007d]" />
              Training Location
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#e7007d] mb-2">{locationInfo.venue}</h4>
                <p className="text-white/80">{locationInfo.address}</p>
                <p className="text-white/60 text-sm mt-1">{locationInfo.what3words}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Facilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {locationInfo.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#e7007d]" />
                      <span className="text-sm text-white/80">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#e7007d] via-gold-light to-[#e7007d]">
            <h3 className="text-2xl font-bold mb-6 text-navy flex items-center gap-3">
              <Trophy className="h-6 w-6" />
              Why Choose Aphrodite Fitness
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Mother of 3, Spartan Athlete</h4>
                  <p className="text-sm text-navy/80">I understand the challenges parents face</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Evidence-Based Methods</h4>
                  <p className="text-sm text-navy/80">Science-backed techniques for real results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Community Support</h4>
                  <p className="text-sm text-navy/80">Join a supportive community focused on strength</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-navy mt-1" />
                <div>
                  <h4 className="font-semibold text-navy mb-1">Real-World Strength</h4>
                  <p className="text-sm text-navy/80">Training that improves your daily life</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}