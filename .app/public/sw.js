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