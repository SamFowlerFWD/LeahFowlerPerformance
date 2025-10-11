'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
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
        {/* Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          {/* Location Info */}
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-navy via-navy-dark to-navy-dark text-white max-w-2xl w-full">
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
        </motion.div>
      </div>
    </section>
  )
}