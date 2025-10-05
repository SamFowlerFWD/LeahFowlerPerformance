import { Be_Vietnam_Pro, Alegreya_Sans } from 'next/font/google'
import '../globals.css'

// Be Vietnam Pro for headings
const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
})

// Alegreya Sans Light for body text
const alegreyaSans = Alegreya_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300'],
})

export default function MobileDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${beVietnamPro.variable} ${alegreyaSans.variable}`}>
      <head>
        {/* Viewport meta for optimal mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

        {/* Mobile web app capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#0f172a" />

        {/* Prevent format detection on phones */}
        <meta name="format-detection" content="telephone=no" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/hero/leah-training-action.webp" as="image" />
      </head>
      <body className="font-body antialiased min-h-screen bg-white text-slate-900">
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL('https://leahfowlerperformance.co.uk'),
  title: {
    default: 'Leah Fowler Performance - Family Fitness Coach Norfolk',
    template: '%s | Leah Fowler Performance'
  },
  description: 'Transform your family\'s fitness with Norfolk\'s premier performance coach. Youth athletics, Spartan training, family programmes. First session FREE.',
  keywords: [
    'family fitness Norfolk',
    'youth sports training',
    'Spartan race coach',
    'kids athletics Norwich',
    'Dereham personal trainer',
    'mums fitness classes',
    'family bootcamp Norfolk',
    'youth athletic development',
    'Norfolk fitness coach',
    'family training programmes'
  ],
  authors: [{ name: 'Leah Fowler' }],
  creator: 'Leah Fowler Performance',
  publisher: 'Leah Fowler Performance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://leahfowlerperformance.co.uk',
    siteName: 'Leah Fowler Performance',
    title: 'Family Fitness Coach Norfolk - Transform Together',
    description: 'Join 500+ Norfolk families getting fit together. Expert coaching for all ages. First session FREE!',
    images: [
      {
        url: '/images/hero/leah-training-action.webp',
        width: 1200,
        height: 630,
        alt: 'Leah Fowler coaching families in Norfolk',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leah Fowler Performance - Family Fitness Norfolk',
    description: 'From school run to finish line. Join Norfolk\'s fitness family!',
    creator: '@leahfowlerfit',
    images: ['/images/hero/leah-training-action.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
}