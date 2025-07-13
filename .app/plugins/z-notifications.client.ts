// Plugin to setup global notification auth management
export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on client side
  if (!process.client) return

  console.log('Setting up notifications auth management...')
  console.log('Nuxt app context available:', !!nuxtApp)
  console.log('PocketBase available:', !!nuxtApp.$pb)

  // Wait a bit to ensure everything is ready
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // Get the notifications instance and setup auth management
    const { setupAuthManagement } = useNotifications()

    // Setup auth state management at app level
    await setupAuthManagement()
    console.log('Notifications auth management initialized successfully')
  }
  catch (error) {
    console.error('Failed to setup notifications auth management:', error)
  }
})
