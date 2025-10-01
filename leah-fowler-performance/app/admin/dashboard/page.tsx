'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/card'
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

const supabase = createBrowserClient()

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    assessments: 0,
    posts: 0,
    categories: 0,
    views: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Get assessment count
      const { count: assessmentCount } = await supabase
        .from('assessment_submissions')
        .select('*', { count: 'exact', head: true })

      // Get post count
      const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

      // Get category count
      const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

      // Get total views
      const { data: viewData } = await supabase
        .from('posts')
        .select('view_count')

      const totalViews = viewData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

      setStats({
        assessments: assessmentCount || 0,
        posts: postCount || 0,
        categories: categoryCount || 0,
        views: totalViews
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  return (
    <AdminLayout>

      <div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your platform's performance and manage content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="p-4 sm:p-6 bg-navy border-gold/20 hover:border-gold/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-gold" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.assessments}</span>
            </div>
            <p className="text-gold/70 text-sm font-medium">Assessment Submissions</p>
          </Card>

          <Card className="p-4 sm:p-6 bg-navy border-gold/20 hover:border-gold/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-gold" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.posts}</span>
            </div>
            <p className="text-gold/70 text-sm font-medium">Blog Posts</p>
          </Card>

          <Card className="p-4 sm:p-6 bg-navy border-gold/20 hover:border-gold/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-8 w-8 text-gold" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.categories}</span>
            </div>
            <p className="text-gold/70 text-sm font-medium">Categories</p>
          </Card>

          <Card className="p-4 sm:p-6 bg-navy border-gold/20 hover:border-gold/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-8 w-8 text-gold" />
              <span className="text-2xl sm:text-3xl font-bold text-white">{stats.views}</span>
            </div>
            <p className="text-gold/70 text-sm font-medium">Total Views</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/admin/assessments">
            <Card className="p-4 sm:p-6 bg-navy/5 hover:bg-navy/10 border-gold/20 hover:border-gold/40 transition-all cursor-pointer group">
              <Users className="h-10 sm:h-12 w-10 sm:w-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">View Assessments</h3>
              <p className="text-sm text-gray-700">Review performance assessment submissions and lead data</p>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="p-4 sm:p-6 bg-navy/5 hover:bg-navy/10 border-gold/20 hover:border-gold/40 transition-all cursor-pointer group">
              <FileText className="h-10 sm:h-12 w-10 sm:w-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Manage Blog</h3>
              <p className="text-sm text-gray-700">Create, edit, and manage blog posts and categories</p>
            </Card>
          </Link>

          <Link href="/admin/blog/new">
            <Card className="p-4 sm:p-6 bg-navy/5 hover:bg-navy/10 border-gold/20 hover:border-gold/40 transition-all cursor-pointer group">
              <TrendingUp className="h-10 sm:h-12 w-10 sm:w-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Create New Post</h3>
              <p className="text-sm text-gray-700">Write and publish a new blog post</p>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4 sm:mb-6">Recent Activity</h2>
          <Card className="p-4 sm:p-6 bg-white border-gold/20">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Calendar className="h-6 w-6 text-gold flex-shrink-0 mt-0.5" />
              <div className="space-y-3 w-full">
                <div className="pb-3 border-b border-gold/10">
                  <p className="text-sm font-medium text-navy">Latest Assessment</p>
                  <p className="text-xs text-gray-600 mt-1">2 hours ago - New performance assessment submitted</p>
                </div>
                <div className="pb-3 border-b border-gold/10">
                  <p className="text-sm font-medium text-navy">Blog Post Published</p>
                  <p className="text-xs text-gray-600 mt-1">Yesterday - "Peak Performance Strategies for Q4"</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">System Update</p>
                  <p className="text-xs text-gray-600 mt-1">3 days ago - Admin panel security enhancements</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}