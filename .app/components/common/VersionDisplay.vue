<template>
  <div
    class="bg-muted-100 dark:bg-muted-900 text-muted-500 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 fixed bottom-1 right-[7px] z-50 cursor-pointer rounded-md px-2 py-1 text-xs shadow-sm transition-colors sm:bottom-2 sm:right-[95px]"
    @click="navigateToChangelog"
  >
    v{{ version || 'loading...' }}
    <!-- Debug info (remove in production) -->
    <div v-if="!version" class="mt-1 text-xs text-red-500">
      Debug: version undefined
    </div>
  </div>
</template>

<script setup lang="ts">
// خواندن ورژن به صورت dynamic از package.json
const { version } = useAppVersion()

// Debug log
console.log('VersionDisplay: version =', version?.value)

const navigateToChangelog = () => {
  navigateTo('/changelog')
}
</script>
