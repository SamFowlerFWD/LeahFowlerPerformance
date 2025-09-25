import { NextResponse } from 'next/server'

/**
 * Additional sitemap.xml route handler for direct XML response
 * Ensures compatibility with all search engines and crawlers
 */
export async function GET() {
  const baseUrl = 'https://strengthpt.co.uk'
  const currentDate = new Date().toISOString()

  // Priority pages for Online PT & Strength Coach positioning
  const pages = [
    { url: '', priority: 1.0, changefreq: 'weekly' },
    { url: '/services', priority: 0.95, changefreq: 'weekly' },
    { url: '/performance-accelerator', priority: 0.9, changefreq: 'weekly' },
    { url: '/apply', priority: 0.9, changefreq: 'weekly' },
    { url: '/about', priority: 0.85, changefreq: 'monthly' },
    { url: '/testimonials', priority: 0.85, changefreq: 'weekly' },
    { url: '/assessment', priority: 0.85, changefreq: 'weekly' },
    { url: '/online-training', priority: 0.9, changefreq: 'weekly' },
    { url: '/contact', priority: 0.75, changefreq: 'monthly' },
    { url: '/blog', priority: 0.7, changefreq: 'daily' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}