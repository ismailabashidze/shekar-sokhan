import { useAuth } from '~/composables/hammasir/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated.value) {
    return navigateTo('/hammasir/dashboard')
  }
  
  // Continue with the route
  return true
})