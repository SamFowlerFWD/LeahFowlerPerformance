'use client';

import { usePathname } from 'next/navigation';
import { getAllSchemas, getPageSchema } from '@/lib/schema-markup-updated';

/**
 * Schema Markup Component
 * Dynamically injects appropriate schema.org structured data based on current page
 */
export default function SchemaMarkup() {
  const pathname = usePathname();

  // Determine page type from pathname
  const getPageType = () => {
    if (pathname === '/') return 'home';
    if (pathname.includes('/programmes') || pathname.includes('/performance-accelerator')) return 'programmes';
    if (pathname.includes('/about')) return 'about';
    if (pathname.includes('/blog')) return 'blog';
    if (pathname.includes('/faq')) return 'faq';
    if (pathname.includes('/assessment')) return 'assessment';
    return 'default';
  };

  const pageType = getPageType();

  // Get appropriate schema for the page
  // Use getAllSchemas for home page, specific schemas for other pages
  const schemaData = pageType === 'home' ? getAllSchemas() : getPageSchema(pageType);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}