"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { Home, Calendar, User, MessageCircle, Menu, X, ChevronUp } from 'lucide-react'
import { PremiumButton } from '@/components/ui/premium-button'
import { easings } from '@/lib/animations'

interface DockItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
  badge?: number
}

const dockItems: DockItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'assessment', label: 'Assess', icon: Calendar, href: '/assessment' },
  { id: 'programmes', label: 'Plans', icon: User, href: '#programmes' },
  { id: 'contact', label: 'Chat', icon: MessageCircle, href: '#contact', badge: 1 },
]

export default function MobileDock() {
  const { scrollY } = useScroll()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState('home')
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const [lastScrollY, setLastScrollY] = React.useState(0)
  const [dockVisible, setDockVisible] = React.useState(true)

  // Hide/show dock based on scroll direction
  React.useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const currentScrollY = latest

      // Show scroll to top button after scrolling down
      setShowScrollTop(currentScrollY > 300)

      // Hide dock when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setDockVisible(false)
      } else {
        setDockVisible(true)
      }

      setLastScrollY(currentScrollY)
    })

    return () => unsubscribe()
  }, [scrollY, lastScrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemClick = (id: string) => {
    setActiveItem(id)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Mobile Dock - Fixed at bottom */}
      <AnimatePresence>
        {dockVisible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: easings.smooth }}
          >
            {/* Dock Container */}
            <div className="relative">
              {/* Gradient fade at top */}
              <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white/50 dark:from-navy-dark/50 to-transparent pointer-events-none" />

              {/* Main dock */}
              <motion.div
                className="bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 rounded-t-3xl shadow-2xl"
                initial={false}
                animate={isExpanded ? { height: 'auto' } : { height: '80px' }}
                transition={{ duration: 0.3, ease: easings.elegant }}
              >
                {/* Expanded menu */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 pb-2"
                    >
                      <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-bold text-navy dark:text-white">Quick Actions</h3>

                        {/* Primary CTA */}
                        <PremiumButton
                          size="lg"
                          variant="primary"
                          fullWidth
                          pulse
                          className="mb-4"
                        >
                          Book Free Consultation
                        </PremiumButton>

                        {/* Quick links */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href="/assessment"
                            className="bg-gray-50 dark:bg-navy-light rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-navy transition-colors"
                          >
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-gold" />
                            <span className="text-sm font-medium text-navy dark:text-white">Free Assessment</span>
                          </Link>
                          <Link
                            href="#testimonials"
                            className="bg-gray-50 dark:bg-navy-light rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-navy transition-colors"
                          >
                            <User className="w-6 h-6 mx-auto mb-2 text-sage" />
                            <span className="text-sm font-medium text-navy dark:text-white">Success Stories</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation items */}
                <div className="relative h-20 px-4">
                  <div className="flex items-center justify-around h-full">
                    {dockItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => handleItemClick(item.id)}
                          className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
                        >
                          {/* Active indicator */}
                          {activeItem === item.id && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute inset-0 bg-gradient-to-br from-gold/20 to-sage/20 rounded-2xl"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon */}
                          <motion.div
                            className="relative"
                            whileTap={{ scale: 0.9 }}
                            animate={activeItem === item.id ? { y: -2 } : { y: 0 }}
                          >
                            <item.icon
                              className={`w-6 h-6 ${
                                activeItem === item.id
                                  ? 'text-gold'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            />

                            {/* Badge */}
                            {item.badge && (
                              <motion.span
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {item.badge}
                              </motion.span>
                            )}
                          </motion.div>

                          {/* Label */}
                          <span
                            className={`text-xs mt-1 ${
                              activeItem === item.id
                                ? 'text-navy dark:text-white font-semibold'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}

                    {/* Menu toggle button */}
                    <motion.button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="relative flex flex-col items-center justify-center p-2 min-w-[60px]"
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isExpanded ? (
                          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </motion.div>
                      <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                        {isExpanded ? 'Close' : 'Menu'}
                      </span>
                    </motion.button>
                  </div>

                  {/* Premium indicator line */}
                  <motion.div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gold to-sage rounded-full"
                    animate={{ width: ['48px', '56px', '48px'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top FAB */}
      <AnimatePresence>
        {showScrollTop && !isExpanded && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-40 lg:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-gold to-sage rounded-full shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 10px 30px rgba(212, 165, 116, 0.3)',
                  '0 15px 40px rgba(212, 165, 116, 0.4)',
                  '0 10px 30px rgba(212, 165, 116, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Safe area padding for mobile */}
      <div className="h-20 lg:hidden" />
    </>
  )
}