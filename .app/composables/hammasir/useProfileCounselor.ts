import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  CounselorProfileDto,
  CounselorPersonalInfoDto,
  ProfessionalInfoDto,
  SpecializationDto,
  AvailabilityDto,
  RateInfoDto,
} from '~/types/api'

// Counselor profile state
const counselorProfileState = ref({
  profile: null as CounselorProfileDto | null,
  isProfileLoading: false,
  isProfileUpdating: false,
  profileError: null as string | null,
})

// Profile errors
const profileError = ref<string | null>(null)
const isProfileLoading = ref(false)
const isProfileUpdating = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Profile not found': 'پروفایل یافت نشد',
  'Invalid profile data': 'داده‌های پروفایل نامعتبر است',
  'Profile update failed': 'به‌روزرسانی پروفایل ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Counselor not found': 'مشاور یافت نشد',
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
      return 'پروفایل یافت نشد'
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
const currentCounselorProfile = computed(() => counselorProfileState.value.profile)

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

// Get current counselor profile
const getMyCounselorProfile = async (): Promise<CounselorProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const profile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me')
    counselorProfileState.value.profile = profile
    return profile
  }
  catch (error: any) {
    profileError.value = error.message || 'دریافت پروفایل مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update current counselor profile
const updateMyCounselorProfile = async (data: CounselorProfileDto): Promise<CounselorProfileDto | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    counselorProfileState.value.profile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی پروفایل مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Update counselor personal info
const updatePersonalInfo = async (data: CounselorPersonalInfoDto): Promise<CounselorProfileDto | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me/personal-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    counselorProfileState.value.profile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی اطلاعات شخصی مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Update counselor professional info
const updateProfessionalInfo = async (data: ProfessionalInfoDto): Promise<CounselorProfileDto | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me/professional-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    counselorProfileState.value.profile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی اطلاعات حرفه‌ای مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Update counselor specializations
const updateSpecializations = async (data: SpecializationDto[]): Promise<CounselorProfileDto | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me/specializations', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    counselorProfileState.value.profile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی تخصص‌های مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Update counselor availability
const updateAvailability = async (data: AvailabilityDto): Promise<AvailabilityDto | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedAvailability = await apiRequest<AvailabilityDto>('/api/v1/counselor/me/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update the availability in the counselor profile if it exists
    if (counselorProfileState.value.profile) {
      counselorProfileState.value.profile.availability = updatedAvailability
    }

    return updatedAvailability
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی زمان‌های کاری مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Update counselor rates
const updateRates = async (data: RateInfoDto[]): Promise<RateInfoDto[] | null> => {
  isProfileUpdating.value = true
  profileError.value = null

  try {
    const updatedRates = await apiRequest<RateInfoDto[]>('/api/v1/counselor/me/rates', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update the rates in the counselor profile if it exists
    if (counselorProfileState.value.profile) {
      counselorProfileState.value.profile.rates = updatedRates
    }

    return updatedRates
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی تعرفه‌های مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileUpdating.value = false
  }
}

// Export everything
export const useProfileCounselor = () => {
  return {
    // State
    counselorProfileState: readonly(counselorProfileState),
    profileError: readonly(profileError),
    isProfileLoading: readonly(isProfileLoading),
    isProfileUpdating: readonly(isProfileUpdating),

    // Computed
    currentCounselorProfile,

    // Methods
    getMyCounselorProfile,
    updateMyCounselorProfile,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateSpecializations,
    updateAvailability,
    updateRates,
  }
}
