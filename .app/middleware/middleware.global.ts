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
})
