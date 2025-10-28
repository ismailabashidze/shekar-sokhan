<template>
  <div class="bg-muted-50 dark:bg-muted-950 min-h-screen p-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 text-center">
        <h1 class="text-muted-800 dark:text-muted-100 mb-4 text-3xl font-bold">
          سیستم نظارت
        </h1>
        <p class="text-muted-600 dark:text-muted-400">
          نظارت و مدیریت سلامت سیستم اعلان‌ها
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <NuxtLink
          to="/monitoring/overview"
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <div class="flex items-center gap-4">
            <div
              class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg"
            >
              <Icon name="lucide:activity" class="text-primary-600 size-6" />
            </div>
            <div>
              <h3 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                نمای کلی
              </h3>
              <p class="text-muted-600 dark:text-muted-400 text-sm">
                وضعیت کلی سیستم
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/monitoring/logs"
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <div class="flex items-center gap-4">
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="lucide:file-text" class="size-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                گزارش‌ها
              </h3>
              <p class="text-muted-600 dark:text-muted-400 text-sm">
                گزارش‌های سیستم
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/monitoring/alerting"
          class="dark:bg-muted-900 border-muted-200 dark:border-muted-800 rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <div class="flex items-center gap-4">
            <div class="flex size-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
              <Icon name="lucide:alert-triangle" class="size-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                هشدارها
              </h3>
              <p class="text-muted-600 dark:text-muted-400 text-sm">
                مدیریت هشدارها
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'سیستم نظارت',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>
