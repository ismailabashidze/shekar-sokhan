// composables/passkeyInactivityTimer.ts
export const usePasskeyInactivityTimer = () => {
  let inactivityTimer: NodeJS.Timeout | null = null
  const { pathname } = useRoute()

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    if (!process.client) return
    
    // Clear existing timer if any
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    // Get the inactivity period from localStorage (default to 2 minutes)
    const inactivityPeriod = parseInt(localStorage.getItem('inactivityPeriod') || '2')
    
    // Don't start the timer if we're on the lock screen
    if (pathname === '/lock-screen') {
      return
    }

    // Set a new timer for the inactivity period
    inactivityTimer = setTimeout(() => {
      // Check if a passkey is set
      const passkey = localStorage.getItem('passkey')
      
      if (passkey) {
        // Check if user is already authenticated with passkey
        const isAuthenticated = localStorage.getItem('passkeyAuthenticated')
        
        // If not authenticated, redirect to lock screen
        if (!isAuthenticated || isAuthenticated !== 'true') {
          navigateTo('/lock-screen')
        }
      }
    }, inactivityPeriod * 60 * 1000) // Convert minutes to milliseconds
  }

  // Function to start the inactivity timer
  const startInactivityTimer = () => {
    if (!process.client) return
    
    // Reset the timer initially
    resetInactivityTimer()

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'wheel']
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer, { passive: true })
    })

    // Also reset the timer when the route changes
    const { $router } = useNuxtApp()
    $router.afterEach(() => {
      resetInactivityTimer()
    })
  }

  // Function to stop the inactivity timer
  const stopInactivityTimer = () => {
    if (!process.client) return
    
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }

    // Remove event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'wheel']
    
    events.forEach(event => {
      window.removeEventListener(event, resetInactivityTimer)
    })
  }

  return {
    startInactivityTimer,
    stopInactivityTimer,
    resetInactivityTimer
  }
}