import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Only initialize if config is provided
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase configuration is missing. Notifications will use fallback mode.')
    return {
      provide: {
        firebase: null,
        messaging: null,
      },
    }
  }

  try {
    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    console.log('Firebase initialized successfully')

    return {
      provide: {
        firebase: app,
        messaging,
      },
    }
  }
  catch (error) {
    console.error('Error initializing Firebase:', error)
    return {
      provide: {
        firebase: null,
        messaging: null,
      },
    }
  }
})
