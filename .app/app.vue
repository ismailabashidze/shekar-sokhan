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
