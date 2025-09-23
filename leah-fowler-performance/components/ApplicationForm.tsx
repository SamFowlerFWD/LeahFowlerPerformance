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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    programme: 'online-package', // Set Online Package as default
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
    { value: 'online-package', label: '🌟 Online Package (£100/month) - BEST VALUE', description: 'Daily accountability, app tracking, weekly reviews - 3 month commitment' },
    { value: 'pathway', label: 'Pathway to Endurance (£48 one-off)', description: '16-week online foundation programme' },
    { value: 'smallgroup', label: 'Small Group Training (£120)', description: '12 sessions over 3 months, max 6 people' },
    { value: 'semiprivate', label: 'Semi-Private Coaching (£90/month per person)', description: '2:1 partner training sessions' },
    { value: 'silver', label: 'Silver Package (£140/month)', description: 'Weekly 1:1 personal training' },
    { value: 'gold', label: 'Gold Elite Package (£250/month)', description: 'Twice-weekly 1:1 elite training' },
    { value: 'unsure', label: 'I need advice on the best option', description: 'Let\'s discuss your needs' }
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
        <div className="space-y-4 text-left bg-gray-50 dark:bg-navy-dark/50 p-6 rounded-xl">
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
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl md:text-4xl font-bold text-navy">
          Apply for Coaching
        </CardTitle>
        <CardDescription className="text-lg mt-4 max-w-2xl mx-auto">
          Tell us about your goals and we'll recommend the perfect programme for you.
          This takes just 2-3 minutes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navy flex items-center gap-2">
              <User className="h-5 w-5 text-gold" />
              Your Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane@example.com"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07123 456789"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., London, Norfolk, etc."
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Programme Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-navy flex items-center gap-2">
              <Target className="h-5 w-5 text-gold" />
              Which Programme Interests You? *
            </h3>

            <RadioGroup value={formData.programme} onValueChange={(value) => handleRadioChange('programme', value)}>
              {programmes.map(programme => (
                <div key={programme.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-navy-dark/30 transition-colors">
                  <RadioGroupItem value={programme.value} id={programme.value} className="mt-1" />
                  <Label htmlFor={programme.value} className="cursor-pointer flex-1">
                    <span className="font-medium block">{programme.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{programme.description}</span>
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

            <RadioGroup value={formData.experience} onValueChange={(value) => handleRadioChange('experience', value)}>
              {experienceLevels.map(level => (
                <div key={level.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-navy-dark/30 transition-colors">
                  <RadioGroupItem value={level.value} id={`exp-${level.value}`} />
                  <Label htmlFor={`exp-${level.value}`} className="cursor-pointer flex-1">
                    <span className="font-medium block">{level.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{level.description}</span>
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
              <Label htmlFor="goals">What are your main fitness goals? *</Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="e.g., Build strength, improve energy, prepare for an event, lose weight..."
                required
                className="mt-2 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="availability">When can you train?</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Mornings, evenings, weekends..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Anything else we should know?</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about any injuries, preferences, or questions you have..."
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-4 p-6 bg-gray-50 dark:bg-navy-dark/30 rounded-xl">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="dataConsent"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleCheckboxChange}
                className="mt-1 h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold"
              />
              <Label htmlFor="dataConsent" className="text-sm">
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
                className="mt-1 h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold"
              />
              <Label htmlFor="marketingConsent" className="text-sm">
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
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold px-12 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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