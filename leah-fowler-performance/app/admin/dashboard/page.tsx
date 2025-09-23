'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  LogOut,
  Shield,
  Eye,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [stats, setStats] = useState({
    assessments: 0,
    posts: 0,
    categories: 0,
    views: 0
  })

  useEffect(() => {
    checkAuth()
    loadStats()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!adminData) {
        router.push('/admin/login')
        return
      }

      setAdminUser(adminData)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gold mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-gold" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Welcome, {adminUser?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-navy-dark"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold">{stats.assessments}</span>
            </div>
            <p className="text-gray-600">Assessment Submissions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold">{stats.posts}</span>
            </div>
            <p className="text-gray-600">Blog Posts</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <span className="text-3xl font-bold">{stats.categories}</span>
            </div>
            <p className="text-gray-600">Categories</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-8 w-8 text-orange-600" />
              <span className="text-3xl font-bold">{stats.views}</span>
            </div>
            <p className="text-gray-600">Total Views</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/assessments">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">View Assessments</h3>
              <p className="text-gray-600">Review performance assessment submissions and lead data</p>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <FileText className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Blog</h3>
              <p className="text-gray-600">Create, edit, and manage blog posts and categories</p>
            </Card>
          </Link>

          <Link href="/admin/blog/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create New Post</h3>
              <p className="text-gray-600">Write and publish a new blog post</p>
            </Card>
          </Link>
        </div>

        {/* Admin Info */}
        <Card className="mt-8 p-6 bg-gold/5 border-gold/20">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-gold mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Admin Access Level: {adminUser?.role}</h3>
              <p className="text-sm text-gray-600">
                You have full access to manage content, view submissions, and configure the platform.
                All actions are logged for security purposes.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last login: {adminUser?.last_login_at ? new Date(adminUser.last_login_at).toLocaleString() : 'First login'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}