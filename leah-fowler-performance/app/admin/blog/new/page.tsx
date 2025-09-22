'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import slugify from 'slugify'
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Tags,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
 '@/components/ui/tabs'
 '@/components/ui/alert'
import MDXEditor from '@/components/admin/MDXEditor'
import type { PostFormData, Category, Tag, ContentType, PostStatus } from '@/types/blog'

// Initialise Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featured_image: z.string().url().optional().or(z.literal('')),
  featured_image_alt: z.string().optional(),
  featured_image_caption: z.string().optional(),
  category_id: z.string().optional(),
  content_type: z.enum(['article', 'case_study', 'research_paper', 'video_post']),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  scheduled_for: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  og_image: z.string().url().optional().or(z.literal('')),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  is_featured: z.boolean(),
  is_premium: z.boolean(),
  allow_comments: z.boolean(),
  show_toc: z.boolean(),
  show_related: z.boolean(),
  tags: z.array(z.string()),
  video_url: z.string().url().optional().or(z.literal(''))
})

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [authorId, setAuthorId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
} = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content_type: 'article',
      status: 'draft',
      is_featured: false,
      is_premium: false,
      allow_comments: true,
      show_toc: true,
      show_related: true,
      tags: []
}
})

  const watchTitle = watch('title')
  const watchStatus = watch('status')
  const watchContentType = watch('content_type')

  useEffect(() => {
    checkAuth()
    fetchCategories()
    fetchTags()
  }, [])

  useEffect(() => {
    // Auto-generate slug from title
    if (watchTitle) {
      const slug = slugify(watchTitle, {
        lower: true,
        strict: true,
        locale: 'en'
})
      setValue('slug', slug)
    }
  }, [watchTitle, setValue])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Check if user is an admin/author
    const { data: author } = await supabase
      .from('authors')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!author || !author.is_active) {
      router.push('/')
      return
    }

    setAuthorId(author.id)
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('position')

    if (!error && data) {
      setCategories(data)
    }
  }

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name')

    if (!error && data) {
      setTags(data)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    const slug = slugify(newTag, { lower: true, strict: true })
    
    // Check if tag already exists
    const existingTag = tags.find(t => t.slug === slug)
    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag.id])
      }
      setNewTag('')
      return
    }

    // Create new tag
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: newTag, slug })
      .select()
      .single()

    if (!error && data) {
      setTags([...tags, data])
      setSelectedTags([...selectedTags, data.id])
      setNewTag('')
    }
  }

  const onSubmit = async (data: PostFormData) => {
    if (!authorId) {
      alert('Authentication error. Please refresh and try again.')
      return
    }

    setLoading(true)
    try {
      // Prepare post data
      const postData = {
        ...data,
        author_id: authorId,
        meta_keywords: data.meta_keywords || [],
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        scheduled_for: data.status === 'scheduled' ? data.scheduled_for : null
}

      // Insert post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (postError) throw postError

      // Insert post tags
      if (selectedTags.length > 0 && post) {
        const postTags = selectedTags.map((tagId, index) => ({
          post_id: post.id,
          tag_id: tagId,
          position: index
}))

        const { error: tagsError } = await supabase
          .from('post_tags')
          .insert(postTags)

        if (tagsError) throw tagsError
      }

      // Redirect to edit page
      router.push(`/admin/blog/${post.id}/edit`)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/admin/blog')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Posts
                </Button>
                <h1 className="text-2xl font-bold">Create New Post</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const formData = watch()
                    console.log('Preview:', formData)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Subtitle */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter post title"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    {...register('subtitle')}
                    placeholder="Optional subtitle"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="url-friendly-slug"
                    className="mt-1"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg p-6">
                <Label className="mb-2 block">Content *</Label>
                <MDXEditor
                  content={watch('content') || ''}
                  onChange={(content) => setValue('content', content)}
                  placeholder="Start writing your post..."
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-2">{errors.content.message}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg p-6">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Brief summary of the post (used in previews)"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If left empty, the first paragraph of content will be used
                </p>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      {...register('meta_title')}
                      placeholder="SEO title (defaults to post title)"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      {...register('meta_description')}
                      placeholder="SEO description (defaults to excerpt)"
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_image">Open Graph Image URL</Label>
                    <Input
                      id="og_image"
                      {...register('og_image')}
                      placeholder="https://example.com/og-image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Publish Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={watch('status')}
                      onValueChange={(value: PostStatus) => setValue('status', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watchStatus === 'scheduled' && (
                    <div>
                      <Label htmlFor="scheduled_for">Schedule For</Label>
                      <Input
                        id="scheduled_for"
                        type="datetime-local"
                        {...register('scheduled_for')}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="content_type">Content Type</Label>
                    <Select
                      value={watch('content_type')}
                      onValueChange={(value: ContentType) => setValue('content_type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="case_study">Case Study</SelectItem>
                        <SelectItem value="research_paper">Research Paper</SelectItem>
                        <SelectItem value="video_post">Video Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {watchContentType === 'video_post' && (
                    <div>
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        {...register('video_url')}
                        placeholder="YouTube or Vimeo URL"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Category and Tags */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Tags className="h-5 w-5 mr-2" />
                  Category & Tags
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <Select
                      value={watch('category_id')}
                      onValueChange={(value) => setValue('category_id', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId)
                        return tag ? (
                          <Badge
                            key={tagId}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                          >
                            {tag.name} ×
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <Select
                      value={watch('difficulty_level')}
                      onValueChange={(value: unknown) => setValue('difficulty_level', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Featured Image
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="featured_image">Image URL</Label>
                    <Input
                      id="featured_image"
                      {...register('featured_image')}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="featured_image_alt">Alt Text</Label>
                    <Input
                      id="featured_image_alt"
                      {...register('featured_image_alt')}
                      placeholder="Describe the image"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="featured_image_caption">Caption</Label>
                    <Input
                      id="featured_image_caption"
                      {...register('featured_image_caption')}
                      placeholder="Optional image caption"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured Post</Label>
                    <Switch
                      id="is_featured"
                      checked={watch('is_featured')}
                      onCheckedChange={(checked) => setValue('is_featured', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_premium">Premium Content</Label>
                    <Switch
                      id="is_premium"
                      checked={watch('is_premium')}
                      onCheckedChange={(checked) => setValue('is_premium', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow_comments">Allow Comments</Label>
                    <Switch
                      id="allow_comments"
                      checked={watch('allow_comments')}
                      onCheckedChange={(checked) => setValue('allow_comments', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_toc">Show Table of Contents</Label>
                    <Switch
                      id="show_toc"
                      checked={watch('show_toc')}
                      onCheckedChange={(checked) => setValue('show_toc', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_related">Show Related Posts</Label>
                    <Switch
                      id="show_related"
                      checked={watch('show_related')}
                      onCheckedChange={(checked) => setValue('show_related', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}