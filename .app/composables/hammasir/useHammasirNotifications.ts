import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  NotificationDto,
  NotificationListDto,
  UnreadCountResponseDto,
  NotificationPreferencesDto,
  SystemNotificationDto,
  SystemNotificationListDto,
  CreateNotificationDto,
} from '~/types/api'

// Notifications state
const notificationsState = ref({
  notifications: [] as NotificationDto[],
  systemNotifications: [] as SystemNotificationDto[],
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null as string | null,
  preferences: {
    inApp: true,
    email: true,
    sms: false,
    push: true,
  } as NotificationPreferencesDto,
})

// Notifications errors
const notificationsError = ref<string | null>(null)
const isNotificationsLoading = ref(false)
const isNotificationsSending = ref(false)

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
const userNotifications = computed(() => notificationsState.value.notifications)
const unreadNotificationsCount = computed(() => notificationsState.value.unreadCount)
const systemNotificationsList = computed(() => notificationsState.value.systemNotifications)
const notificationPreferences = computed(() => notificationsState.value.preferences)

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

// Get user notifications
const getNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationListDto | null> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    const result = await apiRequest<NotificationListDto>(`/api/v1/notifications?page=${page}&limit=${limit}`)

    // Update local state
    if (page === 1) {
      notificationsState.value.notifications = result.notifications
    }
    else {
      notificationsState.value.notifications = [
        ...notificationsState.value.notifications,
        ...result.notifications,
      ]
    }

    return result
  }
  catch (error: any) {
    notificationsError.value = error.message || 'دریافت اعلان‌ها ناموفق بود'
    return null
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Get unread notifications count
const getUnreadCount = async (): Promise<number | null> => {
  try {
    const result = await apiRequest<UnreadCountResponseDto>('/api/v1/notifications/unread-count')
    notificationsState.value.unreadCount = result.count
    return result.count
  }
  catch (error: any) {
    console.error('دریافت تعداد اعلان‌های خوانده نشده ناموفق بود:', error)
    return null
  }
}

// Mark notification as read
const markAsRead = async (notificationId: string): Promise<boolean> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    await apiRequest<void>(`/api/v1/notifications/${notificationId}/read`, {
      method: 'POST',
    })

    // Update local state
    const notification = notificationsState.value.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.readAt = new Date().toISOString()
    }

    // Update unread count
    if (notificationsState.value.unreadCount > 0) {
      notificationsState.value.unreadCount--
    }

    return true
  }
  catch (error: any) {
    notificationsError.value = error.message || 'به‌روزرسانی اعلان ناموفق بود'
    return false
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Mark all notifications as read
const markAllAsRead = async (): Promise<boolean> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    await apiRequest<void>('/api/v1/notifications/mark-all-read', {
      method: 'POST',
    })

    // Update local state
    notificationsState.value.notifications.forEach((notification) => {
      if (!notification.readAt) {
        notification.readAt = new Date().toISOString()
      }
    })

    // Reset unread count
    notificationsState.value.unreadCount = 0

    return true
  }
  catch (error: any) {
    notificationsError.value = error.message || 'به‌روزرسانی اعلان‌ها ناموفق بود'
    return false
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Delete notification
const deleteNotification = async (notificationId: string): Promise<boolean> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    await apiRequest<void>(`/api/v1/notifications/${notificationId}`, {
      method: 'DELETE',
    })

    // Update local state
    const index = notificationsState.value.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notificationsState.value.notifications.splice(index, 1)

      // Update unread count if the deleted notification was unread
      const notification = notificationsState.value.notifications[index]
      if (notification && !notification.readAt) {
        notificationsState.value.unreadCount = Math.max(0, notificationsState.value.unreadCount - 1)
      }
    }

    return true
  }
  catch (error: any) {
    notificationsError.value = error.message || 'حذف اعلان ناموفق بود'
    return false
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Get system notifications
const getSystemNotifications = async (page: number = 1, limit: number = 20): Promise<SystemNotificationListDto | null> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    const result = await apiRequest<SystemNotificationListDto>(`/api/v1/notifications/system?page=${page}&limit=${limit}`)

    // Update local state
    if (page === 1) {
      notificationsState.value.systemNotifications = result.notifications
    }
    else {
      notificationsState.value.systemNotifications = [
        ...notificationsState.value.systemNotifications,
        ...result.notifications,
      ]
    }

    return result
  }
  catch (error: any) {
    notificationsError.value = error.message || 'دریافت اعلان‌های سیستمی ناموفق بود'
    return null
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Send notification (admin/system use)
const sendNotification = async (data: CreateNotificationDto): Promise<SystemNotificationDto | null> => {
  isNotificationsSending.value = true
  notificationsError.value = null

  try {
    const result = await apiRequest<SystemNotificationDto>('/api/v1/notifications/system', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state if it's for the current user
    notificationsState.value.systemNotifications.unshift(result)

    return result
  }
  catch (error: any) {
    notificationsError.value = error.message || 'ارسال اعلان ناموفق بود'
    return null
  }
  finally {
    isNotificationsSending.value = false
  }
}

// Get notification preferences
const getNotificationPreferences = async (): Promise<NotificationPreferencesDto | null> => {
  try {
    const result = await apiRequest<NotificationPreferencesDto>('/api/v1/notifications/preferences')
    notificationsState.value.preferences = result
    return result
  }
  catch (error: any) {
    console.error('دریافت تنظیمات اعلان‌ها ناموفق بود:', error)
    return null
  }
}

// Update notification preferences
const updateNotificationPreferences = async (preferences: NotificationPreferencesDto): Promise<boolean> => {
  isNotificationsLoading.value = true
  notificationsError.value = null

  try {
    await apiRequest<void>('/api/v1/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })

    // Update local state
    notificationsState.value.preferences = { ...preferences }

    return true
  }
  catch (error: any) {
    notificationsError.value = error.message || 'به‌روزرسانی تنظیمات اعلان‌ها ناموفق بود'
    return false
  }
  finally {
    isNotificationsLoading.value = false
  }
}

// Load mock data for demonstration
const loadMockData = () => {
  // Mock user notifications
  const mockUserNotifications = [
    {
      id: '1',
      title: 'جلسه مشاوره جدید',
      message: 'جلسه مشاوره شما با دکتر احمدی برای فردا ساعت 10:00 تنظیم شد.',
      type: 'info',
      priority: 'high',
      readAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'تکمیل پرسش‌نامه',
      message: 'پرسش‌نامه شخصیت NEO را تکمیل کنید تا مرحله بعدی فعال شود.',
      type: 'warning',
      priority: 'normal',
      readAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: 'نتایج آزمون',
      message: 'نتایج آزمون سازگاری شما آماده شده است. برای مشاهده کلیک کنید.',
      type: 'success',
      priority: 'high',
      readAt: null,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '4',
      title: 'بروزرسانی برنامه',
      message: 'نسخه جدید همسیر با ویژگی‌های بهبود یافته در دسترس است.',
      type: 'info',
      priority: 'low',
      readAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ]

  // Mock system notifications
  const mockSystemNotifications = [
    {
      id: '101',
      title: 'بروزرسانی نرم‌افزار',
      message: 'نسخه 2.1.0 همسیر با ویژگی‌های جدید در دسترس است.',
      type: 'info',
      priority: 'normal',
      recipients: ['all'],
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '102',
      title: 'تعمیرات سیستم',
      message: 'در روز یکشنبه از ساعت 2 تا 4 صبح تعمیرات برنامه‌ریزی شده خواهیم داشت.',
      type: 'warning',
      priority: 'high',
      recipients: ['all'],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '103',
      title: 'رویداد ویژه',
      message: 'در هفته آینده رویداد ویژه "آمادگی ازدواج" با جوایز ارزشمند برگزار می‌شود.',
      type: 'success',
      priority: 'normal',
      recipients: ['all'],
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  // Update the notification stores with mock data
  notificationsState.value.notifications = mockUserNotifications
  notificationsState.value.systemNotifications = mockSystemNotifications
  notificationsState.value.unreadCount = mockUserNotifications.filter(n => !n.readAt).length
}

// Export everything
export const useHammasirNotifications = () => {
  return {
    // State
    notificationsState: readonly(notificationsState),
    notificationsError: readonly(notificationsError),
    isNotificationsLoading: readonly(isNotificationsLoading),
    isNotificationsSending: readonly(isNotificationsSending),

    // Computed
    userNotifications,
    unreadNotificationsCount,
    systemNotificationsList,
    notificationPreferences,

    // Methods
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getSystemNotifications,
    sendNotification,
    getNotificationPreferences,
    updateNotificationPreferences,
    loadMockData,
  }
}
