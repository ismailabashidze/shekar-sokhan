import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import type { Messaging } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyBixyIOgzx6awRFV2hnE0-EptBgbb1bz4Q',
    authDomain: 'zehna-notifications.firebaseapp.com',
    projectId: 'zehna-notifications',
    storageBucket: 'zehna-notifications.firebasestorage.app',
    messagingSenderId: '838017469547',
    appId: '1:838017469547:web:b4eefcc72df3405cbfb52e',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  // Initialize Firebase Cloud Messaging
  let messaging: Messaging | null = null

  try {
    messaging = getMessaging(app)
    console.log('✅ Firebase Messaging initialized')
  } catch (error) {
    console.error('❌ Error initializing Firebase Messaging:', error)
  }

  return {
    provide: {
      firebase: app,
      messaging,
    },
  }
})
