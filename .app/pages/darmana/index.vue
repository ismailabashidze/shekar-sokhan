<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          داشبورد درمانا
        </h1>
        <p class="text-gray-600">
          مرکز مدیریت درمان و بهداشت روان
        </p>
      </div>
      <div class="flex space-x-3 space-x-reverse">
        <button class="btn btn-primary">
          <Icon name="ph:plus" class="ml-2 size-4" />
          نوبت جدید
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-green-100 p-3">
            <Icon name="ph:users" class="size-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              بیماران فعال
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              284
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-blue-100 p-3">
            <Icon name="ph:user-gear" class="size-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              درمانگران
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              18
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-purple-100 p-3">
            <Icon name="ph:calendar" class="size-6 text-purple-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              جلسات امروز
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              15
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-yellow-100 p-3">
            <Icon name="ph:clock" class="size-6 text-yellow-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              نوبت‌های امروز
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              42
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="rounded-lg bg-white shadow">
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900">
          عملیات سریع
        </h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            to="/darmana/patients"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:users" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                بیماران
              </div>
              <div class="text-sm text-gray-500">
                مدیریت بیماران
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/darmana/therapists"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:user-gear" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                درمانگران
              </div>
              <div class="text-sm text-gray-500">
                مدیریت درمانگران
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/darmana/sessions"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:calendar" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                جلسات
              </div>
              <div class="text-sm text-gray-500">
                برنامه جلسات
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/darmana/discount"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:tag" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                تخفیف‌ها
              </div>
              <div class="text-sm text-gray-500">
                مدیریت تخفیف‌ها
              </div>
            </div>
          </NuxtLink>
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
                جلسه درمانی با سارا محمدی با موفقیت انجام شد
              </p>
              <p class="text-xs text-gray-500">
                ۱ ساعت پیش
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
                بیمار جدید: رضا اکبری اضافه شد
              </p>
              <p class="text-xs text-gray-500">
                ۳ ساعت پیش
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
                یادآوری جلسه فردا با احمد حسینی
              </p>
              <p class="text-xs text-gray-500">
                ۴ ساعت پیش
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'zone',
    // Using global middlewares only
  });
</script>
