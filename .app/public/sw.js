const CACHE_NAME = 'zehna-pwa-v1'
const urlsToCache = [
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  // Skip navigation requests to allow redirects to work properly
  if (event.request.mode === 'navigate') {
    return
  }
  
  // Only cache static assets, not HTML pages
  if (event.request.destination === 'image' || 
      event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.url.includes('/manifest.json')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
        })
    )
  }
})

// Push notification event
self.addEventListener('push', event => {
  if (!event.data) {
    return
  }

  let data
  try {
    data = event.data.json()
  } catch (e) {
    data = {
      title: 'اعلان جدید',
      message: event.data.text() || 'پیام جدیدی دریافت کردید',
      type: 'info'
    }
  }

  const options = {
    body: data.message || data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    image: data.image,
    tag: data.tag || 'zehna-notification',
    data: {
      url: data.url || data.action_url || '/',
      notificationId: data.id,
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
    lang: 'fa'
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'اعلان جدید', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', event => {
  const notification = event.notification
  const action = event.action
  const data = notification.data

  notification.close()

  if (action === 'open' || !action) {
    // Open the app or navigate to specific URL
    const urlToOpen = data.url || '/'
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            // Focus existing window and navigate if needed
            return client.focus().then(() => {
              if (data.url && client.url !== data.url) {
                return client.navigate(data.url)
              }
            })
          }
        }
        
        // Open new window
        return clients.openWindow(urlToOpen)
      }).then(client => {
        // Mark notification as read if we have the notification ID
        if (data.notificationId && client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            notificationId: data.notificationId,
            timestamp: data.timestamp
          })
        }
      })
    )
  }
})

// Background sync for offline notification handling
self.addEventListener('sync', event => {
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Sync notifications when back online
      syncNotifications()
    )
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
      event.ports[0].postMessage({ version: CACHE_NAME })
      break
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.delete(CACHE_NAME).then(() => {
          event.ports[0].postMessage({ success: true })
        })
      )
      break
  }
})

// Helper function to sync notifications
async function syncNotifications() {
  try {
    // This would sync with your backend when back online
    // Implementation depends on your notification API
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      console.log('Notifications synced successfully')
    }
  } catch (error) {
    console.log('Failed to sync notifications:', error)
  }
}