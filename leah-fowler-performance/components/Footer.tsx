"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook
} from 'lucide-react'

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-navy via-navy-dark to-[#0f1724] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/af-full-logo.avif"
                alt="Aphrodite Fitness with Leah Fowler"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </Link>

            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Strength and conditioning coaching for busy parents and professionals in Norfolk.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#e7007d] font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#e7007d]" />
                <a href="tel:+447990600958" className="text-white/70 hover:text-[#e7007d] transition-colors text-sm">
                  07990 600958
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#e7007d]" />
                <a href="mailto:leah@aphroditefitness.co.uk" className="text-white/70 hover:text-[#e7007d] transition-colors text-sm">
                  leah@aphroditefitness.co.uk
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#e7007d] mt-1" />
                <span className="text-white/70 text-sm">
                  Dereham, Norfolk, UK
                </span>
              </div>
            </div>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-[#e7007d] font-bold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#e7007d] flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </a>
              ))}
            </div>

            <div className="space-y-2">
              <Link href="/privacy" className="block text-white/60 hover:text-[#e7007d] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-white/60 hover:text-[#e7007d] transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Aphrodite Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}