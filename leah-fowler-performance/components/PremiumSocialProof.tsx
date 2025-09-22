"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, TrendingUp, Award, Users, CheckCircle, Calendar, Target, Zap } from 'lucide-react'
import {
  notificationSlide
} from '@/lib/animations'

interface Notification {
  id: string
  type: 'achievement' | 'joining' | 'testimonial' | 'milestone'
  icon: React.ElementType
  iconColor: string
  title: string
  message: string
  timestamp: string
  location?: string
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'joining',
    icon: Users,
    iconColor: 'text-sage',
    title: 'New Parent Joined',
    message: 'Emma from Norwich started strength training',
    timestamp: '2 minutes ago',
    location: 'Norwich, UK'
  },
  {
    id: '2',
    type: 'achievement',
    icon: TrendingUp,
    iconColor: 'text-gold',
    title: 'Fitness Milestone',
    message: "Sarah: 'Just did 10 proper press-ups!'",
    timestamp: '5 minutes ago'
},
  {
    id: '3',
    type: 'testimonial',
    icon: Star,
    iconColor: 'text-gold',
    title: 'Parent Success Story',
    message: '"From zero fitness to Spartan finisher!" - Rachel, 38',
    timestamp: '12 minutes ago'
},
  {
    id: '4',
    type: 'milestone',
    icon: Award,
    iconColor: 'text-sage',
    title: 'Community Strong',
    message: '500+ parents training strong this year',
    timestamp: '15 minutes ago'
},
  {
    id: '5',
    type: 'joining',
    icon: Users,
    iconColor: 'text-sage',
    title: 'Performance Level',
    message: 'Lisa from Dereham joined Elite Training',
    timestamp: '18 minutes ago',
    location: 'Dereham, UK'
  },
  {
    id: '6',
    type: 'achievement',
    icon: Target,
    iconColor: 'text-gold',
    title: 'Race Day Victory',
    message: 'Sophie completed first 5K while kids cheered',
    timestamp: '22 minutes ago'
},
  {
    id: '7',
    type: 'testimonial',
    icon: Star,
    iconColor: 'text-gold',
    title: "Daughter's Pride",
    message: '"My parent is the strongest!" - Amy\'s daughter',
    timestamp: '25 minutes ago'
},
  {
    id: '8',
    type: 'milestone',
    icon: Zap,
    iconColor: 'text-sage',
    title: 'Success Rate',
    message: '92% achieve their fitness goals',
    timestamp: '30 minutes ago'
},
]

export default function PremiumSocialProof() {
  const [currentNotification, setCurrentNotification] = React.useState<Notification | null>(null)
  const [notificationIndex, setNotificationIndex] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    // Initial delay before showing first notification
    const initialTimer = setTimeout(() => {
      setCurrentNotification(notifications[0])
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(initialTimer)
  }, [])

  React.useEffect(() => {
    if (!isPaused && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)

        // After hiding, wait a bit then show next notification
        setTimeout(() => {
          const nextIndex = (notificationIndex + 1) % notifications.length
          setNotificationIndex(nextIndex)
          setCurrentNotification(notifications[nextIndex])
          setIsVisible(true)
        }, 2000)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isPaused, notificationIndex])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)
  const handleClose = () => {
    setIsVisible(false)
    setIsPaused(false)
  }

  return (
    <>
      {/* Desktop Notifications - Bottom Left */}
      <AnimatePresence>
        {isVisible && currentNotification && (
          <motion.div
            className="fixed bottom-8 left-8 z-40 hidden lg:block"
            variants={notificationSlide}
            initial="initial"
            animate="animate"
            exit="exit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="bg-white dark:bg-navy-light rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold via-sage to-gold opacity-20 blur-xl"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
}}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
}}
                style={{
                  backgroundSize: '200% 200%'
}}
              />

              <div className="relative bg-white dark:bg-navy-light p-4">
                {/* Live indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
}}
                      transition={{
                        duration: 2,
                        repeat: Infinity
}}
                    />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Live Update
                    </span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Notification content */}
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${
                    currentNotification.type === 'achievement' || currentNotification.type === 'testimonial'
                      ? 'from-gold/20 to-gold/10'
                      : 'from-sage/20 to-sage/10'
                  } flex items-center justify-center`}>
                    <currentNotification.icon className={`w-6 h-6 ${currentNotification.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-navy dark:text-white mb-1">
                      {currentNotification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {currentNotification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <span>{currentNotification.timestamp}</span>
                      {currentNotification.location && (
                        <>
                          <span>•</span>
                          <span>{currentNotification.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar showing time remaining */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold to-sage"
                  initial={{ width: '100%' }}
                  animate={{ width: isPaused ? '100%' : '0%' }}
                  transition={{ duration: isPaused ? 0 : 5, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Notifications - Top */}
      <AnimatePresence>
        {isVisible && currentNotification && (
          <motion.div
            className="fixed top-20 inset-x-4 z-40 lg:hidden"
            variants={notificationSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-navy-light rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-4"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                  currentNotification.type === 'achievement' || currentNotification.type === 'testimonial'
                    ? 'from-gold/20 to-gold/10'
                    : 'from-sage/20 to-sage/10'
                } flex items-center justify-center flex-shrink-0`}>
                  <currentNotification.icon className={`w-5 h-5 ${currentNotification.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-navy dark:text-white">
                    {currentNotification.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentNotification.message}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="text-gray-400 text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust indicators bar - Always visible */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-navy via-navy-dark to-navy text-white py-2 px-4"
      >
        <div className="container mx-auto">
          <motion.div
            className="flex items-center justify-center gap-6 text-xs sm:text-sm"
            animate={{
              x: [-100, 0, 100, 0, -100]
}}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear'
}}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sage" />
              <span>500+ Parents Stronger</span>
            </div>
            <span className="text-gold">•</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span>300% Average Strength Gain</span>
            </div>
            <span className="text-gold">•</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sage" />
              <span>Mother of 3 | Ultra Athlete</span>
            </div>
            <span className="text-gold hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>Start Training Today</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}