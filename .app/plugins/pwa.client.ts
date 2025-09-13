export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      // Check if service worker is already active
      if (registration.active) {
      }

      // Update service worker if needed
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {

              if (navigator.serviceWorker.controller) {
              }
              else {
              }
            }
          })
        }
      })

      // Listen for service worker errors
      registration.addEventListener('error', (error) => {
        console.error('[PWA] Service worker error:', error)
      })

      // Check for waiting service worker
      if (registration.waiting) {
      }
    }
    catch (error) {
      console.error('[PWA] Service worker registration failed:', error)
      // More detailed error info
      if (error instanceof Error) {
        console.error('[PWA] Error message:', error.message)
        console.error('[PWA] Error stack:', error.stack)
      }
    }
  }
  else {
    console.warn('[PWA] Service worker not supported in this browser')
  }

  // Global PWA install prompt management
  if (process.client) {
    // Create global state for deferred prompt
    const globalDeferredPrompt = ref(null)

    // Listen for beforeinstallprompt event globally
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      globalDeferredPrompt.value = e

      // Store in global state that components can access
      if (window) {
        window._pwaInstallPrompt = e
      }
    })

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      globalDeferredPrompt.value = null
      if (window) {
        window._pwaInstallPrompt = null
      }
    })

    // Make the prompt available globally
    return {
      provide: {
        pwaInstallPrompt: globalDeferredPrompt,
      },
    }
  }
})
