"use client"

import * as React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonHover, ctaPulse, easings } from '@/lib/animations'

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'luxury' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  pulse?: boolean
  shimmer?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      pulse = false,
      shimmer = false,
      icon,
      iconPosition = 'right',
      loading = false,
      fullWidth = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation()
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; size: number }>>([])

    // Handle ripple effect on click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const newRipple = { x, y, size }
      setRipples([...ripples, newRipple])

      // Trigger button animation
      controls.start({
        scale: [1, 0.98, 1.02, 1],
        transition: {
          duration: 0.4,
          ease: easings.elegant,
        },
      })

      // Clean up ripple after animation
      setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1))
      }, 600)

      if (onClick) {
        onClick(e)
      }
    }

    const variantStyles = {
      primary: 'bg-gradient-to-r from-gold to-gold-light text-navy hover:from-gold-dark hover:to-gold shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-navy to-navy-light text-white hover:from-navy-dark hover:to-navy shadow-lg hover:shadow-xl',
      luxury: 'bg-gradient-to-br from-navy via-navy-dark to-navy text-gold border border-gold/30 hover:border-gold/50 shadow-2xl',
      ghost: 'bg-transparent text-navy hover:bg-navy/5 dark:text-white dark:hover:bg-white/5',
    }

    const sizeStyles = {
      sm: 'px-6 py-3 text-sm',
      md: 'px-8 py-4 text-base',
      lg: 'px-10 py-5 text-lg',
      xl: 'px-12 py-6 text-xl',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl font-semibold tracking-wide transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        whileHover={!disabled ? buttonHover.hover : undefined}
        whileTap={!disabled ? buttonHover.tap : undefined}
        animate={controls}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {shimmer && (
          <motion.div
            className="absolute inset-0 -translate-x-full"
            animate={{
              translateX: ['-100%', '200%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'linear',
              repeatDelay: 1,
            }}
          >
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </motion.div>
        )}

        {/* Pulse animation */}
        {pulse && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            variants={ctaPulse}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Ripple effects */}
        {ripples.map((ripple, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/30"
            initial={{
              width: 0,
              height: 0,
              x: ripple.x,
              y: ripple.y,
              opacity: 0.5,
            }}
            animate={{
              width: ripple.size * 2,
              height: ripple.size * 2,
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: easings.elegant,
            }}
          />
        ))}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <motion.div
              className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'linear',
              }}
            />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <motion.span
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {icon}
                </motion.span>
              )}
              <span>{children}</span>
              {icon && iconPosition === 'right' && (
                <motion.span
                  initial={{ x: 5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ x: 3 }}
                >
                  {icon}
                </motion.span>
              )}
            </>
          )}
        </span>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="h-full w-full bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </motion.button>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

export { PremiumButton }