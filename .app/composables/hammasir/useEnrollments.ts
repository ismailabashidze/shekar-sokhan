import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  EnrollmentDto,
  EnrollInCourseDto,
  PaymentCallbackDto,
} from '~/types/api'

// Enrollments state
const enrollmentsState = ref({
  enrollments: [] as EnrollmentDto[],
  currentEnrollment: null as EnrollmentDto | null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null as string | null,
  totalEnrollments: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Enrollments errors
const enrollmentsError = ref<string | null>(null)
const isEnrollmentsLoading = ref(false)
const isEnrollmentsCreating = ref(false)
const isEnrollmentsUpdating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Enrollment not found': 'ثبت‌نام یافت نشد',
  'Invalid enrollment data': 'داده‌های ثبت‌نام نامعتبر است',
  'Enrollment creation failed': 'ایجاد ثبت‌نام ناموفق بود',
  'Enrollment update failed': 'به‌روزرسانی ثبت‌نام ناموفق بود',
  'Course not found': 'دوره یافت نشد',
  'User not found': 'کاربر یافت نشد',
  'Payment verification failed': 'تأیید پرداخت ناموفق بود',
  'Enrollment already exists': 'ثبت‌نام قبلاً انجام شده است',
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
      return 'ثبت‌نام یافت نشد'
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
const userEnrollments = computed(() => enrollmentsState.value.enrollments)
const currentEnrollment = computed(() => enrollmentsState.value.currentEnrollment)

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

// Get user enrollments
const getMyEnrollments = async (
  page: number = 1,
  limit: number = 10,
  status?: 'IN_PROGRESS' | 'COMPLETED',
): Promise<{ enrollments: EnrollmentDto[], total: number } | null> => {
  isEnrollmentsLoading.value = true
  enrollmentsError.value = null

  try {
    let url = `/api/v1/education/me/enrollments?page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    const result = await apiRequest<{ enrollments: EnrollmentDto[], total: number }>(url)

    // Update local state
    if (page === 1) {
      enrollmentsState.value.enrollments = result.enrollments
    }
    else {
      enrollmentsState.value.enrollments = [
        ...enrollmentsState.value.enrollments,
        ...result.enrollments,
      ]
    }

    enrollmentsState.value.totalEnrollments = result.total
    enrollmentsState.value.currentPage = page
    enrollmentsState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    enrollmentsError.value = error.message || 'دریافت ثبت‌نام‌ها ناموفق بود'
    return null
  }
  finally {
    isEnrollmentsLoading.value = false
  }
}

// Enroll in course
const enrollInCourse = async (data: EnrollInCourseDto): Promise<EnrollmentDto | null> => {
  isEnrollmentsCreating.value = true
  enrollmentsError.value = null

  try {
    const enrollment = await apiRequest<EnrollmentDto>('/api/v1/education/enrollments', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state
    enrollmentsState.value.enrollments.push(enrollment)
    enrollmentsState.value.totalEnrollments++

    return enrollment
  }
  catch (error: any) {
    enrollmentsError.value = error.message || 'ثبت‌نام در دوره ناموفق بود'
    return null
  }
  finally {
    isEnrollmentsCreating.value = false
  }
}

// Get enrollment by ID
const getEnrollmentById = async (enrollmentId: string): Promise<EnrollmentDto | null> => {
  isEnrollmentsLoading.value = true
  enrollmentsError.value = null

  try {
    const enrollment = await apiRequest<EnrollmentDto>(`/api/v1/education/enrollments/${enrollmentId}`)
    enrollmentsState.value.currentEnrollment = enrollment
    return enrollment
  }
  catch (error: any) {
    enrollmentsError.value = error.message || 'دریافت ثبت‌نام ناموفق بود'
    return null
  }
  finally {
    isEnrollmentsLoading.value = false
  }
}

// Cancel enrollment
const cancelEnrollment = async (enrollmentId: string): Promise<boolean> => {
  isEnrollmentsLoading.value = true
  enrollmentsError.value = null

  try {
    await apiRequest<void>(`/api/v1/education/enrollments/${enrollmentId}/cancel`, {
      method: 'POST',
    })

    // Remove from local state
    const index = enrollmentsState.value.enrollments.findIndex(e => e.id === enrollmentId)
    if (index !== -1) {
      enrollmentsState.value.enrollments.splice(index, 1)
      enrollmentsState.value.totalEnrollments--
    }

    // Clear current enrollment if it's the one being deleted
    if (enrollmentsState.value.currentEnrollment?.id === enrollmentId) {
      enrollmentsState.value.currentEnrollment = null
    }

    return true
  }
  catch (error: any) {
    enrollmentsError.value = error.message || 'لغو ثبت‌نام ناموفق بود'
    return false
  }
  finally {
    isEnrollmentsLoading.value = false
  }
}

// Handle payment callback
const handlePaymentCallback = async (data: PaymentCallbackDto): Promise<boolean> => {
  isEnrollmentsUpdating.value = true
  enrollmentsError.value = null

  try {
    await apiRequest<void>('/api/v1/education/enrollments/payment-callback', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Update enrollment status in local state
    const enrollment = enrollmentsState.value.enrollments.find(e => e.id === data.enrollmentId)
    if (enrollment) {
      enrollment.paymentStatus = data.status
    }

    // Update current enrollment if it's the one being updated
    if (enrollmentsState.value.currentEnrollment?.id === data.enrollmentId) {
      enrollmentsState.value.currentEnrollment.paymentStatus = data.status
    }

    return true
  }
  catch (error: any) {
    enrollmentsError.value = error.message || 'بروزرسانی وضعیت پرداخت ناموفق بود'
    return false
  }
  finally {
    isEnrollmentsUpdating.value = false
  }
}

// Export everything
export const useEnrollments = () => {
  return {
    // State
    enrollmentsState: readonly(enrollmentsState),
    enrollmentsError: readonly(enrollmentsError),
    isEnrollmentsLoading: readonly(isEnrollmentsLoading),
    isEnrollmentsCreating: readonly(isEnrollmentsCreating),
    isEnrollmentsUpdating: readonly(isEnrollmentsUpdating),

    // Computed
    userEnrollments,
    currentEnrollment,

    // Methods
    getMyEnrollments,
    enrollInCourse,
    getEnrollmentById,
    cancelEnrollment,
    handlePaymentCallback,
  }
}