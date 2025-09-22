"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Sun, Moon, Phone, Mail, Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { 
    href: '#programmes', 
    label: 'Programmes',
    dropdown: [
      { href: '#programmes', label: 'Premium Performance - £350/month' },
      { href: '#programmes', label: 'Performance Essentials - £199/month' },
      { href: '#programmes', label: 'Online Programme - £97/month' },
      { href: '#programmes', label: 'Small Group Training - £79/month' },
    ]
  },
  { href: '/assessment', label: 'Free Assessment' },
  { href: '#about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '#testimonials', label: 'Success Stories' },
  { href: '#contact', label: 'Contact' },
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

  // Theme toggle
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

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-12 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "py-4 bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl shadow-xl border-b border-white/20"
            : "py-6 bg-gradient-to-b from-navy/90 to-navy/60 backdrop-blur-md"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/" className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-sage/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative">
                  <span className={cn(
                    "text-2xl font-bold bg-gradient-to-r from-gold to-sage bg-clip-text text-transparent",
                    !isScrolled && "text-white"
                  )}>
                    LFP
                  </span>
                </div>
                <span className={cn(
                  "hidden md:block text-lg font-semibold transition-colors duration-300",
                  isScrolled ? "text-navy dark:text-white" : "text-white"
                )}>
                  Leah Fowler Performance
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "px-5 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2",
                      isScrolled 
                        ? "text-navy hover:text-gold hover:bg-gold/10 dark:text-white dark:hover:text-gold" 
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-300",
                        activeDropdown === item.label && "rotate-180"
                      )} />
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
                      className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-6 py-3 text-sm font-medium text-navy dark:text-white hover:bg-gold/10 hover:text-gold transition-all duration-300"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Quick Contact Icons */}
              <motion.a
                href="tel:+441234567890"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center",
                  isScrolled 
                    ? "text-navy hover:text-gold hover:bg-gold/10 dark:text-white" 
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                aria-label="Call us"
              >
                <Phone className="h-5 w-5" />
              </motion.a>
              
              <motion.a
                href="mailto:info@leahfowlerperformance.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center",
                  isScrolled 
                    ? "text-navy hover:text-gold hover:bg-gold/10 dark:text-white" 
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
              </motion.a>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center",
                  isScrolled 
                    ? "text-navy hover:text-gold hover:bg-gold/10 dark:text-white" 
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-gold/30 transition-all duration-300"
                  asChild
                >
                  <Link href="/assessment" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Consultation
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "lg:hidden p-3 rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center",
                isScrolled 
                  ? "text-navy hover:text-gold hover:bg-gold/10 dark:text-white" 
                  : "text-white/90 hover:text-white hover:bg-white/10"
              )}
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
        className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white/95 dark:bg-navy-dark/95 backdrop-blur-xl z-[60] lg:hidden shadow-2xl"
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-lg font-medium text-navy dark:text-white hover:text-gold hover:bg-gold/10 transition-all duration-300"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm text-navy/70 dark:text-white/70 hover:text-gold hover:bg-gold/10 transition-all duration-300"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold py-6 rounded-xl shadow-lg hover:shadow-gold/30 transition-all duration-300"
              asChild
            >
              <Link href="/assessment" onClick={() => setIsOpen(false)}>
                Start Free Assessment
              </Link>
            </Button>
            
            <div className="flex justify-center space-x-4">
              <a href="tel:+441234567890" className="p-3 rounded-lg text-navy dark:text-white hover:text-gold hover:bg-gold/10 transition-all duration-300">
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:info@leahfowlerperformance.com" className="p-3 rounded-lg text-navy dark:text-white hover:text-gold hover:bg-gold/10 transition-all duration-300">
                <Mail className="h-5 w-5" />
              </a>
              <button onClick={toggleTheme} className="p-3 rounded-lg text-navy dark:text-white hover:text-gold hover:bg-gold/10 transition-all duration-300">
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
        />
      )}
    </>
  )
}