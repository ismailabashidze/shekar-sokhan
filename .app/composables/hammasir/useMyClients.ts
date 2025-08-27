import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  UserProfileDto,
  CounselorApplicantLinkDto,
  UpdateCounselorApplicantLinkDto,
  ClientNoteDto,
  ClientGoalDto,
} from '~/types/api'

// My Clients state
const myClientsState = ref({
  clients: [] as UserProfileDto[],
  clientLinks: [] as CounselorApplicantLinkDto[],
  currentClient: null as UserProfileDto | null,
  currentClientLink: null as CounselorApplicantLinkDto | null,
  clientNotes: [] as ClientNoteDto[],
  clientGoals: [] as ClientGoalDto[],
  isLoading: false,
  isUpdating: false,
  error: null as string | null,
  totalClients: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Clients errors
const clientsError = ref<string | null>(null)
const isClientsLoading = ref(false)
const isClientsUpdating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Client not found': 'کاربر یافت نشد',
  'Invalid client data': 'داده‌های کاربر نامعتبر است',
  'Client update failed': 'به‌روزرسانی کاربر ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Connection not found': 'ارتباط یافت نشد',
  'Invalid connection data': 'داده‌های ارتباط نامعتبر است',
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
      return 'کاربر یافت نشد'
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
const myClientsList = computed(() => myClientsState.value.clients)
const currentClient = computed(() => myClientsState.value.currentClient)
const currentClientLink = computed(() => myClientsState.value.currentClientLink)
const clientNotes = computed(() => myClientsState.value.clientNotes)
const clientGoals = computed(() => myClientsState.value.clientGoals)

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

// Get my clients list
const getMyClients = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{ clients: UserProfileDto[], total: number } | null> => {
  isClientsLoading.value = true
  clientsError.value = null

  try {
    let url = `/api/v1/counselor/me/clients?page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    const result = await apiRequest<{ clients: UserProfileDto[], total: number }>(url)

    // Update local state
    if (page === 1) {
      myClientsState.value.clients = result.clients
    }
    else {
      myClientsState.value.clients = [
        ...myClientsState.value.clients,
        ...result.clients,
      ]
    }

    myClientsState.value.totalClients = result.total
    myClientsState.value.currentPage = page
    myClientsState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    clientsError.value = error.message || 'دریافت لیست کاربران ناموفق بود'
    return null
  }
  finally {
    isClientsLoading.value = false
  }
}

// Get client by ID
const getClientById = async (clientId: string): Promise<UserProfileDto | null> => {
  isClientsLoading.value = true
  clientsError.value = null

  try {
    const client = await apiRequest<UserProfileDto>(`/api/v1/counselor/me/clients/${clientId}`)
    myClientsState.value.currentClient = client
    return client
  }
  catch (error: any) {
    clientsError.value = error.message || 'دریافت اطلاعات کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsLoading.value = false
  }
}

// Get client connection link
const getClientLink = async (clientId: string): Promise<CounselorApplicantLinkDto | null> => {
  isClientsLoading.value = true
  clientsError.value = null

  try {
    const link = await apiRequest<CounselorApplicantLinkDto>(`/api/v1/counselor/me/clients/${clientId}/link`)
    myClientsState.value.currentClientLink = link
    return link
  }
  catch (error: any) {
    clientsError.value = error.message || 'دریافت اطلاعات ارتباط کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsLoading.value = false
  }
}

// Update client connection status
const updateClientLink = async (
  clientId: string,
  data: UpdateCounselorApplicantLinkDto,
): Promise<CounselorApplicantLinkDto | null> => {
  isClientsUpdating.value = true
  clientsError.value = null

  try {
    const updatedLink = await apiRequest<CounselorApplicantLinkDto>(
      `/api/v1/counselor/me/clients/${clientId}/link`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    )

    // Update in local state
    const index = myClientsState.value.clientLinks.findIndex(l => l.applicantId === clientId)
    if (index !== -1) {
      myClientsState.value.clientLinks[index] = updatedLink
    }

    // Update current client link if it's the one being updated
    if (myClientsState.value.currentClientLink?.applicantId === clientId) {
      myClientsState.value.currentClientLink = updatedLink
    }

    return updatedLink
  }
  catch (error: any) {
    clientsError.value = error.message || 'به‌روزرسانی ارتباط کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsUpdating.value = false
  }
}

// Get client notes
const getClientNotes = async (clientId: string): Promise<ClientNoteDto[] | null> => {
  isClientsLoading.value = true
  clientsError.value = null

  try {
    const notes = await apiRequest<ClientNoteDto[]>(`/api/v1/counselor/me/clients/${clientId}/notes`)
    myClientsState.value.clientNotes = notes
    return notes
  }
  catch (error: any) {
    clientsError.value = error.message || 'دریافت یادداشت‌های کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsLoading.value = false
  }
}

// Add client note
const addClientNote = async (clientId: string, content: string): Promise<ClientNoteDto | null> => {
  isClientsUpdating.value = true
  clientsError.value = null

  try {
    const newNote = await apiRequest<ClientNoteDto>(
      `/api/v1/counselor/me/clients/${clientId}/notes`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
    )

    // Add to local state
    myClientsState.value.clientNotes.push(newNote)

    return newNote
  }
  catch (error: any) {
    clientsError.value = error.message || 'افزودن یادداشت کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsUpdating.value = false
  }
}

// Get client goals
const getClientGoals = async (clientId: string): Promise<ClientGoalDto[] | null> => {
  isClientsLoading.value = true
  clientsError.value = null

  try {
    const goals = await apiRequest<ClientGoalDto[]>(`/api/v1/counselor/me/clients/${clientId}/goals`)
    myClientsState.value.clientGoals = goals
    return goals
  }
  catch (error: any) {
    clientsError.value = error.message || 'دریافت اهداف کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsLoading.value = false
  }
}

// Add client goal
const addClientGoal = async (
  clientId: string,
  goal: Omit<ClientGoalDto, 'createdAt'>,
): Promise<ClientGoalDto | null> => {
  isClientsUpdating.value = true
  clientsError.value = null

  try {
    const newGoal = await apiRequest<ClientGoalDto>(
      `/api/v1/counselor/me/clients/${clientId}/goals`,
      {
        method: 'POST',
        body: JSON.stringify(goal),
      },
    )

    // Add to local state
    myClientsState.value.clientGoals.push(newGoal)

    return newGoal
  }
  catch (error: any) {
    clientsError.value = error.message || 'افزودن هدف کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsUpdating.value = false
  }
}

// Update client goal
const updateClientGoal = async (
  clientId: string,
  goalId: string,
  goal: Partial<ClientGoalDto>,
): Promise<ClientGoalDto | null> => {
  isClientsUpdating.value = true
  clientsError.value = null

  try {
    const updatedGoal = await apiRequest<ClientGoalDto>(
      `/api/v1/counselor/me/clients/${clientId}/goals/${goalId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(goal),
      },
    )

    // Update in local state
    const index = myClientsState.value.clientGoals.findIndex(g => g.title === goalId)
    if (index !== -1) {
      myClientsState.value.clientGoals[index] = updatedGoal
    }

    return updatedGoal
  }
  catch (error: any) {
    clientsError.value = error.message || 'به‌روزرسانی هدف کاربر ناموفق بود'
    return null
  }
  finally {
    isClientsUpdating.value = false
  }
}

// Export everything
export const useMyClients = () => {
  return {
    // State
    myClientsState: readonly(myClientsState),
    clientsError: readonly(clientsError),
    isClientsLoading: readonly(isClientsLoading),
    isClientsUpdating: readonly(isClientsUpdating),

    // Computed
    myClientsList,
    currentClient,
    currentClientLink,
    clientNotes,
    clientGoals,

    // Methods
    getMyClients,
    getClientById,
    getClientLink,
    updateClientLink,
    getClientNotes,
    addClientNote,
    getClientGoals,
    addClientGoal,
    updateClientGoal,
  }
}
