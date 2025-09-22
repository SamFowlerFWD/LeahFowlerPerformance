'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Star } from 'lucide-react'

const AnnouncementBar: React.FC = () => {
  const announcements = [
    {
      icon: Users,
      text: "500+ Mums Stronger",
      color: "text-orange-500"
    },
    {
      icon: Trophy,
      text: "300% Average Strength Gain",
      color: "text-green-500"
    },
    {
      icon: Star,
      text: "Mother of 3 | Ultra Athlete",
      color: "text-blue-500"
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-3 px-4 shadow-xl border-b border-white/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-4 md:space-x-8 text-sm md:text-base font-semibold">
          <AnimatePresence mode="wait">
            {announcements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="hidden md:inline">{item.text}</span>
                <span className="md:hidden">{item.text.split(' ').slice(0, 2).join(' ')}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar