"use client"

import * as React from 'react'
import Image from 'next/image'

interface OptimizedHeroImageProps {
  webpSrc: string
  jpegSrc: string
  alt: string
  className?: string
  priority?: boolean
  sizes: string
  objectPosition?: string
}

export function OptimizedHeroImage({
  webpSrc,
  jpegSrc,
  alt,
  className = '',
  priority = true,
  sizes,
  objectPosition = 'center',
}: OptimizedHeroImageProps) {
  const [imgSrc, setImgSrc] = React.useState(webpSrc)
  const [isLoading, setIsLoading] = React.useState(true)

  // Preload the image for faster LCP
  React.useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = webpSrc
      link.type = 'image/webp'
      document.head.appendChild(link)
    }
  }, [webpSrc, priority])

  return (
    <>
      {/* Skeleton loader for smooth transition */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-navy-dark/40 animate-pulse" />
      )}

      <picture>
        <source
          srcSet={webpSrc}
          type="image/webp"
        />
        <source
          srcSet={jpegSrc}
          type="image/jpeg"
        />
        <Image
          src={imgSrc}
          alt={alt}
          fill
          priority={priority}
          quality={85}
          sizes={sizes}
          className={className}
          style={{ objectPosition }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            // Fallback to JPEG if WebP fails
            if (imgSrc === webpSrc) {
              setImgSrc(jpegSrc)
            }
          }}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRlgAAABXRUJQVlA4TEwAAAAvAAAAEAcQERGIiP4HAA=="
        />
      </picture>
    </>
  )
}