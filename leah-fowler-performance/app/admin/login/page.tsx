'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Shield, AlertCircle } from 'lucide-react'

// Use the properly configured browser client
const supabase = createBrowserClient()

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      // Get the session to ensure we have valid tokens
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error('Failed to establish session')
      }

      // Check if user is admin - simplified query without join
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', authData.user?.id)
        .eq('is_active', true)
        .single()

      if (adminError) {
        console.error('Admin check error:', adminError)
        await supabase.auth.signOut()
        if (adminError.code === 'PGRST116') {
          throw new Error('Access denied. You are not registered as an admin.')
        }
        throw new Error('Access denied. Admin privileges required.')
      }

      if (!adminUser) {
        await supabase.auth.signOut()
        throw new Error('Access denied. Admin account not found.')
      }

      // Set authentication cookies for middleware to use
      // The Supabase auth library should handle this automatically, but we'll ensure it's set
      const accessToken = sessionData.session.access_token
      const refreshToken = sessionData.session.refresh_token

      // Set cookies manually if needed
      if (accessToken) {
        document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }

      // Try to log the login action - but don't fail if it doesn't work
      try {
        await supabase.from('admin_audit_log').insert({
          admin_user_id: adminUser.id,
          user_email: email,
          action_type: 'login',
          resource_type: 'admin_panel',
          resource_details: { role: adminUser.role || 'unknown' }
        })
      } catch (auditError) {
        console.warn('Failed to log audit entry:', auditError)
        // Continue even if audit logging fails
      }

      // Try to update last login - but don't fail if it doesn't work
      try {
        await supabase
          .from('admin_users')
          .update({
            last_login_at: new Date().toISOString(),
            login_count: (adminUser.login_count || 0) + 1
          })
          .eq('id', adminUser.id)
      } catch (updateError) {
        console.warn('Failed to update last login:', updateError)
        // Continue even if update fails
      }

      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-navy flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Leah Fowler Performance</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy-dark dark:bg-gold dark:hover:bg-gold-dark"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </Card>
    </div>
  )
}