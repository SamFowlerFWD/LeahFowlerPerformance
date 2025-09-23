/**
 * Premium Spacing Showcase Component
 * Demonstrates the luxury spacing system in action
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Award, TrendingUp, Users, Brain } from 'lucide-react'

export const SpacingShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Premium Spacing */}
      <section className="hero-padding-y section-padding-x bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container-premium">
          {/* Authority Badge with breathing room */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-space-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-premium rounded-premium border border-gray-200">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gray-700">
                UK&apos;s Premier Performance Consultancy
              </span>
            </div>
          </motion.div>

          {/* Headline with luxury spacing */}
          <div className="text-center mb-space-12 lg:mb-space-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-space-6 lg:mb-space-8 leading-tight">
              Transform Your Performance
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-premium">
              Evidence-based fitness optimisation for busy mothers
            </p>
          </div>

          {/* CTA with premium presence */}
          <div className="flex justify-center">
            <button className="btn-spacing-luxury bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-premium font-semibold text-lg hover:shadow-premium-hover transition-all duration-300 flex items-center gap-3">
              Start Your Assessment
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Programme Cards with Gallery Spacing */}
      <section className="section-padding-y section-padding-x">
        <div className="container-premium">
          <div className="text-center mb-space-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-space-4">
              Consultancy Programmes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored performance solutions for your specific goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-gap-luxury">
            {/* Premium Card 1 */}
            <article className="card-padding-luxury bg-white rounded-premium-lg shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-space-6">
                <div className="p-3 bg-emerald-100 rounded-premium">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Mother Fitness Excellence</h3>
                  <p className="text-gray-600">£997/month</p>
                </div>
              </div>

              <ul className="space-y-3 mb-space-8">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Weekly 1:1 consultations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Performance analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">24/7 priority support</span>
                </li>
              </ul>

              <button className="btn-spacing-medium w-full bg-gray-900 text-white rounded-premium font-medium hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </article>

            {/* Premium Card 2 - Featured */}
            <article className="card-padding-luxury bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-premium-lg shadow-premium border-2 border-emerald-200 transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-emerald-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center gap-4 mb-space-6 mt-4">
                <div className="p-3 bg-white rounded-premium">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Performance Pro</h3>
                  <p className="text-gray-600">£1,997/month</p>
                </div>
              </div>

              <ul className="space-y-3 mb-space-8">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Twice-weekly consultations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Comprehensive assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Team performance workshops</span>
                </li>
              </ul>

              <button className="btn-spacing-large w-full bg-emerald-600 text-white rounded-premium font-medium hover:bg-emerald-700 transition-colors">
                Start Free Assessment
              </button>
            </article>

            {/* Premium Card 3 */}
            <article className="card-padding-luxury bg-white rounded-premium-lg shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-space-6">
                <div className="p-3 bg-blue-100 rounded-premium">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Team Transformation</h3>
                  <p className="text-gray-600">£4,997/month</p>
                </div>
              </div>

              <ul className="space-y-3 mb-space-8">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Full team optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Monthly strategy sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span className="text-gray-700">Custom training programmes</span>
                </li>
              </ul>

              <button className="btn-spacing-medium w-full bg-gray-900 text-white rounded-premium font-medium hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonial with Gallery Spacing */}
      <section className="section-padding-y section-padding-x bg-gradient-to-b from-gray-50 to-white">
        <div className="container-premium">
          <div className="testimonial-spacing-luxury bg-white rounded-premium-xl shadow-premium max-w-4xl mx-auto">
            <blockquote className="text-center">
              <div className="mb-space-8">
                <svg className="w-12 h-12 text-emerald-600 mx-auto opacity-20" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              <p className="text-2xl md:text-3xl leading-relaxed text-gray-800 mb-space-8">
                The transformation in our mothers&apos; progress has been remarkable.
                Leah&apos;s evidence-based approach delivered measurable results within weeks.
              </p>

              <footer className="flex items-center justify-center gap-space-4">
                <img
                  src="/api/placeholder/64/64"
                  alt="Mother Portrait"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <cite className="block text-lg font-semibold text-gray-900 not-italic">
                    James Harrison
                  </cite>
                  <p className="text-gray-600">Mother of 3</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Form with Premium Spacing */}
      <section className="section-padding-y section-padding-x">
        <div className="container-premium max-w-2xl">
          <div className="text-center mb-space-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-space-4">
              Start Your Assessment
            </h2>
            <p className="text-xl text-gray-600">
              Take the first step towards peak performance
            </p>
          </div>

          <form className="card-padding-luxury bg-white rounded-premium-lg shadow-premium">
            <div className="space-y-6">
              <div className="form-field-spacing-large">
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-4 border border-gray-300 rounded-premium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  placeholder="John Smith"
                />
              </div>

              <div className="form-field-spacing-large">
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-4 border border-gray-300 rounded-premium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  placeholder="john@company.com"
                />
              </div>

              <div className="form-field-spacing-large">
                <label className="block text-gray-700 font-medium mb-2">
                  Current Challenge
                </label>
                <textarea
                  className="w-full px-5 py-4 border border-gray-300 rounded-premium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  rows={4}
                  placeholder="Describe your primary performance challenge..."
                />
              </div>
            </div>

            <div className="mt-space-10">
              <button
                type="submit"
                className="btn-spacing-luxury w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-premium font-semibold text-lg hover:shadow-premium-hover transition-all duration-300 flex items-center justify-center gap-3"
              >
                Begin Assessment
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Spacing Scale Demonstration */}
      <section className="section-padding-y section-padding-x bg-gray-50">
        <div className="container-premium">
          <h2 className="text-3xl font-bold text-gray-900 mb-space-8 text-center">
            Spacing Scale Visualization
          </h2>

          <div className="grid gap-4 max-w-4xl mx-auto">
            {[
              { name: 'space-1', value: '8px', class: 'p-1' },
              { name: 'space-2', value: '16px', class: 'p-2' },
              { name: 'space-3', value: '24px', class: 'p-3' },
              { name: 'space-4', value: '32px', class: 'p-4' },
              { name: 'space-6', value: '48px', class: 'p-6' },
              { name: 'space-8', value: '64px', class: 'p-8' },
              { name: 'space-10', value: '80px', class: 'p-10' },
              { name: 'space-12', value: '96px', class: 'p-12' },
              { name: 'space-16', value: '128px', class: 'p-16' },
            ].map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className="w-24 text-sm font-mono text-gray-600">
                  {space.name}
                </div>
                <div className="w-20 text-sm text-gray-500">
                  {space.value}
                </div>
                <div className="flex-1">
                  <div className={`${space.class} bg-emerald-100 border border-emerald-300 rounded`}>
                    <div className="bg-emerald-600 h-2 rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SpacingShowcase