'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ResponsiveTable } from '@/components/admin/ResponsiveTable'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  FileSearch,
  BookOpen,
  Star,
  Lock,
  Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Post, PostStatus, ContentType } from '@/types/blog'

// Initialise Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const statusColors: Record<PostStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  scheduled: 'bg-navy/10 text-navy border-navy/20',
  archived: 'bg-amber-100 text-amber-700 border-amber-200'
}

const contentTypeIcons: Record<ContentType, React.ReactNode> = {
  article: <FileText className="h-4 w-4 text-navy" />,
  case_study: <FileSearch className="h-4 w-4 text-gold" />,
  research_paper: <BookOpen className="h-4 w-4 text-sage" />,
  video_post: <Video className="h-4 w-4 text-navy" />
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const postsPerPage = 20

  useEffect(() => {
    fetchPosts()
  }, [currentPage, statusFilter, typeFilter, searchTerm])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `, { count: 'exact' })
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }
      if (typeFilter !== 'all') {
        query = query.eq('content_type', typeFilter)
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      }

      // Pagination
      const from = (currentPage - 1) * postsPerPage
      const to = from + postsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setPosts(data || [])
      setTotalPages(Math.ceil((count || 0) / postsPerPage))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const { error } = await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postToDelete.id)

      if (error) throw error

      fetchPosts()
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const toggleFeatured = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_featured: !post.is_featured })
        .eq('id', post.id)

      if (error) throw error

      fetchPosts()
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const duplicatePost = async (post: Post) => {
    try {
      const newPost = {
        ...post,
        id: undefined,
        slug: `${post.slug}-copy-${Date.now()}`,
        title: `${post.title} (Copy)`,
        status: 'draft' as PostStatus,
        published_at: null,
        created_at: undefined,
        updated_at: undefined
      }

      const { error } = await supabase
        .from('posts')
        .insert(newPost)

      if (error) throw error

      fetchPosts()
    } catch (error) {
      console.error('Error duplicating post:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Prepare table columns for ResponsiveTable
  const tableColumns = [
    {
      key: 'icons',
      label: '',
      className: 'w-[60px]',
      render: (_: any, post: Post) => (
        <div className="flex items-center gap-1">
          {contentTypeIcons[post.content_type]}
          {post.is_featured && <Star className="h-4 w-4 text-gold fill-current" />}
          {post.is_premium && <Lock className="h-4 w-4 text-navy" />}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title',
      render: (_: string, post: Post) => (
        <div>
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="font-medium text-navy hover:text-gold transition-colors"
          >
            {post.title}
          </Link>
          {post.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (_: any, post: Post) => (
        post.category ? (
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20">
            {post.category.name}
          </Badge>
        ) : (
          <span className="text-gray-400">Uncategorised</span>
        )
      )
    },
    {
      key: 'author',
      label: 'Author',
      render: (_: any, post: Post) => (
        <div className="text-sm">
          {post.author ? (
            <span className="text-navy">{post.author.display_name}</span>
          ) : (
            <span className="text-gray-400">Unknown</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, post: Post) => (
        <div>
          <Badge className={statusColors[post.status]}>
            {post.status}
          </Badge>
          {post.status === 'scheduled' && post.scheduled_for && (
            <div className="text-xs text-gray-500 mt-1">
              <Calendar className="inline h-3 w-3 mr-1" />
              {formatDate(post.scheduled_for)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (_: any, post: Post) => (
        <div className="text-sm text-gray-600">
          {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
        </div>
      )
    },
    {
      key: 'stats',
      label: 'Stats',
      render: (_: any, post: Post) => (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye className="h-3 w-3" />
          <span>{post.view_count}</span>
          {post.reading_time && (
            <>
              <Clock className="h-3 w-3 ml-2" />
              <span>{post.reading_time}m</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (_: any, post: Post) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
            className="hover:bg-gold/10 hover:text-gold"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
            className="hover:bg-navy/10 hover:text-navy"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFeatured(post)}
            className="hover:bg-gold/10"
          >
            <Star className={cn("h-4 w-4", post.is_featured && "fill-current text-gold")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => duplicatePost(post)}
            className="hover:bg-navy/10 hover:text-navy"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPostToDelete(post)
              setDeleteDialogOpen(true)
            }}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const handleRowAction = (action: string, row: Post) => {
    if (action === 'view') {
      router.push(`/admin/blog/${row.id}/edit`)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy">Blog Management</h1>
                <p className="text-gray-600 mt-1">Manage your blog posts, articles, and content</p>
              </div>
              <Button
                onClick={() => router.push('/admin/blog/new')}
                className="w-full sm:w-auto bg-gold text-white hover:bg-gold-dark min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="case_study">Case Studies</SelectItem>
                  <SelectItem value="research_paper">Research Papers</SelectItem>
                  <SelectItem value="video_post">Video Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  Loading posts...
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No posts found. Create your first post!</p>
                <Button
                  onClick={() => router.push('/admin/blog/new')}
                  className="mt-4 bg-gold text-white hover:bg-gold-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden lg:block">
                  <ResponsiveTable
                    columns={tableColumns}
                    data={posts}
                    onRowAction={handleRowAction}
                    mobileBreakpoint="lg"
                  />
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-card-hover transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {contentTypeIcons[post.content_type]}
                            {post.is_featured && <Star className="h-4 w-4 text-gold fill-current" />}
                            {post.is_premium && <Lock className="h-4 w-4 text-navy" />}
                          </div>
                          <Badge className={statusColors[post.status]}>
                            {post.status}
                          </Badge>
                        </div>

                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="block mb-2"
                        >
                          <h3 className="font-semibold text-navy hover:text-gold transition-colors">
                            {post.title}
                          </h3>
                          {post.subtitle && (
                            <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
                          )}
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>{post.author?.display_name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Eye className="h-3 w-3" />
                          <span>{post.view_count} views</span>
                          {post.reading_time && (
                            <>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{post.reading_time}m read</span>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                            className="flex-1 min-h-[40px] hover:bg-navy/10 hover:text-navy hover:border-navy/30"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="flex-1 min-h-[40px] hover:bg-gold/10 hover:text-gold hover:border-gold/30"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="min-h-[40px] hover:bg-gold/10 hover:text-gold hover:border-gold/30"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="min-h-[40px] hover:bg-navy/10 hover:text-navy hover:border-navy/30"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-navy">Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{postToDelete?.title}&quot;? This action can be reversed from the database but the post will be hidden from the website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}