'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, Home, LogOut } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase-auth'

const supabase = createBrowserClient()

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoToDashboard = () => {
    router.push('/admin/dashboard')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-navy flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8 bg-white dark:bg-gray-900 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this area
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-amber-900 font-medium mb-1">
                Administrator Access Required
              </p>
              <p className="text-xs text-amber-700">
                This area is restricted to authorized administrators only.
                If you believe you should have access, please contact the system administrator.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full bg-navy hover:bg-navy-dark text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Try Admin Dashboard
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If you continue to experience issues, please contact support at{' '}
          <a href="mailto:info@leah.coach" className="text-gold hover:underline">
            info@leah.coach
          </a>
        </p>
      </Card>
    </div>
  )
}