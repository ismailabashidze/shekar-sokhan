// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Firebase configuration - these will be replaced with actual values during deployment
const firebaseConfig = {
  apiKey: "AIzaSyExample", // Replace with actual Firebase API key
  authDomain: "your-project.firebaseapp.com", // Replace with actual auth domain
  projectId: "your-project-id", // Replace with actual project ID
  storageBucket: "your-project-id.appspot.com", // Replace with actual storage bucket
  messagingSenderId: "123456789", // Replace with actual sender ID
  appId: "1:123456789:web:abcdef" // Replace with actual app ID
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/icon-72x72.png',
    data: payload.data
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag)
  event.notification.close()

  // Handle the click action
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})