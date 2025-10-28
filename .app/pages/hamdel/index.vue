<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          داشبورد هم‌دل
        </h1>
        <p class="text-gray-600">
          خوش آمدید به بخش هم‌دل
        </p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <button class="btn btn-primary">
          <Icon name="ph:plus" class="ml-2 size-4" />
          بیمار جدید
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-pink-100 p-3">
            <Icon name="ph:users" class="size-6 text-pink-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              بیماران کل
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              156
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-green-100 p-3">
            <Icon name="ph:calendar-check" class="size-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              جلسات امروز
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              8
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-blue-100 p-3">
            <Icon name="ph:clock" class="size-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              جلسات منتظر
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              23
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-yellow-100 p-3">
            <Icon name="ph:chart-line" class="size-6 text-yellow-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              رضایت
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              94%
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="rounded-lg bg-white shadow">
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900">
          آخرین فعالیت‌ها
        </h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="shrink-0">
              <div class="flex size-8 items-center justify-center rounded-full bg-green-100">
                <Icon name="ph:check" class="size-4 text-green-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">
                جلسه درمانی با علی رضایی با موفقیت انجام شد
              </p>
              <p class="text-xs text-gray-500">
                ۲ ساعت پیش
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="shrink-0">
              <div class="flex size-8 items-center justify-center rounded-full bg-blue-100">
                <Icon name="ph:plus" class="size-4 text-blue-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">
                بیمار جدید: مریم احمدی اضافه شد
              </p>
              <p class="text-xs text-gray-500">
                ۴ ساعت پیش
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="shrink-0">
              <div class="flex size-8 items-center justify-center rounded-full bg-yellow-100">
                <Icon name="ph:warning" class="size-4 text-yellow-600" />
              </div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">
                یادآوری جلسه فردا با سعید محمدی
              </p>
              <p class="text-xs text-gray-500">
                ۵ ساعت پیش
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  layout: 'zone',
  // Using global middlewares only
})
</script>
