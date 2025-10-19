import { deleteToken, getToken, onMessage, type Messaging } from 'firebase/messaging'

interface UsePushNotificationsResult {
  ensureServiceWorker(): Promise<ServiceWorkerRegistration | null>
  requestPermission(): Promise<boolean>
  getBrowserToken(): Promise<string | null>
  deleteBrowserToken(): Promise<void>
  listenForegroundMessages(handler: (payload: any) => void): void
}

export function usePushNotifications(): UsePushNotificationsResult {
  const { $pb, $messaging } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()

  const messaging = computed(() => {
    if (!process.client) {
      return null
    }

    return ($messaging as Messaging | undefined) || null
  })

  const vapidKey = runtimeConfig.public.firebaseVapidKey

  const ensureServiceWorker = async () => {
    if (!process.client || !('serviceWorker' in navigator)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      })

      return registration
    }
    catch (error) {
      console.warn('Failed to register notification service worker', error)
      return null
    }
  }

  const requestPermission = async () => {
    if (!process.client || !messaging.value) {
      return false
    }

    if (typeof Notification === 'undefined') {
      return false
    }

    const permission = await Notification.requestPermission()

    return permission === 'granted'
  }

  const getBrowserToken = async () => {
    if (!process.client || !messaging.value) {
      return null
    }

    if (!vapidKey) {
      console.warn('Missing VAPID key. Push notifications disabled.')
      return null
    }

    try {
      const token = await navigator.serviceWorker.ready.then((registration) => {
        return getToken(messaging.value!, {
          vapidKey,
          serviceWorkerRegistration: registration,
        })
      })

      if (!token) {
        return null
      }

      const userId = $pb.authStore.model?.id
      if (!userId) {
        return token
      }

      await $pb.collection('users').update(userId, {
        fcm_token: token,
        fcm_token_updated_at: new Date().toISOString(),
      })

      return token
    }
    catch (error) {
      console.warn('Failed to obtain push token', error)
      return null
    }
  }

  const deleteBrowserToken = async () => {
    if (!process.client || !messaging.value) {
      return
    }

    const userId = $pb.authStore.model?.id

    try {
      await deleteToken(messaging.value)

      if (!userId) {
        return
      }

      await $pb.collection('users').update(userId, {
        fcm_token: null,
        fcm_token_updated_at: null,
      })
    }
    catch (error) {
      console.warn('Failed to revoke push token', error)
    }
  }

  const listenForegroundMessages = (handler: (payload: any) => void) => {
    if (!process.client || !messaging.value) {
      return
    }

    onMessage(messaging.value, (payload) => {
      handler(payload)
    })
  }

  return {
    ensureServiceWorker,
    requestPermission,
    getBrowserToken,
    deleteBrowserToken,
    listenForegroundMessages,
  }
}
