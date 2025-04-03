<template>
  <div
    class="bg-muted-100 dark:bg-muted-900 text-muted-500 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-800 fixed bottom-2 left-2 z-50 rounded-md px-2 py-1 text-xs shadow-sm transition-colors"
    @click="navigateToChangelog"
  >
    v{{ version }}
  </div>
</template>

<script setup lang="ts">
const version = '1.2.0' // This matches the version in package.json

const navigateToChangelog = () => {
  navigateTo('/changelog')
}
</script>
