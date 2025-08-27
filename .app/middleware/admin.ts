import { useAuth } from '~/composables/hammasir/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, userRole } = useAuth()

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    // return navigateTo('/hammasir/auth/login')
    return navigateTo('/hammasir/dashboard')
  }

  // Check if user has admin role
  if (userRole.value !== 'ADMIN') {
    return navigateTo('/hammasir/dashboard')
  }
})
