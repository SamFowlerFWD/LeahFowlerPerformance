import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch recent published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        slug,
        title,
        subtitle,
        excerpt,
        content,
        published_at,
        author:authors(display_name),
        category:categories(name)
      `)
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching posts for RSS:', error)
      return new NextResponse('Error generating RSS feed', { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://leahfowlerperformance.co.uk'

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Leah Fowler Performance Blog</title>
    <link>${baseUrl}</link>
    <description>Evidence-based insights on strength training, nutrition, sleep optimisation, and lifestyle strategies for busy parents, professionals and athletes.</description>
    <language>en-GB</language>
    <copyright>© ${new Date().getFullYear()} Leah Fowler Performance Coach</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    ${posts?.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.subtitle || post.title}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>${post.author?.display_name || 'Leah Fowler'}</author>
      <category>${post.category?.name || 'Uncategorised'}</category>
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}