<script setup lang="ts">
const { startInactivityTimer, stopInactivityTimer } = usePasskeyInactivityTimer()

// Start the inactivity timer when the app mounts (only on client side)
onMounted(() => {
  if (process.client) {
    startInactivityTimer()
  }
})

// Stop the inactivity timer when the app unmounts (only on client side)
onUnmounted(() => {
  if (process.client) {
    stopInactivityTimer()
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
