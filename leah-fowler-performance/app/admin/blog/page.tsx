'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
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
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { Post, PostStatus, ContentType } from '@/types/blog'

// Initialise Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const statusColors: Record<PostStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  archived: 'bg-yellow-100 text-yellow-700'
}

const contentTypeIcons: Record<ContentType, React.ReactNode> = {
  article: <FileText className="h-4 w-4" />,
  case_study: <FileSearch className="h-4 w-4" />,
  research_paper: <BookOpen className="h-4 w-4" />,
  video_post: <Video className="h-4 w-4" />
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
    checkAuth()
    fetchPosts()
  }, [currentPage, statusFilter, typeFilter, searchTerm])

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
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-2">Manage your blog posts, articles, and content</p>
            </div>
            <Button
              onClick={() => router.push('/admin/blog/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value: unknown) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
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

            <Select value={typeFilter} onValueChange={(value: unknown) => setTypeFilter(value)}>
              <SelectTrigger className="w-[180px]">
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
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No posts found. Create your first post!
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {contentTypeIcons[post.content_type]}
                        {post.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {post.is_premium && <Lock className="h-4 w-4 text-purple-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {post.title}
                        </Link>
                        {post.subtitle && (
                          <p className="text-sm text-gray-500 mt-1">{post.subtitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="secondary">{post.category.name}</Badge>
                      ) : (
                        <span className="text-gray-400">Uncategorised</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {post.author ? (
                          <span>{post.author.display_name}</span>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[post.status]}>
                        {post.status}
                      </Badge>
                      {post.status === 'scheduled' && post.scheduled_for && (
                        <div className="text-xs text-gray-500 mt-1">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {formatDate(post.scheduled_for)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(post)}
                        >
                          <Star className={`h-4 w-4 ${post.is_featured ? 'fill-current text-yellow-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicatePost(post)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPostToDelete(post)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action can be reversed from the database but the post will be hidden from the website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}