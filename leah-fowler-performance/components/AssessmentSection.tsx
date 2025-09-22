"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react'
import AssessmentTool from '@/components/AssessmentTool'

export default function AssessmentSection() {
  return (
    <section id="assessment-tool" className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-[0.03]" />
        {/* Premium animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0]
}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-gold/20 to-amber-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0]
}}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-tl from-sage/20 to-emerald-300/10 rounded-full blur-3xl"
        />
        {/* Decorative dots pattern */}
        <div className="absolute top-1/4 right-20 grid grid-cols-3 gap-2 opacity-10">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-navy rounded-full" />
          ))}
        </div>
        <div className="absolute bottom-1/4 left-20 grid grid-cols-3 gap-2 opacity-10">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gold rounded-full" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold/10 to-amber-100/20 backdrop-blur-sm border border-gold/20 text-gold-dark text-sm font-semibold mb-8 shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            ELITE QUALIFICATION ASSESSMENT
            <Sparkles className="h-5 w-5" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-navy mb-10 leading-tight">
            Qualify for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
              Premium Consultancy
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            This comprehensive assessment determines if you&apos;re ready for £5,000+ quarterly 
            performance consultancy. Only high-performers with elite commitment qualify.
          </p>

          {/* Premium Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-gold/20 to-amber-100/30 group-hover:from-gold/30 group-hover:to-amber-100/40 transition-colors">
                <Target className="h-6 w-6 text-gold-dark" />
              </div>
              <div className="text-left">
                <span className="text-navy font-bold block">Elite Qualification</span>
                <span className="text-gray-500 text-sm">Three-phase evaluation</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-sage/20 to-emerald-100/30 group-hover:from-sage/30 group-hover:to-emerald-100/40 transition-colors">
                <TrendingUp className="h-6 w-6 text-sage-dark" />
              </div>
              <div className="text-left">
                <span className="text-navy font-bold block">Investment Analysis</span>
                <span className="text-gray-500 text-sm">£5,000+ qualification</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-navy/10 to-blue-100/20 group-hover:from-navy/20 group-hover:to-blue-100/30 transition-colors">
                <Sparkles className="h-6 w-6 text-navy" />
              </div>
              <div className="text-left">
                <span className="text-navy font-bold block">Performance Audit</span>
                <span className="text-gray-500 text-sm">Elite benchmarking</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Assessment Tool Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-amber-200/20 to-sage/20 rounded-3xl blur-2xl opacity-70" />
            
            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Premium header */}
              <div className="bg-gradient-to-r from-navy via-navy/95 to-navy text-white px-8 py-6">
                <h3 className="text-2xl font-bold text-center">Elite Consultancy Qualification</h3>
                <p className="text-center text-white/80 mt-2">Premium fitness consultancy for mothers & fitness enthusiasts</p>
              </div>
              
              {/* Tool content */}
              <div className="bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50 p-10 md:p-14">
                <AssessmentTool />
              </div>
              
              {/* Premium footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SSL Secured
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    100% Confidential
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    No Email Required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-navy mb-2">£5K+</div>
              <div className="text-gray-600">Quarterly Investment</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-gold mb-2">87%</div>
              <div className="text-gray-600">Client Success Rate</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-sage mb-2">Elite</div>
              <div className="text-gray-600">Performance Level</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}