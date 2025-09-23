import { AdminLayout } from '@/components/admin/AdminLayout';
import { requireAdminAuth, logAdminAction } from '@/lib/auth/admin-auth';
import { createServerClient } from '@/lib/auth/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function AdminBlogPage() {
  const session = await requireAdminAuth();
  const supabase = createServerClient();

  // Fetch blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, view_count')
    .order('created_at', { ascending: false })
    .limit(50);

  // Log page view
  await logAdminAction({
    action_type: 'read',
    resource_type: 'blog_posts_list',
    status: 'success'
  });

  return (
    <AdminLayout user={{ email: session.admin.email, role: session.admin.role }}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage blog posts, categories, and content
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Manage and monitor your blog content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts?.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Status: {post.status}</span>
                      <span>Views: {post.view_count || 0}</span>
                      {post.published_at && (
                        <span>
                          Published: {new Date(post.published_at).toLocaleDateString('en-GB')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!posts || posts.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No blog posts yet. Create your first post to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}