import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  CounselorPublicProfileDto,
  CounselorProfileDto,
  SpecializationDto,
  AvailabilityDto,
  TimeSlotDto,
  CreateCounselorApplicantLinkDto,
  CounselorApplicantLinkDto,
} from '~/types/api'

// Public counselors state
const publicCounselorsState = ref({
  counselors: [] as CounselorPublicProfileDto[],
  currentCounselor: null as CounselorPublicProfileDto | null,
  isLoading: false,
  error: null as string | null,
  totalCounselors: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Counselors errors
const counselorsError = ref<string | null>(null)
const isCounselorsLoading = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Counselor not found': 'مشاور یافت نشد',
  'Invalid counselor data': 'داده‌های مشاور نامعتبر است',
  'User not found': 'کاربر یافت نشد',
  'Invalid specialization': 'تخصص نامعتبر است',
  'Invalid availability data': 'داده‌های زمان‌های کاری نامعتبر است',
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
      return 'مشاور یافت نشد'
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
const publicCounselorsList = computed(() => publicCounselorsState.value.counselors)
const currentPublicCounselor = computed(() => publicCounselorsState.value.currentCounselor)

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

// Get public counselors list
const getPublicCounselors = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  specialization?: string,
): Promise<{ counselors: CounselorPublicProfileDto[], total: number } | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    let url = `/api/v1/counselor/public?page=${page}&limit=${limit}`

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    if (specialization) {
      url += `&specialization=${encodeURIComponent(specialization)}`
    }

    const result = await apiRequest<{ counselors: CounselorPublicProfileDto[], total: number }>(url)

    // Update local state
    if (page === 1) {
      publicCounselorsState.value.counselors = result.counselors
    }
    else {
      publicCounselorsState.value.counselors = [
        ...publicCounselorsState.value.counselors,
        ...result.counselors,
      ]
    }

    publicCounselorsState.value.totalCounselors = result.total
    publicCounselorsState.value.currentPage = page
    publicCounselorsState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    counselorsError.value = error.message || 'دریافت لیست مشاوران ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Get public counselor by ID
const getPublicCounselorById = async (counselorId: string): Promise<CounselorPublicProfileDto | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    const counselor = await apiRequest<CounselorPublicProfileDto>(`/api/v1/counselor/public/${counselorId}`)
    publicCounselorsState.value.currentCounselor = counselor
    return counselor
  }
  catch (error: any) {
    counselorsError.value = error.message || 'دریافت اطلاعات مشاور ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Get counselor's availability
const getCounselorAvailability = async (counselorId: string): Promise<AvailabilityDto | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    return await apiRequest<AvailabilityDto>(`/api/v1/counselor/public/${counselorId}/availability`)
  }
  catch (error: any) {
    counselorsError.value = error.message || 'دریافت زمان‌های کاری مشاور ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Get available time slots for a counselor
const getAvailableTimeSlots = async (
  counselorId: string,
  startDate: string,
  endDate: string,
): Promise<TimeSlotDto[] | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    return await apiRequest<TimeSlotDto[]>(
      `/api/v1/counselor/public/${counselorId}/availability/slots?startDate=${startDate}&endDate=${endDate}`,
    )
  }
  catch (error: any) {
    counselorsError.value = error.message || 'دریافت بازه‌های زمانی موجود ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Request a connection with a counselor
const requestCounselorConnection = async (
  data: CreateCounselorApplicantLinkDto,
): Promise<CounselorApplicantLinkDto | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    return await apiRequest<CounselorApplicantLinkDto>('/api/v1/counselor/connections', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  catch (error: any) {
    counselorsError.value = error.message || 'درخواست ارتباط با مشاور ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Get specializations list
const getSpecializations = async (): Promise<SpecializationDto[] | null> => {
  isCounselorsLoading.value = true
  counselorsError.value = null

  try {
    return await apiRequest<SpecializationDto[]>('/api/v1/counselor/specializations')
  }
  catch (error: any) {
    counselorsError.value = error.message || 'دریافت لیست تخصص‌ها ناموفق بود'
    return null
  }
  finally {
    isCounselorsLoading.value = false
  }
}

// Export everything
export const usePublicCounselors = () => {
  return {
    // State
    publicCounselorsState: readonly(publicCounselorsState),
    counselorsError: readonly(counselorsError),
    isCounselorsLoading: readonly(isCounselorsLoading),

    // Computed
    publicCounselorsList,
    currentPublicCounselor,

    // Methods
    getPublicCounselors,
    getPublicCounselorById,
    getCounselorAvailability,
    getAvailableTimeSlots,
    requestCounselorConnection,
    getSpecializations,
  }
}
