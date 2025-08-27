import { ref, readonly } from 'vue'
import { useAuth } from './useAuth'
import type {
  UserProfileDto,
  UpdateUserStatusDto,
} from '~/types/api'

// For development, we'll use mock data
// In production, these would be replaced with actual API calls
import {
  mockGetAllProfiles,
  mockGetProfileById,
  mockUpdateUserStatus,
} from '~/mocks/adminProfileApi'

// Admin profile state
const adminProfileState = ref({
  profiles: [] as UserProfileDto[],
  isLoading: false,
  error: null as string | null,
  totalProfiles: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Error translation map (reusing from useProfile)
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

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
}

// Helper function for API requests (for production implementation)
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

// Get all user profiles (admin only)
const getAllProfiles = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
): Promise<{ profiles: UserProfileDto[], total: number } | null> => {
  adminProfileState.value.isLoading = true
  adminProfileState.value.error = null

  try {
    // For development, use mock data
    // In production, replace with actual API call:
    /*
    let url = `/api/v1/profile/all?page=${page}&limit=${limit}`

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    if (status) {
      url += `&status=${status}`
    }

    const result = await apiRequest<{ profiles: UserProfileDto[]; total: number }>(url)
    */

    // Mock implementation for development
    const result = mockGetAllProfiles(page, limit, search, status)

    adminProfileState.value.profiles = result.profiles
    adminProfileState.value.totalProfiles = result.total
    adminProfileState.value.currentPage = page
    adminProfileState.value.itemsPerPage = limit
    return result
  }
  catch (error: any) {
    adminProfileState.value.error = error.message || 'دریافت لیست پروفایل‌ها ناموفق بود'
    return null
  }
  finally {
    adminProfileState.value.isLoading = false
  }
}

// Get specific user profile by ID (admin only)
const getProfileById = async (userId: string): Promise<UserProfileDto | null> => {
  adminProfileState.value.isLoading = true
  adminProfileState.value.error = null

  try {
    // For development, use mock data
    // In production, replace with actual API call:
    // const profile = await apiRequest<UserProfileDto>(`/api/v1/profile/admin/${userId}`)

    // Mock implementation for development
    return mockGetProfileById(userId)
  }
  catch (error: any) {
    adminProfileState.value.error = error.message || 'دریافت پروفایل کاربر ناموفق بود'
    return null
  }
  finally {
    adminProfileState.value.isLoading = false
  }
}

// Update user profile by ID (admin only)
const updateProfileById = async (userId: string, data: UserProfileDto): Promise<UserProfileDto | null> => {
  adminProfileState.value.isLoading = true
  adminProfileState.value.error = null

  try {
    // For development, use mock data
    // In production, replace with actual API call:
    // const updatedProfile = await apiRequest<UserProfileDto>(`/api/v1/profile/admin/${userId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data)
    // })

    // Mock implementation for development
    const updatedProfile = mockGetProfileById(userId) // In a real implementation, this would update the profile

    // Update the profile in the list if it exists
    const index = adminProfileState.value.profiles.findIndex(p => p.userId === userId)
    if (index !== -1) {
      adminProfileState.value.profiles[index] = updatedProfile
    }

    return updatedProfile
  }
  catch (error: any) {
    adminProfileState.value.error = error.message || 'به‌روزرسانی پروفایل کاربر ناموفق بود'
    return null
  }
  finally {
    adminProfileState.value.isLoading = false
  }
}

// Update user status (admin only)
const updateUserStatusAdmin = async (userId: string, data: UpdateUserStatusDto): Promise<UserProfileDto | null> => {
  adminProfileState.value.isLoading = true
  adminProfileState.value.error = null

  try {
    // For development, use mock data
    // In production, replace with actual API call:
    // const updatedProfile = await apiRequest<UserProfileDto>(`/api/v1/profile/admin/${userId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data)
    // })

    // Mock implementation for development
    const updatedProfile = mockUpdateUserStatus(userId, data)

    // Update the profile in the list if it exists
    const index = adminProfileState.value.profiles.findIndex(p => p.userId === userId)
    if (index !== -1) {
      adminProfileState.value.profiles[index] = updatedProfile
    }

    return updatedProfile
  }
  catch (error: any) {
    adminProfileState.value.error = error.message || 'به‌روزرسانی وضعیت کاربر ناموفق بود'
    return null
  }
  finally {
    adminProfileState.value.isLoading = false
  }
}

// Suspend user (admin only)
const suspendUser = async (userId: string, reason?: string): Promise<UserProfileDto | null> => {
  return updateUserStatusAdmin(userId, {
    status: 'SUSPENDED',
  })
}

// Unsuspend user (admin only)
const unsuspendUser = async (userId: string, reason?: string): Promise<UserProfileDto | null> => {
  return updateUserStatusAdmin(userId, {
    status: 'ACTIVE',
  })
}

// Export everything
export const useAdminProfile = () => {
  return {
    // State
    adminProfileState: readonly(adminProfileState),

    // Methods
    getAllProfiles,
    getProfileById,
    updateProfileById,
    updateUserStatusAdmin,
    suspendUser,
    unsuspendUser,
  }
}
