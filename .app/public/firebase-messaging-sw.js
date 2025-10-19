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

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload)

  const notificationTitle = payload.notification?.title || payload.data?.title || 'ذهنا'
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || '',
    icon: payload.notification?.icon || payload.data?.icon || '/pwa-192x192.png',
    badge: '/favicon.ico',
    tag: payload.data?.notificationId || `notification-${Date.now()}`,
    data: {
      url: payload.data?.actionUrl || payload.fcmOptions?.link || '/notifications',
      notificationId: payload.data?.notificationId,
      type: payload.data?.type || 'info',
      priority: payload.data?.priority || 'medium',
      ...payload.data
    },
    requireInteraction: payload.data?.priority === 'high' || payload.data?.priority === 'urgent',
    vibrate: [200, 100, 200],
    actions: []
  }

  // Add action buttons if URL is provided
  if (payload.data?.actionUrl || payload.fcmOptions?.link) {
    notificationOptions.actions.push(
      {
        action: 'open',
        title: payload.data?.actionText || 'مشاهده',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'close',
        title: 'بستن',
      }
    )
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.')

  event.notification.close()

  // Get the URL to open
  let urlToOpen = '/notifications'

  if (event.action === 'close') {
    // User clicked close, just close the notification
    return
  }

  // Get URL from notification data
  if (event.notification.data?.url) {
    urlToOpen = event.notification.data.url
  } else if (event.notification.data?.actionUrl) {
    urlToOpen = event.notification.data.actionUrl
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          // If a window is already open, focus it and navigate
          if ('focus' in client) {
            return client.focus().then(client => {
              if ('navigate' in client) {
                return client.navigate(urlToOpen)
              }
            })
          }
        }

        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.tag)
})

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
