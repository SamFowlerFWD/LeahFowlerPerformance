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

interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  details?: unknown
}

/**
 * Make a type-safe API request with proper error handling
 */
export async function apiRequest<T = any>(
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
export async function submitAssessment(
  data: unknown,
  maxRetries = 2
): Promise<any> {
  let lastError: Error | null = null
  
  for (const attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest('/api/assessment/submit', {
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
export async function gdprRequest(
  email: string,
  requestType: 'access' | 'portability' | 'deletion' | 'rectification',
  verificationToken?: string,
  updates?: Record<string, unknown>
): Promise<any> {
  return apiRequest('/api/assessment/gdpr', {
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
export async function verifyGDPRToken(
  token: string,
  email: string
): Promise<{ valid: boolean; requestType: string }> {
  return apiRequest(`/api/assessment/gdpr/verify?token=${token}&email=${email}`)
}

/**
 * Admin: Get assessment submissions
 */
export async function getAssessmentSubmissions(
  authToken: string,
  filter?: 'all' | 'qualified' | 'new' | 'contacted',
  limit = 100,
  offset = 0
): Promise<any> {
  const params = new URLSearchParams({
    ...(filter && { filter }),
    limit: limit.toString(),
    offset: offset.toString()
  })

  return apiRequest(`/api/assessment/admin?${params}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
}

/**
 * Admin: Update submission status
 */
export async function updateSubmissionStatus(
  authToken: string,
  submissionId: string,
  status: string,
  adminNotes?: string
): Promise<any> {
  return apiRequest('/api/assessment/admin', {
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
export async function anonymizeSubmission(
  authToken: string,
  submissionId: string
): Promise<any> {
  return apiRequest(`/api/assessment/admin?id=${submissionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
}