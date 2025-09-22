'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Clock,
  CheckCircle,
  User,
  Bot,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  options?: string[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentStage, setCurrentStage] = useState<'greeting' | 'qualification' | 'booking'>('greeting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open after 30 seconds for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setIsOpen(true);
        setUnreadCount(1);
        addBotMessage("Hi! I'm Leah's fitness assistant. I noticed you're exploring our mother fitness programmes. Can I help you find the right solution for your goals? 🎯");
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const addBotMessage = (content: string, options?: string[]) => {
    const message: Message = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
      options
    };
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setHasInteracted(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    const userInput = input.toLowerCase();
    setInput('');

    // Intelligent response system based on keywords and context
    setTimeout(() => {
      if (userInput.includes('price') || userInput.includes('cost') || userInput.includes('investment')) {
        addBotMessage(
          "Our programmes start at £12/month for online training, with options including Flexi Coaching (£80/month), Silver 1:1 training (£140/month - most popular), and premium Gold package (£250/month). Each package is designed for different fitness goals and schedules. Would you like to discuss which would be best for you?",
          ['Tell me more about Silver', 'I\'m interested in Gold', 'Book a consultation']
        );
      } else if (userInput.includes('time') || userInput.includes('busy') || userInput.includes('schedule')) {
        addBotMessage(
          "I completely understand - time is every mother's most precious resource. That's why our programmes are designed to integrate into your existing schedule with just 30 minutes daily. Many clients see amazing results within the first month. Shall we explore how this could work for you?",
          ['Yes, show me how', 'I need more flexibility', 'Book a quick call']
        );
      } else if (userInput.includes('results') || userInput.includes('guarantee') || userInput.includes('work')) {
        addBotMessage(
          "Great question! Our clients typically see 47% strength increase and 38% energy gain within 90 days. We're so confident, we offer a 100% success guarantee. Would you like to see specific case studies from mothers like you?",
          ['Yes, show case studies', 'Tell me about the guarantee', 'I\'m ready to start']
        );
      } else if (userInput.includes('book') || userInput.includes('call') || userInput.includes('consultation')) {
        setCurrentStage('booking');
        addBotMessage(
          "Excellent decision! Leah has limited spots available this week. I can help you book a 30-minute strategy session where she'll create your personalised performance roadmap. What works better for you?",
          ['Tomorrow 2-4pm', 'Thursday 10am-12pm', 'Friday 3-5pm', 'Next week']
        );
      } else if (userInput.includes('assessment') || userInput.includes('quiz') || userInput.includes('test')) {
        addBotMessage(
          "The Mother Fitness Assessment takes just 15 minutes and gives you instant insights into your fitness potential. You'll receive a personalised report with actionable recommendations. Ready to discover your fitness score?",
          ['Start assessment now', 'What does it measure?', 'Is it free?']
        );
      } else if (currentStage === 'greeting') {
        setCurrentStage('qualification');
        addBotMessage(
          "Thanks for your message! To help me guide you to the right solution, what's your biggest performance challenge right now?",
          ['Low energy/burnout', 'Work-life balance', 'Strength building', 'Fitness goals']
        );
      } else {
        addBotMessage(
          "That's a great point. Let me connect you with the right resources. What would be most helpful right now?",
          ['Book a consultation', 'Take the assessment', 'See programmes', 'Chat with Leah directly']
        );
      }
    }, 1000);
  };

  const handleQuickReply = (option: string) => {
    setInput(option);
    handleSend();
  };

  return (
    <>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
            >
              <MessageSquare className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-3 w-64"
              >
                <p className="text-sm font-medium">Hi! Need help choosing the right programme? 👋</p>
                <p className="text-xs text-gray-600 mt-1">I'm here to guide you</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src="/leah-avatar.jpg" alt="Leah" />
                    <AvatarFallback>LF</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Leah's Assistant</p>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                      <span>Online - Responds instantly</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-green-50 px-4 py-2 border-b">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  100% Response Rate
                </span>
                <span className="text-gray-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Avg response: 30 seconds
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Start a conversation to get personalised guidance</p>
                </div>
              )}
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-l-lg rounded-tr-lg'
                        : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
                    } px-4 py-2`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          <Button
                            key={option}
                            onClick={() => handleQuickReply(option)}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs bg-white text-gray-700 hover:bg-gray-50"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleQuickReply('Book a call')}
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Book Call
                </Button>
                <Button
                  onClick={() => handleQuickReply('View programmes')}
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Programmes
                </Button>
                <Button
                  onClick={() => handleQuickReply('Take assessment')}
                  variant="outline"
                  size="sm"
                  className="text-xs flex-1"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Assessment
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Typically replies in under 30 seconds
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}