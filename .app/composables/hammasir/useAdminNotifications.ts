import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  SystemNotificationDto,
  SystemNotificationListDto,
  CreateNotificationDto,
} from '~/types/api'

// Admin notifications state
const adminNotificationsState = ref({
  notifications: [] as SystemNotificationDto[],
  isLoading: false,
  isSending: false,
  error: null as string | null,
  totalNotifications: 0,
  currentPage: 1,
  itemsPerPage: 20,
})

// Admin notifications errors
const adminNotificationsError = ref<string | null>(null)
const isAdminNotificationsLoading = ref(false)
const isAdminNotificationsSending = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Notification not found': 'اعلان یافت نشد',
  'Invalid notification data': 'داده‌های اعلان نامعتبر است',
  'Notification send failed': 'ارسال اعلان ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Invalid recipient': 'گیرنده نامعتبر است',
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
      return 'اعلان یافت نشد'
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
const adminSystemNotifications = computed(() => adminNotificationsState.value.notifications)

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
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

// Get system notifications (admin only)
const getSystemNotificationsAdmin = async (
  page: number = 1,
  limit: number = 20,
  type?: string,
): Promise<SystemNotificationListDto | null> => {
  isAdminNotificationsLoading.value = true
  adminNotificationsError.value = null

  try {
    let url = `/api/v1/notification/admin/notifications?page=${page}&limit=${limit}`

    if (type) {
      url += `&type=${type}`
    }

    const result = await apiRequest<SystemNotificationListDto>(url)

    // Update local state
    if (page === 1) {
      adminNotificationsState.value.notifications = result.notifications
    }
    else {
      adminNotificationsState.value.notifications = [
        ...adminNotificationsState.value.notifications,
        ...result.notifications,
      ]
    }

    adminNotificationsState.value.totalNotifications = result.total
    adminNotificationsState.value.currentPage = page
    adminNotificationsState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    adminNotificationsError.value = error.message || 'دریافت اعلان‌های سیستمی ناموفق بود'
    return null
  }
  finally {
    isAdminNotificationsLoading.value = false
  }
}

// Send system notification (admin only)
const sendSystemNotificationAdmin = async (
  data: CreateNotificationDto,
): Promise<SystemNotificationDto | null> => {
  isAdminNotificationsSending.value = true
  adminNotificationsError.value = null

  try {
    const result = await apiRequest<SystemNotificationDto>('/api/v1/notification/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state at the beginning
    adminNotificationsState.value.notifications.unshift(result)
    adminNotificationsState.value.totalNotifications++

    return result
  }
  catch (error: any) {
    adminNotificationsError.value = error.message || 'ارسال اعلان سیستمی ناموفق بود'
    return null
  }
  finally {
    isAdminNotificationsSending.value = false
  }
}

// Delete system notification (admin only)
const deleteSystemNotificationAdmin = async (notificationId: string): Promise<boolean> => {
  isAdminNotificationsLoading.value = true
  adminNotificationsError.value = null

  try {
    await apiRequest<void>(`/api/v1/notification/admin/notifications/${notificationId}`, {
      method: 'DELETE',
    })

    // Remove from local state
    const index = adminNotificationsState.value.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      adminNotificationsState.value.notifications.splice(index, 1)
      adminNotificationsState.value.totalNotifications--
    }

    return true
  }
  catch (error: any) {
    adminNotificationsError.value = error.message || 'حذف اعلان سیستمی ناموفق بود'
    return false
  }
  finally {
    isAdminNotificationsLoading.value = false
  }
}

// Export everything
export const useAdminNotifications = () => {
  return {
    // State
    adminNotificationsState: readonly(adminNotificationsState),
    adminNotificationsError: readonly(adminNotificationsError),
    isAdminNotificationsLoading: readonly(isAdminNotificationsLoading),
    isAdminNotificationsSending: readonly(isAdminNotificationsSending),

    // Computed
    adminSystemNotifications,

    // Methods
    getSystemNotificationsAdmin,
    sendSystemNotificationAdmin,
    deleteSystemNotificationAdmin,
  }
}
