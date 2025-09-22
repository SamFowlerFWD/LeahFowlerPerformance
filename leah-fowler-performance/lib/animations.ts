/**
 * Premium Animation Library for Leah Fowler Performance
 * Sophisticated animations that convey luxury and performance
 */

import { Variants } from 'framer-motion'

// Easing functions for premium feel
export const easings = {
  smooth: [0.23, 1, 0.32, 1], // Smooth cubic-bezier
  elegant: [0.4, 0, 0.2, 1], // Material Design standard
  bounce: [0.68, -0.55, 0.265, 1.55], // Subtle bounce
  luxury: [0.87, 0, 0.13, 1], // Premium ease-in-out
  anticipate: [0.39, 0.575, 0.565, 1], // Slight anticipation
}

// Stagger configurations for sequential animations
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  luxury: 0.2,
}

// Premium fade animations
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  },
}

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
}

// Sophisticated scale animations
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.elegant,
    },
  },
}

export const luxuryScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: easings.luxury,
    },
  },
}

// Premium slide animations
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
}

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
}

// Reveal animations for text
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.luxury,
    },
  },
}

export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: easings.elegant,
    },
  }),
}

// Container variants for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.2,
    },
  },
}

export const luxuryStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.luxury,
      delayChildren: 0.3,
      ease: easings.luxury,
    },
  },
}

// Card animations with depth
export const card3D: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotateY: -30,
    z: -100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.8,
      ease: easings.luxury,
    },
  },
  hover: {
    scale: 1.02,
    rotateY: 5,
    z: 50,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
}

// Premium hover effects
export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: easings.bounce,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

export const linkHover = {
  rest: {
    opacity: 0.8,
    x: 0,
  },
  hover: {
    opacity: 1,
    x: 5,
    transition: {
      duration: 0.3,
      ease: easings.elegant,
    },
  },
}

// Parallax scroll effects
export const parallaxFade = {
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: easings.luxury,
    },
  },
}

export const parallaxScale = {
  offscreen: {
    scale: 0.7,
    opacity: 0,
  },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: easings.smooth,
    },
  },
}

// Sophisticated loading animations
export const shimmer: Variants = {
  initial: {
    backgroundPosition: '-1000px 0',
  },
  animate: {
    backgroundPosition: '1000px 0',
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
}

export const pulse: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.elegant,
    },
  },
}

// Premium morph transitions
export const morphCard: Variants = {
  initial: {
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
  },
  hover: {
    borderRadius: '1.5rem',
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
}

// Testimonial animations
export const testimonialSlide: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  }),
}

// CTA pulse animation
export const ctaPulse: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(212, 165, 116, 0.7)',
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(212, 165, 116, 0.7)',
      '0 0 0 20px rgba(212, 165, 116, 0)',
      '0 0 0 0 rgba(212, 165, 116, 0)',
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: easings.elegant,
    },
  },
}

// Notification slide animations
export const notificationSlide: Variants = {
  initial: {
    x: 400,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easings.elegant,
    },
  },
}

// Premium spinner animation
export const spinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
}

// Smooth accordion animations
export const accordion: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: easings.elegant,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: easings.elegant,
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
}

// Floating animation for elements
export const float = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: easings.smooth,
    },
  },
}

// Glow pulse for premium badges
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(212, 165, 116, 0.3)',
      '0 0 40px rgba(212, 165, 116, 0.5)',
      '0 0 20px rgba(212, 165, 116, 0.3)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easings.elegant,
    },
  },
}

// Magnetic effect for interactive elements
export const magnetic = {
  rest: { x: 0, y: 0 },
  hover: (offset: { x: number; y: number }) => ({
    x: offset.x * 0.3,
    y: offset.y * 0.3,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 15,
    },
  }),
}

// Wave animation for backgrounds
export const wave = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: easings.smooth,
    },
  },
}

// Premium number counter animation
export const countUp = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.bounce,
    },
  },
}

// Sophisticated tab switching
export const tabContent: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easings.elegant,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// Create animation utility hook
export const useAnimationVariant = (variant: Variants, custom?: unknown) => ({
  initial: 'hidden',
  animate: 'visible',
  variants: variant,
  custom,
})

// Viewport settings for scroll animations
export const viewportSettings = {
  once: true,
  margin: '-100px',
  amount: 0.3,
}

export const luxuryViewportSettings = {
  once: false,
  margin: '-50px',
  amount: 0.5,
}