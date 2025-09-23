/**
 * API Client utilities for making secure, type-safe API calls
 */

export class APIError extends Error {
  code?: string
  status?: number
  details?: unknown

  constructor(message: string, code?: string, status?: number, details?: unknown) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.status = status
    this.details = details
  }
}

interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
  details?: unknown
}

/**
 * Make a type-safe API request with proper error handling
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    const result: APIResponse<T> = await response.json()

    if (!response.ok || !result.success) {
      throw new APIError(
        result.error || 'Request failed',
        result.code,
        response.status,
        result.details
      )
    }

    return result.data as T
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Network error. Please check your connection.', 'NETWORK_ERROR')
    }

    throw new APIError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      undefined,
      error
    )
  }
}

/**
 * Submit assessment with retry logic for resilience
 */
interface AssessmentSubmissionResponse {
  id: string
  recommendation: string
  qualificationScore: number
  messages?: string[]
}

export async function submitAssessment(
  data: unknown,
  maxRetries = 2
): Promise<AssessmentSubmissionResponse> {
  let lastError: Error | null = null
  
  for (const attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<AssessmentSubmissionResponse>('/api/assessment/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on validation errors or duplicate submissions
      if (error instanceof APIError) {
        if (error.status === 400 || error.status === 409) {
          throw error
        }
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  
  throw lastError || new APIError(' Failed after multiple attempts')
}

/**
 * Handle GDPR data requests
 */
interface GDPRResponse {
  success: boolean
  message: string
  data?: unknown
  verificationRequired?: boolean
}

export async function gdprRequest(
  email: string,
  requestType: 'access' | 'portability' | 'deletion' | 'rectification',
  verificationToken?: string,
  updates?: Record<string, unknown>
): Promise<GDPRResponse> {
  return apiRequest<GDPRResponse>('/api/assessment/gdpr', {
    method: 'POST',
    body: JSON.stringify({
      email,
      requestType,
      verificationToken,
      updates
    })
  })
}

/**
 * Verify GDPR request token
 */
interface GDPRVerificationResponse {
  valid: boolean
  requestType: string
}

export async function verifyGDPRToken(
  token: string,
  email: string
): Promise<GDPRVerificationResponse> {
  return apiRequest<GDPRVerificationResponse>(`/api/assessment/gdpr/verify?token=${token}&email=${email}`)
}

/**
 * Admin: Get assessment submissions
 */
interface AssessmentSubmission {
  id: string
  createdAt: string
  email: string
  name?: string
  status: string
  qualificationScore: number
  responses: Record<string, unknown>
  recommendation: string
  adminNotes?: string
}

interface SubmissionsResponse {
  submissions: AssessmentSubmission[]
  total: number
  limit: number
  offset: number
}

export async function getAssessmentSubmissions(
  authToken: string,
  filter?: 'all' | 'qualified' | 'new' | 'contacted',
  limit = 100,
  offset = 0
): Promise<SubmissionsResponse> {
  const params = new URLSearchParams({
    ...(filter && { filter }),
    limit: limit.toString(),
    offset: offset.toString()
  })

  return apiRequest<SubmissionsResponse>(`/api/assessment/admin?${params}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
}

/**
 * Admin: Update submission status
 */
interface UpdateStatusResponse {
  success: boolean
  message: string
  updatedSubmission?: AssessmentSubmission
}

export async function updateSubmissionStatus(
  authToken: string,
  submissionId: string,
  status: string,
  adminNotes?: string
): Promise<UpdateStatusResponse> {
  return apiRequest<UpdateStatusResponse>('/api/assessment/admin', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      submissionId,
      status,
      adminNotes
    })
  })
}

/**
 * Admin: Anonymize submission (GDPR)
 */
interface AnonymizeResponse {
  success: boolean
  message: string
  anonymizedId?: string
}

export async function anonymizeSubmission(
  authToken: string,
  submissionId: string
): Promise<AnonymizeResponse> {
  return apiRequest<AnonymizeResponse>(`/api/assessment/admin?id=${submissionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
}