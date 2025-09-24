"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Clock,
  ArrowRight,
  Search,
  Moon,
  Dumbbell,
  Heart,
  Brain,
  Utensils,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'

// Blog categories matching the repositioning
const categories = [
  { 
    id: 'sleep-recovery', 
    name: 'Sleep & Recovery', 
    icon: Moon,
    description: 'Optimise your sleep and recovery for better performance',
    color: 'from-blue-500 to-indigo-600',
    postCount: 12
  },
  { 
    id: 'breaking-barriers', 
    name: 'Breaking Exercise Barriers', 
    icon: Dumbbell,
    description: 'Overcome obstacles and build sustainable exercise habits',
    color: 'from-purple-500 to-pink-600',
    postCount: 18
  },
  { 
    id: 'strength-longevity', 
    name: 'Strength & Longevity', 
    icon: Heart,
    description: 'Build strength for a longer, healthier life',
    color: 'from-red-500 to-orange-600',
    postCount: 15
  },
  { 
    id: 'nutrition-performance', 
    name: 'Nutrition for Performance', 
    icon: Utensils,
    description: 'Fuel your body for optimal performance',
    color: 'from-green-500 to-teal-600',
    postCount: 20
  },
  { 
    id: 'lifestyle-optimisation', 
    name: 'Lifestyle Optimisation', 
    icon: Brain,
    description: 'Habits and strategies for peak performance',
    color: 'from-amber-500 to-yellow-600',
    postCount: 16
  }
]

// Sample blog posts - in production these would come from a CMS or database
const featuredPosts = [
  {
    id: 1,
    title: 'The Science of Sleep: How to Optimise Your Recovery',
    excerpt: 'Discover evidence-based strategies to improve your sleep quality and enhance recovery for better physical performance.',
    category: 'sleep-recovery',
    author: 'Leah Fowler',
    date: '2024-01-15',
    readTime: '8 min read',
    image: '/blog/sleep-science.jpg',
    tags: ['Sleep', 'Recovery', 'Circadian Rhythm']
  },
  {
    id: 2,
    title: '5 Common Exercise Barriers and How to Overcome Them',
    excerpt: 'Learn practical strategies to break through the most common barriers that prevent busy professionals from exercising consistently.',
    category: 'breaking-barriers',
    author: 'Leah Fowler',
    date: '2024-01-12',
    readTime: '6 min read',
    image: '/blog/exercise-barriers.jpg',
    tags: ['Motivation', 'Habits', 'Time Management']
  },
  {
    id: 3,
    title: 'Strength Training After 40: Your Complete Guide',
    excerpt: 'Everything you need to know about building and maintaining strength as you age, with specific protocols for longevity.',
    category: 'strength-longevity',
    author: 'Leah Fowler',
    date: '2024-01-10',
    readTime: '10 min read',
    image: '/blog/strength-after-40.jpg',
    tags: ['Strength Training', 'Longevity', 'Ageing Well']
  }
]

const recentPosts = [
  {
    id: 4,
    title: 'Nutrition Timing for Busy Professionals',
    category: 'nutrition-performance',
    date: '2024-01-08',
    readTime: '5 min read'
  },
  {
    id: 5,
    title: 'Creating Your Morning Movement Routine',
    category: 'lifestyle-optimisation',
    date: '2024-01-05',
    readTime: '7 min read'
  },
  {
    id: 6,
    title: 'Understanding Heart Rate Variability',
    category: 'sleep-recovery',
    date: '2024-01-03',
    readTime: '6 min read'
  }
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  return (
    <>
      <ModernHeader />
      
      <main className="min-h-screen pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-navy via-navy/95 to-navy-dark">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gold/20 text-gold border-gold/30">
                <Sparkles className="h-4 w-4" />
                Performance Blog
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Knowledge for
                <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-sage bg-clip-text text-transparent">
                  Peak Performance
                </span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Evidence-based insights on strength training, nutrition, sleep optimisation,
                and lifestyle strategies for busy parents, professionals and athletes.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-navy mb-8">Browse by Category</h2>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all ${
                    selectedCategory === category.id ? 'ring-2 ring-gold' : ''
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <span className="text-xs text-gray-500">{category.postCount} articles</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-navy mb-8">Featured Articles</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300" />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.id === post.category)?.name}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`} className="flex items-center gap-1">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts Sidebar */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-navy mb-8">All Articles</h2>
                {/* Article list would go here */}
                <p className="text-gray-600">More articles coming soon...</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-navy mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-navy mb-2">{post.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{categories.find(c => c.id === post.category)?.name}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Newsletter Signup */}
                <div className="mt-12 p-6 bg-gradient-to-br from-navy to-navy-dark rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Get Performance Tips
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Weekly insights on fitness, nutrition, and lifestyle optimisation.
                  </p>
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button className="w-full bg-gold hover:bg-gold-light text-navy">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}