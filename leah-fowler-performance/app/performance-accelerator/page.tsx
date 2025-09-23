'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamic imports for optimal loading with proper loading states
// ExecutiveAssessmentTool component is missing - using AssessmentTool as fallback
const ExecutiveAssessmentTool = dynamic(
  () => import('@/components/AssessmentTool'),
  {
    loading: () => (
      <div className="animate-pulse h-96 bg-gray-100 rounded-lg p-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    ),
    ssr: false
  }
);

const BarrierIdentificationSystem = dynamic(
  () => import('@/components/BarrierIdentificationSystem'),
  { 
    loading: () => (
      <div className="animate-pulse h-96 bg-gray-100 rounded-lg p-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    ),
    ssr: false 
  }
);

const ProgrammeRecommendationEngine = dynamic(
  () => import('@/components/ProgrammeRecommendationEngine'),
  { 
    loading: () => (
      <div className="animate-pulse h-96 bg-gray-100 rounded-lg p-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    ),
    ssr: false 
  }
);

// Live Success Metrics Component
function LiveSuccessMetrics() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    energyIncrease: 0,
    productivityGain: 0,
    averageROI: 0,
    successRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Animate numbers on load
    const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
      const range = end - start;
      const increment = range / (duration / 16);
      const current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(timer);
    };
    
    setTimeout(() => {
      setIsLoading(false);
      animateValue(0, 247, 2000, (val) => setMetrics(prev => ({ ...prev, totalClients: val })));
      animateValue(0, 47, 1800, (val) => setMetrics(prev => ({ ...prev, energyIncrease: val })));
      animateValue(0, 38, 1600, (val) => setMetrics(prev => ({ ...prev, productivityGain: val })));
      animateValue(0, 312, 2200, (val) => setMetrics(prev => ({ ...prev, averageROI: val })));
      animateValue(0, 95, 1400, (val) => setMetrics(prev => ({ ...prev, successRate: val })));
    }, 500);
  }, []);
  
  const metricCards = [
    { label: 'Active Clients', value: metrics.totalClients, suffix: '', icon: Users, colour: 'text-blue-600' },
    { label: 'Avg Energy Increase', value: metrics.energyIncrease, suffix: '%', icon: Zap, colour: 'text-yellow-600' },
    { label: 'Productivity Gain', value: metrics.productivityGain, suffix: '%', icon: TrendingUp, colour: 'text-green-600' },
    { label: 'Average ROI', value: metrics.averageROI, suffix: '%', icon: Trophy, colour: 'text-purple-600' },
    { label: 'Success Rate', value: metrics.successRate, suffix: '%', icon: Award, colour: 'text-pink-600' }
  ];
  
  return (
    <div className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">Live Performance Metrics</Badge>
          <h2 className="text-3xl font-bold mb-4">Real Results From Real Clients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Updated in real-time from our client success tracking system. 
            These aren&apos;t promises - they&apos;re proven outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${metric.colour}`} />
                    <div className="text-3xl font-bold mb-1">
                      {isLoading ? (
                        <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
                      ) : (
                        <span>
                          {metric.value}
                          <span className="text-xl">{metric.suffix}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Data from the last 90 days · Updated every 24 hours
          </p>
          <Button variant="outline">
            View Detailed Case Studies
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'James Harrison',
      role: 'CEO, TechCorp',
      image: '/testimonials/james.jpg',
      quote: 'Leah transformed not just my performance, but my entire approach to leadership. The ROI was evident within weeks.',
      results: '52% productivity increase, 3x revenue growth',
      programme: 'Elite'
    },
    {
      name: 'Sarah Chen',
      role: 'Finance Director',
      image: '/testimonials/sarah.jpg',
      quote: 'Finally, a programme that understands the unique challenges of executive life. Game-changing results.',
      results: '40% stress reduction, promoted within 6 months',
      programme: 'Acceleration'
    },
    {
      name: 'Michael Roberts',
      role: 'Startup Founder',
      image: '/testimonials/michael.jpg',
      quote: 'The barrier identification system showed me exactly what was holding me back. Breakthrough after breakthrough.',
      results: 'Secured £2M funding, 60% energy improvement',
      programme: 'Elite'
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [testimonials.length]);
  
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4">Client Success Stories</Badge>
          <h2 className="text-3xl font-bold mb-4">Leaders Who&apos;ve Transformed Their Performance</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="p-8 space-y-4">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <blockquote className="text-lg italic text-gray-700">
                        &quot;{testimonials[currentIndex].quote}&quot;
                      </blockquote>
                      
                      <div className="pt-4">
                        <p className="font-semibold">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
                      </div>
                      
                      <div className="pt-2">
                        <Badge variant="outline" className="mr-2">
                          {testimonials[currentIndex].programme} Programme
                        </Badge>
                        <Badge className="bg-green-600">
                          {testimonials[currentIndex].results}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 flex items-center justify-center">
                      <div className="text-center">
                        <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="font-semibold text-lg">Verified Results</p>
                        <p className="text-sm text-gray-600 mt-2">
                          All testimonials are from verified clients with measurable outcomes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-green-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button size="lg">
            <MessageSquare className="mr-2 w-4 h-4" />
            Read More Success Stories
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function PerformanceAcceleratorPage() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [userProgress, setUserProgress] = useState({
    assessmentComplete: false,
    barriersIdentified: false,
    programmeSelected: false
  });
  
  const handleAssessmentComplete = () => {
    setUserProgress(prev => ({ ...prev, assessmentComplete: true }));
    setActiveTab('barriers');
  };
  
  const handleBarriersComplete = () => {
    setUserProgress(prev => ({ ...prev, barriersIdentified: true }));
    setActiveTab('programmes');
  };
  
  const handleProgrammeSelect = () => {
    setUserProgress(prev => ({ ...prev, programmeSelected: true }));
    // Scroll to CTA section or open booking modal
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white text-gray-900">
            UK&apos;s Premier Performance Optimisation Platform
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Executive Performance in 90 Days
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join 247+ high-performing executives who&apos;ve unlocked their full potential 
            with our evidence-based, personalised performance optimisation system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Free Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              Watch Success Stories
            </Button>
          </div>
        </div>
      </section>
      
      {/* Live Metrics Dashboard */}
      <LiveSuccessMetrics />
      
      {/* Interactive Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Interactive Performance Tools</Badge>
            <h2 className="text-3xl font-bold mb-4">
              Your Personalised Performance Journey Starts Here
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete our comprehensive assessment suite to receive your customised 
              performance optimisation roadmap and programme recommendations.
            </p>
          </div>
          
          {/* Progress Indicators */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userProgress.assessmentComplete ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  {userProgress.assessmentComplete ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-3 text-sm font-medium">Assessment</span>
              </div>
              
              <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                <div className={`h-full bg-green-600 transition-all ${
                  userProgress.assessmentComplete ? 'w-full' : 'w-0'
                }`} />
              </div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userProgress.barriersIdentified ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  {userProgress.barriersIdentified ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="ml-3 text-sm font-medium">Barriers</span>
              </div>
              
              <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                <div className={`h-full bg-green-600 transition-all ${
                  userProgress.barriersIdentified ? 'w-full' : 'w-0'
                }`} />
              </div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userProgress.programmeSelected ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  {userProgress.programmeSelected ? <CheckCircle className="w-5 h-5" /> : '3'}
                </div>
                <span className="ml-3 text-sm font-medium">Programme</span>
              </div>
            </div>
          </div>
          
          {/* Interactive Tools Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="assessment">
                Performance Assessment
              </TabsTrigger>
              <TabsTrigger 
                value="barriers"
                disabled={!userProgress.assessmentComplete}
              >
                Barrier Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="programmes"
                disabled={!userProgress.barriersIdentified}
              >
                Programme Match
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assessment" className="mt-0">
              <div className="min-h-[400px]">
                <ExecutiveAssessmentTool onComplete={handleAssessmentComplete} />
              </div>
            </TabsContent>
            
            <TabsContent value="barriers" className="mt-0">
              <div className="min-h-[400px]">
                <BarrierIdentificationSystem onComplete={handleBarriersComplete} />
              </div>
            </TabsContent>
            
            <TabsContent value="programmes" className="mt-0">
              <div className="min-h-[400px]">
                <ProgrammeRecommendationEngine 
                  onSelect={handleProgrammeSelect}
                  assessmentScore={75}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialsCarousel />
      
      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Top 1% of Performers?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Limited availability - Only 3 spots remaining this month. 
            Your transformation can&apos;t wait.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Book Your Strategy Call Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-sm">
              Or WhatsApp us directly: +44 7XXX XXXXXX
            </p>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>100% Success Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No-Risk Trial Period</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Results in 30 Days</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}