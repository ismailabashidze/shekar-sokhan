export function usePwaCache() {
  const isClearing = ref(false)
  const isRefreshing = ref(false)

  // Helper: Clear all caches
  const clearAllCaches = async (): Promise<boolean> => {
    try {
      isClearing.value = true

      if (!('serviceWorker' in navigator)) {
        console.warn('[PWA] Service Worker not supported')
        return false
      }

      // Clear browser caches
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))

      // Also clear service worker caches via message
      const registration = await navigator.serviceWorker.ready
      if (registration.active) {
        const messageChannel = new MessageChannel()

        const success = await new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => resolve(false), 5000) // 5 second timeout

          messageChannel.port1.onmessage = (event) => {
            clearTimeout(timeout)
            resolve(event.data.success || false)
          }

          registration.active!.postMessage(
            { type: 'CLEAR_ALL_CACHES' },
            [messageChannel.port2],
          )
        })

        if (success) {
          console.log('[PWA] All caches cleared successfully')
        }
        else {
          console.warn('[PWA] Service worker cache clear may have failed')
        }
      }

      return true
    }
    catch (error) {
      console.error('[PWA] Failed to clear caches:', error)
      return false
    }
    finally {
      isClearing.value = false
    }
  }

  // Helper: Force refresh without cache
  const forceRefresh = async (): Promise<void> => {
    try {
      isRefreshing.value = true

      // Clear all caches first
      await clearAllCaches()

      // Unregister service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map(reg => reg.unregister()))
        console.log('[PWA] Service workers unregistered')
      }

      // Force reload the page without cache
      window.location.reload()
    }
    catch (error) {
      console.error('[PWA] Failed to force refresh:', error)
      // Fallback to simple reload
      window.location.reload()
    }
  }

  // Helper: Check cache status
  const getCacheStatus = async () => {
    try {
      if (!('caches' in window)) return null

      const cacheNames = await caches.keys()
      const cacheStats = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name)
          const keys = await cache.keys()
          return {
            name,
            size: keys.length,
          }
        }),
      )

      return {
        totalCaches: cacheNames.length,
        caches: cacheStats,
        totalItems: cacheStats.reduce((sum, cache) => sum + cache.size, 0),
      }
    }
    catch (error) {
      console.error('[PWA] Failed to get cache status:', error)
      return null
    }
  }

  return {
    isClearing: readonly(isClearing),
    isRefreshing: readonly(isRefreshing),
    clearAllCaches,
    forceRefresh,
    getCacheStatus,
  }
}
