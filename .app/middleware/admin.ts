export default defineNuxtRouteMiddleware(async (to, from) => {
  debugger
  console.log('🔍 ADMIN MIDDLEWARE - Navigating to:', to.path)
  console.log('🔍 ADMIN MIDDLEWARE - process.dev:', process.dev)

  // TEMPORARY: Disable admin middleware for testing monitoring system
  if (process.dev) {
    console.log('✅ ADMIN MIDDLEWARE - BYPASSED (development mode)')
    return
  }

  const { user, role } = useUser()

  // Check if user is authenticated (by checking if user object has an id)
  if (!user.value.id) {
    return navigateTo('/dashboard')
  }

  // Check if user has admin role
  if (role.value !== 'ADMIN') {
    return navigateTo('/dashboard')
  }
})
