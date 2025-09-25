'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MessageCircle,
  Target,
  Menu,
  X,
  Trophy,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Heart,
  Star
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  action?: () => void
  badge?: string
  color?: string
}

// Primary navigation items for bottom bar
const primaryNavItems: NavItem[] = [
  {
    id: 'book',
    label: 'Book Free',
    icon: Calendar,
    href: '/booking',
    badge: 'FREE',
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'programmes',
    label: 'Programmes',
    icon: Target,
    href: '#programmes'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    action: () => {
      const message = encodeURIComponent('Hi Leah, I\'d like to know more about your programmes!')
      window.open(`https://wa.me/447990600958?text=${message}`, '_blank')
    },
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Clock,
    href: '/schedule'
  }
]

// Quick access menu items
const quickAccessItems = [
  {
    title: 'Popular Programmes',
    items: [
      { label: 'Family Foundations', price: '£120/month', href: '/programmes/family' },
      { label: 'Future Champions (Youth)', price: '£79/month', href: '/programmes/youth' },
      { label: 'Spartan Strong (Parents)', price: '£149/month', href: '/programmes/spartan' },
      { label: 'Morning Power (Mums)', price: '£89/month', href: '/programmes/mums' }
    ]
  },
  {
    title: 'Quick Actions',
    items: [
      { label: 'View Class Timetable', icon: Clock, href: '/timetable' },
      { label: 'Location & Parking', icon: MapPin, href: '/location' },
      { label: 'Success Stories', icon: Star, href: '/testimonials' },
      { label: 'About Leah', icon: Heart, href: '/about' }
    ]
  },
  {
    title: 'Contact',
    items: [
      { label: 'Call: 07123 456 789', icon: Phone, action: () => window.location.href = 'tel:07123456789' },
      { label: 'Email Leah', icon: Mail, action: () => window.location.href = 'mailto:leah@leahfowlerperformance.co.uk' }
    ]
  }
]

const MobileBottomNav: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [navVisible, setNavVisible] = useState(true)
  const pathname = usePathname()

  // Handle scroll behavior for nav visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false) // Scrolling down - hide nav
      } else {
        setNavVisible(true) // Scrolling up - show nav
      }

      setScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close menu when route changes
  useEffect(() => {
    setShowMenu(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMenu])

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        animate={{
          y: navVisible ? 0 : 100,
          opacity: navVisible ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`bg-white border-t border-slate-200 ${scrolled ? 'shadow-2xl' : 'shadow-lg'}`}>
          <div className="flex items-center justify-around py-2 px-2">
            {primaryNavItems.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[56px]"
                  >
                    <div className="relative">
                      {item.color ? (
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-slate-700" />
                        </div>
                      )}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 text-slate-600 font-medium">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[56px]"
                  >
                    <div className="relative">
                      {item.color ? (
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-slate-700" />
                        </div>
                      )}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 text-slate-600 font-medium">
                      {item.label}
                    </span>
                  </button>
                )}
              </motion.div>
            ))}

            {/* Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[56px]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                {showMenu ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-[10px] mt-1 text-slate-600 font-medium">
                {showMenu ? 'Close' : 'Menu'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Quick Info Bar - Shows on scroll */}
        <AnimatePresence>
          {scrolled && navVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-8 left-0 right-0 bg-orange-500 text-white px-4 py-1.5 flex items-center justify-between text-xs font-medium"
            >
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                First Session FREE
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                500+ Happy Families
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Norfolk Mum
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto pb-20"
            >
              {/* Handle Bar */}
              <div className="sticky top-0 bg-white z-10 py-3">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />
              </div>

              <div className="px-6 pb-6">
                {/* Hero Message */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold mb-2">Welcome to Your Fitness Family!</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Join 500+ Norfolk families on their transformation journey
                  </p>
                  <button className="bg-white text-orange-500 font-bold py-2 px-4 rounded-xl text-sm w-full">
                    Get Started with FREE Session
                  </button>
                </div>

                {/* Quick Access Sections */}
                {quickAccessItems.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h4 className="font-bold text-slate-900 mb-3">{section.title}</h4>
                    <div className="space-y-2">
                      {section.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.href ? (
                            <Link
                              href={item.href}
                              className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="w-5 h-5 text-orange-500" />}
                                <span className="font-medium text-slate-700">{item.label}</span>
                              </div>
                              {item.price && (
                                <span className="text-orange-500 font-bold">{item.price}</span>
                              )}
                            </Link>
                          ) : (
                            <button
                              onClick={item.action}
                              className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="w-5 h-5 text-orange-500" />}
                                <span className="font-medium text-slate-700">{item.label}</span>
                              </div>
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Social Proof */}
                <div className="bg-slate-900 text-white rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-orange-400" />
                    <h4 className="font-bold">Why Choose Leah?</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">127</div>
                      <div className="text-xs text-white/70">Spartan Races</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">10+</div>
                      <div className="text-xs text-white/70">Years Experience</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">23</div>
                      <div className="text-xs text-white/70">Youth Champions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">Mum of 3</div>
                      <div className="text-xs text-white/70">Real Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button (Alternative) */}
      <motion.button
        className="fixed bottom-24 right-4 z-30 md:hidden bg-green-500 text-white p-4 rounded-full shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const message = encodeURIComponent('Hi Leah, I\'d like to know more!')
          window.open(`https://wa.me/447990600958?text=${message}`, '_blank')
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      </motion.button>
    </>
  )
}

export default MobileBottomNav