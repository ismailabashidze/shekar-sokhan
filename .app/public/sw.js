// Workbox manifest placeholder - required for injectManifest strategy
// DO NOT REMOVE THIS LINE - WORKBOX WILL REPLACE IT WITH THE MANIFEST
const PRECACHE_MANIFEST = self.__WB_MANIFEST || []

const CACHE_VERSION = 'v3.4.0' // این ورژن باید با package.json همخوانی داشته باشد
const STATIC_CACHE = `zehna-static-${CACHE_VERSION}`
const IMAGES_CACHE = `zehna-images-${CACHE_VERSION}`
const ICONS_CACHE = `zehna-icons-${CACHE_VERSION}`
const RUNTIME_CACHE = `zehna-runtime-${CACHE_VERSION}`

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/img/logo.svg',
  '/img/logo-no-bg.png',
  '/img/favicon.png',
  '/img/avatars/1.png'
]

// Icon patterns to cache aggressively
const ICON_PATTERNS = [
  /\/img\/icons\//,
  /\/img\/avatars\//,
  /\/img\/logos\//,
  /\.svg$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.webp$/
]

// Install event - Precache critical assets
self.addEventListener('install', event => {
  console.log('[SW] Installing version:', CACHE_VERSION)
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching critical assets')
        return cache.addAll(CRITICAL_ASSETS.map(url => new Request(url, { cache: 'no-cache' })))
      }),
      // Initialize other caches
      caches.open(IMAGES_CACHE),
      caches.open(ICONS_CACHE),
      caches.open(RUNTIME_CACHE)
    ]).then(() => {
      console.log('[SW] Installation complete')
      return self.skipWaiting()
    }).catch(error => {
      console.error('[SW] Installation failed:', error)
    })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating version:', CACHE_VERSION)
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old version caches
          if (cacheName.startsWith('zehna-') && 
              !cacheName.includes(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Activation complete')
      return self.clients.claim()
    })
  )
})

// Message handler for manual cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    console.log('[SW] Clearing all caches manually')
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[SW] Deleting cache:', cacheName)
            return caches.delete(cacheName)
          })
        )
      }).then(() => {
        console.log('[SW] All caches cleared')
        event.ports[0].postMessage({ success: true })
      }).catch(error => {
        console.error('[SW] Failed to clear caches:', error)
        event.ports[0].postMessage({ success: false, error: error.message })
      })
    )
  }
})

// Fetch event - Advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip navigation requests (allow redirects)
  if (request.mode === 'navigate') return
  
  // Skip external requests
  if (url.origin !== location.origin) return
  
  // Skip API requests - Always fetch from network for fresh data
  if (isApiRequest(request)) {
    // console.log('[SW] Skipping API request for fresh data:', request.url)
    return
  }
  
  // Route to appropriate caching strategy
  if (isIconRequest(request)) {
    event.respondWith(handleIconRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else {
    event.respondWith(handleRuntimeRequest(request))
  }
})

// Icon caching strategy - Cache First with long expiration
async function handleIconRequest(request) {
  const cache = await caches.open(ICONS_CACHE)
  const cached = await cache.match(request)
  
  if (cached) {
    // console.log('[SW] Icon served from cache:', request.url)
    return cached
  }
  
  try {
    // console.log('[SW] Fetching and caching icon:', request.url)
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache successful responses
      const responseClone = response.clone()
      await cache.put(request, responseClone)
      
      // Manage cache size for icons
      await manageCacheSize(ICONS_CACHE, 200) // Keep max 200 icons
    }
    
    return response
  } catch (error) {
    console.log('[SW] Icon fetch failed, trying fallback:', error)
    
    // Try to serve a fallback icon
    const fallbackIcon = await cache.match('/img/avatars/1.png')
    return fallbackIcon || new Response('', { status: 404 })
  }
}

// Image caching strategy - Stale While Revalidate
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE)
  const cached = await cache.match(request)
  
  // Serve from cache immediately if available
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseClone = response.clone()
      cache.put(request, responseClone)
      manageCacheSize(IMAGES_CACHE, 300) // Keep max 300 images
    }
    return response
  }).catch(() => cached) // Fallback to cache on network failure
  
  if (cached) {
    // console.log('[SW] Image served from cache:', request.url)
    return cached
  }
  
  return fetchPromise
}

// Static asset caching - Cache First
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('', { status: 404 })
  }
}

// Runtime request handling - Network First
async function handleRuntimeRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
      manageCacheSize(RUNTIME_CACHE, 100) // Keep max 100 runtime entries
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached || new Response('', { status: 504 })
  }
}

// Helper functions
function isApiRequest(request) {
  const url = new URL(request.url)
  // Skip all API, auth, and dynamic data requests
  return (
    url.pathname.includes('/api/') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/pb/') ||
    url.pathname.includes('/_nuxt/') ||
    url.searchParams.has('_data') ||
    request.url.includes('localhost:8090') || // PocketBase default port
    request.headers.get('content-type')?.includes('application/json') ||
    request.headers.get('accept')?.includes('application/json')
  )
}

function isIconRequest(request) {
  return ICON_PATTERNS.some(pattern => pattern.test(request.url)) ||
         request.url.includes('/img/icons/') ||
         request.url.includes('/img/avatars/') ||
         request.url.includes('/img/logos/')
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(request.url)
}

function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.url.includes('/manifest.json') ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(request.url)
}

// Cache size management
async function manageCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > maxEntries) {
    // Remove oldest entries (simple FIFO approach)
    const entriesToDelete = keys.slice(0, keys.length - maxEntries)
    await Promise.all(entriesToDelete.map(key => cache.delete(key)))
    // console.log(`[SW] Cleaned ${entriesToDelete.length} entries from ${cacheName}`)
  }
}

// Cache statistics
async function getCacheStats() {
  const cacheNames = await caches.keys()
  const stats = {}
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith('zehna-')) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      stats[cacheName] = keys.length
    }
  }
  
  return stats
}

// Push notification event - Enhanced for better reliability
self.addEventListener('push', event => {
  console.log('[SW] Push event received:', event)

  if (!event.data) {
    console.log('[SW] No data in push event, showing default notification')
    event.waitUntil(
      self.registration.showNotification('اعلان جدید', {
        body: 'پیام جدیدی دریافت کردید',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'default-zehna-notification',
        requireInteraction: true,
        dir: 'rtl',
        lang: 'fa'
      })
    )
    return
  }

  let data
  try {
    data = event.data.json()
    console.log('[SW] Push notification data:', data)
  } catch (e) {
    console.log('[SW] Failed to parse push data as JSON, using text')
    data = {
      title: 'اعلان جدید',
      message: event.data.text() || 'پیام جدیدی دریافت کردید',
      type: 'info'
    }
  }

  // Ensure we have minimum required data
  const title = data.title || 'اعلان جدید'
  const body = data.message || data.body || 'پیام جدیدی دریافت کردید'
  
  const options = {
    body: body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    image: data.image,
    tag: data.tag || `zehna-notification-${Date.now()}`,
    data: {
      url: data.url || data.action_url || '/notifications',
      notificationId: data.id || `notification-${Date.now()}`,
      type: data.type || 'info',
      timestamp: Date.now()
    },
    actions: data.actions || (data.action_text ? [{
      action: 'open',
      title: data.action_text || 'مشاهده',
      icon: '/pwa-192x192.png'
    }] : []),
    requireInteraction: data.priority === 'urgent' || data.priority === 'high',
    silent: false,
    vibrate: data.priority === 'urgent' ? [200, 100, 200, 100, 200] : [200, 100, 200],
    timestamp: Date.now(),
    dir: 'rtl',
    lang: 'fa',
    renotify: true // Force re-notification even if same tag
  }

  console.log('[SW] Showing notification with options:', options)

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[SW] Notification shown successfully')
      })
      .catch(error => {
        console.error('[SW] Failed to show notification:', error)
      })
  )
})

// Notification click event - Enhanced for better navigation
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.notification.tag)
  
  const notification = event.notification
  const action = event.action
  const data = notification.data || {}

  // Close the notification
  notification.close()

  // Handle different actions
  if (action === 'open' || !action) {
    const urlToOpen = data.url || '/notifications'
    console.log('[SW] Opening URL:', urlToOpen)
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        console.log('[SW] Found', clientList.length, 'client windows')
        
        // Look for an existing window to focus
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            console.log('[SW] Focusing existing window and navigating to:', urlToOpen)
            return client.focus().then(() => {
              // Navigate to the notification URL if different from current
              if (urlToOpen !== '/' && client.url !== urlToOpen) {
                return client.navigate(urlToOpen)
              }
              return client
            })
          }
        }
        
        // No existing window found, open new one
        console.log('[SW] Opening new window:', urlToOpen)
        return clients.openWindow(urlToOpen)
      }).then(client => {
        // Send message to the client about the notification click
        if (client && data.notificationId) {
          console.log('[SW] Sending notification click message to client')
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            notificationId: data.notificationId,
            timestamp: data.timestamp,
            url: data.url
          })
        }
      }).catch(error => {
        console.error('[SW] Error handling notification click:', error)
      })
    )
  }
})

// Background sync for offline handling
self.addEventListener('sync', event => {
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications())
  } else if (event.tag === 'cache-assets') {
    event.waitUntil(precacheAssets())
  }
})

// Message event for communication with main thread
self.addEventListener('message', event => {
  const { type, data } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION })
      break
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        Promise.all([
          caches.delete(STATIC_CACHE),
          caches.delete(IMAGES_CACHE),
          caches.delete(ICONS_CACHE),
          caches.delete(RUNTIME_CACHE)
        ]).then(() => {
          event.ports[0].postMessage({ success: true })
        })
      )
      break
      
    case 'GET_CACHE_STATS':
      event.waitUntil(
        getCacheStats().then(stats => {
          event.ports[0].postMessage({ stats })
        })
      )
      break
      
    case 'PRECACHE_ASSETS':
      event.waitUntil(
        precacheAssets().then(() => {
          event.ports[0].postMessage({ success: true })
        })
      )
      break
  }
})

// Helper functions
async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      // console.log('[SW] Notifications synced successfully')
    }
  } catch (error) {
    // console.log('[SW] Failed to sync notifications:', error)
  }
}

async function precacheAssets() {
  try {
    const cache = await caches.open(ICONS_CACHE)
    
    // Precache commonly used icons and avatars
    const commonAssets = [
      '/img/avatars/1.svg',
      '/img/avatars/2.svg',
      '/img/avatars/3.svg',
      '/img/avatars/4.svg',
      '/img/avatars/5.svg',
      '/img/avatars/1.png'
    ]
    
    await Promise.all(
      commonAssets.map(async (url) => {
        try {
          const response = await fetch(url)
          if (response.ok) {
            await cache.put(url, response)
          }
        } catch (error) {
          console.log(`[SW] Failed to precache ${url}:`, error)
        }
      })
    )
    
    // console.log('[SW] Asset precaching complete')
  } catch (error) {
    console.log('[SW] Asset precaching failed:', error)
  }
}

// Standard PWA Service Worker Events
// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing.')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating.')
  event.waitUntil(clients.claim())
})

// Create enhanced notification options based on type and priority
function createNotificationOptions(payload, type = 'default', priority = 'medium') {
  const baseOptions = {
    body: payload.body || '',
    icon: getNotificationIcon(type, priority),
    badge: '/pwa-192x192.png',
    tag: getNotificationTag(payload, type),
    data: payload.data || {},
    timestamp: Date.now(),
    silent: false
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
      if (payload.data?.actionUrl || payload.data?.link) {
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
    console.error('[SW] Error tracking notification event:', error)
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
  console.log('[SW] Notification click received. Action:', event.action)

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
    console.error('[SW] Error handling notification action:', error)
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
    console.error('[SW] Error opening app with URL:', error)
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
    console.error('[SW] Error handling notification snooze:', error)
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
  console.log('[SW] Notification closed:', event.notification.tag)

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
    console.error('[SW] Error managing notification groups:', error)
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
    console.error('[SW] Error creating group summary:', error)
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
    console.log('[SW] Notification click received. Action:', event.action)

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
    console.error('[SW] Error handling group summary click:', error)
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
  console.log('[SW] Service Worker installing.')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating.')
  event.waitUntil(clients.claim())
})
