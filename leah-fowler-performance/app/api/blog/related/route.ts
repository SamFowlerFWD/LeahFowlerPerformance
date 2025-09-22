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
    const postId = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      )
    }

    // Get the current post's category and tags
    const { data: currentPost, error: postError } = await supabase
      .from('posts')
      .select(`
        category_id,
        tags:post_tags(tag_id)
      `)
      .eq('id', postId)
      .single()

    if (postError || !currentPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const categoryId = currentPost.category_id
    const tagIds = currentPost.tags?.map((t: any) => t.tag_id) || []

    // Build a query to find related posts
    let relatedQuery = supabase
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
        category:categories(
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
      `)
      .eq('status', 'published')
      .is('deleted_at', null)
      .neq('id', postId)

    // First try to get posts from the same category
    if (categoryId) {
      const { data: categoryPosts, error: categoryError } = await relatedQuery
        .eq('category_id', categoryId)
        .order('view_count', { ascending: false })
        .limit(limit)

      if (!categoryError && categoryPosts && categoryPosts.length > 0) {
        // If we have enough posts from the same category, return them
        if (categoryPosts.length >= limit) {
          return NextResponse.json({
            posts: formatPosts(categoryPosts),
            strategy: 'category'
          })
        }

        // If not enough, we'll need to fetch more posts
        const remainingLimit = limit - categoryPosts.length

        // Try to get posts with matching tags
        if (tagIds.length > 0) {
          const { data: tagPosts, error: tagError } = await supabase
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
              category:categories(
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
              tags:post_tags!inner(
                tag_id,
                tag:tags(
                  id,
                  slug,
                  name
                )
              )
            `)
            .eq('status', 'published')
            .is('deleted_at', null)
            .neq('id', postId)
            .in('post_tags.tag_id', tagIds)
            .order('view_count', { ascending: false })
            .limit(remainingLimit)

          if (!tagError && tagPosts) {
            // Combine and deduplicate posts
            const combinedPosts = [...categoryPosts]
            const existingIds = new Set(categoryPosts.map(p => p.id))

            for (const post of tagPosts) {
              if (!existingIds.has(post.id)) {
                combinedPosts.push(post)
                if (combinedPosts.length >= limit) break
              }
            }

            return NextResponse.json({
              posts: formatPosts(combinedPosts.slice(0, limit)),
              strategy: 'category_and_tags'
            })
          }
        }

        // If still not enough, get popular posts
        const { data: popularPosts, error: popularError } = await supabase
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
            category:categories(
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
          `)
          .eq('status', 'published')
          .is('deleted_at', null)
          .neq('id', postId)
          .order('view_count', { ascending: false })
          .limit(limit)

        if (!popularError && popularPosts) {
          // Combine with existing posts
          const combinedPosts = [...categoryPosts]
          const existingIds = new Set(categoryPosts.map(p => p.id))

          for (const post of popularPosts) {
            if (!existingIds.has(post.id)) {
              combinedPosts.push(post)
              if (combinedPosts.length >= limit) break
            }
          }

          return NextResponse.json({
            posts: formatPosts(combinedPosts.slice(0, limit)),
            strategy: 'mixed'
          })
        }

        return NextResponse.json({
          posts: formatPosts(categoryPosts),
          strategy: 'category_only'
        })
      }
    }

    // If no category or category query failed, just get popular posts
    const { data: popularPosts, error: popularError } = await supabase
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
        category:categories(
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
      `)
      .eq('status', 'published')
      .is('deleted_at', null)
      .neq('id', postId)
      .order('view_count', { ascending: false })
      .limit(limit)

    if (popularError) {
      console.error('Error fetching related posts:', popularError)
      return NextResponse.json({ error: popularError.message }, { status: 500 })
    }

    return NextResponse.json({
      posts: formatPosts(popularPosts || []),
      strategy: 'popular'
    })
  } catch (error) {
    console.error('Error in related posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatPosts(posts: any[]) {
  return posts.map(post => ({
    ...post,
    tags: post.tags?.map((t: any) => t.tag).filter(Boolean) || []
  }))
}