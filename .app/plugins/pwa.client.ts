export default defineNuxtPlugin(async () => {
  if (process.client && 'serviceWorker' in navigator) {
    try {
      // Register PWA service worker
      const pwaRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Check if service worker is already active
      if (pwaRegistration.active) {
        // Service worker is active
      }

      // Update service worker if needed
      pwaRegistration.addEventListener('updatefound', () => {
        const newWorker = pwaRegistration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              // Content has been cached for offline use
              if (navigator.serviceWorker.controller) {
                // New content is available; please refresh
              }
              else {
                // Content is cached for offline use
              }
            }
          });
        }
      });

      // Listen for service worker errors
      pwaRegistration.addEventListener('error', (error) => {
        // Service worker error
      });

      // Check for waiting service worker
      if (pwaRegistration.waiting) {
        // Service worker is waiting for activation
      }
    }
    catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
      // More detailed error info
      if (error instanceof Error) {
        console.error('[PWA] Error message:', error.message);
        console.error('[PWA] Error stack:', error.stack);
      }
    }
  }
  else {
    // Service worker not supported in this browser
  }

  // Global PWA install prompt management
  if (process.client) {
    // Create global state for deferred prompt
    const globalDeferredPrompt = ref(null);

    // Listen for beforeinstallprompt event globally
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      globalDeferredPrompt.value = e;

      // Store in global state that components can access
      if (window) {
        window._pwaInstallPrompt = e;
      }
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      globalDeferredPrompt.value = null;
      if (window) {
        window._pwaInstallPrompt = null;
      }
    });

    // Make the prompt available globally
    return {
      provide: {
        pwaInstallPrompt: globalDeferredPrompt,
      },
    };
  }
});
