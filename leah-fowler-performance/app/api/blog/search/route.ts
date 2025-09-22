import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const contentType = searchParams.get('content_type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query && !category && !tag) {
      return NextResponse.json(
        { error: 'Search query, category, or tag required' },
        { status: 400 }
      )
    }

    let dbQuery = supabase
      .from('posts')
      .select(`
        id,
        slug,
        title,
        subtitle,
        excerpt,
        featured_image,
        featured_image_alt,
        content_type,
        reading_time,
        published_at,
        view_count,
        category:categories!inner(
          id,
          slug,
          name,
          color,
          icon
        ),
        author:authors(
          id,
          slug,
          display_name,
          avatar_url
        ),
        tags:post_tags(
          tag:tags(
            id,
            slug,
            name
          )
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })

    // Apply search filter using full-text search
    if (query) {
      // Use the search vector for full-text search
      dbQuery = dbQuery.textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
    }

    // Apply category filter
    if (category) {
      dbQuery = dbQuery.eq('category.slug', category)
    }

    // Apply tag filter
    if (tag) {
      dbQuery = dbQuery.filter('tags.tag.slug', 'eq', tag)
    }

    // Apply content type filter
    if (contentType) {
      dbQuery = dbQuery.eq('content_type', contentType)
    }

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data, error, count } = await dbQuery

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response
    const formattedPosts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((t: unknown) => t.tag).filter(Boolean) || []
    })) || []

    return NextResponse.json({
      posts: formattedPosts,
      query,
      total: count || 0,
      limit,
      offset,
      has_more: (count || 0) > offset + limit
    })
  } catch (error) {
    console.error('Error in blog search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}