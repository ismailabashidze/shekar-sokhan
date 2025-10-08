export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useUser()

  // If user is authenticated (by checking if user object has an id), redirect to dashboard
  if (user.value.id) {
    return navigateTo('/dashboard')
  }

  // Continue with the route
  return true
})
