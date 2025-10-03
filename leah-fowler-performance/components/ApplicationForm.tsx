'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Target,
  Trophy,
  CheckCircle,
  ArrowRight,
  Loader2,
  Calendar,
  Home,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ApplicationFormData {
  name: string
  email: string
  phone: string
  programme: string
  goals: string
  experience: string
  availability: string
  location: string
  message: string
  dataConsent: boolean
  marketingConsent: boolean
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    programme: 'online', // Set Online as default
    goals: '',
    experience: '',
    availability: '',
    location: '',
    message: '',
    dataConsent: false,
    marketingConsent: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const programmes = [
    { value: 'online', label: 'Online', description: 'Train anywhere with app-based coaching, weekly check-ins, and personalised programming' },
    { value: 'in-person', label: 'In Person', description: 'Face-to-face training sessions in Norfolk with personalised attention' },
    { value: 'hybrid', label: 'Hybrid', description: 'Combination of online and in-person training for maximum flexibility' }
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to fitness or returning after a break' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular training for 6-12 months' },
    { value: 'advanced', label: 'Advanced', description: 'Training consistently for over a year' },
    { value: 'athlete', label: 'Former/Current Athlete', description: 'Competition or sport background' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionError(null)

    // Validate required fields
    if (!formData.name || !formData.email || !formData.programme || !formData.goals || !formData.dataConsent) {
      setSubmissionError('Please fill in all required fields and accept the data consent.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      setSubmissionSuccess(true)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionError('Failed to submit your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submissionSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 text-center"
      >
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        </div>
        <h2 className="text-3xl font-bold text-navy mb-4">
          Application Submitted Successfully!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for applying to Leah Fowler Performance coaching. We'll review your application and get back to you within 24 hours.
        </p>
        <div className="space-y-4 text-left bg-gradient-to-br from-gold/10 to-sage/10 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gold mt-0.5" />
            <div>
              <p className="font-medium">Within 24 hours</p>
              <p className="text-sm text-gray-600">We'll review your application and goals</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gold mt-0.5" />
            <div>
              <p className="font-medium">Personalised response</p>
              <p className="text-sm text-gray-600">You'll receive a tailored programme recommendation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-gold mt-0.5" />
            <div>
              <p className="font-medium">Start your journey</p>
              <p className="text-sm text-gray-600">Begin training and transforming your performance</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => window.location.href = '/'}
          className="mt-8 bg-navy hover:bg-navy-dark text-white"
        >
          Return to Homepage
        </Button>
      </motion.div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-navy-dark shadow-xl border-0">
      <div className="text-center px-8 py-12 bg-white dark:bg-navy-dark border-b border-gray-100 dark:border-navy">
        <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white mb-4">
          Apply for Coaching
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Tell us about your goals and we'll recommend the perfect programme for you.
          This takes just 2-3 minutes.
        </p>
      </div>

      <CardContent className="bg-white dark:bg-navy-dark p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navy dark:text-white flex items-center gap-2">
              <User className="h-5 w-5" style={{ color: '#e7007d' }} />
              Your Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-navy dark:text-white font-medium">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  required
                  className="mt-2 bg-white dark:bg-navy border-2 border-gray-200 dark:border-navy-dark hover:border-[#e7007d] focus:border-[#e7007d] text-navy dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[44px]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-navy dark:text-white font-medium">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane@example.com"
                  required
                  className="mt-2 bg-white dark:bg-navy border-2 border-gray-200 dark:border-navy-dark hover:border-[#e7007d] focus:border-[#e7007d] text-navy dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-navy font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07123 456789"
                  className="mt-2 bg-white border-2 border-gray-200 hover:border-navy/50 focus:border-navy text-navy placeholder:text-gray-400 min-h-[44px]"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-navy font-medium">Your Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., London, Norfolk, etc."
                  className="mt-2 bg-white border-2 border-gray-200 hover:border-navy/50 focus:border-navy text-navy placeholder:text-gray-400 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Programme Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-navy dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: '#e7007d' }} />
              What type of training are you interested in? *
            </h3>

            <RadioGroup value={formData.programme} onValueChange={(value) => handleRadioChange('programme', value)} className="space-y-3">
              {programmes.map(programme => (
                <div key={programme.value} className="flex items-start space-x-4 p-6 border-2 rounded-xl hover:border-[#e7007d] transition-all duration-200 cursor-pointer bg-white dark:bg-navy border-gray-200 dark:border-navy-dark">
                  <RadioGroupItem value={programme.value} id={programme.value} className="mt-0.5 flex-shrink-0 min-w-[24px] min-h-[24px]" />
                  <Label htmlFor={programme.value} className="cursor-pointer flex-1">
                    <span className="font-bold block text-navy dark:text-white text-lg">{programme.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 mt-1 block">{programme.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Experience Level */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-navy flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              Your Fitness Experience
            </h3>

            <RadioGroup value={formData.experience} onValueChange={(value) => handleRadioChange('experience', value)} className="space-y-3">
              {experienceLevels.map(level => (
                <div key={level.value} className="flex items-start space-x-4 p-5 border-2 border-gray-200 rounded-xl hover:bg-sage/5 hover:border-sage/50 transition-all duration-200 cursor-pointer bg-white">
                  <RadioGroupItem value={level.value} id={`exp-${level.value}`} className="mt-0.5 flex-shrink-0 min-w-[24px] min-h-[24px]" />
                  <Label htmlFor={`exp-${level.value}`} className="cursor-pointer flex-1">
                    <span className="font-medium block text-navy">{level.label}</span>
                    <span className="text-sm text-gray-600 mt-1">{level.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-navy flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gold" />
              Your Goals & Availability
            </h3>

            <div>
              <Label htmlFor="goals" className="text-navy font-medium">What are your main fitness goals? *</Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="e.g., Build strength, improve energy, prepare for an event, lose weight..."
                required
                className="mt-2 min-h-[100px] bg-white border-2 border-gray-200 hover:border-navy/50 focus:border-navy text-navy placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="availability" className="text-navy font-medium">When can you train?</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Mornings, evenings, weekends..."
                className="mt-2 bg-white border-gray-300 text-navy placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-navy font-medium">Anything else we should know?</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about any injuries, preferences, or questions you have..."
                className="mt-2 min-h-[100px] bg-white border-2 border-gray-200 hover:border-navy/50 focus:border-navy text-navy placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-4 p-6 bg-gold/5 rounded-xl border-2 border-gold/20">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="dataConsent"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleCheckboxChange}
                className="mt-1 h-5 w-5 text-gold border-2 border-gray-200 rounded focus:ring-2 focus:ring-gold"
              />
              <Label htmlFor="dataConsent" className="text-sm text-navy">
                I consent to Leah Fowler Performance storing and processing my data to respond to my application
                and provide coaching services. *
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="marketingConsent"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleCheckboxChange}
                className="mt-1 h-5 w-5 text-gold border-2 border-gray-200 rounded focus:ring-2 focus:ring-gold"
              />
              <Label htmlFor="marketingConsent" className="text-sm text-navy">
                I'd like to receive training tips, programme updates, and exclusive offers via email.
              </Label>
            </div>
          </div>

          {/* Error Display */}
          {submissionError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {submissionError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.dataConsent}
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-12 py-6 min-h-[56px] text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}