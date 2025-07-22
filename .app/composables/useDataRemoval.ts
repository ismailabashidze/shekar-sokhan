export const useDataRemoval = () => {
  const { $pb } = useNuxtApp()
  const { user, role } = useUser()
  const { clearAllCaches } = usePwaCache()
  const { deleteAllMessages } = useMessage()

  const removeAllUserData = async (): Promise<void> => {
    try {
      const userId = user.value?.id
      if (!userId) {
        throw new Error('No user found')
      }

      // 1. Clear PocketBase collections
      await Promise.all([
        // Delete all user sessions
        $pb.collection('sessions').delete(`user="${userId}"`).catch(() => {}),
        
        // Delete all user messages  
        deleteAllMessages(userId),
        
        // Delete all user reports
        $pb.collection('final_reports').getFullList({ filter: `user="${userId}"` })
          .then(reports => Promise.all(
            reports.map(report => $pb.collection('final_reports').delete(report.id))
          )).catch(() => {}),
        
        // Delete all user notifications
        $pb.collection('notifications').getFullList({ filter: `user="${userId}"` })
          .then(notifications => Promise.all(
            notifications.map(notification => $pb.collection('notifications').delete(notification.id))
          )).catch(() => {}),
        
        // Delete all session analyses
        $pb.collection('session_analysis_for_system').getFullList({ filter: `user="${userId}"` })
          .then(analyses => Promise.all(
            analyses.map(analysis => $pb.collection('session_analysis_for_system').delete(analysis.id))
          )).catch(() => {}),

        // Delete summarized messages
        $pb.collection('summerizedMessages').getFullList({ filter: `user="${userId}"` })
          .then(summaries => Promise.all(
            summaries.map(summary => $pb.collection('summerizedMessages').delete(summary.id))
          )).catch(() => {})
      ])

      // 2. Clear localStorage data
      if (import.meta.client) {
        const keysToRemove = [
          'user',
          'role', 
          'tour_completed',
          'voice',
          'postPreview',
          'chatExpanded',
          'theme',
          'fontSize',
          'pwa-prompt-dismissed',
          'pwa-install-prompted',
          'notification-permission-requested'
        ]

        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
        })

        // Clear all localStorage keys that might contain user data
        Object.keys(localStorage).forEach(key => {
          if (key.includes('user') || key.includes('session') || key.includes('message')) {
            localStorage.removeItem(key)
          }
        })
      }

      // 3. Clear PWA caches
      await clearAllCaches()

      // 4. Clear cookies
      const authCookie = useCookie('pb_auth')
      authCookie.value = null

      // Clear any other cookies that might contain user data
      if (import.meta.client) {
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        })
      }

      // 5. Clear reactive user state
      user.value = null
      role.value = null

      // 6. Disconnect from PocketBase realtime
      $pb.realtime.unsubscribe()

      // 7. Clear service worker registrations and notifications
      if (import.meta.client && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map(reg => reg.unregister()))
        
        // Clear notification permissions (user will need to re-grant)
        if ('Notification' in window) {
          // Note: Can't programmatically revoke notification permission
          // User would need to manually revoke in browser settings
        }
      }

    } catch (error) {
      console.error('Error removing user data:', error)
      throw error
    }
  }

  const confirmAndRemoveData = async (): Promise<boolean> => {
    if (!import.meta.client) return false

    const confirmed = window.confirm(
      'This will permanently delete ALL your data including:\n\n' +
      '• All therapy and educational sessions\n' + 
      '• All chat messages and conversations\n' +
      '• All reports and analyses\n' +
      '• All notifications and settings\n' +
      '• Your account preferences\n\n' +
      'This action CANNOT be undone. Are you absolutely sure?'
    )

    if (!confirmed) return false

    const doubleConfirmed = window.confirm(
      'Last chance!\n\nThis will PERMANENTLY DELETE everything. Type "DELETE" to confirm:'
    )

    if (!doubleConfirmed) return false

    const finalConfirm = window.prompt(
      'Type "DELETE MY DATA" to confirm permanent deletion:'
    )

    if (finalConfirm !== 'DELETE MY DATA') {
      alert('Confirmation text did not match. Data removal cancelled.')
      return false
    }

    try {
      await removeAllUserData()
      
      alert('All your data has been permanently deleted. You will now be redirected to the home page.')
      
      // Redirect to home page and reload
      await navigateTo('/')
      if (import.meta.client) {
        window.location.reload()
      }
      
      return true
    } catch (error) {
      alert(`Error removing data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  return {
    removeAllUserData,
    confirmAndRemoveData
  }
}