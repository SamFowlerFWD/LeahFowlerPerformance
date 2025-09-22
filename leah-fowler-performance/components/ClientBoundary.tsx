"use client"

import * as React from 'react'

interface ClientBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Client Boundary Component
 * Ensures children are only rendered on the client to prevent hydration mismatches
 * and handles mounting state properly for client-only components
 */
export default function ClientBoundary({ children, fallback = null }: ClientBoundaryProps) {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  // During SSR and initial client render, show fallback or nothing
  if (!hasMounted) {
    return <>{fallback}</>
  }

  // After mounting, render children
  return <>{children}</>
}