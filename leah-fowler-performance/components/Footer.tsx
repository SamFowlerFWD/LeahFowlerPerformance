"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Heart,
  Award,
  Star,
  Shield,
  CheckCircle,
  BadgeCheck,
  BookOpen,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  programmes: [
    { label: 'Pathway to Endurance - £48', href: '#programmes', badge: '16 Weeks' },
    { label: 'Small Group Training - £120', href: '#programmes', badge: '12 Sessions' },
    { label: 'Semi-Private - £90/month pp', href: '#programmes', badge: 'Partners' },
    { label: 'Silver Package - £140/month', href: '#programmes', badge: 'Popular' },
    { label: 'Gold Elite - £250/month', href: '#programmes', badge: 'Premium' },
    { label: 'Apply for Coaching', href: '/apply', badge: 'Start Here' },
  ],
  services: [
    { label: 'Strength & Conditioning', href: '#programmes' },
    { label: 'Nutrition Coaching', href: '#programmes' },
    { label: 'Sleep Optimisation', href: '/blog' },
    { label: 'Lifestyle Coaching', href: '#programmes' },
    { label: 'Online Training', href: '#programmes' },
  ],
  resources: [
    { label: 'Performance Blog', href: '/blog' },
    { label: 'Sleep & Recovery', href: '/blog' },
    { label: 'Strength Training Guides', href: '/blog' },
    { label: 'Nutrition Resources', href: '/blog' },
    { label: 'Exercise Library', href: '/blog' },
  ],
  company: [
    { label: 'About Leah', href: '#about' },
    { label: 'Success Stories', href: '#testimonials' },
    { label: 'Our Approach', href: '#about' },
    { label: 'Location: Dereham', href: '#contact' },
    { label: 'Contact Us', href: '#contact' },
  ]
}

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-700' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-600' },
]

const certifications = [
  { icon: Award, text: 'Certified Personal Trainer' },
  { icon: BookOpen, text: 'Strength & Conditioning Specialist' },
  { icon: Shield, text: 'Nutrition Coach Certified' },
  { icon: BadgeCheck, text: 'Mother of 3' },
]

export default function Footer() {
  const [email, setEmail] = React.useState('')
  const [isSubscribed, setIsSubscribed] = React.useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribed(true)
    setTimeout(() => {
      setIsSubscribed(false)
      setEmail('')
    }, 3000)
  }

  return (
    <footer className="relative">
      {/* Premium Newsletter Section */}
      <div className="bg-white py-12 sm:py-16 md:py-20 -mb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-amber-200/20 to-sage/20 rounded-3xl blur-2xl opacity-50" />
            
            <div className="relative bg-gradient-to-r from-gold via-amber-500 to-gold-dark rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-4">
                      <Zap className="h-4 w-4" />
                      EXCLUSIVE INSIGHTS
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Join 500+ Warrior Mothers
                    </h3>
                    <p className="text-white/90 text-lg">
                      Weekly insights on reclaiming your identity, finding strength, and thriving as a mother.
                      Plus, get our exclusive Identity Reclamation Guide free when you subscribe.
                    </p>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-white/80" />
                        <span className="text-white/80 text-sm">No spam, ever</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-white/80" />
                        <span className="text-white/80 text-sm">Unsubscribe anytime</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your best email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 h-14 bg-white/95 border-0 text-navy placeholder:text-gray-500 text-base shadow-lg"
                      />
                      <Button 
                        type="submit" 
                        size="lg"
                        className="h-14 px-8 bg-navy hover:bg-navy-dark text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                        disabled={isSubscribed}
                      >
                        {isSubscribed ? (
                          <>
                            <Heart className="h-5 w-5 mr-2" />
                            Welcome!
                          </>
                        ) : (
                          <>
                            Get Free Guide
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 justify-center">
                      <div className="flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30" />
                        ))}
                      </div>
                      <span className="text-white/90 text-sm">Join 5,217 subscribers</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-br from-navy via-navy-dark to-[#0f1724] pt-32 sm:pt-36 md:pt-40 lg:pt-48 pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-gold to-amber-600 text-white font-bold text-2xl w-14 h-14 flex items-center justify-center rounded-xl shadow-lg">
                    LF
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      Leah Fowler
                    </div>
                    <div className="text-sm text-gold font-semibold tracking-widest uppercase">
                      Performance
                    </div>
                  </div>
                </div>
              </Link>
              
              <p className="text-white/70 mb-6 leading-relaxed">
                Elite performance consulting for ambitious leaders. Transform your potential into 
                extraordinary results with evidence-based strategies and personalised coaching.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/10 hover:bg-gold flex items-center justify-center transition-all duration-300 group ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-white group-hover:text-navy transition-colors" />
                  </a>
                ))}
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <a href="tel:+447XXXXXXXXX" className="text-white/70 hover:text-gold transition-colors">
                    +44 7XXX XXXXXX
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold" />
                  <a href="mailto:leah@leahfowlerperformance.com" className="text-white/70 hover:text-gold transition-colors text-sm">
                    leah@leahfowlerperformance.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold mt-1" />
                  <span className="text-white/70 text-sm">
                    Dereham, Norfolk, UK<br />
                    <span className="text-white/50">Sessions available globally</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Programmes Column */}
            <div>
              <h4 className="text-gold font-bold mb-6 text-sm uppercase tracking-wider">Programmes</h4>
              <ul className="space-y-3">
                {footerLinks.programmes.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-gold transition-colors duration-200 text-sm flex items-center justify-between group"
                    >
                      <span className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-semibold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="text-gold font-bold mb-6 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-gold transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-gold font-bold mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-gold transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-gold font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-gold transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="border-t border-white/10 pt-16 mb-16">
            <div className="text-center mb-8">
              <h4 className="text-gold font-bold text-sm uppercase tracking-wider mb-6">
                Certifications & Memberships
              </h4>
              <div className="flex flex-wrap justify-center gap-6">
                {certifications.map((cert) => (
                  <div key={cert.text} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <cert.icon className="h-5 w-5 text-gold" />
                    <span className="text-white/70 text-sm">{cert.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-12">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <p className="text-white/60 text-sm">
                  © {new Date().getFullYear()} Leah Fowler Performance. All rights reserved.
                </p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="text-white/60 text-sm">Norfolk-based fitness coach</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/privacy" className="text-white/60 hover:text-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/60 hover:text-gold transition-colors text-sm">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-white/60 hover:text-gold transition-colors text-sm">
                  Cookie Policy
                </Link>
                <Link href="/sitemap" className="text-white/60 hover:text-gold transition-colors text-sm">
                  Sitemap
                </Link>
              </div>
            </div>
            
            {/* Final Trust Statement */}
            <div className="mt-8 text-center">
              <p className="text-white/40 text-xs">
                Transforming high-achievers into peak performers since 2009 | 
                Norfolk&apos;s premier performance consultancy | 
                Serving clients globally
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}