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
  metadataBase: new URL('https://leah.coach'),
  title: {
    default: "Leah Coach | Elite Performance Consultancy UK (formerly Aphrodite Fitness)",
    template: "%s | Leah Coach"
  },
  description: "Leah Coach - Elite performance consultancy for high-achieving professionals. Formerly Aphrodite Fitness & Strength PT. Transform your life performance with evidence-based coaching from £48. UK-wide online programmes.",
  keywords: ["Leah Coach", "performance consultant UK", "executive coaching", "Aphrodite Fitness", "formerly Aphrodite Fitness", "Strength PT", "online performance coach", "high achiever coaching", "professional performance optimisation", "executive wellness UK", "parent fitness coach", "Norfolk performance consultant", "Dereham coach", "life performance coaching"],
  authors: [{ name: "Leah Fowler" }],
  creator: "Leah Fowler",
  publisher: "Leah Coach Performance Consultancy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://leah.coach',
    siteName: 'Leah Coach - Elite Performance Consultancy (formerly Aphrodite Fitness)',
    title: 'Leah Coach | Performance Consultant UK | Formerly Aphrodite Fitness',
    description: 'Elite performance consultancy for high-achieving professionals. Formerly Aphrodite Fitness. Evidence-based life optimisation from £48/month. Transform with Leah Coach.',
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
        <link rel="canonical" href="https://leah.coach" />
        <link rel="alternate" href="https://strengthpt.co.uk" hrefLang="en-GB" />
        <link rel="alternate" href="https://aphroditefitness.co.uk" hrefLang="en-GB" />
        <meta name="theme-color" content="#1a2942" />
        <meta property="og:see_also" content="https://strengthpt.co.uk" />
        <meta property="og:see_also" content="https://aphroditefitness.co.uk" />
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
