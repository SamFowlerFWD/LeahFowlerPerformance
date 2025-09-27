'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react'
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
      {/* MINIMAL Cookie Banner - Ultra thin bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-[100] transition-transform",
        showBanner ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="px-3 py-1.5 sm:px-4 sm:py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Ultra minimal text - single line on mobile */}
            <div className="flex items-center gap-1.5 text-white text-[10px] sm:text-xs">
              <Cookie className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
              <span className="hidden sm:inline">
                We use cookies for better experience.
              </span>
              <span className="sm:hidden">
                We use cookies
              </span>
              <button
                onClick={() => setShowDetails(true)}
                className="underline hover:text-gold transition-colors text-[10px] sm:text-xs"
              >
                Details
              </button>
            </div>

            {/* Ultra compact buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRejectAll}
                className="px-2 py-0.5 text-[10px] sm:text-xs text-white/80 hover:text-white transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-3 py-0.5 text-[10px] sm:text-xs bg-gold text-black rounded-sm font-semibold hover:bg-gold/90 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Preferences Modal - Only if user wants details */}
      {showDetails && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[101]"
            onClick={() => setShowDetails(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[102]">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-navy">Cookie Settings</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Manage your cookie preferences below.
                  <a href="/privacy-policy" className="text-gold hover:underline ml-1">Privacy Policy</a>
                </p>

                {/* Necessary Cookies */}
                <div className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <Shield className="h-4 w-4 text-sage mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-navy">
                          Essential
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Required for site to function
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="w-4 h-4 accent-sage cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <BarChart3 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-navy">
                          Analytics
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Helps us improve our site
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="w-4 h-4 accent-gold cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <Cookie className="h-4 w-4 text-navy mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-navy">
                          Marketing
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Personalised ads & content
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="w-4 h-4 accent-navy cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-3 py-1.5 text-xs border border-muted text-muted-foreground rounded hover:bg-muted transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAcceptSelected}
                    className="flex-1 px-3 py-1.5 text-xs border border-navy text-navy rounded hover:bg-navy hover:text-white transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-3 py-1.5 text-xs bg-gold text-black rounded font-semibold hover:bg-gold/90 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}