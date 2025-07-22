import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  if (process.server) return

  const firebaseConfig = {
    apiKey: useRuntimeConfig().public.firebaseApiKey,
    authDomain: useRuntimeConfig().public.firebaseAuthDomain,
    projectId: useRuntimeConfig().public.firebaseProjectId,
    storageBucket: useRuntimeConfig().public.firebaseStorageBucket,
    messagingSenderId: useRuntimeConfig().public.firebaseMessagingSenderId,
    appId: useRuntimeConfig().public.firebaseAppId,
    measurementId: useRuntimeConfig().public.firebaseMeasurementId
  }

  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  return {
    provide: {
      firebase: app,
      messaging: messaging
    }
  }
})