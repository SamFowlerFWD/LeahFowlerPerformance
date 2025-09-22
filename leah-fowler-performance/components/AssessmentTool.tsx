'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Award,
  Target,
  Brain,
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  assessmentQuestions,
  getQuestionsByPhase,
  AssessmentQuestion
} from '@/lib/assessment-questions'
import {
  analyzeClientProfile,
  ClientProfile
} from '@/lib/assessment-scoring'

type Phase = 'intro' | 'discovery' | 'vision' | 'readiness' | 'investment' | 'results'

export default function AssessmentTool() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [disqualified, setDisqualified] = useState(false)
  const [assessmentStartTime, setAssessmentStartTime] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [contactPreference, setContactPreference] = useState<'email' | 'phone' | 'both'>('email')
  
  // Initialize start time on client side only
  useEffect(() => {
    setAssessmentStartTime(Date.now())
  }, [])
  
  // Get questions for current phase
  const currentPhaseQuestions = currentPhase === 'discovery' || currentPhase === 'vision' || currentPhase === 'readiness' || currentPhase === 'investment'
    ? getQuestionsByPhase(currentPhase)
    : []
  
  const currentQuestion = currentPhaseQuestions[currentQuestionIndex]
  
  // Calculate overall progress
  const totalQuestions = assessmentQuestions.length
  const answeredQuestions = Object.keys(answers).length
  const overallProgress = (answeredQuestions / totalQuestions) * 100
  
  // Calculate phase progress
  const phaseProgress = currentPhaseQuestions.length > 0 
    ? ((currentQuestionIndex + 1) / currentPhaseQuestions.length) * 100
    : 0

  const handleAnswer = (value: unknown) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }
  
  const handleMultiChoiceToggle = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || []
    if (current.includes(value)) {
      handleAnswer(current.filter((v: string) => v !== value))
    } else {
      handleAnswer([...current, value])
    }
  }
  
  const canProceed = () => {
    if (!currentQuestion) return false
    const answer = answers[currentQuestion.id]
    
    if (currentQuestion.required && !answer) return false
    if (currentQuestion.type === 'multi-choice' && Array.isArray(answer) && answer.length === 0) return false
    if (currentQuestion.type === 'text-input' && (!answer || (answer as string).trim() === '')) return false
    
    return true
  }
  
  const handleNext = () => {
    if (!canProceed()) return
    
    if (currentQuestionIndex < currentPhaseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Move to next phase
      if (currentPhase === 'discovery') {
        setCurrentPhase('vision')
        setCurrentQuestionIndex(0)
      } else if (currentPhase === 'vision') {
        setCurrentPhase('readiness')
        setCurrentQuestionIndex(0)
      } else if (currentPhase === 'readiness') {
        setCurrentPhase('investment')
        setCurrentQuestionIndex(0)
      } else if (currentPhase === 'investment') {
        // Show results after all questions are answered
        analyzeAndShowResults()
      }
    }
  }
  
  const checkQualification = (question: AssessmentQuestion, answer: unknown): boolean => {
    if (!question.qualifying || !question.options) return true
    
    if (question.type === 'single-choice') {
      const selectedOption = question.options.find(opt => opt.value === answer)
      return selectedOption?.qualifies ?? false
    }
    
    if (question.type === 'multi-choice' && Array.isArray(answer)) {
      const selectedOptions = question.options.filter(opt => answer.includes(opt.value))
      const hasDisqualifying = selectedOptions.some(opt => !opt.qualifies)
      return !hasDisqualifying && selectedOptions.length > 0
    }
    
    return true
  }
  
  const analyzeAndShowResults = () => {
    const profile = analyzeClientProfile(assessmentQuestions, answers)
    setClientProfile(profile)
    setCurrentPhase('results')
  }
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      // Move to previous phase
      if (currentPhase === 'investment') {
        setCurrentPhase('readiness')
        const readinessQuestions = getQuestionsByPhase('readiness')
        setCurrentQuestionIndex(readinessQuestions.length - 1)
      } else if (currentPhase === 'readiness') {
        setCurrentPhase('vision')
        const visionQuestions = getQuestionsByPhase('vision')
        setCurrentQuestionIndex(visionQuestions.length - 1)
      } else if (currentPhase === 'vision') {
        setCurrentPhase('discovery')
        const discoveryQuestions = getQuestionsByPhase('discovery')
        setCurrentQuestionIndex(discoveryQuestions.length - 1)
      } else if (currentPhase === 'discovery') {
        setCurrentPhase('intro')
      }
    }
  }
  
  const handleStartAssessment = () => {
    setCurrentPhase('discovery')
    setCurrentQuestionIndex(0)
  }
  
  const handleStartOver = () => {
    setCurrentPhase('intro')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setClientProfile(null)
    setDisqualified(false)
    setEmail('')
    setName('')
    setPhone('')
    setDataConsent(false)
    setMarketingConsent(false)
    setContactPreference('email')
    setSubmissionError(null)
    setSubmissionSuccess(false)
  }
  
  const handleSubmitAssessment = async () => {
    if (!name || !email || !dataConsent) {
      setSubmissionError('Please fill in all required fields and accept the privacy policy')
      return
    }
    
    if (!clientProfile) {
      setSubmissionError('Assessment profile not found. Please try again.')
      return
    }
    
    setIsSubmitting(true)
    setSubmissionError(null)
    
    try {
      // Calculate completion time
      const completionTimeSeconds = assessmentStartTime > 0 
        ? Math.floor((Date.now() - assessmentStartTime) / 1000)
        : 0
      
      // Get analytics data from URL parameters if available
      const urlParams = new URLSearchParams(window.location.search)
      const analytics = {
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
        referrer: document.referrer || undefined
      }
      
      // Prepare submission data
      const submissionData = {
        name,
        email,
        phone: phone || undefined,
        answers,
        profile: clientProfile,
        consent: {
          dataProcessing: dataConsent,
          marketing: marketingConsent,
          contactPreference
        },
        completionTimeSeconds,
        analytics
      }
      
      // Submit to API
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit assessment')
      }
      
      // Success!
      setSubmissionSuccess(true)
      
      // Track conversion if analytics is set up
      if (typeof window !== 'undefined' && (window as unknown).gtag) {
        (window as unknown).gtag('event', 'assessment_complete', {
          qualified: clientProfile.qualified,
          tier: clientProfile.tier,
          investment_level: clientProfile.investmentLevel
        })
      }
      
    } catch (error) {
      console.error('Assessment submission error:', error)
      setSubmissionError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting your assessment. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getPhaseIcon = (phase: Phase) => {
    switch(phase) {
      case 'discovery': return Heart
      case 'vision': return Target
      case 'readiness': return Zap
      case 'investment': return TrendingUp
      default: return Brain
    }
  }
  
  const getPhaseTitle = (phase: Phase) => {
    switch(phase) {
      case 'discovery': return 'Discovery'
      case 'vision': return 'Your Vision'
      case 'readiness': return 'Readiness Check'
      case 'investment': return 'Investment'
      default: return 'Assessment'
    }
  }
  
  // Intro Screen
  if (currentPhase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
      >
        <Card className="shadow-xl md:shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="text-center p-6 sm:p-8 md:p-12 bg-gradient-to-br from-navy/5 to-transparent">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl sm:text-3xl text-navy mb-4">Performance Optimisation Assessment</CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              As a mother of three, I discovered that true performance isn&apos;t measured in the gym&mdash;it's measured in how brilliantly 
              you perform when life demands everything. Let's discover your performance potential together.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 p-6 md:p-10">
            <div className="grid md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center p-4"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Discovery</h3>
                <p className="text-sm text-muted-foreground">Understanding You</p>
                <p className="text-xs text-muted-foreground mt-1">4 questions</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center p-4"
              >
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Vision</h3>
                <p className="text-sm text-muted-foreground">Your Goals</p>
                <p className="text-xs text-muted-foreground mt-1">4 questions</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Readiness</h3>
                <p className="text-sm text-muted-foreground">Your Resources</p>
                <p className="text-xs text-muted-foreground mt-1">5 questions</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center p-4"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Investment</h3>
                <p className="text-sm text-muted-foreground">Your Path</p>
                <p className="text-xs text-muted-foreground mt-1">5 questions</p>
              </motion.div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">My Promise to You</p>
                  <p className="text-blue-800">
                    When I became a mother, I thought feeling exhausted was just part of life. I was wrong. Through evidence-based 
                    performance optimisation, I discovered we can have it all&mdash;energy, strength, and the capability to excel in every 
                    role we play. This assessment identifies exactly where you are and creates your roadmap to peak performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Assess your real-world performance capacity (not just fitness)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Identify energy leaks and optimisation opportunities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Get your VO2 Max and functional movement recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Receive a data-driven performance blueprint</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 border-t p-6 md:p-8">
            <Button
              onClick={handleStartAssessment}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold h-14 text-lg shadow-lg transform transition-all hover:scale-105"
            >
              Begin Your Performance Assessment
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  // Results Screen
  if (currentPhase === 'results' && clientProfile) {
    const PhaseIcon = getPhaseIcon('readiness')
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4 py-8"
      >
        <Card className="shadow-xl md:shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="text-center p-8 md:p-12 bg-gradient-to-br from-navy/5 to-transparent">
            <CardTitle className="text-3xl text-navy mb-4">Assessment Complete</CardTitle>
            
            {clientProfile.qualified ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 mx-auto"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-4 mx-auto"
              >
                <AlertCircle className="w-16 h-16 text-white" />
              </motion.div>
            )}
            
            <Badge 
              variant={clientProfile.qualified ? "default" : "secondary"}
              className={cn(
                "text-lg px-4 py-2",
                clientProfile.qualified 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-amber-100 text-amber-800 border-amber-200"
              )}
            >
              {clientProfile.qualified ? 'Qualified for Consultancy' : 'Building Foundation'}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6 md:p-10">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-navy">Your Performance Profile</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Performance Level</p>
                  <p className="font-semibold text-navy">{clientProfile.performanceLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Client Tier</p>
                  <p className="font-semibold text-navy capitalize">{clientProfile.tier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Investment Capacity</p>
                  <p className="font-semibold text-navy capitalize">{clientProfile.investmentLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Readiness Score</p>
                  <p className="font-semibold text-navy">{clientProfile.readinessScore.toFixed(0)}%</p>
                </div>
              </div>
            </div>
            
            {clientProfile.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Identified Strengths
                </h3>
                <ul className="space-y-2">
                  {clientProfile.strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center text-navy"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {strength}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {clientProfile.opportunities && clientProfile.opportunities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-purple-50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Growth Opportunities
                </h3>
                <ul className="space-y-2">
                  {clientProfile.opportunities.map((opportunity, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center text-navy"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-purple-600" />
                      {opportunity}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {clientProfile.qualified && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-navy to-navy/90 text-white rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4">Recommended Programme</h3>
                <p className="text-2xl font-bold text-gold mb-2">{clientProfile.recommendedProgramme}</p>
                <p className="text-white/90 mb-4">{clientProfile.estimatedInvestment}</p>
                <p className="text-white/80">
                  Based on your assessment, this programme will deliver the performance optimisation 
                  you need to achieve your fitness and personal objectives.
                </p>
              </motion.div>
            )}
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-navy">Next Steps</h3>
              {clientProfile.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-sm font-semibold text-gold-dark">
                    {index + 1}
                  </span>
                  <span className="text-navy pt-1">{step}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col border-t p-6 md:p-8 bg-gray-50">
            <div className="w-full space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {clientProfile.qualified ? 'Claim Your Strategy Session' : 'Stay Connected'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {clientProfile.qualified 
                    ? 'Enter your details to schedule your complimentary strategy consultation and receive your detailed performance report.'
                    : 'Enter your details to receive performance resources and updates on future programme availability.'}
                </p>
              </div>
              
              {submissionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-900 mb-1">Submission Error</p>
                      <p className="text-red-800">{submissionError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {submissionSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">Success!</p>
                      <p className="text-green-800">
                        {clientProfile.qualified 
                          ? 'Your assessment has been submitted. We will contact you within 24 hours to schedule your strategy session.'
                          : 'Thank you for your submission. We will send you valuable performance resources to help you on your journey.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!submissionSuccess && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="results-name">Your Name *</Label>
                      <Input
                        id="results-name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="results-email">Your Email *</Label>
                      <Input
                        id="results-email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="results-phone">Phone Number (Optional)</Label>
                    <Input
                      id="results-phone"
                      type="tel"
                      placeholder="+44 7XXX XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 mt-1"
                    />
                  </div>
                  
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-navy">Privacy & Consent</h4>
                    
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="data-consent"
                        checked={dataConsent}
                        onChange={(e) => setDataConsent(e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <Label htmlFor="data-consent" className="text-sm text-gray-700 cursor-pointer">
                        I consent to the processing of my personal data for the purpose of performance assessment and consultancy qualification. I understand my data will be stored securely and in accordance with GDPR regulations. *
                      </Label>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="marketing-consent"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="marketing-consent" className="text-sm text-gray-700 cursor-pointer">
                        I would like to receive performance insights, programme updates, and exclusive resources from Leah Fowler Performance.
                      </Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-preference" className="text-sm font-medium">Preferred Contact Method</Label>
                      <select
                        id="contact-preference"
                        value={contactPreference}
                        onChange={(e) => setContactPreference(e.target.value as 'email' | 'phone' | 'both')}
                        className="mt-1 w-full h-10 px-3 border rounded-md"
                      >
                        <option value="email">Email Only</option>
                        <option value="phone">Phone Only</option>
                        <option value="both">Email & Phone</option>
                      </select>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      You can request access to, rectification, or deletion of your data at any time by contacting us at privacy@leahfowlerperformance.com
                    </p>
                  </div>
                </>
              )}
              
              {!submissionSuccess && (
                <div className="flex gap-4">
                  <Button
                    className={cn(
                      "flex-1 h-12 font-semibold",
                      clientProfile.qualified 
                        ? "bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-navy"
                        : "bg-navy hover:bg-navy/90 text-white"
                    )}
                    size="lg"
                    onClick={handleSubmitAssessment}
                    disabled={isSubmitting || !name || !email || !dataConsent}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      clientProfile.qualified ? 'Schedule Strategy Session' : 'Get Performance Resources'
                    )}
                  </Button>
                  <Button
                    onClick={handleStartOver}
                    variant="outline"
                    size="lg"
                    className="font-semibold h-12"
                  >
                    Start Over
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  // Question Screen
  if (currentQuestion) {
    const PhaseIcon = getPhaseIcon(currentPhase)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
      >
        <Card className="shadow-xl md:shadow-2xl border-0 overflow-hidden bg-white">
          <CardHeader className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-navy/5 to-transparent">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Badge variant="outline" className="text-sm w-fit font-semibold border-gold/50 bg-gold/5">
                  {getPhaseTitle(currentPhase)}
                </Badge>
                <span className="text-sm font-medium text-navy">
                  Question {currentQuestionIndex + 1} of {currentPhaseQuestions.length}
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={phaseProgress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-gold [&>div]:to-amber-500" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Overall Progress: {answeredQuestions} of {totalQuestions} questions</span>
                  <span className="font-semibold text-gold">{Math.round(overallProgress)}% Complete</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <PhaseIcon className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy mb-1">
                        {currentQuestion.question}
                      </h3>
                      {currentQuestion.subtext && (
                        <p className="text-sm text-muted-foreground">
                          {currentQuestion.subtext}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Single Choice Options */}
                {currentQuestion.type === 'single-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                          answers[currentQuestion.id] === option.value
                            ? "bg-gold/10 border-gold shadow-md"
                            : "bg-white border-gray-200 hover:border-gold/50 hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "font-medium",
                            answers[currentQuestion.id] === option.value ? "text-navy" : "text-gray-700"
                          )}>
                            {option.label}
                          </span>
                          {answers[currentQuestion.id] === option.value && (
                            <CheckCircle className="w-5 h-5 text-gold" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Multi Choice Options */}
                {currentQuestion.type === 'multi-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                    {currentQuestion.options.map(option => {
                      const isSelected = ((answers[currentQuestion.id] as string[]) || []).includes(option.value)
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultiChoiceToggle(option.value)}
                          className={cn(
                            "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                            isSelected
                              ? "bg-gold/10 border-gold shadow-md"
                              : "bg-white border-gray-200 hover:border-gold/50 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-medium",
                              isSelected ? "text-navy" : "text-gray-700"
                            )}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-gold" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
                
                {/* Number Input */}
                {currentQuestion.type === 'number-input' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={currentQuestion.minValue}
                        max={currentQuestion.maxValue}
                        step="0.1"
                        value={(answers[currentQuestion.id] as number) || ''}
                        onChange={(e) => handleAnswer(parseFloat(e.target.value))}
                        className="flex-1 h-12"
                        placeholder="Enter value"
                      />
                      {currentQuestion.unit && (
                        <span className="text-muted-foreground font-medium">
                          {currentQuestion.unit}
                        </span>
                      )}
                    </div>
                    {currentQuestion.minValue !== undefined && currentQuestion.maxValue !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        Range: {currentQuestion.minValue} - {currentQuestion.maxValue}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Text Input */}
                {currentQuestion.type === 'text-input' && (
                  <div className="space-y-3">
                    <Textarea
                      value={(answers[currentQuestion.id] as string) || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="min-h-[120px]"
                      placeholder="Please provide a detailed response..."
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-gray-50 p-4 sm:p-6">
            <Button
              onClick={handleBack}
              disabled={currentPhase === 'discovery' && currentQuestionIndex === 0}
              variant="outline"
              size="lg"
              className="font-semibold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-navy font-semibold"
            >
              {currentQuestionIndex === currentPhaseQuestions.length - 1 && currentPhase === 'investment' 
                ? 'Complete Assessment' 
                : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }
  
  return null
}