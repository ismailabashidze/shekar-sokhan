export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  const toaster = useToaster()
  addRouteMiddleware((to, from) => {
    if (!nuxtApp.$pb.authStore.isValid && to.path !== '/auth/login') {
      toaster.clearAll()
      toaster.show({
        title: 'احراز هویت',
        message: `لطفا دوباره وارد شوید`,
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      })
      return navigateTo('/auth/login', { redirectCode: 401 })
    }
  })
})
