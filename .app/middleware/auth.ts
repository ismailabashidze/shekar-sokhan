export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useUser()

  // If user is not authenticated (by checking if user object has an id), redirect to login
  if (!user.value.id) {
    return navigateTo('/auth/login')
  }

  // Continue with the route
  return true
})
