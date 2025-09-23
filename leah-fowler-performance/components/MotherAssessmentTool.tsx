'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@supabase/supabase-js';
import { 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  Brain, 
  Clock, 
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap,
  Users,
  Heart,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

// Supabase client (will be properly configured from environment)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Assessment dimensions with icons - UK English throughout
const ASSESSMENT_DIMENSIONS = [
  { 
    id: 'energy', 
    name: 'Energy Optimisation', 
    icon: Zap,
    colour: 'text-yellow-500',
    description: 'Sustainable energy management throughout your day'
  },
  { 
    id: 'performance', 
    name: 'Performance Excellence', 
    icon: TrendingUp,
    colour: 'text-green-500',
    description: 'Peak fitness in personal and family life'
  },
  { 
    id: 'resilience', 
    name: 'Mental Resilience', 
    icon: Brain,
    colour: 'text-blue-500',
    description: 'Psychological strength and stress management'
  },
  { 
    id: 'balance', 
    name: 'Life Integration', 
    icon: Heart,
    colour: 'text-pink-500',
    description: 'Harmonising fitness goals with family commitments'
  },
  { 
    id: 'strength',
    name: 'Physical Strength', 
    icon: Users,
    colour: 'text-purple-500',
    description: 'Building strength whilst managing family responsibilities'
  }
];

// Question types
type QuestionType = 'single' | 'scale' | 'multi' | 'text';

interface AssessmentQuestion {
  id: string;
  dimension: string;
  question: string;
  type: QuestionType;
  options?: { value: string; label: string; score: number }[];
  weight: number;
  insights: string[];
}

// Assessment questions - focused on mother fitness
const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Energy Optimisation
  {
    id: 'q1',
    dimension: 'energy',
    question: 'How would you rate your energy levels throughout a typical workday?',
    type: 'scale',
    options: [
      { value: '1', label: 'Consistently low', score: 1 },
      { value: '2', label: 'Variable with crashes', score: 2 },
      { value: '3', label: 'Moderate but declining', score: 3 },
      { value: '4', label: 'Generally good', score: 4 },
      { value: '5', label: 'Consistently high', score: 5 }
    ],
    weight: 1.2,
    insights: ['Energy management is foundational to sustained performance']
  },
  {
    id: 'q2',
    dimension: 'energy',
    question: 'How many hours of quality sleep do you average per night?',
    type: 'single',
    options: [
      { value: 'less-5', label: 'Less than 5 hours', score: 1 },
      { value: '5-6', label: '5-6 hours', score: 2 },
      { value: '6-7', label: '6-7 hours', score: 3 },
      { value: '7-8', label: '7-8 hours', score: 4 },
      { value: 'more-8', label: 'More than 8 hours', score: 5 }
    ],
    weight: 1.1,
    insights: ['Sleep quality directly impacts cognitive function and decision-making']
  },
  
  // Performance Excellence
  {
    id: 'q3',
    dimension: 'performance',
    question: 'How effectively do you maintain focus during critical tasks?',
    type: 'scale',
    options: [
      { value: '1', label: 'Frequently distracted', score: 1 },
      { value: '2', label: 'Often interrupted', score: 2 },
      { value: '3', label: 'Moderate focus', score: 3 },
      { value: '4', label: 'Good concentration', score: 4 },
      { value: '5', label: 'Exceptional focus', score: 5 }
    ],
    weight: 1.3,
    insights: ['Deep focus is a competitive advantage in knowledge work']
  },
  {
    id: 'q4',
    dimension: 'performance',
    question: 'How satisfied are you with your current fitness progress?',
    type: 'scale',
    options: [
      { value: '1', label: 'Very dissatisfied', score: 1 },
      { value: '2', label: 'Dissatisfied', score: 2 },
      { value: '3', label: 'Neutral', score: 3 },
      { value: '4', label: 'Satisfied', score: 4 },
      { value: '5', label: 'Very satisfied', score: 5 }
    ],
    weight: 1.0,
    insights: ['Performance satisfaction correlates with engagement and results']
  },
  
  // Mental Resilience
  {
    id: 'q5',
    dimension: 'resilience',
    question: 'How well do you manage stress during high-pressure situations?',
    type: 'scale',
    options: [
      { value: '1', label: 'Poorly', score: 1 },
      { value: '2', label: 'With difficulty', score: 2 },
      { value: '3', label: 'Adequately', score: 3 },
      { value: '4', label: 'Well', score: 4 },
      { value: '5', label: 'Exceptionally well', score: 5 }
    ],
    weight: 1.4,
    insights: ['Stress resilience is crucial for sustained fitness progress']
  },
  {
    id: 'q6',
    dimension: 'resilience',
    question: 'How quickly do you recover from setbacks or failures?',
    type: 'scale',
    options: [
      { value: '1', label: 'Very slowly', score: 1 },
      { value: '2', label: 'Slowly', score: 2 },
      { value: '3', label: 'Moderate pace', score: 3 },
      { value: '4', label: 'Quickly', score: 4 },
      { value: '5', label: 'Very quickly', score: 5 }
    ],
    weight: 1.2,
    insights: ['Recovery speed determines long-term success trajectory']
  },
  
  // Life Integration
  {
    id: 'q7',
    dimension: 'balance',
    question: 'How well do you maintain boundaries between work and personal life?',
    type: 'scale',
    options: [
      { value: '1', label: 'No boundaries', score: 1 },
      { value: '2', label: 'Poor boundaries', score: 2 },
      { value: '3', label: 'Some boundaries', score: 3 },
      { value: '4', label: 'Good boundaries', score: 4 },
      { value: '5', label: 'Excellent boundaries', score: 5 }
    ],
    weight: 1.1,
    insights: ['Boundary management prevents burnout and sustains performance']
  },
  {
    id: 'q8',
    dimension: 'balance',
    question: 'How often do you engage in activities that energise you outside work?',
    type: 'single',
    options: [
      { value: 'never', label: 'Never', score: 1 },
      { value: 'rarely', label: 'Rarely', score: 2 },
      { value: 'monthly', label: 'Monthly', score: 3 },
      { value: 'weekly', label: 'Weekly', score: 4 },
      { value: 'daily', label: 'Daily', score: 5 }
    ],
    weight: 1.0,
    insights: ['Regular recovery activities enhance overall performance capacity']
  },
  
  // Physical Strength
  {
    id: 'q9',
    dimension: 'strength',
    question: 'How would you rate your ability to inspire and motivate others?',
    type: 'scale',
    options: [
      { value: '1', label: 'Poor', score: 1 },
      { value: '2', label: 'Below average', score: 2 },
      { value: '3', label: 'Average', score: 3 },
      { value: '4', label: 'Above average', score: 4 },
      { value: '5', label: 'Exceptional', score: 5 }
    ],
    weight: 1.2,
    insights: ['Your strength journey inspires your entire family']
  },
  {
    id: 'q10',
    dimension: 'strength',
    question: 'How effectively do you communicate vision and strategy?',
    type: 'scale',
    options: [
      { value: '1', label: 'Very ineffectively', score: 1 },
      { value: '2', label: 'Ineffectively', score: 2 },
      { value: '3', label: 'Moderately', score: 3 },
      { value: '4', label: 'Effectively', score: 4 },
      { value: '5', label: 'Very effectively', score: 5 }
    ],
    weight: 1.3,
    insights: ['Clear communication amplifies organisational alignment and results']
  }
];

// Additional demographic questions for personalisation
const DEMOGRAPHIC_QUESTIONS = [
  {
    id: 'industry',
    question: 'Which industry do you work in?',
    type: 'single',
    options: [
      { value: 'finance', label: 'Finance & Banking' },
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'consulting', label: 'Consulting' },
      { value: 'legal', label: 'Legal' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'role_level',
    question: 'What is your current role level?',
    type: 'single',
    options: [
      { value: 'mother-multiple', label: 'Mother of Multiple Children' },
      { value: 'mother-young', label: 'Mother of Young Children' },
      { value: 'director', label: 'Director' },
      { value: 'senior-manager', label: 'Senior Manager' },
      { value: 'manager', label: 'Manager' },
      { value: 'mother', label: 'Mother' }
    ]
  },
  {
    id: 'team_size',
    question: 'How many people do you directly manage?',
    type: 'single',
    options: [
      { value: 'none', label: 'Individual contributor' },
      { value: '1-5', label: '1-5 people' },
      { value: '6-20', label: '6-20 people' },
      { value: '21-50', label: '21-50 people' },
      { value: '50+', label: 'More than 50' }
    ]
  }
];

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms to continue'
  }),
  marketing: z.boolean().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function MotherAssessmentTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<string, unknown>>({});
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      consent: false,
      marketing: false
    }
  });

  // Calculate total steps
  const totalSteps = ASSESSMENT_QUESTIONS.length + DEMOGRAPHIC_QUESTIONS.length + 2; // +2 for intro and contact
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Calculate scores in real-time
  useEffect(() => {
    calculateScores();
  }, [assessmentData]);

  const calculateScores = useCallback(() => {
    const scores: Record<string, number[]> = {};
    
    ASSESSMENT_DIMENSIONS.forEach(dim => {
      scores[dim.id] = [];
    });
    
    // Calculate dimension scores
    ASSESSMENT_QUESTIONS.forEach(question => {
      const answer = assessmentData[question.id];
      if (answer) {
        const option = question.options?.find(opt => opt.value === answer);
        if (option) {
          scores[question.dimension].push(option.score * question.weight);
        }
      }
    });
    
    // Calculate averages
    const dimensionAverages: Record<string, number> = {};
    Object.keys(scores).forEach(dimension => {
      const dimScores = scores[dimension];
      if (dimScores.length > 0) {
        dimensionAverages[dimension] = 
          (dimScores.reduce((a, b) => a + b, 0) / dimScores.length) * 20; // Scale to 100
      } else {
        dimensionAverages[dimension] = 0;
      }
    });
    
    setDimensionScores(dimensionAverages);
    
    // Calculate overall score
    const avgScore = Object.values(dimensionAverages).length > 0
      ? Object.values(dimensionAverages).reduce((a, b) => a + b, 0) / Object.values(dimensionAverages).length
      : 0;
    setOverallScore(avgScore);
  }, [assessmentData]);

  const handleAnswer = (questionId: string, value: string) => {
    setAssessmentData(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 300);
  };

  const generatePersonalisedRecommendations = () => {
    // Determine programme tier based on scores and profile
    let recommendedProgramme = 'Foundation';
    let investmentLevel = 'moderate';
    
    if (overallScore >= 75 && assessmentData.role_level?.includes('suite')) {
      recommendedProgramme = 'Elite';
      investmentLevel = 'premium';
    } else if (overallScore >= 60 && ['director', 'senior-exec'].includes(assessmentData.role_level)) {
      recommendedProgramme = 'Acceleration';
      investmentLevel = 'high';
    }
    
    return {
      programme: recommendedProgramme,
      investment: investmentLevel,
      strengths: Object.entries(dimensionScores)
        .filter(([_, score]) => score >= 70)
        .map(([dim]) => ASSESSMENT_DIMENSIONS.find(d => d.id === dim)?.name),
      gaps: Object.entries(dimensionScores)
        .filter(([_, score]) => score < 50)
        .map(([dim]) => ASSESSMENT_DIMENSIONS.find(d => d.id === dim)?.name),
      nextSteps: [
        'Book a complimentary strategy consultation',
        'Review your personalised performance optimisation plan',
        'Begin your transformation journey'
      ]
    };
  };

  const onSubmitContact = async (data: ContactFormData) => {
    setIsCalculating(true);
    
    try {
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      const recommendations = generatePersonalisedRecommendations();
      
      // Save to Supabase
      const { error } = await supabase
        .from('assessment_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          answers: assessmentData,
          profile: {
            dimensionScores,
            overallScore,
            recommendations
          },
          qualified: overallScore >= 40,
          tier: recommendations.programme.toLowerCase(),
          investment_level: recommendations.investment,
          readiness_score: overallScore,
          performance_level: overallScore >= 70 ? 'High' : overallScore >= 50 ? 'Moderate' : 'Developing',
          recommended_programme: recommendations.programme,
          estimated_investment: recommendations.programme === 'Gold' ? '£250/month' :
                                 recommendations.programme === 'Silver' ? '£140/month' :
                                 recommendations.programme === 'Semi-Private' ? '£90/month per person' :
                                 recommendations.programme === 'Small Group' ? '£120 for 12 sessions' : '£48 one-off',
          consent_given: data.consent,
          consent_timestamp: new Date().toISOString(),
          marketing_consent: data.marketing,
          completion_time_seconds: completionTime,
          source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
          medium: new URLSearchParams(window.location.search).get('utm_medium') || 'organic',
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || null
        });
        
      if (error) throw error;
      
      // Track engagement
      await supabase
        .from('engagement_tracking')
        .insert({
          session_id: `session_${Date.now()}`,
          email: data.email,
          event_type: 'assessment_completed',
          event_data: { score: overallScore, programme: recommendations.programme },
          page_url: window.location.href,
          time_on_page: completionTime
        });
      
      setShowResults(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderQuestion = () => {
    if (currentStep === 0) {
      // Introduction screen
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 rounded-full">
              <Target className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold">Mother Fitness Assessment</h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your performance optimisation potential with our evidence-based assessment. 
            This 15-minute evaluation analyses five critical dimensions of mother fitness excellence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {ASSESSMENT_DIMENSIONS.map(dimension => (
              <div key={dimension.id} className="flex items-start space-x-3">
                <dimension.icon className={cn('w-5 h-5 mt-1', dimension.colour)} />
                <div>
                  <p className="font-semibold">{dimension.name}</p>
                  <p className="text-sm text-gray-500">{dimension.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>15 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>100% confidential</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span>Instant results</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="mt-6"
            onClick={() => setCurrentStep(1)}
          >
            Begin Assessment
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      );
    }
    
    const assessmentQuestionIndex = currentStep - 1;
    const demographicQuestionIndex = currentStep - 1 - ASSESSMENT_QUESTIONS.length;
    
    if (assessmentQuestionIndex < ASSESSMENT_QUESTIONS.length) {
      // Assessment questions
      const question = ASSESSMENT_QUESTIONS[assessmentQuestionIndex];
      const dimension = ASSESSMENT_DIMENSIONS.find(d => d.id === question.dimension);
      const DimensionIcon = dimension?.icon || Target;
      
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <DimensionIcon className={cn('w-6 h-6', dimension?.colour)} />
            <Badge variant="outline">{dimension?.name}</Badge>
          </div>
          
          <h3 className="text-xl font-semibold">{question.question}</h3>
          
          {question.insights && (
            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">{question.insights[0]}</p>
            </div>
          )}
          
          <RadioGroup
            value={assessmentData[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map(option => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  assessmentData[question.id] === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="flex-1">{option.label}</span>
                {assessmentData[question.id] === option.value && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </label>
            ))}
          </RadioGroup>
        </motion.div>
      );
    } else if (demographicQuestionIndex < DEMOGRAPHIC_QUESTIONS.length) {
      // Demographic questions
      const question = DEMOGRAPHIC_QUESTIONS[demographicQuestionIndex];
      
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <Badge variant="outline">Profile Information</Badge>
          
          <h3 className="text-xl font-semibold">{question.question}</h3>
          
          <RadioGroup
            value={assessmentData[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map(option => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  assessmentData[question.id] === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="flex-1">{option.label}</span>
                {assessmentData[question.id] === option.value && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </label>
            ))}
          </RadioGroup>
        </motion.div>
      );
    } else {
      // Contact form
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <Award className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold">Assessment Complete!</h3>
            <p className="text-gray-600">
              Your performance score: <span className="font-bold text-green-600">{overallScore.toFixed(0)}%</span>
            </p>
          </div>
          
          {/* Live dimension scores */}
          <div className="space-y-3">
            {ASSESSMENT_DIMENSIONS.map(dimension => {
              const score = dimensionScores[dimension.id] || 0;
              const DimIcon = dimension.icon;
              return (
                <div key={dimension.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <DimIcon className={cn('w-4 h-4', dimension.colour)} />
                      <span>{dimension.name}</span>
                    </div>
                    <span className="font-semibold">{score.toFixed(0)}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              );
            })}
          </div>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-green-800">
                Enter your details below to receive your personalised performance optimisation report 
                and recommended programme pathway.
              </p>
            </CardContent>
          </Card>
          
          <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="John Smith" />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="email" placeholder="john@company.com" />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="tel" placeholder="+44 7700 900000" />
                )}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Controller
                  name="consent"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      className="mt-1"
                    />
                  )}
                />
                <Label className="text-sm text-gray-600">
                  I agree to receive my assessment results and understand that Leah Fowler Performance 
                  will process my data in accordance with their privacy policy.
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-red-500">{errors.consent.message}</p>
              )}
              
              <div className="flex items-start space-x-2">
                <Controller
                  name="marketing"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      className="mt-1"
                    />
                  )}
                />
                <Label className="text-sm text-gray-600">
                  I would like to receive performance optimisation tips and exclusive insights 
                  (you can unsubscribe at any time)
                </Label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || isCalculating}
            >
              {isCalculating ? 'Analysing Results...' : 'Get My Results'}
            </Button>
          </form>
        </motion.div>
      );
    }
  };

  if (showResults) {
    const recommendations = generatePersonalisedRecommendations();
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Your Performance Profile</CardTitle>
          <CardDescription>
            Personalised recommendations based on your assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Score */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {overallScore.toFixed(0)}%
                </div>
                <div className="text-sm text-green-700">Overall Score</div>
              </div>
            </div>
          </div>
          
          {/* Dimension Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSESSMENT_DIMENSIONS.map(dimension => {
              const score = dimensionScores[dimension.id] || 0;
              const DimIcon = dimension.icon;
              return (
                <Card key={dimension.id} className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <DimIcon className={cn('w-6 h-6', dimension.colour)} />
                    <h4 className="font-semibold">{dimension.name}</h4>
                  </div>
                  <Progress value={score} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{score.toFixed(0)}% optimised</p>
                </Card>
              );
            })}
          </div>
          
          {/* Recommendations */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Recommended Programme: {recommendations.programme}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.strengths && recommendations.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Your Strengths:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {recommendations.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {recommendations.gaps && recommendations.gaps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Areas for Optimisation:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {recommendations.gaps.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Your Next Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700">
                  {recommendations.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <Button size="lg" className="w-full">
                Book Your Strategy Consultation
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Question {Math.min(currentStep, ASSESSMENT_QUESTIONS.length)} of {totalSteps - 2}
            </Badge>
            <div className="text-sm text-gray-500">
              {Math.ceil((totalSteps - currentStep) * 0.75)} min remaining
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          {renderQuestion()}
        </AnimatePresence>
        
        {currentStep > 0 && currentStep <= ASSESSMENT_QUESTIONS.length && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
              disabled={!assessmentData[ASSESSMENT_QUESTIONS[currentStep - 1]?.id]}
            >
              Next
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}