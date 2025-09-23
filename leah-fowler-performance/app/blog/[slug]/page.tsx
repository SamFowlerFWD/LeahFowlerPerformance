import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { MDXRemote } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'
import {
  Calendar,
  Clock,
  User,
  Eye,
  Share2,
  Heart,
  BookOpen,
  ChevronRight,
  Tag
} from 'lucide-react'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Post } from '@/types/blog'

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Custom MDX Components
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-lg text-gray-700 mb-6 leading-relaxed" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="text-lg leading-relaxed" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-gold pl-6 py-2 my-6 italic text-gray-600" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 text-sm px-2 py-1 rounded font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="w-full rounded-lg my-6" alt="" {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border border-gray-300" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="border border-gray-300 px-4 py-2" {...props} />
  ),
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const ogImage = post.og_image || post.featured_image || '/og-default.jpg'

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || post.subtitle,
    keywords: post.meta_keywords?.join(', '),
    authors: post.author ? [{ name: post.author.display_name }] : [],
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description || post.excerpt || post.subtitle,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author.display_name] : [],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description || post.excerpt || post.subtitle,
      images: [ogImage],
    },
    alternates: {
      canonical: post.canonical_url || `/blog/${post.slug}`,
    },
  }
}

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      author:authors(*),
      tags:post_tags(
        tag:tags(*)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  // Format tags
  const formattedPost = {
    ...data,
    tags: data.tags?.map((t: any) => t.tag).filter(Boolean) || []
  }

  // Track view (in production, you'd want to do this client-side with user session)
  await supabase
    .from('post_views')
    .insert({
      post_id: data.id,
      viewed_at: new Date().toISOString(),
    })

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return formattedPost as Post
}

async function getRelatedPosts(postId: string): Promise<Post[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/related?id=${postId}&limit=3`)
  
  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return data.posts || []
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id)
  const stats = readingTime(post.content)

  // Generate table of contents from content
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match

  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = match[0].indexOf('##') === 0 ? 2 : 3
    const text = match[1]
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    headings.push({ level, text, id })
  }

  return (
    <>
      <ModernHeader />
      
      <main className="min-h-screen pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-navy via-navy/95 to-navy-dark">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.02]" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight className="h-4 w-4" />
              {post.category && (
                <>
                  <Link href={`/blog/category/${post.category.slug}`} className="hover:text-white">
                    {post.category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="text-white">{post.title}</span>
            </nav>

            {/* Post Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                {post.category && (
                  <Badge className="bg-gold/20 text-gold border-gold/30">
                    {post.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="text-white border-white/30">
                  {post.content_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                {post.difficulty_level && (
                  <Badge variant="outline" className="text-white border-white/30">
                    {post.difficulty_level}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="text-xl text-white/80">
                  {post.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-white/70">
                {post.author && (
                  <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2 hover:text-white">
                    <User className="h-4 w-4" />
                    <span>{post.author.display_name}</span>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.published_at!).toLocaleDateString('en-GB', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{stats.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.view_count} views</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative -mt-8 max-w-5xl mx-auto px-6">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              className="w-full rounded-xl shadow-2xl"
            />
            {post.featured_image_caption && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {post.featured_image_caption}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <MDXRemote source={post.content} components={components} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="h-5 w-5 text-gray-500" />
                    {post.tags.map((tag: any) => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Share:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt || post.subtitle,
                          url: window.location.href,
                        })
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    {post.like_count}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Table of Contents */}
                {post.show_toc && headings.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {headings.map((heading, index) => (
                        <a
                          key={index}
                          href={`#${heading.id}`}
                          className={`block text-gray-600 hover:text-blue-600 transition-colors ${
                            heading.level === 3 ? 'pl-4' : ''
                          }`}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Author Info */}
                {post.author && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">About the Author</h3>
                    <div className="space-y-3">
                      <div className="font-medium">{post.author.display_name}</div>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600">{post.author.bio}</p>
                      )}
                      {post.author.expertise && post.author.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.author.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>

        {/* Related Posts */}
        {post.show_related && relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {relatedPost.featured_image && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.featured_image_alt || relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {relatedPost.category && (
                        <Badge variant="secondary" className="mb-3">
                          {relatedPost.category.name}
                        </Badge>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedPost.excerpt || relatedPost.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                        <span>{relatedPost.reading_time} min read</span>
                        <span>•</span>
                        <span>{relatedPost.view_count} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </>
  )
}