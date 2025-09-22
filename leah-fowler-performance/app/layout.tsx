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
  metadataBase: new URL('https://leahfowlerperformance.com'),
  title: {
    default: "Mother Identity Coach Norfolk | Reclaim Your Strength | Leah Fowler",
    template: "%s | Leah Fowler Performance"
  },
  description: "Rediscover yourself beyond motherhood. Norfolk's only mother-identity coach helps you reclaim strength, confidence & purpose. From mirror moment to milestone. 500+ mothers transformed. Start today →",
  keywords: ["mother identity coach Norfolk", "postnatal fitness recovery Norfolk", "mother transformation Dereham", "mum fitness Norfolk", "identity reclamation coach", "warrior mother training Norfolk", "mirror moment breakthrough", "mother fitness Norwich", "postnatal strength training", "reclaim identity after children", "Norfolk mother coach", "Dereham mum fitness"],
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
    url: 'https://leahfowlerperformance.com',
    siteName: 'Leah Fowler Performance - Mother Identity Coach',
    title: 'Mother Identity Coach Norfolk | Rediscover the Woman Behind the Mother',
    description: 'From exhausted to extraordinary. Norfolk\'s only mother-identity coach helps you reclaim your strength, rediscover yourself, and become the warrior mother your children deserve to see.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Leah Fowler Performance - Mother Identity & Strength Coach',
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
    <html lang="en-GB" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a2942" />
        <SchemaMarkup />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans min-h-screen bg-white dark:bg-navy-dark text-gray-900 dark:text-gray-100`}
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
