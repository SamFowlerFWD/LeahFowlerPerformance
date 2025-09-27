"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import {
  Home,
  Calendar,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Phone,
  Mail,
  Sun,
  Moon,
  Target,
  Award,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSwipeGesture, useResponsive, useViewportHeight } from '@/hooks/useResponsive'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  subItems?: { href: string; label: string; price?: string }[]
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="h-5 w-5" />
  },
  {
    href: '#programmes',
    label: 'Programmes',
    icon: <Target className="h-5 w-5" />,
    subItems: [
      { href: '#programmes', label: 'Pathway to Endurance', price: '£48 (16 weeks)' },
      { href: '#programmes', label: 'Small Group Training', price: '£120 (12 sessions)' },
      { href: '#programmes', label: 'Semi-Private Coaching', price: '£90/month pp' },
      { href: '#programmes', label: 'Silver Package', price: '£140/month' },
      { href: '#programmes', label: 'Gold Elite Package', price: '£250/month' },
    ]
  },
  {
    href: '/assessment',
    label: 'Assessment',
    icon: <Award className="h-5 w-5" />
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    href: '#contact',
    label: 'Contact',
    icon: <MessageCircle className="h-5 w-5" />
  },
]

// Bottom navigation items removed - Using slide-out menu only

export default function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const pathname = usePathname()
  const { isMobile, isTablet } = useResponsive()

  // Use viewport height fix for mobile browsers
  useViewportHeight()

  // Handle swipe gestures
  useSwipeGesture(
    () => setIsOpen(false), // Swipe left to close
    () => setIsOpen(true),  // Swipe right to open
    undefined,
    undefined,
    75 // Threshold for swipe
  )

  // Theme management
  React.useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    // Close menu if dragged more than 100px to the right
    if (info.offset.x > 100) {
      setIsOpen(false)
    }
  }

  // Only render on mobile/tablet devices
  if (!isMobile && !isTablet) return null

  return (
    <>
      {/* Floating Action Button (Hamburger Menu) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg",
          "bg-gradient-to-r from-gold to-gold-light text-navy",
          "lg:hidden touch-manipulation",
          isOpen && "bg-white dark:bg-navy-dark"
        )}
        style={{ minHeight: '48px', minWidth: '48px' }}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Slide-out Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-navy-dark shadow-2xl z-50 lg:hidden overflow-hidden"
              style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-sage bg-clip-text text-transparent">
                      Leah Fowler Performance
                    </h2>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg text-navy dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                      style={{ minHeight: '48px', minWidth: '48px' }}
                      aria-label="Toggle theme"
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 -webkit-overflow-scrolling-touch">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        {item.subItems ? (
                          <div>
                            <button
                              onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl",
                                "text-lg font-medium transition-all duration-300 touch-manipulation",
                                "hover:bg-gold/10 active:bg-gold/20",
                                expandedItem === item.label && "bg-gold/10"
                              )}
                              style={{ minHeight: '48px' }}
                            >
                              <span className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                              </span>
                              <motion.div
                                animate={{ rotate: expandedItem === item.label ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {expandedItem === item.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <ul className="mt-2 ml-12 space-y-1">
                                    {item.subItems.map((subItem) => (
                                      <li key={subItem.label}>
                                        <Link
                                          href={subItem.href}
                                          onClick={() => setIsOpen(false)}
                                          className={cn(
                                            "block px-4 py-3 rounded-lg text-sm",
                                            "hover:bg-gold/10 active:bg-gold/20 transition-all duration-300",
                                            "touch-manipulation"
                                          )}
                                          style={{ minHeight: '48px' }}
                                        >
                                          <div className="flex justify-between items-center">
                                            <span>{subItem.label}</span>
                                            {subItem.price && (
                                              <span className="text-gold font-semibold">{subItem.price}</span>
                                            )}
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl",
                              "text-lg font-medium transition-all duration-300 touch-manipulation",
                              "hover:bg-gold/10 active:bg-gold/20",
                              pathname === item.href && "bg-gold/10 text-gold"
                            )}
                            style={{ minHeight: '48px' }}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold shadow-lg transition-all duration-300 touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    <Link href="/assessment" onClick={() => setIsOpen(false)}>
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Free Consultation
                    </Link>
                  </Button>

                  {/* Contact Actions */}
                  <div className="flex gap-2">
                    <a
                      href="tel:+441234567890"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-navy dark:text-white hover:bg-gold/10 transition-all duration-300 touch-manipulation"
                      style={{ minHeight: '48px' }}
                    >
                      <Phone className="h-5 w-5" />
                      <span className="font-medium">Call</span>
                    </a>
                    <a
                      href="mailto:info@leahfowlerperformance.com"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-navy dark:text-white hover:bg-gold/10 transition-all duration-300 touch-manipulation"
                      style={{ minHeight: '48px' }}
                    >
                      <Mail className="h-5 w-5" />
                      <span className="font-medium">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar Removed - Using floating hamburger menu instead */}
    </>
  )
}