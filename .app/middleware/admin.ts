export default defineNuxtRouteMiddleware(async (to, from) => {
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
