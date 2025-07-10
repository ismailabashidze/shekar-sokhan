<script setup lang="ts">
const {
  isClearing,
  isRefreshing,
  clearAllCaches,
  forceRefresh,
  getCacheStatus,
} = usePwaCache()

const cacheStatus = ref(null)

const handleClearCache = async () => {
  const success = await clearAllCaches()
  if (success) {
    // Refresh cache status
    cacheStatus.value = await getCacheStatus()
  }
}

const handleForceRefresh = async () => {
  await forceRefresh()
}

// Load cache status on mount
onMounted(async () => {
  cacheStatus.value = await getCacheStatus()
})
</script>

<template>
  <div class="dark:bg-muted-800 rounded-lg bg-white p-6 shadow-lg">
    <h3 class="text-muted-900 mb-4 text-lg font-semibold dark:text-white">
      مدیریت Cache PWA
    </h3>

    <div class="space-y-4">
      <!-- Cache Status -->
      <div v-if="cacheStatus" class="text-muted-600 dark:text-muted-400 text-sm">
        <p>تعداد Cache ها: {{ cacheStatus.totalCaches }}</p>
        <p>کل آیتم ها: {{ cacheStatus.totalItems }}</p>
      </div>

      <!-- Clear Cache Button -->
      <BaseButton
        :loading="isClearing"
        :disabled="isRefreshing"
        variant="outline"
        color="warning"
        size="sm"
        class="w-full"
        @click="handleClearCache"
      >
        <Icon name="ph:trash" class="mr-2 size-4" />
        پاک کردن Cache ها
      </BaseButton>

      <!-- Force Refresh Button -->
      <BaseButton
        :loading="isRefreshing"
        :disabled="isClearing"
        variant="solid"
        color="danger"
        size="sm"
        class="w-full"
        @click="handleForceRefresh"
      >
        <Icon name="ph:arrow-clockwise" class="mr-2 size-4" />
        بازنشانی کامل (Force Refresh)
      </BaseButton>

      <!-- Warning Text -->
      <p class="text-muted-500 dark:text-muted-400 text-xs">
        ⚠️ بازنشانی کامل تمام cache ها را پاک می‌کند و صفحه reload می‌شود
      </p>
    </div>
  </div>
</template>
