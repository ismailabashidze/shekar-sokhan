<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          پنل مدیریت
        </h1>
        <p class="text-gray-600">
          خوش آمدید به پنل مدیریت سامانه
        </p>
      </div>
    </div>

    <!-- Admin Stats -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-red-100 p-3">
            <Icon name="ph:users" class="size-6 text-red-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              کاربران کل
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              1,234
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-blue-100 p-3">
            <Icon name="ph:bell" class="size-6 text-blue-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              اعلان ارسال شده
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              847
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-green-100 p-3">
            <Icon name="ph:megaphone" class="size-6 text-green-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              کمپین فعال
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              12
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="flex items-center">
          <div class="shrink-0 rounded-lg bg-yellow-100 p-3">
            <Icon name="ph:chat-circle" class="size-6 text-yellow-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600">
              بازخوردها
            </p>
            <p class="text-2xl font-semibold text-gray-900">
              234
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
            to="/admin/users"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:users" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                مدیریت کاربران
              </div>
              <div class="text-sm text-gray-500">
                مشاهده و ویرایش کاربران
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/notifications"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:bell" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                ارسال اعلان
              </div>
              <div class="text-sm text-gray-500">
                ارسال اعلان به کاربران
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/campaigns"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:megaphone" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                کمپین‌ها
              </div>
              <div class="text-sm text-gray-500">
                مدیریت کمپین‌ها
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/monitoring"
            class="flex items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <Icon name="ph:monitor" class="ml-3 size-8 text-gray-600" />
            <div>
              <div class="font-medium text-gray-900">
                مانیتورینگ
              </div>
              <div class="text-sm text-gray-500">
                نظارت بر سیستم
              </div>
            </div>
          </NuxtLink>
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
