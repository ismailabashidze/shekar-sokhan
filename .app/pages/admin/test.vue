<script setup lang="ts">
definePageMeta({
  title: 'تست ادمین',
  layout: 'sidebar',
})

useHead({
  title: 'تست - پنل ادمین',
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-muted-900 dark:text-white mb-4">
      تست پنل ادمین
    </h1>
    <p class="text-muted-600 dark:text-muted-300">
      اگر این صفحه را می‌بینید، routing کار می‌کند!
    </p>
    
    <div class="mt-6">
      <NuxtLink 
        to="/admin/notifications"
        class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        رفتن به صفحه مدیریت اعلان‌ها
      </NuxtLink>
    </div>
  </div>
</template> 