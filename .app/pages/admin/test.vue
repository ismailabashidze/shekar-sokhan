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
    <h1 class="text-muted-900 mb-4 text-3xl font-bold dark:text-white">
      تست پنل ادمین
    </h1>
    <p class="text-muted-600 dark:text-muted-300">
      اگر این صفحه را می‌بینید، routing کار می‌کند!
    </p>

    <div class="mt-6">
      <NuxtLink
        to="/admin/notifications"
        class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white transition-colors"
      >
        رفتن به صفحه مدیریت اعلان‌ها
      </NuxtLink>
    </div>
  </div>
</template>
