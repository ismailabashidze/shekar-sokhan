import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  CounselingSessionDto,
  CreateSessionDto,
  UpdateSessionDto,
  SessionListResponseDto,
} from '~/types/api'

// Sessions state
const sessionsState = ref({
  sessions: [] as CounselingSessionDto[],
  currentSession: null as CounselingSessionDto | null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null as string | null,
  totalSessions: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Sessions errors
const sessionsError = ref<string | null>(null)
const isSessionsLoading = ref(false)
const isSessionsCreating = ref(false)
const isSessionsUpdating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Session not found': 'جلسه یافت نشد',
  'Invalid session data': 'داده‌های جلسه نامعتبر است',
  'Session creation failed': 'ایجاد جلسه ناموفق بود',
  'Session update failed': 'به‌روزرسانی جلسه ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Counselor not found': 'مشاور یافت نشد',
  'Invalid time slot': 'بازه زمانی نامعتبر است',
  'Time slot not available': 'بازه زمانی در دسترس نیست',
  'Session already booked': 'جلسه قبلاً رزرو شده است',
}

// Function to translate error messages
const translateError = (error: any): string => {
  // Convert error to string if it's not already
  const errorMessage = typeof error === 'string'
    ? error
    : error?.message
      ? error.message
      : JSON.stringify(error)

  // Check if we have a direct translation
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  // Handle HTTP status codes (only if errorMessage is a string)
  if (typeof errorMessage === 'string') {
    if (errorMessage.startsWith('HTTP 400:')) {
      return 'درخواست نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 401:')) {
      return 'احراز هویت ناموفق بود'
    }
    if (errorMessage.startsWith('HTTP 403:')) {
      return 'دسترسی غیرمجاز'
    }
    if (errorMessage.startsWith('HTTP 404:')) {
      return 'جلسه یافت نشد'
    }
    if (errorMessage.startsWith('HTTP 409:')) {
      return 'تداخل در درخواست'
    }
    if (errorMessage.startsWith('HTTP 422:')) {
      return 'اطلاعات ارسالی نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 429:')) {
      return 'تعداد درخواست‌ها بیش از حد مجاز است'
    }
    if (errorMessage.startsWith('HTTP 500:')) {
      return 'خطای سرور'
    }
    if (errorMessage.startsWith('HTTP 502:')) {
      return 'خطای دروازه'
    }
    if (errorMessage.startsWith('HTTP 503:')) {
      return 'سرویس در دسترس نیست'
    }
    if (errorMessage.startsWith('HTTP 504:')) {
      return 'وقفه در پاسخ سرور'
    }
  }

  // Default fallback
  return errorMessage
}

// Computed properties
const userSessions = computed(() => sessionsState.value.sessions)
const currentSession = computed(() => sessionsState.value.currentSession)

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
}

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${getApiBaseUrl()}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth header if available and not explicitly excluded
  const authStore = useAuth()
  if (authStore.authTokens.value.accessToken && !options.headers?.['X-Skip-Auth']) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authStore.authTokens.value.accessToken}`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(translateError(errorMessage))
    }

    return await response.json()
  }
  catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw new Error(translateError(error))
  }
}

// Get user sessions
const getUserSessions = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<SessionListResponseDto | null> => {
  isSessionsLoading.value = true
  sessionsError.value = null

  try {
    let url = `/api/v1/sessions?page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    const result = await apiRequest<SessionListResponseDto>(url)

    // Update local state
    if (page === 1) {
      sessionsState.value.sessions = result.sessions
    }
    else {
      sessionsState.value.sessions = [
        ...sessionsState.value.sessions,
        ...result.sessions,
      ]
    }

    sessionsState.value.totalSessions = result.total
    sessionsState.value.currentPage = page
    sessionsState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    sessionsError.value = error.message || 'دریافت جلسات ناموفق بود'
    return null
  }
  finally {
    isSessionsLoading.value = false
  }
}

// Get session by ID
const getSessionById = async (sessionId: string): Promise<CounselingSessionDto | null> => {
  isSessionsLoading.value = true
  sessionsError.value = null

  try {
    const session = await apiRequest<CounselingSessionDto>(`/api/v1/sessions/${sessionId}`)
    sessionsState.value.currentSession = session
    return session
  }
  catch (error: any) {
    sessionsError.value = error.message || 'دریافت جلسه ناموفق بود'
    return null
  }
  finally {
    isSessionsLoading.value = false
  }
}

// Create a new session
const createSession = async (data: CreateSessionDto): Promise<CounselingSessionDto | null> => {
  isSessionsCreating.value = true
  sessionsError.value = null

  try {
    const newSession = await apiRequest<CounselingSessionDto>('/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state at the beginning
    sessionsState.value.sessions.unshift(newSession)
    sessionsState.value.totalSessions++

    return newSession
  }
  catch (error: any) {
    sessionsError.value = error.message || 'ایجاد جلسه ناموفق بود'
    return null
  }
  finally {
    isSessionsCreating.value = false
  }
}

// Update session
const updateSession = async (
  sessionId: string,
  data: UpdateSessionDto,
): Promise<CounselingSessionDto | null> => {
  isSessionsUpdating.value = true
  sessionsError.value = null

  try {
    const updatedSession = await apiRequest<CounselingSessionDto>(`/api/v1/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update in local state
    const index = sessionsState.value.sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessionsState.value.sessions[index] = updatedSession
    }

    // Update current session if it's the one being updated
    if (sessionsState.value.currentSession?.id === sessionId) {
      sessionsState.value.currentSession = updatedSession
    }

    return updatedSession
  }
  catch (error: any) {
    sessionsError.value = error.message || 'به‌روزرسانی جلسه ناموفق بود'
    return null
  }
  finally {
    isSessionsUpdating.value = false
  }
}

// Cancel session
const cancelSession = async (sessionId: string): Promise<boolean> => {
  isSessionsLoading.value = true
  sessionsError.value = null

  try {
    await apiRequest<void>(`/api/v1/sessions/${sessionId}/cancel`, {
      method: 'POST',
    })

    // Update local state
    const index = sessionsState.value.sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessionsState.value.sessions[index].status = 'CANCELLED'
    }

    // Update current session if it's the one being cancelled
    if (sessionsState.value.currentSession?.id === sessionId) {
      sessionsState.value.currentSession.status = 'CANCELLED'
    }

    return true
  }
  catch (error: any) {
    sessionsError.value = error.message || 'لغو جلسه ناموفق بود'
    return false
  }
  finally {
    isSessionsLoading.value = false
  }
}

// Export everything
export const useSessions = () => {
  return {
    // State
    sessionsState: readonly(sessionsState),
    sessionsError: readonly(sessionsError),
    isSessionsLoading: readonly(isSessionsLoading),
    isSessionsCreating: readonly(isSessionsCreating),
    isSessionsUpdating: readonly(isSessionsUpdating),

    // Computed
    userSessions,
    currentSession,

    // Methods
    getUserSessions,
    getSessionById,
    createSession,
    updateSession,
    cancelSession,
  }
}