/**
 * Enhanced Service Worker Notifications Composable
 * Handles communication with the service worker for advanced notification features
 */

export const useServiceWorkerNotifications = () => {
  const isSupported = ref(false)
  const isRegistered = ref(false)
  const registration = ref<ServiceWorkerRegistration | null>(null)

  // Check if service worker and notifications are supported
  const checkSupport = () => {
    isSupported.value = 'serviceWorker' in navigator && 'Notification' in window
    return isSupported.value
  }

  // Register service worker and set up message handling
  const registerServiceWorker = async () => {
    if (!checkSupport()) {
      throw new Error('Service Worker or Notifications not supported')
    }

    try {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      registration.value = reg
      isRegistered.value = true

      // Set up message handling from service worker
      setupMessageHandling()

      console.log('Service Worker registered successfully')
      return reg
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      throw error
    }
  }

  // Set up message handling between client and service worker
  const setupMessageHandling = () => {
    if (!navigator.serviceWorker) return

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, url, notificationData } = event.data

      switch (type) {
        case 'NOTIFICATION_CLICK':
          handleServiceWorkerNavigation(url, notificationData)
          break
        default:
          console.log('Unknown message from service worker:', event.data)
      }
    })
  }

  // Handle navigation requests from service worker
  const handleServiceWorkerNavigation = (url: string, notificationData: any) => {
    try {
      // Use Nuxt router to navigate
      const router = useRouter()
      router.push(url)

      // Track the navigation
      trackNotificationInteraction('navigation', notificationData)
    } catch (error) {
      console.error('Error handling service worker navigation:', error)
      // Fallback to window location
      window.location.href = url
    }
  }

  // Get all current notifications
  const getCurrentNotifications = async () => {
    if (!registration.value) {
      throw new Error('Service Worker not registered')
    }

    try {
      const notifications = await registration.value.getNotifications()
      return notifications
    } catch (error) {
      console.error('Error getting current notifications:', error)
      return []
    }
  }

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!registration.value) {
      throw new Error('Service Worker not registered')
    }

    try {
      const notifications = await registration.value.getNotifications()
      notifications.forEach(notification => notification.close())
      
      // Track bulk dismissal
      trackNotificationInteraction('bulk_dismiss', {
        count: notifications.length,
        timestamp: Date.now()
      })
      
      return notifications.length
    } catch (error) {
      console.error('Error clearing notifications:', error)
      throw error
    }
  }

  // Clear notifications by type or group
  const clearNotificationsByType = async (type: string) => {
    if (!registration.value) {
      throw new Error('Service Worker not registered')
    }

    try {
      const notifications = await registration.value.getNotifications()
      const filteredNotifications = notifications.filter(n => 
        n.data?.type === type || n.tag?.includes(type)
      )
      
      filteredNotifications.forEach(notification => notification.close())
      
      // Track type-specific dismissal
      trackNotificationInteraction('type_dismiss', {
        type,
        count: filteredNotifications.length,
        timestamp: Date.now()
      })
      
      return filteredNotifications.length
    } catch (error) {
      console.error('Error clearing notifications by type:', error)
      throw error
    }
  }

  // Get notification events from IndexedDB
  const getNotificationEvents = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ZehnaNotificationEvents', 1)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        const transaction = db.transaction(['events'], 'readonly')
        const store = transaction.objectStore('events')
        const getAllRequest = store.getAll()
        
        getAllRequest.onsuccess = () => resolve(getAllRequest.result)
        getAllRequest.onerror = () => reject(getAllRequest.error)
      }
    })
  }

  // Clear notification events from IndexedDB
  const clearNotificationEvents = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ZehnaNotificationEvents', 1)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        const transaction = db.transaction(['events'], 'readwrite')
        const store = transaction.objectStore('events')
        const clearRequest = store.clear()
        
        clearRequest.onsuccess = () => resolve(true)
        clearRequest.onerror = () => reject(clearRequest.error)
      }
    })
  }

  // Sync notification events with server
  const syncNotificationEvents = async () => {
    try {
      const events = await getNotificationEvents() as any[]
      
      if (events.length === 0) {
        return { synced: 0, errors: 0 }
      }

      // Use the existing notifications composable to sync events
      const { trackNotificationEvent } = useNotifications()
      
      let synced = 0
      let errors = 0
      
      for (const event of events) {
        try {
          await trackNotificationEvent(event.type, event.data || {})
          synced++
        } catch (error) {
          console.error('Error syncing notification event:', error)
          errors++
        }
      }
      
      // Clear synced events
      if (synced > 0) {
        await clearNotificationEvents()
      }
      
      return { synced, errors }
    } catch (error) {
      console.error('Error syncing notification events:', error)
      throw error
    }
  }

  // Track notification interaction
  const trackNotificationInteraction = (action: string, data: any) => {
    try {
      // Store in IndexedDB for later sync
      const event = {
        type: 'interaction',
        action,
        data,
        timestamp: Date.now()
      }
      
      // Store event
      const request = indexedDB.open('ZehnaNotificationEvents', 1)
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        const transaction = db.transaction(['events'], 'readwrite')
        const store = transaction.objectStore('events')
        store.add(event)
      }
    } catch (error) {
      console.error('Error tracking notification interaction:', error)
    }
  }

  // Get notification statistics
  const getNotificationStats = async () => {
    try {
      const events = await getNotificationEvents() as any[]
      const notifications = await getCurrentNotifications()
      
      const stats = {
        totalEvents: events.length,
        currentNotifications: notifications.length,
        eventsByType: {} as Record<string, number>,
        eventsByAction: {} as Record<string, number>,
        recentEvents: events.slice(-10)
      }
      
      // Count events by type and action
      events.forEach(event => {
        stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1
        if (event.action) {
          stats.eventsByAction[event.action] = (stats.eventsByAction[event.action] || 0) + 1
        }
      })
      
      return stats
    } catch (error) {
      console.error('Error getting notification stats:', error)
      throw error
    }
  }

  // Initialize on mount
  onMounted(() => {
    if (process.client) {
      checkSupport()
      
      // Auto-register if supported
      if (isSupported.value) {
        registerServiceWorker().catch(console.error)
      }
    }
  })

  return {
    isSupported: readonly(isSupported),
    isRegistered: readonly(isRegistered),
    registration: readonly(registration),
    registerServiceWorker,
    getCurrentNotifications,
    clearAllNotifications,
    clearNotificationsByType,
    getNotificationEvents,
    clearNotificationEvents,
    syncNotificationEvents,
    trackNotificationInteraction,
    getNotificationStats
  }
}