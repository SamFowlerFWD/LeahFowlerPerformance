'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Download, Filter, Mail, Phone, RefreshCw, Search, TrendingUp, Users, UserCheck, Clock } from 'lucide-react'
import { getAssessmentSubmissions, updateSubmissionStatus, anonymizeSubmission } from '@/lib/api-client'
import { format } from 'date-fns'

interface AssessmentSubmission {
  id: string
  name: string
  email: string
  phone?: string
  qualified: boolean
  tier: string
  investment_level: string
  readiness_score: number
  performance_level: string
  recommended_programme: string
  status: string
  contacted: boolean
  created_at: string
  profile: any
}

interface Statistics {
  total_submissions: number
  qualified_count: number
  conversion_rate: number
  average_readiness_score: number
  tier_distribution: Record<string, number>
  investment_level_distribution: Record<string, number>
}

export default function AdminAssessmentsPage() {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'qualified' | 'new' | 'contacted'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Simple auth check (in production, use proper auth)
  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken')
    if (token) {
      setAuthToken(token)
      setIsAuthenticated(true)
      loadSubmissions(token)
    } else {
      setLoading(false)
    }
  }, [])

  const loadSubmissions = async (token: string) => {
    try {
      setLoading(true)
      const data = await getAssessmentSubmissions(token, filter)
      setSubmissions(data.data)
      setStatistics(data.statistics)
    } catch (error) {
      console.error('Failed to load submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    const token = prompt('Enter admin authentication token:')
    if (token) {
      localStorage.setItem('adminAuthToken', token)
      setAuthToken(token)
      setIsAuthenticated(true)
      loadSubmissions(token)
    }
  }

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      await updateSubmissionStatus(authToken, submissionId, newStatus, adminNotes)
      await loadSubmissions(authToken)
      setSelectedSubmission(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleAnonymize = async (submissionId: string) => {
    if (confirm('Are you sure you want to anonymize this submission? This action cannot be undone.')) {
      try {
        await anonymizeSubmission(authToken, submissionId)
        await loadSubmissions(authToken)
      } catch (error) {
        console.error('Failed to anonymize submission:', error)
        alert('Failed to anonymize submission')
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Qualified', 'Tier', 'Investment Level', 'Readiness Score', 'Status', 'Date']
    const rows = submissions.map(s => [
      s.name,
      s.email,
      s.phone || '',
      s.qualified ? 'Yes' : 'No',
      s.tier,
      s.investment_level,
      s.readiness_score.toString(),
      s.status,
      format(new Date(s.created_at), 'yyyy-MM-dd HH:mm')
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assessments-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Authentication Required</CardTitle>
            <CardDescription>Please authenticate to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full">
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Submissions</h1>
          <p className="text-gray-600">Manage and review performance assessment submissions</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{statistics.total_submissions}</span>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Qualified Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{statistics.qualified_count}</span>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{statistics.conversion_rate.toFixed(1)}%</span>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Avg Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{statistics.average_readiness_score.toFixed(0)}%</span>
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Submissions</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => loadSubmissions(authToken)} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submissions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Qualified</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Readiness</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>
                        {submission.qualified ? (
                          <Badge className="bg-green-100 text-green-800">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.tier}</Badge>
                      </TableCell>
                      <TableCell>{submission.readiness_score.toFixed(0)}%</TableCell>
                      <TableCell>
                        <Badge 
                          variant={submission.status === 'new' ? 'default' : 'secondary'}
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(submission.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Assessment Details</DialogTitle>
                                <DialogDescription>
                                  Submission from {submission.name} on {format(new Date(submission.created_at), 'MMMM d, yyyy')}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedSubmission && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="font-medium">{selectedSubmission.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="font-medium">{selectedSubmission.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="font-medium">{selectedSubmission.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Badge>{selectedSubmission.status}</Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Performance Profile</Label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                      <p><strong>Qualified:</strong> {selectedSubmission.qualified ? 'Yes' : 'No'}</p>
                                      <p><strong>Tier:</strong> {selectedSubmission.tier}</p>
                                      <p><strong>Investment Level:</strong> {selectedSubmission.investment_level}</p>
                                      <p><strong>Readiness Score:</strong> {selectedSubmission.readiness_score}%</p>
                                      <p><strong>Recommended Programme:</strong> {selectedSubmission.recommended_programme}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Update Status</Label>
                                    <Select 
                                      value={selectedSubmission.status}
                                      onValueChange={(value) => handleStatusUpdate(selectedSubmission.id, value)}
                                    >
                                      <SelectTrigger className="mt-2">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="converted">Converted</SelectItem>
                                        <SelectItem value="not_qualified">Not Qualified</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label>Admin Notes</Label>
                                    <Textarea
                                      className="mt-2"
                                      placeholder="Add notes about this submission..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleAnonymize(selectedSubmission.id)}
                                    >
                                      Anonymize (GDPR)
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.href = `mailto:${selectedSubmission.email}`}
                                      >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email
                                      </Button>
                                      {selectedSubmission.phone && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.location.href = `tel:${selectedSubmission.phone}`}
                                        >
                                          <Phone className="w-4 h-4 mr-2" />
                                          Call
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}