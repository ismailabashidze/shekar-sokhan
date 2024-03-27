export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  addRouteMiddleware(async (to, from) => {
    // List of paths where navigation is allowed without authentication
    const allowedPaths = ['/auth/login', '/auth/terms', '/auth/privacy']

    // Check if the user is authenticated or if the target path is one of the allowed paths
    if (!nuxtApp.$pb.authStore.isValid && !allowedPaths.includes(to.path)) {
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
})
