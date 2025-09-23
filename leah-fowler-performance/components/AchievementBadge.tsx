'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const AchievementBadge: React.FC = () => {
  return (
    <motion.div
      className="relative z-10 flex justify-center mt-8 lg:mt-12 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border-2 border-blue-900/40 shadow-2xl"
        animate={{
          y: [0, -5, 0],
          boxShadow: [
            '0 20px 40px rgba(0,0,0,0.1)',
            '0 25px 50px rgba(212,165,116,0.2)',
            '0 20px 40px rgba(0,0,0,0.1)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 30px 60px rgba(212,165,116,0.3)'
        }}
      >
        <span className="text-gold text-base md:text-lg font-bold flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          From Zero Press-ups to Ultra Endurance
        </span>
      </motion.div>
    </motion.div>
  )
}

export default AchievementBadge