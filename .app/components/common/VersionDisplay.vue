<template>
  <div
    class="bg-muted-100 dark:bg-muted-900 text-muted-500 dark:text-muted-400 hover:bg-muted-200 dark:hover:bg-muted-700 fixed bottom-1 right-[7px] z-50 cursor-pointer rounded-md px-2 py-1 text-xs shadow-sm transition-colors sm:bottom-2 sm:right-[95px]"
    @click="navigateToChangelog"
  >
    v{{ version }}
  </div>
</template>

<script setup lang="ts">
const version = '1.7.0' // This matches the version in package.json

const navigateToChangelog = () => {
  navigateTo('/changelog')
}
</script>
