'use client'

import ApplicationForm from '@/components/ApplicationForm'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-dark">
      <ModernHeader />

      {/* Main Content - Adjusted spacing for fixed header */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto">
          <ApplicationForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}