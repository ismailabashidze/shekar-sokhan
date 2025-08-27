import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type { ClientNoteDto } from '~/types/api'

// Notes state
const notesState = ref({
  clientNotes: [] as ClientNoteDto[],
  isLoading: false,
  isCreating: false,
  error: null as string | null,
})

// Notes errors
const notesError = ref<string | null>(null)
const isNotesLoading = ref(false)
const isNotesCreating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Note not found': 'یادداشت یافت نشد',
  'Invalid note data': 'داده‌های یادداشت نامعتبر است',
  'Note creation failed': 'ایجاد یادداشت ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Client not found': 'کاربر یافت نشد',
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
      return 'یادداشت یافت نشد'
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
const clientNotes = computed(() => notesState.value.clientNotes)

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

// Get client notes
const getClientNotes = async (clientId: string): Promise<ClientNoteDto[] | null> => {
  isNotesLoading.value = true
  notesError.value = null

  try {
    const notes = await apiRequest<ClientNoteDto[]>(`/api/v1/counselor/me/clients/${clientId}/notes`)
    notesState.value.clientNotes = notes
    return notes
  }
  catch (error: any) {
    notesError.value = error.message || 'دریافت یادداشت‌های کاربر ناموفق بود'
    return null
  }
  finally {
    isNotesLoading.value = false
  }
}

// Add client note
const addClientNote = async (clientId: string, content: string): Promise<ClientNoteDto | null> => {
  isNotesCreating.value = true
  notesError.value = null

  try {
    const newNote = await apiRequest<ClientNoteDto>(
      `/api/v1/counselor/me/clients/${clientId}/notes`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
    )

    // Add to local state
    notesState.value.clientNotes.push(newNote)

    return newNote
  }
  catch (error: any) {
    notesError.value = error.message || 'افزودن یادداشت کاربر ناموفق بود'
    return null
  }
  finally {
    isNotesCreating.value = false
  }
}

// Export everything
export const useNotes = () => {
  return {
    // State
    notesState: readonly(notesState),
    notesError: readonly(notesError),
    isNotesLoading: readonly(isNotesLoading),
    isNotesCreating: readonly(isNotesCreating),

    // Computed
    clientNotes,

    // Methods
    getClientNotes,
    addClientNote,
  }
}