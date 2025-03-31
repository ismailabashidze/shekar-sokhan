<template>
  <div 
    class="fixed bottom-2 right-2 text-xs bg-muted-100 dark:bg-muted-900 text-muted-500 dark:text-muted-400 px-2 py-1 rounded-md shadow-sm z-50 hover:bg-muted-200 dark:hover:bg-muted-800 transition-colors"
    @click="navigateToChangelog"
  >
    v{{ version }}
  </div>
</template>

<script setup lang="ts">
const version = '1.1.0' // This matches the version in package.json

const navigateToChangelog = () => {
  navigateTo('/changelog')
}
</script>
