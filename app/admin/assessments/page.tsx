import { AdminLayout } from '@/components/admin/AdminLayout';
import { requireAdminAuth, logAdminAction } from '@/lib/auth/admin-auth';
import { createServerClient } from '@/lib/auth/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Mail } from 'lucide-react';

export default async function AdminAssessmentsPage() {
  const session = await requireAdminAuth();
  const supabase = createServerClient();

  // Fetch assessment submissions
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Log page view
  await logAdminAction({
    action_type: 'read',
    resource_type: 'assessment_submissions_list',
    status: 'success'
  });

  // Calculate statistics
  const stats = {
    total: assessments?.length || 0,
    thisWeek: assessments?.filter(a => {
      const date = new Date(a.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length || 0,
    avgScore: assessments?.reduce((acc, a) => acc + (a.total_score || 0), 0) / (assessments?.length || 1),
  };

  return (
    <AdminLayout user={{ email: session.admin.email, role: session.admin.role }}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Assessment Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage performance assessment submissions
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Assessments List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Click on any submission to view detailed responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments?.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{assessment.full_name}</h3>
                        <Badge variant={assessment.total_score >= 70 ? 'default' : 'secondary'}>
                          Score: {assessment.total_score}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>Email: {assessment.email}</div>
                        <div>Phone: {assessment.phone || 'N/A'}</div>
                        <div>Company: {assessment.company || 'N/A'}</div>
                        <div>Role: {assessment.role || 'N/A'}</div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Primary Goal:</span>{' '}
                        {assessment.primary_goal || 'Not specified'}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Submitted: {new Date(assessment.created_at).toLocaleString('en-GB')}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Energy:</span>{' '}
                        {assessment.energy_score}/10
                      </div>
                      <div>
                        <span className="text-muted-foreground">Focus:</span>{' '}
                        {assessment.focus_score}/10
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stress:</span>{' '}
                        {assessment.stress_score}/10
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>{' '}
                        {assessment.confidence_score}/10
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!assessments || assessments.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No assessment submissions yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}