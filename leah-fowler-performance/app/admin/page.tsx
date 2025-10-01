'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-dark to-navy flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-gold rounded-full animate-pulse" />
        </div>
        <p className="text-white">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}