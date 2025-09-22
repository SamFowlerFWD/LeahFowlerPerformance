"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '#assessment', label: 'Assessment' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#about', label: 'About' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { scrollY } = useScroll()
  
  // Create subtle parallax effect for header
  const headerY = useTransform(scrollY, [0, 100], [0, -5])
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      style={{ y: headerY }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "py-4 backdrop-blur-xl bg-white/80 dark:bg-navy/80 border-b border-gray-200/20 shadow-lg" 
          : "py-6 backdrop-blur-lg bg-white/60 dark:bg-navy/60"
      )}
    >
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gold to-sage rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-navy to-navy-dark text-white font-bold text-xl px-4 py-3 rounded-xl shadow-xl">
                  LF
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-navy dark:text-white leading-tight">
                  Leah Fowler
                </div>
                <div className="text-xs text-gold font-semibold tracking-widest uppercase">
                  Performance
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex items-center space-x-1"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="relative px-5 py-3 text-sm font-semibold text-navy dark:text-white hover:text-gold dark:hover:text-gold transition-all duration-300 group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold/10 to-sage/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:flex items-center space-x-3"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-navy dark:text-white hover:text-gold dark:hover:text-gold"
              asChild
            >
              <a href="tel:07XXXXXXXXX" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">Call Now</span>
              </a>
            </Button>
            <Button
              size="default"
              className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-navy font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 rounded-xl"
              asChild
            >
              <Link href="#contact" className="flex items-center gap-2">
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-navy dark:text-white hover:text-gold dark:hover:text-gold"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-navy/95 backdrop-blur-xl">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-bold text-navy dark:text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-lg font-medium text-navy dark:text-white hover:text-gold dark:hover:text-gold hover:bg-gold/10 rounded-lg transition-all duration-200 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      </Link>
                    </SheetClose>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-navy dark:text-white border-navy dark:border-white hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy"
                  asChild
                >
                  <a href="tel:07XXXXXXXXX" className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-semibold shadow-lg"
                  asChild
                >
                  <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                    Book Consultation
                  </Link>
                </Button>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Transform your performance
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Norfolk&apos;s Elite Performance Consultant
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </motion.header>
  )
}