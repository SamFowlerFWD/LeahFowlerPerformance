import type { Metadata } from "next";
import { Be_Vietnam_Pro, Alegreya_Sans } from "next/font/google";
import CookieConsent from '@/components/CookieConsent';
import SchemaMarkup from '@/components/SchemaMarkup';
import ConditionalMobileNav from '@/components/ConditionalMobileNav';
import "./globals.css";

// Be Vietnam Pro for headings - clean, modern, professional
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-heading",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400'],
});

// Alegreya Sans Light for body text - readable, elegant
const alegreyaSans = Alegreya_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://strengthpt.co.uk'),
  title: {
    default: "Aphrodite Fitness with Leah Fowler | Personal Training & Strength Coaching | Norfolk",
    template: "%s | Aphrodite Fitness"
  },
  description: "Aphrodite Fitness with Leah Fowler - Personal training and strength coaching for busy parents and professionals in Norfolk. Online and in-person training from £48. Mother of 3, 15 years experience.",
  keywords: ["Aphrodite Fitness", "Leah Fowler", "personal trainer Norfolk", "strength coaching Norfolk", "online personal training", "Dereham personal trainer", "fitness for parents", "strength training mothers", "Norfolk PT", "female personal trainer", "online fitness coach UK", "strength and conditioning Norfolk"],
  authors: [{ name: "Leah Fowler" }],
  creator: "Leah Fowler",
  publisher: "Aphrodite Fitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://strengthpt.co.uk',
    siteName: 'Aphrodite Fitness with Leah Fowler',
    title: 'Aphrodite Fitness with Leah Fowler | Personal Training & Strength Coaching | Norfolk',
    description: 'Personal training and strength coaching for busy parents and professionals in Norfolk. Online and in-person training from £48. Mother of 3, 15 years experience.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aphrodite Fitness with Leah Fowler - Personal Training & Strength Coaching Norfolk',
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
        <link rel="canonical" href="https://strengthpt.co.uk" />
        <link rel="alternate" href="https://leah.coach" hrefLang="en-GB" />
        <link rel="alternate" href="https://aphroditefitness.co.uk" hrefLang="en-GB" />
        <meta name="theme-color" content="#1a2942" />
        <meta property="og:see_also" content="https://leah.coach" />
        <meta property="og:see_also" content="https://aphroditefitness.co.uk" />
        <SchemaMarkup />
      </head>
      <body
        className={`${beVietnamPro.variable} ${alegreyaSans.variable} antialiased font-body min-h-screen bg-white dark:bg-navy-dark text-gray-900 dark:text-gray-100 overflow-x-hidden`}
      >
        {/* Skip to Content Link for Accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        <div id="main-content">
          {children}
        </div>

        <ConditionalMobileNav />
        <CookieConsent />
      </body>
    </html>
  );
}
