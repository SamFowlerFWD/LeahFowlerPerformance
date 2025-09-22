'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Target, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormData {
  firstName: string;
  email: string;
  currentTraining: string;
}

export default function PerformanceBreakthroughLeadMagnet() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    currentTraining: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/performance-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          leadMagnet: 'performance-breakthrough-assessment'
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setIsSuccess(true);

      // Track conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', {
          currency: 'GBP',
          value: 50,
        });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Identify Your Identity Barriers",
      description: "Discover what's keeping you from feeling like yourself again"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Personalised Action Plan",
      description: "Get a customised 30-day roadmap based on your assessment results"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Connect With Your Warrior",
      description: "Join hundreds of mothers on the same reclamation journey"
    }
  ];

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <h3 className="text-2xl font-bold">Success! Check Your Email</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your Performance Breakthrough Assessment is on its way to {formData.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Look out for an email from leah@leahfowlerperformance.com
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ firstName: '', email: '', currentTraining: '' });
                }}
              >
                Download Another Resource
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-navy to-teal rounded-full">
            <Download className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-navy to-teal bg-clip-text text-transparent">
            Free: Mother Identity Breakthrough Assessment
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Rediscover Yourself. Reclaim Your Strength. Transform Your Identity.
          </CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 text-teal">
                {benefit.icon}
                <h4 className="font-semibold">{benefit.title}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentTraining">Current Training Status (Optional)</Label>
            <select
              id="currentTraining"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={formData.currentTraining}
              onChange={(e) => setFormData({ ...formData, currentTraining: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="">Select your current training level</option>
              <option value="not-training">Not currently training</option>
              <option value="returning">Returning after a break</option>
              <option value="recreational">Training recreationally (1-2x/week)</option>
              <option value="committed">Committed trainer (3-4x/week)</option>
              <option value="serious">Serious athlete (5+x/week)</option>
              <option value="competitive">Competitive athlete</option>
            </select>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-navy to-teal hover:from-navy-dark hover:to-teal-dark text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Download className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Get Your Free Assessment
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              By downloading, you agree to receive performance tips and updates.
              Unsubscribe anytime. Your data is secure and never shared.
            </p>
          </div>
        </form>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center border-t pt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Join 500+ committed individuals</strong> who&apos;ve discovered their performance breakthrough
          </p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm ml-2">4.9/5 from assessment users</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}