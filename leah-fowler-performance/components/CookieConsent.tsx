'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Shield, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Set mounted to true to ensure we only render on client
    setMounted(true)
    
    // Check if user has already made a choice
    const cookieChoice = typeof window !== 'undefined' ? localStorage.getItem('cookieConsent') : null
    if (!cookieChoice) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const handleAcceptSelected = () => {
    savePreferences(preferences)
  }

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(onlyNecessary)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', JSON.stringify(prefs))
      localStorage.setItem('cookieConsentDate', new Date().toISOString())
    
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Initialize Google Analytics or other analytics tools
      console.log('Analytics cookies accepted')
    }
    
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log('Marketing cookies accepted')
    }
    }
    
    setShowBanner(false)
    setShowDetails(false)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !showBanner) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-[100] transition-opacity",
          showDetails ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowDetails(false)}
      />

      {/* Main Banner */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gold shadow-2xl z-[101] transition-transform",
        showBanner ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Cookie className="h-8 w-8 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience, analyse site traffic, and for marketing purposes. 
                  By clicking ""Accept All", you consent to our use of cookies. You can manage your preferences 
                  by clicking ""Manage Preferences". For more information, please read our{' '}
                  <a href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</a> and{' '}
                  <a href="/cookie-policy" className="text-gold hover:underline">Cookie Policy</a>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm border border-muted text-muted-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-gold text-navy rounded-lg font-semibold hover:bg-gold-dark transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Preferences Modal */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[102]">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-navy">Cookie Preferences Centre</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  When you visit our website, we may store or retrieve information on your browser, 
                  mostly in the form of cookies. This information might be about you, your preferences, 
                  or your device and is mostly used to make the site work as you expect it to.
                </p>
              </div>

              {/* Necessary Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-sage mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-navy mb-1">
                        Strictly Necessary Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        These cookies are essential for the website to function properly. They enable 
                        basic functions like page navigation and access to secure areas of the website. 
                        The website cannot function properly without these cookies.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="w-5 h-5 accent-sage cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Always On</p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-navy mb-1">
                        Analytics & Performance Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        These cookies allow us to count visits and traffic sources so we can measure 
                        and improve the performance of our site. They help us to know which pages are 
                        the most and least popular and see how visitors move around the site.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="w-5 h-5 accent-gold cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Cookie className="h-5 w-5 text-navy mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-navy mb-1">
                        Marketing & Targeting Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        These cookies may be set through our site by our advertising partners. They may 
                        be used by those companies to build a profile of your interests and show you 
                        relevant adverts on other sites.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="w-5 h-5 accent-navy cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-2 border border-muted text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAcceptSelected}
                    className="px-6 py-2 border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors"
                  >
                    Save My Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 bg-gold text-navy rounded-lg font-semibold hover:bg-gold-dark transition-colors"
                  >
                    Accept All Cookies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}