// Plugin to setup global notification auth management
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (!process.client) return

  // Setup auth management without delay in development
  if (process.env.NODE_ENV === 'development') {
    try {
      // Get the notifications instance and setup auth management
      const { setupAuthManagement } = useNotifications()
      
      // Setup auth state management at app level (without delay in dev)
      setupAuthManagement()
    }
    catch (error) {
      console.error('Failed to setup notifications auth management:', error)
    }
  } else {
    // In production, use a small delay to ensure everything is ready
    setTimeout(async () => {
      try {
        // Get the notifications instance and setup auth management
        const { setupAuthManagement } = useNotifications()

        // Setup auth state management at app level
        await setupAuthManagement()
      }
      catch (error) {
        console.error('Failed to setup notifications auth management:', error)
      }
    }, 100)
  }
})
