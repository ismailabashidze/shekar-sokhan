const CACHE_VERSION = 'v3.0.0' // این ورژن باید با package.json همخوانی داشته باشد
const STATIC_CACHE = `zehna-static-${CACHE_VERSION}`
const IMAGES_CACHE = `zehna-images-${CACHE_VERSION}`
const ICONS_CACHE = `zehna-icons-${CACHE_VERSION}`
const RUNTIME_CACHE = `zehna-runtime-${CACHE_VERSION}`

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/img/logo.png',
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