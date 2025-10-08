// middleware/passkey-lock.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Check if we're in a client-side environment
  if (process.client) {
    // Don't redirect if we're already on the lock screen or login page
    if (to.path === '/lock-screen' || to.path.startsWith('/auth/')) {
      return
    }

    // Check if a passkey is set
    const passkey = localStorage.getItem('passkey')
    
    if (passkey) {
      // Check if user is authenticated with passkey
      const isAuthenticated = localStorage.getItem('passkeyAuthenticated')
      
      // If passkey is set but user is not authenticated, redirect to lock screen
      if (!isAuthenticated || isAuthenticated !== 'true') {
        // Don't redirect if it's a manual lock
        if (localStorage.getItem('manualLock') !== 'true') {
          return navigateTo('/lock-screen')
        } else {
          // Clear the manual lock flag
          localStorage.removeItem('manualLock')
        }
      }
    }
  }
})