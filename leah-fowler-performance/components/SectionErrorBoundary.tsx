"use client"

import * as React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  sectionName?: string
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary for individual sections
 * Prevents entire page from crashing if a section fails to render
 */
export default class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Section Error (${this.props.sectionName || 'Unknown'}):`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Default error UI
      return (
        <div className="py-16 px-8 text-center">
          <div className="max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              This section is temporarily unavailable
            </h3>
            <p className="text-gray-600 text-sm">
              We&apos;re working on bringing this content back. Please try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}