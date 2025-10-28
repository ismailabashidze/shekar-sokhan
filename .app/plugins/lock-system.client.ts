export default defineNuxtPlugin((nuxtApp) => {
  // Initialize lock system on app start
  if (process.client) {
    const {
      isAppLocked,
      syncPinFromServer,
      autoLockTimer,
      startInactivityMonitor,
      hasPin,
      currentUserId,
    } = useLockSystem()
    const router = useRouter()
    const route = useRoute()
    const authStore = nuxtApp.$pb?.authStore

    const shouldRedirectToLock = () => {
      return !route.path.startsWith('/auth')
        && !route.path.startsWith('/settings/lock')
        && !route.path.startsWith('/settings/remove-lock')
        && route.path !== '/lock'
    }

    // Sync PIN from server after app is mounted
    nuxtApp.hook('app:mounted', async () => {
      // Sync PIN from server if user is authenticated
      if (currentUserId.value && authStore?.isValid) {
        try {
          await syncPinFromServer(currentUserId.value)

          // Start inactivity monitor if auto-lock timer is configured
          if (autoLockTimer.value && hasPin.value && !isAppLocked.value) {
            console.log('🔒 Starting inactivity monitor with timer:', autoLockTimer.value)
            startInactivityMonitor()
          }
        }
        catch (error) {
          console.warn('Failed to sync lock PIN on app start:', error)
        }
      }
    })

    // Watch for navigation and lock state changes
    nuxtApp.hook('page:start', () => {
      nextTick(() => {
        // Only check lock state if user is authenticated
        if (currentUserId.value
          && shouldRedirectToLock()
          && isAppLocked.value) {
          router.push('/lock')
        }
      })
    })

    // Also check lock state when user changes
    watch([currentUserId, isAppLocked], ([activeUserId, isLocked]) => {
      if (activeUserId
        && isLocked
        && shouldRedirectToLock()) {
        router.push('/lock')
      }
    })
  }
})
