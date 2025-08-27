import { useAuth } from '~/composables/hammasir/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // If user is not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/hammasir/auth/login')
  }

  // Continue with the route
  return true
})
