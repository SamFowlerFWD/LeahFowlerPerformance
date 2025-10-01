'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ResponsiveTable } from '@/components/admin/ResponsiveTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Download,
  Mail,
  Phone,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  UserCheck,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const supabase = createBrowserClient()

// Helper functions to format programme and experience names
const getProgrammeName = (programme: string): string => {
  const programmes: Record<string, string> = {
    'online-package': 'Online Package (£100/month)',
    'pathway': 'Pathway to Endurance (£48)',
    'smallgroup': 'Small Group Training (£120)',
    'semiprivate': 'Semi-Private Coaching (£90/month)',
    'silver': 'Silver Package (£140/month)',
    'gold': 'Gold Elite Package (£250/month)',
    'unsure': 'Needs Advice'
  }
  return programmes[programme] || programme
}

const getExperienceName = (experience: string): string => {
  const experiences: Record<string, string> = {
    'beginner': 'New to fitness or returning after a break',
    'intermediate': 'Regular training for 6-12 months',
    'advanced': 'Training consistently for over a year',
    'athlete': 'Former/Current Athlete with competition background'
  }
  return experiences[experience] || experience
}

// Type for coaching applications from the database
type CoachingApplication = {
  id: string
  name: string
  email: string
  phone?: string
  programme: string
  goals: string
  experience?: string
  availability?: string
  location?: string
  message?: string
  data_consent: boolean
  marketing_consent?: boolean
  status: string
  submitted_at: string
  contacted_at?: string
  notes?: string
  metadata?: any
  created_at: string
  updated_at?: string
}

interface Statistics {
  total_applications: number
  contacted_count: number
  conversion_rate: number
  pending_count: number
  programme_distribution: Record<string, number>
}

export default function AdminAssessmentsPage() {
  const [applications, setApplications] = useState<CoachingApplication[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'converted'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<CoachingApplication | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('coaching_applications')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])

      if (data && data.length > 0) {
        const contacted = data.filter(a => a.status === 'contacted')
        const converted = data.filter(a => a.status === 'converted')
        const pending = data.filter(a => a.status === 'pending')

        const programmeDistribution: Record<string, number> = {}
        data.forEach(a => {
          programmeDistribution[a.programme] = (programmeDistribution[a.programme] || 0) + 1
        })

        setStatistics({
          total_applications: data.length,
          contacted_count: contacted.length,
          conversion_rate: data.length > 0 ? (converted.length / data.length) * 100 : 0,
          pending_count: pending.length,
          programme_distribution: programmeDistribution
        })
      }
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        notes: adminNotes,
        updated_at: new Date().toISOString()
      }

      if (newStatus === 'contacted' && selectedApplication?.status !== 'contacted') {
        updateData.contacted_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('coaching_applications')
        .update(updateData)
        .eq('id', applicationId)

      if (error) throw error

      await loadApplications()
      setSelectedApplication(null)
      setAdminNotes('')
      setDialogOpen(false)
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleAnonymize = async (applicationId: string) => {
    if (confirm('Are you sure you want to anonymize this application? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('coaching_applications')
          .update({
            name: 'ANONYMIZED',
            email: 'anonymized@deleted.com',
            phone: null,
            goals: 'REMOVED',
            experience: null,
            availability: null,
            location: null,
            message: null,
            metadata: { gdpr_deletion_requested: true }
          })
          .eq('id', applicationId)

        if (error) throw error

        await loadApplications()
        setDialogOpen(false)
      } catch (error) {
        console.error('Failed to anonymize application:', error)
        alert('Failed to anonymize application')
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Programme', 'Goals', 'Experience', 'Location', 'Status', 'Date']
    const rows = applications.map(a => [
      a.name,
      a.email,
      a.phone || '',
      a.programme,
      a.goals.replace(/,/g, ';'),
      a.experience || '',
      a.location || '',
      a.status,
      format(new Date(a.submitted_at), 'yyyy-MM-dd HH:mm')
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const filteredApplications = applications
    .filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(a => {
      if (filter === 'all') return true
      return a.status === filter
    })

  // Prepare table columns
  const tableColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => <span className="font-medium text-navy">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => <span className="text-sm">{value}</span>
    },
    {
      key: 'programme',
      label: 'Programme',
      render: (value: string) => (
        <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20">
          {getProgrammeName(value)}
        </Badge>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => value || 'Not specified'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          className={cn(
            'font-medium',
            value === 'pending' && 'bg-amber-100 text-amber-800 border-amber-200',
            value === 'contacted' && 'bg-navy/10 text-navy border-navy/20',
            value === 'converted' && 'bg-emerald-100 text-emerald-800 border-emerald-200',
            value === 'archived' && 'bg-gray-100 text-gray-600 border-gray-200'
          )}
        >
          {value}
        </Badge>
      )
    },
    {
      key: 'submitted_at',
      label: 'Date',
      render: (value: string) => format(new Date(value), 'MMM d, yyyy')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: CoachingApplication) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedApplication(row)
            setDialogOpen(true)
          }}
          className="min-h-[36px]"
        >
          View
        </Button>
      )
    }
  ]

  const handleRowAction = (action: string, row: CoachingApplication) => {
    if (action === 'view') {
      setSelectedApplication(row)
      setDialogOpen(true)
    } else if (action === 'contact') {
      window.location.href = `mailto:${row.email}`
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Coaching Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review coaching application submissions</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy">{statistics.total_applications}</span>
                  <Users className="w-8 h-8 text-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Contacted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy">{statistics.contacted_count}</span>
                  <UserCheck className="w-8 h-8 text-emerald" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy">{statistics.conversion_rate.toFixed(1)}%</span>
                  <TrendingUp className="w-8 h-8 text-navy" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy">{statistics.pending_count}</span>
                  <Clock className="w-8 h-8 text-gold/70" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-navy">Applications</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => loadApplications()}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial min-h-[40px] hover:bg-gold/10 hover:text-gold hover:border-gold/30"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial min-h-[40px] hover:bg-navy/10 hover:text-navy hover:border-navy/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'pending' | 'contacted' | 'converted')}>
                <SelectTrigger className="w-full sm:w-40 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <ResponsiveTable
              columns={tableColumns}
              data={filteredApplications}
              onRowAction={handleRowAction}
              mobileBreakpoint="lg"
            />
          </CardContent>
        </Card>

        {/* Application Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-navy">Application Details</DialogTitle>
              <DialogDescription>
                {selectedApplication && `Application from ${selectedApplication.name} on ${format(new Date(selectedApplication.submitted_at), 'MMMM d, yyyy')}`}
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Name</Label>
                    <p className="font-medium text-navy mt-1">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium text-navy mt-1">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="font-medium text-navy mt-1">{selectedApplication.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <div className="mt-1">
                      <Badge
                        className={cn(
                          'font-medium',
                          selectedApplication.status === 'pending' && 'bg-amber-100 text-amber-800',
                          selectedApplication.status === 'contacted' && 'bg-navy/10 text-navy',
                          selectedApplication.status === 'converted' && 'bg-emerald-100 text-emerald-800'
                        )}
                      >
                        {selectedApplication.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Programme Interest</Label>
                  <p className="font-medium text-navy mt-1">{getProgrammeName(selectedApplication.programme)}</p>
                </div>

                <div>
                  <Label className="text-gray-500">Goals</Label>
                  <p className="mt-1 p-3 bg-gold/5 rounded-lg text-navy border border-gold/10">
                    {selectedApplication.goals}
                  </p>
                </div>

                {selectedApplication.experience && (
                  <div>
                    <Label className="text-gray-500">Experience Level</Label>
                    <p className="mt-1">{getExperienceName(selectedApplication.experience)}</p>
                  </div>
                )}

                {selectedApplication.availability && (
                  <div>
                    <Label className="text-gray-500">Availability</Label>
                    <p className="mt-1">{selectedApplication.availability}</p>
                  </div>
                )}

                {selectedApplication.location && (
                  <div>
                    <Label className="text-gray-500">Location</Label>
                    <p className="mt-1">{selectedApplication.location}</p>
                  </div>
                )}

                {selectedApplication.message && (
                  <div>
                    <Label className="text-gray-500">Additional Message</Label>
                    <p className="mt-1 p-3 bg-navy/5 rounded-lg text-navy border border-navy/10">
                      {selectedApplication.message}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-gray-500">Consent Status</Label>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong>Data Processing:</strong> {selectedApplication.data_consent ? '✓ Consented' : '✗ Not Consented'}
                    </p>
                    <p className="text-sm">
                      <strong>Marketing:</strong> {selectedApplication.marketing_consent ? '✓ Consented' : '✗ Not Consented'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Update Status</Label>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => handleStatusUpdate(selectedApplication.id, value)}
                  >
                    <SelectTrigger className="mt-2 min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-500">Admin Notes</Label>
                  <Textarea
                    className="mt-2"
                    placeholder="Add notes about this application..."
                    value={adminNotes || selectedApplication.notes || ''}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAnonymize(selectedApplication.id)}
                    className="min-h-[44px]"
                  >
                    Anonymize (GDPR)
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `mailto:${selectedApplication.email}`}
                      className="flex-1 sm:flex-initial min-h-[44px] hover:bg-gold/10 hover:text-gold hover:border-gold/30"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    {selectedApplication.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `tel:${selectedApplication.phone}`}
                        className="flex-1 sm:flex-initial min-h-[44px] hover:bg-navy/10 hover:text-navy hover:border-navy/30"
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
    </AdminLayout>
  )
}