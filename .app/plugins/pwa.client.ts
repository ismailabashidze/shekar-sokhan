export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      // Update service worker if needed
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              // Content has been cached for offline use
            }
          })
        }
      })
    }
    catch (error) {
      // Service worker registration failed silently
    }
  }
})
