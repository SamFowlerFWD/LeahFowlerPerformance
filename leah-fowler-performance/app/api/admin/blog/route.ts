import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
 '@/types/blog'

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// GET - Fetch posts with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '20')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const contentType = searchParams.get('content_type')
    const featured = searchParams.get('featured')
    const authorId = searchParams.get('author_id')

    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (category) {
      query = query.eq('category_id', category)
    }
    if (contentType && contentType !== 'all') {
      query = query.eq('content_type', contentType)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (authorId) {
      query = query.eq('author_id', authorId)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      posts: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an author
    const { data: author } = await supabaseAdmin
      .from('authors')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!author) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: PostFormData = await request.json()

    // Prepare post data
    const postData = {
      ...body,
      author_id: author.id,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      scheduled_for: body.status === 'scheduled' ? body.scheduled_for : null
}

    // Remove tags from post data (handled separately)
    const { tags, ...postWithoutTags } = postData

    // Insert post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert(postWithoutTags)
      .select()
      .single()

    if (postError) {
      console.error('Error creating post:', postError)
      return NextResponse.json({ error: postError.message }, { status: 500 })
    }

    // Insert post tags if provided
    if (tags && tags.length > 0 && post) {
      const postTags = tags.map((tagId: string, index: number) => ({
        post_id: post.id,
        tag_id: tagId,
        position: index
}))

      const { error: tagsError } = await supabaseAdmin
        .from('post_tags')
        .insert(postTags)

      if (tagsError) {
        console.error('Error adding tags:', tagsError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing post
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an author
    const { data: author } = await supabaseAdmin
      .from('authors')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!author) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: Partial<PostFormData> = await request.json()

    // Prepare update data
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
}

    // Handle status changes
    if (body.status === 'published' && !body.published_at) {
      updateData.published_at = new Date().toISOString()
    }
    if (body.status === 'scheduled') {
      updateData.scheduled_for = body.scheduled_for
    }

    // Remove tags from update data (handled separately)
    const { tags, ...updateWithoutTags } = updateData

    // Update post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .update(updateWithoutTags)
      .eq('id', postId)
      .select()
      .single()

    if (postError) {
      console.error('Error updating post:', postError)
      return NextResponse.json({ error: postError.message }, { status: 500 })
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await supabaseAdmin
        .from('post_tags')
        .delete()
        .eq('post_id', postId)

      // Insert new tags
      if (tags.length > 0) {
        const postTags = tags.map((tagId: string, index: number) => ({
          post_id: postId,
          tag_id: tagId,
          position: index
}))

        const { error: tagsError } = await supabaseAdmin
          .from('post_tags')
          .insert(postTags)

        if (tagsError) {
          console.error('Error updating tags:', tagsError)
        }
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error in PUT /api/admin/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete post
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an author
    const { data: author } = await supabaseAdmin
      .from('authors')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!author) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}