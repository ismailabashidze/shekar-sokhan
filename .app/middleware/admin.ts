export default defineNuxtRouteMiddleware((to, from) => {
  const { $pb } = useNuxtApp()

  // Check if user is authenticated
  if (!$pb.authStore.isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'برای دسترسی به این صفحه باید وارد شوید',
    })
  }

  // Check if user has admin role (optional - uncomment if you want to check role)
  // const userRole = $pb.authStore.model?.role
  // if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'شما مجوز دسترسی به این صفحه را ندارید'
  //   })
  // }
})
