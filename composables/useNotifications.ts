import { getToken, onMessage } from 'firebase/messaging'
import type { Messaging } from 'firebase/messaging'
import type PocketBase from 'pocketbase'

// Types for notification preferences
interface NotificationPreferences {
  id?: string
  user_id: string
  enabled: boolean
  session_reminders: boolean
  admin_messages: boolean
  system_alerts: boolean
  quiet_hours_start: string // "22:00"
  quiet_hours_end: string   // "08:00"
  frequency: 'immediate' | 'hourly' | 'daily'
  timezone: string
  created?: string
  updated?: string
}

// Types for notification analytics
interface NotificationAnalytics {
  id?: string
  title: string
  message: string
  type: 'session' | 'admin' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  recipient_user_id: string
  campaign_id?: string
  template_id?: string
  is_read: boolean
  read_at?: string
  action_url?: string
  action_text?: string
  scheduled_for: string
  sent_at?: string
  delivered_at?: string
  clicked_at?: string
  metadata?: Record<string, any>
  created?: string
  updated?: string
}

export const useNotifications = () => {
  const { $messaging, $pb } = useNuxtApp()
  const pb = $pb as PocketBase // PocketBase instance

  // VAPID key for web push
  const VAPID_KEY =
    'BNAoJ2HinfmirzJvdj5nKlX4k5mY_RO0Wz0CbFtfck6hApgo9rYxwhy6n0G8UW5n5c5nt-gsHRdsIx7LY80fmJ0'

  /**
   * Request notification permission from user
   */
  const requestPermission = async () => {
    try {
      if (!('Notification' in window)) {
        console.error('❌ This browser does not support notifications')
        return false
      }

      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        console.log('✅ Notification permission granted')
        await saveFCMToken()
        return true
      } else if (permission === 'denied') {
        console.log('❌ Notification permission denied')
        return false
      } else {
        console.log('⚠️ Notification permission dismissed')
        return false
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error)
      return false
    }
  }

  /**
   * Get FCM token and save to PocketBase with enhanced handling
   */
  const saveFCMToken = async (forceRefresh = false) => {
    try {
      const messaging = $messaging as Messaging

      if (!messaging) {
        console.error('❌ Firebase messaging not initialized')
        return null
      }

      // Check if we need to refresh the token
      if (!forceRefresh && pb.authStore.model?.id) {
        const user = await pb.collection('users').getOne(pb.authStore.model.id)
        const tokenUpdatedAt = user.fcm_token_updated_at ? new Date(user.fcm_token_updated_at) : null
        
        // If token was updated less than 24 hours ago, don't refresh unless forced
        if (tokenUpdatedAt && (Date.now() - tokenUpdatedAt.getTime()) < 24 * 60 * 60 * 1000) {
          console.log('📱 FCM token is still fresh, skipping refresh')
          return user.fcm_token
        }
      }

      // Get FCM token (this will refresh if needed)
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      })

      console.log('📱 FCM Token obtained:', token)

      // Save to PocketBase if user is logged in
      if (pb.authStore.model?.id) {
        await pb.collection('users').update(pb.authStore.model.id, {
          fcm_token: token,
          fcm_token_updated_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        })

        console.log('✅ FCM token saved to PocketBase')
      } else {
        console.warn('⚠️ User not logged in, token not saved')
      }

      return token
    } catch (error) {
      console.error('❌ Error getting/saving FCM token:', error)
      return null
    }
  }

  /**
   * Validate FCM token before sending notifications
   */
  const validateFCMToken = async (): Promise<boolean> => {
    try {
      if (!pb.authStore.model?.id) {
        return false
      }

      const user = await pb.collection('users').getOne(pb.authStore.model.id)
      
      // Check if token exists
      if (!user.fcm_token) {
        console.log('📱 No FCM token found, requesting new one')
        const newToken = await saveFCMToken(true)
        return !!newToken
      }

      // Check if token is older than 7 days (FCM tokens can expire)
      const tokenUpdatedAt = user.fcm_token_updated_at ? new Date(user.fcm_token_updated_at) : null
      if (!tokenUpdatedAt || (Date.now() - tokenUpdatedAt.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        console.log('📱 FCM token is old, refreshing')
        const newToken = await saveFCMToken(true)
        return !!newToken
      }

      return true
    } catch (error) {
      console.error('❌ Error validating FCM token:', error)
      return false
    }
  }

  /**
   * Refresh FCM token automatically
   */
  const refreshFCMToken = async (): Promise<string | null> => {
    try {
      console.log('🔄 Refreshing FCM token')
      return await saveFCMToken(true)
    } catch (error) {
      console.error('❌ Error refreshing FCM token:', error)
      return null
    }
  }

  /**
   * Listen for foreground messages
   */
  const listenToMessages = () => {
    const messaging = $messaging as Messaging

    if (!messaging) {
      console.error('❌ Firebase messaging not initialized')
      return
    }

    onMessage(messaging, (payload) => {
      console.log('📬 Foreground message received:', payload)

      // Show notification when app is in foreground
      if (payload.notification) {
        const notificationTitle = payload.notification.title || 'New notification'
        const notificationOptions = {
          body: payload.notification.body || '',
          icon: '/icon.png',
          badge: '/badge.png',
          data: payload.data,
          tag: payload.data?.notificationId || 'default',
          requireInteraction: false,
        }

        // Show browser notification
        if (Notification.permission === 'granted') {
          const notification = new Notification(
            notificationTitle,
            notificationOptions,
          )

          // Handle notification click
          notification.onclick = (event) => {
            event.preventDefault()
            const actionUrl = payload.data?.actionUrl || '/'
            window.open(actionUrl, '_blank')
            notification.close()
          }
        }
      }

      // Optional: Update UI, show toast, etc.
      // You can emit an event here or update a reactive state
    })
  }

  /**
   * Update user's last active timestamp
   */
  const updateLastActive = async () => {
    try {
      if (pb.authStore.model?.id) {
        await pb.collection('users').update(pb.authStore.model.id, {
          last_active_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.debug('Could not update last_active_at:', error)
    }
  }

  /**
   * Get user's unread notifications
   */
  const getUnreadNotifications = async () => {
    try {
      if (!pb.authStore.model?.id) {
        return []
      }

      const notifications = await pb.collection('notifications').getList(1, 50, {
        filter: `recipient_user_id = "${pb.authStore.model.id}" && is_read = false`,
        sort: '-created',
      })

      return notifications.items
    } catch (error) {
      console.error('❌ Error fetching notifications:', error)
      return []
    }
  }

  /**
   * Get user's notification history with pagination
   */
  const getNotificationHistory = async (page = 1, perPage = 20, filters?: {
    type?: 'session' | 'admin' | 'system'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    isRead?: boolean
    dateFrom?: Date
    dateTo?: Date
  }) => {
    try {
      if (!pb.authStore.model?.id) {
        return { items: [], totalItems: 0, totalPages: 0, page: 1, perPage: 20 }
      }

      // Build filter string
      let filterParts = [`recipient_user_id = "${pb.authStore.model.id}"`]
      
      if (filters?.type) {
        filterParts.push(`type = "${filters.type}"`)
      }
      
      if (filters?.priority) {
        filterParts.push(`priority = "${filters.priority}"`)
      }
      
      if (filters?.isRead !== undefined) {
        filterParts.push(`is_read = ${filters.isRead}`)
      }
      
      if (filters?.dateFrom) {
        filterParts.push(`created >= "${filters.dateFrom.toISOString()}"`)
      }
      
      if (filters?.dateTo) {
        filterParts.push(`created <= "${filters.dateTo.toISOString()}"`)
      }

      const filterString = filterParts.join(' && ')

      const result = await pb.collection('notifications').getList(page, perPage, {
        filter: filterString,
        sort: '-created',
        expand: 'campaign_id,template_id'
      })

      return result
    } catch (error) {
      console.error('❌ Error fetching notification history:', error)
      return { items: [], totalItems: 0, totalPages: 0, page: 1, perPage: 20 }
    }
  }

  /**
   * Get all notifications (read and unread) with pagination
   */
  const getAllNotifications = async (page = 1, perPage = 20) => {
    return await getNotificationHistory(page, perPage)
  }

  /**
   * Mark notification as read with analytics tracking
   */
  const markAsRead = async (notificationId: string) => {
    try {
      await pb.collection('notifications').update(notificationId, {
        is_read: true,
        read_at: new Date().toISOString(),
      })

      console.log('✅ Notification marked as read:', notificationId)
      return true
    } catch (error) {
      console.error('❌ Error marking notification as read:', error)
      return false
    }
  }

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      if (!pb.authStore.model?.id) {
        return false
      }

      const unreadNotifications = await getUnreadNotifications()

      for (const notification of unreadNotifications) {
        await markAsRead(notification.id)
      }

      console.log('✅ All notifications marked as read')
      return true
    } catch (error) {
      console.error('❌ Error marking all as read:', error)
      return false
    }
  }

  /**
   * Bulk mark notifications as read by IDs
   */
  const bulkMarkAsRead = async (notificationIds: string[]): Promise<boolean> => {
    try {
      const promises = notificationIds.map(id => markAsRead(id))
      await Promise.all(promises)
      
      console.log(`✅ ${notificationIds.length} notifications marked as read`)
      return true
    } catch (error) {
      console.error('❌ Error bulk marking notifications as read:', error)
      return false
    }
  }

  /**
   * Delete notification from history
   */
  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    try {
      await pb.collection('notifications').delete(notificationId)
      console.log('✅ Notification deleted:', notificationId)
      return true
    } catch (error) {
      console.error('❌ Error deleting notification:', error)
      return false
    }
  }

  /**
   * Bulk delete notifications by IDs
   */
  const bulkDeleteNotifications = async (notificationIds: string[]): Promise<boolean> => {
    try {
      const promises = notificationIds.map(id => deleteNotification(id))
      await Promise.all(promises)
      
      console.log(`✅ ${notificationIds.length} notifications deleted`)
      return true
    } catch (error) {
      console.error('❌ Error bulk deleting notifications:', error)
      return false
    }
  }

  /**
   * Clear old notifications (older than specified days)
   */
  const clearOldNotifications = async (olderThanDays = 30): Promise<boolean> => {
    try {
      if (!pb.authStore.model?.id) {
        return false
      }

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const oldNotifications = await pb.collection('notifications').getList(1, 1000, {
        filter: `recipient_user_id = "${pb.authStore.model.id}" && created < "${cutoffDate.toISOString()}"`,
      })

      if (oldNotifications.items.length > 0) {
        const ids = oldNotifications.items.map(n => n.id)
        await bulkDeleteNotifications(ids)
        console.log(`✅ Cleared ${ids.length} old notifications`)
      }

      return true
    } catch (error) {
      console.error('❌ Error clearing old notifications:', error)
      return false
    }
  }

  /**
   * Check if user has granted notification permission
   */
  const hasPermission = () => {
    if (!('Notification' in window)) {
      return false
    }
    return Notification.permission === 'granted'
  }

  /**
   * Initialize notifications with enhanced token management (call this on app mount or login)
   */
  const initialize = async () => {
    try {
      // Check if permission already granted
      if (hasPermission()) {
        // Validate and refresh token if needed
        await validateFCMToken()
        listenToMessages()
        
        // Set up periodic token refresh (every 6 hours)
        setInterval(async () => {
          await validateFCMToken()
        }, 6 * 60 * 60 * 1000)
        
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Error initializing notifications:', error)
      return false
    }
  }

  /**
   * Get user's notification preferences
   */
  const getNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
    try {
      if (!pb.authStore.model?.id) {
        return null
      }

      const preferences = await pb.collection('notification_preferences').getFirstListItem(
        `user_id = "${pb.authStore.model.id}"`
      )

      return preferences as unknown as NotificationPreferences
    } catch (error) {
      // If no preferences found, return default preferences
      if ((error as any).status === 404) {
        return {
          user_id: pb.authStore.model?.id || '',
          enabled: true,
          session_reminders: true,
          admin_messages: true,
          system_alerts: true,
          quiet_hours_start: '22:00',
          quiet_hours_end: '08:00',
          frequency: 'immediate',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }
      console.error('❌ Error fetching notification preferences:', error)
      return null
    }
  }

  /**
   * Create or update user's notification preferences
   */
  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<boolean> => {
    try {
      if (!pb.authStore.model?.id) {
        return false
      }

      // Validate quiet hours format
      if (preferences.quiet_hours_start && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preferences.quiet_hours_start)) {
        throw new Error('Invalid quiet_hours_start format. Use HH:MM format.')
      }
      if (preferences.quiet_hours_end && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(preferences.quiet_hours_end)) {
        throw new Error('Invalid quiet_hours_end format. Use HH:MM format.')
      }

      // Validate frequency
      if (preferences.frequency && !['immediate', 'hourly', 'daily'].includes(preferences.frequency)) {
        throw new Error('Invalid frequency. Must be immediate, hourly, or daily.')
      }

      const existingPreferences = await getNotificationPreferences()
      
      if (existingPreferences?.id) {
        // Update existing preferences
        const updated = await pb.collection('notification_preferences').update(existingPreferences.id, {
          ...preferences,
          user_id: pb.authStore.model.id
        })
        console.log('✅ Notification preferences updated')
        return true
      } else {
        // Create new preferences
        const created = await pb.collection('notification_preferences').create({
          user_id: pb.authStore.model.id,
          enabled: true,
          session_reminders: true,
          admin_messages: true,
          system_alerts: true,
          quiet_hours_start: '22:00',
          quiet_hours_end: '08:00',
          frequency: 'immediate',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...preferences
        })
        console.log('✅ Notification preferences created')
        return true
      }
    } catch (error) {
      console.error('❌ Error updating notification preferences:', error)
      return false
    }
  }

  /**
   * Check if current time is within user's quiet hours
   */
  const isWithinQuietHours = async (): Promise<boolean> => {
    try {
      const preferences = await getNotificationPreferences()
      if (!preferences || !preferences.enabled) {
        return true // If disabled, consider it quiet hours
      }

      const now = new Date()
      const userTimezone = preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Convert current time to user's timezone
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }))
      const currentHour = userTime.getHours()
      const currentMinute = userTime.getMinutes()
      const currentTimeMinutes = currentHour * 60 + currentMinute

      // Parse quiet hours
      const [startHour, startMinute] = preferences.quiet_hours_start.split(':').map(Number)
      const [endHour, endMinute] = preferences.quiet_hours_end.split(':').map(Number)
      const startTimeMinutes = startHour * 60 + startMinute
      const endTimeMinutes = endHour * 60 + endMinute

      // Handle overnight quiet hours (e.g., 22:00 to 08:00)
      if (startTimeMinutes > endTimeMinutes) {
        return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes <= endTimeMinutes
      } else {
        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
      }
    } catch (error) {
      console.error('❌ Error checking quiet hours:', error)
      return false
    }
  }

  /**
   * Check if user should receive a specific type of notification
   */
  const shouldReceiveNotification = async (type: 'session' | 'admin' | 'system'): Promise<boolean> => {
    try {
      const preferences = await getNotificationPreferences()
      if (!preferences || !preferences.enabled) {
        return false
      }

      // Check if within quiet hours
      if (await isWithinQuietHours()) {
        return false
      }

      // Check type-specific preferences
      switch (type) {
        case 'session':
          return preferences.session_reminders
        case 'admin':
          return preferences.admin_messages
        case 'system':
          return preferences.system_alerts
        default:
          return false
      }
    } catch (error) {
      console.error('❌ Error checking notification permission:', error)
      return false
    }
  }

  /**
   * Track notification delivery
   */
  const trackNotificationDelivery = async (notificationId: string): Promise<boolean> => {
    try {
      await pb.collection('notifications').update(notificationId, {
        delivered_at: new Date().toISOString(),
      })

      console.log('📊 Notification delivery tracked:', notificationId)
      return true
    } catch (error) {
      console.error('❌ Error tracking notification delivery:', error)
      return false
    }
  }

  /**
   * Track notification click/interaction
   */
  const trackNotificationClick = async (notificationId: string, actionUrl?: string): Promise<boolean> => {
    try {
      const updateData: any = {
        clicked_at: new Date().toISOString(),
      }

      // If not already read, mark as read when clicked
      const notification = await pb.collection('notifications').getOne(notificationId)
      if (!notification.is_read) {
        updateData.is_read = true
        updateData.read_at = new Date().toISOString()
      }

      await pb.collection('notifications').update(notificationId, updateData)

      console.log('📊 Notification click tracked:', notificationId)
      
      // Navigate to action URL if provided
      if (actionUrl) {
        window.open(actionUrl, '_blank')
      }

      return true
    } catch (error) {
      console.error('❌ Error tracking notification click:', error)
      return false
    }
  }

  /**
   * Get notification analytics for a user
   */
  const getNotificationAnalytics = async (days = 30) => {
    try {
      if (!pb.authStore.model?.id) {
        return null
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const notifications = await pb.collection('notifications').getList(1, 1000, {
        filter: `recipient_user_id = "${pb.authStore.model.id}" && created >= "${startDate.toISOString()}"`,
        sort: '-created',
      })

      const analytics = {
        total: notifications.items.length,
        delivered: notifications.items.filter((n: any) => n.delivered_at).length,
        opened: notifications.items.filter((n: any) => n.read_at).length,
        clicked: notifications.items.filter((n: any) => n.clicked_at).length,
        byType: {
          session: notifications.items.filter((n: any) => n.type === 'session').length,
          admin: notifications.items.filter((n: any) => n.type === 'admin').length,
          system: notifications.items.filter((n: any) => n.type === 'system').length,
        },
        byPriority: {
          low: notifications.items.filter((n: any) => n.priority === 'low').length,
          medium: notifications.items.filter((n: any) => n.priority === 'medium').length,
          high: notifications.items.filter((n: any) => n.priority === 'high').length,
          urgent: notifications.items.filter((n: any) => n.priority === 'urgent').length,
        },
        engagementScore: 0
      }

      // Calculate engagement score (0-100)
      if (analytics.delivered > 0) {
        const openRate = analytics.opened / analytics.delivered
        const clickRate = analytics.clicked / analytics.delivered
        analytics.engagementScore = Math.round((openRate * 0.6 + clickRate * 0.4) * 100)
      }

      return analytics
    } catch (error) {
      console.error('❌ Error getting notification analytics:', error)
      return null
    }
  }

  /**
   * Update notification metadata for tracking
   */
  const updateNotificationMetadata = async (notificationId: string, metadata: Record<string, any>): Promise<boolean> => {
    try {
      const notification = await pb.collection('notifications').getOne(notificationId)
      const existingMetadata = notification.metadata || {}
      
      await pb.collection('notifications').update(notificationId, {
        metadata: { ...existingMetadata, ...metadata }
      })

      console.log('📊 Notification metadata updated:', notificationId)
      return true
    } catch (error) {
      console.error('❌ Error updating notification metadata:', error)
      return false
    }
  }

  return {
    requestPermission,
    saveFCMToken,
    listenToMessages,
    updateLastActive,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    hasPermission,
    initialize,
    // New preference management methods
    getNotificationPreferences,
    updateNotificationPreferences,
    isWithinQuietHours,
    shouldReceiveNotification,
    // Enhanced FCM token management
    validateFCMToken,
    refreshFCMToken,
    // Analytics tracking methods
    trackNotificationDelivery,
    trackNotificationClick,
    getNotificationAnalytics,
    updateNotificationMetadata,
    // Notification history management
    getNotificationHistory,
    getAllNotifications,
    bulkMarkAsRead,
    deleteNotification,
    bulkDeleteNotifications,
    clearOldNotifications,
  }
}
