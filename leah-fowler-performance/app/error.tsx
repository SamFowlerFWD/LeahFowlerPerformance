'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We apologise for the inconvenience. Please try again or contact support if the issue persists.
        </p>
        <Button
          onClick={reset}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}