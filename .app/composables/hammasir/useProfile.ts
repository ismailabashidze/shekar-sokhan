import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  UserProfileDto,
  PersonalInfoDto,
  DemographicsDto,
  PreferencesDto,
  PrivacySettingsDto,
  UpdateUserStatusDto,
  CounselorProfileDto,
  CounselorPersonalInfoDto,
  ProfessionalInfoDto,
  SpecializationDto,
  AvailabilityDto,
  RateInfoDto,
} from '~/types/api'

// Profile state
const profileState = ref({
  userProfile: null as UserProfileDto | null,
  counselorProfile: null as CounselorProfileDto | null,
  isProfileLoading: false,
  profileError: null as string | null,
})

// Profile errors
const profileError = ref<string | null>(null)
const isProfileLoading = ref(false)

// Mock data state
const useMockData = ref(false)
const mockProfile = ref<UserProfileDto | null>(null)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Profile not found': 'پروفایل یافت نشد',
  'Invalid profile data': 'داده‌های پروفایل نامعتبر است',
  'Profile update failed': 'به‌روزرسانی پروفایل ناموفق بود',
  'User not found': 'کاربر یافت نشد',
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
const currentUserProfile = computed(() => profileState.value.userProfile)
const currentCounselorProfile = computed(() => profileState.value.counselorProfile)

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
  const authStore = useAuth() // Assuming useAuth is available globally
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

// Get current user profile
const getMyProfile = async (): Promise<UserProfileDto | null> => {
  // If mock data is enabled, return mock profile
  if (useMockData.value) {
    profileState.value.userProfile = mockProfile.value
    profileError.value = null

    return mockProfile.value
  }

  isProfileLoading.value = true
  profileError.value = null

  try {
    const profile = await apiRequest<UserProfileDto>('/api/v1/profile/me')
    profileState.value.userProfile = profile
    return profile
  }
  catch (error: any) {
    profileError.value = error.message || 'دریافت پروفایل ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update current user profile
const updateMyProfile = async (data: UserProfileDto): Promise<UserProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<UserProfileDto>('/api/v1/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    profileState.value.userProfile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی پروفایل ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Get user profile by user ID
const getProfileByUserId = async (userId: string): Promise<UserProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    return await apiRequest<UserProfileDto>(`/api/v1/profile/profiles/${userId}`)
  }
  catch (error: any) {
    profileError.value = error.message || 'دریافت پروفایل کاربر ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update user profile by user ID
const updateUserProfile = async (userId: string, data: UserProfileDto): Promise<UserProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<UserProfileDto>(`/api/v1/profile/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // If we're updating the current user's profile, update the local state
    if (profileState.value.userProfile?.userId === userId) {
      profileState.value.userProfile = updatedProfile
    }

    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی پروفایل کاربر ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update user status
const updateUserStatus = async (userId: string, data: UpdateUserStatusDto): Promise<UserProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<UserProfileDto>(`/api/v1/profile/profiles/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    // If we're updating the current user's profile, update the local state
    if (profileState.value.userProfile?.userId === userId) {
      profileState.value.userProfile = updatedProfile
    }

    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی وضعیت کاربر ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Get current counselor profile
const getMyCounselorProfile = async (): Promise<CounselorProfileDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const profile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me')
    profileState.value.counselorProfile = profile
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
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedProfile = await apiRequest<CounselorProfileDto>('/api/v1/counselor/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    profileState.value.counselorProfile = updatedProfile
    return updatedProfile
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی پروفایل مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update counselor availability
const updateMyAvailability = async (data: AvailabilityDto): Promise<AvailabilityDto | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedAvailability = await apiRequest<AvailabilityDto>('/api/v1/counselor/me/availability', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update the availability in the counselor profile if it exists
    if (profileState.value.counselorProfile) {
      profileState.value.counselorProfile.availability = updatedAvailability
    }

    return updatedAvailability
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی زمان‌های کاری مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Update counselor rates
const updateMyRates = async (data: RateInfoDto[]): Promise<RateInfoDto[] | null> => {
  isProfileLoading.value = true
  profileError.value = null

  try {
    const updatedRates = await apiRequest<RateInfoDto[]>('/api/v1/counselor/me/rates', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    // Update the rates in the counselor profile if it exists
    if (profileState.value.counselorProfile) {
      profileState.value.counselorProfile.rates = updatedRates
    }

    return updatedRates
  }
  catch (error: any) {
    profileError.value = error.message || 'به‌روزرسانی تعرفه‌های مشاور ناموفق بود'
    return null
  }
  finally {
    isProfileLoading.value = false
  }
}

// Mock data
const createMockProfile = (): UserProfileDto => ({
  id: '1',
  userId: '1',
  status: 'ACTIVE',
  createdAt: '2023-01-15T08:30:00Z',
  updatedAt: '2023-06-20T14:45:00Z',
  personalInfo: {
    id: '1',
    firstName: 'علی',
    lastName: 'رضایی',
    email: 'ali.rezaei@example.com',
    phoneNumber: '09123456789',
    dateOfBirth: '1990-05-15T00:00:00Z',
    gender: 'MALE',
  },
  demographics: {
    id: '1',
    education: [],
    occupation: [],
    location: [],
  },
  preferences: {
    id: '1',
    communication: {
      email: true,
      sms: true,
    },
  },
  privacySettings: {
    id: '1',
    isProfileVisibleToCounselors: true,
    isProfileVisibleToOtherUsers: true,
    allowDataAnalysisForMatching: true,
  },
})

// Toggle mock data
const toggleMockData = () => {
  useMockData.value = !useMockData.value
  if (useMockData.value) {
    mockProfile.value = createMockProfile()
    profileState.value.userProfile = mockProfile.value
  }
  else {
    mockProfile.value = null
    profileState.value.userProfile = null
  }
}

// Export everything
export const useProfile = () => {
  return {
    // State
    profileState: readonly(profileState),
    profileError: readonly(profileError),
    isProfileLoading: readonly(isProfileLoading),
    useMockData: readonly(useMockData),
    mockProfile: readonly(mockProfile),

    // Computed
    currentUserProfile,
    currentCounselorProfile,

    // Methods
    getMyProfile,
    updateMyProfile,
    getProfileByUserId,
    updateUserProfile,
    updateUserStatus,
    getMyCounselorProfile,
    updateMyCounselorProfile,
    updateMyAvailability,
    updateMyRates,
    toggleMockData,
  }
}
