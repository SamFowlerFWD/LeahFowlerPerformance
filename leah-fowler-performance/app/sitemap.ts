import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generation for Leah Coach
 * Elite Performance Consultancy (formerly Aphrodite Fitness)
 * Targets: High-achieving professionals, executives, parents UK-wide
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://leah.coach'
  const currentDate = new Date().toISOString()

  // Core pages with online PT and strength coaching focus
  const corePages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.95, // Services page - critical for conversions
    },
    {
      url: `${baseUrl}/performance-accelerator`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Key programme page
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Application/conversion page
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85, // About page - trust building
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85, // Social proof
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85, // Lead generation
    },
    {
      url: `${baseUrl}/online-training`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Key service page
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.75, // Contact information
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7, // Blog index
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7, // Resources section
    },
  ]

  // Service-specific landing pages for SEO
  const servicePages = [
    {
      url: `${baseUrl}/online-pt-norfolk`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Local SEO
    },
    {
      url: `${baseUrl}/strength-coach-uk`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/online-personal-trainer`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/online-fitness-programmes`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
  ]

  // Location-specific pages for local SEO
  const locationPages = [
    {
      url: `${baseUrl}/personal-trainer-norfolk`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/online-pt-dereham`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/strength-coach-norwich`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fitness-coach-wymondham`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
  ]

  // Programme/package specific pages
  const programmePages = [
    {
      url: `${baseUrl}/foundation-programme`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/performance-programme`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/elite-coaching`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/nutrition-coaching`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
  ]

  // Blog posts focused on online PT and strength training
  const blogPosts = [
    {
      url: `${baseUrl}/blog/online-personal-training-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/strength-training-beginners`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/home-gym-setup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/nutrition-for-performance`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog/progressive-overload-explained`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    },
  ]

  // Resource and guide pages
  const resourcePages = [
    {
      url: `${baseUrl}/resources/training-app-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources/macro-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    },
    {
      url: `${baseUrl}/resources/exercise-library`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/progress-tracker`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Legal and policy pages (lower priority but necessary)
  const legalPages = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Account/dashboard pages (if publicly accessible)
  const accountPages = [
    {
      url: `${baseUrl}/account/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/account/forgot-password`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
  ]

  // Combine all pages
  return [
    ...corePages,
    ...servicePages,
    ...locationPages,
    ...programmePages,
    ...blogPosts,
    ...resourcePages,
    ...legalPages,
    ...accountPages,
  ]
}