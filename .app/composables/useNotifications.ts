import type { Ref } from 'vue'

// PocketBase Notification Record Interface (matches the schema)
export interface PBNotificationRecord {
  id: string
  title: string
  message: string
  complete_message?: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  is_read: boolean
  user_id?: string
  user_name?: string
  user_avatar?: string
  user_role?: string
  action_url?: string
  action_text?: string
  read_at?: string
  recipient_user_id?: string
  announce_time?: string
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
  completeMessage?: string // فیلد جدید برای محتوای کامل rich editor
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  createdAt: string
  readAt?: string
  announceTime?: string // زمان اعلان - اختیاری
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
    completeMessage: record.complete_message,
    type: record.type,
    priority: record.priority,
    isRead: record.is_read,
    createdAt: record.created,
    readAt: record.read_at,
    announceTime: record.announce_time,
    user: record.user_id
      ? {
          id: record.user_id,
          name: record.user_name || 'نامشخص',
          avatar: record.user_avatar || '/img/avatars/placeholder.webp',
          role: record.user_role,
        }
      : record.expand?.user
        ? {
            id: record.expand.user.id,
            name: record.expand.user.name,
            avatar: record.expand.user.avatar || '/img/avatars/placeholder.webp',
            role: record.expand.user.role,
          }
        : undefined,
    actionUrl: record.action_url,
    actionText: record.action_text,
  }
}

// Global singleton instance
let notificationsInstance: any = null
let isInitialized = false
let initPromise: Promise<void> | null = null
let cleanupHandler: (() => void) | null = null
let currentFetchController: AbortController | null = null

export function useNotifications() {
  // Return existing instance if available
  if (notificationsInstance) {
    return notificationsInstance
  }

  const { $pb } = useNuxtApp()
  const notifications: Ref<Notification[]> = ref([])
  const currentFilter: Ref<NotificationFilter> = ref('unread')
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const lastUpdateTime = ref(Date.now())
  const error = ref<string | null>(null)

  // Realtime subscription reference
  const realtimeSubscription = ref<any>(null)
  const isRealtimeConnected = ref(false)

  // PWA Notifications integration - only on client
  const pwaNotifications = computed(() => {
    if (!process.client) return null
    try {
      return usePwaNotifications()
    }
    catch (err) {
      
      return null
    }
  })

  // Get current user ID
  const getCurrentUserId = () => {
    if (!process.client) return null
    return $pb.authStore.model?.id || null
  }

  // Computed properties
  const unreadCount = computed(() => {
    const count = visibleNotifications.value.filter(n => !n.isRead).length
    console.debug('Unread count computed:', count, 'from', visibleNotifications.value.length, 'visible notifications')
    return count
  })

  const highPriorityNotifications = computed(() => {
    return visibleNotifications.value.filter(n => !n.isRead && (n.priority === 'high' || n.priority === 'urgent'))
  })

  // اعلانات زمان‌بندی شده که هنوز زمان‌شان نرسیده
  const scheduledNotifications = computed(() => {
    const now = new Date()
    return notifications.value.filter((n) => {
      // بررسی وجود و اعتبار announce_time
      const hasValidAnnounceTime = n.announceTime
        && n.announceTime.trim() !== ''
        && n.announceTime !== 'null'
        && n.announceTime !== 'undefined'

      if (!hasValidAnnounceTime) return false

      const announceTime = new Date(n.announceTime)

      // بررسی معتبر بودن تاریخ parsed شده
      if (isNaN(announceTime.getTime())) {
        return false
      }

      return announceTime > now
    })
  })

  // اعلانات قابل نمایش (فقط اعلاناتی که زمان‌شان رسیده)
  const visibleNotifications = computed(() => {
    const now = new Date()
    return notifications.value.filter((n) => {
      // بررسی وجود و اعتبار announce_time
      const hasValidAnnounceTime = n.announceTime
        && n.announceTime.trim() !== ''
        && n.announceTime !== 'null'
        && n.announceTime !== 'undefined'

      // اگر زمان اعلان تنظیم نشده یا نامعتبر است، همیشه نمایش داده شود
      if (!hasValidAnnounceTime) {
        return true
      }

      // Parse announce time
      const announceTime = new Date(n.announceTime)

      // بررسی معتبر بودن تاریخ parsed شده
      if (isNaN(announceTime.getTime())) {
        return true
      }

      // اگر زمان اعلان رسیده، نمایش داده شود
      return announceTime <= now
    })
  })

  // بروزرسانی filteredNotifications برای استفاده از visibleNotifications
  const filteredNotifications = computed(() => {
    const visible = visibleNotifications.value
    switch (currentFilter.value) {
      case 'unread':
        return visible.filter(n => !n.isRead)
      case 'read':
        return visible.filter(n => n.isRead)
      default:
        return visible
    }
  })

  const urgentNotifications = computed(() => {
    return visibleNotifications.value.filter(n => !n.isRead && n.priority === 'urgent')
  })

  // PWA notification helper
  const triggerPwaNotification = async (notification: Notification) => {
    if (!process.client) return

    const pwa = pwaNotifications.value
    if (!pwa) return

    try {
      // Check if permission is granted, if not request it immediately
      if (Notification.permission !== 'granted') {
        
        const granted = await pwa.autoRequestPermission()
        if (!granted) {
          
          return
        }
      }

      // Show the notification
      await pwa.showLocalNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        url: notification.actionUrl || '/notifications',
        actionText: notification.actionText,
        tag: `notification-${notification.id}`,
      })

      
    }
    catch (err) {
      
    }
  }

  // Realtime subscription management
  const subscribeToNotifications = async () => {
    if (!process.client) return

    const userId = getCurrentUserId()
    if (!userId || !$pb.authStore.isValid) {
      console.warn('Cannot subscribe to notifications: user not authenticated')
      return
    }

    // Unsubscribe from previous connection if exists
    await unsubscribeFromNotifications()

    try {
      console.log('Attempting to subscribe to realtime notifications...')

      // Subscribe to notifications with filter for current user
      realtimeSubscription.value = await $pb.collection('notifications').subscribe('*', async (e) => {
        console.log('Realtime notification event:', e.action, e.record)

        // Only process notifications for current user
        const record = e.record as PBNotificationRecord
        if (record.recipient_user_id !== userId) return

        const transformedNotification = transformPBRecord(record)

        switch (e.action) {
          case 'create':
            // Add new notification to the beginning of the list
            notifications.value.unshift(transformedNotification)
            console.debug('Realtime: Added new notification', transformedNotification.id, 'Total notifications:', notifications.value.length)

            // Always trigger PWA notification for new notifications (even if read)
            // This ensures the user sees the notification immediately
            
            await triggerPwaNotification(transformedNotification)
            break

          case 'update':
            // Update existing notification
            const updateIndex = notifications.value.findIndex(n => n.id === transformedNotification.id)
            if (updateIndex > -1) {
              notifications.value[updateIndex] = transformedNotification
              console.debug('Realtime: Updated notification', transformedNotification.id, 'at index', updateIndex)
            }
            break

          case 'delete':
            // Remove notification from list
            const deleteIndex = notifications.value.findIndex(n => n.id === record.id)
            if (deleteIndex > -1) {
              notifications.value.splice(deleteIndex, 1)
              console.debug('Realtime: Deleted notification', record.id, 'from index', deleteIndex)
            }
            break
        }

        lastUpdateTime.value = Date.now()
      })

      isRealtimeConnected.value = true
      console.log('Successfully subscribed to notifications realtime updates')
    }
    catch (err: any) {
      console.error('Error subscribing to notifications:', err)
      isRealtimeConnected.value = false

      // Don't show error for network issues - just log it
      if (err.message?.includes('INCOMPLETE_CHUNKED_ENCODING')
        || err.message?.includes('net::ERR_')
        || err.name === 'TypeError') {
        console.warn('Realtime connection failed, will retry later:', err.message)

        // Retry connection after a delay
        setTimeout(() => {
          if (process.client && $pb.authStore.isValid) {
            console.log('Retrying realtime connection...')
            subscribeToNotifications()
          }
        }, 5000) // Retry after 5 seconds
      }
      else {
        error.value = 'خطا در اتصال به سیستم اعلانات فوری'
      }
    }
  }

  const unsubscribeFromNotifications = async () => {
    if (realtimeSubscription.value) {
      try {
        await $pb.collection('notifications').unsubscribe(realtimeSubscription.value)
        console.log('Unsubscribed from notifications realtime updates')
      }
      catch (err: any) {
        // Ignore errors when unsubscribing - connection might already be closed
        console.warn('Error unsubscribing from notifications (this is usually harmless):', err.message)
      }
      finally {
        // Always reset the subscription state
        realtimeSubscription.value = null
        isRealtimeConnected.value = false
      }
    }
  }

  // Methods
  const fetchNotifications = async (page = 1, perPage = 50) => {
    if (!process.client) return

    const userId = getCurrentUserId()
    console.log('Fetch notifications called:', {
      page,
      perPage,
      userId,
      authValid: $pb?.authStore?.isValid,
      authModel: $pb?.authStore?.model?.id,
    })

    if (!userId) {
      console.warn('Cannot fetch notifications: user not authenticated')
      error.value = 'User not authenticated'
      return
    }

    // Cancel previous request if still pending
    if (currentFetchController) {
      currentFetchController.abort()
    }

    // Create new abort controller
    currentFetchController = new AbortController()
    const signal = currentFetchController.signal

    try {
      if (page === 1) {
        isLoading.value = true
      }
      error.value = null

      // Add signal to the request
      const records = await $pb.collection('notifications').getList<PBNotificationRecord>(page, perPage, {
        filter: `recipient_user_id = "${userId}"`,
        sort: '-created',
        expand: 'user,recipient_user_id',
        signal, // Add abort signal
      })

      // Transform PocketBase records to frontend format
      const transformedNotifications = records.items.map(transformPBRecord)

      // Check for new notifications to trigger PWA notifications
      if (page === 1 && notifications.value.length > 0) {
        const newNotifications = transformedNotifications.filter(newNotif =>
          !notifications.value.some(existing => existing.id === newNotif.id),
        )

        

        // Trigger PWA notifications for all new notifications
        for (const newNotif of newNotifications) {
          
          await triggerPwaNotification(newNotif)
        }
      }

      if (page === 1) {
        notifications.value = transformedNotifications
      }
      else {
        notifications.value.push(...transformedNotifications)
      }

      lastUpdateTime.value = Date.now()
    }
    catch (err: any) {
      // Ignore abort errors - they're expected when we cancel requests
      if (err.name === 'AbortError' || err.message?.includes('autocancelled')) {
        console.log('Fetch request was cancelled - this is normal')
        return
      }

      console.error('Error fetching notifications:', err)
      error.value = err.message || 'خطا در دریافت اعلان‌ها'
    }
    finally {
      if (page === 1) {
        isLoading.value = false
      }
      // Clear the controller reference if this was the active request
      if (currentFetchController?.signal === signal) {
        currentFetchController = null
      }
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (!notification || notification.isRead) return

      // Update in PocketBase
      await $pb.collection('notifications').update(notificationId, {
        is_read: true,
        read_at: new Date().toISOString(),
      })

      // Update local state
      notification.isRead = true
      notification.readAt = new Date().toISOString()
    }
    catch (err: any) {
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
        read_at: null,
      })

      // Update local state
      notification.isRead = false
      notification.readAt = undefined
    }
    catch (err: any) {
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
          read_at: new Date().toISOString(),
        }),
      )

      await Promise.all(updatePromises)

      // Update local state
      notifications.value.forEach((notification) => {
        if (!notification.isRead) {
          notification.isRead = true
          notification.readAt = new Date().toISOString()
        }
      })
    }
    catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      error.value = err.message || 'خطا در به‌روزرسانی اعلان‌ها'
    }
    finally {
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
    }
    catch (err: any) {
      console.error('Error deleting notification:', err)
      error.value = err.message || 'خطا در حذف اعلان'
    }
  }

  const refreshNotifications = async () => {
    // Prevent multiple simultaneous refresh operations
    if (isLoading.value || isUpdating.value) {
      console.log('Refresh already in progress, skipping')
      return
    }

    isUpdating.value = true
    try {
      await fetchNotifications()
    }
    finally {
      isUpdating.value = false
    }
  }

  // Create new notification (admin/system use)
  const createNotification = async (data: {
    title: string
    message: string
    complete_message?: string
    type: 'info' | 'success' | 'warning' | 'error' | 'system'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    recipient_user_id: string
    user_id?: string
    user_name?: string
    user_avatar?: string
    user_role?: string
    action_url?: string
    action_text?: string
    announce_time?: string
  }) => {
    try {
      const record = await $pb.collection('notifications').create<PBNotificationRecord>({
        title: data.title,
        message: data.message,
        complete_message: data.complete_message,
        type: data.type,
        priority: data.priority,
        recipient_user_id: data.recipient_user_id,
        user_id: data.user_id,
        user_name: data.user_name,
        user_avatar: data.user_avatar,
        user_role: data.user_role,
        action_url: data.action_url,
        action_text: data.action_text,
        announce_time: data.announce_time,
        is_read: false,
      })

      // If this notification is for the current user, add it to local state
      const currentUserId = getCurrentUserId()
      if (data.recipient_user_id === currentUserId) {
        const transformedNotification = transformPBRecord(record)
        notifications.value.unshift(transformedNotification)

        // Always trigger PWA notification for new notification
        
        await triggerPwaNotification(transformedNotification)
      }

      return record
    }
    catch (err: any) {
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

  // Auto-refresh notifications every 30 seconds - DEPRECATED: Using realtime instead
  let refreshInterval: NodeJS.Timeout | null = null

  const startAutoRefresh = () => {
    // DEPRECATED: Realtime subscription handles updates automatically
    console.warn('Auto-refresh is deprecated. Using realtime subscriptions instead.')
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Setup auth state management - call this from app initialization
  const setupAuthManagement = async () => {
    if (!process.client || !$pb?.authStore) return

    // Prevent multiple setups
    if (cleanupHandler) {
      console.log('Auth management already setup, skipping')
      return
    }

    console.log('Setting up auth management for notifications...')

    // Setup cleanup on browser close
    cleanupHandler = () => {
      globalCleanup()
    }
    window.addEventListener('beforeunload', cleanupHandler)

    // Check if user is already authenticated and initialize if needed
    console.log('Auth state check:', {
      isValid: $pb.authStore.isValid,
      isInitialized,
      hasInitPromise: !!initPromise,
      userId: $pb.authStore.model?.id,
    })

    if ($pb.authStore.isValid && !isInitialized && !initPromise) {
      console.log('User already authenticated, initializing notifications for user:', $pb.authStore.model?.id)
      try {
        await initialize()
        console.log('Notifications initialized successfully from auth management')
      }
      catch (error) {
        console.error('Failed to initialize notifications for authenticated user:', error)
      }
    }
    else {
      console.log('Skipping auto-initialization:', {
        reason: !$pb.authStore.isValid
          ? 'not authenticated'
          : isInitialized
            ? 'already initialized'
            : initPromise ? 'initialization in progress' : 'unknown',
      })
    }

    // Handle auth state changes
    $pb.authStore.onChange((token, model) => {
      if (!token || !model) {
        // User logged out
        console.log('User logged out, cleaning up notifications')
        globalCleanup()
        isInitialized = false
        initPromise = null
      }
      else if (!isInitialized) {
        // User logged in, reinitialize
        console.log('User authenticated, reinitializing notifications for:', model.id)

        // Use a small delay to ensure everything is ready
        setTimeout(async () => {
          try {
            await reinitialize()
            isInitialized = true
          }
          catch (error) {
            console.error('Failed to reinitialize notifications:', error)
            isInitialized = false
            initPromise = null
          }
        }, 100)
      }
    })
  }

  // Initialize function
  const initialize = async () => {
    console.log('Initialize called with state:', {
      isClient: process.client,
      isLoading: isLoading.value,
      isInitialized,
      hasInitPromise: !!initPromise,
      authValid: $pb?.authStore?.isValid,
      userId: $pb?.authStore?.model?.id,
    })

    if (!process.client) {
      console.warn('Initialize called on server side, skipping')
      return
    }

    // Prevent multiple initialization attempts
    if (isLoading.value || isInitialized) {
      console.log('Initialization already completed or in progress')
      return
    }

    if (initPromise) {
      console.log('Waiting for existing initialization to complete')
      return initPromise
    }

    initPromise = (async () => {
      try {
        isLoading.value = true
        error.value = null

        // In development, fetch fewer notifications for faster startup
        const fetchCount = process.env.NODE_ENV === 'development' ? 20 : 50
        await fetchNotifications(1, fetchCount)
        await subscribeToNotifications()

        // Auto-request PWA notification permission on first initialization
        if (process.client) {
          const pwa = pwaNotifications.value
          if (pwa) {
            // Request permission immediately without delay
            try {
              const granted = await pwa.autoRequestPermission()
              if (granted) {
                
              }
              else {
                
              }
            }
            catch (err) {
              
            }
          }
        }

        isInitialized = true
        console.log('Notifications initialized successfully')
      }
      catch (err: any) {
        console.error('Error initializing notifications:', err)
        error.value = err.message || 'خطا در بارگیری اعلان‌ها'
        isInitialized = false
      }
      finally {
        isLoading.value = false
        initPromise = null
      }
    })()

    return initPromise
  }

  // Re-initialize for new user (after login)
  const reinitialize = async () => {
    // Clear existing data
    notifications.value = []
    currentFilter.value = 'unread'
    error.value = null

    // Unsubscribe from previous realtime connection
    await unsubscribeFromNotifications()

    // Initialize fresh
    await initialize()
  }

  // Global cleanup function
  const globalCleanup = () => {
    stopAutoRefresh()
    unsubscribeFromNotifications()

    // Cancel any pending fetch requests
    if (currentFetchController) {
      currentFetchController.abort()
      currentFetchController = null
    }

    // Reset PWA permission tracking on logout
    if (process.client) {
      const pwa = pwaNotifications.value
      if (pwa && pwa.resetPermissionTracking) {
        pwa.resetPermissionTracking()
      }
    }

    // Remove window event listener if exists
    if (process.client && cleanupHandler) {
      window.removeEventListener('beforeunload', cleanupHandler)
      cleanupHandler = null
    }

    notificationsInstance = null
    isInitialized = false
    initPromise = null
  }

  // Note: No cleanup in composable since this is a global singleton
  // Individual components should not cleanup the global instance

  // Create the instance object
  const instance = {
    // State
    notifications,
    currentFilter,
    isLoading,
    isUpdating,
    lastUpdateTime,
    error,
    isRealtimeConnected,

    // Computed
    unreadCount,
    filteredNotifications,
    visibleNotifications,
    urgentNotifications,
    highPriorityNotifications,
    scheduledNotifications,

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
    reinitialize,
    setupAuthManagement,
    startAutoRefresh,
    stopAutoRefresh,

    // Realtime
    subscribeToNotifications,
    unsubscribeFromNotifications,

    // Utility
    getRelativeTime,
    getTypeIcon,
    getTypeColor,
    getPriorityColor,

    // PWA Integration
    triggerPwaNotification,

    // Global cleanup
    globalCleanup,
  }

  // Store as singleton
  notificationsInstance = instance

  return instance
}
