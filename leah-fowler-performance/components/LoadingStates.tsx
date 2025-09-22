"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Skeleton loader for text content
export function TextSkeleton({
  lines = 3,
  className
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse",
            i === lines - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  )
}

// Skeleton loader for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 bg-white dark:bg-navy-dark rounded-xl shadow-lg", className)}>
      <div className="animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  )
}

// Spinner component
export function Spinner({
  size = 'md',
  className
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <motion.div
        className={cn(
          "border-4 border-gray-200 dark:border-gray-700 border-t-gold rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// Progress bar component
export function ProgressBar({
  progress,
  showPercentage = true,
  className
}: {
  progress: number
  showPercentage?: boolean
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold to-gold-light"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

// Loading dots animation
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gold rounded-full"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}

// Full page loader
export function PageLoader({
  text = "Loading...",
  showProgress = false,
  progress = 0
}: {
  text?: string
  showProgress?: boolean
  progress?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/90 dark:bg-navy-dark/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    >
      <Spinner size="xl" className="mb-4" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        {text}
      </p>
      {showProgress && (
        <ProgressBar progress={progress} className="w-64" />
      )}
    </motion.div>
  )
}

// Shimmer effect for loading states
export function ShimmerEffect({
  className
}: {
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
    </div>
  )
}

// Pull to refresh indicator
export function PullToRefresh({
  isRefreshing,
  onRefresh
}: {
  isRefreshing: boolean
  onRefresh: () => void
}) {
  const [pullDistance, setPullDistance] = React.useState(0)
  const [startY, setStartY] = React.useState(0)
  const threshold = 80

  React.useEffect(() => {
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY
        setStartY(touchStartY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY > 0 && !isRefreshing) {
        const currentY = e.touches[0].clientY
        const distance = currentY - touchStartY

        if (distance > 0 && window.scrollY === 0) {
          e.preventDefault()
          setPullDistance(Math.min(distance, threshold * 1.5))
        }
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance > threshold && !isRefreshing) {
        onRefresh()
      }
      setPullDistance(0)
      setStartY(0)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, isRefreshing, onRefresh])

  if (pullDistance === 0 && !isRefreshing) return null

  return (
    <motion.div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
      animate={{
        y: isRefreshing ? 60 : pullDistance / 2,
        scale: isRefreshing ? 1 : Math.min(pullDistance / threshold, 1)
      }}
    >
      <div className="bg-white dark:bg-navy-dark rounded-full p-3 shadow-lg">
        {isRefreshing ? (
          <Spinner size="sm" />
        ) : (
          <motion.div
            animate={{ rotate: (pullDistance / threshold) * 180 }}
            className="w-6 h-6 text-gold"
          >
            ↓
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Lazy load wrapper component
export function LazyLoad({
  children,
  fallback = <CardSkeleton />,
  rootMargin = '100px'
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
}) {
  const [isInView, setIsInView] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [rootMargin])

  return (
    <div ref={ref}>
      {isInView ? children : fallback}
    </div>
  )
}

// Add shimmer animation to Tailwind config
// Add this to your tailwind.config.js:
// animation: {
//   shimmer: 'shimmer 2s linear infinite',
// },
// keyframes: {
//   shimmer: {
//     '0%': { transform: 'translateX(-100%)' },
//     '100%': { transform: 'translateX(100%)' },
//   },
// }