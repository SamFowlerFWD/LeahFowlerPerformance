'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ViewportIndicator() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateScrollPercentage = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const percentage = scrollHeight > 0 ? Math.round((currentScroll / scrollHeight) * 100) : 0
      setScrollPercentage(percentage)
      setIsVisible(currentScroll > 100)
    }

    updateScrollPercentage()
    window.addEventListener('scroll', updateScrollPercentage, { passive: true })
    window.addEventListener('resize', updateScrollPercentage, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollPercentage)
      window.removeEventListener('resize', updateScrollPercentage)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2"
    >
      <div className="bg-navy/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-navy px-3 py-2 rounded-full shadow-lg">
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-semibold">
            {scrollPercentage}%
          </div>
          <div className="w-px h-4 bg-white/30 dark:bg-navy/30" />
          <div className="relative w-1 h-20 bg-white/20 dark:bg-navy/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gold to-sage rounded-full"
              style={{ height: `${scrollPercentage}%` }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            />
          </div>
        </div>
      </div>

      {/* Viewport position label */}
      <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
        <div className="bg-navy/80 dark:bg-white/80 backdrop-blur-sm text-white dark:text-navy px-2 py-1 rounded text-xs font-medium">
          Viewport
        </div>
      </div>
    </motion.div>
  )
}