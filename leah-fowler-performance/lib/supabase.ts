import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export the client instance
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export a function to create new clients (for route handlers)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Types for database tables
export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  location?: string
  occupation?: string
  company?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface PerformanceGoal {
  id: string
  user_id: string
  title: string
  description?: string
  target_date?: string
  category?: 'career' | 'fitness' | 'mindset' | 'productivity' | 'wellbeing' | 'leadership'
  status: 'active' | 'completed' | 'paused' | 'archived'
  priority?: number
  created_at: string
  updated_at: string
}

export interface AssessmentResult {
  id: string
  user_id: string
  assessment_type: 'initial' | 'quarterly' | 'annual' | 'custom'
  physical_energy?: number
  mental_clarity?: number
  emotional_balance?: number
  purpose_alignment?: number
  productivity_efficiency?: number
  stress_management?: number
  work_life_balance?: number
  leadership_impact?: number
  overall_score?: number
  strengths?: string[]
  improvement_areas?: string[]
  recommended_programme?: string
  responses?: Record<string, unknown>
  completed_at: string
  created_at: string
}

export interface Programme {
  id: string
  title: string
  slug: string
  description?: string
  overview?: string
  duration_weeks?: number
  price_gbp?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: 'executive' | 'entrepreneur' | 'athlete' | 'professional' | 'custom'
  features?: string[]
  outcomes?: string[]
  is_active: boolean
  max_participants?: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  booking_type?: 'consultation' | 'coaching_session' | 'assessment' | 'workshop'
  title: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  location?: 'online' | 'in_person' | 'hybrid'
  meeting_link?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  price_gbp?: number
  payment_status?: 'pending' | 'paid' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  user_id?: string
  name: string
  role?: string
  company?: string
  content: string
  rating?: number
  is_featured: boolean
  is_published: boolean
  published_at?: string
  created_at: string
}

export interface AssessmentSubmission {
  id: string
  // User Information
  name: string
  email: string
  phone?: string
  
  // Assessment Metadata
  assessment_version?: string
  submission_date: string
  completion_time_seconds?: number
  
  // Assessment Data
  answers: Record<string, unknown>
  profile: {
    qualified: boolean
    tier: 'not-qualified' | 'developing' | 'established' | 'elite'
    investmentLevel: 'low' | 'moderate' | 'high' | 'premium'
    readinessScore: number
    performanceLevel: string
    strengths: string[]
    gaps: string[]
    recommendedProgramme: string
    estimatedInvestment: string
    nextSteps: string[]
    disqualificationReason?: string
  }
  qualified: boolean
  tier: 'not-qualified' | 'developing' | 'established' | 'elite'
  investment_level: 'low' | 'moderate' | 'high' | 'premium'
  readiness_score: number
  performance_level: string
  recommended_programme: string
  estimated_investment: string
  
  // GDPR Compliance
  consent_given: boolean
  consent_timestamp?: string
  consent_version?: string
  marketing_consent?: boolean
  contact_preference?: 'email' | 'phone' | 'both' | 'none'
  
  // Admin Fields
  contacted?: boolean
  contacted_date?: string
  contacted_by?: string
  admin_notes?: string
  follow_up_date?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'not_qualified' | 'archived'
  
  // Analytics
  source?: string
  medium?: string
  campaign?: string
  referrer?: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface GDPRConsentLog {
  id: string
  submission_id: string
  email: string
  consent_type: 'assessment' | 'marketing' | 'data_processing'
  consent_given: boolean
  consent_timestamp: string
  consent_version: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Subscription types
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  tier: 'foundation' | 'performance' | 'elite' | 'youth'
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused'
  billing_period: 'monthly' | 'quarterly' | 'annual'
  price_gbp: number
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  cancelled_at?: string
  trial_start?: string
  trial_end?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_payment_method_id: string
  type: string
  card_brand?: string
  card_last4?: string
  card_exp_month?: number
  card_exp_year?: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  subscription_id: string
  stripe_invoice_id: string
  invoice_number?: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  amount_paid: number
  amount_due: number
  amount_remaining: number
  subtotal: number
  tax: number
  total: number
  currency: string
  description?: string
  period_start?: string
  period_end?: string
  due_date?: string
  paid_at?: string
  invoice_pdf?: string
  hosted_invoice_url?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface PricingTier {
  id: string
  tier: 'foundation' | 'performance' | 'elite' | 'youth'
  name: string
  slug: string
  stripe_price_id_monthly?: string
  stripe_price_id_quarterly?: string
  stripe_price_id_annual?: string
  price_monthly_gbp: number
  price_quarterly_gbp: number
  price_annual_gbp: number
  description?: string
  features?: string[]
  badge?: string
  is_popular: boolean
  is_active: boolean
  display_order: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Helper functions for common database operations
export const profileQueries = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as Profile
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as Profile
  }
}

export const assessmentQueries = {
  saveAssessment: async (assessment: Omit<AssessmentResult, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert(assessment)
      .single()
    
    if (error) throw error
    return data as AssessmentResult
  },

  getUserAssessments: async (userId: string) => {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
    
    if (error) throw error
    return data as AssessmentResult[]
  }
}

export const programmeQueries = {
  getAllProgrammes: async () => {
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Programme[]
  },

  getProgrammeBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('programmes')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as Programme
  }
}

export const bookingQueries = {
  createBooking: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .single()
    
    if (error) throw error
    return data as Booking
  },

  getUserBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true })
    
    if (error) throw error
    return data as Booking[]
  }
}

export const testimonialQueries = {
  getFeaturedTestimonials: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) throw error
    return data as Testimonial[]
  }
}

export const assessmentSubmissionQueries = {
  submitAssessment: async (submission: Omit<AssessmentSubmission, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .insert(submission)
      .select()
      .single()
    
    if (error) throw error
    return data as AssessmentSubmission
  },

  logGDPRConsent: async (consent: Omit<GDPRConsentLog, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('gdpr_consent_log')
      .insert(consent)
      .select()
      .single()
    
    if (error) throw error
    return data as GDPRConsentLog
  },

  getAllSubmissions: async () => {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as AssessmentSubmission[]
  },

  getQualifiedSubmissions: async () => {
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('qualified', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as AssessmentSubmission[]
  },

  updateSubmissionStatus: async (id: string, status: AssessmentSubmission['status'], adminNotes?: string) => {
    const updates: Record<string, unknown> = { status }
    if (adminNotes) updates.admin_notes = adminNotes
    if (status === 'contacted') {
      updates.contacted = true
      updates.contacted_date = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('assessment_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as AssessmentSubmission
  },

  getAssessmentStatistics: async () => {
    const { data, error } = await supabase
      .rpc('get_assessment_statistics')
    
    if (error) throw error
    return data
  },

  anonymizeSubmission: async (id: string) => {
    const { error } = await supabase
      .rpc('anonymize_assessment_submission', { submission_id: id })

    if (error) throw error
    return true
  }
}

export const subscriptionQueries = {
  getActiveSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data as Subscription | null
  },

  getUserSubscriptions: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Subscription[]
  },

  updateSubscription: async (subscriptionId: string, updates: Partial<Subscription>) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .single()

    if (error) throw error
    return data as Subscription
  }
}

export const paymentMethodQueries = {
  getUserPaymentMethods: async (userId: string) => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })

    if (error) throw error
    return data as PaymentMethod[]
  },

  getDefaultPaymentMethod: async (userId: string) => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as PaymentMethod | null
  }
}

export const invoiceQueries = {
  getUserInvoices: async (userId: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Invoice[]
  },

  getInvoiceById: async (invoiceId: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error) throw error
    return data as Invoice
  }
}

export const pricingTierQueries = {
  getAllTiers: async () => {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data as PricingTier[]
  },

  getTierBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as PricingTier
  }
}