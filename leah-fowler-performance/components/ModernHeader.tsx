"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import '../app/mobile-header-fix.css'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Sun, Moon, Phone, Mail, Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '#programmes',
    label: 'Services',
    dropdown: [
      { href: '#programmes', label: '🌟 Online Package - £100/month (BEST VALUE)' },
      { href: '#programmes', label: 'Pathway to Endurance - £48 (16 weeks)' },
      { href: '#programmes', label: 'Small Group Training - £120 (12 sessions)' },
      { href: '#programmes', label: 'Silver 1:1 Training - £140/month' },
      { href: '#programmes', label: 'Gold Elite Training - £250/month' },
      { href: '#programmes', label: 'Semi-Private Coaching - £90/month per person' },
    ]
  },
]

export default function ModernHeader() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Theme toggle - Default to dark mode
  React.useEffect(() => {
    const theme = localStorage.getItem('theme')
    // Default to dark mode unless explicitly set to light
    if (theme !== 'light') {
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

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 mobile-header-compact",
          isScrolled
            ? "bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl shadow-xl border-b border-white/20 scrolled"
            : "bg-gradient-to-b from-navy/90 to-navy/60 backdrop-blur-md"
        )}
      >
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-0">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/" className="flex items-center">
                {/* Strength PT Logo - Smaller on mobile */}
                <div className="relative h-20 sm:h-24 md:h-14 lg:h-16 xl:h-20 w-auto flex items-center">
                  <Image
                    src="/images/strength-pt-logo.svg"
                    alt="Strength PT - Elite Online Personal Training & Strength Coaching UK | PT Dereham"
                    width={360}
                    height={96}
                    className="h-full w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
            </motion.div>

            {/* Center Section with Services and Get Started */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <div className="flex items-center gap-6">
                {/* Services Dropdown */}
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:opacity-80"
                      style={{
                        color: '#d4a574',
                        backgroundColor: 'transparent'
                      }}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown className={cn(
                          "h-3 w-3 transition-transform duration-300",
                          activeDropdown === item.label && "rotate-180"
                        )} style={{ color: '#d4a574' }} />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: activeDropdown === item.label ? 1 : 0,
                          y: activeDropdown === item.label ? 0 : -10,
                          pointerEvents: activeDropdown === item.label ? "auto" : "none"
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden z-50"
                        style={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)'
                        }}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-6 py-3 text-sm font-medium transition-all duration-300 hover:opacity-80"
                          style={{
                            color: 'var(--card-foreground)',
                            backgroundColor: 'transparent'
                          }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Get Started Button - Centralized */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="font-bold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
                    style={{
                      backgroundColor: '#d4a574',
                      color: '#000000'
                    }}
                    asChild
                  >
                    <Link href="/apply" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: '#000000' }} />
                      Apply for Coaching
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Contact Icons Only */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Quick Contact Icons */}
              <motion.a
                href="tel:+447990600958"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center hover:opacity-80"
                style={{
                  color: '#d4a574',
                  backgroundColor: 'transparent'
                }}
                aria-label="Call us"
              >
                <Phone className="h-5 w-5" />
              </motion.a>

              <motion.a
                href="mailto:leah@strengthpt.co.uk"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center hover:opacity-80"
                style={{
                  color: '#d4a574',
                  backgroundColor: 'transparent'
                }}
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
              </motion.a>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center hover:opacity-80"
                style={{
                  color: '#d4a574',
                  backgroundColor: 'transparent'
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-3 rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-80"
              style={{
                color: '#d4a574',
                backgroundColor: 'transparent'
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-full sm:w-80 backdrop-blur-xl z-[60] lg:hidden shadow-2xl"
        style={{
          backgroundColor: 'var(--background)'
        }}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <nav className="flex-1">
            <div className="space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <div
                    className="block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer hover:opacity-80"
                  style={{
                    color: '#d4a574'
                  }}
                  >
                    {item.label}
                  </div>
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:opacity-80"
                        style={{
                          color: 'var(--foreground-secondary)'
                        }}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t pt-6 space-y-4" style={{ borderColor: 'var(--border)' }}>
            <Button
              className="w-full font-bold py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
              style={{
                backgroundColor: '#d4a574',
                color: '#000000'
              }}
              asChild
            >
              <Link href="/apply" onClick={() => setIsOpen(false)}>
                Apply for Coaching
              </Link>
            </Button>
            
            <div className="flex justify-center space-x-4">
              <a href="tel:+447990600958" className="p-3 rounded-lg transition-all duration-300 hover:opacity-80" style={{ color: '#d4a574' }}>
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:leah@strengthpt.co.uk" className="p-3 rounded-lg transition-all duration-300 hover:opacity-80" style={{ color: '#d4a574' }}>
                <Mail className="h-5 w-5" />
              </a>
              <button onClick={toggleTheme} className="p-3 rounded-lg transition-all duration-300 hover:opacity-80" style={{ color: '#d4a574' }}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 backdrop-blur-sm z-[55] lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
      )}
    </>
  )
}