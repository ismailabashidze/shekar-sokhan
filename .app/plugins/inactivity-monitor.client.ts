export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const {
      isAppLocked,
      hasPin,
      autoLockTimer,
      resetInactivityTimer,
      startInactivityMonitor,
      stopInactivityMonitor,
    } = useLockSystem()

    // Activity events to monitor
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ]

    // Throttle activity handler (max once per second to avoid performance issues)
    let lastResetTime = 0
    const THROTTLE_MS = 1000

    const handleActivity = () => {
      const now = Date.now()
      if (now - lastResetTime < THROTTLE_MS) return

      // Only track if conditions are met
      if (
        autoLockTimer.value
        && !isAppLocked.value
        && hasPin.value
      ) {
        resetInactivityTimer()
        lastResetTime = now
      }
    }

    // Watch for auto-lock timer changes
    watch([autoLockTimer, isAppLocked, hasPin], ([timer, locked, pin]) => {
      if (timer && !locked && pin) {
        // Start monitoring
        startInactivityMonitor()
      }
      else {
        // Stop monitoring
        stopInactivityMonitor()
      }
    }, { immediate: true })

    // Add event listeners with passive option for performance
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Cleanup on unmount
    nuxtApp.hook('app:unmounted', () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      stopInactivityMonitor()
    })
  }
})
