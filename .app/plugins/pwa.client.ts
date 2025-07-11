export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    try {
      console.log('[PWA] Registering service worker...')
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      console.log('[PWA] Service worker registered successfully:', registration.scope)

      // Check if service worker is already active
      if (registration.active) {
        console.log('[PWA] Service worker is active')
      }

      // Update service worker if needed
      registration.addEventListener('updatefound', () => {
        console.log('[PWA] Service worker update found')
        const newWorker = registration.installing

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[PWA] Service worker state changed:', newWorker.state)
            if (newWorker.state === 'installed') {
              console.log('[PWA] Content has been cached for offline use')
              
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New content is available; please refresh')
              } else {
                console.log('[PWA] Content is cached for offline use')
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
        console.log('[PWA] Service worker is waiting for activation')
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
  } else {
    console.warn('[PWA] Service worker not supported in this browser')
  }

  // Global PWA install prompt management
  if (process.client) {
    // Create global state for deferred prompt
    const globalDeferredPrompt = ref(null)
    
    // Listen for beforeinstallprompt event globally
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] beforeinstallprompt event captured globally')
      e.preventDefault()
      globalDeferredPrompt.value = e
      
      // Store in global state that components can access
      if (window) {
        window._pwaInstallPrompt = e
      }
    })

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed - clearing global prompt')
      globalDeferredPrompt.value = null
      if (window) {
        window._pwaInstallPrompt = null
      }
    })

    // Make the prompt available globally
    return {
      provide: {
        pwaInstallPrompt: globalDeferredPrompt
      }
    }
  }
})
