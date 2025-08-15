export interface Notification {
  id?: string
  userId?: string
  title?: string
  message?: string
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  isRead?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface NotificationPreferences {
  id?: string
  userId?: string
  emailNotifications?: boolean
  pushNotifications?: boolean
  smsNotifications?: boolean
  inAppNotifications?: boolean
  notificationTypes?: NotificationType[]
}

export interface NotificationType {
  type?: string
  enabled?: boolean
}

export interface AdminNotification {
  id?: string
  title?: string
  message?: string
  type?: 'SYSTEM' | 'ANNOUNCEMENT' | 'MAINTENANCE' | 'UPDATE'
  targetUsers?: string[]
  isActive?: boolean
  scheduledFor?: string
  createdAt?: string
}

export interface NotificationListParams {
  page?: number
  size?: number
  isRead?: boolean
  type?: string
}

export function useHammasirNotification() {
  const { $fetch } = useNuxtApp()

  const getNotifications = async (params?: NotificationListParams): Promise<Notification[]> => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.size) query.set('size', params.size.toString())
    if (params?.isRead !== undefined) query.set('isRead', params.isRead.toString())
    if (params?.type) query.set('type', params.type)
    
    const url = `/api/v1/notifications${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  const getUnreadCount = async (): Promise<{ count: number }> => {
    return await $fetch('/api/v1/notifications/unread-count')
  }

  const markAllAsRead = async (): Promise<void> => {
    return await $fetch('/api/v1/notifications/read', {
      method: 'PATCH'
    })
  }

  const markAsRead = async (notificationId: string): Promise<void> => {
    return await $fetch(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PATCH'
    })
  }

  const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
    return await $fetch('/api/v1/me/notification-preferences')
  }

  const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<NotificationPreferences> => {
    return await $fetch('/api/v1/me/notification-preferences', {
      method: 'PUT',
      body: preferences
    })
  }

  const getAdminNotifications = async (): Promise<AdminNotification[]> => {
    return await $fetch('/api/v1/admin/notifications')
  }

  const createAdminNotification = async (notification: AdminNotification): Promise<AdminNotification> => {
    return await $fetch('/api/v1/admin/notifications', {
      method: 'POST',
      body: notification
    })
  }

  return {
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
    getNotificationPreferences,
    updateNotificationPreferences,
    getAdminNotifications,
    createAdminNotification,
  }
}