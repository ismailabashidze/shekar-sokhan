import { getToken, onMessage, deleteToken as deleteFirebaseToken } from 'firebase/messaging'
import type { Ref } from 'vue'

export function useFirebaseNotifications() {
  const { $messaging, $pb } = useNuxtApp()
  const config = useRuntimeConfig()

  const fcmToken = ref<string | null>(null)
  const isSupported = ref(false)
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Check if Firebase Messaging is supported
  const checkSupport = async () => {
    if (!process.client) return false

    try {
      // Check if service worker and notifications are supported
      isSupported.value = 'serviceWorker' in navigator &&
                         'Notification' in window &&
                         'PushManager' in window &&
                         !!$messaging

      return isSupported.value
    }
    catch (err) {
      console.error('Error checking FCM support:', err)
      return false
    }
  }

  // Save FCM token to PocketBase for this user
  const saveFCMTokenToBackend = async (token: string) => {
    try {
      const userId = $pb.authStore.model?.id
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Update user record with FCM token
      await $pb.collection('users').update(userId, {
        fcm_token: token,
        fcm_token_updated_at: new Date().toISOString(),
      })

      console.log('✅ FCM token saved to backend')
    }
    catch (err) {
      console.error('❌ Error saving FCM token:', err)
      throw err
    }
  }

  // Request notification permission and get FCM token
  const requestPermission = async (): Promise<string | null> => {
    if (!isSupported.value || !$messaging) {
      error.value = 'Firebase Messaging not supported'
      console.warn('⚠️ Firebase Messaging not supported')
      return null
    }

    try {
      isLoading.value = true
      error.value = null

      // Request notification permission
      const permission = await Notification.requestPermission()

      if (permission !== 'granted') {
        error.value = 'Notification permission denied'
        console.warn('⚠️ Notification permission denied')
        return null
      }

      console.log('✅ Notification permission granted')

      // Get FCM token
      const token = await getToken($messaging, {
        vapidKey: config.public.firebaseVapidKey,
      })

      if (token) {
        fcmToken.value = token
        console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...')

        // Save token to PocketBase
        await saveFCMTokenToBackend(token)

        return token
      }
      else {
        error.value = 'Failed to get FCM token'
        console.error('❌ Failed to get FCM token')
        return null
      }
    }
    catch (err: any) {
      console.error('❌ Error getting FCM token:', err)
      error.value = err.message
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  // Listen for foreground messages (when app is open)
  const setupForegroundListener = () => {
    if (!$messaging) {
      console.warn('⚠️ Messaging not available for foreground listener')
      return
    }

    try {
      onMessage($messaging, (payload) => {
        console.log('📨 Foreground message received:', payload)

        // Show local notification even when app is open
        if (Notification.permission === 'granted') {
          const notification = new Notification(
            payload.notification?.title || payload.data?.title || 'ذهنا',
            {
              body: payload.notification?.body || payload.data?.message || '',
              icon: payload.notification?.icon || payload.data?.icon || '/pwa-192x192.png',
              tag: payload.data?.notificationId || `notification-${Date.now()}`,
              data: payload.data,
              badge: '/favicon.ico',
              requireInteraction: payload.data?.priority === 'high' || payload.data?.priority === 'urgent',
            },
          )

          notification.onclick = () => {
            window.focus()
            const url = payload.data?.actionUrl || payload.fcmOptions?.link || '/notifications'
            navigateTo(url)
            notification.close()
          }
        }

        // Refresh notifications list to show new notification
        const { fetchNotifications } = useNotifications()
        fetchNotifications()
      })

      console.log('✅ Foreground message listener setup')
    }
    catch (err) {
      console.error('❌ Error setting up foreground listener:', err)
    }
  }

  // Register service worker for background notifications
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Workers not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/' },
      )

      console.log('✅ Service Worker registered:', registration.scope)
      return registration
    }
    catch (err) {
      console.error('❌ Service Worker registration failed:', err)
      return null
    }
  }

  // Initialize Firebase Messaging
  const initialize = async () => {
    if (isInitialized.value || !process.client) {
      console.log('⏭️ Firebase Messaging already initialized or not in client')
      return
    }

    try {
      console.log('🔄 Initializing Firebase Messaging...')

      const supported = await checkSupport()
      if (!supported) {
        error.value = 'Browser does not support push notifications'
        console.warn('⚠️ Browser does not support push notifications')
        return
      }

      // Register service worker
      await registerServiceWorker()

      // Setup foreground message listener
      setupForegroundListener()

      isInitialized.value = true
      console.log('✅ Firebase Messaging initialized successfully')
    }
    catch (err: any) {
      console.error('❌ Error initializing Firebase Messaging:', err)
      error.value = err.message
    }
  }

  // Refresh FCM token (call this on app startup if user is logged in)
  const refreshToken = async () => {
    if (!$pb.authStore.isValid) {
      console.warn('⚠️ User not authenticated, cannot refresh FCM token')
      return null
    }

    try {
      console.log('🔄 Refreshing FCM token...')
      const token = await requestPermission()
      return token
    }
    catch (err) {
      console.error('❌ Error refreshing FCM token:', err)
      return null
    }
  }

  // Delete FCM token (call on logout)
  const deleteFCMToken = async () => {
    try {
      const userId = $pb.authStore.model?.id
      if (!userId) {
        console.warn('⚠️ No user ID found for token deletion')
        return
      }

      // Delete token from Firebase
      if ($messaging && fcmToken.value) {
        try {
          await deleteFirebaseToken($messaging)
          console.log('✅ FCM token deleted from Firebase')
        }
        catch (err) {
          console.warn('⚠️ Error deleting FCM token from Firebase:', err)
        }
      }

      // Remove FCM token from user record
      await $pb.collection('users').update(userId, {
        fcm_token: null,
        fcm_token_updated_at: null,
      })

      fcmToken.value = null
      console.log('✅ FCM token deleted from backend')
    }
    catch (err) {
      console.error('❌ Error deleting FCM token:', err)
    }
  }

  // Auto-request permission (with tracking to avoid spam)
  const autoRequestPermission = async (): Promise<boolean> => {
    // Check if we've already asked
    const hasAsked = localStorage.getItem('fcm-permission-requested')
    if (hasAsked === 'true') {
      console.log('⏭️ FCM permission already requested before')
      return false
    }

    // Check if already granted
    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted')
      await refreshToken()
      return true
    }

    // Check if denied
    if (Notification.permission === 'denied') {
      console.log('⛔ Notification permission denied')
      localStorage.setItem('fcm-permission-requested', 'true')
      return false
    }

    // Mark as requested
    localStorage.setItem('fcm-permission-requested', 'true')

    // Request permission
    const token = await requestPermission()
    return !!token
  }

  return {
    // State
    fcmToken,
    isSupported,
    isInitialized,
    isLoading,
    error,

    // Methods
    initialize,
    requestPermission,
    refreshToken,
    deleteFCMToken,
    autoRequestPermission,
    setupForegroundListener,
    checkSupport,
  }
}
