/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Premium spacing scale based on 8-point grid
      spacing: {
        '0': '0',
        '0.5': '0.25rem',   // 4px
        '1': '0.5rem',      // 8px
        '1.5': '0.75rem',   // 12px
        '2': '1rem',        // 16px
        '2.5': '1.25rem',   // 20px
        '3': '1.5rem',      // 24px
        '4': '2rem',        // 32px
        '5': '2.5rem',      // 40px
        '6': '3rem',        // 48px
        '8': '4rem',        // 64px
        '10': '5rem',       // 80px
        '12': '6rem',       // 96px
        '14': '7rem',       // 112px
        '16': '8rem',       // 128px
        '20': '10rem',      // 160px
        '24': '12rem',      // 192px
        '32': '16rem',      // 256px
        // Golden ratio spacing
        'golden-xs': 'calc(2rem / 1.618 / 1.618)',
        'golden-sm': 'calc(2rem / 1.618)',
        'golden': '2rem',
        'golden-lg': 'calc(2rem * 1.618)',
        'golden-xl': 'calc(2rem * 1.618 * 1.618)',
      },

      // Premium padding utilities
      padding: {
        'section-y': 'clamp(6rem, 10vw, 10rem)',
        'section-x': 'clamp(2rem, 5vw, 8rem)',
        'hero-y': 'clamp(8rem, 12vw, 16rem)',
        'hero-x': 'clamp(2rem, 5vw, 8rem)',
        'card': 'clamp(2rem, 5vw, 4rem)',
        'card-luxury': 'clamp(3rem, 6vw, 5rem)',
        'btn-x': 'clamp(2rem, 3vw, 3rem)',
        'btn-y': 'clamp(1rem, 2vw, 1.5rem)',
        'btn-luxury-x': 'clamp(3rem, 4vw, 4rem)',
        'btn-luxury-y': 'clamp(1.5rem, 2.5vw, 2rem)',
      },

      // Premium margin utilities
      margin: {
        'section': 'clamp(6rem, 10vw, 10rem)',
        'component': 'clamp(3rem, 5vw, 5rem)',
        'element': 'clamp(1.5rem, 3vw, 2rem)',
        'heading-top': '4rem',
        'heading-bottom': '1.5rem',
      },

      // Premium gap utilities for grids and flexbox
      gap: {
        'grid-tight': '1.5rem',
        'grid-normal': '2rem',
        'grid-comfortable': '3rem',
        'grid-luxury': '4rem',
        'grid-premium': '5rem',
        'form': '1.5rem',
        'form-large': '2rem',
        'form-section': '3rem',
      },

      // Container configuration
      container: {
        center: true,
        padding: {
          DEFAULT: '2rem',
          sm: '2rem',
          md: '3rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '8rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },

      // Premium colours
      colors: {
        // Navy palette for dark mode
        navy: {
          light: '#2a3952',
          DEFAULT: '#1a2942',
          dark: '#0a1932',
        },
        // Magenta accent for premium feel
        gold: {
          light: '#ff1a9d',
          DEFAULT: '#e7007d',
          dark: '#c70069',
        },
        // Sage for natural, calming accent
        sage: {
          light: '#97b97b',
          DEFAULT: '#87a96b',
          dark: '#77995b',
        },
        // Emerald for success and growth
        emerald: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
      },

      // Animation for premium feel
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // Typography scale for premium feel
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // Line height for readability
      lineHeight: {
        'tight': '1.1',
        'snug': '1.25',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
        'premium': '1.8',
      },

      // Letter spacing for premium typography
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'premium': '0.02em',
      },

      // Box shadow for depth
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 60px -15px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.12)',
        'inner-premium': 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.04)',
      },

      // Border radius for modern feel
      borderRadius: {
        'premium': '1rem',
        'premium-lg': '1.5rem',
        'premium-xl': '2rem',
      },

      // Backdrop blur for glassmorphism
      backdropBlur: {
        'premium': '12px',
      },

      // Z-index scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },

      // Screen breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },

      // Aspect ratios for media
      aspectRatio: {
        'premium': '16 / 10',
        'ultrawide': '21 / 9',
        'golden': '1.618 / 1',
      },
    },
  },
  plugins: [
    // Custom plugin for premium utilities
    function({ addUtilities }) {
      const newUtilities = {
        // Smooth scroll behaviour
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
        // GPU acceleration
        '.gpu-accelerate': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
        // Contain layout for performance
        '.contain-layout': {
          'contain': 'layout',
        },
        '.contain-style': {
          'contain': 'style',
        },
        '.contain-paint': {
          'contain': 'paint',
        },
        // Premium text rendering
        '.text-premium': {
          'text-rendering': 'optimizeLegibility',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        // Premium focus styles
        '.focus-premium': {
          'outline': '2px solid transparent',
          'outline-offset': '2px',
          'transition': 'outline-color 0.2s ease',
        },
        '.focus-premium:focus-visible': {
          'outline-color': '#f59e0b',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}