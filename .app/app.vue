<script setup lang="ts">
// Check lock state on app initialization
const { isAppLocked } = useLockSystem()
const { user } = useUser()
const route = useRoute()
const router = useRouter()

// Strong lock enforcement at app level - runs continuously
watch([isAppLocked, user, () => route.path], ([locked, currentUser, currentPath]) => {
  // Only redirect if user is authenticated and app is locked
  if (currentUser && locked && !currentPath.startsWith('/auth') && currentPath !== '/lock') {
    console.log('🔒 [App.vue] Lock enforced - Redirecting to /lock from:', currentPath)
    router.replace('/lock')
  }
  
  // If not locked but on lock page, redirect to dashboard
  if (currentUser && !locked && currentPath === '/lock') {
    console.log('🔓 [App.vue] Not locked - Redirecting to /dashboard from /lock')
    router.replace('/dashboard')
  }
}, { immediate: true })

// Additional check on every route change
router.beforeEach((to, from) => {
  if (user.value && isAppLocked.value && to.path !== '/lock' && !to.path.startsWith('/auth')) {
    console.log('🔒 [Router Guard] Navigation blocked - App is locked')
    return '/lock'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <!-- PWA Components -->
    <PwaInstallPrompt />
    <PwaNotificationPrompt />
    <PwaDebugInfo />

    <!-- Version Display -->
    <CommonVersionDisplay />
    <!-- Floating Buttons -->
    <FloatingButtons />
  </NuxtLayout>
</template>
