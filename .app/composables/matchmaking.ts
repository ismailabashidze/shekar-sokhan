/**
 * Matchmaking Service Composable
 * Based on OpenAPI Matchmaking Service specification
 */

export type SuggestionStatus = 
  | 'NEW'
  | 'VIEWED' 
  | 'LIKED'
  | 'REQUESTED'
  | 'EXPIRED'

export type SuggestionAction =
  | 'LIKED'
  | 'DISMISSED'

export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'

export type ModuleStatus =
  | 'ENABLED'
  | 'DISABLED_BY_USER'
  | 'DISABLED_BY_ADMIN'
  | 'PENDING'

export interface Analysis {
  compatibilityFactors: string[]
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  summary: string
}

export interface MatchSuggestion {
  id: string
  suggestedUserId: string
  compatibilityScore: number
  analysis: Analysis
  status: SuggestionStatus
  createdAt: string
  expiresAt?: string
}

export interface SuggestionList {
  suggestions: MatchSuggestion[]
  total: number
  page: number
}

export interface UpdateSuggestionRequest {
  action: SuggestionAction
  feedback?: string
}

export interface IntroductionRequest {
  id: string
  requesterId: string
  targetId: string
  status: RequestStatus
  message?: string
  requestedAt: string
  respondedAt?: string
}

export interface IntroductionRequestList {
  requests: IntroductionRequest[]
  total: number
  page: number
}

export interface CreateIntroductionRequest {
  targetId: string
  message?: string
}

export interface RespondRequest {
  action: 'accept' | 'reject'
  message?: string
}

export interface PairAnalysisView {
  userId: string
  compatibilityScore: number
  analysis: Analysis
  createdAt: string
}

export interface AnalysisViewList {
  analyses: PairAnalysisView[]
  total: number
  page: number
}

export interface MatchmakingModule {
  id: string
  userId: string
  status: ModuleStatus
  enabledAt?: string
  disabledAt?: string
  disabledReason?: string
}

export interface SuggestionListParams {
  minScore?: number
  limit?: number
  page?: number
}

export interface IntroductionRequestListParams {
  status?: RequestStatus
  limit?: number
  page?: number
}

export interface AnalysisListParams {
  limit?: number
  page?: number
}

/**
 * Matchmaking service composable for managing suggestions, requests, and analysis
 */
export function useMatchmaking() {
  const { $fetch } = useNuxtApp()

  /**
   * Get matchmaking suggestions for the logged-in user
   * @param params Query parameters for filtering suggestions
   * @returns List of match suggestions
   */
  const getSuggestions = async (params?: SuggestionListParams): Promise<SuggestionList> => {
    const query = new URLSearchParams()
    
    if (params?.minScore !== undefined) query.set('minScore', params.minScore.toString())
    if (params?.limit !== undefined) query.set('limit', params.limit.toString())
    if (params?.page !== undefined) query.set('page', params.page.toString())

    const url = `/api/v1/matchmaking/suggestions${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  /**
   * Update suggestion status/action
   * @param suggestionId Suggestion identifier
   * @param request Update request data
   * @returns Updated suggestion
   */
  const updateSuggestionStatus = async (
    suggestionId: string, 
    request: UpdateSuggestionRequest
  ): Promise<MatchSuggestion> => {
    return await $fetch(`/api/v1/matchmaking/suggestions/${suggestionId}`, {
      method: 'PUT',
      body: request
    })
  }

  /**
   * Get all matchmaking analyses for the user
   * @param params Query parameters for pagination
   * @returns List of pair analyses
   */
  const getAnalyses = async (params?: AnalysisListParams): Promise<AnalysisViewList> => {
    const query = new URLSearchParams()
    
    if (params?.limit !== undefined) query.set('limit', params.limit.toString())
    if (params?.page !== undefined) query.set('page', params.page.toString())

    const url = `/api/v1/matchmaking/analysis${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  /**
   * Get pair analysis with a specific user
   * @param userId Target user identifier
   * @returns Pair compatibility analysis
   */
  const getPairAnalysis = async (userId: string): Promise<PairAnalysisView> => {
    return await $fetch(`/api/v1/matchmaking/analysis/pairs/${userId}`)
  }

  /**
   * Create introduction request to another user
   * @param request Introduction request data
   * @returns Created introduction request
   */
  const createIntroductionRequest = async (request: CreateIntroductionRequest): Promise<IntroductionRequest> => {
    return await $fetch('/api/v1/matchmaking/requests', {
      method: 'POST',
      body: request
    })
  }

  /**
   * Get introduction requests for the logged-in user
   * @param params Query parameters for filtering
   * @returns List of introduction requests
   */
  const getIntroductionRequests = async (params?: IntroductionRequestListParams): Promise<IntroductionRequestList> => {
    const query = new URLSearchParams()
    
    if (params?.status) query.set('status', params.status)
    if (params?.limit !== undefined) query.set('limit', params.limit.toString())
    if (params?.page !== undefined) query.set('page', params.page.toString())

    const url = `/api/v1/matchmaking/requests${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  /**
   * Respond to an introduction request
   * @param requestId Request identifier
   * @param response Response data (accept/reject)
   * @returns Updated introduction request
   */
  const respondToRequest = async (requestId: string, response: RespondRequest): Promise<IntroductionRequest> => {
    return await $fetch(`/api/v1/matchmaking/requests/${requestId}/respond`, {
      method: 'PUT',
      body: response
    })
  }

  /**
   * Get matchmaking module status for the user
   * @returns Module status information
   */
  const getModuleStatus = async (): Promise<MatchmakingModule> => {
    return await $fetch('/api/v1/matchmaking/module/status')
  }

  /**
   * Disable matchmaking module for the user
   * @returns Updated module status
   */
  const disableModule = async (): Promise<MatchmakingModule> => {
    return await $fetch('/api/v1/matchmaking/module/disable', {
      method: 'PUT'
    })
  }

  /**
   * Admin: List matchmaking modules for all users
   * @returns List of user modules
   */
  const listModulesAdmin = async (): Promise<MatchmakingModule[]> => {
    return await $fetch('/api/v1/admin/matchmaking/modules')
  }

  /**
   * Admin: Update module status for a specific user
   * @param userId User identifier
   * @param status New module status
   * @returns Updated module
   */
  const updateModuleStatusAdmin = async (userId: string, status: ModuleStatus): Promise<MatchmakingModule> => {
    return await $fetch(`/api/v1/admin/matchmaking/modules/${userId}/status`, {
      method: 'PUT',
      body: { status }
    })
  }

  /**
   * Like a suggestion (convenience method)
   * @param suggestionId Suggestion identifier
   * @param feedback Optional feedback message
   * @returns Updated suggestion
   */
  const likeSuggestion = async (suggestionId: string, feedback?: string): Promise<MatchSuggestion> => {
    return await updateSuggestionStatus(suggestionId, {
      action: 'LIKED',
      feedback
    })
  }

  /**
   * Dismiss a suggestion (convenience method)
   * @param suggestionId Suggestion identifier  
   * @param feedback Optional feedback message
   * @returns Updated suggestion
   */
  const dismissSuggestion = async (suggestionId: string, feedback?: string): Promise<MatchSuggestion> => {
    return await updateSuggestionStatus(suggestionId, {
      action: 'DISMISSED',
      feedback
    })
  }

  /**
   * Accept an introduction request (convenience method)
   * @param requestId Request identifier
   * @param message Optional response message
   * @returns Updated request
   */
  const acceptRequest = async (requestId: string, message?: string): Promise<IntroductionRequest> => {
    return await respondToRequest(requestId, {
      action: 'accept',
      message
    })
  }

  /**
   * Reject an introduction request (convenience method)
   * @param requestId Request identifier
   * @param message Optional response message
   * @returns Updated request
   */
  const rejectRequest = async (requestId: string, message?: string): Promise<IntroductionRequest> => {
    return await respondToRequest(requestId, {
      action: 'reject', 
      message
    })
  }

  /**
   * Get suggestion status label in Persian
   * @param status Suggestion status
   * @returns Persian label
   */
  const getSuggestionStatusLabel = (status: SuggestionStatus): string => {
    const labels: Record<SuggestionStatus, string> = {
      'NEW': 'جدید',
      'VIEWED': 'مشاهده شده', 
      'LIKED': 'پسندیده شده',
      'REQUESTED': 'درخواست شده',
      'EXPIRED': 'منقضی شده'
    }
    return labels[status] || status
  }

  /**
   * Get request status label in Persian
   * @param status Request status
   * @returns Persian label
   */
  const getRequestStatusLabel = (status: RequestStatus): string => {
    const labels: Record<RequestStatus, string> = {
      'PENDING': 'در انتظار',
      'ACCEPTED': 'پذیرفته شده',
      'REJECTED': 'رد شده',
      'EXPIRED': 'منقضی شده'
    }
    return labels[status] || status
  }

  /**
   * Get module status label in Persian
   * @param status Module status
   * @returns Persian label
   */
  const getModuleStatusLabel = (status: ModuleStatus): string => {
    const labels: Record<ModuleStatus, string> = {
      'ENABLED': 'فعال',
      'DISABLED_BY_USER': 'غیرفعال شده توسط کاربر',
      'DISABLED_BY_ADMIN': 'غیرفعال شده توسط مدیر',
      'PENDING': 'در انتظار'
    }
    return labels[status] || status
  }

  /**
   * Get compatibility score color class
   * @param score Compatibility score (0-1)
   * @returns Tailwind color class
   */
  const getCompatibilityScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    if (score >= 0.4) return 'text-orange-600'
    return 'text-red-600'
  }

  /**
   * Format compatibility score as percentage
   * @param score Compatibility score (0-1)
   * @returns Formatted percentage string
   */
  const formatCompatibilityScore = (score: number): string => {
    return `${Math.round(score * 100)}%`
  }

  /**
   * Check if suggestion is expired
   * @param suggestion Match suggestion
   * @returns True if expired
   */
  const isSuggestionExpired = (suggestion: MatchSuggestion): boolean => {
    if (!suggestion.expiresAt) return false
    return new Date(suggestion.expiresAt) < new Date()
  }

  /**
   * Get suggestion action icon
   * @param action Suggestion action
   * @returns Icon name
   */
  const getSuggestionActionIcon = (action: SuggestionAction): string => {
    return action === 'LIKED' ? 'ph:heart' : 'ph:x'
  }

  /**
   * Get request status icon  
   * @param status Request status
   * @returns Icon name
   */
  const getRequestStatusIcon = (status: RequestStatus): string => {
    switch (status) {
      case 'PENDING': return 'ph:clock'
      case 'ACCEPTED': return 'ph:check-circle'
      case 'REJECTED': return 'ph:x-circle'
      case 'EXPIRED': return 'ph:warning'
      default: return 'ph:question'
    }
  }

  return {
    // Core API methods
    getSuggestions,
    updateSuggestionStatus,
    getAnalyses,
    getPairAnalysis,
    createIntroductionRequest,
    getIntroductionRequests,
    respondToRequest,
    getModuleStatus,
    disableModule,
    
    // Admin methods
    listModulesAdmin,
    updateModuleStatusAdmin,
    
    // Convenience methods
    likeSuggestion,
    dismissSuggestion,
    acceptRequest,
    rejectRequest,
    
    // Utility functions
    getSuggestionStatusLabel,
    getRequestStatusLabel,
    getModuleStatusLabel,
    getCompatibilityScoreColor,
    formatCompatibilityScore,
    isSuggestionExpired,
    getSuggestionActionIcon,
    getRequestStatusIcon
  }
}