import { AssessmentQuestion, calculatePhaseScore } from './assessment-questions'

export interface ClientProfile {
  // Core Profile
  qualified: boolean // Everyone qualifies now, just at different programme levels
  tier: 'foundation' | 'accelerator' | 'elite' | 'bespoke'
  performanceLevel: string
  investmentLevel: 'explorer' | 'ready' | 'committed' | 'premium'
  
  // Scores
  readinessScore: number
  commitmentScore: number
  urgencyScore: number
  
  // Personalised Insights
  strengths: string[]
  opportunities: string[] // Changed from 'gaps' to be more positive
  primaryChallenge: string
  primaryGoal: string
  
  // Recommendations
  recommendedProgramme: string
  estimatedInvestment: string
  nextSteps: string[]
  personalMessage: string // New: personalised encouraging message
}

export function analyzeClientProfile(
  questions: AssessmentQuestion[],
  answers: Record<string, unknown>
): ClientProfile {
  // Calculate phase scores
  const discoveryQuestions = questions.filter(q => q.phase === 'discovery')
  const visionQuestions = questions.filter(q => q.phase === 'vision')
  const readinessQuestions = questions.filter(q => q.phase === 'readiness')
  const investmentQuestions = questions.filter(q => q.phase === 'investment')
  
  const discoveryScore = calculatePhaseScore(discoveryQuestions, answers)
  const visionScore = calculatePhaseScore(visionQuestions, answers)
  const readinessScore = calculatePhaseScore(readinessQuestions, answers)
  const investmentScore = calculatePhaseScore(investmentQuestions, answers)
  
  // Calculate overall scores
  const overallReadiness = (discoveryScore + visionScore + readinessScore) / 3
  const commitmentScore = (answers.commitment_level as number) || 5
  const urgencyScore = calculateUrgencyScore(answers)
  
  // Determine tier based on responses (everyone qualifies for something)
  const tier = determineTier(answers, investmentScore, overallReadiness)
  
  // Determine investment level
  const investmentLevel = determineInvestmentLevel(answers)
  
  // Analyze strengths from their current habits
  const strengths = analyzeStrengths(answers)
  
  // Identify opportunities (not gaps)
  const opportunities = identifyOpportunities(answers)
  
  // Get primary challenge and goal
  const primaryChallenge = getPrimaryChallenge(answers)
  const primaryGoal = getPrimaryGoal(answers)
  
  // Generate performance level description
  const performanceLevel = generatePerformanceLevel(answers, overallReadiness)
  
  // Generate recommendations
  const { programme, investment } = generateRecommendations(tier, investmentLevel, urgencyScore)
  
  // Generate next steps
  const nextSteps = generateNextSteps(tier, urgencyScore, commitmentScore)
  
  // Generate personal message
  const personalMessage = generatePersonalMessage(answers, tier, primaryGoal)
  
  return {
    qualified: true, // Everyone qualifies in the new approach
    tier,
    performanceLevel,
    investmentLevel,
    readinessScore: overallReadiness,
    commitmentScore,
    urgencyScore,
    strengths,
    opportunities,
    primaryChallenge,
    primaryGoal,
    recommendedProgramme: programme,
    estimatedInvestment: investment,
    nextSteps,
    personalMessage
  }
}

function calculateUrgencyScore(answers: Record<string, unknown>): number {
  const timelineMap: Record<string, number> = {
    'critical_event': 10,
    'health_scare': 9,
    'career_opportunity': 8,
    'life_transition': 7,
    'fed_up': 6,
    'preventative': 5,
    'curious': 3
  }
  
  const decisionMap: Record<string, number> = {
    'ready_now': 10,
    'roi_data': 8,
    'trial_period': 7,
    'partner_discussion': 6,
    'comparison': 4,
    'thinking': 2
  }
  
  const timelineScore = timelineMap[answers.timeline_urgency as string] || 5
  const decisionScore = decisionMap[answers.decision_process as string] || 5
  
  return (timelineScore + decisionScore) / 2
}

function determineTier(
  answers: Record<string, unknown>,
  investmentScore: number,
  readinessScore: number
): 'foundation' | 'accelerator' | 'elite' | 'bespoke' {
  // Check programme preference first
  if (answers.programme_preference === 'bespoke') {
    return 'bespoke'
  }
  
  if (answers.programme_preference === 'elite' && investmentScore >= 60) {
    return 'elite'
  }
  
  // Determine based on scores and investment capacity
  const currentInvestment = answers.investment_comparison as string
  const investmentMindset = answers.investment_mindset as string
  
  if (investmentMindset === 'strategic' && ['fraction', 'comparable_development', 'comparable_holidays'].includes(currentInvestment)) {
    return 'bespoke'
  }
  
  if (investmentScore >= 70 && readinessScore >= 60) {
    return 'elite'
  }
  
  if (investmentScore >= 40 && readinessScore >= 40) {
    return 'accelerator'
  }
  
  return 'foundation'
}

function determineInvestmentLevel(answers: Record<string, unknown>): 'explorer' | 'ready' | 'committed' | 'premium' {
  const currentInvestment = answers.investment_comparison as string
  const mindset = answers.investment_mindset as string
  
  if (mindset === 'strategic' && ['fraction', 'comparable_development', 'comparable_holidays'].includes(currentInvestment)) {
    return 'premium'
  }
  
  if (['selective', 'strategic'].includes(mindset) && ['comparable_development', 'comparable_holidays', 'significant'].includes(currentInvestment)) {
    return 'committed'
  }
  
  if (['calculated', 'selective'].includes(mindset)) {
    return 'ready'
  }
  
  return 'explorer'
}

function analyzeStrengths(answers: Record<string, unknown>): string[] {
  const strengths: string[] = []
  
  // Check current foundation
  const foundation = (answers.current_foundation as string[]) || []
  if (foundation.includes('strength_training')) {
    strengths.push('Foundation of strength training with progressive overload')
  }
  if (foundation.includes('cardio_structured')) {
    strengths.push('Cardiovascular base already established')
  }
  if (foundation.includes('movement_quality')) {
    strengths.push('Focus on movement quality - essential for longevity')
  }
  if (foundation.includes('data_tracking')) {
    strengths.push('Data-driven approach to performance')
  }
  if (foundation.includes('recovery_protocols')) {
    strengths.push('Understanding that recovery drives adaptation')
  }
  
  // Check commitment level
  if ((answers.commitment_level as number) >= 8) {
    strengths.push('Ready to invest seriously in performance optimisation')
  }
  
  // Check accountability preference
  const accountability = (answers.accountability_preference as string[]) || []
  if (accountability.includes('data_driven')) {
    strengths.push('Analytical mindset perfect for performance consulting')
  }
  if (accountability.includes('coach_checkins')) {
    strengths.push('Values professional accountability and guidance')
  }
  
  // Check previous experience
  const experience = (answers.tried_before as string[]) || []
  if (experience.includes('executive_coach')) {
    strengths.push('Experience with high-level professional development')
  }
  
  // Ensure we always highlight something positive
  if (strengths.length === 0) {
    strengths.push('Ready to build performance from the ground up')
    strengths.push('Open to evidence-based optimisation')
  }
  
  return strengths
}

function identifyOpportunities(answers: Record<string, unknown>): string[] {
  const opportunities: string[] = []
  const challenges = (answers.current_challenges as string[]) || []
  
  // Map real-world performance gaps to opportunities
  if (challenges.includes('afternoon_crash')) {
    opportunities.push('Eliminate energy crashes with metabolic optimisation')
  }
  if (challenges.includes('morning_struggle')) {
    opportunities.push('Transform mornings with circadian rhythm protocols')
  }
  if (challenges.includes('meetings_fog')) {
    opportunities.push('Achieve laser focus when it matters most')
  }
  if (challenges.includes('family_exhausted')) {
    opportunities.push('Have energy to excel at work AND home')
  }
  if (challenges.includes('stairs_breathless')) {
    opportunities.push('Build functional fitness for real-world demands')
  }
  if (challenges.includes('stress_paralysis')) {
    opportunities.push('Develop elite-level stress resilience')
  }
  if (challenges.includes('weekend_recovery')) {
    opportunities.push('Transform weekends from recovery to living')
  }
  if (challenges.includes('travel_recovery')) {
    opportunities.push('Master travel without performance drops')
  }
  
  // Check foundation gaps as opportunities
  const foundation = (answers.current_foundation as string[]) || []
  if (!foundation.includes('strength_training')) {
    opportunities.push('Build strength that translates to daily performance')
  }
  if (!foundation.includes('data_tracking')) {
    opportunities.push('Implement data-driven performance tracking')
  }
  
  // Ensure we frame everything positively
  if (opportunities.length === 0) {
    opportunities.push('Elevate from good to exceptional performance')
    opportunities.push('Unlock your next level of capability')
  }
  
  return opportunities.slice(0, 4) // Limit to 4 key opportunities
}

function getPrimaryChallenge(answers: Record<string, unknown>): string {
  const challenges = (answers.current_challenges as string[]) || []
  
  // Priority order for real-world performance challenges
  const priorityMap: Record<string, string> = {
    'afternoon_crash': 'Energy crashes destroying afternoon productivity',
    'morning_struggle': 'Morning performance significantly below optimal',
    'meetings_fog': 'Cognitive performance failing in critical moments',
    'family_exhausted': 'Too depleted to be present for what matters most',
    'stairs_breathless': 'Physical capacity limiting daily function',
    'stress_paralysis': 'Stress response undermining strategic thinking',
    'weekend_recovery': 'Living for recovery instead of thriving',
    'travel_recovery': 'Business travel compromising performance'
  }
  
  for (const challenge of ['afternoon_crash', 'morning_struggle', 'meetings_fog', 'family_exhausted', 'stairs_breathless', 'stress_paralysis', 'weekend_recovery', 'travel_recovery']) {
    if (challenges.includes(challenge)) {
      return priorityMap[challenge]
    }
  }
  
  return 'Ready to optimise already strong performance'
}

function getPrimaryGoal(answers: Record<string, unknown>): string {
  const goalMap: Record<string, string> = {
    'boardroom_energy': 'Command presence with sustained energy',
    'family_vitality': 'Excel professionally while thriving personally',
    'cognitive_edge': 'Achieve cognitive performance advantage',
    'stress_resilience': 'Perform like an athlete under pressure',
    'physical_capability': 'Build functional strength for life',
    'longevity_vitality': 'Optimise for decades of peak performance',
    'role_model': 'Become the performance standard others follow',
    'unstoppable': 'Achieve unstoppable momentum in all areas'
  }
  
  return goalMap[answers.primary_goal as string] || 'Achieve peak performance optimisation'
}

function generatePerformanceLevel(answers: Record<string, unknown>, readinessScore: number): string {
  const baseline = answers.performance_baseline as string
  
  if (readinessScore >= 80 || baseline === 'excellent') {
    return 'Elite Performer - Ready for Advanced Training'
  } else if (readinessScore >= 60 || baseline === 'good') {
    return 'High Achiever - Ready for Strength Transformation'
  } else if (readinessScore >= 40 || baseline === 'average') {
    return 'Ambitious Parent - Building Strength Foundation'
  } else {
    return 'Fitness Explorer - Beginning Your Journey'
  }
}

function generateRecommendations(
  tier: string,
  investmentLevel: string,
  urgencyScore: number
): { programme: string; investment: string } {
  const programmes = {
    foundation: {
      name: 'Pathway to Endurance',
      description: 'Online foundation programme with progressive strength training and video demonstrations',
      investment: '£12 per month'
    },
    accelerator: {
      name: 'Silver Package',
      description: 'Weekly 1:1 personal training with nutrition guidance and monthly progress reviews',
      investment: '£140 per month'
    },
    elite: {
      name: 'Gold Package',
      description: '2x weekly 1:1 sessions with advanced programming and recovery protocols',
      investment: '£250 per month'
    },
    bespoke: {
      name: 'Semi-Private Coaching',
      description: '2:1 partner training with personalised programming and nutrition support',
      investment: '£90 per month per person'
    }
  }
  
  const selected = programmes[tier as keyof typeof programmes]
  
  // Add urgency modifier
  const programme = `${selected.name}: ${selected.description}`
  if (urgencyScore >= 8) {
    programme += ' (Immediate start available with fast-track onboarding)'
  }
  
  return {
    programme,
    investment: selected.investment
  }
}

function generateNextSteps(tier: string, urgencyScore: number, commitmentScore: number): string[] {
  const steps: string[] = []
  
  // First step is always a strategy session
  if (urgencyScore >= 8) {
    steps.push('Schedule your Free Consultation within 48 hours')
  } else {
    steps.push('Book your complimentary Consultation')
  }
  
  // Second step based on tier
  if (tier === 'bespoke' || tier === 'elite') {
    steps.push('Complete comprehensive performance testing (VO2 Max, movement screen, biomarkers)')
    steps.push('Receive your personalised Training Programme')
    steps.push('Begin weekly consulting sessions with measurable milestones')
  } else if (tier === 'accelerator') {
    steps.push('Complete baseline performance assessments')
    steps.push('Start with your personalised 90-day protocol')
    steps.push('Join small group mastermind (max 6 high performers)')
  } else {
    steps.push('Complete functional movement assessment')
    steps.push('Begin foundation training with weekly group sessions')
    steps.push('Track progress with monthly performance metrics')
  }
  
  // Add commitment-based step
  if (commitmentScore >= 8) {
    steps.push('Achieve first performance milestone within 30 days')
  }
  
  return steps
}

function generatePersonalMessage(answers: Record<string, unknown>, tier: string, primaryGoal: string): string {
  const transformationVision = (answers.transformation_vision as string) || ''
  const performanceCost = (answers.performance_cost as string) || ''
  
  let message = ''
  
  // Add Leah's authentic voice based on tier
  if (tier === 'bespoke' || tier === 'elite') {
    message = `As someone who's transformed my own life through performance optimisation, I recognise a kindred spirit. You understand that ${primaryGoal.toLowerCase()} isn't about fitness—it's about becoming unstoppable in every arena of your life. `
  } else if (tier === 'accelerator') {
    message = `Your assessment shows you're ready for real change. Like me, you've realised that feeling exhausted isn't "just part of life." The Silver programme will help you ${primaryGoal.toLowerCase()} through proven, data-driven methods. `
  } else {
    message = `Starting your fitness journey takes courage. I remember thinking I'd never have energy again after my third child. I was wrong. Our programmes will help you ${primaryGoal.toLowerCase()} step by step. `
  }
  
  // Address their vision
  if (transformationVision) {
    message += `Your vision: "${transformationVision.substring(0, 100)}..." That's not just possible—I've seen it happen countless times. `
  }
  
  // Address the cost of inaction
  if (performanceCost) {
    message += `You've identified what poor performance is costing you. Now let's flip that equation. `
  }
  
  message += "Together, we'll build the performance foundation that makes everything else in your life possible."
  
  return message
}

export function generateDetailedReport(profile: ClientProfile, _answers: Record<string, unknown>): string {
  const sections = [
    `# Strength & Fitness Assessment Report`,
    ``,
    `## Executive Summary`,
    `Fitness Classification: ${profile.performanceLevel}`,
    `Overall Readiness Score: ${profile.readinessScore.toFixed(0)}%`,
    `Investment Readiness: ${profile.commitmentScore}/10`,
    `Recommended Tier: ${profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)}`,
    ``,
    `## Your Strengths`,
    profile.strengths.map(s => `• ${s}`).join('\n'),
    ``,
    `## Areas for Growth`,
    profile.opportunities.map(o => `• ${o}`).join('\n'),
    ``,
    `## Your Primary Goals`,
    `Current Limitation: ${profile.primaryChallenge}`,
    `Fitness Goal: ${profile.primaryGoal}`,
    ``,
    `## Recommended Consulting Programme`,
    `${profile.recommendedProgramme}`,
    `Investment Level: ${profile.estimatedInvestment}`,
    ``,
    `## Implementation Roadmap`,
    profile.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
    ``,
    `## Personal Message from Leah`,
    profile.personalMessage,
    ``,
    `---`,
    `Leah Fowler Performance`,
    `Strength Coach for Parents`,
    `"A strong body makes for a strong person"`
  ]
  
  return sections.join('\n')
}