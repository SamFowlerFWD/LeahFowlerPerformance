'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { aphroditeFitnessPackages } from '@/content/seo/aphrodite-pricing-content'

// Quiz questions to determine the best package
const quizQuestions = [
  {
    id: 'goal',
    question: "What's your main fitness goal?",
    icon: Target,
    options: [
      { value: 'foundation', label: 'Build basic strength & confidence', points: { pathway: 2, smallGroup: 1, flexi: 1 } },
      { value: 'transformation', label: 'Complete body transformation', points: { silver: 2, gold: 1, semiPrivate: 1 } },
      { value: 'performance', label: 'Train for events or races', points: { gold: 2, silver: 1 } },
      { value: 'maintain', label: 'Stay fit around family life', points: { flexi: 2, smallGroup: 1 } }
    ]
  },
  {
    id: 'schedule',
    question: "How does training fit your schedule?",
    icon: Calendar,
    options: [
      { value: 'flexible', label: 'I need total flexibility', points: { flexi: 3, pathway: 1 } },
      { value: 'mornings', label: 'School hours work best', points: { smallGroup: 2, silver: 1 } },
      { value: 'regular', label: 'I can commit to weekly sessions', points: { silver: 2, gold: 1, semiPrivate: 1 } },
      { value: 'intensive', label: 'I want 2+ sessions per week', points: { gold: 3 } }
    ]
  },
  {
    id: 'preference',
    question: "How do you prefer to train?",
    icon: Users,
    options: [
      { value: 'solo', label: '1:1 personal attention', points: { silver: 2, gold: 2 } },
      { value: 'partner', label: 'With a friend or partner', points: { semiPrivate: 3 } },
      { value: 'group', label: 'In a small supportive group', points: { smallGroup: 3 } },
      { value: 'remote', label: 'On my own with guidance', points: { flexi: 2, pathway: 2 } }
    ]
  },
  {
    id: 'experience',
    question: "What's your fitness experience?",
    icon: TrendingUp,
    options: [
      { value: 'beginner', label: "Complete beginner", points: { pathway: 2, smallGroup: 2 } },
      { value: 'returning', label: "Returning after a break", points: { silver: 1, flexi: 2, smallGroup: 1 } },
      { value: 'active', label: "Currently active", points: { silver: 2, gold: 1, semiPrivate: 1 } },
      { value: 'experienced', label: "Very experienced", points: { gold: 2, flexi: 1 } }
    ]
  },
  {
    id: 'budget',
    question: "What's your training budget?",
    icon: Clock,
    options: [
      { value: 'entry', label: "£12-80/month", points: { pathway: 3, flexi: 2 } },
      { value: 'standard', label: "£90-140/month", points: { semiPrivate: 2, silver: 2, smallGroup: 1 } },
      { value: 'premium', label: "£250+/month", points: { gold: 3 } },
      { value: 'flexible', label: "Value is more important than price", points: { silver: 1, gold: 1, semiPrivate: 1 } }
    ]
  }
]

const PackageSelectorQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [scores, setScores] = useState<Record<string, number>>({
    smallGroup: 0,
    flexi: 0,
    semiPrivate: 0,
    silver: 0,
    gold: 0,
    pathway: 0
  })
  const [showResults, setShowResults] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  const handleAnswer = (questionId: string, value: string, points: unknown) => {
    setAnswers({ ...answers, [questionId]: value })

    // Update scores
    const newScores = { ...scores }
    Object.keys(points).forEach(key => {
      if (key in newScores) {
        newScores[key] += points[key]
      }
    })
    setScores(newScores)

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setShowResults(true), 500)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setScores({
      smallGroup: 0,
      flexi: 0,
      semiPrivate: 0,
      silver: 0,
      gold: 0,
      pathway: 0
    })
    setShowResults(false)
    setIsQuizStarted(false)
  }

  // Get recommended package based on scores
  const getRecommendedPackage = () => {
    const sortedPackages = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key)

    return sortedPackages[0]
  }

  // Get top 3 packages
  const getTopPackages = () => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => key)
  }

  const recommendedPackageKey = getRecommendedPackage()
  const topPackages = getTopPackages()

  if (!isQuizStarted) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Training Package
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Answer 5 quick questions to discover which training programme fits your life, goals, and budget
            </p>
            <button
              onClick={() => setIsQuizStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  if (showResults) {
    const recommendedPackage = aphroditeFitnessPackages[recommendedPackageKey as keyof typeof aphroditeFitnessPackages]

    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Perfect Match
              </h2>
              <p className="text-gray-600">
                Based on your answers, we recommend:
              </p>
            </div>

            {/* Recommended Package */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {recommendedPackage.name}
                </h3>
                <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                  BEST MATCH
                </span>
              </div>
              <p className="text-gray-700 mb-4">{recommendedPackage.tagline}</p>
              <p className="text-gray-600 mb-6">{recommendedPackage.shortDescription}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {recommendedPackage.currency}{recommendedPackage.price}
                </span>
                <span className="text-gray-600">{recommendedPackage.period}</span>
              </div>
              <div className="flex gap-4">
                <Link
                  href={`#${recommendedPackage.id}`}
                  className="flex-1 text-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Learn More
                </Link>
                <a
                  href={`https://wa.me/447990600958?text=${encodeURIComponent(`Hi Leah, I've just taken your quiz and I'm interested in the ${recommendedPackage.name} package. Can we chat?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  WhatsApp Leah
                </a>
              </div>
            </div>

            {/* Other Top Matches */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Other great matches for you:
              </h4>
              <div className="space-y-3">
                {topPackages.slice(1).map(packageKey => {
                  const pkg = aphroditeFitnessPackages[packageKey as keyof typeof aphroditeFitnessPackages]
                  return (
                    <div key={packageKey} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                          <p className="text-sm text-gray-600">{pkg.tagline}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {pkg.currency}{pkg.price}
                          </div>
                          <div className="text-sm text-gray-600">{pkg.period}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={resetQuiz}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                href="#packages"
                className="flex-1 text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                View All Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const question = quizQuestions[currentQuestion]
  const QuestionIcon = question.icon

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <button
                  onClick={resetQuiz}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Start Over
                </button>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <QuestionIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(question.id, option.value, option.points)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">
                      {option.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Question
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default PackageSelectorQuiz