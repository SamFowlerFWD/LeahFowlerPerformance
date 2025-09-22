"use client"

import { useState, useEffect, useCallback } from 'react'

interface ResponsiveState {
  // Device type
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean

  // Specific breakpoints
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2xl: boolean

  // Viewport dimensions
  width: number
  height: number

  // Orientation
  isPortrait: boolean
  isLandscape: boolean

  // Touch capability
  isTouchDevice: boolean

  // Platform detection
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
}

// Tailwind CSS breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Debounce function for performance
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Initial state for SSR
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        isSm: false,
        isMd: false,
        isLg: true,
        isXl: false,
        is2xl: false,
        width: 1024,
        height: 768,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false,
      }
    }

    return calculateResponsiveState()
  })

  function calculateResponsiveState(): ResponsiveState {
    if (typeof window === 'undefined') {
      return state
    }

    const width = window.innerWidth
    const height = window.innerHeight

    // Detect touch capability
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0

    // Platform detection
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)

    return {
      // Device type based on width
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS['2xl'],
      isLargeDesktop: width >= BREAKPOINTS['2xl'],

      // Specific breakpoints
      isSm: width >= BREAKPOINTS.sm,
      isMd: width >= BREAKPOINTS.md,
      isLg: width >= BREAKPOINTS.lg,
      isXl: width >= BREAKPOINTS.xl,
      is2xl: width >= BREAKPOINTS['2xl'],

      // Viewport dimensions
      width,
      height,

      // Orientation
      isPortrait: height > width,
      isLandscape: width > height,

      // Touch and platform
      isTouchDevice,
      isIOS,
      isAndroid,
      isSafari,
    }
  }

  const handleResize = useCallback(
    debounce(() => {
      setState(calculateResponsiveState())
    }, 150),
    []
  )

  const handleOrientationChange = useCallback(() => {
    // Wait for the orientation change to complete
    setTimeout(() => {
      setState(calculateResponsiveState())
    }, 100)
  }, [])

  useEffect(() => {
    // Set initial state on client
    setState(calculateResponsiveState())

    // Add event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    // Also listen to the screen orientation API if available
    if (screen?.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange)
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (screen?.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange)
      }
    }
  }, [handleResize, handleOrientationChange])

  return state
}

// Utility hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Create listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener (using modern API with fallback)
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

// Hook for detecting swipe gestures
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold = 50
) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      touchEndY = e.changedTouches[0].screenY
      handleSwipe()
    }

    const handleSwipe = () => {
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Determine if it's a horizontal or vertical swipe
      if (absX > absY && absX > threshold) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      } else if (absY > threshold) {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])
}

// Hook for viewport height fix on mobile (handles browser chrome)
export function useViewportHeight() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
    }
  }, [])
}