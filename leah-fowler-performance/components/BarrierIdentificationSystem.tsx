'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Clock,
  Brain,
  Target,
  TrendingDown,
  Users,
  Wallet,
  BarChart,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Shield,
  Zap,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Barrier {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  colour: string;
  severity?: number;
  solutions?: Solution[];
}

interface Solution {
  title: string;
  description: string;
  icon: React.ElementType;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

// Define common performance barriers
const PERFORMANCE_BARRIERS: Barrier[] = [
  {
    id: 'time_constraints',
    name: 'Time Constraints',
    icon: Clock,
    description: 'Struggling to find time for health and performance optimisation',
    colour: 'text-blue-500'
  },
  {
    id: 'lack_of_confidence',
    name: 'Lack of Confidence',
    icon: Brain,
    description: 'Uncertain about ability to achieve performance goals',
    colour: 'text-purple-500'
  },
  {
    id: 'past_failures',
    name: 'Past Failed Attempts',
    icon: TrendingDown,
    description: 'Previous programmes haven\'t delivered lasting results',
    colour: 'text-red-500'
  },
  {
    id: 'unclear_goals',
    name: 'Unclear Goals',
    icon: Target,
    description: 'Unsure what specific outcomes to focus on',
    colour: 'text-yellow-500'
  },
  {
    id: 'no_accountability',
    name: 'Lack of Accountability',
    icon: Users,
    description: 'Missing external support and accountability structure',
    colour: 'text-green-500'
  },
  {
    id: 'information_overload',
    name: 'Information Overload',
    icon: BarChart,
    description: 'Overwhelmed by conflicting advice and approaches',
    colour: 'text-indigo-500'
  },
  {
    id: 'financial_concerns',
    name: 'Investment Concerns',
    icon: Wallet,
    description: 'Uncertain about the return on investment',
    colour: 'text-orange-500'
  },
  {
    id: 'work_life_balance',
    name: 'Work-Life Integration',
    icon: RefreshCw,
    description: 'Difficulty balancing family and personal demands',
    colour: 'text-pink-500'
  }
];

// Barrier assessment questions
const BARRIER_QUESTIONS = [
  {
    id: 'primary_barrier',
    question: 'What\'s your biggest challenge in optimising your performance?',
    type: 'single',
    barriers: ['time_constraints', 'lack_of_confidence', 'past_failures', 'unclear_goals']
  },
  {
    id: 'secondary_barriers',
    question: 'Which additional factors affect your progress? (Select all that apply)',
    type: 'multi',
    barriers: ['no_accountability', 'information_overload', 'financial_concerns', 'work_life_balance']
  },
  {
    id: 'time_availability',
    question: 'How much time can you realistically dedicate to your development per week?',
    type: 'single',
    options: [
      { value: 'less_2', label: 'Less than 2 hours', severity: 5 },
      { value: '2_4', label: '2-4 hours', severity: 3 },
      { value: '4_6', label: '4-6 hours', severity: 2 },
      { value: 'more_6', label: 'More than 6 hours', severity: 1 }
    ]
  },
  {
    id: 'motivation_level',
    question: 'How motivated are you to transform your performance right now?',
    type: 'scale',
    options: [
      { value: '1', label: 'Not very motivated', severity: 5 },
      { value: '2', label: 'Somewhat motivated', severity: 4 },
      { value: '3', label: 'Moderately motivated', severity: 3 },
      { value: '4', label: 'Very motivated', severity: 2 },
      { value: '5', label: 'Extremely motivated', severity: 1 }
    ]
  },
  {
    id: 'support_system',
    question: 'Do you have support from family/colleagues for your development?',
    type: 'single',
    options: [
      { value: 'none', label: 'No support', severity: 5 },
      { value: 'limited', label: 'Limited support', severity: 3 },
      { value: 'moderate', label: 'Moderate support', severity: 2 },
      { value: 'strong', label: 'Strong support', severity: 1 }
    ]
  }
];

// Solutions database
const BARRIER_SOLUTIONS: Record<string, Solution[]> = {
  time_constraints: [
    {
      title: 'Micro-Optimisation Strategy',
      description: 'Transform dead time into development time with 5-minute performance protocols',
      icon: Zap,
      impact: 'high',
      timeframe: 'Immediate'
    },
    {
      title: 'Mother Schedule Integration',
      description: 'Seamlessly integrate performance work into your existing routine',
      icon: Clock,
      impact: 'high',
      timeframe: '1 week'
    },
    {
      title: 'High-Leverage Activities',
      description: 'Focus on 20% of activities that deliver 80% of results',
      icon: Target,
      impact: 'medium',
      timeframe: '2 weeks'
    }
  ],
  lack_of_confidence: [
    {
      title: 'Evidence-Based Confidence Building',
      description: 'Track measurable wins to build unstoppable momentum',
      icon: BarChart,
      impact: 'high',
      timeframe: '2 weeks'
    },
    {
      title: 'Success Guarantee Framework',
      description: 'Structured approach with guaranteed milestone achievements',
      icon: Shield,
      impact: 'high',
      timeframe: '1 month'
    },
    {
      title: 'Expert Guidance System',
      description: 'Direct support from performance experts who ensure your success',
      icon: Users,
      impact: 'medium',
      timeframe: 'Immediate'
    }
  ],
  past_failures: [
    {
      title: 'Root Cause Analysis',
      description: 'Identify exactly why previous approaches failed and eliminate those factors',
      icon: Brain,
      impact: 'high',
      timeframe: '1 week'
    },
    {
      title: 'Personalised Success Path',
      description: 'Custom programme designed around your specific needs, not generic templates',
      icon: Target,
      impact: 'high',
      timeframe: '2 weeks'
    },
    {
      title: 'Accountability Architecture',
      description: 'Multi-layered support system that makes failure impossible',
      icon: Shield,
      impact: 'high',
      timeframe: 'Immediate'
    }
  ],
  unclear_goals: [
    {
      title: 'Performance Clarity Session',
      description: 'Define crystal-clear objectives aligned with your life vision',
      icon: Target,
      impact: 'high',
      timeframe: 'Immediate'
    },
    {
      title: 'Outcome Mapping Process',
      description: 'Create measurable milestones and success metrics',
      icon: BarChart,
      impact: 'medium',
      timeframe: '1 week'
    },
    {
      title: 'Vision Alignment Workshop',
      description: 'Connect performance goals to deeper life purpose',
      icon: Heart,
      impact: 'high',
      timeframe: '2 weeks'
    }
  ],
  no_accountability: [
    {
      title: 'Weekly Check-In System',
      description: 'Regular touchpoints to maintain momentum and adjust strategy',
      icon: Users,
      impact: 'high',
      timeframe: 'Immediate'
    },
    {
      title: 'Performance Partner Matching',
      description: 'Connect with peers on similar journeys for mutual support',
      icon: Users,
      impact: 'medium',
      timeframe: '1 week'
    },
    {
      title: 'Digital Accountability Tools',
      description: 'App-based tracking and reminders to keep you on track',
      icon: Shield,
      impact: 'medium',
      timeframe: 'Immediate'
    }
  ],
  information_overload: [
    {
      title: 'Curated Knowledge Path',
      description: 'Receive only the most relevant, evidence-based strategies',
      icon: Brain,
      impact: 'high',
      timeframe: 'Immediate'
    },
    {
      title: 'Single Source of Truth',
      description: 'One comprehensive system replacing scattered approaches',
      icon: Target,
      impact: 'high',
      timeframe: '1 week'
    },
    {
      title: 'Progressive Learning System',
      description: 'Information delivered at the right time, in digestible portions',
      icon: BarChart,
      impact: 'medium',
      timeframe: '2 weeks'
    }
  ],
  financial_concerns: [
    {
      title: 'ROI Guarantee',
      description: 'Measurable returns that exceed your investment within 90 days',
      icon: Wallet,
      impact: 'high',
      timeframe: '3 months'
    },
    {
      title: 'Flexible Payment Options',
      description: 'Spread investment over time to match cash flow',
      icon: RefreshCw,
      impact: 'medium',
      timeframe: 'Immediate'
    },
    {
      title: 'Performance-Based Pricing',
      description: 'Investment tied to achieved outcomes and results',
      icon: Target,
      impact: 'high',
      timeframe: '1 month'
    }
  ],
  work_life_balance: [
    {
      title: 'Integration Not Separation',
      description: 'Make performance enhancement part of life, not another task',
      icon: RefreshCw,
      impact: 'high',
      timeframe: '1 week'
    },
    {
      title: 'Family Involvement Strategies',
      description: 'Include family in your journey for shared benefits',
      icon: Heart,
      impact: 'medium',
      timeframe: '2 weeks'
    },
    {
      title: 'Boundary Setting Framework',
      description: 'Create sustainable boundaries that protect personal time',
      icon: Shield,
      impact: 'high',
      timeframe: 'Immediate'
    }
  ]
};

interface BarrierIdentificationSystemProps {
  onComplete?: (data: any) => void;
  userEmail?: string;
}

export default function BarrierIdentificationSystem({ 
  onComplete, 
  userEmail 
}: BarrierIdentificationSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [barrierSeverity, setBarrierSeverity] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [personalizedSolutions, setPersonalizedSolutions] = useState<Solution[]>([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const progress = ((currentStep + 1) / (BARRIER_QUESTIONS.length + 1)) * 100;

  const handleSingleSelect = (barrierId: string) => {
    setSelectedBarriers([barrierId]);
    setBarrierSeverity(prev => ({ ...prev, [barrierId]: 5 }));
    
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 300);
  };

  const handleMultiSelect = (barrierId: string) => {
    setSelectedBarriers(prev => {
      if (prev.includes(barrierId)) {
        return prev.filter(id => id !== barrierId);
      }
      return [...prev, barrierId];
    });
    setBarrierSeverity(prev => ({ ...prev, [barrierId]: 3 }));
  };

  const handleAnswer = (questionId: string, value: any, severity?: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (severity) {
      // Adjust barrier severity based on answers
      selectedBarriers.forEach(barrier => {
        setBarrierSeverity(prev => ({
          ...prev,
          [barrier]: Math.max(prev[barrier] || 0, severity)
        }));
      });
    }
    
    setTimeout(() => {
      if (currentStep < BARRIER_QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        analyzeSolutions();
      }
    }, 300);
  };

  const analyzeSolutions = async () => {
    setIsAnalyzing(true);
    
    // Generate personalized solutions based on barriers and severity
    const solutions: Solution[] = [];
    const addedSolutions = new Set();
    
    selectedBarriers.forEach(barrierId => {
      const barrierSolutions = BARRIER_SOLUTIONS[barrierId] || [];
      const severity = barrierSeverity[barrierId] || 3;
      
      // Prioritize solutions based on severity
      const prioritizedSolutions = barrierSolutions
        .filter(solution => {
          const key = `${barrierId}-${solution.title}`;
          if (addedSolutions.has(key)) return false;
          addedSolutions.add(key);
          
          // Higher severity requires higher impact solutions
          if (severity >= 4 && solution.impact === 'high') return true;
          if (severity >= 2 && solution.impact !== 'low') return true;
          return severity < 2;
        })
        .slice(0, 2); // Max 2 solutions per barrier
      
      solutions.push(...prioritizedSolutions);
    });
    
    // Sort by impact and timeframe
    solutions.sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return impactScore[b.impact] - impactScore[a.impact];
    });
    
    setPersonalizedSolutions(solutions);
    
    // Save to database if email provided
    if (userEmail) {
      try {
        await supabase.from('performance_barriers').insert({
          email: userEmail,
          ...selectedBarriers.reduce((acc, barrier) => ({
            ...acc,
            [barrier]: true
          }), {}),
          time_severity: barrierSeverity.time_constraints,
          confidence_severity: barrierSeverity.lack_of_confidence,
          motivation_severity: barrierSeverity.past_failures,
          recommended_solutions: solutions,
          action_plan: generateActionPlan(solutions),
          why_different_framework: generateWhyDifferent()
        });
        
        // Track engagement
        await supabase.from('engagement_tracking').insert({
          session_id: `barrier_${Date.now()}`,
          email: userEmail,
          event_type: 'barrier_quiz_completed',
          event_data: { 
            barriers: selectedBarriers,
            severity: barrierSeverity,
            solutions_count: solutions.length
          },
          page_url: window.location.href
        });
      } catch (error) {
        console.error('Error saving barrier data:', error);
      }
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSolutions(true);
      onComplete?.({
        barriers: selectedBarriers,
        severity: barrierSeverity,
        solutions,
        answers
      });
    }, 2000);
  };

  const generateActionPlan = (solutions: Solution[]) => {
    return {
      immediate: solutions.filter(s => s.timeframe === 'Immediate').map(s => s.title),
      week1: solutions.filter(s => s.timeframe === '1 week').map(s => s.title),
      week2: solutions.filter(s => s.timeframe === '2 weeks').map(s => s.title),
      month1: solutions.filter(s => s.timeframe === '1 month').map(s => s.title)
    };
  };

  const generateWhyDifferent = () => {
    const frameworks = [];
    
    if (selectedBarriers.includes('past_failures')) {
      frameworks.push('Root cause elimination ensures different results');
    }
    if (selectedBarriers.includes('time_constraints')) {
      frameworks.push('Micro-optimisation fits into any schedule');
    }
    if (selectedBarriers.includes('lack_of_confidence')) {
      frameworks.push('Evidence-based progress tracking builds momentum');
    }
    if (selectedBarriers.includes('no_accountability')) {
      frameworks.push('Multi-layer support system guarantees follow-through');
    }
    
    return frameworks.join('. ');
  };

  const renderQuestion = () => {
    if (currentStep >= BARRIER_QUESTIONS.length) {
      return null;
    }
    
    const question = BARRIER_QUESTIONS[currentStep];
    
    if (question.type === 'single' && question.barriers) {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold">{question.question}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.barriers.map(barrierId => {
              const barrier = PERFORMANCE_BARRIERS.find(b => b.id === barrierId)!;
              const Icon = barrier.icon;
              const isSelected = selectedBarriers.includes(barrierId);
              
              return (
                <Card
                  key={barrierId}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    isSelected && "border-green-500 bg-green-50"
                  )}
                  onClick={() => handleSingleSelect(barrierId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Icon className={cn("w-6 h-6 mt-1", barrier.colour)} />
                      <div className="flex-1">
                        <h4 className="font-semibold">{barrier.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {barrier.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      );
    } else if (question.type === 'multi' && question.barriers) {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold">{question.question}</h3>
          
          <div className="space-y-3">
            {question.barriers.map(barrierId => {
              const barrier = PERFORMANCE_BARRIERS.find(b => b.id === barrierId)!;
              const Icon = barrier.icon;
              const isSelected = selectedBarriers.includes(barrierId);
              
              return (
                <label
                  key={barrierId}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMultiSelect(barrierId)}
                    className="sr-only"
                  />
                  <Icon className={cn("w-5 h-5", barrier.colour)} />
                  <div className="flex-1">
                    <p className="font-medium">{barrier.name}</p>
                    <p className="text-sm text-gray-600">{barrier.description}</p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </label>
              );
            })}
          </div>
          
          <Button
            size="lg"
            className="w-full"
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={selectedBarriers.length === 0}
          >
            Continue
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      );
    } else if (question.options) {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold">{question.question}</h3>
          
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => {
              const option = question.options?.find(o => o.value === value);
              handleAnswer(question.id, value, option?.severity);
            }}
            className="space-y-3"
          >
            {question.options.map(option => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  answers[question.id] === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="flex-1">{option.label}</span>
                {answers[question.id] === option.value && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </label>
            ))}
          </RadioGroup>
        </motion.div>
      );
    }
    
    return null;
  };

  if (isAnalyzing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center space-y-6">
            <Sparkles className="w-12 h-12 text-green-600 mx-auto animate-pulse" />
            <h3 className="text-2xl font-bold">Analysing Your Profile</h3>
            <p className="text-gray-600">
              Creating your personalised barrier elimination plan...
            </p>
            <Progress value={66} className="max-w-xs mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSolutions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your Barrier Elimination Plan</CardTitle>
            <CardDescription>
              Personalised solutions to overcome what\'s been holding you back
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Identified Barriers */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Barriers Identified:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBarriers.map(barrierId => {
                  const barrier = PERFORMANCE_BARRIERS.find(b => b.id === barrierId)!;
                  const severity = barrierSeverity[barrierId] || 3;
                  return (
                    <Badge
                      key={barrierId}
                      variant={severity >= 4 ? "destructive" : severity >= 2 ? "default" : "secondary"}
                      className="py-1 px-3"
                    >
                      <barrier.icon className="w-3 h-3 mr-1" />
                      {barrier.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            {/* Why This Time Is Different */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Why This Time Is Different</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Unlike generic programmes that ignore your specific challenges, 
                  this approach directly addresses your identified barriers with 
                  proven elimination strategies. {generateWhyDifferent()}
                </p>
              </CardContent>
            </Card>
            
            {/* Personalised Solutions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Your Personalised Solutions:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedSolutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <Icon className="w-6 h-6 text-green-600 mt-1" />
                          <div className="flex-1">
                            <h5 className="font-semibold">{solution.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {solution.description}
                            </p>
                            <div className="flex items-center space-x-3 mt-3">
                              <Badge variant={
                                solution.impact === 'high' ? 'default' :
                                solution.impact === 'medium' ? 'secondary' : 'outline'
                              }>
                                {solution.impact} impact
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {solution.timeframe}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Implementation Timeline */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Your Implementation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-600">Today</Badge>
                    <p className="text-sm">
                      Start with: {personalizedSolutions.filter(s => s.timeframe === 'Immediate')[0]?.title || 'Initial consultation'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-600">Week 1</Badge>
                    <p className="text-sm">
                      Implement: {personalizedSolutions.filter(s => s.timeframe === '1 week')[0]?.title || 'Core systems'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-600">Week 2-4</Badge>
                    <p className="text-sm">
                      Optimise: {personalizedSolutions.filter(s => s.timeframe === '2 weeks')[0]?.title || 'Advanced strategies'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* CTA */}
            <div className="text-center pt-6">
              <Button size="lg" className="min-w-[300px]">
                Start Eliminating These Barriers Now
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Book your free barrier elimination consultation
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Step {currentStep + 1} of {BARRIER_QUESTIONS.length}
            </Badge>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          {renderQuestion()}
        </AnimatePresence>
        
        {currentStep > 0 && currentStep < BARRIER_QUESTIONS.length && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            >
              <ChevronRight className="mr-2 w-4 h-4 rotate-180" />
              Previous
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}