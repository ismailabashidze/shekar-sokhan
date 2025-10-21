// Firebase Cloud Messaging Service Worker
// This handles notifications when the app is closed or in the background

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

// Initialize Firebase in service worker
// Note: These values should match your Firebase project configuration
// You'll need to replace these with your actual Firebase config values
firebase.initializeApp({
  apiKey: "AIzaSyBixyIOgzx6awRFV2hnE0-EptBgbb1bz4Q",
  authDomain: "zehna-notifications.firebaseapp.com",
  projectId: "zehna-notifications",
  storageBucket: "zehna-notifications.firebasestorage.app",
  messagingSenderId: "838017469547",
  appId: "1:838017469547:web:b4eefcc72df3405cbfb52e"
})

const messaging = firebase.messaging()

// Enhanced notification processing with rich formatting and priority handling
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationData = {
    ...payload.data,
    timestamp: Date.now(),
    received_at: new Date().toISOString()
  }

  const priority = payload.data?.priority || 'medium'
  const type = payload.data?.type || 'info'

  // Enhanced notification options with rich formatting
  const notificationOptions = createEnhancedNotificationOptions(payload, notificationData, priority, type)

  // Track notification reception
  trackNotificationEvent('received', notificationData)

  const notificationTitle = payload.notification?.title || payload.data?.title || 'ذهنا'

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Create enhanced notification options with rich formatting and priority handling
function createEnhancedNotificationOptions(payload, notificationData, priority, type) {
  const baseOptions = {
    body: payload.notification?.body || payload.data?.message || '',
    icon: getNotificationIcon(type, priority),
    badge: '/favicon.ico',
    tag: getNotificationTag(payload, type),
    data: {
      url: payload.data?.actionUrl || payload.fcmOptions?.link || '/notifications',
      notificationId: payload.data?.notificationId,
      type: type,
      priority: priority,
      campaignId: payload.data?.campaignId,
      sessionId: payload.data?.sessionId,
      templateId: payload.data?.templateId,
      groupId: payload.data?.groupId,
      ...notificationData
    },
    requireInteraction: priority === 'high' || priority === 'urgent',
    silent: priority === 'low',
    renotify: priority === 'urgent',
    timestamp: Date.now(),
    actions: []
  }

  // Priority-based visual and behavioral enhancements
  switch (priority) {
    case 'urgent':
      baseOptions.vibrate = [300, 100, 300, 100, 300]
      baseOptions.requireInteraction = true
      baseOptions.renotify = true
      break
    case 'high':
      baseOptions.vibrate = [200, 100, 200]
      baseOptions.requireInteraction = true
      break
    case 'medium':
      baseOptions.vibrate = [200, 100, 200]
      break
    case 'low':
      baseOptions.vibrate = [100]
      baseOptions.silent = true
      break
  }

  // Type-specific enhancements
  switch (type) {
    case 'session':
      baseOptions.image = payload.data?.sessionImage
      break
    case 'admin':
      baseOptions.dir = 'rtl' // Persian text direction
      break
    case 'system':
      baseOptions.requireInteraction = true
      break
  }

  // Add enhanced action buttons
  baseOptions.actions = createNotificationActions(payload, type, priority)

  return baseOptions
}

// Get appropriate icon based on notification type and priority
function getNotificationIcon(type, priority) {
  const iconMap = {
    session: '/icons/session-notification.png',
    admin: '/icons/admin-notification.png',
    system: '/icons/system-notification.png',
    default: '/pwa-192x192.png'
  }

  let icon = iconMap[type] || iconMap.default

  // Priority-based icon variations
  if (priority === 'urgent') {
    icon = icon.replace('.png', '-urgent.png')
  } else if (priority === 'high') {
    icon = icon.replace('.png', '-high.png')
  }

  return icon
}

// Generate notification tag for grouping and deduplication
function getNotificationTag(payload, type) {
  const notificationId = payload.data?.notificationId
  const campaignId = payload.data?.campaignId
  const sessionId = payload.data?.sessionId

  if (notificationId) {
    return `notification-${notificationId}`
  } else if (campaignId) {
    return `campaign-${campaignId}`
  } else if (sessionId) {
    return `session-${sessionId}`
  } else {
    return `${type}-${Date.now()}`
  }
}

// Create context-aware action buttons
function createNotificationActions(payload, type, priority) {
  const actions = []

  // Primary action based on type
  switch (type) {
    case 'session':
      actions.push({
        action: 'view_session',
        title: 'مشاهده جلسه',
        icon: '/icons/session-action.png'
      })
      break
    case 'admin':
      actions.push({
        action: 'open',
        title: payload.data?.actionText || 'مشاهده',
        icon: '/icons/admin-action.png'
      })
      break
    case 'system':
      actions.push({
        action: 'open',
        title: 'بررسی',
        icon: '/icons/system-action.png'
      })
      break
    default:
      if (payload.data?.actionUrl || payload.fcmOptions?.link) {
        actions.push({
          action: 'open',
          title: payload.data?.actionText || 'مشاهده',
          icon: '/pwa-192x192.png'
        })
      }
  }

  // Secondary actions based on priority and type
  if (priority !== 'urgent') {
    actions.push({
      action: 'dismiss',
      title: 'رد کردن'
    })
  }

  // Add snooze for non-urgent notifications
  if (priority === 'low' || priority === 'medium') {
    actions.push({
      action: 'snooze',
      title: 'یادآوری بعدی'
    })
  }

  return actions.slice(0, 2) // Limit to 2 actions per notification
}

// Track notification events for analytics
function trackNotificationEvent(eventType, notificationData) {
  try {
    // Store event in IndexedDB for later sync
    const event = {
      type: eventType,
      notificationId: notificationData.notificationId,
      campaignId: notificationData.campaignId,
      sessionId: notificationData.sessionId,
      timestamp: Date.now(),
      data: notificationData
    }

    // Store in IndexedDB (will be synced when app opens)
    storeNotificationEvent(event)
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error tracking notification event:', error)
  }
}

// Store notification event in IndexedDB
function storeNotificationEvent(event) {
  // Simple IndexedDB storage for offline event tracking
  const request = indexedDB.open('ZehnaNotificationEvents', 1)

  request.onupgradeneeded = (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains('events')) {
      const store = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true })
      store.createIndex('timestamp', 'timestamp', { unique: false })
      store.createIndex('type', 'type', { unique: false })
    }
  }

  request.onsuccess = (e) => {
    const db = e.target.result
    const transaction = db.transaction(['events'], 'readwrite')
    const store = transaction.objectStore('events')
    store.add(event)
  }
}

// Enhanced notification click handling with multiple action support and deep linking
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received. Action:', event.action)

  const notificationData = event.notification.data || {}
  const action = event.action

  // Track click event
  trackNotificationEvent('clicked', {
    ...notificationData,
    action: action || 'body_click',
    clickedAt: new Date().toISOString()
  })

  // Handle different action types
  event.waitUntil(handleNotificationAction(event, action, notificationData))
})

// Handle different notification actions with deep linking
async function handleNotificationAction(event, action, notificationData) {
  const { type, priority, notificationId, campaignId, sessionId, url } = notificationData

  try {
    switch (action) {
      case 'dismiss':
        // Just close the notification and track dismissal
        event.notification.close()
        trackNotificationEvent('dismissed', notificationData)
        return

      case 'snooze':
        // Close current notification and schedule a new one
        event.notification.close()
        await handleNotificationSnooze(notificationData)
        return

      case 'view_session':
        // Deep link to specific session
        event.notification.close()
        const sessionUrl = `/sessions/${sessionId || 'latest'}`
        await openAppWithUrl(sessionUrl, notificationData)
        return

      case 'open':
      default:
        // Default action - open app with specified URL or fallback
        event.notification.close()
        const targetUrl = determineTargetUrl(action, notificationData)
        await openAppWithUrl(targetUrl, notificationData)
        return
    }
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error handling notification action:', error)
    // Fallback to opening the app
    event.notification.close()
    await openAppWithUrl('/notifications', notificationData)
  }
}

// Determine the target URL based on action and notification data
function determineTargetUrl(action, notificationData) {
  const { type, url, campaignId, sessionId, templateId } = notificationData

  // Use explicit URL if provided
  if (url) {
    return url
  }

  // Generate deep links based on notification type
  switch (type) {
    case 'session':
      if (sessionId) {
        return `/sessions/${sessionId}`
      }
      return '/sessions'

    case 'admin':
      if (campaignId) {
        return `/admin/campaigns/${campaignId}`
      }
      return '/notifications'

    case 'system':
      return '/settings/notifications'

    default:
      return '/notifications'
  }
}

// Open app with specific URL and handle client management
async function openAppWithUrl(targetUrl, notificationData) {
  try {
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })

    // Check if there's already a window open
    for (const client of clientList) {
      if ('focus' in client) {
        // Focus existing window and navigate
        const focusedClient = await client.focus()

        if ('navigate' in focusedClient) {
          await focusedClient.navigate(targetUrl)
        } else {
          // Send message to client to handle navigation
          focusedClient.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: targetUrl,
            notificationData: notificationData
          })
        }

        return focusedClient
      }
    }

    // No existing window, open a new one
    if (clients.openWindow) {
      return await clients.openWindow(targetUrl)
    }

  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error opening app with URL:', error)
    // Fallback to opening without specific URL
    if (clients.openWindow) {
      return await clients.openWindow('/')
    }
  }
}

// Handle notification snoozing
async function handleNotificationSnooze(notificationData) {
  try {
    const snoozeMinutes = getSnoozeDelay(notificationData.priority)
    const snoozeTime = Date.now() + (snoozeMinutes * 60 * 1000)

    // Store snooze information for later processing
    const snoozeData = {
      ...notificationData,
      snoozedAt: Date.now(),
      snoozeUntil: snoozeTime,
      snoozeMinutes: snoozeMinutes
    }

    // Store in IndexedDB for processing when app opens
    storeNotificationEvent({
      type: 'snoozed',
      ...snoozeData
    })

    // Show confirmation notification
    await self.registration.showNotification('یادآوری تنظیم شد', {
      body: `این پیام ${snoozeMinutes} دقیقه دیگر نمایش داده خواهد شد`,
      icon: '/pwa-192x192.png',
      badge: '/favicon.ico',
      tag: `snooze-confirmation-${Date.now()}`,
      requireInteraction: false,
      silent: true,
      actions: []
    })

    trackNotificationEvent('snoozed', snoozeData)

  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error handling notification snooze:', error)
  }
}

// Get snooze delay based on priority
function getSnoozeDelay(priority) {
  switch (priority) {
    case 'urgent':
      return 5 // 5 minutes
    case 'high':
      return 15 // 15 minutes
    case 'medium':
      return 30 // 30 minutes
    case 'low':
      return 60 // 1 hour
    default:
      return 30 // 30 minutes
  }
}

// Enhanced notification close handling with grouping management
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.tag)

  const notificationData = event.notification.data || {}

  // Track notification dismissal
  trackNotificationEvent('dismissed', {
    ...notificationData,
    dismissedAt: new Date().toISOString(),
    dismissMethod: 'close'
  })

  // Handle group management when notification is closed
  event.waitUntil(handleNotificationGroupManagement(event.notification))
})

// Handle notification grouping and stacking management
async function handleNotificationGroupManagement(closedNotification) {
  try {
    const notificationData = closedNotification.data || {}
    const { type, campaignId, sessionId, groupId } = notificationData

    // Get all current notifications
    const notifications = await self.registration.getNotifications()

    // Update group counts and manage stacking
    await updateNotificationGroups(notifications, closedNotification, type)

    // Clean up old notifications if needed
    await cleanupOldNotifications(notifications)

  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error managing notification groups:', error)
  }
}

// Update notification groups and handle stacking
async function updateNotificationGroups(currentNotifications, closedNotification, type) {
  const groupCounts = {}
  const groupedNotifications = {}

  // Count notifications by type and group
  currentNotifications.forEach(notification => {
    const data = notification.data || {}
    const groupKey = getNotificationGroupKey(data)

    if (!groupCounts[groupKey]) {
      groupCounts[groupKey] = 0
      groupedNotifications[groupKey] = []
    }

    groupCounts[groupKey]++
    groupedNotifications[groupKey].push(notification)
  })

  // Update group summary notifications
  for (const [groupKey, notifications] of Object.entries(groupedNotifications)) {
    if (notifications.length > 1) {
      await createOrUpdateGroupSummary(groupKey, notifications)
    }
  }
}

// Get notification group key for grouping similar notifications
function getNotificationGroupKey(notificationData) {
  const { type, campaignId, sessionId } = notificationData

  if (campaignId) {
    return `campaign-${campaignId}`
  } else if (sessionId) {
    return `session-${sessionId}`
  } else {
    return `type-${type}`
  }
}

// Create or update group summary notification
async function createOrUpdateGroupSummary(groupKey, notifications) {
  try {
    const groupType = groupKey.split('-')[0]
    const groupId = groupKey.split('-')[1]
    const count = notifications.length

    // Close individual notifications in the group
    notifications.forEach(notification => {
      if (!notification.tag.includes('group-summary')) {
        notification.close()
      }
    })

    // Create group summary notification
    const summaryOptions = createGroupSummaryOptions(groupType, groupId, count, notifications)
    const summaryTitle = createGroupSummaryTitle(groupType, count)

    await self.registration.showNotification(summaryTitle, summaryOptions)

  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error creating group summary:', error)
  }
}

// Create group summary notification options
function createGroupSummaryOptions(groupType, groupId, count, notifications) {
  const latestNotification = notifications[notifications.length - 1]
  const latestData = latestNotification.data || {}

  return {
    body: createGroupSummaryBody(groupType, count, notifications),
    icon: getNotificationIcon(groupType, 'medium'),
    badge: '/favicon.ico',
    tag: `group-summary-${groupType}-${groupId}`,
    data: {
      ...latestData,
      isGroupSummary: true,
      groupType: groupType,
      groupId: groupId,
      groupCount: count,
      groupNotifications: notifications.map(n => n.data)
    },
    requireInteraction: false,
    vibrate: [100],
    actions: [
      {
        action: 'view_all',
        title: 'مشاهده همه',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'dismiss_all',
        title: 'رد کردن همه'
      }
    ]
  }
}

// Create group summary title
function createGroupSummaryTitle(groupType, count) {
  switch (groupType) {
    case 'campaign':
      return `${count} پیام جدید`
    case 'session':
      return `${count} یادآوری جلسه`
    case 'type':
      return `${count} اعلان جدید`
    default:
      return `${count} پیام جدید`
  }
}

// Create group summary body text
function createGroupSummaryBody(groupType, count, notifications) {
  const latestNotification = notifications[notifications.length - 1]

  switch (groupType) {
    case 'campaign':
      return `شما ${count} پیام جدید از مدیریت دارید. آخرین پیام: ${latestNotification.body}`
    case 'session':
      return `شما ${count} یادآوری جلسه دارید. برای مشاهده جزئیات کلیک کنید.`
    case 'type':
      return `شما ${count} اعلان جدید دارید. آخرین اعلان: ${latestNotification.body}`
    default:
      return `شما ${count} پیام جدید دارید.`
  }
}

// Clean up old notifications to prevent clutter
async function cleanupOldNotifications(notifications) {
  const maxNotifications = 10
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  const now = Date.now()

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = notifications
    .filter(n => n.data && n.data.timestamp)
    .sort((a, b) => (b.data.timestamp || 0) - (a.data.timestamp || 0))

  // Close notifications that are too old or exceed max count
  for (let i = 0; i < sortedNotifications.length; i++) {
    const notification = sortedNotifications[i]
    const age = now - (notification.data.timestamp || 0)

    // Close if too old or beyond max count (but keep group summaries)
    if ((age > maxAge || i >= maxNotifications) && !notification.data.isGroupSummary) {
      notification.close()

      // Track cleanup
      trackNotificationEvent('cleaned_up', {
        ...notification.data,
        cleanupReason: age > maxAge ? 'too_old' : 'max_count_exceeded',
        cleanedAt: new Date().toISOString()
      })
    }
  }
}

// Enhanced notification interaction tracking
self.addEventListener('notificationclick', (event) => {
  const notificationData = event.notification.data || {}

  // Handle group summary clicks differently
  if (notificationData.isGroupSummary) {
    event.waitUntil(handleGroupSummaryClick(event, notificationData))
  } else {
    // Use existing click handler for individual notifications
    console.log('[firebase-messaging-sw.js] Notification click received. Action:', event.action)

    trackNotificationEvent('clicked', {
      ...notificationData,
      action: event.action || 'body_click',
      clickedAt: new Date().toISOString()
    })

    event.waitUntil(handleNotificationAction(event, event.action, notificationData))
  }
})

// Handle group summary notification clicks
async function handleGroupSummaryClick(event, notificationData) {
  const { action, groupType, groupId, groupCount } = notificationData

  try {
    switch (action) {
      case 'dismiss_all':
        // Close all notifications in the group
        event.notification.close()
        const notifications = await self.registration.getNotifications()
        notifications.forEach(n => {
          const data = n.data || {}
          if (getNotificationGroupKey(data) === `${groupType}-${groupId}`) {
            n.close()
          }
        })

        trackNotificationEvent('group_dismissed', {
          ...notificationData,
          dismissedAt: new Date().toISOString()
        })
        break

      case 'view_all':
      default:
        // Open app to show all notifications in the group
        event.notification.close()
        const targetUrl = getGroupTargetUrl(groupType, groupId)
        await openAppWithUrl(targetUrl, notificationData)

        trackNotificationEvent('group_clicked', {
          ...notificationData,
          clickedAt: new Date().toISOString()
        })
        break
    }
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error handling group summary click:', error)
  }
}

// Get target URL for group notifications
function getGroupTargetUrl(groupType, groupId) {
  switch (groupType) {
    case 'campaign':
      return `/admin/campaigns/${groupId}`
    case 'session':
      return `/sessions`
    case 'type':
      return `/notifications`
    default:
      return '/notifications'
  }
}

// Install event
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing.')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating.')
  event.waitUntil(clients.claim())
})
