import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import CookieConsent from '@/components/CookieConsent';
import SchemaMarkup from '@/components/SchemaMarkup';
import MobileNav from '@/components/MobileNav';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://strengthpt.co.uk'),
  title: {
    default: "Strength PT | Elite Online Personal Training & Coaching UK",
    template: "%s | Strength PT"
  },
  description: "Strength PT - Elite online personal training & strength coaching. Professional PT Dereham-based, UK-wide service. Evidence-based programmes from £48. Transform with LFP.",
  keywords: ["online PT Norfolk", "online personal trainer UK", "strength and conditioning coach", "online strength coach Norfolk", "PT Dereham", "personal trainer Dereham", "online fitness coach Norwich", "performance coach UK", "online PT programmes", "strength training online", "Dereham fitness coach", "online coaching UK"],
  authors: [{ name: "Leah Fowler" }],
  creator: "Leah Fowler",
  publisher: "Leah Fowler Performance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://strengthpt.co.uk',
    siteName: 'Strength PT - Online Personal Training & Strength Coaching',
    title: 'Online Personal Trainer Norfolk | Elite Strength Coach',
    description: 'Transform with Norfolk\'s premier online PT. Evidence-based strength & conditioning. Start from £48/month. Book your free consultation today.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Strength PT by LFP - Elite Online Personal Training & Coaching',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@leahfowlerperf',
    creator: '@leahfowlerperf',
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
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="scroll-smooth dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a2942" />
        <SchemaMarkup />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans min-h-screen bg-white dark:bg-navy-dark text-gray-900 dark:text-gray-100 overflow-x-hidden`}
      >
        {/* Skip to Content Link for Accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        <div id="main-content">
          {children}
        </div>

        <MobileNav />
        <CookieConsent />
      </body>
    </html>
  );
}
