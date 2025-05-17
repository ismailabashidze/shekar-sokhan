export default defineNuxtRouteMiddleware((to) => {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()

  // List of paths where navigation is allowed without authentication
  const allowedPaths = [
    '/auth/login',
    '/auth/login-psychotherapist',
    '/auth/terms',
    '/auth/privacy',
    '/bug-report',
    '/bug-reports',
  ]

  // Also allow paths that start with /bug-reports/ (for detail pages)
  const isAllowedPath = allowedPaths.includes(to.path) || to.path.startsWith('/bug-reports/')

  // Check if the user is authenticated or if the target path is one of the allowed paths
  if (!nuxtApp.$pb.authStore.isValid && !isAllowedPath) {
    toaster.clearAll()
    toaster.show({
      title: 'احراز هویت', // Authentication
      message: `لطفا دوباره وارد شوید`, // Please log in again
      color: 'warning',
      icon: 'ph:warning',
      closable: true,
    })
    // Redirect to login page with a 401 redirect code
    return navigateTo('/auth/login', { redirectCode: 401 })
  }

  // Additional check: PocketBase auth is present, but user in localStorage is '{}' and role is empty
  try {
    const localUserStr = localStorage.getItem('user')
    const localRole = localStorage.getItem('role')
    const isUserObjectEmpty = localUserStr && localUserStr.trim() === '{}' // user is '{}'
    const isRoleEmpty = !localRole || localRole.trim() === ''
    if (nuxtApp.$pb.authStore.isValid && (isUserObjectEmpty || isRoleEmpty)) {
      // Try to get user info from PocketBase
      const pbUser = nuxtApp.$pb.authStore.model
      if (pbUser && typeof pbUser === 'object' && Object.keys(pbUser).length > 0) {
        localStorage.setItem('user', JSON.stringify(pbUser))
        // Use 'role' or 'userType' depending on your schema
        const pbRole = pbUser.role || pbUser.userType || ''
        localStorage.setItem('role', pbRole)
      } else {
        // If no user info, clear user and role
        localStorage.setItem('user', '{}')
        localStorage.setItem('role', '')
      }
    }
  } catch (e) {
    // Failsafe: do nothing if localStorage is not accessible
    // Optionally log error
    // console.error('Failed user/role localStorage sync', e)
  }
})
