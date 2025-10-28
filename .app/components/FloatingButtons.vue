<template>
  <div v-if="!isAuthPage" class="fixed bottom-6 left-6 z-50 flex flex-col gap-3 xl:flex-row xl:gap-4">
    <BackButton />
    <TourButton />
    <LockButton />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Check if current route is an auth page
const isAuthPage = computed(() => {
  return route.path.startsWith('/auth');
});

// This component wraps both the back button and tour button
// Positioned at bottom left for desktop sizes
</script>
