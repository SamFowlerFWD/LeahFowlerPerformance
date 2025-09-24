'use client'

import ApplicationForm from '@/components/ApplicationForm'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 text-navy hover:text-gold transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="text-2xl font-bold text-navy">
              Leah Fowler Performance
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Adjusted spacing for fixed header */}
      <main className="pt-24 pb-20">
        <div className="container mx-auto">
          <ApplicationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">© 2024 Leah Fowler Performance. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}