export type QuestionType = 'single-choice' | 'multi-choice' | 'scale' | 'text-input' | 'number-input'

export interface AssessmentOption {
  value: string
  label: string
  points: number
  qualifies: boolean
  supportiveMessage?: string // New: encouraging message for each option
}

export interface AssessmentQuestion {
  id: string
  phase: 'discovery' | 'vision' | 'readiness' | 'investment'
  category: string
  question: string
  subtext?: string
  type: QuestionType
  options?: AssessmentOption[]
  required: boolean
  qualifying?: boolean
  minValue?: number
  maxValue?: number
  unit?: string
  encouragingNote?: string // New: supportive note for the question
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // PHASE 1: DISCOVERY - Understanding Current Performance Gaps
  {
    id: 'current_challenges',
    phase: 'discovery',
    category: 'Real-World Performance Audit',
    question: 'What physical challenges are holding you back?',
    subtext: 'Let\'s identify the barriers preventing you from feeling your best',
    encouragingNote: 'Everyone starts somewhere - we\'ll tackle these challenges together',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'low_energy', label: 'Low energy throughout the day', points: 3, qualifies: true },
      { value: 'poor_sleep', label: 'Poor sleep quality affecting recovery', points: 3, qualifies: true },
      { value: 'lack_strength', label: 'Lack of strength for daily activities', points: 3, qualifies: true },
      { value: 'joint_pain', label: 'Joint pain or mobility issues', points: 3, qualifies: true },
      { value: 'weight_management', label: 'Struggling with weight management', points: 3, qualifies: true },
      { value: 'no_routine', label: 'Can\'t stick to an exercise routine', points: 3, qualifies: true },
      { value: 'stress_eating', label: 'Stress eating or poor nutrition habits', points: 3, qualifies: true },
      { value: 'time_barriers', label: 'Time constraints and busy schedule', points: 3, qualifies: true }
    ]
  },
  {
    id: 'performance_baseline',
    phase: 'discovery',
    category: 'Performance Baseline',
    question: 'How would you rate your current fitness level?',
    subtext: 'Be honest - this helps us design the perfect starting point for you',
    encouragingNote: 'Whatever your starting point, we\'ll create a programme that works for you',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'beginner', label: 'Beginner - haven\'t exercised regularly in years', points: 2, qualifies: true, supportiveMessage: 'Perfect! We\'ll build your foundation properly' },
      { value: 'inconsistent', label: 'Inconsistent - start and stop frequently', points: 3, qualifies: true, supportiveMessage: 'Let\'s create sustainable habits that stick' },
      { value: 'moderate', label: 'Moderate - exercise 1-2 times per week', points: 5, qualifies: true, supportiveMessage: 'Ready to take it to the next level' },
      { value: 'active', label: 'Active - exercise 3-4 times per week', points: 7, qualifies: true, supportiveMessage: 'Time to optimise your training' },
      { value: 'very_active', label: 'Very active - need expert programming', points: 10, qualifies: true, supportiveMessage: 'Let\'s maximise your results' }
    ]
  },
  {
    id: 'performance_cost',
    phase: 'discovery',
    category: 'Performance Cost',
    question: 'How is your current fitness affecting your life?',
    subtext: 'Consider energy, confidence, health, and daily activities',
    encouragingNote: 'Understanding your why helps us keep you motivated',
    type: 'text-input',
    required: true
  },
  {
    id: 'tried_before',
    phase: 'discovery',
    category: 'Previous Attempts',
    question: 'What haven\'t worked for you in the past?',
    subtext: 'We learn from what didn\'t work to create what will',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'extreme_diets', label: 'Extreme diets that weren\'t sustainable', points: 2, qualifies: true },
      { value: 'boot_camps', label: 'Boot camps that were too intense', points: 2, qualifies: true },
      { value: 'generic_plans', label: 'Generic fitness plans not tailored to me', points: 3, qualifies: true },
      { value: 'gym_intimidation', label: 'Gym memberships I never used', points: 4, qualifies: true },
      { value: 'fitness_apps', label: 'Fitness apps with no accountability', points: 2, qualifies: true },
      { value: 'quick_fixes', label: 'Quick fixes and fad workouts', points: 3, qualifies: true },
      { value: 'no_guidance', label: 'Training without proper guidance', points: 5, qualifies: true },
      { value: 'nothing_consistent', label: 'Never found anything I could stick with', points: 1, qualifies: true }
    ]
  },

  // PHASE 2: VISION - Performance Outcomes
  {
    id: 'primary_goal',
    phase: 'vision',
    category: 'Performance Vision',
    question: 'What\'s your primary fitness goal?',
    subtext: 'What would make the biggest difference to your quality of life?',
    encouragingNote: 'Clear goals lead to incredible transformations',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'build_strength', label: 'Build functional strength for daily life', points: 5, qualifies: true },
      { value: 'increase_energy', label: 'Increase energy levels throughout the day', points: 5, qualifies: true },
      { value: 'improve_sleep', label: 'Improve sleep quality and recovery', points: 5, qualifies: true },
      { value: 'lose_weight', label: 'Lose weight and improve body composition', points: 5, qualifies: true },
      { value: 'reduce_pain', label: 'Reduce pain and improve mobility', points: 5, qualifies: true },
      { value: 'build_muscle', label: 'Build lean muscle and tone up', points: 5, qualifies: true },
      { value: 'healthy_ageing', label: 'Age well and maintain independence', points: 5, qualifies: true },
      { value: 'athletic_performance', label: 'Improve athletic performance', points: 5, qualifies: true }
    ]
  },
  {
    id: 'success_metrics',
    phase: 'vision',
    category: 'Success Indicators',
    question: 'Which measurable outcomes matter most to you?',
    subtext: 'We track progress with data, not just feelings',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'strength_gains', label: 'Measurable strength improvements', points: 3, qualifies: true },
      { value: 'weight_loss', label: 'Sustainable weight loss (kg/lbs)', points: 3, qualifies: true },
      { value: 'muscle_gain', label: 'Lean muscle mass increase', points: 3, qualifies: true },
      { value: 'endurance', label: 'Improved cardiovascular endurance', points: 3, qualifies: true },
      { value: 'flexibility', label: 'Better flexibility and mobility', points: 3, qualifies: true },
      { value: 'energy_levels', label: 'Consistent high energy levels', points: 3, qualifies: true },
      { value: 'sleep_improvement', label: 'Better sleep quality scores', points: 3, qualifies: true },
      { value: 'pain_reduction', label: 'Reduced pain and discomfort', points: 3, qualifies: true }
    ]
  },
  {
    id: 'timeline_urgency',
    phase: 'vision',
    category: 'Performance Timeline',
    question: 'When do you want to see results?',
    subtext: 'This helps us design the right programme intensity for you',
    encouragingNote: 'Quick wins build momentum for lasting transformation',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'urgent', label: 'Need results in the next 4-6 weeks', points: 10, qualifies: true },
      { value: 'health_motivated', label: 'Doctor\'s advice or health concerns', points: 9, qualifies: true },
      { value: 'event_deadline', label: 'Special event coming up (wedding, holiday)', points: 8, qualifies: true },
      { value: 'new_year', label: 'Ready to make lasting changes now', points: 7, qualifies: true },
      { value: 'fed_up', label: 'Tired of feeling unfit and unhealthy', points: 6, qualifies: true },
      { value: 'preventative', label: 'Want to prevent future health issues', points: 5, qualifies: true },
      { value: 'exploring', label: 'Exploring options for getting fitter', points: 3, qualifies: true }
    ]
  },
  {
    id: 'impact_areas',
    phase: 'vision',
    category: 'Performance ROI',
    question: 'What areas of your life will benefit most from getting fitter?',
    subtext: 'The benefits of fitness extend far beyond the gym',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'work_performance', label: 'Better focus and productivity at work', points: 3, qualifies: true },
      { value: 'family_energy', label: 'More energy for family activities', points: 3, qualifies: true },
      { value: 'confidence', label: 'Improved confidence and self-esteem', points: 3, qualifies: true },
      { value: 'health_markers', label: 'Better health markers (blood pressure, cholesterol)', points: 3, qualifies: true },
      { value: 'mental_health', label: 'Improved mood and mental wellbeing', points: 3, qualifies: true },
      { value: 'physical_capability', label: 'Ability to do more physical activities', points: 3, qualifies: true },
      { value: 'longevity', label: 'Healthy ageing and independence', points: 3, qualifies: true },
      { value: 'quality_of_life', label: 'Overall quality of life improvement', points: 3, qualifies: true }
    ]
  },

  // PHASE 3: READINESS - Foundation Assessment
  {
    id: 'current_foundation',
    phase: 'readiness',
    category: 'Current Foundation',
    question: 'What\'s your current exercise experience?',
    subtext: 'This helps us create the perfect starting point',
    encouragingNote: 'Whatever your experience, we\'ll design a programme that\'s right for you',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'strength_training', label: 'Regular strength training with progressive overload', points: 4, qualifies: true },
      { value: 'cardio_structured', label: 'Structured cardiovascular training', points: 3, qualifies: true },
      { value: 'movement_quality', label: 'Focus on movement quality and mobility', points: 3, qualifies: true },
      { value: 'recovery_protocols', label: 'Active recovery protocols', points: 3, qualifies: true },
      { value: 'nutrition_planned', label: 'Planned nutrition supporting performance', points: 3, qualifies: true },
      { value: 'sleep_optimised', label: 'Sleep optimisation strategies', points: 3, qualifies: true },
      { value: 'data_tracking', label: 'Track performance metrics (HRV, VO2, etc.)', points: 2, qualifies: true },
      { value: 'starting_fresh', label: 'Ready to build from scratch', points: 1, qualifies: true }
    ]
  },
  {
    id: 'time_reality',
    phase: 'readiness',
    category: 'Time Investment',
    question: 'When can you realistically train?',
    subtext: 'We\'ll design your programme around your schedule',
    encouragingNote: 'You don\'t have to be extreme, just consistent',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'early_morning', label: 'Early morning before work (5-7am)', points: 5, qualifies: true },
      { value: 'morning', label: 'Morning sessions (7-9am)', points: 4, qualifies: true },
      { value: 'lunch', label: 'Lunchtime workouts', points: 4, qualifies: true },
      { value: 'evening', label: 'Evening sessions after work', points: 4, qualifies: true },
      { value: 'weekend', label: 'Mainly weekends', points: 3, qualifies: true },
      { value: 'flexible', label: 'Varies week to week', points: 3, qualifies: true }
    ]
  },
  {
    id: 'accountability_preference',
    phase: 'readiness',
    category: 'Accountability Style',
    question: 'What type of accountability brings out your best?',
    subtext: 'We match our approach to what actually works for you',
    type: 'multi-choice',
    required: true,
    options: [
      { value: 'data_driven', label: 'Data and metrics tracking', points: 3, qualifies: true },
      { value: 'coach_checkins', label: 'Regular coach check-ins', points: 3, qualifies: true },
      { value: 'peer_group', label: 'Small group of peers (max 6)', points: 3, qualifies: true },
      { value: 'public_commitment', label: 'Public commitments and goals', points: 2, qualifies: true },
      { value: 'self_directed', label: 'Self-directed with clear framework', points: 2, qualifies: true },
      { value: 'competition', label: 'Friendly competition and challenges', points: 2, qualifies: true }
    ]
  },
  {
    id: 'consulting_style',
    phase: 'readiness',
    category: 'Consulting Approach',
    question: 'What type of coaching support works best for you?',
    subtext: 'Everyone has different preferences for support and accountability',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'in_person', label: 'In-person training sessions in Dereham', points: 5, qualifies: true },
      { value: 'online_live', label: 'Online live coaching sessions', points: 5, qualifies: true },
      { value: 'hybrid', label: 'Mix of in-person and online', points: 5, qualifies: true },
      { value: 'programme_only', label: 'Programme with regular check-ins', points: 5, qualifies: true },
      { value: 'group', label: 'Small group training (max 4 people)', points: 5, qualifies: true }
    ]
  },
  {
    id: 'commitment_level',
    phase: 'readiness',
    category: 'Commitment Scale',
    question: 'How ready are you to start your fitness journey?',
    subtext: '1 = just thinking about it, 10 = ready to start today',
    encouragingNote: 'The best time to start was yesterday, the second best time is now',
    type: 'number-input',
    required: true,
    minValue: 1,
    maxValue: 10
  },

  // PHASE 4: INVESTMENT - Strategic Investment Capacity
  {
    id: 'investment_mindset',
    phase: 'investment',
    category: 'Investment Philosophy',
    question: 'How do you approach investing in performance optimisation?',
    subtext: 'High performers understand ROI on human capital',
    encouragingNote: 'Your performance drives everything else in your life',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'strategic', label: 'Strategic investment - I invest in anything that multiplies my effectiveness', points: 10, qualifies: true },
      { value: 'selective', label: 'Selective investment - I invest when the ROI is clear', points: 8, qualifies: true },
      { value: 'calculated', label: 'Calculated investment - I need to see the data and evidence', points: 6, qualifies: true },
      { value: 'experimental', label: 'Experimental - willing to test with smaller commitments', points: 4, qualifies: true },
      { value: 'conservative', label: 'Conservative - prefer to minimise investment initially', points: 2, qualifies: true }
    ]
  },
  {
    id: 'investment_comparison',
    phase: 'investment',
    category: 'Investment Context',
    question: 'How does performance optimisation compare to your other investments?',
    subtext: 'Put this in context of your other professional and personal investments',
    encouragingNote: 'Consider: you are your most appreciating or depreciating asset',
    type: 'single-choice',
    required: true,
    qualifying: true,
    options: [
      { value: 'fraction', label: 'Fraction of what I invest in my car annually', points: 10, qualifies: true },
      { value: 'comparable_development', label: 'Comparable to professional development courses', points: 8, qualifies: true },
      { value: 'comparable_holidays', label: 'Less than my annual holiday budget', points: 8, qualifies: true },
      { value: 'significant', label: 'Would be a significant but worthwhile investment', points: 6, qualifies: true },
      { value: 'stretch', label: 'Would require careful budget consideration', points: 4, qualifies: true },
      { value: 'challenging', label: 'Would be challenging without clear ROI', points: 2, qualifies: true }
    ]
  },
  {
    id: 'programme_preference',
    phase: 'investment',
    category: 'Programme Level',
    question: 'What level of performance consulting matches your ambitions?',
    subtext: 'Each level is designed for different performance goals',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'foundation', label: 'Foundation: Build sustainable performance habits (Group, 3 months)', points: 3, qualifies: true },
      { value: 'accelerator', label: 'Performance Plus: Comprehensive optimisation (Small group, 6 months)', points: 5, qualifies: true },
      { value: 'elite', label: 'Executive Performance: Full-service consulting (1-on-1, 12 months)', points: 8, qualifies: true },
      { value: 'bespoke', label: 'Bespoke Partnership: Complete performance team (Unlimited access)', points: 10, qualifies: true },
      { value: 'unsure', label: 'Recommend based on my assessment', points: 2, qualifies: true }
    ]
  },
  {
    id: 'decision_process',
    phase: 'investment',
    category: 'Decision Process',
    question: 'What do you need to make a confident decision?',
    subtext: 'We respect that high performers make informed decisions',
    encouragingNote: 'The cost of inaction is often greater than the investment in action',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'ready_now', label: 'I\'ve seen enough - ready to discuss specifics', points: 10, qualifies: true },
      { value: 'roi_data', label: 'ROI data and case studies from similar clients', points: 8, qualifies: true },
      { value: 'trial_period', label: 'Trial period to experience the approach', points: 7, qualifies: true },
      { value: 'partner_discussion', label: 'Discussion with partner/family', points: 6, qualifies: true },
      { value: 'comparison', label: 'Compare with other options', points: 4, qualifies: true },
      { value: 'thinking', label: 'Time to think it through', points: 2, qualifies: true }
    ]
  },
  {
    id: 'transformation_vision',
    phase: 'investment',
    category: 'Your Vision',
    question: 'When you\'re operating at peak performance, what becomes possible?',
    subtext: 'Think beyond fitness - what doors open when you\'re at 100%?',
    encouragingNote: 'I\'ve seen clients achieve things they never imagined - your vision can become reality',
    type: 'text-input',
    required: true
  }
]

export function getQuestionsByPhase(phase: 'discovery' | 'vision' | 'readiness' | 'investment') {
  return assessmentQuestions.filter(q => q.phase === phase)
}

export function isQualifyingAnswer(_question: AssessmentQuestion, _answer: unknown): boolean {
  // In the new empowering approach, everyone qualifies at some level
  // We'll use scoring to determine the best programme fit instead
  return true
}

export function calculatePhaseScore(questions: AssessmentQuestion[], answers: Record<string, unknown>): number {
  const totalPoints = 0
  const maxPoints = 0
  
  questions.forEach(question => {
    if (!question.options) return
    
    const answer = answers[question.id]
    if (!answer) return
    
    if (question.type === 'single-choice') {
      const selectedOption = question.options.find(opt => opt.value === answer)
      if (selectedOption) {
        totalPoints += selectedOption.points
        maxPoints += Math.max(...question.options.map(opt => opt.points))
      }
    } else if (question.type === 'multi-choice' && Array.isArray(answer)) {
      const selectedOptions = question.options.filter(opt => answer.includes(opt.value))
      totalPoints += selectedOptions.reduce((sum, opt) => sum + opt.points, 0)
      maxPoints += question.options.reduce((sum, opt) => sum + opt.points, 0)
    } else if (question.type === 'number-input' && question.id === 'commitment_level') {
      totalPoints += (answer as number)
      maxPoints += 10
    }
  })
  
  return maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0
}

export function getPhaseInfo(phase: string) {
  const phaseData = {
    discovery: {
      title: 'Discovery',
      subtitle: 'Understanding Your Current Journey',
      description: 'Let\'s explore where you are now and what challenges you\'re facing',
      icon: '🔍',
      color: 'blue'
    },
    vision: {
      title: 'Vision',
      subtitle: 'Defining Your Success',
      description: 'Let\'s paint a picture of what success looks like for you',
      icon: '🎯',
      color: 'purple'
    },
    readiness: {
      title: 'Readiness',
      subtitle: 'Assessing Your Resources',
      description: 'Understanding your current habits and available resources',
      icon: '💪',
      color: 'green'
    },
    investment: {
      title: 'Investment',
      subtitle: 'Choosing Your Path',
      description: 'Finding the right level of support for your journey',
      icon: '🚀',
      color: 'gold'
    }
  }
  
  return phaseData[phase as keyof typeof phaseData] || phaseData.discovery
}