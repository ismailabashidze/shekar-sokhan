import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type { TimeSlotDto, AvailabilityDto } from '~/types/api'

// Scheduling state
const schedulingState = ref({
  timeSlots: [] as TimeSlotDto[],
  availability: null as AvailabilityDto | null,
  isSchedulingLoading: false,
  isSchedulingUpdating: false,
  schedulingError: null as string | null,
})

// Error translation map
const errorTranslations: Record<string, string> = {
  'Counselor not found': 'مشاور یافت نشد',
  'Invalid date range': 'بازه زمانی نامعتبر است',
  'Start date must be before end date': 'تاریخ شروع باید قبل از تاریخ پایان باشد',
  'Availability update failed': 'به‌روزرسانی زمان‌های کاری ناموفق بود',
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
const timeSlots = computed(() => schedulingState.value.timeSlots)
const availability = computed(() => schedulingState.value.availability)
const isSchedulingLoading = computed(() => schedulingState.value.isSchedulingLoading)
const isSchedulingUpdating = computed(() => schedulingState.value.isSchedulingUpdating)
const schedulingError = computed(() => schedulingState.value.schedulingError)

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

// Get counselor availability for a date range
const getCounselorAvailability = async (
  counselorId: string,
  startDate: string,
  endDate: string,
): Promise<TimeSlotDto[] | null> => {
  schedulingState.value.isSchedulingLoading = true
  schedulingState.value.schedulingError = null

  try {
    const timeSlots = await apiRequest<TimeSlotDto[]>(
      `/api/v1/counseling/scheduling/counselors/${counselorId}/availability?startDate=${startDate}&endDate=${endDate}`,
    )

    schedulingState.value.timeSlots = timeSlots || []
    return timeSlots
  }
  catch (error: any) {
    schedulingState.value.schedulingError = error.message || 'دریافت زمان‌های آزاد مشاور ناموفق بود'
    return null
  }
  finally {
    schedulingState.value.isSchedulingLoading = false
  }
}

// Update counselor availability
const updateCounselorAvailability = async (
  data: AvailabilityDto,
): Promise<AvailabilityDto | null> => {
  schedulingState.value.isSchedulingUpdating = true
  schedulingState.value.schedulingError = null

  try {
    const updatedAvailability = await apiRequest<AvailabilityDto>(
      '/api/v1/counselor/me/availability',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    )

    schedulingState.value.availability = updatedAvailability
    return updatedAvailability
  }
  catch (error: any) {
    schedulingState.value.schedulingError = error.message || 'به‌روزرسانی زمان‌های کاری مشاور ناموفق بود'
    return null
  }
  finally {
    schedulingState.value.isSchedulingUpdating = false
  }
}

// Get my availability (for counselors)
const getMyAvailability = async (): Promise<AvailabilityDto | null> => {
  schedulingState.value.isSchedulingLoading = true
  schedulingState.value.schedulingError = null

  try {
    const availability = await apiRequest<AvailabilityDto>('/api/v1/counselor/me/availability')
    schedulingState.value.availability = availability
    return availability
  }
  catch (error: any) {
    schedulingState.value.schedulingError = error.message || 'دریافت زمان‌های کاری من ناموفق بود'
    return null
  }
  finally {
    schedulingState.value.isSchedulingLoading = false
  }
}

// Export everything
export const useCounselorScheduling = () => {
  return {
    // State
    schedulingState: readonly(schedulingState),
    timeSlots: readonly(timeSlots),
    availability: readonly(availability),
    isSchedulingLoading: readonly(isSchedulingLoading),
    isSchedulingUpdating: readonly(isSchedulingUpdating),
    schedulingError: readonly(schedulingError),

    // Methods
    getCounselorAvailability,
    updateCounselorAvailability,
    getMyAvailability,
  }
}