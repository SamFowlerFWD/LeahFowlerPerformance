'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  Target,
  Zap,
  Trophy,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Shield,
  Heart,
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Smartphone,
  Video,
  MessageCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Programme {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  duration: string;
  intensity: 'Foundation' | 'Moderate' | 'Intensive';
  matchScore?: number;
  features: string[];
  outcomes: string[];
  ideal_for: string[];
  support_level: string;
  colour: string;
  icon: React.ElementType;
  testimonial?: {
    name: string;
    role: string;
    quote: string;
    result: string;
  };
}

const PROGRAMMES: Programme[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Build Your Performance Base',
    price: 297,
    originalPrice: 497,
    duration: '12 weeks',
    intensity: 'Foundation',
    features: [
      'Monthly group consultations',
      'Foundation programme modules',
      'Performance tracking dashboard',
      'Community support access',
      'Quarterly progress reviews',
      'Email support (48hr response)'
    ],
    outcomes: [
      '20-30% energy increase',
      'Improved sleep quality',
      'Basic habit formation',
      'Stress reduction techniques',
      'Weekly performance metrics'
    ],
    ideal_for: [
      'New to performance optimisation',
      'Limited time availability',
      'Building foundational habits',
      'Budget-conscious mothers'
    ],
    support_level: 'Community + Monthly Check-ins',
    colour: 'from-blue-500 to-blue-600',
    icon: Target,
    testimonial: {
      name: 'Sarah Mitchell',
      role: 'Busy Mum',
      quote: 'Perfect starting point for my performance journey',
      result: '25% energy increase in 8 weeks'
    }
  },
  {
    id: 'acceleration',
    name: 'Acceleration',
    tagline: 'Accelerate Your Excellence',
    price: 997,
    originalPrice: 1497,
    duration: '16 weeks',
    intensity: 'Moderate',
    features: [
      'Bi-weekly 1:1 consultations',
      'Custom programme design',
      'Advanced performance modules',
      'Monthly progress reviews',
      'Priority email support (24hr)',
      'Wearable device integration',
      'Nutrition optimisation plan'
    ],
    outcomes: [
      '40-50% performance boost',
      'Life balance enhancement',
      'Advanced stress resilience',
      'Peak cognitive function',
      'Work-life integration mastery'
    ],
    ideal_for: [
      'Busy mothers seeking transformation',
      'Ready for transformation',
      '4-6 hours weekly commitment',
      'Seeking measurable ROI'
    ],
    support_level: 'Bi-weekly 1:1 + Priority Support',
    colour: 'from-green-500 to-green-600',
    icon: Zap,
    testimonial: {
      name: 'James Chen',
      role: 'Father of 2',
      quote: 'Transformed how I manage family and fitness',
      result: '45% energy gain, family life transformed'
    }
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Mother Fitness Mastery',
    price: 2997,
    originalPrice: 4997,
    duration: '24 weeks',
    intensity: 'Intensive',
    features: [
      'Weekly 1:1 consultations',
      'Fully personalised programme',
      'Comprehensive health screening',
      'Quarterly performance reviews',
      'Direct WhatsApp support',
      'Family wellness integration',
      'Life balance planning',
      'Family wellness workshops',
      'Annual maintenance programme'
    ],
    outcomes: [
      '60%+ total performance gain',
      'Peak fitness mastery',
      'Life transformation metrics',
      'Sustainable excellence systems',
      'Sustainable fitness development'
    ],
    ideal_for: [
      'Mothers seeking transformation',
      'Busy mothers',
      'Strong mothers',
      'Total life optimisation'
    ],
    support_level: 'Weekly 1:1 + Direct Access',
    colour: 'from-purple-500 to-purple-600',
    icon: Trophy,
    testimonial: {
      name: 'Victoria Reynolds',
      role: 'Mother of 3',
      quote: 'Investment that transformed my entire family life',
      result: 'Complete transformation in health and family wellbeing'
    }
  }
];

const COMPARISON_FEATURES = [
  { category: 'Consultations', foundation: 'Monthly Group', acceleration: 'Bi-weekly 1:1', elite: 'Weekly 1:1' },
  { category: 'Programme Design', foundation: 'Template-based', acceleration: 'Semi-custom', elite: 'Fully personalised' },
  { category: 'Support Response', foundation: '48 hours', acceleration: '24 hours', elite: 'Direct access' },
  { category: 'Progress Reviews', foundation: 'Quarterly', acceleration: 'Monthly', elite: 'Weekly + Quarterly' },
  { category: 'Wearable Integration', foundation: '❌', acceleration: '✅', elite: '✅ Premium' },
  { category: 'Nutrition Planning', foundation: 'Basic guide', acceleration: 'Custom plan', elite: 'Chef consultation' },
  { category: 'Family Integration', foundation: '❌', acceleration: 'Optional', elite: '✅ Included' },
  { category: 'Progress Tracking', foundation: 'Basic', acceleration: 'Advanced', elite: 'Premium dashboard' },
  { category: 'Success Guarantee', foundation: 'Satisfaction', acceleration: 'Results-based', elite: 'Performance guarantee' }
];

interface RecommendationEngineProps {
  assessmentScore?: number;
  userProfile?: {
    role_level?: string;
    investment_level?: string;
    barriers?: string[];
    goals?: string[];
  };
  onSelect?: (programme: Programme) => void;
}

export default function ProgrammeRecommendationEngine({
  assessmentScore = 65,
  userProfile,
  onSelect
}: RecommendationEngineProps) {
  const [selectedProgramme, setSelectedProgramme] = useState<string>('acceleration');
  const [comparisonView, setComparisonView] = useState(false);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [isCalculating, setIsCalculating] = useState(true);
  const [showUrgency, setShowUrgency] = useState(false);
  
  useEffect(() => {
    calculateMatchScores();
    // Show urgency message after 5 seconds
    setTimeout(() => setShowUrgency(true), 5000);
  }, [assessmentScore, userProfile]);
  
  const calculateMatchScores = () => {
    setIsCalculating(true);
    
    const scores: Record<string, number> = {};
    
    // Foundation programme matching
    let foundationScore = 50;
    if (assessmentScore < 50) foundationScore += 30;
    if (userProfile?.investment_level === 'low') foundationScore += 20;
    if (userProfile?.role_level === 'mother') foundationScore += 15;
    scores.foundation = Math.min(foundationScore, 100);
    
    // Acceleration programme matching
    let accelerationScore = 60;
    if (assessmentScore >= 50 && assessmentScore < 75) accelerationScore += 30;
    if (userProfile?.investment_level === 'moderate') accelerationScore += 20;
    if (['busy-mum', 'working-mum'].includes(userProfile?.role_level || '')) accelerationScore += 15;
    scores.acceleration = Math.min(accelerationScore, 100);
    
    // Elite programme matching
    let eliteScore = 40;
    if (assessmentScore >= 75) eliteScore += 35;
    if (userProfile?.investment_level === 'high' || userProfile?.investment_level === 'premium') eliteScore += 25;
    if (['ambitious-mum', 'fitness-focused'].includes(userProfile?.role_level || '')) eliteScore += 20;
    scores.elite = Math.min(eliteScore, 100);
    
    setMatchScores(scores);
    
    // Auto-select best match
    const bestMatch = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];
    setSelectedProgramme(bestMatch);
    
    setTimeout(() => setIsCalculating(false), 1500);
  };
  
  const handleProgrammeSelect = async (programme: Programme) => {
    setSelectedProgramme(programme.id);
    
    // Track engagement
    try {
      await supabase.from('engagement_tracking').insert({
        session_id: `programme_${Date.now()}`,
        event_type: 'programme_viewed',
        event_data: { 
          programme: programme.name,
          price: programme.price,
          match_score: matchScores[programme.id]
        },
        page_url: window.location.href
      });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
    
    onSelect?.(programme);
  };
  
  const renderProgrammeCard = (programme: Programme, isRecommended: boolean = false) => {
    const Icon = programme.icon;
    const matchScore = matchScores[programme.id] || 0;
    const isSelected = selectedProgramme === programme.id;
    
    return (
      <motion.div
        key={programme.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative h-full",
          isRecommended && "ring-2 ring-green-500 ring-offset-2 rounded-lg"
        )}
      >
        {isRecommended && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 z-10">
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended for You
          </Badge>
        )}
        
        <Card 
          className={cn(
            "h-full cursor-pointer transition-all",
            isSelected && "border-green-500 shadow-lg"
          )}
          onClick={() => handleProgrammeSelect(programme)}
        >
          <CardHeader className={cn("text-white", `bg-gradient-to-r ${programme.colour}`)}>
            <div className="flex items-start justify-between">
              <Icon className="w-8 h-8" />
              {matchScore > 0 && (
                <Badge variant="secondary" className="bg-white text-gray-900">
                  {matchScore}% Match
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl mt-4">{programme.name}</CardTitle>
            <CardDescription className="text-white/90">
              {programme.tagline}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Pricing */}
            <div className="text-center">
              <div className="flex items-baseline justify-center space-x-2">
                {programme.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    £{programme.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold">£{programme.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{programme.duration} programme</p>
              {programme.originalPrice && (
                <Badge variant="destructive" className="mt-2">
                  Save £{programme.originalPrice - programme.price}
                </Badge>
              )}
            </div>
            
            {/* Key Features */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">What\'s Included:</h4>
              <ul className="space-y-2">
                {programme.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {programme.features.length > 5 && (
                <p className="text-sm text-gray-500">
                  +{programme.features.length - 5} more features
                </p>
              )}
            </div>
            
            {/* Expected Outcomes */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Expected Results:</h4>
              <div className="space-y-1">
                {programme.outcomes.slice(0, 3).map((outcome, i) => (
                  <div key={i} className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Testimonial */}
            {programme.testimonial && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-600 mb-2">
                    "{programme.testimonial.quote}"
                  </p>
                  <div className="text-xs">
                    <p className="font-semibold">{programme.testimonial.name}</p>
                    <p className="text-gray-500">{programme.testimonial.role}</p>
                    <Badge variant="outline" className="mt-1">
                      {programme.testimonial.result}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Support Level */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Support:</span>
                <span className="font-medium">{programme.support_level}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Intensity:</span>
                <Badge variant="outline">{programme.intensity}</Badge>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg"
              variant={isSelected ? "default" : "outline"}
            >
              {isSelected ? 'Selected' : 'Select This Programme'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };
  
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Brain className="w-12 h-12 text-green-600 mx-auto animate-pulse" />
              <h3 className="text-xl font-semibold">Analysing Your Profile</h3>
              <p className="text-gray-600">Matching you with the perfect programme...</p>
              <Progress value={66} className="max-w-xs mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header with toggle */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Your Personalised Programme Recommendations</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Based on your assessment, we\'ve identified the programmes that will deliver 
          the best results for your specific needs and goals.
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={!comparisonView ? "default" : "outline"}
            onClick={() => setComparisonView(false)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Programme Details
          </Button>
          <Button
            variant={comparisonView ? "default" : "outline"}
            onClick={() => setComparisonView(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Compare All
          </Button>
        </div>
      </div>
      
      {/* Urgency Banner */}
      <AnimatePresence>
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-900">
                        Limited Availability: Only 3 spots remaining this month
                      </p>
                      <p className="text-sm text-orange-700">
                        Next cohort starts in 7 days - Secure your transformation now
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Reserve My Spot
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!comparisonView ? (
        // Card View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROGRAMMES.map(programme => {
            const isRecommended = programme.id === Object.entries(matchScores)
              .reduce((a, b) => matchScores[a[0]] > matchScores[b[0]] ? a : b)[0];
            return renderProgrammeCard(programme, isRecommended);
          })}
        </div>
      ) : (
        // Comparison Table View
        <Card>
          <CardHeader>
            <CardTitle>Programme Comparison</CardTitle>
            <CardDescription>
              See how each programme level supports your transformation journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Target className="w-5 h-5 text-blue-500 mb-1" />
                        <span>Foundation</span>
                        <Badge variant="outline" className="mt-1">£297</Badge>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5 text-green-500 mb-1" />
                        <span>Acceleration</span>
                        <Badge variant="outline" className="mt-1">£997</Badge>
                        {matchScores.acceleration === Math.max(...Object.values(matchScores)) && (
                          <Badge className="mt-1 bg-green-600">Best Match</Badge>
                        )}
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <Trophy className="w-5 h-5 text-purple-500 mb-1" />
                        <span>Elite</span>
                        <Badge variant="outline" className="mt-1">£2997</Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((feature, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 font-medium">{feature.category}</td>
                      <td className="text-center py-3 px-4">{feature.foundation}</td>
                      <td className="text-center py-3 px-4 font-semibold text-green-600">
                        {feature.acceleration}
                      </td>
                      <td className="text-center py-3 px-4">{feature.elite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROGRAMMES.map(programme => (
                <Button
                  key={programme.id}
                  variant={selectedProgramme === programme.id ? "default" : "outline"}
                  onClick={() => handleProgrammeSelect(programme)}
                  className="w-full"
                >
                  Choose {programme.name}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Value Proposition */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <Shield className="w-10 h-10 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold">100% Success Guarantee</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We\'re so confident in our approach that we guarantee measurable improvements 
              within 30 days or we\'ll work with you for free until you see results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No-risk trial period</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Flexible payment plans</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Next Steps CTA */}
      <div className="text-center space-y-4 pt-8">
        <h3 className="text-2xl font-bold">Ready to Transform Your Performance?</h3>
        <p className="text-gray-600 max-w-xl mx-auto">
          Join hundreds of mothers who\'ve already unlocked their strength potential. 
          Your transformation starts with a single decision.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button size="lg" className="min-w-[200px]">
            <Calendar className="w-4 h-4 mr-2" />
            Book Strategy Call
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px]">
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}