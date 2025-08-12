export interface PwaNotificationOptions {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  icon?: string
  image?: string
  url?: string
  actionText?: string
  tag?: string
  silent?: boolean
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export function usePwaNotifications() {
  const { $pb } = useNuxtApp()

  // State
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const subscription = ref<PushSubscription | null>(null)
  const isSubscribed = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Check PWA notification support
  const checkSupport = () => {
    if (process.client) {
      isSupported.value = 'serviceWorker' in navigator
      && 'PushManager' in window
      && 'Notification' in window
      permission.value = Notification.permission

      // Listen for permission changes
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
          permission.value = permissionStatus.state as NotificationPermission
          permissionStatus.onchange = () => {
            permission.value = permissionStatus.state as NotificationPermission
          }
        }).catch(() => {
          // Fallback to polling for permission changes
          const checkPermissionChange = () => {
            if (permission.value !== Notification.permission) {
              permission.value = Notification.permission
            }
          }
          setInterval(checkPermissionChange, 1000)
        })
      }
    }
  }

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      error.value = 'مرورگر شما از اعلان‌های PWA پشتیبانی نمی‌کند'
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result

      if (result === 'granted') {
        await subscribeToPush()
        return true
      }
      else if (result === 'denied') {
        error.value = 'دسترسی به اعلان‌ها رد شد. می‌توانید از تنظیمات مرورگر آن را فعال کنید.'
      }

      return false
    }
    catch (err: any) {
      error.value = err.message || 'خطا در درخواست مجوز اعلان‌ها'
      return false
    }
  }

  // Subscribe to push notifications
  const subscribeToPush = async (): Promise<boolean> => {
    if (!isSupported.value || permission.value !== 'granted') {
      return false
    }

    try {
      isLoading.value = true
      error.value = null

      const registration = await navigator.serviceWorker.ready

      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        subscription.value = existingSubscription
        isSubscribed.value = true
        await saveSubscriptionToBackend(existingSubscription)
        return true
      }

      // Create new subscription
      const vapidPublicKey = await getVapidPublicKey()
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      subscription.value = newSubscription
      isSubscribed.value = true

      await saveSubscriptionToBackend(newSubscription)
      return true
    }
    catch (err: any) {
      console.error('Error subscribing to push notifications:', err)
      error.value = err.message || 'خطا در فعال‌سازی اعلان‌های فوری'
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async (): Promise<boolean> => {
    try {
      if (subscription.value) {
        await subscription.value.unsubscribe()
        await removeSubscriptionFromBackend()

        subscription.value = null
        isSubscribed.value = false
        return true
      }
      return false
    }
    catch (err: any) {
      error.value = err.message || 'خطا در لغو اشتراک اعلان‌ها'
      return false
    }
  }

  // Show local notification
  const showLocalNotification = async (options: PwaNotificationOptions): Promise<boolean> => {
    if (!isSupported.value || permission.value !== 'granted') {
      
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      console.log('Service worker ready, showing notification:', options.title)

      await registration.showNotification(options.title, {
        body: options.message,
        icon: options.icon || '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        image: options.image,
        tag: options.tag || `local-${Date.now()}`,
        data: {
          url: options.url || '/notifications',
          type: options.type || 'info',
          timestamp: Date.now(),
          notificationId: options.tag || `local-${Date.now()}`,
        },
        actions: options.actionText
          ? [{
              action: 'open',
              title: options.actionText,
              icon: '/pwa-192x192.png',
            }]
          : [],
        requireInteraction: options.priority === 'urgent' || options.priority === 'high',
        silent: options.silent || false,
        vibrate: getVibrationPattern(options.priority),
        dir: 'rtl',
        lang: 'fa',
        renotify: true, // Always show notification even if tag exists
        timestamp: Date.now(),
      })

      
      return true
    }
    catch (err: any) {
      
      error.value = err.message || 'خطا در نمایش اعلان محلی'
      return false
    }
  }

  // Helper function for vibration patterns
  const getVibrationPattern = (priority?: string): number[] => {
    switch (priority) {
      case 'urgent':
        return [200, 100, 200, 100, 200, 100, 200]
      case 'high':
        return [300, 100, 300]
      case 'medium':
        return [200, 100, 200]
      default:
        return [100]
    }
  }

  // Send push notification via backend
  const sendPushNotification = async (
    recipientIds: string[],
    notification: PwaNotificationOptions,
  ): Promise<boolean> => {
    try {
      const response = await $pb.send('/api/notifications/push', {
        method: 'POST',
        body: {
          recipientIds,
          notification,
        },
      })

      return response.success
    }
    catch (err: any) {
      error.value = err.message || 'خطا در ارسال اعلان فوری'
      return false
    }
  }

  // Get VAPID public key from backend
  const getVapidPublicKey = async (): string => {
    try {
      const response = await $pb.send('/api/notifications/vapid-key', {
        method: 'GET',
      })

      return response.publicKey || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f'
    }
    catch (err) {
      // Fallback key for development
      return 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9fPNNw6V2SCQvJbLexhqNUe3Z9B3PbQNABJBp4QFG4xZA2EKKhHM'
    }
  }

  // Save subscription to backend
  const saveSubscriptionToBackend = async (subscription: PushSubscription) => {
    try {
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      }

      await $pb.send('/api/notifications/subscribe', {
        method: 'POST',
        body: {
          subscription: subscriptionData,
          userId: $pb.authStore.model?.id,
        },
      })
    }
    catch (err) {
      console.error('Error saving subscription to backend:', err)
    }
  }

  // Remove subscription from backend
  const removeSubscriptionFromBackend = async () => {
    try {
      await $pb.send('/api/notifications/unsubscribe', {
        method: 'POST',
        body: {
          userId: $pb.authStore.model?.id,
        },
      })
    }
    catch (err) {
      console.error('Error removing subscription from backend:', err)
    }
  }

  // Listen for service worker messages
  const setupServiceWorkerListener = () => {
    if (process.client && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, notificationId } = event.data

        if (type === 'NOTIFICATION_CLICKED' && notificationId) {
          // Mark notification as read when clicked from PWA notification
          const { markAsRead } = useNotifications()
          markAsRead(notificationId)
        }
      })
    }
  }

  // Utility functions
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  // Test notification
  const testNotification = async () => {
    const success = await showLocalNotification({
      title: 'تست اعلان PWA',
      message: 'این یک اعلان تستی است. اعلان‌های PWA فعال است! 🎉',
      type: 'success',
      priority: 'medium',
      url: '/notifications',
    })

    if (!success) {
      error.value = 'خطا در نمایش اعلان تستی'
    }

    return success
  }

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    if (!isSupported.value) return

    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()

      if (existingSubscription) {
        subscription.value = existingSubscription
        isSubscribed.value = true
      }
    }
    catch (err) {
      console.error('Error checking subscription status:', err)
    }
  }

  // Auto-request permission on user interaction
  const autoRequestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      
      return false
    }

    // Reset tracking if permission was previously denied
    if (permission.value === 'denied') {
      resetPermissionTracking()
    }

    // Skip if already granted
    if (permission.value === 'granted') {
      
      await subscribeToPush()
      return true
    }

    // Check local storage for previous decision
    const userDecision = localStorage.getItem('pwa-notification-decision')

    // If user previously denied, don't ask again unless they reset
    if (userDecision === 'denied' && permission.value === 'default') {
      
      return false
    }

    // Request permission immediately without delay
    try {
      
      const result = await Notification.requestPermission()
      permission.value = result

      // Store user decision
      localStorage.setItem('pwa-notification-decision', result)
      localStorage.setItem('pwa-permission-timestamp', Date.now().toString())

      if (result === 'granted') {
        
        await subscribeToPush()
        return true
      }
      else {
        
        return false
      }
    }
    catch (err: any) {
      
      error.value = err.message || 'خطا در درخواست مجوز اعلان‌ها'
      return false
    }
  }

  // Reset permission tracking (for testing or after logout)
  const resetPermissionTracking = () => {
    localStorage.removeItem('pwa-permission-asked')
    localStorage.removeItem('pwa-permission-last-ask')
    sessionStorage.removeItem('pwa-prompt-dismissed')
  }

  // Initialize on client
  if (process.client) {
    checkSupport()
  }

  // Initialize
  onMounted(() => {
    setupServiceWorkerListener()
    checkSubscriptionStatus()
  })

  return {
    // State
    isSupported: readonly(isSupported),
    permission: readonly(permission),
    isSubscribed: readonly(isSubscribed),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showLocalNotification,
    sendPushNotification,
    testNotification,
    checkSubscriptionStatus,
    autoRequestPermission,
    resetPermissionTracking,

    // Utilities
    checkSupport,
  }
}
