'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Zap,
  Target,
  Trophy,
  Sparkles,
  ArrowUp,
  UserCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'signup' | 'achievement' | 'assessment' | 'booking' | 'testimonial' | 'milestone';
  content: string;
  subtext?: string;
  icon: any;
  color: string;
  location?: string;
  timestamp: string;
  programme?: string;
}

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Notification templates with realistic UK data
  const notificationTemplates: Notification[] = [
    {
      id: '1',
      type: 'signup',
      content: 'James from London just started the Gold Package',
      subtext: 'Joining 500+ strong parents',
      icon: UserCheck,
      color: 'from-purple-600 to-blue-600',
      location: 'London',
      timestamp: '2 minutes ago',
      programme: 'Gold'
    },
    {
      id: '2',
      type: 'achievement',
      content: 'Sarah M. achieved 52% strength increase',
      subtext: 'After 8 weeks with Silver Package',
      icon: Trophy,
      color: 'from-green-600 to-emerald-600',
      location: 'Manchester',
      timestamp: '5 minutes ago',
      programme: 'Silver'
    },
    {
      id: '3',
      type: 'assessment',
      content: 'Mother from Birmingham completed assessment',
      subtext: 'Score: 78/100 - High Performance Potential',
      icon: Target,
      color: 'from-blue-600 to-cyan-600',
      location: 'Birmingham',
      timestamp: '7 minutes ago'
    },
    {
      id: '4',
      type: 'booking',
      content: '3 strategy calls booked in the last hour',
      subtext: 'Only 2 spots remaining this week',
      icon: Calendar,
      color: 'from-orange-600 to-red-600',
      timestamp: 'Just now'
    },
    {
      id: '5',
      type: 'testimonial',
      content: 'David K: "Best investment in my health"',
      subtext: '⭐⭐⭐⭐⭐ Verified client review',
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      location: 'Edinburgh',
      timestamp: '12 minutes ago'
    },
    {
      id: '6',
      type: 'milestone',
      content: '£2.3M collective ROI generated for clients',
      subtext: 'Measured across 247 mothers',
      icon: TrendingUp,
      color: 'from-green-600 to-blue-600',
      timestamp: 'This month'
    },
    {
      id: '7',
      type: 'achievement',
      content: 'Mark T. achieved fitness breakthrough',
      subtext: 'After 3 months with Gold training',
      icon: Award,
      color: 'from-purple-600 to-pink-600',
      location: 'Leeds',
      timestamp: '15 minutes ago',
      programme: 'Gold'
    },
    {
      id: '8',
      type: 'signup',
      content: 'Mother from London joined',
      subtext: 'Pathway to Endurance - Starting today',
      icon: Users,
      color: 'from-blue-600 to-purple-600',
      location: 'London',
      timestamp: '8 minutes ago',
      programme: 'Pathway'
    },
    {
      id: '9',
      type: 'achievement',
      content: 'Lisa H. eliminated burnout completely',
      subtext: 'Energy levels up 64% in 6 weeks',
      icon: Zap,
      color: 'from-yellow-600 to-green-600',
      location: 'Bristol',
      timestamp: '18 minutes ago'
    },
    {
      id: '10',
      type: 'booking',
      content: 'Mother from Norwich booked consultation',
      subtext: 'Interested in Gold Package',
      icon: Sparkles,
      color: 'from-pink-600 to-purple-600',
      location: 'Cambridge',
      timestamp: '4 minutes ago'
    }
  ];

  // Show notifications cyclically
  useEffect(() => {
    const showNotification = () => {
      // Don't show if user has seen too many
      if (notificationHistory.length > 10) return;

      // Get a random notification that hasn't been shown recently
      const availableNotifications = notificationTemplates.filter(
        n => !notificationHistory.slice(-3).includes(n.id)
      );
      
      if (availableNotifications.length === 0) return;

      const randomNotification = availableNotifications[
        Math.floor(Math.random() * availableNotifications.length)
      ];

      setCurrentNotification(randomNotification);
      setIsVisible(true);
      setNotificationHistory(prev => [...prev, randomNotification.id]);

      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Initial delay of 10 seconds, then show every 30-45 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
      
      // Set up recurring notifications
      const interval = setInterval(() => {
        showNotification();
      }, 30000 + Math.random() * 15000); // 30-45 seconds randomly

      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, [notificationHistory]);

  // Format location for display
  const formatLocation = (location?: string) => {
    if (!location) return null;
    return (
      <span className="flex items-center text-xs text-gray-600">
        <MapPin className="w-3 h-3 mr-1" />
        {location}
      </span>
    );
  };

  // Get programme badge color
  const getProgrammeBadge = (programme?: string) => {
    if (!programme) return null;
    
    const colors = {
      'Foundation': 'bg-blue-100 text-blue-700',
      'Acceleration': 'bg-purple-100 text-purple-700',
      'Elite': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
    };
    
    return (
      <Badge className={`text-xs ${colors[programme as keyof typeof colors]}`}>
        {programme}
      </Badge>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed bottom-24 left-6 z-40 max-w-sm"
        >
          <Card className="relative overflow-hidden shadow-2xl border-0">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentNotification.color} opacity-5`} />
            
            {/* Content */}
            <div className="relative p-4">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`p-2 rounded-full bg-gradient-to-br ${currentNotification.color} text-white`}>
                  <currentNotification.icon className="w-5 h-5" />
                </div>
                
                {/* Text content */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {currentNotification.content}
                  </p>
                  {currentNotification.subtext && (
                    <p className="text-xs text-gray-600 mt-1">
                      {currentNotification.subtext}
                    </p>
                  )}
                  
                  {/* Meta information */}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {currentNotification.timestamp}
                    </span>
                    {formatLocation(currentNotification.location)}
                    {getProgrammeBadge(currentNotification.programme)}
                  </div>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress bar showing notification duration */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"
              />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Activity Feed Component for displaying recent activities on a page
export function ActivityFeed() {
  const recentActivities = [
    {
      user: 'James H.',
      action: 'started Gold Package',
      time: '2 minutes ago',
      location: 'London',
      avatar: 'JH'
    },
    {
      user: 'Sarah M.',
      action: 'achieved 52% productivity increase',
      time: '5 minutes ago',
      location: 'Manchester',
      avatar: 'SM'
    },
    {
      user: 'David K.',
      action: 'left a 5-star review',
      time: '12 minutes ago',
      location: 'Edinburgh',
      avatar: 'DK'
    },
    {
      user: 'Mark T.',
      action: 'achieved strength goals',
      time: '15 minutes ago',
      location: 'Leeds',
      avatar: 'MT'
    },
    {
      user: 'Lisa H.',
      action: 'completed week 6 milestone',
      time: '18 minutes ago',
      location: 'Bristol',
      avatar: 'LH'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Live Activity Feed
        </h3>
        <Badge variant="outline" className="animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Live
        </Badge>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm">
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>
                {' '}
                <span className="text-gray-600">{activity.action}</span>
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {activity.location}
                </span>
              </div>
            </div>
            
            <CheckCircle className="w-5 h-5 text-green-500" />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <p className="text-sm font-medium flex items-center">
          <ArrowUp className="w-4 h-4 mr-2 text-green-600" />
          247 mothers actively improving their fitness
        </p>
      </div>
    </Card>
  );
}