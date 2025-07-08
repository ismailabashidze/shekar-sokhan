import type { Ref } from 'vue'

// PocketBase Notification Record Interface (matches the schema)
export interface PBNotificationRecord {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  is_read: boolean
  user?: string // relation to users collection
  action_url?: string
  action_text?: string
  read_at?: string
  recipient_user_id?: string // relation to users collection  
  created: string
  updated: string
  expand?: {
    user?: {
      id: string
      name: string
      avatar?: string
      role?: string
    }
    recipient_user_id?: {
      id: string
      name: string
      avatar?: string
    }
  }
}

// Frontend Notification Interface (for easier use in components)
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  createdAt: string
  readAt?: string
  user?: {
    id: string
    name: string
    avatar: string
    role?: string
  }
  actionUrl?: string
  actionText?: string
}

export type NotificationFilter = 'all' | 'unread' | 'read'

// Transform PocketBase record to frontend interface
function transformPBRecord(record: PBNotificationRecord): Notification {
  return {
    id: record.id,
    title: record.title,
    message: record.message,
    type: record.type,
    priority: record.priority,
    isRead: record.is_read,
    createdAt: record.created,
    readAt: record.read_at,
    user: record.expand?.user ? {
      id: record.expand.user.id,
      name: record.expand.user.name,
      avatar: record.expand.user.avatar || '/img/avatars/placeholder.webp',
      role: record.expand.user.role
    } : undefined,
    actionUrl: record.action_url,
    actionText: record.action_text
  }
}

export function useNotifications() {
  const { $pb } = useNuxtApp()
  const notifications: Ref<Notification[]> = ref([])
  const currentFilter: Ref<NotificationFilter> = ref('unread')
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const lastUpdateTime = ref(Date.now())
  const error = ref<string | null>(null)

  // PWA Notifications integration
  const pwaNotifications = process.client ? usePwaNotifications() : null

  // Get current user ID
  const getCurrentUserId = () => {
    return $pb.authStore.model?.id || null
  }

  // Computed properties
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  const filteredNotifications = computed(() => {
    switch (currentFilter.value) {
      case 'unread':
        return notifications.value.filter(n => !n.isRead)
      case 'read':
        return notifications.value.filter(n => n.isRead)
      default:
        return notifications.value
    }
  })

  const urgentNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead && n.priority === 'urgent')
  })

  const highPriorityNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead && (n.priority === 'high' || n.priority === 'urgent'))
  })

  // PWA notification helper
  const triggerPwaNotification = async (notification: Notification) => {
    if (!pwaNotifications || !process.client) return

    try {
      await pwaNotifications.showLocalNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        url: notification.actionUrl || '/notifications',
        actionText: notification.actionText,
        tag: `notification-${notification.id}`
      })
    } catch (err) {
      console.warn('Failed to show PWA notification:', err)
    }
  }

  // Methods
  const fetchNotifications = async (page = 1, perPage = 50) => {
    const userId = getCurrentUserId()
    if (!userId) {
      error.value = 'User not authenticated'
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const records = await $pb.collection('notifications').getList<PBNotificationRecord>(page, perPage, {
        filter: `recipient_user_id = "${userId}"`,
        sort: '-created',
        expand: 'user,recipient_user_id'
      })

      // Transform PocketBase records to frontend format
      const transformedNotifications = records.items.map(transformPBRecord)
      
      // Check for new notifications to trigger PWA notifications
      if (page === 1 && notifications.value.length > 0) {
        const newNotifications = transformedNotifications.filter(newNotif => 
          !notifications.value.some(existing => existing.id === newNotif.id) && 
          !newNotif.isRead
        )
        
        // Trigger PWA notifications for new unread notifications
        for (const newNotif of newNotifications) {
          await triggerPwaNotification(newNotif)
        }
      }
      
      if (page === 1) {
        notifications.value = transformedNotifications
      } else {
        notifications.value.push(...transformedNotifications)
      }

      lastUpdateTime.value = Date.now()
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      error.value = err.message || 'خطا در دریافت اعلان‌ها'
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (!notification || notification.isRead) return

      // Update in PocketBase
      await $pb.collection('notifications').update(notificationId, {
        is_read: true,
        read_at: new Date().toISOString()
      })

      // Update local state
      notification.isRead = true
      notification.readAt = new Date().toISOString()
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      error.value = err.message || 'خطا در به‌روزرسانی اعلان'
    }
  }

  const markAsUnread = async (notificationId: string) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (!notification || !notification.isRead) return

      // Update in PocketBase
      await $pb.collection('notifications').update(notificationId, {
        is_read: false,
        read_at: null
      })

      // Update local state
      notification.isRead = false
      notification.readAt = undefined
    } catch (err: any) {
      console.error('Error marking notification as unread:', err)
      error.value = err.message || 'خطا در به‌روزرسانی اعلان'
    }
  }

  const markAllAsRead = async () => {
    const userId = getCurrentUserId()
    if (!userId) return

    try {
      isUpdating.value = true
      
      // Get all unread notifications for this user
      const unreadNotifications = notifications.value.filter(n => !n.isRead)
      
      // Update each notification in PocketBase
      const updatePromises = unreadNotifications.map(notification =>
        $pb.collection('notifications').update(notification.id, {
          is_read: true,
          read_at: new Date().toISOString()
        })
      )

      await Promise.all(updatePromises)

      // Update local state
      notifications.value.forEach((notification) => {
        if (!notification.isRead) {
          notification.isRead = true
          notification.readAt = new Date().toISOString()
        }
      })
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      error.value = err.message || 'خطا در به‌روزرسانی اعلان‌ها'
    } finally {
      isUpdating.value = false
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // Delete from PocketBase
      await $pb.collection('notifications').delete(notificationId)

      // Update local state
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err)
      error.value = err.message || 'خطا در حذف اعلان'
    }
  }

  const refreshNotifications = async () => {
    isUpdating.value = true
    try {
      await fetchNotifications()
    } finally {
      isUpdating.value = false
    }
  }

  // Create new notification (admin/system use)
  const createNotification = async (data: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'system'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    recipient_user_id: string
    user?: string
    action_url?: string
    action_text?: string
  }) => {
    try {
      const record = await $pb.collection('notifications').create<PBNotificationRecord>({
        ...data,
        is_read: false
      })

      // If this notification is for the current user, add it to local state
      const currentUserId = getCurrentUserId()
      if (data.recipient_user_id === currentUserId) {
        const transformedNotification = transformPBRecord(record)
        notifications.value.unshift(transformedNotification)

        // Trigger PWA notification for new notification
        await triggerPwaNotification(transformedNotification)
      }

      return record
    } catch (err: any) {
      console.error('Error creating notification:', err)
      error.value = err.message || 'خطا در ایجاد اعلان'
      throw err
    }
  }

  const setFilter = (filter: NotificationFilter) => {
    currentFilter.value = filter
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'همین الان'
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`
    if (diffInHours < 24) return `${diffInHours} ساعت پیش`
    if (diffInDays < 30) return `${diffInDays} روز پیش`
    
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'lucide:info'
      case 'success': return 'lucide:check-circle'
      case 'warning': return 'lucide:alert-triangle'
      case 'error': return 'lucide:x-circle'
      case 'system': return 'lucide:settings'
      default: return 'lucide:bell'
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'primary'
      case 'success': return 'success'
      case 'warning': return 'warning'
      case 'error': return 'danger'
      case 'system': return 'muted'
      default: return 'muted'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'primary'
      case 'low': return 'muted'
      default: return 'muted'
    }
  }

  // Auto-refresh notifications every 30 seconds
  let refreshInterval: NodeJS.Timeout | null = null
  
  const startAutoRefresh = () => {
    if (refreshInterval) return
    
    refreshInterval = setInterval(() => {
      if (!isLoading.value && !isUpdating.value) {
        refreshNotifications()
      }
    }, 30000) // 30 seconds
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Initialize notifications on first use
  const initialize = async () => {
    if (notifications.value.length === 0) {
      await fetchNotifications()
      startAutoRefresh()
    }
  }

  // Cleanup
  onBeforeUnmount(() => {
    stopAutoRefresh()
  })

  return {
    // State
    notifications,
    currentFilter,
    isLoading,
    isUpdating,
    lastUpdateTime,
    error,

    // Computed
    unreadCount,
    filteredNotifications,
    urgentNotifications,
    highPriorityNotifications,

    // Methods
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    createNotification,
    setFilter,
    initialize,
    startAutoRefresh,
    stopAutoRefresh,

    // Utility
    getRelativeTime,
    getTypeIcon,
    getTypeColor,
    getPriorityColor,

    // PWA Integration
    triggerPwaNotification,
  }
}
