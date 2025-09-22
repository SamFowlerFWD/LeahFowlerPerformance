"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string
  showSkeleton?: boolean
  aspectRatio?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  progressive?: boolean
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  fallback = '/placeholder.jpg',
  showSkeleton = true,
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  progressive = true,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || typeof window === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.01
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (typeof src !== 'string') return undefined

    // Common responsive breakpoints
    const sizes = [640, 768, 1024, 1280, 1536]
    return sizes.map(size => `${src}?w=${size} ${size}w`).join(', ')
  }

  return (
    <div
      ref={imageRef}
      className={cn(
        "relative overflow-hidden",
        aspectRatio && `aspect-${aspectRatio}`,
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {showSkeleton && isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"
        />
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            quality={progressive ? 75 : 90}
            className={cn(
              "transition-all duration-300",
              objectFit === 'contain' && "object-contain",
              objectFit === 'cover' && "object-cover",
              objectFit === 'fill' && "object-fill",
              objectFit === 'none' && "object-none",
              objectFit === 'scale-down' && "object-scale-down"
            )}
            {...props}
          />
        </motion.div>
      )}

      {/* Error fallback */}
      {hasError && fallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            src={fallback}
            alt={`Fallback for ${alt}`}
            className={cn(
              objectFit === 'contain' && "object-contain",
              objectFit === 'cover' && "object-cover",
              objectFit === 'fill' && "object-fill",
              objectFit === 'none' && "object-none",
              objectFit === 'scale-down' && "object-scale-down"
            )}
            {...props}
          />
        </motion.div>
      )}

      {/* Low quality image placeholder (LQIP) for progressive loading */}
      {progressive && isLoading && !showSkeleton && (
        <div
          className="absolute inset-0 filter blur-lg scale-110"
          style={{
            backgroundImage: `url(${src}?w=40&q=10)`,
            backgroundSize: objectFit,
            backgroundPosition: 'center'
          }}
        />
      )}
    </div>
  )
}

// Utility component for background images with lazy loading
export function OptimizedBackgroundImage({
  src,
  fallback = '/placeholder.jpg',
  className,
  children,
  overlay = true,
  overlayOpacity = 0.5
}: {
  src: string
  fallback?: string
  className?: string
  children?: React.ReactNode
  overlay?: boolean
  overlayOpacity?: number
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Preload image
  useEffect(() => {
    if (!isInView) return

    const img = new window.Image()
    img.src = src
    img.onload = () => setIsLoaded(true)
    img.onerror = () => {
      setHasError(true)
      if (fallback) {
        const fallbackImg = new window.Image()
        fallbackImg.src = fallback
        fallbackImg.onload = () => setIsLoaded(true)
      }
    }
  }, [isInView, src, fallback])

  const backgroundImage = hasError ? fallback : src

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Low quality placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 filter blur-xl scale-110 animate-pulse bg-gray-200 dark:bg-gray-700"
          style={{
            backgroundImage: `url(${src}?w=40&q=10)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Full quality image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

// Picture element wrapper for art direction
export function ResponsivePicture({
  sources,
  alt,
  className,
  loading = 'lazy'
}: {
  sources: Array<{
    srcSet: string
    media?: string
    type?: string
  }>
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            srcSet={source.srcSet}
            media={source.media}
            type={source.type}
          />
        ))}
        <img
          src={sources[sources.length - 1].srcSet}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoading(false)}
          className={cn(
            "w-full h-auto transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      </picture>
    </div>
  )
}