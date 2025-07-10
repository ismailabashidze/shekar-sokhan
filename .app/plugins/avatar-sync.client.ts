export default defineNuxtPlugin(() => {
  // فقط در کلاینت اجرا شود
  if (process.server) return

  const { $pb } = useNuxtApp()
  const { syncUserAvatar } = useAvatarManager()

  // Function to sync avatars for users without local avatar
  const syncAvatarsInBackground = async () => {
    try {
      // Get current user
      const currentUser = $pb.authStore.model
      if (!currentUser) return

      // If current user doesn't have avatar but has avatarUrl in meta, sync it
      if (!currentUser.avatar && currentUser.meta?.avatarUrl) {
        console.log('🔄 Syncing current user avatar in background...')
        await syncUserAvatar(currentUser.id)
      }
    }
    catch (error) {
      console.warn('Background avatar sync failed:', error)
    }
  }

  // Sync avatars after page load
  onMounted(() => {
    // Wait a bit to ensure everything is loaded
    setTimeout(() => {
      syncAvatarsInBackground()
    }, 3000) // 3 seconds delay
  })
})
